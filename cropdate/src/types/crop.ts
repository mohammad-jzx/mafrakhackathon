export interface CropData {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  averageGrowthDays: number;
  harvestSeason: string;
  optimalConditions: string[];
  imageUrl: string;
}

export interface PredictionResult {
  cropType: string;
  confidence: number;
  estimatedHarvestDate: string;
  maturityStage: 'early' | 'mid' | 'late' | 'ready';
  recommendations: string[];
  daysToHarvest: number;
}