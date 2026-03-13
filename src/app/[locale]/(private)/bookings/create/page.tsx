import { getTranslations } from "next-intl/server";
import { fetchSpaceDetails } from "@/lib/api/spaces";
import { redirect } from "next/navigation";
import { CreateBookingClient } from "./create-booking-client";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale });
    return {
        title: t("booking_confirm_title") || "Create Booking",
    };
}

export default async function CreateBookingPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ space_id?: string; start_date?: string; end_date?: string;[key: string]: string | undefined }>;
}) {
    const { locale } = await params;
    const resolvedSearchParams = await searchParams;
    const { space_id, start_date, end_date } = resolvedSearchParams;

    if (!space_id) {
        redirect(`/${locale}/spaces`);
    }

    try {
        const space = await fetchSpaceDetails(space_id);

        return (
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <CreateBookingClient space={space} start_date={start_date} end_date={end_date} />
            </div>
        );
    } catch (error) {
        console.error("Failed to fetch space details for booking:", error);
        redirect(`/${locale}/spaces`);
    }
}
