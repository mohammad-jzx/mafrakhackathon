/**
 * Hook لإدارة فلاتر المتجر
 */
import { useState, useMemo, useCallback } from 'react';
import { Product, FilterState, ProductCategory } from '../types/store';

const initialFilters: FilterState = {
  searchQuery: '',
  category: 'الكل',
  location: 'الكل',
  minPrice: 0,
  maxPrice: 1000
};

export const useStoreFilters = (products: Product[]) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isLoading, setIsLoading] = useState(false);

  // تحديث فلتر معين
  const updateFilter = useCallback((key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // تطبيق جميع الفلاتر على المنتجات
  const filteredProducts = useMemo(() => {
    setIsLoading(true);
    
    let result = [...products];

    // فلتر البحث النصي
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.name_en.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // فلتر الفئة
    if (filters.category !== 'الكل') {
      result = result.filter(product => product.category === filters.category);
    }

    // فلتر الموقع
    if (filters.location !== 'الكل') {
      result = result.filter(product => product.location === filters.location);
    }

    // فلتر السعر
    result = result.filter(product => 
      product.price >= filters.minPrice && 
      product.price <= filters.maxPrice
    );

    setIsLoading(false);
    return result;
  }, [products, filters]);

  // مسح جميع الفلاتر
  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  // حساب إحصائيات المنتجات
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const filteredCount = filteredProducts.length;
    const categories = new Set(products.map(p => p.category));
    const locations = new Set(products.map(p => p.location));
    const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / totalProducts;

    return {
      totalProducts,
      filteredCount,
      categoriesCount: categories.size,
      locationsCount: locations.size,
      avgPrice: Math.round(avgPrice * 100) / 100
    };
  }, [products, filteredProducts]);

  return {
    filters,
    filteredProducts,
    isLoading,
    updateFilter,
    clearFilters,
    stats
  };
};


