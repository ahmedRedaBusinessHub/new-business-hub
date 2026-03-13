import { useQuery } from "@tanstack/react-query";
import {
  fetchBookingStatistics,
  fetchUtilizationReport,
  fetchBranchPerformance,
  fetchTrends,
  fetchUserBehavior,
  fetchReviews,
} from "@/lib/api/reports";
import type { ReportFilter } from "@/types/api/reports";

export const REPORT_KEYS = {
  all: ["reports"] as const,
  statistics: (filters?: ReportFilter) => [...REPORT_KEYS.all, "statistics", filters] as const,
  utilization: (filters?: ReportFilter) => [...REPORT_KEYS.all, "utilization", filters] as const,
  branchPerformance: (filters?: ReportFilter) => [...REPORT_KEYS.all, "branch-performance", filters] as const,
  trends: (filters?: ReportFilter) => [...REPORT_KEYS.all, "trends", filters] as const,
  userBehavior: (filters?: ReportFilter) => [...REPORT_KEYS.all, "user-behavior", filters] as const,
  reviews: (filters?: ReportFilter & {
    user_id?: number;
    min_rating?: number;
    max_rating?: number;
    page?: number;
    limit?: number;
  }) => [...REPORT_KEYS.all, "reviews", filters] as const,
};

export function useBookingStatistics(filter?: ReportFilter) {
  return useQuery({
    queryKey: REPORT_KEYS.statistics(filter),
    queryFn: () => fetchBookingStatistics(filter),
    staleTime: 10 * 60 * 1000,
  });
}

export function useUtilizationReport(filter?: ReportFilter) {
  return useQuery({
    queryKey: REPORT_KEYS.utilization(filter),
    queryFn: () => fetchUtilizationReport(filter),
    staleTime: 10 * 60 * 1000,
  });
}

export function useBranchPerformance(filter?: ReportFilter) {
  return useQuery({
    queryKey: REPORT_KEYS.branchPerformance(filter),
    queryFn: () => fetchBranchPerformance(filter),
    staleTime: 10 * 60 * 1000,
  });
}

export function useTrends(filter?: ReportFilter) {
  return useQuery({
    queryKey: REPORT_KEYS.trends(filter),
    queryFn: () => fetchTrends(filter),
    staleTime: 10 * 60 * 1000,
  });
}

export function useUserBehavior(filter?: ReportFilter) {
  return useQuery({
    queryKey: REPORT_KEYS.userBehavior(filter),
    queryFn: () => fetchUserBehavior(filter),
    staleTime: 10 * 60 * 1000,
  });
}

export function useReviews(filter?: ReportFilter & {
  user_id?: number;
  min_rating?: number;
  max_rating?: number;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: REPORT_KEYS.reviews(filter),
    queryFn: () => fetchReviews(filter),
    staleTime: 10 * 60 * 1000,
  });
}
