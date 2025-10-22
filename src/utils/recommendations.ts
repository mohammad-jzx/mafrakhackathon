import type { SensorData, Crop, Recommendation } from '../types';

export function generateRecommendations(sensorData: SensorData, crop: Crop): Recommendation {
  // التحقق من وجود البيانات وضمان أنها أرقام صالحة
  const safeData = {
    ...sensorData,
    temperature: sensorData.temperature === null || isNaN(sensorData.temperature as number) ? null : sensorData.temperature,
    humidity: sensorData.humidity === null || isNaN(sensorData.humidity as number) ? null : sensorData.humidity, // رطوبة التربة
    soilMoisture: sensorData.soilMoisture === null || isNaN(sensorData.soilMoisture as number) ? null : sensorData.soilMoisture,
    ph: sensorData.ph === null || isNaN(sensorData.ph as number) ? null : sensorData.ph,
    nitrogen: sensorData.nitrogen === null || isNaN(sensorData.nitrogen as number) ? null : sensorData.nitrogen,
    phosphorus: sensorData.phosphorus === null || isNaN(sensorData.phosphorus as number) ? null : sensorData.phosphorus,
    potassium: sensorData.potassium === null || isNaN(sensorData.potassium as number) ? null : sensorData.potassium,
    conductivity: sensorData.conductivity === null || isNaN(sensorData.conductivity as number) ? null : sensorData.conductivity,
  };

  const recommendations: string[] = [];
  const alerts: Array<{ type: 'خطر' | 'تحذير' | 'إشعار' | 'نجاح'; title?: string; message: string; action?: string; timeframe?: string }> = [];

  try {
    // التحقق من الحاجة إلى الري
    const needsIrrigation = 
      (safeData.soilMoisture !== null && safeData.soilMoisture < (crop.soilMoistureMin || 50)) || 
      (safeData.humidity !== null && safeData.humidity < (crop.soilMoistureMin || 50)); // رطوبة التربة
    
    if (needsIrrigation) {
      recommendations.push('💧 يحتاج النبات إلى ري فوري');
      alerts.push({ type: 'خطر', title: 'نقص الرطوبة', message: 'مستوى رطوبة التربة منخفض جداً، يحتاج إلى ري فوري', action: 'قم بري المحصول في أقرب وقت' });
    }

    // التحقق من الحاجة إلى العناصر الغذائية
    const needsNitrogen = safeData.nitrogen !== null && safeData.nitrogen < (crop.nitrogenMin || 50);
    const needsPhosphorus = safeData.phosphorus !== null && safeData.phosphorus < (crop.phosphorusMin || 30);
    const needsPotassium = safeData.potassium !== null && safeData.potassium < (crop.potassiumMin || 80);

    if (needsNitrogen) {
      recommendations.push('🧪 يحتاج إلى سماد نيتروجيني');
    }
    if (needsPhosphorus) {
      recommendations.push('🧪 يحتاج إلى سماد فسفوري');
    }
    if (needsPotassium) {
      recommendations.push('🧪 يحتاج إلى سماد بوتاسيومي');
    }

    // التحقق من درجة حموضة التربة
    let soilPhStatus: 'مناسب' | 'حامضي' | 'قلوي' = 'مناسب';
    if (safeData.ph !== null) {
      if (safeData.ph < (crop.phMin || 6.0)) {
        soilPhStatus = 'حامضي';
        recommendations.push('⚗️ التربة حامضية - أضف الجير');
        alerts.push({ type: 'تحذير', title: 'حموضة التربة', message: 'التربة حامضية جداً، يُنصح بإضافة الجير لتعديل الحموضة', action: 'أضف الجير الزراعي بمعدل 500-1000 كجم/هكتار' });
      } else if (safeData.ph > (crop.phMax || 7.5)) {
        soilPhStatus = 'قلوي';
        recommendations.push('⚗️ التربة قلوية - أضف الكبريت');
        alerts.push({ type: 'تحذير', title: 'قلوية التربة', message: 'التربة قلوية جداً، يُنصح بإضافة الكبريت لتعديل القلوية', action: 'أضف الكبريت الزراعي بمعدل 200-400 كجم/هكتار' });
      }
    }

    // التحقق من درجة الحرارة
    let temperatureStatus: 'مناسب' | 'منخفض' | 'مرتفع' = 'مناسب';
    if (safeData.temperature !== null) {
      if (safeData.temperature < (crop.tempMin || 15)) {
        temperatureStatus = 'منخفض';
        recommendations.push('🌡️ درجة الحرارة منخفضة للمحصول');
        alerts.push({ type: 'تحذير', title: 'برودة شديدة', message: 'درجة الحرارة منخفضة عن الحد المناسب للمحصول', action: 'يمكن استخدام البيوت المحمية أو أغطية المحاصيل إذا كان ذلك ممكناً' });
      } else if (safeData.temperature > (crop.tempMax || 35)) {
        temperatureStatus = 'مرتفع';
        recommendations.push('🌡️ درجة الحرارة مرتفعة - قد يحتاج تظليل');
        alerts.push({ type: 'خطر', title: 'إجهاد حراري', message: 'إجهاد حراري محتمل للمحصول بسبب ارتفاع درجة الحرارة', action: 'وفر التظليل المناسب وزيادة معدل الري' });
      }
    }

    // التحقق من الرطوبة
    let humidityStatus: 'مناسب' | 'منخفض' | 'مرتفع' = 'مناسب';
    // ملاحظة: لا نستخدم humidity هنا لأنها رطوبة تربة وليست رطوبة جوية
    // الرطوبة الجوية تأتي من API الطقس وليس من المستشعر
    
    // تحديد الحالة العامة
    const issueFlags = [
      needsIrrigation,
      needsNitrogen,
      needsPhosphorus,
      needsPotassium,
      soilPhStatus !== 'مناسب',
      temperatureStatus !== 'مناسب'
      // حذفنا humidityStatus !== 'مناسب' لأننا لا نستخدم الرطوبة الجوية من المستشعر
    ];
    
    // فقط اعتبار الحالات التي لها قيم (غير null)
    const issuesCount = issueFlags.filter(Boolean).length;
    
    // إضافة توصية إذا كانت جميع القيم غائبة
    if (Object.values(safeData).every(value => value === null || value === undefined || (typeof value === 'number' && isNaN(value)))) {
      recommendations.push('⚠️ لا توجد بيانات مستشعر متاحة، تعذر إجراء تحليل دقيق');
      alerts.push({ type: 'إشعار', title: 'بيانات ناقصة', message: 'لا توجد قراءات من المستشعر، يرجى التحقق من اتصال المستشعر' });
    }

    let overallStatus: 'ممتاز' | 'جيد' | 'يحتاج عناية' | 'يحتاج تدخل فوري';
    
    if (issuesCount === 0) {
      overallStatus = 'ممتاز';
      recommendations.push('✅ جميع المؤشرات في المعدل المثالي!');
      alerts.push({ type: 'نجاح', title: 'ظروف مثالية', message: 'الظروف مثالية للنمو، استمر في الرعاية الحالية للمحصول' });
    } else if (issuesCount <= 2) {
      overallStatus = 'جيد';
    } else if (issuesCount <= 4) {
      overallStatus = 'يحتاج عناية';
    } else {
      overallStatus = 'يحتاج تدخل فوري';
      alerts.push({ type: 'خطر', title: 'تحذير خطير', message: 'عدة مشاكل تحتاج تدخل فوري لإنقاذ المحصول', action: 'تطبيق الإجراءات الموصى بها بأسرع وقت ممكن', timeframe: 'خلال 24 ساعة' });
    }

    return {
      needsIrrigation,
      needsNitrogen,
      needsPhosphorus,
      needsPotassium,
      soilPhStatus,
      temperatureStatus,
      humidityStatus,
      overallStatus,
      recommendations,
      alerts
    };
  } catch (error) {
    console.error("Error in generateRecommendations:", error);
    // إرجاع توصية افتراضية في حالة حدوث خطأ
    return {
      needsIrrigation: false,
      needsNitrogen: false,
      needsPhosphorus: false,
      needsPotassium: false,
      soilPhStatus: 'مناسب',
      temperatureStatus: 'مناسب',
      humidityStatus: 'مناسب',
      overallStatus: 'جيد',
      recommendations: ['⚠️ حدث خطأ في تحليل البيانات، يرجى المحاولة مرة أخرى'],
      alerts: [{ type: 'إشعار', message: 'حدث خطأ في تحليل البيانات، يرجى المحاولة مرة أخرى' }]
    };
  }
}