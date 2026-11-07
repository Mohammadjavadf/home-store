import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useOrdersStore } from '../../../store/ordersStore';
import { formatPrice } from '../../../lib/utils';

export default function SalesChart() {
const orders = useOrdersStore((s) => s.orders);
  const data = useMemo(() => {
    const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
    const today = new Date();

    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toLocaleDateString('fa-IR');

      const dayOrders = orders.filter((o) => o.date === dateStr);
      const total = dayOrders.reduce((sum, o) => sum + o.total, 0);

      return {
        day: days[i] || `روز ${i + 1}`,
        sales: total,
        date: dateStr,
      };
    });
  }, [orders]);

  const hasData = data.some((d) => d.sales > 0);

  if (!hasData) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center py-8">
        <div className="w-12 h-12 rounded-xl bg-copper/10 flex items-center justify-center mb-3">
          <span className="text-2xl">📊</span>
        </div>
        <p className="text-sm text-ink/50 dark:text-night-ink/50">
          هنوز فروشی ثبت نشده
        </p>
        <p className="text-xs text-ink/40 dark:text-night-ink/40 mt-1">
          بعد از اولین سفارش، نمودار نمایش داده می‌شود
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-ink/10 dark:text-white/10" />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11, fontFamily: 'Vazirmatn' }}
          stroke="currentColor"
          className="text-ink/40 dark:text-night-ink/40"
        />
        <YAxis
          tick={{ fontSize: 10, fontFamily: 'Vazirmatn' }}
          stroke="currentColor"
          className="text-ink/40 dark:text-night-ink/40"
          tickFormatter={(v) =>
            v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}م` : `${(v / 1000).toFixed(0)}ک`
          }
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
formatter={(value) => [formatPrice(Number(value)), 'فروش']}
          labelStyle={{ fontWeight: 'bold', marginBottom: 4 }}
        />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#B87333"
          strokeWidth={3}
          dot={{ fill: '#B87333', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}