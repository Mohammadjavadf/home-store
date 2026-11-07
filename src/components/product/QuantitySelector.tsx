import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  value: number;
  onChange: (v: number) => void;
  max?: number;
  min?: number;
}

export default function QuantitySelector({
  value,
  onChange,
  max = 10,
  min = 1,
}: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center bg-cream dark:bg-night rounded-xl border border-ink/10 dark:border-white/10">
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-10 h-10 flex items-center justify-center text-ink dark:text-night-ink
                   hover:bg-copper/10 hover:text-copper rounded-r-xl
                   transition-colors disabled:opacity-30 disabled:pointer-events-none"
        aria-label="افزایش"
      >
        <Plus className="w-4 h-4" />
      </button>
      <span className="w-10 text-center font-display font-bold text-sm text-ink dark:text-night-ink">
        {value.toLocaleString('fa-IR')}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-10 h-10 flex items-center justify-center text-ink dark:text-night-ink
                   hover:bg-copper/10 hover:text-copper rounded-l-xl
                   transition-colors disabled:opacity-30 disabled:pointer-events-none"
        aria-label="کاهش"
      >
        <Minus className="w-4 h-4" />
      </button>
    </div>
  );
}