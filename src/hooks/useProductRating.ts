import { useMemo } from 'react';
import { useReviewsStore } from '../store/reviewsStore';
import type { Product } from '../types';

export function useProductRating(product: Product | undefined) {
  const allReviews = useReviewsStore((s) => s.reviews);

  return useMemo(() => {
    if (!product) {
      return { rating: 0, count: 0, userReviews: [] };
    }

    const userReviews = allReviews.filter((r) => r.productId === product.id);
    const count = userReviews.length;

    if (count === 0) {
      return { rating: 0, count: 0, userReviews: [] };
    }

    const sum = userReviews.reduce((s, r) => s + r.rating, 0);
    const avg = sum / count;

    return {
      rating: Math.round(avg * 10) / 10,
      count,
      userReviews,
    };
  }, [product, allReviews]);
}