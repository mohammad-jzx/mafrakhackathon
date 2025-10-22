import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color?: string; // optional: custom color for icon/bg
  delay?: number; // for animation delay
  shape?: 'circle' | 'default';
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, color, delay = 0, shape = 'default' }) => {
  if (shape === 'circle') {
    return (
      <div
        className={`stat-card flex flex-col items-center justify-center rounded-full shadow-md hover:shadow-xl p-0 bg-white dark:bg-[#23272f] transition-all duration-500 animate-fadeInUp`}
        style={{ animationDelay: `${delay}ms`, width: 120, height: 120, minWidth: 120, minHeight: 120 }}
      >
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="mb-1 text-3xl" style={color ? { color } : {}}>{icon}</div>
          <div className="font-extrabold text-xl mb-0.5 text-gray-900 dark:text-white" dir="ltr">{value}</div>
          <div className="text-xs text-gray-600 dark:text-gray-300 font-medium text-center">{label}</div>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`stat-card flex flex-col items-center justify-center rounded-3xl shadow-md hover:shadow-xl p-4 bg-[#f8f9fa] dark:bg-[#23272f] transition-all duration-500 animate-fadeInUp`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-2 text-3xl" style={color ? { color } : {}}>{icon}</div>
      <div className="font-extrabold text-2xl mb-1 text-gray-900 dark:text-white" dir="ltr">{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-300 font-medium text-center">{label}</div>
    </div>
  );
};

export default StatCard;
