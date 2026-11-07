export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
}

/** فقط عدد با جداکننده هزارگان (بدون واحد) */
export function formatNumber(n: number | string): string {
  const num = typeof n === 'string' ? Number(n.replace(/,/g, '')) : n;
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('en-US').format(num);
}

/** حذف کاما و برگرداندن رشته‌ی عددی */
export function parseNumber(s: string): string {
  return s.replace(/\D/g, '');
}

/** بازه قیمت محصول با در نظر گرفتن متغیرها */
export function getProductPriceRange(product: {
  price: number;
  variants?: { options: { price: number }[] }[];
}): { min: number; max: number; hasRange: boolean } {
  if (product.variants && product.variants.length > 0) {
    const allPrices = product.variants.flatMap((v) => v.options.map((o) => o.price));
    if (allPrices.length > 0) {
      const min = Math.min(...allPrices);
      const max = Math.max(...allPrices);
      return { min, max, hasRange: min !== max };
    }
  }
  return { min: product.price, max: product.price, hasRange: false };
}

/** نمایش قیمت محصول: بازه یا عدد */
export function formatProductPrice(product: {
  price: number;
  variants?: { options: { price: number }[] }[];
}): string {
  const { min, max, hasRange } = getProductPriceRange(product);
  if (hasRange) {
    return `${new Intl.NumberFormat('fa-IR').format(min)} تا ${new Intl.NumberFormat('fa-IR').format(max)} تومان`;
  }
  return formatPrice(min);
}