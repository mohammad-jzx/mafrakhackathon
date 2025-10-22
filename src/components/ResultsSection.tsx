import React from 'react';
import { TrendingUp, Award, AlertTriangle } from 'lucide-react';
import { CropRecommendation } from '../types/crop';
import RecommendationCard from './RecommendationCard';

interface ResultsSectionProps {
  recommendations: CropRecommendation[];
}

export default function ResultsSection({ recommendations }: ResultsSectionProps) {
  if (recommendations.length === 0) {
    return null;
  }

  const excellentCrops = recommendations.filter(r => r.suitabilityLevel === 'excellent');
  const goodCrops = recommendations.filter(r => r.suitabilityLevel === 'good');
  const poorCrops = recommendations.filter(r => r.suitabilityLevel === 'poor');

  return (
    <div className="space-y-8">
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 rounded-2xl p-6 text-white shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100">محاصيل مثالية</p>
              <p className="text-3xl font-bold">{excellentCrops.length}</p>
            </div>
            <Award className="w-8 h-8 text-emerald-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 rounded-2xl p-6 text-white shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100">محاصيل مناسبة جزئياً</p>
              <p className="text-3xl font-bold">{goodCrops.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-amber-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-rose-500 to-pink-600 dark:from-rose-600 dark:to-pink-700 rounded-2xl p-6 text-white shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-100">محاصيل غير مناسبة</p>
              <p className="text-3xl font-bold">{poorCrops.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-rose-200" />
          </div>
        </div>
      </div>

      {/* النتائج مرتبة */}
      <div>
        <div className="flex items-center justify-center mb-6">
          <Award className="w-6 h-6 text-amber-500 mr-2" />
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">
            توصيات المحاصيل مرتبة حسب الملاءمة
          </h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendations.map((recommendation, index) => (
            <RecommendationCard
              key={`${recommendation.name}-${index}`}
              recommendation={recommendation}
              rank={index + 1}
            />
          ))}
        </div>
      </div>

      {/* ملاحظات مهمة */}
      <div className="bg-sky-50 dark:bg-gray-800 border border-sky-200 dark:border-sky-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center mb-3">
          <TrendingUp className="w-5 h-5 text-sky-600 dark:text-sky-400 mr-2" />
          <h4 className="font-semibold text-sky-800 dark:text-sky-300">ملاحظات مهمة:</h4>
        </div>
        <ul className="space-y-2 text-sky-700 dark:text-sky-300 text-sm">
          <li>• النقاط محسوبة باستخدام نظام أوزان ذكي: pH (30%), الحرارة (20%), الأمطار (20%), التربة (10%), الموسم (10%), التناوب (10%)</li>
          <li>• المحاصيل ذات النقاط 90+ مثالية لظروفك الحالية</li>
          <li>• المحاصيل ذات النقاط 70-89 مناسبة مع بعض التحفظات</li>
          <li>• المحاصيل ذات النقاط أقل من 70 غير مناسبة للظروف الحالية</li>
          <li>• يُنصح بمراجعة خبير زراعي قبل اتخاذ القرار النهائي</li>
        </ul>
      </div>
    </div>
  );
} 