export interface AdminSpaceBooking {
  id: number;
  confirmation_code: string;
  start_datetime: string;
  end_datetime: string;
  attendees: number;
  pricing_tier: string;
  final_amount: number;
  status: 0 | 1 | 2 | 3;
  created_at: string;
  coworking_space: {
    id: number;
    name_en: string;
    name_ar: string;
    branch?: {
      id: number;
      name_en: string;
      name_ar: string;
    };
  };
  user?: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

export interface AdminSpaceBookingDetail extends AdminSpaceBooking {
  user_id: number;
  coworking_space_id: number;
  base_amount: number;
  discount_amount: number;
  updated_at?: string;
  transaction?: {
    id: number;
    transaction_type: string;
    amount: number;
    status: string;
    payment_method?: string | null;
    created_at: string;
  };
  additional_services?: Array<{
    id: number;
    service_name_ar: string;
    service_name_en: string;
    total_price: number;
    quantity: number;
    service_type: string;
  }>;
  cancellation_reason?: string | null;
  refund_issued?: boolean | null;
}

export interface AdminBookingSummaryStats {
  pending_count: number;
  today_count: number;
  confirmed_this_month: number;
  revenue_this_month: number;
}

export interface AdminSpaceBookingSummary {}


export interface CancelBookingPayload {
  reason: string;
  process_full_refund: boolean;
}

export interface AdminSpaceBookingFilters {
  page?: number;
  limit?: number;
  status?: number;
  branch_id?: number;
  coworking_space_id?: number;
  sort_field?: 'start_datetime' | 'created_at';
  sort_order?: 'asc' | 'desc';
  search?: string;
  start_date?: string;
  end_date?: string;
}
