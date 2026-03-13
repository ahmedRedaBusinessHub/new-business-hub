import type {
  ReportFilter,
  BookingStatistics,
  UtilizationReport,
  BranchComparisonReport,
  TrendsReport,
  UserBehaviorAnalytics,
  BookingReviewReport,
} from "@/types/api/reports";

export async function fetchBookingStatistics(filter?: ReportFilter): Promise<BookingStatistics> {
  const params = new URLSearchParams();
  if (filter?.start_date) params.append("start_date", filter.start_date);
  if (filter?.end_date) params.append("end_date", filter.end_date);
  if (filter?.branch_id) params.append("branch_id", String(filter.branch_id));
  if (filter?.coworking_space_id) params.append("coworking_space_id", String(filter.coworking_space_id));

  const response = await fetch(`/api/reports/statistics?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch booking statistics");
  }

  const result = await response.json();
  return result.data;
}

export async function fetchUtilizationReport(filter?: ReportFilter): Promise<UtilizationReport> {
  const params = new URLSearchParams();
  if (filter?.start_date) params.append("start_date", filter.start_date);
  if (filter?.end_date) params.append("end_date", filter.end_date);
  if (filter?.branch_id) params.append("branch_id", String(filter.branch_id));

  const response = await fetch(`/api/reports/utilization?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch utilization report");
  }

  const result = await response.json();
  return result.data;
}

export async function fetchBranchPerformance(filter?: ReportFilter): Promise<BranchComparisonReport> {
  const params = new URLSearchParams();
  if (filter?.start_date) params.append("start_date", filter.start_date);
  if (filter?.end_date) params.append("end_date", filter.end_date);

  const response = await fetch(`/api/reports/branch-performance?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch branch performance");
  }

  const result = await response.json();
  return result.data;
}

export async function fetchTrends(filter?: ReportFilter): Promise<TrendsReport> {
  const params = new URLSearchParams();
  if (filter?.start_date) params.append("start_date", filter.start_date);
  if (filter?.end_date) params.append("end_date", filter.end_date);
  if (filter?.branch_id) params.append("branch_id", String(filter.branch_id));
  if (filter?.coworking_space_id) params.append("coworking_space_id", String(filter.coworking_space_id));
  if (filter?.granularity) params.append("granularity", filter.granularity);

  const response = await fetch(`/api/reports/trends?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch trends");
  }

  const result = await response.json();
  return result.data;
}

export async function fetchUserBehavior(filter?: ReportFilter): Promise<UserBehaviorAnalytics> {
  const params = new URLSearchParams();
  if (filter?.start_date) params.append("start_date", filter.start_date);
  if (filter?.end_date) params.append("end_date", filter.end_date);
  if (filter?.branch_id) params.append("branch_id", String(filter.branch_id));
  if (filter?.coworking_space_id) params.append("coworking_space_id", String(filter.coworking_space_id));

  const response = await fetch(`/api/reports/user-behavior?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user behavior analytics");
  }

  const result = await response.json();
  return result.data;
}

export async function fetchReviews(filter?: ReportFilter & {
  user_id?: number;
  min_rating?: number;
  max_rating?: number;
  page?: number;
  limit?: number;
}): Promise<BookingReviewReport> {
  const params = new URLSearchParams();
  if (filter?.start_date) params.append("start_date", filter.start_date);
  if (filter?.end_date) params.append("end_date", filter.end_date);
  if (filter?.branch_id) params.append("branch_id", String(filter.branch_id));
  if (filter?.coworking_space_id) params.append("coworking_space_id", String(filter.coworking_space_id));
  if (filter?.user_id) params.append("user_id", String(filter.user_id));
  if (filter?.min_rating) params.append("min_rating", String(filter.min_rating));
  if (filter?.max_rating) params.append("max_rating", String(filter.max_rating));
  if (filter?.page) params.append("page", String(filter.page));
  if (filter?.limit) params.append("limit", String(filter.limit));

  const response = await fetch(`/api/reports/reviews?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch reviews report");
  }

  const result = await response.json();
  return result.data;
}
