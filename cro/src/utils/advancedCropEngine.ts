import { Crop, CropRecommendation, EnvironmentalInputs } from '../types/crop';

// أوزان محسنة للخوارزمية المتقدمة
const ADVANCED_WEIGHTS = {
  environmental: 0.40,  // 40% للعوامل البيئية
  economic: 0.25,      // 25% للعوامل الاقتصادية
  agricultural: 0.20,  // 20% للممارسات الزراعية
  sustainability: 0.15 // 15% للاستدامة
};

const SUB_WEIGHTS = {
  environmental: {
    ph: 0.30,
    temperature: 0.25,
    rainfall: 0.25,
    humidity: 0.20
  },
  economic: {
    profitability: 0.40,
    market_demand: 0.30,
    production_cost: 0.30
  },
  agricultural: {
    soil_suitability: 0.40,
    season_timing: 0.30,
    rotation_benefit: 0.30
  },
  sustainability: {
    water_efficiency: 0.35,
    soil_improvement: 0.35,
    climate_resilience: 0.30
  }
};

/**
 * تحويل البيانات القديمة إلى الهيكل الجديد
 */
function normalizeOldCropData(crop: Crop): Crop {
  if (!crop.environmental_requirements && (crop.ph_min || crop.temp_min || crop.rain_min)) {
    return {
      ...crop,
      environmental_requirements: {
        ph_min: crop.ph_min || 6.0,
        ph_max: crop.ph_max || 7.5,
        ph_optimal: ((crop.ph_min || 6.0) + (crop.ph_max || 7.5)) / 2,
        temp_min: crop.temp_min || 20,
        temp_max: crop.temp_max || 30,
        temp_optimal: ((crop.temp_min || 20) + (crop.temp_max || 30)) / 2,
        rain_min: crop.rain_min || 400,
        rain_max: crop.rain_max || 800,
        rain_optimal: ((crop.rain_min || 400) + (crop.rain_max || 800)) / 2,
        humidity_min: 40,
        humidity_max: 70
      },
      soil_requirements: {
        soil_types: crop.soil_type ? [crop.soil_type] : ['طميية'],
        soil_drainage: 'جيد',
        soil_depth_min: 50,
        soil_organic_matter_min: 2.5,
        soil_salinity_tolerance: 'متوسط'
      },
      timing: {
        planting_months: crop.growing_season || ['مارس', 'أبريل'],
        harvesting_months: ['يونيو', 'يوليو'],
        duration_days: crop.duration_days || 120,
        growth_stages: {
          germination: 10,
          vegetative: 40,
          reproductive: 50,
          maturation: 20
        }
      },
      rotation: {
        beneficial_predecessors: crop.crop_rotation || [],
        harmful_predecessors: [crop.name],
        beneficial_successors: [],
        rotation_cycle_years: 3,
        nitrogen_fixing: ['فول', 'عدس', 'حمص', 'فاصولياء'].includes(crop.name)
      },
      economics: {
        yield_per_hectare: 3000,
        market_price_per_kg: 1.0,
        production_cost_per_hectare: 2000,
        profit_margin: 0.35,
        market_demand: 'متوسط'
      }
    };
  }
  return crop;
}

/**
 * حساب النقاط البيئية المتقدمة
 */
function calculateEnvironmentalScore(crop: Crop, inputs: EnvironmentalInputs): number {
  const env = crop.environmental_requirements;
  if (!env) return 60;

  // نقاط درجة الحموضة
  const phScore = calculateOptimalRangeScore(
    inputs.ph, env.ph_min, env.ph_max, env.ph_optimal
  );

  // نقاط درجة الحرارة
  const tempScore = calculateOptimalRangeScore(
    inputs.temperature, env.temp_min, env.temp_max, env.temp_optimal
  );

  // نقاط الأمطار
  const rainScore = calculateOptimalRangeScore(
    inputs.rainfall, env.rain_min, env.rain_max, env.rain_optimal
  );

  // نقاط الرطوبة (افتراضية إذا لم تُدخل)
  const humidity = inputs.humidity || 60;
  const humidityScore = calculateOptimalRangeScore(
    humidity, env.humidity_min, env.humidity_max, (env.humidity_min + env.humidity_max) / 2
  );

  return (
    phScore * SUB_WEIGHTS.environmental.ph +
    tempScore * SUB_WEIGHTS.environmental.temperature +
    rainScore * SUB_WEIGHTS.environmental.rainfall +
    humidityScore * SUB_WEIGHTS.environmental.humidity
  );
}

