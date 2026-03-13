"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { useBranches } from "@/lib/hooks/use-branches";
import { useAssignServiceToBranch } from "@/lib/hooks/use-admin-additional-services";
import { AdminServiceCatalogItem } from "@/types/api/additional-services-admin";

interface AssignBranchServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  service: AdminServiceCatalogItem | null;
}

export function AssignBranchServiceDialog({
  isOpen,
  onClose,
  service,
}: AssignBranchServiceDialogProps) {
  const t = useTranslations();
  const [selectedBranchId, setSelectedBranchId] = useState<number | undefined>(undefined);

  const { data: branchesData, isLoading: branchesLoading } = useBranches();
  const assignBranchMutation = useAssignServiceToBranch();

  const branches = branchesData?.data || [];
  const assignedBranchIds = service?.branches.map((b) => b.branch_id) || [];
  const availableBranches = branches.filter((b) => !assignedBranchIds.includes(b.id));

  const handleSubmit = () => {
    if (!service || !selectedBranchId) return;

    assignBranchMutation.mutate(
      { serviceId: service.id, branchId: selectedBranchId },
      {
        onSuccess: () => {
          setSelectedBranchId(undefined);
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    setSelectedBranchId(undefined);
    onClose();
  };

  const isSubmitDisabled = !selectedBranchId || assignBranchMutation.isPending || branchesLoading;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("assign_service_to_branch")}</DialogTitle>
          <DialogDescription>
            {t("select_branch_to_assign_service", { serviceName: service?.name_en })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="branch">{t("branch")} *</Label>
            <Select
              id="branch"
              label=""
              required
              options={availableBranches.map((branch) => ({
                label: branch.name_en,
                value: branch.id.toString(),
              }))}
              value={selectedBranchId?.toString() || ""}
              onChange={(e) => setSelectedBranchId(parseInt(e.target.value))}
              disabled={assignBranchMutation.isPending || branchesLoading}
            />
            {availableBranches.length === 0 && !branchesLoading && (
              <p className="text-sm text-muted-foreground mt-2">
                {t("all_branches_assigned")}
              </p>
            )}
          </div>

          {service?.branches.length > 0 && (
            <div>
              <Label>{t("currently_assigned_branches")}</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {service.branches.map((branch) => (
                  <span
                    key={branch.branch_id}
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm"
                  >
                    {branch.branch_name_en}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose} disabled={assignBranchMutation.isPending}>
            {t("common_cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitDisabled}>
            {assignBranchMutation.isPending ? t("common_assigning") : t("common_assign")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
