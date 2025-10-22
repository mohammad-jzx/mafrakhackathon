/**
 * أمثلة استخدام المتجر الزراعي
 */

import StoreSection from '../StoreSection';
import { ProductCard } from '../index';
import { useStoreFilters } from '../hooks/useStoreFilters';
import { mockProducts } from '../data/mock';

// ============================================
// مثال 1: استخدام بسيط
// ============================================
export function Example1_SimpleUsage() {
  return <StoreSection />;
}

// ============================================
// مثال 2: استخدام مع مكونات منفصلة
// ============================================
export function Example2_ComponentUsage() {
  const { filteredProducts, filters, updateFilter } = useStoreFilters(mockProducts);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">متجر مخصص</h1>
      
      {/* شريط البحث */}
      <input
        type="text"
        value={filters.searchQuery}
        onChange={(e) => updateFilter('searchQuery', e.target.value)}
        placeholder="ابحث..."
        className="w-full p-3 rounded-lg bg-slate-800 text-white mb-6"
      />

      {/* شبكة المنتجات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={(p) => console.log('أضيف:', p.name)}
            onQuickView={(p) => console.log('عرض:', p.name)}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================
// مثال 3: تخصيص التصميم
// ============================================
export function Example3_CustomDesign() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            متجرنا الزراعي
          </h1>
          <p className="text-xl text-slate-300">
            اكتشف أفضل المنتجات الزراعية
          </p>
        </div>
        
        <StoreSection />
      </div>
    </div>
  );
}

// ============================================
// مثال 4: استخدام مع Router
// ============================================
export function Example4_WithRouter() {
  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">AgriAI</h1>
          <div className="flex gap-4">
            <a href="/" className="text-slate-300 hover:text-white">
              الرئيسية
            </a>
            <a href="/store" className="text-emerald-400 font-semibold">
              المتجر
            </a>
          </div>
        </div>
      </nav>

      <main>
        <StoreSection />
      </main>

      <footer className="bg-slate-800 border-t border-slate-700 p-8 mt-12">
        <div className="container mx-auto text-center text-slate-400">
          <p>&copy; 2024 AgriAI. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// مثال 5: استخدام مع State Management
// ============================================
import { useState } from 'react';

export function Example5_WithState() {
  const [cart, setCart] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleAddToCart = (product: any) => {
    setCart([...cart, product]);
    alert(`تمت إضافة ${product.name} إلى السلة`);
  };

  const handleToggleFavorite = (productId: string) => {
    setFavorites(
      favorites.includes(productId)
        ? favorites.filter(id => id !== productId)
        : [...favorites, productId]
    );
  };

  return (
    <div>
      <div className="bg-emerald-500 text-white p-4 mb-6">
        <div className="container mx-auto flex items-center justify-between">
          <h2 className="text-xl font-bold">سلة التسوق</h2>
          <span className="text-2xl font-bold">{cart.length} منتج</span>
        </div>
      </div>

      <StoreSection />
    </div>
  );
}

// ============================================
// مثال 6: استخدام مع Firebase
// ============================================
export function Example6_WithFirebase() {
  // هذا مثال فقط - تحتاج لتثبيت Firebase أولاً
  /*
  import { useFirestoreProducts } from '../hooks/useFirestoreProducts';
  
  const { products, loading } = useFirestoreProducts();

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">منتجات من Firebase</h1>
      <div className="grid grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={(p) => console.log('أضيف:', p)}
            onQuickView={(p) => console.log('عرض:', p)}
          />
        ))}
      </div>
    </div>
  );
  */
  
  return <StoreSection />;
}

// ============================================
// مثال 7: استخدام مع Context API
// ============================================
import { createContext, useContext, useState, ReactNode } from 'react';

interface StoreContextType {
  cart: any[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (product: any) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <StoreContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
}

export function Example7_WithContext() {
  return (
    <StoreProvider>
      <div>
        <CartBadge />
        <StoreSection />
      </div>
    </StoreProvider>
  );
}

function CartBadge() {
  const { cart } = useStore();
  
  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="bg-emerald-500 text-white px-4 py-2 rounded-full shadow-lg">
        السلة: {cart.length}
      </div>
    </div>
  );
}

// ============================================
// مثال 8: استخدام مع TypeScript Strict
// ============================================
import { Product } from '../types/store';

interface StorePageProps {
  initialProducts?: Product[];
  title?: string;
  showFilters?: boolean;
}

export function Example8_WithProps({
  initialProducts = mockProducts,
  title = 'المتجر',
  showFilters = true
}: StorePageProps) {
  const { filteredProducts } = useStoreFilters(initialProducts);

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <h1 className="text-4xl font-bold text-white mb-8">{title}</h1>
      
      {showFilters && (
        <div className="mb-8">
          {/* يمكنك إضافة فلاتر مخصصة هنا */}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={(p) => console.log('أضيف:', p)}
            onQuickView={(p) => console.log('عرض:', p)}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================
// مثال 9: استخدام مع LocalStorage
// ============================================
export function Example9_WithLocalStorage() {
  const [cart, setCart] = useState<any[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const handleAddToCart = (product: any) => {
    const newCart = [...cart, product];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  return (
    <div>
      <div className="bg-slate-800 p-4 mb-6">
        <p className="text-white">المنتجات في السلة: {cart.length}</p>
      </div>
      <StoreSection />
    </div>
  );
}

// ============================================
// مثال 10: استخدام مع SSR (Next.js)
// ============================================
export function Example10_SSR() {
  // هذا مثال لاستخدام مع Next.js
  /*
  import { GetServerSideProps } from 'next';
  
  export const getServerSideProps: GetServerSideProps = async () => {
    // جلب البيانات من API أو قاعدة البيانات
    const products = await fetchProducts();
    
    return {
      props: {
        products
      }
    };
  };

  export default function StorePage({ products }: { products: Product[] }) {
    return (
      <div>
        <StoreSection initialProducts={products} />
      </div>
    );
  }
  */
  
  return <StoreSection />;
}


