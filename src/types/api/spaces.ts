import type { PaginatedResponse } from "./common";
import type { OperatingHours } from "./branches";

export enum SpaceType {
  PRIVATE_OFFICE = "PRIVATE_OFFICE",
  SHARED_DESK = "SHARED_DESK",
  HOT_DESK = "HOT_DESK",
  DEDICATED_DESK = "DEDICATED_DESK",
  MEETING_ROOM = "MEETING_ROOM",
  CONFERENCE_HALL = "CONFERENCE_HALL",
  EVENT_SPACE = "EVENT_SPACE",
  COWORKING_AREA = "COWORKING_AREA",
}

export interface Amenity {
  id: number;
  name_ar: string;
  name_en: string;
  icon?: string;
}

export interface SpaceImage {
  id: number;
  image_url: string;
  caption_ar?: string;
  caption_en?: string;
  display_order: number;
  is_main: boolean;
}

export interface CoworkingSpace {
  id: number;
  branch_id: number;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  space_type: SpaceType;
  capacity: number;
  hourly_rate?: number;
  daily_rate?: number;
  weekly_rate?: number;
  monthly_rate?: number;
  status: 1 | 0;
  space_amenities: Amenity[];
  space_images: SpaceImage[];
  operating_hours?: OperatingHours;
  average_rating?: number;
  total_reviews?: number;
  created_at?: string;
  updated_at?: string;
  branch?: {
    id: number;
    name_ar: string;
    name_en: string;
    city_en?: string;
    city_ar?: string;
    address?: string;
    address_en?: string;
    address_ar?: string;
    operating_hours?: OperatingHours;
  };
}

export interface SpaceListItem {
  id: number;
  name_ar: string;
  name_en: string;
  branch: {
    name_ar: string;
    name_en: string;
  };
  space_type: SpaceType;
  capacity: number;
  hourly_rate: number;
  main_image?: string;
  average_rating?: number;
  status: 1 | 0;
}

export interface SpaceFilters {
  branch_id?: number;
  space_type?: SpaceType;
  min_capacity?: number;
  max_capacity?: number;
  min_price?: number;
  max_price?: number;
  amenity_ids?: number[];
  search?: string;
  status?: 1 | 0;
}

export type SpacesListResponse = PaginatedResponse<SpaceListItem>;
export type SpaceDetailsResponse = CoworkingSpace;
