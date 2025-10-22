/**
 * شريط الفلاتر والبحث
 */
import { motion } from 'framer-motion';
import { Search, X, Filter } from 'lucide-react';
import { FilterState, ProductCategory } from '../types/store';
import { categories, locations } from '../data/mock';

interface FiltersBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
  onClearFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

export default function FiltersBar({
  filters,
  onFilterChange,
  onClearFilters,
  filteredCount,
  totalCount
}: FiltersBarProps) {
  const hasActiveFilters = 
    filters.searchQuery !== '' ||
    filters.category !== 'الكل' ||
    filters.location !== 'الكل' ||
    filters.minPrice !== 0 ||
    filters.maxPrice !== 1000;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-slate-700 mb-6"
    >
      {/* العنوان والإحصائيات */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 dark:bg-emerald-500/20 p-2 rounded-lg">
            <Filter className="w-5 h-5 text-green-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">فلاتر البحث</h2>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              عرض {filteredCount} من {totalCount} منتج
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClearFilters}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <X className="w-4 h-4" />
            <span>مسح الفلاتر</span>
          </motion.button>
        )}
      </div>

      {/* الفلاتر */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* البحث */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            البحث
          </label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange('searchQuery', e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 border border-gray-300 dark:border-slate-700 rounded-lg pr-10 pl-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* الفئة */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            الفئة
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value as ProductCategory | 'الكل')}
            className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500 transition-all cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* الموقع */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            الموقع
          </label>
          <select
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500 transition-all cursor-pointer"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc === 'الكل' ? '📍 جميع المواقع' : `📍 ${loc}`}
              </option>
            ))}
          </select>
        </div>

        {/* السعر الأدنى */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            السعر الأدنى (دينار)
          </label>
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => onFilterChange('minPrice', parseFloat(e.target.value) || 0)}
            min="0"
            max="1000"
            className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* السعر الأقصى */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            السعر الأقصى (دينار)
          </label>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange('maxPrice', parseFloat(e.target.value) || 1000)}
            min="0"
            max="1000"
            className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* شريط السعر */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            نطاق السعر
          </label>
          <div className="relative pt-2">
            <input
              type="range"
              min="0"
              max="1000"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange('maxPrice', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-600 dark:accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 mt-1">
              <span>0</span>
              <span>1000</span>
            </div>
          </div>
        </div>
      </div>

      {/* الفلاتر النشطة */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700"
        >
          <div className="flex flex-wrap gap-2">
            {filters.searchQuery && (
              <span className="inline-flex items-center gap-2 bg-green-100 dark:bg-emerald-500/20 text-green-700 dark:text-emerald-400 px-3 py-1.5 rounded-full text-sm border border-green-300 dark:border-emerald-500/30">
                بحث: "{filters.searchQuery}"
                <button
                  onClick={() => onFilterChange('searchQuery', '')}
                  className="hover:text-green-800 dark:hover:text-emerald-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.category !== 'الكل' && (
              <span className="inline-flex items-center gap-2 bg-green-100 dark:bg-emerald-500/20 text-green-700 dark:text-emerald-400 px-3 py-1.5 rounded-full text-sm border border-green-300 dark:border-emerald-500/30">
                فئة: {filters.category}
                <button
                  onClick={() => onFilterChange('category', 'الكل')}
                  className="hover:text-green-800 dark:hover:text-emerald-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.location !== 'الكل' && (
              <span className="inline-flex items-center gap-2 bg-green-100 dark:bg-emerald-500/20 text-green-700 dark:text-emerald-400 px-3 py-1.5 rounded-full text-sm border border-green-300 dark:border-emerald-500/30">
                موقع: {filters.location}
                <button
                  onClick={() => onFilterChange('location', 'الكل')}
                  className="hover:text-green-800 dark:hover:text-emerald-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
              <span className="inline-flex items-center gap-2 bg-green-100 dark:bg-emerald-500/20 text-green-700 dark:text-emerald-400 px-3 py-1.5 rounded-full text-sm border border-green-300 dark:border-emerald-500/30">
                سعر: {filters.minPrice} - {filters.maxPrice} دينار
                <button
                  onClick={() => {
                    onFilterChange('minPrice', 0);
                    onFilterChange('maxPrice', 1000);
                  }}
                  className="hover:text-green-800 dark:hover:text-emerald-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

