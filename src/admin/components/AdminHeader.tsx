import { Menu, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import NotificationBell from './NotificationBell';

interface AdminHeaderProps {
  onOpenSidebar: () => void;
}

export default function AdminHeader({ onOpenSidebar }: AdminHeaderProps) {
  const admin = useAdminStore((s) => s.admin);

  return (
    <header className="h-16 bg-surface/80 dark:bg-night-surface/80 backdrop-blur-xl border-b border-ink/5 dark:border-white/5 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden w-10 h-10 rounded-xl bg-copper/10 hover:bg-copper/20 flex items-center justify-center text-copper transition-colors"
          aria-label="باز کردن منو"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <div className="text-xs text-ink/50 dark:text-night-ink/50">
            خوش آمدی
          </div>
          <div className="font-display font-bold text-sm text-ink dark:text-night-ink">
            {admin?.name || 'مدیر'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-xl bg-copper/10 hover:bg-copper/20 text-copper text-xs font-medium transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          مشاهده سایت
        </Link>

        {/* زنگوله اعلان‌ها */}
        <NotificationBell />

        <div className="w-9 h-9 rounded-full bg-copper flex items-center justify-center text-white text-xs font-bold shrink-0">
          {admin?.name?.charAt(0) || 'م'}
        </div>
      </div>
    </header>
  );
}