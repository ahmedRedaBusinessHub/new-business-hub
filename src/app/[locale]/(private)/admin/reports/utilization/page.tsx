"use client";

import * as React from "react";
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
import { useUtilizationReport } from "@/lib/hooks/use-reports";
import { UtilizationReport as UtilizationReportComponent } from "@/components/features/admin/reports/utilization-report";
import { exportToCsv, exportToPdf } from "@/lib/utils/export";
import type { ReportFilter } from "@/types/api/reports";

export default function UtilizationPage() {
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

  const { data, isLoading, isError, error } = useUtilizationReport(filter);

  const buildFlatExportRow = React.useCallback(() => {
    if (!data) return null;

    const flat: Record<string, unknown> = {
      total_spaces: data.total_spaces,
      total_bookings: data.total_bookings,
      total_revenue_sar: data.total_revenue_sar,
      avg_utilization_rate: data.avg_utilization_rate,
      max_utilization_rate: data.max_utilization_rate,
      min_utilization_rate: data.min_utilization_rate,
    };

    data.spaces.forEach((space, index) => {
      flat[`spaces.${index}.space_name`] = space.space_name;
      flat[`spaces.${index}.branch_name`] = space.branch_name;
      flat[`spaces.${index}.space_type`] = space.space_type;
      flat[`spaces.${index}.utilization_rate`] = space.utilization_rate;
      flat[`spaces.${index}.total_bookings`] = space.total_bookings;
      flat[`spaces.${index}.total_hours_booked`] = space.total_hours_booked;
      flat[`spaces.${index}.revenue_sar`] = space.revenue_sar;
      flat[`spaces.${index}.avg_revenue_per_booking`] = space.avg_revenue_per_booking;
      flat[`spaces.${index}.avg_duration_hours`] = space.avg_duration_hours;
      flat[`spaces.${index}.avg_attendees`] = space.avg_attendees;
    });

    for (const [type, info] of Object.entries(data.summary_by_type)) {
      flat[`summary_by_type.${type}.count`] = info.count;
      flat[`summary_by_type.${type}.avg_utilization`] = info.avg_utilization;
      flat[`summary_by_type.${type}.total_bookings`] = info.total_bookings;
      flat[`summary_by_type.${type}.revenue`] = info.revenue;
    }

    return flat;
  }, [data]);

  const handleExportCsv = React.useCallback(() => {
    const row = buildFlatExportRow();
    if (!row) return;
    exportToCsv("space-utilization", [row]);
  }, [buildFlatExportRow]);

  const handleExportPdf = React.useCallback(() => {
    const row = buildFlatExportRow();
    if (!row) return;
    exportToPdf("space-utilization", [row], t("reports_utilization.title"));
  }, [buildFlatExportRow, t]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
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

  if (!data || data.total_spaces === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              {t("reports_utilization.empty_state")}
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
          <h1 className="text-2xl font-bold">{t("reports_utilization.title")}</h1>
          <p className="text-muted-foreground">{t("reports_utilization.subtitle")}</p>
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
      <UtilizationReportComponent data={data} />
    </div>
  );
}
