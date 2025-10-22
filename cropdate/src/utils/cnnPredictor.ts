import { PredictionResult } from '../types/crop';
import { cropsDatabase } from '../data/cropsDatabase';

// محاكاة توقع CNN - في التطبيق الحقيقي، سيتصل هذا بنموذج مدرب
export const predictHarvestDate = async (
  imageFile: File,
  selectedCropType: string
): Promise<PredictionResult> => {
  // محاكاة وقت المعالجة
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const crop = cropsDatabase.find(c => c.id === selectedCropType);
  if (!crop) {
    throw new Error('نوع المحصول غير موجود');
  }

  // محاكاة نتائج تحليل CNN
  const maturityStages = ['early', 'mid', 'late', 'ready'] as const;
  const randomStage = maturityStages[Math.floor(Math.random() * maturityStages.length)];
  
  const stageMultipliers = {
    early: 0.8,
    mid: 0.5,
    late: 0.2,
    ready: 0.05
  };
  
  const daysToHarvest = Math.floor(crop.averageGrowthDays * stageMultipliers[randomStage]);
  const harvestDate = new Date();
  harvestDate.setDate(harvestDate.getDate() + daysToHarvest);
  
  const recommendations = getRecommendations(randomStage, crop.nameAr);
  
  return {
    cropType: crop.nameAr,
    confidence: Math.random() * 0.3 + 0.7, // ثقة 70-100%
    estimatedHarvestDate: harvestDate.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    maturityStage: randomStage,
    recommendations,
    daysToHarvest
  };
};

const getRecommendations = (stage: string, cropName: string): string[] => {
  const baseRecommendations = {
    early: [
      'استمر في جدول الري المنتظم',
      'راقب الآفات والأمراض',
      'تأكد من التغذية الكافية',
      'احم من الطقس القاسي'
    ],
    mid: [
      'زد من تكرار المراقبة',
      'فكر في تقليل الري قليلاً',
      'تحقق من علامات النضج',
      'جهز معدات الحصاد'
    ],
    late: [
      'راقب يومياً للوقت الأمثل للحصاد',
      'قلل الري لتركيز النكهات',
      'تحقق من توقعات الطقس لنافذة الحصاد',
      'جهز مرافق التخزين'
    ],
    ready: [
      'احصد فوراً للحصول على أفضل جودة',
      'اختر طقساً جافاً للحصاد',
      'تعامل بحذر لتجنب الضرر',
      'خزن بشكل صحيح للحفاظ على النضارة'
    ]
  };
  
  return baseRecommendations[stage as keyof typeof baseRecommendations] || [];
};