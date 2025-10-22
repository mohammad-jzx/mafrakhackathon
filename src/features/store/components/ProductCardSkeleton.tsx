/**
 * Skeleton Loading لبطاقة المنتج
 */
export default function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-slate-700 animate-pulse">
      {/* صورة */}
      <div className="bg-gray-200 dark:bg-slate-700 aspect-square" />

      {/* المحتوى */}
      <div className="p-4 space-y-3">
        {/* الاسم */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
        </div>

        {/* الوصف */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded" />
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-5/6" />
        </div>

        {/* الموقع والتقييم */}
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20" />
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-16" />
        </div>

        {/* التاجر */}
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32" />

        {/* السعر */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-slate-700">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-24" />
          <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-20" />
        </div>

        {/* الأزرار */}
        <div className="flex gap-2 pt-2">
          <div className="flex-1 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg" />
          <div className="w-20 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

