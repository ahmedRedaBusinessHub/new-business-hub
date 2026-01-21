import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (url?: string | null) => {
  if (!url) return "https://images.unsplash.com/photo-1556761175-b413da4baf72";
  if (url.startsWith("http") || url.startsWith("/api/public/file")) return url;
  return `/api/public/file?file_url=${encodeURIComponent(url)}`;
};

// Helper to estimate read time
export const getReadTime = (content?: string | null) => {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
};
