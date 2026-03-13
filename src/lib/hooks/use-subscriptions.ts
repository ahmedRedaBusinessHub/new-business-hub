import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchPlans,
    createSubscription,
    fetchUserSubscriptions,
    cancelSubscription
} from "@/lib/api/subscriptions";
import { toast } from "sonner";

export const subscriptionKeys = {
    all: ["subscriptions"] as const,
    plans: () => [...subscriptionKeys.all, "plans"] as const,
    user: () => [...subscriptionKeys.all, "me"] as const,
};

/**
 * Hook to fetch available subscription plans.
 */
export function usePlans() {
    return useQuery({
        queryKey: subscriptionKeys.plans(),
        queryFn: fetchPlans,
        staleTime: 30 * 60 * 1000, // 30 minutes
    });
}

/**
 * Hook to fetch current user subscriptions.
 */
export function useUserSubscriptions() {
    return useQuery({
        queryKey: subscriptionKeys.user(),
        queryFn: fetchUserSubscriptions,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to create a subscription.
 */
export function useCreateSubscription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSubscription,
        onSuccess: (response) => {
            toast.success(response.message || "Subscribed successfully!");
            queryClient.invalidateQueries({ queryKey: subscriptionKeys.user() });
            // Also invalidate user and bookings to reflect changes
            queryClient.invalidateQueries({ queryKey: ["user"] });
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to create subscription");
        },
    });
}

/**
 * Hook to cancel a subscription.
 */
export function useCancelSubscription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => cancelSubscription(id),
        onSuccess: (response) => {
            toast.success(response.message || "Subscription cancelled successfully");
            queryClient.invalidateQueries({ queryKey: subscriptionKeys.user() });
            queryClient.invalidateQueries({ queryKey: ["user"] });
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to cancel subscription");
        },
    });
}
