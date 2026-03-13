import { useTranslations } from "next-intl";
import { BookingStatus } from "@/types/api/bookings";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";

interface BookingFiltersProps {
    currentStatus: string;
    onStatusChange: (status: string) => void;
}

export function BookingFilters({ currentStatus, onStatusChange }: BookingFiltersProps) {
    const t = useTranslations();

    return (
        <Tabs value={currentStatus} onValueChange={onStatusChange} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full h-auto p-1 bg-muted">
                <TabsTrigger value="all" className="py-2">{t("booking_filters_all")}</TabsTrigger>
                <TabsTrigger value={String(BookingStatus.CONFIRMED)} className="py-2">{t("booking_status_confirmed")}</TabsTrigger>
                <TabsTrigger value={String(BookingStatus.PENDING)} className="py-2">{t("booking_status_pending")}</TabsTrigger>
                <TabsTrigger value={String(BookingStatus.COMPLETED)} className="py-2">{t("booking_status_completed")}</TabsTrigger>
                <TabsTrigger value={String(BookingStatus.CANCELLED)} className="py-2">{t("booking_status_cancelled")}</TabsTrigger>
            </TabsList>
        </Tabs>
    );
}
