import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Check,
  MessageSquare,
} from 'lucide-react';
import { cn } from '../lib/utils';
import Button from '../components/ui/Button';
import { isValidEmail, isValidName } from '../lib/validators';
import { usePageTitle } from '../hooks/usePageTitle';
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialForm: FormData = { name: '', email: '', subject: '', message: '' };

const contactInfo = [
  {
    Icon: Phone,
    title: 'تلفن',
    value: '۰۲۱-۱۲۳۴۵۶۷۸',
    sub: 'شنبه تا پنجشنبه، ۹ تا ۱۸',
  },
  {
    Icon: Mail,
    title: 'ایمیل',
    value: 'info@khanestore.ir',
    sub: 'پاسخ در کمتر از ۲۴ ساعت',
  },
  {
    Icon: MapPin,
    title: 'آدرس',
    value: 'تهران، خیابان ولیعصر',
    sub: 'پلاک ۱۲۳، طبقه ۴',
  },
  {
    Icon: Clock,
    title: 'ساعات کاری',
    value: 'شنبه تا پنجشنبه',
    sub: '۹:۰۰ تا ۱۸:۰۰',
  },
];

export default function Contact() {
  usePageTitle('تماس با ما')
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [sent, setSent] = useState(false);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};

    if (!isValidName(form.name)) errs.name = 'نام را کامل وارد کنید';
    if (!isValidEmail(form.email)) errs.email = 'ایمیل معتبر نیست';
    if (form.subject.trim().length < 3) errs.subject = 'موضوع را وارد کنید';
    if (form.message.trim().length < 10) errs.message = 'پیام حداقل ۱۰ کاراکتر باشد';

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // شبیه‌سازی ارسال
    setSent(true);
    setForm(initialForm);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* هدر */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-copper/10 text-copper text-sm font-medium mb-4">
          <MessageSquare className="w-4 h-4" />
          تماس با ما
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold mb-3 text-balance">
          در خدمت <span className="text-copper">شما</span> هستیم
        </h1>
        <p className="text-ink/60 dark:text-night-ink/60 max-w-xl mx-auto text-balance">
          سؤالی داری؟ پیشنهادی؟ یا فقط می‌خوای سلام کنی؟ ما اینجاییم.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-6 items-start">
        {/* فرم */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-6 sm:p-8"
        >
          <h2 className="font-display font-bold text-lg mb-5">پیام بفرست</h2>

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="py-12 text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-forest/10 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-forest" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">
                  پیام شما ارسال شد!
                </h3>
                <p className="text-sm text-ink/60 dark:text-night-ink/60">
                  در کمتر از ۲۴ ساعت پاسخ می‌دهیم.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field
                    label="نام"
                    value={form.name}
                    onChange={(v) => update('name', v)}
                    error={errors.name}
                    placeholder="نام شما"
                  />
                  <Field
                    label="ایمیل"
                    value={form.email}
                    onChange={(v) => update('email', v)}
                    error={errors.email}
                    placeholder="you@example.com"
                    dir="ltr"
                  />
                </div>
                <Field
                  label="موضوع"
                  value={form.subject}
                  onChange={(v) => update('subject', v)}
                  error={errors.subject}
                  placeholder="موضوع پیام"
                />
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
                    پیام
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    rows={5}
                    placeholder="پیام خود را بنویسید..."
                    className={cn(
                      'w-full px-3 py-2.5 rounded-xl bg-cream dark:bg-night border text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 transition-all focus:outline-none focus:ring-2 focus:ring-copper/20 resize-none',
                      errors.message
                        ? 'border-red-500'
                        : 'border-ink/10 dark:border-white/10 focus:border-copper'
                    )}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.message}</p>
                  )}
                </div>
                <Button type="submit" size="lg" className="w-full">
                  <Send className="w-4 h-4" />
                  ارسال پیام
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* اطلاعات تماس */}
        <div className="space-y-3">
          {contactInfo.map(({ Icon, title, value, sub }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-4 flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-copper/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-copper" />
              </div>
              <div>
                <div className="text-xs text-ink/50 dark:text-night-ink/50 mb-0.5">
                  {title}
                </div>
                <div className="font-display font-bold text-sm text-ink dark:text-night-ink">
                  {value}
                </div>
                <div className="text-[11px] text-ink/50 dark:text-night-ink/50 mt-0.5">
                  {sub}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
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