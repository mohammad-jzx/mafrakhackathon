import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import type { SensorData } from '../types';

interface ManualInputProps {
  onSubmit: (data: SensorData) => void;
  onClose: () => void;
}

export default function ManualInput({ onSubmit, onClose }: ManualInputProps) {
  const [formData, setFormData] = useState({
    temperature: 25,
    humidity: 65,
    soilMoisture: 70,
    ph: 6.5,
    nitrogen: 80,
    phosphorus: 50,
    potassium: 60,
    conductivity: 1.2
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sensorData: SensorData = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...formData
    };

    onSubmit(sensorData);
  };

  const handleChange = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">إدخال بيانات يدوي</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Environmental Conditions */}
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-4">🌡️ الظروف البيئية</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  درجة الحرارة (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={formData.temperature}
                  onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الرطوبة الجوية (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.humidity}
                  onChange={(e) => handleChange('humidity', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  رطوبة التربة (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.soilMoisture}
                  onChange={(e) => handleChange('soilMoisture', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  حموضة التربة (pH)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  value={formData.ph}
                  onChange={(e) => handleChange('ph', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Nutrients */}
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-4">🧪 العناصر الغذائية</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  النيتروجين (ppm)
                </label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={formData.nitrogen}
                  onChange={(e) => handleChange('nitrogen', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الفسفور (ppm)
                </label>
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={formData.phosphorus}
                  onChange={(e) => handleChange('phosphorus', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  البوتاسيوم (ppm)
                </label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={formData.potassium}
                  onChange={(e) => handleChange('potassium', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الموصلية الكهربائية (mS/cm)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="5"
                  value={formData.conductivity}
                  onChange={(e) => handleChange('conductivity', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 dark:bg-green-600 text-white dark:text-white py-3 px-4 rounded-lg hover:bg-green-700 dark:hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-lg"
            >
              <Save className="w-5 h-5" />
              حفظ البيانات
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}