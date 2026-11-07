import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Clock,
  Truck,
  Check,
  X,
  Tag,
  CreditCard,
  Copy,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import PageHeader from '../components/PageHeader';
import SmartImage from '../../components/ui/SmartImage';
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

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { getById, updateStatus } = useOrdersStore();
  const order = id ? getById(id) : undefined;

  usePageTitle(order ? `سفارش ${order.id}` : 'سفارش');

  const [copied, setCopied] = useState(false);

  if (!order) {
    return (
      <div className="text-center py-20">
        <Package className="w-16 h-16 text-copper/40 mx-auto mb-4" />
        <h1 className="text-xl font-display font-bold mb-2">سفارش پیدا نشد</h1>
        <Link to="/admin/orders">
          <Button>بازگشت به سفارش‌ها</Button>
        </Link>
      </div>
    );
  }

  const st = ORDER_STATUS_LABELS[order.status];

  const handleStatusChange = (status: OrderStatus) => {
    updateStatus(order.id, status);
    toast.success(`وضعیت به «${ORDER_STATUS_LABELS[status].label}» تغییر کرد`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <PageHeader
        title={`سفارش ${order.id}`}
        description={`ثبت شده در ${order.date}`}
        actions={
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs text-copper hover:text-copper-dark font-medium px-3 py-2 rounded-xl hover:bg-copper/10 transition-colors"
          >
            بازگشت
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        }
      />

      <div className="grid lg:grid-cols-[1fr_360px] gap-4 items-start">
        {/* ستون اصلی */}
        <div className="space-y-4">
          {/* وضعیت */}
          <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5">
            <h2 className="font-display font-bold text-sm mb-3">تغییر وضعیت سفارش</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {STATUS_ORDER.map((s) => {
                const Icon = STATUS_ICONS[s];
                const isActive = order.status === s;
                const info = ORDER_STATUS_LABELS[s];
                return (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all',
                      isActive
                        ? 'border-copper bg-copper/5'
                        : 'border-ink/10 dark:border-white/10 hover:border-copper/40'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-5 h-5',
                        isActive ? 'text-copper' : 'text-ink/40 dark:text-night-ink/40'
                      )}
                    />
                    <span
                      className={cn(
                        'text-[10px] font-bold',
                        isActive ? 'text-copper' : 'text-ink/60 dark:text-night-ink/60'
                      )}
                    >
                      {info.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-ink/50 dark:text-night-ink/50">
                وضعیت فعلی:
              </span>
              <span className={cn('text-xs font-bold px-2 py-1 rounded-full', st.className)}>
                {st.label}
              </span>
            </div>
          </div>

          {/* محصولات */}
          <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5">
            <h2 className="font-display font-bold text-sm mb-3">
              محصولات ({order.items.length.toLocaleString('fa-IR')})
            </h2>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-cream dark:bg-night"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface dark:bg-night-surface shrink-0">
                    <SmartImage src={item.image} alt={item.name} className="w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-ink dark:text-night-ink line-clamp-1">
                      {item.name}
                    </div>
                    {item.variant && (
                      <div className="text-[10px] text-copper">
                        {item.variant.name}: {item.variant.option}
                      </div>
                    )}
                    <div className="text-[10px] text-ink/50 dark:text-night-ink/50">
                      {item.brand} · {item.quantity.toLocaleString('fa-IR')} × {formatPrice(item.price)}
                    </div>
                  </div>
                  <div className="font-display font-bold text-xs text-copper whitespace-nowrap">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* آدرس */}
          <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5">
            <h2 className="font-display font-bold text-sm mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-copper" />
              آدرس ارسال
            </h2>
            <div className="text-sm text-ink/70 dark:text-night-ink/70 leading-relaxed">
              <div>{order.address.province}، {order.address.city}</div>
              <div>{order.address.address}</div>
              <div className="text-xs text-ink/50 dark:text-night-ink/50 mt-1" dir="ltr">
                {order.address.phone}
              </div>
              {order.address.postalCode && (
                <div className="text-xs text-ink/50 dark:text-night-ink/50">
                  کد پستی: {order.address.postalCode}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ستون کنار */}
        <div className="space-y-4">
          {/* اطلاعات مشتری */}
          <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5">
            <h2 className="font-display font-bold text-sm mb-3">مشتری</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-ink/70 dark:text-night-ink/70">
                <User className="w-4 h-4 text-copper shrink-0" />
                {order.userName}
              </div>
              <div className="flex items-center gap-2 text-ink/70 dark:text-night-ink/70" dir="ltr">
                <Mail className="w-4 h-4 text-copper shrink-0" />
                {order.userEmail}
              </div>
              {order.userPhone && (
                <div className="flex items-center gap-2 text-ink/70 dark:text-night-ink/70" dir="ltr">
                  <Phone className="w-4 h-4 text-copper shrink-0" />
                  {order.userPhone}
                </div>
              )}
            </div>
          </div>

          {/* شماره سفارش */}
          <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5">
            <div className="text-xs text-ink/50 dark:text-night-ink/50 mb-1">شماره سفارش</div>
            <div className="flex items-center justify-between gap-2">
              <div className="font-mono text-sm font-bold text-ink dark:text-night-ink">
                {order.id}
              </div>
              <button
                onClick={handleCopy}
                className="text-xs text-copper hover:text-copper-dark flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'کپی شد' : 'کپی'}
              </button>
            </div>
          </div>

          {/* خلاصه مالی */}
          <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5">
            <h2 className="font-display font-bold text-sm mb-3">خلاصه مالی</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-ink/70 dark:text-night-ink/70">
                <span>جمع کل</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-forest">
                  <span>تخفیف</span>
                  <span>−{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-ink/70 dark:text-night-ink/70">
                <span>ارسال</span>
                <span className={cn(order.shipping === 0 && 'text-forest')}>
                  {order.shipping === 0 ? 'رایگان' : formatPrice(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-ink/5 dark:border-white/5">
                <span className="font-bold">مبلغ نهایی</span>
                <span className="font-display font-extrabold text-copper text-base">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>

            {order.couponCode && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-forest bg-forest/10 px-2 py-1.5 rounded-lg">
                <Tag className="w-3.5 h-3.5" />
                کد: {order.couponCode}
              </div>
            )}

            <div className="mt-3 flex items-center gap-1.5 text-xs text-ink/60 dark:text-night-ink/60">
              <CreditCard className="w-3.5 h-3.5 text-copper" />
              {order.paymentMethod === 'online' ? 'پرداخت آنلاین' : 'پرداخت در محل'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}