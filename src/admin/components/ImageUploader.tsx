import { useRef, useState } from 'react';
import { Upload, Link2, X, ImageIcon } from 'lucide-react';
import SmartImage from '../../components/ui/SmartImage';
import { cn } from '../../lib/utils';

interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const MAX_SIZE = 1024 * 1024; // 1MB

export default function ImageUploader({
  value,
  onChange,
  label = 'تصویر محصول',
}: ImageUploaderProps) {
  const [mode, setMode] = useState<'file' | 'url'>('file');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError('');
    if (!file.type.startsWith('image/')) {
      setError('فقط فایل تصویری مجاز است');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('حجم فایل باید کمتر از ۱ مگابایت باشد');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
        {label}
      </label>

      {/* تب‌ها */}
      <div className="flex gap-1 mb-2">
        <button
          type="button"
          onClick={() => setMode('file')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
            mode === 'file'
              ? 'bg-copper text-white'
              : 'bg-cream dark:bg-night text-ink/60 dark:text-night-ink/60 hover:bg-copper/10'
          )}
        >
          <Upload className="w-3 h-3" />
          آپلود فایل
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
            mode === 'url'
              ? 'bg-copper text-white'
              : 'bg-cream dark:bg-night text-ink/60 dark:text-night-ink/60 hover:bg-copper/10'
          )}
        >
          <Link2 className="w-3 h-3" />
          لینک تصویر
        </button>
      </div>

      {/* پیش‌نمایش */}
      {value ? (
        <div className="relative rounded-xl overflow-hidden bg-cream dark:bg-night border border-ink/10 dark:border-white/10 mb-2">
          <SmartImage src={value} alt="پیش‌نمایش" className="w-full aspect-video" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 left-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
            aria-label="حذف تصویر"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="rounded-xl bg-cream dark:bg-night border-2 border-dashed border-ink/10 dark:border-white/10 p-6 text-center mb-2">
          <ImageIcon className="w-8 h-8 text-copper/40 mx-auto mb-2" />
          <p className="text-xs text-ink/50 dark:text-night-ink/50">
            تصویری انتخاب نشده
          </p>
        </div>
      )}

      {/* ورودی */}
      {mode === 'file' ? (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink/70 dark:text-night-ink/70 hover:border-copper hover:text-copper transition-colors"
          >
            <Upload className="w-4 h-4" />
            انتخاب فایل
          </button>
        </>
      ) : (
        <input
          type="text"
          value={value.startsWith('data:') ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          dir="ltr"
          className="w-full px-3 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all"
        />
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}