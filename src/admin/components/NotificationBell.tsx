import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  ShoppingBag,
  AlertTriangle,
  MessageSquare,
  Users,
  Info,
  Check,
  Trash2,
  X,
} from 'lucide-react';
import { useNotificationsStore, type NotificationType } from '../../store/notificationsStore';
import { cn } from '../../lib/utils';

const TYPE_ICONS: Record<NotificationType, typeof Bell> = {
  order: ShoppingBag,
  stock: AlertTriangle,
  review: MessageSquare,
  user: Users,
  system: Info,
};

const TYPE_COLORS: Record<NotificationType, string> = {
  order: 'bg-blue-500/10 text-blue-500',
  stock: 'bg-amber-500/10 text-amber-500',
  review: 'bg-forest/10 text-forest',
  user: 'bg-violet-500/10 text-violet-500',
  system: 'bg-copper/10 text-copper',
};

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'همین حالا';
  if (minutes < 60) return `${minutes.toLocaleString('fa-IR')} دقیقه پیش`;
  if (hours < 24) return `${hours.toLocaleString('fa-IR')} ساعت پیش`;
  if (days < 7) return `${days.toLocaleString('fa-IR')} روز پیش`;
  return new Date(timestamp).toLocaleDateString('fa-IR');
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const {
    notifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotificationsStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // بستن با کلیک بیرون
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  // بستن با Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleItemClick = (id: string) => {
    markAsRead(id);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      {/* دکمه زنگوله */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-xl bg-copper/10 hover:bg-copper/20 flex items-center justify-center text-copper transition-colors relative"
        aria-label="اعلان‌ها"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '۹+' : unreadCount.toLocaleString('fa-IR')}
          </span>
        )}
      </button>

      {/* کشویی اعلان‌ها */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-2 w-[340px] sm:w-[380px] bg-surface dark:bg-night-surface rounded-2xl shadow-glow border border-ink/10 dark:border-white/10 overflow-hidden z-50"
            dir="rtl"
          >
            {/* هدر */}
            <div className="px-4 py-3 border-b border-ink/5 dark:border-white/5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-sm text-ink dark:text-night-ink">
                  اعلان‌ها
                </h3>
                {unreadCount > 0 && (
                  <span className="text-[9px] font-bold bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded-full">
                    {unreadCount.toLocaleString('fa-IR')} جدید
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] text-copper hover:text-copper-dark font-medium px-2 py-1 rounded-lg hover:bg-copper/10 transition-colors"
                  >
                    خواندن همه
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-[10px] text-red-500 hover:text-red-600 font-medium px-2 py-1 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    پاک کردن
                  </button>
                )}
              </div>
            </div>

            {/* لیست */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className="w-10 h-10 text-copper/20 mx-auto mb-3" />
                  <p className="text-sm text-ink/50 dark:text-night-ink/50">
                    اعلانی وجود ندارد
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-ink/5 dark:divide-white/5">
                  {notifications.map((n) => {
                    const Icon = TYPE_ICONS[n.type];
                    const item = (
                      <div
                        className={cn(
                          'flex items-start gap-3 p-3 hover:bg-copper/5 transition-colors cursor-pointer group',
                          !n.read && 'bg-copper/[0.03]'
                        )}
                        onClick={() => handleItemClick(n.id)}
                      >
                        <div
                          className={cn(
                            'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                            TYPE_COLORS[n.type]
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-display font-bold text-xs text-ink dark:text-night-ink line-clamp-1">
                              {n.title}
                            </div>
                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-copper shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-[11px] text-ink/60 dark:text-night-ink/60 leading-relaxed mt-0.5 line-clamp-2">
                            {n.message}
                          </p>
                          <div className="text-[9px] text-ink/40 dark:text-night-ink/40 mt-1">
                            {timeAgo(n.createdAt)}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeNotification(n.id);
                          }}
                          className="w-6 h-6 rounded-md hover:bg-red-500/10 flex items-center justify-center text-ink/30 dark:text-night-ink/30 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                          aria-label="حذف"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );

                    return n.link ? (
                      <Link
                        key={n.id}
                        to={n.link}
                        onClick={() => setIsOpen(false)}
                        className="block"
                      >
                        {item}
                      </Link>
                    ) : (
                      <div key={n.id}>{item}</div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}