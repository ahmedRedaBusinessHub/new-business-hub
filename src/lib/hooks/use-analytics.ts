import { useQuery } from "@tanstack/react-query";
import { fetchAnalyticsOverview, fetchBookingTrends, fetchUtilization, fetchRevenueBreakdown } from "@/lib/api/analytics";
import type { AnalyticsFilter } from "@/types/api/analytics";

export const ANALYTICS_KEYS = {
    all: ["analytics"] as const,
    overview: (filters?: AnalyticsFilter) => [...ANALYTICS_KEYS.all, "overview", filters] as const,
    trends: (filters?: AnalyticsFilter) => [...ANALYTICS_KEYS.all, "trends", filters] as const,
    utilization: (filters?: AnalyticsFilter) => [...ANALYTICS_KEYS.all, "utilization", filters] as const,
    revenueBreakdown: (filters?: AnalyticsFilter) => [...ANALYTICS_KEYS.all, "revenue-breakdown", filters] as const,
};

export function useAnalyticsOverview(filters?: AnalyticsFilter) {
    return useQuery({
        queryKey: ANALYTICS_KEYS.overview(filters),
        queryFn: () => fetchAnalyticsOverview(filters),
    });
}

export function useBookingTrends(filters?: AnalyticsFilter) {
    return useQuery({
        queryKey: ANALYTICS_KEYS.trends(filters),
        queryFn: () => fetchBookingTrends(filters),
    });
}

export function useUtilization(filters?: AnalyticsFilter) {
    return useQuery({
        queryKey: ANALYTICS_KEYS.utilization(filters),
        queryFn: () => fetchUtilization(filters),
    });
}

export function useRevenueBreakdown(filters?: AnalyticsFilter) {
    return useQuery({
        queryKey: ANALYTICS_KEYS.revenueBreakdown(filters),
        queryFn: () => fetchRevenueBreakdown(filters),
    });
}
