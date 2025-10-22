import React, { useState } from 'react';
import { Sprout, Camera, Brain, Leaf } from 'lucide-react';
import { CropSelector } from './components/CropSelector';
import { ImageUploader } from './components/ImageUploader';
import { PredictionResults } from './components/PredictionResults';
import { LoadingSpinner } from './components/LoadingSpinner';
import { predictHarvestDate } from './utils/cnnPredictor';
import { PredictionResult } from './types/crop';

function App() {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePrediction = async () => {
    if (!selectedCrop || !selectedImage) {
      setError('يرجى اختيار نوع المحصول ورفع صورة');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPredictionResult(null);

    try {
      const result = await predictHarvestDate(selectedImage, selectedCrop);
      setPredictionResult(result);
    } catch (err) {
      setError('فشل في تحليل الصورة. يرجى المحاولة مرة أخرى.');
      console.error('Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedCrop('');
    setSelectedImage(null);
    setPredictionResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                متنبئ موعد الحصاد
              </h1>
              <p className="text-sm text-gray-600">
                توقع موعد الحصاد بالذكاء الاصطناعي المتقدم
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Introduction */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 space-x-reverse mb-4">
              <Brain className="w-8 h-8 text-green-600" />
              <Camera className="w-8 h-8 text-blue-600" />
              <Leaf className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              توقيت الحصاد الذكي بتقنية الشبكات العصبية التطبيقية
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              ارفع صورة محصولك ودع خوارزمية الشبكات العصبية المتقدمة تحلل مرحلة النضج 
              لتتنبأ بموعد الحصاد الأمثل بدقة عالية.
            </p>
          </div>

          {/* Input Form */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CropSelector
                selectedCrop={selectedCrop}
                onCropSelect={setSelectedCrop}
              />
              <ImageUploader
                selectedImage={selectedImage}
                onImageSelect={setSelectedImage}
                onImageRemove={() => setSelectedImage(null)}
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handlePrediction}
                disabled={!selectedCrop || !selectedImage || isLoading}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 space-x-reverse"
              >
                <Brain className="w-5 h-5" />
                <span>تحليل وتوقع موعد الحصاد</span>
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                إعادة تعيين
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <LoadingSpinner />
            </div>
          )}

          {/* Results */}
          {predictionResult && !isLoading && (
            <PredictionResults result={predictionResult} />
          )}

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                تقنية الشبكات العصبية
              </h3>
              <p className="text-gray-600 text-sm">
                شبكة عصبية تطبيقية متقدمة مدربة على آلاف صور المحاصيل لتقييم النضج بدقة عالية.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                محاصيل متنوعة
              </h3>
              <p className="text-gray-600 text-sm">
                دعم لأنواع مختلفة من المحاصيل بما في ذلك الحبوب والفواكه والخضروات مع تحليل متخصص لكل نوع.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                رفع سهل
              </h3>
              <p className="text-gray-600 text-sm">
                واجهة سحب وإفلات بسيطة لرفع الصور بسرعة والحصول على نتائج التحليل فوراً.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              © 2025 متنبئ موعد الحصاد. مدعوم بتقنية الشبكات العصبية المتقدمة للزراعة الدقيقة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;