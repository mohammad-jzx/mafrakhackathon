import React from 'react';
import { ExternalLink, Star, MapPin, Package } from 'lucide-react';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleStoreClick = () => {
    window.open(product.storeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 
                    border border-gray-200 dark:border-gray-700 overflow-hidden group">
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.productName}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/4505442/pexels-photo-4505442.jpeg?auto=compress&cs=tinysrgb&w=300';
          }}
        />
        {!product.inStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            غير متوفر
          </div>
        )}
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs font-medium">
          {product.category}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2" dir="rtl">
          {product.productName}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2" dir="rtl">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {product.rating}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({product.reviews} تقييم)
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300">{product.location}</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Package className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300" dir="rtl">
            {product.storeName}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-right">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {product.price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
              {product.currency}
            </span>
          </div>
          
          <button
            onClick={handleStoreClick}
            disabled={!product.inStock}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              product.inStock
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>زيارة المتجر</span>
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};