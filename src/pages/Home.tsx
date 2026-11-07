import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Truck,
  ShieldCheck,
  Headphones,
  Sparkles,
  ChevronLeft,
  Box,
  Droplets,
  ChefHat,
  Wind,
  Snowflake,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Button from '../components/ui/Button';
import ProductCard from '../components/product/ProductCard';
import SectionHeader from '../components/product/SectionHeader';
import SmartImage from '../components/ui/SmartImage';
import TestimonialSlider from '../components/ui/TestimonialSlider';
import Hero3D from '../components/three/Hero3D';
import { useProductsStore } from '../store/productsStore';
import { useCategoriesStore } from '../store/categoriesStore';
import { usePageTitle } from '../hooks/usePageTitle';
import { blogPosts } from '../data/blog';

const categoryIcons: Record<string, LucideIcon> = {
  'یخچال و فریزر': Box,
  شستشو: Droplets,
  'پخت و پز': ChefHat,
  نظافت: Wind,
  'سرمایش و گرمایش': Snowflake,
};

const trustItems = [
  { Icon: Truck, title: 'ارسال رایگان', desc: 'برای خریدهای بالای ۵ میلیون' },
  { Icon: ShieldCheck, title: 'گارانتی اصالت', desc: 'تضمین اصل بودن کالا' },
  { Icon: Headphones, title: 'پشتیبانی ۲۴/۷', desc: 'همیشه در کنار شما' },
];

