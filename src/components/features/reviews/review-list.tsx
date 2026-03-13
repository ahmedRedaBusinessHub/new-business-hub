"use client";

import { useTranslations } from "next-intl";
import { SpaceReviews } from "@/types/api/reviews";
import { ReviewCard } from "@/components/features/reviews/review-card";
import { Progress } from "@/components/ui/Progress";
import { Star } from "lucide-react";

interface ReviewListProps {
    data: SpaceReviews;
}

export function ReviewList({ data }: ReviewListProps) {
    const t = useTranslations();

    if (!data.reviews || data.reviews.length === 0) {
        return (
            <div className="py-12 text-center text-muted-foreground border-t">
                {t("review_no_reviews", { defaultMessage: "No reviews yet. Be the first to leave one!" })}
            </div>
        );
    }

    return (
        <div className="space-y-8 pt-8 border-t">
            {/* Summary Header */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-muted/20 p-6 rounded-2xl">
                <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
                    <span className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-600">
                        {data.averageRating.toFixed(1)}
                    </span>
                    <div className="flex gap-1 my-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-5 h-5 ${star <= Math.round(data.averageRating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300 dark:text-gray-700"}`}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                        {t("review_list_title", { count: data.totalReviews, defaultMessage: "Based on reviews" })}
                    </span>
                </div>

                <div className="md:col-span-8 flex flex-col-reverse gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                        const count = data.ratingDistribution[star as 1 | 2 | 3 | 4 | 5] || 0;
                        const percentage = data.totalReviews > 0 ? (count / data.totalReviews) * 100 : 0;

                        return (
                            <div key={star} className="flex items-center gap-3">
                                <span className="text-sm font-medium w-3 text-right">{star}</span>
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <Progress value={percentage} className="h-2" />
                                <span className="text-xs text-muted-foreground w-8">{percentage.toFixed(0)}%</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* List of Reviews */}
            <div className="divide-y divide-border/50 bg-background rounded-2xl border shadow-sm">
                {data.reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))}
            </div>
        </div>
    );
}
