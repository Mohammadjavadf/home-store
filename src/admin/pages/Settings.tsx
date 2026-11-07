import { useState, useEffect } from 'react';
import { Save, RotateCcw, Store, Truck, Gift, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../components/PageHeader';
import Button from '../../components/ui/Button';
import { useSettingsStore } from '../../store/settingsStore';
import { usePageTitle } from '../../hooks/usePageTitle';
import { cn, formatPrice } from '../../lib/utils';

export default function Settings() {
  usePageTitle('تنظیمات');

  const { settings, updateSettings, resetToDefault } = useSettingsStore();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    toast.success('تنظیمات ذخیره شد');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm('آیا از بازنشانی تنظیمات به حالت پیش‌فرض مطمئنی؟')) {
      resetToDefault();
      toast.success('تنظیمات بازنشانی شد');
    }
  };

  return (
    <div>
      <PageHeader
        title="تنظیمات"
        description="تنظیمات کلی فروشگاه"
        actions={
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
            بازنشانی
          </Button>
        }
      />

      <form onSubmit={handleSave} className="grid lg:grid-cols-[1fr_360px] gap-4 items-start">
        {/* ستون اصلی */}
        <div className="space-y-4">
          {/* اطلاعات فروشگاه */}
          <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-copper/10 flex items-center justify-center">
                <Store className="w-4 h-4 text-copper" />
              </div>
              <h2 className="font-display font-bold text-sm">اطلاعات فروشگاه</h2>
            </div>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="نام فروشگاه"
                  value={form.name}
                  onChange={(v) => update('name', v)}
                />
                <Field
                  label="شعار"
                  value={form.tagline}
                  onChange={(v) => update('tagline', v)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
                  توضیحات
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 resize-none transition-all"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="تلفن"
                  value={form.phone}
                  onChange={(v) => update('phone', v)}
                  dir="ltr"
                />
                <Field
                  label="ایمیل"
                  value={form.email}
                  onChange={(v) => update('email', v)}
                  dir="ltr"
                />
              </div>
              <Field
                label="آدرس"
                value={form.address}
                onChange={(v) => update('address', v)}
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="اینستاگرام"
                  value={form.instagram}
                  onChange={(v) => update('instagram', v)}
                  dir="ltr"
                />
                <Field
                  label="تلگرام"
                  value={form.telegram}
                  onChange={(v) => update('telegram', v)}
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* ارسال */}
          <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-forest/10 flex items-center justify-center">
                <Truck className="w-4 h-4 text-forest" />
              </div>
              <h2 className="font-display font-bold text-sm">ارسال</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <NumberField
                label="هزینه ارسال (تومان)"
                value={form.shippingCost}
                onChange={(v) => update('shippingCost', v)}
                formatted
              />
              <NumberField
                label="حد ارسال رایگان (تومان)"
                value={form.freeShippingThreshold}
                onChange={(v) => update('freeShippingThreshold', v)}
                formatted
              />
            </div>
            <p className="text-[10px] text-ink/40 dark:text-night-ink/40 mt-2">
              ارسال برای سفارش‌های بالای {formatPrice(form.freeShippingThreshold)} رایگان است
            </p>
          </div>

          {/* باشگاه */}
          <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Gift className="w-4 h-4 text-amber-500" />
              </div>
              <h2 className="font-display font-bold text-sm">باشگاه مشتریان</h2>
            </div>
            <NumberField
              label="امتیاز به ازای هر ۱۰۰ هزار تومان"
              value={form.pointsPerHundredThousand}
              onChange={(v) => update('pointsPerHundredThousand', v)}
            />
          </div>

          {/* پرداخت */}
          <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-blue-500" />
              </div>
              <h2 className="font-display font-bold text-sm">روش‌های پرداخت</h2>
            </div>
            <div className="space-y-2">
              <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-cream dark:bg-night hover:bg-copper/5 transition-colors">
                <span className="text-sm text-ink/70 dark:text-night-ink/70">
                  پرداخت آنلاین
                </span>
                <input
                  type="checkbox"
                  checked={form.onlinePaymentEnabled}
                  onChange={(e) => update('onlinePaymentEnabled', e.target.checked)}
                  className="w-4 h-4 rounded accent-copper cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-cream dark:bg-night hover:bg-copper/5 transition-colors">
                <span className="text-sm text-ink/70 dark:text-night-ink/70">
                  پرداخت در محل
                </span>
                <input
                  type="checkbox"
                  checked={form.codPaymentEnabled}
                  onChange={(e) => update('codPaymentEnabled', e.target.checked)}
                  className="w-4 h-4 rounded accent-copper cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* ستون کنار */}
        <div className="space-y-4">
          <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5">
            <Button type="submit" size="lg" className="w-full">
              <Save className="w-4 h-4" />
              {saved ? 'ذخیره شد' : 'ذخیره تنظیمات'}
            </Button>
            <p className="text-[10px] text-ink/40 dark:text-night-ink/40 mt-3 text-center">
              تغییرات روی سایت اعمال می‌شود
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  dir,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
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
        dir={dir}
        className="w-full px-3 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all"
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  formatted = false,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  formatted?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
        {label}
      </label>
      <input
        type="text"
        inputMode="numeric"
        value={
          formatted
            ? new Intl.NumberFormat('en-US').format(value)
            : String(value)
        }
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, '');
          onChange(raw ? Number(raw) : 0);
        }}
        dir="ltr"
        className="w-full px-3 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all"
      />
    </div>
  );
}