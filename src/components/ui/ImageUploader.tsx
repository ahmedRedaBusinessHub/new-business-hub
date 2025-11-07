'use client';

import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onChange?: (files: File[]) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  accept = 'image/*',
  multiple = false,
  maxSize = 5 * 1024 * 1024,
  onChange,
  onError,
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const validateImage = (file: File) => {
    if (maxSize && file.size > maxSize) {
      onError?.(`Image size exceeds ${maxSize / (1024 * 1024)}MB limit`);
      return false;
    }
    if (!file.type.startsWith('image/')) {
      onError?.('Please upload a valid image file');
      return false;
    }
    return true;
  };

  const createPreview = async (file: File) => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(validateImage);

    for (const file of validFiles) {
      const preview = await createPreview(file);
      setImages((prev) => (multiple ? [...prev, { file, preview }] : [{ file, preview }]));
    }

    const files = validFiles;
    onChange?.(multiple ? [...images.map((img) => img.file), ...files] : files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(validateImage);

    for (const file of validFiles) {
      const preview = await createPreview(file);
      setImages((prev) => (multiple ? [...prev, { file, preview }] : [{ file, preview }]));
    }

    onChange?.(multiple ? [...images.map((img) => img.file), ...validFiles] : validFiles);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onChange?.(newImages.map((img) => img.file));
  };

  return (
    <div className={className}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
        <div>
          <p className="text-2xl mb-2">🖼️</p>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Drag and drop images here or click to select
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Max size: {maxSize / (1024 * 1024)}MB per image
          </p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-square"
            >
              <img
                src={img.preview}
                alt={`Preview ${index}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="text-white text-2xl">✕</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
