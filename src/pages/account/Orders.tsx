import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowLeft, Clock, Truck, Check, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import {
  useOrdersStore,
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from '../../store/ordersStore';
import { formatPrice, cn } from '../../lib/utils';

const STATUS_ICONS: Record<OrderStatus, typeof Clock> = {
  pending: Clock,
  shipped: Truck,
  delivered: Check,
  cancelled: X,
};

export default function Orders() {
  const user = useAuthStore((s) => s.user);
  const orders = useOrdersStore((s) => s.orders);

  const myOrders = useMemo(() => {
    if (!user) return [];
    return orders.filter((o) => o.userId === user.id);
  }, [orders, user]);

  if (myOrders.length === 0) {
    return (
      <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-12 text-center">
        <Package className="w-12 h-12 text-copper/40 mx-auto mb-4" />
        <h3 className="font-display font-bold mb-2">هنوز سفارشی نداری</h3>
        <p className="text-sm text-ink/60 dark:text-night-ink/60 mb-5">
          اولین خریدت را انجام بده تا اینجا نمایش داده شود.
        </p>
        <Link to="/products">
          <button className="inline-flex items-center gap-1 text-copper text-sm font-medium hover:gap-2 transition-all">
            مشاهده محصولات
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {myOrders.map((o) => {
        const st = ORDER_STATUS_LABELS[o.status];
        const Icon = STATUS_ICONS[o.status];

        return (
          <div
            key={o.id}
            className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft overflow-hidden"
          >
            {/* هدر کارت */}
            <div className="p-4 flex items-center justify-between gap-3 flex-wrap border-b border-ink/5 dark:border-white/5">
              <div>
                <div className="font-mono text-sm font-bold text-ink dark:text-night-ink">
                  {o.id}
                </div>
                <div className="text-xs text-ink/50 dark:text-night-ink/50 mt-0.5">
                  {o.date} · {o.items.length.toLocaleString('fa-IR')} آیتم
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full',
                    st.className
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {st.label}
                </span>
                <span className="font-display font-extrabold text-copper text-sm whitespace-nowrap">
                  {formatPrice(o.total)}
                </span>
              </div>
            </div>

            {/* محصولات */}
            <div className="p-4 space-y-2">
              {o.items.slice(0, 3).map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-cream dark:bg-night shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-ink dark:text-night-ink truncate">
                      {item.name}
                    </div>
                    {item.variant && (
                      <div className="text-[10px] text-copper">
                        {item.variant.name}: {item.variant.option}
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] text-ink/50 dark:text-night-ink/50 whitespace-nowrap">
                    × {item.quantity.toLocaleString('fa-IR')}
                  </div>
                </div>
              ))}
              {o.items.length > 3 && (
                <div className="text-[10px] text-ink/50 dark:text-night-ink/50 text-center pt-1">
                  و {(o.items.length - 3).toLocaleString('fa-IR')} محصول دیگر
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}