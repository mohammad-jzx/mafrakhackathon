import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info, Download, TrendingUp, Droplet, FileText, Thermometer, Leaf, ChevronDown, Clock, BarChart, Bug } from 'lucide-react';
import { PieChart, Pie, BarChart as RechartsBarChart, Bar, Cell, ResponsiveContainer, Tooltip, Legend, XAxis, YAxis } from 'recharts';
import type { Crop, SensorData, Recommendation, AlertType, Alert } from '../types';
import { initializePestPredictionModel, predictPests, generatePestRecommendations } from '../utils/pestPrediction';

// دالة مساعدة آمنة للتعامل مع toFixed
function safeToFixed(value: number | null | undefined, digits: number = 1): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "-";
  }
  return value.toFixed(digits);
}

// Componente para cada alerta individual
const AlertItem = ({ alert }: { alert: Alert }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const alertStyles = {
    'خطر': {
      bgNormal: 'bg-rose-50 hover:bg-rose-100',
      bgExpanded: 'bg-rose-100',
      border: 'border-rose-200 dark:border-rose-700',
      text: 'text-rose-800 dark:text-rose-300',
      iconColor: 'text-rose-500',
      icon: <XCircle className="w-5 h-5" />
    },
    'تحذير': {
      bgNormal: 'bg-amber-50 hover:bg-amber-100',
      bgExpanded: 'bg-amber-100',
      border: 'border-amber-200',
      text: 'text-amber-800',
      iconColor: 'text-amber-500',
      icon: <AlertTriangle className="w-5 h-5" />
    },
    'إشعار': {
      bgNormal: 'bg-sky-50 hover:bg-sky-100',
      bgExpanded: 'bg-sky-100',
      border: 'border-sky-200 dark:border-sky-700',
      text: 'text-sky-800 dark:text-sky-300',
      iconColor: 'text-sky-500',
      icon: <Info className="w-5 h-5" />
    },
    'نجاح': {
      bgNormal: 'bg-emerald-50 hover:bg-emerald-100',
      bgExpanded: 'bg-emerald-100',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      iconColor: 'text-emerald-500',
      icon: <CheckCircle className="w-5 h-5" />
    }
  };
  
  // Default to 'إشعار' if type not found
  const style = alertStyles[alert.type] || alertStyles['إشعار'];
  
  return (
    <div 
      className={`rounded-xl border ${style.border} shadow-sm transition-all duration-300 transform ${isExpanded ? 'scale-102 ' + style.bgExpanded : style.bgNormal} cursor-pointer overflow-hidden`}
    >
      {/* Header - always visible */}
      <div 
        className={`p-4 flex items-center justify-between ${style.text}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span className={`flex-shrink-0 ${style.iconColor}`}>
            {style.icon}
          </span>
          <span className="font-semibold text-lg">
            {alert.title || `تنبيه ${alert.type}`}
          </span>
        </div>
        <span className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-5 h-5" />
        </span>
      </div>
      
      {/* Content - only visible when expanded */}
      <div 
        className={`transition-all duration-300 overflow-hidden ${
          isExpanded ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`p-4 pt-0 border-t ${style.border}`}>
          <p className={`${style.text} leading-relaxed`}>{alert.message}</p>
          
          {alert.action && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="font-medium">الإجراء المطلوب:</span>
              <span>{alert.action}</span>
            </div>
          )}
          
          {alert.timeframe && (
            <div className="mt-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{alert.timeframe}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente para cada recomendación individual
const RecommendationItem = ({ rec, index }: { rec: string; index: number }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Different icons based on content
  const getIcon = (content: string) => {
    if (content.includes('ري') || content.includes('رطوبة'))
      return <Droplet className="w-5 h-5 text-sky-500" />;
    if (content.includes('حرارة') || content.includes('درجة'))
      return <Thermometer className="w-5 h-5 text-orange-500" />;
    if (content.includes('تسميد') || content.includes('نيتروجين') || 
       content.includes('فسفور') || content.includes('بوتاسيوم'))
      return <Leaf className="w-5 h-5 text-emerald-500" />;
    return <FileText className="w-5 h-5 text-purple-500" />;
  };
  
  // Extract a reason if possible
  const getReason = (content: string) => {
    if (content.includes('بسبب') || content.includes('نتيجة')) {
      return content.split(/بسبب|نتيجة/)[1].trim();
    }
    return "توصية تحسينية للمحصول";
  };
  
  const icon = getIcon(rec);
  const reason = getReason(rec);
  
  return (
    <div 
      className="flex items-start gap-4 animate-fadeIn" 
      style={{animationDelay: `${index * 150}ms`}}
    >
      {/* Timeline node */}
      <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 shadow-md">
        {icon}
      </div>
      
      {/* Content card */}
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg border border-gray-100 dark:border-slate-700 p-4 transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-700 dark:text-emerald-400 font-bold">#{index + 1}</span>
            <h5 className="font-semibold text-gray-800 dark:text-white">توصية</h5>
          </div>
          <div className="relative">
            <button 
              className="text-gray-500 hover:text-emerald-500 transition-colors flex items-center gap-1 text-sm"
              onClick={() => setShowTooltip(!showTooltip)}
            >
              <BarChart className="w-4 h-4" />
              <span>المزيد</span>
            </button>
            
            {/* Tooltip */}
            {showTooltip && (
              <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-slate-900 text-white rounded-lg shadow-xl z-50 text-sm">
                <div className="font-medium mb-1">السبب:</div>
                <p>{reason}</p>
                <div className="absolute left-4 -bottom-2 w-4 h-4 bg-slate-900 transform rotate-45"></div>
              </div>
            )}
          </div>
        </div>
        
        <p className="mt-2 text-gray-600 dark:text-gray-300">{rec}</p>
      </div>
    </div>
  );
};

interface RecommendationPanelProps {
  selectedCrop: Crop | null;
  currentData: SensorData | null;
  recommendations: Recommendation | null;
}

// Componente para la tarjeta de recomendación móvil
const MobileRecommendationCard = ({ rec, index }: { rec: string; index: number }) => {
  return (
    <div 
      className="w-64 flex-shrink-0 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4 shadow-md snap-start"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-white dark:bg-slate-700 text-emerald-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold border border-gray-200 dark:border-gray-600">
          {index + 1}
        </span>
        <h5 className="font-semibold text-gray-800 dark:text-white">توصية</h5>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{rec}</p>
    </div>
  );
};

export default function RecommendationPanel({ selectedCrop, currentData, recommendations }: RecommendationPanelProps) {
  if (!selectedCrop) {
    return (
      <div className="text-center py-12">
        <Info className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">اختر نوع المحصول</h3>
        <p className="text-gray-600">يرجى اختيار نوع المحصول أولاً من تبويب 'اختيار المحصول'</p>
      </div>
    );
  }

  if (!currentData) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد بيانات مستشعر</h3>
        <p className="text-gray-600">يرجى الاتصال بالمستشعر أولاً للحصول على البيانات</p>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">جاري تحليل البيانات...</p>
      </div>
    );
  }

  const statusColors = {
    'ممتاز': 'from-emerald-500 to-emerald-600',
    'جيد': 'from-sky-500 to-sky-600',
    'يحتاج عناية': 'from-amber-500 to-amber-600',
    'يحتاج تدخل فوري': 'from-rose-500 to-rose-600'
  };

  // نموذج التحليل الاقتصادي - Economic Analysis
  const [cost, setCost] = useState('');
  const [yieldAmount, setYieldAmount] = useState('');
  const [price, setPrice] = useState('');
  const profit = (parseFloat(yieldAmount) * parseFloat(price)) - parseFloat(cost);
  const profitMargin = cost && profit ? (profit / parseFloat(cost)) * 100 : 0;
  
  // مقارنة طريقتين في الري أو التسميد - Method Comparison
  const [method1, setMethod1] = useState({ name: 'ري تقليدي', cost: '', yield: '', icon: '🚜' });
  const [method2, setMethod2] = useState({ name: 'ري بالتنقيط', cost: '', yield: '', icon: '💧' });
  const benefit1 = method1.yield && method1.cost ? parseFloat(method1.yield) * parseFloat(price || '0') - parseFloat(method1.cost) : null;
  const benefit2 = method2.yield && method2.cost ? parseFloat(method2.yield) * parseFloat(price || '0') - parseFloat(method2.cost) : null;
  
  // بيانات الرسوم - Chart data
  const profitChartData = [
    { name: 'التكلفة', value: parseFloat(cost) || 0, fill: '#f87171' },
    { name: 'الربح', value: profit > 0 ? profit : 0, fill: '#4ade80' },
  ];
  
  const methodComparisonData = [
    { name: method1.name, تكلفة: parseFloat(method1.cost) || 0, إنتاج: parseFloat(method1.yield) || 0, ربح: benefit1 || 0 },
    { name: method2.name, تكلفة: parseFloat(method2.cost) || 0, إنتاج: parseFloat(method2.yield) || 0, ربح: benefit2 || 0 },
  ];

  // إستخراج التوصية المناسبة - Generate recommendation
  const getRecommendation = () => {
    if (!benefit1 || !benefit2) return '';
    
    const betterMethod = benefit2 > benefit1 ? method2.name : method1.name;
    const diff = Math.abs(benefit2 - benefit1);
    const percentage = Math.round(diff / Math.min(benefit1, benefit2) * 100);
    
    return `ينصح باستخدام ${betterMethod} لأنه يوفر أرباحًا أكبر بنسبة ${percentage}% مقارنة بالطريقة الأخرى.`;
  };

  // تصدير البيانات كملف PDF
  const exportToPDF = () => {
    window.print();
  };

  // تصدير البيانات كملف CSV
  const exportToCSV = () => {
    // إنشاء بيانات CSV
    const csvData = [
      ['التحليل الاقتصادي المرتبط بالإنتاج'],
      ['تكلفة الإنتاج (دينار)', cost],
      ['الإنتاج المتوقع (طن)', yieldAmount],
      ['سعر البيع المتوقع للطن (دينار)', price],
      ['الأرباح المتوقعة (دينار)', profit],
      [''],
      ['مقارنة الطرق'],
      [method1.name, 'التكلفة', 'الإنتاج', 'الربح'],
      ['', method1.cost, method1.yield, benefit1],
      [method2.name, 'التكلفة', 'الإنتاج', 'الربح'],
      ['', method2.cost, method2.yield, benefit2],
    ].map(row => row.join(',')).join('\n');
    
    // تحميل الملف
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'التحليل-الاقتصادي.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // حالة لتنبؤ الآفات
  const [pestModel, setPestModel] = useState<any>(null);
  const [pestPredictions, setPestPredictions] = useState<any>(null);
  const [pestRecommendations, setPestRecommendations] = useState<string[]>([]);
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);

  // تهيئة نموذج تنبؤ الآفات
  useEffect(() => {
    async function loadPestModel() {
      try {
        const model = await initializePestPredictionModel();
        setPestModel(model);
      } catch (error) {
        console.error('خطأ في تحميل نموذج التنبؤ:', error);
      }
    }
    
    loadPestModel();
  }, []);

  // تحديث تنبؤات الآفات عندما تتغير بيانات المستشعر
  useEffect(() => {
    async function updatePredictions() {
      if (pestModel && currentData) {
        setIsLoadingPredictions(true);
        try {
          const predictions = await predictPests(pestModel, currentData, selectedCrop?.nameAr);
          setPestPredictions(predictions);
          
          // توليد توصيات بناءً على التنبؤات
          if (selectedCrop) {
            const recs = generatePestRecommendations(predictions, selectedCrop.name);
            setPestRecommendations(recs);
          }
        } catch (error) {
          console.error('خطأ في تحديث التنبؤات:', error);
        } finally {
          setIsLoadingPredictions(false);
        }
      }
    }
    
    updatePredictions();
  }, [pestModel, currentData, selectedCrop]);

  // دالة لتحديث التنبؤات يدويًا
  const handleUpdatePredictions = async () => {
    if (pestModel && currentData) {
      setIsLoadingPredictions(true);
      try {
        const predictions = await predictPests(pestModel, currentData, selectedCrop?.nameAr);
        setPestPredictions(predictions);
        
        if (selectedCrop) {
          const recs = generatePestRecommendations(predictions, selectedCrop.name);
          setPestRecommendations(recs);
        }
      } catch (error) {
        console.error('خطأ في تحديث التنبؤات:', error);
      } finally {
        setIsLoadingPredictions(false);
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center mb-8">
        <TrendingUp className="w-7 h-7 text-emerald-500 mr-3" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">التحليل الذكي والتوصيات</h3>
      </div>

      {/* Overall Status */}
      <div className="bg-[#f8f9fa] dark:bg-slate-800 rounded-2xl p-6 mb-8 text-center shadow-md hover:shadow-lg transition-all overflow-hidden">
        <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-3">الحالة العامة للمحصول</h4>
        
        {recommendations.overallStatus === 'ممتاز' && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-xl"></div>
            <div className="relative bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
              <div className="flex items-center justify-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
                <h2 className="text-2xl font-bold text-emerald-700">{recommendations.overallStatus}</h2>
              </div>
              <p className="text-lg text-emerald-800">{selectedCrop.nameAr} {selectedCrop.icon}</p>
            </div>
          </div>
        )}
        
        {recommendations.overallStatus === 'جيد' && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-sky-600/20 rounded-xl"></div>
            <div className="relative bg-gradient-to-r from-sky-50 to-sky-100 rounded-xl p-4 border border-sky-200">
              <div className="flex items-center justify-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-sky-500" />
                <h2 className="text-2xl font-bold text-sky-700">{recommendations.overallStatus}</h2>
              </div>
              <p className="text-lg text-sky-800">{selectedCrop.nameAr} {selectedCrop.icon}</p>
            </div>
          </div>
        )}
        
        {recommendations.overallStatus === 'يحتاج عناية' && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-xl"></div>
            <div className="relative bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-800/30 dark:to-amber-700/30 rounded-xl p-4 border border-amber-200 dark:border-amber-700">
              <div className="flex items-center justify-center gap-3 mb-2">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
                <h2 className="text-2xl font-bold text-amber-700 dark:text-amber-400">{recommendations.overallStatus}</h2>
              </div>
              <p className="text-lg text-amber-800 dark:text-amber-300">{selectedCrop.nameAr} {selectedCrop.icon}</p>
            </div>
          </div>
        )}
        
        {recommendations.overallStatus === 'يحتاج تدخل فوري' && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-rose-600/20 rounded-xl"></div>
            <div className="relative bg-gradient-to-r from-rose-50 to-rose-100 dark:from-rose-900/30 dark:to-rose-800/30 rounded-xl p-4 border border-rose-200 dark:border-rose-700">
              <div className="flex items-center justify-center gap-3 mb-2">
                <XCircle className="w-6 h-6 text-rose-500" />
                <h2 className="text-2xl font-bold text-rose-700 dark:text-rose-400">{recommendations.overallStatus}</h2>
              </div>
              <p className="text-lg text-rose-800 dark:text-rose-300">{selectedCrop.nameAr} {selectedCrop.icon}</p>
            </div>
          </div>
        )}
        
        {recommendations.overallStatus !== 'ممتاز' && 
         recommendations.overallStatus !== 'جيد' &&
         recommendations.overallStatus !== 'يحتاج عناية' &&
         recommendations.overallStatus !== 'يحتاج تدخل فوري' && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-xl"></div>
            <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Info className="w-6 h-6 text-gray-500" />
                <h2 className="text-2xl font-bold text-gray-700">{recommendations.overallStatus}</h2>
              </div>
              <p className="text-lg text-gray-800">{selectedCrop.nameAr} {selectedCrop.icon}</p>
            </div>
          </div>
        )}
      </div>

      {/* Alerts - التنبيهات المهمة */}
      {recommendations.alerts.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-amber-500 mr-2" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">التنبيهات المهمة</h4>
          </div>
          
          <div className="space-y-4">
            {recommendations.alerts.map((alert, index) => (
              <AlertItem key={index} alert={alert} />
            ))}
          </div>
        </div>
      )}

      {/* Recommendations - التوصيات التفصيلية */}
      {recommendations.recommendations.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <Leaf className="w-6 h-6 text-emerald-500 mr-2" />
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white">التوصيات التفصيلية</h4>
          </div>
          
          {/* Vertical Timeline for Recommendations */}
          <div className="relative flex flex-col items-start">
            {/* Left border line */}
            <div className="absolute right-6 top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#f8f9fa] to-[#f5f7f9] dark:from-slate-700 dark:to-slate-800 border border-gray-200 dark:border-gray-700 rounded-full"></div>
            
            {/* Recommendations */}
            <div className="space-y-6 w-full">
              {recommendations.recommendations.map((rec, index) => (
                <RecommendationItem key={index} rec={rec} index={index} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add a mobile-friendly horizontal carousel for small screens */}
      <div className="md:hidden my-6">
        <div className="overflow-x-auto pb-4 snap-x max-w-full">
          <div className="flex gap-4 px-4 pb-2">
            {recommendations.recommendations && recommendations.recommendations.map((rec, index) => (
              <MobileRecommendationCard key={index} rec={rec} index={index} />
            ))}
          </div>
        </div>
        
        {/* Pagination indicator */}
        {recommendations.recommendations && recommendations.recommendations.length > 1 && (
          <div className="flex justify-center gap-1 mt-2">
            {recommendations.recommendations.map((_, index) => (
              <div 
                key={index} 
                className={`h-1.5 rounded-full ${index === 0 ? 'w-4 bg-emerald-500' : 'w-1.5 bg-gray-300 dark:bg-gray-600'}`}
              ></div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Environmental Conditions */}
        <div className="bg-[#f8f9fa] dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-center mb-4">
            <Thermometer className="w-5 h-5 text-sky-500 mr-2" />
            <h5 className="font-semibold text-gray-800 dark:text-white">الظروف البيئية</h5>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">درجة الحرارة:</span>
              <div className="text-left">
                <span className="font-medium dark:text-gray-200">{safeToFixed(currentData.temperature)}°C</span>
                <span className={`mr-2 text-sm ${
                  recommendations.temperatureStatus === 'مناسب' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {recommendations.temperatureStatus === 'مناسب' ? '✅ مناسب' : `⚠️ ${recommendations.temperatureStatus}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">الرطوبة الجوية:</span>
              <div className="text-left">
                <span className="font-medium dark:text-gray-200">{safeToFixed(currentData.humidity)}%</span>
                <span className={`mr-2 text-sm ${
                  recommendations.humidityStatus === 'مناسب' ? 'text-emerald-600 dark:text-emerald-400' : 'text-sky-600 dark:text-sky-400'
                }`}>
                  {recommendations.humidityStatus === 'مناسب' ? '✅ مناسب' : `💧 ${recommendations.humidityStatus}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">رطوبة التربة:</span>
              <div className="text-left">
                <span className="font-medium dark:text-gray-200">{safeToFixed(currentData.soilMoisture)}%</span>
                <span className={`mr-2 text-sm ${
                  !recommendations.needsIrrigation ? 'text-emerald-600 dark:text-emerald-400' : 'text-sky-600 dark:text-sky-400'
                }`}>
                  {!recommendations.needsIrrigation ? '✅ مناسب' : '💧 يحتاج ري'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">حموضة التربة:</span>
              <div className="text-left">
                <span className="font-medium dark:text-gray-200">{safeToFixed(currentData.ph)} pH</span>
                <span className={`mr-2 text-sm ${
                  recommendations.soilPhStatus === 'مناسب' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {recommendations.soilPhStatus === 'مناسب' ? '✅ مناسب' : `⚠️ ${recommendations.soilPhStatus}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nutrient Analysis */}
        <div className="bg-[#f8f9fa] dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-5 h-5 text-orange-500 mr-2" />
            <h5 className="font-semibold text-gray-800 dark:text-white">العناصر الغذائية</h5>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">النيتروجين:</span>
              <div className="text-left">
                <span className="font-medium dark:text-gray-200">{safeToFixed(currentData.nitrogen)} ppm</span>
                <span className={`mr-2 text-sm ${
                  !recommendations.needsNitrogen ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'
                }`}>
                  {!recommendations.needsNitrogen ? '✅ كافي' : '🌱 ناقص'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">الفسفور:</span>
              <div className="text-left">
                <span className="font-medium dark:text-gray-200">{safeToFixed(currentData.phosphorus)} ppm</span>
                <span className={`mr-2 text-sm ${
                  !recommendations.needsPhosphorus ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'
                }`}>
                  {!recommendations.needsPhosphorus ? '✅ كافي' : '🌱 ناقص'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">البوتاسيوم:</span>
              <div className="text-left">
                <span className="font-medium dark:text-gray-200">{safeToFixed(currentData.potassium)} ppm</span>
                <span className={`mr-2 text-sm ${
                  !recommendations.needsPotassium ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'
                }`}>
                  {!recommendations.needsPotassium ? '✅ كافي' : '🌱 ناقص'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">الموصلية الكهربائية:</span>
              <div className="text-left">
                <span className="font-medium dark:text-gray-200">{safeToFixed(currentData.conductivity, 2)} mS/cm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* التحليل الاقتصادي - Economic Analysis */}
      {selectedCrop && (
        <div className="bg-[#f8f9fa] dark:bg-slate-900 rounded-xl p-6 mt-8 shadow-md hover:shadow-lg transition-all">
          {/* العنوان - Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-7 h-7 text-emerald-500 mr-2" />
              <h4 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                التحليل الاقتصادي المرتبط بالإنتاج
              </h4>
            </div>
          </div>
          
          {/* المحتوى - Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* مقارنة بين طريقتين في الري - Method Comparison */}
            <div className="bg-[#f5f7f9] dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Droplet className="w-5 h-5 text-sky-500" />
                <h5 className="text-lg font-semibold text-sky-600 dark:text-sky-400">
                  مقارنة بين طريقتين في الري
                </h5>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* الطريقة الأولى - First Method (Right) */}
                <div>
                  <div className="text-center text-gray-700 dark:text-sky-100 mb-2">اسم الطريقة</div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-2xl">💧</span>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-center text-gray-800 dark:text-white"
                      value={method1.name} 
                      onChange={e => setMethod1({ ...method1, name: e.target.value })} 
                      placeholder="الري بالتنقيط"
                    />
                  </div>
                  
                  <div className="text-center text-gray-700 dark:text-sky-100 mb-2">تكلفة الطريقة (دينار)</div>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-center text-gray-800 dark:text-white mb-4"
                    value={method1.cost} 
                    onChange={e => setMethod1({ ...method1, cost: e.target.value })} 
                  />
                  
                  <div className="text-center text-gray-700 dark:text-sky-100 mb-2">الإنتاج المتوقع (طن)</div>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-center text-gray-800 dark:text-white mb-4"
                    value={method1.yield} 
                    onChange={e => setMethod1({ ...method1, yield: e.target.value })} 
                  />
                  
                  <div className="bg-[#edf2f7] dark:bg-slate-700 rounded-xl p-3 text-center">
                    <div className="text-gray-800 dark:text-sky-100">العائد: {benefit1 !== null && !isNaN(benefit1) ? benefit1.toLocaleString() + ' دينار' : '0 دينار'}</div>
                    <div className="text-gray-800 dark:text-sky-100">الربح: {benefit1 !== null && !isNaN(benefit1) ? benefit1.toLocaleString() + ' دينار' : '0 دينار'}</div>
                  </div>
                </div>
                
                {/* الطريقة الثانية - Second Method (Left) */}
                <div>
                  <div className="text-center text-gray-700 dark:text-sky-100 mb-2">اسم الطريقة</div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-2xl">🚜</span>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-center text-gray-800 dark:text-white"
                      value={method2.name} 
                      onChange={e => setMethod2({ ...method2, name: e.target.value })} 
                      placeholder="الري التقليدي"
                    />
                  </div>
                  
                  <div className="text-center text-gray-700 dark:text-sky-100 mb-2">تكلفة الطريقة (دينار)</div>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-center text-gray-800 dark:text-white mb-4"
                    value={method2.cost} 
                    onChange={e => setMethod2({ ...method2, cost: e.target.value })} 
                  />
                  
                  <div className="text-center text-gray-700 dark:text-sky-100 mb-2">الإنتاج المتوقع (طن)</div>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-center text-gray-800 dark:text-white mb-4"
                    value={method2.yield} 
                    onChange={e => setMethod2({ ...method2, yield: e.target.value })} 
                  />
                  
                  <div className="bg-[#edf2f7] dark:bg-slate-700 rounded-xl p-3 text-center">
                    <div className="text-gray-800 dark:text-sky-100">العائد: {benefit2 !== null && !isNaN(benefit2) ? benefit2.toLocaleString() + ' دينار' : '0 دينار'}</div>
                    <div className="text-gray-800 dark:text-sky-100">الربح: {benefit2 !== null && !isNaN(benefit2) ? benefit2.toLocaleString() + ' دينار' : '0 دينار'}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* تحليل الأرباح المتوقعة - Expected Profit Analysis */}
            <div className="bg-[#f5f7f9] dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <h5 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                  تحليل الأرباح المتوقعة
                </h5>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-right text-gray-700 dark:text-emerald-100 mb-2">تكلفة الإنتاج الإجمالية (دينار)</div>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-right text-gray-800 dark:text-white"
                    value={cost} 
                    onChange={e => setCost(e.target.value)} 
                    placeholder="10000 دينار"
                  />
                </div>
                
                <div>
                  <div className="text-right text-gray-700 dark:text-emerald-100 mb-2">الإنتاج المتوقع (طن)</div>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-right text-gray-800 dark:text-white"
                    value={yieldAmount} 
                    onChange={e => setYieldAmount(e.target.value)} 
                    placeholder="5 طن"
                  />
                </div>
                
                <div>
                  <div className="text-right text-gray-700 dark:text-emerald-100 mb-2">سعر البيع المتوقع للطن (دينار)</div>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-right text-gray-800 dark:text-white"
                    value={price} 
                    onChange={e => setPrice(e.target.value)} 
                    placeholder="4000 دينار"
                  />
                </div>
                
                {/* النتائج - Results */}
                <div className="bg-[#edf2f7] dark:bg-slate-700 rounded-xl p-4">
                  <div className="text-right mb-2 text-gray-600 dark:text-gray-300">النتائج:</div>
                  <div className="text-right text-2xl text-emerald-600 dark:text-emerald-400">الربح المتوقع: {(!isNaN(profit) && isFinite(profit)) ? profit.toLocaleString() + ' دينار' : '0 دينار'}</div>
                  <div className="text-right text-emerald-600 dark:text-emerald-400">نسبة الربح من التكلفة: {(profitMargin && !isNaN(profitMargin)) ? safeToFixed(profitMargin, 1) + '%' : '0.0%'}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* أزرار التصدير - Export Buttons */}
          <div className="flex justify-center gap-6 mt-8 mb-2">
            <button 
              onClick={exportToPDF}
              className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl transition-all flex items-center gap-2 text-md font-semibold shadow-md hover:shadow-lg"
            >
              <FileText className="w-5 h-5" /> تصدير كملف PDF
            </button>
            <button 
              onClick={exportToCSV}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl transition-all flex items-center gap-2 text-md font-semibold shadow-md hover:shadow-lg"
            >
              <Download className="w-5 h-5" /> تصدير كملف Excel
            </button>
          </div>
          
          {/* التنبؤ بالآفات - Pest Prediction */}
          <div className="rounded-xl p-6 mt-8 shadow-md hover:shadow-lg transition-all">
            {/* العنوان - Title */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2">
                <Bug className="w-7 h-7 text-red-500 mr-2" />
                <h4 className="text-2xl font-bold text-red-600 dark:text-red-400">
                  التنبؤ بالآفات
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                تحليل البيانات البيئية للتنبؤ باحتمالية ظهور الآفات باستخدام خوارزمية XGBoost
              </p>
            </div>
            
            {/* المحتوى - Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
              {/* نتائج التنبؤ - Prediction Results */}
              <div className="p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Bug className="w-5 h-5 text-red-500" />
                  <h5 className="text-lg font-semibold text-red-600 dark:text-red-400">
                    احتمالية ظهور الآفات
                  </h5>
                </div>
                
                {pestModel?.isServerConnected === false && (
                  <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg p-2 mb-3 text-sm text-amber-800 dark:text-amber-300">
                    <div className="flex items-center gap-1 mb-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>لم يتم الاتصال بخادم التنبؤ</span>
                    </div>
                    <p>يتم استخدام نموذج محلي بسيط. لتحسين دقة التنبؤات، قم بتشغيل خادم التنبؤ باستخدام ملف run-pest-server.bat</p>
                  </div>
                )}
                
                <div className="space-y-4">
                  {currentData && pestPredictions && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">المن (Aphids):</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div 
                              className="bg-red-500 h-2.5 rounded-full" 
                              style={{ width: `${Math.round(pestPredictions.aphids * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {Math.round(pestPredictions.aphids * 100)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">العفن الفطري (Fungal Blight):</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div 
                              className="bg-red-500 h-2.5 rounded-full" 
                              style={{ width: `${Math.round(pestPredictions.fungalBlight * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {Math.round(pestPredictions.fungalBlight * 100)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">التربس (Thrips):</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div 
                              className="bg-red-500 h-2.5 rounded-full" 
                              style={{ width: `${Math.round(pestPredictions.thrips * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {Math.round(pestPredictions.thrips * 100)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">العناكب الحمراء (Spider Mites):</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div 
                              className="bg-red-500 h-2.5 rounded-full" 
                              style={{ width: `${Math.round(pestPredictions.spiderMites * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {Math.round(pestPredictions.spiderMites * 100)}%
                          </span>
                        </div>
                      </div>
                      
                      {/* الآفات الجديدة */}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">الذبابة البيضاء (Whiteflies):</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div 
                              className="bg-red-500 h-2.5 rounded-full" 
                              style={{ width: `${Math.round(pestPredictions.whiteflies * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {Math.round(pestPredictions.whiteflies * 100)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">حفارات الأوراق (Leaf Miners):</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div 
                              className="bg-red-500 h-2.5 rounded-full" 
                              style={{ width: `${Math.round(pestPredictions.leafMiners * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {Math.round(pestPredictions.leafMiners * 100)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">تعفن الجذور (Root Rot):</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div 
                              className="bg-red-500 h-2.5 rounded-full" 
                              style={{ width: `${Math.round(pestPredictions.rootRot * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {Math.round(pestPredictions.rootRot * 100)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">البياض الدقيقي (Powdery Mildew):</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div 
                              className="bg-red-500 h-2.5 rounded-full" 
                              style={{ width: `${Math.round(pestPredictions.powderyMildew * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {Math.round(pestPredictions.powderyMildew * 100)}%
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {(!currentData || !pestPredictions) && (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      {isLoadingPredictions ? 'جاري تحميل التنبؤات...' : 'لم يتم توفير بيانات المستشعرات بعد'}
                    </div>
                  )}
                </div>
                
                {/* زر تحديث التنبؤات */}
                <div className="mt-4">
                  <button 
                    className={`${
                      isLoadingPredictions 
                        ? 'bg-purple-400 cursor-not-allowed' 
                        : 'bg-purple-500 hover:bg-purple-600'
                    } text-white px-4 py-2 w-full rounded-xl transition-all flex items-center justify-center gap-2 text-md font-semibold shadow-md hover:shadow-lg`}
                    onClick={handleUpdatePredictions}
                    disabled={isLoadingPredictions || !currentData}
                  >
                    {isLoadingPredictions ? 'جاري التحديث...' : 'تحديث التنبؤات'}
                  </button>
                </div>
              </div>
              
              {/* توصيات الوقاية - Prevention Recommendations */}
              <div className="p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <h5 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                    توصيات للوقاية من الآفات
                  </h5>
                </div>
                
                <div className="space-y-3">
                  {pestRecommendations.length > 0 ? (
                    pestRecommendations.map((rec, index) => (
                      <div key={index} className="bg-white dark:bg-slate-700 rounded-lg p-3 shadow-sm">
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{rec}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="bg-white dark:bg-slate-700 rounded-lg p-3 shadow-sm">
                        <h6 className="font-semibold text-gray-800 dark:text-white mb-1">المراقبة المنتظمة:</h6>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          قم بتفقد النباتات بشكل منتظم للكشف المبكر عن الآفات والأمراض.
                        </p>
                      </div>
                      
                      <div className="bg-white dark:bg-slate-700 rounded-lg p-3 shadow-sm">
                        <h6 className="font-semibold text-gray-800 dark:text-white mb-1">المكافحة الحيوية:</h6>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          استخدام الأعداء الطبيعيين مثل الحشرات المفترسة والطفيليات للسيطرة على الآفات.
                        </p>
                      </div>
                      
                      <div className="bg-white dark:bg-slate-700 rounded-lg p-3 shadow-sm">
                        <h6 className="font-semibold text-gray-800 dark:text-white mb-1">التناوب الزراعي:</h6>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          تناوب المحاصيل للحد من تراكم الآفات المتخصصة في التربة ولكسر دورة حياتها.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}