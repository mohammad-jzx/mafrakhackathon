import React, { useState } from 'react';
import { Wifi, WifiOff, Edit3, Server, Check, X } from 'lucide-react';

interface SensorStatusProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onManualInput: () => void;
  hasData: boolean; // إضافة خاصية جديدة للتحقق من وجود بيانات
  isManualMode?: boolean; // إضافة خاصية للوضع اليدوي
  onEnableSensor?: () => void; // إضافة دالة لإعادة تفعيل المستشعر
}

export default function SensorStatus({ isConnected, onConnect, onDisconnect, onManualInput, hasData, isManualMode, onEnableSensor }: SensorStatusProps) {
  // دالة تبديل الاتصال
  const [showManualHint, setShowManualHint] = useState(false);
  
  // دالة محاولة الإدخال اليدوي عند التعطيل
  const handleManualTry = () => {
    if (isConnected) {
      console.log('manual try');
      setShowManualHint(true);
      setTimeout(() => {
        setShowManualHint(false);
        console.log('manual hint hidden');
      }, 2000);
    }
  };
  
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
        <Wifi className="w-4 h-4" />
        حالة المستشعر
      </h4>
      {/* صف أفقي: كرت الحالة + زر الإدخال اليدوي */}
      <div className="flex flex-row gap-4 justify-center items-stretch">
        {/* كرت الحالة */}
        <div
          className={`flex-1 rounded-2xl shadow-xl p-6 text-center max-w-md transition-all duration-300 select-none
          ${isManualMode
            ? 'bg-blue-500 dark:bg-blue-600 text-white cursor-default'
            : isConnected
            ? 'bg-green-500 dark:bg-green-600 text-white cursor-default'
            : 'bg-red-500 dark:bg-red-600 text-white cursor-default'}
          `}
          style={{ boxShadow: isManualMode ? '0 4px 24px 0 rgba(59,130,246,0.15)' : '0 4px 24px 0 rgba(34,197,94,0.15)' }}
          title={isManualMode ? 'الوضع اليدوي مفعل - النظام يعمل على القيم اليدوية' : isConnected ? 'المستشعر متصل ويرسل بيانات' : 'المستشعر غير متصل'}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className={`relative flex h-6 w-6 items-center justify-center`}>
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isManualMode ? 'bg-white/70' : isConnected ? 'bg-white/70' : 'bg-white/40'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-6 w-6 ${isManualMode ? 'bg-white' : isConnected ? 'bg-white' : 'bg-white/70'} items-center justify-center`}>
                {isManualMode ? (
                  <Edit3 className="w-4 h-4 text-blue-600" />
                ) : isConnected ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <X className="w-4 h-4 text-red-600" />
                )}
              </span>
            </span>
            <span className="font-bold text-lg">
              {isManualMode ? 'وضع يدوي' : isConnected ? 'متصل' : 'غير متصل'}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Server className="w-5 h-5 opacity-80" />
            <span className="font-medium text-base">
              {isManualMode ? 'قيم يدوية' : 'مستشعر RS485 7-in-1'}
            </span>
          </div>
          <div className="text-xs opacity-80">
            {isManualMode ? 'النظام يعمل على القيم اليدوية' : isConnected ? 'آخر تحديث: الآن' : 'لا توجد بيانات من المستشعر'}
          </div>
        </div>
        {/* زر الإدخال اليدوي أو إعادة تفعيل المستشعر */}
        {isManualMode ? (
          <button
            onClick={onEnableSensor}
            className="flex-1 flex flex-col items-center justify-center rounded-2xl shadow-xl p-6 max-w-md transition-all duration-300 cursor-pointer select-none text-lg font-bold group hover:scale-105 hover:translate-y-[-8px] hover:z-10 bg-green-600 dark:bg-green-600 text-white dark:text-white hover:bg-green-700 dark:hover:bg-green-700"
            style={{ boxShadow: '0 4px 24px 0 rgba(34,197,94,0.15)' }}
            title="إعادة تفعيل المستشعر"
          >
            <Wifi className="w-7 h-7 mb-2" />
            إعادة تفعيل المستشعر
          </button>
        ) : (
          <button
            onClick={isConnected ? handleManualTry : onManualInput}
            disabled={isConnected}
            className={`flex-1 flex flex-col items-center justify-center rounded-2xl shadow-xl p-6 max-w-md transition-all duration-300 cursor-pointer select-none text-lg font-bold group hover:scale-105 hover:translate-y-[-8px] hover:z-10
              ${isConnected ? 'bg-gray-500 dark:bg-gray-600 text-gray-200 dark:text-gray-300 cursor-not-allowed opacity-60' : 'bg-blue-600 dark:bg-blue-600 text-white dark:text-white hover:bg-blue-700 dark:hover:bg-blue-700'}
            `}
            style={{ boxShadow: '0 4px 24px 0 rgba(59,130,246,0.15)' }}
            title="إدخال يدوي"
          >
            <Edit3 className="w-7 h-7 mb-2" />
            إدخال يدوي
          </button>
        )}
      </div>
      {/* الرسالة التوضيحية تحت الصندوقين */}
      {showManualHint && (
        <div className="w-full flex justify-center mt-4">
          <div className="animate-slideDown rounded-xl shadow-lg py-3 px-4 text-center font-bold text-base bg-yellow-400 dark:bg-yellow-500 text-yellow-900 dark:text-yellow-100">
            لإدخال القيم يدوياً، اقطع اتصال RS485!
          </div>
        </div>
      )}
      
      {/* رسالة الوضع اليدوي */}
      {isManualMode && (
        <div className="w-full flex justify-center mt-4">
          <div className="animate-slideDown rounded-xl shadow-lg py-3 px-4 text-center font-bold text-base bg-blue-400 dark:bg-blue-500 text-blue-900 dark:text-blue-100">
            ✅ الوضع اليدوي مفعل - النظام يعمل على القيم اليدوية بدون توقف
          </div>
        </div>
      )}
    </div>
  );
}
/* أضف في index.css:
@keyframes slideDown {
  0% { opacity: 0; transform: translateY(-24px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-slideDown {
  animation: slideDown 0.5s cubic-bezier(.4,2,.6,1) both;
}
*/
