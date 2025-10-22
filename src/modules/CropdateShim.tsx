
import React from 'react';

// استخدام alias @cropdate بدلاً من المسار النسبي لتجنب مشاكل Vite
const CropdateApp = React.lazy(() => import('@cropdate/src/App'));

export default function CropdateShim() {
  return (
    <React.Suspense fallback={<div className="p-4 text-center">جارٍ تحميل واجهة تخطيط المحاصيل…</div>}>
      <CropdateApp />
    </React.Suspense>
  );
}



