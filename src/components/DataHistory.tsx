import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import type { SensorData } from '../types';
// @ts-ignore: تعريف مؤقت لموديول react-mermaid2
// eslint-disable-next-line
import Mermaid from 'react-mermaid2';

// دالة مساعدة آمنة للتعامل مع toFixed
function safeToFixed(value: number | null | undefined, digits: number = 1): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "-";
  }
  return value.toFixed(digits);
}

interface DataHistoryProps {
  data: SensorData[];
  showDetailed?: boolean;
  airTemperatureAvg?: number | null;
}

export default function DataHistory({ data, showDetailed = false, airTemperatureAvg = null }: DataHistoryProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">📊</div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد بيانات</h3>
        <p className="text-gray-500">لم يتم تسجيل أي بيانات بعد</p>
      </div>
    );
  }

  const chartData = data.map(item => ({
    ...item,
    time: format(item.timestamp, 'HH:mm', { locale: ar }),
    date: format(item.timestamp, 'dd/MM', { locale: ar })
  }));

  const averages = {
    temperature: data.reduce((sum, item) => sum + (item.temperature || 0), 0) / data.length,
    humidity: data.reduce((sum, item) => sum + (item.humidity || 0), 0) / data.length,
    ph: data.reduce((sum, item) => sum + (item.ph || 0), 0) / data.length,
    nitrogen: data.reduce((sum, item) => sum + (item.nitrogen || 0), 0) / data.length,
    phosphorus: data.reduce((sum, item) => sum + (item.phosphorus || 0), 0) / data.length,
    potassium: data.reduce((sum, item) => sum + (item.potassium || 0), 0) / data.length,
  };

  // توصية الذكاء الاصطناعي (Random Forest)
  const [rfRecommendation, setRfRecommendation] = useState<string | null>(null);
  const fetchRfRecommendation = () => {
    if (data.length === 0) return;
    const last = data[data.length - 1];
    if ([last.temperature, last.humidity, last.ph, last.nitrogen, last.phosphorus, last.potassium].some(v => v === undefined || v === null)) return;
    setRfRecommendation('جاري التحليل...');
    fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        temp: last.temperature || 0,
        humidity: last.humidity || 0,
        soil_moisture: 0,
        ph: last.ph || 0,
        n: last.nitrogen || 0,
        p: last.phosphorus || 0,
        k: last.potassium || 0,
        ec: last.conductivity || 1.0
      })
    })
      .then(res => res.json())
      .then(data => setRfRecommendation(data.recommendation))
      .catch(() => setRfRecommendation('تعذر جلب التوصية'));
  };

  // 1. state جديد لتخزين التوصيات المتعددة
  const [rfRecommendations, setRfRecommendations] = useState<string[]>([]);
  const [loadingRf, setLoadingRf] = useState(false);

  // 2. دالة جديدة لجلب عدة توصيات
  const fetchMultipleRfRecommendations = async () => {
    if (data.length === 0) return;
    setLoadingRf(true);
    const last = data[data.length - 1];
    // توليد بيانات مختلفة قليلاً لكل طلب
    const requests = Array.from({ length: 10 }).map((_, i) => {
      // غيّر temp والرطوبة بشكل طفيف
      const temp = (last.temperature || 0) + (Math.random() - 0.5) * 2;
      const humidity = (last.humidity || 0) + (Math.random() - 0.5) * 4;
      return fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temp,
          humidity,
          soil_moisture: 0,
          ph: last.ph || 0,
          n: last.nitrogen || 0,
          p: last.phosphorus || 0,
          k: last.potassium || 0,
          ec: last.conductivity || 1.0
        })
      })
        .then(res => res.json())
        .then(data => data.recommendation || '—')
        .catch(() => 'تعذر جلب التوصية');
    });
    const results = await Promise.all(requests);
    // إزالة التكرار
    const unique = Array.from(new Set(results)).filter(r => r && r !== '—' && r !== 'تعذر جلب التوصية');
    setRfRecommendations(unique.slice(0, 5));
    setLoadingRf(false);
  };

  if (!showDetailed) {
    return (
      <div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => `الوقت: ${value}`}
                formatter={(value: number, name: string) => {
                  const labels: Record<string, string> = {
                    temperature: 'درجة الحرارة (°C)',
                    humidity: 'رطوبة التربة (%)'
                  };
                  return [safeToFixed(value), labels[name] || name];
                }}
              />
              <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} name="temperature" />
              <Line type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={2} name="humidity" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">📈 السجلات والتقارير</h3>

      {/* توصية الذكاء الاصطناعي */}
      {/* تم تعطيل عرض التوصية بناءً على طلب المستخدم */}
      {/*
      {rfRecommendation && rfRecommendation !== 'تعذر جلب التوصية' && (
        <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200 flex items-center gap-3 shadow-sm">
          <span className="text-2xl">🤖</span>
          <span className="font-bold text-blue-800">توصية الذكاء الاصطناعي:</span>
          <span className="text-blue-700">{rfRecommendation}</span>
        </div>
      )}
      */}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:!bg-transparent !bg-gradient-none p-4 rounded-lg border border-red-200">
          <div className="text-red-600 font-semibold">متوسط درجة حرارة التربة</div>
          <div className="text-2xl font-bold text-red-800">{safeToFixed(averages.temperature)}°C</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:!bg-transparent !bg-gradient-none p-4 rounded-lg border border-blue-200">
          <div className="text-blue-600 font-semibold">متوسط درجة الحرارة</div>
          <div className="text-2xl font-bold text-blue-800">{airTemperatureAvg !== null ? safeToFixed(airTemperatureAvg) + '°C' : '—'}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:!bg-transparent !bg-gradient-none p-4 rounded-lg border border-purple-200">
          <div className="text-purple-600 font-semibold">متوسط رطوبة التربة</div>
          <div className="text-2xl font-bold text-purple-800">{safeToFixed(averages.humidity)}%</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:!bg-transparent !bg-gradient-none p-4 rounded-lg border border-green-200">
          <div className="text-green-600 font-semibold">متوسط pH</div>
          <div className="text-2xl font-bold text-green-800">{safeToFixed(averages.ph)}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Temperature and Humidity Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <h4 className="font-semibold text-gray-800 mb-4">اتجاهات درجة الحرارة والرطوبة</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Soil Conditions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <h4 className="font-semibold text-gray-800 mb-4">ظروف التربة</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="humidity" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="ph" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Nutrients Bar Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 mb-8">
        <h4 className="font-semibold text-gray-800 mb-4">العناصر الغذائية - آخر القراءات</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.slice(-10)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="nitrogen" fill="#10b981" name="النيتروجين" />
            <Bar dataKey="phosphorus" fill="#f59e0b" name="الفسفور" />
            <Bar dataKey="potassium" fill="#8b5cf6" name="البوتاسيوم" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
        <h4 className="font-semibold text-gray-800 mb-4">جدول البيانات التفصيلي</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="p-2 text-right text-gray-800 dark:text-gray-100">الوقت</th>
                <th className="p-2 text-right text-gray-800 dark:text-gray-100">درجة الحرارة</th>
                <th className="p-2 text-right text-gray-800 dark:text-gray-100">رطوبة التربة</th>
                <th className="p-2 text-right text-gray-800 dark:text-gray-100">pH</th>
                <th className="p-2 text-right text-gray-800 dark:text-gray-100">N</th>
                <th className="p-2 text-right text-gray-800 dark:text-gray-100">P</th>
                <th className="p-2 text-right text-gray-800 dark:text-gray-100">K</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(-20).reverse().map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-2 text-gray-700 dark:text-gray-200">{format(item.timestamp, 'dd/MM HH:mm', { locale: ar })}</td>
                  <td className="p-2 text-gray-700 dark:text-gray-200">{safeToFixed(item.temperature)}°C</td>
                  <td className="p-2 text-gray-700 dark:text-gray-200">{safeToFixed(item.humidity)}%</td>
                  <td className="p-2 text-gray-700 dark:text-gray-200">{safeToFixed(item.ph)}</td>
                  <td className="p-2 text-gray-700 dark:text-gray-200">{safeToFixed(item.nitrogen)}</td>
                  <td className="p-2 text-gray-700 dark:text-gray-200">{safeToFixed(item.phosphorus)}</td>
                  <td className="p-2 text-gray-700 dark:text-gray-200">{safeToFixed(item.potassium)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Environmental Footprint Analysis */}
      <div className="bg-white dark:bg-gray-900 border border-green-200 dark:border-gray-700 rounded-lg p-6 mt-8">
        <div className="flex items-center justify-between mb-4 gap-2">
          <h4 className="text-lg font-bold text-green-800">🌿 تحليل البصمة البيئية</h4>
          <div className="flex gap-2">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-all" onClick={() => window.print()}>
              🖨️ تصدير التقرير كـ PDF
            </button>
          </div>
        </div>
        {/* رسم بياني فعلي باستخدام Mermaid */}
        <div className="w-full flex justify-center mb-6 mt-6">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto border border-green-200 dark:border-gray-700" style={{minWidth: 320, maxWidth: 600}}>
            <Mermaid
              chart={`flowchart TD\n    A[\"💧 استهلاك المياه\\nمتوسط رطوبة التربة × عدد القراءات × 0.5\"] --> B[\"🌫️ انبعاثات الكربون\\nعدد القراءات × 0.2\"]\n    C[\"🧪 هدر السماد\\n|N-100| + |P-50| + |K-100|\"] --> B\n    style A fill:#e0f7fa,stroke:#26a69a,stroke-width:2px\n    style B fill:#f1f8e9,stroke:#388e3c,stroke-width:2px\n    style C fill:#fffde7,stroke:#fbc02d,stroke-width:2px\n`}
            />
          </div>
        </div>
        {/* بطاقات المؤشرات */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-6">
          {/* Water Usage */}
          <div className="flex flex-col items-center w-64 bg-white dark:bg-gray-900 border border-green-200 dark:border-gray-700 rounded-lg p-4 mb-4 md:mb-0 relative group">
            <span className="text-5xl">💧</span>
            <div className="mt-2 text-2xl font-bold text-gray-800 dark:text-gray-100">{(averages.humidity * data.length * 0.5).toLocaleString(undefined, {maximumFractionDigits: 0})} لتر</div>
            <div className="text-green-700 dark:text-green-300 font-bold mt-1">استهلاك المياه</div>
            {/* Progress Bar */}
            <div className="w-full mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-700 dark:text-gray-200">منخفض</span><span className="text-gray-700 dark:text-gray-200">مرتفع</span>
              </div>
              <div className="w-full h-3 bg-green-100 rounded-full overflow-hidden">
                <div className={`h-3 rounded-full transition-all ${averages.humidity * data.length * 0.5 < 1000 ? 'bg-green-400 w-1/4' : averages.humidity * data.length * 0.5 < 3000 ? 'bg-yellow-400 w-2/4' : 'bg-red-400 w-4/4'}`}></div>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300 mt-1 text-center">
                {averages.humidity * data.length * 0.5 < 1000 ? 'منخفض' : averages.humidity * data.length * 0.5 < 3000 ? 'متوسط' : 'مرتفع'}
              </div>
            </div>
            {/* Tooltip */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded p-2 text-xs shadow-lg z-10 text-gray-700 dark:text-gray-200">
              متوسط رطوبة التربة × عدد القراءات × 0.5
            </div>
            {/* Sparkline */}
            <div className="w-full mt-2">
              <ResponsiveContainer width="100%" height={40}>
                <LineChart data={data.slice(-20)}>
                  <Line type="monotone" dataKey="humidity" stroke="#22c55e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {/* Recommendation */}
            <div className="text-xs text-red-600 dark:text-red-400 mt-2 text-center">
              {averages.humidity * data.length * 0.5 > 3000 ? 'استهلاك المياه مرتفع – يفضل استخدام تغطية للتربة.' : averages.humidity * data.length * 0.5 < 1000 ? 'استهلاك المياه منخفض – الوضع جيد.' : 'استهلاك معتدل – راقب الري.'}
            </div>
          </div>
          {/* Carbon Emissions */}
          <div className="flex flex-col items-center w-64 bg-white dark:bg-gray-900 border border-green-200 dark:border-gray-700 rounded-lg p-4 mb-4 md:mb-0 relative group">
            <span className="text-5xl">🌫️</span>
            <div className="mt-2 text-2xl font-bold text-gray-800 dark:text-gray-100">{(data.length * 0.2).toLocaleString(undefined, {maximumFractionDigits: 1})} كجم CO₂</div>
            <div className="text-green-700 dark:text-green-300 font-bold mt-1">انبعاثات الكربون</div>
            {/* Progress Bar */}
            <div className="w-full mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-700 dark:text-gray-200">منخفض</span><span className="text-gray-700 dark:text-gray-200">مرتفع</span>
              </div>
              <div className="w-full h-3 bg-green-100 rounded-full overflow-hidden">
                <div className={`h-3 rounded-full transition-all ${data.length * 0.2 < 10 ? 'bg-green-400 w-1/4' : data.length * 0.2 < 30 ? 'bg-yellow-400 w-2/4' : 'bg-red-400 w-4/4'}`}></div>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300 mt-1 text-center">
                {data.length * 0.2 < 10 ? 'منخفض' : data.length * 0.2 < 30 ? 'متوسط' : 'مرتفع'}
              </div>
            </div>
            {/* Tooltip */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded p-2 text-xs shadow-lg z-10 text-gray-700 dark:text-gray-200">
              عدد القراءات × 0.2
            </div>
            {/* Sparkline */}
            <div className="w-full mt-2">
              <ResponsiveContainer width="100%" height={40}>
                <LineChart data={data.slice(-20)}>
                  <Line type="monotone" dataKey={() => 0.2} stroke="#0ea5e9" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {/* Recommendation */}
            <div className="text-xs text-red-600 dark:text-red-400 mt-2 text-center">
              {data.length * 0.2 > 30 ? 'انبعاثات الكربون مرتفعة – قلل من الهدر.' : data.length * 0.2 < 10 ? 'انبعاثات منخفضة – الوضع جيد.' : 'انبعاثات معتدلة – راقب العمليات.'}
            </div>
          </div>
          {/* Fertilizer Waste */}
          <div className="flex flex-col items-center w-64 bg-white dark:bg-gray-900 border border-green-200 dark:border-gray-700 rounded-lg p-4 relative group">
            <span className="text-5xl">🧪</span>
            <div className="mt-2 text-2xl font-bold text-gray-800 dark:text-gray-100">{(Math.abs(100 - averages.nitrogen) + Math.abs(50 - averages.phosphorus) + Math.abs(100 - averages.potassium)).toLocaleString(undefined, {maximumFractionDigits: 0})} وحدة</div>
            <div className="text-green-700 dark:text-green-300 font-bold mt-1">هدر السماد</div>
            {/* Progress Bar */}
            <div className="w-full mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-700 dark:text-gray-200">منخفض</span><span className="text-gray-700 dark:text-gray-200">مرتفع</span>
              </div>
              <div className="w-full h-3 bg-green-100 rounded-full overflow-hidden">
                <div className={`h-3 rounded-full transition-all ${(Math.abs(100 - averages.nitrogen) + Math.abs(50 - averages.phosphorus) + Math.abs(100 - averages.potassium)) < 50 ? 'bg-green-400 w-1/4' : (Math.abs(100 - averages.nitrogen) + Math.abs(50 - averages.phosphorus) + Math.abs(100 - averages.potassium)) < 150 ? 'bg-yellow-400 w-2/4' : 'bg-red-400 w-4/4'}`}></div>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300 mt-1 text-center">
                {(Math.abs(100 - averages.nitrogen) + Math.abs(50 - averages.phosphorus) + Math.abs(100 - averages.potassium)) < 50 ? 'منخفض' : (Math.abs(100 - averages.nitrogen) + Math.abs(50 - averages.phosphorus) + Math.abs(100 - averages.potassium)) < 150 ? 'متوسط' : 'مرتفع'}
              </div>
            </div>
            {/* Tooltip */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded p-2 text-xs shadow-lg z-10 text-gray-700 dark:text-gray-200">
              |N-100| + |P-50| + |K-100|
            </div>
            {/* Sparkline */}
            <div className="w-full mt-2">
              <ResponsiveContainer width="100%" height={40}>
                <LineChart data={data.slice(-20)}>
                  <Line type="monotone" dataKey={d => Math.abs(100 - d.nitrogen) + Math.abs(50 - d.phosphorus) + Math.abs(100 - d.potassium)} stroke="#f59e42" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {/* Recommendation */}
            <div className="text-xs text-red-600 dark:text-red-400 mt-2 text-center">
              {(Math.abs(100 - averages.nitrogen) + Math.abs(50 - averages.phosphorus) + Math.abs(100 - averages.potassium)) > 150 ? 'هدر السماد مرتفع – اضبط التسميد.' : (Math.abs(100 - averages.nitrogen) + Math.abs(50 - averages.phosphorus) + Math.abs(100 - averages.potassium)) < 50 ? 'هدر منخفض – الوضع جيد.' : 'هدر معتدل – راقب التسميد.'}
            </div>
          </div>
        </div>
        {/* جدول التوصيات */}
        {rfRecommendations.length > 0 && (
          <div className="mt-8">
            <h5 className="text-center text-lg font-bold mb-2 text-blue-700 dark:text-blue-300">جدول التوصيات الذكية</h5>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-lg">
                <thead>
                  <tr className="bg-blue-50 dark:bg-gray-800">
                    <th className="p-2 text-right text-blue-900 dark:text-blue-200">#</th>
                    <th className="p-2 text-right text-blue-900 dark:text-blue-200">التوصية</th>
                  </tr>
                </thead>
                <tbody>
                  {rfRecommendations.map((rec, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2 text-right text-gray-700 dark:text-gray-200">{idx + 1}</td>
                      <td className="p-2 text-right text-gray-700 dark:text-gray-200">{rec}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* زر تحسين التوصيات في الأسفل */}
        <div className="flex justify-center mt-8">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-all text-lg"
            onClick={fetchMultipleRfRecommendations}
            disabled={loadingRf}
          >
            {loadingRf ? 'جاري التحليل...' : '🚀 تحسين التوصيات'}
          </button>
        </div>
      </div>
    </div>
  );
}