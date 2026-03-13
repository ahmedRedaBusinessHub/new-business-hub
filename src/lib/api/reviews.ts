import type { SpaceReviews, CreateReviewData, Review } from "@/types/api/reviews";

/**
 * Retries an async function with exponential backoff.
 * Only retries on network/server errors (5xx), not client errors (4xx).
 */
async function withRetry<T>(
    fn: () => Promise<T>,
    maxAttempts = 3,
    baseDelayMs = 500,
): Promise<T> {
    let lastError: Error = new Error('Unknown error');
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            // Do not retry client errors (4xx) — only network/server errors
            const isClientError = lastError.message?.match(/\b(400|401|403|404|409|422|429)\b/);
            if (isClientError || attempt === maxAttempts) {
                throw lastError;
            }
            await new Promise((resolve) => setTimeout(resolve, baseDelayMs * 2 ** (attempt - 1)));
        }
    }
    throw lastError;
}

/**
 * Fetches reviews for a specific coworking space.
 */
export async function fetchSpaceReviews(spaceId: number | string): Promise<SpaceReviews> {
    const response = await fetch(`/api/public/spaces/${spaceId}/reviews`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch reviews for space ${spaceId}`);
    }

    const responseData = await response.json();
    return responseData.data;
}

/**
 * Creates a new review for a booking.
 */
export async function createReview(data: CreateReviewData): Promise<Review> {
    const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to submit review");
    }

    const responseData = await response.json();
    return responseData.data;
}

/**
 * Submits a review for a specific booking.
 * Retries up to 3 times with exponential backoff on server/network errors.
 */
export async function submitReview(bookingId: number, data: { rating: number; comment?: string }): Promise<Review> {
    return withRetry(async () => {
        const response = await fetch(`/api/bookings/${bookingId}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Failed to submit review (${response.status})`);
        }

        const responseData = await response.json();
        return responseData.data;
    });
}

/**
 * Fetches a review for a specific booking.
 */
export async function getBookingReview(bookingId: number): Promise<Review | null> {
    const response = await fetch(`/api/bookings/${bookingId}/reviews`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error(`Failed to fetch review for booking ${bookingId}`);
    }

    const responseData = await response.json();
    return responseData.data;
}

/**
 * Deletes a review for a specific booking.
 */
export async function deleteBookingReview(bookingId: number): Promise<void> {
    const response = await fetch(`/api/bookings/${bookingId}/reviews`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to delete review");
    }
}

/**
 * Fetches all reviews with filters (admin).
 */
export async function listReviews(params: {
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
}): Promise<{ reviews: Review[]; total: number }> {
    const queryParams = new URLSearchParams();

    if (params.coworking_space_id) queryParams.append('coworking_space_id', params.coworking_space_id.toString());
    if (params.branch_id) queryParams.append('branch_id', params.branch_id.toString());
    if (params.min_rating) queryParams.append('min_rating', params.min_rating.toString());
    if (params.user_id) queryParams.append('user_id', params.user_id.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);
    if (params.date_from) queryParams.append('date_from', params.date_from);
    if (params.date_to) queryParams.append('date_to', params.date_to);

    const response = await fetch(`/api/booking-reviews?${queryParams.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch reviews");
    }

    const responseData = await response.json();
    return responseData.data;
}

/**
 * Fetches a specific review by ID (admin).
 */
export async function getReviewById(reviewId: number): Promise<Review> {
    const response = await fetch(`/api/booking-reviews/${reviewId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch review ${reviewId}`);
    }

    const responseData = await response.json();
    return responseData.data;
}
