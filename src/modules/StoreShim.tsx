
import React from 'react';

// استخدام alias @store بدلاً من المسار النسبي لتجنب مشاكل Vite
const StoreApp = React.lazy(() => import('@store/src/App'));

export default function StoreShim() {
  return (
    <React.Suspense fallback={<div className="p-4 text-center">جارٍ تحميل المتجر…</div>}>
      <StoreApp />
    </React.Suspense>
  );
}



