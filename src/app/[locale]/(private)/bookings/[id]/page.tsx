"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useBookingDetails,
  useCancelBooking,
  useModifyBooking,
} from "@/lib/hooks/use-bookings";
import { useBookingReview } from "@/lib/hooks/use-reviews";
import { BookingDetails } from "@/components/features/bookings/booking-details";
import { CancelBookingDialog } from "@/components/features/bookings/cancel-booking-dialog";
import { ModifyBookingDialog } from "@/components/features/bookings/modify-booking-dialog";
import { ReviewDisplay } from "@/components/bookings/review-display";
import { ReviewForm } from "@/components/features/reviews/review-form";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Loader2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion } from "motion/react";
import { BookingStatus } from "@/types/api/bookings";

export default function BookingViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const t = useTranslations();
  const bookingId = (Array.isArray(id) ? id[0] : id) || "";

  const { data: booking, isLoading, isError } = useBookingDetails(bookingId);
  const { data: review, isLoading: reviewLoading } = useBookingReview(Number(bookingId));
  const cancelMutation = useCancelBooking();
  const modifyMutation = useModifyBooking();

  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isModifyOpen, setIsModifyOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">
          {t("error_loading_bookings")}
        </h2>
        <Button onClick={() => router.back()}>{t("go_back")}</Button>
      </div>
    );
  }

  // Cancellation logic: allowed if status is confirmed or pending and start_date is in future
  // Handle both string and numeric statuses for robustness
  const canCancel =
    (booking.status === BookingStatus.CONFIRMED ||
      booking.status === 1 ||
      booking.status === BookingStatus.PENDING ||
      booking.status === 0 ||
      booking.status === "confirmed" ||
      booking.status === "pending") &&
    new Date(booking.start_date || booking.start_datetime || "") > new Date();

  const canModify = canCancel; // Same logic for now

  const isCompletedBooking =
    booking.status === BookingStatus.COMPLETED ||
    booking.status === 2 ||
    booking.status === "completed";

  const hasSpaceId = !!(booking.space_id || booking.coworking_space_id);
  const spaceId = (booking.space_id || booking.coworking_space_id) as number;

  // Show review form if booking is completed, has space, and no review exists
  const showReviewForm = isCompletedBooking && hasSpaceId && !review;

  // Show review display if review exists
  const showReviewDisplay = !!review;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-muted/30 mt-20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="group"
          >
            <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {t("back_to_bookings", { defaultMessage: "Back to My Bookings" })}
          </Button>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <BookingDetails
              booking={booking}
              canCancel={canCancel}
              canModify={canModify}
              canReview={false} // We handle review display inline now
              onCancel={() => setIsCancelOpen(true)}
              onModify={() => setIsModifyOpen(true)}
              onLeaveReview={() => {}}
            />
          </motion.div>

          {/* Review Section */}
          {(showReviewForm || showReviewDisplay || reviewLoading) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-background rounded-lg border shadow-sm">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-semibold">
                    {t("review_section_title", { defaultMessage: "Your Review" })}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("review_section_subtitle", { defaultMessage: "Share your experience with this workspace" })}
                  </p>
                </div>
                
                <div className="p-6">
                  {reviewLoading && <SkeletonCard />}
                  
                  {showReviewForm && !reviewLoading && (
                    <ReviewForm
                      bookingId={booking.id as number}
                      spaceId={spaceId}
                      onSuccess={() => {
                        // Invalidate booking review query
                      }}
                    />
                  )}
                  
                  {showReviewDisplay && review && (
                    <ReviewDisplay review={review} showFullComment={true} />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <CancelBookingDialog
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        isLoading={cancelMutation.isPending}
        startDate={booking.start_datetime}
        onConfirm={() => {
          cancelMutation.mutate(booking.id, {
            onSuccess: () => setIsCancelOpen(false),
          });
        }}
      />

      <ModifyBookingDialog
        booking={booking}
        isOpen={isModifyOpen}
        onClose={() => setIsModifyOpen(false)}
        isLoading={modifyMutation.isPending}
        onConfirm={(data) => {
          modifyMutation.mutate(
            { id: booking.id, data },
            {
              onSuccess: () => setIsModifyOpen(false),
            },
          );
        }}
      />
    </div>
  );
}
