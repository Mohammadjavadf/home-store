import { useState } from 'react';
import { Check } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { cn } from '../../lib/utils';
import Button from '../../components/ui/Button';

const emptyProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
};

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const { getProfile, updateProfile } = useUserStore();

  const currentProfile = user ? getProfile(user.id) : emptyProfile;

  const [form, setForm] = useState(currentProfile);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    updateProfile(user.id, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-6">
      <h2 className="font-display font-bold text-lg mb-5">اطلاعات شخصی</h2>

      <form onSubmit={handleSave} className="space-y-4 max-w-lg">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="نام"
            value={form.firstName}
            onChange={(v) => setForm({ ...form, firstName: v })}
          />
          <Field
            label="نام خانوادگی"
            value={form.lastName}
            onChange={(v) => setForm({ ...form, lastName: v })}
          />
        </div>
        <Field
          label="ایمیل"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
          dir="ltr"
        />
        <Field
          label="موبایل"
          value={form.phone}
          onChange={(v) => setForm({ ...form, phone: v })}
          dir="ltr"
        />

        <Button type="submit" className="w-full sm:w-auto">
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              ذخیره شد
            </>
          ) : (
            'ذخیره تغییرات'
          )}
        </Button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  dir,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  dir?: 'ltr' | 'rtl';
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={dir}
        className={cn(
          'w-full px-3 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all'
        )}
      />
    </div>
  );
}