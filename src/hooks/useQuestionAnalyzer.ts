import { useState, useCallback } from 'react';
import type { SensorData } from '../types';
import { crops as cropDB } from '../data/crops';

export type IntentType =
  | 'sensor_data'
  | 'database_query'
  | 'system_status'
  | 'general_info'
  | 'irrigation'
  | 'fertilization';

export interface QuestionAnalysis {
  originalText: string;
  processedText: string;
  intent: IntentType;
  confidence: number;
  parameters: Record<string, any>;
  suggestedResponse: string;
}

// قاموس الكلمات المفتاحية مع دعم الترادف واللهجات
const intentKeywords: Record<IntentType, string[]> = {
  sensor_data: [
    'مستشعر', 'سينسور', 'sensor', 'قراءة', 'قيمة', 'درجة حرارة', 'حرارة', 'سخونة', 'دافي', 'برد', 'temperature',
    'رطوبة', 'humidity', 'ضغط', 'pressure', 'soil', 'تربة', 'moisture', 'رطوبة التربة',
    'rs485', 'modbus', 'tcp', 'حالة', 'وضع', 'status', 'online', 'offline', 'متصل', 'غير متصل',
  ],
  database_query: [
    'قاعدة بيانات', 'database', 'بيانات', 'data', 'سجل', 'سجلات', 'تاريخ', 'history',
    'آخر', 'أحدث', 'latest', 'جدول', 'table', 'استعلام', 'query', 'عدد', 'كم', 'محفوظ',
  ],
  system_status: [
    'نظام', 'system', 'حالة النظام', 'اتصال', 'connection', 'شبكة', 'network',
    'خطأ', 'error', 'مشكلة', 'problem', 'يعمل', 'working', 'متصل', 'connected', 'تعطل', 'توقف',
  ],
  general_info: [
    'مساعدة', 'help', 'كيف', 'how', 'ماذا', 'what', 'متى', 'when',
    'أين', 'where', 'لماذا', 'why', 'شرح', 'explain', 'معلومات', 'info', 'إنتاجية', 'زيادة',
  ],
  irrigation: [
    'ري', 'سقي', 'ماء', 'watering', 'irrigation', 'متى أروي', 'كم أروي', 'احتياج الماء', 'عطش', 'جفاف', 'بلل',
    'موعد الري', 'كمية الماء', 'اسقي', 'اروِ', 'ارو', 'سقاية',
  ],
  fertilization: [
    'تسميد', 'سماد', 'fertilizer', 'متى أسمد', 'كم أسمد', 'احتياج السماد', 'تسميد', 'سماد عضوي', 'سماد كيميائي',
    'موعد التسميد', 'كمية السماد', 'أسمدة', 'سماد npk', 'سماد يوريا',
  ],
};

// بيانات وهمية للمستشعرات
const mockSensorData: SensorData[] = [
  {
    id: 'temp_01',
    temperature: 25.5,
    humidity: 65.2,
    soilMoisture: 70,
    ph: 6.5,
    nitrogen: 80,
    phosphorus: 50,
    potassium: 60,
    conductivity: 1.2,
    timestamp: new Date(),
  },
  {
    id: 'humidity_01',
    temperature: 25.5,
    humidity: 65.2,
    soilMoisture: 70,
    ph: 6.5,
    nitrogen: 80,
    phosphorus: 50,
    potassium: 60,
    conductivity: 1.2,
    timestamp: new Date(),
  },
  {
    id: 'soil_01',
    temperature: 25.5,
    humidity: 65.2,
    soilMoisture: 70,
    ph: 6.5,
    nitrogen: 80,
    phosphorus: 50,
    potassium: 60,
    conductivity: 1.2,
    timestamp: new Date(),
  },
];

