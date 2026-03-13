export interface ReportFilter {
  start_date?: string;
  end_date?: string;
  branch_id?: number;
  coworking_space_id?: number;
  granularity?: 'daily' | 'weekly' | 'monthly';
}

export interface BookingStatistics {
  total_bookings: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
  completed_bookings: number;
  total_revenue_sar: number;
  avg_revenue_per_booking: number;
  avg_duration_hours: number;
  cancellation_rate: number;
  unique_users: number;
  avg_bookings_per_user: number;
  start_date: Date;
  end_date: Date;
  by_status: {
    pending: { count: number; revenue: number };
    confirmed: { count: number; revenue: number };
    completed: { count: number; revenue: number };
    cancelled: { count: number; revenue: number };
  };
  by_pricing_tier: {
    hourly: { count: number; revenue: number; avg_duration: number };
    daily: { count: number; revenue: number; avg_duration: number };
    weekly: { count: number; revenue: number; avg_duration: number };
    monthly: { count: number; revenue: number; avg_duration: number };
  };
  by_space_type: {
    [key: string]: { count: number; revenue: number; avg_duration: number };
  };
}

export interface SpaceUtilization {
  space_id: number;
  space_name: string;
  branch_id: number;
  branch_name: string;
  space_type: string;
  capacity: number;
  total_quantity: number;
  total_bookings: number;
  total_hours_booked: number;
  total_available_hours: number;
  utilization_rate: number | null | undefined;
  revenue_sar: number;
  avg_revenue_per_booking: number;
  avg_duration_hours: number;
  avg_attendees: number;
  is_active: boolean;
}

export interface UtilizationReport {
  total_spaces: number;
  total_bookings: number;
  total_revenue_sar: number;
  avg_utilization_rate: number;
  max_utilization_rate: number;
  min_utilization_rate: number;
  start_date: Date;
  end_date: Date;
  spaces: SpaceUtilization[];
  top_performers: SpaceUtilization[];
  underutilized: SpaceUtilization[];
  summary_by_type: {
    [key: string]: {
      count: number;
      avg_utilization: number;
      total_bookings: number;
      revenue: number;
    };
  };
}

export interface BranchPerformance {
  branch_id: number;
  branch_name: string;
  location: string;
  total_spaces: number;
  total_bookings: number;
  total_revenue_sar: number;
  avg_revenue_per_booking: number;
  avg_utilization_rate: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
  cancellation_rate: number;
  avg_duration_hours: number;
  unique_users: number;
  avg_bookings_per_user: number;
  revenue_by_tier: {
    hourly: { revenue: number; bookings: number };
    daily: { revenue: number; bookings: number };
    weekly: { revenue: number; bookings: number };
    monthly: { revenue: number; bookings: number };
  };
  top_space: {
    space_id: number;
    space_name: string;
    bookings: number;
    revenue: number;
    utilization_rate: number;
  } | null;
  space_type_distribution: {
    [key: string]: { count: number; bookings: number; revenue: number };
  };
}

export interface BranchComparisonReport {
  total_branches: number;
  total_bookings: number;
  total_revenue_sar: number;
  avg_utilization_rate: number;
  start_date: Date;
  end_date: Date;
  branches: BranchPerformance[];
  top_by_revenue: {
    branch_id: number;
    branch_name: string;
    revenue: number;
    rank: number;
  } | undefined;
  top_by_utilization: {
    branch_id: number;
    branch_name: string;
    utilization_rate: number;
    rank: number;
  } | undefined;
  top_by_bookings: {
    branch_id: number;
    branch_name: string;
    total_bookings: number;
    rank: number;
  } | undefined;
  ranking_by_revenue: {
    [key: string]: {
      branch_id: number;
      branch_name: string;
      revenue: number;
      rank: number;
    };
  };
}

export interface TrendDataPoint {
  date: Date;
  bookings: number;
  revenue: number;
  unique_users: number;
  cancellations: number;
  cancellation_rate: number;
  avg_duration: number;
  avg_revenue_per_booking: number;
}

export interface TrendsReport {
  granularity: string;
  data_points: number;
  total_bookings: number;
  total_revenue: number;
  avg_bookings_per_day: number;
  avg_revenue_per_day: number;
  booking_growth_rate: number | null | undefined;
  revenue_growth_rate: number | null | undefined;
  avg_cancellation_rate: number;
  peak_period: TrendDataPoint;
  lowest_period: TrendDataPoint;
  start_date: Date;
  end_date: Date;
  data: TrendDataPoint[];
  summary_by_status: {
    confirmed: { total: number; trend: string; change: number };
    completed: { total: number; trend: string; change: number };
    cancelled: { total: number; trend: string; change: number };
  };
  summary_by_space_type: {
    [key: string]: {
      bookings: number;
      revenue: number;
      trend: string;
      change: number;
    };
  };
}

export interface TopUser {
  user_id: number;
  name: string;
  email: string;
  bookings: number;
  revenue: number;
}

export interface UserBehaviorAnalytics {
  total_users: number;
  new_users: number;
  new_user_percentage: number;
  returning_users: number;
  avg_bookings_per_user: number;
  avg_revenue_per_user: number;
  tenant_users: number;
  tenant_user_percentage: number;
  avg_bookings_per_tenant: number;
  tenant_booking_percentage: number;
  tenant_revenue: number;
  tenant_revenue_percentage: number;
  top_users: TopUser[];
  top_users_by_revenue?: TopUser[];
  most_booked_space_type: string;
  most_used_pricing_tier: string;
}

export interface BookingReviewListItem {
  id: number;
  booking_id: number;
  space_id: number;
  space_name_en: string;
  space_name_ar: string;
  branch_name_en: string;
  branch_name_ar: string;
  user_name: string;
  user_email: string;
  rating: number;
  comment: string | null;
  created_at: Date;
}

export interface SpaceReviewSummary {
  space_id: number;
  space_name_en: string;
  space_name_ar: string;
  total_reviews: number;
  avg_rating: number;
  rating_distribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
}

export interface ReviewPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface BookingReviewReport {
  total_reviews: number;
  avg_rating_overall: number;
  spaces: SpaceReviewSummary[];
  reviews: BookingReviewListItem[];
  pagination: ReviewPagination;
  start_date: Date;
  end_date: Date;
}
