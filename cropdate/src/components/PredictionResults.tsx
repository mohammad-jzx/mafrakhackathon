import React from 'react';
import { Calendar, TrendingUp, CheckCircle, Clock, Lightbulb } from 'lucide-react';
import { PredictionResult } from '../types/crop';

interface PredictionResultsProps {
  result: PredictionResult;
}

export const PredictionResults: React.FC<PredictionResultsProps> = ({ result }) => {
  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'early': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'mid': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'late': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'ready': return <CheckCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getStageText = (stage: string) => {
    switch (stage) {
      case 'early': return 'مرحلة مبكرة';
      case 'mid': return 'مرحلة متوسطة';
      case 'late': return 'مرحلة متأخرة';
      case 'ready': return 'جاهز للحصاد';
      default: return stage;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <TrendingUp className="w-6 h-6 ml-2" />
          نتائج توقع الحصاد
        </h2>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Crop Type and Confidence */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{result.cropType}</h3>
            <p className="text-sm text-gray-600">نوع المحصول</p>
          </div>
          <div className="text-left">
            <div className="text-2xl font-bold text-green-600">
              {(result.confidence * 100).toFixed(1)}%
            </div>
            <p className="text-sm text-gray-600">مستوى الثقة</p>
          </div>
        </div>

        {/* Maturity Stage */}
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className={`px-3 py-2 rounded-lg border flex items-center space-x-2 space-x-reverse ${getStageColor(result.maturityStage)}`}>
            {getStageIcon(result.maturityStage)}
            <span className="font-medium">{getStageText(result.maturityStage)}</span>
          </div>
        </div>

        {/* Harvest Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center space-x-2 space-x-reverse mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-800">موعد الحصاد المتوقع</h4>
            </div>
            <p className="text-lg font-bold text-blue-900">{result.estimatedHarvestDate}</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center space-x-2 space-x-reverse mb-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-purple-800">أيام حتى الحصاد</h4>
            </div>
            <p className="text-lg font-bold text-purple-900">
              {result.daysToHarvest} {result.daysToHarvest === 1 ? 'يوم' : 'أيام'}
            </p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <div className="flex items-center space-x-2 space-x-reverse mb-3">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <h4 className="font-semibold text-amber-800">التوصيات</h4>
          </div>
          <ul className="space-y-2">
            {result.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start space-x-2 space-x-reverse text-amber-900">
                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-sm">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};