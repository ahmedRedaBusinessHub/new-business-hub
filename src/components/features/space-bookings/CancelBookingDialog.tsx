"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/Textarea";
import { Switch } from "@/components/ui/Switch";
import { Loader2 } from "lucide-react";
import { CancelBookingPayload } from "@/types/api/space-bookings-admin";

interface CancelBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (payload: CancelBookingPayload) => void;
  loading?: boolean;
}

export function CancelBookingDialog({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
}: CancelBookingDialogProps) {
  const t = useTranslations("adminSpaceBookings");
  const [reason, setReason] = useState("");
  const [processFullRefund, setProcessFullRefund] = useState(true);

  const handleSubmit = () => {
    if (reason.trim().length === 0) {
      return;
    }

    onConfirm({
      reason: reason.trim(),
      process_full_refund: processFullRefund,
    });
  };

  const isValid = reason.trim().length > 0 && reason.length <= 500;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("cancel_booking")}</DialogTitle>
          <DialogDescription>
            {t("cancel_booking_description")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t("cancellation_reason")}
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t("enter_cancellation_reason")}
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{reason.length} / 500</p>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              {t("issue_full_refund")}
            </label>
            <Switch
              checked={processFullRefund}
              onChange={setProcessFullRefund}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {t("go_back")}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !isValid}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              t("yes_cancel")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