// تحليل النية
const analyzeIntent = (text: string): IntentType => {
  const lowerText = text.toLowerCase();

  // كلمات تدل بقوة على قراءة المستشعر
  const sensorPriorityWords = [
    'كم', 'ما هي', 'أعطني', 'قيمة', 'درجة حرارة', 'حرارة', 'رطوبة', 'التربة', 'الآن', 'الحالية', 'الحين', 'current', 'now', 'reading', 'value', 'temperature', 'humidity', 'soil', 'moisture'
  ];
  let sensorScore = sensorPriorityWords.reduce((acc, word) => acc + (lowerText.includes(word) ? 1 : 0), 0);

  // إذا فيه كلمة تدل على sensor_data بشكل واضح، أعطِ أولوية
  if (sensorScore > 0) {
    return 'sensor_data';
  }

  // باقي المنطق كما هو
  let maxScore = 0;
  let detectedIntent: IntentType = 'general_info';
  Object.entries(intentKeywords).forEach(([intent, keywords]) => {
    const score = keywords.reduce((acc, keyword) => acc + (lowerText.includes(keyword.toLowerCase()) ? 1 : 0), 0);
    if (score > maxScore) {
      maxScore = score;
      detectedIntent = intent as IntentType;
    }
  });
  return detectedIntent;
};

// استخراج المعاملات
const extractParameters = (text: string, intent: IntentType) => {
  const parameters: Record<string, any> = {};
  const lowerText = text.toLowerCase();

  // استخراج اسم المحصول من السؤال (عربي أو إنجليزي أو جزء من الكلمة)
  const cropNames = cropDB.map(c => [c.nameAr, c.name]).flat();
  for (const crop of cropDB) {
    if (
      crop.nameAr && lowerText.includes(crop.nameAr.toLowerCase()) ||
      crop.name && lowerText.includes(crop.name.toLowerCase()) ||
      (crop.nameAr && crop.nameAr.length > 3 && lowerText.includes(crop.nameAr.slice(1, 4))) ||
      (crop.name && crop.name.length > 3 && lowerText.includes(crop.name.slice(1, 4).toLowerCase()))
    ) {
      parameters.crop = crop.nameAr;
      break;
    }
  }

  switch (intent) {
    case 'sensor_data':
      if (lowerText.includes('درجة حرارة') || lowerText.includes('حرارة') || lowerText.includes('temperature')) {
        parameters.sensorType = 'temperature';
      }
      if (lowerText.includes('رطوبة') || lowerText.includes('humidity')) {
        parameters.sensorType = 'humidity';
      }
      if (lowerText.includes('ضغط') || lowerText.includes('pressure')) {
        parameters.sensorType = 'pressure';
      }
      if (lowerText.includes('تربة') || lowerText.includes('soil')) {
        parameters.sensorType = 'soilMoisture';
      }
      // كلمات تدل على القيم المثالية
      if (lowerText.includes('مثلى') || lowerText.includes('المثلى') || lowerText.includes('المناسبة') || lowerText.includes('المناسب') || lowerText.includes('الحدود')) {
        parameters.askingIdeal = true;
      }
      break;
    case 'database_query':
      if (lowerText.includes('آخر') || lowerText.includes('أحدث') || lowerText.includes('latest')) {
        parameters.timeFilter = 'latest';
      }
      if (lowerText.includes('تاريخ') || lowerText.includes('history')) {
        parameters.includeHistory = true;
      }
      break;
    case 'irrigation':
    case 'fertilization':
      // نفس منطق المحصول
      break;
  }
  return parameters;
};

