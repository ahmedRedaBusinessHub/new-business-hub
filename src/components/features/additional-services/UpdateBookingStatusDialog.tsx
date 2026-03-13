"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { SelectRoot as Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { ServiceBookingStatus } from "@/types/api/additional-services-admin";

interface UpdateBookingStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (status: number, cancellationReason?: string) => void;
  isLoading?: boolean;
  currentStatus: ServiceBookingStatus;
  error?: string | null;
}

export function UpdateBookingStatusDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  currentStatus,
  error,
}: UpdateBookingStatusDialogProps) {
  const t = useTranslations();
  const [status, setStatus] = useState<1 | 2 | 3 | undefined>(undefined);
  const [cancellationReason, setCancellationReason] = useState("");

  const availableTransitions: Record<ServiceBookingStatus, Array<{ value: 1 | 2 | 3; label: string }>> = {
    0: [
      { value: 1, label: t("confirmed") },
      { value: 3, label: t("cancelled") },
    ],
    1: [
      { value: 2, label: t("completed") },
      { value: 3, label: t("cancelled") },
    ],
    2: [],
    3: [],
  };

  const transitions = availableTransitions[currentStatus];

  const handleSubmit = () => {
    if (!status) return;

    if (status === 3 && !cancellationReason.trim()) {
      return;
    }

    onConfirm(status, status === 3 ? cancellationReason : undefined);
  };

  const handleReset = () => {
    setStatus(undefined);
    setCancellationReason("");
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const isSubmitDisabled = !status || (status === 3 && !cancellationReason.trim()) || isLoading;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("update_booking_status")}</DialogTitle>
          <DialogDescription>
            {t("update_booking_status_description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="status">{t("new_status")}</Label>
            <Select
              value={status?.toString()}
              onValueChange={(value) => setStatus(parseInt(value) as 1 | 2 | 3)}
              disabled={isLoading}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder={t("select_status")} />
              </SelectTrigger>
              <SelectContent>
                {transitions.map((transition) => (
                  <SelectItem key={transition.value} value={transition.value.toString()}>
                    {transition.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {status === 3 && (
            <div>
              <Label htmlFor="cancellation_reason">{t("cancellation_reason")} *</Label>
              <Textarea
                id="cancellation_reason"
                placeholder={t("enter_cancellation_reason")}
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                disabled={isLoading}
                rows={3}
                className="mt-2"
              />
            </div>
          )}
        </div>

        {error && (
          <div className="px-1 pb-2">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
            {t("common_cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitDisabled}>
            {isLoading ? t("common_saving") : t("common_confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
