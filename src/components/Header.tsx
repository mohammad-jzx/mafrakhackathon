import React from 'react';
import { Leaf } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">AgriAI</span>
              <span className="bg-green-600 rounded-lg p-2 mr-2 ml-4">
                <Leaf className="w-5 h-5 text-white" />
              </span>
            </div>
            <span className="text-gray-600 dark:text-gray-300 text-base mt-1">Plant Disease Detection</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 