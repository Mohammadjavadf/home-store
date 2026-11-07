import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  LogIn,
  Store,
} from 'lucide-react';
import { useAdminStore, ADMIN_CREDENTIALS } from '../../store/adminStore';
import { isValidEmail } from '../../lib/validators';
import Button from '../../components/ui/Button';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function AdminLogin() {
  usePageTitle('ورود ادمین');

  const navigate = useNavigate();
  const location = useLocation();
  const { admin, login } = useAdminStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);

  const from = (location.state as { from?: string } | null)?.from || '/admin';

  // اگر قبلاً لاگین کرده، هدایت به داشبورد
  useEffect(() => {
    if (admin) {
      navigate(from, { replace: true });
    }
  }, [admin, navigate, from]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('ایمیل معتبر نیست');
      return;
    }
    if (password.length < 6) {
      setError('رمز عبور حداقل ۶ کاراکتر باشد');
      return;
    }

    const res = login(email, password);
    if (!res.ok) {
      setError(res.error || 'خطا در ورود');
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 bg-cream dark:bg-night">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-surface dark:bg-night-surface rounded-3xl border border-ink/5 dark:border-white/5 shadow-glow p-6 sm:p-8">
          {/* هدر */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-copper flex items-center justify-center mb-4 shadow-glow">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-display font-extrabold mb-1">
              پنل مدیریت
            </h1>
            <p className="text-sm text-ink/60 dark:text-night-ink/60">
              برای دسترسی، وارد حساب ادمین شوید
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
                ایمیل ادمین
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40 dark:text-night-ink/40 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="admin@khanestore.ir"
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
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
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

            {error && (
              <div className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full">
              <LogIn className="w-4 h-4" />
              ورود به پنل
            </Button>
          </form>

          {/* راهنمای دمو */}
          <div className="mt-6 pt-4 border-t border-ink/5 dark:border-white/5">
            <button
              type="button"
              onClick={() => setShowHint((s) => !s)}
              className="w-full text-xs text-copper hover:text-copper-dark font-medium transition-colors"
            >
              {showHint ? 'پنهان کردن اطلاعات دمو' : 'نمایش اطلاعات ورود دمو'}
            </button>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 bg-cream dark:bg-night rounded-xl p-3 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-ink/50 dark:text-night-ink/50">ایمیل:</span>
                  <span className="font-mono text-ink dark:text-night-ink select-all" dir="ltr">
                    {ADMIN_CREDENTIALS.email}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-ink/50 dark:text-night-ink/50">رمز:</span>
                  <span className="font-mono text-ink dark:text-night-ink select-all" dir="ltr">
                    {ADMIN_CREDENTIALS.password}
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* بازگشت به فروشگاه */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs text-ink/50 dark:text-night-ink/50 hover:text-copper transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              بازگشت به فروشگاه
              <ArrowLeft className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}