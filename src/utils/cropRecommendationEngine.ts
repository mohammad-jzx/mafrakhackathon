import type { Crop } from '../types';
import type { CropRecommendation, EnvironmentalInputs } from '../types/crop';

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

/**
 * حساب نقاط الملاءمة لدرجة الحموضة
 */
function calculatePHScore(cropPHMin: number, cropPHMax: number, actualPH: number): number {
  if (cropPHMin === 0 && cropPHMax === 0) return 50; // بيانات غير مكتملة
  
  if (actualPH >= cropPHMin && actualPH <= cropPHMax) {
    return 100; // مثالي
  }
  
  // حساب المسافة من النطاق المثالي
  const distanceFromRange = Math.min(
    Math.abs(actualPH - cropPHMin),
    Math.abs(actualPH - cropPHMax)
  );
  
  // كلما زادت المسافة، قلت النقاط
  return Math.max(0, 100 - (distanceFromRange * 20));
}

/**
 * حساب نقاط الملاءمة لدرجة الحرارة
 */
function calculateTemperatureScore(cropTempMin: number, cropTempMax: number, actualTemp: number): number {
  if (cropTempMin === 0 && cropTempMax === 0) return 50; // بيانات غير مكتملة
  
  if (actualTemp >= cropTempMin && actualTemp <= cropTempMax) {
    return 100; // مثالي
  }
  
  const distanceFromRange = Math.min(
    Math.abs(actualTemp - cropTempMin),
    Math.abs(actualTemp - cropTempMax)
  );
  
  return Math.max(0, 100 - (distanceFromRange * 3));
}

/**
 * حساب نقاط الملاءمة لمعدل الأمطار
 */
function calculateRainfallScore(cropRainMin: number, cropRainMax: number, actualRain: number): number {
  if (cropRainMin === 0 && cropRainMax === 0) return 50; // بيانات غير مكتملة
  
  if (actualRain >= cropRainMin && actualRain <= cropRainMax) {
    return 100; // مثالي
  }
  
  const distanceFromRange = Math.min(
    Math.abs(actualRain - cropRainMin),
    Math.abs(actualRain - cropRainMax)
  );
  
  return Math.max(0, 100 - (distanceFromRange * 0.1));
}

/**
 * حساب نقاط الملاءمة لنوع التربة
 */
function calculateSoilTypeScore(cropSoilType: string, actualSoilType: string): number {
  if (!cropSoilType || cropSoilType.trim() === '') return 70; // افتراضي للبيانات الناقصة
  
  if (cropSoilType === actualSoilType) {
    return 100; // مطابق تماماً
  }
  
  // نقاط جزئية للتربة المتشابهة
  const soilCompatibility: { [key: string]: string[] } = {
    'طينية': ['طميية'],
    'رملية': ['طميية'],
    'طميية': ['طينية', 'رملية'],
    'عضوية': ['طميية', 'طينية']
  };
  
  if (soilCompatibility[actualSoilType]?.includes(cropSoilType)) {
    return 75;
  }
  
  return 40; // غير متوافق
}

/**
 * حساب نقاط الملاءمة لموسم الزراعة
 */
function calculateSeasonScore(cropSeasons: string[], currentSeason: string): number {
  if (!cropSeasons || cropSeasons.length === 0) return 70; // افتراضي
  
  if (cropSeasons.includes(currentSeason)) {
    return 100; // موسم مثالي
  }
  
  // التحقق من الأشهر المجاورة
  const currentIndex = ARABIC_MONTHS.indexOf(currentSeason);
  const adjacentMonths = [
    ARABIC_MONTHS[(currentIndex - 1 + 12) % 12],
    ARABIC_MONTHS[(currentIndex + 1) % 12]
  ];
  
  for (const season of cropSeasons) {
    if (adjacentMonths.includes(season)) {
      return 60; // قريب من الموسم المثالي
    }
  }
  
  return 20; // خارج الموسم
}

/**
 * حساب نقاط التناوب الزراعي
 */
function calculateRotationScore(cropRotations: string[], previousCrop?: string): number {
  if (!previousCrop) return 100; // لا يوجد محصول سابق
  if (!cropRotations || cropRotations.length === 0) return 80; // افتراضي
  
  // إذا كان المحصول السابق نفس المحصول الحالي
  if (previousCrop === cropRotations[0]) {
    return 30; // تجنب زراعة نفس المحصول
  }
  
  // إذا كان المحصول السابق في قائمة التناوب المناسب
  if (cropRotations.includes(previousCrop)) {
    return 100; // تناوب مثالي
  }
  
  return 70; // تناوب مقبول
}

/**
 * تحديد مستوى الملاءمة واللون
 */
function getSuitabilityLevel(score: number): { level: 'excellent' | 'good' | 'poor', color: string } {
  if (score >= 90) {
    return { level: 'excellent', color: '#10B981' }; // أخضر
  } else if (score >= 70) {
    return { level: 'good', color: '#F59E0B' }; // أصفر
  } else {
    return { level: 'poor', color: '#EF4444' }; // أحمر
  }
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
  
  for (const crop of crops) {
    // حساب النقاط لكل معيار
    const phScore = calculatePHScore(crop.phMin, crop.phMax, inputs.ph);
    const tempScore = calculateTemperatureScore(crop.tempMin, crop.tempMax, inputs.temperature);
    const rainScore = calculateRainfallScore(crop.humidityMin, crop.humidityMax, inputs.rainfall);
    const soilScore = calculateSoilTypeScore(crop.soilType, inputs.soilType);
    const seasonScore = calculateSeasonScore(crop.growingSeason || [], inputs.currentSeason);
    const rotationScore = calculateRotationScore(crop.cropRotation || [], inputs.previousCrop);
    
    // حساب النقاط الإجمالية باستخدام الأوزان
    const totalScore = 
      (phScore * WEIGHTS.ph) +
      (tempScore * WEIGHTS.temperature) +
      (rainScore * WEIGHTS.rainfall) +
      (soilScore * WEIGHTS.soilType) +
      (seasonScore * WEIGHTS.season) +
      (rotationScore * WEIGHTS.rotation);
    
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