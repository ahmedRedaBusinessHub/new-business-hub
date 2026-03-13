"use client";

/**
 * ReviewDetailPanel — Modal overlay showing full review details for admin.
 *
 * Props:
 * - review: Review | null — the review to display; null renders nothing
 * - isLoading?: boolean — shows a SkeletonCard skeleton while data is loading
 * - onClose: () => void — callback to close the panel
 *
 * Displays: rating (visual stars + numeric), submission date, client name,
 * workspace name, branch name, booking reference (#id), and full comment.
 *
 * Usage:
 * ```tsx
 * <ReviewDetailPanel review={selected} isLoading={loading} onClose={() => setSelected(null)} />
 * ```
 */
import { SkeletonCard } from "@/components/ui/Skeleton";
import { VisualStarRating } from "@/components/ui/visual-star-rating";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils";
import { useLocale } from "next-intl";

export interface Review {
  id: number;
  booking_id: number;
  user_name: string;
  user_id: number;
  rating: number;
  comment?: string;
  created_at: string;
  coworking_space_name: string;
  coworking_space_id: number;
  branch_name: string;
  branch_id: number;
}

export interface ReviewDetailPanelProps {
  review: Review | null;
  isLoading?: boolean;
  onClose: () => void;
}

export function ReviewDetailPanel({ review, isLoading = false, onClose }: ReviewDetailPanelProps) {
  const rawLocale = useLocale();
  const locale = rawLocale.startsWith('ar') ? 'ar-SA' : 'en-US';

  if (isLoading) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Loading review details"
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 space-y-6">
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  if (!review) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-detail-title"
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <h2 id="review-detail-title" className="text-xl font-semibold">Review Details</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close review details">
            Close
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Rating and Date */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Rating</p>
              <div className="flex items-center gap-2">
                <VisualStarRating rating={review.rating} size="lg" />
                <span className="text-2xl font-bold">{review.rating}</span>
              </div>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-sm text-muted-foreground">Submitted</p>
              <p className="font-medium">{formatDateTime(review.created_at, locale)}</p>
            </div>
          </div>

          {/* Client Info */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Client</p>
            <p className="font-medium">{review.user_name || 'Unknown User'}</p>
          </div>

          {/* Space Info */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Workspace</p>
            <p className="font-medium">{review.coworking_space_name || 'Unknown Space'}</p>
          </div>

          {/* Branch Info */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Branch</p>
            <p className="font-medium">{review.branch_name || 'Unknown Branch'}</p>
          </div>

          {/* Booking Reference */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Booking Reference</p>
            <p className="font-mono text-sm bg-muted p-2 rounded">#{review.booking_id}</p>
          </div>

          {/* Comment */}
          {review.comment && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Comment</p>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{review.comment}</p>
              </div>
            </div>
          )}

          {!review.comment && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Comment</p>
              <p className="text-sm italic text-muted-foreground">No comment provided</p>
            </div>
          )}

          {/* Review Metadata */}
          <div className="space-y-1 pt-4 border-t">
            <p className="text-sm text-muted-foreground">Review ID</p>
            <p className="font-mono text-sm">{review.id}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/30">
          <div className="flex justify-end">
            <Button onClick={onClose} aria-label="Close review details">Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
