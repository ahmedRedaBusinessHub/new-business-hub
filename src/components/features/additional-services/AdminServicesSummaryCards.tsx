"use client";

import { useTranslations } from "next-intl";
import {
  CalendarDaysIcon,
  ClockIcon,
  CurrencyDollarIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { useAdminServicesSummary } from "@/lib/hooks/use-admin-additional-services";
import { MetricsCard } from "@/components/features/admin/metrics-card";

export function AdminServicesSummaryCards() {
  const t = useTranslations();
  const { data, isLoading }: any = useAdminServicesSummary();

  const summary = data?.data || {
    total_bookings_today: 0,
    pending_bookings: 0,
    revenue_this_month: "0",
    top_service: null,
  };

  const formatCurrency = (value: string): string => {
    const num = parseFloat(value);
    return `SAR ${num.toFixed(2)}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricsCard
        title={t("bookings_today")}
        value={summary.total_bookings_today}
        icon={CalendarDaysIcon}
        loading={isLoading}
      />
      <MetricsCard
        title={t("pending_bookings")}
        value={summary.pending_bookings}
        icon={ClockIcon}
        loading={isLoading}
        description={
          summary.pending_bookings > 0 ? t("requires_attention") : undefined
        }
      />
      <MetricsCard
        title={t("revenue_this_month")}
        value={formatCurrency(summary.revenue_this_month)}
        icon={CurrencyDollarIcon}
        loading={isLoading}
      />
      <MetricsCard
        title={t("top_service")}
        value={
          summary.top_service
            ? `${summary.top_service.name_ar || summary.top_service.name_en} (${summary.top_service.booking_count})`
            : t("no_data")
        }
        icon={StarIcon}
        loading={isLoading}
      />
    </div>
  );
}
