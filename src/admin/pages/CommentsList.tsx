import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Trash2,
  Search,
  Package,
  FileText,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import { useReviewsStore } from '../../store/reviewsStore';
import { useBlogCommentsStore } from '../../store/blogCommentsStore';
import { useProductsStore } from '../../store/productsStore';
import { useBlogStore } from '../../store/blogStore';
import { usePageTitle } from '../../hooks/usePageTitle';
import { cn } from '../../lib/utils';

type Tab = 'products' | 'blog';

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function CommentsList() {
  usePageTitle('مدیریت نظرات');

  const productReviews = useReviewsStore((s) => s.reviews);
  const deleteProductReview = useReviewsStore((s) => s.deleteReview);
  const blogComments = useBlogCommentsStore((s) => s.comments);
  const deleteBlogComment = useBlogCommentsStore((s) => s.deleteComment);
  const products = useProductsStore((s) => s.products);
  const posts = useBlogStore((s) => s.posts);

  const [tab, setTab] = useState<Tab>('products');
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<{
    type: Tab;
    id: string;
  } | null>(null);

  const filteredProductReviews = useMemo(() => {
    if (!search.trim()) return productReviews;
    const q = search.toLowerCase();
    return productReviews.filter(
      (r) =>
        r.userName.toLowerCase().includes(q) ||
        r.text.toLowerCase().includes(q)
    );
  }, [productReviews, search]);

  const filteredBlogComments = useMemo(() => {
    if (!search.trim()) return blogComments;
    const q = search.toLowerCase();
    return blogComments.filter(
      (c) =>
        c.userName.toLowerCase().includes(q) ||
        c.text.toLowerCase().includes(q)
    );
  }, [blogComments, search]);

  const handleDelete = () => {
    if (!confirmDelete) return;
    if (confirmDelete.type === 'products') {
      deleteProductReview(confirmDelete.id);
      toast.success('نظر محصول حذف شد');
    } else {
      deleteBlogComment(confirmDelete.id);
      toast.success('نظر مقاله حذف شد');
    }
  };

  return (
    <div>
      <PageHeader
        title="نظرات"
        description={`${(productReviews.length + blogComments.length).toLocaleString('fa-IR')} نظر ثبت‌شده`}
      />

      {/* تب‌ها */}
      <div className="flex gap-1 mb-4 overflow-x-auto">
        <button
          onClick={() => setTab('products')}
          className={cn(
            'px-4 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap',
            tab === 'products'
              ? 'bg-copper text-white'
              : 'bg-surface dark:bg-night-surface text-ink/70 dark:text-night-ink/70 border border-ink/5 dark:border-white/5 hover:bg-copper/10'
          )}
        >
          <Package className="w-3.5 h-3.5" />
          نظرات محصولات ({productReviews.length.toLocaleString('fa-IR')})
        </button>
        <button
          onClick={() => setTab('blog')}
          className={cn(
            'px-4 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap',
            tab === 'blog'
              ? 'bg-copper text-white'
              : 'bg-surface dark:bg-night-surface text-ink/70 dark:text-night-ink/70 border border-ink/5 dark:border-white/5 hover:bg-copper/10'
          )}
        >
          <FileText className="w-3.5 h-3.5" />
          نظرات وبلاگ ({blogComments.length.toLocaleString('fa-IR')})
        </button>
      </div>

      {/* جستجو */}
      <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-3 mb-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40 dark:text-night-ink/40 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی نام کاربر یا متن..."
            className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all"
          />
        </div>
      </div>

      {/* محتوا */}
      {tab === 'products' ? (
        filteredProductReviews.length === 0 ? (
          <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-12 text-center">
            <MessageSquare className="w-12 h-12 text-copper/40 mx-auto mb-4" />
            <h3 className="font-display font-bold mb-2">نظری پیدا نشد</h3>
            <p className="text-sm text-ink/60 dark:text-night-ink/60">
              {productReviews.length === 0
                ? 'هنوز نظری برای محصولات ثبت نشده'
                : 'عبارت جستجو را تغییر بده'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filteredProductReviews.map((r) => {
                const product = products.find((p) => p.id === r.productId);
                return (
                  <motion.div
                    key={r.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-4"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-copper/10 flex items-center justify-center text-copper font-bold text-sm shrink-0">
                          {r.userName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-ink dark:text-night-ink truncate">
                            {r.userName}
                          </div>
                          <div className="text-[10px] text-ink/50 dark:text-night-ink/50 truncate">
                            {product ? product.name : 'محصول حذف‌شده'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-ink/50 dark:text-night-ink/50">
                          {formatDate(r.createdAt)}
                        </span>
                        <button
                          onClick={() =>
                            setConfirmDelete({ type: 'products', id: r.id })
                          }
                          className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-ink/40 dark:text-night-ink/40 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
                    <p className="text-xs text-ink/70 dark:text-night-ink/70 leading-relaxed">
                      {r.text}
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )
      ) : filteredBlogComments.length === 0 ? (
        <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-12 text-center">
          <MessageSquare className="w-12 h-12 text-copper/40 mx-auto mb-4" />
          <h3 className="font-display font-bold mb-2">نظری پیدا نشد</h3>
          <p className="text-sm text-ink/60 dark:text-night-ink/60">
            {blogComments.length === 0
              ? 'هنوز نظری برای مقالات ثبت نشده'
              : 'عبارت جستجو را تغییر بده'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filteredBlogComments.map((c) => {
              const post = posts.find((p) => p.slug === c.postSlug);
              return (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-4"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-copper/10 flex items-center justify-center text-copper font-bold text-sm shrink-0">
                        {c.userName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-ink dark:text-night-ink truncate">
                          {c.userName}
                        </div>
                        <div className="text-[10px] text-ink/50 dark:text-night-ink/50 truncate">
                          {post ? post.title : 'مقاله حذف‌شده'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-ink/50 dark:text-night-ink/50">
                        {formatDate(c.createdAt)}
                      </span>
                      <button
                        onClick={() =>
                          setConfirmDelete({ type: 'blog', id: c.id })
                        }
                        className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-ink/40 dark:text-night-ink/40 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-ink/70 dark:text-night-ink/70 leading-relaxed">
                    {c.text}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="حذف نظر"
        message="آیا از حذف این نظر مطمئنی؟"
        confirmLabel="حذف کن"
      />
    </div>
  );
}