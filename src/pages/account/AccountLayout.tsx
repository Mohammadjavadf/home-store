import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { User, Package, Heart, MapPin, Trophy, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';

const tabs = [
  { to: '/account', label: 'پروفایل', Icon: User, end: true },
  { to: '/account/orders', label: 'سفارش‌ها', Icon: Package },
  { to: '/account/wishlist', label: 'علاقه‌مندی‌ها', Icon: Heart },
  { to: '/account/addresses', label: 'آدرس‌ها', Icon: MapPin },
  { to: '/account/rewards', label: 'باشگاه من', Icon: Trophy },
];

export default function AccountLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-display font-extrabold mb-6">
        حساب کاربری
      </h1>

      {/* کارت کاربر + خروج */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3 bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-copper/10 flex items-center justify-center font-display font-bold text-copper">
            {user?.firstName?.charAt(0) || '؟'}
          </div>
          <div>
            <div className="font-display font-bold text-sm">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-xs text-ink/50 dark:text-night-ink/50" dir="ltr">
              {user?.email}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-medium px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          خروج از حساب
        </button>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        {/* سایدبار */}
        <aside className="lg:sticky lg:top-20 self-start">
          <nav className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-2 flex lg:flex-col gap-1 overflow-x-auto">
            {tabs.map(({ to, label, Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap',
                    isActive
                      ? 'bg-copper/10 text-copper'
                      : 'text-ink/70 dark:text-night-ink/70 hover:bg-copper/5'
                  )
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* محتوا */}
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}