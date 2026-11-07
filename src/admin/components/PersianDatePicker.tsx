import * as ReactMultiDatePicker from 'react-multi-date-picker';
import { Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';

const DatePickerComponent =
  (ReactMultiDatePicker.default as any)?.DatePicker ||
  (ReactMultiDatePicker as any).DatePicker ||
  ReactMultiDatePicker.default;

interface PersianDatePickerProps {
  label: string;
  value: string;
  onChange: (iso: string) => void;
  error?: string;
  required?: boolean;
  minDate?: Date;
}

export default function PersianDatePicker({
  label,
  value,
  onChange,
  error,
  required = false,
  minDate,
}: PersianDatePickerProps) {
  const dateValue = value ? new Date(value) : undefined;

  if (typeof DatePickerComponent !== 'function') {
    return (
      <div>
        <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
          {label} {required && '*'}
        </label>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink"
        />
      </div>
    );
  }

  return (
    <div>
      <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
        {label} {required && '*'}
      </label>
      <div className="relative">
        <DatePickerComponent
          value={dateValue}
          onChange={(date: any) => {
            if (!date) return onChange('');
            const jsDate = date.toDate ? date.toDate() : date;
            onChange(jsDate.toISOString().split('T')[0]);
          }}
          calendar="persian"     // ⬅️ رشته به جای آبجکت
          locale="fa"            // ⬅️ "fa" به جای "persian_fa"
          calendarPosition="bottom-right"
          minDate={minDate}
          inputClass={cn(
            'w-full px-3 py-2.5 pr-10 rounded-xl bg-cream dark:bg-night border text-sm text-ink dark:text-night-ink focus:outline-none focus:ring-2 focus:ring-copper/20 transition-all',
            error ? 'border-red-500' : 'border-ink/10 dark:border-white/10 focus:border-copper'
          )}
          containerClassName="w-full"
          placeholder="انتخاب تاریخ"
          format="YYYY/MM/DD"
          editable={false}
        />
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40 dark:text-night-ink/40 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}