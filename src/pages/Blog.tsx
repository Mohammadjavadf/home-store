import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  X,
  Clock,
  Calendar,
  BookOpen,
  ChevronLeft,
  MessageSquare,
} from 'lucide-react';
import { blogPosts, blogCategories, type BlogPost } from '../data/blog';
import { cn } from '../lib/utils';
import SmartImage from '../components/ui/SmartImage';
import FeaturedSlider from '../components/blog/FeaturedSlider';
import { useBlogCommentCount } from '../hooks/useBlogCommentCount';
import { usePageTitle } from '../hooks/usePageTitle';
import { useBlogStore } from '../store/blogStore';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function Blog() {
  usePageTitle('وبلاگ');
const posts = useBlogStore((s) => s.posts);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('همه');

 const featuredPosts = useMemo(
  () => posts.filter((p) => p.featured),
  [posts]
);

const filtered = useMemo(() => {
  return posts
    .filter((p) => {
      if (category !== 'همه' && p.category !== category) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const haystack = `${p.title} ${p.excerpt} ${p.tags.join(' ')}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}, [posts, search, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* هدر */}
      <div className="mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-copper/10 text-copper text-xs sm:text-sm font-medium mb-3 sm:mb-4">
          <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          وبلاگ خانه‌استور
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold mb-2 sm:mb-3">
          راهنما، مقایسه و نکات
        </h1>
        <p className="text-sm sm:text-base text-ink/60 dark:text-night-ink/60 max-w-2xl">
          مقالاتی برای انتخاب بهتر، نگهداری طولانی‌تر و زندگی راحت‌تر با لوازم خانگی.
        </p>
      </div>

      {/* اسلایدر مقاله‌های ویژه */}
      {featuredPosts.length > 0 && !search && category === 'همه' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <FeaturedSlider posts={featuredPosts} />
        </motion.div>
      )}

      {/* جستجو + دسته‌بندی */}
      <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-3 sm:p-4 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40 dark:text-night-ink/40 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو در مقالات..."
              className="w-full pr-10 pl-10 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-ink/10 dark:bg-white/10 flex items-center justify-center hover:bg-copper hover:text-white text-ink/60 dark:text-night-ink/60 transition-colors"
                aria-label="پاک کردن"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {blogCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap',
                category === cat
                  ? 'bg-copper text-white'
                  : 'bg-cream dark:bg-night text-ink/70 dark:text-night-ink/70 hover:bg-copper/10'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* لیست */}
      {filtered.length === 0 ? (
        <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-12 text-center">
          <BookOpen className="w-12 h-12 text-copper/40 mx-auto mb-4" />
          <h3 className="font-display font-bold mb-2">مقاله‌ای پیدا نشد</h3>
          <p className="text-sm text-ink/60 dark:text-night-ink/60">
            عبارت جستجو یا دسته‌بندی را تغییر بده.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((post, i) => (
            <PostCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function PostCard({ post, index }: { post: BlogPost; index: number }) {
  const commentsCount = useBlogCommentCount(post.slug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="group"
    >
      <Link to={`/blog/${post.slug}`}>
        <div className="bg-surface dark:bg-night-surface rounded-3xl overflow-hidden border border-ink/5 dark:border-white/5 shadow-soft hover:shadow-glow transition-all duration-500 hover:-translate-y-1 hover:border-copper/30">
          <div className="relative aspect-[16/10] overflow-hidden bg-cream dark:bg-night">
            <SmartImage
              src={post.image}
              alt={post.title}
              className="w-full h-full"
              imgClassName="transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute top-3 right-3 bg-surface/90 dark:bg-night/90 backdrop-blur-sm text-copper text-[10px] font-bold px-2 py-0.5 rounded-full">
              {post.category}
            </div>
          </div>
          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2 text-[10px] text-ink/50 dark:text-night-ink/50 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readTime} دقیقه
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {commentsCount.toLocaleString('fa-IR')}
              </span>
            </div>
            <h3 className="font-display font-bold text-base sm:text-lg text-ink dark:text-night-ink mb-2 line-clamp-2 group-hover:text-copper transition-colors min-h-[3.5rem]">
              {post.title}
            </h3>
            <p className="text-xs sm:text-sm text-ink/60 dark:text-night-ink/60 line-clamp-2 mb-3">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-ink/50 dark:text-night-ink/50">
                {post.author.name}
              </span>
              <span className="text-copper text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                مطالعه
                <ChevronLeft className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}