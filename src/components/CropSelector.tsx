import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Plus, Save, X, ChevronDown, ChevronUp, Leaf, Sprout } from 'lucide-react';
import type { Crop, SensorData } from '../types';

// دالة مساعدة آمنة للتعامل مع toFixed
function safeToFixed(value: number | null | undefined, digits: number = 1): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "-";
  }
  return value.toFixed(digits);
}

interface CropSelectorProps {
  crops: Crop[];
  selectedCrop: Crop | null;
  onSelectCrop: (crop: Crop) => void;
  onAddCrop: (crop: Crop) => void;
  onDeleteCrop: (crop: Crop) => void;
  currentData: SensorData | null;
}

interface NewCropForm {
  nameAr: string;
  icon: string;
  tempMin: number;
  tempMax: number;
  humidityMin: number;
  humidityMax: number;
  soilMoistureMin: number;
  soilMoistureMax: number;
  phMin: number;
  phMax: number;
  nitrogenMin: number;
  nitrogenMax: number;
  phosphorusMin: number;
  phosphorusMax: number;
  potassiumMin: number;
  potassiumMax: number;
}

export default function CropSelector({ crops, selectedCrop, onSelectCrop, onAddCrop, onDeleteCrop, currentData }: CropSelectorProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAllCrops, setShowAllCrops] = useState(false);
  const [newCrop, setNewCrop] = useState<NewCropForm>({
    nameAr: '',
    icon: '🌱',
    tempMin: 20,
    tempMax: 30,
    humidityMin: 60,
    humidityMax: 80,
    soilMoistureMin: 60,
    soilMoistureMax: 80,
    phMin: 6.0,
    phMax: 7.0,
    nitrogenMin: 80,
    nitrogenMax: 120,
    phosphorusMin: 40,
    phosphorusMax: 60,
    potassiumMin: 40,
    potassiumMax: 60
  });

  const cropIcons = ['🌱', '🌾', '🌽', '🍅', '🥔', '🫒', '🍊', '🥕', '🥬', '🌶️', '🍆', '🥒', '🧄', '🧅', '🥦', '🌿'];

  const handleAddCrop = () => {
    if (!newCrop.nameAr.trim()) {
      alert('يرجى إدخال اسم المحصول');
      return;
    }

    const crop: Crop = {
      id: `custom_${Date.now()}`,
      name: newCrop.nameAr.toLowerCase().replace(/\s+/g, '_'),
      nameAr: newCrop.nameAr,
      icon: newCrop.icon,
      tempMin: newCrop.tempMin,
      tempMax: newCrop.tempMax,
      humidityMin: newCrop.humidityMin,
      humidityMax: newCrop.humidityMax,
      soilMoistureMin: newCrop.soilMoistureMin,
      soilMoistureMax: newCrop.soilMoistureMax,
      phMin: newCrop.phMin,
      phMax: newCrop.phMax,
      nitrogenMin: newCrop.nitrogenMin,
      nitrogenMax: newCrop.nitrogenMax,
      phosphorusMin: newCrop.phosphorusMin,
      phosphorusMax: newCrop.phosphorusMax,
      potassiumMin: newCrop.potassiumMin,
      potassiumMax: newCrop.potassiumMax
    };

    onAddCrop(crop);
    setShowAddForm(false);
    setNewCrop({
      nameAr: '',
      icon: '🌱',
      tempMin: 20,
      tempMax: 30,
      humidityMin: 60,
      humidityMax: 80,
      soilMoistureMin: 60,
      soilMoistureMax: 80,
      phMin: 6.0,
      phMax: 7.0,
      nitrogenMin: 80,
      nitrogenMax: 120,
      phosphorusMin: 40,
      phosphorusMax: 60,
      potassiumMin: 40,
      potassiumMax: 60
    });
  };

  const handleInputChange = (field: keyof NewCropForm, value: string | number) => {
    setNewCrop(prev => ({ ...prev, [field]: value }));
  };

  // إضافة محاصيل افتراضية إذا القائمة أقل من 16
  let allCrops = crops;
  if (crops.length < 16) {
    const extraCrops = [
      { id: 'corn', name: 'corn', nameAr: 'ذرة', icon: '🌽', tempMin: 18, tempMax: 35, humidityMin: 50, humidityMax: 80, soilMoistureMin: 60, soilMoistureMax: 80, phMin: 5.5, phMax: 7.5, nitrogenMin: 80, nitrogenMax: 120, phosphorusMin: 40, phosphorusMax: 60, potassiumMin: 40, potassiumMax: 60 },
      { id: 'cotton', name: 'cotton', nameAr: 'قطن', icon: '🪡', tempMin: 20, tempMax: 35, humidityMin: 40, humidityMax: 70, soilMoistureMin: 50, soilMoistureMax: 70, phMin: 5.5, phMax: 7.5, nitrogenMin: 80, nitrogenMax: 120, phosphorusMin: 40, phosphorusMax: 60, potassiumMin: 40, potassiumMax: 60 },
      { id: 'rice', name: 'rice', nameAr: 'أرز', icon: '🌾', tempMin: 20, tempMax: 35, humidityMin: 60, humidityMax: 90, soilMoistureMin: 70, soilMoistureMax: 90, phMin: 5.5, phMax: 7.5, nitrogenMin: 80, nitrogenMax: 120, phosphorusMin: 40, phosphorusMax: 60, potassiumMin: 40, potassiumMax: 60 },
      { id: 'barley', name: 'barley', nameAr: 'شعير', icon: '🌱', tempMin: 10, tempMax: 25, humidityMin: 40, humidityMax: 70, soilMoistureMin: 50, soilMoistureMax: 70, phMin: 6.0, phMax: 7.5, nitrogenMin: 80, nitrogenMax: 120, phosphorusMin: 40, phosphorusMax: 60, potassiumMin: 40, potassiumMax: 60 },
      { id: 'wheat', name: 'wheat', nameAr: 'قمح', icon: '🌾', tempMin: 10, tempMax: 25, humidityMin: 40, humidityMax: 70, soilMoistureMin: 50, soilMoistureMax: 70, phMin: 6.0, phMax: 7.5, nitrogenMin: 80, nitrogenMax: 120, phosphorusMin: 40, phosphorusMax: 60, potassiumMin: 40, potassiumMax: 60 },
      { id: 'potato', name: 'potato', nameAr: 'بطاطا', icon: '🥔', tempMin: 15, tempMax: 25, humidityMin: 60, humidityMax: 80, soilMoistureMin: 60, soilMoistureMax: 80, phMin: 5.5, phMax: 7.0, nitrogenMin: 80, nitrogenMax: 120, phosphorusMin: 40, phosphorusMax: 60, potassiumMin: 40, potassiumMax: 60 },
      { id: 'tomato', name: 'tomato', nameAr: 'طماطم', icon: '🍅', tempMin: 18, tempMax: 30, humidityMin: 60, humidityMax: 80, soilMoistureMin: 60, soilMoistureMax: 80, phMin: 6.0, phMax: 7.0, nitrogenMin: 80, nitrogenMax: 120, phosphorusMin: 40, phosphorusMax: 60, potassiumMin: 40, potassiumMax: 60 },
      { id: 'cucumber', name: 'cucumber', nameAr: 'خيار', icon: '🥒', tempMin: 18, tempMax: 30, humidityMin: 60, humidityMax: 80, soilMoistureMin: 60, soilMoistureMax: 80, phMin: 6.0, phMax: 7.0, nitrogenMin: 80, nitrogenMax: 120, phosphorusMin: 40, phosphorusMax: 60, potassiumMin: 40, potassiumMax: 60 },
      { id: 'eggplant', name: 'eggplant', nameAr: 'باذنجان', icon: '🍆', tempMin: 18, tempMax: 30, humidityMin: 60, humidityMax: 80, soilMoistureMin: 60, soilMoistureMax: 80, phMin: 6.0, phMax: 7.0, nitrogenMin: 80, nitrogenMax: 120, phosphorusMin: 40, phosphorusMax: 60, potassiumMin: 40, potassiumMax: 60 },
      { id: 'pepper', name: 'pepper', nameAr: 'فلفل', icon: '🌶️', tempMin: 18, tempMax: 30, humidityMin: 60, humidityMax: 80, soilMoistureMin: 60, soilMoistureMax: 80, phMin: 6.0, phMax: 7.0, nitrogenMin: 80, nitrogenMax: 120, phosphorusMin: 40, phosphorusMax: 60, potassiumMin: 40, potassiumMax: 60 },
      { id: 'carrot', name: 'carrot', nameAr: 'جزر', icon: '🥕', tempMin: 16, tempMax: 24, humidityMin: 60, humidityMax: 80, soilMoistureMin: 60, soilMoistureMax: 80, phMin: 6.0, phMax: 7.0, nitrogenMin: 80, nitrogenMax: 120, phosphorusMin: 40, phosphorusMax: 60, potassiumMin: 40, potassiumMax: 60 },
      { id: 'onion', name: 'onion', nameAr: 'بصل', icon: '🧅', tempMin: 13, tempMax: 25, humidityMin: 60, humidityMax: 80, soilMoistureMin: 60, soilMoistureMax: 80, phMin: 6.0, phMax: 7.0, nitrogenMin: 80, nitrogenMax: 120, phosphorusMin: 40, phosphorusMax: 60, potassiumMin: 40, potassiumMax: 60 },
      { id: 'garlic', name: 'garlic', nameAr: 'ثوم', icon: '🧄', tempMin: 13, tempMax: 25, humidityMin: 60, humidityMax: 80, soilMoistureMin: 60, soilMoistureMax: 80, phMin: 6.0, phMax: 7.0, nitrogenMin: 80, nitrogenMax: 120, phosphorusMin: 40, phosphorusMax: 60, potassiumMin: 40, potassiumMax: 60 },
      { id: 'lettuce', name: 'lettuce', nameAr: 'خس', icon: '🥬', tempMin: 10, tempMax: 20, humidityMin: 60, humidityMax: 80, soilMoistureMin: 60, soilMoistureMax: 80, phMin: 6.0, phMax: 7.0, nitrogenMin: 80, nitrogenMax: 120, phosphorusMin: 40, phosphorusMax: 60, potassiumMin: 40, potassiumMax: 60 },
      { id: 'olive', name: 'olive', nameAr: 'زيتون', icon: '🫒', tempMin: 15, tempMax: 30, humidityMin: 40, humidityMax: 70, soilMoistureMin: 50, soilMoistureMax: 70, phMin: 6.0, phMax: 8.0, nitrogenMin: 80, nitrogenMax: 120, phosphorusMin: 40, phosphorusMax: 60, potassiumMin: 40, potassiumMax: 60 },
      { id: 'orange', name: 'orange', nameAr: 'برتقال', icon: '🍊', tempMin: 15, tempMax: 30, humidityMin: 50, humidityMax: 80, soilMoistureMin: 60, soilMoistureMax: 80, phMin: 6.0, phMax: 7.5, nitrogenMin: 80, nitrogenMax: 120, phosphorusMin: 40, phosphorusMax: 60, potassiumMin: 40, potassiumMax: 60 },
      { id: 'mint', name: 'mint', nameAr: 'نعناع', icon: '🌿', tempMin: 15, tempMax: 30, humidityMin: 60, humidityMax: 90, soilMoistureMin: 70, soilMoistureMax: 90, phMin: 6.0, phMax: 7.5, nitrogenMin: 80, nitrogenMax: 120, phosphorusMin: 40, phosphorusMax: 60, potassiumMin: 40, potassiumMax: 60 },
    ];
    allCrops = [
      ...crops,
      ...extraCrops.slice(0, 16 - crops.length)
    ];
  }

  // حالة فتح/إغلاق القائمة
  const [showAll, setShowAll] = useState(false);
  const visibleCrops = showAll ? allCrops : allCrops.slice(0, 8);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white flex-1 text-center flex flex-row-reverse items-center justify-center gap-2">
          <span>🧺</span>
          <span>اختيار نوع المحصول</span>
        </h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors shadow-lg font-semibold"
          style={{ backgroundColor: '#22c55e', background: '#22c55e !important' }}
        >
          <Plus className="w-4 h-4" />
          إضافة محصول جديد
        </button>
      </div>
      
      <p className="text-gray-600 dark:text-white mb-6">اختر نوع المحصول للحصول على توصيات مخصصة:</p>
      
      <div className="flex justify-center items-center mb-4 flex-col">
        <Sprout className="w-8 h-8 text-green-500 mb-2" />
        <div className="relative w-32 h-2 overflow-hidden rounded-full">
          <div className="absolute inset-0 animate-glow-bar bg-gradient-to-r from-green-500 via-green-300/60 to-green-500 shadow-lg shadow-green-400/30" />
        </div>
      </div>
      
      {/* شبكة المحاصيل */}
      <div
        className="relative transition-all duration-700 ease-in-out overflow-hidden"
        style={{
          maxHeight: showAll ? '2000px' : '400px',
          opacity: showAll ? 1 : 0.9,
          transform: showAll ? 'scale(1)' : 'scale(0.98)',
        }}
        id="crop-grid-top"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-visible">
          {visibleCrops.map((crop, idx) => (
            <div 
              key={crop.id} 
              className="relative mb-6 transition-all duration-500 ease-out"
              style={{
                opacity: showAll ? 1 : (idx < 8 ? 1 : 0),
                transform: showAll ? 'translateY(0)' : (idx < 8 ? 'translateY(0)' : 'translateY(20px)'),
                transitionDelay: showAll ? `${idx * 50}ms` : '0ms'
              }}
            >
              <button
                onClick={() => onSelectCrop(crop)}
                className={`w-full min-h-[110px] p-6 box-border rounded-2xl border-2 transition-all duration-300 bg-white dark:bg-gray-800 overflow-hidden relative focus:outline-none focus:ring-2 focus:ring-green-300 flex flex-col items-center justify-center z-10 hover:scale-105
                  ${selectedCrop?.id === crop.id
                    ? 'border-4 border-green-500 shadow-green-100 ring-2 ring-green-200 z-20'
                    : 'border-green-300 dark:border-transparent hover:border-green-500 hover:shadow-lg'}
                `}
                style={{
                  boxShadow: selectedCrop?.id === crop.id
                    ? '0 4px 16px 0 rgba(34,197,94,0.10)'
                    : '0 2px 8px 0 rgba(34,197,94,0.06)',
                  marginBottom: (idx >= visibleCrops.length - 4) ? '24px' : undefined,
                  transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
                }}
              >
                <div className="text-5xl mb-2 select-none transition-transform duration-300 hover:scale-110">{crop.icon}</div>
                <div className="font-semibold text-gray-800 dark:text-white text-center mb-4">{crop.nameAr}</div>
                {crop.id.startsWith('custom_') && (
                  <div className="text-xs text-green-600 mt-1">مخصص</div>
                )}
              </button>
              {/* زر حذف المحصول */}
              <button
                onClick={() => onDeleteCrop(crop)}
                className="absolute top-2 left-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1 transition-all duration-300 z-20 border-2 border-white shadow hover:scale-110"
                title="حذف المحصول"
                style={{boxShadow: '0 1px 4px 0 rgba(0,0,0,0.07)'}}>
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* زر فتح/إغلاق القائمة - الآن في الأسفل */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => {
            setShowAll((prev) => {
              if (prev) {
                // إذا كان يغلق القائمة، اعمل scroll للأعلى
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
              return !prev;
            });
          }}
          className={`rounded-xl px-6 py-3 transition-all duration-500 ease-in-out flex items-center gap-2 font-medium hover:scale-105 active:scale-95 ${
            showAll 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          <span className="transition-transform duration-300" style={{ transform: showAll ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            {showAll ? '▲' : '▼'}
          </span>
          {showAll ? 'إخفاء بعض المحاصيل' : 'عرض كل المحاصيل'}
        </button>
      </div>

      {/* Add Crop Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">إضافة محصول جديد</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">📝 المعلومات الأساسية</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      اسم المحصول
                    </label>
                    <input
                      type="text"
                      value={newCrop.nameAr}
                      onChange={(e) => handleInputChange('nameAr', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="مثال: الخيار"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      اختر الرمز
                    </label>
                    <div className="grid grid-cols-8 gap-2">
                      {cropIcons.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => handleInputChange('icon', icon)}
                          className={`p-2 text-2xl rounded-lg border-2 transition-colors ${
                            newCrop.icon === icon
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Environmental Conditions */}
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">🌡️ الظروف البيئية المثلى</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      درجة الحرارة الدنيا (°C)
                    </label>
                    <input
                      type="number"
                      value={newCrop.tempMin}
                      onChange={(e) => handleInputChange('tempMin', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      min="0"
                      max="50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      درجة الحرارة العليا (°C)
                    </label>
                    <input
                      type="number"
                      value={newCrop.tempMax}
                      onChange={(e) => handleInputChange('tempMax', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      min="0"
                      max="50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      الرطوبة الجوية الدنيا (%)
                    </label>
                    <input
                      type="number"
                      value={newCrop.humidityMin}
                      onChange={(e) => handleInputChange('humidityMin', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      الرطوبة الجوية العليا (%)
                    </label>
                    <input
                      type="number"
                      value={newCrop.humidityMax}
                      onChange={(e) => handleInputChange('humidityMax', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      رطوبة التربة الدنيا (%)
                    </label>
                    <input
                      type="number"
                      value={newCrop.soilMoistureMin}
                      onChange={(e) => handleInputChange('soilMoistureMin', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      رطوبة التربة العليا (%)
                    </label>
                    <input
                      type="number"
                      value={newCrop.soilMoistureMax}
                      onChange={(e) => handleInputChange('soilMoistureMax', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      حموضة التربة الدنيا (pH)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newCrop.phMin}
                      onChange={(e) => handleInputChange('phMin', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      min="0"
                      max="14"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      حموضة التربة العليا (pH)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newCrop.phMax}
                      onChange={(e) => handleInputChange('phMax', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      min="0"
                      max="14"
                    />
                  </div>
                </div>
              </div>

              {/* Nutrient Requirements */}
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">🧪 العناصر الغذائية المطلوبة</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      النيتروجين الأدنى (ppm)
                    </label>
                    <input
                      type="number"
                      value={newCrop.nitrogenMin}
                      onChange={(e) => handleInputChange('nitrogenMin', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      min="0"
                      max="300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      النيتروجين الأعلى (ppm)
                    </label>
                    <input
                      type="number"
                      value={newCrop.nitrogenMax}
                      onChange={(e) => handleInputChange('nitrogenMax', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      min="0"
                      max="300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      الفسفور الأدنى (ppm)
                    </label>
                    <input
                      type="number"
                      value={newCrop.phosphorusMin}
                      onChange={(e) => handleInputChange('phosphorusMin', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      min="0"
                      max="200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      الفسفور الأعلى (ppm)
                    </label>
                    <input
                      type="number"
                      value={newCrop.phosphorusMax}
                      onChange={(e) => handleInputChange('phosphorusMax', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      min="0"
                      max="200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      البوتاسيوم الأدنى (ppm)
                    </label>
                    <input
                      type="number"
                      value={newCrop.potassiumMin}
                      onChange={(e) => handleInputChange('potassiumMin', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      min="0"
                      max="300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      البوتاسيوم الأعلى (ppm)
                    </label>
                    <input
                      type="number"
                      value={newCrop.potassiumMax}
                      onChange={(e) => handleInputChange('potassiumMax', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      min="0"
                      max="300"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddCrop}
                  className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Save className="w-5 h-5" />
                  حفظ المحصول
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Crop Details */}
      {selectedCrop && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 border border-green-200 dark:border-slate-700 mt-24">
          <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-center gap-2 text-center">
            <span className="text-2xl">{selectedCrop.icon}</span>
            تفاصيل المحصول: {selectedCrop.nameAr}
            {selectedCrop.id.startsWith('custom_') && (
              <span className="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">مخصص</span>
            )}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Environmental Conditions */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center shadow-sm">
              <h5 className="font-semibold text-gray-800 dark:text-white mb-3">🌡️ الظروف البيئية المثلى</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">درجة الحرارة:</span>
                  <span className="font-medium dark:text-white">{selectedCrop.tempMin} - {selectedCrop.tempMax} °C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">الرطوبة الجوية:</span>
                  <span className="font-medium dark:text-white">{selectedCrop.humidityMin} - {selectedCrop.humidityMax} %</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">رطوبة التربة:</span>
                  <span className="font-medium dark:text-white">{selectedCrop.soilMoistureMin} - {selectedCrop.soilMoistureMax} %</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">حموضة التربة:</span>
                  <span className="font-medium dark:text-white">{selectedCrop.phMin} - {selectedCrop.phMax} pH</span>
                </div>
              </div>
            </div>

            {/* Nutrient Requirements */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center shadow-sm">
              <h5 className="font-semibold text-gray-800 dark:text-white mb-3">🧪 العناصر الغذائية المطلوبة</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">النيتروجين (N):</span>
                  <span className="font-medium dark:text-white">{selectedCrop.nitrogenMin} - {selectedCrop.nitrogenMax} ppm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">الفسفور (P):</span>
                  <span className="font-medium dark:text-white">{selectedCrop.phosphorusMin} - {selectedCrop.phosphorusMax} ppm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">البوتاسيوم (K):</span>
                  <span className="font-medium dark:text-white">{selectedCrop.potassiumMin} - {selectedCrop.potassiumMax} ppm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Chart - تصميم عصري وجذاب */}
          {currentData && selectedCrop && (
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg transform transition-all duration-500 hover:shadow-xl">
              <h5 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex flex-col items-center justify-center gap-2 text-center">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 text-white p-3 rounded-xl shadow-md mb-2">
                  <span className="text-2xl">📊</span>
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                  مقارنة القيم الحالية بالنطاقات المثلى
                </span>
                <span className="text-base font-medium text-gray-600 dark:text-gray-300">
                  {selectedCrop.nameAr} {selectedCrop.icon}
                </span>
              </h5>

              {/* مفتاح الألوان - Color Legend - تصميم عصري */}
              <div className="flex flex-wrap justify-center mb-8 gap-4 text-sm bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
                <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-2 rounded-lg">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-green-500 shadow-sm shadow-green-200 dark:shadow-green-900/30"></div>
                  <span className="text-green-700 dark:text-green-300 font-medium">قيمة مثالية</span>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-2 rounded-lg">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-sm shadow-yellow-200 dark:shadow-yellow-900/30"></div>
                  <span className="text-yellow-700 dark:text-yellow-300 font-medium">قيمة مقبولة</span>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 p-2 rounded-lg">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-rose-400 to-rose-500 shadow-sm shadow-rose-200 dark:shadow-rose-900/30"></div>
                  <span className="text-rose-700 dark:text-rose-300 font-medium">قيمة تحتاج معالجة</span>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-2 rounded-lg">
                  <div className="w-10 h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 opacity-60 shadow-sm shadow-blue-200 dark:shadow-blue-900/30"></div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">النطاق المثالي</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* الظروف البيئية - تصميم عصري مطابق */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-md">
                  <h6 className="text-lg font-bold mb-5 flex items-center justify-center gap-2 text-center">
                    <span className="bg-gradient-to-r from-sky-500 to-blue-500 text-white p-2 rounded-lg shadow-sm">🌡️</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-400 dark:to-blue-400">
                      الظروف البيئية
                    </span>
                  </h6>

                  {/* درجة الحرارة */}
                  <div className="mb-8 bg-gray-50 dark:bg-slate-700/30 p-4 rounded-lg hover:shadow-md transition-all">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">درجة الحرارة</span>
                      <div className="flex gap-1">
                        <span className={`font-bold px-3 py-1 rounded-full text-white ${
                          currentData.temperature >= selectedCrop.tempMin && currentData.temperature <= selectedCrop.tempMax 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : currentData.temperature < selectedCrop.tempMin * 0.7 || currentData.temperature > selectedCrop.tempMax * 1.3
                              ? 'bg-gradient-to-r from-rose-500 to-red-500'
                              : 'bg-gradient-to-r from-yellow-500 to-amber-500'
                        }`}>{safeToFixed(currentData.temperature)} °C</span>
                      </div>
                    </div>
                    <div className="relative h-10 bg-gray-200 dark:bg-slate-700 rounded-lg overflow-hidden shadow-inner">
                      {/* النطاق المثالي */}
                      <div className="absolute top-0 h-full flex items-center" 
                        style={{
                          left: `${Math.max(0, Math.min(100, (selectedCrop.tempMin / 50) * 100))}%`,
                          width: `${Math.max(0, Math.min(100, ((selectedCrop.tempMax - selectedCrop.tempMin) / 50) * 100))}%`,
                        }}>
                        <div className="h-full w-full bg-gradient-to-r from-blue-400 to-blue-500 opacity-40"></div>
                      </div>
                      
                      {/* القيمة الحالية */}
                      <div 
                        className={`absolute top-0 h-full flex items-center justify-center text-white font-bold rounded-lg px-3
                          ${currentData.temperature >= selectedCrop.tempMin && currentData.temperature <= selectedCrop.tempMax 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : currentData.temperature < selectedCrop.tempMin * 0.7 || currentData.temperature > selectedCrop.tempMax * 1.3
                              ? 'bg-gradient-to-r from-rose-500 to-red-500'
                              : 'bg-gradient-to-r from-yellow-500 to-amber-500'
                          }`}
                        style={{
                          width: '45px',
                          left: `${Math.min(100, Math.max(0, (currentData.temperature / 50) * 100))}%`,
                          transform: 'translateX(-50%)',
                          transition: 'left 0.5s ease-out'
                        }}
                      >
                        {safeToFixed(currentData.temperature)}
                      </div>
                      
                      {/* توضيح المدى المثالي */}
                      <div className="absolute bottom-0 right-0 p-1 text-xs font-medium bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-gray-300 rounded-tl-md">
                        المدى المثالي: {selectedCrop.tempMin}-{selectedCrop.tempMax} °C
                      </div>
                    </div>
                  </div>

                  {/* الرطوبة الجوية */}
                  <div className="mb-8 bg-gray-50 dark:bg-slate-700/30 p-4 rounded-lg hover:shadow-md transition-all">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">الرطوبة الجوية</span>
                      <div className="flex gap-1">
                        <span className={`font-bold px-3 py-1 rounded-full text-white ${
                          currentData.humidity >= selectedCrop.humidityMin && currentData.humidity <= selectedCrop.humidityMax 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : currentData.humidity < selectedCrop.humidityMin * 0.7 || currentData.humidity > selectedCrop.humidityMax * 1.3
                              ? 'bg-gradient-to-r from-rose-500 to-red-500'
                              : 'bg-gradient-to-r from-yellow-500 to-amber-500'
                        }`}>{safeToFixed(currentData.humidity)} %</span>
                      </div>
                    </div>
                    <div className="relative h-10 bg-gray-200 dark:bg-slate-700 rounded-lg overflow-hidden shadow-inner">
                      {/* النطاق المثالي */}
                      <div className="absolute top-0 h-full flex items-center" 
                        style={{
                          left: `${Math.max(0, Math.min(100, (selectedCrop.humidityMin / 100) * 100))}%`,
                          width: `${Math.max(0, Math.min(100, ((selectedCrop.humidityMax - selectedCrop.humidityMin) / 100) * 100))}%`,
                        }}>
                        <div className="h-full w-full bg-gradient-to-r from-blue-400 to-blue-500 opacity-40"></div>
                      </div>
                      
                      {/* القيمة الحالية */}
                      <div 
                        className={`absolute top-0 h-full flex items-center justify-center text-white font-bold rounded-lg px-3
                          ${currentData.humidity >= selectedCrop.humidityMin && currentData.humidity <= selectedCrop.humidityMax 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : currentData.humidity < selectedCrop.humidityMin * 0.7 || currentData.humidity > selectedCrop.humidityMax * 1.3
                              ? 'bg-gradient-to-r from-rose-500 to-red-500'
                              : 'bg-gradient-to-r from-yellow-500 to-amber-500'
                          }`}
                        style={{
                          width: '45px',
                          left: `${Math.min(100, Math.max(0, (currentData.humidity / 100) * 100))}%`,
                          transform: 'translateX(-50%)',
                          transition: 'left 0.5s ease-out'
                        }}
                      >
                        {safeToFixed(currentData.humidity)}
                      </div>
                      
                      {/* توضيح المدى المثالي */}
                      <div className="absolute bottom-0 right-0 p-1 text-xs font-medium bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-gray-300 rounded-tl-md">
                        المدى المثالي: {selectedCrop.humidityMin}-{selectedCrop.humidityMax} %
                      </div>
                    </div>
                  </div>

                  {/* رطوبة التربة */}
                  <div className="mb-0 bg-gray-50 dark:bg-slate-700/30 p-4 rounded-lg hover:shadow-md transition-all">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">رطوبة التربة</span>
                      <div className="flex gap-1">
                        <span className={`font-bold px-3 py-1 rounded-full text-white ${
                          currentData.soilMoisture >= selectedCrop.soilMoistureMin && currentData.soilMoisture <= selectedCrop.soilMoistureMax 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : currentData.soilMoisture < selectedCrop.soilMoistureMin * 0.7 || currentData.soilMoisture > selectedCrop.soilMoistureMax * 1.3
                              ? 'bg-gradient-to-r from-rose-500 to-red-500'
                              : 'bg-gradient-to-r from-yellow-500 to-amber-500'
                        }`}>{safeToFixed(currentData.soilMoisture)} %</span>
                      </div>
                    </div>
                    <div className="relative h-10 bg-gray-200 dark:bg-slate-700 rounded-lg overflow-hidden shadow-inner">
                      {/* النطاق المثالي */}
                      <div className="absolute top-0 h-full flex items-center" 
                        style={{
                          left: `${Math.max(0, Math.min(100, (selectedCrop.soilMoistureMin / 100) * 100))}%`,
                          width: `${Math.max(0, Math.min(100, ((selectedCrop.soilMoistureMax - selectedCrop.soilMoistureMin) / 100) * 100))}%`,
                        }}>
                        <div className="h-full w-full bg-gradient-to-r from-blue-400 to-blue-500 opacity-40"></div>
                      </div>
                      
                      {/* القيمة الحالية */}
                      <div 
                        className={`absolute top-0 h-full flex items-center justify-center text-white font-bold rounded-lg px-3
                          ${currentData.soilMoisture >= selectedCrop.soilMoistureMin && currentData.soilMoisture <= selectedCrop.soilMoistureMax 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : currentData.soilMoisture < selectedCrop.soilMoistureMin * 0.7 || currentData.soilMoisture > selectedCrop.soilMoistureMax * 1.3
                              ? 'bg-gradient-to-r from-rose-500 to-red-500'
                              : 'bg-gradient-to-r from-yellow-500 to-amber-500'
                          }`}
                        style={{
                          width: '45px',
                          left: `${Math.min(100, Math.max(0, (currentData.soilMoisture / 100) * 100))}%`,
                          transform: 'translateX(-50%)',
                          transition: 'left 0.5s ease-out'
                        }}
                      >
                        {safeToFixed(currentData.soilMoisture)}
                      </div>
                      
                      {/* توضيح المدى المثالي */}
                      <div className="absolute bottom-0 right-0 p-1 text-xs font-medium bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-gray-300 rounded-tl-md">
                        المدى المثالي: {selectedCrop.soilMoistureMin}-{selectedCrop.soilMoistureMax} %
                      </div>
                    </div>
                  </div>
                </div>

                {/* العناصر الغذائية */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-md">
                  <h6 className="text-lg font-bold mb-5 flex items-center justify-center gap-2 text-center">
                    <span className="bg-gradient-to-r from-emerald-500 to-green-500 text-white p-2 rounded-lg shadow-sm">🧪</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400">
                      العناصر الغذائية
                    </span>
                  </h6>

                  {/* النيتروجين */}
                  <div className="mb-8 bg-gray-50 dark:bg-slate-700/30 p-4 rounded-lg hover:shadow-md transition-all">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">النيتروجين (N)</span>
                      <div className="flex gap-1">
                        <span className={`font-bold px-3 py-1 rounded-full text-white ${
                          currentData.nitrogen >= selectedCrop.nitrogenMin && currentData.nitrogen <= selectedCrop.nitrogenMax 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : currentData.nitrogen < selectedCrop.nitrogenMin * 0.7 || currentData.nitrogen > selectedCrop.nitrogenMax * 1.3
                              ? 'bg-gradient-to-r from-rose-500 to-red-500'
                              : 'bg-gradient-to-r from-yellow-500 to-amber-500'
                        }`}>ppm {safeToFixed(currentData.nitrogen)}</span>
                      </div>
                    </div>
                    <div className="relative h-10 bg-gray-200 dark:bg-slate-700 rounded-lg overflow-hidden shadow-inner">
                      {/* النطاق المثالي */}
                      <div className="absolute top-0 h-full flex items-center" 
                        style={{
                          left: `${Math.max(0, Math.min(100, (selectedCrop.nitrogenMin / 150) * 100))}%`,
                          width: `${Math.max(0, Math.min(100, ((selectedCrop.nitrogenMax - selectedCrop.nitrogenMin) / 150) * 100))}%`,
                        }}>
                        <div className="h-full w-full bg-gradient-to-r from-blue-400 to-blue-500 opacity-40"></div>
                      </div>
                      
                      {/* القيمة الحالية */}
                      <div 
                        className={`absolute top-0 h-full flex items-center justify-center text-white font-bold rounded-lg px-3
                          ${currentData.nitrogen >= selectedCrop.nitrogenMin && currentData.nitrogen <= selectedCrop.nitrogenMax 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : currentData.nitrogen < selectedCrop.nitrogenMin * 0.7 || currentData.nitrogen > selectedCrop.nitrogenMax * 1.3
                              ? 'bg-gradient-to-r from-rose-500 to-red-500'
                              : 'bg-gradient-to-r from-yellow-500 to-amber-500'
                          }`}
                        style={{
                          width: '45px',
                          left: `${Math.min(100, Math.max(0, (currentData.nitrogen / 150) * 100))}%`,
                          transform: 'translateX(-50%)',
                          transition: 'left 0.5s ease-out'
                        }}
                      >
                        {safeToFixed(currentData.nitrogen)}
                      </div>
                      
                      {/* توضيح المدى المثالي */}
                      <div className="absolute bottom-0 right-0 p-1 text-xs font-medium bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-gray-300 rounded-tl-md">
                        المدى المثالي: {selectedCrop.nitrogenMin}-{selectedCrop.nitrogenMax} ppm
                      </div>
                    </div>
                  </div>

                  {/* الفسفور */}
                  <div className="mb-8 bg-gray-50 dark:bg-slate-700/30 p-4 rounded-lg hover:shadow-md transition-all">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">الفوسفور (P)</span>
                      <div className="flex gap-1">
                        <span className={`font-bold px-3 py-1 rounded-full text-white ${
                          currentData.phosphorus >= selectedCrop.phosphorusMin && currentData.phosphorus <= selectedCrop.phosphorusMax 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : currentData.phosphorus < selectedCrop.phosphorusMin * 0.7 || currentData.phosphorus > selectedCrop.phosphorusMax * 1.3
                              ? 'bg-gradient-to-r from-rose-500 to-red-500'
                              : 'bg-gradient-to-r from-yellow-500 to-amber-500'
                        }`}>ppm {safeToFixed(currentData.phosphorus)}</span>
                      </div>
                    </div>
                    <div className="relative h-10 bg-gray-200 dark:bg-slate-700 rounded-lg overflow-hidden shadow-inner">
                      {/* النطاق المثالي */}
                      <div className="absolute top-0 h-full flex items-center" 
                        style={{
                          left: `${Math.max(0, Math.min(100, (selectedCrop.phosphorusMin / 100) * 100))}%`,
                          width: `${Math.max(0, Math.min(100, ((selectedCrop.phosphorusMax - selectedCrop.phosphorusMin) / 100) * 100))}%`,
                        }}>
                        <div className="h-full w-full bg-gradient-to-r from-blue-400 to-blue-500 opacity-40"></div>
                      </div>
                      
                      {/* القيمة الحالية */}
                      <div 
                        className={`absolute top-0 h-full flex items-center justify-center text-white font-bold rounded-lg px-3
                          ${currentData.phosphorus >= selectedCrop.phosphorusMin && currentData.phosphorus <= selectedCrop.phosphorusMax 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : currentData.phosphorus < selectedCrop.phosphorusMin * 0.7 || currentData.phosphorus > selectedCrop.phosphorusMax * 1.3
                              ? 'bg-gradient-to-r from-rose-500 to-red-500'
                              : 'bg-gradient-to-r from-yellow-500 to-amber-500'
                          }`}
                        style={{
                          width: '45px',
                          left: `${Math.min(100, Math.max(0, (currentData.phosphorus / 100) * 100))}%`,
                          transform: 'translateX(-50%)',
                          transition: 'left 0.5s ease-out'
                        }}
                      >
                        {safeToFixed(currentData.phosphorus)}
                      </div>
                      
                      {/* توضيح المدى المثالي */}
                      <div className="absolute bottom-0 right-0 p-1 text-xs font-medium bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-gray-300 rounded-tl-md">
                        المدى المثالي: {selectedCrop.phosphorusMin}-{selectedCrop.phosphorusMax} ppm
                      </div>
                    </div>
                  </div>

                  {/* البوتاسيوم */}
                  <div className="mb-0 bg-gray-50 dark:bg-slate-700/30 p-4 rounded-lg hover:shadow-md transition-all">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">البوتاسيوم (K)</span>
                      <div className="flex gap-1">
                        <span className={`font-bold px-3 py-1 rounded-full text-white ${
                          currentData.potassium >= selectedCrop.potassiumMin && currentData.potassium <= selectedCrop.potassiumMax 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : currentData.potassium < selectedCrop.potassiumMin * 0.7 || currentData.potassium > selectedCrop.potassiumMax * 1.3
                              ? 'bg-gradient-to-r from-rose-500 to-red-500'
                              : 'bg-gradient-to-r from-yellow-500 to-amber-500'
                        }`}>ppm {safeToFixed(currentData.potassium)}</span>
                      </div>
                    </div>
                    <div className="relative h-10 bg-gray-200 dark:bg-slate-700 rounded-lg overflow-hidden shadow-inner">
                      {/* النطاق المثالي */}
                      <div className="absolute top-0 h-full flex items-center" 
                        style={{
                          left: `${Math.max(0, Math.min(100, (selectedCrop.potassiumMin / 150) * 100))}%`,
                          width: `${Math.max(0, Math.min(100, ((selectedCrop.potassiumMax - selectedCrop.potassiumMin) / 150) * 100))}%`,
                        }}>
                        <div className="h-full w-full bg-gradient-to-r from-blue-400 to-blue-500 opacity-40"></div>
                      </div>
                      
                      {/* القيمة الحالية */}
                      <div 
                        className={`absolute top-0 h-full flex items-center justify-center text-white font-bold rounded-lg px-3
                          ${currentData.potassium >= selectedCrop.potassiumMin && currentData.potassium <= selectedCrop.potassiumMax 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : currentData.potassium < selectedCrop.potassiumMin * 0.7 || currentData.potassium > selectedCrop.potassiumMax * 1.3
                              ? 'bg-gradient-to-r from-rose-500 to-red-500'
                              : 'bg-gradient-to-r from-yellow-500 to-amber-500'
                          }`}
                        style={{
                          width: '45px',
                          left: `${Math.min(100, Math.max(0, (currentData.potassium / 150) * 100))}%`,
                          transform: 'translateX(-50%)',
                          transition: 'left 0.5s ease-out'
                        }}
                      >
                        {safeToFixed(currentData.potassium)}
                      </div>
                      
                      {/* توضيح المدى المثالي */}
                      <div className="absolute bottom-0 right-0 p-1 text-xs font-medium bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-gray-300 rounded-tl-md">
                        المدى المثالي: {selectedCrop.potassiumMin}-{selectedCrop.potassiumMax} ppm
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}