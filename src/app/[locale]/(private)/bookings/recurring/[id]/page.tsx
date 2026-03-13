"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Loader2, ChevronLeft } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { RecurringBookingDetails } from "@/components/features/bookings/recurring-booking-details";
import { useCancelRecurringSeries } from "@/lib/hooks/use-bookings";
import { useRecurringBookingDetails } from "@/lib/hooks/use-bookings";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/Dialog";

export default function RecurringBookingViewPage() {
    const { id } = useParams();
    const router = useRouter();
    const t = useTranslations();
    const bookingId = (Array.isArray(id) ? id[0] : id) || "";

    const { data: booking, isLoading, isError } = useRecurringBookingDetails(bookingId);
    const cancelSeriesMutation = useCancelRecurringSeries();
    const [isCancelOpen, setIsCancelOpen] = useState(false);

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
                <h2 className="text-2xl font-bold mb-4">{t("error_loading_bookings")}</h2>
                <Button onClick={() => router.back()}>{t("go_back")}</Button>
            </div>
        );
    }

    const canCancel = booking.status === 'active';

    return (
        <div className="min-h-screen pt-24 pb-20 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Button variant="ghost" onClick={() => router.back()} className="group">
                        <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        {t("back_to_bookings")}
                    </Button>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <RecurringBookingDetails
                            booking={booking}
                            canCancel={canCancel}
                            onCancelSeries={() => setIsCancelOpen(true)}
                        />
                    </motion.div>
                </div>
            </div>

            <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{t("recurring_booking_cancel_series_title")}</DialogTitle>
                        <DialogDescription>{t("recurring_booking_cancel_series_message")}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-3 sm:gap-0">
                        <Button variant="ghost" onClick={() => setIsCancelOpen(false)} disabled={cancelSeriesMutation.isPending}>
                            {t("common_cancel")}
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={cancelSeriesMutation.isPending}
                            onClick={() => {
                                cancelSeriesMutation.mutate(booking.id, {
                                    onSuccess: () => setIsCancelOpen(false),
                                });
                            }}
                        >
                            {cancelSeriesMutation.isPending ? t("common_saving") : t("recurring_booking_manage_series")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
