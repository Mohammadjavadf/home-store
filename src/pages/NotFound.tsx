import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import NotFound3D from '../components/three/NotFound3D';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6 px-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-copper/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-forest/10 rounded-full blur-3xl" />
      </div>

      <NotFound3D />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center"
      >
        <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">
          این صفحه پیدا نشد!
        </h2>
        <p className="text-ink/60 dark:text-night-ink/60 max-w-md mx-auto text-balance">
          شاید آدرس رو اشتباه وارد کردی یا صفحه جابه‌جا شده. بیا برگردیم به خانه.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        <Link to="/">
          <Button size="lg">
            <Home className="w-4 h-4" />
            بازگشت به خانه
          </Button>
        </Link>
        <Link to="/products">
          <Button size="lg" variant="outline">
            <Search className="w-4 h-4" />
            دیدن محصولات
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}