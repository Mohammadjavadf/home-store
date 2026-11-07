import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PublicCoupon {
  id: string;
  code: string;
  percent: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  active: boolean;
}

interface PublicCouponsState {
  coupons: PublicCoupon[];
  addCoupon: (
    data: Omit<PublicCoupon, 'id' | 'usedCount' | 'active'>
  ) => { ok: boolean; error?: string };
  deleteCoupon: (id: string) => void;
  toggleActive: (id: string) => void;
  incrementUsage: (code: string) => boolean;
  findByCode: (code: string) => PublicCoupon | undefined;
}

export const usePublicCouponsStore = create<PublicCouponsState>()(
  persist(
    (set, get) => ({
      coupons: [],

      addCoupon: (data) => {
        const code = data.code.trim().toUpperCase();
        if (!code) return { ok: false, error: 'کد را وارد کنید' };
        if (!/^[A-Z0-9]{3,20}$/.test(code))
          return { ok: false, error: 'کد باید ۳-۲۰ کاراکتر انگلیسی/عدد باشد' };
        if (get().coupons.some((c) => c.code === code))
          return { ok: false, error: 'این کد قبلاً وجود دارد' };

        const newCoupon: PublicCoupon = {
          id: `c-${Date.now()}`,
          code,
          percent: data.percent,
          maxUses: data.maxUses,
          expiresAt: data.expiresAt,
          usedCount: 0,
          active: true,
        };

        set((s) => ({ coupons: [newCoupon, ...s.coupons] }));
        return { ok: true };
      },

      deleteCoupon: (id) =>
        set((s) => ({ coupons: s.coupons.filter((c) => c.id !== id) })),

      toggleActive: (id) =>
        set((s) => ({
          coupons: s.coupons.map((c) =>
            c.id === id ? { ...c, active: !c.active } : c
          ),
        })),

      incrementUsage: (code) => {
        const coupon = get().coupons.find(
          (c) => c.code.toUpperCase() === code.trim().toUpperCase()
        );
        if (!coupon) return false;
        if (!coupon.active) return false;
        if (coupon.usedCount >= coupon.maxUses) return false;

        const now = new Date().toISOString().split('T')[0];
        if (coupon.expiresAt < now) return false;

        set((s) => ({
          coupons: s.coupons.map((c) =>
            c.id === coupon.id ? { ...c, usedCount: c.usedCount + 1 } : c
          ),
        }));
        return true;
      },

      findByCode: (code) =>
        get().coupons.find(
          (c) => c.code.toUpperCase() === code.trim().toUpperCase()
        ),
    }),
    { name: 'khanestore-public-coupons-v2', version: 2 }
  )
);