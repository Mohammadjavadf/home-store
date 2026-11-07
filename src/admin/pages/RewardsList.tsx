import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Trophy,
  Users,
  Ticket,
  TrendingUp,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useAuthStore } from '../../store/authStore';
import {
  useRewardsStore,
  getTier,
  TIERS,
} from '../../store/rewardsStore';
import { usePageTitle } from '../../hooks/usePageTitle';
import { cn } from '../../lib/utils';

export default function RewardsList() {
  usePageTitle('باشگاه مشتریان');

  const accounts = useAuthStore((s) => s.accounts);
  const pointsByUser = useRewardsStore((s) => s.pointsByUser);
  const couponsByUser = useRewardsStore((s) => s.couponsByUser);

  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | string>('all');

  const usersWithPoints = useMemo(() => {
    return accounts
      .map((acc) => {
        const points = pointsByUser[acc.id] ?? 0;
        const tier = getTier(points);
        const coupons = couponsByUser[acc.id] ?? [];
        return {
          id: acc.id,
          name: `${acc.firstName} ${acc.lastName}`.trim() || acc.email,
          email: acc.email,
          points,
          tier,
          coupons,
        };
      })
      .sort((a, b) => b.points - a.points);
  }, [accounts, pointsByUser, couponsByUser]);

  const filtered = useMemo(() => {
    return usersWithPoints.filter((u) => {
      if (tierFilter !== 'all' && u.tier.key !== tierFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !u.name.toLowerCase().includes(q) &&
          !u.email.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [usersWithPoints, search, tierFilter]);

  // آمار کلی
  const stats = useMemo(() => {
    const totalPoints = usersWithPoints.reduce((s, u) => s + u.points, 0);
    const tierCounts: Record<string, number> = {};
    TIERS.forEach((t) => (tierCounts[t.key] = 0));
    usersWithPoints.forEach((u) => tierCounts[u.tier.key]++);

    const totalCoupons = Object.values(couponsByUser).reduce(
      (s, arr) => s + arr.length,
      0
    );
    const usedCoupons = Object.values(couponsByUser).reduce(
      (s, arr) => s + arr.filter((c) => c.used).length,
      0
    );

    return { totalPoints, tierCounts, totalCoupons, usedCoupons };
  }, [usersWithPoints, couponsByUser]);

  return (
    <div>
      <PageHeader
        title="باشگاه مشتریان"
        description="مدیریت امتیازات و کدهای اختصاصی کاربران"
      />

      {/* آمار کلی */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-copper/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-copper" />
            </div>
            <span className="text-xs text-ink/50 dark:text-night-ink/50">اعضای باشگاه</span>
          </div>
          <div className="font-display font-extrabold text-xl text-ink dark:text-night-ink">
            {usersWithPoints.length.toLocaleString('fa-IR')}
          </div>
        </div>

        <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-xs text-ink/50 dark:text-night-ink/50">کل امتیازات</span>
          </div>
          <div className="font-display font-extrabold text-xl text-ink dark:text-night-ink">
            {stats.totalPoints.toLocaleString('fa-IR')}
          </div>
        </div>

        <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-forest/10 flex items-center justify-center">
              <Ticket className="w-4 h-4 text-forest" />
            </div>
            <span className="text-xs text-ink/50 dark:text-night-ink/50">کدهای تولیدشده</span>
          </div>
          <div className="font-display font-extrabold text-xl text-ink dark:text-night-ink">
            {stats.totalCoupons.toLocaleString('fa-IR')}
          </div>
        </div>

        <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-xs text-ink/50 dark:text-night-ink/50">کدهای مصرف‌شده</span>
          </div>
          <div className="font-display font-extrabold text-xl text-ink dark:text-night-ink">
            {stats.usedCoupons.toLocaleString('fa-IR')}
          </div>
        </div>
      </div>

      {/* فیلتر سطوح */}
      <div className="mb-4 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setTierFilter('all')}
            className={cn(
              'px-3 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap',
              tierFilter === 'all'
                ? 'bg-copper text-white'
                : 'bg-surface dark:bg-night-surface text-ink/70 dark:text-night-ink/70 border border-ink/5 dark:border-white/5 hover:bg-copper/10'
            )}
          >
            همه ({usersWithPoints.length.toLocaleString('fa-IR')})
          </button>
          {TIERS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTierFilter(t.key)}
              className={cn(
                'px-3 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap',
                tierFilter === t.key
                  ? 'bg-copper text-white'
                  : 'bg-surface dark:bg-night-surface text-ink/70 dark:text-night-ink/70 border border-ink/5 dark:border-white/5 hover:bg-copper/10'
              )}
            >
              {t.label} ({stats.tierCounts[t.key].toLocaleString('fa-IR')})
            </button>
          ))}
        </div>
      </div>

      {/* جستجو */}
      <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-3 mb-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40 dark:text-night-ink/40 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی نام یا ایمیل..."
            className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all"
          />
        </div>
      </div>

      {/* لیست */}
      {filtered.length === 0 ? (
        <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-12 text-center">
          <Trophy className="w-12 h-12 text-copper/40 mx-auto mb-4" />
          <h3 className="font-display font-bold mb-2">کاربری پیدا نشد</h3>
          <p className="text-sm text-ink/60 dark:text-night-ink/60">
            فیلتر یا جستجو را تغییر بده
          </p>
        </div>
      ) : (
        <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft overflow-hidden">
          {/* دسکتاپ */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink/5 dark:border-white/5 bg-cream/50 dark:bg-night/50">
                  <th className="text-right p-3 text-[10px] font-bold text-ink/60 dark:text-night-ink/60 uppercase">کاربر</th>
                  <th className="text-center p-3 text-[10px] font-bold text-ink/60 dark:text-night-ink/60 uppercase">سطح</th>
                  <th className="text-center p-3 text-[10px] font-bold text-ink/60 dark:text-night-ink/60 uppercase">امتیاز</th>
                  <th className="text-center p-3 text-[10px] font-bold text-ink/60 dark:text-night-ink/60 uppercase">کدها</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((u) => (
                    <motion.tr
                      key={u.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-ink/5 dark:border-white/5 last:border-0 hover:bg-copper/5 transition-colors"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-copper/10 flex items-center justify-center font-bold text-copper text-sm shrink-0">
                            {u.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-ink dark:text-night-ink truncate">
                              {u.name}
                            </div>
                            <div className="text-[10px] text-ink/50 dark:text-night-ink/50 truncate" dir="ltr">
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={cn(
                            'inline-block text-[10px] font-bold px-2 py-1 rounded-full bg-gradient-to-br text-white',
                            u.tier.gradient
                          )}
                        >
                          {u.tier.label}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="font-display font-bold text-sm text-copper">
                          {u.points.toLocaleString('fa-IR')}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-[10px] text-forest font-bold">
                            {u.coupons.filter((c) => !c.used).length.toLocaleString('fa-IR')} فعال
                          </span>
                          <span className="text-[10px] text-ink/40 dark:text-night-ink/40">/</span>
                          <span className="text-[10px] text-ink/50 dark:text-night-ink/50">
                            {u.coupons.length.toLocaleString('fa-IR')}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* موبایل */}
          <div className="lg:hidden divide-y divide-ink/5 dark:divide-white/5">
            {filtered.map((u) => (
              <div key={u.id} className="p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-copper/10 flex items-center justify-center font-bold text-copper shrink-0">
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-ink dark:text-night-ink truncate">
                    {u.name}
                  </div>
                  <div className="text-[10px] text-ink/50 dark:text-night-ink/50 truncate" dir="ltr">
                    {u.email}
                  </div>
                </div>
                <div className="text-left shrink-0">
                  <span
                    className={cn(
                      'inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-br text-white',
                      u.tier.gradient
                    )}
                  >
                    {u.tier.label}
                  </span>
                  <div className="text-xs font-bold text-copper mt-1">
                    {u.points.toLocaleString('fa-IR')} امتیاز
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}