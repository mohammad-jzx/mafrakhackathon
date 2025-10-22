import type { SensorData } from '../types';

// عنوان خادم التنبؤ بالآفات
const PEST_API_URL = 'http://localhost:4001/api';

// مكتبة XGBoost ستحتاج إلى تثبيتها في المشروع
// npm install xgboost

// دالة لتحميل وتجهيز البيانات الزراعية
export async function loadAgriculturalData(filePath: string): Promise<any[]> {
  try {
    const response = await fetch(filePath);
    const data = await response.json();
    console.log('تم تحميل البيانات الزراعية بنجاح');
    return data;
  } catch (error) {
    console.error('خطأ في تحميل البيانات:', error);
    throw error;
  }
}

// تحويل البيانات إلى تنسيق مناسب لـ XGBoost
export function prepareDataForXGBoost(data: any[], features: string[], targetColumn: string) {
  const X: number[][] = [];
  const y: number[] = [];
  
  data.forEach(row => {
    const featureRow: number[] = [];
    features.forEach(feature => {
      featureRow.push(parseFloat(row[feature]));
    });
    X.push(featureRow);
    y.push(parseFloat(row[targetColumn]));
  });
  
  return { X, y };
}

// تقسيم البيانات إلى مجموعات تدريب واختبار
export function splitData(X: number[][], y: number[], testRatio = 0.2) {
  const numSamples = X.length;
  const numTest = Math.floor(numSamples * testRatio);
  const indices = Array.from({ length: numSamples }, (_, i) => i);
  
  // خلط المؤشرات عشوائياً
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  
  const testIndices = indices.slice(0, numTest);
  const trainIndices = indices.slice(numTest);
  
  const X_train = trainIndices.map(i => X[i]);
  const y_train = trainIndices.map(i => y[i]);
  const X_test = testIndices.map(i => X[i]);
  const y_test = testIndices.map(i => y[i]);
  
  return { X_train, y_train, X_test, y_test };
}

// محاكاة تدريب نموذج XGBoost (بدون استخدام المكتبة الفعلية)
export async function trainXGBoostModel(
  X_train: number[][], 
  y_train: number[], 
  params: Record<string, any> = {}
): Promise<any> {
  // تكوين معلمات XGBoost
  const defaultParams = {
    objective: 'reg:squarederror',
    eta: 0.1,
    max_depth: 6,
    subsample: 0.8,
    colsample_bytree: 0.8,
    eval_metric: 'rmse',
    silent: 1,
    nthread: 4
  };
  
  const modelParams = { ...defaultParams, ...params };
  
  // هذه محاكاة للنموذج، في التطبيق الحقيقي سيتم استخدام XGBoost
  console.log('تدريب نموذج XGBoost...', { modelParams, dataLength: X_train.length });
  
  // إرجاع نموذج محاكي
  return {
    predict: async (data: number[][]) => {
      // محاكاة التنبؤ: في التطبيق الحقيقي سيتم استخدام النموذج المدرب
      return data.map(features => {
        const temperature = features[0] || 25;
        const humidity = features[1] || 65;
        const rainfall = features[2] || 100;
        const soilMoisture = features[3] || 40;
        
        // محاكاة حساب احتمالية الآفات بناءً على الخصائص
        const pestProbabilities = {
          aphids: Math.min(90, (humidity * 0.8 + temperature * 0.5)) / 100,
          fungalBlight: Math.min(90, (humidity * 1.2 - temperature * 0.3 + rainfall * 0.2)) / 100,
          thrips: Math.min(75, (temperature * 1.5 - humidity * 0.2 + rainfall * 0.1)) / 100,
          spiderMites: Math.min(80, (temperature * 1.8 - humidity * 0.5 - soilMoisture * 0.2)) / 100,
          whiteflies: Math.min(85, (temperature * 1.2 + humidity * 0.4 - rainfall * 0.1)) / 100,
          leafMiners: Math.min(70, (temperature * 0.9 + humidity * 0.3 - soilMoisture * 0.2)) / 100,
          rootRot: Math.min(75, (soilMoisture * 1.5 - temperature * 0.2 + humidity * 0.3)) / 100,
          powderyMildew: Math.min(80, (humidity * 1.4 - temperature * 0.1 + rainfall * 0.3)) / 100
        };
        
        return pestProbabilities;
      });
    },
    save: async (path: string) => {
      console.log(`تم حفظ النموذج في ${path} (محاكاة)`);
      return true;
    }
  };
}

