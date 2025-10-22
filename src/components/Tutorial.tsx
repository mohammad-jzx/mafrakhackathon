import React, { useState, useEffect } from 'react';
import Joyride, { STATUS, CallBackProps, Step } from 'react-joyride';

interface TutorialProps {
  isFirstVisit: boolean;
  onComplete: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ isFirstVisit, onComplete }) => {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // تأخير بدء الدليل التعريفي لضمان تحميل الصفحة بالكامل
    if (isFirstVisit) {
      const timer = setTimeout(() => {
        setRun(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isFirstVisit]);

  const steps: Step[] = [
    {
      target: 'body',
      content: (
        <div className="text-right p-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center animate-pulse">
              <span className="text-3xl">👋</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-3 text-center">مرحباً بك في منصة AgriAI</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            منصة ذكية لمراقبة المحاصيل الزراعية وتحليل البيانات لمساعدتك في اتخاذ القرارات المناسبة.
            سنقوم بجولة سريعة لتتعرف على أهم الميزات!
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="dashboard"]',
      content: (
        <div className="text-right p-2">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
          <h3 className="font-bold text-lg text-green-600 mb-2">لوحة المعلومات</h3>
          <p className="text-gray-700 dark:text-gray-300">هنا يمكنك مشاهدة البيانات الحية من المستشعرات والحصول على نظرة عامة عن حالة محاصيلك.</p>
          <div className="mt-3 bg-blue-50 dark:bg-blue-900 p-2 rounded-lg border-r-4 border-blue-400">
            <p className="text-sm text-blue-700 dark:text-blue-300">💡 تلميح: راقب قراءات المستشعرات بشكل دوري للحصول على أفضل النتائج.</p>
          </div>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '[data-tour="crops"]',
      content: (
        <div className="text-right p-2">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-2xl">🌱</span>
            </div>
          </div>
          <h3 className="font-bold text-lg text-green-600 mb-2">المحاصيل</h3>
          <p className="text-gray-700 dark:text-gray-300">قم بإضافة وإدارة محاصيلك المختلفة، واختر المحصول الذي تريد متابعته.</p>
          <div className="mt-3 bg-green-50 dark:bg-green-900 p-2 rounded-lg border-r-4 border-green-400">
            <p className="text-sm text-green-700 dark:text-green-300">💡 تلميح: يمكنك إضافة محاصيل مخصصة تناسب احتياجاتك الخاصة.</p>
          </div>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '[data-tour="analysis"]',
      content: (
        <div className="text-right p-2">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
          </div>
          <h3 className="font-bold text-lg text-green-600 mb-2">التحليل والتوصيات</h3>
          <p className="text-gray-700 dark:text-gray-300">احصل على تحليل مفصل وتوصيات ذكية بناءً على بيانات المحصول المختار.</p>
          <div className="mt-3 bg-purple-50 dark:bg-purple-900 p-2 rounded-lg border-r-4 border-purple-400">
            <p className="text-sm text-purple-700 dark:text-purple-300">💡 تلميح: اتبع التوصيات الذكية لتحسين إنتاجية محاصيلك.</p>
          </div>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '[data-tour="history"]',
      content: (
        <div className="text-right p-2">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
          <h3 className="font-bold text-lg text-green-600 mb-2">السجلات والتقارير</h3>
          <p className="text-gray-700 dark:text-gray-300">استعرض سجل البيانات التاريخية ومخططات الاتجاهات والتقارير المفصلة.</p>
          <div className="mt-3 bg-amber-50 dark:bg-amber-900 p-2 rounded-lg border-r-4 border-amber-400">
            <p className="text-sm text-amber-700 dark:text-amber-300">💡 تلميح: استخدم البيانات التاريخية لتحليل أداء محاصيلك على المدى الطويل.</p>
          </div>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '[data-tour="planner"]',
      content: (
        <div className="text-right p-2">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
              <span className="text-2xl">🗓️</span>
            </div>
          </div>
          <h3 className="font-bold text-lg text-green-600 mb-2">تخطيط المحاصيل</h3>
          <p className="text-gray-700 dark:text-gray-300">استخدم نظام التوصية الذكي لاختيار المحاصيل المناسبة لظروفك البيئية.</p>
          <div className="mt-3 bg-teal-50 dark:bg-teal-900 p-2 rounded-lg border-r-4 border-teal-400">
            <p className="text-sm text-teal-700 dark:text-teal-300">💡 تلميح: أدخل بيانات التربة والمناخ للحصول على أفضل التوصيات.</p>
          </div>
        </div>
      ),
      disableBeacon: true,
    },
    
    {
      target: '[data-tour="voice-assistant"]',
      content: (
        <div className="text-right p-2">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-2xl">🎤</span>
            </div>
          </div>
          <h3 className="font-bold text-lg text-green-600 mb-2">المساعد الصوتي</h3>
          <p className="text-gray-700 dark:text-gray-300">استخدم الأوامر الصوتية للتفاعل مع النظام والحصول على المعلومات بسهولة.</p>
          <div className="mt-3 bg-indigo-50 dark:bg-indigo-900 p-2 rounded-lg border-r-4 border-indigo-400">
            <p className="text-sm text-indigo-700 dark:text-indigo-300">💡 تلميح: جرب أوامر مثل "أظهر بيانات الرطوبة" أو "ما هي توصيات المحصول الحالي؟"</p>
          </div>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: 'body',
      content: (
        <div className="text-right p-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
              <span className="text-3xl">🚀</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-3 text-center">أنت جاهز الآن!</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            نتمنى لك تجربة مفيدة وممتعة مع منصة AgriAI.
            يمكنك العودة إلى هذا الدليل في أي وقت من خلال قائمة الإعدادات.
          </p>
          <div className="mt-4 flex justify-center">
            <button 
              onClick={() => {
                onComplete();
                // إعادة تحميل الصفحة عند النقر على زر "ابدأ الاستخدام"
                window.location.reload();
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transform transition-transform hover:scale-105"
            >
              ابدأ الاستخدام
            </button>
          </div>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, action, type } = data;
    
    // عند الانتهاء من الدليل التعريفي أو عند الضغط على زر التخطي
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED || 
        (action === 'close' && type === 'step:after')) {
      // تأكد من إزالة أي تأثيرات متبقية من التوتوريال
      setRun(false);
      
      // قم باستدعاء دالة الاكتمال بعد تأخير قصير للتأكد من إزالة جميع العناصر المرئية للتوتوريال
      setTimeout(() => {
        onComplete();
        // إعادة تحميل الصفحة للتأكد من عودة الواجهة لشكلها الطبيعي
        window.location.reload();
      }, 300);
    }
  };

  // إذا لم تكن هذه الزيارة الأولى، لا تعرض الدليل التعريفي
  if (!isFirstVisit) {
    return null;
  }

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      disableOverlayClose={false}
      hideCloseButton={false}
      styles={{
        options: {
          primaryColor: '#10b981',
          textColor: '#374151',
          zIndex: 10000,
          backgroundColor: '#ffffff',
          arrowColor: '#ffffff',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
        },
        buttonNext: {
          backgroundColor: '#10b981',
          color: '#ffffff',
          fontSize: '16px',
          borderRadius: '50px',
          padding: '10px 20px',
        },
        buttonBack: {
          color: '#10b981',
          fontSize: '16px',
          marginRight: '10px',
        },
        buttonSkip: {
          color: '#6b7280',
        },
        buttonClose: {
          color: '#6b7280',
        },
        tooltip: {
          borderRadius: '8px',
          padding: '15px',
        },
        tooltipContent: {
          padding: '10px 5px',
        },
        tooltipTitle: {
          fontSize: '18px',
        },
      }}
      locale={{
        back: 'السابق',
        close: 'إغلاق',
        last: 'إنهاء',
        next: 'التالي',
        skip: 'تخطي',
      }}
    />
  );
};

export default Tutorial; 