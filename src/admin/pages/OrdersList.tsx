import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  Eye,
  Trash2,
  Clock,
  Truck,
  Check,
  X,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import Button from '../../components/ui/Button';
import {
  useOrdersStore,
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from '../../store/ordersStore';
import { usePageTitle } from '../../hooks/usePageTitle';
import { formatPrice, cn } from '../../lib/utils';

const STATUS_ORDER: OrderStatus[] = ['pending', 'shipped', 'delivered', 'cancelled'];

const STATUS_ICONS: Record<OrderStatus, typeof Clock> = {
  pending: Clock,
  shipped: Truck,
  delivered: Check,
  cancelled: X,
};

export default function OrdersList() {
  usePageTitle('مدیریت سفارش‌ها');

  const { orders, updateStatus, deleteOrder } = useOrdersStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = `${o.id} ${o.userName} ${o.userEmail} ${o.userPhone}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [orders, search, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    STATUS_ORDER.forEach((s) => {
      counts[s] = orders.filter((o) => o.status === s).length;
    });
    return counts;
  }, [orders]);

  const orderToDelete = orders.find((o) => o.id === confirmDelete);

  const handleDelete = () => {
    if (confirmDelete) {
      deleteOrder(confirmDelete);
      toast.success('سفارش حذف شد');
    }
  };

  const handleStatusChange = (id: string, status: OrderStatus) => {
    updateStatus(id, status);
    toast.success(`وضعیت به «${ORDER_STATUS_LABELS[status].label}» تغییر کرد`);
  };

  return (
    <div>
      <PageHeader
        title="سفارش‌ها"
        description={`${orders.length.toLocaleString('fa-IR')} سفارش در سیستم`}
      />

      {/* فیلتر وضعیت */}
      <div className="mb-4 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setStatusFilter('all')}
            className={cn(
              'px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap',
              statusFilter === 'all'
                ? 'bg-copper text-white'
                : 'bg-surface dark:bg-night-surface text-ink/70 dark:text-night-ink/70 border border-ink/5 dark:border-white/5 hover:bg-copper/10'
            )}
          >
            <Filter className="w-3.5 h-3.5" />
            همه ({statusCounts.all.toLocaleString('fa-IR')})
          </button>
          {STATUS_ORDER.map((s) => {
            const Icon = STATUS_ICONS[s];
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  'px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap',
                  statusFilter === s
                    ? 'bg-copper text-white'
                    : 'bg-surface dark:bg-night-surface text-ink/70 dark:text-night-ink/70 border border-ink/5 dark:border-white/5 hover:bg-copper/10'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {ORDER_STATUS_LABELS[s].label} ({statusCounts[s].toLocaleString('fa-IR')})
              </button>
            );
          })}
        </div>
      </div>

      {/* جستجو */}
      <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-3 mb-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40 dark:text-night-ink/40 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی شماره سفارش، نام یا ایمیل مشتری..."
            className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all"
          />
        </div>
      </div>

      {/* لیست */}
      {filtered.length === 0 ? (
        <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-12 text-center">
          <ShoppingBag className="w-12 h-12 text-copper/40 mx-auto mb-4" />
          <h3 className="font-display font-bold mb-2">
            {orders.length === 0 ? 'هنوز سفارشی ثبت نشده' : 'سفارشی پیدا نشد'}
          </h3>
          <p className="text-sm text-ink/60 dark:text-night-ink/60">
            {orders.length === 0
              ? 'بعد از ثبت سفارش توسط مشتری، اینجا نمایش داده می‌شود'
              : 'عبارت جستجو یا فیلتر را تغییر بده'}
          </p>
        </div>
      ) : (
        <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft overflow-hidden">
          {/* دسکتاپ — جدول */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink/5 dark:border-white/5 bg-cream/50 dark:bg-night/50">
                  <th className="text-right p-3 text-[10px] font-bold text-ink/60 dark:text-night-ink/60 uppercase">شماره</th>
                  <th className="text-right p-3 text-[10px] font-bold text-ink/60 dark:text-night-ink/60 uppercase">مشتری</th>
                  <th className="text-right p-3 text-[10px] font-bold text-ink/60 dark:text-night-ink/60 uppercase">تاریخ</th>
                  <th className="text-center p-3 text-[10px] font-bold text-ink/60 dark:text-night-ink/60 uppercase">مبلغ</th>
                  <th className="text-center p-3 text-[10px] font-bold text-ink/60 dark:text-night-ink/60 uppercase">وضعیت</th>
                  <th className="text-center p-3 text-[10px] font-bold text-ink/60 dark:text-night-ink/60 uppercase">عملیات</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((o) => {
                    const st = ORDER_STATUS_LABELS[o.status];
                    return (
                      <motion.tr
                        key={o.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-ink/5 dark:border-white/5 last:border-0 hover:bg-copper/5 transition-colors"
                      >
                        <td className="p-3">
                          <div className="font-mono text-xs font-bold text-ink dark:text-night-ink">
                            {o.id}
                          </div>
                          <div className="text-[10px] text-ink/40 dark:text-night-ink/40">
                            {o.items.length.toLocaleString('fa-IR')} آیتم
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-sm font-medium text-ink dark:text-night-ink">
                            {o.userName}
                          </div>
                          <div className="text-[10px] text-ink/50 dark:text-night-ink/50" dir="ltr">
                            {o.userEmail}
                          </div>
                        </td>
                        <td className="p-3 text-xs text-ink/60 dark:text-night-ink/60">
                          {o.date}
                        </td>
                        <td className="p-3 text-center">
                          <div className="font-display font-bold text-sm text-copper whitespace-nowrap">
                            {formatPrice(o.total)}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <select
                            value={o.status}
                            onChange={(e) =>
                              handleStatusChange(o.id, e.target.value as OrderStatus)
                            }
                            className={cn(
                              'text-[10px] font-bold px-2 py-1 rounded-full cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-copper/20',
                              st.className
                            )}
                          >
                            {STATUS_ORDER.map((s) => (
                              <option key={s} value={s}>
                                {ORDER_STATUS_LABELS[s].label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-1">
                            <Link
                              to={`/admin/orders/${o.id}`}
                              className="w-8 h-8 rounded-lg hover:bg-copper/10 flex items-center justify-center text-ink/40 dark:text-night-ink/40 hover:text-copper transition-colors"
                              title="مشاهده جزئیات"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => setConfirmDelete(o.id)}
                              className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-ink/40 dark:text-night-ink/40 hover:text-red-500 transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* موبایل — کارت */}
          <div className="lg:hidden divide-y divide-ink/5 dark:divide-white/5">
            <AnimatePresence>
              {filtered.map((o) => {
                const st = ORDER_STATUS_LABELS[o.status];
                return (
                  <motion.div
                    key={o.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-3"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="font-mono text-xs font-bold text-ink dark:text-night-ink">
                          {o.id}
                        </div>
                        <div className="text-[10px] text-ink/50 dark:text-night-ink/50 mt-0.5">
                          {o.userName} · {o.date}
                        </div>
                      </div>
                      <div className="font-display font-bold text-copper text-sm whitespace-nowrap">
                        {formatPrice(o.total)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <select
                        value={o.status}
                        onChange={(e) =>
                          handleStatusChange(o.id, e.target.value as OrderStatus)
                        }
                        className={cn(
                          'text-[10px] font-bold px-2 py-1 rounded-full cursor-pointer border-0 focus:outline-none',
                          st.className
                        )}
                      >
                        {STATUS_ORDER.map((s) => (
                          <option key={s} value={s}>
                            {ORDER_STATUS_LABELS[s].label}
                          </option>
                        ))}
                      </select>
                      <div className="flex-1" />
                      <Link
                        to={`/admin/orders/${o.id}`}
                        className="w-8 h-8 rounded-lg bg-copper/10 flex items-center justify-center text-copper"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setConfirmDelete(o.id)}
                        className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="حذف سفارش"
        message={`آیا از حذف سفارش «${orderToDelete?.id || ''}» مطمئنی؟ این عمل قابل بازگشت نیست.`}
        confirmLabel="حذف کن"
      />
    </div>
  );
}