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
import { Loader2 } from "lucide-react";

interface ApproveBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
  bookingCode?: string;
}

export function ApproveBookingDialog({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
  bookingCode,
}: ApproveBookingDialogProps) {
  const t = useTranslations('adminSpaceBookings');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("approve_booking")}</DialogTitle>
          <DialogDescription>
            {t("approve_booking_confirmation", { code: bookingCode })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              t("yes_approve")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
