"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { Badge } from "@/components/ui/Badge";
import { Plus, Pencil, Trash2, Search, Eye, Shield } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Select";
import { RoleForm } from "./RoleForm";
import DynamicView, { type ViewHeader, type ViewTab } from "../shared/DynamicView";
import { RolePermissions } from "./RolePermissions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { handleApiError, isForbidden } from "@/lib/api-client";
import { ForbiddenError } from "../shared/ForbiddenError";
import { useI18n } from "@/hooks/useI18n";

export interface Role {
  id: number;
  name: string;
  namespace: string;
  status: number;
  organization_id: number;
  created_at: string | null;
  updated_at: string | null;
}

export function RoleManagement() {
  const { t } = useI18n("admin");
  const [roles, setRoles] = useState<Role[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRoleId, setDeletingRoleId] = useState<number | null>(null);
  const [hasFormError, setHasFormError] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingRole, setViewingRole] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isForbiddenError, setIsForbiddenError] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const isFetchingRef = useRef(false);
  const lastFetchParamsRef = useRef<string>("");
  
  const fetchRoles = useCallback(async () => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: pageSize.toString(),
      ...(debouncedSearch && { search: debouncedSearch }),
    });
    const paramsString = params.toString();
    
    if (isFetchingRef.current && lastFetchParamsRef.current === paramsString) {
      return;
    }
    
    isFetchingRef.current = true;
    lastFetchParamsRef.current = paramsString;
    
    try {
      setLoading(true);
      setIsForbiddenError(false);

      const response = await fetch(`/api/roles?${paramsString}`);
      
      if (isForbidden(response)) {
        setIsForbiddenError(true);
        handleApiError(response, t("roles.failedToLoad"));
        setRoles([]);
        setTotal(0);
        setTotalPages(0);
        return;
      }

      if (!response.ok) {
        handleApiError(response, t("roles.failedToLoad"));
        throw new Error(t("roles.failedToLoad"));
      }
      
      const data = await response.json();
      const rolesData = Array.isArray(data.data) ? data.data : [];
      setRoles(rolesData);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error: any) {
      console.error("Error fetching roles:", error);
      if (!isForbiddenError) {
        toast.error(t("roles.failedToLoad"));
      }
      setRoles([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, debouncedSearch]);

  const handleCreate = async (roleData: Omit<Role, "id" | "created_at" | "updated_at" | "organization_id">) => {
    try {
      const response = await fetch("/api/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roleData),
      });

      let responseData: any;
      try {
        responseData = await response.json();
      } catch (parseError) {
        if (!response.ok) {
          throw new Error(`Failed to parse error response: ${response.status} ${response.statusText}`);
        }
        throw parseError;
      }

      if (isForbidden(response)) {
        handleApiError(response, t("roles.failedToCreate"));
        throw new Error(t("roles.accessForbidden"));
      }

      if (!response.ok || (responseData.statusCode && responseData.statusCode >= 400)) {
        let errorMessage = t("roles.failedToCreate");
        let fieldErrors: Record<string, string> = {};
        
        const errorData = responseData;
        errorMessage = errorData.message || errorData.error || errorMessage;
        
        if (errorData.message && typeof errorData.message === "string") {
          const errorMsg = errorData.message;
          const errorMsgLower = errorMsg.toLowerCase();
          
          if (errorMsgLower.includes("unique constraint failed on the fields: (`namespace`)") ||
              (errorMsgLower.includes("namespace") && errorMsgLower.includes("unique"))) {
            fieldErrors.namespace = errorData.message;
            errorMessage = t("roles.namespaceExists");
          }
        }
        
        handleApiError(response, errorMessage);
        const error = new Error(errorData.message || errorMessage) as any;
        error.fieldErrors = fieldErrors;
        error.originalMessage = errorData.message;
        error.statusCode = errorData.statusCode;
        throw error;
      }

      toast.success(t("roles.roleCreated"));
      setIsFormOpen(false);
      fetchRoles();
    } catch (error: any) {
      if (!error.fieldErrors || Object.keys(error.fieldErrors).length === 0) {
        console.error("Create error:", error);
        toast.error(error.message || t("roles.failedToCreate"));
      }
      throw error;
    }
  };

  const handleUpdate = async (roleData: Omit<Role, "id" | "created_at" | "updated_at" | "organization_id">) => {
    if (!editingRole) return;

    try {
      const updatePayload: any = {};
      Object.keys(roleData).forEach((key) => {
        const value = roleData[key as keyof typeof roleData];
        if (value !== undefined) {
          updatePayload[key] = value;
        }
      });

      const response = await fetch(`/api/roles/${editingRole.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      });

      let responseData: any;
      try {
        responseData = await response.json();
      } catch (parseError) {
        if (!response.ok) {
          throw new Error(`Failed to parse error response: ${response.status} ${response.statusText}`);
        }
        throw parseError;
      }

      if (isForbidden(response)) {
        handleApiError(response, t("roles.failedToUpdate"));
        throw new Error(t("roles.accessForbidden"));
      }

      if (!response.ok || (responseData.statusCode && responseData.statusCode >= 400)) {
        let errorMessage = t("roles.failedToUpdate");
        let fieldErrors: Record<string, string> = {};
        
        const errorData = responseData;
        errorMessage = errorData.message || errorData.error || errorMessage;
        
        if (errorData.message && typeof errorData.message === "string") {
          const errorMsg = errorData.message;
          const errorMsgLower = errorMsg.toLowerCase();
          
          if (errorMsgLower.includes("unique constraint failed on the fields: (`namespace`)") ||
              (errorMsgLower.includes("namespace") && errorMsgLower.includes("unique"))) {
            fieldErrors.namespace = errorData.message;
            errorMessage = t("roles.namespaceExists");
          }
        }
        
        handleApiError(response, errorMessage);
        const errorObj = new Error(errorData.message || errorMessage) as any;
        errorObj.fieldErrors = fieldErrors;
        errorObj.originalMessage = errorData.message;
        errorObj.statusCode = errorData.statusCode;
        throw errorObj;
      }

      toast.success(t("roles.roleUpdated"));
      setEditingRole(null);
      setIsFormOpen(false);
      fetchRoles();
    } catch (error: any) {
      if (!error.fieldErrors || Object.keys(error.fieldErrors).length === 0) {
        console.error("Update error:", error);
        toast.error(error.message || t("roles.failedToUpdate"));
      }
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/roles/${id}`, {
        method: "DELETE",
      });

      if (isForbidden(response)) {
        handleApiError(response, t("roles.failedToDelete"));
        throw new Error(t("roles.accessForbidden"));
      }

      if (!response.ok) {
        const error = await response.json();
        handleApiError(response, error.message || t("roles.failedToDelete"));
        throw new Error(error.message || t("roles.failedToDelete"));
      }

      toast.success(t("roles.roleDeleted"));
      setDeletingRoleId(null);
      fetchRoles();
    } catch (error: any) {
      toast.error(error.message || t("roles.failedToDelete"));
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setIsFormOpen(true);
  };

  const handleCloseForm = (open?: boolean) => {
    if (open === false || open === undefined) {
      setIsFormOpen(false);
      setEditingRole(null);
      setHasFormError(false);
    }
  };

  const handleView = (role: Role) => {
    setViewingRole(role);
    setIsViewOpen(true);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewingRole(null);
  };

  const viewHeader: ViewHeader = {
    type: "icon",
    title: (data: Role) => data.name,
    subtitle: (data: Role) => data.namespace,
    icon: Shield,
    badges: [
      {
        field: "status",
        variant: "default",
        map: {
          1: { label: t("common.active"), variant: "default" },
          0: { label: t("common.inactive"), variant: "secondary" },
        },
      },
    ],
  };

  const viewTabs: ViewTab[] = [
    {
      id: "details",
      label: t("roles.details"),
      gridCols: 2,
      fields: [
        { name: "name", label: t("common.name"), type: "text" },
        { name: "namespace", label: t("roles.namespace"), type: "text" },
        {
          name: "status",
          label: t("common.status"),
          type: "badge",
          badgeMap: {
            1: { label: t("common.active"), variant: "default" },
            0: { label: t("common.inactive"), variant: "secondary" },
          },
        },
        { name: "created_at", label: t("common.createdAt"), type: "datetime" },
        { name: "updated_at", label: t("common.updatedAt"), type: "datetime" },
      ],
    },
    {
      id: "permissions",
      label: t("roles.permissions"),
      customContent: viewingRole ? <RolePermissions roleId={viewingRole.id} /> : null,
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h2>{t("roles.title")}</h2>
          <p className="text-muted-foreground">
            {t("roles.subtitle")}
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 size-4" />
          {t("roles.addRole")}
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("roles.searchRoles")}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          error={undefined}
          value={pageSize.toString()}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="w-32"
        >
          <option value="10">10 {t("table.itemsPerPage")}</option>
          <option value="20">20 {t("table.itemsPerPage")}</option>
          <option value="50">50 {t("table.itemsPerPage")}</option>
          <option value="100">100 {t("table.itemsPerPage")}</option>
        </Select>
      </div>

      {isForbiddenError ? (
        <ForbiddenError
          title={t("common.accessForbidden")}
          message={t("common.youDoNotHavePermission")}
          resource="roles"
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("common.name")}</TableHead>
                <TableHead>{t("roles.namespace")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    {t("common.loading")}
                  </TableCell>
                </TableRow>
              ) : roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    {t("common.noData")}
                  </TableCell>
                </TableRow>
              ) : (
              roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-2 py-1 text-sm">
                      {role.namespace}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        role.status === 1
                          ? "default"
                          : "secondary"
                      }
                    >
                      {role.status === 1 ? t("common.active") : t("common.inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(role)}
                        title={t("roles.viewRoleDetails")}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(role)}
                        title={t("roles.editRoleTooltip")}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingRoleId(role.id)}
                        title={t("roles.deleteRoleTooltip")}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        </div>
      )}

      {!isForbiddenError && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <PaginationItem key={page}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              return null;
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {!isForbiddenError && total > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          {t("table.showing")} {((currentPage - 1) * pageSize) + 1} {t("table.of")} {Math.min(currentPage * pageSize, total)} {t("table.of")} {total} {t("table.results")}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-2xl sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRole ? t("roles.editRole") : t("roles.createNewRole")}
            </DialogTitle>
          </DialogHeader>
          <RoleForm
            role={editingRole}
            onSubmit={editingRole ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
            onErrorStateChange={setHasFormError}
          />
        </DialogContent>
      </Dialog>

      {viewingRole && (
        <DynamicView
          data={viewingRole}
          open={isViewOpen}
          onOpenChange={handleCloseView}
          title={t("roles.roleDetails")}
          header={viewHeader}
          tabs={viewTabs}
          maxWidth="7xl"
        />
      )}

      <AlertDialog
        open={!!deletingRoleId}
        onOpenChange={(open) => !open && setDeletingRoleId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("common.areYouSure")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("common.thisActionCannotBeUndone")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingRoleId && handleDelete(deletingRoleId)}
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
