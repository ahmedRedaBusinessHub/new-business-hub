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

export function formatCurrency(amount: number, locale: 'ar-SA' | 'en-US' = 'ar-SA'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date, locale: 'ar-SA' | 'en-US' = 'ar-SA', options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(dateObj);
}

export function formatDateTime(date: string | Date, locale: 'ar-SA' | 'en-US' = 'ar-SA'): string {
  return formatDate(date, locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(date: string | Date, locale: 'ar-SA' | 'en-US' = 'ar-SA'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

export type CancellationRefundTier = 'full' | 'partial' | 'none';

/**
 * Returns the refund tier based on policy:
 * - full   : cancelled 24+ hours before start
 * - partial: cancelled 12–24 hours before start (50% refund)
 * - none   : cancelled <12 hours before start
 */
export function getCancellationRefundTier(startDate: string | Date): CancellationRefundTier {
  const now = new Date();
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const hoursUntilStart = (start.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilStart >= 24) return 'full';
  if (hoursUntilStart >= 12) return 'partial';
  return 'none';
}
