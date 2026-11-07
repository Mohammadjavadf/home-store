import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Users,
  Mail,
  Phone,
  Trophy,
  ShoppingBag,
  Star,
  Eye,
  X,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { useAuthStore } from '../../store/authStore';
import { useOrdersStore } from '../../store/ordersStore';
import { useRewardsStore, getTier, TIERS } from '../../store/rewardsStore';
import { usePageTitle } from '../../hooks/usePageTitle';
import { formatPrice, cn } from '../../lib/utils';
import Button from '../../components/ui/Button';
import type { AuthUser } from '../../store/authStore';

export default function UsersList() {
  usePageTitle('مدیریت کاربران');

  const accounts = useAuthStore((s) => s.accounts);
  const orders = useOrdersStore((s) => s.orders);
  const pointsByUser = useRewardsStore((s) => s.pointsByUser);
  const couponsByUser = useRewardsStore((s) => s.couponsByUser);

  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null);

  const usersWithStats = useMemo(() => {
    return accounts.map((acc) => {
      const userOrders = orders.filter((o) => o.userId === acc.id);
      const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
      const points = pointsByUser[acc.id] ?? 0;
      const coupons = couponsByUser[acc.id] ?? [];
      const tier = getTier(points);
      return { ...acc, ordersCount: userOrders.length, totalSpent, points, coupons, tier };
    });
  }, [accounts, orders, pointsByUser, couponsByUser]);

  const filtered = useMemo(() => {
    if (!search.trim()) return usersWithStats;
    const q = search.toLowerCase();
    return usersWithStats.filter(
      (u) =>
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q)
    );
  }, [usersWithStats, search]);

  const userDetail = selectedUser
    ? usersWithStats.find((u) => u.id === selectedUser.id)
    : null;

  return (
    <div>
      <PageHeader
        title="کاربران"
        description={`${accounts.length.toLocaleString('fa-IR')} کاربر ثبت‌نام‌شده`}
      />

      {/* جستجو */}
      <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-3 mb-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40 dark:text-night-ink/40 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی نام، ایمیل یا موبایل..."
            className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all"
          />
        </div>
      </div>

      {/* لیست */}
      {filtered.length === 0 ? (
        <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-12 text-center">
          <Users className="w-12 h-12 text-copper/40 mx-auto mb-4" />
          <h3 className="font-display font-bold mb-2">
            {accounts.length === 0 ? 'هنوز کاربری ثبت‌نام نکرده' : 'کاربری پیدا نشد'}
          </h3>
          <p className="text-sm text-ink/60 dark:text-night-ink/60">
            {accounts.length === 0
              ? 'وقتی کاربران ثبت‌نام کنند، اینجا نمایش داده می‌شوند'
              : 'عبارت جستجو را تغییر بده'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence>
            {filtered.map((u) => (
              <motion.div
                key={u.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-4 hover:shadow-glow transition-shadow"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-copper/10 flex items-center justify-center font-display font-bold text-copper text-lg shrink-0">
                    {(u.firstName?.charAt(0) || '؟')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-sm text-ink dark:text-night-ink truncate">
                      {u.firstName} {u.lastName}
                    </div>
                    <div className="text-[10px] text-ink/50 dark:text-night-ink/50 truncate" dir="ltr">
                      {u.email}
                    </div>
                    <div className={cn('inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-br text-white', u.tier.gradient)}>
                      {u.tier.label}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="text-center p-2 rounded-lg bg-cream dark:bg-night">
                    <div className="text-[10px] text-ink/50 dark:text-night-ink/50">سفارش</div>
                    <div className="font-display font-bold text-sm text-ink dark:text-night-ink">
                      {u.ordersCount.toLocaleString('fa-IR')}
                    </div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-cream dark:bg-night">
                    <div className="text-[10px] text-ink/50 dark:text-night-ink/50">امتیاز</div>
                    <div className="font-display font-bold text-sm text-copper">
                      {u.points.toLocaleString('fa-IR')}
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedUser(u)}
                  className="w-full"
                >
                  <Eye className="w-3.5 h-3.5" />
                  مشاهده جزئیات
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* مودال جزئیات کاربر */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="جزئیات کاربر"
        size="md"
      >
        {userDetail && (
          <div className="space-y-4">
            {/* هدر */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-copper/10 flex items-center justify-center font-display font-bold text-copper text-xl shrink-0">
                {(userDetail.firstName?.charAt(0) || '؟')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-bold text-base text-ink dark:text-night-ink">
                  {userDetail.firstName} {userDetail.lastName}
                </div>
                <div className="text-xs text-ink/50 dark:text-night-ink/50" dir="ltr">
                  {userDetail.email}
                </div>
              </div>
              <div className={cn('text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-br text-white', userDetail.tier.gradient)}>
                {userDetail.tier.label}
              </div>
            </div>

            {/* اطلاعات تماس */}
            <div className="space-y-1.5 p-3 rounded-xl bg-cream dark:bg-night">
              <div className="flex items-center gap-2 text-sm text-ink/70 dark:text-night-ink/70" dir="ltr">
                <Mail className="w-4 h-4 text-copper shrink-0" />
                {userDetail.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-ink/70 dark:text-night-ink/70" dir="ltr">
                <Phone className="w-4 h-4 text-copper shrink-0" />
                {userDetail.phone || '—'}
              </div>
            </div>

            {/* آمار */}
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-3 rounded-xl bg-copper/5 border border-copper/20">
                <ShoppingBag className="w-4 h-4 text-copper mx-auto mb-1" />
                <div className="font-display font-bold text-sm text-ink dark:text-night-ink">
                  {userDetail.ordersCount.toLocaleString('fa-IR')}
                </div>
                <div className="text-[10px] text-ink/50 dark:text-night-ink/50">سفارش</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-forest/5 border border-forest/20">
                <Star className="w-4 h-4 text-forest mx-auto mb-1" />
                <div className="font-display font-bold text-sm text-ink dark:text-night-ink">
                  {formatPrice(userDetail.totalSpent)}
                </div>
                <div className="text-[10px] text-ink/50 dark:text-night-ink/50">خرید</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <Trophy className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                <div className="font-display font-bold text-sm text-ink dark:text-night-ink">
                  {userDetail.points.toLocaleString('fa-IR')}
                </div>
                <div className="text-[10px] text-ink/50 dark:text-night-ink/50">امتیاز</div>
              </div>
            </div>

            {/* کدهای تخفیف */}
            {userDetail.coupons.length > 0 && (
              <div>
                <h3 className="font-display font-bold text-sm mb-2">کدهای اختصاصی</h3>
                <div className="space-y-1.5">
                  {userDetail.coupons.map((c) => (
                    <div
                      key={c.code}
                      className={cn(
                        'flex items-center justify-between p-2 rounded-lg text-xs',
                        c.used
                          ? 'bg-ink/5 dark:bg-white/5 opacity-60'
                          : 'bg-forest/10 border border-forest/20'
                      )}
                    >
                      <span className="font-mono font-bold text-ink dark:text-night-ink" dir="ltr">
                        {c.code}
                      </span>
                      <span className={cn('font-bold', c.used ? 'text-ink/40' : 'text-forest')}>
                        {c.used ? 'استفاده شده' : `${c.percent}٪ فعال`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-end pt-2">
              <Button variant="ghost" onClick={() => setSelectedUser(null)}>
                بستن
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}