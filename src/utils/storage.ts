import type { SensorData, Crop } from '../types';

const SENSOR_DATA_KEY = 'agri-sensor-data';
const CROPS_DATA_KEY = 'agri-crops-data';

export function saveData(data: SensorData[]): void {
  try {
    localStorage.setItem(SENSOR_DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save sensor data to localStorage:', error);
  }
}

export function loadData(): SensorData[] {
  try {
    const stored = localStorage.getItem(SENSOR_DATA_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      return parsed.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
    }
  } catch (error) {
    console.error('Failed to load sensor data from localStorage:', error);
  }
  return [];
}

export function clearData(): void {
  try {
    localStorage.removeItem(SENSOR_DATA_KEY);
  } catch (error) {
    console.error('Failed to clear sensor data from localStorage:', error);
  }
}

export function saveCrops(crops: Crop[]): void {
  try {
    localStorage.setItem(CROPS_DATA_KEY, JSON.stringify(crops));
  } catch (error) {
    console.error('Failed to save crops data to localStorage:', error);
  }
}

export function loadCrops(): Crop[] {
  try {
    const stored = localStorage.getItem(CROPS_DATA_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load crops data from localStorage:', error);
  }
  return [];
}

export function clearCrops(): void {
  try {
    localStorage.removeItem(CROPS_DATA_KEY);
  } catch (error) {
    console.error('Failed to clear crops data from localStorage:', error);
  }
}