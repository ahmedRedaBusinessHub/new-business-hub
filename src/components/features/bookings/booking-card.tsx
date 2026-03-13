import { useTranslations, useLocale } from "next-intl";
import NextLink from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { Booking, BookingStatus } from "@/types/api/bookings";
import {
  Calendar,
  MapPin,
  Clock,
  CreditCard,
  CheckCircle2,
  Tag,
} from "lucide-react";

interface BookingCardProps {
  booking: Booking;
  onLeaveReview?: () => void;
}

export function BookingCard({ booking, onLeaveReview }: BookingCardProps) {
  const t = useTranslations();
  const locale = useLocale() as "ar-SA" | "en-US" | "ar" | "en";
  const currencyLocale = locale.startsWith("ar") ? "ar-SA" : "en-US";
  const dateLocale = locale.startsWith("ar") ? "ar-SA" : "en-US";

  const spaceName = locale.startsWith("ar")
    ? (booking.space?.name_ar || booking.coworking_space?.name_ar)
    : (booking.space?.name_en || booking.coworking_space?.name_en);
  const branchName = locale.startsWith("ar")
    ? (booking.space?.branch?.name_ar || booking.coworking_space?.branch?.name_ar)
    : (booking.space?.branch?.name_en || booking.coworking_space?.branch?.name_en);

  const isCompleted = booking.status === BookingStatus.COMPLETED || booking.status === 2 || booking.status === 'completed';
  const canLeaveReview =
    isCompleted && !!(booking.space_id || booking.coworking_space_id) && !booking.has_reviewed;

  const getStatusVariant = (status: BookingStatus | string | number) => {
    switch (status) {
      case BookingStatus.CONFIRMED: case 1: case 'confirmed':
        return "success";
      case BookingStatus.PENDING: case 0: case 'pending':
        return "warning";
      case BookingStatus.CANCELLED: case 3: case 'cancelled':
        return "destructive";
      case BookingStatus.COMPLETED: case 2: case 'completed':
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: BookingStatus | string | number) => {
    switch (status) {
      case BookingStatus.CONFIRMED: case 1: case 'confirmed':
        return t("booking_status_confirmed");
      case BookingStatus.PENDING: case 0: case 'pending':
        return t("booking_status_pending");
      case BookingStatus.CANCELLED: case 3: case 'cancelled':
        return t("booking_status_cancelled");
      case BookingStatus.COMPLETED: case 2: case 'completed':
        return t("booking_status_completed");
      default:
        return status?.toString() || "";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg line-clamp-1">
              {spaceName || t("workspaces_hero_title")}
            </h3>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <MapPin className="w-4 h-4 me-1.5" />
              <span>{branchName || t("workspaces_filter_branch")}</span>
            </div>
          </div>
          <Badge variant={getStatusVariant(booking.status) as any}>
            {getStatusLabel(booking.status)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{formatDate(booking.start_date, dateLocale)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span>
              {formatTime(booking.start_date, dateLocale)} -{" "}
              {formatTime(booking.end_date, dateLocale)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Tag className="w-4 h-4 text-primary" />
            <span>
              {t(`space_pricing_${String(booking.pricing_tier).toLowerCase()}`)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm col-span-1 sm:col-span-2">
            <CreditCard className="w-4 h-4 text-primary" />
            <span className="font-semibold">
              {formatCurrency(
                booking.final_amount || booking.total_cost || 0,
                currencyLocale,
              )}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0 border-t mt-4 flex items-center justify-between gap-2 flex-wrap">
        {isCompleted && booking.has_reviewed && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
            {t("review_already_submitted")}
          </div>
        )}
        <div className="flex items-center gap-2 ms-auto">
          {canLeaveReview && onLeaveReview && (
            <Button variant="outline" size="sm" onClick={onLeaveReview}>
              {t("review_leave_review_cta")}
            </Button>
          )}
          <Button asChild variant="ghost" size="sm">
            <NextLink href={`/${locale}/bookings/${booking.id}`}>
              {t("booking_view_details", { defaultMessage: "View Details" })}
            </NextLink>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
