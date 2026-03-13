"use client";

import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { X } from "lucide-react";
import { AdminServiceBooking } from "@/types/api/additional-services-admin";

interface ServiceBookingDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  booking: AdminServiceBooking | null;
}

export function ServiceBookingDetailDialog({ isOpen, onClose, booking }: ServiceBookingDetailDialogProps) {
  const t = useTranslations();

  if (!booking) return null;

  const getStatusBadge = (status: number) => {
    const statusConfig = {
      0: { label: t("pending"), className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      1: { label: t("confirmed"), className: "bg-blue-100 text-blue-800 border-blue-200" },
      2: { label: t("completed"), className: "bg-green-100 text-green-800 border-green-200" },
      3: { label: t("cancelled"), className: "bg-red-100 text-red-800 border-red-200" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config?.className}>{config?.label}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {t("service_booking_details")}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("booking_id")}</label>
              <p className="text-sm font-semibold">#{booking.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("status")}</label>
              <div className="mt-1">{getStatusBadge(booking.status)}</div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">{t("user")}</label>
            <p className="text-sm">{booking.user_name}</p>
            <p className="text-xs text-muted-foreground">{booking.user_email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">{t("service")}</label>
            <p className="text-sm font-semibold">{booking.service_name_en}</p>
            <p className="text-xs text-muted-foreground">{booking.service_type}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("branch")}</label>
              <p className="text-sm">{booking.branch_name_en || "-"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("booking_date")}</label>
              <p className="text-sm">{new Date(booking.booking_date).toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("quantity")}</label>
              <p className="text-sm">{booking.quantity}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("price_at_booking")}</label>
              <p className="text-sm">
                {booking.price_at_booking ? `${booking.price_at_booking} SAR` : "-"}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">{t("total_amount")}</label>
            <p className="text-sm font-semibold text-lg">{booking.amount} SAR</p>
          </div>

          {booking.cancellation_reason && (
            <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
              <label className="text-sm font-medium text-red-900 dark:text-red-100">{t("cancellation_reason")}</label>
              <p className="text-sm text-red-800 dark:text-red-200 mt-1">{booking.cancellation_reason}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            {t("common_close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
