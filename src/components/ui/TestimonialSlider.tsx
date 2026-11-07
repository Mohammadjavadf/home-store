import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Testimonial {
  name: string;
  role: string;
  text: string;
}

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

export default function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = () => {
    setDirection(-1);
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  };

  // چرخش خودکار هر ۶ ثانیه
  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const current = testimonials[index];

  return (
    <div className="relative max-w-3xl mx-auto">
      {/* کارت اصلی */}
      <div className="relative min-h-[280px] sm:min-h-[240px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="bg-surface dark:bg-night-surface rounded-3xl p-8 sm:p-10
                       border border-ink/5 dark:border-white/5 shadow-soft relative"
          >
            <Quote className="w-10 h-10 text-copper/20 absolute top-6 left-6" />

            <div className="flex gap-0.5 mb-5">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className="w-4 h-4 fill-copper text-copper" />
              ))}
            </div>

            <p className="text-base sm:text-lg text-ink/80 dark:text-night-ink/80 leading-relaxed mb-6 min-h-[4rem]">
              «{current.text}»
            </p>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-copper/10 flex items-center justify-center font-display font-bold text-copper text-lg">
                {current.name.charAt(0)}
              </div>
              <div>
                <div className="font-display font-bold text-sm text-ink dark:text-night-ink">
                  {current.name}
                </div>
                <div className="text-xs text-ink/50 dark:text-night-ink/50">
                  {current.role}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* کنترل‌ها */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={prev}
          aria-label="قبلی"
          className="w-10 h-10 rounded-xl bg-copper/10 hover:bg-copper hover:text-white text-copper
                     flex items-center justify-center transition-all duration-300 active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* نقاط */}
        <div className="flex items-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              aria-label={`نظر ${i + 1}`}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                i === index
                  ? 'w-8 bg-copper'
                  : 'w-2 bg-copper/20 hover:bg-copper/40'
              )}
            />
          ))}
        </div>

        <button
          onClick={next}
          aria-label="بعدی"
          className="w-10 h-10 rounded-xl bg-copper/10 hover:bg-copper hover:text-white text-copper
                     flex items-center justify-center transition-all duration-300 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}