"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useDeleteBranch } from "@/lib/hooks/use-branches";
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

interface DeleteBranchDialogProps {
    branchId: string | number;
    branchName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    hasSpaces?: boolean;
}

export function DeleteBranchDialog({
    branchId,
    branchName,
    open,
    onOpenChange,
    hasSpaces = false,
}: DeleteBranchDialogProps) {
    const t = useTranslations();
    const deleteBranchMutation = useDeleteBranch();

    const handleDelete = () => {
        deleteBranchMutation.mutate(branchId, {
            onSuccess: () => {
                toast.success(t("branch_deleted_success"));
                onOpenChange(false);
            },
            onError: (error) => {
                toast.error(error.message || t("branch_delete_error"));
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        {t("admin_branch_delete_confirm")}
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        {hasSpaces ? (
                            <span className="text-destructive font-medium block mb-2">
                                {t("admin_branch_delete_blocked_message")}
                            </span>
                        ) : null}
                        {t("admin_branch_delete_warning", { name: branchName })}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        {t("common_cancel")}
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={hasSpaces || deleteBranchMutation.isPending}
                        onClick={handleDelete}
                    >
                        {deleteBranchMutation.isPending ? "..." : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t("common_delete")}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
