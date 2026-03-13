import type {
    AdminSubscriptionFilters,
    AdminSubscriptionsListResponse,
    AdminSubscriptionDetailResponse,
    AdminCancelSubscriptionResponse,
} from "@/types/api/subscriptions";

// Maps backend numeric status → frontend string status
const NUMERIC_STATUS_MAP: Record<number, 'active' | 'cancelled' | 'expired'> = {
    1: 'active',
    0: 'cancelled',
    2: 'expired',
};

// Maps backend plan_type → frontend SubscriptionPlan enum value
const PLAN_TYPE_TO_ENUM: Record<string, string> = {
    office: 'office_monthly',
    shared_desk: 'shared_desk_monthly',
};

function normalizeSubscriptionRow(row: any) {
    return {
        ...row,
        // Backend uses plan_type, frontend uses plan
        plan: PLAN_TYPE_TO_ENUM[row.plan_type] ?? row.plan_type,
        // Backend uses numeric status, frontend uses string
        status: NUMERIC_STATUS_MAP[row.status] ?? 'expired',
        // Backend uses snake_case dates, frontend uses camelCase
        startDate: row.start_date ?? row.startDate,
        renewalDate: row.end_date ?? row.renewalDate,
        endDate: row.deleted_at ?? row.endDate,
        monthlyPrice: Number(row.monthly_amount ?? row.monthlyPrice ?? 0),
        autoRenew: row.auto_renew ?? row.autoRenew ?? false,
        userId: row.user_id ?? row.userId,
    };
}

/**
 * Fetches all subscriptions for admin management, with optional filters.
 * Backend response: { data: { data: [...], total, page, limit, totalPages }, message }
 */
export async function fetchAdminSubscriptions(
    filters: AdminSubscriptionFilters = {}
): Promise<AdminSubscriptionsListResponse> {
    // Map frontend string status → backend numeric status
    const STATUS_MAP: Record<string, number> = { active: 1, cancelled: 0, expired: 2 };

    const params = new URLSearchParams();
    if (filters.status !== undefined) params.set("status", String(STATUS_MAP[filters.status] ?? filters.status));
    if (filters.plan) params.set("plan_type", filters.plan);
    if (filters.search) params.set("search", filters.search);
    if (filters.page) params.set("page", String(filters.page));
    if (filters.limit) params.set("limit", String(filters.limit));

    const query = params.toString();
    const response = await fetch(`/api/admin/subscriptions${query ? `?${query}` : ''}`, {
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to fetch subscriptions");
    }

    // Response shape: { data: { data: [...], total, page, limit, totalPages }, message }
    const json = await response.json();
    const wrapper = json?.data;
    console.log("🚀 ~ fetchAdminSubscriptions ~ wrapper:", wrapper)
    const rawRows: any[] = wrapper?.data?.data || [];
    const total = wrapper?.total || 0;
    const limit = wrapper?.limit || filters.limit || 20;

    // Normalize backend field names and numeric status to frontend shape
    const rows = rawRows.map(normalizeSubscriptionRow);

    return {
        data: rows,
        total,
        page: wrapper?.page || filters.page || 1,
        limit,
        totalPages: wrapper?.totalPages || Math.ceil(total / limit),
        message: json?.message,
    };
}

/**
 * Fetches a single subscription by ID (admin view).
 */
export async function fetchAdminSubscription(
    id: number | string
): Promise<AdminSubscriptionDetailResponse> {
    const response = await fetch(`/api/admin/subscriptions/${id}`, {
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to fetch subscription");
    }

    return response.json();
}

/**
 * Cancels a subscription on behalf of a user (admin action).
 */
export async function adminCancelSubscription(
    id: number | string
): Promise<AdminCancelSubscriptionResponse> {
    const response = await fetch(`/api/admin/subscriptions/${id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to cancel subscription");
    }

    return response.json();
}
