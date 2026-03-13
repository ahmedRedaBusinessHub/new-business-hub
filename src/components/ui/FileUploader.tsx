'use client';

import React, { useRef, useState } from 'react';

interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onChange?: (files: File[]) => void;
  onError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  accept,
  multiple = true,
  maxSize = 10 * 1024 * 1024,
  onChange,
  onError,
  className = '',
  children,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File) => {
    if (maxSize && file.size > maxSize) {
      onError?.(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(validateFile);
    
    if (validFiles.length > 0) {
      setFiles(multiple ? [...files, ...validFiles] : validFiles);
      onChange?.(multiple ? [...files, ...validFiles] : validFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(validateFile);
    
    if (validFiles.length > 0) {
      setFiles(multiple ? [...files, ...validFiles] : validFiles);
      onChange?.(multiple ? [...files, ...validFiles] : validFiles);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onChange?.(newFiles);
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
        {children || (
          <div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Drag and drop files here or click to select
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Max file size: {maxSize / (1024 * 1024)}MB
            </p>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg">📄</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="ml-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
