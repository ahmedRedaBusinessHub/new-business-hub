"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import type { TrendsReport } from "@/types/api/reports";

interface TrendsReportProps {
  data: TrendsReport;
}

export function TrendsReportView({ data }: TrendsReportProps) {
  const locale = useLocale();
  const t = useTranslations("reports_trends");
  const isRTL = locale === "ar";

  const formatRevenue = (value: number) =>
    formatCurrency(value, locale === "ar" ? "ar-SA" : "en-US");

  const formatPercentage = (value: number | null | undefined) => {
    if (value === null || value === undefined) {
      return t("growth_na");
    }
    const isPositive = value >= 0;
    const icon = isPositive ? "▲" : "▼";
    const color = isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
    return (
      <span className={color}>
        {icon} {Math.abs(value).toFixed(1)}%
      </span>
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const chartData = data.data.map((point) => ({
    date: formatDate(point.date),
    bookings: point.bookings,
    revenue: point.revenue,
  }));

  const chartMargin = {
    left: isRTL ? 20 : 60,
    right: isRTL ? 60 : 20,
    top: 20,
    bottom: 20,
  };

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            <div className="text-2xl font-bold">{formatRevenue(data.total_revenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("kpi_avg_bookings_day")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.avg_bookings_per_day.toFixed(1)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("kpi_avg_revenue_day")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRevenue(data.avg_revenue_per_day)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("kpi_booking_growth")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(data.booking_growth_rate)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("kpi_revenue_growth")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(data.revenue_growth_rate)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("kpi_avg_cancellation")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.avg_cancellation_rate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            {t("title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={chartMargin}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="date"
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  textAnchor={isRTL ? "start" : "end"}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation={isRTL ? "left" : "right"}
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `SAR${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="bookings"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name={t("col_bookings")}
                  dot={{ r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name={t("col_revenue")}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              {t("peak_period")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                {t("col_date")}
              </div>
              <div className="text-lg font-semibold">
                {formatDate(data.peak_period.date)}
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                {t("col_bookings")}
              </div>
              <div className="text-lg font-semibold">
                {data.peak_period.bookings}
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                {t("col_revenue")}
              </div>
              <div className="text-lg font-semibold">
                {formatRevenue(data.peak_period.revenue)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              {t("lowest_period")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                {t("col_date")}
              </div>
              <div className="text-lg font-semibold">
                {formatDate(data.lowest_period.date)}
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                {t("col_bookings")}
              </div>
              <div className="text-lg font-semibold">
                {data.lowest_period.bookings}
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                {t("col_revenue")}
              </div>
              <div className="text-lg font-semibold">
                {formatRevenue(data.lowest_period.revenue)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("breakdown_by_status")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                    {t("col_status")}
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                    {t("col_bookings")}
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                    {t("col_trend")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.summary_by_status).map(([status, info]) => (
                  <tr key={status} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </td>
                    <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                      {info.total}
                    </td>
                    <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                      <span
                        className={
                          info.trend === "up"
                            ? "text-green-600 dark:text-green-400"
                            : info.trend === "down"
                            ? "text-red-600 dark:text-red-400"
                            : "text-gray-600 dark:text-gray-400"
                        }
                      >
                        {t(`trend_${info.trend}`)} ({info.change >= 0 ? "+" : ""}
                        {info.change.toFixed(1)}%)
                      </span>
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
          <CardTitle>{t("breakdown_by_space_type")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                    {t("col_space_type")}
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                    {t("col_bookings")}
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                    {t("col_revenue")}
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                    {t("col_trend")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.summary_by_space_type).map(([spaceType, info]) => (
                  <tr key={spaceType} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                      {spaceType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </td>
                    <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                      {info.bookings}
                    </td>
                    <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                      {formatRevenue(info.revenue)}
                    </td>
                    <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                      <span
                        className={
                          info.trend === "up"
                            ? "text-green-600 dark:text-green-400"
                            : info.trend === "down"
                            ? "text-red-600 dark:text-red-400"
                            : "text-gray-600 dark:text-gray-400"
                        }
                      >
                        {t(`trend_${info.trend}`)} ({info.change >= 0 ? "+" : ""}
                        {info.change.toFixed(1)}%)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
