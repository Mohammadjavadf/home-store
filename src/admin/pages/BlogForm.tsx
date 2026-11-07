import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Save, Plus, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../components/PageHeader';
import ImageUploader from '../components/ImageUploader';
import Button from '../../components/ui/Button';
import { useBlogStore } from '../../store/blogStore';
import { usePageTitle } from '../../hooks/usePageTitle';
import { cn } from '../../lib/utils';
import type { BlogPost } from '../../data/blog';

const CATEGORIES = ['راهنمای خرید', 'مقایسه', 'نگهداری', 'اخبار'];

interface FormState {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  authorName: string;
  tags: string[];
  featured: boolean;
}

const emptyForm: FormState = {
  title: '',
  excerpt: '',
  content: '',
  image: '',
  category: '',
  authorName: 'تیم خانه‌استور',
  tags: [],
  featured: false,
};

export default function BlogForm() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { posts, addPost, updatePost } = useBlogStore();

  const existing = slug ? posts.find((p) => p.slug === slug) : undefined;
  const isEdit = !!existing;

  usePageTitle(isEdit ? 'ویرایش مقاله' : 'افزودن مقاله');

  const [form, setForm] = useState<FormState>(() => {
    if (existing) {
      return {
        title: existing.title,
        excerpt: existing.excerpt,
        content: existing.content,
        image: existing.image,
        category: existing.category,
        authorName: existing.author.name,
        tags: existing.tags,
        featured: !!existing.featured,
      };
    }
    return emptyForm;
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useEffect(() => {
    if (isEdit && !existing) {
      toast.error('مقاله پیدا نشد');
      navigate('/admin/blog');
    }
  }, [isEdit, existing, navigate]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = 'عنوان الزامی است';
    if (!form.excerpt.trim()) e.excerpt = 'خلاصه الزامی است';
    if (!form.content.trim()) e.content = 'محتوا الزامی است';
    if (!form.image) e.image = 'تصویر کاور الزامی است';
    if (!form.category) e.category = 'دسته را انتخاب کنید';
    if (!form.authorName.trim()) e.authorName = 'نام نویسنده الزامی است';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('لطفاً خطاها را برطرف کن');
      return;
    }

    const postData: Omit<BlogPost, 'slug'> = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      image: form.image,
      category: form.category,
      author: { name: form.authorName.trim() },
      publishedAt: existing?.publishedAt || new Date().toISOString().split('T')[0],
      readTime: existing?.readTime || 1,
      tags: form.tags,
      featured: form.featured,
    };

    if (isEdit && slug) {
      updatePost(slug, postData);
      toast.success('مقاله به‌روزرسانی شد');
      navigate('/admin/blog');
    } else {
      const res = addPost(postData);
      if (res.ok) {
        toast.success('مقاله اضافه شد');
        navigate('/admin/blog');
      } else {
        toast.error(res.error || 'خطا در ذخیره');
      }
    }
  };

  return (
    <div>
      <PageHeader
        title={isEdit ? 'ویرایش مقاله' : 'افزودن مقاله جدید'}
        description={isEdit ? 'محتوای مقاله را ویرایش کن' : 'مقاله جدید بنویس'}
        actions={
          <Link
            to="/admin/blog"
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
            <h2 className="font-display font-bold text-sm mb-4">اطلاعات مقاله</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
                  عنوان *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="عنوان مقاله..."
                  className={cn(
                    'w-full px-3 py-2.5 rounded-xl bg-cream dark:bg-night border text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:ring-2 focus:ring-copper/20 transition-all',
                    errors.title ? 'border-red-500' : 'border-ink/10 dark:border-white/10 focus:border-copper'
                  )}
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
                  خلاصه *
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => update('excerpt', e.target.value)}
                  rows={2}
                  placeholder="خلاصه‌ای کوتاه از مقاله..."
                  className={cn(
                    'w-full px-3 py-2.5 rounded-xl bg-cream dark:bg-night border text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:ring-2 focus:ring-copper/20 resize-none transition-all',
                    errors.excerpt ? 'border-red-500' : 'border-ink/10 dark:border-white/10 focus:border-copper'
                  )}
                />
                {errors.excerpt && <p className="text-xs text-red-500 mt-1">{errors.excerpt}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
                  محتوا (HTML) *
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => update('content', e.target.value)}
                  rows={14}
                  placeholder="<p>متن مقاله...</p>&#10;<h2>تیتر</h2>&#10;<p>...</p>"
                  className={cn(
                    'w-full px-3 py-2.5 rounded-xl bg-cream dark:bg-night border text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:ring-2 focus:ring-copper/20 resize-none transition-all font-mono',
                    errors.content ? 'border-red-500' : 'border-ink/10 dark:border-white/10 focus:border-copper'
                  )}
                  dir="ltr"
                />
                {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
                <p className="text-[10px] text-ink/40 dark:text-night-ink/40 mt-1">
                  می‌توانید از تگ‌های HTML مثل <code>&lt;p&gt;</code>, <code>&lt;h2&gt;</code>, <code>&lt;ul&gt;</code>, <code>&lt;li&gt;</code>, <code>&lt;strong&gt;</code> استفاده کنید
                </p>
              </div>
            </div>
          </div>

          {/* تگ‌ها */}
          <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5">
            <h2 className="font-display font-bold text-sm mb-3">تگ‌ها</h2>
            <TagsEditor tags={form.tags} onChange={(v) => update('tags', v)} />
          </div>
        </div>

        {/* ستون کنار */}
        <div className="space-y-4">
          {/* تصویر */}
          <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5">
            <ImageUploader
              value={form.image}
              onChange={(v) => update('image', v)}
              label="تصویر کاور *"
            />
            {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image}</p>}
          </div>

          {/* تنظیمات */}
          <div className="bg-surface dark:bg-night-surface rounded-2xl border border-ink/5 dark:border-white/5 shadow-soft p-5 space-y-4">
            <h2 className="font-display font-bold text-sm">تنظیمات</h2>

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
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-ink/70 dark:text-night-ink/70">
                نام نویسنده *
              </label>
              <input
                type="text"
                value={form.authorName}
                onChange={(e) => update('authorName', e.target.value)}
                placeholder="نام نویسنده"
                className={cn(
                  'w-full px-3 py-2.5 rounded-xl bg-cream dark:bg-night border text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:ring-2 focus:ring-copper/20 transition-all',
                  errors.authorName ? 'border-red-500' : 'border-ink/10 dark:border-white/10 focus:border-copper'
                )}
              />
              {errors.authorName && <p className="text-xs text-red-500 mt-1">{errors.authorName}</p>}
            </div>

            <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-copper/5 transition-colors">
              <span className="text-sm text-ink/70 dark:text-night-ink/70">مقاله ویژه</span>
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
            {isEdit ? 'ذخیره تغییرات' : 'افزودن مقاله'}
          </Button>
        </div>
      </form>
    </div>
  );
}

// ---------- TagsEditor ----------
function TagsEditor({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [input, setInput] = useState('');

  const add = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) {
      setInput('');
      return;
    }
    onChange([...tags, trimmed]);
    setInput('');
  };

  const remove = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
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
          placeholder="مثلاً یخچال، راهنمای خرید"
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
      {tags.length === 0 ? (
        <p className="text-xs text-ink/40 dark:text-night-ink/40">هنوز تگی اضافه نشده</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, i) => (
            <div
              key={i}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-copper/10 text-copper text-xs"
            >
              <Check className="w-3 h-3" />
              {tag}
              <button
                type="button"
                onClick={() => remove(i)}
                className="w-4 h-4 rounded-full hover:bg-copper/20 flex items-center justify-center"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}