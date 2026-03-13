// utils/fileValidation.ts
import { z } from "zod";

// Single file validation
export const fileSchema = z
  .instanceof(FileList)
  .optional()
  .refine(
    (files) => !files || files.length === 0 || files[0].size <= 5 * 1024 * 1024,
    "File size must be less than 5MB"
  );

// Image file validation
export const imageSchema = z
  .instanceof(FileList)
  .optional()
  .refine(
    (files) => !files || files.length === 0 || files[0].size <= 5 * 1024 * 1024,
    "Image size must be less than 5MB"
  )
  .refine(
    (files) =>
      !files ||
      files.length === 0 ||
      ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        files[0].type
      ),
    "Only .jpg, .jpeg, .png and .webp formats are supported"
  );

// Multiple images validation
export const multipleImagesSchema = z
  .instanceof(FileList)
  .optional()
  .refine((files) => {
    if (!files || files.length === 0) return true;
    return Array.from(files).every((file) => file.size <= 5 * 1024 * 1024);
  }, "Each file must be less than 5MB")
  .refine((files) => {
    if (!files || files.length === 0) return true;
    return Array.from(files).every((file) =>
      ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)
    );
  }, "Only .jpg, .jpeg, .png and .webp formats are supported")
  .refine(
    (files) => !files || files.length <= 10,
    "You can upload a maximum of 10 files"
  );

// PDF file validation
export const pdfSchema = z
  .instanceof(FileList)
  .optional()
  .refine(
    (files) =>
      !files || files.length === 0 || files[0].size <= 10 * 1024 * 1024,
    "PDF size must be less than 10MB"
  )
  .refine(
    (files) =>
      !files || files.length === 0 || files[0].type === "application/pdf",
    "Only PDF files are supported"
  );

// Required file validation
export const requiredFileSchema = z
  .instanceof(FileList)
  .refine((files) => files && files.length > 0, "File is required");
