"use client";

import { useTranslations } from "next-intl";
import { useSpaceReviews } from "@/lib/hooks/use-reviews";
import { ReviewList } from "@/components/features/reviews/review-list";
import { Loader2 } from "lucide-react";

interface SpaceReviewsSectionProps {
    spaceId: number | string;
}

export function SpaceReviewsSection({ spaceId }: SpaceReviewsSectionProps) {
    const t = useTranslations();
    const { data: reviewsData, isLoading, isError } = useSpaceReviews(spaceId);
    console.log("🚀 ~ SpaceReviewsSection ~ reviewsData:", reviewsData)

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="py-8 text-center text-destructive">
                {t("error_loading_data", { defaultMessage: "Failed to load reviews" })}
            </div>
        );
    }

    if (!reviewsData) return null;

    return (
        <section className="space-y-6 mt-16 pt-8 border-t">
            <h2 className="text-3xl font-bold tracking-tight">
                {t("review_list_title", { count: reviewsData.totalReviews, defaultMessage: "Reviews" })}
            </h2>

            <ReviewList data={reviewsData} />
        </section>
    );
}
