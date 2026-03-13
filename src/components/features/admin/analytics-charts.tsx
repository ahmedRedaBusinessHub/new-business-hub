"use client";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend,
    BarChart,
    Bar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { BookingTrend, RevenueBreakdown, UtilizationData } from "@/types/api/analytics";

interface TrendsChartProps {
    data: BookingTrend[];
    title: string;
    loading?: boolean;
}

export function TrendsChart({ data, title, loading }: TrendsChartProps) {
    if (loading) {
        return (
            <Card className="h-[400px] animate-pulse">
                <CardHeader>
                    <div className="h-6 w-32 bg-muted rounded" />
                </CardHeader>
                <CardContent className="h-full">
                    <div className="h-full w-full bg-muted rounded" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-[400px]">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis
                                dataKey="date"
                                stroke="#64748B"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#64748B"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `SAR ${value}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#FFFFFF",
                                    border: "1px solid #E2E8F0",
                                    borderRadius: "8px",
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#8884d8"
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

interface RevenuePieChartProps {
    data: RevenueBreakdown[];
    title: string;
    loading?: boolean;
}

export function RevenuePieChart({ data, title, loading }: RevenuePieChartProps) {
    if (loading) {
        return (
            <Card className="h-[400px]">
                <CardHeader>
                    <div className="h-5 w-40 animate-pulse rounded bg-muted" />
                </CardHeader>
                <CardContent className="flex h-[300px] items-center justify-center">
                    <div className="h-40 w-40 animate-pulse rounded-full bg-muted" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-[400px]">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                nameKey="category"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

interface UtilizationChartProps {
    data: UtilizationData[];
    title: string;
}

export function UtilizationChart({ data, title }: UtilizationChartProps) {
    return (
        <Card className="h-[400px]">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip />
                            <Bar dataKey="utilization" fill="#00C49F" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
