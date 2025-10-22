import { Crop, CropRecommendation, EnvironmentalInputs } from '../types/crop';

// وزن كل معيار في الخوارزمية
const WEIGHTS = {
  ph: 0.30,        // 30%
  temperature: 0.20, // 20%
  rainfall: 0.20,    // 20%
  soilType: 0.10,    // 10%
  season: 0.10,      // 10%
  rotation: 0.10     // 10%
};

// أنواع التربة المختلفة
const SOIL_TYPES = [
  'طينية',
  'رملية', 
  'طميية',
  'صخرية',
  'عضوية'
];

// الشهور بالعربية
const ARABIC_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

// قاعدة بيانات افتراضية للمحاصيل التي لها بيانات ناقصة
const DEFAULT_CROP_DATA: { [key: string]: Partial<Crop> } = {
  'نخيل تمر': {
    ph_min: 7.0, ph_max: 8.5,
    temp_min: 20, temp_max: 45,
    rain_min: 100, rain_max: 400,
    growing_season: ['مارس', 'أبريل', 'مايو'],
    soil_type: 'رملية'
  },
  'القطن': {
    ph_min: 5.8, ph_max: 8.0,
    temp_min: 20, temp_max: 35,
    rain_min: 500, rain_max: 1200,
    growing_season: ['أبريل', 'مايو', 'يونيو'],
    soil_type: 'طينية'
  },
  'الذرة': {
    ph_min: 5.5, ph_max: 7.5,
    temp_min: 18, temp_max: 30,
    rain_min: 400, rain_max: 1200,
    growing_season: ['مارس', 'أبريل', 'مايو'],
    soil_type: 'طميية'
  },
  'الحمضيات': {
    ph_min: 6.0, ph_max: 7.5,
    temp_min: 15, temp_max: 30,
    rain_min: 600, rain_max: 1200,
    growing_season: ['فبراير', 'مارس', 'أبريل'],
    soil_type: 'طميية'
  },
  'فول سوداني': {
    ph_min: 5.8, ph_max: 6.2,
    temp_min: 20, temp_max: 30,
    rain_min: 500, rain_max: 1000,
    growing_season: ['أبريل', 'مايو'],
    soil_type: 'رملية'
  },
  'فلفل حلو': {
    ph_min: 6.0, ph_max: 7.0,
    temp_min: 18, temp_max: 27,
    rain_min: 400, rain_max: 700,
    growing_season: ['مارس', 'أبريل', 'مايو'],
    soil_type: 'طميية'
  },
  'عنب': {
    ph_min: 6.0, ph_max: 7.5,
    temp_min: 15, temp_max: 25,
    rain_min: 400, rain_max: 800,
    growing_season: ['فبراير', 'مارس'],
    soil_type: 'طميية'
  },
  'برتقال': {
    ph_min: 6.0, ph_max: 7.5,
    temp_min: 15, temp_max: 30,
    rain_min: 600, rain_max: 1200,
    growing_season: ['فبراير', 'مارس', 'أبريل'],
    soil_type: 'طميية'
  },
  'فصة': {
    ph_min: 6.5, ph_max: 8.0,
    temp_min: 15, temp_max: 30,
    rain_min: 400, rain_max: 800,
    growing_season: ['سبتمبر', 'أكتوبر', 'نوفمبر'],
    soil_type: 'طميية'
  },
  'تفاح': {
    ph_min: 6.0, ph_max: 7.0,
    temp_min: 10, temp_max: 25,
    rain_min: 600, rain_max: 1000,
    growing_season: ['فبراير', 'مارس'],
    soil_type: 'طميية'
  },
  'مشمش': {
    ph_min: 6.0, ph_max: 7.5,
    temp_min: 15, temp_max: 25,
    rain_min: 400, rain_max: 800,
    growing_season: ['فبراير', 'مارس'],
    soil_type: 'طميية'
  },
  'خوخ': {
    ph_min: 6.0, ph_max: 7.0,
    temp_min: 15, temp_max: 25,
    rain_min: 500, rain_max: 900,
    growing_season: ['فبراير', 'مارس'],
    soil_type: 'طميية'
  },
  'رمان': {
    ph_min: 5.5, ph_max: 7.5,
    temp_min: 15, temp_max: 35,
    rain_min: 300, rain_max: 600,
    growing_season: ['فبراير', 'مارس', 'أبريل'],
    soil_type: 'طميية'
  },
  'ليمون': {
    ph_min: 6.0, ph_max: 7.5,
    temp_min: 15, temp_max: 30,
    rain_min: 600, rain_max: 1200,
    growing_season: ['فبراير', 'مارس', 'أبريل'],
    soil_type: 'طميية'
  },
  'نعناع': {
    ph_min: 6.0, ph_max: 7.5,
    temp_min: 15, temp_max: 25,
    rain_min: 500, rain_max: 800,
    growing_season: ['مارس', 'أبريل', 'مايو'],
    soil_type: 'طميية'
  },
  'ذرة رفيعة': {
    ph_min: 6.0, ph_max: 8.5,
    temp_min: 25, temp_max: 35,
    rain_min: 400, rain_max: 800,
    growing_season: ['أبريل', 'مايو', 'يونيو'],
    soil_type: 'طينية'
  }
};

