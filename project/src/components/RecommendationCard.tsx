import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Repeat } from 'lucide-react';
import { CropRecommendation } from '../types/crop';

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
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="text-3xl">{recommendation.icon}</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{recommendation.name}</h3>
              <p className="text-sm text-gray-500">{recommendation.name_en}</p>
            </div>
          </div>
          <div className="text-left">
            <div className="text-2xl font-bold mb-1" style={{ color: recommendation.suitabilityColor }}>
              #{rank}
            </div>
            <div className="text-xs text-gray-500">الترتيب</div>
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
              {recommendation.suitabilityScore.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">نقاط الملاءمة</div>
          </div>
        </div>

        {/* شريط التقدم */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{
              width: `${recommendation.suitabilityScore}%`,
              backgroundColor: recommendation.suitabilityColor
            }}
          ></div>
        </div>

        {/* معلومات إضافية */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          {recommendation.duration_days && (
            <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{recommendation.duration_days} يوم</span>
            </div>
          )}
          {recommendation.crop_rotation && recommendation.crop_rotation.length > 0 && (
            <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
              <Repeat className="w-4 h-4" />
              <span>تناوب متاح</span>
            </div>
          )}
        </div>

        {/* زر التفاصيل */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-center space-x-2 space-x-reverse py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">
            {showDetails ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
          </span>
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* التفاصيل المتقدمة */}
      {showDetails && (
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <h4 className="font-semibold text-gray-800 mb-4">تفصيل النقاط حسب المعايير:</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">درجة الحموضة (30%)</span>
              <span className="font-semibold">{recommendation.scoreBreakdown.ph.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">درجة الحرارة (20%)</span>
              <span className="font-semibold">{recommendation.scoreBreakdown.temperature.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">معدل الأمطار (20%)</span>
              <span className="font-semibold">{recommendation.scoreBreakdown.rainfall.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">نوع التربة (10%)</span>
              <span className="font-semibold">{recommendation.scoreBreakdown.soilType.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">موسم الزراعة (10%)</span>
              <span className="font-semibold">{recommendation.scoreBreakdown.season.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">التناوب الزراعي (10%)</span>
              <span className="font-semibold">{recommendation.scoreBreakdown.rotation.toFixed(1)}</span>
            </div>
          </div>

          {/* النطاقات المثالية */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h5 className="font-semibold text-gray-800 mb-3">النطاقات المثالية:</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {recommendation.ph_min > 0 && (
                <div>
                  <span className="text-gray-600">pH: </span>
                  <span className="font-medium">{recommendation.ph_min} - {recommendation.ph_max}</span>
                </div>
              )}
              {recommendation.temp_min > 0 && (
                <div>
                  <span className="text-gray-600">الحرارة: </span>
                  <span className="font-medium">{recommendation.temp_min}° - {recommendation.temp_max}°م</span>
                </div>
              )}
              {recommendation.rain_min > 0 && (
                <div>
                  <span className="text-gray-600">الأمطار: </span>
                  <span className="font-medium">{recommendation.rain_min} - {recommendation.rain_max} مم</span>
                </div>
              )}
              {recommendation.growing_season && recommendation.growing_season.length > 0 && (
                <div>
                  <span className="text-gray-600">موسم الزراعة: </span>
                  <span className="font-medium">{recommendation.growing_season.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}