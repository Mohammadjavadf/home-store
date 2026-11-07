import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GitCompare, Trash2, ShoppingCart, Check, X } from 'lucide-react';
import { useCompareStore } from '../store/compareStore';
import { useCartStore } from '../store/cartStore';
import { formatPrice, cn } from '../lib/utils';
import Button from '../components/ui/Button';
import SmartImage from '../components/ui/SmartImage';

export default function Compare() {
  const { items, remove, clear } = useCompareStore();
  const addToCart = useCartStore((s) => s.addItem);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-copper/10 flex items-center justify-center mb-6">
          <GitCompare className="w-10 h-10 text-copper" />
        </div>
        <h1 className="text-2xl font-display font-extrabold mb-3">
          لیست مقایسه خالی است
        </h1>
        <p className="text-ink/60 dark:text-night-ink/60 mb-6">
          محصولات مورد نظرت را به لیست مقایسه اضافه کن (حداکثر ۵ عدد).
        </p>
        <Link to="/products">
          <Button>مشاهده محصولات</Button>
        </Link>
      </div>
    );
  }

  // جمع‌آوری همه ویژگی‌ها از همه محصولات (یکتا)
  const allFeatures = Array.from(
    new Set(items.flatMap((p) => p.features))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-extrabold">مقایسه محصولات</h1>
        <button
          onClick={clear}
          className="text-xs text-copper hover:text-copper-dark flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          پاک کردن همه
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft overflow-hidden">
          <thead>
            <tr className="border-b border-ink/5 dark:border-white/5">
              <th className="p-4 text-right text-xs font-bold text-ink/60 dark:text-night-ink/60 w-32">
                مشخصات
              </th>
              {items.map((p) => (
                <th key={p.id} className="p-4 text-center min-w-[180px]">
                  <div className="relative">
                    <button
                      onClick={() => remove(p.id)}
                      className="absolute -top-2 left-0 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                      aria-label="حذف"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <Link to={`/products/${p.id}`}>
                      <div className="w-20 h-20 mx-auto rounded-xl overflow-hidden bg-cream dark:bg-night mb-2">
                        <SmartImage src={p.image} alt={p.name} className="w-full h-full" />
                      </div>
                      <div className="text-xs font-bold text-ink dark:text-night-ink line-clamp-2 hover:text-copper transition-colors">
                        {p.name}
                      </div>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* قیمت */}
            <tr className="border-b border-ink/5 dark:border-white/5">
              <td className="p-4 text-xs font-bold text-ink/60 dark:text-night-ink/60">قیمت</td>
              {items.map((p) => (
                <td key={p.id} className="p-4 text-center font-display font-extrabold text-copper text-sm">
                  {formatPrice(p.price)}
                </td>
              ))}
            </tr>

            {/* برند */}
            <tr className="border-b border-ink/5 dark:border-white/5">
              <td className="p-4 text-xs font-bold text-ink/60 dark:text-night-ink/60">برند</td>
              {items.map((p) => (
                <td key={p.id} className="p-4 text-center text-sm text-ink dark:text-night-ink">
                  {p.brand}
                </td>
              ))}
            </tr>

            {/* امتیاز */}
            <tr className="border-b border-ink/5 dark:border-white/5">
              <td className="p-4 text-xs font-bold text-ink/60 dark:text-night-ink/60">امتیاز</td>
              {items.map((p) => (
                <td key={p.id} className="p-4 text-center text-sm text-ink dark:text-night-ink">
                  {p.rating.toLocaleString('fa-IR')} ⭐
                </td>
              ))}
            </tr>

            {/* موجودی */}
            <tr className="border-b border-ink/5 dark:border-white/5">
              <td className="p-4 text-xs font-bold text-ink/60 dark:text-night-ink/60">موجودی</td>
              {items.map((p) => (
                <td key={p.id} className="p-4 text-center">
                  {p.inStock ? (
                    <Check className="w-4 h-4 text-forest mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-red-400 mx-auto" />
                  )}
                </td>
              ))}
            </tr>

            {/* ویژگی‌ها */}
            {allFeatures.map((feature) => (
              <tr key={feature} className="border-b border-ink/5 dark:border-white/5 last:border-0">
                <td className="p-4 text-xs text-ink/60 dark:text-night-ink/60">{feature}</td>
                {items.map((p) => (
                  <td key={p.id} className="p-4 text-center">
                    {p.features.includes(feature) ? (
                      <Check className="w-4 h-4 text-forest mx-auto" />
                    ) : (
                      <span className="text-ink/20 dark:text-night-ink/20">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}

            {/* دکمه خرید */}
            <tr>
              <td className="p-4" />
              {items.map((p) => (
                <td key={p.id} className="p-4 text-center">
                  <Button
                    size="sm"
                    onClick={() => addToCart(p, 1)}
                    disabled={!p.inStock}
                    className="w-full"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    افزودن
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}