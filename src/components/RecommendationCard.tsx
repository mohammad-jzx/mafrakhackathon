import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Repeat } from 'lucide-react';
import { CropRecommendation } from '../types/crop';

// دالة مساعدة آمنة للتعامل مع toFixed
function safeToFixed(value: number | null | undefined, digits: number = 1): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "-";
  }
  return value.toFixed(digits);
}

interface RecommendationCardProps {
  recommendation: CropRecommendation;
  rank: number;
}

export default function RecommendationCard({ recommendation, rank }: RecommendationCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getSuitabilityText = (level: string) => {
    switch (level) {
      case 'excellent': return 'مثالي';
      case 'good': return 'مناسب جزئياً';
      case 'poor': return 'غير مناسب';
      default: return 'غير محدد';
    }
  };

  const getSuitabilityIcon = (level: string) => {
    switch (level) {
      case 'excellent': return '🟢';
      case 'good': return '🟡';
      case 'poor': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="bg-white dark:bg-[#1F222E] rounded-2xl shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-[#2A2E3E]">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="text-3xl">{recommendation.icon}</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">{recommendation.nameAr}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{recommendation.name}</p>
            </div>
          </div>
          <div className="text-left">
            <div className="text-2xl font-bold mb-1" style={{ color: recommendation.suitabilityColor }}>
              #{rank}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">الترتيب</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="text-2xl">{getSuitabilityIcon(recommendation.suitabilityLevel)}</span>
            <span className="font-semibold" style={{ color: recommendation.suitabilityColor }}>
              {getSuitabilityText(recommendation.suitabilityLevel)}
            </span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: recommendation.suitabilityColor }}>
              {safeToFixed(recommendation.suitabilityScore)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">نقاط الملاءمة</div>
          </div>
        </div>

        <div className="w-full bg-gray-200 dark:bg-[#2A2E3E] rounded-full h-3 mb-4">
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{
              width: `${recommendation.suitabilityScore}%`,
              backgroundColor: recommendation.suitabilityColor
            }}
          ></div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Clock className="w-4 h-4" />
            <span>{recommendation.growingSeason?.length || 0} شهور</span>
          </div>
          {recommendation.cropRotation && recommendation.cropRotation.length > 0 && (
            <div className="flex items-center space-x-2 space-x-reverse">
              <Repeat className="w-4 h-4" />
              <span>تناوب متاح</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-center space-x-2 space-x-reverse py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-[#2A2E3E] dark:hover:bg-[#353A4A] rounded-xl transition-colors"
        >
          <span className="text-sm font-medium text-gray-800 dark:text-white">
            {showDetails ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
          </span>
          {showDetails ? <ChevronUp className="w-4 h-4 text-gray-800 dark:text-white" /> : <ChevronDown className="w-4 h-4 text-gray-800 dark:text-white" />}
        </button>
      </div>

      {showDetails && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-[#1F222E]">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
            تفصيل النقاط حسب المعايير:
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-200">درجة الحموضة (30%)</span>
              <span className="font-semibold text-gray-900 dark:text-white">{safeToFixed(recommendation.scoreBreakdown.ph)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-200">درجة الحرارة (20%)</span>
              <span className="font-semibold text-gray-900 dark:text-white">{safeToFixed(recommendation.scoreBreakdown.temperature)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-200">معدل الأمطار (20%)</span>
              <span className="font-semibold text-gray-900 dark:text-white">{safeToFixed(recommendation.scoreBreakdown.rainfall)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-200">نوع التربة (10%)</span>
              <span className="font-semibold text-gray-900 dark:text-white">{safeToFixed(recommendation.scoreBreakdown.soilType)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-200">موسم الزراعة (10%)</span>
              <span className="font-semibold text-gray-900 dark:text-white">{safeToFixed(recommendation.scoreBreakdown.season)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-200">التناوب الزراعي (10%)</span>
              <span className="font-semibold text-gray-900 dark:text-white">{safeToFixed(recommendation.scoreBreakdown.rotation)}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h5 className="font-semibold text-gray-800 dark:text-white mb-3">النطاقات المثالية:</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-200">
              {recommendation.phMin > 0 && (
                <div><span>pH: </span><span className="font-medium text-gray-900 dark:text-white">{safeToFixed(recommendation.phMin)} - {safeToFixed(recommendation.phMax)}</span></div>
              )}
              {recommendation.tempMin > 0 && (
                <div><span>الحرارة: </span><span className="font-medium text-gray-900 dark:text-white">{safeToFixed(recommendation.tempMin)}° - {safeToFixed(recommendation.tempMax)}°م</span></div>
              )}
              {recommendation.humidityMin > 0 && (
                <div><span>الرطوبة: </span><span className="font-medium text-gray-900 dark:text-white">{safeToFixed(recommendation.humidityMin)}% - {safeToFixed(recommendation.humidityMax)}%</span></div>
              )}
              {recommendation.growingSeason && recommendation.growingSeason.length > 0 && (
                <div><span>موسم الزراعة: </span><span className="font-medium text-gray-900 dark:text-white">{recommendation.growingSeason.join(', ')}</span></div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
