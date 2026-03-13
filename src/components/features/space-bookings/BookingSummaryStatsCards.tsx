"use client";

import { useTranslations } from "next-intl";
import { useBookingStatistics } from "@/lib/hooks/use-admin-space-bookings";
import { Clock, Calendar, CheckCircle, Wallet } from "lucide-react";

export function BookingSummaryStatsCards() {
  const t = useTranslations("adminSpaceBookings");
  const { data, isLoading } = useBookingStatistics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {isLoading ? (
        <>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </>
      ) : data ? (
        <>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  {t("pending_bookings")}
                </div>
                <div className="text-2xl font-bold">
                  {data.data.pending_count}
                </div>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  {t("bookings_today")}
                </div>
                <div className="text-2xl font-bold">
                  {data.data.today_count}
                </div>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  {t("confirmed_this_month")}
                </div>
                <div className="text-2xl font-bold">
                  {data.data.confirmed_this_month}
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  {t("revenue_this_month")}
                </div>
                <div className="text-2xl font-bold">
                  {data.data.revenue_this_month} SAR
                </div>
              </div>
              <Wallet className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
