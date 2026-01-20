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

      const response = await fetch(`/api/roles?${paramsString}`);
      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }
      const data = await response.json();
      const rolesData = Array.isArray(data.data) ? data.data : [];
      setRoles(rolesData);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error: any) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to load roles");
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

      if (!response.ok || (responseData.statusCode && responseData.statusCode >= 400)) {
        let errorMessage = "Failed to create role";
        let fieldErrors: Record<string, string> = {};
        
        const errorData = responseData;
        errorMessage = errorData.message || errorData.error || errorMessage;
        
        if (errorData.message && typeof errorData.message === "string") {
          const errorMsg = errorData.message;
          const errorMsgLower = errorMsg.toLowerCase();
          
          if (errorMsgLower.includes("unique constraint failed on the fields: (`namespace`)") ||
              (errorMsgLower.includes("namespace") && errorMsgLower.includes("unique"))) {
            fieldErrors.namespace = errorData.message;
            errorMessage = "Namespace already exists";
          }
        }
        
        const error = new Error(errorData.message || errorMessage) as any;
        error.fieldErrors = fieldErrors;
        error.originalMessage = errorData.message;
        error.statusCode = errorData.statusCode;
        throw error;
      }

      toast.success("Role created successfully!");
      setIsFormOpen(false);
      fetchRoles();
    } catch (error: any) {
      if (!error.fieldErrors || Object.keys(error.fieldErrors).length === 0) {
        console.error("Create error:", error);
        toast.error(error.message || "Failed to create role");
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

      if (!response.ok || (responseData.statusCode && responseData.statusCode >= 400)) {
        let errorMessage = "Failed to update role";
        let fieldErrors: Record<string, string> = {};
        
        const errorData = responseData;
        errorMessage = errorData.message || errorData.error || errorMessage;
        
        if (errorData.message && typeof errorData.message === "string") {
          const errorMsg = errorData.message;
          const errorMsgLower = errorMsg.toLowerCase();
          
          if (errorMsgLower.includes("unique constraint failed on the fields: (`namespace`)") ||
              (errorMsgLower.includes("namespace") && errorMsgLower.includes("unique"))) {
            fieldErrors.namespace = errorData.message;
            errorMessage = "Namespace already exists";
          }
        }
        
        const errorObj = new Error(errorData.message || errorMessage) as any;
        errorObj.fieldErrors = fieldErrors;
        errorObj.originalMessage = errorData.message;
        errorObj.statusCode = errorData.statusCode;
        throw errorObj;
      }

      toast.success("Role updated successfully!");
      setEditingRole(null);
      setIsFormOpen(false);
      fetchRoles();
    } catch (error: any) {
      if (!error.fieldErrors || Object.keys(error.fieldErrors).length === 0) {
        console.error("Update error:", error);
        toast.error(error.message || "Failed to update role");
      }
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/roles/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete role");
      }

      toast.success("Role deleted successfully!");
      setDeletingRoleId(null);
      fetchRoles();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete role");
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
          1: { label: "Active", variant: "default" },
          0: { label: "Inactive", variant: "secondary" },
        },
      },
    ],
  };

  const viewTabs: ViewTab[] = [
    {
      id: "details",
      label: "Details",
      gridCols: 2,
      fields: [
        { name: "name", label: "Name", type: "text" },
        { name: "namespace", label: "Namespace", type: "text" },
        {
          name: "status",
          label: "Status",
          type: "badge",
          badgeMap: {
            1: { label: "Active", variant: "default" },
            0: { label: "Inactive", variant: "secondary" },
          },
        },
        { name: "created_at", label: "Created At", type: "datetime" },
        { name: "updated_at", label: "Updated At", type: "datetime" },
      ],
    },
    {
      id: "permissions",
      label: "Permissions",
      customContent: viewingRole ? <RolePermissions roleId={viewingRole.id} /> : null,
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h2>Role Management</h2>
          <p className="text-muted-foreground">
            Manage roles and assign permissions
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add Role
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search roles..."
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
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
          <option value="50">50 per page</option>
          <option value="100">100 per page</option>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Namespace</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Loading roles...
                </TableCell>
              </TableRow>
            ) : roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No roles found.
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
                      {role.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(role)}
                        title="View role details"
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(role)}
                        title="Edit role"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingRoleId(role.id)}
                        title="Delete role"
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

      {totalPages > 1 && (
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

      {total > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, total)} of {total} roles
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-2xl sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRole ? "Edit Role" : "Create New Role"}
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
          title="Role Details"
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              role and remove all associated permissions from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingRoleId && handleDelete(deletingRoleId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
