import { useState } from 'react';
import { MapPin, Plus, Trash2, Check } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { cn } from '../../lib/utils';
import Button from '../../components/ui/Button';

export default function Addresses() {
  const user = useAuthStore((s) => s.user);

  const {
    getAddresses,
    addAddress,
    removeAddress,
    setDefaultAddress,
  } = useUserStore();

  const addresses = user ? getAddresses(user.id) : [];

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    province: '',
    city: '',
    address: '',
    postalCode: '',
    phone: '',
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.title || !form.city || !form.address) return;

    addAddress(user.id, {
      ...form,
      isDefault: addresses.length === 0,
    });

    setForm({
      title: '',
      province: '',
      city: '',
      address: '',
      postalCode: '',
      phone: '',
    });
    setShowForm(false);
  };

  const handleRemove = (id: string) => {
    if (!user) return;
    removeAddress(user.id, id);
  };

  const handleSetDefault = (id: string) => {
    if (!user) return;
    setDefaultAddress(user.id, id);
  };

  return (
    <div className="space-y-3">
      {addresses.map((a) => (
        <div
          key={a.id}
          className={cn(
            'bg-surface dark:bg-night-surface rounded-2xl border shadow-soft p-4',
            a.isDefault ? 'border-copper/40' : 'border-ink/5 dark:border-white/5'
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-copper/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-copper" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display font-bold text-sm">{a.title}</span>
                  {a.isDefault && (
                    <span className="text-[10px] font-bold bg-copper text-white px-2 py-0.5 rounded-full">
                      پیش‌فرض
                    </span>
                  )}
                </div>
                <div className="text-xs text-ink/60 dark:text-night-ink/60">
                  {a.province}، {a.city}، {a.address}
                </div>
                {a.postalCode && (
                  <div className="text-xs text-ink/40 dark:text-night-ink/40 mt-0.5">
                    کد پستی: {a.postalCode}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              {!a.isDefault && (
                <button
                  onClick={() => handleSetDefault(a.id)}
                  className="w-8 h-8 rounded-lg hover:bg-forest/10 flex items-center justify-center text-ink/40 dark:text-night-ink/40 hover:text-forest transition-colors"
                  title="انتخاب به عنوان پیش‌فرض"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => handleRemove(a.id)}
                className="w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center justify-center text-ink/40 dark:text-night-ink/40 hover:text-red-500 transition-colors"
                aria-label="حذف"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {showForm ? (
        <form
          onSubmit={handleAdd}
          className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5 space-y-3"
        >
          <div className="grid sm:grid-cols-2 gap-3">
            <Input
              placeholder="عنوان (مثلاً خانه)"
              value={form.title}
              onChange={(v) => setForm({ ...form, title: v })}
            />
            <Input
              placeholder="استان"
              value={form.province}
              onChange={(v) => setForm({ ...form, province: v })}
            />
            <Input
              placeholder="شهر"
              value={form.city}
              onChange={(v) => setForm({ ...form, city: v })}
            />
            <Input
              placeholder="کد پستی"
              value={form.postalCode}
              onChange={(v) => setForm({ ...form, postalCode: v })}
            />
          </div>
          <Input
            placeholder="آدرس کامل"
            value={form.address}
            onChange={(v) => setForm({ ...form, address: v })}
          />
          <Input
            placeholder="شماره تماس"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
            dir="ltr"
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm">
              ذخیره
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowForm(false)}
            >
              انصراف
            </Button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full p-4 rounded-2xl border-2 border-dashed border-ink/10 dark:border-white/10 hover:border-copper/40 text-ink/50 dark:text-night-ink/50 hover:text-copper transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          افزودن آدرس جدید
        </button>
      )}
    </div>
  );
}

function Input({
  placeholder,
  value,
  onChange,
  dir,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  dir?: 'ltr' | 'rtl';
}) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      dir={dir}
      className="w-full px-3 py-2 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all"
    />
  );
}