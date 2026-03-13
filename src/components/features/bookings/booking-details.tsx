import { useTranslations, useLocale } from "next-intl";
import { Booking, BookingStatus } from "@/types/api/bookings";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/Card";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Tag,
  CreditCard,
  Info,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface BookingDetailsProps {
  booking: Booking;
  onCancel?: () => void;
  onModify?: () => void;
  canCancel?: boolean;
  canModify?: boolean;
  canReview?: boolean;
  onLeaveReview?: () => void;
}

export function BookingDetails({
  booking,
  onCancel,
  onModify,
  canCancel = false,
  canModify = false,
  canReview = false,
  onLeaveReview,
}: BookingDetailsProps) {
  console.log("🚀 ~ BookingDetails ~ booking:", booking);
  const t = useTranslations();
  const locale = useLocale() as "ar-SA" | "en-US" | "ar" | "en";
  const currencyLocale = locale.startsWith("ar") ? "ar-SA" : "en-US";
  const dateLocale = locale.startsWith("ar") ? "ar-SA" : "en-US";

  const spaceName = locale.startsWith("ar")
    ? booking.coworking_space?.name_ar
    : booking.coworking_space?.name_en;
  const branchName = locale.startsWith("ar")
    ? booking.coworking_space?.branch?.name_ar
    : booking.coworking_space?.branch?.name_en;
  const branchAddress = locale.startsWith("ar")
    ? booking.coworking_space?.branch?.address_ar ||
    booking.coworking_space?.branch?.address_en ||
    booking.coworking_space?.branch?.address
    : booking.coworking_space?.branch?.address_en ||
    booking.coworking_space?.branch?.address_ar ||
    booking.coworking_space?.branch?.address;

  const getStatusVariant = (status: BookingStatus | string | number) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
      case 1:
        return "success";
      case BookingStatus.PENDING:
      case 0:
        return "warning";
      case BookingStatus.CANCELLED:
      case 3:
        return "destructive";
      case BookingStatus.COMPLETED:
      case 2:
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: BookingStatus | string | number) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
      case 1:
        return t("booking_status_confirmed");
      case BookingStatus.PENDING:
      case 0:
        return t("booking_status_pending");
      case BookingStatus.CANCELLED:
      case 3:
        return t("booking_status_cancelled");
      case BookingStatus.COMPLETED:
      case 2:
        return t("booking_status_completed");
      default:
        return status != null ? String(status) : "";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">
            {t("booking_details_title")}
          </CardTitle>
          <Badge
            variant={getStatusVariant(booking.status) as any}
            className="px-3 py-1"
          >
            {getStatusLabel(booking.status)}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Confirmation Section */}
          <div className="flex flex-col sm:flex-row justify-between p-4 bg-muted/50 rounded-lg gap-4 border">
            <div>
              <p className="text-sm text-muted-foreground">
                {t("booking_confirm_code_label")}
              </p>
              <p className="text-lg font-mono font-bold tracking-wider">
                {booking.confirmation_code}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm text-muted-foreground">
                {t("booking_total_paid_label")}
              </p>
              <p className="text-lg font-bold text-primary">
                {formatCurrency(
                  booking.final_amount || booking.total_cost || 0,
                  currencyLocale,
                )}
              </p>
            </div>
          </div>

          {/* Space Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-base">
                    {spaceName || t("workspaces_hero_title")}
                  </h4>
                  <p className="text-sm text-muted-foreground">{branchName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {branchAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {formatDateTime(booking.start_datetime || "", dateLocale)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("to")} {formatDateTime(booking.end_datetime || "", dateLocale)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {booking.attendees}{" "}
                    {booking.attendees === 1
                      ? t("booking_person_label")
                      : t("booking_people_label")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("max_capacity_label", {
                      capacity: booking.coworking_space?.capacity || "N/A",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium capitalize">
                    {booking.pricing_tier} {t("plan")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("booking_payment_title")}:{" "}
                    {booking.transaction?.payment_method ||
                      booking.payment_method ||
                      t("online")}
                    {(booking.transaction?.reference_number ||
                      booking.transaction?.reference) && (
                        <span className="block mt-1 font-mono text-[10px] opacity-70">
                          Ref:{" "}
                          {booking.transaction?.reference_number ||
                            booking.transaction?.reference}
                        </span>
                      )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="pt-6 border-t">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              {t("booking_summary_title")}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("booking_price_base")}
                </span>
                <span>
                  {formatCurrency(booking.base_amount || 0, currencyLocale)}
                </span>
              </div>
              {booking.discount_amount ? (
                <div className="flex justify-between text-success font-medium">
                  <span>{t("booking_tenant_discount_label")}</span>
                  <span>
                    -{formatCurrency(booking.discount_amount, currencyLocale)}
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("booking_price_tax")}
                </span>
                <span>
                  {formatCurrency(booking.tax_amount || 0, currencyLocale)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t font-bold text-base">
                <span>{t("booking_price_total")}</span>
                <span>
                  {formatCurrency(
                    booking.final_amount || booking.total_cost || 0,
                    currencyLocale,
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Services Section */}
          {booking.additional_services &&
            booking.additional_services.length > 0 && (
              <div className="pt-6 border-t">
                <h4 className="font-semibold mb-3">
                  {t("additional_services")}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {booking.additional_services.map((service, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2 bg-muted/30 rounded border text-sm"
                    >
                      <span>
                        {locale.startsWith("ar")
                          ? service.service_name_ar
                          : service.service_name_en}{" "}
                        (x{service.quantity})
                      </span>
                      <span className="font-medium">
                        {formatCurrency(service.total_price, currencyLocale)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </CardContent>

        {/* Actions Footer */}
        {(canCancel || canModify || canReview || booking.has_reviewed) && (
          <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t justify-end bg-muted/10">
            {booking.has_reviewed && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground w-full sm:w-auto sm:me-auto">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                {t("review_already_submitted")}
              </div>
            )}
            {canReview && (
              <Button
                variant="default"
                onClick={onLeaveReview}
                className="w-full sm:w-auto"
              >
                {t("review_leave_review_cta")}
              </Button>
            )}
            {canModify && (
              <Button
                variant="outline"
                onClick={onModify}
                className="w-full sm:w-auto"
              >
                {t("booking_modify_cta")}
              </Button>
            )}
            {canCancel && (
              <Button
                variant="destructive"
                onClick={onCancel}
                className="w-full sm:w-auto"
              >
                {t("booking_cancel_cta")}
              </Button>
            )}
          </CardFooter>
        )}
      </Card>

      {/* Policy Info Card */}
      <Card className="border-warning/20 bg-warning/5 overflow-hidden">
        <CardHeader className="py-3 bg-warning/10 border-b border-warning/10">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-warning-700">
            <Info className="w-4 h-4" />
            {t("booking_cancel_policy_title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="py-4 text-xs space-y-2 text-muted-foreground italic">
          <p>• {t("booking_cancel_policy_full_refund")}</p>
          <p>• {t("booking_cancel_policy_partial_refund")}</p>
          <p>• {t("booking_cancel_policy_no_refund")}</p>
        </CardContent>
      </Card>

      {booking.status === BookingStatus.CANCELLED && (
        <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-bold">{t("booking_status_cancelled")}</p>
            {booking.cancellation_reason && (
              <p className="mt-1">
                {t("reason")}: {booking.cancellation_reason}
              </p>
            )}
            {booking.cancelled_at && (
              <p className="mt-0.5 text-xs opacity-80">
                {t("cancelled_at")}:{" "}
                {formatDateTime(booking.cancelled_at || "", dateLocale)}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
