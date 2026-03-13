import type { PaginatedResponse } from './common';
import type { CoworkingSpace } from './spaces';

export enum BookingStatus {
  PENDING = 0,
  CONFIRMED = 1,
  COMPLETED = 2,
  CANCELLED = 3,
  // String versions for backward compatibility or if some APIs still use them
  PENDING_STR = 'pending',
  CONFIRMED_STR = 'confirmed',
  COMPLETED_STR = 'completed',
  CANCELLED_STR = 'cancelled',
}

export enum PricingTier {
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export interface BookedService {
  service_id: number;
  service_name_ar: string;
  service_name_en: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Booking {
  id: number;
  user_id: number;
  confirmation_code: string;

  // Support both naming conventions
  space_id: number;
  coworking_space_id?: number;

  space?: CoworkingSpace;
  coworking_space?: CoworkingSpace;

  start_date: string;
  end_date: string;
  start_datetime?: string;
  end_datetime?: string;

  pricing_tier: PricingTier | string;
  attendees: number;

  // Amounts
  total_cost?: number;
  base_amount?: number;
  discount_amount?: number;
  tax_amount?: number;
  final_amount?: number;
  discount_applied?: number;

  status: BookingStatus | number | string;

  // Metadata
  created_at: string;
  updated_at: string | null;
  cancelled_at?: string;
  cancellation_reason?: string;

  // Nested Objects
  transaction?: any;
  additional_services?: BookedService[];

  // Flags
  has_reviewed?: boolean;

  // Payment info (if flat in object)
  payment_status?: 'pending' | 'paid' | 'refunded' | 'failed';
  payment_method?: string;
}

export interface CreateBookingData {
  space_id: number;
  start_date: string;
  end_date: string;
  pricing_tier: PricingTier;
  attendees: number;
  additional_service_ids?: number[];
}

export interface ModifyBookingData {
  booking_id: number;
  start_date?: string;
  end_date?: string;
  attendees?: number;
}

export interface BookingFilters {
  status?: BookingStatus;
  space_id?: number;
  start_date?: string;
  end_date?: string;
}

export type BookingsListResponse = PaginatedResponse<Booking>;
export type BookingDetailsResponse = Booking;

export enum RecurrencePattern {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export interface RecurringBooking {
  id: number;
  user_id: number;
  space_id: number;
  space?: CoworkingSpace;
  pattern: RecurrencePattern;
  start_date: string;
  end_date?: string;
  occurrences?: number;
  pricing_tier: PricingTier;
  attendees: number;
  total_cost: number;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  instances: RecurringBookingInstance[];
}

export interface RecurringBookingInstance {
  id: number;
  recurring_booking_id: number;
  booking_id: number;
  booking?: Booking;
  instance_date: string;
  status: BookingStatus;
}

export interface CreateRecurringBookingData {
  space_id: number;
  start_date: string;
  pattern: RecurrencePattern;
  end_date?: string;
  occurrences?: number;
  pricing_tier: PricingTier;
  attendees: number;
  additional_service_ids?: number[];
}
