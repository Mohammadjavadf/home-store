import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  Tag,
  X,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useRewardsStore } from '../store/rewardsStore';
import { useCouponStore } from '../store/couponStore';
import { formatPrice, cn } from '../lib/utils';
import Button from '../components/ui/Button';
import SmartImage from '../components/ui/SmartImage';
import { useMemo } from 'react';
import { usePublicCouponsStore } from '../store/publicCouponsStore';
import { useSettingsStore } from '../store/settingsStore';

const DISCOUNT_CODES: Record<string, number> = {
  HOME10: 10,
  WELCOME15: 15,
  KHANE20: 20,
};

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } =
    useCartStore();
  const user = useAuthStore((s) => s.user);
  const settings = useSettingsStore((s) => s.settings);
  const { findByCode, incrementUsage } = usePublicCouponsStore();
  const publicCoupons = useMemo(() => {
  try {
    const raw = localStorage.getItem('khanestore-public-coupons');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}, []);
  const validateCoupon = useRewardsStore((s) => s.validateCoupon);
  const {
    applied: appliedCoupon,
    setApplied: setAppliedCoupon,
    clear: clearCoupon,
  } = useCouponStore();

  const [coupon, setCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  const subtotal = getTotalPrice();
  const discountAmount = appliedCoupon
    ? Math.round((subtotal * appliedCoupon.percent) / 100)
    : 0;
const shipping =
  subtotal >= settings.freeShippingThreshold || subtotal === 0
    ? 0
    : settings.shippingCost;
      const total = subtotal - discountAmount + shipping;

  const handleApplyCoupon = () => {
  const code = coupon.trim().toUpperCase();
  setCouponError('');
  if (!code) return;

  // ۱. کدهای ثابت
  if (DISCOUNT_CODES[code]) {
    setAppliedCoupon({
      code,
      percent: DISCOUNT_CODES[code],
      isPersonal: false,
    });
    setCoupon('');
    return;
  }

  // ۲. کدهای عمومی از ادمین
  const publicCoupon = findByCode(code);
  if (publicCoupon) {
    if (!publicCoupon.active) {
      setCouponError('این کد غیرفعال است');
      return;
    }
    const now = new Date().toISOString().split('T')[0];
    if (publicCoupon.expiresAt < now) {
      setCouponError('این کد منقضی شده است');
      return;
    }
    if (publicCoupon.usedCount >= publicCoupon.maxUses) {
      setCouponError('ظرفیت این کد تکمیل شده است');
      return;
    }
    setAppliedCoupon({
      code: publicCoupon.code,
      percent: publicCoupon.percent,
      isPersonal: false,
    });
    setCoupon('');
    return;
  }

  // ۳. کد اختصاصی باشگاه
  if (user) {
    const res = validateCoupon(user.id, code);
    if (res.ok && res.coupon) {
      setAppliedCoupon({
        code: res.coupon.code,
        percent: res.coupon.percent,
        isPersonal: true,
      });
      setCoupon('');
      return;
    }
    setCouponError(res.error || 'کد تخفیف نامعتبر است');
    return;
  }

  setCouponError('کد تخفیف نامعتبر است');
};

  const handleClearCart = () => {
    clearCart();
    clearCoupon();
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-24 h-24 mx-auto rounded-3xl bg-copper/10 flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-copper" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold mb-3">
          سبد خریدت خالیه
        </h1>
        <p className="text-ink/60 dark:text-night-ink/60 mb-8 max-w-md mx-auto">
          هنوز محصولی به سبد اضافه نکردی. بیا از محصولات ما دیدن کن.
        </p>
        <Link to="/products">
          <Button size="lg">
            شروع خرید
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold mb-1">
            سبد خرید
          </h1>
          <p className="text-sm text-ink/60 dark:text-night-ink/60">
            {items.length.toLocaleString('fa-IR')} محصول در سبد شما
          </p>
        </div>
        <button
          onClick={handleClearCart}
          className="text-xs text-copper hover:text-copper-dark flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          خالی کردن سبد
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item._key}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-4"
              >
                <div className="flex gap-4">
                  <Link to={`/products/${item.id}`} className="shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-cream dark:bg-night">
                      <SmartImage src={item.image} alt={item.name} className="w-full h-full" />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-copper bg-copper/10 px-2 py-0.5 rounded-full inline-block mb-1">
                          {item.brand}
                        </span>
                        <Link to={`/products/${item.id}`}>
                          <h3 className="font-display font-bold text-sm sm:text-base text-ink dark:text-night-ink hover:text-copper transition-colors line-clamp-2">
                            {item.name}
                          </h3>
                        </Link>
                        {item.selectedVariant && (
                          <div className="text-[10px] text-copper mt-1">
                            {item.selectedVariant.name}: {item.selectedVariant.option}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item._key)}
                        className="w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center justify-center text-ink/40 dark:text-night-ink/40 hover:text-red-500 transition-colors shrink-0"
                        aria-label="حذف"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-end justify-between gap-2 mt-3 flex-wrap">
                      <div className="inline-flex items-center bg-cream dark:bg-night rounded-lg border border-ink/10 dark:border-white/10">
                        <button
                          onClick={() => updateQuantity(item._key, item.quantity + 1)}
                          disabled={item.quantity >= 10}
                          className="w-8 h-8 flex items-center justify-center text-ink dark:text-night-ink hover:text-copper rounded-r-lg transition-colors disabled:opacity-30"
                          aria-label="افزایش"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-ink dark:text-night-ink">
                          {item.quantity.toLocaleString('fa-IR')}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._key, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-ink dark:text-night-ink hover:text-copper rounded-l-lg transition-colors"
                          aria-label="کاهش"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-left">
                        <div className="text-xs text-ink/40 dark:text-night-ink/40">
                          {formatPrice(item.finalPrice ?? item.price)} × {item.quantity.toLocaleString('fa-IR')}
                        </div>
                        <div className="font-display font-extrabold text-copper text-sm">
                          {formatPrice((item.finalPrice ?? item.price) * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5 lg:sticky lg:top-20"
        >
          <h2 className="font-display font-bold text-base mb-4">خلاصه سفارش</h2>

          <div className="mb-4">
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-forest/10 border border-forest/20 rounded-xl px-3 py-2">
                <div className="flex items-center gap-2 text-forest text-xs font-medium flex-wrap">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{appliedCoupon.code}</span>
                  <span className="text-forest/70">({appliedCoupon.percent}٪)</span>
                  {appliedCoupon.isPersonal && (
                    <span className="text-[9px] font-bold bg-forest text-white px-1.5 py-0.5 rounded-full">
                      اختصاصی
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setAppliedCoupon(null)}
                  className="text-forest/60 hover:text-forest shrink-0"
                  aria-label="حذف کد"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => {
                      setCoupon(e.target.value);
                      setCouponError('');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    placeholder="کد تخفیف"
                    className="flex-1 px-3 py-2 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 rounded-xl bg-copper text-white text-sm font-medium hover:bg-copper-dark transition-colors"
                  >
                    اعمال
                  </button>
                </div>
                {couponError && (
                  <p className="text-xs text-red-500 mt-1.5">{couponError}</p>
                )}
                {user && (
                  <p className="text-[10px] text-ink/40 dark:text-night-ink/40 mt-1.5">
                    کد اختصاصی باشگاه را از صفحه «باشگاه من» بردار
                  </p>
                )}
              </>
            )}
          </div>

          <div className="space-y-2.5 py-4 border-t border-ink/5 dark:border-white/5 text-sm">
            <div className="flex justify-between text-ink/70 dark:text-night-ink/70">
              <span>جمع کل</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-forest">
                <span>تخفیف</span>
                <span>−{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-ink/70 dark:text-night-ink/70">
              <span>هزینه ارسال</span>
              <span className={cn(shipping === 0 && 'text-forest')}>
                {shipping === 0 ? 'رایگان' : formatPrice(shipping)}
              </span>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-ink/5 dark:border-white/5 mb-4">
            <span className="font-display font-bold text-ink dark:text-night-ink">
              مبلغ نهایی
            </span>
            <span className="font-display font-extrabold text-copper text-lg">
              {formatPrice(total)}
            </span>
          </div>

          <Link to="/checkout">
            <Button className="w-full" size="lg">
              ادامه و تسویه
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>

          <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] text-ink/50 dark:text-night-ink/50">
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-copper" />
              ارسال سریع
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-copper" />
              پرداخت امن
            </div>
          </div>

{subtotal > 0 && subtotal < settings.freeShippingThreshold && (
  <p className="text-[11px] text-copper mt-3 text-center">
    {formatPrice(settings.freeShippingThreshold - subtotal)} دیگه خرید کن تا ارسال رایگان بشه!
  </p>
)}
        </motion.aside>
      </div>
    </div>
  );
}