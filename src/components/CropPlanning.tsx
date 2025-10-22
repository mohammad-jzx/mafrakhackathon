import { useState } from 'react';
import { Thermometer, Droplets, TestTube, Calendar, Sprout, TrendingUp, Award, AlertTriangle, ChevronDown, ChevronUp, Clock, Repeat } from 'lucide-react';
import { advancedRecommendCrops } from '../../project/src/utils/advancedCropEngine';
import comprehensiveCropsData from '../../project/src/data/comprehensive_crop_database.json';
import { EnvironmentalInputs, CropRecommendation, Crop } from '../../project/src/types/crop';

const SOIL_TYPES = ['طينية', 'رملية', 'طميية', 'صخرية', 'عضوية'];
const ARABIC_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

interface InputFormProps {
  inputs: EnvironmentalInputs;
  onInputChange: (inputs: EnvironmentalInputs) => void;
  onAnalyze: () => void;
}

function InputForm({ inputs, onInputChange, onAnalyze }: InputFormProps) {
  const handleInputChange = (field: keyof EnvironmentalInputs, value: string | number) => {
    onInputChange({
      ...inputs,
      [field]: value
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          🌱 نظام التوصية الذكي للمحاصيل الزراعية
        </h2>
        <p className="text-gray-600 dark:text-gray-400">AI-Based Multi-Criteria Crop Recommendation System (AI-CSE 2.0)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
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
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="مثال: 6.5"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">القيم من 0 إلى 14</p>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
            <Thermometer className="w-4 h-4 ml-2 text-red-500" />
            متوسط درجة الحرارة (°م)
          </label>
          <input
            type="number"
            step="0.1"
            value={inputs.temperature}
            onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="مثال: 25"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">درجة مئوية</p>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
            <Droplets className="w-4 h-4 ml-2 text-blue-400" />
            معدل الأمطار السنوي (مم)
          </label>
          <input
            type="number"
            step="1"
            min="0"
            value={inputs.rainfall}
            onChange={(e) => handleInputChange('rainfall', parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="مثال: 500"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">ملليمتر سنوياً</p>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
            <Sprout className="w-4 h-4 ml-2 text-amber-600" />
            نوع التربة
          </label>
          <select
            value={inputs.soilType}
            onChange={(e) => handleInputChange('soilType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">اختر نوع التربة</option>
            {SOIL_TYPES.map((soil) => (
              <option key={soil} value={soil}>{soil}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
            <Calendar className="w-4 h-4 ml-2 text-purple-500" />
            الشهر الحالي
          </label>
          <select
            value={inputs.currentSeason}
            onChange={(e) => handleInputChange('currentSeason', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">اختر الشهر</option>
            {ARABIC_MONTHS.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
            <Sprout className="w-4 h-4 ml-2 text-green-600" />
            المحصول السابق (اختياري)
          </label>
          <input
            type="text"
            value={inputs.previousCrop || ''}
            onChange={(e) => handleInputChange('previousCrop', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="مثال: قمح"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">للتناوب الزراعي</p>
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

interface RecommendationCardProps {
  recommendation: CropRecommendation;
  rank: number;
}

function RecommendationCard({ recommendation, rank }: RecommendationCardProps) {
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="text-3xl">{recommendation.icon}</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{recommendation.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{recommendation.name_en}</p>
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
              {recommendation.suitabilityScore.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">نقاط الملاءمة</div>
          </div>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{
              width: `${recommendation.suitabilityScore}%`,
              backgroundColor: recommendation.suitabilityColor
            }}
          ></div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          {recommendation.duration_days && (
            <div className="flex items-center space-x-2 space-x-reverse text-gray-600 dark:text-gray-300">
              <Clock className="w-4 h-4" />
              <span>{recommendation.duration_days} يوم</span>
            </div>
          )}
          {recommendation.crop_rotation && recommendation.crop_rotation.length > 0 && (
            <div className="flex items-center space-x-2 space-x-reverse text-gray-600 dark:text-gray-300">
              <Repeat className="w-4 h-4" />
              <span>تناوب متاح</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-center space-x-2 space-x-reverse py-2 px-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {showDetails ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
          </span>
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {showDetails && (
        <div className="border-t border-gray-100 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900">
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">تفصيل النقاط حسب المعايير:</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">درجة الحموضة (30%)</span>
              <span className="font-semibold text-gray-800 dark:text-gray-100">{recommendation.scoreBreakdown.ph.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">درجة الحرارة (20%)</span>
              <span className="font-semibold text-gray-800 dark:text-gray-100">{recommendation.scoreBreakdown.temperature.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">معدل الأمطار (20%)</span>
              <span className="font-semibold text-gray-800 dark:text-gray-100">{recommendation.scoreBreakdown.rainfall.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">نوع التربة (10%)</span>
              <span className="font-semibold text-gray-800 dark:text-gray-100">{recommendation.scoreBreakdown.soilType.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">موسم الزراعة (10%)</span>
              <span className="font-semibold text-gray-800 dark:text-gray-100">{recommendation.scoreBreakdown.season.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">التناوب الزراعي (10%)</span>
              <span className="font-semibold text-gray-800 dark:text-gray-100">{recommendation.scoreBreakdown.rotation.toFixed(1)}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h5 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">النطاقات المثالية:</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {recommendation.ph_min > 0 && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">pH: </span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">{recommendation.ph_min} - {recommendation.ph_max}</span>
                </div>
              )}
              {recommendation.temp_min > 0 && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">الحرارة: </span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">{recommendation.temp_min}° - {recommendation.temp_max}°م</span>
                </div>
              )}
              {recommendation.rain_min > 0 && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">الأمطار: </span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">{recommendation.rain_min} - {recommendation.rain_max} مم</span>
                </div>
              )}
              {recommendation.growing_season && recommendation.growing_season.length > 0 && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">موسم الزراعة: </span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">{recommendation.growing_season.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ResultsSectionProps {
  recommendations: CropRecommendation[];
}

function ResultsSection({ recommendations }: ResultsSectionProps) {
  if (recommendations.length === 0) {
    return null;
  }

  const excellentCrops = recommendations.filter(r => r.suitabilityLevel === 'excellent');
  const goodCrops = recommendations.filter(r => r.suitabilityLevel === 'good');
  const poorCrops = recommendations.filter(r => r.suitabilityLevel === 'poor');

  return (
    <div className="space-y-8">
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

      <div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
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

      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">📋 ملاحظات مهمة:</h4>
        <ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
          <li>• النقاط محسوبة باستخدام نظام أوزان ذكي متقدم: البيئة (40%), الاقتصاد (25%), الزراعة (20%), الاستدامة (15%)</li>
          <li>• المحاصيل ذات النقاط 85+ مثالية لظروفك الحالية</li>
          <li>• المحاصيل ذات النقاط 65-84 مناسبة مع بعض التحفظات</li>
          <li>• المحاصيل ذات النقاط أقل من 65 غير مناسبة للظروف الحالية</li>
          <li>• يُنصح بمراجعة خبير زراعي قبل اتخاذ القرار النهائي</li>
        </ul>
      </div>
    </div>
  );
}

export default function CropPlanning({ darkMode }: { darkMode?: boolean }) {
  const [inputs, setInputs] = useState<EnvironmentalInputs>({
    ph: 6.5,
    temperature: 25,
    rainfall: 500,
    soilType: '',
    currentSeason: '',
    previousCrop: ''
  });

  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!inputs.soilType || !inputs.currentSeason) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsAnalyzing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const results = advancedRecommendCrops(comprehensiveCropsData as unknown as Crop[], inputs);
    setRecommendations(results);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <InputForm
          inputs={inputs}
          onInputChange={setInputs}
          onAnalyze={handleAnalyze}
        />

        {isAnalyzing && (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-2 space-x-reverse">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="text-lg font-medium text-gray-700 dark:text-gray-200">
                جاري تحليل البيانات باستخدام الخوارزمية المتقدمة...
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              تحليل العوامل البيئية والاقتصادية والزراعية والاستدامة
            </p>
          </div>
        )}

        {!isAnalyzing && recommendations.length > 0 && (
          <ResultsSection recommendations={recommendations} />
        )}
      </div>
    </div>
  );
}