// توليد الاستجابة
const generateResponse = (intent: IntentType, parameters: Record<string, any>) => {
  // إذا كان السؤال عن القيم المثالية لمحصول
  if (intent === 'sensor_data' && parameters.crop && parameters.askingIdeal) {
    const crop = cropDB.find(c => c.nameAr === parameters.crop || c.name === parameters.crop);
    if (crop) {
      let value = '';
      if (parameters.sensorType === 'temperature') {
        value = `درجة الحرارة المثلى لمحصول ${crop.nameAr}: من ${crop.tempMin}°C إلى ${crop.tempMax}°C.`;
      } else if (parameters.sensorType === 'humidity') {
        value = `الرطوبة المثلى لمحصول ${crop.nameAr}: من ${crop.humidityMin} إلى ${crop.humidityMax} مم مطر سنويًا.`;
      } else if (parameters.sensorType === 'soilMoisture') {
        value = `رطوبة التربة المثلى لمحصول ${crop.nameAr}: ${crop.soilMoistureMin} - ${crop.soilMoistureMax}%.`;
      } else if (parameters.sensorType === 'ph') {
        value = `درجة الحموضة (pH) المثلى لمحصول ${crop.nameAr}: من ${crop.phMin} إلى ${crop.phMax}.`;
      } else {
        value = `القيم المثالية لمحصول ${crop.nameAr}:\n- درجة الحرارة: ${crop.tempMin}°C إلى ${crop.tempMax}°C\n- الرطوبة: ${crop.humidityMin} إلى ${crop.humidityMax} مم مطر سنويًا\n- pH: ${crop.phMin} إلى ${crop.phMax}`;
      }
      return value;
    }
  }

  // إذا كان السؤال عن قراءة حالية لمحصول أو مستشعر
  if (intent === 'sensor_data' && parameters.sensorType) {
    const sensor = mockSensorData[0];
    if (parameters.sensorType === 'temperature') {
      return `درجة الحرارة الحالية: ${sensor.temperature}°C.`;
    }
    if (parameters.sensorType === 'humidity') {
      return `نسبة الرطوبة الحالية: ${sensor.humidity}%.`;
    }
    if (parameters.sensorType === 'soilMoisture') {
      return `رطوبة التربة الحالية: ${sensor.soilMoisture}%.`;
    }
    if (parameters.sensorType === 'pressure') {
      return `ضغط جوي تقريبي: 1013 hPa.`;
    }
  }

  // إذا كان السؤال عن محصول فقط
  if (parameters.crop) {
    const crop = cropDB.find(c => c.nameAr === parameters.crop || c.name === parameters.crop);
    if (crop) {
      return `معلومات عن ${crop.nameAr}:\n- درجة الحرارة المثلى: ${crop.tempMin}°C إلى ${crop.tempMax}°C\n- الرطوبة المثلى: ${crop.humidityMin} إلى ${crop.humidityMax} مم مطر سنويًا\n- pH: ${crop.phMin} إلى ${crop.phMax}`;
    }
  }

  // باقي المنطق كما هو
  switch (intent) {
    case 'sensor_data': {
      return `جميع المستشعرات تعمل بشكل طبيعي:\n- درجة الحرارة: ${mockSensorData[0].temperature}°C\n- الرطوبة: ${mockSensorData[0].humidity}%\n- رطوبة التربة: ${mockSensorData[0].soilMoisture}%`;
    }
    case 'database_query':
      return `تم العثور على ${Math.floor(Math.random() * 100) + 50} سجل في قاعدة البيانات.\nآخر تحديث: ${new Date().toLocaleString('ar-EG')}`;
    case 'system_status':
      return `حالة النظام: يعمل ✅\nالاتصال بالشبكة: مستقر\nالمستشعرات: متصلة\nقاعدة البيانات: متصلة`;
    case 'irrigation': {
      const crop = parameters.crop || 'المحصول';
      return `ينصح بري ${crop} اليوم بسبب ارتفاع الحرارة. كمية الماء الموصى بها: 20 لتر/دونم.`;
    }
    case 'fertilization': {
      const crop = parameters.crop || 'المحصول';
      return `يفضل إضافة سماد نيتروجيني لـ${crop}. الكمية الموصى بها: 5 كغ/دونم.`;
    }
    case 'general_info':
    default:
      return `مرحباً! أنا مساعد ذكي لنظام الزراعة. أستطيع مساعدتك في:\n- الاستعلام عن بيانات المستشعرات\n- البحث في قاعدة البيانات\n- فحص حالة النظام\n- إرشادات الري والتسميد\nكيف يمكنني مساعدتك اليوم؟`;
  }
};

export const useQuestionAnalyzer = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeQuestion = useCallback(async (questionText: string): Promise<QuestionAnalysis> => {
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      const processedText = questionText.trim();
      const intent = analyzeIntent(processedText);
      const parameters = extractParameters(processedText, intent);
      const suggestedResponse = generateResponse(intent, parameters);
      const matchingKeywords = intentKeywords[intent].filter(keyword => processedText.toLowerCase().includes(keyword.toLowerCase()));
      const confidence = Math.min(0.95, Math.max(0.6, matchingKeywords.length * 0.18));
      return {
        originalText: questionText,
        processedText,
        intent,
        confidence,
        parameters,
        suggestedResponse,
      };
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    analyzeQuestion,
    isAnalyzing,
    mockSensorData,
  };
}; 