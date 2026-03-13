"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { X, Plus } from "lucide-react";
import {
  useAdminServiceCatalog,
  useAssignServiceToBranch,
  useRemoveServiceFromBranch,
} from "@/lib/hooks/use-admin-additional-services";
import { useSession } from "next-auth/react";
import { AssignBranchServiceDialog } from "./AssignBranchServiceDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
import { AdminServiceCatalogItem } from "@/types/api/additional-services-admin";

interface AdminBranchAssignmentsTabProps {
  isLoading?: boolean;
}

export function AdminBranchAssignmentsTab({
  isLoading,
}: AdminBranchAssignmentsTabProps) {
  const t = useTranslations();
  const { data: session } = useSession();
  const { data, isLoading: catalogLoading } = useAdminServiceCatalog({
    limit: 100,
  });
  const catalogData: any = data;
  const assignBranchMutation = useAssignServiceToBranch();
  const removeBranchMutation = useRemoveServiceFromBranch();

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedService, setSelectedService] =
    useState<AdminServiceCatalogItem | null>(null);
  const [pendingRemoval, setPendingRemoval] = useState<{
    service: AdminServiceCatalogItem;
    branchId: number;
  } | null>(null);

  const isSuperAdmin = session?.user?.role === "admin";
  const services = catalogData?.data?.data || [];

  const getServiceTypeBadge = (type: string) => {
    const typeConfig = {
      PRINTING: {
        className: "bg-blue-100 text-blue-800 border-blue-200",
        label: t("printing"),
      },
      STORAGE: {
        className: "bg-purple-100 text-purple-800 border-purple-200",
        label: t("storage"),
      },
      MAILBOX: {
        className: "bg-orange-100 text-orange-800 border-orange-200",
        label: t("mailbox"),
      },
      STUDIO: {
        className: "bg-pink-100 text-pink-800 border-pink-200",
        label: t("studio"),
      },
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    return config ? (
      <Badge className={config.className}>{config.label}</Badge>
    ) : null;
  };

  const handleRemoveBranch = (
    service: AdminServiceCatalogItem,
    branchId: number,
  ) => {
    if (!isSuperAdmin) return;
    setPendingRemoval({ service, branchId });
  };

  const handleConfirmRemoval = () => {
    if (!pendingRemoval) return;
    removeBranchMutation.mutate(
      {
        serviceId: pendingRemoval.service.id,
        branchId: pendingRemoval.branchId,
      },
      {
        onSuccess: () => {
          setPendingRemoval(null);
        },
      },
    );
  };

  const handleAssignBranch = (service: AdminServiceCatalogItem) => {
    setSelectedService(service);
    setAssignDialogOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("service")}</TableHead>
              <TableHead>{t("type")}</TableHead>
              <TableHead>{t("assigned_branches")}</TableHead>
              {isSuperAdmin && <TableHead>{t("actions")}</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {catalogLoading ? (
              <TableRow>
                <TableCell
                  colSpan={isSuperAdmin ? 4 : 3}
                  className="text-center py-8"
                >
                  {t("loading")}
                </TableCell>
              </TableRow>
            ) : services.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isSuperAdmin ? 4 : 3}
                  className="text-center py-8"
                >
                  {t("no_services_found")}
                </TableCell>
              </TableRow>
            ) : (
              services.map((service: any) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{service.name_en}</div>
                      <div className="text-sm text-muted-foreground">
                        {service.name_ar}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getServiceTypeBadge(service.service_type)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {service.branches.length > 0 ? (
                        service.branches.map((branch: any) => (
                          <Badge
                            key={branch.branch_id}
                            variant="outline"
                            className="text-xs flex items-center gap-1"
                          >
                            {branch.branch_name_en}
                            {isSuperAdmin && (
                              <button
                                onClick={() =>
                                  handleRemoveBranch(service, branch.branch_id)
                                }
                                disabled={removeBranchMutation.isPending}
                                className="hover:bg-destructive/20 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {t("no_branches")}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  {isSuperAdmin && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAssignBranch(service)}
                        disabled={
                          assignBranchMutation.isPending ||
                          removeBranchMutation.isPending
                        }
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        {t("assign_branch")}
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AssignBranchServiceDialog
        isOpen={assignDialogOpen}
        onClose={() => {
          setAssignDialogOpen(false);
          setSelectedService(null);
        }}
        service={selectedService}
      />

      <Dialog
        open={!!pendingRemoval}
        onOpenChange={(open) => !open && setPendingRemoval(null)}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{t("remove_branch_assignment")}</DialogTitle>
            <DialogDescription>
              {t("confirm_remove_branch_assignment")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setPendingRemoval(null)}
              disabled={removeBranchMutation.isPending}
            >
              {t("common_cancel")}
            </Button>
            <Button
              onClick={handleConfirmRemoval}
              disabled={removeBranchMutation.isPending}
            >
              {removeBranchMutation.isPending
                ? t("common_removing")
                : t("common_remove")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
