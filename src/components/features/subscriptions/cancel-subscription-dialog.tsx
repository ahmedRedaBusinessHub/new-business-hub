"use client";

import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, AlertCircle } from "lucide-react";

interface CancelSubscriptionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export function CancelSubscriptionDialog({ isOpen, onClose, onConfirm, isLoading }: CancelSubscriptionDialogProps) {
    const t = useTranslations();

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="w-5 h-5" />
                        {t("subscriptions_cancel_confirm_title")}
                    </DialogTitle>
                    <DialogDescription className="py-2">
                        {t("subscriptions_cancel_confirm_message")}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-4 bg-muted/50 rounded-lg space-y-3 border text-sm">
                    <h4 className="font-bold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-primary" />
                        {t("cancellation_policy")}
                    </h4>
                    <ul className="space-y-1.5 text-muted-foreground list-disc ps-4 rtl:ps-0 rtl:pe-4">
                        <li>{t("subscription_cancellation_policy_access")}</li>
                        <li>{t("subscription_cancellation_policy_refund")}</li>
                        <li>{t("subscription_cancellation_policy_autorenewal")}</li>
                    </ul>
                </div>

                <DialogFooter className="mt-4 gap-3 sm:gap-0">
                    <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                        {t("subscription_keep_cta")}
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? t("common_saving", { defaultMessage: "Processing..." }) : t("confirm_cancel")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
