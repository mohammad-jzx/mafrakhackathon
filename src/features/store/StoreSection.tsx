/**
 * صفحة المتجر الرئيسية
 * متجر زراعي احترافي مع فلاتر متقدمة وعرض سريع
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Sparkles, Plus, Trash2, X } from 'lucide-react';
import { mockProducts } from './data/mock';
import { useStoreFilters } from './hooks/useStoreFilters';
import ProductCard from './components/ProductCard';
import QuickView from './components/QuickView';
import FiltersBar from './components/FiltersBar';
import ProductCardSkeleton from './components/ProductCardSkeleton';
import { Product } from './types/store';

export default function StoreSection() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [cart, setCart] = useState<Product[]>([]);
  const [productsDisplayed, setProductsDisplayed] = useState<Product[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: '',
    description: '',
    image: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const { filters, filteredProducts, isLoading, updateFilter, clearFilters, stats } = 
    useStoreFilters(mockProducts);
    
  // تحميل البيانات من localStorage أو استخدام البيانات الافتراضية
  useEffect(() => {
    const storedProducts = localStorage.getItem('store:products');
    if (storedProducts) {
      setProductsDisplayed(JSON.parse(storedProducts).slice(0, 8));
    } else {
      setProductsDisplayed(filteredProducts.slice(0, 8));
    }
  }, [filteredProducts]);

  // فتح العرض السريع
  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  // إغلاق العرض السريع
  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  // إضافة منتج للسلة
  const handleAddToCart = (product: Product) => {
    setCart(prev => [...prev, product]);
    
    // إشعار بسيط (يمكن تحسينه لاحقاً)
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 left-4 z-50 bg-green-600 dark:bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-slide-in';
    notification.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span>تمت إضافة "${product.name}" إلى السلة</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slide-out 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };
  
  // إضافة بطاقة جديدة
  const handleAddCard = () => {
    setIsAddModalOpen(true);
  };
  
  // حفظ البطاقة الجديدة
  const handleSaveCard = () => {
    // التحقق من الحقول المطلوبة
    const errors: {[key: string]: string} = {};
    
    if (!newProduct.name) {
      errors.name = 'الاسم مطلوب';
    }
    
    if (!newProduct.price || isNaN(Number(newProduct.price))) {
      errors.price = 'السعر مطلوب ويجب أن يكون رقماً';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // إنشاء منتج جديد
    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name || '',
      name_en: newProduct.name || '',
      description: newProduct.description || 'وصف المنتج',
      price: Number(newProduct.price) || 0,
      category: newProduct.category || 'أخرى',
      image: newProduct.image || 'https://via.placeholder.com/500x500?text=منتج+زراعي',
      location: 'عمّان',
      rating: 4.0,
      stock: 10,
      seller: {
        name: 'متجر AgriAI',
        verified: true
      },
      tags: ['جديد']
    };
    
    // إضافة المنتج في بداية القائمة
    const updatedProducts = [product, ...productsDisplayed].slice(0, 8);
    setProductsDisplayed(updatedProducts);
    
    // حفظ في localStorage
    localStorage.setItem('store:products', JSON.stringify(updatedProducts));
    
    // إغلاق النموذج وإعادة تعيين الحقول
    setIsAddModalOpen(false);
    setNewProduct({
      name: '',
      price: 0,
      category: '',
      description: '',
      image: ''
    });
    setFormErrors({});
  };
  
  // حذف بطاقة
  const handleDeleteCard = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };
  
  // تأكيد حذف البطاقة
  const confirmDeleteCard = () => {
    if (!productToDelete) return;
    
    const updatedProducts = productsDisplayed.filter(p => p.id !== productToDelete.id);
    setProductsDisplayed(updatedProducts);
    
    // حفظ في localStorage
    localStorage.setItem('store:products', JSON.stringify(updatedProducts));
    
    // إغلاق نموذج التأكيد
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-8 px-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-green-100 dark:bg-emerald-500/10 border border-green-300 dark:border-emerald-500/30 rounded-full px-6 py-2 mb-4">
            <Sparkles className="w-5 h-5 text-green-600 dark:text-emerald-400" />
            <span className="text-green-600 dark:text-emerald-400 font-semibold">متجر AgriAI</span>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white">
              متجر المنتجات الزراعية
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddCard}
              className="bg-green-600 hover:bg-green-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 font-semibold transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>إضافة بطاقة</span>
            </motion.button>
          </div>
          <p className="text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
            اكتشف أفضل المنتجات الزراعية من بذور وأدوات وأسمدة ومعدات حديثة
          </p>

          {/* إحصائيات سريعة */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-xl px-6 py-3 shadow-lg">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-green-600 dark:text-emerald-400" />
                <span className="text-gray-800 dark:text-white font-semibold">{stats.totalProducts}</span>
                <span className="text-gray-600 dark:text-slate-400">منتج</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-xl px-6 py-3 shadow-lg">
              <span className="text-green-600 dark:text-emerald-400 font-semibold">{stats.categoriesCount}</span>
              <span className="text-gray-600 dark:text-slate-400 mr-2">فئة</span>
            </div>
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-xl px-6 py-3 shadow-lg">
              <span className="text-green-600 dark:text-emerald-400 font-semibold">{stats.avgPrice}</span>
              <span className="text-gray-600 dark:text-slate-400 mr-2">دينار متوسط السعر</span>
            </div>
          </div>
        </motion.div>

        {/* شريط الفلاتر */}
        <FiltersBar
          filters={filters}
          onFilterChange={updateFilter}
          onClearFilters={clearFilters}
          filteredCount={filteredProducts.length}
          totalCount={mockProducts.length}
        />

        {/* شبكة المنتجات */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-200 dark:bg-slate-800 rounded-full mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400 dark:text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              لا توجد نتائج
            </h3>
            <p className="text-gray-600 dark:text-slate-400 mb-6">
              لم نتمكن من العثور على منتجات تطابق معايير البحث
            </p>
            <button
              onClick={clearFilters}
              className="bg-green-600 hover:bg-green-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              مسح جميع الفلاتر
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {productsDisplayed.map((product) => (
                <div key={product.id} className="relative">
                  <button 
                    onClick={() => handleDeleteCard(product)}
                    className="absolute top-2 left-2 z-10 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-full p-1.5 shadow-md transition-colors"
                    aria-label="حذف البطاقة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleQuickView}
                  />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* عرض السلة */}
        {cart.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 left-6 z-40"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 hover:bg-green-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-semibold"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>السلة ({cart.length})</span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* نافذة العرض السريع */}
      <QuickView
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={handleCloseQuickView}
        onAddToCart={handleAddToCart}
      />

      {/* نموذج إضافة بطاقة جديدة */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">إضافة بطاقة جديدة</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">الاسم *</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500"
                    placeholder="اسم المنتج"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">السعر *</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500"
                    placeholder="سعر المنتج"
                    min="0"
                    step="0.01"
                  />
                  {formErrors.price && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">التصنيف</label>
                  <input
                    type="text"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500"
                    placeholder="تصنيف المنتج"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">الوصف المختصر</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500"
                    placeholder="وصف المنتج"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">رابط الصورة</label>
                  <input
                    type="text"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500"
                    placeholder="رابط صورة المنتج"
                  />
                </div>
                
                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 mr-2"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleSaveCard}
                    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-semibold transition-colors"
                  >
                    حفظ
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نموذج تأكيد الحذف */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">تأكيد الحذف</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                هل تريد حذف هذه البطاقة؟
              </p>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 mr-2"
                >
                  إلغاء
                </button>
                <button
                  onClick={confirmDeleteCard}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-semibold transition-colors"
                >
                  حذف
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* إضافة أنيميشن مخصص */}
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slide-out {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(-100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

