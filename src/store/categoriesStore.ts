import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_CATEGORIES = [
  'یخچال و فریزر',
  'شستشو',
  'پخت و پز',
  'نظافت',
  'سرمایش و گرمایش',
];

interface CategoriesState {
  categories: string[];
  addCategory: (name: string) => { ok: boolean; error?: string };
  updateCategory: (oldName: string, newName: string) => { ok: boolean; error?: string };
  deleteCategory: (name: string) => void;
  resetToDefault: () => void;
}

export const useCategoriesStore = create<CategoriesState>()(
  persist(
    (set, get) => ({
      categories: DEFAULT_CATEGORIES,

      addCategory: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return { ok: false, error: 'نام دسته خالی است' };
        if (get().categories.includes(trimmed)) {
          return { ok: false, error: 'این دسته قبلاً وجود دارد' };
        }
        set((s) => ({ categories: [...s.categories, trimmed] }));
        return { ok: true };
      },

      updateCategory: (oldName, newName) => {
        const trimmed = newName.trim();
        if (!trimmed) return { ok: false, error: 'نام دسته خالی است' };
        if (oldName === trimmed) return { ok: true };
        if (get().categories.includes(trimmed)) {
          return { ok: false, error: 'این نام قبلاً استفاده شده' };
        }
        set((s) => ({
          categories: s.categories.map((c) =>
            c === oldName ? trimmed : c
          ),
        }));
        return { ok: true };
      },

      deleteCategory: (name) =>
        set((s) => ({
          categories: s.categories.filter((c) => c !== name),
        })),

      resetToDefault: () => set({ categories: DEFAULT_CATEGORIES }),
    }),
    { name: 'khanestore-categories', version: 1 }
  )
);