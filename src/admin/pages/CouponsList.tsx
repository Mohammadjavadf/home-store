import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Ticket,
  Trash2,
  Copy,
  Check,
  Calendar,
  Percent,
} from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import Modal from '../components/Modal';
import PersianDatePicker from '../components/PersianDatePicker';
import Button from '../../components/ui/Button';
import { usePublicCouponsStore } from '../../store/publicCouponsStore';
import { usePageTitle } from '../../hooks/usePageTitle';
import { cn } from '../../lib/utils';

export default function CouponsList() {
  usePageTitle('کدهای تخفیف');

  const {
    coupons,
    addCoupon,
    deleteCoupon,
    toggleActive,
  } = usePublicCouponsStore();

  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [form, setForm] = useState({
    code: '',
    percent: '',
    maxUses: '100',
    expiresAt: '',
  });
  const [formError, setFormError] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const percent = Number(form.percent);
    if (!percent || percent < 1 || percent > 100) {
      setFormError('درصد باید بین ۱ تا ۱۰۰ باشد');
      return;
    }

    const maxUses = Number(form.maxUses);
    if (!maxUses || maxUses < 1) {
      setFormError('حداکثر استفاده باید حداقل ۱ باشد');
      return;
    }

    if (!form.expiresAt) {
      setFormError('تاریخ انقضا را انتخاب کنید');
      return;
    }

    const res = addCoupon({
      code: form.code,
      percent,
      maxUses,
      expiresAt: form.expiresAt,
    });

    if (!res.ok) {
      setFormError(res.error || 'خطا');
      return;
    }

    toast.success('کد تخفیف ساخته شد');
    setShowForm(false);
    setForm({ code: '', percent: '', maxUses: '100', expiresAt: '' });
  };

  const handleDelete = () => {
    if (confirmDelete) {
      deleteCoupon(confirmDelete);
      toast.success('کد حذف شد');
    }
  };

  const handleToggle = (id: string) => {
    toggleActive(id);
    toast.success('وضعیت کد تغییر کرد');
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const now = new Date().toISOString().split('T')[0];

  return (
    <div>
      <PageHeader
        title="کدهای تخفیف"
        description={`${coupons.length.toLocaleString('fa-IR')} کد عمومی`}
        actions={
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" />
            کد جدید
          </Button>
        }
      />

      {coupons.length === 0 ? (
        <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-12 text-center">
          <Ticket className="w-12 h-12 text-copper/40 mx-auto mb-4" />
          <h3 className="font-display font-bold mb-2">هنوز کدی نیست</h3>
          <p className="text-sm text-ink/60 dark:text-night-ink/60 mb-5">
            اولین کد تخفیف عمومی را بساز
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" />
            ساخت کد
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence>
            {coupons.map((c) => {
              const isExpired = c.expiresAt < now;
              const isFull = c.usedCount >= c.maxUses;
              const isInactive = !c.active || isExpired || isFull;

              return (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    'bg-surface dark:bg-night-surface rounded-2xl border shadow-soft p-4',
                    isInactive
                      ? 'border-ink/10 dark:border-white/10 opacity-70'
                      : 'border-copper/30'
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-copper flex items-center justify-center text-white shrink-0">
                        <Ticket className="w-5 h-5" />
                      </div>
                      <div>
                        <div
                          className="font-mono font-bold text-sm text-ink dark:text-night-ink select-all"
                          dir="ltr"
                        >
                          {c.code}
                        </div>
                        <div className="text-[10px] text-ink/50 dark:text-night-ink/50">
                          {c.percent}٪ تخفیف
                        </div>
                      </div>
                    </div>
                    {isInactive ? (
                      <span className="text-[9px] font-bold bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded-full">
                        {isExpired ? 'منقضی' : isFull ? 'تمام' : 'غیرفعال'}
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold bg-forest/10 text-forest px-1.5 py-0.5 rounded-full">
                        فعال
                      </span>
                    )}
                  </div>

                  {/* نوار پیشرفت استفاده */}
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] text-ink/60 dark:text-night-ink/60 mb-1">
                      <span className="flex items-center gap-1">
                        <Percent className="w-3 h-3" />
                        {c.usedCount.toLocaleString('fa-IR')} /{' '}
                        {c.maxUses.toLocaleString('fa-IR')} استفاده
                      </span>
                      <span>
                        {Math.round((c.usedCount / c.maxUses) * 100).toLocaleString(
                          'fa-IR'
                        )}
                        ٪
                      </span>
                    </div>
                    <div className="h-1.5 bg-ink/10 dark:bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          isFull ? 'bg-red-500' : 'bg-copper'
                        )}
                        style={{
                          width: `${Math.min(
                            100,
                            (c.usedCount / c.maxUses) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-ink/60 dark:text-night-ink/60 mb-3">
                    <Calendar className="w-3 h-3" />
                    انقضا: {new Date(c.expiresAt).toLocaleDateString('fa-IR')}
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => copyCode(c.code)}
                      className="flex-1 h-8 rounded-lg bg-copper/10 text-copper hover:bg-copper/20 flex items-center justify-center gap-1 text-[10px] font-medium transition-colors"
                    >
                      {copiedCode === c.code ? (
                        <>
                          <Check className="w-3 h-3" />
                          کپی شد
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          کپی
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleToggle(c.id)}
                      className={cn(
                        'flex-1 h-8 rounded-lg flex items-center justify-center text-[10px] font-medium transition-colors',
                        c.active
                          ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
                          : 'bg-forest/10 text-forest hover:bg-forest/20'
                      )}
                    >
                      {c.active ? 'غیرفعال' : 'فعال'}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(c.id)}
                      className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* مودال */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="کد تخفیف جدید"
        size="sm"
      >
        <form onSubmit={handleAdd} className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
              کد *
            </label>
            <input
              type="text"
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value.toUpperCase() })
              }
              placeholder="مثلاً HOME10"
              dir="ltr"
              className="w-full px-3 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
                درصد *
              </label>
              <input
                type="number"
                value={form.percent}
                onChange={(e) => setForm({ ...form, percent: e.target.value })}
                placeholder="10"
                min={1}
                max={100}
                className="w-full px-3 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
                حداکثر استفاده
              </label>
              <input
                type="number"
                value={form.maxUses}
                onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                placeholder="100"
                min={1}
                className="w-full px-3 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all"
              />
            </div>
          </div>

          <PersianDatePicker
            label="تاریخ انقضا"
            value={form.expiresAt}
            onChange={(v) => setForm({ ...form, expiresAt: v })}
            required
            minDate={new Date()}
          />

          {formError && (
            <div className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg px-3 py-2">
              {formError}
            </div>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowForm(false)}
            >
              انصراف
            </Button>
            <Button type="submit">ساخت کد</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="حذف کد تخفیف"
        message="آیا از حذف این کد مطمئنی؟"
        confirmLabel="حذف کن"
      />
    </div>
  );
}