import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowLeft } from 'lucide-react';
import { useSearchStore } from '../../store/searchStore';
import { products } from '../../data/products';
import { formatPrice } from '../../lib/utils';
import SmartImage from '../ui/SmartImage';

export default function SearchModal() {
  const { isOpen, query, close, setQuery } = useSearchStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // فوکوس خودکار
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Escape + Ctrl+K
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        useSearchStore.getState().open();
      }
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [close]);

  // قفل اسکرول بدنه هنگام باز بودن
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => {
        const haystack = `${p.name} ${p.brand} ${p.category}`.toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 6);
  }, [query]);

  const handleSelect = (id: string) => {
    close();
    navigate(`/products/${id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* اورلی */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-[60]"
          />

          {/* مودال */}
          <motion.div
  initial={{ opacity: 0, y: -20, scale: 0.98 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: -20, scale: 0.98 }}
  transition={{ duration: 0.2 }}
  className="fixed z-[61] inset-0 flex items-start justify-center sm:pt-[10vh] pointer-events-none"
>
  <div className="pointer-events-auto w-full sm:w-[92%] sm:max-w-2xl">
    <div className="bg-surface dark:bg-night-surface sm:rounded-3xl sm:shadow-glow sm:border sm:border-ink/10 dark:sm:border-white/10 overflow-hidden h-[100dvh] sm:h-auto flex flex-col sm:block">
              {/* نوار جستجو */}
              <div className="flex items-center gap-3 px-4 sm:px-5 py-4 border-b border-ink/5 dark:border-white/5 shrink-0">
                <Search className="w-5 h-5 text-copper shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجوی محصول، برند یا دسته..."
                  className="flex-1 bg-transparent text-base text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none min-w-0"
                />
                <button
                  onClick={close}
                  className="w-9 h-9 rounded-lg hover:bg-copper/10 flex items-center justify-center text-ink/50 dark:text-night-ink/50 hover:text-copper transition-colors shrink-0"
                  aria-label="بستن"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* نتایج */}
              <div className="flex-1 sm:flex-none overflow-y-auto p-2 sm:max-h-[60vh]">
                {!query.trim() ? (
                  <div className="text-center py-10 sm:py-12 text-sm text-ink/40 dark:text-night-ink/40 px-4">
                    شروع به تایپ کن...
                    <div className="mt-3 text-xs text-ink/30 dark:text-night-ink/30">
                      <span className="hidden sm:inline">میانبر: Ctrl + K</span>
                    </div>
                  </div>
                ) : results.length === 0 ? (
                  <div className="text-center py-10 sm:py-12 px-4">
                    <p className="text-sm text-ink/60 dark:text-night-ink/60 mb-1">
                      نتیجه‌ای پیدا نشد
                    </p>
                    <p className="text-xs text-ink/40 dark:text-night-ink/40">
                      عبارت دیگری را امتحان کن
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {results.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSelect(p.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-copper/5 active:bg-copper/10 transition-colors text-right"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-cream dark:bg-night shrink-0">
                          <SmartImage
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-ink dark:text-night-ink line-clamp-1">
                            {p.name}
                          </div>
                          <div className="text-xs text-ink/50 dark:text-night-ink/50 mt-0.5 line-clamp-1">
                            {p.brand} · {p.category}
                          </div>
                        </div>
                        <div className="text-xs font-bold text-copper shrink-0 whitespace-nowrap">
                          {formatPrice(p.price)}
                        </div>
                        <ArrowLeft className="w-4 h-4 text-ink/30 dark:text-night-ink/30 shrink-0 hidden sm:block" />
                      </button>
                    ))}
                    {results.length >= 6 && (
                      <button
                        onClick={() => {
                          close();
                          navigate('/products');
                        }}
                        className="w-full text-center py-3 text-xs text-copper hover:text-copper-dark transition-colors"
                      >
                        مشاهده همه نتایج در صفحه محصولات
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* فوتر راهنما — فقط دسکتاپ */}
              <div className="hidden sm:flex items-center justify-between px-5 py-2.5 border-t border-ink/5 dark:border-white/5 text-[10px] text-ink/40 dark:text-night-ink/40 shrink-0">
                <span>Enter برای انتخاب</span>
                <span>Esc برای بستن</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}