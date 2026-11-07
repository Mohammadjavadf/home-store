import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types';

const MAX_COMPARE = 5;

interface CompareState {
  items: Product[];
  add: (p: Product) => boolean;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  isFull: () => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (p) => {
        if (get().items.length >= MAX_COMPARE) return false;
        if (get().items.some((i) => i.id === p.id)) return false;
        set({ items: [...get().items, p] });
        return true;
      },

      remove: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),

      clear: () => set({ items: [] }),

      has: (id) => get().items.some((i) => i.id === id),

      isFull: () => get().items.length >= MAX_COMPARE,
    }),
    { name: 'khanestore-compare', version: 1 }
  )
);

export { MAX_COMPARE };