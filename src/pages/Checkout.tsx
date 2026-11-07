import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  MapPin,
  CreditCard,
  Check,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  PartyPopper,
  Copy,
  Lock,
  LogIn,
  UserPlus,
  Tag,
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useUserStore } from '../store/userStore';
import { useAuthStore } from '../store/authStore';
import { useRewardsStore, pointsFromAmount } from '../store/rewardsStore';
import { useCouponStore } from '../store/couponStore';
import { useOrdersStore } from '../store/ordersStore';
import { usePublicCouponsStore } from '../store/publicCouponsStore';
import { formatPrice, cn } from '../lib/utils';
import Button from '../components/ui/Button';
import SmartImage from '../components/ui/SmartImage';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSettingsStore } from '../store/settingsStore';
import {
  isValidPhone,
  isValidEmail,
  isValidPostalCode,
  isValidName,
  isValidAddress,
} from '../lib/validators';

type Step = 0 | 1 | 2;

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  paymentMethod: 'online' | 'cod';
}

const initialForm: FormData = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  province: '',
  city: '',
  address: '',
  postalCode: '',
  paymentMethod: 'online',
};

const STEPS = [
  { Icon: User, label: 'اطلاعات شخصی' },
  { Icon: MapPin, label: 'آدرس ارسال' },
  { Icon: CreditCard, label: 'پرداخت' },
];

const PROVINCES = [
  'تهران', 'اصفهان', 'فارس', 'خراسان رضوی', 'البرز',
  'آذربایجان شرقی', 'آذربایجان غربی', 'خوزستان', 'گیلان', 'مازندران',
];

export default function Checkout() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { getAddresses, addAddress } = useUserStore();
  const user = useAuthStore((s) => s.user);
  const addPoints = useRewardsStore((s) => s.addPoints);
  const markCouponUsed = useRewardsStore((s) => s.markCouponUsed);
  const { applied: appliedCoupon, clear: clearCoupon } = useCouponStore();
  const addOrderToStore = useOrdersStore((s) => s.addOrder);
  const incrementUsage = usePublicCouponsStore((s) => s.incrementUsage);
