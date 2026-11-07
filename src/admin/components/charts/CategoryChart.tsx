import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useProductsStore } from '../../../store/productsStore';
import { useCategoriesStore } from '../../../store/categoriesStore';

const COLORS = ['#B87333', '#2D6A4F', '#D4A373', '#40916C', '#8B5A2B', '#9CA3AF', '#A78BFA'];

export default function CategoryChart() {
  const products = useProductsStore((s) => s.products);
  const categories = useCategoriesStore((s) => s.categories);

  const data = useMemo(() => {
    return categories
      .map((cat) => ({
        name: cat,
        value: products.filter((p) => p.category === cat).length,
      }))
      .filter((d) => d.value > 0);
  }, [products, categories]);

  if (data.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center py-8">
        <div className="w-12 h-12 rounded-xl bg-copper/10 flex items-center justify-center mb-3">
          <span className="text-2xl">🥧</span>
        </div>
        <p className="text-sm text-ink/50 dark:text-night-ink/50">
          هنوز محصولی ثبت نشده
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={90}
          paddingAngle={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
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
      formatter={(value) => [`${Number(value)} محصول`, 'تعداد']}
        />
        <Legend
          wrapperStyle={{ fontFamily: 'Vazirmatn', fontSize: 11, direction: 'rtl' }}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}