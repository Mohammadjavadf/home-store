import { cn } from '../../lib/utils';

interface PriceInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

export default function PriceInput({
  label,
  value,
  onChange,
  error,
  placeholder = '۰',
  required = false,
}: PriceInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // فقط رقم بگیر
    const raw = e.target.value.replace(/\D/g, '');
    // حداکثر ۱۵ رقم
    const limited = raw.slice(0, 15);
    // با کاما فرمت کن
    const formatted = limited
      ? new Intl.NumberFormat('en-US').format(Number(limited))
      : '';
    onChange(formatted);
  };

  return (
    <div>
      <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
        {label} {required && '*'}
      </label>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          dir="ltr"
          className={cn(
            'w-full pl-14 pr-3 py-2.5 rounded-xl bg-cream dark:bg-night border text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:ring-2 focus:ring-copper/20 transition-all',
            error
              ? 'border-red-500'
              : 'border-ink/10 dark:border-white/10 focus:border-copper'
          )}
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-ink/40 dark:text-night-ink/40 pointer-events-none">
          تومان
        </span>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}