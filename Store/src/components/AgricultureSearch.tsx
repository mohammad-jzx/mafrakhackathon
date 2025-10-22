import React, { useState, useEffect } from 'react';
import { SearchBar } from './SearchBar';
import { FilterPanel } from './FilterPanel';
import { SearchResults } from './SearchResults';
import { SearchAPI, SearchFilters } from '../utils/searchApi';
import { Product } from '../data/products';

export const AgricultureSearch: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'الكل',
    location: 'الكل',
    sortBy: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    inStock: undefined
  });

  useEffect(() => {
    searchProducts();
  }, [filters]);

  const searchProducts = async () => {
    setIsLoading(true);
    try {
      const result = await SearchAPI.searchProducts(filters);
      setProducts(result.products);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            محرك بحث المنتجات الزراعية الأردنية
          </h1>
          <h2 className="text-xl md:text-2xl font-medium text-emerald-600 dark:text-emerald-400 mb-6">
            اكتشف أفضل المنتجات الزراعية في الأردن
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            محرك بحث شامل للمنتجات الزراعية من أفضل المتاجر والموردين في المملكة الأردنية الهاشمية
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} initialQuery={filters.query} />
        </div>

        {/* Filters Section */}
        <div className="mb-8">
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isOpen={isFilterOpen}
            onToggle={() => setIsFilterOpen(!isFilterOpen)}
          />
        </div>

        {/* Results Section */}
        <SearchResults
          products={products}
          totalCount={totalCount}
          isLoading={isLoading}
          query={filters.query || ''}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-300">
            <p>© 2025 محرك بحث المنتجات الزراعية الأردنية. جميع الحقوق محفوظة.</p>
            <p className="mt-2 text-sm">
              منصة شاملة لربط المزارعين والمتاجر الزراعية بالمستهلكين في الأردن
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};