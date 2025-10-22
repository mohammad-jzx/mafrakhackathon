import React, { useState, useRef } from 'react';
import { CalendarCheck, Upload, AlertTriangle, Image as ImageIcon, Globe2, Camera, X, Check } from 'lucide-react';
import Webcam from 'react-webcam';
import { analyzeMaturity, estimateHarvestTime } from '../utils/harvestDetection';

// نصوص باللغتين
const texts = {
  ar: {
    title: 'نضج المحصول والحصاد الذكي',
    desc: 'ارفع صورة لمحصولك وسيتم تحليلها باستخدام الذكاء الاصطناعي لتقدير درجة النضج وتوقيت الحصاد الأمثل.',
    dropHere: 'اسحب الصور هنا أو اضغط لاختيار الصور',
    analyze: 'تحليل الصور',
    cropName: 'اسم المحصول',
    maturity: 'درجة النضج',
    harvest: 'وقت الحصاد المتوقع',
    warning: 'تنبيه: وقت الحصاد قريب جداً!',
    ready: 'جاهز خلال',
    days: 'أيام',
    result: 'نتائج التحليل',
    noImages: 'لم يتم رفع أي صورة بعد.',
    lang: 'English',
  },
  en: {
    title: 'Crop Maturity & Smart Harvest',
    desc: 'Upload your crop images and get AI-powered maturity and harvest time analysis.',
    dropHere: 'Drop images here or click to select',
    analyze: 'Analyze Images',
    cropName: 'Crop Name',
    maturity: 'Maturity Level',
    harvest: 'Estimated Harvest Time',
    warning: 'Warning: Harvest time is very soon!',
    ready: 'Ready in',
    days: 'days',
    result: 'Analysis Results',
    noImages: 'No images uploaded yet.',
    lang: 'العربية',
  }
};

const mockAnalyze = (images: string[], lang: 'ar' | 'en') => {
  // محاكاة نتائج التحليل
  return images.map((img: string, idx: number) => {
    const crops = lang === 'ar' ? ['قمح', 'طماطم', 'ذرة'] : ['Wheat', 'Tomato', 'Corn'];
    const maturities = lang === 'ar' ? ['غير ناضج', 'ناضج جزئياً', 'ناضج تماماً'] : ['Unripe', 'Partially Ripe', 'Fully Ripe'];
    const days = Math.floor(Math.random() * 7);
    return {
      id: idx,
      src: img,
      crop: crops[Math.floor(Math.random() * crops.length)],
      maturity: maturities[Math.floor(Math.random() * maturities.length)],
      harvest: days,
    };
  });
};

// قائمة المحاصيل المدعومة
const crops = {
  ar: ['طماطم', 'ليمون', 'تفاح', 'خيار', 'عنب', 'موز', 'برتقال', 'فراولة'],
  en: ['Tomato', 'Lemon', 'Apple', 'Cucumber', 'Grapes', 'Banana', 'Orange', 'Strawberry']
};
// دالة ترجمة اسم المحصول بين العربية والإنجليزية
const translateCrop = (crop: string, from: 'ar' | 'en', to: 'ar' | 'en'): string => {
  const idx = crops[from].indexOf(crop);
  return idx >= 0 ? crops[to][idx] : crop;
};

