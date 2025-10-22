import { useState, useEffect, useCallback, useRef } from 'react';
import type { SensorData } from '../types';
import { saveData } from '../utils/storage';

export function useSensorData() {
  const [currentData, setCurrentData] = useState<SensorData | null>(null);
  const [history, setHistory] = useState<SensorData[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [lastFetchAttempt, setLastFetchAttempt] = useState(0);
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  const [isManualMode, setIsManualMode] = useState(false);

  // جلب القيم الحقيقية من السيرفر
  const fetchEsp32Data = useCallback(async () => {
    try {
      console.log("جاري جلب البيانات من السيرفر...");
      setLastFetchAttempt(Date.now());
      
      const res = await fetch('http://localhost:3000/api/sensor');
      const d = await res.json();
      console.log("تم استلام البيانات:", d);
      
      // تحقق من أن البيانات المستلمة صالحة (ليست كلها أصفار)
      const hasValidData = d.temperature !== 0 || d.humidity !== 0 || d.soilMoisture !== 0 || 
                          d.ph !== 0 || d.n !== 0 || d.p !== 0 || d.k !== 0 || d.ec !== 0;
      
      if (hasValidData) {
        const sensorData: SensorData = {
          id: Date.now().toString(),
          timestamp: new Date(),
          temperature: d.temperature !== 0 ? d.temperature : null,
          humidity: d.humidity !== 0 ? d.humidity : null,
          soilMoisture: d.soilMoisture !== 0 ? d.soilMoisture : null,
          ph: d.ph !== 0 ? d.ph : null,
          nitrogen: d.n !== 0 ? d.n : null,
          phosphorus: d.p !== 0 ? d.p : null,
          potassium: d.k !== 0 ? d.k : null,
          conductivity: d.ec !== 0 ? d.ec : null
        };
        
        setCurrentData(sensorData);
        setHistory(prev => {
          const newHistory = [...prev, sensorData];
          // Keep only last 100 readings
          const trimmedHistory = newHistory.slice(-100);
          saveData(trimmedHistory);
          return trimmedHistory;
        });
        
        // إعادة تعيين عداد الفشل المتتالي
        setConsecutiveFailures(0);
      } else {
        throw new Error("البيانات المستلمة غير صالحة (كلها أصفار)");
      }
    } catch (error) {
      console.error("فشل جلب البيانات من السيرفر:", error);
      
      // زيادة عداد الفشل المتتالي
      setConsecutiveFailures(prev => prev + 1);
      
      // إذا فشلت المحاولات المتتالية أكثر من 3 مرات، اعتبر المستشعر غير متصل
      if (consecutiveFailures >= 3) {
        // إذا كانت المحاكاة قيد التشغيل، استمر في محاكاة البيانات
        if (isSimulating) {
          simulateSensorData();
        } else {
          // إذا لم تكن المحاكاة قيد التشغيل، اضبط البيانات الحالية على null
          setCurrentData(null);
        }
      } else if (isSimulating) {
        // استمر في المحاكاة إذا كانت قيد التشغيل
        simulateSensorData();
      }
    }
  }, [isSimulating, consecutiveFailures]);
  
  // دالة لمحاكاة بيانات المستشعر
  const simulateSensorData = useCallback(() => {
    const getRandomValue = (min: number, max: number) => Math.round((Math.random() * (max - min) + min) * 10) / 10;
    
    const sensorData: SensorData = {
      id: Date.now().toString(),
      timestamp: new Date(),
      temperature: getRandomValue(20, 30),
      humidity: getRandomValue(50, 80),
      soilMoisture: getRandomValue(55, 75),
      ph: getRandomValue(5.5, 7.5),
      nitrogen: getRandomValue(40, 90),
      phosphorus: getRandomValue(20, 60),
      potassium: getRandomValue(50, 150),
      conductivity: getRandomValue(0.8, 1.8)
    };
    
    setCurrentData(sensorData);
    setHistory(prev => {
      const newHistory = [...prev, sensorData];
      const trimmedHistory = newHistory.slice(-100);
      saveData(trimmedHistory);
      return trimmedHistory;
    });
  }, []);

  // بدء المحاكاة
  const startSimulation = useCallback(() => {
    setIsSimulating(true);
    
    // محاكاة أول قراءة فورًا
    simulateSensorData();
    
    // ثم محاكاة قراءات جديدة كل 5 ثوانٍ
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(simulateSensorData, 5000);
    
    console.log("تم بدء المحاكاة");
  }, [simulateSensorData]);
  
  // إيقاف المحاكاة
  const stopSimulation = useCallback(() => {
    setIsSimulating(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // عند إيقاف المحاكاة، اضبط البيانات الحالية على null
    setCurrentData(null);
    
    console.log("تم إيقاف المحاكاة");
  }, []);

  // بدء جلب البيانات عند تحميل المكون
  useEffect(() => {
    // إذا كان في الوضع اليدوي، لا تجلب البيانات من المستشعر
    if (isManualMode) {
      return;
    }
    
    // جلب البيانات فوراً عند التحميل
    fetchEsp32Data();
    
    // ثم جلب البيانات كل 5 ثوانٍ
    intervalRef.current = setInterval(fetchEsp32Data, 5000);
    
    // تنظيف عند إزالة المكون
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchEsp32Data, isManualMode]);

  // للإدخال اليدوي فقط
  const addData = useCallback((data: SensorData) => {
    // تفعيل الوضع اليدوي
    setIsManualMode(true);
    
    // إيقاف أي interval قيد التشغيل
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setCurrentData(data);
    setHistory(prev => {
      const newHistory = [...prev, data];
      const trimmedHistory = newHistory.slice(-100);
      saveData(trimmedHistory);
      return trimmedHistory;
    });
    
    console.log("تم تفعيل الوضع اليدوي - النظام سيعمل على القيم اليدوية فقط");
  }, []);

  // إعادة تفعيل المستشعر
  const enableSensor = useCallback(() => {
    setIsManualMode(false);
    console.log("تم إعادة تفعيل المستشعر");
  }, []);

  return {
    currentData,
    history,
    addData,
    isSimulating,
    startSimulation,
    stopSimulation,
    isManualMode,
    enableSensor
  };
}