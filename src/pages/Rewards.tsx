import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy,
  Star,
  Gift,
  Sparkles,
  ArrowLeft,
  Check,
  TrendingUp,
} from 'lucide-react';
import { useRewards } from '../hooks/useRewards';
import { TIERS } from '../store/rewardsStore';
import { cn } from '../lib/utils';
import Button from '../components/ui/Button';
import { usePageTitle } from '../hooks/usePageTitle';
import { Copy, Ticket } from 'lucide-react';
import { useState } from 'react';

export default function Rewards() {
    usePageTitle('باشگاه مشتریان')
const [copiedCode, setCopiedCode] = useState<string | null>(null);
const { points, tier, nextTier, progress, pointsToNext, coupons } = useRewards();
const copyCode = (code: string) => {
  navigator.clipboard.writeText(code);
  setCopiedCode(code);
  setTimeout(() => setCopiedCode(null), 1500);
};
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* هدر */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-copper/10 text-copper text-sm font-medium mb-4">
          <Trophy className="w-4 h-4" />
          باشگاه مشتریان خانه‌استور
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold mb-3 text-balance">
          با هر خرید، <span className="text-copper">پاداش</span> بگیر
        </h1>
        <p className="text-ink/60 dark:text-night-ink/60 max-w-xl mx-auto text-balance">
          هر ۱۰۰ هزار تومان خرید = ۱ امتیاز. با بالا رفتن سطح، تخفیف‌های بیشتری دریافت می‌کنی.
        </p>
      </div>

      {/* کارت وضعیت */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          'relative rounded-3xl overflow-hidden p-6 sm:p-8 mb-8 text-white shadow-glow',
          'bg-gradient-to-br',
          tier.gradient
        )}
      >
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-right">
            <div className="text-xs font-medium opacity-80 mb-1">سطح فعلی شما</div>
            <div className="text-3xl font-display font-extrabold mb-2">{tier.label}</div>
            <div className="text-sm opacity-90">
              {tier.discountPercent}٪ تخفیف اختصاصی روی همه خریدها
            </div>
          </div>
          <div className="text-center">
            <div className="text-6xl font-display font-extrabold leading-none">
              {points.toLocaleString('fa-IR')}
            </div>
            <div className="text-xs opacity-80 mt-1">امتیاز</div>
          </div>
        </div>

        {/* نوار پیشرفت */}
        {nextTier && (
          <div className="mt-6 relative">
            <div className="flex items-center justify-between text-xs mb-2 opacity-90">
              <span>{tier.label}</span>
              <span>{nextTier.label}</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="h-full bg-white rounded-full"
              />
            </div>
            <div className="text-xs mt-2 opacity-90 text-center">
              {pointsToNext.toLocaleString('fa-IR')} امتیاز تا سطح {nextTier.label}
            </div>
          </div>
        )}
      </motion.div>
{/* کدهای تخفیف اختصاصی */}
{coupons.length > 0 && (
  <div className="mb-8">
    <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
      <Ticket className="w-5 h-5 text-copper" />
      کدهای تخفیف شما
    </h2>
    <div className="space-y-3">
      {coupons.map((c) => {
        const tier = TIERS.find((t) => t.key === c.tierKey);
        return (
          <div
            key={c.code}
            className={cn(
              'flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border-2 transition-all',
              c.used
                ? 'border-ink/10 dark:border-white/10 opacity-60'
                : 'border-copper/30 bg-copper/5'
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br text-white',
                  tier?.gradient ?? 'from-amber-700 to-amber-500'
                )}
              >
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-ink/50 dark:text-night-ink/50">
                  تخفیف {c.percent}٪ — سطح {tier?.label}
                </div>
                <div className="font-mono font-bold text-sm text-ink dark:text-night-ink select-all" dir="ltr">
                  {c.code}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {c.used ? (
                <span className="text-xs font-bold bg-ink/10 dark:bg-white/10 text-ink/50 dark:text-night-ink/50 px-3 py-1.5 rounded-full">
                  استفاده شده
                </span>
              ) : (
                <>
                  <span className="text-xs font-bold bg-forest/10 text-forest px-3 py-1.5 rounded-full">
                    فعال
                  </span>
                  <button
                    onClick={() => copyCode(c.code)}
                    className="flex items-center gap-1.5 text-xs text-copper hover:text-copper-dark font-medium px-3 py-1.5 rounded-lg hover:bg-copper/10 transition-colors"
                  >
                    {copiedCode === c.code ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        کپی شد
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        کپی
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
    <p className="text-xs text-ink/50 dark:text-night-ink/50 mt-3">
      این کدها اختصاصی شما هستند و فقط یک بار قابل استفاده‌اند.
    </p>
  </div>
)}
      {/* سطوح */}
      <div className="mb-8">
        <h2 className="text-xl font-display font-bold mb-4">سطوح باشگاه</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TIERS.map((t, i) => {
            const isCurrent = t.key === tier.key;
            const isUnlocked = points >= t.minPoints;
            return (
              <motion.div
                key={t.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={cn(
                  'relative p-5 rounded-2xl border-2 transition-all',
                  isCurrent
                    ? 'border-copper shadow-glow bg-copper/5'
                    : isUnlocked
                      ? 'border-forest/30 bg-forest/5'
                      : 'border-ink/10 dark:border-white/10 bg-surface dark:bg-night-surface'
                )}
              >
                {isCurrent && (
                  <div className="absolute -top-2 right-4 bg-copper text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    سطح فعلی
                  </div>
                )}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br text-white',
                      t.gradient
                    )}
                  >
                    <Trophy className="w-5 h-5" />
                  </div>
                  {isUnlocked && (
                    <Check className="w-5 h-5 text-forest" />
                  )}
                </div>
                <div className="font-display font-bold text-sm mb-1">{t.label}</div>
                <div className="text-xs text-ink/60 dark:text-night-ink/60 mb-2">
                  {t.minPoints.toLocaleString('fa-IR')}+ امتیاز
                </div>
                <div className="text-xs font-bold text-copper">
                  {t.discountPercent}٪ تخفیف
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* چطور امتیاز بگیرم */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-6">
          <div className="w-10 h-10 rounded-xl bg-copper/10 flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5 text-copper" />
          </div>
          <h3 className="font-display font-bold mb-2">چطور امتیاز بگیرم؟</h3>
          <ul className="text-sm text-ink/60 dark:text-night-ink/60 space-y-2">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-forest mt-0.5 shrink-0" />
              هر ۱۰۰ هزار تومان خرید = ۱ امتیاز
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-forest mt-0.5 shrink-0" />
              ثبت‌نام در باشگاه = ۵۰ امتیاز هدیه
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-forest mt-0.5 shrink-0" />
              نظر دادن روی محصولات = ۱۰ امتیاز
            </li>
          </ul>
        </div>

        <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-6">
          <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center mb-4">
            <Gift className="w-5 h-5 text-forest" />
          </div>
          <h3 className="font-display font-bold mb-2">پاداش‌ها</h3>
          <ul className="text-sm text-ink/60 dark:text-night-ink/60 space-y-2">
            <li className="flex items-start gap-2">
              <Star className="w-4 h-4 text-copper mt-0.5 shrink-0" />
              تخفیف اختصاصی روی همه خریدها
            </li>
            <li className="flex items-start gap-2">
              <Star className="w-4 h-4 text-copper mt-0.5 shrink-0" />
              دسترسی زودتر به محصولات جدید
            </li>
            <li className="flex items-start gap-2">
              <Star className="w-4 h-4 text-copper mt-0.5 shrink-0" />
              ارسال رایگان بدون حداقل خرید
            </li>
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link to="/products">
          <Button size="lg">
            <Sparkles className="w-4 h-4" />
            شروع خرید و جمع‌آوری امتیاز
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}