const MaturityAnalysis: React.FC<{ darkMode?: boolean }> = ({ darkMode = false }) => {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [images, setImages] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [webcamImage, setWebcamImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string>(crops.ar[0]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setImages([ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setImages([ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setImages([ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleWebcamCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) setWebcamImage(imageSrc);
    }
  };

  const handleWebcamConfirm = () => {
    if (webcamImage) {
      setImages([webcamImage]);
      setWebcamImage(null);
      setShowWebcam(false);
    }
  };

  const handleWebcamCancel = () => {
    setWebcamImage(null);
    setShowWebcam(false);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const analysisResults = await Promise.all(images.map(async (img, idx) => {
        const cropName = lang === 'ar' ? selectedCrop : translateCrop(selectedCrop, 'en', 'ar');
        const result = await analyzeMaturity(img, cropName);
        return {
          id: idx,
          src: img,
          crop: selectedCrop,
          ...result,
          harvestDate: estimateHarvestTime(result.harvestDays)
        };
      }));
      setResults(analysisResults);
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl shadow-lg p-6 theme-transition bg-white dark:bg-gray-800 max-w-3xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
          <CalendarCheck className="w-6 h-6" />
          {texts[lang].title}
        </h2>
        <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="flex items-center gap-1 px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm shadow hover:bg-gray-200 dark:hover:bg-gray-600">
          <Globe2 className="w-4 h-4" /> {texts[lang].lang}
        </button>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 text-center">{texts[lang].desc}</p>
      {/* اختيار نوع المحصول */}
      <div className="mb-6">
        <label htmlFor="crop-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {lang === 'ar' ? 'اختر نوع المحصول' : 'Select Crop Type'}
        </label>
        <select
          id="crop-select"
          value={selectedCrop}
          onChange={e => setSelectedCrop(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-green-200 dark:focus:ring-green-800 focus:ring-opacity-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          {crops[lang].map(crop => (
            <option key={crop} value={crop}>{crop}</option>
          ))}
        </select>
      </div>
      {/* Drop Zone */}
      <div
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center mb-6 min-h-[180px] bg-gray-50 dark:bg-gray-900 transition-all cursor-pointer"
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => document.getElementById('maturity-upload')?.click()}
      >
        <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2" />
        <p className="text-gray-500 dark:text-gray-400 mb-4">{texts[lang].dropHere}</p>
        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 justify-center mb-4"
          onClick={e => {
            e.stopPropagation();
            document.getElementById('maturity-upload')?.click();
          }}
        >
          <Upload className="w-5 h-5" /> {lang === 'ar' ? 'رفع صورة من الجهاز' : 'Upload from device'}
        </button>
        <div className="flex flex-wrap gap-2 mt-2 justify-center">
          {images.map((img, idx) => (
            <img key={idx} src={img} alt="preview" className="w-16 h-16 object-cover rounded shadow border" />
          ))}
        </div>
      </div>
      {/* زر الكاميرا فقط */}
      <div className="flex flex-col items-center gap-2 mb-6">
        <button
          type="button"
          className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800 dark:text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 justify-center"
          onClick={() => setShowWebcam(true)}
        >
          <Camera className="w-5 h-5" /> {lang === 'ar' ? 'فتح الكاميرا' : 'Open Camera'}
        </button>
      </div>
      {/* كاميرا مباشرة */}
      {showWebcam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="rounded-lg mb-4 w-72 h-72 object-cover"
              videoConstraints={{ facingMode: 'environment' }}
            />
            {webcamImage ? (
              <>
                <img src={webcamImage} alt="لقطة الكاميرا" className="rounded-lg mb-4 w-72 h-72 object-cover border" />
                <div className="flex gap-4">
                  <button onClick={handleWebcamConfirm} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold"><Check className="w-5 h-5" /> {lang === 'ar' ? 'تأكيد' : 'Confirm'}</button>
                  <button onClick={handleWebcamCancel} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold"><X className="w-5 h-5" /> {lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                </div>
              </>
            ) : (
              <button onClick={handleWebcamCapture} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2"><Camera className="w-5 h-5" /> {lang === 'ar' ? 'التقاط صورة' : 'Capture'}</button>
            )}
          </div>
        </div>
      )}
      <input
        id="maturity-upload"
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
      {/* زر التحليل */}
      <div className="flex justify-center mb-8">
        <button
          className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800 dark:text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
          onClick={handleAnalyze}
          disabled={images.length === 0 || loading}
        >
          <Upload className="w-5 h-5" /> {loading ? (lang === 'ar' ? 'جاري التحليل...' : 'Analyzing...') : texts[lang].analyze}
        </button>
      </div>
      {/* النتائج */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-green-600 dark:text-green-400" /> {texts[lang].result}
        </h3>
        {results.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 text-center py-8">{texts[lang].noImages}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map(res => (
              <div key={res.id} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 shadow flex flex-col items-center relative">
                <img src={res.src} alt="crop" className="w-32 h-32 object-cover rounded mb-3 border shadow" />
                <div className="text-base font-bold text-green-700 dark:text-green-300 mb-1">{texts[lang].cropName}: <span className="font-normal text-gray-800 dark:text-gray-100">{res.crop}</span></div>
                {res.success === false ? (
                  <div className="text-base font-bold text-red-600 dark:text-red-400 mb-1 mt-2">
                    {res.message || (lang === 'ar' ? 'حدث خطأ أثناء التحليل أو لم يتم الكشف عن المحصول.' : 'Analysis error or no crop detected.')}
                  </div>
                ) : (
                  <>
                    <div className="text-base font-bold text-blue-700 dark:text-blue-300 mb-1">{texts[lang].maturity}: <span className="font-normal text-gray-800 dark:text-gray-100">{res.maturity}</span></div>
                    <div className="text-base font-bold text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-2">
                      {texts[lang].harvest}: <span className="font-normal text-gray-800 dark:text-gray-100">
                        {typeof res.harvest === 'number' && !isNaN(res.harvest)
                          ? (res.harvest === 0
                              ? (lang === 'ar' ? 'جاهز الآن' : 'Ready now')
                              : `${texts[lang].ready} ${res.harvest} ${texts[lang].days}`)
                          : 'غير معروف'}
                      </span>
                    </div>
                    {res.harvest <= 3 && (
                      <div className="mt-2 flex items-center gap-2 text-red-600 dark:text-red-400 font-bold">
                        <AlertTriangle className="w-4 h-4" /> {texts[lang].warning}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaturityAnalysis;