import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem } from '../types';

interface AddItemOptions {
  quantity?: number;
  selectedVariant?: { name: string; option: string };
  finalPrice?: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, opts?: AddItemOptions | number) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, opts = {}) => {
        const options: AddItemOptions =
          typeof opts === 'number' ? { quantity: opts } : opts;
        const quantity = options.quantity ?? 1;
        const variant = options.selectedVariant;
        const finalPrice = options.finalPrice ?? product.price;

        const itemKey = variant
          ? `${product.id}::${variant.name}=${variant.option}`
          : product.id;

        set((state) => {
          const existing = state.items.find((i) => i._key === itemKey);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i._key === itemKey
                  ? { ...i, quantity: Math.min(10, i.quantity + quantity) }
                  : i
              ),
            };
          }
          const newItem: CartItem = {
            ...product,
            _key: itemKey,
            quantity,
            selectedVariant: variant,
            finalPrice,
          };
          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (key) =>
        set((state) => ({
          items: state.items.filter(
            (i) => i._key !== key && i.id !== key
          ),
        })),

      updateQuantity: (key, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (i) => i._key !== key && i.id !== key
              ),
            };
          }
          return {
            items: state.items.map((i) =>
              i._key === key || i.id === key
                ? { ...i, quantity: Math.min(10, quantity) }
                : i
            ),
          };
        }),

      clearCart: () => set({ items: [] }),

      getTotalPrice: () =>
        get().items.reduce(
          (sum, i) => sum + (i.finalPrice ?? i.price) * i.quantity,
          0
        ),

      getTotalCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'khanestore-cart', version: 2 }
  )
);