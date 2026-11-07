import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Star,
  ShoppingCart,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Bell,
  Package,
  GitCompare,
} from 'lucide-react';
import { formatPrice, formatProductPrice, cn } from '../lib/utils';
import Button from '../components/ui/Button';
import ImageGallery from '../components/product/ImageGallery';
import QuantitySelector from '../components/product/QuantitySelector';
import ProductCard from '../components/product/ProductCard';
import ProductReviews from '../components/product/ProductReviews';
import { useProductsStore } from '../store/productsStore';
import { useCartStore } from '../store/cartStore';
import { useUserStore } from '../store/userStore';
import { useAuthStore } from '../store/authStore';
import { useCompareStore } from '../store/compareStore';
import { useProductRating } from '../hooks/useProductRating';
import { flyToCart } from '../lib/flyToCart';
import { usePageTitle } from '../hooks/usePageTitle';

type Tab = 'description' | 'features' | 'reviews';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();

  const products = useProductsStore((s) => s.products);
  const product = id ? products.find((p) => p.id === id) : undefined;

  usePageTitle(product?.name ?? 'محصول');

  const user = useAuthStore((s) => s.user);

  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>('description');
  const [added, setAdded] = useState(false);
  const [notified, setNotified] = useState(false);
  const [selectedVariantOptions, setSelectedVariantOptions] = useState<
    Record<string, number>
  >({});
  const [showVariantError, setShowVariantError] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { getWishlist, toggleWishlist } = useUserStore();
  const { has, add, remove, isFull } = useCompareStore();

  const { rating, count } = useProductRating(product);

  const wishlist = user ? getWishlist(user.id) : [];
  const inWishlist = product ? wishlist.includes(product.id) : false;
  const inCompare = product ? has(product.id) : false;

  const similar = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, 4);
  }, [product, products]);

  // آیا همه متغیرها انتخاب شده‌اند؟
  const allVariantsSelected = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return true;
    return product.variants.every(
      (v) => selectedVariantOptions[v.id] !== undefined
    );
  }, [product, selectedVariantOptions]);

  const variantAdjustment = useMemo(() => {
    if (!product?.variants) return 0;
    return product.variants.reduce((sum, v) => {
      const selectedIdx = selectedVariantOptions[v.id];
      if (selectedIdx === undefined) return sum;
      return sum + (v.options[selectedIdx].price - product.price);
    }, 0);
  }, [product, selectedVariantOptions]);

  const finalPrice = product ? product.price + variantAdjustment : 0;
  const finalOldPrice =
    product?.oldPrice !== undefined
      ? product.oldPrice + variantAdjustment
      : undefined;

  const variantInStock = useMemo(() => {
    if (!product?.variants) return product?.inStock ?? true;
    return product.variants.every((v) => {
      const selectedIdx = selectedVariantOptions[v.id];
      if (selectedIdx === undefined) return true;
      return v.options[selectedIdx].inStock;
    });
  }, [product, selectedVariantOptions]);

  const hasAnySelection = Object.keys(selectedVariantOptions).length > 0;

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-copper/10 flex items-center justify-center mb-6">
          <Package className="w-10 h-10 text-copper" />
        </div>
        <h1 className="text-2xl font-display font-bold mb-3">محصول پیدا نشد</h1>
        <p className="text-ink/60 dark:text-night-ink/60 mb-6">
          شاید حذف شده یا آدرس اشتباهه.
        </p>
        <Link to="/products">
          <Button>بازگشت به محصولات</Button>
        </Link>
      </div>
    );
  }

  const discount =
    finalOldPrice && finalOldPrice > finalPrice
      ? Math.round(((finalOldPrice - finalPrice) / finalOldPrice) * 100)
      : 0;

  const gallery =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image];

  const handleAddToCart = () => {
    if (!product) return;

    // چک: همه متغیرها انتخاب شده‌اند؟
    if (product.variants && product.variants.length > 0) {
      if (!allVariantsSelected) {
        setShowVariantError(true);
        // اسکرول به بخش متغیرها
        window.scrollTo({ top: 200, behavior: 'smooth' });
        setTimeout(() => setShowVariantError(false), 3000);
        return;
      }
    }

    const img = document.querySelector(
      '.lg\\:grid-cols-2 img'
    ) as HTMLImageElement | null;
    if (img) flyToCart(img);

    let priceAdj = 0;
    let variantName = '';
    let variantLabel = '';
    if (product.variants) {
      product.variants.forEach((v) => {
        const idx = selectedVariantOptions[v.id];
        priceAdj += v.options[idx].price - product.price;
        if (!variantName) {
          variantName = v.name;
          variantLabel = v.options[idx].label;
        }
      });
    }

    addItem(product, {
      quantity,
      selectedVariant: variantName
        ? { name: variantName, option: variantLabel }
        : undefined,
      finalPrice: product.price + priceAdj,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = () => {
    if (!user || !product) return;
    toggleWishlist(user.id, product.id);
  };

  const handleCompare = () => {
    if (inCompare) remove(product.id);
    else if (!isFull()) add(product);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'description', label: 'توضیحات' },
    { key: 'features', label: 'مشخصات' },
    { key: 'reviews', label: `نظرات (${count.toLocaleString('fa-IR')})` },
  ];

  const hasVariants = product.variants && product.variants.length > 0;
  const canAddToCart = !hasVariants || allVariantsSelected;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-1.5 text-xs text-ink/50 dark:text-night-ink/50 mb-6 flex-wrap">
        <Link to="/" className="hover:text-copper transition-colors">خانه</Link>
        <ChevronLeft className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-copper transition-colors">محصولات</Link>
        <ChevronLeft className="w-3.5 h-3.5" />
        <Link
          to={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-copper transition-colors"
        >
          {product.category}
        </Link>
        <ChevronLeft className="w-3.5 h-3.5" />
        <span className="text-ink dark:text-night-ink truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ImageGallery
            images={gallery}
            alt={product.name}
            productId={product.id}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="inline-block text-xs font-bold text-copper bg-copper/10 px-3 py-1 rounded-full">
              {product.brand}
            </span>
            <div className="flex items-center gap-1.5 text-sm">
              {count > 0 ? (
                <>
                  <Star className="w-4 h-4 fill-copper text-copper" />
                  <span className="font-bold text-ink dark:text-night-ink">
                    {rating.toLocaleString('fa-IR')}
                  </span>
                  <span className="text-ink/50 dark:text-night-ink/50">
                    ({count.toLocaleString('fa-IR')} نظر)
                  </span>
                </>
              ) : (
                <span className="text-xs text-ink/50 dark:text-night-ink/50">
                  بدون نظر — اولین نفر باش!
                </span>
              )}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink dark:text-night-ink leading-snug text-balance">
            {product.name}
          </h1>

          <p className="text-sm text-ink/60 dark:text-night-ink/60 leading-relaxed">
            {product.description}
          </p>

          {/* قیمت */}
          <div className="bg-cream dark:bg-night rounded-2xl p-5 border border-ink/5 dark:border-white/5">
            <div className="flex items-end gap-3 flex-wrap">
              {!hasAnySelection && hasVariants ? (
                <span className="text-2xl sm:text-3xl font-display font-extrabold text-copper">
                  {formatProductPrice(product)}
                </span>
              ) : (
                <>
                  {finalOldPrice && finalOldPrice > finalPrice && (
                    <span className="text-sm text-ink/40 dark:text-night-ink/40 line-through">
                      {formatPrice(finalOldPrice)}
                    </span>
                  )}
                  <span className="text-2xl sm:text-3xl font-display font-extrabold text-copper">
                    {formatPrice(finalPrice)}
                  </span>
                  {discount > 0 && (
                    <span className="text-xs font-bold bg-copper text-white px-2 py-0.5 rounded-full">
                      {discount}٪ تخفیف
                    </span>
                  )}
                </>
              )}
            </div>
            {!hasAnySelection && hasVariants && (
              <p className="text-xs text-ink/50 dark:text-night-ink/50 mt-2">
                برای مشاهده قیمت دقیق، گزینه‌ها را انتخاب کنید
              </p>
            )}
          </div>

          {/* رنگ */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <div className="text-xs font-bold text-ink/60 dark:text-night-ink/60 mb-3 uppercase tracking-wider">
                رنگ
              </div>
              <div className="flex gap-2">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    className={cn(
                      'w-9 h-9 rounded-full border-2 transition-all duration-200',
                      selectedColor === i
                        ? 'border-copper ring-2 ring-copper/20 scale-110'
                        : 'border-ink/10 dark:border-white/10 hover:border-copper/40'
                    )}
                    style={{ backgroundColor: c }}
                    aria-label={`رنگ ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* متغیرها */}
          {hasVariants && (
            <div
              className={cn(
                'space-y-4 rounded-2xl p-4 border-2 transition-all',
                showVariantError
                  ? 'border-red-500 bg-red-50 dark:bg-red-500/5'
                  : 'border-transparent'
              )}
            >
              {product.variants!.map((variant) => {
                const isSelected = selectedVariantOptions[variant.id] !== undefined;
                return (
                  <div key={variant.id}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold text-ink/60 dark:text-night-ink/60 uppercase tracking-wider">
                        {variant.name}
                      </span>
                      {!isSelected && (
                        <span className="text-[10px] font-bold bg-copper/10 text-copper px-1.5 py-0.5 rounded-full">
                          انتخاب کنید *
                        </span>
                      )}
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-forest" />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {variant.options.map((opt, idx) => {
                        const optSelected = selectedVariantOptions[variant.id] === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedVariantOptions((s) => ({
                                ...s,
                                [variant.id]: idx,
                              }));
                              setShowVariantError(false);
                            }}
                            disabled={!opt.inStock}
                            className={cn(
                              'px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all',
                              optSelected
                                ? 'border-copper bg-copper/10 text-copper'
                                : opt.inStock
                                  ? 'border-ink/10 dark:border-white/10 text-ink/70 dark:text-night-ink/70 hover:border-copper/40'
                                  : 'border-ink/10 dark:border-white/10 text-ink/30 dark:text-night-ink/30 cursor-not-allowed line-through'
                            )}
                          >
                            {opt.label}
                            <span className="text-[10px] mr-1 opacity-70">
                              ({formatPrice(opt.price)})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {showVariantError && (
                <p className="text-xs text-red-500 font-medium">
                  لطفاً همه گزینه‌های بالا را انتخاب کنید
                </p>
              )}
            </div>
          )}

          {/* تعداد + موجودی */}
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <div className="text-xs font-bold text-ink/60 dark:text-night-ink/60 mb-2 uppercase tracking-wider">
                تعداد
              </div>
              <QuantitySelector value={quantity} onChange={setQuantity} max={10} />
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              {variantInStock ? (
                <>
                  <Check className="w-4 h-4 text-forest" />
                  <span className="text-forest font-medium">موجود در انبار</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 text-copper" />
                  <span className="text-copper font-medium">ناموجود</span>
                </>
              )}
            </div>
          </div>

          {/* دکمه‌ها */}
          <div className="space-y-2">
            <div className="flex gap-3 flex-wrap">
              {variantInStock ? (
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!canAddToCart}
                  className={cn(
                    'flex-1 min-w-[200px]',
                    !canAddToCart && 'opacity-50 cursor-not-allowed'
                  )}
                  title={!canAddToCart ? 'ابتدا گزینه‌ها را انتخاب کنید' : undefined}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      به سبد اضافه شد
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      {!canAddToCart ? 'ابتدا گزینه‌ها را انتخاب کنید' : 'افزودن به سبد خرید'}
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setNotified(true)}
                  className="flex-1 min-w-[200px]"
                  disabled={notified}
                >
                  <Bell className="w-4 h-4" />
                  {notified ? 'به شما اطلاع می‌دهیم' : 'اطلاع از موجودی'}
                </Button>
              )}
              <button
                onClick={handleWishlist}
                className={cn(
                  'w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all',
                  inWishlist
                    ? 'border-copper bg-copper text-white'
                    : 'border-ink/10 dark:border-white/10 text-ink/60 dark:text-night-ink/60 hover:border-copper hover:text-copper'
                )}
                aria-label="افزودن به علاقه‌مندی"
              >
                <Heart className={cn('w-5 h-5', inWishlist && 'fill-current')} />
              </button>
              <button
                onClick={handleCompare}
                className={cn(
                  'w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all',
                  inCompare
                    ? 'border-copper bg-copper text-white'
                    : 'border-ink/10 dark:border-white/10 text-ink/60 dark:text-night-ink/60 hover:border-copper hover:text-copper'
                )}
                aria-label="افزودن به مقایسه"
                title={
                  isFull() && !inCompare
                    ? 'لیست مقایسه پر است'
                    : inCompare
                      ? 'حذف از مقایسه'
                      : 'افزودن به مقایسه'
                }
              >
                <GitCompare className="w-5 h-5" />
              </button>
            </div>

            {hasVariants && !allVariantsSelected && (
              <p className="text-[11px] text-copper text-center">
                برای افزودن به سبد، ابتدا همه گزینه‌های محصول را انتخاب کنید
              </p>
            )}
          </div>

          {/* مزایا */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-ink/5 dark:border-white/5">
            {[
              { Icon: Truck, label: 'ارسال سریع' },
              { Icon: ShieldCheck, label: 'گارانتی اصالت' },
              { Icon: RotateCcw, label: '۷ روز بازگشت' },
            ].map(({ Icon, label }, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs text-ink/60 dark:text-night-ink/60"
              >
                <div className="w-8 h-8 rounded-lg bg-copper/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-copper" />
                </div>
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* تب‌ها */}
      <section className="mt-16">
        <div className="flex gap-1 border-b border-ink/10 dark:border-white/10 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors relative',
                activeTab === tab.key
                  ? 'text-copper'
                  : 'text-ink/60 dark:text-night-ink/60 hover:text-ink dark:hover:text-night-ink'
              )}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 right-0 left-0 h-0.5 bg-copper rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 p-6 sm:p-8">
          {activeTab === 'description' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-ink/70 dark:text-night-ink/70 leading-relaxed space-y-4"
            >
              <p>{product.description}</p>
              <p>
                این محصول با طراحی مدرن و کیفیت ساخت بالا، انتخابی عالی برای
                خانه‌های امروزی است. تمامی محصولات خانه‌استور با گارانتی معتبر
                و خدمات پس از فروش ارائه می‌شوند.
              </p>
            </motion.div>
          )}

          {activeTab === 'features' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {product.features.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 text-sm text-ink/70 dark:text-night-ink/70 p-3 rounded-xl bg-cream dark:bg-night"
                >
                  <div className="w-5 h-5 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-forest" />
                  </div>
                  {f}
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ProductReviews product={product} />
            </motion.div>
          )}
        </div>
      </section>

      {similar.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-ink dark:text-night-ink">
              محصولات مشابه
            </h2>
            <Link
              to={`/products?category=${encodeURIComponent(product.category)}`}
              className="text-copper text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
            >
              مشاهده همه
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {similar.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}