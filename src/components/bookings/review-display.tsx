"use client";

/**
 * ReviewDisplay — Read-only display of a submitted booking review.
 *
 * Props:
 * - review: Review — the review object to display
 * - showFullComment?: boolean — if false (default), long comments are truncated at 150 chars
 *
 * Usage:
 * ```tsx
 * <ReviewDisplay review={review} showFullComment />
 * ```
 */
import { Review } from "@/types/api/reviews";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/utils";
import { useLocale } from "next-intl";

interface ReviewDisplayProps {
    review: Review;
    showFullComment?: boolean;
}

export function ReviewDisplay({ review, showFullComment = false }: ReviewDisplayProps) {
    const rawLocale = useLocale();
    const locale = rawLocale.startsWith('ar') ? 'ar-SA' : 'en-US';

    // Truncate comment if not showing full and comment is long
    const displayComment = showFullComment || !review.comment
        ? review.comment
        : review.comment.length > 150
            ? `${review.comment.substring(0, 150)}...`
            : review.comment;

    return (
        <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={cn(
                                "w-5 h-5",
                                star <= review.rating
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300"
                            )}
                        />
                    ))}
                </div>
                <span className="text-sm text-muted-foreground">
                    {formatDateTime(review.created_at, locale)}
                </span>
            </div>

            {review.comment && (
                <p className="text-sm leading-relaxed">
                    {displayComment}
                </p>
            )}

            {!showFullComment && review.comment && review.comment.length > 150 && (
                <button className="text-sm text-primary hover:underline">
                    Read more
                </button>
            )}
        </div>
    );
}
