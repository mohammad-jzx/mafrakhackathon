import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onImageRemove: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelect,
  selectedImage,
  onImageRemove
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      onImageSelect(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeImage = () => {
    onImageRemove();
    setImagePreview(null);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        ارفع صورة المحصول
      </label>
      
      {!selectedImage ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            dragActive
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                اسحب صورتك هنا، أو انقر للتصفح
              </p>
              <p className="text-sm text-gray-500 mt-1">
                PNG, JPG, GIF حتى 10 ميجابايت
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="صورة المحصول المرفوعة"
                className="w-full h-64 object-cover"
              />
            )}
            <button
              onClick={removeImage}
              className="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <ImageIcon className="w-4 h-4 ml-2" />
            {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} ميجابايت)
          </div>
        </div>
      )}
    </div>
  );
};