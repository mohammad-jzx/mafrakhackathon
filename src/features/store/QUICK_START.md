# ⚡ Quick Start - متجر AgriAI

## 🚀 البدء السريع

### 1️⃣ الاستخدام الأساسي (30 ثانية)

```tsx
import StoreSection from '@/features/store/StoreSection';

export default function ShopPage() {
  return <StoreSection />;
}
```

### 2️⃣ في App.tsx

```tsx
import StoreSection from './features/store/StoreSection';

function App() {
  const [activeTab, setActiveTab] = useState('store');
  
  return (
    <div>
      {activeTab === 'store' && <StoreSection />}
    </div>
  );
}
```

## ✅ تم بالفعل!

- ✅ تم التكامل في `App.tsx`
- ✅ تم إضافة زر "المتجر" في الـ Navbar
- ✅ تم تثبيت `framer-motion`
- ✅ لا توجد أخطاء

## 🎯 جرب الآن!

1. افتح المتصفح على `http://localhost:5174/`
2. اضغط على "المتجر" في الـ Navbar
3. استمتع بالتجربة! 🎉

## 📁 الملفات المنشأة

```
src/features/store/
├── StoreSection.tsx          ⭐ الصفحة الرئيسية
├── components/
│   ├── ProductCard.tsx       🛍️ بطاقة المنتج
│   ├── QuickView.tsx         👁️ العرض السريع
│   ├── FiltersBar.tsx        🔍 الفلاتر
│   └── ProductCardSkeleton.tsx  ⏳ Skeleton
├── hooks/
│   └── useStoreFilters.ts    🎣 إدارة الفلاتر
├── data/
│   └── mock.ts               📦 16 منتج
└── types/
    └── store.ts              📋 الأنواع
```

## 🎨 المميزات

- ✅ 16 منتج تجريبي
- ✅ 6 فئات مختلفة
- ✅ 10 مواقع
- ✅ فلاتر متقدمة
- ✅ بحث نصي
- ✅ عرض سريع
- ✅ تصميم متجاوب
- ✅ أنيميشن سلس

## 🔧 التخصيص السريع

### تغيير عدد الأعمدة

في `StoreSection.tsx`:
```tsx
// من 4 أعمدة إلى 3
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
```

### تغيير الخلفية

```tsx
// من slate إلى emerald
<div className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-800">
```

### إضافة منتج جديد

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

## 📚 التوثيق الكامل

- [README.md](./README.md) - التوثيق الكامل
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) - دليل التنفيذ
- [examples/usage-examples.tsx](./examples/usage-examples.tsx) - أمثلة

## 🎉 انتهى!

المتجر جاهز ويعمل! استمتع بالتجربة 🚀

---

**صُنع بـ ❤️ لموقع AgriAI**


