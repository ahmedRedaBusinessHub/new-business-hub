"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Pencil, Power } from "lucide-react";
import { AdminServiceCatalogItem, AdminServiceCatalogFilters, ServiceType } from "@/types/api/additional-services-admin";
import { ServiceFormDialog } from "./ServiceFormDialog";
import { DeactivateServiceDialog } from "./DeactivateServiceDialog";
import { useCreateService, useUpdateService, useToggleServiceStatus } from "@/lib/hooks/use-admin-additional-services";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { CreateServicePayload, UpdateServicePayload } from "@/types/api/additional-services-admin";

interface AdminServiceCatalogTableProps {
  services: AdminServiceCatalogItem[];
  total: number;
  page: number;
  limit: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onFiltersChange: (filters: AdminServiceCatalogFilters) => void;
  filters: AdminServiceCatalogFilters;
}

export function AdminServiceCatalogTable({
  services,
  total,
  page,
  limit,
  isLoading,
  onPageChange,
  onFiltersChange,
  filters,
}: AdminServiceCatalogTableProps) {
  const t = useTranslations();
  const { data: session } = useSession();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const toggleStatusMutation = useToggleServiceStatus();

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<AdminServiceCatalogItem | null>(null);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [serviceToToggle, setServiceToToggle] = useState<AdminServiceCatalogItem | null>(null);
  const [deactivateWarningData, setDeactivateWarningData] = useState<{ requires_confirmation: true; pending_count: number; confirmed_count: number } | null>(null);

  const isSuperAdmin = session?.user?.role === 'admin';

  const getStatusBadge = (status: number) => {
    if (status === 1) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">{t("active")}</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{t("inactive")}</Badge>;
  };

  const getServiceTypeBadge = (type: string) => {
    const typeConfig = {
      PRINTING: { className: "bg-blue-100 text-blue-800 border-blue-200", label: t("printing") },
      STORAGE: { className: "bg-purple-100 text-purple-800 border-purple-200", label: t("storage") },
      MAILBOX: { className: "bg-orange-100 text-orange-800 border-orange-200", label: t("mailbox") },
      STUDIO: { className: "bg-pink-100 text-pink-800 border-pink-200", label: t("studio") },
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    return config ? <Badge className={config.className}>{config.label}</Badge> : null;
  };

  const handleCreate = (data: CreateServicePayload) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setIsFormDialogOpen(false);
      },
    });
  };

  const handleEdit = (service: AdminServiceCatalogItem) => {
    setEditingService(service);
    setIsFormDialogOpen(true);
  };

  const handleUpdate = (data: UpdateServicePayload) => {
    if (!editingService) return;

    updateMutation.mutate(
      { id: editingService.id, payload: data },
      {
        onSuccess: () => {
          setIsFormDialogOpen(false);
          setEditingService(null);
        },
      }
    );
  };

  const handleToggleStatus = async (service: AdminServiceCatalogItem) => {
    const newStatus = service.status === 1 ? 0 : 1;

    if (newStatus === 0) {
      const result = await toggleStatusMutation.mutateAsync({
        id: service.id,
        payload: { status: 0, force: false },
      });

      if ("requires_confirmation" in result && result.requires_confirmation) {
        setServiceToToggle(service);
        setDeactivateWarningData(result as { requires_confirmation: true; pending_count: number; confirmed_count: number });
        setIsDeactivateDialogOpen(true);
        return;
      }
    } else {
      toggleStatusMutation.mutate({
        id: service.id,
        payload: { status: 1 },
      });
    }
  };

  const handleConfirmDeactivate = () => {
    if (!serviceToToggle) return;

    toggleStatusMutation.mutate(
      {
        id: serviceToToggle.id,
        payload: { status: 0, force: true },
      },
      {
        onSuccess: () => {
          setIsDeactivateDialogOpen(false);
          setServiceToToggle(null);
          setDeactivateWarningData(null);
        },
      }
    );
  };

  const handleFilterChange = (key: keyof AdminServiceCatalogFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value, page: 1 });
  };

  const handleAddService = () => {
    setEditingService(null);
    setIsFormDialogOpen(true);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <Select
              options={[
                { label: t("all_statuses"), value: "all" },
                { label: t("active"), value: "1" },
                { label: t("inactive"), value: "0" },
              ]}
              value={filters.status?.toString() || "all"}
              onChange={(e) => handleFilterChange("status", e.target.value === "all" ? undefined : parseInt(e.target.value))}
              className="w-[180px]"
            />

            <Select
              options={[
                { label: t("all_types"), value: "all" },
                { label: t("printing"), value: "PRINTING" },
                { label: t("storage"), value: "STORAGE" },
                { label: t("mailbox"), value: "MAILBOX" },
                { label: t("studio"), value: "STUDIO" },
              ]}
              value={filters.service_type || "all"}
              onChange={(e) => handleFilterChange("service_type", e.target.value === "all" ? undefined : e.target.value)}
              className="w-[180px]"
            />
          </div>

          {isSuperAdmin && (
            <Button onClick={handleAddService}>
              {t("add_service")}
            </Button>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("id")}</TableHead>
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("type")}</TableHead>
              <TableHead>{t("price")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("assigned_branches")}</TableHead>
              <TableHead>{t("pending_bookings")}</TableHead>
              {isSuperAdmin && <TableHead>{t("actions")}</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={isSuperAdmin ? 8 : 7} className="text-center py-8">
                  {t("loading")}
                </TableCell>
              </TableRow>
            ) : services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isSuperAdmin ? 8 : 7} className="text-center py-8">
                  {t("no_services_found")}
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-mono">{service.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{service.name_en}</div>
                      <div className="text-sm text-muted-foreground">{service.name_ar}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getServiceTypeBadge(service.service_type)}</TableCell>
                  <TableCell>
                    {service.base_price.toFixed(2)} {service.pricing_unit}
                  </TableCell>
                  <TableCell>{getStatusBadge(service.status)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {service.branches.map((branch) => (
                        <Badge key={branch.branch_id} variant="outline" className="text-xs">
                          {branch.branch_name_en}
                        </Badge>
                      ))}
                      {service.branches.length === 0 && (
                        <span className="text-sm text-muted-foreground">{t("no_branches")}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {service.pending_bookings_count > 0 ? (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                        {service.pending_bookings_count}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  {isSuperAdmin && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(service)}
                          disabled={isLoading}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(service)}
                          disabled={isLoading || toggleStatusMutation.isPending}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {t("showing", { start: (page - 1) * limit + 1, end: Math.min(page * limit, total), total })}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
              >
                {t("previous")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
              >
                {t("next")}
              </Button>
            </div>
          </div>
        )}
      </div>

      <ServiceFormDialog
        isOpen={isFormDialogOpen}
        onClose={() => {
          setIsFormDialogOpen(false);
          setEditingService(null);
        }}
        onSubmit={editingService ? handleUpdate : handleCreate}
        isLoading={createMutation.isPending || updateMutation.isPending}
        service={editingService}
      />

      <DeactivateServiceDialog
        isOpen={isDeactivateDialogOpen}
        onClose={() => {
          setIsDeactivateDialogOpen(false);
          setServiceToToggle(null);
          setDeactivateWarningData(null);
        }}
        onConfirm={handleConfirmDeactivate}
        isLoading={toggleStatusMutation.isPending}
        warningData={
          deactivateWarningData
            ? { ...deactivateWarningData, message: "" }
            : null
        }
      />
    </>
  );
}
