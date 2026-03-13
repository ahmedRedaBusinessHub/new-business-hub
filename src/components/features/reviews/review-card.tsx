"use client";

import { useLocale } from "next-intl";
import { Review } from "@/types/api/reviews";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { Star } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";

interface ReviewCardProps {
    review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
    const rawLocale = useLocale();
    const locale = rawLocale.startsWith('ar') ? 'ar-SA' : 'en-US';

    return (
        <Card className="shadow-none border-b rounded-none last:border-0 bg-transparent mb-4">
            <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="flex gap-4">
                    <Avatar className="w-12 h-12">
                        <AvatarFallback>{review.user_name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-semibold text-lg">{review.user_name || "Anonymous"}</h4>
                                <p className="text-sm text-muted-foreground">{formatDateTime(review.created_at, locale)}</p>
                            </div>

                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-4 h-4 ${star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <p className="text-muted-foreground leading-relaxed mt-3">
                            {review.comment}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
