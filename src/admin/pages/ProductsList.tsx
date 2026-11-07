import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Star,
  Package,
  Check,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import Button from '../../components/ui/Button';
import SmartImage from '../../components/ui/SmartImage';
import { useProductsStore } from '../../store/productsStore';
import { useCategoriesStore } from '../../store/categoriesStore';
import { usePageTitle } from '../../hooks/usePageTitle';
import { formatPrice, cn } from '../../lib/utils';

export default function ProductsList() {
  usePageTitle('مدیریت محصولات');

  const { products, deleteProduct, toggleFeatured, toggleStock } =
    useProductsStore();
  const categories = useCategoriesStore((s) => s.categories);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('همه');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== 'همه' && p.category !== categoryFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = `${p.name} ${p.brand} ${p.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [products, search, categoryFilter]);

  const productToDelete = products.find((p) => p.id === confirmDelete);

  const handleDelete = () => {
    if (confirmDelete) {
      deleteProduct(confirmDelete);
      toast.success('محصول حذف شد');
    }
  };

  const handleToggleFeatured = (id: string, current: boolean) => {
    toggleFeatured(id);
    toast.success(current ? 'از ویژه خارج شد' : 'به ویژه اضافه شد');
  };

  const handleToggleStock = (id: string, current: boolean) => {
    toggleStock(id);
    toast.success(current ? 'ناموجود شد' : 'موجود شد');
  };

  return (
    <div>
      <PageHeader
        title="مدیریت محصولات"
        description={`${products.length.toLocaleString('fa-IR')} محصول در فروشگاه`}
        actions={
          <Link to="/admin/products/new">
            <Button size="sm">
              <Plus className="w-4 h-4" />
              افزودن محصول
            </Button>
          </Link>
        }
      />

      {/* جستجو و فیلتر */}
      <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-3 sm:p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40 dark:text-night-ink/40 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی محصول، برند یا دسته..."
              className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink cursor-pointer focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all sm:w-48"
          >
            <option value="همه">همه دسته‌ها</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* لیست */}
      {filtered.length === 0 ? (
        <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-12 text-center">
          <Package className="w-12 h-12 text-copper/40 mx-auto mb-4" />
          <h3 className="font-display font-bold mb-2">
            {products.length === 0 ? 'هنوز محصولی نیست' : 'محصولی پیدا نشد'}
          </h3>
          <p className="text-sm text-ink/60 dark:text-night-ink/60 mb-5">
            {products.length === 0
              ? 'اولین محصول را اضافه کن'
              : 'عبارت جستجو یا فیلتر را تغییر بده'}
          </p>
          {products.length === 0 && (
            <Link to="/admin/products/new">
              <Button>
                <Plus className="w-4 h-4" />
                افزودن محصول
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft overflow-hidden">
          {/* دسکتاپ — جدول */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink/5 dark:border-white/5 bg-cream/50 dark:bg-night/50">
                  <th className="text-right p-3 text-[10px] font-bold text-ink/60 dark:text-night-ink/60 uppercase">محصول</th>
                  <th className="text-right p-3 text-[10px] font-bold text-ink/60 dark:text-night-ink/60 uppercase">دسته</th>
                  <th className="text-right p-3 text-[10px] font-bold text-ink/60 dark:text-night-ink/60 uppercase">قیمت</th>
                  <th className="text-center p-3 text-[10px] font-bold text-ink/60 dark:text-night-ink/60 uppercase">وضعیت</th>
                  <th className="text-center p-3 text-[10px] font-bold text-ink/60 dark:text-night-ink/60 uppercase">ویژه</th>
                  <th className="text-center p-3 text-[10px] font-bold text-ink/60 dark:text-night-ink/60 uppercase">عملیات</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((p) => (
                    <motion.tr
                      key={p.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="border-b border-ink/5 dark:border-white/5 last:border-0 hover:bg-copper/5 transition-colors"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-cream dark:bg-night shrink-0">
                            <SmartImage src={p.image} alt={p.name} className="w-full h-full" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-display font-bold text-sm text-ink dark:text-night-ink line-clamp-1">
                              {p.name}
                            </div>
                            <div className="text-[10px] text-ink/50 dark:text-night-ink/50">
                              {p.brand}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-xs text-ink/70 dark:text-night-ink/70 bg-cream dark:bg-night px-2 py-1 rounded-lg">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="text-sm font-display font-bold text-copper">
                          {formatPrice(p.price)}
                        </div>
                        {p.oldPrice && (
                          <div className="text-[10px] text-ink/40 dark:text-night-ink/40 line-through">
                            {formatPrice(p.oldPrice)}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleToggleStock(p.id, p.inStock)}
                          className={cn(
                            'inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full transition-colors',
                            p.inStock
                              ? 'bg-forest/10 text-forest hover:bg-forest/20'
                              : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                          )}
                          title={p.inStock ? 'موجود (کلیک = ناموجود)' : 'ناموجود (کلیک = موجود)'}
                        >
                          {p.inStock ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {p.inStock ? 'موجود' : 'ناموجود'}
                        </button>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleToggleFeatured(p.id, !!p.featured)}
                          className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center transition-colors mx-auto',
                            p.featured
                              ? 'bg-copper text-white'
                              : 'bg-cream dark:bg-night text-ink/30 dark:text-night-ink/30 hover:text-copper'
                          )}
                          title={p.featured ? 'ویژه (کلیک = حذف)' : 'غیر ویژه (کلیک = ویژه)'}
                        >
                          <Star className={cn('w-4 h-4', p.featured && 'fill-current')} />
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            to={`/products/${p.id}`}
                            target="_blank"
                            className="w-8 h-8 rounded-lg hover:bg-copper/10 flex items-center justify-center text-ink/40 dark:text-night-ink/40 hover:text-copper transition-colors"
                            title="مشاهده در سایت"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/products/${p.id}/edit`}
                            className="w-8 h-8 rounded-lg hover:bg-blue-500/10 flex items-center justify-center text-ink/40 dark:text-night-ink/40 hover:text-blue-500 transition-colors"
                            title="ویرایش"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setConfirmDelete(p.id)}
                            className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-ink/40 dark:text-night-ink/40 hover:text-red-500 transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* موبایل — کارت */}
          <div className="lg:hidden divide-y divide-ink/5 dark:divide-white/5">
            <AnimatePresence>
              {filtered.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-3"
                >
                  <div className="flex gap-3 mb-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-cream dark:bg-night shrink-0">
                      <SmartImage src={p.image} alt={p.name} className="w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-bold text-sm text-ink dark:text-night-ink line-clamp-2">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-ink/50 dark:text-night-ink/50 mt-0.5">
                        {p.brand} · {p.category}
                      </div>
                      <div className="font-display font-bold text-copper text-sm mt-1">
                        {formatPrice(p.price)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleToggleStock(p.id, p.inStock)}
                      className={cn(
                        'text-[10px] font-bold px-2 py-1 rounded-full',
                        p.inStock
                          ? 'bg-forest/10 text-forest'
                          : 'bg-red-500/10 text-red-500'
                      )}
                    >
                      {p.inStock ? 'موجود' : 'ناموجود'}
                    </button>
                    <button
                      onClick={() => handleToggleFeatured(p.id, !!p.featured)}
                      className={cn(
                        'text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1',
                        p.featured
                          ? 'bg-copper text-white'
                          : 'bg-cream dark:bg-night text-ink/50 dark:text-night-ink/50'
                      )}
                    >
                      <Star className={cn('w-3 h-3', p.featured && 'fill-current')} />
                      ویژه
                    </button>
                    <div className="flex-1" />
                    <Link
                      to={`/admin/products/${p.id}/edit`}
                      className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setConfirmDelete(p.id)}
                      className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* تایید حذف */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="حذف محصول"
        message={`آیا از حذف «${productToDelete?.name || 'این محصول'}» مطمئنی؟ این عمل قابل بازگشت نیست.`}
        confirmLabel="حذف کن"
      />
    </div>
  );
}