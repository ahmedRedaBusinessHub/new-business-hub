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
import { useUserBehavior } from "@/lib/hooks/use-reports";
import { UserBehaviorReport } from "@/components/features/admin/reports/user-behavior-report";
import { exportToCsv, exportToPdf } from "@/lib/utils/export";
import type { ReportFilter } from "@/types/api/reports";

export default function UserBehaviorPage() {
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

  const { data, isLoading, isError, error } = useUserBehavior(filter);

  const buildFlatExportRow = React.useCallback(() => {
    if (!data) return null;

    const flat: Record<string, unknown> = {
      total_users: data.total_users,
      new_users: data.new_users,
      new_user_percentage: data.new_user_percentage,
      returning_users: data.returning_users,
      avg_bookings_per_user: data.avg_bookings_per_user,
      avg_revenue_per_user: data.avg_revenue_per_user,
      tenant_users: data.tenant_users,
      tenant_user_percentage: data.tenant_user_percentage,
      avg_bookings_per_tenant: data.avg_bookings_per_tenant,
      tenant_booking_percentage: data.tenant_booking_percentage,
      tenant_revenue: data.tenant_revenue,
      tenant_revenue_percentage: data.tenant_revenue_percentage,
      most_booked_space_type: data.most_booked_space_type,
      most_used_pricing_tier: data.most_used_pricing_tier,
    };

    return flat;
  }, [data]);

  const handleExportCsv = React.useCallback(() => {
    const row = buildFlatExportRow();
    if (!row) return;
    exportToCsv("user-behavior", [row]);
  }, [buildFlatExportRow]);

  const handleExportPdf = React.useCallback(() => {
    const row = buildFlatExportRow();
    if (!row) return;
    exportToPdf("user-behavior", [row], t("reports_user_behavior.title"));
  }, [buildFlatExportRow, t]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
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

  if (!data || data.total_users === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              {t("reports_user_behavior.empty_state")}
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
          <h1 className="text-2xl font-bold">{t("reports_user_behavior.title")}</h1>
          <p className="text-muted-foreground">{t("reports_user_behavior.subtitle")}</p>
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
      <UserBehaviorReport data={data} />
    </div>
  );
}
