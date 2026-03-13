import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { Booking } from "@/types/api/bookings";
import { CoworkingSpace } from "@/types/api/spaces";
import { CheckCircle, Calendar, MapPin, Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface BookingConfirmationProps {
    booking: Booking;
    space: CoworkingSpace;
    locale: string;
}

export function BookingConfirmation({ booking, space, locale }: BookingConfirmationProps) {
    const t = useTranslations();
    const isAr = locale === "ar";
    const spaceName = isAr ? space.name_ar : space.name_en;
    const branchName = isAr ? space.branch?.name_ar : space.branch?.name_en;

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 shadow-sm text-center max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
                <CheckCircle className="w-16 h-16 text-green-500" />
            </div>

            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                {t("booking_success_title") || "Booking Confirmed!"}
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mb-8">
                {t("booking_success_message")}
            </p>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 text-left mb-8 space-y-4">
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">
                            {t("booking_confirm_code_label")}
                        </span>
                        <span className="font-mono text-lg font-bold text-primary">
                            {booking.confirmation_code || "BKG-0000"}
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">
                            {t("booking_total_paid_label")}
                        </span>
                        <span className="font-bold text-lg">
                            {formatCurrency(booking.final_amount ?? booking.total_cost ?? 0)}
                        </span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {spaceName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {branchName || "BusinessHub Branch"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {format(new Date(booking.start_datetime || new Date()), "EEEE, MMMM d, yyyy")}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {format(new Date(booking.start_datetime || new Date()), "h:mm a")} - {format(new Date(booking.end_datetime || new Date()), "h:mm a")}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {booking.attendees} {booking.attendees === 1 ? t("booking_person_label") : t("booking_people_label")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild>
                    <Link href={`/${locale}/bookings`}>
                        {t("booking_view_my_bookings_cta") || "View My Bookings"}
                    </Link>
                </Button>
                <Button asChild>
                    <Link href={`/${locale}`} className="group">
                        {t("booking_return_home_cta") || "Return to Home"}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
