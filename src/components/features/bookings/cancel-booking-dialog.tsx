"use client";

import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Info, AlertTriangle, CheckCircle2, MinusCircle, XCircle } from "lucide-react";
import { getCancellationRefundTier } from "@/lib/utils";

interface CancelBookingDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
    startDate?: string;
}

export function CancelBookingDialog({ isOpen, onClose, onConfirm, isLoading, startDate }: CancelBookingDialogProps) {
    const t = useTranslations();

    const refundTier = startDate ? getCancellationRefundTier(startDate) : null;

    const refundConfig = refundTier
        ? {
            full: {
                icon: <CheckCircle2 className="w-4 h-4 text-success" />,
                label: t("booking_cancel_refund_full"),
                className: "bg-success/10 border-success/20 text-success",
            },
            partial: {
                icon: <MinusCircle className="w-4 h-4 text-warning" />,
                label: t("booking_cancel_refund_partial"),
                className: "bg-warning/10 border-warning/20 text-warning",
            },
            none: {
                icon: <XCircle className="w-4 h-4 text-destructive" />,
                label: t("booking_cancel_refund_none"),
                className: "bg-destructive/10 border-destructive/20 text-destructive",
            },
        }[refundTier]
        : null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="w-5 h-5" />
                        {t("booking_cancel_confirm_title")}
                    </DialogTitle>
                    <DialogDescription className="py-2">
                        {t("booking_cancel_confirm_message")}
                    </DialogDescription>
                </DialogHeader>

                {refundConfig && (
                    <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium ${refundConfig.className}`}>
                        {refundConfig.icon}
                        {refundConfig.label}
                    </div>
                )}

                <div className="p-4 bg-muted/50 rounded-lg space-y-3 border text-sm">
                    <h4 className="font-bold flex items-center gap-2">
                        <Info className="w-4 h-4 text-primary" />
                        {t("booking_cancel_policy_title")}
                    </h4>
                    <ul className="space-y-1.5 text-muted-foreground list-disc ps-4 rtl:ps-0 rtl:pe-4">
                        <li className={refundTier === 'full' ? 'font-semibold text-foreground' : ''}>{t("booking_cancel_policy_full_refund")}</li>
                        <li className={refundTier === 'partial' ? 'font-semibold text-foreground' : ''}>{t("booking_cancel_policy_partial_refund")}</li>
                        <li className={refundTier === 'none' ? 'font-semibold text-foreground' : ''}>{t("booking_cancel_policy_no_refund")}</li>
                    </ul>
                </div>

                <DialogFooter className="mt-4 gap-3 sm:gap-0">
                    <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                        {t("common_cancel")}
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? t("common_saving") : t("booking_cancel_cta")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