/**
 * دمج البيانات الافتراضية مع بيانات المحصول
 */
function enrichCropData(crop: Crop): Crop {
  const defaultData = DEFAULT_CROP_DATA[crop.name];
  if (defaultData && (crop.ph_min === 0 || crop.temp_min === 0 || crop.rain_min === 0)) {
    return {
      ...crop,
      ...defaultData,
      // الحفاظ على البيانات الموجودة إذا كانت صحيحة
      ph_min: crop.ph_min > 0 ? crop.ph_min : defaultData.ph_min || 6.0,
      ph_max: crop.ph_max > 0 ? crop.ph_max : defaultData.ph_max || 7.5,
      temp_min: crop.temp_min > 0 ? crop.temp_min : defaultData.temp_min || 20,
      temp_max: crop.temp_max > 0 ? crop.temp_max : defaultData.temp_max || 30,
      rain_min: crop.rain_min > 0 ? crop.rain_min : defaultData.rain_min || 400,
      rain_max: crop.rain_max > 0 ? crop.rain_max : defaultData.rain_max || 800,
      growing_season: crop.growing_season && crop.growing_season.length > 0 
        ? crop.growing_season 
        : defaultData.growing_season || ['مارس', 'أبريل'],
      soil_type: crop.soil_type || defaultData.soil_type || ''
    };
  }
  return crop;
}

/**
 * حساب نقاط الملاءمة لدرجة الحموضة مع تحسينات
 */
function calculatePHScore(cropPHMin: number, cropPHMax: number, actualPH: number): number {
  if (cropPHMin === 0 && cropPHMax === 0) return 60; // بيانات غير مكتملة
  
  if (actualPH >= cropPHMin && actualPH <= cropPHMax) {
    // نقاط إضافية إذا كانت القيمة في المنتصف
    const midPoint = (cropPHMin + cropPHMax) / 2;
    const distanceFromMid = Math.abs(actualPH - midPoint);
    const range = cropPHMax - cropPHMin;
    return 100 - (distanceFromMid / range) * 10;
  }
  
  // حساب المسافة من النطاق المثالي
  const distanceFromRange = Math.min(
    Math.abs(actualPH - cropPHMin),
    Math.abs(actualPH - cropPHMax)
  );
  
  // تقليل العقوبة للقيم القريبة
  return Math.max(0, 100 - (distanceFromRange * 15));
}

/**
 * حساب نقاط الملاءمة لدرجة الحرارة مع تحسينات
 */
function calculateTemperatureScore(cropTempMin: number, cropTempMax: number, actualTemp: number): number {
  if (cropTempMin === 0 && cropTempMax === 0) return 60; // بيانات غير مكتملة
  
  if (actualTemp >= cropTempMin && actualTemp <= cropTempMax) {
    // نقاط إضافية للقيم المثالية
    const midPoint = (cropTempMin + cropTempMax) / 2;
    const distanceFromMid = Math.abs(actualTemp - midPoint);
    const range = cropTempMax - cropTempMin;
    return 100 - (distanceFromMid / range) * 5;
  }
  
  const distanceFromRange = Math.min(
    Math.abs(actualTemp - cropTempMin),
    Math.abs(actualTemp - cropTempMax)
  );
  
  return Math.max(0, 100 - (distanceFromRange * 2.5));
}

