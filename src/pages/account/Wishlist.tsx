import { Link } from 'react-router-dom';
import { Heart, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { useProductsStore } from '../../store/productsStore';
import { formatPrice } from '../../lib/utils';
import SmartImage from '../../components/ui/SmartImage';

export default function Wishlist() {
  const user = useAuthStore((s) => s.user);
  const { getWishlist, toggleWishlist } = useUserStore();
  const products = useProductsStore((s) => s.products);

  const wishlist = user ? getWishlist(user.id) : [];
  const items = products.filter((p) => wishlist.includes(p.id));

  if (items.length === 0) {
    return (
      <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-12 text-center">
        <Heart className="w-12 h-12 text-copper/40 mx-auto mb-4" />
        <h3 className="font-display font-bold mb-2">لیست علاقه‌مندی خالی است</h3>
        <p className="text-sm text-ink/60 dark:text-night-ink/60 mb-5">
          محصولات مورد علاقه‌ات را با قلب ذخیره کن.
        </p>
        <Link to="/products" className="text-copper text-sm font-medium hover:underline">
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((p) => (
        <div
          key={p.id}
          className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-3 flex items-center gap-3"
        >
          <Link
            to={`/products/${p.id}`}
            className="w-14 h-14 rounded-xl overflow-hidden bg-cream dark:bg-night shrink-0"
          >
            <SmartImage src={p.image} alt={p.name} className="w-full h-full" />
          </Link>
          <div className="flex-1 min-w-0">
            <Link
              to={`/products/${p.id}`}
              className="text-sm font-bold text-ink dark:text-night-ink hover:text-copper transition-colors line-clamp-1"
            >
              {p.name}
            </Link>
            <div className="text-xs font-bold text-copper mt-0.5">
              {formatPrice(p.price)}
            </div>
          </div>
          <button
            onClick={() => user && toggleWishlist(user.id, p.id)}
            className="w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center justify-center text-ink/40 dark:text-night-ink/40 hover:text-red-500 transition-colors shrink-0"
            aria-label="حذف"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}