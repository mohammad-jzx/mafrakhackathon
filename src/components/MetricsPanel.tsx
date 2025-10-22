import React from 'react';
import { BarChart3, TrendingUp, Target, AlertCircle } from 'lucide-react';

const MetricsPanel: React.FC = () => {
  // بيانات مصفوفة الالتباس
  const confusionMatrix = [
    [850, 12, 8, 5],
    [15, 892, 18, 3],
    [10, 20, 845, 12],
    [7, 8, 15, 901]
  ];

  const classNames = ['سليم', 'تبقع الأوراق', 'الصدأ', 'اللفحة'];
  
  const performanceMetrics = [
    { name: 'الدقة', value: 97.3, color: 'text-green-600' },
    { name: 'الدقة الإيجابية', value: 96.8, color: 'text-blue-600' },
    { name: 'الاسترجاع', value: 97.1, color: 'text-purple-600' },
    { name: 'F1-Score', value: 96.9, color: 'text-orange-600' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-green-100 dark:border-gray-700 p-6 mt-8" dir="rtl">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">مقاييس أداء النموذج</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* مقاييس الدقة */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">مقاييس الدقة</h3>
          <div className="space-y-4">
            {/* مقياس mAP */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">متوسط الدقة (mAP@0.5)</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">94.8%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '94.8%' }}></div>
              </div>
            </div>
            
            {/* مقياس الدقة */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">الدقة (Precision)</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">92.5%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92.5%' }}></div>
              </div>
            </div>
            
            {/* مقياس الاستدعاء */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">الاستدعاء (Recall)</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">91.2%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '91.2%' }}></div>
              </div>
            </div>
            
            {/* مقياس F1 */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">قيمة F1</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">91.8%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '91.8%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* مصفوفة الارتباك */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">أداء النموذج حسب نوع المرض</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">المرض</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الدقة</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الاستدعاء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  { disease: 'تبقع الأوراق', precision: '96.2%', recall: '94.5%' },
                  { disease: 'البياض الدقيقي', precision: '95.8%', recall: '93.7%' },
                  { disease: 'البياض الزغبي', precision: '94.1%', recall: '91.3%' },
                  { disease: 'الصدأ', precision: '93.5%', recall: '90.2%' },
                  { disease: 'اللفحة المبكرة', precision: '92.7%', recall: '89.8%' }
                ].map((item, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200">{item.disease}</td>
                    <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200">{item.precision}</td>
                    <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200">{item.recall}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">معلومات تقنية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">حجم الإدخال:</span> 640×640×3</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">عتبة الثقة:</span> 0.4</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">عتبة IoU:</span> 0.45</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">وقت المعالجة:</span> ~1.2 ثانية</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel; 