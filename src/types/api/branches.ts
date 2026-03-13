import type { PaginatedResponse } from './common';

export interface DaySchedule {
  open: string;
  close: string;
}

export interface SpecialHourEntry {
  date: string;
  open?: string;
  close?: string;
  is_closed?: boolean;
  reason?: string;
}

export interface OperatingHours {
  timezone: string;
  schedule: {
    sunday?: DaySchedule | null;
    monday?: DaySchedule | null;
    tuesday?: DaySchedule | null;
    wednesday?: DaySchedule | null;
    thursday?: DaySchedule | null;
    friday?: DaySchedule | null;
    saturday?: DaySchedule | null;
  };
  special_hours?: SpecialHourEntry[];
}

export interface Branch {
  id: number;
  code: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  city_ar: string;
  city_en?: string;
  address_ar: string;
  address_en?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  whatsapp?: string;
  email?: string;
  operating_hours?: OperatingHours;
  has_studio: boolean;
  image_url?: string;
  status: 1 | 0;
  spaces_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BranchFilters {
  city?: string;
  has_studio?: boolean;
  status?: 1 | 0;
}

export type BranchesListResponse = PaginatedResponse<Branch>;
export type BranchDetailsResponse = Branch;
