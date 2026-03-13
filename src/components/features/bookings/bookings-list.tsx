"use client";

import { useState } from "react";
import { useUserBookings } from "@/lib/hooks/use-bookings";
import { BookingCard } from "./booking-card";
import { BookingFilters } from "./booking-filters";
import { PaginationControls } from "./pagination-controls";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, CalendarX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { ReviewForm } from "@/components/features/reviews/review-form";
import type { Booking } from "@/types/api/bookings";

export function BookingsList() {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const pageParam = searchParams.get("page");
  const initialPage = pageParam ? parseInt(pageParam, 9) : 1;

  const [statusFilter, setStatusFilter] = useState("all");
  console.log("🚀 ~ BookingsList ~ statusFilter:", statusFilter)
  const [page, setPage] = useState(initialPage);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

  let mappedStatus: string | undefined;
  if (statusFilter === "0") mappedStatus = "pending";
  else if (statusFilter === "1") mappedStatus = "confirmed";
  else if (statusFilter === "2") mappedStatus = "completed";
  else if (statusFilter === "3") mappedStatus = "cancelled";

  const { data, isLoading, isError, refetch } = useUserBookings({
    status: mappedStatus as any,
    page,
    limit: 9,
  });
  console.log("🚀 ~ BookingsList ~ data:", data)

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    handlePageChange(1); // T007b
  };

  useEffect(() => {


    const totalPages = Math.ceil((data?.total || 0) / (data?.limit || 10)) || 1;
    const total = data?.total || 0;
    if (data && total > 0 && page > totalPages) {
      handlePageChange(1);
    }
  }, [data, page]);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-destructive mb-4">{t("error_loading_bookings")}</p>
        <Button onClick={() => refetch()} variant="outline">
          {t("try_again")}
        </Button>
      </div>
    );
  }

  const bookings = data?.data || [];

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-4 rounded-2xl border shadow-sm">
          <BookingFilters
            currentStatus={statusFilter}
            onStatusChange={handleStatusChange}
          />
        </div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">{t("loading")}</p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {bookings.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {bookings.map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <BookingCard
                        booking={booking}
                        onLeaveReview={() => setReviewBooking(booking)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center glassmorphism rounded-3xl border"
                >
                  <div className="p-4 bg-muted/50 rounded-full mb-4 text-muted-foreground">
                    <CalendarX className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {t("booking_no_bookings_found")}
                  </h3>
                  <p className="text-muted-foreground mb-8 max-w-sm">
                    {t("no_bookings_desc", {
                      defaultMessage:
                        "You haven't made any bookings yet. Book a space to get started.",
                    })}
                  </p>
                  <Link href={`/${locale}/spaces`}>
                    <Button className="rounded-full px-8">
                      {t("book_now", {
                        defaultMessage: "Book Now",
                      })}
                    </Button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {data && Math.ceil(data.total / data.limit) > 1 && (
              <PaginationControls
                className="mt-8"
                currentPage={page}
                totalPages={Math.ceil(data.total / data.limit)}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>

      <Dialog
        open={!!reviewBooking}
        onOpenChange={(open) => {
          if (!open) setReviewBooking(null);
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("review_leave_review_cta")}</DialogTitle>
            <DialogDescription>
              {t("review_leave_review_desc")}
            </DialogDescription>
          </DialogHeader>
          {reviewBooking?.space_id && (
            <ReviewForm
              bookingId={reviewBooking.id as number}
              spaceId={reviewBooking.space_id as number}
              onSuccess={() => setReviewBooking(null)}
              onCancel={() => setReviewBooking(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
