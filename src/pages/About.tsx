import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Target,
  Heart,
  ShieldCheck,
  Truck,
  Headphones,
  ArrowLeft,
  Check,
} from 'lucide-react';
import Button from '../components/ui/Button';
import SmartImage from '../components/ui/SmartImage';
import { usePageTitle } from '../hooks/usePageTitle';
const values = [
  
  {
    Icon: ShieldCheck,
    title: 'اصالت کالا',
    desc: 'همه محصولات با گارانتی معتبر و تضمین اصالت عرضه می‌شن.',
  },
  {
    Icon: Heart,
    title: 'رضایت مشتری',
    desc: 'رضایت شما اولویت اول ماست — از خرید تا تحویل.',
  },
  {
    Icon: Truck,
    title: 'ارسال سریع',
    desc: 'ارسال به سراسر کشور در کمتر از ۴۸ ساعت.',
  },
  {
    Icon: Headphones,
    title: 'پشتیبانی واقعی',
    desc: 'تیم پشتیبانی ما همیشه آماده پاسخگویی به شماست.',
  },
];

const stats = [
  
  { value: '+۲ک', label: 'خرید موفق' },
  { value: '+۱۲', label: 'محصول متنوع' },
  { value: '۴٫۸', label: 'امتیاز مشتریان' },
  { value: '+۵', label: 'سال تجربه' },
];

export default function About() {
  usePageTitle('درباره ما');
  return (
    <div>
      {/* هیرو */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-copper/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-forest/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-copper/10 text-copper text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                داستان ما
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold leading-tight mb-6 text-balance">
                خانه‌ای که <span className="text-copper">دوستش داری</span>،
                <br />
                با لوازمی که <span className="text-copper">باهاش زندگی می‌کنی</span>
              </h1>
              <p className="text-base text-ink/60 dark:text-night-ink/60 leading-relaxed mb-4">
                خانه‌استور از سال ۱۳۹۸ با یک هدف ساده شروع کرد: خرید لوازم خانگی
                باید آسان، شفاف و لذت‌بخش باشه. امروز با افتخار در کنار
                هزاران خانواده ایرانی هستیم.
              </p>
              <p className="text-base text-ink/60 dark:text-night-ink/60 leading-relaxed mb-8">
                ما به کیفیت، اصالت و تجربه‌ی خرید بهتر باور داریم.
              </p>
              <Link to="/products">
                <Button size="lg">
                  مشاهده محصولات
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-[2rem] overflow-hidden shadow-soft border border-ink/5 dark:border-white/10">
                <SmartImage
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80"
                  alt="آشپزخانه مدرن خانه‌استور"
                  className="w-full h-[400px] sm:h-[480px]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* آمار */}
      <section className="bg-surface/50 dark:bg-night-surface/50 border-y border-ink/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-display font-extrabold text-copper mb-1">
                  {s.value}
                </div>
                <div className="text-xs text-ink/50 dark:text-night-ink/50">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ارزش‌ها */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold text-copper tracking-wider uppercase mb-3">
            ارزش‌های ما
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold mb-3 text-balance">
            چیزی که ما را متفاوت می‌کند
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-6 hover:shadow-glow hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-copper/10 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-copper" />
              </div>
              <h3 className="font-display font-bold mb-2">{title}</h3>
              <p className="text-sm text-ink/60 dark:text-night-ink/60 leading-relaxed">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ماموریت */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-to-l from-copper/10 to-forest/10 rounded-3xl border border-copper/20 p-8 sm:p-12">
          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <div className="w-12 h-12 rounded-xl bg-copper/20 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-copper" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold mb-3 text-balance">
                ماموریت ما
              </h2>
              <p className="text-ink/70 dark:text-night-ink/70 leading-relaxed max-w-2xl">
                می‌خواهیم خرید لوازم خانگی را از یک کار خسته‌کننده به یک تجربه‌ی
                لذت‌بخش تبدیل کنیم. با فیلترهای هوشمند، جستجوی سریع، اطلاعات شفاف
                و گارانتی واقعی — همه‌چیز برای اینکه انتخاب بهتری داشته باشی.
              </p>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              {[
                'قیمت شفاف و منصفانه',
                'گارانتی واقعی همه محصولات',
                'پشتیبانی ۲۴ ساعته',
                'بازگشت ۷ روزه بدون سوال',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-ink/70 dark:text-night-ink/70">
                  <div className="w-5 h-5 rounded-full bg-forest/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-forest" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-display font-extrabold mb-4 text-balance">
          آماده‌ای با ما شروع کنی؟
        </h2>
        <p className="text-ink/60 dark:text-night-ink/60 mb-6 max-w-xl mx-auto">
          محصولات ما را ببین و از تجربه‌ی خریدی متفاوت لذت ببر.
        </p>
        <Link to="/products">
          <Button size="lg">
            مشاهده محصولات
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
}