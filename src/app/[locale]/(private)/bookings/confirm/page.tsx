import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { fetchBookingDetails } from "@/lib/api/bookings";
import { fetchSpaceDetails } from "@/lib/api/spaces";
import { BookingConfirmation } from "@/components/features/bookings/booking-confirmation";
import { redirect } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale });
    return {
        title: t("booking_success_title") || "Booking Confirmed",
    };
}

export default async function BookingConfirmationPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ booking_id?: string;[key: string]: string | undefined }>;
}) {
    const { locale } = await params;
    const resolvedSearchParams = await searchParams;

    if (!resolvedSearchParams.booking_id) {
        redirect(`/${locale}/bookings`);
    }

    try {
        const res: any = await fetchBookingDetails(resolvedSearchParams.booking_id);
        const booking = res.data
        console.log("🚀 ~ BookingConfirmationPage ~ booking:", booking.coworking_space.id, booking)
        const space = await fetchSpaceDetails(booking.coworking_space.id);

        return (
            <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[80vh]">
                <BookingConfirmation booking={booking} space={space} locale={locale} />
            </div>
        );
    } catch (error) {
        console.error("Failed to fetch booking details for confirmation:", error);
        redirect(`/${locale}/spaces`);
    }
}
