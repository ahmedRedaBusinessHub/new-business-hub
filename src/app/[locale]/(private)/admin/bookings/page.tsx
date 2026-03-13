"use client";

import { useTranslations } from "next-intl";
import { AdminSpaceBookingsTable } from "@/components/features/space-bookings/AdminSpaceBookingsTable";
import { BookingSummaryStatsCards } from "@/components/features/space-bookings/BookingSummaryStatsCards";

export default function SpaceBookingsAdminPage() {
  const t = useTranslations('adminSpaceBookings');

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("space_bookings")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("space_bookings_description")}
        </p>
      </div>
      <BookingSummaryStatsCards />
      <AdminSpaceBookingsTable />
    </div>
  );
}
