import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Star,
  FileText,
  Eye,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import Button from '../../components/ui/Button';
import SmartImage from '../../components/ui/SmartImage';
import { useBlogStore } from '../../store/blogStore';
import { useBlogCommentsStore } from '../../store/blogCommentsStore';
import { usePageTitle } from '../../hooks/usePageTitle';
import { cn } from '../../lib/utils';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogList() {
  usePageTitle('مدیریت وبلاگ');

  const { posts, deletePost, toggleFeatured } = useBlogStore();
  const comments = useBlogCommentsStore((s) => s.comments);

  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return posts
      .filter((p) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
  }, [posts, search]);

  const postToDelete = posts.find((p) => p.slug === confirmDelete);

  const handleDelete = () => {
    if (confirmDelete) {
      deletePost(confirmDelete);
      toast.success('مقاله حذف شد');
    }
  };

  const handleToggleFeatured = (slug: string, current: boolean) => {
    toggleFeatured(slug);
    toast.success(current ? 'از ویژه خارج شد' : 'به ویژه اضافه شد');
  };

  return (
    <div>
      <PageHeader
        title="وبلاگ"
        description={`${posts.length.toLocaleString('fa-IR')} مقاله`}
        actions={
          <Link to="/admin/blog/new">
            <Button size="sm">
              <Plus className="w-4 h-4" />
              افزودن مقاله
            </Button>
          </Link>
        }
      />

      {/* جستجو */}
      <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-3 mb-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40 dark:text-night-ink/40 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی عنوان، خلاصه یا تگ..."
            className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all"
          />
        </div>
      </div>

      {/* لیست */}
      {filtered.length === 0 ? (
        <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-12 text-center">
          <FileText className="w-12 h-12 text-copper/40 mx-auto mb-4" />
          <h3 className="font-display font-bold mb-2">
            {posts.length === 0 ? 'هنوز مقاله‌ای نیست' : 'مقاله‌ای پیدا نشد'}
          </h3>
          <p className="text-sm text-ink/60 dark:text-night-ink/60 mb-5">
            {posts.length === 0
              ? 'اولین مقاله را اضافه کن'
              : 'عبارت جستجو را تغییر بده'}
          </p>
          {posts.length === 0 && (
            <Link to="/admin/blog/new">
              <Button>
                <Plus className="w-4 h-4" />
                افزودن مقاله
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          <AnimatePresence>
            {filtered.map((p) => {
              const commentCount = comments.filter((c) => c.postSlug === p.slug).length;
              return (
                <motion.div
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft overflow-hidden hover:shadow-glow transition-shadow"
                >
                  <div className="relative aspect-video overflow-hidden bg-cream dark:bg-night">
                    <SmartImage
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full"
                    />
                    {p.featured && (
                      <div className="absolute top-2 right-2 bg-copper text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        ویژه
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-1.5 text-[10px] text-ink/50 dark:text-night-ink/50 flex-wrap">
                      <span className="bg-copper/10 text-copper font-bold px-1.5 py-0.5 rounded-full">
                        {p.category}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {p.readTime} دقیقه
                      </span>
                      <span className="flex items-center gap-0.5">
                        <MessageSquare className="w-2.5 h-2.5" />
                        {commentCount.toLocaleString('fa-IR')}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-sm text-ink dark:text-night-ink line-clamp-2 mb-1 min-h-[2.5rem]">
                      {p.title}
                    </h3>
                    <div className="text-[10px] text-ink/50 dark:text-night-ink/50 mb-2">
                      {formatDate(p.publishedAt)} · {p.author.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/blog/${p.slug}`}
                        target="_blank"
                        className="flex-1 h-8 rounded-lg bg-copper/10 hover:bg-copper/20 flex items-center justify-center text-copper transition-colors"
                        title="مشاهده در سایت"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleToggleFeatured(p.slug, !!p.featured)}
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                          p.featured
                            ? 'bg-copper text-white'
                            : 'bg-cream dark:bg-night text-ink/40 dark:text-night-ink/40 hover:text-copper'
                        )}
                        title={p.featured ? 'حذف از ویژه' : 'افزودن به ویژه'}
                      >
                        <Star className={cn('w-3.5 h-3.5', p.featured && 'fill-current')} />
                      </button>
                      <Link
                        to={`/admin/blog/${p.slug}/edit`}
                        className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 hover:bg-blue-500/20 transition-colors"
                        title="ویرایش"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => setConfirmDelete(p.slug)}
                        className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500/20 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
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
        title="حذف مقاله"
        message={`آیا از حذف «${postToDelete?.title || 'این مقاله'}» مطمئنی؟ این عمل قابل بازگشت نیست.`}
        confirmLabel="حذف کن"
      />
    </div>
  );
}