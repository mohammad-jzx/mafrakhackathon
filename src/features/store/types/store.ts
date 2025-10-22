/**
 * أنواع البيانات للمتجر الزراعي
 */

export interface Product {
  id: string;
  name: string;
  name_en: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
  location: string;
  rating: number;
  stock: number;
  seller: {
    name: string;
    verified: boolean;
  };
  tags: string[];
}

export type ProductCategory = 
  | 'بذور' 
  | 'أدوات' 
  | 'أسمدة' 
  | 'زراعة متقدمة'
  | 'معدات ري'
  | 'مبيدات';

export interface FilterState {
  searchQuery: string;
  category: ProductCategory | 'الكل';
  location: string;
  minPrice: number;
  maxPrice: number;
}

export interface QuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}