// محاكاة تقييم أداء النموذج
export async function evaluateModel(model: any, X_test: number[][], y_test: number[]) {
  const predictions = await model.predict(X_test);
  
  // في التطبيق الحقيقي، سيتم استخدام التنبؤات الفعلية
  // هنا نحن نعيد قيمًا محاكاة
  
  return {
    predictions,
    metrics: {
      mse: 0.15,
      rmse: 0.39,
      r2: 0.85
    }
  };
}

// التحقق من حالة خادم التنبؤ بالآفات
export async function checkPredictionServerStatus(): Promise<boolean> {
  try {
    const response = await fetch(`${PEST_API_URL}/status`);
    const data = await response.json();
    return data.status === 'running' && data.modelLoaded;
  } catch (error) {
    console.error('خطأ في الاتصال بخادم التنبؤ بالآفات:', error);
    return false;
  }
}

// استخدام النموذج للتنبؤ باحتمالية الآفات
export async function predictPests(model: any, currentData: SensorData, cropType?: string) {
  try {
    // إرسال بيانات المستشعرات إلى خادم التنبؤ
    const response = await fetch(`${PEST_API_URL}/predict-pests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        temperature: currentData.temperature,
        humidity: currentData.humidity,
        soilMoisture: currentData.soilMoisture,
        ph: currentData.ph,
        nitrogen: currentData.nitrogen,
        phosphorus: currentData.phosphorus,
        potassium: currentData.potassium,
        cropType: cropType || 'عام'
      }),
    });

    if (!response.ok) {
      throw new Error(`فشل الاتصال بـ API: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    // ضمان وجود كافة الحقول في النتائج
    const predictions = {
      aphids: data.predictions.aphids || 0,
      fungalBlight: data.predictions.fungalBlight || 0,
      thrips: data.predictions.thrips || 0,
      spiderMites: data.predictions.spiderMites || 0,
      whiteflies: data.predictions.whiteflies || 0.3,
      leafMiners: data.predictions.leafMiners || 0.25,
      rootRot: data.predictions.rootRot || 0.2,
      powderyMildew: data.predictions.powderyMildew || 0.15
    };
    
    // إرجاع التنبؤات
    return predictions;
  } catch (error) {
    console.error('خطأ في التنبؤ بالآفات:', error);
    
    // إذا فشل الاتصال بالخادم، استخدم نموذجًا محليًا بسيطًا
    return {
      aphids: calculateLocalAphidProbability(currentData, cropType),
      fungalBlight: calculateLocalFungalBlightProbability(currentData, cropType),
      thrips: calculateLocalThripsProbability(currentData, cropType),
      spiderMites: calculateLocalSpiderMitesProbability(currentData, cropType),
      whiteflies: calculateLocalWhitefliesProbability(currentData, cropType) || 0.3,
      leafMiners: calculateLocalLeafMinersProbability(currentData, cropType) || 0.25,
      rootRot: calculateLocalRootRotProbability(currentData, cropType) || 0.2,
      powderyMildew: calculateLocalPowderyMildewProbability(currentData, cropType) || 0.15
    };
  }
}

// دالات محلية للتنبؤ البسيط في حالة فشل الاتصال بالخادم
// تم تحديث الدوال لتأخذ نوع المحصول بعين الاعتبار
function calculateLocalAphidProbability(data: SensorData, cropType?: string): number {
  // معاملات للمحاصيل المختلفة
  const cropFactors: Record<string, number> = {
    'طماطم': 1.2,
    'خيار': 1.1,
    'فلفل': 0.9,
    'بطاطا': 0.8,
    'فراولة': 1.3,
    'بصل': 0.6,
    'ذرة': 0.7,
    'قمح': 0.5,
    'خس': 1.4,
    'جزر': 0.6,
    'باذنجان': 1.0,
    'بطيخ': 1.1
  };

  // الحصول على معامل المحصول أو استخدام 1.0 كقيمة افتراضية
  const cropFactor = cropType && cropFactors[cropType] ? cropFactors[cropType] : 1.0;
  
  // حساب الاحتمالية مع مراعاة نوع المحصول
  return Math.min(0.85, (data.humidity * 0.008 + data.temperature * 0.005) * cropFactor);
}

function calculateLocalFungalBlightProbability(data: SensorData, cropType?: string): number {
  // معاملات للمحاصيل المختلفة
  const cropFactors: Record<string, number> = {
    'طماطم': 1.3,
    'خيار': 1.2,
    'فلفل': 1.1,
    'بطاطا': 1.5,
    'فراولة': 1.3,
    'بصل': 0.8,
    'ذرة': 0.9,
    'قمح': 1.0,
    'خس': 1.4,
    'جزر': 0.7,
    'باذنجان': 1.1,
    'بطيخ': 1.0
  };
  
  const cropFactor = cropType && cropFactors[cropType] ? cropFactors[cropType] : 1.0;
  return Math.min(0.9, (data.humidity * 0.012 - data.temperature * 0.003) * cropFactor);
}

function calculateLocalThripsProbability(data: SensorData, cropType?: string): number {
  const cropFactors: Record<string, number> = {
    'طماطم': 1.1,
    'خيار': 1.2,
    'فلفل': 1.3,
    'بطاطا': 0.9,
    'فراولة': 1.1,
    'بصل': 1.0,
    'ذرة': 0.8,
    'قمح': 0.6,
    'خس': 1.2,
    'جزر': 0.7,
    'باذنجان': 1.2,
    'بطيخ': 1.1
  };
  
  const cropFactor = cropType && cropFactors[cropType] ? cropFactors[cropType] : 1.0;
  return Math.min(0.75, (data.temperature * 0.015 - data.humidity * 0.002) * cropFactor);
}

function calculateLocalSpiderMitesProbability(data: SensorData, cropType?: string): number {
  const cropFactors: Record<string, number> = {
    'طماطم': 1.2,
    'خيار': 1.3,
    'فلفل': 1.1,
    'بطاطا': 0.7,
    'فراولة': 1.4,
    'بصل': 0.5,
    'ذرة': 0.6,
    'قمح': 0.5,
    'خس': 1.0,
    'جزر': 0.6,
    'باذنجان': 1.2,
    'بطيخ': 1.3
  };
  
  const cropFactor = cropType && cropFactors[cropType] ? cropFactors[cropType] : 1.0;
  return Math.min(0.8, (data.temperature * 0.018 - data.humidity * 0.005) * cropFactor);
}

// دالات للآفات الجديدة
function calculateLocalWhitefliesProbability(data: SensorData, cropType?: string): number {
  const cropFactors: Record<string, number> = {
    'طماطم': 1.4,
    'خيار': 1.3,
    'فلفل': 1.2,
    'بطاطا': 0.9,
    'فراولة': 1.0,
    'بصل': 0.6,
    'ذرة': 0.7,
    'قمح': 0.5,
    'خس': 1.2,
    'جزر': 0.6,
    'باذنجان': 1.3,
    'بطيخ': 1.2
  };
  
  const cropFactor = cropType && cropFactors[cropType] ? cropFactors[cropType] : 1.0;
  return Math.min(0.85, (data.temperature * 0.012 + data.humidity * 0.004 - data.soilMoisture * 0.002) * cropFactor);
}

function calculateLocalLeafMinersProbability(data: SensorData, cropType?: string): number {
  const cropFactors: Record<string, number> = {
    'طماطم': 1.2,
    'خيار': 1.1,
    'فلفل': 1.0,
    'بطاطا': 0.8,
    'فراولة': 0.9,
    'بصل': 0.7,
    'ذرة': 0.6,
    'قمح': 0.5,
    'خس': 1.3,
    'جزر': 0.7,
    'باذنجان': 1.1,
    'بطيخ': 0.9
  };
  
  const cropFactor = cropType && cropFactors[cropType] ? cropFactors[cropType] : 1.0;
  return Math.min(0.7, (data.temperature * 0.009 + data.humidity * 0.003 - data.soilMoisture * 0.002) * cropFactor);
}

function calculateLocalRootRotProbability(data: SensorData, cropType?: string): number {
  const cropFactors: Record<string, number> = {
    'طماطم': 1.1,
    'خيار': 1.2,
    'فلفل': 1.0,
    'بطاطا': 1.3,
    'فراولة': 1.4,
    'بصل': 0.9,
    'ذرة': 0.8,
    'قمح': 0.7,
    'خس': 1.2,
    'جزر': 1.0,
    'باذنجان': 1.1,
    'بطيخ': 1.3
  };
  
  const cropFactor = cropType && cropFactors[cropType] ? cropFactors[cropType] : 1.0;
  return Math.min(0.75, (data.soilMoisture * 0.015 - data.temperature * 0.002 + data.humidity * 0.003) * cropFactor);
}

function calculateLocalPowderyMildewProbability(data: SensorData, cropType?: string): number {
  const cropFactors: Record<string, number> = {
    'طماطم': 1.1,
    'خيار': 1.3,
    'فلفل': 1.0,
    'بطاطا': 1.2,
    'فراولة': 1.1,
    'بصل': 0.8,
    'ذرة': 0.7,
    'قمح': 0.9,
    'خس': 1.2,
    'جزر': 0.8,
    'باذنجان': 1.0,
    'بطيخ': 1.1
  };
  
  const cropFactor = cropType && cropFactors[cropType] ? cropFactors[cropType] : 1.0;
  return Math.min(0.8, (data.humidity * 0.014 - data.temperature * 0.001 + data.nitrogen * 0.003) * cropFactor);
}

// دالة لتوليد توصيات بناءً على احتمالية الآفات
export function generatePestRecommendations(
  pestProbabilities: Record<string, number>,
  cropType: string
): string[] {
  // استخدام التوصيات المحلية مباشرة
  return getLocalRecommendations(pestProbabilities);
}

// دالة محلية لتوليد التوصيات في حالة فشل الاتصال بالخادم
function getLocalRecommendations(pestProbabilities: Record<string, number>): string[] {
  const recommendations: string[] = [];
  
  if (pestProbabilities.aphids > 0.5) {
    recommendations.push('خطر عالي من المن. يوصى برش مبيدات حشرية متخصصة أو استخدام المكافحة الحيوية.');
  } else if (pestProbabilities.aphids > 0.3) {
    recommendations.push('احتمالية متوسطة لظهور المن. راقب النباتات بانتظام وخاصة أسفل الأوراق.');
  }
  
  if (pestProbabilities.fungalBlight > 0.5) {
    recommendations.push('خطر عالي من العفن الفطري. يوصى بتقليل الرطوبة وتحسين التهوية واستخدام مبيدات فطرية وقائية.');
  } else if (pestProbabilities.fungalBlight > 0.3) {
    recommendations.push('احتمالية متوسطة للإصابة بالعفن الفطري. تأكد من التهوية الجيدة وتجنب الري فوق الأوراق.');
  }
  
  if (pestProbabilities.thrips > 0.5) {
    recommendations.push('خطر عالي من التربس. يوصى باستخدام المصائد اللاصقة الصفراء والرش بالمبيدات المتخصصة.');
  } else if (pestProbabilities.thrips > 0.3) {
    recommendations.push('احتمالية متوسطة لظهور التربس. استخدم المصائد اللاصقة للمراقبة والكشف المبكر.');
  }
  
  if (pestProbabilities.spiderMites > 0.5) {
    recommendations.push('خطر عالي من العناكب الحمراء. يوصى برفع مستوى الرطوبة المحيطة واستخدام مبيدات الأكاروسات.');
  } else if (pestProbabilities.spiderMites > 0.3) {
    recommendations.push('احتمالية متوسطة لظهور العناكب الحمراء. راقب أسفل الأوراق بحثًا عن بقع صفراء أو شبكات عنكبوتية صغيرة.');
  }
  
  // توصيات للآفات الجديدة
  if (pestProbabilities.whiteflies > 0.5) {
    recommendations.push('خطر عالي من الذبابة البيضاء. يوصى باستخدام المصائد اللاصقة الصفراء ورش الزيوت المعدنية أو الصابون.');
  } else if (pestProbabilities.whiteflies > 0.3) {
    recommendations.push('احتمالية متوسطة لظهور الذبابة البيضاء. راقب الجانب السفلي من الأوراق بحثاً عن الحشرات البيضاء الصغيرة.');
  }
  
  if (pestProbabilities.leafMiners > 0.5) {
    recommendations.push('خطر عالي من حفارات الأوراق. يوصى بإزالة الأوراق المصابة وتطبيق المبيدات الجهازية.');
  } else if (pestProbabilities.leafMiners > 0.3) {
    recommendations.push('احتمالية متوسطة لظهور حفارات الأوراق. راقب الأوراق بحثاً عن أنفاق متعرجة داخل أنسجة الورقة.');
  }
  
  if (pestProbabilities.rootRot > 0.5) {
    recommendations.push('خطر عالي من تعفن الجذور. يوصى بتقليل الري وتحسين صرف التربة واستخدام مبيدات فطرية مخصصة للجذور.');
  } else if (pestProbabilities.rootRot > 0.3) {
    recommendations.push('احتمالية متوسطة للإصابة بتعفن الجذور. تأكد من عدم زيادة الري وتحسين تهوية التربة حول الجذور.');
  }
  
  if (pestProbabilities.powderyMildew > 0.5) {
    recommendations.push('خطر عالي من البياض الدقيقي. يوصى برش مبيدات فطرية وقائية وتحسين تدوير الهواء حول النباتات.');
  } else if (pestProbabilities.powderyMildew > 0.3) {
    recommendations.push('احتمالية متوسطة للإصابة بالبياض الدقيقي. قلل من الرطوبة المحيطة وزد المسافة بين النباتات لتحسين التهوية.');
  }
  
  // إضافة توصيات عامة إذا كانت القائمة فارغة
  if (recommendations.length === 0) {
    recommendations.push('المخاطر الحالية للآفات منخفضة. استمر في المراقبة الروتينية للنباتات.');
    recommendations.push('تأكد من التوازن الغذائي للنباتات للحفاظ على مقاومتها للآفات والأمراض.');
  }
  
  return recommendations;
}

// دالة لدمج نموذج التنبؤ مع واجهة المستخدم
export async function initializePestPredictionModel() {
  try {
    console.log('جاري تهيئة نموذج التنبؤ بالآفات...');
    
    // التحقق من حالة خادم التنبؤ
    const serverRunning = await checkPredictionServerStatus();
    
    if (serverRunning) {
      console.log('تم الاتصال بخادم التنبؤ بالآفات بنجاح!');
    } else {
      console.warn('لم يتم العثور على خادم التنبؤ بالآفات، سيتم استخدام النموذج المحلي البسيط.');
    }
    
    // إرجاع كائن النموذج (سواء كان متصلاً بالخادم أم لا)
    return {
      isServerConnected: serverRunning,
      predict: async (data: SensorData, cropType?: string) => {
        // محاولة الحصول على التنبؤات من الخادم إذا كان متاحًا
        if (serverRunning) {
          try {
            return await predictPests(null, data, cropType);
          } catch (error) {
            console.error('فشل التنبؤ باستخدام الخادم، استخدام النموذج المحلي', error);
            // إذا فشل الاتصال، استخدم النموذج المحلي
          }
        }
        
        // استخدام النموذج المحلي (في حالة الفشل أو عدم وجود الخادم)
        // حساب التنبؤات باستخدام النموذج المحلي مع ضمان وجود قيمة لكل آفة
        const predictions = {
          aphids: calculateLocalAphidProbability(data, cropType),
          fungalBlight: calculateLocalFungalBlightProbability(data, cropType),
          thrips: calculateLocalThripsProbability(data, cropType),
          spiderMites: calculateLocalSpiderMitesProbability(data, cropType),
          whiteflies: calculateLocalWhitefliesProbability(data, cropType) || 0.3, // قيمة افتراضية إذا كانت النتيجة غير محددة
          leafMiners: calculateLocalLeafMinersProbability(data, cropType) || 0.25, // قيمة افتراضية إذا كانت النتيجة غير محددة
          rootRot: calculateLocalRootRotProbability(data, cropType) || 0.2, // قيمة افتراضية إذا كانت النتيجة غير محددة
          powderyMildew: calculateLocalPowderyMildewProbability(data, cropType) || 0.15 // قيمة افتراضية إذا كانت النتيجة غير محددة
        };
        
        console.log('تنبؤات النموذج المحلي للمحصول', cropType, ':', predictions);
        return predictions;
      }
    };
  } catch (error) {
    console.error('خطأ في تهيئة نموذج التنبؤ بالآفات:', error);
    
    // إرجاع نموذج محلي بسيط في حالة الفشل مع قيم افتراضية لجميع الآفات
    return {
      isServerConnected: false,
      predict: async (data: SensorData, cropType?: string) => {
        const predictions = {
          aphids: calculateLocalAphidProbability(data, cropType) || 0.4,
          fungalBlight: calculateLocalFungalBlightProbability(data, cropType) || 0.35,
          thrips: calculateLocalThripsProbability(data, cropType) || 0.3,
          spiderMites: calculateLocalSpiderMitesProbability(data, cropType) || 0.25,
          whiteflies: calculateLocalWhitefliesProbability(data, cropType) || 0.3,
          leafMiners: calculateLocalLeafMinersProbability(data, cropType) || 0.25,
          rootRot: calculateLocalRootRotProbability(data, cropType) || 0.2,
          powderyMildew: calculateLocalPowderyMildewProbability(data, cropType) || 0.15
        };
        
        console.log('تنبؤات النموذج البديل للمحصول', cropType, ':', predictions);
        return predictions;
      }
    };
  }
} 