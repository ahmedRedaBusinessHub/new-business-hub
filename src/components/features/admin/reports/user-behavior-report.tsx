"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import type { UserBehaviorAnalytics } from "@/types/api/reports";

interface UserBehaviorReportProps {
  data: UserBehaviorAnalytics;
}

export function UserBehaviorReport({ data }: UserBehaviorReportProps) {
  const locale = useLocale();
  const t = useTranslations("reports_user_behavior");
  const isRTL = locale === "ar";

  const formatRevenue = (value: number) =>
    formatCurrency(value, locale === "ar" ? "ar-SA" : "en-US");

  const returningUserPercentage = (100 - data.new_user_percentage).toFixed(1);

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("kpi_total_users")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total_users}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("kpi_new_users")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.new_users}</div>
            <div className="text-sm text-muted-foreground">
              {data.new_user_percentage.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("kpi_returning_users")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.returning_users}</div>
            <div className="text-sm text-muted-foreground">
              {returningUserPercentage}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("kpi_avg_bookings_user")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.avg_bookings_per_user.toFixed(1)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("kpi_avg_revenue_user")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatRevenue(data.avg_revenue_per_user)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("tenant_metrics")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <div>
              <div className="text-sm text-muted-foreground">
                {t("kpi_tenant_users")}
              </div>
              <div className="text-2xl font-bold">{data.tenant_users}</div>
              <div className="text-sm text-muted-foreground">
                {data.tenant_user_percentage.toFixed(1)}%
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground">
                {t("kpi_avg_bookings_tenant")}
              </div>
              <div className="text-2xl font-bold">
                {data.avg_bookings_per_tenant.toFixed(1)}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground">
                {t("kpi_tenant_booking_pct")}
              </div>
              <div className="text-2xl font-bold">
                {data.tenant_booking_percentage.toFixed(1)}%
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground">
                {t("kpi_tenant_revenue")}
              </div>
              <div className="text-2xl font-bold">
                {formatRevenue(data.tenant_revenue)}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground">
                {t("kpi_tenant_revenue_pct")}
              </div>
              <div className="text-2xl font-bold">
                {data.tenant_revenue_percentage.toFixed(1)}%
              </div>
            </div>

            <div />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("top_users_bookings")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left font-medium">
                      {t("col_name")}
                    </th>
                    <th className="pb-3 text-left font-medium">
                      {t("col_email")}
                    </th>
                    <th className="pb-3 text-right font-medium">
                      {t("col_bookings")}
                    </th>
                    <th className="pb-3 text-right font-medium">
                      {t("col_revenue")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.top_users.map((user, index) => (
                    <tr key={user.user_id} className="border-b">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{index + 1}</Badge>
                          {user.name}
                        </div>
                      </td>
                      <td className="py-3">{user.email}</td>
                      <td className="py-3 text-right">{user.bookings}</td>
                      <td className="py-3 text-right">
                        {formatRevenue(user.revenue)}
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
            <CardTitle>{t("top_users_revenue")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left font-medium">
                      {t("col_name")}
                    </th>
                    <th className="pb-3 text-left font-medium">
                      {t("col_email")}
                    </th>
                    <th className="pb-3 text-right font-medium">
                      {t("col_bookings")}
                    </th>
                    <th className="pb-3 text-right font-medium">
                      {t("col_revenue")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.top_users_by_revenue?.map((user, index) => (
                    <tr key={user.user_id} className="border-b">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{index + 1}</Badge>
                          {user.name}
                        </div>
                      </td>
                      <td className="py-3">{user.email}</td>
                      <td className="py-3 text-right">{user.bookings}</td>
                      <td className="py-3 text-right">
                        {formatRevenue(user.revenue)}
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
          <CardTitle>{t("summary_title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div className="text-sm text-muted-foreground">
                {t("most_booked_space_type")}
              </div>
              <div className="text-lg font-semibold">
                {data.most_booked_space_type}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                {t("most_used_pricing_tier")}
              </div>
              <div className="text-lg font-semibold">
                {data.most_used_pricing_tier}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
