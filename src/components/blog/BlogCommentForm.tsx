import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, X, Check } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useBlogCommentsStore, type BlogComment } from '../../store/blogCommentsStore';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';

interface BlogCommentFormProps {
  postSlug: string;
  existing?: BlogComment;
  onClose?: () => void;
}

export default function BlogCommentForm({
  postSlug,
  existing,
  onClose,
}: BlogCommentFormProps) {
  const user = useAuthStore((s) => s.user);
  const { addComment, updateComment } = useBlogCommentsStore();

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
    if (text.trim().length < 10) {
      setError('متن نظر باید حداقل ۱۰ کاراکتر باشد');
      return;
    }

    if (existing) {
      updateComment(existing.id, text);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose?.();
      }, 1200);
    } else {
      const res = addComment({
        postSlug,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`.trim() || user.email,
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

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-cream dark:bg-night rounded-2xl border border-ink/5 dark:border-white/5 p-4 sm:p-5 relative"
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

      <h3 className="font-display font-bold text-sm mb-3">
        {existing ? 'ویرایش نظر' : 'ثبت نظر جدید'}
      </h3>

      <div className="mb-3">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError('');
          }}
          rows={4}
          placeholder="نظر خود را درباره این مقاله بنویسید... (حداقل ۱۰ کاراکتر)"
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