/**
 * حساب النقاط الاقتصادية
 */
function calculateEconomicScore(crop: Crop, inputs: EnvironmentalInputs): number {
  const econ = crop.economics;
  if (!econ) return 60;

  // نقاط الربحية
  const profitabilityScore = Math.min(100, econ.profit_margin * 200);

  // نقاط الطلب في السوق
  const demandScore = getMarketDemandScore(econ.market_demand);

  // نقاط تكلفة الإنتاج (كلما قلت التكلفة، زادت النقاط)
  const costScore = Math.max(0, 100 - (econ.production_cost_per_hectare / 100));

  return (
    profitabilityScore * SUB_WEIGHTS.economic.profitability +
    demandScore * SUB_WEIGHTS.economic.market_demand +
    costScore * SUB_WEIGHTS.economic.production_cost
  );
}

/**
 * حساب النقاط الزراعية
 */
function calculateAgriculturalScore(crop: Crop, inputs: EnvironmentalInputs): number {
  // نقاط ملاءمة التربة
  const soilScore = calculateSoilSuitability(crop, inputs.soilType);

  // نقاط التوقيت الموسمي
  const seasonScore = calculateSeasonTiming(crop, inputs.currentSeason);

  // نقاط التناوب الزراعي
  const rotationScore = calculateRotationBenefit(crop, inputs.previousCrop);

  return (
    soilScore * SUB_WEIGHTS.agricultural.soil_suitability +
    seasonScore * SUB_WEIGHTS.agricultural.season_timing +
    rotationScore * SUB_WEIGHTS.agricultural.rotation_benefit
  );
}

/**
 * حساب نقاط الاستدامة
 */
function calculateSustainabilityScore(crop: Crop, inputs: EnvironmentalInputs): number {
  const water = crop.water_management;
  const tolerance = crop.tolerance;
  const rotation = crop.rotation;

  // كفاءة استخدام المياه
  const waterEfficiency = water ? getWaterEfficiencyScore(water.drought_tolerance) : 60;

  // تحسين التربة
  const soilImprovement = rotation?.nitrogen_fixing ? 100 : 50;

  // مقاومة التغيرات المناخية
  const climateResilience = tolerance ? 
    (getToleranceScore(tolerance.heat_tolerance) + getToleranceScore(tolerance.drought_tolerance || 'متوسط')) / 2 : 60;

  return (
    waterEfficiency * SUB_WEIGHTS.sustainability.water_efficiency +
    soilImprovement * SUB_WEIGHTS.sustainability.soil_improvement +
    climateResilience * SUB_WEIGHTS.sustainability.climate_resilience
  );
}

/**
 * حساب النقاط للنطاق المثالي
 */
function calculateOptimalRangeScore(value: number, min: number, max: number, optimal: number): number {
  if (value >= min && value <= max) {
    // داخل النطاق المقبول
    const distanceFromOptimal = Math.abs(value - optimal);
    const range = max - min;
    return Math.max(85, 100 - (distanceFromOptimal / range) * 15);
  } else {
    // خارج النطاق
    const distanceFromRange = Math.min(Math.abs(value - min), Math.abs(value - max));
    return Math.max(0, 85 - distanceFromRange * 2);
  }
}

/**
 * حساب نقاط الطلب في السوق
 */
function getMarketDemandScore(demand: string): number {
  const demandMap: { [key: string]: number } = {
    'عالي جداً': 100,
    'عالي': 85,
    'متوسط': 65,
    'منخفض': 40,
    'منخفض جداً': 20
  };
  return demandMap[demand] || 60;
}

/**
 * حساب ملاءمة التربة
 */
function calculateSoilSuitability(crop: Crop, soilType: string): number {
  const soilReq = crop.soil_requirements;
  if (!soilReq) return 60;

  if (soilReq.soil_types.includes(soilType)) {
    return 100;
  }

  // التوافق الجزئي
  const compatibility: { [key: string]: { [key: string]: number } } = {
    'طينية': { 'طميية': 80, 'عضوية': 70 },
    'رملية': { 'طميية': 75, 'صخرية': 60 },
    'طميية': { 'طينية': 80, 'رملية': 75, 'عضوية': 85 },
    'عضوية': { 'طميية': 85, 'طينية': 70 },
    'صخرية': { 'رملية': 60, 'طميية': 50 }
  };

  for (const suitableSoil of soilReq.soil_types) {
    const score = compatibility[soilType]?.[suitableSoil];
    if (score) return score;
  }

  return 40;
}

/**
 * حساب التوقيت الموسمي
 */
