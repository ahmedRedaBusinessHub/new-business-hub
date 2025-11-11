"use client";

import React, { useRef, useState } from "react";

interface VideoUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onChange?: (files: File[]) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  accept = "video/*",
  multiple = false,
  maxSize = 100 * 1024 * 1024,
  onChange,
  onError,
  className = "",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [videos, setVideos] = useState<{ file: File; duration: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const validateVideo = (file: File) => {
    if (maxSize && file.size > maxSize) {
      onError?.(
        `Video size exceeds ${maxSize / ((1024 * 1024) / 1024)}GB limit`
      );
      return false;
    }
    if (!file.type.startsWith("video/")) {
      onError?.("Please upload a valid video file");
      return false;
    }
    return true;
  };

  const getVideoDuration = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      const reader = new FileReader();
      reader.onload = (e: any) => {
        video.src = e.target?.result as string;
        video.onloadedmetadata = () => {
          const minutes = Math.floor(video.duration / 60);
          const seconds = Math.floor(video.duration % 60);
          resolve(`${minutes}:${seconds.toString().padStart(2, "0")}`);
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(validateVideo);

    for (const file of validFiles) {
      const duration = await getVideoDuration(file);
      setVideos((prev) =>
        multiple ? [...prev, { file, duration }] : [{ file, duration }]
      );
    }

    onChange?.(
      multiple ? [...videos.map((v) => v.file), ...validFiles] : validFiles
    );
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
    const validFiles = droppedFiles.filter(validateVideo);

    for (const file of validFiles) {
      const duration = await getVideoDuration(file);
      setVideos((prev) =>
        multiple ? [...prev, { file, duration }] : [{ file, duration }]
      );
    }

    onChange?.(
      multiple ? [...videos.map((v) => v.file), ...validFiles] : validFiles
    );
  };

  const removeVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    setVideos(newVideos);
    onChange?.(newVideos.map((v) => v.file));
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
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
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
          <p className="text-2xl mb-2">🎬</p>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Drag and drop videos here or click to select
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Max size: {maxSize / (1024 * 1024 * 1024)}GB per video
          </p>
        </div>
      </div>

      {videos.length > 0 && (
        <div className="mt-4 space-y-2">
          {videos.map((video, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg">🎥</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {video.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {video.duration} ·{" "}
                    {(video.file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeVideo(index)}
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
