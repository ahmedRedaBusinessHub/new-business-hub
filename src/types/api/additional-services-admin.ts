export type ServiceBookingStatus = 0 | 1 | 2 | 3;
export const SERVICE_BOOKING_STATUS_LABELS: Record<
  ServiceBookingStatus,
  string
> = {
  0: "Pending",
  1: "Confirmed",
  2: "Completed",
  3: "Cancelled",
};

export type ServiceType = "PRINTING" | "STORAGE" | "MAILBOX" | "STUDIO";

export interface AdminServiceBooking {
  id: number;
  user_id: number;
  user_name: string;
  user_email?: string;
  additional_service_id: number;
  service_name_en: string;
  service_name_ar: string;
  service_type: ServiceType;
  branch_id: number | null;
  branch_name_en: string | null;
  branch_name_ar: string | null;
  booking_date: string;
  quantity: number;
  amount: string;
  price_at_booking: string | null;
  status: ServiceBookingStatus;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface AdminServiceBookingFilters {
  page?: number;
  limit?: number;
  service_type?: ServiceType;
  branch_id?: number;
  status?: ServiceBookingStatus;
  start_date?: string;
  end_date?: string;
  search?: string;
}

export interface AdminServiceBookingListResponse {
  data: AdminServiceBooking[];
  total: number;
  page: number;
  limit: number;
  message: string;
}

export interface AdminServiceCatalogItem {
  id: number;
  name_en: string;
  name_ar: string;
  service_type: ServiceType;
  base_price: number;
  pricing_unit: string;
  description_en: string | null;
  description_ar: string | null;
  status: 0 | 1;
  branches: Array<{
    branch_id: number;
    branch_name_en: string;
    branch_name_ar: string;
  }>;
  pending_bookings_count: number;
  created_at: string;
  updated_at: string | null;
}

export interface AdminServicesSummary {
  total_bookings_today: number;
  pending_bookings: number;
  revenue_this_month: string;
  top_service: {
    id: number;
    name_en: string;
    name_ar: string;
    booking_count: number;
  } | null;
}

export interface UpdateBookingStatusPayload {
  status: "1" | "2" | "3";
  cancellation_reason?: string;
}

export interface AdminServiceCatalogFilters {
  page?: number;
  limit?: number;
  status?: 0 | 1;
  service_type?: ServiceType;
}

export interface AdminServiceCatalogListResponse {
  data: AdminServiceCatalogItem[];
  total: number;
  page: number;
  limit: number;
  message: string;
}

export interface UpdateServicePayload {
  name_en?: string;
  name_ar?: string;
  service_type?: ServiceType;
  base_price?: number;
  pricing_unit?: string;
  description_en?: string;
  description_ar?: string;
}

export interface ToggleServiceStatusPayload {
  status: 0 | 1;
  force?: boolean;
}

export interface CreateServicePayload {
  name_en: string;
  name_ar: string;
  service_type: ServiceType;
  base_price: number;
  pricing_unit: string;
  description_en?: string;
  description_ar?: string;
}

export interface DeactivateServiceResponse {
  requires_confirmation?: boolean;
  pending_count?: number;
  confirmed_count?: number;
  message: string;
}
