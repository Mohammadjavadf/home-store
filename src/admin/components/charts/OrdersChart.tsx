import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useOrdersStore } from '../../../store/ordersStore';

const STATUS_LABELS: Record<string, string> = {
  pending: 'در انتظار',
  shipped: 'ارسال شده',
  delivered: 'تحویل شده',
  cancelled: 'لغو شده',
};

const STATUS_COLORS: Record<string, string> = {
  pending: '#D4A373',
  shipped: '#3B82F6',
  delivered: '#2D6A4F',
  cancelled: '#EF4444',
};
export default function OrdersChart() {
const orders = useOrdersStore((s) => s.orders);

  const data = useMemo(() => {
    return Object.keys(STATUS_LABELS).map((status) => ({
      status: STATUS_LABELS[status],
      statusKey: status,
      count: orders.filter((o) => o.status === status).length,
    }));
  }, [orders]);

  const hasData = data.some((d) => d.count > 0);

  if (!hasData) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center py-8">
        <div className="w-12 h-12 rounded-xl bg-copper/10 flex items-center justify-center mb-3">
          <span className="text-2xl">📦</span>
        </div>
        <p className="text-sm text-ink/50 dark:text-night-ink/50">
          هنوز سفارشی ثبت نشده
        </p>
        <p className="text-xs text-ink/40 dark:text-night-ink/40 mt-1">
          بعد از اولین سفارش، نمودار نمایش داده می‌شود
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-ink/10 dark:text-white/10" />
        <XAxis
          dataKey="status"
          tick={{ fontSize: 11, fontFamily: 'Vazirmatn' }}
          stroke="currentColor"
          className="text-ink/40 dark:text-night-ink/40"
        />
        <YAxis
          tick={{ fontSize: 10, fontFamily: 'Vazirmatn' }}
          stroke="currentColor"
          className="text-ink/40 dark:text-night-ink/40"
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            fontFamily: 'Vazirmatn',
            fontSize: 12,
            direction: 'rtl',
            borderRadius: 12,
            border: 'none',
            boxShadow: '0 4px 24px -8px rgba(0,0,0,0.2)',
            background: '#fff',
            color: '#1C1917',
          }}
formatter={(value) => [`${Number(value)} سفارش`, 'تعداد']}
          labelStyle={{ fontWeight: 'bold', marginBottom: 4 }}
        />
        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.statusKey} fill={STATUS_COLORS[entry.statusKey]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}