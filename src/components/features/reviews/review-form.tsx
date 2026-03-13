"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { createReviewSchema, CreateReviewFormValues } from "@/lib/schemas/review";
import { useCreateReview } from "@/lib/hooks/use-reviews";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ReviewFormProps {
    bookingId: number;
    spaceId: number;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function ReviewForm({ bookingId, spaceId, onSuccess, onCancel }: ReviewFormProps) {
    const t = useTranslations();
    const { mutate: createReview, isPending } = useCreateReview();
    const [hoveredRating, setHoveredRating] = useState<number>(0);

    const form = useForm<CreateReviewFormValues>({
        resolver: zodResolver(createReviewSchema),
        defaultValues: {
            bookingId,
            spaceId,
            rating: 5,
            comment: "",
        },
    });

    const onSubmit = (data: CreateReviewFormValues) => {
        // Sanitize comment by removing HTML tags
        const sanitizedComment = data.comment 
            ? data.comment.replace(/<[^>]*>/g, '').trim()
            : undefined;

        createReview({
            bookingId,
            data: {
                rating: data.rating as 1 | 2 | 3 | 4 | 5,
                comment: sanitizedComment,
            }
        }, {
            onSuccess: () => {
                toast.success(t("review_form_success", { defaultMessage: "Review submitted successfully" }));
                form.reset();
                onSuccess?.();
            },
            onError: (error) => {
                const errorMessage = error.message || t("review_form_error", { defaultMessage: "Failed to submit review. Please try again." });
                
                // Provide more specific error messages
                if (errorMessage.includes('already reviewed')) {
                    toast.error(t("review_already_exists", { defaultMessage: "You have already reviewed this booking" }));
                } else if (errorMessage.includes('completed')) {
                    toast.error(t("review_booking_not_completed", { defaultMessage: "You can only review completed bookings" }));
                } else if (errorMessage.includes('Too many')) {
                    toast.error(t("review_rate_limit", { defaultMessage: "You have reached the review submission limit. Please try again later." }));
                } else {
                    toast.error(errorMessage);
                }
            }
        });
    };

    return (
        <Form {...form} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t("review_form_rating_label", { defaultMessage: "Rating" })}</FormLabel>
                        <FormControl>
                            <div
                                className="flex items-center gap-1"
                                onMouseLeave={() => setHoveredRating(0)}
                                role="group"
                                aria-label="Star rating"
                                onKeyDown={(e) => {
                                    const current = field.value as number;
                                    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                                        e.preventDefault();
                                        field.onChange(Math.min(5, current + 1));
                                    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                                        e.preventDefault();
                                        field.onChange(Math.max(1, current - 1));
                                    }
                                }}
                            >
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={cn(
                                            "p-1 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded",
                                            (hoveredRating || field.value) >= star ? "text-yellow-400" : "text-muted"
                                        )}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onClick={() => field.onChange(star)}
                                        aria-label={`${star} stars`}
                                        aria-pressed={field.value >= star}
                                    >
                                        <Star className="w-8 h-8 fill-current" />
                                    </button>
                                ))}
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t("review_form_comment_label", { defaultMessage: "Comment (optional)" })}</FormLabel>
                        <FormControl>
                            <Textarea
                                {...field}
                                rows={4}
                                placeholder={t("review_form_comment_placeholder", { defaultMessage: "Share your experience..." })}
                                className="resize-none"
                                maxLength={1000}
                                aria-label="Review comment"
                            />
                        </FormControl>
                        <div className="flex justify-between">
                            <FormMessage />
                            {field.value && (
                                <span className="text-xs text-muted-foreground">
                                    {field.value.length}/1000
                                </span>
                            )}
                        </div>
                    </FormItem>
                )}
            />

            <div className="flex gap-3 justify-end pt-2">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
                        {t("common_cancel", { defaultMessage: "Cancel" })}
                    </Button>
                )}
                <Button type="submit" disabled={isPending}>
                    {isPending ? t("common_saving", { defaultMessage: "Submitting..." }) : t("review_submit_cta", { defaultMessage: "Submit Review" })}
                </Button>
            </div>
        </Form>
    );
}
