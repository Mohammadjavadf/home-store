import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Calendar,
  Clock,
  Tag,
  Copy,
  Check,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { useBlogStore } from '../store/blogStore';
import SmartImage from '../components/ui/SmartImage';
import Button from '../components/ui/Button';
import { usePageTitle } from '../hooks/usePageTitle';
import BlogComments from '../components/blog/BlogComments';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  const posts = useBlogStore((s) => s.posts);
  const post = slug ? posts.find((p) => p.slug === slug) : undefined;

  usePageTitle(post?.title ?? 'مقاله');

  const [copied, setCopied] = useState(false);

  const related = useMemo(() => {
    if (!post) return [];
    return posts
      .filter((p) => p.slug !== post.slug)
      .sort((a, b) => {
        const aMatch = a.category === post.category ? 1 : 0;
        const bMatch = b.category === post.category ? 1 : 0;
        if (aMatch !== bMatch) return bMatch - aMatch;
        return (
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime()
        );
      })
      .slice(0, 3);
  }, [posts, post]);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-copper/10 flex items-center justify-center mb-6">
          <BookOpen className="w-10 h-10 text-copper" />
        </div>
        <h1 className="text-2xl font-display font-bold mb-3">مقاله پیدا نشد</h1>
        <p className="text-ink/60 dark:text-night-ink/60 mb-6">
          شاید حذف شده یا آدرس اشتباهه.
        </p>
        <Link to="/blog">
          <Button>بازگشت به وبلاگ</Button>
        </Link>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-ink/50 dark:text-night-ink/50 mb-4 sm:mb-6 flex-wrap">
        <Link to="/" className="hover:text-copper transition-colors">
          خانه
        </Link>
        <ChevronLeft className="w-3.5 h-3.5" />
        <Link to="/blog" className="hover:text-copper transition-colors">
          وبلاگ
        </Link>
        <ChevronLeft className="w-3.5 h-3.5" />
        <span className="text-ink dark:text-night-ink truncate max-w-[200px]">
          {post.title}
        </span>
      </nav>

      {/* هدر مقاله */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="bg-copper/10 text-copper text-xs font-bold px-2.5 py-1 rounded-full">
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-ink/50 dark:text-night-ink/50">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(post.publishedAt)}
          </span>
          <span className="flex items-center gap-1 text-xs text-ink/50 dark:text-night-ink/50">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime} دقیقه مطالعه
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold leading-tight text-ink dark:text-night-ink mb-4 text-balance">
          {post.title}
        </h1>

        <p className="text-sm sm:text-base text-ink/60 dark:text-night-ink/60 leading-relaxed mb-6 text-balance">
          {post.excerpt}
        </p>

        {/* نویسنده و اشتراک‌گذاری */}
        <div className="flex items-center justify-between gap-3 flex-wrap pb-6 border-b border-ink/10 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-copper/10 flex items-center justify-center font-display font-bold text-copper">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-bold text-ink dark:text-night-ink">
                {post.author.name}
              </div>
              <div className="text-xs text-ink/50 dark:text-night-ink/50">
                نویسنده خانه‌استور
              </div>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-copper hover:text-copper-dark font-medium px-3 py-2 rounded-xl hover:bg-copper/10 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                کپی شد
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                کپی لینک
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* تصویر اصلی */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="my-6 sm:my-8 rounded-2xl sm:rounded-3xl overflow-hidden bg-cream dark:bg-night border border-ink/5 dark:border-white/5"
      >
        <SmartImage
          src={post.image}
          alt={post.title}
          className="w-full aspect-[16/9]"
        />
      </motion.div>

      {/* محتوا */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="prose prose-sm sm:prose-base max-w-none text-ink/80 dark:text-night-ink/80
                   [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-ink [&_h2]:dark:text-night-ink
                   [&_h2]:text-lg [&_h2]:sm:text-xl [&_h2]:mt-6 [&_h2]:mb-3
                   [&_h3]:font-display [&_h3]:font-bold [&_h3]:text-base [&_h3]:mt-4 [&_h3]:mb-2
                   [&_p]:leading-relaxed [&_p]:mb-4
                   [&_ul]:list-disc [&_ul]:pr-6 [&_ul]:mb-4 [&_ul]:space-y-1
                   [&_li]:leading-relaxed
                   [&_strong]:text-ink [&_strong]:dark:text-night-ink"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* تگ‌ها */}
      {post.tags.length > 0 && (
        <div className="mt-8 pt-6 border-t border-ink/10 dark:border-white/10">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-copper" />
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-ink/70 dark:text-night-ink/70 bg-cream dark:bg-night px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* نظرات */}
      <BlogComments postSlug={post.slug} />

      {/* مقالات مرتبط */}
      {related.length > 0 && (
        <section className="mt-12 sm:mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-ink dark:text-night-ink">
              مقالات مرتبط
            </h2>
            <Link
              to="/blog"
              className="text-copper text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
            >
              همه مقالات
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {related.map((r, i) => (
              <motion.div
                key={r.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link to={`/blog/${r.slug}`} className="group block">
                  <div className="bg-surface dark:bg-night-surface rounded-2xl overflow-hidden border border-ink/5 dark:border-white/5 shadow-soft hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
                    <div className="relative aspect-[16/10] overflow-hidden bg-cream dark:bg-night">
                      <SmartImage
                        src={r.image}
                        alt={r.title}
                        className="w-full h-full"
                        imgClassName="transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <div className="text-[10px] text-copper font-bold mb-1">
                        {r.category}
                      </div>
                      <h3 className="font-display font-bold text-sm text-ink dark:text-night-ink line-clamp-2 group-hover:text-copper transition-colors">
                        {r.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mt-12 text-center">
        <Link to="/products">
          <Button size="lg">
            مشاهده محصولات
            <ArrowRight className="w-4 h-4 rotate-180" />
          </Button>
        </Link>
      </section>
    </div>
  );
}