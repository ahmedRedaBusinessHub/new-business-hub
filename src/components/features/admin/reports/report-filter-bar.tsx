"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { DateRange } from "react-day-picker";
import { differenceInDays } from "date-fns";

import { DateRangePicker } from "../date-range-picker";
import { SelectRoot, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { fetchBranches } from "@/lib/api/branches";
import { fetchSpaces } from "@/lib/api/spaces";
import type { Branch } from "@/types/api/branches";
import type { SpaceListItem } from "@/types/api/spaces";

interface ReportFilterBarProps {
  showGranularity?: boolean;
}

export function ReportFilterBar({ showGranularity = false }: ReportFilterBarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations();

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(() => {
    const from = searchParams.get("start_date");
    const to = searchParams.get("end_date");
    if (from && to) {
      return { from: new Date(from), to: new Date(to) };
    }
    return undefined;
  });

  const [dateRangeError, setDateRangeError] = React.useState<string | null>(null);

  const { data: branchesData } = useQuery({
    queryKey: ["branches-for-reports"],
    queryFn: () => fetchBranches({}, 1, 1000),
  });

  const { data: spacesData } = useQuery({
    queryKey: ["spaces-for-reports", searchParams.get("branch_id")],
    queryFn: () => fetchSpaces({ branch_id: searchParams.get("branch_id") ? Number(searchParams.get("branch_id")) : undefined }, 1, 1000),
    enabled: !!searchParams.get("branch_id"),
  });

  const updateUrlParams = React.useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const handleDateRangeChange = React.useCallback((range: DateRange | undefined) => {
    if (!range || !range.from || !range.to) {
      setDateRange(undefined);
      updateUrlParams({ start_date: null, end_date: null });
      setDateRangeError(null);
      return;
    }

    const daysDiff = differenceInDays(range.to, range.from);
    if (daysDiff > 730) {
      setDateRangeError("Date range cannot exceed 2 years (730 days)");
      return;
    }

    setDateRangeError(null);
    setDateRange(range);
    updateUrlParams({
      start_date: range.from.toISOString().split("T")[0],
      end_date: range.to.toISOString().split("T")[0],
    });
  }, [updateUrlParams]);

  const handleBranchChange = React.useCallback((value: string) => {
    updateUrlParams({ 
      branch_id: value === "all" ? null : value,
      coworking_space_id: null,
    });
  }, [updateUrlParams]);

  const handleSpaceChange = React.useCallback((value: string) => {
    updateUrlParams({ coworking_space_id: value === "all" ? null : value });
  }, [updateUrlParams]);

  const handleGranularityChange = React.useCallback((value: string) => {
    updateUrlParams({ granularity: value === "daily" ? null : value });
  }, [updateUrlParams]);

  const branches = branchesData?.data || [];
  const spaces = spacesData?.data || [];

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">{t("reports.date_range") || "Date Range"}</label>
        <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
        {dateRangeError && (
          <p className="text-sm text-destructive">{dateRangeError}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">{t("reports.branch") || "Branch"}</label>
        <SelectRoot
          value={searchParams.get("branch_id") || "all"}
          onValueChange={handleBranchChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t("reports.all_branches") || "All Branches"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("reports.all_branches") || "All Branches"}</SelectItem>
            {branches.map((branch: Branch) => (
              <SelectItem key={branch.id} value={String(branch.id)}>
                {branch.name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      </div>

      {searchParams.get("branch_id") && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">{t("reports.space") || "Space"}</label>
          <SelectRoot
            value={searchParams.get("coworking_space_id") || "all"}
            onValueChange={handleSpaceChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t("reports.all_spaces") || "All Spaces"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("reports.all_spaces") || "All Spaces"}</SelectItem>
              {spaces.map((space: SpaceListItem) => (
                <SelectItem key={space.id} value={String(space.id)}>
                  {space.name_en}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        </div>
      )}

      {showGranularity && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">{t("reports.granularity") || "Granularity"}</label>
          <SelectRoot
            value={searchParams.get("granularity") || "daily"}
            onValueChange={handleGranularityChange}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">{t("reports.daily") || "Daily"}</SelectItem>
              <SelectItem value="weekly">{t("reports.weekly") || "Weekly"}</SelectItem>
              <SelectItem value="monthly">{t("reports.monthly") || "Monthly"}</SelectItem>
            </SelectContent>
          </SelectRoot>
        </div>
      )}
    </div>
  );
}
