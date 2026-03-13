import { z } from "zod";

export const createReviewSchema = z.object({
    bookingId: z.number().positive("Booking ID is required"),
    spaceId: z.number().positive("Space ID is required"),
    rating: z.number()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating cannot exceed 5")
        .int("Rating must be an integer"),
    comment: z.string()
        .max(1000, "Comment must not exceed 1000 characters")
        .optional(),
});

export type CreateReviewFormValues = z.infer<typeof createReviewSchema>;
