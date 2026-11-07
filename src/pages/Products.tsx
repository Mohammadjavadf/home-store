import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PackageX, SlidersHorizontal, X } from 'lucide-react';
import { useProductsStore } from '../store/productsStore';
import { useFilterStore } from '../store/filterStore';
import { filterProducts } from '../lib/filterProducts';
import ProductCard from '../components/product/ProductCard';
import FilterSidebar from '../components/product/FilterSidebar';
import SortBar from '../components/product/SortBar';
import Button from '../components/ui/Button';
import { usePageTitle } from '../hooks/usePageTitle';

export default function Products() {
  usePageTitle('محصولات');

  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const products = useProductsStore((s) => s.products);

  const {
    search,
    categories,
    brands,
    priceRange,
    onlyInStock,
    sort,
    toggleCategory,
    setSearch,
  } = useFilterStore();

  // خواندن دسته از URL در بار اول
  const urlCategory = searchParams.get('category');
  useEffect(() => {
    if (urlCategory && !categories.includes(urlCategory)) {
      toggleCategory(urlCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // وقتی فیلترها عوض می‌شن، URL رو پاک کن
  useEffect(() => {
    if (searchParams.has('category')) {
      const next = new URLSearchParams(searchParams);
      next.delete('category');
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  const filtered = useMemo(
    () =>
      filterProducts(products, {
        search,
        categories,
        brands,
        priceRange,
        onlyInStock,
        sort,
      }),
    [products, search, categories, brands, priceRange, onlyInStock, sort]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* هدر صفحه */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-ink dark:text-night-ink mb-2">
          محصولات
        </h1>
        <p className="text-ink/60 dark:text-night-ink/60 text-sm">
          بهترین لوازم خانگی، با فیلترهای هوشمند و جستجوی سریع.
        </p>
      </div>

      {/* دکمه فیلتر موبایل */}
      <div className="lg:hidden mb-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileFilterOpen(true)}
          className="flex-1"
        >
          <SlidersHorizontal className="w-4 h-4" />
          فیلترها
        </Button>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* سایدبار دسکتاپ */}
        <div className="hidden lg:block">
          <FilterSidebar />
        </div>

        {/* محتوا */}
        <div>
          <SortBar resultCount={filtered.length} />

          {filtered.length === 0 ? (
            <EmptyState
              onReset={() => {
                setSearch('');
                useFilterStore.getState().reset();
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={p} index={i} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* کشوی فیلتر موبایل */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-cream dark:bg-night z-50 overflow-y-auto p-4 lg:hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg">فیلترها</h2>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-9 h-9 rounded-xl bg-copper/10 hover:bg-copper/20 flex items-center justify-center"
                  aria-label="بستن"
                >
                  <X className="w-5 h-5 text-copper" />
                </button>
              </div>
              <FilterSidebar />
              <div className="mt-4">
                <Button onClick={() => setMobileFilterOpen(false)} className="w-full">
                  نمایش {filtered.length.toLocaleString('fa-IR')} محصول
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface dark:bg-night-surface rounded-3xl border border-ink/5 dark:border-white/5 shadow-soft p-12 text-center"
    >
      <div className="w-16 h-16 mx-auto rounded-2xl bg-copper/10 flex items-center justify-center mb-4">
        <PackageX className="w-8 h-8 text-copper" />
      </div>
      <h3 className="font-display font-bold text-lg text-ink dark:text-night-ink mb-2">
        محصولی پیدا نشد
      </h3>
      <p className="text-sm text-ink/60 dark:text-night-ink/60 mb-6 max-w-sm mx-auto">
        با فیلترهای فعلی هیچ محصولی مطابقت نداره. فیلترها رو تغییر بده یا
        بازنشانی کن.
      </p>
      <Button onClick={onReset} variant="outline">
        بازنشانی فیلترها
      </Button>
    </motion.div>
  );
}