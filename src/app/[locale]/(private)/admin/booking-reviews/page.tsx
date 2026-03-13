"use client";

import { useState, useEffect } from "react";
import { useAdminReviews, useReviewById } from "@/lib/hooks/use-reviews";
import { useBranches } from "@/lib/hooks/use-branches";
import { ReviewsTable } from "@/components/admin/booking-reviews-table";
import { ReviewDetailPanel } from "@/components/admin/review-detail-panel";
import { ReviewFilters } from "@/components/admin/review-filters";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/Button";

export default function AdminBookingReviewsPage() {
  const t = useTranslations();
  const rawLocale = useLocale();
  const locale = rawLocale.startsWith("ar") ? "ar" : "en";

  // Filter states
  const [branchId, setBranchId] = useState<number | undefined>(undefined);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [dateFrom, setDateFrom] = useState<string | undefined>(undefined);
  const [dateTo, setDateTo] = useState<string | undefined>(undefined);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Review detail states
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  // Fetch branches for filter
  const { data: branchesData, isLoading: branchesLoading } = useBranches();
  const availableBranches = branchesData?.data || [];

  // Fetch reviews with filters and pagination
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    error: reviewsError,
    refetch,
  } = useAdminReviews({
    branch_id: branchId,
    min_rating: minRating,
    date_from: dateFrom,
    date_to: dateTo,
    page: currentPage,
    limit: itemsPerPage,
  });

  // Fetch selected review details
  const { data: selectedReview, isLoading: detailLoading } =
    useReviewById(selectedReviewId);

  const getBranchName = (branch: any): string => {
    if (locale === "ar") return branch.name_ar || branch.name_en || "Unknown";
    return branch.name_en || branch.name_ar || "Unknown";
  };

  const mappedBranches = availableBranches.map((b: any) => ({
    id: b.id,
    name: getBranchName(b),
  }));

  // Reset to page 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [branchId, minRating, dateFrom, dateTo]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1);
  };

  const handleViewDetails = (reviewId: number) => {
    setSelectedReviewId(reviewId);
  };

  const handleCloseDetail = () => {
    setSelectedReviewId(null);
  };

  const totalPages = Math.ceil((reviewsData?.data?.total || 0) / itemsPerPage);

  if (reviewsError) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 text-center py-20">
          <h2 className="text-2xl font-bold mb-4">
            {t("error_loading_reviews", {
              defaultMessage: "Failed to load reviews",
            })}
          </h2>
          <Button onClick={() => refetch()}>
            {t("retry", { defaultMessage: "Retry" })}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-2">
          {t("admin_reviews_title", { defaultMessage: "Booking Reviews" })}
        </h1>
        <p className="text-muted-foreground mb-6">
          {t("admin_reviews_subtitle", {
            defaultMessage: "View and manage all customer reviews",
          })}
        </p>

        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-background rounded-lg border p-4">
            <ReviewFilters
              branchId={branchId}
              setBranchId={setBranchId}
              minRating={minRating}
              setMinRating={setMinRating}
              dateFrom={dateFrom}
              setDateFrom={setDateFrom}
              dateTo={dateTo}
              setDateTo={setDateTo}
              availableBranches={mappedBranches}
              hasNoResults={
                !reviewsLoading &&
                (reviewsData?.data?.length || 0) === 0 &&
                (branchId !== undefined ||
                  minRating !== undefined ||
                  dateFrom !== undefined ||
                  dateTo !== undefined)
              }
            />
          </div>

          {/* Reviews Table */}
          {reviewsLoading ? (
            <div className="grid grid-cols-1 gap-4">
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <ReviewsTable
              reviews={reviewsData?.data || []}
              isLoading={reviewsLoading}
              onViewDetails={handleViewDetails}
            />
          )}

          {/* Pagination */}
          {!reviewsLoading && (reviewsData?.data?.length || 0) > 0 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {t("showing_items", {
                  defaultMessage: "Showing {from} to {to} of {total} reviews",
                  from: (currentPage - 1) * itemsPerPage + 1,
                  to: Math.min(
                    currentPage * itemsPerPage,
                    reviewsData?.data?.total || 0,
                  ),
                  total: reviewsData?.data?.total || 0,
                })}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm">
                    {t("items_per_page", { defaultMessage: "Items per page:" })}
                  </label>
                  <select
                    value={itemsPerPage.toString()}
                    onChange={(e) =>
                      handleItemsPerPageChange(parseInt(e.target.value))
                    }
                    className="rounded-md border bg-background px-3 py-1 text-sm"
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md border bg-background text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("previous", { defaultMessage: "Previous" })}
                  </button>
                  <span className="text-sm">
                    {t("page_x_of_y", {
                      defaultMessage: "Page {current} of {total}",
                      current: currentPage,
                      total: totalPages,
                    })}
                  </span>
                  <button
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md border bg-background text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("next", { defaultMessage: "Next" })}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Detail Panel Modal */}
      {selectedReviewId && (
        <ReviewDetailPanel
          review={selectedReview || null}
          isLoading={detailLoading}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}
