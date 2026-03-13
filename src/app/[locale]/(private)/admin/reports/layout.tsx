"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Suspense } from "react";
import { ReportFilterBar } from "@/components/features/admin/reports/report-filter-bar";

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const locale = useLocale();
  const isRTL = locale === "ar";

  const showGranularity = pathname.includes("/trends");

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <Suspense fallback={<div className="h-32 animate-pulse bg-muted rounded-lg" />}>
        <ReportFilterBar showGranularity={showGranularity} />
      </Suspense>
      <div className="mt-6">{children}</div>
    </div>
  );
}
