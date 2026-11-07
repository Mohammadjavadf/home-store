import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Save, Plus, X, Check, Info } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../components/PageHeader';
import ImageUploader from '../components/ImageUploader';
import VariantsEditor from '../components/VariantsEditor';
import PriceInput from '../components/PriceInput';
import Button from '../../components/ui/Button';
import SmartImage from '../../components/ui/SmartImage';
import { useProductsStore } from '../../store/productsStore';
import { useCategoriesStore } from '../../store/categoriesStore';
import { useBrandsStore } from '../../store/brandsStore';
import { usePageTitle } from '../../hooks/usePageTitle';
import { cn, formatPrice } from '../../lib/utils';
import type { Product, ProductVariant } from '../../types';

interface FormState {
  name: string;
  brand: string;
  category: string;
  price: string;
  oldPrice: string;
  image: string;
  gallery: string[];
  description: string;
  features: string[];
  colors: string[];
  inStock: boolean;
  featured: boolean;
  variants: ProductVariant[];
}

const emptyForm: FormState = {
  name: '',
  brand: '',
  category: '',
  price: '',
  oldPrice: '',
  image: '',
  gallery: [],
  description: '',
  features: [],
  colors: [],
  inStock: true,
  featured: false,
  variants: [],
};

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { products, addProduct, updateProduct } = useProductsStore();
  const categories = useCategoriesStore((s) => s.categories);
  const brands = useBrandsStore((s) => s.brands);

  const existing = id ? products.find((p) => p.id === id) : undefined;
  const isEdit = !!existing;

  usePageTitle(isEdit ? 'ویرایش محصول' : 'افزودن محصول');

  const [form, setForm] = useState<FormState>(() => {
    if (existing) {
      return {
        name: existing.name,
        brand: existing.brand,
        category: existing.category,
        price: String(existing.price),
        oldPrice: existing.oldPrice ? String(existing.oldPrice) : '',
        image: existing.image,
        gallery: existing.gallery ?? [],
        description: existing.description,
        features: existing.features ?? [],
        colors: existing.colors ?? [],
        inStock: existing.inStock,
        featured: !!existing.featured,
        variants: existing.variants ?? [],
      };
    }
    return emptyForm;
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useEffect(() => {
    if (isEdit && !existing) {
      toast.error('محصول پیدا نشد');
      navigate('/admin/products');
    }
  }, [isEdit, existing, navigate]);

  const hasVariants = form.variants.length > 0;

  // قیمت‌های همه گزینه‌ها
  const variantPrices = form.variants.flatMap((v) =>
    v.options.map((o) => o.price).filter((p) => p > 0)
  );
  const minVariantPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : 0;
  const maxVariantPrice = variantPrices.length > 0 ? Math.max(...variantPrices) : 0;

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'نام محصول الزامی است';
    if (!form.brand) e.brand = 'برند را انتخاب کنید';
    if (!form.category) e.category = 'دسته را انتخاب کنید';
    if (!form.image) e.image = 'تصویر محصول الزامی است';
    if (!form.description.trim()) e.description = 'توضیحات الزامی است';

    if (hasVariants) {
      // همه گزینه‌ها باید برچسب و قیمت داشته باشند
      const invalidOption = form.variants.some((v) =>
        v.options.some((o) => !o.label.trim() || o.price <= 0)
      );
      if (invalidOption) e.price = 'همه گزینه‌های متغیر باید برچسب و قیمت داشته باشند';
      if (variantPrices.length === 0) e.price = 'حداقل یک گزینه با قیمت معتبر لازم است';
    } else {
      if (!form.price || Number(form.price.replace(/,/g, '')) <= 0)
        e.price = 'قیمت معتبر وارد کنید';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('لطفاً خطاها را برطرف کن');
      return;
    }

    const priceNum = hasVariants
      ? minVariantPrice
      : Number(form.price.replace(/,/g, ''));

    const oldPriceNum = form.oldPrice
      ? Number(form.oldPrice.replace(/,/g, ''))
      : undefined;

    const productData: Omit<Product, 'id'> = {
      name: form.name.trim(),
      brand: form.brand,
      category: form.category,
      price: priceNum,
      oldPrice: oldPriceNum && oldPriceNum > priceNum ? oldPriceNum : undefined,
      image: form.image,
      gallery:
        form.gallery.length > 0
          ? form.gallery
          : form.image
            ? [form.image]
            : [],
      description: form.description.trim(),
      features: form.features,
      colors: form.colors.length > 0 ? form.colors : undefined,
      inStock: form.inStock,
      featured: form.featured,
      variants: form.variants.length > 0 ? form.variants : undefined,
      rating: existing?.rating ?? 0,
      reviewsCount: existing?.reviewsCount ?? 0,
    };

    if (isEdit && id) {
      updateProduct(id, productData);
      toast.success('محصول به‌روزرسانی شد');
    } else {
      addProduct(productData);
      toast.success('محصول جدید اضافه شد');
    }

    navigate('/admin/products');
  };

  return (
    <div>
      <PageHeader
        title={isEdit ? 'ویرایش محصول' : 'افزودن محصول جدید'}
        description={isEdit ? 'اطلاعات محصول را ویرایش کن' : 'اطلاعات محصول جدید را وارد کن'}
        actions={
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs text-copper hover:text-copper-dark font-medium px-3 py-2 rounded-xl hover:bg-copper/10 transition-colors"
          >
            بازگشت
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_360px] gap-4 items-start">
        {/* ستون اصلی */}
        <div className="space-y-4">
          {/* اطلاعات پایه */}
          <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5">
            <h2 className="font-display font-bold text-sm mb-4">اطلاعات پایه</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
                  نام محصول *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="مثلاً یخچال فریزر ساید بای ساید"
                  className={cn(
                    'w-full px-3 py-2.5 rounded-xl bg-cream dark:bg-night border text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:ring-2 focus:ring-copper/20 transition-all',
                    errors.name ? 'border-red-500' : 'border-ink/10 dark:border-white/10 focus:border-copper'
                  )}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
                    برند *
                  </label>
                  <select
                    value={form.brand}
                    onChange={(e) => update('brand', e.target.value)}
                    className={cn(
                      'w-full px-3 py-2.5 rounded-xl bg-cream dark:bg-night border text-sm text-ink dark:text-night-ink cursor-pointer focus:outline-none focus:ring-2 focus:ring-copper/20 transition-all',
                      errors.brand ? 'border-red-500' : 'border-ink/10 dark:border-white/10 focus:border-copper'
                    )}
                  >
                    <option value="">انتخاب کنید</option>
                    {brands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  {errors.brand && <p className="text-xs text-red-500 mt-1">{errors.brand}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
                    دسته *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => update('category', e.target.value)}
                    className={cn(
                      'w-full px-3 py-2.5 rounded-xl bg-cream dark:bg-night border text-sm text-ink dark:text-night-ink cursor-pointer focus:outline-none focus:ring-2 focus:ring-copper/20 transition-all',
                      errors.category ? 'border-red-500' : 'border-ink/10 dark:border-white/10 focus:border-copper'
                    )}
                  >
                    <option value="">انتخاب کنید</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
                </div>
              </div>

              {/* قیمت */}
              {hasVariants ? (
                <div className="p-3 rounded-xl bg-copper/5 border border-copper/20">
                  <div className="flex items-start gap-2 text-xs text-copper">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold mb-1">قیمت از گزینه‌های متغیر می‌آید</div>
                      {variantPrices.length > 0 ? (
                        <div className="text-ink/70 dark:text-night-ink/70">
                          بازه قیمت: {formatPrice(minVariantPrice)}
                          {minVariantPrice !== maxVariantPrice && ` تا ${formatPrice(maxVariantPrice)}`}
                        </div>
                      ) : (
                        <div className="text-ink/60 dark:text-night-ink/60">
                          هنوز قیمتی برای گزینه‌ها وارد نشده
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  <PriceInput
                    label="قیمت"
                    value={form.price ? new Intl.NumberFormat('en-US').format(Number(form.price.replace(/,/g, ''))) : ''}
                    onChange={(v) => update('price', v.replace(/,/g, ''))}
                    error={errors.price}
                    required
                  />
                  <PriceInput
                    label="قیمت قبل از تخفیف"
                    value={form.oldPrice ? new Intl.NumberFormat('en-US').format(Number(form.oldPrice.replace(/,/g, ''))) : ''}
                    onChange={(v) => update('oldPrice', v.replace(/,/g, ''))}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
                  توضیحات *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  rows={4}
                  placeholder="توضیحات محصول را وارد کنید..."
                  className={cn(
                    'w-full px-3 py-2.5 rounded-xl bg-cream dark:bg-night border text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:ring-2 focus:ring-copper/20 resize-none transition-all',
                    errors.description ? 'border-red-500' : 'border-ink/10 dark:border-white/10 focus:border-copper'
                  )}
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>
            </div>
          </div>

          {/* ویژگی‌ها */}
          <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5">
            <h2 className="font-display font-bold text-sm mb-3">ویژگی‌ها</h2>
            <StringListEditor
              items={form.features}
              onChange={(v) => update('features', v)}
              placeholder="مثلاً ظرفیت ۶۱۷ لیتر"
            />
          </div>

          {/* رنگ‌ها */}
          <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5">
            <h2 className="font-display font-bold text-sm mb-3">رنگ‌ها</h2>
            <ColorListEditor colors={form.colors} onChange={(v) => update('colors', v)} />
          </div>

          {/* متغیرها */}
          <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5">
            <h2 className="font-display font-bold text-sm mb-3">متغیرهای محصول</h2>
            <VariantsEditor variants={form.variants} onChange={(v) => update('variants', v)} />
            {errors.price && hasVariants && (
              <p className="text-xs text-red-500 mt-2">{errors.price}</p>
            )}
          </div>
        </div>

        {/* ستون کنار */}
        <div className="space-y-4">
          <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5">
            <ImageUploader
              value={form.image}
              onChange={(v) => update('image', v)}
              label="تصویر اصلی *"
            />
            {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image}</p>}
          </div>

          <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5">
            <h2 className="font-display font-bold text-sm mb-3">گالری تصاویر</h2>
            <GalleryEditor gallery={form.gallery} onChange={(v) => update('gallery', v)} />
          </div>

          <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5 space-y-3">
            <h2 className="font-display font-bold text-sm mb-1">وضعیت</h2>

            <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-copper/5 transition-colors">
              <span className="text-sm text-ink/70 dark:text-night-ink/70">موجود در انبار</span>
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) => update('inStock', e.target.checked)}
                className="w-4 h-4 rounded accent-copper cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-copper/5 transition-colors">
              <span className="text-sm text-ink/70 dark:text-night-ink/70">محصول ویژه</span>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => update('featured', e.target.checked)}
                className="w-4 h-4 rounded accent-copper cursor-pointer"
              />
            </label>
          </div>

          <Button type="submit" size="lg" className="w-full">
            <Save className="w-4 h-4" />
            {isEdit ? 'ذخیره تغییرات' : 'افزودن محصول'}
          </Button>
        </div>
      </form>
    </div>
  );
}

// ---------- StringListEditor ----------
function StringListEditor({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState('');

  const add = () => {
    if (!input.trim()) return;
    onChange([...items, input.trim()]);
    setInput('');
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-2 rounded-xl bg-copper text-white text-sm font-medium hover:bg-copper-dark transition-colors flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          افزودن
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-ink/40 dark:text-night-ink/40">هنوز آیتمی اضافه نشده</p>
      ) : (
        <div className="space-y-1.5">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cream dark:bg-night text-sm"
            >
              <Check className="w-3.5 h-3.5 text-forest shrink-0" />
              <span className="flex-1 text-ink/70 dark:text-night-ink/70">{item}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="w-6 h-6 rounded-md hover:bg-red-500/10 flex items-center justify-center text-ink/40 dark:text-night-ink/40 hover:text-red-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- ColorListEditor ----------
function ColorListEditor({
  colors,
  onChange,
}: {
  colors: string[];
  onChange: (colors: string[]) => void;
}) {
  const [color, setColor] = useState('#B87333');

  const add = () => {
    if (colors.includes(color)) return;
    onChange([...colors, color]);
  };

  const remove = (index: number) => {
    onChange(colors.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer border border-ink/10 dark:border-white/10"
        />
        <span className="text-xs font-mono text-ink/60 dark:text-night-ink/60" dir="ltr">
          {color}
        </span>
        <button
          type="button"
          onClick={add}
          className="mr-auto px-3 py-2 rounded-xl bg-copper text-white text-xs font-medium hover:bg-copper-dark transition-colors flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          افزودن رنگ
        </button>
      </div>
      {colors.length === 0 ? (
        <p className="text-xs text-ink/40 dark:text-night-ink/40">هنوز رنگی اضافه نشده</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {colors.map((c, i) => (
            <div key={i} className="relative group">
              <div
                className="w-10 h-10 rounded-full border-2 border-ink/10 dark:border-white/10"
                style={{ backgroundColor: c }}
                title={c}
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- GalleryEditor ----------
function GalleryEditor({
  gallery,
  onChange,
}: {
  gallery: string[];
  onChange: (gallery: string[]) => void;
}) {
  const [newImage, setNewImage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addFromFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 1024 * 1024) {
      toast.error('حجم فایل باید کمتر از ۱ مگابایت باشد');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange([...gallery, result]);
    };
    reader.readAsDataURL(file);
  };

  const addFromUrl = () => {
    if (!newImage.trim()) return;
    onChange([...gallery, newImage.trim()]);
    setNewImage('');
  };

  const remove = (index: number) => {
    onChange(gallery.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {gallery.map((img, i) => (
          <div
            key={i}
            className="relative aspect-square rounded-lg overflow-hidden bg-cream dark:bg-night border border-ink/10 dark:border-white/10 group"
          >
            <SmartImage src={img} alt={`گالری ${i + 1}`} className="w-full h-full" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-1 left-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="aspect-square rounded-lg bg-cream dark:bg-night border-2 border-dashed border-ink/10 dark:border-white/10 flex flex-col items-center justify-center text-ink/40 dark:text-night-ink/40 hover:border-copper hover:text-copper transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="text-[10px] mt-1">افزودن</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) addFromFile(file);
          e.target.value = '';
        }}
        className="hidden"
      />

      <div className="flex gap-2">
        <input
          type="text"
          value={newImage}
          onChange={(e) => setNewImage(e.target.value)}
          placeholder="یا URL تصویر..."
          dir="ltr"
          className="flex-1 px-2 py-1.5 rounded-lg bg-cream dark:bg-night border border-ink/10 dark:border-white/10 text-xs text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:border-copper transition-all"
        />
        <button
          type="button"
          onClick={addFromUrl}
          className="px-2 py-1.5 rounded-lg bg-copper text-white text-xs font-medium hover:bg-copper-dark transition-colors"
        >
          افزودن
        </button>
      </div>
    </div>
  );
}