export default function Home() {
  usePageTitle('فروشگاه لوازم خانگی');

  const products = useProductsStore((s) => s.products);
  const categories = useCategoriesStore((s) => s.categories);

  const featured = products.filter((p) => p.featured);
  const bestSellers = products.filter((p) => p.inStock).slice(0, 4);
  const categoryList = categories;

  return (
    <div className="overflow-x-hidden">
      {/* ============ هیرو ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-copper/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-forest/10 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage:
                'linear-gradient(#1C1917 1px, transparent 1px), linear-gradient(90deg, #1C1917 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 lg:pt-24 pb-12 sm:pb-20 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-copper/10 text-copper text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-copper/20">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                تجربه‌ی خرید سه‌بعدی و مدرن
              </div>

              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[3.75rem] font-display font-extrabold leading-[1.15] text-ink dark:text-night-ink mb-4 sm:mb-6 text-balance">
                خانه‌ای مدرن،
                <br />
                با{' '}
                <span className="relative inline-block">
                  <span className="text-copper">لوازم خانگی</span>
                  <svg
                    className="absolute -bottom-1 sm:-bottom-2 right-0 w-full"
                    height="8"
                    viewBox="0 0 200 10"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 8C50 3 150 3 198 8"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="text-copper/40"
                    />
                  </svg>
                </span>{' '}
                خاص
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-ink/60 dark:text-night-ink/60 leading-relaxed mb-6 sm:mb-8 max-w-lg text-balance">
                از یخچال‌های هوشمند تا ماشین‌های لباسشویی پیشرفته — همه‌چیز
                برای خانه‌ای که دوستش داری، با کیفیت و طراحی بی‌نظیر.
              </p>

              <div className="flex flex-col xs:flex-row flex-wrap gap-2 sm:gap-3">
                <Link to="/products" className="w-full xs:w-auto">
                  <Button size="lg" className="w-full xs:w-auto">
                    مشاهده محصولات
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/about" className="w-full xs:w-auto">
                  <Button size="lg" variant="outline" className="w-full xs:w-auto">
                    داستان ما
                  </Button>
                </Link>
              </div>

              <div className="flex gap-4 sm:gap-8 mt-6 sm:mt-10 pt-6 sm:pt-8 border-t border-ink/10 dark:border-white/10">
                {[
                  { value: '+۱۲', label: 'محصول متنوع' },
                  { value: '+۴٫۸', label: 'امتیاز مشتریان' },
                  { value: '+۲ک', label: 'خرید موفق' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-lg sm:text-2xl font-display font-extrabold text-copper">
                      {s.value}
                    </div>
                    <div className="text-[10px] sm:text-xs text-ink/50 dark:text-night-ink/50 mt-0.5 sm:mt-1">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mt-4 lg:mt-0"
            >
              <Hero3D />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -bottom-3 sm:-bottom-6 left-2 sm:left-4 bg-surface dark:bg-night-surface
                           rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-soft border border-ink/5 dark:border-white/5
                           flex items-center gap-1.5 sm:gap-3 max-w-[65%] sm:max-w-none z-10"
              >
                <div className="w-7 h-7 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-copper/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-copper" />
                </div>
                <div className="min-w-0">
                  <div className="font-display font-bold text-[10px] sm:text-sm text-ink dark:text-night-ink truncate">
                    گارانتی اصالت
                  </div>
                  <div className="text-[9px] sm:text-xs text-ink/50 dark:text-night-ink/50 truncate hidden xs:block">
                    تضمین کیفیت همه محصولات
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute top-2 sm:top-6 right-2 sm:right-6 bg-surface dark:bg-night-surface
                           rounded-lg sm:rounded-2xl px-2 sm:px-4 py-1 sm:py-3 shadow-soft
                           border border-ink/5 dark:border-white/5 flex items-center gap-1 sm:gap-2 z-10"
              >
                <Zap className="w-3 h-3 sm:w-5 sm:h-5 text-copper fill-copper shrink-0" />
                <div>
                  <div className="font-display font-bold text-[9px] sm:text-xs text-ink dark:text-night-ink whitespace-nowrap">
                    ارسال سریع
                  </div>
                  <div className="text-[8px] sm:text-[10px] text-ink/50 dark:text-night-ink/50 whitespace-nowrap">
                    کمتر از ۴۸ ساعت
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ نوار اعتماد ============ */}
      <section className="border-y border-ink/5 dark:border-white/5 bg-surface/50 dark:bg-night-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {trustItems.map(({ Icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-center gap-2.5 sm:gap-3"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-copper/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-copper" />
                </div>
                <div className="min-w-0">
                  <div className="font-display font-bold text-xs sm:text-sm text-ink dark:text-night-ink">
                    {title}
                  </div>
                  <div className="text-[10px] sm:text-xs text-ink/50 dark:text-night-ink/50 line-clamp-1">
                    {desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ دسته‌بندی‌ها ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <SectionHeader
          eyebrow="دسته‌بندی‌ها"
          title="هر چیزی که خانه‌ات نیاز دارد"
          description="از آشپزخانه تا اتاق خواب — همه‌ی لوازم خانگی را در یک‌جا پیدا کن."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categoryList.map((cat, i) => {
            const Icon = categoryIcons[cat] || Box;
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  to={`/products?category=${encodeURIComponent(cat)}`}
                  className="group block bg-surface dark:bg-night-surface rounded-2xl p-4 sm:p-6 text-center
                             border border-ink/5 dark:border-white/5 shadow-soft
                             hover:shadow-glow hover:-translate-y-1 hover:border-copper/30
                             transition-all duration-300"
                >
                  <div className="w-11 h-11 sm:w-14 sm:h-14 mx-auto mb-2.5 sm:mb-4 rounded-xl sm:rounded-2xl bg-copper/10 group-hover:bg-copper flex items-center justify-center transition-all duration-300">
                    <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-copper group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="font-display font-bold text-xs sm:text-sm text-ink dark:text-night-ink line-clamp-1">
                    {cat}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ============ پرفروش‌ها ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="flex items-end justify-between mb-8 sm:mb-10 flex-wrap gap-3 sm:gap-4">
          <div>
            <span className="inline-block text-[10px] sm:text-xs font-bold text-copper tracking-wider uppercase mb-2 sm:mb-3">
              پرفروش‌ها
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-ink dark:text-night-ink">
              محبوب‌ترین محصولات
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-copper font-medium text-xs sm:text-sm hover:gap-2 transition-all"
          >
            مشاهده همه
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {featured.slice(0, 4).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* ============ بنر تخفیف ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden"
        >
          <SmartImage
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=80"
            alt="تخفیف ویژه"
            className="absolute inset-0 w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-ink/90 via-ink/75 to-copper/80" />
          <div className="relative px-4 sm:px-8 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="text-center sm:text-right">
              <div className="inline-flex items-center gap-1 sm:gap-1.5 bg-white/20 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full mb-1.5">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                پیشنهاد ویژه این هفته
              </div>
              <h2 className="text-sm xs:text-base sm:text-lg font-display font-extrabold text-white mb-0.5 text-balance">
                تا ۳۰٪ تخفیف روی لوازم آشپزخانه
              </h2>
              <p className="text-white/80 text-[10px] sm:text-xs max-w-md text-balance">
                بهترین برندها با قیمت‌های ویژه، فقط تا پایان هفته.
              </p>
            </div>
            <Link to="/products" className="shrink-0 w-full sm:w-auto">
              <Button size="sm" variant="light" className="w-full sm:w-auto">
                خرید با تخفیف
                <ArrowLeft className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ============ جدیدترین‌ها ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <SectionHeader
          eyebrow="جدیدترین‌ها"
          title="تازه به خانه‌استور اضافه شد"
          description="محصولاتی که همین‌تازگی به فروشگاه اضافه شده‌اند."
        />
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {bestSellers.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* ============ نظرات مشتریان ============ */}
      <section className="bg-surface/50 dark:bg-night-surface/50 border-y border-ink/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <SectionHeader
            eyebrow="نظرات مشتریان"
            title="آن‌ها چه می‌گویند؟"
            description="تجربه‌ی واقعی مشتریانی که به خانه‌استور اعتماد کرده‌اند."
          />

          <TestimonialSlider
            testimonials={[
              {
                name: 'سارا محمدی',
                role: 'خریدار یخچال ساید',
                text: 'کیفیت محصول و بسته‌بندی فوق‌العاده بود. ارسال سریع و پشتیبانی عالی. حتماً دوباره خرید می‌کنم.',
              },
              {
                name: 'رضا کریمی',
                role: 'خریدار جاروبرقی رباتیک',
                text: 'تجربه‌ی خرید آنلاین من همیشه پر از استرس بود، ولی اینجا همه‌چیز شفاف و راحت بود. جاروبرقی دقیقاً همون چیزی بود که می‌خواستم.',
              },
              {
                name: 'مریم احمدی',
                role: 'خریدار ماشین لباسشویی',
                text: 'قیمت‌ها منصفانه و گارانتی واقعی. تیم پشتیبانی هم خیلی سریع جواب داد. به همه پیشنهاد می‌کنم.',
              },
              {
                name: 'علی رضایی',
                role: 'خریدار مایکروویو',
                text: 'بسته‌بندی خیلی حرفه‌ای بود و محصول سالم رسید. تجربه‌ی خریدم عالی بود و حتماً به دوستانم معرفی می‌کنم.',
              },
              {
                name: 'نگار موسوی',
                role: 'خریدار اسپرسوساز',
                text: 'اسپرسوساز دقیقاً همون کیفیتی رو داشت که تو عکس‌ها دیدم. از انتخابم خیلی راضی‌ام و صبح‌هام حالا خیلی بهتره.',
              },
            ]}
          />
        </div>
      </section>

      {/* ============ آخرین مقالات ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="flex items-end justify-between mb-8 sm:mb-10 flex-wrap gap-3">
          <div>
            <span className="inline-block text-[10px] sm:text-xs font-bold text-copper tracking-wider uppercase mb-2">
              وبلاگ
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-ink dark:text-night-ink">
              آخرین مقالات
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-copper font-medium text-xs sm:text-sm hover:gap-2 transition-all"
          >
            همه مقالات
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {blogPosts.slice(0, 3).map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link to={`/blog/${post.slug}`} className="group block">
                <div className="bg-surface dark:bg-night-surface rounded-3xl overflow-hidden border border-ink/5 dark:border-white/5 shadow-soft hover:shadow-glow transition-all duration-500 hover:-translate-y-1">
                  <div className="relative aspect-[16/10] overflow-hidden bg-cream dark:bg-night">
                    <SmartImage
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full"
                      imgClassName="transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="text-[10px] text-copper font-bold mb-2">{post.category}</div>
                    <h3 className="font-display font-bold text-base text-ink dark:text-night-ink line-clamp-2 group-hover:text-copper transition-colors mb-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-ink/60 dark:text-night-ink/60 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ CTA نهایی ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold mb-3 sm:mb-4 text-balance px-2">
            آماده‌ای خانه‌ات را <span className="text-copper">مدرن</span> کنی؟
          </h2>
          <p className="text-sm sm:text-base text-ink/60 dark:text-night-ink/60 max-w-xl mx-auto mb-6 sm:mb-8 text-balance px-2">
            همین حالا شروع کن و از بین بهترین برندهای لوازم خانگی انتخاب کن.
          </p>
          <Link to="/products">
            <Button size="lg">
              شروع خرید
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}