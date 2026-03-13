"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/Chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Label } from "recharts";
import { formatCurrency, cn } from "@/lib/utils";
import type { BookingStatistics } from "@/types/api/reports";
import {
  CalendarCheck,
  CreditCard,
  TrendingUp,
  Clock,
  XCircle,
  Users,
  Activity,
  ArrowUpRight,
  LayoutDashboard,
  PieChart as PieIcon,
  BarChart3,
  Layers,
} from "lucide-react";

interface StatisticsReportProps {
  data: BookingStatistics;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const STATUS_COLORS: Record<string, string> = {
  pending: "hsl(var(--warning))",
  confirmed: "hsl(var(--chart-2))",
  completed: "hsl(var(--success))",
  cancelled: "hsl(var(--destructive))",
};

export function StatisticsReport({ data }: StatisticsReportProps) {
  const locale = useLocale();
  const t = useTranslations("reports_statistics");
  const isRTL = locale === "ar";

  const formatRevenue = (value: number) =>
    formatCurrency(value, locale === "ar" ? "ar-SA" : "en-US");

  const statusLabel = (status: string) => {
    const key = `status_${status}` as any;
    try {
      return t(key);
    } catch {
      return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const tierLabel = (tier: string) => {
    const key = `pricing_tier_${tier}` as any;
    try {
      return t(key);
    } catch {
      return tier.charAt(0).toUpperCase() + tier.slice(1);
    }
  };

  // Status Chart Data
  const statusData = Object.entries(data.by_status).map(([status, info]) => ({
    name: statusLabel(status),
    value: info.count,
    fill: STATUS_COLORS[status] || COLORS[0],
    originalStatus: status,
  }));

  // Pricing Tier Data - Cleaned up for a grid
  const tierArray = Object.entries(data.by_pricing_tier).map(([tier, info]) => ({
    label: tierLabel(tier),
    count: info.count,
    revenue: info.revenue,
    avg: info.avg_duration,
    key: tier,
  }));

  // Space Type Data - Bar Chart is better here
  const spaceTypeData = Object.entries(data.by_space_type)
    .map(([type, info]) => ({
      name: type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      count: info.count,
      revenue: info.revenue,
    }))
    .sort((a, b) => b.count - a.count);

  const statusConfig = {
    value: {
      label: t("col_count"),
    },
    ...Object.fromEntries(
      statusData.map((item, idx) => [
        item.originalStatus,
        { label: item.name, color: item.fill },
      ])
    ),
  };

  const spaceTypeConfig = {
    count: {
      label: t("col_count"),
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="space-y-10" dir={isRTL ? "rtl" : "ltr"}>
      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPIItem
          title={t("kpi_total_bookings")}
          value={data.total_bookings}
          icon={CalendarCheck}
          delay={0}
          gradient="from-blue-500/10 to-transparent"
          iconColor="text-blue-500"
        />
        <KPIItem
          title={t("kpi_total_revenue")}
          value={formatRevenue(data.total_revenue_sar)}
          icon={CreditCard}
          delay={0.1}
          gradient="from-emerald-500/10 to-transparent"
          iconColor="text-emerald-500"
        />
        <KPIItem
          title={t("kpi_avg_revenue")}
          value={formatRevenue(data.avg_revenue_per_booking)}
          icon={TrendingUp}
          delay={0.2}
          gradient="from-indigo-500/10 to-transparent"
          iconColor="text-indigo-500"
        />
        <KPIItem
          title={t("kpi_avg_duration")}
          value={`${(data.avg_duration_hours ?? 0).toFixed(1)}h`}
          icon={Clock}
          delay={0.3}
          gradient="from-amber-500/10 to-transparent"
          iconColor="text-amber-500"
        />
      </div>

      {/* Main Distribution Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Status Donut - Focal Point */}
        <Card className="col-span-1 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group">
          <CardHeader className="pb-0">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-primary" />
              <CardTitle className="text-base font-semibold">{t("breakdown_by_status")}</CardTitle>
            </div>
            <CardDescription>Booking status distribution</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[280px] w-full relative">
              <ChartContainer
                config={statusConfig}
                className="mx-auto aspect-square h-full"
              >
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={90}
                    strokeWidth={2}
                    paddingAngle={5}
                  >
                    <Label
                      content={({ viewBox }: any) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold"
                              >
                                {data.total_bookings}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground text-xs"
                              >
                                {t("kpi_total_bookings")}
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                </PieChart>
              </ChartContainer>
            </div>
            {/* Legend as Clean Pills */}
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 px-2 py-1 bg-muted/30 rounded-full text-[10px] font-medium border border-border/50">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span>{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Space Type Horizontal Chart */}
        <Card className="col-span-1 lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <CardTitle className="text-base font-semibold">{t("breakdown_by_space_type")}</CardTitle>
            </div>
            <CardDescription>Performance by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              <ChartContainer
                config={spaceTypeConfig}
                className="h-full w-full"
              >
                <BarChart
                  data={spaceTypeData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    width={100}
                    className="text-[10px] font-medium"
                  />
                  <ChartTooltip
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                    content={<ChartTooltipContent />}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  >
                    {spaceTypeData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Retention/Safety Metrics */}
        <div className="lg:col-span-1 space-y-4">
          <SecondaryMetric
            title={t("kpi_cancellation_rate")}
            value={`${(data.cancellation_rate ?? 0).toFixed(1)}%`}
            icon={XCircle}
            color="rose"
          />
          <SecondaryMetric
            title={t("kpi_unique_users")}
            value={data.unique_users}
            icon={Users}
            color="violet"
          />
          <SecondaryMetric
            title={t("kpi_avg_bookings_user")}
            value={(data.avg_bookings_per_user ?? 0).toFixed(2)}
            icon={Activity}
            color="cyan"
          />
        </div>

        {/* Pricing Tiers Detailed View */}
        <Card className="lg:col-span-3 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <CardTitle className="text-base font-semibold">{t("breakdown_by_pricing_tier")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tierArray.map((tier, idx) => (
                <motion.div
                  key={tier.key}
                  whileHover={{ y: -2 }}
                  className="p-4 rounded-xl border border-border/50 bg-background/30 flex flex-col justify-between group transition-colors hover:bg-background/60"
                >
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{tier.label}</span>
                    <h4 className="text-xl font-bold mt-1">{tier.count} <span className="text-[10px] text-muted-foreground font-normal">pts</span></h4>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/30">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-muted-foreground">Revenue</span>
                      <span className="font-semibold text-emerald-500">{formatRevenue(tier.revenue)}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">Avg. Stay</span>
                      <span className="font-semibold">{tier.avg.toFixed(1)}h</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KPIItem({ title, value, icon: Icon, delay, gradient, iconColor }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02 }}
      className="relative group"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl opacity-50 transition-opacity group-hover:opacity-100`} />
      <Card className="relative h-full border-border/40 shadow-sm transition-all group-hover:shadow-md bg-transparent backdrop-blur-[2px]">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
              <h3 className="text-2xl font-extrabold tracking-tight group-hover:text-primary transition-colors">
                {value}
              </h3>
            </div>
            <div className={cn("p-2 rounded-lg bg-background/80 shadow-xs border border-border/20", iconColor)}>
              <Icon size={18} strokeWidth={2.5} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-[10px] text-muted-foreground font-medium">
            <TrendingUp size={10} className="mr-1 text-emerald-500" />
            <span className="text-emerald-500 mr-1">+0%</span> since last period
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SecondaryMetric({ title, value, icon: Icon, color }: any) {
  const colorMap: any = {
    rose: "bg-rose-500/10 text-rose-500",
    violet: "bg-violet-500/10 text-violet-500",
    cyan: "bg-cyan-500/10 text-cyan-500",
  };

  return (
    <div className="flex items-center gap-4 p-3 rounded-xl border border-border/40 bg-card/30 hover:bg-card/60 transition-colors group">
      <div className={cn("p-2.5 rounded-lg shrink-0", colorMap[color])}>
        <Icon size={16} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{title}</p>
        <p className="text-lg font-bold group-hover:text-primary transition-colors leading-tight">{value}</p>
      </div>
    </div>
  );
}


