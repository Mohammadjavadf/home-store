import { Filter, RotateCcw } from 'lucide-react';
import {
  useFilterStore,
  MIN_PRICE,
  MAX_PRICE,
} from '../../store/filterStore';
import { useProductsStore } from '../../store/productsStore';
import { useCategoriesStore } from '../../store/categoriesStore';
import { useBrandsStore } from '../../store/brandsStore';
import { formatPrice, cn } from '../../lib/utils';
import Button from '../ui/Button';

// گام اسلایدر بر اساس بازه واقعی
const STEP = Math.max(100_000, Math.round((MAX_PRICE - MIN_PRICE) / 100));

export default function FilterSidebar() {
  const products = useProductsStore((s) => s.products);
  const categories = useCategoriesStore((s) => s.categories);
  const brands = useBrandsStore((s) => s.brands);

  const {
    categories: selectedCategories,
    brands: selectedBrands,
    priceRange,
    onlyInStock,
    toggleCategory,
    toggleBrand,
    setPriceRange,
    setOnlyInStock,
    reset,
  } = useFilterStore();

  const activeCount =
    selectedCategories.length +
    selectedBrands.length +
    (onlyInStock ? 1 : 0) +
    (priceRange[0] !== MIN_PRICE || priceRange[1] !== MAX_PRICE ? 1 : 0);

  return (
    <aside className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5 space-y-6 sticky top-20">
      {/* هدر */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-copper" />
          <h2 className="font-display font-bold text-sm text-ink dark:text-night-ink">
            فیلترها
          </h2>
          {activeCount > 0 && (
            <span className="text-[10px] font-bold bg-copper text-white w-5 h-5 rounded-full flex items-center justify-center">
              {activeCount.toLocaleString('fa-IR')}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={reset}
            className="text-xs text-copper hover:text-copper-dark flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            پاک کردن
          </button>
        )}
      </div>

      {/* دسته‌بندی */}
      <div>
        <h3 className="font-display font-bold text-xs text-ink/60 dark:text-night-ink/60 mb-3 uppercase tracking-wider">
          دسته‌بندی
        </h3>
        <div className="space-y-2">
          {categories.map((cat) => {
            const isActive = selectedCategories.includes(cat);
            const count = products.filter((p) => p.category === cat).length;
            return (
              <label
                key={cat}
                className={cn(
                  'flex items-center gap-2.5 text-sm cursor-pointer px-2 py-1.5 rounded-lg transition-colors',
                  isActive
                    ? 'bg-copper/10 text-copper font-medium'
                    : 'text-ink/70 dark:text-night-ink/70 hover:bg-copper/5'
                )}
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => toggleCategory(cat)}
                  className="w-4 h-4 rounded accent-copper cursor-pointer"
                />
                <span className="flex-1">{cat}</span>
                <span className="text-[10px] text-ink/40 dark:text-night-ink/40">
                  {count.toLocaleString('fa-IR')}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* برند */}
      <div>
        <h3 className="font-display font-bold text-xs text-ink/60 dark:text-night-ink/60 mb-3 uppercase tracking-wider">
          برند
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pl-1">
          {brands.map((brand) => {
            const isActive = selectedBrands.includes(brand);
            const count = products.filter((p) => p.brand === brand).length;
            return (
              <label
                key={brand}
                className={cn(
                  'flex items-center gap-2.5 text-sm cursor-pointer px-2 py-1.5 rounded-lg transition-colors',
                  isActive
                    ? 'bg-copper/10 text-copper font-medium'
                    : 'text-ink/70 dark:text-night-ink/70 hover:bg-copper/5'
                )}
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => toggleBrand(brand)}
                  className="w-4 h-4 rounded accent-copper cursor-pointer"
                />
                <span className="flex-1">{brand}</span>
                <span className="text-[10px] text-ink/40 dark:text-night-ink/40">
                  {count.toLocaleString('fa-IR')}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* قیمت */}
      <div>
        <h3 className="font-display font-bold text-xs text-ink/60 dark:text-night-ink/60 mb-3 uppercase tracking-wider">
          بازه قیمت
        </h3>
        <div className="flex justify-between text-[11px] text-ink/60 dark:text-night-ink/60 mb-2">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={STEP}
          value={priceRange[1]}
          onChange={(e) =>
            setPriceRange([priceRange[0], Number(e.target.value)])
          }
          className="w-full accent-copper cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-ink/40 dark:text-night-ink/40 mt-1">
          <span>{formatPrice(MIN_PRICE)}</span>
          <span>{formatPrice(MAX_PRICE)}</span>
        </div>
      </div>

      {/* موجودی */}
      <div>
        <label className="flex items-center gap-2.5 text-sm cursor-pointer px-2 py-1.5 rounded-lg hover:bg-copper/5 transition-colors">
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={(e) => setOnlyInStock(e.target.checked)}
            className="w-4 h-4 rounded accent-copper cursor-pointer"
          />
          <span className="text-ink/70 dark:text-night-ink/70">
            فقط کالاهای موجود
          </span>
        </label>
      </div>

      <Button onClick={reset} variant="outline" size="sm" className="w-full">
        <RotateCcw className="w-3.5 h-3.5" />
        بازنشانی همه فیلترها
      </Button>
    </aside>
  );
}