/**
 * حساب نقاط الملاءمة لمعدل الأمطار مع تحسينات
 */
function calculateRainfallScore(cropRainMin: number, cropRainMax: number, actualRain: number): number {
  if (cropRainMin === 0 && cropRainMax === 0) return 60; // بيانات غير مكتملة
  
  if (actualRain >= cropRainMin && actualRain <= cropRainMax) {
    // نقاط إضافية للقيم المثالية
    const midPoint = (cropRainMin + cropRainMax) / 2;
    const distanceFromMid = Math.abs(actualRain - midPoint);
    const range = cropRainMax - cropRainMin;
    return 100 - (distanceFromMid / range) * 8;
  }
  
  const distanceFromRange = Math.min(
    Math.abs(actualRain - cropRainMin),
    Math.abs(actualRain - cropRainMax)
  );
  
  return Math.max(0, 100 - (distanceFromRange * 0.08));
}

/**
 * حساب نقاط الملاءمة لنوع التربة مع تحسينات
 */
function calculateSoilTypeScore(cropSoilType: string, actualSoilType: string): number {
  if (!cropSoilType || cropSoilType.trim() === '') return 75; // افتراضي للبيانات الناقصة
  
  if (cropSoilType === actualSoilType) {
    return 100; // مطابق تماماً
  }
  
  // نقاط جزئية للتربة المتشابهة مع تحسينات
  const soilCompatibility: { [key: string]: { [key: string]: number } } = {
    'طينية': { 'طميية': 85, 'عضوية': 70, 'رملية': 40, 'صخرية': 30 },
    'رملية': { 'طميية': 80, 'صخرية': 60, 'طينية': 40, 'عضوية': 50 },
    'طميية': { 'طينية': 85, 'رملية': 80, 'عضوية': 90, 'صخرية': 50 },
    'عضوية': { 'طميية': 90, 'طينية': 70, 'رملية': 50, 'صخرية': 30 },
    'صخرية': { 'رملية': 60, 'طميية': 50, 'طينية': 30, 'عضوية': 30 }
  };
  
  return soilCompatibility[actualSoilType]?.[cropSoilType] || 35;
}

/**
 * حساب نقاط الملاءمة لموسم الزراعة مع تحسينات
 */
function calculateSeasonScore(cropSeasons: string[], currentSeason: string): number {
  if (!cropSeasons || cropSeasons.length === 0) return 75; // افتراضي
  
  if (cropSeasons.includes(currentSeason)) {
    return 100; // موسم مثالي
  }
  
  // التحقق من الأشهر المجاورة مع نقاط متدرجة
  const currentIndex = ARABIC_MONTHS.indexOf(currentSeason);
  const adjacentMonths = [
    ARABIC_MONTHS[(currentIndex - 1 + 12) % 12],
    ARABIC_MONTHS[(currentIndex + 1) % 12]
  ];
  
  const twoMonthsAway = [
    ARABIC_MONTHS[(currentIndex - 2 + 12) % 12],
    ARABIC_MONTHS[(currentIndex + 2) % 12]
  ];
  
  for (const season of cropSeasons) {
    if (adjacentMonths.includes(season)) {
      return 75; // قريب من الموسم المثالي
    }
    if (twoMonthsAway.includes(season)) {
      return 50; // قريب نسبياً
    }
  }
  
  return 25; // خارج الموسم
}

/**
 * حساب نقاط التناوب الزراعي مع تحسينات
 */
