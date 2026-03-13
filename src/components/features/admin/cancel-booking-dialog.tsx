"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAdminCancelBooking } from "@/lib/hooks/use-bookings";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { AlertCircle } from "lucide-react";

interface CancelBookingDialogProps {
    bookingId: string | number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CancelBookingDialog({
    bookingId,
    open,
    onOpenChange,
}: CancelBookingDialogProps) {
    const t = useTranslations();
    const cancelBookingMutation = useAdminCancelBooking();
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    const handleCancel = () => {
        if (!reason.trim()) {
            setError(t("admin_cancel_reason_required") || "Cancellation reason is required.");
            return;
        }

        setError("");
        cancelBookingMutation.mutate({ bookingId, reason }, {
            onSuccess: () => {
                onOpenChange(false);
                setReason("");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        {t("admin_cancel_booking_title") || "Force Cancel Booking"}
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        {t("admin_cancel_booking_desc") || "Are you sure you want to cancel this booking? You must provide a valid reason for this action, which will be logged."}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="cancel-reason" className="text-left">
                            {t("admin_cancel_reason_label") || "Reason for cancellation"} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="cancel-reason"
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value);
                                if (e.target.value.trim() && error) {
                                    setError("");
                                }
                            }}
                            placeholder={t("admin_cancel_reason_placeholder") || "e.g. Space under emergency maintenance..."}
                            className={error ? "border-red-500" : ""}
                        />
                        {error && <p className="text-sm font-medium text-red-500">{error}</p>}
                    </div>
                </div>

                <DialogFooter className="mt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={cancelBookingMutation.isPending}
                    >
                        {t("cancel") || "Cancel"}
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={!reason.trim() || cancelBookingMutation.isPending}
                        onClick={handleCancel}
                    >
                        {cancelBookingMutation.isPending ? "..." : (t("admin_cancel_booking_submit") || "Force Cancel")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
