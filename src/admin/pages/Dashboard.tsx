import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  ChevronLeft,
  ArrowUpRight,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import SalesChart from '../components/charts/SalesChart';
import OrdersChart from '../components/charts/OrdersChart';
import CategoryChart from '../components/charts/CategoryChart';
import { useProductsStore } from '../../store/productsStore';
import { useAuthStore } from '../../store/authStore';
import { formatPrice, cn } from '../../lib/utils';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useOrdersStore } from '../../store/ordersStore';

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending: { label: 'در انتظار', className: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' },
  shipped: { label: 'ارسال شده', className: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' },
  delivered: { label: 'تحویل شده', className: 'bg-forest/10 text-forest' },
  cancelled: { label: 'لغو شده', className: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' },
};

export default function Dashboard() {
  usePageTitle('داشبورد');

  const products = useProductsStore((s) => s.products);
  const orders = useOrdersStore((s) => s.orders);
  const accounts = useAuthStore((s) => s.accounts);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const totalUsers = accounts.length;
    const totalProducts = products.length;

    return { totalRevenue, totalOrders, totalUsers, totalProducts };
  }, [orders, accounts, products]);

const recentOrders = useMemo(() => {
  if (!Array.isArray(orders)) return [];
  return orders.slice(0, 5);
}, [orders]);

const lowStockProducts = useMemo(() => {
  if (!Array.isArray(products)) return [];
  return products
    .filter((p) => p && !p.inStock)
    .slice(0, 5);
}, [products]);

  return (
    <div>
      <PageHeader
        title="داشبورد"
        description="نمای کلی فروشگاه خانه‌استور"
        actions={
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-copper hover:text-copper-dark font-medium px-3 py-2 rounded-xl hover:bg-copper/10 transition-colors"
          >
            مشاهده سایت
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        }
      />

      {/* کارت‌های آمار */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="درآمد کل"
          value={formatPrice(stats.totalRevenue)}
          Icon={TrendingUp}
          color="copper"
          index={0}
        />
        <StatCard
          label="سفارش‌ها"
          value={stats.totalOrders.toLocaleString('fa-IR')}
          Icon={ShoppingBag}
          color="forest"
          index={1}
        />
        <StatCard
          label="کاربران"
          value={stats.totalUsers.toLocaleString('fa-IR')}
          Icon={Users}
          color="blue"
          index={2}
        />
        <StatCard
          label="محصولات"
          value={stats.totalProducts.toLocaleString('fa-IR')}
          Icon={Package}
          color="amber"
          index={3}
        />
      </div>

      {/* نمودارها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-sm text-ink dark:text-night-ink">
              فروش ۷ روز اخیر
            </h2>
          </div>
          <SalesChart />
        </div>

        <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-sm text-ink dark:text-night-ink">
              سفارش‌ها بر اساس وضعیت
            </h2>
          </div>
          <OrdersChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* محصولات دسته‌بندی */}
        <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-sm text-ink dark:text-night-ink">
              محصولات بر اساس دسته
            </h2>
          </div>
          <CategoryChart />
        </div>

        {/* آخرین سفارش‌ها */}
        <div className="lg:col-span-2 bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-sm text-ink dark:text-night-ink">
              آخرین سفارش‌ها
            </h2>
            <Link
              to="/admin/orders"
              className="text-xs text-copper hover:text-copper-dark font-medium inline-flex items-center gap-1"
            >
              مشاهده همه
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
{recentOrders.length === 0 ? (
  <div className="text-center py-10">
    <ShoppingBag className="w-10 h-10 text-copper/30 mx-auto mb-3" />
    <p className="text-sm text-ink/50 dark:text-night-ink/50">
      هنوز سفارشی ثبت نشده
    </p>
  </div>
) : (
  <div className="space-y-2">
    {recentOrders.map((o) => {
      const st = STATUS_LABELS[o.status] || STATUS_LABELS.pending;
      return (
        <Link
          key={o.id}
          to={`/admin/orders/${o.id}`}
          className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-copper/5 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-copper/10 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4 text-copper" />
            </div>
            <div className="min-w-0">
              <div className="font-mono text-xs font-bold text-ink dark:text-night-ink truncate">
                {o.id || '—'}
              </div>
              <div className="text-[10px] text-ink/50 dark:text-night-ink/50">
               {o.date || '—'} · {(o.items?.length ?? 0).toLocaleString('fa-IR')} آیتم
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={cn('text-[10px] font-bold px-2 py-1 rounded-full', st.className)}>
              {st.label}
            </span>
            <span className="font-display font-bold text-xs text-copper whitespace-nowrap">
              {formatPrice(o.total ?? 0)}
            </span>
          </div>
        </Link>
      );
    })}
  </div>
)}
        </div>
      </div>

      {/* هشدار محصولات ناموجود */}
{lowStockProducts.length > 0 && (
  <div className="mt-6 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-5">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
        <AlertTriangle className="w-4 h-4 text-amber-600" />
      </div>
      <h2 className="font-display font-bold text-sm text-amber-700 dark:text-amber-400">
        محصولات ناموجود ({lowStockProducts.length.toLocaleString('fa-IR')})
      </h2>
    </div>
    <div className="space-y-1.5">
      {lowStockProducts.map((p) => (
        <Link
          key={p.id}
          to={p.id ? `/admin/products/${p.id}/edit` : '/admin/products'}
          className="flex items-center justify-between text-xs p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-500/10 transition-colors gap-2"
        >
          <span className="text-ink/70 dark:text-night-ink/70 truncate">
            {p.name || 'بدون نام'}
          </span>
          <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0">
            {p.brand || '—'}
          </span>
        </Link>
      ))}
    </div>
  </div>
)}
    </div>
  );
}