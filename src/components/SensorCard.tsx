import React from 'react';
import { clsx } from 'clsx';
import { ArrowUp, ArrowDown, Info } from 'lucide-react';

interface SensorCardProps {
  title: string;
  value: string | null;
  icon: React.ReactNode;
  color: 'red' | 'blue' | 'purple' | 'orange' | 'green';
  range?: string;
  trend?: 'up' | 'down';
  description?: string; // وصف توضيحي للقيمة
  flipped?: boolean; // هل الكارد مقلوب
  onClick?: () => void; // عند الضغط
  backContent?: React.ReactNode; // محتوى الوجه الخلفي
}

const colorClasses = {
  red: 'from-rose-500 to-rose-600 text-rose-600 dark:text-rose-400',
  blue: 'from-sky-500 to-sky-600 text-sky-600 dark:text-sky-400',
  purple: 'from-purple-500 to-purple-600 text-purple-600 dark:text-purple-400',
  orange: 'from-orange-500 to-orange-600 text-orange-600 dark:text-orange-400',
  green: 'from-emerald-500 to-emerald-600 text-emerald-600 dark:text-emerald-400'
};

const indicatorColors = {
  red: 'bg-rose-500 dark:bg-rose-400',
  blue: 'bg-sky-500 dark:bg-sky-400',
  purple: 'bg-purple-500 dark:bg-purple-400',
  orange: 'bg-orange-500 dark:bg-orange-400',
  green: 'bg-emerald-500 dark:bg-emerald-400'
};

// تحويل النطاق من نص إلى قيم رقمية للمؤشر
const parseRange = (range: string): [number, number] => {
  try {
    // استخراج الأرقام من النص مثل "15-35°C" أو "60-85%" أو "6.0-7.5"
    const matches = range.match(/(\d+\.?\d*)-(\d+\.?\d*)/);
    if (matches && matches.length >= 3) {
      return [parseFloat(matches[1]), parseFloat(matches[2])];
    }
  } catch (e) {
    console.error("خطأ في تحليل النطاق:", e);
  }
  return [0, 100]; // قيم افتراضية
};

// استخراج القيمة الرقمية من النص
const parseValue = (value: string): number => {
  try {
    // استخراج الرقم من النص مثل "26.8°C" أو "74.0%" أو "6.3 pH"
    const matches = value.match(/(\d+\.?\d*)/);
    if (matches && matches.length >= 2) {
      return parseFloat(matches[1]);
    }
  } catch (e) {
    console.error("خطأ في تحليل القيمة:", e);
  }
  return 0; // قيمة افتراضية
};

export default function SensorCard({ title, value, icon, color, range, trend, description, flipped = false, onClick, backContent }: SensorCardProps) {
  // حساب نسبة القيمة ضمن النطاق لعرض المؤشر
  const getIndicatorPercentage = (): number => {
    if (!range || value === null) return 50; // قيمة افتراضية إذا لم يتم توفير نطاق
    
    const [min, max] = parseRange(range);
    const numValue = parseValue(value);
    
    // حساب النسبة المئوية للقيمة ضمن النطاق
    let percentage = ((numValue - min) / (max - min)) * 100;
    
    // التأكد من أن النسبة ضمن الحدود 0-100
    percentage = Math.min(100, Math.max(0, percentage));
    
    return percentage;
  };

  const indicatorPercentage = getIndicatorPercentage();

  return (
    <div
      className="flip-card group cursor-pointer"
      onClick={onClick}
      style={{ perspective: 1000 }}
    >
      <div className={`flip-card-inner transition-transform duration-500 ${flipped ? 'rotate-y-180' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* الوجه الأمامي */}
        <div className="flip-card-front min-h-[260px]" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
          <div className="bg-gradient-to-br from-[#f8f9fa] to-[#f5f7f9] dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
            <div className="flex items-center justify-center mb-4 flex-col">
              <div className={clsx('p-3 rounded-xl bg-gradient-to-br mb-2', colorClasses[color].split(' ').slice(0, 2).join(' '))}>
                <div className="text-white">
                  {icon}
                </div>
              </div>
              {description && (
                <div className="text-xs text-gray-600 dark:text-gray-400 text-center max-w-[150px] font-medium">
                  {description}
                </div>
              )}
            </div>
            <h3 className={clsx('text-lg font-semibold mb-2 text-center', colorClasses[color].split(' ').slice(2).join(' '))}>
              {title}
            </h3>
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center justify-center gap-2">
              <span>{value === null ? "-" : value}</span>
              {trend === 'up' && <ArrowUp className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />} 
              {trend === 'down' && <ArrowDown className="w-5 h-5 text-rose-500 dark:text-rose-400" />} 
            </div>
            {range && (
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium text-center">
                المعدل الطبيعي: {range}
              </p>
            )}
          </div>
        </div>
        {/* الوجه الخلفي */}
        <div className="flip-card-back absolute inset-0 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md flex flex-col items-center justify-center p-6 text-center min-h-[260px]" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
          {backContent || <span className="text-gray-700 dark:text-gray-200">لا توجد معلومات إضافية</span>}
        </div>
      </div>
    </div>
  );
}

/* CSS (يمكنك إضافته في index.css أو هنا باستخدام style jsx)
.flip-card { position: relative; width: 100%; height: 100%; }
.flip-card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.5s; }
.rotate-y-180 { transform: rotateY(180deg); }
.flip-card-front, .flip-card-back { position: absolute; width: 100%; height: 100%; top: 0; left: 0; }
*/