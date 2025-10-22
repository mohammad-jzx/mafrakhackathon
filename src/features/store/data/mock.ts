/**
 * بيانات تجريبية للمتجر الزراعي
 */
import { Product } from '../types/store';

export const mockProducts: Product[] = [
  {
    id: '3',
    name: 'سماد عضوي NPK 15-15-15',
    name_en: 'Organic NPK Fertilizer 15-15-15',
    description: 'سماد عضوي متوازن يحتوي على النيتروجين والفوسفور والبوتاسيوم. مناسب لجميع أنواع النباتات.',
    price: 28.75,
    category: 'أسمدة',
    image: 'https://profert.dz/ar/wp-content/uploads/2018/08/NPK-15.15.15-SP2.jpg',
    location: 'الزرقاء',
    rating: 4.7,
    stock: 85,
    seller: {
      name: 'شركة الأسمدة الخضراء',
      verified: true
    },
    tags: ['عضوي', 'متوازن', 'آمن']
  },
  {
    id: '4',
    name: 'نظام ري بالتنقيط الذكي',
    name_en: 'Smart Drip Irrigation System',
    description: 'نظام ري متطور يوفر الماء ويضمن وصوله للنباتات بشكل دقيق. مع تطبيق ذكي للتحكم عن بعد.',
    price: 350.00,
    category: 'معدات ري',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500&h=500&fit=crop',
    location: 'عمان',
    rating: 4.9,
    stock: 12,
    seller: {
      name: 'تقنيات الري الحديثة',
      verified: true
    },
    tags: ['ذكي', 'يوفر الماء', 'تحكم عن بعد']
  },
  {
    id: '5',
    name: 'بذور خيار فريش',
    name_en: 'Fresh Cucumber Seeds',
    description: 'بذور خيار عالية الجودة، ثمار مقرمشة وطازجة. مناسبة للزراعة في البيوت المحمية.',
    price: 12.00,
    category: 'بذور',
    image: 'https://m.media-amazon.com/images/I/513Co8cZedL.jpg',
    location: 'إربد',
    rating: 4.6,
    stock: 200,
    seller: {
      name: 'مزرعة الخضراوات الذهبية',
      verified: true
    },
    tags: ['عضوي', 'طازج', 'بيوت محمية']
  },
  {
    id: '9',
    name: 'نظام الزراعة المائية',
    name_en: 'Hydroponic Growing System',
    description: 'نظام زراعة بدون تربة باستخدام تقنية الزراعة المائية. يوفر مساحة ويزيد الإنتاجية.',
    price: 450.00,
    category: 'زراعة متقدمة',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=500&h=500&fit=crop',
    location: 'عمان',
    rating: 4.9,
    stock: 8,
    seller: {
      name: 'تقنيات الري الحديثة',
      verified: true
    },
    tags: ['بدون تربة', 'تقنية حديثة', 'إنتاجية عالية']
  }
];

export const categories: Array<{ value: string; label: string; icon: string }> = [
  { value: 'الكل', label: 'جميع الفئات', icon: '🌱' },
  { value: 'بذور', label: 'بذور', icon: '🌾' },
  { value: 'أدوات', label: 'أدوات', icon: '🔧' },
  { value: 'أسمدة', label: 'أسمدة', icon: '💊' },
  { value: 'معدات ري', label: 'معدات ري', icon: '💧' },
  { value: 'مبيدات', label: 'مبيدات', icon: '🛡️' },
  { value: 'زراعة متقدمة', label: 'زراعة متقدمة', icon: '🚀' }
];

export const locations = [
  'الكل',
  'عمّان',
  'إربد',
  'الزرقاء',
  'المفرق',
  'الكرك',
  'العقبة',
  'الطفيلة',
  'مادبا',
  'جرش'
];


