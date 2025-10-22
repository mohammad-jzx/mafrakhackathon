export interface SensorData {
  id: string;
  timestamp: Date;
  temperature: number | null;
  humidity: number | null;
  soilMoisture: number | null;
  ph: number | null;
  nitrogen: number | null;
  phosphorus: number | null;
  potassium: number | null;
  conductivity: number | null;
}

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
}

export type AlertType = 'خطر' | 'تحذير' | 'إشعار' | 'نجاح';

export interface Alert {
  type: AlertType;
  message: string;
  title?: string;
  action?: string;
  timeframe?: string;
}

export interface Recommendation {
  needsIrrigation: boolean;
  needsNitrogen: boolean;
  needsPhosphorus: boolean;
  needsPotassium: boolean;
  soilPhStatus: 'مناسب' | 'حامضي' | 'قلوي';
  temperatureStatus: 'مناسب' | 'منخفض' | 'مرتفع';
  humidityStatus: 'مناسب' | 'منخفض' | 'مرتفع';
  overallStatus: 'ممتاز' | 'جيد' | 'يحتاج عناية' | 'يحتاج تدخل فوري';
  recommendations: string[];
  alerts: Alert[];
}