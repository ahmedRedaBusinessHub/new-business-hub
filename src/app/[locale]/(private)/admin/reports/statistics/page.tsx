"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useBookingStatistics } from "@/lib/hooks/use-reports";
import { StatisticsReport } from "@/components/features/admin/reports/statistics-report";
import { exportToCsv, exportToPdf } from "@/lib/utils/export";
import type { BookingStatistics, ReportFilter } from "@/types/api/reports";

export default function StatisticsPage() {
  const searchParams = useSearchParams();
  const t = useTranslations();

  const filter: ReportFilter = {
    start_date: searchParams.get("start_date") || undefined,
    end_date: searchParams.get("end_date") || undefined,
    branch_id: searchParams.get("branch_id")
      ? Number(searchParams.get("branch_id"))
      : undefined,
    coworking_space_id: searchParams.get("coworking_space_id")
      ? Number(searchParams.get("coworking_space_id"))
      : undefined,
  };

  const {
    data: all,
    isLoading,
    isError,
    error,
  } = useBookingStatistics(filter) as {
    data: { data: BookingStatistics } | undefined;
    isLoading: boolean;
    isError: boolean;
    error: any;
  };
  console.log("🚀 ~ StatisticsPage ~ all:", all);
  const data = all?.data;

  const buildFlatExportRow = React.useCallback(() => {
    if (!data) return null;

    const flat: Record<string, unknown> = {
      total_bookings: data.total_bookings,
      total_revenue_sar: data.total_revenue_sar,
      avg_revenue_per_booking: data.avg_revenue_per_booking,
      avg_duration_hours: data.avg_duration_hours,
      cancellation_rate: data.cancellation_rate,
      unique_users: data.unique_users,
      avg_bookings_per_user: data.avg_bookings_per_user,
    };

    for (const [status, info] of Object.entries(data.by_status)) {
      flat[`by_status.${status}.count`] = (info as any).count;
      flat[`by_status.${status}.revenue`] = (info as any).revenue;
    }

    for (const [tier, info] of Object.entries(data.by_pricing_tier)) {
      flat[`by_pricing_tier.${tier}.count`] = (info as any).count;
      flat[`by_pricing_tier.${tier}.revenue`] = (info as any).revenue;
      flat[`by_pricing_tier.${tier}.avg_duration`] = (info as any).avg_duration;
    }

    for (const [spaceType, info] of Object.entries(data.by_space_type)) {
      flat[`by_space_type.${spaceType}.count`] = (info as any).count;
      flat[`by_space_type.${spaceType}.revenue`] = (info as any).revenue;
      flat[`by_space_type.${spaceType}.avg_duration`] = (info as any).avg_duration;
    }

    return flat;
  }, [data]);

  const handleExportCsv = React.useCallback(() => {
    const row = buildFlatExportRow();
    if (!row) return;
    exportToCsv("booking-statistics", [row]);
  }, [buildFlatExportRow]);

  const handleExportPdf = React.useCallback(() => {
    const row = buildFlatExportRow();
    if (!row) return;
    exportToPdf("booking-statistics", [row], t("reports_statistics.title"));
  }, [buildFlatExportRow, t]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="pt-6">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="mt-4 h-8 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="border-border/50">
              <CardHeader className="items-center pb-0">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="mt-2 h-4 w-1/4" />
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <Skeleton className="h-48 w-48 rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-destructive/10 p-3 text-destructive mb-4">
              <ArrowDownTrayIcon className="h-6 w-6 rotate-180" />
            </div>
            <p className="text-lg font-semibold text-destructive">{t("reports.error_loading")}</p>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              {(error as Error)?.message}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.total_bookings === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <ArrowDownTrayIcon className="h-6 w-6" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">
              {t("reports_statistics.empty_state")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {t("reports_statistics.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("reports_statistics.subtitle")}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow-sm">
            <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
            {t("reports.export")}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem onClick={handleExportCsv} className="cursor-pointer">
              {t("reports.export_csv")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportPdf} className="cursor-pointer">
              {t("reports.export_pdf")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <StatisticsReport data={data} />
    </div>
  );
}
