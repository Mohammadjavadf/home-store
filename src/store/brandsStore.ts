import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_BRANDS = [
  'سامسونگ',
  'ال‌جی',
  'بوش',
  'شیائومی',
  'بکو',
  'فیلیپس',
  'دلوونگی',
  'تفال',
];

interface BrandsState {
  brands: string[];
  addBrand: (name: string) => { ok: boolean; error?: string };
  updateBrand: (oldName: string, newName: string) => { ok: boolean; error?: string };
  deleteBrand: (name: string) => void;
  resetToDefault: () => void;
}

export const useBrandsStore = create<BrandsState>()(
  persist(
    (set, get) => ({
      brands: DEFAULT_BRANDS,

      addBrand: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return { ok: false, error: 'نام برند خالی است' };
        if (get().brands.includes(trimmed)) {
          return { ok: false, error: 'این برند قبلاً وجود دارد' };
        }
        set((s) => ({ brands: [...s.brands, trimmed] }));
        return { ok: true };
      },

      updateBrand: (oldName, newName) => {
        const trimmed = newName.trim();
        if (!trimmed) return { ok: false, error: 'نام برند خالی است' };
        if (oldName === trimmed) return { ok: true };
        if (get().brands.includes(trimmed)) {
          return { ok: false, error: 'این نام قبلاً استفاده شده' };
        }
        set((s) => ({
          brands: s.brands.map((b) => (b === oldName ? trimmed : b)),
        }));
        return { ok: true };
      },

      deleteBrand: (name) =>
        set((s) => ({ brands: s.brands.filter((b) => b !== name) })),

      resetToDefault: () => set({ brands: DEFAULT_BRANDS }),
    }),
    { name: 'khanestore-brands', version: 1 }
  )
);