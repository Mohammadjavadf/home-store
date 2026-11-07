import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Calendar } from 'lucide-react';
import type { BlogPost } from '../../data/blog';
import SmartImage from '../ui/SmartImage';
import { cn } from '../../lib/utils';

interface FeaturedSliderProps {
  posts: BlogPost[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function FeaturedSlider({ posts }: FeaturedSliderProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const total = posts.length;

  const next = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i + 1) % total);
  }, [total]);

  const prev = () => {
    setDirection(-1);
    setIndex((i) => (i - 1 + total) % total);
  };

  useEffect(() => {
    if (paused || total <= 1) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next, paused, total]);

  if (total === 0) return null;

  const current = posts[index];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-ink/5 dark:border-white/5 shadow-soft bg-surface dark:bg-night-surface">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.slug}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Link to={`/blog/${current.slug}`} className="block group">
              {/* موبایل: چیدمان عمودی | دسکتاپ: دو ستون */}
              <div className="flex flex-col md:flex-row">
                {/* تصویر */}
                <div className="relative w-full md:w-1/2 aspect-[16/9] sm:aspect-[16/10] md:aspect-auto md:min-h-[320px] lg:min-h-[360px] overflow-hidden bg-cream dark:bg-night shrink-0">
                  <SmartImage
                    src={current.image}
                    alt={current.title}
                    className="w-full h-full"
                    imgClassName="transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 flex gap-1.5">
                    <span className="bg-copper text-white text-[9px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                      ویژه
                    </span>
                    <span className="bg-surface/90 dark:bg-night/90 backdrop-blur-sm text-copper text-[9px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                      {current.category}
                    </span>
                  </div>
                </div>

                {/* محتوا */}
                <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col justify-center min-w-0">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3 text-[10px] sm:text-xs text-ink/50 dark:text-night-ink/50 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(current.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {current.readTime} دقیقه
                    </span>
                  </div>

                  <h2 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-display font-extrabold mb-2 sm:mb-3 text-ink dark:text-night-ink group-hover:text-copper transition-colors line-clamp-2">
                    {current.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-ink/60 dark:text-night-ink/60 leading-relaxed mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                    {current.excerpt}
                  </p>

                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] sm:text-xs text-ink/50 dark:text-night-ink/50 truncate">
                      {current.author.name}
                    </span>
                    <span className="flex items-center gap-1 text-copper text-xs sm:text-sm font-medium group-hover:gap-2 transition-all shrink-0">
                      مطالعه مقاله
                      <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* کنترل‌ها */}
      {total > 1 && (
        <>
          {/* دکمه‌های قبلی/بعدی — فقط دسکتاپ */}
          <button
            onClick={prev}
            aria-label="مقاله قبلی"
            className="hidden sm:flex absolute top-1/2 -translate-y-1/2 right-2 sm:right-3 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface/90 dark:bg-night/90 backdrop-blur-sm border border-ink/10 dark:border-white/10 shadow-soft items-center justify-center text-copper hover:bg-copper hover:text-white transition-colors z-10"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={next}
            aria-label="مقاله بعدی"
            className="hidden sm:flex absolute top-1/2 -translate-y-1/2 left-2 sm:left-3 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface/90 dark:bg-night/90 backdrop-blur-sm border border-ink/10 dark:border-white/10 shadow-soft items-center justify-center text-copper hover:bg-copper hover:text-white transition-colors z-10"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* نقاط + دکمه‌های موبایل */}
          <div className="flex items-center justify-center gap-3 mt-3 sm:mt-4">
            {/* دکمه قبلی — موبایل */}
            <button
              onClick={prev}
              aria-label="مقاله قبلی"
              className="sm:hidden w-7 h-7 rounded-full bg-copper/10 flex items-center justify-center text-copper active:scale-95 transition-transform"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {posts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  aria-label={`مقاله ${i + 1}`}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    i === index
                      ? 'w-6 bg-copper'
                      : 'w-1.5 bg-copper/20 hover:bg-copper/40'
                  )}
                />
              ))}
            </div>

            {/* دکمه بعدی — موبایل */}
            <button
              onClick={next}
              aria-label="مقاله بعدی"
              className="sm:hidden w-7 h-7 rounded-full bg-copper/10 flex items-center justify-center text-copper active:scale-95 transition-transform"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}