import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, X, Check } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useReviewsStore, type Review } from '../../store/reviewsStore';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';

interface ReviewFormProps {
  productId: string;
  existing?: Review;
  onClose?: () => void;
}

export default function ReviewForm({ productId, existing, onClose }: ReviewFormProps) {
  const user = useAuthStore((s) => s.user);
  const { addReview, updateReview } = useReviewsStore();

  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState(existing?.text ?? '');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaved(false);

    if (!user) {
      setError('برای ثبت نظر باید وارد شوید');
      return;
    }
    if (rating < 1) {
      setError('لطفاً امتیاز خود را انتخاب کنید');
      return;
    }
    if (text.trim().length < 10) {
      setError('متن نظر باید حداقل ۱۰ کاراکتر باشد');
      return;
    }

    if (existing) {
      updateReview(existing.id, rating, text);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose?.();
      }, 1200);
    } else {
      const res = addReview({
        productId,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`.trim() || user.email,
        rating,
        text,
      });
      if (!res.ok) {
        setError(res.error || 'خطا در ثبت نظر');
        return;
      }
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose?.();
      }, 1200);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-cream dark:bg-night rounded-2xl border border-ink/5 dark:border-white/5 p-5 relative"
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 left-3 w-8 h-8 rounded-lg hover:bg-copper/10 flex items-center justify-center text-ink/50 dark:text-night-ink/50 hover:text-copper transition-colors"
          aria-label="بستن"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <h3 className="font-display font-bold text-sm mb-4">
        {existing ? 'ویرایش نظر' : 'ثبت نظر جدید'}
      </h3>

      {/* امتیاز */}
      <div className="mb-4">
        <label className="block text-xs font-medium mb-2 text-ink/70 dark:text-night-ink/70">
          امتیاز شما
        </label>
        <div className="flex gap-1" dir="ltr">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
              aria-label={`${star} ستاره`}
            >
              <Star
                className={cn(
                  'w-7 h-7 transition-colors',
                  star <= displayRating
                    ? 'fill-copper text-copper'
                    : 'text-ink/20 dark:text-night-ink/20'
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* متن */}
      <div className="mb-4">
        <label className="block text-xs font-medium mb-2 text-ink/70 dark:text-night-ink/70">
          نظر شما
        </label>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError('');
          }}
          rows={4}
          placeholder="تجربه خود از این محصول را بنویسید... (حداقل ۱۰ کاراکتر)"
          className={cn(
            'w-full px-3 py-2.5 rounded-xl bg-surface dark:bg-night-surface border text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 transition-all focus:outline-none focus:ring-2 focus:ring-copper/20 resize-none',
            error
              ? 'border-red-500'
              : 'border-ink/10 dark:border-white/10 focus:border-copper'
          )}
        />
        <div className="flex justify-between text-[10px] text-ink/40 dark:text-night-ink/40 mt-1">
          <span>حداقل ۱۰ کاراکتر</span>
          <span>{text.trim().length.toLocaleString('fa-IR')} / ۵۰۰</span>
        </div>
      </div>

      {error && (
        <div className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg px-3 py-2 mb-3">
          {error}
        </div>
      )}

      <Button type="submit" size="sm" className="w-full sm:w-auto">
        {saved ? (
          <>
            <Check className="w-4 h-4" />
            ذخیره شد
          </>
        ) : existing ? (
          'ذخیره تغییرات'
        ) : (
          <>
            <Send className="w-4 h-4" />
            ثبت نظر
          </>
        )}
      </Button>
    </motion.form>
  );
}