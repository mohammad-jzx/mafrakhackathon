# 🛒 متجر AgriAI - المتجر الزراعي الذكي

متجر احترافي كامل للمنتجات الزراعية مبني بـ React + Tailwind + Framer Motion

## 📁 هيكل المشروع

```
src/features/store/
├── types/
│   └── store.ts              # أنواع البيانات
├── data/
│   └── mock.ts               # بيانات تجريبية (16 منتج)
├── hooks/
│   └── useStoreFilters.ts    # إدارة الفلاتر
├── components/
│   ├── ProductCard.tsx       # بطاقة المنتج
│   ├── ProductCardSkeleton.tsx  # Skeleton Loading
│   ├── QuickView.tsx         # نافذة العرض السريع
│   └── FiltersBar.tsx        # شريط الفلاتر
└── StoreSection.tsx          # الصفحة الرئيسية
```

## ✨ المميزات

### 🎨 التصميم
- ✅ تصميم RTL كامل (نصوص عربية)
- ✅ الوضع الداكن (slate-900 background)
- ✅ ألوان زاهية باللون الأخضر الفاتح (emerald-500)
- ✅ تصميم متجاوب (Responsive)
- ✅ أنيميشن سلس مع Framer Motion

### 🔍 الفلاتر المتقدمة
- ✅ بحث نصي في الاسم والوصف والعلامات
- ✅ فلتر حسب الفئة (بذور، أدوات، أسمدة، إلخ)
- ✅ فلتر حسب الموقع (عمّان، إربد، الزرقاء، إلخ)
- ✅ نطاق سعر قابل للتخصيص
- ✅ شريط سعر تفاعلي
- ✅ عرض الفلاتر النشطة
- ✅ زر "مسح الفلاتر"

### 🛍️ المنتجات
- ✅ 16 منتج تجريبي متنوع
- ✅ صورة المنتج مع تأثير hover
- ✅ شارة الفئة
- ✅ شارة التاجر الموثق
- ✅ تقييم بالنجوم (Unicode ★)
- ✅ الموقع مع أيقونة 📍
- ✅ السعر بخط كبير
- ✅ حالة المخزون
- ✅ العلامات (Tags)
- ✅ معلومات التاجر

### 🎯 التفاعل
- ✅ زر "أضف إلى السلة" مع إشعار
- ✅ زر "عرض سريع" يفتح مودال
- ✅ تأثير hover على البطاقات (تكبير + ظل)
- ✅ أنيميشن عند تحميل المنتجات
- ✅ Skeleton Loading أثناء التحميل
- ✅ حالة "لا توجد نتائج"

### 📱 QuickView Modal
- ✅ صورة كبيرة
- ✅ معلومات تفصيلية
- ✅ زر "أضف إلى السلة"
- ✅ زر "إغلاق"
- ✅ إغلاق بالضغط خارج المودال
- ✅ أنيميشن fade + scale

## 🚀 الاستخدام

### استخدام بسيط
```tsx
import StoreSection from '@/features/store/StoreSection';

export default function ShopPage() {
  return <StoreSection />;
}
```

### في App.tsx
```tsx
import StoreSection from './features/store/StoreSection';

function App() {
  return (
    <div>
      {activeTab === 'store' && <StoreSection />}
    </div>
  );
}
```

## 📊 البيانات

### أنواع البيانات
```typescript
interface Product {
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
```

### الفئات المتاحة
- 🌾 بذور
- 🔧 أدوات
- 💊 أسمدة
- 💧 معدات ري
- 🛡️ مبيدات
- 🚀 زراعة متقدمة

### المواقع المتاحة
- عمّان
- إربد
- الزرقاء
- المفرق
- الكرك
- العقبة
- الطفيلة
- مادبا
- جرش

## 🎨 التخصيص

### تغيير الألوان
في `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      emerald: {
        500: '#10b981',
        600: '#059669',
      }
    }
  }
}
```

### إضافة منتجات جديدة
في `data/mock.ts`:
```typescript
export const mockProducts: Product[] = [
  // ... المنتجات الحالية
  {
    id: '17',
    name: 'منتج جديد',
    // ... باقي البيانات
  }
];
```

## 🔧 التكامل مع Firestore (اختياري)

للتكامل مع قاعدة بيانات Firebase:

1. تثبيت Firebase:
```bash
npm install firebase
```

2. إنشاء ملف `config/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // إعدادات Firebase
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

3. إنشاء Hook جديد `hooks/useFirestoreProducts.ts`:
```typescript
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Product } from '../types/store';

export const useFirestoreProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  return { products, loading };
};
```

4. استخدامه في `StoreSection.tsx`:
```typescript
import { useFirestoreProducts } from './hooks/useFirestoreProducts';

export default function StoreSection() {
  const { products, loading } = useFirestoreProducts();
  // ... باقي الكود
}
```

## 📝 ملاحظات

- جميع الصور من Unsplash (صور مجانية)
- يمكن استبدال الصور بصور حقيقية
- البيانات التجريبية قابلة للتوسع
- الكود منظم مع تعليقات واضحة
- يدعم TypeScript بالكامل

## 🎯 التحسينات المستقبلية

- [ ] صفحة تفاصيل المنتج
- [ ] سلة التسوق الكاملة
- [ ] نظام الدفع
- [ ] تقييمات المستخدمين
- [ ] مقارنة المنتجات
- [ ] قائمة الرغبات (Wishlist)
- [ ] البحث المتقدم
- [ ] الفلاتر المتقدمة (حسب التقييم، المخزون، إلخ)

---

**صُنع بـ ❤️ لموقع AgriAI**


