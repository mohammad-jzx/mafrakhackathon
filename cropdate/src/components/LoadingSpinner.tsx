import React from 'react';
import { Brain, Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
          <Brain className="w-8 h-8 text-green-600" />
        </div>
        <Loader2 className="absolute inset-0 w-16 h-16 text-green-500 animate-spin" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          جاري تحليل صورة المحصول
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          نموذج الشبكة العصبية يعالج الصورة لتحديد جاهزية الحصاد...
        </p>
        <div className="flex items-center justify-center space-x-2 space-x-reverse text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>معالجة</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse animation-delay-200"></div>
          <span>تحليل</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse animation-delay-400"></div>
          <span>توقع</span>
        </div>
      </div>
    </div>
  );
};