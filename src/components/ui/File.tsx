"use client";
import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Label } from "./Label";

import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { Upload, X, File as FileIcon, Image as ImageIcon } from "lucide-react";

interface FileProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  error?: any;
  helperText?: string;
  multiple?: boolean;
  accept?: string; // e.g., "image/*" or ".pdf,.doc"
  showPreview?: boolean; // Show image previews
  maxSize?: number; // Max file size in bytes
}

export const File = forwardRef<HTMLInputElement, FileProps>(
  (
    {
      label,
      required,
      error,
      helperText,
      multiple = false,
      accept,
      showPreview = true,
      maxSize,
      onChange,
      ...props
    },
    ref
  ) => {
    const [previews, setPreviews] = useState<
      Array<{ url: string; name: string; type: string }>
    >([]);
    const [fileList, setFileList] = useState<FileList | null>(null);
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    const isImage = (type: string) => type.startsWith("image/");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;

      if (files && files.length > 0) {
        setFileList(files);

        // Create previews
        const newPreviews: Array<{ url: string; name: string; type: string }> =
          [];

        Array.from(files).forEach((file) => {
          if (isImage(file.type)) {
            const reader = new FileReader();
            reader.onload = (e) => {
              newPreviews.push({
                url: e.target?.result as string,
                name: file.name,
                type: file.type,
              });
              setPreviews([...newPreviews]);
            };
            reader.readAsDataURL(file);
          } else {
            newPreviews.push({
              url: "",
              name: file.name,
              type: file.type,
            });
            setPreviews([...newPreviews]);
          }
        });
      }

      // Call original onChange if provided
      if (onChange) {
        onChange(e);
      }
    };

    const handleRemoveFile = (index: number) => {
      const newPreviews = previews.filter((_, i) => i !== index);
      setPreviews(newPreviews);

      // Clear the input if no files left
      if (newPreviews.length === 0 && hiddenInputRef.current) {
        hiddenInputRef.current.value = "";
        setFileList(null);
      }
    };

    const handleUploadClick = () => {
      hiddenInputRef.current?.click();
    };

    // Merge refs
    const setRefs = (element: HTMLInputElement | null) => {
      (hiddenInputRef as any).current = element;
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        (ref as any).current = element;
      }
    };

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <Label
            htmlFor={props.id}
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}

        {/* Hidden Input */}
        <input
          type="file"
          ref={setRefs}
          onChange={handleFileChange}
          multiple={multiple}
          accept={accept}
          className="hidden"
          {...props}
        />

        {/* Upload Button/Dropzone */}
        {previews.length === 0 ? (
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleUploadClick}
            className={cn(
              "flex flex-col items-center justify-center w-full h-40",
              "border-2 border-dashed rounded-lg cursor-pointer",
              "transition-colors duration-200",
              error
                ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                : "border-gray-300 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
            )}
          >
            <Upload className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {accept || "Any file type"} {multiple && "(Multiple files)"}
            </p>
            {maxSize && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Max size: {(maxSize / 1024 / 1024).toFixed(2)}MB
              </p>
            )}
          </motion.div>
        ) : (
          <>
            {/* File Previews */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {previews.map((preview, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  <div className="relative h-32 w-full rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {isImage(preview.type) && preview.url ? (
                      <img
                        src={preview.url}
                        alt={preview.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <FileIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-xs text-gray-500 px-2 text-center truncate w-full">
                          {preview.name}
                        </p>
                      </div>
                    )}

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {isImage(preview.type) && (
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {preview.name}
                    </p>
                  )}
                </motion.div>
              ))}

              {/* Add More Button */}
              {multiple && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUploadClick}
                  className="h-32 w-full rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Upload className="w-6 h-6 text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500">Add More</p>
                </motion.div>
              )}
            </div>
          </>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-600 dark:text-red-400"
          >
            {error.message}
          </motion.p>
        )}
      </div>
    );
  }
);

File.displayName = "File";
