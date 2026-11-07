import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types';
import { products as seedProducts } from '../data/products';
import { useNotificationsStore } from './notificationsStore';

interface ProductsState {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleFeatured: (id: string) => void;
  toggleStock: (id: string) => void;
  getById: (id: string) => Product | undefined;
  getFeatured: () => Product[];
  resetToSeed: () => void;
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: seedProducts,

      addProduct: (product) => {
        const newProduct: Product = {
          ...product,
          id: `prod-${Date.now()}`,
        };
        set((s) => ({ products: [newProduct, ...s.products] }));
        return newProduct;
      },

      updateProduct: (id, updates) =>
        set((s) => ({
          products: s.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      deleteProduct: (id) =>
        set((s) => ({
          products: s.products.filter((p) => p.id !== id),
        })),

      toggleFeatured: (id) =>
        set((s) => ({
          products: s.products.map((p) =>
            p.id === id ? { ...p, featured: !p.featured } : p
          ),
        })),

      toggleStock: (id) => {
        const product = get().products.find((p) => p.id === id);
        if (!product) return;

        const newStock = !product.inStock;

        set((s) => ({
          products: s.products.map((p) =>
            p.id === id ? { ...p, inStock: newStock } : p
          ),
        }));

        // اعلان ناموجود شدن
        if (!newStock) {
          useNotificationsStore.getState().addNotification({
            type: 'stock',
            title: 'محصول ناموجود شد',
            message: `«${product.name}» ناموجود شد. موجودی را بررسی کن.`,
            link: `/admin/products/${id}/edit`,
          });
        }
      },

      getById: (id) => get().products.find((p) => p.id === id),

      getFeatured: () => get().products.filter((p) => p.featured),

      resetToSeed: () => set({ products: seedProducts }),
    }),
    { name: 'khanestore-products', version: 1 }
  )
);