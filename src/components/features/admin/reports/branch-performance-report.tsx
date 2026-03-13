"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import type { BranchComparisonReport } from "@/types/api/reports";

interface BranchPerformanceReportProps {
  data: BranchComparisonReport;
}

export function BranchPerformanceReport({ data }: BranchPerformanceReportProps) {
  const locale = useLocale();
  const t = useTranslations("reports_branch_performance");
  const isRTL = locale === "ar";

  const formatRevenue = (value: number) =>
    formatCurrency(value, locale === "ar" ? "ar-SA" : "en-US");

  const spaceTypeLabel = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const tierLabel = (tier: string) => {
    const labels: Record<string, string> = {
      hourly: t("pricing_tier_hourly") || "Hourly",
      daily: t("pricing_tier_daily") || "Daily",
      weekly: t("pricing_tier_weekly") || "Weekly",
      monthly: t("pricing_tier_monthly") || "Monthly",
    };
    return labels[tier] || tier;
  };

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("kpi_total_branches")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total_branches}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("kpi_total_bookings")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total_bookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("kpi_total_revenue")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRevenue(data.total_revenue_sar)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("table_title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                    {t("col_branch")}
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                    {t("col_city")}
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                    {t("col_bookings")}
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                    {t("col_revenue")}
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                    {t("col_avg_revenue")}
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                    {t("col_avg_utilization")}
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                    {t("col_cancellation_rate")}
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                    {t("col_avg_duration")}
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                    {t("col_unique_users")}
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                    {t("col_bookings_user")}
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                    {t("revenue_by_tier") || "Revenue by Tier"}
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                    {t("space_type_distribution") || "Space Types"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.branches.map((branch) => {
                  const maxTierRevenue = Math.max(
                    ...Object.values(branch.revenue_by_tier).map((t) => t.revenue),
                  );

                  return (
                    <tr key={branch.branch_id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        {branch.branch_name}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        {branch.location}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        {branch.total_bookings}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        {formatRevenue(branch.total_revenue_sar)}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        {formatRevenue(branch.avg_revenue_per_booking)}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        {branch.avg_utilization_rate.toFixed(1)}%
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        {branch.cancellation_rate.toFixed(1)}%
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        {branch.avg_duration_hours.toFixed(1)}h
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        {branch.unique_users}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        {branch.avg_bookings_per_user.toFixed(2)}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        <div className="space-y-1">
                          {Object.entries(branch.revenue_by_tier).map(([tier, data]) => (
                            <div key={tier} className="flex items-center gap-2 text-xs">
                              <span className="w-16">{tierLabel(tier)}:</span>
                              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                                <div
                                  className="h-full bg-blue-500"
                                  style={{
                                    width: maxTierRevenue > 0 ? `${(data.revenue / maxTierRevenue) * 100}%` : "0%",
                                  }}
                                />
                              </div>
                              <span className="w-16 text-right">{formatRevenue(data.revenue)}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(branch.space_type_distribution).map(([type, data]) => (
                            <Badge key={type} variant="outline" className="text-xs">
                              {spaceTypeLabel(type)} ({data.count})
                            </Badge>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("top_by_revenue")}</CardTitle>
          </CardHeader>
          <CardContent>
            {data.top_by_revenue ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{data.top_by_revenue.branch_name}</span>
                  <span className="text-lg font-bold">{formatRevenue(data.top_by_revenue.revenue)}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("rank") || "Rank"} #{data.top_by_revenue.rank}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">{t("no_data") || "No data"}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("top_by_utilization")}</CardTitle>
          </CardHeader>
          <CardContent>
            {data.top_by_utilization ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{data.top_by_utilization.branch_name}</span>
                  <span className="text-lg font-bold">{data.top_by_utilization.utilization_rate.toFixed(1)}%</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("rank") || "Rank"} #{data.top_by_utilization.rank}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">{t("no_data") || "No data"}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("top_by_bookings")}</CardTitle>
          </CardHeader>
          <CardContent>
            {data.top_by_bookings ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{data.top_by_bookings.branch_name}</span>
                  <span className="text-lg font-bold">{data.top_by_bookings.total_bookings}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("rank") || "Rank"} #{data.top_by_bookings.rank}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">{t("no_data") || "No data"}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
