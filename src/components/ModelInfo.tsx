import React from 'react';
import { Brain, Zap, Database, BarChart2 } from 'lucide-react';

const ModelInfo: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-green-100 dark:border-gray-700 p-6 mt-8" dir="rtl">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">معلومات عن نموذج الذكاء الاصطناعي</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-4 space-x-reverse">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">بنية النموذج</h3>
              <p className="text-gray-600 dark:text-gray-300">
                يستخدم النظام نموذج YOLOv5 (You Only Look Once) للكشف عن أمراض النباتات. تم تدريب هذا النموذج خصيصًا للتعرف على أمراض القرعيات والنباتات المشابهة.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 space-x-reverse">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Database className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">مجموعة البيانات</h3>
              <p className="text-gray-600 dark:text-gray-300">
                تم تدريب النموذج على مجموعة بيانات COCO تحتوي على صور لأمراض نباتية مختلفة، مع التركيز على أمراض القرعيات مثل البياض الدقيقي والبياض الزغبي وتبقع الأوراق.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-4 space-x-reverse">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">الأداء والسرعة</h3>
              <p className="text-gray-600 dark:text-gray-300">
                يستطيع النموذج معالجة الصور في أقل من 2 ثانية، مع تحديد مناطق الإصابة في الصورة وتصنيفها حسب نوع المرض.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 space-x-reverse">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <BarChart2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">التحسين المستمر</h3>
              <p className="text-gray-600 dark:text-gray-300">
                يمكن تحسين النموذج بإضافة المزيد من الصور وتنويع مجموعة البيانات لتشمل أنواعًا أخرى من النباتات والأمراض.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">الأمراض التي يمكن للنموذج اكتشافها</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {[
            'مرض نبات الصوبا',
            'البياض الدقيقي',
            'البياض الزغبي',
            'تبقع الأوراق السوداء',
            'نبات سليم',
            'مرض غير معروف'
          ].map((disease, index) => (
            <div key={index} className="bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full text-sm text-green-800 dark:text-green-200 text-center">
              {disease}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelInfo; 