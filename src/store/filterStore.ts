import { create } from 'zustand';
import { getPriceBounds } from '../data/products';

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popular';

// 🔽 بازه قیمت داینامیک — از روی داده‌های واقعی محصولات
const bounds = getPriceBounds();
export const MIN_PRICE = bounds.min;
export const MAX_PRICE = bounds.max;

interface FilterState {
  search: string;
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  onlyInStock: boolean;
  sort: SortOption;
  setSearch: (v: string) => void;
  toggleCategory: (c: string) => void;
  toggleBrand: (b: string) => void;
  setPriceRange: (r: [number, number]) => void;
  setOnlyInStock: (v: boolean) => void;
  setSort: (s: SortOption) => void;
  reset: () => void;
}

const initial = {
  search: '',
  categories: [] as string[],
  brands: [] as string[],
  priceRange: [MIN_PRICE, MAX_PRICE] as [number, number],
  onlyInStock: false,
  sort: 'newest' as SortOption,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initial,
  setSearch: (v) => set({ search: v }),
  toggleCategory: (c) =>
    set((s) => ({
      categories: s.categories.includes(c)
        ? s.categories.filter((x) => x !== c)
        : [...s.categories, c],
    })),
  toggleBrand: (b) =>
    set((s) => ({
      brands: s.brands.includes(b)
        ? s.brands.filter((x) => x !== b)
        : [...s.brands, b],
    })),
  setPriceRange: (r) => set({ priceRange: r }),
  setOnlyInStock: (v) => set({ onlyInStock: v }),
  setSort: (s) => set({ sort: s }),
  reset: () => set(initial),
}));