import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    fetchSpaceReviews,
    submitReview,
    getBookingReview,
    deleteBookingReview,
    listReviews,
    getReviewById,
} from "@/lib/api/reviews";
import { queryKeys } from "@/lib/query-keys";
import type { SpaceReviews, Review } from "@/types/api/reviews";
import { toast } from "sonner";

/**
 * Hook to fetch reviews for a specific coworking space.
 */
export function useSpaceReviews(spaceId: number | string) {
    return useQuery<SpaceReviews, Error>({
        queryKey: queryKeys.reviews.spaceReviews(spaceId),
        queryFn: () => fetchSpaceReviews(spaceId),
        enabled: !!spaceId,
    });
}

/**
 * Hook to fetch review for a specific booking.
 */
export function useBookingReview(bookingId: number | string) {
    return useQuery<Review | null, Error>({
        queryKey: queryKeys.reviews.bookingReview(bookingId),
        queryFn: () => getBookingReview(Number(bookingId)),
        enabled: !!bookingId,
        retry: false,
    });
}

/**
 * Hook to submit a review for a booking.
 */
export function useCreateReview() {
    const queryClient = useQueryClient();

    return useMutation<Review, Error, { bookingId: number; data: { rating: number; comment?: string } }>({
        mutationFn: ({ bookingId, data }) => submitReview(bookingId, data),
        onSuccess: (_, variables) => {
            // Invalidate booking review query
            queryClient.invalidateQueries({
                queryKey: queryKeys.reviews.bookingReview(variables.bookingId),
            });
            // Invalidate user bookings to update review status
            queryClient.invalidateQueries({
                queryKey: queryKeys.bookings.all,
            });
        },
    });
}

/**
 * Hook to delete a review for a booking (Admin only).
 */
export function useDeleteReview() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, number>({
        mutationFn: deleteBookingReview,
        onSuccess: (_, bookingId) => {
            // Invalidate booking review query
            queryClient.invalidateQueries({
                queryKey: queryKeys.reviews.bookingReview(bookingId),
            });
            // Invalidate user bookings to update review status
            queryClient.invalidateQueries({
                queryKey: queryKeys.bookings.all,
            });
            // Invalidate admin reviews list
            queryClient.invalidateQueries({
                queryKey: queryKeys.reviews.all,
            });
            // Show success notification
            toast.success("Review deleted successfully");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete review");
        },
    });
}

/**
 * Hook to fetch all reviews with filters (admin).
 */
export function useAdminReviews(params?: {
    coworking_space_id?: number;
    branch_id?: number;
    min_rating?: number;
    user_id?: number;
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    date_from?: string;
    date_to?: string;
}) {
    return useQuery<{ reviews: Review[]; total: number }, Error>({
        queryKey: queryKeys.reviews.adminReviews(params),
        queryFn: () => listReviews(params || {}),
        staleTime: 30000, // 30 seconds
    });
}

export function useReviewById(reviewId: number | null | undefined) {
    return useQuery<Review, Error>({
        queryKey: queryKeys.reviews.reviewById(reviewId),
        queryFn: () => getReviewById(reviewId!),
        enabled: !!reviewId,
        staleTime: 60000, // 1 minute
    });
}
