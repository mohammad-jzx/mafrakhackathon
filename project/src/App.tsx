import React, { useState } from 'react';
import { Leaf } from 'lucide-react';
import InputForm from './components/InputForm';
import ResultsSection from './components/ResultsSection';
import { EnvironmentalInputs, CropRecommendation } from './types/crop';
import { advancedRecommendCrops } from './utils/advancedCropEngine';
import comprehensiveCropsData from './data/comprehensive_crop_database.json';

function App() {
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
    
    // محاكاة وقت المعالجة للذكاء الاصطناعي
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const results = advancedRecommendCrops(comprehensiveCropsData, inputs);
    setRecommendations(results);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center space-x-3 space-x-reverse">
            <Leaf className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              نظام التوصية الذكي للمحاصيل الزراعية المتقدم
            </h1>
          </div>
          <p className="text-center text-gray-600 mt-2">
            Advanced AI-Based Multi-Criteria Crop Recommendation System (AI-CSE 2.0)
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <InputForm
          inputs={inputs}
          onInputChange={setInputs}
          onAnalyze={handleAnalyze}
        />

        {/* Loading State */}
        {isAnalyzing && (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-2 space-x-reverse">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="text-lg font-medium text-gray-700">
                جاري تحليل البيانات باستخدام الخوارزمية المتقدمة...
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              تحليل العوامل البيئية والاقتصادية والزراعية والاستدامة
            </p>
          </div>
        )}

        {/* Results */}
        {!isAnalyzing && recommendations.length > 0 && (
          <ResultsSection recommendations={recommendations} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300">
            نظام التوصية الذكي للمحاصيل الزراعية المتقدم - مدعوم بالذكاء الاصطناعي
          </p>
          <p className="text-gray-400 text-sm mt-2">
            AI-CSE 2.0: Advanced Multi-Criteria Decision Support System
          </p>
          <p className="text-gray-500 text-xs mt-1">
            يشمل تحليل العوامل البيئية والاقتصادية والزراعية والاستدامة
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;