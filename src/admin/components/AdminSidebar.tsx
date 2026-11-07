import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  FileText,
  MessageSquare,
  Ticket,
  Trophy,
  FolderTree,
  Settings,
  LogOut,
  Store,
  ChevronLeft,
  X,
} from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { cn } from '../../lib/utils';

import type { LucideIcon } from 'lucide-react';

interface MenuItem {
  to: string;
  label: string;
  Icon: LucideIcon;
  end?: boolean;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    title: 'عمومی',
    items: [
      { to: '/admin', label: 'داشبورد', Icon: LayoutDashboard, end: true },
    ],
  },
  {
    title: 'فروشگاه',
    items: [
      { to: '/admin/products', label: 'محصولات', Icon: Package },
      { to: '/admin/categories', label: 'دسته‌بندی‌ها', Icon: FolderTree },
      { to: '/admin/orders', label: 'سفارش‌ها', Icon: ShoppingBag },
      { to: '/admin/coupons', label: 'کدهای تخفیف', Icon: Ticket },
    ],
  },
  {
    title: 'محتوا',
    items: [
      { to: '/admin/blog', label: 'وبلاگ', Icon: FileText },
      { to: '/admin/comments', label: 'نظرات', Icon: MessageSquare },
    ],
  },
  {
    title: 'کاربران',
    items: [
      { to: '/admin/users', label: 'کاربران', Icon: Users },
      { to: '/admin/rewards', label: 'باشگاه مشتریان', Icon: Trophy },
    ],
  },
  {
    title: 'سیستم',
    items: [
      { to: '/admin/settings', label: 'تنظیمات', Icon: Settings },
    ],
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const navigate = useNavigate();
const logout = useAdminStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const content = (
    <>
      {/* لوگو */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-ink/5 dark:border-white/5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-copper flex items-center justify-center shrink-0">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="font-display font-extrabold text-sm text-ink dark:text-night-ink truncate">
              خانه‌استور
            </div>
            <div className="text-[10px] text-copper font-medium">
              پنل مدیریت
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden w-8 h-8 rounded-lg hover:bg-copper/10 flex items-center justify-center text-ink/50 dark:text-night-ink/50 hover:text-copper transition-colors"
          aria-label="بستن منو"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* منو */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <div className="px-3 mb-1.5 text-[10px] font-bold text-ink/40 dark:text-night-ink/40 uppercase tracking-wider">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map(({ to, label, Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all',
                      isActive
                        ? 'bg-copper text-white shadow-soft'
                        : 'text-ink/70 dark:text-night-ink/70 hover:bg-copper/10 hover:text-copper'
                    )
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* پایین — کاربر و خروج */}
      <div className="border-t border-ink/5 dark:border-white/5 p-3 space-y-1 shrink-0">
        <NavLink
          to="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-ink/60 dark:text-night-ink/60 hover:bg-copper/10 hover:text-copper transition-all"
        >
          <Store className="w-4 h-4 shrink-0" />
          <span className="truncate">بازگشت به فروشگاه</span>
          <ChevronLeft className="w-3 h-3 mr-auto shrink-0" />
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span className="truncate">خروج از پنل</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* دسکتاپ */}
      <aside className="hidden lg:flex flex-col w-64 bg-surface dark:bg-night-surface border-l border-ink/5 dark:border-white/5 h-screen sticky top-0">
        {content}
      </aside>

      {/* موبایل */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-xs bg-surface dark:bg-night-surface z-50 flex flex-col lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}