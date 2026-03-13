"use client";

/**
 * ReviewsTable — Paginated, sortable table of booking reviews for admin.
 *
 * Props:
 * - reviews: Review[] — list of reviews to display
 * - isLoading?: boolean — shows loading state when true
 * - onViewDetails: (reviewId: number) => void — callback when "View" is clicked
 *
 * Features:
 * - Truncates long client names and comments
 * - Visual star rating display (VisualStarRating)
 * - Per-row delete confirmation dialog with Cancel/Delete buttons
 * - Uses useDeleteReview mutation; invalidates admin reviews cache on success
 *
 * Usage:
 * ```tsx
 * <ReviewsTable reviews={reviews} onViewDetails={(id) => setSelected(id)} />
 * ```
 */
import { useState } from "react";
import { VisualStarRating } from "@/components/ui/visual-star-rating";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils";
import { useLocale } from "next-intl";
import { useDeleteReview } from "@/lib/hooks/use-reviews";

export interface Review {
  id: number;
  booking_id: number;
  user_name: string;
  rating: number;
  comment?: string;
  created_at: string;
  coworking_space_name: string;
  branch_name: string;
}

export interface ReviewsTableProps {
  reviews: Review[];
  isLoading?: boolean;
  onViewDetails: (reviewId: number) => void;
}

export function ReviewsTable({
  reviews,
  isLoading = false,
  onViewDetails,
}: ReviewsTableProps) {
  const rawLocale = useLocale();
  const locale = rawLocale.startsWith('ar') ? 'ar-SA' : 'en-US';
  const [deleteConfirm, setDeleteConfirm] = useState<{ reviewId: number; bookingId: number } | null>(null);
  const [pendingBookingId, setPendingBookingId] = useState<number | null>(null);
  const deleteMutation = useDeleteReview();

  const truncateName = (name: string): string => {
    if (!name) return 'Unknown';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].length > 20 ? parts[0].substring(0, 17) + '...' : parts[0];
    }
    const firstName = parts[0] || '';
    const lastName = parts[1] || '';
    const truncatedFirst = firstName.length > 15 ? firstName.substring(0, 12) + '...' : firstName;
    const truncatedLast = lastName.length > 15 ? lastName.substring(0, 12) + '...' : lastName;
    return `${truncatedFirst} ${truncatedLast}`.trim();
  };

  const truncateComment = (comment: string): string => {
    if (!comment) return 'No comment';
    return comment.length > 100 ? comment.substring(0, 97) + '...' : comment;
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    const { bookingId } = deleteConfirm;
    setPendingBookingId(bookingId);
    deleteMutation.mutate(bookingId, {
      onSettled: () => setPendingBookingId(null),
    });
    setDeleteConfirm(null);
  };

  const handleDeleteConfirm = (reviewId: number, bookingId: number) => {
    setDeleteConfirm({ reviewId, bookingId });
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  return (
    <>
    <div
      role="table"
      aria-label="Booking reviews"
      className="border rounded-lg bg-background overflow-hidden"
    >
      {/* Table Header */}
      <div role="row" className="grid grid-cols-12 gap-4 p-4 bg-muted/30 border-b font-medium text-sm">
        <div role="columnheader" className="col-span-3">Client Name</div>
        <div role="columnheader" className="col-span-3">Space Name</div>
        <div role="columnheader" className="col-span-2">Branch</div>
        <div role="columnheader" className="col-span-1 text-center">Rating</div>
        <div role="columnheader" className="col-span-2">Comment</div>
        <div role="columnheader" className="col-span-1 text-right">Date</div>
        <div role="columnheader" className="col-span-12 md:col-span-1">Actions</div>
      </div>

      {/* Table Body */}
      {isLoading ? (
        <div role="status" aria-live="polite" className="p-8 text-center text-muted-foreground">
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div role="status" aria-live="polite" className="p-8 text-center text-muted-foreground">
          No reviews yet.
        </div>
      ) : (
        <div className="divide-y">
          {reviews.map((review) => (
            <div
              key={review.id}
              role="row"
              tabIndex={0}
              className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/30 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onViewDetails(review.id);
                }
              }}
              aria-label={`Review by ${review.user_name}, ${review.rating} stars`}
            >
              <div role="cell" className="col-span-3 truncate" title={review.user_name}>
                {truncateName(review.user_name)}
              </div>
              <div role="cell" className="col-span-3 truncate" title={review.coworking_space_name}>
                {review.coworking_space_name}
              </div>
              <div role="cell" className="col-span-2 truncate" title={review.branch_name}>
                {review.branch_name}
              </div>
              <div role="cell" className="col-span-1 flex justify-center">
                <VisualStarRating rating={review.rating} size="sm" />
              </div>
              <div role="cell" className="col-span-2 truncate text-sm text-muted-foreground" title={review.comment || ''}>
                {truncateComment(review.comment || '')}
              </div>
              <div role="cell" className="col-span-1 text-right text-sm">
                {formatDateTime(review.created_at, locale)}
              </div>
              <div role="cell" className="col-span-12 md:col-span-1 flex gap-2 justify-end md:justify-start mt-2 md:mt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(review.id)}
                  aria-label={`View review by ${review.user_name}`}
                >
                  View
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteConfirm(review.id, review.booking_id)}
                  disabled={pendingBookingId === review.booking_id}
                  aria-label={`Delete review by ${review.user_name}`}
                  aria-busy={pendingBookingId === review.booking_id}
                >
                  {pendingBookingId === review.booking_id ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Delete Confirmation Modal */}
    {deleteConfirm && (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6">
          <h3 id="delete-dialog-title" className="text-lg font-semibold mb-4">Confirm Delete</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Are you sure you want to delete this review? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              disabled={deleteMutation.isPending}
              aria-label="Cancel delete"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              aria-label="Confirm delete review"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
