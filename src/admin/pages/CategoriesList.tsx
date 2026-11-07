import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  FolderTree,
  Edit3,
  Trash2,
  Check,
  X,
  Package,
} from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import Button from '../../components/ui/Button';
import { useCategoriesStore } from '../../store/categoriesStore';
import { useProductsStore } from '../../store/productsStore';
import { usePageTitle } from '../../hooks/usePageTitle';
import { cn } from '../../lib/utils';

export default function CategoriesList() {
  usePageTitle('مدیریت دسته‌بندی‌ها');

  const { categories, addCategory, updateCategory, deleteCategory } =
    useCategoriesStore();
  const products = useProductsStore((s) => s.products);

  const [newName, setNewName] = useState('');
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const res = addCategory(newName);
    if (res.ok) {
      toast.success('دسته اضافه شد');
      setNewName('');
    } else {
      toast.error(res.error || 'خطا');
    }
  };

  const handleEdit = (oldName: string) => {
    const res = updateCategory(oldName, editValue);
    if (res.ok) {
      toast.success('دسته به‌روزرسانی شد');
      setEditingName(null);
      setEditValue('');
    } else {
      toast.error(res.error || 'خطا');
    }
  };

  const handleDelete = () => {
    if (confirmDelete) {
      deleteCategory(confirmDelete);
      toast.success('دسته حذف شد');
    }
  };

  const categoryToDelete = confirmDelete;
  const productsInCategory = confirmDelete
    ? products.filter((p) => p.category === confirmDelete).length
    : 0;

  return (
    <div>
      <PageHeader
        title="دسته‌بندی‌ها"
        description={`${categories.length.toLocaleString('fa-IR')} دسته`}
      />

      {/* افزودن دسته */}
      <form
        onSubmit={handleAdd}
        className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-4 mb-4"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="نام دسته جدید..."
            className="flex-1 px-3 py-2.5 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all"
          />
          <Button type="submit" size="md">
            <Plus className="w-4 h-4" />
            افزودن
          </Button>
        </div>
      </form>

      {/* لیست دسته‌ها */}
      {categories.length === 0 ? (
        <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-12 text-center">
          <FolderTree className="w-12 h-12 text-copper/40 mx-auto mb-4" />
          <h3 className="font-display font-bold mb-2">هنوز دسته‌ای نیست</h3>
          <p className="text-sm text-ink/60 dark:text-night-ink/60">
            اولین دسته را اضافه کن
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence>
            {categories.map((cat) => {
              const count = products.filter((p) => p.category === cat).length;
              const isEditing = editingName === cat;
              return (
                <motion.div
                  key={cat}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-4"
                >
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                        className="w-full px-3 py-2 rounded-lg bg-cream dark:bg-night border border-copper text-sm text-ink dark:text-night-ink focus:outline-none"
                      />
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="flex-1 h-8 rounded-lg bg-forest text-white flex items-center justify-center hover:bg-forest-light transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingName(null);
                            setEditValue('');
                          }}
                          className="flex-1 h-8 rounded-lg bg-ink/10 dark:bg-white/10 text-ink/70 dark:text-night-ink/70 flex items-center justify-center hover:bg-ink/20 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-lg bg-copper/10 flex items-center justify-center">
                            <FolderTree className="w-4 h-4 text-copper" />
                          </div>
                          <div>
                            <div className="font-display font-bold text-sm text-ink dark:text-night-ink">
                              {cat}
                            </div>
                            <div className="text-[10px] text-ink/50 dark:text-night-ink/50 flex items-center gap-1">
                              <Package className="w-2.5 h-2.5" />
                              {count.toLocaleString('fa-IR')} محصول
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingName(cat);
                            setEditValue(cat);
                          }}
                          className="flex-1 h-8 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 flex items-center justify-center transition-colors"
                          title="ویرایش"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(cat)}
                          className="flex-1 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="حذف دسته"
        message={
          productsInCategory > 0
            ? `دسته «${categoryToDelete}» دارای ${productsInCategory.toLocaleString('fa-IR')} محصول است. با حذف دسته، محصولات بدون دسته می‌شوند. ادامه می‌دهی؟`
            : `آیا از حذف دسته «${categoryToDelete}» مطمئنی؟`
        }
        confirmLabel="حذف کن"
      />
    </div>
  );
}