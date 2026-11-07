import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GitCompare, Trash2, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useCompareStore } from '../../store/compareStore';
import { useCartStore } from '../../store/cartStore';
import SmartImage from '../ui/SmartImage';
import Button from '../ui/Button';
import { cn } from '../../lib/utils';

export default function CompareBar() {
  const navigate = useNavigate();
  const { items, remove, clear } = useCompareStore();
  const addItem = useCartStore((s) => s.addItem);

  if (items.length === 0) return null;

  const handleAdd = (product: (typeof items)[number]) => {
    if (!product.inStock) return;

    // اگر متغیر دارد → به صفحه جزئیات برو
    if (product.variants && product.variants.length > 0) {
      toast.info('لطفاً ابتدا گزینه‌های محصول را انتخاب کنید');
      navigate(`/products/${product.id}`);
      return;
    }

    addItem(product, 1);
    toast.success(`«${product.name}» به سبد اضافه شد`);
  };

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-3 sm:bottom-4 inset-x-0 z-40 flex justify-center px-3 pointer-events-none"
        >
          <div className="pointer-events-auto w-full max-w-3xl bg-surface dark:bg-night-surface rounded-2xl shadow-glow border border-ink/10 dark:border-white/10 p-2 sm:p-3 flex items-center gap-2 sm:gap-3">
            {/* تامبنیل‌ها */}
            <div className="flex gap-1.5 sm:gap-2 flex-1 overflow-x-auto">
              {items.map((p) => (
                <div
                  key={p.id}
                  className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-cream dark:bg-night shrink-0 border border-ink/5 dark:border-white/5 group"
                >
                  <SmartImage
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full"
                  />
                  <button
                    onClick={() => remove(p.id)}
                    className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                    aria-label="حذف از مقایسه"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* تعداد — فقط دسکتاپ */}
            <div className="text-xs text-ink/60 dark:text-night-ink/60 hidden sm:block shrink-0">
              {items.length.toLocaleString('fa-IR')} محصول
            </div>

            {/* پاک کردن */}
            <button
              onClick={clear}
              className="w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center justify-center text-ink/40 dark:text-night-ink/40 hover:text-red-500 transition-colors shrink-0"
              aria-label="پاک کردن همه"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* افزودن همه به سبد */}
            <button
              onClick={() => {
                let addedCount = 0;
                let skippedCount = 0;
                items.forEach((p) => {
                  if (!p.inStock) {
                    skippedCount++;
                    return;
                  }
                  if (p.variants && p.variants.length > 0) {
                    skippedCount++;
                    return;
                  }
                  addItem(p, 1);
                  addedCount++;
                });

                if (addedCount > 0) {
                  toast.success(
                    `${addedCount.toLocaleString('fa-IR')} محصول به سبد اضافه شد`
                  );
                }
                if (skippedCount > 0) {
                  toast.info(
                    `${skippedCount.toLocaleString('fa-IR')} محصول نیاز به انتخاب گزینه یا موجود نیست`
                  );
                }
              }}
              className={cn(
                'hidden sm:flex items-center justify-center gap-1 h-8 px-3 rounded-lg',
                'bg-forest/10 text-forest hover:bg-forest/20 text-[11px] font-medium transition-colors shrink-0'
              )}
              title="افزودن همه محصولات بدون متغیر به سبد"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              افزودن همه
            </button>

            {/* دکمه مقایسه */}
            <Link to="/compare" className="shrink-0">
              <Button size="sm">
                <GitCompare className="w-4 h-4" />
                <span className="hidden xs:inline sm:inline">مقایسه</span>
                <span className="inline xs:hidden sm:hidden">
                  {items.length.toLocaleString('fa-IR')}
                </span>
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}