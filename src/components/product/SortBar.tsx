import { ArrowUpDown, Search, X } from 'lucide-react';
import { useFilterStore, type SortOption } from '../../store/filterStore';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'popular', label: 'محبوب‌ترین' },
  { value: 'price-asc', label: 'ارزان‌ترین' },
  { value: 'price-desc', label: 'گران‌ترین' },
  { value: 'rating', label: 'بیشترین امتیاز' },
];

interface SortBarProps {
  resultCount: number;
}

export default function SortBar({ resultCount }: SortBarProps) {
  const { search, setSearch, sort, setSort } = useFilterStore();

  return (
    <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* جستجو */}
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40 dark:text-night-ink/40 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی محصول، برند یا دسته..."
            className="w-full pr-10 pl-10 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10
                       text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40
                       focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-ink/10 dark:bg-white/10 flex items-center justify-center hover:bg-copper hover:text-white text-ink/60 dark:text-night-ink/60 transition-colors"
              aria-label="پاک کردن جستجو"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* سورت */}
        <div className="relative sm:w-56">
          <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40 dark:text-night-ink/40 pointer-events-none" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="w-full appearance-none pr-10 pl-8 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10
                       text-sm text-ink dark:text-night-ink cursor-pointer
                       focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 dark:text-night-ink/40 pointer-events-none text-xs">
            ▾
          </span>
        </div>
      </div>

      <div className="mt-3 text-xs text-ink/50 dark:text-night-ink/50">
        {resultCount.toLocaleString('fa-IR')} محصول پیدا شد
      </div>
    </div>
  );
}