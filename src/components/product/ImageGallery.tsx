import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Box, Move3d } from 'lucide-react';
import SmartImage from '../ui/SmartImage';
import { cn } from '../../lib/utils';

interface ImageGalleryProps {
  images: string[];
  alt: string;
  productId: string;
}

export default function ImageGallery({ images, alt, productId }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const dragStartX = useRef(0);
  const rotationStart = useRef(0);

  const activeImage = images[activeIndex] || images[0];

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      setIsDragging(true);
      dragStartX.current = e.clientX;
      rotationStart.current = rotation;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [rotation]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartX.current;
      setRotation(rotationStart.current + dx * 0.5);
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="space-y-4">
      {/* تصویر اصلی + چرخش ۳۶۰ */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={cn(
          'relative aspect-square rounded-3xl overflow-hidden bg-cream dark:bg-night',
          'border border-ink/5 dark:border-white/5 shadow-soft',
          'select-none touch-none',
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        )}
      >
        <motion.div
          animate={{ rotateY: rotation }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ transformStyle: 'preserve-3d' }}
          className="w-full h-full"
        >
          <SmartImage
            src={activeImage}
            alt={alt}
            className="w-full h-full"
            imgClassName="pointer-events-none"
          />
        </motion.div>

        {/* نشانگر چرخش */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-ink/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full pointer-events-none">
            <Move3d className="w-3.5 h-3.5" />
            برای چرخش بکش
          </div>
        )}

        {/* 🔮 اینجا بعداً می‌تونی دکمه‌ی مدل سه‌بعدی واقعی اضافه کنی */}
        <button
          type="button"
          className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/90 dark:bg-night/90
                     flex items-center justify-center hover:bg-copper hover:text-white
                     text-ink dark:text-night-ink transition-all duration-300 z-10"
          aria-label="نمایش سه‌بعدی (به‌زودی)"
          title="نمایش سه‌بعدی به‌زودی"
          onClick={(e) => e.stopPropagation()}
        >
          <Box className="w-5 h-5" />
        </button>
      </div>

      {/* تامبنیل‌ها */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <button
              key={`${productId}-thumb-${i}`}
              onClick={() => {
                setActiveIndex(i);
                setRotation(0);
              }}
              className={cn(
                'relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300',
                i === activeIndex
                  ? 'border-copper shadow-glow scale-105'
                  : 'border-ink/10 dark:border-white/10 hover:border-copper/40'
              )}
              aria-label={`تصویر ${i + 1}`}
            >
              <SmartImage
                src={img}
                alt={`${alt} - ${i + 1}`}
                className="w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}