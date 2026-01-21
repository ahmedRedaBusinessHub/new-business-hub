"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
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
import { toast } from "sonner";

interface UserRolesProps {
  userId: number;
  organizationId?: number | null;
}

export function UserRoles({ userId, organizationId }: UserRolesProps) {
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const fetchingRef = useRef(false);
  const lastFetchedParamsRef = useRef<string>("");

  // Add role dialog
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addRoleId, setAddRoleId] = useState<string>("");
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<{ id: number; name: string }[]>([]);

  // Edit role dialog
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUserRole, setEditingUserRole] = useState<any | null>(null);
  const [editRoleId, setEditRoleId] = useState<string>("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Delete confirmation
  const [deletingUserRole, setDeletingUserRole] = useState<any | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchRoles = useCallback(async () => {
    if (!userId) return;

    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: pageSize.toString(),
      ...(debouncedSearch && { search: debouncedSearch }),
    });
    const paramsString = params.toString();

    // Prevent duplicate calls with same parameters
    if (fetchingRef.current && lastFetchedParamsRef.current === paramsString) {
      return;
    }

    // Mark as fetching and track params
    fetchingRef.current = true;
    lastFetchedParamsRef.current = paramsString;

    try {
      setLoading(true);
      const response = await fetch(`/api/user-roles/user/${userId}?${paramsString}`).catch(() => null);
      if (response?.ok) {
        const data = await response.json();
        setUserRoles(Array.isArray(data.data) ? data.data : []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 0);
      } else {
        setUserRoles([]);
        setTotal(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching user roles:", error);
      setUserRoles([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      fetchingRef.current = false;
      setLoading(false);
    }
  }, [userId, currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, currentPage, pageSize, debouncedSearch]);

  // Fetch available roles for Add/Edit dropdowns
  const fetchAvailableRoles = useCallback(async () => {
    try {
      const res = await fetch("/api/roles?limit=100");
      if (!res.ok) return [];
      const data = await res.json();
      const list = Array.isArray(data.data) ? data.data : [];
      return list.map((r: any) => ({ id: r.id, name: r.name || r.namespace || `Role ${r.id}` }));
    } catch {
      return [];
    }
  }, []);

  const openAddDialog = useCallback(async () => {
    const roles = await fetchAvailableRoles();
    const assignedIds = new Set(userRoles.map((ur) => ur.role_id ?? ur.roles?.id));
    setAvailableRoles(roles.filter((r) => !assignedIds.has(r.id)));
    setAddRoleId("");
    setIsAddOpen(true);
  }, [fetchAvailableRoles, userRoles]);

  const handleAdd = useCallback(async () => {
    if (!addRoleId) {
      toast.error("Please select a role");
      return;
    }
    setAddSubmitting(true);
    try {
      const res = await fetch("/api/user-roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          role_id: Number(addRoleId),
          organization_id: organizationId ?? 1,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Failed to add role");
      }
      toast.success("Role added successfully");
      setIsAddOpen(false);
      setAddRoleId("");
      fetchRoles();
    } catch (e: any) {
      toast.error(e.message || "Failed to add role");
    } finally {
      setAddSubmitting(false);
    }
  }, [addRoleId, userId, organizationId, fetchRoles]);

  const openEditDialog = useCallback(async (userRole: any) => {
    const roles = await fetchAvailableRoles();
    setAvailableRoles(roles);
    setEditingUserRole(userRole);
    const rid = userRole?.role_id ?? userRole?.roles?.id;
    setEditRoleId(rid != null ? String(rid) : "");
    setIsEditOpen(true);
  }, [fetchAvailableRoles]);

  const handleEdit = useCallback(async () => {
    if (!editingUserRole || !editRoleId) return;
    setEditSubmitting(true);
    try {
      const res = await fetch(`/api/user-roles/${editingUserRole.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role_id: Number(editRoleId) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Failed to update role");
      }
      toast.success("Role updated successfully");
      setIsEditOpen(false);
      setEditingUserRole(null);
      setEditRoleId("");
      fetchRoles();
    } catch (e: any) {
      toast.error(e.message || "Failed to update role");
    } finally {
      setEditSubmitting(false);
    }
  }, [editingUserRole, editRoleId, fetchRoles]);

  const handleDelete = useCallback(async () => {
    if (!deletingUserRole) return;
    setDeleteSubmitting(true);
    try {
      const res = await fetch(`/api/user-roles/${deletingUserRole.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Failed to remove role");
      }
      toast.success("Role removed successfully");
      setDeletingUserRole(null);
      fetchRoles();
    } catch (e: any) {
      toast.error(e.message || "Failed to remove role");
    } finally {
      setDeleteSubmitting(false);
    }
  }, [deletingUserRole, fetchRoles]);

  if (loading) {
    return <div className="p-4 text-center">Loading roles...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>User Roles ({total})</CardTitle>
        <Button size="sm" onClick={openAddDialog}>
          <Plus className="mr-2 size-4" />
          Add Role
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
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
        {userRoles.length === 0 && !loading ? (
          <p className="text-sm text-muted-foreground">No roles assigned</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userRoles.map((role: any) => (
                  <TableRow key={role.id}>
                    <TableCell>{role.roles?.name || role.role_name || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={role.deleted_at ? "secondary" : "default"}>
                        {role.deleted_at ? "Inactive" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {role.created_at
                        ? new Date(role.created_at).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(role)}
                          title="Edit role"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingUserRole(role)}
                          title="Remove role"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
          </>
        )}
      </CardContent>

      {/* Add Role Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Select
              error={undefined}
              label="role"
              value={addRoleId}
              onChange={(e) => setAddRoleId(e.target.value)}
              className="w-full"
            >
              {availableRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </Select>
            {availableRoles.length === 0 && (
              <p className="text-sm text-muted-foreground">No roles available to add.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={addSubmitting || !addRoleId}>
              {addSubmitting ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditOpen} onOpenChange={(open) => !open && (setIsEditOpen(false), setEditingUserRole(null))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Select
              error={undefined}
              label="role"
              value={editRoleId}
              onChange={(e) => setEditRoleId(e.target.value)}
              className="w-full"
            >
              {availableRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => (setIsEditOpen(false), setEditingUserRole(null))}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={editSubmitting || !editRoleId}>
              {editSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Role Confirmation */}
      <AlertDialog open={!!deletingUserRole} onOpenChange={(open) => !open && setDeletingUserRole(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove role?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the role &quot;{deletingUserRole?.roles?.name || deletingUserRole?.role_name || "this role"}&quot; from the user. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteSubmitting}>
              {deleteSubmitting ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
