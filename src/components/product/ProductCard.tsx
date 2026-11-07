import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Check, Settings2 } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '../../types';
import { formatPrice, formatProductPrice, cn } from '../../lib/utils';
import SmartImage from '../ui/SmartImage';
import { useCartStore } from '../../store/cartStore';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { useProductRating } from '../../hooks/useProductRating';
import { flyToCart } from '../../lib/flyToCart';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const user = useAuthStore((s) => s.user);
  const { getWishlist, toggleWishlist } = useUserStore();
  const { rating, count } = useProductRating(product);

  const [added, setAdded] = useState(false);

  const wishlist = user ? getWishlist(user.id) : [];
  const inWishlist = wishlist.includes(product.id);

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const hasVariants = product.variants && product.variants.length > 0;
  const priceDisplay = formatProductPrice(product);

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.inStock || added) return;

    // اگر متغیر دارد → به صفحه جزئیات برو
    if (hasVariants) {
      toast.info('لطفاً ابتدا گزینه‌های محصول را انتخاب کنید');
      navigate(`/products/${product.id}`);
      return;
    }

    const img = e.currentTarget
      .closest('.group')
      ?.querySelector('img') as HTMLImageElement | null;
    if (img) flyToCart(img);

    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    toggleWishlist(user.id, product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="group relative"
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative bg-surface dark:bg-night-surface rounded-3xl overflow-hidden border border-ink/5 dark:border-white/5 shadow-soft hover:shadow-glow transition-all duration-500 hover:-translate-y-1 hover:border-copper/30">
          {discount > 0 && (
            <div className="absolute top-4 right-4 z-10 bg-copper text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {discount}٪ تخفیف
            </div>
          )}
          {!product.inStock && (
            <div className="absolute top-4 left-4 z-10 bg-ink/70 dark:bg-white/10 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              ناموجود
            </div>
          )}

          <div className="relative aspect-square overflow-hidden bg-cream dark:bg-night">
            <SmartImage
              src={product.image}
              alt={product.name}
              className="w-full h-full"
              imgClassName="transition-transform duration-700 group-hover:scale-110"
            />
            <button
              onClick={handleWishlist}
              className={cn(
                'absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center',
                'opacity-0 group-hover:opacity-100 transition-all duration-300 z-10',
                inWishlist
                  ? 'bg-copper text-white opacity-100'
                  : 'bg-white/90 dark:bg-night/90 hover:bg-copper hover:text-white text-ink dark:text-night-ink'
              )}
              aria-label="افزودن به علاقه‌مندی"
            >
              <Heart className={cn('w-4 h-4', inWishlist && 'fill-current')} />
            </button>
          </div>

          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-1 mb-2 min-h-[1.25rem]">
              {count > 0 ? (
                <>
                  <Star className="w-3.5 h-3.5 fill-copper text-copper" />
                  <span className="text-xs font-bold text-ink dark:text-night-ink">
                    {rating.toLocaleString('fa-IR')}
                  </span>
                  <span className="text-xs text-ink/50 dark:text-night-ink/50">
                    ({count.toLocaleString('fa-IR')})
                  </span>
                </>
              ) : (
                <span className="text-xs text-ink/40 dark:text-night-ink/40">
                  بدون نظر
                </span>
              )}
            </div>

            <h3 className="font-display font-bold text-sm sm:text-base text-ink dark:text-night-ink line-clamp-2 mb-3 min-h-[2.5rem]">
              {product.name}
            </h3>

            <div className="flex items-end justify-between gap-2">
              <div className="min-w-0">
                {product.oldPrice && (
                  <div className="text-xs text-ink/40 dark:text-night-ink/40 line-through mb-0.5">
                    {formatPrice(product.oldPrice)}
                  </div>
                )}
                <div
                  className={cn(
                    'font-display font-extrabold text-copper',
                    hasVariants ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
                  )}
                >
                  {priceDisplay}
                </div>
              </div>
              <button
                onClick={handleAdd}
                disabled={!product.inStock}
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0',
                  !product.inStock
                    ? 'bg-ink/10 dark:bg-white/10 text-ink/30 dark:text-white/30 cursor-not-allowed'
                    : added
                      ? 'bg-forest text-white'
                      : 'bg-copper text-white hover:bg-copper-dark active:scale-95'
                )}
                aria-label={hasVariants ? 'انتخاب گزینه‌ها' : 'افزودن به سبد خرید'}
                title={hasVariants ? 'ابتدا گزینه‌ها را انتخاب کنید' : 'افزودن به سبد'}
              >
                {added ? (
                  <Check className="w-4 h-4" />
                ) : hasVariants ? (
                  <Settings2 className="w-4 h-4" />
                ) : (
                  <ShoppingCart className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}