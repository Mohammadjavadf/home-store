import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppliedCoupon {
  code: string;
  percent: number;
  isPersonal: boolean;
}

interface CouponState {
  applied: AppliedCoupon | null;
  setApplied: (c: AppliedCoupon | null) => void;
  clear: () => void;
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set) => ({
      applied: null,
      setApplied: (c) => set({ applied: c }),
      clear: () => set({ applied: null }),
    }),
    { name: 'khanestore-coupon', version: 1 }
  )
);