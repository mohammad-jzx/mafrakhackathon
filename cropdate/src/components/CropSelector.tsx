import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cropsDatabase } from '../data/cropsDatabase';

interface CropSelectorProps {
  selectedCrop: string;
  onCropSelect: (cropId: string) => void;
}

export const CropSelector: React.FC<CropSelectorProps> = ({
  selectedCrop,
  onCropSelect
}) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        اختر نوع المحصول
      </label>
      <div className="relative">
        <select
          value={selectedCrop}
          onChange={(e) => onCropSelect(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none cursor-pointer transition-all duration-200"
        >
          <option value="">اختر محصولاً...</option>
          {cropsDatabase.map((crop) => (
            <option key={crop.id} value={crop.id}>
              {crop.nameAr} - {crop.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      
      {selectedCrop && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          {(() => {
            const crop = cropsDatabase.find(c => c.id === selectedCrop);
            return crop ? (
              <div>
                <h3 className="font-semibold text-green-800 mb-2">{crop.nameAr}</h3>
                <p className="text-sm text-green-700 mb-2">{crop.description}</p>
                <div className="text-xs text-green-600">
                  <p><strong>موسم الحصاد:</strong> {crop.harvestSeason}</p>
                  <p><strong>فترة النمو:</strong> ~{crop.averageGrowthDays} يوم</p>
                </div>
              </div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
};