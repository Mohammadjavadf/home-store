import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Lock, Trash2, Edit3, Check } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useBlogCommentsStore } from '../../store/blogCommentsStore';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';
import BlogCommentForm from './BlogCommentForm';

interface BlogCommentsProps {
  postSlug: string;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogComments({ postSlug }: BlogCommentsProps) {
  const user = useAuthStore((s) => s.user);
  const { getPostComments, getUserComment, deleteComment } = useBlogCommentsStore();

  const comments = getPostComments(postSlug);
  const myComment = user ? getUserComment(postSlug, user.id) : undefined;

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <section className="mt-10 sm:mt-12 pt-8 border-t border-ink/10 dark:border-white/10">
      {/* هدر */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <h2 className="text-lg sm:text-xl font-display font-extrabold text-ink dark:text-night-ink flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-copper" />
          نظرات ({comments.length.toLocaleString('fa-IR')})
        </h2>

        {!user ? (
          <Link to="/login" state={{ from: `/blog/${postSlug}` }}>
            <Button variant="outline" size="sm">
              <Lock className="w-3.5 h-3.5" />
              برای ثبت نظر وارد شوید
            </Button>
          </Link>
        ) : myComment ? (
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
              ویرایش
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmDelete(myComment.id)}
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
          <div className="mb-4">
            <BlogCommentForm
              postSlug={postSlug}
              existing={editing ? myComment : undefined}
              onClose={() => {
                setShowForm(false);
                setEditing(false);
              }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* تایید حذف */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-4 flex items-center justify-between gap-3 flex-wrap mb-4"
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
                  deleteComment(confirmDelete);
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
      {comments.length === 0 ? (
        <div className="text-center py-8 text-sm text-ink/50 dark:text-night-ink/50">
          هنوز نظری ثبت نشده. اولین نفر باش!
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => {
            const isMine = user?.id === c.userId;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'p-4 rounded-xl border transition-colors',
                  isMine
                    ? 'border-copper/30 bg-copper/5'
                    : 'border-ink/5 dark:border-white/5 bg-surface dark:bg-night-surface'
                )}
              >
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-copper/10 flex items-center justify-center text-xs font-bold text-copper">
                      {c.userName.charAt(0)}
                    </div>
                    <span className="font-display font-bold text-sm text-ink dark:text-night-ink">
                      {c.userName}
                    </span>
                    {isMine && (
                      <span className="text-[10px] font-bold bg-copper text-white px-2 py-0.5 rounded-full">
                        شما
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-ink/40 dark:text-night-ink/40">
                    {formatDate(c.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-ink/70 dark:text-night-ink/70 leading-relaxed">
                  {c.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}