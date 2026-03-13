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
import { useBranchPerformance } from "@/lib/hooks/use-reports";
import { BranchPerformanceReport } from "@/components/features/admin/reports/branch-performance-report";
import { exportToCsv, exportToPdf } from "@/lib/utils/export";
import type { ReportFilter } from "@/types/api/reports";

export default function BranchPerformancePage() {
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

  const { data, isLoading, isError, error } = useBranchPerformance(filter);

  const buildFlatExportRow = React.useCallback(() => {
    if (!data) return null;

    const flat: Record<string, unknown> = {
      total_branches: data.total_branches,
      total_bookings: data.total_bookings,
      total_revenue_sar: data.total_revenue_sar,
      avg_utilization_rate: data.avg_utilization_rate,
      start_date: data.start_date,
      end_date: data.end_date,
    };

    data.branches.forEach((branch, index) => {
      flat[`branches.${index}.branch_id`] = branch.branch_id;
      flat[`branches.${index}.branch_name`] = branch.branch_name;
      flat[`branches.${index}.location`] = branch.location;
      flat[`branches.${index}.total_spaces`] = branch.total_spaces;
      flat[`branches.${index}.total_bookings`] = branch.total_bookings;
      flat[`branches.${index}.total_revenue_sar`] = branch.total_revenue_sar;
      flat[`branches.${index}.avg_revenue_per_booking`] = branch.avg_revenue_per_booking;
      flat[`branches.${index}.avg_utilization_rate`] = branch.avg_utilization_rate;
      flat[`branches.${index}.confirmed_bookings`] = branch.confirmed_bookings;
      flat[`branches.${index}.cancelled_bookings`] = branch.cancelled_bookings;
      flat[`branches.${index}.cancellation_rate`] = branch.cancellation_rate;
      flat[`branches.${index}.avg_duration_hours`] = branch.avg_duration_hours;
      flat[`branches.${index}.unique_users`] = branch.unique_users;
      flat[`branches.${index}.avg_bookings_per_user`] = branch.avg_bookings_per_user;

      Object.entries(branch.revenue_by_tier).forEach(([tier, tierData]) => {
        flat[`branches.${index}.revenue_by_tier.${tier}.revenue`] = tierData.revenue;
        flat[`branches.${index}.revenue_by_tier.${tier}.bookings`] = tierData.bookings;
      });

      Object.entries(branch.space_type_distribution).forEach(([type, typeData]) => {
        flat[`branches.${index}.space_type_distribution.${type}.count`] = typeData.count;
        flat[`branches.${index}.space_type_distribution.${type}.bookings`] = typeData.bookings;
        flat[`branches.${index}.space_type_distribution.${type}.revenue`] = typeData.revenue;
      });
    });

    if (data.top_by_revenue) {
      flat[`top_by_revenue.branch_id`] = data.top_by_revenue.branch_id;
      flat[`top_by_revenue.branch_name`] = data.top_by_revenue.branch_name;
      flat[`top_by_revenue.revenue`] = data.top_by_revenue.revenue;
      flat[`top_by_revenue.rank`] = data.top_by_revenue.rank;
    }

    if (data.top_by_utilization) {
      flat[`top_by_utilization.branch_id`] = data.top_by_utilization.branch_id;
      flat[`top_by_utilization.branch_name`] = data.top_by_utilization.branch_name;
      flat[`top_by_utilization.revenue`] = data.top_by_utilization.revenue;
      flat[`top_by_utilization.rank`] = data.top_by_utilization.rank;
    }

    if (data.top_by_bookings) {
      flat[`top_by_bookings.branch_id`] = data.top_by_bookings.branch_id;
      flat[`top_by_bookings.branch_name`] = data.top_by_bookings.branch_name;
      flat[`top_by_bookings.revenue`] = data.top_by_bookings.revenue;
      flat[`top_by_bookings.rank`] = data.top_by_bookings.rank;
    }

    return flat;
  }, [data]);

  const handleExportCsv = React.useCallback(() => {
    const row = buildFlatExportRow();
    if (!row) return;
    exportToCsv("branch-performance", [row]);
  }, [buildFlatExportRow]);

  const handleExportPdf = React.useCallback(() => {
    const row = buildFlatExportRow();
    if (!row) return;
    exportToPdf("branch-performance", [row], t("reports_branch_performance.title"));
  }, [buildFlatExportRow, t]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="mt-4 h-10 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
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

  if (!data || data.branches.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              {t("reports_branch_performance.empty_state")}
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
          <h1 className="text-2xl font-bold">{t("reports_branch_performance.title")}</h1>
          <p className="text-muted-foreground">{t("reports_branch_performance.subtitle")}</p>
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
      <BranchPerformanceReport data={data} />
    </div>
  );
}
