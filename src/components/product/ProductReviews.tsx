import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Lock, Trash2, Edit3, Check } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useReviewsStore } from '../../store/reviewsStore';
import { useProductRating } from '../../hooks/useProductRating';
import type { Product } from '../../types';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';
import ReviewForm from './ReviewForm';

interface ProductReviewsProps {
  product: Product;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ProductReviews({ product }: ProductReviewsProps) {
  const user = useAuthStore((s) => s.user);
  const deleteReview = useReviewsStore((s) => s.deleteReview);
  const { rating, count, userReviews } = useProductRating(product);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const myReview = user
    ? userReviews.find((r) => r.userId === user.id)
    : undefined;

  return (
    <div className="space-y-6">
      {/* خلاصه امتیاز */}
      <div className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl bg-cream dark:bg-night">
        <div className="text-center">
          <div className="text-4xl font-display font-extrabold text-copper">
            {rating.toLocaleString('fa-IR')}
          </div>
          <div className="flex gap-0.5 mt-1 justify-center">
            {Array.from({ length: 5 }).map((_, s) => (
              <Star
                key={s}
                className={cn(
                  'w-3 h-3',
                  s < Math.round(rating)
                    ? 'fill-copper text-copper'
                    : 'text-ink/20 dark:text-night-ink/20'
                )}
              />
            ))}
          </div>
        </div>
        <div className="flex-1 text-center sm:text-right">
          <div className="text-sm text-ink/70 dark:text-night-ink/70">
            بر اساس {count.toLocaleString('fa-IR')} نظر
          </div>
          <div className="text-xs text-ink/50 dark:text-night-ink/50 mt-1">
            {userReviews.length.toLocaleString('fa-IR')} نظر از کاربران سایت
          </div>
        </div>

        {/* دکمه ثبت نظر */}
        {!user ? (
          <Link to="/login" state={{ from: `/products/${product.id}` }}>
            <Button variant="outline" size="sm">
              <Lock className="w-3.5 h-3.5" />
              برای ثبت نظر وارد شوید
            </Button>
          </Link>
        ) : myReview ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditing(true);
                setShowForm(true);
              }}
            >
              <Edit3 className="w-3.5 h-3.5" />
              ویرایش نظر
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmDelete(myReview.id)}
              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <Trash2 className="w-3.5 h-3.5" />
              حذف
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            onClick={() => {
              setEditing(false);
              setShowForm(true);
            }}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            ثبت نظر
          </Button>
        )}
      </div>

      {/* فرم */}
      <AnimatePresence>
        {showForm && user && (
          <ReviewForm
            productId={product.id}
            existing={editing ? myReview : undefined}
            onClose={() => {
              setShowForm(false);
              setEditing(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* تایید حذف */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-4 flex items-center justify-between gap-3 flex-wrap"
          >
            <span className="text-sm text-red-600 dark:text-red-400">
              آیا از حذف نظر خود مطمئنی؟
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setConfirmDelete(null)}
              >
                انصراف
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  deleteReview(confirmDelete);
                  setConfirmDelete(null);
                }}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Check className="w-3.5 h-3.5" />
                حذف کن
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* لیست نظرات */}
      {userReviews.length === 0 ? (
        <div className="text-center py-8 text-sm text-ink/50 dark:text-night-ink/50">
          هنوز نظری برای این محصول ثبت نشده. اولین نفر باش!
        </div>
      ) : (
        <div className="space-y-3">
          {userReviews.map((r) => {
            const isMine = user?.id === r.userId;
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'p-4 rounded-xl border transition-colors',
                  isMine
                    ? 'border-copper/30 bg-copper/5'
                    : 'border-ink/5 dark:border-white/5'
                )}
              >
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-copper/10 flex items-center justify-center text-xs font-bold text-copper">
                      {r.userName.charAt(0)}
                    </div>
                    <span className="font-display font-bold text-sm text-ink dark:text-night-ink">
                      {r.userName}
                    </span>
                    {isMine && (
                      <span className="text-[10px] font-bold bg-copper text-white px-2 py-0.5 rounded-full">
                        شما
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-ink/40 dark:text-night-ink/40">
                    {formatDate(r.createdAt)}
                  </span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className={cn(
                        'w-3 h-3',
                        s < r.rating
                          ? 'fill-copper text-copper'
                          : 'text-ink/20 dark:text-night-ink/20'
                      )}
                    />
                  ))}
                </div>
                <p className="text-sm text-ink/70 dark:text-night-ink/70 leading-relaxed">
                  {r.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}