function calculateRotationScore(cropName: string, cropRotations: string[], previousCrop?: string): number {
  if (!previousCrop) return 100; // لا يوجد محصول سابق
  if (!cropRotations || cropRotations.length === 0) return 85; // افتراضي
  
  // إذا كان المحصول السابق نفس المحصول الحالي
  if (previousCrop === cropName) {
    return 20; // تجنب زراعة نفس المحصول
  }
  
  // إذا كان المحصول السابق في قائمة التناوب المناسب
  if (cropRotations.includes(previousCrop)) {
    return 100; // تناوب مثالي
  }
  
  // تحقق من التناوب العكسي (إذا كان المحصول الحالي مناسب للمحصول السابق)
  const beneficialRotations: { [key: string]: string[] } = {
    'قمح': ['فول', 'عدس', 'حمص'],
    'شعير': ['فول', 'عدس', 'حمص'],
    'ذرة': ['فول', 'فاصولياء'],
    'طماطم': ['بصل', 'ثوم'],
    'بطاطا': ['فاصولياء', 'عدس']
  };
  
  if (beneficialRotations[previousCrop]?.includes(cropName)) {
    return 90; // تناوب مفيد
  }
  
  return 70; // تناوب مقبول
}

/**
 * تحديد مستوى الملاءمة واللون مع تحسينات
 */
function getSuitabilityLevel(score: number): { level: 'excellent' | 'good' | 'poor', color: string } {
  if (score >= 85) {
    return { level: 'excellent', color: '#10B981' }; // أخضر
  } else if (score >= 65) {
    return { level: 'good', color: '#F59E0B' }; // أصفر
  } else {
    return { level: 'poor', color: '#EF4444' }; // أحمر
  }
}

/**
 * إضافة عشوائية طفيفة لتجنب التكرار
 */
function addRandomVariation(score: number): number {
  // إضافة تباين طفيف (±2 نقاط) لتجنب النتائج المتطابقة
  const variation = (Math.random() - 0.5) * 4;
  return Math.max(0, Math.min(100, score + variation));
}

/**
 * الخوارزمية الرئيسية لتوصية المحاصيل
 * AI-Based Multi-Criteria Crop Recommendation System (AI-CSE)
 */
export function recommendCrops(
  crops: Crop[],
  inputs: EnvironmentalInputs
): CropRecommendation[] {
  const recommendations: CropRecommendation[] = [];
  
  for (const originalCrop of crops) {
    // إثراء بيانات المحصول
    const crop = enrichCropData(originalCrop);
    
    // حساب النقاط لكل معيار
    const phScore = calculatePHScore(crop.ph_min, crop.ph_max, inputs.ph);
    const tempScore = calculateTemperatureScore(crop.temp_min, crop.temp_max, inputs.temperature);
    const rainScore = calculateRainfallScore(crop.rain_min, crop.rain_max, inputs.rainfall);
    const soilScore = calculateSoilTypeScore(crop.soil_type, inputs.soilType);
    const seasonScore = calculateSeasonScore(crop.growing_season || [], inputs.currentSeason);
    const rotationScore = calculateRotationScore(crop.name, crop.crop_rotation || [], inputs.previousCrop);
    
    // حساب النقاط الإجمالية باستخدام الأوزان
    let totalScore = 
      (phScore * WEIGHTS.ph) +
      (tempScore * WEIGHTS.temperature) +
      (rainScore * WEIGHTS.rainfall) +
      (soilScore * WEIGHTS.soilType) +
      (seasonScore * WEIGHTS.season) +
      (rotationScore * WEIGHTS.rotation);
    
    // إضافة تباين طفيف لتجنب النتائج المتطابقة
    totalScore = addRandomVariation(totalScore);
    
    const { level, color } = getSuitabilityLevel(totalScore);
    
    recommendations.push({
      ...crop,
      suitabilityScore: Math.round(totalScore * 100) / 100,
      suitabilityLevel: level,
      suitabilityColor: color,
      scoreBreakdown: {
        ph: Math.round(phScore * 100) / 100,
        temperature: Math.round(tempScore * 100) / 100,
        rainfall: Math.round(rainScore * 100) / 100,
        soilType: Math.round(soilScore * 100) / 100,
        season: Math.round(seasonScore * 100) / 100,
        rotation: Math.round(rotationScore * 100) / 100
      }
    });
  }
  
  // ترتيب النتائج حسب النقاط (من الأعلى للأقل)
  return recommendations.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}

export { SOIL_TYPES, ARABIC_MONTHS };