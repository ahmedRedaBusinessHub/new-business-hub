export interface AnalyticsOverview {
    total_revenue: number;
    total_bookings: number;
    active_users: number;
    utilization_rate: number;
    revenue_growth: number;
    bookings_growth: number;
    users_growth: number;
    utilization_growth: number;
}

export interface BookingTrend {
    date: string;
    bookings: number;
    revenue: number;
}

export interface UtilizationData {
    name: string;
    utilization: number;
    capacity: number;
    bookings: number;
}

export interface RevenueBreakdown {
    category: string;
    value: number;
}

export interface AnalyticsFilter {
    start_date?: string;
    end_date?: string;
    branch_id?: string;
}
