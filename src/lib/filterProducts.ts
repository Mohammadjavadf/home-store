import type { Product } from '../types';
import type { SortOption } from '../store/filterStore';

interface FilterOptions {
  search: string;
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  onlyInStock: boolean;
  sort: SortOption;
}

export function filterProducts(
  products: Product[],
  opts: FilterOptions
): Product[] {
  const { search, categories, brands, priceRange, onlyInStock, sort } = opts;

  const q = search.trim().toLowerCase();

  let result = products.filter((p) => {
    // جستجو
    if (q) {
      const haystack = `${p.name} ${p.brand} ${p.category}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    // دسته‌بندی
    if (categories.length > 0 && !categories.includes(p.category)) return false;

    // برند
    if (brands.length > 0 && !brands.includes(p.brand)) return false;

    // بازه قیمت
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;

    // موجودی
    if (onlyInStock && !p.inStock) return false;

    return true;
  });

  // سورت
  result = [...result].sort((a, b) => {
    switch (sort) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
        return b.reviewsCount - a.reviewsCount;
      case 'newest':
      default:
        return 0; // ترتیب اصلی محصولات
    }
  });

  return result;
}