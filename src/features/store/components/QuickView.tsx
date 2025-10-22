/**
 * نافذة العرض السريع للمنتج
 */
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, MapPin, Star, CheckCircle } from 'lucide-react';
import { QuickViewProps } from '../types/store';

export default function QuickView({ product, isOpen, onClose, onAddToCart }: QuickViewProps) {
  if (!product) return null;

  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating % 1 !== 0;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={handleBackdropClick}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200 dark:border-slate-700"
            >
              {/* زر الإغلاق */}
              <button
                onClick={onClose}
                className="absolute top-4 left-4 z-10 bg-gray-200 hover:bg-gray-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-white p-2 rounded-full transition-colors shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid md:grid-cols-2 gap-0">
                {/* الصورة */}
                <div className="bg-gray-100 dark:bg-slate-900 aspect-square md:aspect-auto md:h-full">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* المحتوى */}
                <div className="p-6 md:p-8 overflow-y-auto max-h-[90vh]">
                  <div className="space-y-4">
                    {/* الفئة */}
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-emerald-500/20 text-green-700 dark:text-emerald-400 text-sm font-semibold rounded-full border border-green-300 dark:border-emerald-500/30">
                        {product.category}
                      </span>
                      {product.seller.verified && (
                        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>تاجر موثق</span>
                        </div>
                      )}
                    </div>

                    {/* الاسم */}
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                        {product.name}
                      </h2>
                      <p className="text-gray-600 dark:text-slate-400">{product.name_en}</p>
                    </div>

                    {/* التقييم */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(fullStars)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                        {hasHalfStar && (
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 opacity-50" />
                        )}
                        {[...Array(5 - Math.ceil(product.rating))].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-gray-300 dark:text-slate-600" />
                        ))}
                      </div>
                      <span className="text-gray-700 dark:text-slate-300 font-medium">{product.rating}</span>
                      <span className="text-gray-400 dark:text-slate-500">•</span>
                      <span className="text-gray-600 dark:text-slate-400 text-sm">{product.stock} متوفر</span>
                    </div>

                    {/* السعر */}
                    <div className="py-4 border-y border-gray-200 dark:border-slate-700">
                      <div className="flex items-baseline gap-2">
                        <span className="text-green-600 dark:text-emerald-400 font-bold text-4xl">
                          {product.price}
                        </span>
                        <span className="text-gray-600 dark:text-slate-400 text-lg">دينار</span>
                      </div>
                    </div>

                    {/* الوصف */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">الوصف</h3>
                      <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* التاجر */}
                    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 dark:text-slate-400 text-sm mb-1">التاجر</p>
                          <div className="flex items-center gap-2">
                            <span className="text-green-600 dark:text-emerald-400 font-semibold">
                              {product.seller.name}
                            </span>
                            {product.seller.verified && (
                              <CheckCircle className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 dark:text-slate-400">
                          <MapPin className="w-4 h-4" />
                          <span>{product.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* العلامات */}
                    {product.tags.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">العلامات</h3>
                        <div className="flex flex-wrap gap-2">
                          {product.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="text-sm text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-slate-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* الأزرار */}
                    <div className="flex gap-3 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onAddToCart(product);
                          onClose();
                        }}
                        disabled={product.stock === 0}
                        className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 disabled:bg-gray-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span>أضف إلى السلة</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onClose}
                        className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-white font-semibold py-4 px-6 rounded-lg transition-colors border border-gray-300 dark:border-slate-700"
                      >
                        إغلاق
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

