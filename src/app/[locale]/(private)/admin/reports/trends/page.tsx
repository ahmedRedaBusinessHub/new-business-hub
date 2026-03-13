"use client";

import * as React from "react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardContent } from "@/components/ui/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { useTrends } from "@/lib/hooks/use-reports";
import { TrendsReportView } from "@/components/features/admin/reports/trends-report";
import { exportToCsv, exportToPdf } from "@/lib/utils/export";
import type { ReportFilter } from "@/types/api/reports";

export default function TrendsPage() {
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
    granularity: (searchParams.get("granularity") as "daily" | "weekly" | "monthly") || undefined,
  };

  const { data, isLoading, isError, error } = useTrends(filter);

  useEffect(() => {
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const granularity = searchParams.get("granularity");

    if (startDate && endDate && granularity !== "monthly") {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff > 90) {
        toast(t("reports_trends.suggest_monthly"));
      }
    }
  }, [searchParams, t]);

  const buildFlatExportRow = React.useCallback(() => {
    if (!data) return null;

    const flat: Record<string, unknown> = {
      granularity: data.granularity,
      data_points: data.data_points,
      total_bookings: data.total_bookings,
      total_revenue: data.total_revenue,
      avg_bookings_per_day: data.avg_bookings_per_day,
      avg_revenue_per_day: data.avg_revenue_per_day,
      booking_growth_rate: data.booking_growth_rate,
      revenue_growth_rate: data.revenue_growth_rate,
      avg_cancellation_rate: data.avg_cancellation_rate,
    };

    Object.entries(data.summary_by_status).forEach(([status, info]) => {
      flat[`summary_by_status.${status}.total`] = info.total;
      flat[`summary_by_status.${status}.trend`] = info.trend;
      flat[`summary_by_status.${status}.change`] = info.change;
    });

    Object.entries(data.summary_by_space_type).forEach(([spaceType, info]) => {
      flat[`summary_by_space_type.${spaceType}.bookings`] = info.bookings;
      flat[`summary_by_space_type.${spaceType}.revenue`] = info.revenue;
      flat[`summary_by_space_type.${spaceType}.trend`] = info.trend;
      flat[`summary_by_space_type.${spaceType}.change`] = info.change;
    });

    flat.peak_period_date = new Date(data.peak_period.date).toISOString();
    flat.peak_period_bookings = data.peak_period.bookings;
    flat.peak_period_revenue = data.peak_period.revenue;
    flat.lowest_period_date = new Date(data.lowest_period.date).toISOString();
    flat.lowest_period_bookings = data.lowest_period.bookings;
    flat.lowest_period_revenue = data.lowest_period.revenue;

    return flat;
  }, [data]);

  const handleExportCsv = React.useCallback(() => {
    const row = buildFlatExportRow();
    if (!row) return;
    exportToCsv("trends-report", [row]);
  }, [buildFlatExportRow]);

  const handleExportPdf = React.useCallback(() => {
    const row = buildFlatExportRow();
    if (!row) return;
    exportToPdf("trends-report", [row], t("reports_trends.title"));
  }, [buildFlatExportRow, t]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="mt-4 h-10 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-destructive">{t("reports.error_loading")}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {(error as Error)?.message}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.total_bookings === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              {t("reports_trends.empty_state")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("reports_trends.title")}</h1>
          <p className="text-muted-foreground">{t("reports_trends.subtitle")}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center h-9 px-4 py-2 text-sm">
            <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
            {t("reports.export")}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleExportCsv}>
              {t("reports.export_csv")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportPdf}>
              {t("reports.export_pdf")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <TrendsReportView data={data} />
    </div>
  );
}
