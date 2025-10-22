/**
 * بطاقة المنتج في المتجر
 */
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, MapPin, Star, CheckCircle } from 'lucide-react';
import { Product } from '../types/store';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onQuickView }: ProductCardProps) {
  // حساب عدد النجوم المملوءة
  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating % 1 !== 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="group relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-slate-700"
    >
      {/* صورة المنتج */}
      <div className="relative overflow-hidden bg-gray-100 dark:bg-slate-900 aspect-square">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* شارة الفئة */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 dark:bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full shadow-lg">
            {product.category}
          </span>
        </div>

        {/* شارة التاجر الموثق */}
        {product.seller.verified && (
          <div className="absolute top-3 left-3">
            <div className="bg-blue-500/90 backdrop-blur-sm p-1.5 rounded-full">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
        )}

        {/* أزرار الإجراءات السريعة - تظهر عند hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onQuickView(product)}
            className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors"
            title="عرض سريع"
          >
            <Eye className="w-5 h-5 text-slate-900" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAddToCart(product)}
            className="bg-emerald-500 p-3 rounded-full shadow-lg hover:bg-emerald-600 transition-colors"
            title="أضف إلى السلة"
          >
            <ShoppingCart className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </div>

      {/* محتوى البطاقة */}
      <div className="p-4 space-y-3">
        {/* اسم المنتج */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-1 group-hover:text-green-600 dark:group-hover:text-emerald-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{product.name_en}</p>
        </div>

        {/* الوصف */}
        <p className="text-sm text-gray-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* الموقع والتقييم */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-500 dark:text-slate-400">
            <MapPin className="w-4 h-4" />
            <span>{product.location}</span>
          </div>

          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(fullStars)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              {hasHalfStar && (
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50" />
              )}
              {[...Array(5 - Math.ceil(product.rating))].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-gray-300 dark:text-slate-600" />
              ))}
            </div>
            <span className="text-gray-700 dark:text-slate-300 font-medium mr-1">{product.rating}</span>
          </div>
        </div>

        {/* التاجر */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-slate-400">من:</span>
          <span className="text-xs text-green-600 dark:text-emerald-400 font-medium">{product.seller.name}</span>
          {product.seller.verified && (
            <CheckCircle className="w-3 h-3 text-blue-500 dark:text-blue-400" />
          )}
        </div>

        {/* السعر والمخزون */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-slate-700">
          <div>
            <span className="text-green-600 dark:text-emerald-400 font-bold text-2xl">{product.price}</span>
            <span className="text-gray-500 dark:text-slate-400 text-sm mr-1">دينار</span>
          </div>
          
          {product.stock > 0 ? (
            <span className="text-xs text-green-600 dark:text-emerald-400 bg-green-100 dark:bg-emerald-500/10 px-2 py-1 rounded-full">
              متوفر ({product.stock})
            </span>
          ) : (
            <span className="text-xs text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-500/10 px-2 py-1 rounded-full">
              نفد المخزون
            </span>
          )}
        </div>

        {/* الأزرار */}
        <div className="flex gap-2 pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 disabled:bg-gray-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>أضف للسلة</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onQuickView(product)}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span>عرض</span>
          </motion.button>
        </div>

        {/* العلامات */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs text-gray-600 dark:text-slate-400 bg-gray-100 dark:bg-slate-700/50 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

