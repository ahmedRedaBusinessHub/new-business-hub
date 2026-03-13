import { apiGet } from "@/lib/api";
import type { AnalyticsOverview, BookingTrend, UtilizationData, RevenueBreakdown, AnalyticsFilter } from "@/types/api/analytics";

/**
 * Fetches analytics overview metrics.
 */
export async function fetchAnalyticsOverview(filters?: AnalyticsFilter): Promise<AnalyticsOverview> {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);
    if (filters?.branch_id) params.append("branch_id", filters.branch_id);

    const response = await apiGet(`/api/admin/analytics/overview?${params.toString()}`, { requireAuth: true });

    if (!response.ok) {
        throw new Error("Failed to fetch analytics overview");
    }

    const result = await response.json();
    return result.data;
}

/**
 * Fetches booking trends data for charts.
 */
export async function fetchBookingTrends(filters?: AnalyticsFilter): Promise<BookingTrend[]> {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);
    if (filters?.branch_id) params.append("branch_id", filters.branch_id);

    const response = await apiGet(`/api/admin/analytics/trends?${params.toString()}`, { requireAuth: true });

    if (!response.ok) {
        throw new Error("Failed to fetch booking trends");
    }

    const result = await response.json();
    return result.data || [];
}

/**
 * Fetches utilization data for spaces/branches.
 */
export async function fetchUtilization(filters?: AnalyticsFilter): Promise<UtilizationData[]> {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);
    if (filters?.branch_id) params.append("branch_id", filters.branch_id);

    const response = await apiGet(`/api/admin/analytics/utilization?${params.toString()}`, { requireAuth: true });

    if (!response.ok) {
        throw new Error("Failed to fetch utilization data");
    }

    const result = await response.json();
    return result.data || [];
}

/**
 * Fetches revenue breakdown by space category/type.
 */
export async function fetchRevenueBreakdown(filters?: AnalyticsFilter): Promise<RevenueBreakdown[]> {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);
    if (filters?.branch_id) params.append("branch_id", filters.branch_id);

    const response = await apiGet(`/api/admin/analytics/revenue-breakdown?${params.toString()}`, { requireAuth: true });

    if (!response.ok) {
        throw new Error("Failed to fetch revenue breakdown");
    }

    const result = await response.json();
    return result.data || [];
}
