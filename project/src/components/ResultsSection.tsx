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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">محاصيل مثالية</p>
              <p className="text-3xl font-bold">{excellentCrops.length}</p>
            </div>
            <Award className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">محاصيل مناسبة جزئياً</p>
              <p className="text-3xl font-bold">{goodCrops.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">محاصيل غير مناسبة</p>
              <p className="text-3xl font-bold">{poorCrops.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-200" />
          </div>
        </div>
      </div>

      {/* النتائج مرتبة */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🏆 توصيات المحاصيل مرتبة حسب الملاءمة
        </h3>
        
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
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-semibold text-blue-800 mb-3">📋 ملاحظات مهمة:</h4>
        <ul className="space-y-2 text-blue-700 text-sm">
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