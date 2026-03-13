"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useDeleteSpace } from "@/lib/hooks/use-spaces";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteSpaceDialogProps {
    spaceId: string | number;
    spaceName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    hasActiveBookings?: boolean;
}

export function DeleteSpaceDialog({
    spaceId,
    spaceName,
    open,
    onOpenChange,
    hasActiveBookings = false, // In a real scenario, this should be checked before/during delete intent
}: DeleteSpaceDialogProps) {
    const t = useTranslations();
    const deleteSpaceMutation = useDeleteSpace();

    const handleDelete = () => {
        deleteSpaceMutation.mutate(spaceId, {
            onSuccess: () => {
                toast.success(t("booking_success_title") || "Space deleted successfully");
                onOpenChange(false);
            },
            onError: (error) => {
                toast.error(error.message || t("error_generic_title") || "Failed to delete space");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        {t("admin_delete_confirm") || "Delete Space"}
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        {hasActiveBookings ? (
                            <span className="text-destructive font-medium block mb-2">
                                {t("admin_delete_blocked_message") || "This space has active bookings and cannot be deleted."}
                            </span>
                        ) : null}
                        Are you sure you want to delete <strong>{spaceName}</strong>? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        {t("cancel") || "Cancel"}
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={hasActiveBookings || deleteSpaceMutation.isPending}
                        onClick={handleDelete}
                    >
                        {deleteSpaceMutation.isPending ? "..." : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t("submit") || "Delete"}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
