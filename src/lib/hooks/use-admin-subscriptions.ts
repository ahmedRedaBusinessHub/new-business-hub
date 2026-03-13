import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    fetchAdminSubscriptions,
    fetchAdminSubscription,
    adminCancelSubscription,
} from "@/lib/api/admin-subscriptions";
import type { AdminSubscriptionFilters } from "@/types/api/subscriptions";

export const adminSubscriptionKeys = {
    all: ["admin_subscriptions"] as const,
    list: (filters: AdminSubscriptionFilters) =>
        [...adminSubscriptionKeys.all, "list", filters] as const,
    detail: (id: number | string) =>
        [...adminSubscriptionKeys.all, "detail", id] as const,
};

/**
 * Hook to fetch all subscriptions for admin view with optional filtering.
 */
export function useAdminSubscriptions(filters: AdminSubscriptionFilters = {}) {
    return useQuery({
        queryKey: adminSubscriptionKeys.list(filters),
        queryFn: () => fetchAdminSubscriptions(filters),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

/**
 * Hook to fetch a single subscription detail (used by details dialog).
 */
export function useAdminSubscription(id: number | string | null) {
    return useQuery({
        queryKey: adminSubscriptionKeys.detail(id!),
        queryFn: () => fetchAdminSubscription(id!),
        enabled: !!id,
        staleTime: 60 * 1000,
    });
}

/**
 * Hook to cancel a subscription on behalf of a client.
 * Invalidates the entire admin_subscriptions cache on success.
 */
export function useAdminCancelSubscription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => adminCancelSubscription(id),
        onSuccess: (response) => {
            toast.success(response.message || "Subscription cancelled successfully");
            queryClient.invalidateQueries({ queryKey: adminSubscriptionKeys.all });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to cancel subscription");
        },
    });
}
