import type {
    SubscriptionPlansResponse,
    CreateSubscriptionRequest,
    CreateSubscriptionResponse,
    UserSubscriptionsResponse,
    CancelSubscriptionResponse
} from "@/types/api/subscriptions";
import { SubscriptionPlan } from "@/types/api/subscriptions";

// Maps frontend plan enum → backend plan_type string
export const PLAN_TYPE_MAP: Record<SubscriptionPlan, string> = {
    [SubscriptionPlan.OFFICE_MONTHLY]: 'office',
    [SubscriptionPlan.SHARED_DESK_MONTHLY]: 'shared_desk',
    [SubscriptionPlan.SHARED_DESK_DAILY]: 'shared_desk',
};

// Maps frontend plan enum → subscription duration in days
const PLAN_DURATION_DAYS: Record<SubscriptionPlan, number> = {
    [SubscriptionPlan.OFFICE_MONTHLY]: 30,
    [SubscriptionPlan.SHARED_DESK_MONTHLY]: 30,
    [SubscriptionPlan.SHARED_DESK_DAILY]: 1,
};

function toISODate(date: Date): string {
    return date.toISOString().split('T')[0];
}

/**
 * Fetches all available subscription plans.
 */
export async function fetchPlans(): Promise<SubscriptionPlansResponse> {
    const response = await fetch('/api/subscriptions/plans', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch subscription plans");
    }

    return response.json();
}

/**
 * Creates a new subscription for the current user.
 * Transforms the frontend plan shape into the backend's required fields:
 *   plan_type, start_date, end_date, monthly_amount
 */
export async function createSubscription(data: CreateSubscriptionRequest): Promise<CreateSubscriptionResponse> {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + PLAN_DURATION_DAYS[data.plan]);

    const backendBody = {
        plan_type: PLAN_TYPE_MAP[data.plan],
        start_date: toISODate(startDate),
        end_date: toISODate(endDate),
        monthly_amount: data.monthlyPrice,
        auto_renew: false,
    };

    const response = await fetch('/api/subscriptions', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(backendBody),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create subscription");
    }

    return response.json();
}

/**
 * Fetches the current user's active subscriptions.
 */
export async function fetchUserSubscriptions(): Promise<UserSubscriptionsResponse> {
    const response = await fetch('/api/subscriptions/me', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user subscriptions");
    }

    return response.json();
}

/**
 * Cancels an existing subscription.
 */
export async function cancelSubscription(id: number | string): Promise<CancelSubscriptionResponse> {
    const response = await fetch(`/api/subscriptions/${id}/cancel`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to cancel subscription");
    }

    return response.json();
}
