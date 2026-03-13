"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import {
    CurrencyDollarIcon,
    CalendarDaysIcon,
    UserGroupIcon,
    ChartBarIcon,
    ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

import { useAnalyticsOverview, useBookingTrends, useUtilization, useRevenueBreakdown } from "@/lib/hooks/use-analytics";
import { MetricsCard } from "@/components/features/admin/metrics-card";
import dynamic from "next/dynamic";
const TrendsChart = dynamic(() => import("@/components/features/admin/analytics-charts").then(mod => mod.TrendsChart), { ssr: false });
const UtilizationChart = dynamic(() => import("@/components/features/admin/analytics-charts").then(mod => mod.UtilizationChart), { ssr: false });
const RevenuePieChart = dynamic(() => import("@/components/features/admin/analytics-charts").then(mod => mod.RevenuePieChart), { ssr: false });
import { DateRangePicker } from "@/components/features/admin/date-range-picker";
import { Button } from "@/components/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/Dropdown-menu";
import { exportToCsv, exportToPdf } from "@/lib/utils/export";

export default function AnalyticsPage() {
    const t = useTranslations();
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        to: new Date(),
    });

    const filters = React.useMemo(() => ({
        start_date: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
        end_date: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
    }), [dateRange]);

    const { data: overview, isLoading: isOverviewLoading } = useAnalyticsOverview(filters);
    const { data: trends, isLoading: isTrendsLoading } = useBookingTrends(filters);
    const { data: utilization, isLoading: isUtilizationLoading } = useUtilization(filters);
    const { data: revenueBreakdown, isLoading: isRevenueBreakdownLoading } = useRevenueBreakdown(filters);

    const reportFilename = `analytics_report_${filters.start_date}_${filters.end_date}`;

    const handleExportCsv = () => {
        if (trends) {
            exportToCsv(reportFilename, trends);
        }
    };

    const handleExportPdf = () => {
        if (trends) {
            exportToPdf(reportFilename, trends, t("analytics_overview_title"));
        }
    };

    return (
        <div className="flex flex-col gap-8 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {t("analytics_overview_title")}
                    </h1>
                    <p className="text-muted-foreground">
                        {t("analytics_date_range")}: {filters.start_date || "..."} - {filters.end_date || "..."}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <DateRangePicker value={dateRange} onChange={setDateRange} />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
                                {t("analytics_export_cta")}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleExportCsv}>
                                {t("analytics_export_csv")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportPdf}>
                                {t("analytics_export_pdf")}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricsCard
                    title={t("analytics_revenue_label")}
                    value={overview?.total_revenue ? `SAR ${overview.total_revenue.toLocaleString()}` : "SAR 0"}
                    trend={{ value: overview?.revenue_growth || 0, isPositive: (overview?.revenue_growth || 0) >= 0 }}
                    icon={CurrencyDollarIcon}
                    loading={isOverviewLoading}
                />
                <MetricsCard
                    title={t("analytics_bookings_label")}
                    value={overview?.total_bookings || 0}
                    trend={{ value: overview?.bookings_growth || 0, isPositive: (overview?.bookings_growth || 0) >= 0 }}
                    icon={CalendarDaysIcon}
                    loading={isOverviewLoading}
                />
                <MetricsCard
                    title={t("analytics_active_users_label")}
                    value={overview?.active_users || 0}
                    trend={{ value: overview?.users_growth || 0, isPositive: (overview?.users_growth || 0) >= 0 }}
                    icon={UserGroupIcon}
                    loading={isOverviewLoading}
                />
                <MetricsCard
                    title={t("analytics_utilization_label")}
                    value={overview?.utilization_rate ? `${overview.utilization_rate}%` : "0%"}
                    trend={{ value: overview?.utilization_growth || 0, isPositive: (overview?.utilization_growth || 0) >= 0 }}
                    icon={ChartBarIcon}
                    loading={isOverviewLoading}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="lg:col-span-4">
                    <TrendsChart
                        data={trends || []}
                        title={t("analytics_revenue_trends")}
                        loading={isTrendsLoading}
                    />
                </div>
                <div className="lg:col-span-3">
                    <RevenuePieChart
                        data={revenueBreakdown || []}
                        title={t("analytics_revenue_breakdown")}
                        loading={isRevenueBreakdownLoading}
                    />
                </div>
            </div>

            <div className="grid gap-6">
                <UtilizationChart
                    data={utilization || []}
                    title={t("analytics_utilization_by_branch")}
                />
            </div>
        </div>
    );
}
