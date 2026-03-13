"use client";

import { useTranslations } from "next-intl";
import { formatCurrency, cn } from "@/lib/utils";
import {
  Clock,
  Calendar,
  CalendarDays,
  CalendarRange,
  SaudiRiyal,
} from "lucide-react";
interface PricingTableProps {
  hourlyRate?: number;
  dailyRate?: number;
  weeklyRate?: number;
  monthlyRate?: number;
}

export function PricingTable({
  hourlyRate,
  dailyRate,
  weeklyRate,
  monthlyRate,
}: PricingTableProps) {
  const t = useTranslations();

  const tiers = [
    {
      label: t("space_pricing_hourly"),
      price: hourlyRate,
      key: "hourly",
      icon: Clock,
      desc: t("space_pricing_hourly_desc") || "Flexible access",
      dailyValue: hourlyRate ? hourlyRate * 24 : Infinity,
    },
    {
      label: t("space_pricing_daily"),
      price: dailyRate,
      key: "daily",
      icon: Calendar,
      desc: t("space_pricing_daily_desc") || "Full day focus",
      dailyValue: dailyRate || Infinity,
    },
    {
      label: t("space_pricing_weekly"),
      price: weeklyRate,
      key: "weekly",
      icon: CalendarDays,
      desc: t("space_pricing_weekly_desc") || "Working week",
      dailyValue: weeklyRate ? weeklyRate / 7 : Infinity,
    },
    {
      label: t("space_pricing_monthly"),
      price: monthlyRate,
      key: "monthly",
      icon: CalendarRange,
      desc: t("space_pricing_monthly_desc") || "Full month",
      dailyValue: monthlyRate ? monthlyRate / 30 : Infinity,
    },
  ].filter(
    (tier) => tier.price !== undefined && tier.price !== null && tier.price > 0,
  );

  const bestValueTier = tiers.reduce(
    (best, current) => (current.dailyValue < best.dailyValue ? current : best),
    tiers[0],
  );

  if (tiers.length === 0) {
    return (
      <div className="p-8 bg-muted/30 rounded-2xl text-center text-muted-foreground border-2 border-dashed">
        {t("space_pricing_unavailable") ||
          "Pricing plans are currently unavailable for this space."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold tracking-tight">
          {t("space_pricing_title") || "Flexible Pricing"}
        </h3>
        <span className="text-sm text-muted-foreground px-4 py-1.5 bg-secondary/50 rounded-full font-bold tracking-tight">
          {t("space_pricing_best_value") || "Best Value Options"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          const isBestValue =
            tier.key === bestValueTier.key && tiers.length > 1;

          return (
            <div
              key={tier.key}
              className={cn(
                "group relative flex flex-col p-6 rounded-2xl bg-card border shadow-sm transition-all duration-300",
                isBestValue
                  ? "border-primary/50 shadow-md ring-1 ring-primary/20"
                  : "hover:border-primary/30 hover:shadow-md",
              )}
            >
              {isBestValue && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg z-10">
                  {t("space_pricing_best_value_label") || "Best Value"}
                </div>
              )}

              <div className="absolute top-4 right-4 text-muted-foreground/30 group-hover:text-primary/30 transition-colors">
                <Icon size={24} />
              </div>

              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                {tier.label}
              </span>

              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-1">
                  {tier.price} <SaudiRiyal />
                </span>
              </div>

              <p className="text-xs text-muted-foreground mt-4 font-medium italic">
                {tier.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
