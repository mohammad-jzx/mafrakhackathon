import React from 'react';
import { Thermometer, Droplets, TestTube, Calendar, Sprout } from 'lucide-react';
import { EnvironmentalInputs } from '../types/crop';
import { SOIL_TYPES, ARABIC_MONTHS } from '../utils/cropRecommendationEngine';

interface InputFormProps {
  inputs: EnvironmentalInputs;
  onInputChange: (inputs: EnvironmentalInputs) => void;
  onAnalyze: () => void;
}

export default function InputForm({ inputs, onInputChange, onAnalyze }: InputFormProps) {
  const handleInputChange = (field: keyof EnvironmentalInputs, value: string | number) => {
    onInputChange({
      ...inputs,
      [field]: value
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🌱 نظام التوصية الذكي للمحاصيل الزراعية
        </h2>
        <p className="text-gray-600">AI-Based Multi-Criteria Crop Recommendation System (AI-CSE)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* درجة الحموضة */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <TestTube className="w-4 h-4 ml-2 text-blue-500" />
            درجة الحموضة (pH)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="14"
            value={inputs.ph}
            onChange={(e) => handleInputChange('ph', parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="مثال: 6.5"
          />
          <p className="text-xs text-gray-500">القيم من 0 إلى 14</p>
        </div>

        {/* درجة الحرارة */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Thermometer className="w-4 h-4 ml-2 text-red-500" />
            متوسط درجة الحرارة (°م)
          </label>
          <input
            type="number"
            step="0.1"
            value={inputs.temperature}
            onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="مثال: 25"
          />
          <p className="text-xs text-gray-500">درجة مئوية</p>
        </div>

        {/* معدل الأمطار */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Droplets className="w-4 h-4 ml-2 text-blue-400" />
            معدل الأمطار السنوي (مم)
          </label>
          <input
            type="number"
            step="1"
            min="0"
            value={inputs.rainfall}
            onChange={(e) => handleInputChange('rainfall', parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="مثال: 500"
          />
          <p className="text-xs text-gray-500">ملليمتر سنوياً</p>
        </div>

        {/* نوع التربة */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Sprout className="w-4 h-4 ml-2 text-amber-600" />
            نوع التربة
          </label>
          <select
            value={inputs.soilType}
            onChange={(e) => handleInputChange('soilType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          >
            <option value="">اختر نوع التربة</option>
            {SOIL_TYPES.map((soil) => (
              <option key={soil} value={soil}>{soil}</option>
            ))}
          </select>
        </div>

        {/* الموسم الحالي */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 ml-2 text-purple-500" />
            الشهر الحالي
          </label>
          <select
            value={inputs.currentSeason}
            onChange={(e) => handleInputChange('currentSeason', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          >
            <option value="">اختر الشهر</option>
            {ARABIC_MONTHS.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        {/* المحصول السابق */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Sprout className="w-4 h-4 ml-2 text-green-600" />
            المحصول السابق (اختياري)
          </label>
          <input
            type="text"
            value={inputs.previousCrop || ''}
            onChange={(e) => handleInputChange('previousCrop', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="مثال: قمح"
          />
          <p className="text-xs text-gray-500">للتناوب الزراعي</p>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onAnalyze}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          🔍 تحليل وتوصية المحاصيل
        </button>
      </div>
    </div>
  );
}