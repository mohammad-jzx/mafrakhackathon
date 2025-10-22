export type SoilType = 'طينية' | 'رملية' | 'طميية' | 'صخرية' | 'عضوية';
export type Season = 'يناير' | 'فبراير' | 'مارس' | 'أبريل' | 'مايو' | 'يونيو' | 'يوليو' | 'أغسطس' | 'سبتمبر' | 'أكتوبر' | 'نوفمبر' | 'ديسمبر';

export interface Crop {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  tempMin: number;
  tempMax: number;
  humidityMin: number;
  humidityMax: number;
  soilMoistureMin: number;
  soilMoistureMax: number;
  phMin: number;
  phMax: number;
  nitrogenMin: number;
  nitrogenMax: number;
  phosphorusMin: number;
  phosphorusMax: number;
  potassiumMin: number;
  potassiumMax: number;
  soilType?: string;
  growingSeason?: string[];
  cropRotation?: string[];
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
  };
}

export interface EnvironmentalInputs {
  ph: number;
  temperature: number;
  rainfall: number;
  soilType: string;
  currentSeason: string;
  previousCrop?: string;
}

export interface CropInput {
  ph: number;
  temperature: number;
  rainfall: number;
  soilType: SoilType;
  season: Season;
  previousCrop: string;
} 