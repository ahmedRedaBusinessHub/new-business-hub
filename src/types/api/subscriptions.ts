export enum SubscriptionPlan {
    OFFICE_MONTHLY = 'office_monthly',
    SHARED_DESK_MONTHLY = 'shared_desk_monthly',
    SHARED_DESK_DAILY = 'shared_desk_daily',
}

export interface SubscriptionBenefits {
    freeMeetingRoomHours?: number; // Monthly allocation
    discountPercentage?: number; // e.g., 50 for 50%
    priorityBooking?: boolean;
    accessLevel?: string;
}

export interface Subscription {
    id: number;
    userId: number;
    plan: SubscriptionPlan;
    startDate: string;
    renewalDate: string;
    endDate?: string; // If cancelled
    status: 'active' | 'cancelled' | 'expired';
    monthlyPrice: number; // In SAR
    benefits: SubscriptionBenefits;
    autoRenew: boolean;
}

export interface SubscriptionPlanDetails {
    plan: SubscriptionPlan;
    name_ar: string;
    name_en: string;
    description_ar: string;
    description_en: string;
    monthlyPrice: number;
    benefits: SubscriptionBenefits;
    features: string[]; // Feature list for display
}

export interface SubscriptionPlansResponse {
    data: SubscriptionPlanDetails[];
    message: string;
}

export interface CreateSubscriptionRequest {
    plan: SubscriptionPlan;
    monthlyPrice: number;
}

export interface CreateSubscriptionResponse {
    data: {
        subscription: Subscription;
        paymentUrl?: string;
    };
    message: string;
}

export interface UserSubscriptionsResponse {
    data: Subscription[];
    message: string;
}

export interface CancelSubscriptionResponse {
    data: Subscription; // Updated with endDate
    message: string;
}

// ─── Admin types ───────────────────────────────────────────────────────────────

export interface AdminSubscriptionUser {
    id: number;
    name: string;
    email: string;
    phone?: string;
}

export interface AdminSubscription extends Subscription {
    user: AdminSubscriptionUser;
}

export interface AdminSubscriptionFilters {
    status?: 'active' | 'cancelled' | 'expired';
    plan?: SubscriptionPlan;
    search?: string;
    page?: number;
    limit?: number;
}

export interface AdminSubscriptionsListResponse {
    data: AdminSubscription[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    message?: string;
}

export interface AdminSubscriptionDetailResponse {
    data: AdminSubscription;
    message?: string;
}

export interface AdminCancelSubscriptionResponse {
    data: AdminSubscription;
    message?: string;
}
