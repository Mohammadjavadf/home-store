import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  ArrowLeft,
  UserPlus,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { isValidEmail, isValidPhone, isValidName } from '../../lib/validators';
import Button from '../../components/ui/Button';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const initialForm: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);

  const [form, setForm] = useState<FormData>(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidName(form.firstName) || !isValidName(form.lastName)) {
      setError('نام و نام خانوادگی را کامل وارد کنید');
      return;
    }
    if (!isValidEmail(form.email)) {
      setError('ایمیل معتبر نیست');
      return;
    }
    if (!isValidPhone(form.phone)) {
      setError('شماره موبایل معتبر نیست (۰۹xxxxxxxxx)');
      return;
    }
    if (form.password.length < 6) {
      setError('رمز عبور حداقل ۶ کاراکتر باشد');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('رمز عبور و تکرار آن یکسان نیستند');
      return;
    }

    const res = register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      password: form.password,
    });

    if (!res.ok) {
      setError(res.error || 'خطا در ثبت‌نام');
      return;
    }
    navigate('/account', { replace: true });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-surface dark:bg-night-surface rounded-3xl border border-ink/5 dark:border-white/5 shadow-soft p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-copper/10 flex items-center justify-center mb-4">
              <UserPlus className="w-7 h-7 text-copper" />
            </div>
            <h1 className="text-2xl font-display font-extrabold mb-1">ثبت‌نام</h1>
            <p className="text-sm text-ink/60 dark:text-night-ink/60">
              حساب بساز و خریدت را شروع کن
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
                  نام
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40 dark:text-night-ink/40 pointer-events-none" />
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => update('firstName', e.target.value)}
                    placeholder="سارا"
                    className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
                  نام خانوادگی
                </label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  placeholder="محمدی"
                  className="w-full px-3 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
                ایمیل
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40 dark:text-night-ink/40 pointer-events-none" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@example.com"
                  dir="ltr"
                  className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
                شماره موبایل
              </label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40 dark:text-night-ink/40 pointer-events-none" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  dir="ltr"
                  className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
                رمز عبور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40 dark:text-night-ink/40 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="••••••••"
                  dir="ltr"
                  className="w-full pr-10 pl-10 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 dark:text-night-ink/40 hover:text-copper transition-colors"
                  aria-label={showPassword ? 'پنهان کردن رمز' : 'نمایش رمز'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
                تکرار رمز عبور
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                className="w-full px-3 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all"
              />
            </div>

            {error && (
              <div className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full">
              ثبت‌نام
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </form>

          <div className="text-center text-xs text-ink/60 dark:text-night-ink/60 mt-6">
            حساب داری؟{' '}
            <Link to="/login" className="text-copper font-medium hover:underline">
              وارد شو
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}