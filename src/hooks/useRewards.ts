import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import {
  useRewardsStore,
  getTier,
  getNextTier,
} from '../store/rewardsStore';

const EMPTY: never[] = [];

export function useRewards() {
  const userId = useAuthStore((s) => s.user?.id ?? null);

  // ⬇️ هر selector فقط یک مقدار ساده برمی‌گرداند
  const points = useRewardsStore((s) =>
    userId ? s.pointsByUser[userId] ?? 0 : 0
  );

  // آرایه را با رفرنس ثابت برمی‌گردانیم
  const coupons = useRewardsStore((s) =>
    userId ? s.couponsByUser[userId] ?? EMPTY : EMPTY
  );

  // ⚠️ تابع را از store خارج از selector بگیر
  const ensureCouponForTier = useRewardsStore((s) => s.ensureCouponForTier);

  const tier = getTier(points);
  const nextTier = getNextTier(points);

  useEffect(() => {
    if (userId) {
      ensureCouponForTier(userId);
    }
  }, [userId, tier.key, ensureCouponForTier]);

  const progress = nextTier
    ? Math.min(
        100,
        Math.round(
          ((points - tier.minPoints) /
            (nextTier.minPoints - tier.minPoints)) *
            100
        )
      )
    : 100;

  const pointsToNext = nextTier ? nextTier.minPoints - points : 0;

  return { points, tier, nextTier, progress, pointsToNext, coupons, userId };
}