"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Loader2, X } from "lucide-react";
import { AdminSpaceBookingDetail } from "@/types/api/space-bookings-admin";
import { useAdminSpaceBookingDetail } from "@/lib/hooks/use-admin-space-bookings";

interface SpaceBookingDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId?: number;
}

export function SpaceBookingDetailDialog({
  open,
  onOpenChange,
  bookingId,
}: SpaceBookingDetailDialogProps) {
  const t = useTranslations("adminSpaceBookings");
  const { data: initData, isLoading } = useAdminSpaceBookingDetail(bookingId);
  const data = initData?.data;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("booking_details")}</DialogTitle>
          <DialogDescription>
            {t("booking_details_description")}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-4 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        ) : data ? (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-sm text-gray-500 mb-3 uppercase tracking-wide">
                  {t("booking_information")}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm font-medium">
                      {t("confirmation_code")}
                    </span>
                    <span className="text-sm">{data.confirmation_code}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm font-medium">{t("status")}</span>
                    <span className="text-sm">
                      {data.status === 0 && t("pending")}
                      {data.status === 1 && t("confirmed")}
                      {data.status === 2 && t("completed")}
                      {data.status === 3 && t("cancelled")}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm font-medium">
                      {t("date_time")}
                    </span>
                    <span className="text-sm">
                      {new Date(data.start_datetime).toLocaleString()} -{" "}
                      {new Date(data.end_datetime).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm font-medium">
                      {t("attendees")}
                    </span>
                    <span className="text-sm">{data.attendees}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-500 mb-3 uppercase tracking-wide">
                  {t("client_information")}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm font-medium">{t("name")}</span>
                    <span className="text-sm">
                      {data.user?.first_name} {data.user?.last_name}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm font-medium">{t("user_id")}</span>
                    <span className="text-sm">{data.user_id}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-500 mb-3 uppercase tracking-wide">
                  {t("space_information")}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm font-medium">{t("space")}</span>
                    <span className="text-sm">
                      {data.coworking_space.name_en}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm font-medium">{t("branch")}</span>
                    <span className="text-sm">
                      {data.coworking_space.branch?.name_en || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm font-medium">
                      {t("pricing_tier")}
                    </span>
                    <span className="text-sm">{data.pricing_tier}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-500 mb-3 uppercase tracking-wide">
                  {t("payment_information")}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm font-medium">
                      {t("base_amount")}
                    </span>
                    <span className="text-sm">{data.base_amount} SAR</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm font-medium">
                      {t("discount_amount")}
                    </span>
                    <span className="text-sm">{data.discount_amount} SAR</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm font-medium">
                      {t("final_amount")}
                    </span>
                    <span className="text-sm font-semibold">
                      {data.final_amount} SAR
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm font-medium">
                      {t("payment_method")}
                    </span>
                    <span className="text-sm">
                      {data.transaction?.payment_method || "-"}
                    </span>
                  </div>
                </div>
              </div>

              {data.additional_services &&
                data.additional_services.length > 0 && (
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-sm text-gray-500 mb-3 uppercase tracking-wide">
                      {t("additional_services")}
                    </h3>
                    <div className="space-y-2">
                      {data.additional_services.map((service, index) => (
                        <div
                          key={index}
                          className="flex justify-between py-2 border-b"
                        >
                          <span className="text-sm">
                            {service.service_name_en}
                          </span>
                          <span className="text-sm font-medium">
                            {service.total_price} SAR x {service.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {data.status === 3 && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-sm text-gray-500 mb-3 uppercase tracking-wide">
                  {t("cancellation_details")}
                </h3>
                <div className="space-y-3">
                  <div className="py-2 border-b">
                    <span className="text-sm font-medium">
                      {t("cancellation_reason")}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    {data.cancellation_reason || "-"}
                  </div>
                  <div className="flex justify-between py-2 border-b mt-3">
                    <span className="text-sm font-medium">
                      {t("refund_issued")}
                    </span>
                    <span className="text-sm">
                      {data.refund_issued ? t("yes") : t("no")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
