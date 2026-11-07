import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useNotificationsStore } from './notificationsStore';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  createdAt: number;
}

interface ReviewsState {
  reviews: Review[];
  addReview: (data: {
    productId: string;
    userId: string;
    userName: string;
    rating: number;
    text: string;
  }) => { ok: boolean; error?: string };
  updateReview: (id: string, rating: number, text: string) => void;
  deleteReview: (id: string) => void;
  getProductReviews: (productId: string) => Review[];
  getUserReview: (productId: string, userId: string) => Review | undefined;
}

export const useReviewsStore = create<ReviewsState>()(
  persist(
    (set, get) => ({
      reviews: [],

      addReview: (data) => {
        const existing = get().reviews.find(
          (r) => r.productId === data.productId && r.userId === data.userId
        );
        if (existing) {
          return { ok: false, error: 'شما قبلاً برای این محصول نظر داده‌اید' };
        }
        if (data.rating < 1 || data.rating > 5) {
          return { ok: false, error: 'امتیاز باید بین ۱ تا ۵ باشد' };
        }
        if (data.text.trim().length < 10) {
          return { ok: false, error: 'متن نظر باید حداقل ۱۰ کاراکتر باشد' };
        }

        const review: Review = {
          id: `rev-${Date.now()}`,
          ...data,
          text: data.text.trim(),
          createdAt: Date.now(),
        };

        set((s) => ({ reviews: [review, ...s.reviews] }));

        // اعلان نظر جدید
        useNotificationsStore.getState().addNotification({
          type: 'review',
          title: 'نظر جدید',
          message: `${data.userName} یک نظر ${data.rating} ستاره ثبت کرد`,
          link: '/admin/comments',
        });

        return { ok: true };
      },

      updateReview: (id, rating, text) =>
        set((s) => ({
          reviews: s.reviews.map((r) =>
            r.id === id
              ? { ...r, rating, text: text.trim(), createdAt: Date.now() }
              : r
          ),
        })),

      deleteReview: (id) =>
        set((s) => ({ reviews: s.reviews.filter((r) => r.id !== id) })),

      getProductReviews: (productId) =>
        get()
          .reviews.filter((r) => r.productId === productId)
          .sort((a, b) => b.createdAt - a.createdAt),

      getUserReview: (productId, userId) =>
        get().reviews.find(
          (r) => r.productId === productId && r.userId === userId
        ),
    }),
    { name: 'khanestore-reviews', version: 1 }
  )
);