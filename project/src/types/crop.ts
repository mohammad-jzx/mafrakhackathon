export interface Crop {
  name: string;
  name_en: string;
  scientific_name?: string;
  icon: string;
  category?: string;
  
  // للتوافق مع النظام الحالي
  soil_type?: string;
  ph_min: number;
  ph_max: number;
  temp_min: number;
  temp_max: number;
  rain_min: number;
  rain_max: number;
  growing_season?: string[];
  crop_rotation?: string[];
  duration_days?: number;
  
  // البيانات الشاملة الجديدة
  environmental_requirements?: {
    ph_min: number;
    ph_max: number;
    ph_optimal: number;
    temp_min: number;
    temp_max: number;
    temp_optimal: number;
    rain_min: number;
    rain_max: number;
    rain_optimal: number;
    humidity_min: number;
    humidity_max: number;
  };
  
  soil_requirements?: {
    soil_types: string[];
    soil_drainage: string;
    soil_depth_min: number;
    soil_organic_matter_min: number;
    soil_salinity_tolerance: string;
  };
  
  timing?: {
    planting_months: string[];
    harvesting_months: string[];
    duration_days: number;
    growth_stages: {
      [key: string]: number;
    };
  };
  
  rotation?: {
    beneficial_predecessors: string[];
    harmful_predecessors: string[];
    beneficial_successors: string[];
    rotation_cycle_years: number;
    nitrogen_fixing: boolean;
  };
  
  water_management?: {
    water_requirement_mm: number;
    irrigation_frequency: string;
    drought_tolerance: string;
    flood_tolerance: string;
  };
  
  tolerance?: {
    frost_tolerance: string;
    heat_tolerance: string;
    disease_resistance: string[];
    pest_resistance: string[];
  };
  
  economics?: {
    yield_per_hectare: number;
    market_price_per_kg: number;
    production_cost_per_hectare: number;
    profit_margin: number;
    market_demand: string;
  };
  
  nutrition?: {
    protein_content: number;
    carbohydrate_content: number;
    fat_content: number;
    fiber_content: number;
    nutritional_value: string;
  };
  
  geography?: {
    altitude_min: number;
    altitude_max: number;
    suitable_regions: string[];
    climate_zones: string[];
  };
}

export interface CropRecommendation extends Crop {
  suitabilityScore: number;
  suitabilityLevel: 'excellent' | 'good' | 'poor';
  suitabilityColor: string;
  scoreBreakdown: {
    ph: number;
    temperature: number;
    rainfall: number;
    soilType: number;
    season: number;
    rotation: number;
    economics?: number;
    sustainability?: number;
  };
}

export interface EnvironmentalInputs {
  ph: number;
  temperature: number;
  rainfall: number;
  soilType: string;
  currentSeason: string;
  previousCrop?: string;
  // إضافات جديدة اختيارية
  humidity?: number;
  altitude?: number;
  budget?: number;
  farmSize?: number;
  marketAccess?: string;
}