import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Trophy, Search } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from '../ui/ThemeToggle';
import SearchModal from './SearchModal';
import { useSearchStore } from '../../store/searchStore';
import { useCartCount } from '../../hooks/useCartCount';
import { useRewards } from '../../hooks/useRewards';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/authStore';

const navLinks = [
  { to: '/', label: 'خانه' },
  { to: '/products', label: 'محصولات' },
  { to: '/blog', label: 'وبلاگ' },
  { to: '/about', label: 'درباره ما' },
  { to: '/contact', label: 'تماس' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const openSearch = useSearchStore((s) => s.open);
  const cartCount = useCartCount();
  const { points } = useRewards();
const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-cream/80 dark:bg-night/80 border-b border-ink/5 dark:border-white/5">
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        <Logo />

        {/* دسکتاپ */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'text-copper bg-copper/10'
                    : 'text-ink/70 dark:text-night-ink/70 hover:text-copper hover:bg-copper/5'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* بج امتیاز — فقط دسکتاپ */}
<Link
  to="/account"
  className="hidden lg:flex items-center gap-1.5 h-10 px-3 rounded-xl bg-copper/10 hover:bg-copper/20 transition-colors"
  aria-label="باشگاه مشتریان"
>
  <Trophy className="w-4 h-4 text-copper" />
  <span className="text-xs font-bold text-copper">
    {points.toLocaleString('fa-IR')}
  </span>
</Link>

          {/* جستجو — همه اندازه‌ها */}
          <button
            onClick={openSearch}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-copper/10 hover:bg-copper/20 flex items-center justify-center transition-colors"
            aria-label="جستجو"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-copper" />
          </button>

          <ThemeToggle />

          {/* سبد خرید — همه اندازه‌ها */}
          <Link
            to="/cart"
            data-cart-icon
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-copper/10 hover:bg-copper/20 flex items-center justify-center transition-colors"
            aria-label="سبد خرید"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-copper" />
            <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 rounded-full bg-copper text-white text-[10px] flex items-center justify-center font-bold">
              {cartCount > 0 ? cartCount.toLocaleString('fa-IR') : '۰'}
            </span>
          </Link>

          {/* کاربر — فقط دسکتاپ */}
<Link
  to={user ? '/account' : '/login'}
  className="hidden md:flex w-10 h-10 rounded-xl bg-copper/10 hover:bg-copper/20 items-center justify-center transition-colors"
  aria-label={user ? 'حساب کاربری' : 'ورود'}
>
  <User className="w-5 h-5 text-copper" />
</Link>

          {/* همبرگر — موبایل */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-copper/10 hover:bg-copper/20 flex items-center justify-center transition-colors"
            aria-label="منو"
          >
            {open ? (
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-copper" />
            ) : (
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-copper" />
            )}
          </button>
        </div>
      </nav>

      {/* منوی موبایل */}
      {open && (
        <div className="md:hidden border-t border-ink/5 dark:border-white/5 px-3 sm:px-4 py-3 space-y-1 bg-cream/95 dark:bg-night/95 backdrop-blur-xl max-h-[calc(100vh-4rem)] overflow-y-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'text-copper bg-copper/10'
                    : 'text-ink/70 dark:text-night-ink/70 hover:bg-copper/5'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}

          {/* جداکننده */}
          <div className="h-px bg-ink/5 dark:bg-white/5 my-2" />
<NavLink
  to="/account"
  onClick={() => setOpen(false)}
  className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-ink/70 dark:text-night-ink/70 hover:bg-copper/5 transition-colors"
>
  <span className="flex items-center gap-2">
    <Trophy className="w-4 h-4 text-copper" />
    باشگاه مشتریان
  </span>
  <span className="text-xs font-bold text-copper">
    {points.toLocaleString('fa-IR')} امتیاز
  </span>
</NavLink>

<NavLink
  to={user ? '/account' : '/login'}
  onClick={() => setOpen(false)}
  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-ink/70 dark:text-night-ink/70 hover:bg-copper/5 transition-colors"
>
  <User className="w-4 h-4 text-copper" />
  {user ? 'حساب کاربری' : 'ورود / ثبت‌نام'}
</NavLink>


        </div>
      )}

      <SearchModal />
    </header>
  );
}