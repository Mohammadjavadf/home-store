export interface ProductVariantOption {
  label: string;
  price: number;
  oldPrice?: number;
  inStock: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: ProductVariantOption[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  oldPrice?: number;
  image: string;
  gallery?: string[];
  rating: number;
  reviewsCount: number;
  description: string;
  features: string[];
  colors?: string[];
  inStock: boolean;
  featured?: boolean;
  variants?: ProductVariant[];
}

export interface CartItem extends Product {
  quantity: number;
  _key: string;
  selectedVariant?: {
    name: string;
    option: string;
  };
  finalPrice?: number;
}