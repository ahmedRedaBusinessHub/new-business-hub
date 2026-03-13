"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardContent } from "@/components/ui/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useReviews } from "@/lib/hooks/use-reports";
import { ReviewsReport } from "@/components/features/admin/reports/reviews-report";
import { exportToCsv, exportToPdf } from "@/lib/utils/export";
import type { ReportFilter } from "@/types/api/reports";

export default function ReviewsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations();

  const filter: ReportFilter & {
    user_id?: number;
    min_rating?: number;
    max_rating?: number;
    page?: number;
  } = {
    start_date: searchParams.get("start_date") || undefined,
    end_date: searchParams.get("end_date") || undefined,
    branch_id: searchParams.get("branch_id")
      ? Number(searchParams.get("branch_id"))
      : undefined,
    coworking_space_id: searchParams.get("coworking_space_id")
      ? Number(searchParams.get("coworking_space_id"))
      : undefined,
    user_id: searchParams.get("user_id")
      ? Number(searchParams.get("user_id"))
      : undefined,
    min_rating: searchParams.get("min_rating")
      ? Number(searchParams.get("min_rating"))
      : undefined,
    max_rating: searchParams.get("max_rating")
      ? Number(searchParams.get("max_rating"))
      : undefined,
    page: searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1,
  };

  const { data, isLoading, isError, error } = useReviews(filter);

  const handleSpaceFilterChange = React.useCallback((spaceId: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (spaceId === null) {
      params.delete("coworking_space_id");
    } else {
      params.set("coworking_space_id", spaceId.toString());
    }
    params.delete("page");
    router.replace(`?${params.toString()}`);
  }, [searchParams, router]);

  const handleMinRatingChange = React.useCallback((rating: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (rating === null) {
      params.delete("min_rating");
    } else {
      params.set("min_rating", rating.toString());
    }
    params.delete("page");
    router.replace(`?${params.toString()}`);
  }, [searchParams, router]);

  const handleMaxRatingChange = React.useCallback((rating: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (rating === null) {
      params.delete("max_rating");
    } else {
      params.set("max_rating", rating.toString());
    }
    params.delete("page");
    router.replace(`?${params.toString()}`);
  }, [searchParams, router]);

  const handlePageChange = React.useCallback((newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.replace(`?${params.toString()}`);
  }, [searchParams, router]);

  const buildFlatExportRows = React.useCallback(() => {
    if (!data || !data.reviews || data.reviews.length === 0) return [];

    return data.reviews.map((review) => ({
      review_id: review.id,
      booking_id: review.booking_id,
      space_name: review.space_name_en,
      branch_name: review.branch_name_en,
      user_name: review.user_name,
      user_email: review.user_email,
      rating: review.rating,
      comment: review.comment || "",
      created_at: new Date(review.created_at).toISOString(),
    }));
  }, [data]);

  const handleExportCsv = React.useCallback(() => {
    const rows = buildFlatExportRows();
    if (rows.length === 0) return;
    exportToCsv("booking-reviews", rows);
  }, [buildFlatExportRows]);

  const handleExportPdf = React.useCallback(() => {
    const rows = buildFlatExportRows();
    if (rows.length === 0) return;
    exportToPdf("booking-reviews", rows, t("reports_reviews.title"));
  }, [buildFlatExportRows, t]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="mt-4 h-10 w-3/4" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="mt-4 h-10 w-3/4" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="mt-4 h-10 w-3/4" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="mt-4 h-10 w-3/4" />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-destructive">{t("reports.error_loading")}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {(error as Error)?.message}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.total_reviews === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              {t("reports_reviews.empty_state")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("reports_reviews.title")}</h1>
          <p className="text-muted-foreground">{t("reports_reviews.subtitle")}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center h-9 px-4 py-2 text-sm">
            <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
            {t("reports.export")}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleExportCsv}>
              {t("reports.export_csv")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportPdf}>
              {t("reports.export_pdf")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ReviewsReport
        data={data}
        onSpaceFilterChange={handleSpaceFilterChange}
        onMinRatingChange={handleMinRatingChange}
        onMaxRatingChange={handleMaxRatingChange}
      />
      {data.pagination.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(data.pagination.page - 1)}
            disabled={data.pagination.page === 1}
            className="px-4 py-2 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("previous")}
          </button>
          <span className="text-sm">
            {t("reports.page_info", {
              current: data.pagination.page,
              total: data.pagination.total_pages,
            })}
          </span>
          <button
            onClick={() => handlePageChange(data.pagination.page + 1)}
            disabled={data.pagination.page === data.pagination.total_pages}
            className="px-4 py-2 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("next")}
          </button>
        </div>
      )}
    </div>
  );
}
