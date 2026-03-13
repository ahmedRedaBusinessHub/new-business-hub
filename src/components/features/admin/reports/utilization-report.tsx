"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";
import { formatCurrency } from "@/lib/utils";
import type { UtilizationReport } from "@/types/api/reports";

interface UtilizationReportProps {
  data: UtilizationReport;
}

export function UtilizationReport({ data }: UtilizationReportProps) {
  const locale = useLocale();
  const t = useTranslations("reports_utilization");
  const isRTL = locale === "ar";

  const formatRevenue = (value: number) =>
    formatCurrency(value, locale === "ar" ? "ar-SA" : "en-US");

  const getUtilizationColor = (rate: number | null | undefined) => {
    if (rate === null || rate === undefined) return "bg-gray-300";
    if (rate >= 50) return "bg-green-500";
    if (rate >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  const spaceTypeLabel = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <TooltipProvider>
      <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("kpi_total_spaces")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.total_spaces}</div>
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

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("kpi_avg_utilization")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.avg_utilization_rate.toFixed(1)}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("kpi_max_utilization")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.max_utilization_rate.toFixed(1)}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("kpi_min_utilization")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.min_utilization_rate.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("col_space")} {t("col_utilization")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                      {t("col_space")}
                    </th>
                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                      {t("col_branch")}
                    </th>
                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                      {t("col_type")}
                    </th>
                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                      {t("col_utilization")}
                    </th>
                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                      {t("col_bookings")}
                    </th>
                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                      {t("col_hours_booked")}
                    </th>
                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                      {t("col_revenue")}
                    </th>
                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                      {t("col_avg_revenue")}
                    </th>
                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                      {t("col_avg_duration")}
                    </th>
                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                      {t("col_avg_attendees")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.spaces.map((space) => (
                    <tr key={space.space_id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        <div className="flex items-center gap-2">
                          {space.space_name}
                          {!space.is_active && (
                            <Badge variant="secondary">{t("archived")}</Badge>
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        {space.branch_name}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        {spaceTypeLabel(space.space_type)}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        {space.utilization_rate === null || space.utilization_rate === undefined ? (
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="text-muted-foreground">N/A</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              {t("unavailable_tooltip")}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={space.utilization_rate} 
                              className="h-2 w-24"
                              indicatorClassName={getUtilizationColor(space.utilization_rate)}
                            />
                            <span className="text-sm">{space.utilization_rate.toFixed(1)}%</span>
                          </div>
                        )}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        {space.total_bookings}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        {space.total_hours_booked.toFixed(1)}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        {formatRevenue(space.revenue_sar)}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        {formatRevenue(space.avg_revenue_per_booking)}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        {space.avg_duration_hours.toFixed(1)}h
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        {space.avg_attendees.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("top_performers")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                        {t("col_space")}
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                        {t("col_utilization")}
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                        {t("col_hours_booked")}
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                        {t("col_revenue")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.top_performers.map((space) => (
                      <tr key={space.space_id} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                          {space.space_name}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                          {space.utilization_rate == null ? (
                            <span className="text-muted-foreground">N/A</span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Progress
                                value={space.utilization_rate}
                                className="h-2 w-24"
                                indicatorClassName={getUtilizationColor(space.utilization_rate)}
                              />
                              <span className="text-sm">{space.utilization_rate.toFixed(1)}%</span>
                            </div>
                          )}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                          {space.total_hours_booked.toFixed(1)}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                          {formatRevenue(space.revenue_sar)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("underutilized")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                        {t("col_space")}
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                        {t("col_utilization")}
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                        {t("col_hours_booked")}
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                        {t("col_revenue")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.underutilized.map((space) => (
                      <tr key={space.space_id} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                          {space.space_name}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                          {space.utilization_rate == null ? (
                            <span className="text-muted-foreground">N/A</span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Progress
                                value={space.utilization_rate}
                                className="h-2 w-24"
                                indicatorClassName={getUtilizationColor(space.utilization_rate)}
                              />
                              <span className="text-sm">{space.utilization_rate.toFixed(1)}%</span>
                            </div>
                          )}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                          {space.total_hours_booked.toFixed(1)}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                          {formatRevenue(space.revenue_sar)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("summary_by_type")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                      {t("col_type")}
                    </th>
                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                      {t("col_space")}
                    </th>
                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                      {t("col_utilization")}
                    </th>
                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                      {t("col_bookings")}
                    </th>
                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                      {t("col_revenue")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(data.summary_by_type).map(([type, info]) => (
                    <tr key={type} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        {spaceTypeLabel(type)}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        {info.count}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        {info.avg_utilization.toFixed(1)}%
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        {info.total_bookings}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                        {formatRevenue(info.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
