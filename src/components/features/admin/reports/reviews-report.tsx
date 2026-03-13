"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { VisualStarRating } from "@/components/ui/visual-star-rating";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import type { BookingReviewReport } from "@/types/api/reports";

interface ReviewsReportProps {
  data: BookingReviewReport;
  onSpaceFilterChange?: (spaceId: number | null) => void;
  onMinRatingChange?: (rating: number | null) => void;
  onMaxRatingChange?: (rating: number | null) => void;
}

export function ReviewsReport({
  data,
  onSpaceFilterChange,
  onMinRatingChange,
  onMaxRatingChange,
}: ReviewsReportProps) {
  const locale = useLocale();
  const t = useTranslations("reports_reviews");
  const isRTL = locale === "ar";

  const getSpaceName = (nameEn: string, nameAr: string) => {
    return locale === "ar" ? nameAr : nameEn;
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US");
  };

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Aggregate Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold">
              {data.avg_rating_overall.toFixed(1)}
            </div>
            <VisualStarRating rating={Math.round(data.avg_rating_overall)} size="lg" />
            <div className="text-sm text-muted-foreground">
              {t("kpi_avg_rating_overall")}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4">{t("per_space_ratings")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.spaces.map((space) => (
                <Card key={space.space_id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      {getSpaceName(space.space_name_en, space.space_name_ar)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <VisualStarRating rating={Math.round(space.avg_rating)} />
                      <span className="font-semibold">
                        {space.avg_rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("total_reviews")}: {space.total_reviews}
                    </div>
                    <div className="space-y-1">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div
                          key={star}
                          className="flex items-center gap-2 text-xs"
                        >
                          <div className="w-2 h-2">★</div>
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-yellow-500 h-full"
                              style={{
                                width:
                                  space.total_reviews > 0
                                    ? `${(space.rating_distribution[star.toString()] / space.total_reviews) * 100}%`
                                    : "0%",
                              }}
                            />
                          </div>
                          <div className="w-8 text-right">
                            {space.rating_distribution[star.toString()]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review Listing Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t("reviews_list")}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-1">
                {t("filter_by_space")}
              </label>
              <Select
                onValueChange={(value) =>
                  onSpaceFilterChange?.(value ? Number(value) : null)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("all_spaces")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("all_spaces")}</SelectItem>
                  {data.spaces.map((space) => (
                    <SelectItem key={space.space_id} value={space.space_id.toString()}>
                      {getSpaceName(space.space_name_en, space.space_name_ar)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-40">
              <label className="block text-sm font-medium mb-1">
                {t("min_rating")}
              </label>
              <Select
                onValueChange={(value) =>
                  onMinRatingChange?.(value ? Number(value) : null)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("any")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("any")}</SelectItem>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating} ★
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-40">
              <label className="block text-sm font-medium mb-1">
                {t("max_rating")}
              </label>
              <Select
                onValueChange={(value) =>
                  onMaxRatingChange?.(value ? Number(value) : null)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("any")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("any")}</SelectItem>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating} ★
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reviews Table */}
          {data.reviews.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                        {t("col_user_name")}
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                        {t("col_user_email")}
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                        {t("col_space_name")}
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                        {t("col_branch")}
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                        {t("col_rating")}
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                        {t("col_comment")}
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-start">
                        {t("col_date")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.reviews.map((review) => (
                      <tr
                        key={review.id}
                        className="border-b border-gray-200 dark:border-gray-700"
                      >
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                          {review.user_name}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                          {review.user_email}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                          {getSpaceName(review.space_name_en, review.space_name_ar)}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                          {getSpaceName(review.branch_name_en, review.branch_name_ar)}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                          <VisualStarRating rating={review.rating} size="sm" />
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 max-w-xs">
                          {review.comment
                            ? review.comment.length > 100
                              ? `${review.comment.substring(0, 100)}...`
                              : review.comment
                            : t("no_comment")}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3">
                          {review.created_at ? formatDate(review.created_at) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data.pagination.total_pages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {t("page", {
                      current: data.pagination.page,
                      total: data.pagination.total_pages,
                    })}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">{t("empty_state")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
