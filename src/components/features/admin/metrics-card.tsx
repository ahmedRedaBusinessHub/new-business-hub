"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

interface MetricsCardProps {
    title: string;
    value: string | number;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    icon?: React.ElementType;
    loading?: boolean;
}

export function MetricsCard({
    title,
    value,
    description,
    trend,
    icon: Icon,
    loading,
}: MetricsCardProps) {
    if (loading) {
        return (
            <Card className="animate-pulse">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-4 w-4 bg-muted rounded" />
                </CardHeader>
                <CardContent>
                    <div className="h-8 w-16 bg-muted rounded mb-2" />
                    <div className="h-3 w-32 bg-muted rounded" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {(description || trend) && (
                    <div className="flex items-center gap-2 mt-1">
                        {trend && (
                            <span
                                className={cn(
                                    "flex items-center text-xs font-semibold",
                                    trend.isPositive ? "text-green-600" : "text-red-600"
                                )}
                            >
                                {trend.isPositive ? (
                                    <ArrowUpIcon className="h-3 w-3 mr-0.5" />
                                ) : (
                                    <ArrowDownIcon className="h-3 w-3 mr-0.5" />
                                )}
                                {Math.abs(trend.value)}%
                            </span>
                        )}
                        {description && (
                            <p className="text-xs text-muted-foreground">{description}</p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
