/**
 * Review related types
 * Path: src/types/api/reviews.ts
 */

export interface Review {
    id: number;
    booking_id: number;
    user_id: number;
    user_name: string;
    rating: number;
    comment?: string;
    created_at: string;
    coworking_space_id: number;
    coworking_space_name: string;
    branch_id: number;
    branch_name: string;
}

export interface CreateReviewData {
    bookingId: number;
    spaceId: number;
    rating: 1 | 2 | 3 | 4 | 5;
    comment: string;
}

export interface SpaceReviews {
    spaceId: number;
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
    reviews: Review[];
}
