"use client";

import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { DeactivateServiceResponse } from "@/types/api/additional-services-admin";

interface DeactivateServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  warningData?: DeactivateServiceResponse | null;
}

export function DeactivateServiceDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  warningData,
}: DeactivateServiceDialogProps) {
  const t = useTranslations();

  const pendingCount = warningData?.pending_count || 0;
  const confirmedCount = warningData?.confirmed_count || 0;
  const totalAffected = pendingCount + confirmedCount;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("deactivate_service_warning")}</DialogTitle>
          <DialogDescription>
            {t("deactivate_service_warning_description")}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-4">
          {totalAffected > 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-900 font-medium mb-2">
                {t("this_service_has_bookings", { count: totalAffected })}
              </p>
              <ul className="text-amber-800 text-sm space-y-1">
                {pendingCount > 0 && (
                  <li>
                    {t("pending_bookings_count", { count: pendingCount })}
                  </li>
                )}
                {confirmedCount > 0 && (
                  <li>
                    {t("confirmed_bookings_count", { count: confirmedCount })}
                  </li>
                )}
              </ul>
              <p className="text-amber-900 text-sm mt-3 font-medium">
                {t("existing_bookings_unaffected")}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("confirm_deactivate_service")}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            {t("common_cancel")}
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? t("common_deactivating") : t("common_confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