function calculateSeasonTiming(crop: Crop, currentSeason: string): number {
  const timing = crop.timing;
  if (!timing) return 60;

  if (timing.planting_months.includes(currentSeason)) {
    return 100;
  }

  // الأشهر المجاورة
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
                 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  
  const currentIndex = months.indexOf(currentSeason);
  const adjacentMonths = [
    months[(currentIndex - 1 + 12) % 12],
    months[(currentIndex + 1) % 12]
  ];

  for (const month of timing.planting_months) {
    if (adjacentMonths.includes(month)) {
      return 70;
    }
  }

  return 30;
}

/**
 * حساب فائدة التناوب
 */
function calculateRotationBenefit(crop: Crop, previousCrop?: string): number {
  if (!previousCrop) return 100;

  const rotation = crop.rotation;
  if (!rotation) return 70;

  if (previousCrop === crop.name) {
    return 20; // تجنب زراعة نفس المحصول
  }

  if (rotation.beneficial_predecessors.includes(previousCrop)) {
    return 100;
  }

  if (rotation.harmful_predecessors.includes(previousCrop)) {
    return 30;
  }

  return 70;
}

/**
 * حساب نقاط كفاءة المياه
 */
function getWaterEfficiencyScore(droughtTolerance: string): number {
  const toleranceMap: { [key: string]: number } = {
    'عالي جداً': 100,
    'عالي': 85,
    'متوسط': 65,
    'منخفض': 40,
    'منخفض جداً': 20
  };
  return toleranceMap[droughtTolerance] || 60;
}

/**
 * حساب نقاط التحمل العامة
 */
function getToleranceScore(tolerance: string): number {
  const toleranceMap: { [key: string]: number } = {
    'عالي جداً': 100,
    'عالي': 85,
    'متوسط': 65,
    'منخفض': 40,
    'منخفض جداً': 20
  };
  return toleranceMap[tolerance] || 60;
}

/**
 * الخوارزمية المتقدمة لتوصية المحاصيل
 */
export function advancedRecommendCrops(
  crops: Crop[],
  inputs: EnvironmentalInputs
): CropRecommendation[] {
  const recommendations: CropRecommendation[] = [];

  for (const originalCrop of crops) {
    const crop = normalizeOldCropData(originalCrop);

    // حساب النقاط لكل فئة رئيسية
    const environmentalScore = calculateEnvironmentalScore(crop, inputs);
    const economicScore = calculateEconomicScore(crop, inputs);
    const agriculturalScore = calculateAgriculturalScore(crop, inputs);
    const sustainabilityScore = calculateSustainabilityScore(crop, inputs);

    // حساب النقاط الإجمالية
    const totalScore = 
      environmentalScore * ADVANCED_WEIGHTS.environmental +
      economicScore * ADVANCED_WEIGHTS.economic +
      agriculturalScore * ADVANCED_WEIGHTS.agricultural +
      sustainabilityScore * ADVANCED_WEIGHTS.sustainability;

    // تحديد مستوى الملاءمة
    const { level, color } = getSuitabilityLevel(totalScore);

    recommendations.push({
      ...crop,
      suitabilityScore: Math.round(totalScore * 100) / 100,
      suitabilityLevel: level,
      suitabilityColor: color,
      scoreBreakdown: {
        ph: Math.round(environmentalScore * SUB_WEIGHTS.environmental.ph * 100) / 100,
        temperature: Math.round(environmentalScore * SUB_WEIGHTS.environmental.temperature * 100) / 100,
        rainfall: Math.round(environmentalScore * SUB_WEIGHTS.environmental.rainfall * 100) / 100,
        soilType: Math.round(agriculturalScore * SUB_WEIGHTS.agricultural.soil_suitability * 100) / 100,
        season: Math.round(agriculturalScore * SUB_WEIGHTS.agricultural.season_timing * 100) / 100,
        rotation: Math.round(agriculturalScore * SUB_WEIGHTS.agricultural.rotation_benefit * 100) / 100,
        economics: Math.round(economicScore * 100) / 100,
        sustainability: Math.round(sustainabilityScore * 100) / 100
      }
    });
  }

  return recommendations.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}

function getSuitabilityLevel(score: number): { level: 'excellent' | 'good' | 'poor', color: string } {
  if (score >= 85) {
    return { level: 'excellent', color: '#10B981' };
  } else if (score >= 65) {
    return { level: 'good', color: '#F59E0B' };
  } else {
    return { level: 'poor', color: '#EF4444' };
  }
}