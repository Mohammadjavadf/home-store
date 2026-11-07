import { useCartStore } from '../store/cartStore';

export function useCartCount(): number {
  return useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
}