import React from 'react';
import { Package, AlertCircle } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from '../data/products';

interface SearchResultsProps {
  products: Product[];
  totalCount: number;
  isLoading: boolean;
  query: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  products,
  totalCount,
  isLoading,
  query
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-300">جاري البحث...</span>
      </div>
    );
  }

  if (products.length === 0 && query) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          لم يتم العثور على نتائج
        </h3>
        <p className="text-gray-600 dark:text-gray-300" dir="rtl">
          لم نتمكن من العثور على منتجات تطابق بحثك عن "{query}"
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          جرب استخدام كلمات مختلفة أو تحقق من الإملاء
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          ابدأ البحث عن المنتجات الزراعية
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          استخدم شريط البحث أعلاه للعثور على المنتجات الزراعية المناسبة لك
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          نتائج البحث
        </h2>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {totalCount} منتج متاح
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};