import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}

export default function SmartImage({
  src,
  alt,
  className,
  imgClassName,
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* پلیسهولدر / حالت خطا */}
      {(!loaded || error) && (
        <div className="absolute inset-0 bg-gradient-to-br from-copper/10 via-cream to-forest/5 dark:from-copper/10 dark:via-night-surface dark:to-forest/10 flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-copper/10 flex items-center justify-center">
            <ImageOff className="w-6 h-6 text-copper/60" />
          </div>
          <span className="text-[10px] text-ink/30 dark:text-night-ink/30 font-medium">
            تصویر محصول
          </span>
        </div>
      )}

      {/* تصویر اصلی */}
      {!error && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={cn(
            'w-full h-full object-cover transition-all duration-700',
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105',
            imgClassName
          )}
        />
      )}
    </div>
  );
}