const settings = useSettingsStore((s) => s.settings);
  const addresses = user ? getAddresses(user.id) : [];
  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState<FormData>(() => {
    const base = { ...initialForm };
    if (user) {
      base.firstName = user.firstName || '';
      base.lastName = user.lastName || '';
      base.email = user.email || '';
      base.phone = user.phone || '';
    }
    if (defaultAddress) {
      base.province = defaultAddress.province || '';
      base.city = defaultAddress.city || '';
      base.address = defaultAddress.address || '';
      base.postalCode = defaultAddress.postalCode || '';
      base.phone = base.phone || defaultAddress.phone || '';
    }
    return base;
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  usePageTitle('تکمیل سفارش');

  useEffect(() => {
    setForm((prev: FormData) => {
      const next = { ...prev };
      if (user) {
        if (!next.firstName && user.firstName) next.firstName = user.firstName;
        if (!next.lastName && user.lastName) next.lastName = user.lastName;
        if (!next.email && user.email) next.email = user.email;
        if (!next.phone && user.phone) next.phone = user.phone;
      }
      if (defaultAddress) {
        if (!next.province && defaultAddress.province) next.province = defaultAddress.province;
        if (!next.city && defaultAddress.city) next.city = defaultAddress.city;
        if (!next.address && defaultAddress.address) next.address = defaultAddress.address;
        if (!next.postalCode && defaultAddress.postalCode) next.postalCode = defaultAddress.postalCode;
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, defaultAddress?.id]);

  const subtotal = getTotalPrice();
  const discountAmount = appliedCoupon
    ? Math.round((subtotal * appliedCoupon.percent) / 100)
    : 0;
const shipping =
  subtotal >= settings.freeShippingThreshold || subtotal === 0
    ? 0
    : settings.shippingCost;
      const total = subtotal - discountAmount + shipping;

  if (items.length === 0 && !orderNumber) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-24 h-24 mx-auto rounded-3xl bg-copper/10 flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-copper" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold mb-3">
          سبد خریدت خالیه
        </h1>
        <p className="text-ink/60 dark:text-night-ink/60 mb-8 max-w-md mx-auto">
          برای تسویه، اول باید محصولی به سبد اضافه کنی.
        </p>
        <Link to="/products">
          <Button size="lg">
            شروع خرید
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-copper/10 flex items-center justify-center mb-6">
          <Lock className="w-10 h-10 text-copper" />
        </div>
        <h1 className="text-2xl font-display font-extrabold mb-3">
          برای ادامه وارد شو
        </h1>
        <p className="text-ink/60 dark:text-night-ink/60 mb-8 max-w-sm mx-auto">
          برای تکمیل سفارش، لطفاً وارد حساب کاربری‌ات شو یا ثبت‌نام کن.
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/login" state={{ from: '/checkout' }}>
            <Button size="lg" className="w-full">
              <LogIn className="w-4 h-4" />
              ورود به حساب
            </Button>
          </Link>
          <Link to="/register">
            <Button size="lg" variant="outline" className="w-full">
              <UserPlus className="w-4 h-4" />
              ثبت‌نام
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (orderNumber) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-forest/10 flex items-center justify-center mb-6">
            <PartyPopper className="w-12 h-12 text-forest" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold mb-3">
            سفارش شما ثبت شد!
          </h1>
          <p className="text-ink/60 dark:text-night-ink/60 mb-8 max-w-md mx-auto">
            از خرید شما سپاسگزاریم. جزئیات سفارش به ایمیل شما ارسال شد.
          </p>

          <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-6 mb-6 text-right">
            <div className="text-xs text-ink/50 dark:text-night-ink/50 mb-1">
              شماره سفارش
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="font-display font-extrabold text-copper text-xl">
                {orderNumber}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(orderNumber);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="flex items-center gap-1.5 text-xs text-copper hover:text-copper-dark transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'کپی شد' : 'کپی'}
              </button>
            </div>
          </div>

          {earnedPoints > 0 && (
            <div className="bg-copper/10 border border-copper/20 rounded-2xl p-4 mb-6 flex items-center justify-center gap-2">
              <PartyPopper className="w-5 h-5 text-copper" />
              <span className="text-sm font-medium text-copper">
                {earnedPoints.toLocaleString('fa-IR')} امتیاز به باشگاه شما اضافه شد!
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/products">
              <Button size="lg">ادامه خرید</Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="outline">بازگشت به خانه</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const validateStep = (s: Step): boolean => {
    const e: typeof errors = {};

    if (s === 0) {
      if (!isValidName(form.firstName)) e.firstName = 'نام را کامل وارد کنید';
      if (!isValidName(form.lastName)) e.lastName = 'نام خانوادگی را کامل وارد کنید';
      if (!isValidPhone(form.phone)) e.phone = 'شماره موبایل معتبر نیست (۰۹xxxxxxxxx)';
      if (form.email && !isValidEmail(form.email)) e.email = 'ایمیل معتبر نیست';
    }

    if (s === 1) {
      if (!form.province) e.province = 'استان را انتخاب کنید';
      if (!form.city.trim()) e.city = 'شهر را وارد کنید';
      if (!isValidAddress(form.address)) e.address = 'آدرس را کامل وارد کنید (حداقل ۱۰ کاراکتر)';
      if (!isValidPostalCode(form.postalCode)) e.postalCode = 'کد پستی باید ۱۰ رقم باشد';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep(step)) return;
    if (step < 2) {
      setStep((step + 1) as Step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prev = () => {
    setErrors({});
    if (step > 0) {
      setStep((step - 1) as Step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const submit = () => {
    if (!validateStep(2)) return;

const earned = Math.floor((total / 100_000) * settings.pointsPerHundredThousand);
    const num = `KS-${Date.now().toString().slice(-8)}`;
    setOrderNumber(num);
    setEarnedPoints(earned);
    addPoints(user.id, earned);

    addOrderToStore({
      id: num,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`.trim() || user.email,
      userEmail: user.email,
      userPhone: user.phone,
      items: items.map((i) => ({
        productId: i.id,
        name: i.name,
        image: i.image,
        brand: i.brand,
        price: i.finalPrice ?? i.price,
        quantity: i.quantity,
        variant: i.selectedVariant,
      })),
      subtotal,
      discount: discountAmount,
      shipping,
      total,
      status: 'pending',
      createdAt: Date.now(),
      date: new Date().toLocaleDateString('fa-IR'),
      address: {
        province: form.province,
        city: form.city,
        address: form.address,
        postalCode: form.postalCode,
        phone: form.phone,
      },
      paymentMethod: form.paymentMethod,
      couponCode: appliedCoupon?.code,
    });

    if (form.address) {
      const isNewAddress = !addresses.some(
        (a) =>
          a.city === form.city &&
          a.address === form.address &&
          a.postalCode === form.postalCode
      );
      if (isNewAddress) {
        addAddress(user.id, {
          title: 'آدرس سفارش',
          province: form.province,
          city: form.city,
          address: form.address,
          postalCode: form.postalCode,
          phone: form.phone,
          isDefault: addresses.length === 0,
        });
      }
    }

    if (appliedCoupon?.isPersonal) {
      markCouponUsed(user.id, appliedCoupon.code);
    }

    if (appliedCoupon && !appliedCoupon.isPersonal) {
      incrementUsage(appliedCoupon.code);
    }

    clearCoupon();
    clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-display font-extrabold mb-4">
        تکمیل سفارش
      </h1>

      {(user || defaultAddress) && (
        <div className="mb-6 inline-flex items-center gap-2 bg-forest/10 border border-forest/20 text-forest text-xs font-medium px-3 py-1.5 rounded-full">
          <Check className="w-3.5 h-3.5" />
          اطلاعات و آدرس شما از حساب کاربری وارد شد
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {STEPS.map((s, i) => {
            const isActive = i === step;
            const isDone = i < step;
            return (
              <div key={i} className="flex items-center gap-2 sm:gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2">
                  <div
                    className={cn(
                      'w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-300',
                      isDone
                        ? 'bg-forest text-white'
                        : isActive
                          ? 'bg-copper text-white shadow-glow'
                          : 'bg-ink/5 dark:bg-white/5 text-ink/40 dark:text-night-ink/40'
                    )}
                  >
                    {isDone ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <s.Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <span
                    className={cn(
                      'text-[10px] sm:text-xs font-medium whitespace-nowrap',
                      isActive
                        ? 'text-copper'
                        : isDone
                          ? 'text-forest'
                          : 'text-ink/40 dark:text-night-ink/40'
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'w-6 sm:w-16 h-0.5 rounded-full transition-colors duration-300',
                      i < step ? 'bg-forest' : 'bg-ink/10 dark:bg-white/10'
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
        <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5 sm:p-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 && (
                <div className="space-y-4">
                  <h2 className="font-display font-bold text-lg mb-4">اطلاعات شخصی</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field
                      label="نام"
                      value={form.firstName}
                      onChange={(v) => update('firstName', v)}
                      error={errors.firstName}
                      placeholder="مثلاً سارا"
                    />
                    <Field
                      label="نام خانوادگی"
                      value={form.lastName}
                      onChange={(v) => update('lastName', v)}
                      error={errors.lastName}
                      placeholder="مثلاً محمدی"
                    />
                  </div>
                  <Field
                    label="شماره موبایل"
                    value={form.phone}
                    onChange={(v) => update('phone', v)}
                    error={errors.phone}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    dir="ltr"
                  />
                  <Field
                    label="ایمیل (اختیاری)"
                    value={form.email}
                    onChange={(v) => update('email', v)}
                    error={errors.email}
                    placeholder="you@example.com"
                    dir="ltr"
                  />
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="font-display font-bold text-lg mb-4">آدرس ارسال</h2>

                  {addresses.length > 1 && (
                    <div>
                      <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
                        انتخاب از آدرس‌های ذخیره‌شده
                      </label>
                      <select
                        onChange={(e) => {
                          const addr = addresses.find((a) => a.id === e.target.value);
                          if (addr) {
                            setForm((f) => ({
                              ...f,
                              province: addr.province,
                              city: addr.city,
                              address: addr.address,
                              postalCode: addr.postalCode,
                              phone: addr.phone || f.phone,
                            }));
                          }
                        }}
                        className="w-full px-3 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all"
                      >
                        <option value="">آدرس جدید (دستی وارد کن)</option>
                        {addresses.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.title} — {a.city}، {a.address.slice(0, 30)}...
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
                        استان
                      </label>
                      <select
                        value={form.province}
                        onChange={(e) => update('province', e.target.value)}
                        className={cn(
                          'w-full px-3 py-2.5 rounded-xl bg-cream dark:bg-night border text-sm text-ink dark:text-night-ink transition-all focus:outline-none focus:ring-2 focus:ring-copper/20',
                          errors.province
                            ? 'border-red-500'
                            : 'border-ink/10 dark:border-white/10 focus:border-copper'
                        )}
                      >
                        <option value="">انتخاب کنید</option>
                        {PROVINCES.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                      {errors.province && (
                        <p className="text-xs text-red-500 mt-1">{errors.province}</p>
                      )}
                    </div>
                    <Field
                      label="شهر"
                      value={form.city}
                      onChange={(v) => update('city', v)}
                      error={errors.city}
                      placeholder="مثلاً تهران"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
                      آدرس کامل
                    </label>
                    <textarea
                      value={form.address}
                      onChange={(e) => update('address', e.target.value)}
                      rows={3}
                      placeholder="خیابان، کوچه، پلاک، واحد..."
                      className={cn(
                        'w-full px-3 py-2.5 rounded-xl bg-cream dark:bg-night border text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 transition-all focus:outline-none focus:ring-2 focus:ring-copper/20 resize-none',
                        errors.address
                          ? 'border-red-500'
                          : 'border-ink/10 dark:border-white/10 focus:border-copper'
                      )}
                    />
                    {errors.address && (
                      <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                    )}
                  </div>
                  <Field
                    label="کد پستی"
                    value={form.postalCode}
                    onChange={(v) => update('postalCode', v.replace(/\D/g, '').slice(0, 10))}
                    error={errors.postalCode}
                    placeholder="۱۰ رقم"
                    dir="ltr"
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="font-display font-bold text-lg mb-4">روش پرداخت</h2>
                  {[
                    {
                      value: 'online' as const,
                      title: 'پرداخت آنلاین',
                      desc: 'پرداخت امن با کلیه کارت‌های بانکی',
                      Icon: CreditCard,
                    },
                    {
                      value: 'cod' as const,
                      title: 'پرداخت در محل',
                      desc: 'پرداخت هنگام تحویل کالا',
                      Icon: Truck,
                    },
                  ].map((opt) => {
                    const isActive = form.paymentMethod === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => update('paymentMethod', opt.value)}
                        className={cn(
                          'w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-right',
                          isActive
                            ? 'border-copper bg-copper/5'
                            : 'border-ink/10 dark:border-white/10 hover:border-copper/40'
                        )}
                      >
                        <div
                          className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                            isActive ? 'bg-copper text-white' : 'bg-copper/10 text-copper'
                          )}
                        >
                          <opt.Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-display font-bold text-sm text-ink dark:text-night-ink">
                            {opt.title}
                          </div>
                          <div className="text-xs text-ink/60 dark:text-night-ink/60 mt-0.5">
                            {opt.desc}
                          </div>
                        </div>
                        <div
                          className={cn(
                            'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5',
                            isActive ? 'border-copper' : 'border-ink/20 dark:border-white/20'
                          )}
                        >
                          {isActive && <div className="w-2.5 h-2.5 rounded-full bg-copper" />}
                        </div>
                      </button>
                    );
                  })}

                  <div className="flex items-center gap-2 p-3 rounded-xl bg-forest/5 border border-forest/20 text-xs text-forest mt-4">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    پرداخت شما امن و رمزنگاری‌شده است.
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-3 mt-6 pt-5 border-t border-ink/5 dark:border-white/5">
            {step > 0 && (
              <Button variant="outline" onClick={prev}>
                <ChevronRight className="w-4 h-4" />
                مرحله قبل
              </Button>
            )}
            <div className="flex-1" />
            {step < 2 ? (
              <Button onClick={next}>
                مرحله بعد
                <ChevronLeft className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={submit} size="lg">
                <Check className="w-4 h-4" />
                ثبت نهایی سفارش
              </Button>
            )}
          </div>
        </div>

        <aside className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5 lg:sticky lg:top-20">
          <h2 className="font-display font-bold text-base mb-4">خلاصه سفارش</h2>

          <div className="space-y-3 max-h-64 overflow-y-auto pl-1 mb-4">
            {items.map((item) => (
              <div key={item._key} className="flex gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-cream dark:bg-night shrink-0">
                  <SmartImage src={item.image} alt={item.name} className="w-full h-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-ink dark:text-night-ink line-clamp-1">
                    {item.name}
                  </div>
                  {item.selectedVariant && (
                    <div className="text-[10px] text-copper">
                      {item.selectedVariant.name}: {item.selectedVariant.option}
                    </div>
                  )}
                  <div className="text-[10px] text-ink/50 dark:text-night-ink/50 mt-0.5">
                    {item.quantity.toLocaleString('fa-IR')} × {formatPrice(item.finalPrice ?? item.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {appliedCoupon && (
            <div className="flex items-center gap-2 bg-forest/10 border border-forest/20 rounded-xl px-3 py-2 mb-4 text-forest text-xs font-medium">
              <Tag className="w-3.5 h-3.5" />
              <span>{appliedCoupon.code}</span>
              <span className="text-forest/70">({appliedCoupon.percent}٪)</span>
              {appliedCoupon.isPersonal && (
                <span className="text-[9px] font-bold bg-forest text-white px-1.5 py-0.5 rounded-full">
                  اختصاصی
                </span>
              )}
            </div>
          )}

          <div className="space-y-2 py-3 border-t border-ink/5 dark:border-white/5 text-sm">
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
              <span>ارسال</span>
              <span className={cn(shipping === 0 && 'text-forest')}>
                {shipping === 0 ? 'رایگان' : formatPrice(shipping)}
              </span>
            </div>
          </div>

          <div className="flex justify-between pt-3 border-t border-ink/5 dark:border-white/5">
            <span className="font-display font-bold">مبلغ نهایی</span>
            <span className="font-display font-extrabold text-copper text-lg">
              {formatPrice(total)}
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  dir,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  dir?: 'ltr' | 'rtl';
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        className={cn(
          'w-full px-3 py-2.5 rounded-xl bg-cream dark:bg-night border text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 transition-all focus:outline-none focus:ring-2 focus:ring-copper/20',
          error
            ? 'border-red-500'
            : 'border-ink/10 dark:border-white/10 focus:border-copper'
        )}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}