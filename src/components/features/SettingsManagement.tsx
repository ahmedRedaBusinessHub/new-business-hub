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
import { Plus, Pencil, Trash2, Search, Eye } from "lucide-react";
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
import { SettingsForm } from "./SettingsForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import DynamicView, { type ViewTab } from "../shared/DynamicView";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

export interface Setting {
  id: number;
  name: string;
  namespace: string;
  key_value: string | null;
  status: number;
  order_no: number | null;
  organization_id: number;
  created_at: string | null;
  updated_at: string | null;
}

export function SettingsManagement() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<Setting | null>(null);
  const [viewingSetting, setViewingSetting] = useState<Setting | null>(null);
  const [deletingSettingId, setDeletingSettingId] = useState<number | null>(null);
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
      setCurrentPage(1); // Reset to first page when search changes
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const isFetchingRef = useRef(false);
  const lastFetchParamsRef = useRef<string>("");

  const fetchSettings = useCallback(async () => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: pageSize.toString(),
      ...(debouncedSearch && { search: debouncedSearch }),
    });
    const paramsString = params.toString();

    // Prevent duplicate calls with same parameters
    if (isFetchingRef.current && lastFetchParamsRef.current === paramsString) {
      return;
    }

    isFetchingRef.current = true;
    lastFetchParamsRef.current = paramsString;

    try {
      setLoading(true);
      const response = await fetch(`/api/settings?${paramsString}`);
      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }
      const data = await response.json();
      const settingsData = Array.isArray(data.data) ? data.data : [];
      setSettings(settingsData);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error: any) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
      setSettings([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleCreate = async (settingData: Omit<Setting, "id" | "created_at" | "updated_at">) => {
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settingData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create setting");
      }

      toast.success("Setting created successfully!");
      setIsFormOpen(false);
      fetchSettings();
    } catch (error: any) {
      toast.error(error.message || "Failed to create setting");
    }
  };

  const handleUpdate = async (settingData: Omit<Setting, "id" | "created_at" | "updated_at">) => {
    if (!editingSetting) return;

    try {
      const response = await fetch(`/api/settings/${editingSetting.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settingData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update setting");
      }

      toast.success("Setting updated successfully!");
      setEditingSetting(null);
      setIsFormOpen(false);
      fetchSettings();
    } catch (error: any) {
      toast.error(error.message || "Failed to update setting");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/settings/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete setting");
      }

      toast.success("Setting deleted successfully!");
      setDeletingSettingId(null);
      fetchSettings();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete setting");
    }
  };

  const handleEdit = (setting: Setting) => {
    setEditingSetting(setting);
    setIsFormOpen(true);
  };

  const handleView = (setting: Setting) => {
    setViewingSetting(setting);
    setIsViewOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSetting(null);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewingSetting(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h2>Settings Management</h2>
          <p className="text-muted-foreground">
            Manage system settings with full CRUD operations
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add Setting
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search settings..."
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
              <TableHead>Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading settings...
                </TableCell>
              </TableRow>
            ) : settings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No settings found.
                </TableCell>
              </TableRow>
            ) : (
              settings.map((setting) => (
                <TableRow key={setting.id}>
                  <TableCell className="font-medium">{setting.name}</TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {setting.namespace}
                    </code>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {setting.key_value || <em className="text-muted-foreground">No value</em>}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={setting.status === 1 ? "default" : "secondary"}
                    >
                      {setting.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{setting.order_no ?? "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(setting)}
                        title="View setting details"
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(setting)}
                        title="Edit setting"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingSettingId(setting.id)}
                        title="Delete setting"
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

      <div className="text-sm text-muted-foreground">
        Showing {settings.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
        {Math.min(currentPage * pageSize, total)} of {total} settings
      </div>

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-4xl sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSetting ? "Edit Setting" : "Create New Setting"}
            </DialogTitle>
          </DialogHeader>
          <SettingsForm
            setting={editingSetting}
            onSubmit={editingSetting ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {viewingSetting && (
        <DynamicView
          data={viewingSetting}
          open={isViewOpen}
          onOpenChange={handleCloseView}
          title="Setting Details"
          tabs={[
            {
              id: "details",
              label: "Details",
              gridCols: 2,
              fields: [
                { name: "name", label: "Name", type: "text" },
                { name: "namespace", label: "Namespace", type: "text" },
                { name: "key_value", label: "Value", type: "text", colSpan: 12 },
                { name: "order_no", label: "Order", type: "number" },
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
          ]}
          maxWidth="4xl"
        />
      )}

      <AlertDialog
        open={!!deletingSettingId}
        onOpenChange={(open) => !open && setDeletingSettingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              setting and remove it from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingSettingId && handleDelete(deletingSettingId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

