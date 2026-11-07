import type { Product } from '../types';

export const products: Product[] = [
  {
    id: 'fridge-01',
    name: 'یخچال فریزر ساید بای ساید سامسونگ',
    category: 'یخچال و فریزر',
    brand: 'سامسونگ',
    price: 48500000,
    oldPrice: 52000000,
    image:
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=1200&q=80',
      'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=1200&q=80',
      'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1200&q=80',
    ],
    rating: 0,
    reviewsCount: 0,
    description:
      'یخچال ساید بای ساید با فناوری خنک‌کنندگی دوگانه، فضای داخلی هوشمند و طراحی مینیمال. مناسب برای خانواده‌های مدرن.',
    features: [
      'ظرفیت ۶۱۷ لیتر',
      'فناوری No Frost',
      'صفحه نمایش لمسی',
      'موتور اینورتر کم‌مصرف',
      'گارانتی ۱۸ ماهه',
    ],
    colors: ['#C0C0C0', '#1C1917', '#B87333'],
    inStock: true,
    featured: true,
  },
  {
    id: 'washer-01',
    name: 'ماشین لباسشویی ۹ کیلویی ال‌جی',
    category: 'شستشو',
    brand: 'ال‌جی',
    price: 28900000,
    oldPrice: 31500000,
    image:
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=1200&q=80',
      'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=1200&q=80',
      'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=1200&q=80',
    ],
    rating: 0,
    reviewsCount: 0,
    description:
      'لباسشویی با موتور Inverter Direct Drive، ۱۴ برنامه شستشو و فناوری بخار برای از بین بردن آلرژن‌ها.',
    features: [
      'ظرفیت ۹ کیلوگرم',
      'موتور اینورتر مستقیم',
      'فناوری Steam',
      '۱۴ برنامه شستشو',
      'گارانتی ۲۴ ماهه',
    ],
    colors: ['#FFFFFF', '#C0C0C0'],
    inStock: true,
    featured: true,
  },
  {
    id: 'microwave-01',
    name: 'مایکروویو ۳۰ لیتری بوش',
    category: 'پخت و پز',
    brand: 'بوش',
    price: 12500000,
    image:
      'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=1200&q=80',
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=1200&q=80',
    ],
    rating: 0,
    reviewsCount: 0,
    description:
      'مایکروویو با گریل و پخت ترکیبی، طراحی استیل ضدزنگ و ۸ برنامه آماده پخت.',
    features: [
      'ظرفیت ۳۰ لیتر',
      'گریل سرامیکی',
      '۸ برنامه آماده',
      'طراحی استیل',
      'گارانتی ۱۲ ماهه',
    ],
    colors: ['#C0C0C0', '#1C1917'],
    inStock: true,
  },
  {
    id: 'vacuum-01',
    name: 'جاروبرقی رباتیک هوشمند شیائومی',
    category: 'نظافت',
    brand: 'شیائومی',
    price: 15900000,
    oldPrice: 18500000,
    image:
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=1200&q=80',
      'https://images.unsplash.com/photo-1603618090554-f7a6415db2c4?w=1200&q=80',
    ],
    rating: 0,
    reviewsCount: 0,
    description:
      'جاروبرقی رباتیک با ناوبری لیزری، مکش قوی ۳۰۰۰ پاسکال و اپلیکیشن هوشمند.',
    features: [
      'ناوبری LiDAR',
      'مکش ۳۰۰۰Pa',
      'باتری ۵۲۰۰mAh',
      'کنترل با اپلیکیشن',
      'گارانتی ۱۸ ماهه',
    ],
    colors: ['#FFFFFF', '#1C1917'],
    inStock: true,
    featured: true,
  },
  {
    id: 'dishwasher-01',
    name: 'ماشین ظرفشویی ۱۴ نفره بکو',
    category: 'شستشو',
    brand: 'بکو',
    price: 22400000,
    image:
      'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?w=1200&q=80',
    ],
    rating: 0,
    reviewsCount:0,
    description:
      'ظرفشویی ۱۴ نفره با ۸ برنامه شستشو، فناوری خشک‌کن و مصرف بهینه آب.',
    features: [
      'ظرفیت ۱۴ نفره',
      '۸ برنامه شستشو',
      'خشک‌کن حرارتی',
      'مصرف آب A++',
      'گارانتی ۲۴ ماهه',
    ],
    colors: ['#C0C0C0'],
    inStock: true,
  },
  {
    id: 'ac-01',
    name: 'کولر گازی اسپلیت ۲۴۰۰۰ سامسونگ',
    category: 'سرمایش و گرمایش',
    brand: 'سامسونگ',
    price: 34500000,
    oldPrice: 38000000,
    image:
      'https://images.unsplash.com/photo-1631545806609-b2a2f8d2c7e5?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1631545806609-b2a2f8d2c7e5?w=1200&q=80',
    ],
    rating: 0,
    reviewsCount: 0,
    description:
      'اسپلیت با فناوری Digital Inverter، خنک‌کنندگی سریع و فیلتر تصفیه هوا.',
    features: [
      'ظرفیت ۲۴۰۰۰ BTU',
      'فناوری اینورتر',
      'فیلتر HEPA',
      'کنترل وای‌فای',
      'گارانتی ۱۸ ماهه',
    ],
    colors: ['#FFFFFF'],
    inStock: true,
    featured: true,
  },
  {
    id: 'oven-01',
    name: 'فر توکار ۶۰ سانتی ال‌جی',
    category: 'پخت و پز',
    brand: 'ال‌جی',
    price: 19800000,
    image:
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=1200&q=80',
    ],
    rating: 0,
    reviewsCount: 0,
    description:
      'فر توکار با ۱۰ برنامه پخت، گریل و فن همرفتی برای پخت یکنواخت.',
    features: [
      'ظرفیت ۷۰ لیتر',
      '۱۰ برنامه پخت',
      'گریل و فن',
      'طراحی استیل',
      'گارانتی ۱۲ ماهه',
    ],
    colors: ['#1C1917', '#C0C0C0'],
    inStock: true,
  },
  {
    id: 'coffee-01',
    name: 'اسپرسو ساز خانگی دلوونگی',
    category: 'پخت و پز',
    brand: 'دلوونگی',
    price: 8900000,
    oldPrice: 10500000,
    image:
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=1200&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80',
    ],
    rating: 0,
    reviewsCount: 0,
    description:
      'اسپرسو ساز با فشار ۱۵ بار، طراحی رترو و سیستم بخار برای فوم شیر.',
    features: [
      'فشار ۱۵ بار',
      'مخزن ۱.۱ لیتر',
      'نازل بخار',
      'طراحی رترو',
      'گارانتی ۱۲ ماهه',
    ],
    colors: ['#C0C0C0', '#1C1917', '#B87333'],
    inStock: true,
    featured: true,
  },
  {
    id: 'blender-01',
    name: 'مخلوط‌کن حرفه‌ای ۱۵۰۰ وات',
    category: 'پخت و پز',
    brand: 'فیلیپس',
    price: 4500000,
    image:
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=1200&q=80',
    ],
    rating: 0,
    reviewsCount: 0,
    description:
      'مخلوط‌کن با موتور ۱۵۰۰ وات، ۶ تیغه استیل و ۵ سرعت مختلف.',
    features: [
      'توان ۱۵۰۰ وات',
      '۶ تیغه استیل',
      '۵ سرعت',
      'مخزن ۲ لیتر',
      'گارانتی ۱۲ ماهه',
    ],
    colors: ['#C0C0C0'],
    inStock: false,
  },
  {
    id: 'iron-01',
    name: 'اتو بخار حرفه‌ای فیلیپس',
    category: 'شستشو',
    brand: 'فیلیپس',
    price: 3200000,
    image:
      'https://images.unsplash.com/photo-1585305601552-84f5b3e0d5d2?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1585305601552-84f5b3e0d5d2?w=1200&q=80',
    ],
    rating: 0,
    reviewsCount: 0,
    description:
      'اتو بخار با کف سرامیکی، ۳۰۰۰ وات قدرت و سیستم ضد رسوب.',
    features: [
      'توان ۳۰۰۰ وات',
      'کف سرامیکی',
      'ضد رسوب',
      'مخزن ۳۵۰ml',
      'گارانتی ۱۲ ماهه',
    ],
    colors: ['#1C1917', '#C0C0C0'],
    inStock: true,
  },
  {
    id: 'toaster-01',
    name: 'توستر ۲ خانه بوش',
    category: 'پخت و پز',
    brand: 'بوش',
    price: 2100000,
    oldPrice: 2400000,
    image:
      'https://images.unsplash.com/photo-1585232004423-244e0e6904e3?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1585232004423-244e0e6904e3?w=1200&q=80',
    ],
    rating: 0,
    reviewsCount: 0,
    description:
      'توستر با ۷ درجه برشته‌کاری، طراحی مینیمال و سینی خرده‌گیر.',
    features: [
      '۲ خانه',
      '۷ درجه برشته',
      'سینی خرده‌گیر',
      'طراحی مینیمال',
      'گارانتی ۱۲ ماهه',
    ],
    colors: ['#C0C0C0', '#1C1917'],
    inStock: true,
  },
  {
    id: 'kettle-01',
    name: 'کتری برقی ۱.۷ لیتری',
    category: 'پخت و پز',
    brand: 'تفال',
    price: 1800000,
    image:
      'https://images.unsplash.com/photo-1594213114663-d94db9b17125?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1594213114663-d94db9b17125?w=1200&q=80',
    ],
    rating: 0,
    reviewsCount: 0,
    description:
      'کتری برقی با بدنه استیل، خاموشی خودکار و نشانگر آب.',
    features: [
      'ظرفیت ۱.۷ لیتر',
      'بدنه استیل',
      'خاموشی خودکار',
      'نشانگر آب',
      'گارانتی ۱۲ ماهه',
    ],
    colors: ['#C0C0C0', '#1C1917'],
    inStock: true,
  },
];

export const categories = [
  'همه',
  'یخچال و فریزر',
  'شستشو',
  'پخت و پز',
  'نظافت',
  'سرمایش و گرمایش',
];

export const brands = [
  'همه',
  'سامسونگ',
  'ال‌جی',
  'بوش',
  'شیائومی',
  'بکو',
  'فیلیپس',
  'دلوونگی',
  'تفال',
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}
export function getPriceBounds(): { min: number; max: number } {
  if (products.length === 0) return { min: 0, max: 0 };
  const prices = products.map((p) => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}