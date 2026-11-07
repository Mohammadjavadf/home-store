import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Tier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface TierInfo {
  key: Tier;
  label: string;
  minPoints: number;
  discountPercent: number;
  color: string;
  gradient: string;
}

export const TIERS: TierInfo[] = [
  { key: 'bronze', label: 'برنزی', minPoints: 0, discountPercent: 5, color: '#B87333', gradient: 'from-amber-700 to-amber-500' },
  { key: 'silver', label: 'نقره‌ای', minPoints: 100, discountPercent: 8, color: '#9CA3AF', gradient: 'from-gray-400 to-gray-300' },
  { key: 'gold', label: 'طلایی', minPoints: 300, discountPercent: 12, color: '#D4A373', gradient: 'from-yellow-500 to-amber-400' },
  { key: 'platinum', label: 'پلاتینیوم', minPoints: 700, discountPercent: 20, color: '#A78BFA', gradient: 'from-violet-500 to-fuchsia-400' },
];

export function getTier(points: number): TierInfo {
  return [...TIERS].reverse().find((t) => points >= t.minPoints) ?? TIERS[0];
}

export function getNextTier(points: number): TierInfo | null {
  return TIERS.find((t) => points < t.minPoints) ?? null;
}

/** کد تخفیف اختصاصی هر کاربر */
export interface Coupon {
  code: string;
  tierKey: Tier;
  percent: number;
  createdAt: number;
  used: boolean;
  usedAt?: number;
}

interface RewardsState {
  pointsByUser: Record<string, number>;
  couponsByUser: Record<string, Coupon[]>;
  addPoints: (userId: string, n: number) => void;
  redeemPoints: (userId: string, n: number) => boolean;
  getPoints: (userId: string | null | undefined) => number;
  /** تولید کد برای سطح فعلی (اگر قبلاً تولید نشده باشد) */
  ensureCouponForTier: (userId: string) => Coupon | null;
  /** اعتبارسنجی و مصرف کد */
  validateCoupon: (
    userId: string,
    code: string
  ) => { ok: boolean; coupon?: Coupon; error?: string };
  markCouponUsed: (userId: string, code: string) => void;
  reset: (userId?: string) => void;
}

function generateCode(tierKey: Tier, userId: string): string {
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  const shortUid = userId.slice(-4).toUpperCase();
  return `${tierKey.toUpperCase()}-${shortUid}-${random}`;
}

export const useRewardsStore = create<RewardsState>()(
  persist(
    (set, get) => ({
      pointsByUser: {},
      couponsByUser: {},

      addPoints: (userId, n) =>
        set((s) => ({
          pointsByUser: {
            ...s.pointsByUser,
            [userId]: Math.max(0, (s.pointsByUser[userId] ?? 0) + n),
          },
        })),

      redeemPoints: (userId, n) => {
        const current = get().pointsByUser[userId] ?? 0;
        if (current < n) return false;
        set((s) => ({
          pointsByUser: { ...s.pointsByUser, [userId]: current - n },
        }));
        return true;
      },

      getPoints: (userId) => {
        if (!userId) return 0;
        return get().pointsByUser[userId] ?? 0;
      },

      ensureCouponForTier: (userId) => {
        const points = get().pointsByUser[userId] ?? 0;
        const tier = getTier(points);
        const existing = (get().couponsByUser[userId] ?? []).find(
          (c) => c.tierKey === tier.key
        );
        if (existing) return existing;

        const coupon: Coupon = {
          code: generateCode(tier.key, userId),
          tierKey: tier.key,
          percent: tier.discountPercent,
          createdAt: Date.now(),
          used: false,
        };

        set((s) => ({
          couponsByUser: {
            ...s.couponsByUser,
            [userId]: [...(s.couponsByUser[userId] ?? []), coupon],
          },
        }));

        return coupon;
      },

      validateCoupon: (userId, code) => {
        const coupons = get().couponsByUser[userId] ?? [];
        const found = coupons.find(
          (c) => c.code.toUpperCase() === code.trim().toUpperCase()
        );
        if (!found) return { ok: false, error: 'کد تخفیف نامعتبر است' };
        if (found.used) return { ok: false, error: 'این کد قبلاً استفاده شده است' };

        // چک: آیا کاربر هنوز به سطح لازم رسیده؟
        const points = get().pointsByUser[userId] ?? 0;
        const tier = getTier(points);
        const requiredPoints = TIERS.find((t) => t.key === found.tierKey)?.minPoints ?? 0;
        if (points < requiredPoints) {
          return { ok: false, error: 'شما به سطح لازم برای این کد نرسیده‌اید' };
        }
        if (tier.key !== found.tierKey) {
          // سطح فعلی متفاوت است — ولی کد همان کد قدیمی است و معتبر
        }

        return { ok: true, coupon: found };
      },

      markCouponUsed: (userId, code) =>
        set((s) => ({
          couponsByUser: {
            ...s.couponsByUser,
            [userId]: (s.couponsByUser[userId] ?? []).map((c) =>
              c.code.toUpperCase() === code.trim().toUpperCase()
                ? { ...c, used: true, usedAt: Date.now() }
                : c
            ),
          },
        })),

      reset: (userId) => {
        if (userId) {
          set((s) => {
            const nextP = { ...s.pointsByUser };
            const nextC = { ...s.couponsByUser };
            delete nextP[userId];
            delete nextC[userId];
            return { pointsByUser: nextP, couponsByUser: nextC };
          });
        } else {
          set({ pointsByUser: {}, couponsByUser: {} });
        }
      },
    }),
    { name: 'khanestore-rewards-v3', version: 3 }
  )
);

export function pointsFromAmount(amount: number): number {
  return Math.floor(amount / 100_000);
}