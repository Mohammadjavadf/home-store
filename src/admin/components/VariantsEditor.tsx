import { Plus, X, Trash2 } from 'lucide-react';
import type { ProductVariant } from '../../types';
import PriceInput from './PriceInput';

interface VariantsEditorProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
}

export default function VariantsEditor({ variants, onChange }: VariantsEditorProps) {
  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: `v-${Date.now()}`,
      name: '',
      options: [{ label: '', price: 0, inStock: true }],
    };
    onChange([...variants, newVariant]);
  };

  const removeVariant = (id: string) => {
    onChange(variants.filter((v) => v.id !== id));
  };

  const updateVariant = (id: string, updates: Partial<ProductVariant>) => {
    onChange(variants.map((v) => (v.id === id ? { ...v, ...updates } : v)));
  };

  const addOption = (variantId: string) => {
    onChange(
      variants.map((v) =>
        v.id === variantId
          ? {
              ...v,
              options: [...v.options, { label: '', price: 0, inStock: true }],
            }
          : v
      )
    );
  };

  const updateOption = (
    variantId: string,
    optIndex: number,
    updates: Partial<ProductVariant['options'][number]>
  ) => {
    onChange(
      variants.map((v) =>
        v.id === variantId
          ? {
              ...v,
              options: v.options.map((o, i) =>
                i === optIndex ? { ...o, ...updates } : o
              ),
            }
          : v
      )
    );
  };

  const removeOption = (variantId: string, optIndex: number) => {
    onChange(
      variants.map((v) =>
        v.id === variantId
          ? { ...v, options: v.options.filter((_, i) => i !== optIndex) }
          : v
      )
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <p className="text-xs text-ink/50 dark:text-night-ink/50">
          با تعریف متغیر، قیمت پایه محصول نادیده گرفته می‌شود و قیمت از گزینه‌ها می‌آید.
        </p>
        <button
          type="button"
          onClick={addVariant}
          className="px-3 py-1.5 rounded-lg bg-copper text-white text-xs font-medium hover:bg-copper-dark transition-colors flex items-center gap-1 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          متغیر جدید
        </button>
      </div>

      {variants.length === 0 ? (
        <div className="p-4 rounded-xl bg-cream dark:bg-night border border-dashed border-ink/10 dark:border-white/10 text-center">
          <p className="text-xs text-ink/40 dark:text-night-ink/40">
            هنوز متغیری اضافه نشده
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {variants.map((variant) => (
            <div
              key={variant.id}
              className="p-3 rounded-xl bg-cream dark:bg-night border border-ink/10 dark:border-white/10"
            >
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  value={variant.name}
                  onChange={(e) =>
                    updateVariant(variant.id, { name: e.target.value })
                  }
                  placeholder="نام متغیر (مثلاً وزن)"
                  className="flex-1 px-3 py-2 rounded-lg bg-surface dark:bg-night-surface border border-ink/10 dark:border-white/10 text-sm text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => removeVariant(variant.id)}
                  className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-ink/40 dark:text-night-ink/40 hover:text-red-500 transition-colors"
                  title="حذف متغیر"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {variant.options.map((opt, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-end"
                  >
                    <div>
                      <label className="block text-[10px] font-medium mb-0.5 text-ink/50 dark:text-night-ink/50">
                        برچسب
                      </label>
                      <input
                        type="text"
                        value={opt.label}
                        onChange={(e) =>
                          updateOption(variant.id, i, { label: e.target.value })
                        }
                        placeholder="مثلاً ۵ کیلو"
                        className="w-full px-2 py-1.5 rounded-lg bg-surface dark:bg-night-surface border border-ink/10 dark:border-white/10 text-xs text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:border-copper transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-medium mb-0.5 text-ink/50 dark:text-night-ink/50">
                        قیمت (تومان)
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={
                          opt.price
                            ? new Intl.NumberFormat('en-US').format(opt.price)
                            : ''
                        }
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, '');
                          updateOption(variant.id, i, {
                            price: raw ? Number(raw) : 0,
                          });
                        }}
                        placeholder="۰"
                        dir="ltr"
                        className="w-full px-2 py-1.5 rounded-lg bg-surface dark:bg-night-surface border border-ink/10 dark:border-white/10 text-xs text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 focus:outline-none focus:border-copper transition-all"
                      />
                    </div>

                    <label className="flex items-center gap-1 text-[10px] text-ink/60 dark:text-night-ink/60 cursor-pointer px-1 pb-2">
                      <input
                        type="checkbox"
                        checked={opt.inStock}
                        onChange={(e) =>
                          updateOption(variant.id, i, {
                            inStock: e.target.checked,
                          })
                        }
                        className="w-3 h-3 rounded accent-copper"
                      />
                      موجود
                    </label>

                    <button
                      type="button"
                      onClick={() => removeOption(variant.id, i)}
                      disabled={variant.options.length <= 1}
                      className="w-7 h-7 mb-1 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-ink/40 dark:text-night-ink/40 hover:text-red-500 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                      title="حذف گزینه"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addOption(variant.id)}
                className="mt-2 text-xs text-copper hover:text-copper-dark font-medium flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                افزودن گزینه
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}