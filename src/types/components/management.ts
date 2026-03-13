/**
 * Common type definitions for management components
 */

// Generic data row type for tables and views
export type DataRow = Record<string, unknown>;

// Status option from static lists
export interface StatusOption {
  id: number;
  name_en: string;
  name_ar: string;
  [key: string]: unknown;
}

// Document upload type
export interface DocumentUpload {
  name: string;
  file_id: number;
  file_url?: string;
}

// Generic file upload response
export interface FileUploadResponse {
  file_id: number;
  file_url: string;
  message?: string;
}

// Pagination parameters
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
