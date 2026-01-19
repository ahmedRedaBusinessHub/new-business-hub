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
import { Plus, Pencil, Trash2, Search, Eye, Copy } from "lucide-react";
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
import { StaticListForm } from "./StaticListForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import DynamicView from "../shared/DynamicView";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

export interface StaticList {
  id: number;
  name: string;
  namespace: string;
  config: any;
  status: number;
  order_no: number | null;
  organization_id: number;
  created_at: string | null;
  updated_at: string | null;
}

export function StaticListsManagement() {
  const [staticLists, setStaticLists] = useState<StaticList[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingList, setEditingList] = useState<StaticList | null>(null);
  const [viewingList, setViewingList] = useState<StaticList | null>(null);
  const [deletingListId, setDeletingListId] = useState<number | null>(null);
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

  const fetchStaticLists = useCallback(async () => {
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
      const response = await fetch(`/api/static-lists?${paramsString}`);
      if (!response.ok) {
        throw new Error("Failed to fetch static lists");
      }
      const data = await response.json();
      const listsData = Array.isArray(data.data) ? data.data : [];
      setStaticLists(listsData);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error: any) {
      console.error("Error fetching static lists:", error);
      toast.error("Failed to load static lists");
      setStaticLists([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchStaticLists();
  }, [fetchStaticLists]);

  const handleCreate = async (listData: Omit<StaticList, "id" | "created_at" | "updated_at">) => {
    try {
      const response = await fetch("/api/static-lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create static list");
      }

      toast.success("Static list created successfully!");
      setIsFormOpen(false);
      fetchStaticLists();
    } catch (error: any) {
      toast.error(error.message || "Failed to create static list");
    }
  };

  const handleUpdate = async (listData: Omit<StaticList, "id" | "created_at" | "updated_at">) => {
    if (!editingList) return;

    try {
      const response = await fetch(`/api/static-lists/${editingList.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update static list");
      }

      toast.success("Static list updated successfully!");
      setEditingList(null);
      setIsFormOpen(false);
      fetchStaticLists();
    } catch (error: any) {
      toast.error(error.message || "Failed to update static list");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/static-lists/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete static list");
      }

      toast.success("Static list deleted successfully!");
      setDeletingListId(null);
      fetchStaticLists();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete static list");
    }
  };

  const handleEdit = (list: StaticList) => {
    setEditingList(list);
    setIsFormOpen(true);
  };

  const handleView = (list: StaticList) => {
    setViewingList(list);
    setIsViewOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingList(null);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewingList(null);
  };

  const copyNamespace = (namespace: string) => {
    navigator.clipboard.writeText(namespace);
    toast.success("Namespace copied to clipboard!");
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h2>Static Lists Management</h2>
          <p className="text-muted-foreground">
            Manage static lists and configurations
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add Static List
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search static lists..."
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
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading static lists...
                </TableCell>
              </TableRow>
            ) : staticLists.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No static lists found.
                </TableCell>
              </TableRow>
            ) : (
              staticLists.map((list) => (
                <TableRow key={list.id}>
                  <TableCell className="font-medium">{list.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {list.namespace}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyNamespace(list.namespace)}
                        title="Copy namespace"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{list.order_no ?? "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={list.status === 1 ? "default" : "secondary"}
                    >
                      {list.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(list)}
                        title="View static list details"
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(list)}
                        title="Edit static list"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingListId(list.id)}
                        title="Delete static list"
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
        Showing {staticLists.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
        {Math.min(currentPage * pageSize, total)} of {total} static lists
      </div>

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-3xl sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingList ? "Edit Static List" : "Create New Static List"}
            </DialogTitle>
          </DialogHeader>
          <StaticListForm
            staticList={editingList}
            onSubmit={editingList ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {viewingList && (
        <DynamicView
          data={viewingList}
          open={isViewOpen}
          onOpenChange={handleCloseView}
          title="Static List Details"
          header={{
            type: "simple",
            title: (data: StaticList) => data.name,
            subtitle: (data: StaticList) => data.namespace,
            badges: [
              {
                field: "status",
                map: {
                  1: { label: "Active", variant: "default" },
                  0: { label: "Inactive", variant: "secondary" },
                },
              },
            ],
          }}
          tabs={[
            {
              id: "details",
              label: "Details",
              gridCols: 2,
              fields: [
                { name: "name", label: "Name", type: "text", colSpan: 12 },
                { name: "namespace", label: "Namespace", type: "text", colSpan: 12 },
                { name: "order_no", label: "Order", type: "text" },
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
              id: "config",
              label: "Configuration",
              customContent: (data: StaticList) => {
                const config = data.config;
                
                if (!config) {
                  return <p className="text-muted-foreground text-sm">No configuration data</p>;
                }

                // Try to parse if it's a string
                let configData = config;
                if (typeof config === 'string') {
                  try {
                    configData = JSON.parse(config);
                  } catch {
                    return (
                      <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto max-h-96">
                        {config}
                      </pre>
                    );
                  }
                }

                return (
                  <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto max-h-96">
                    {JSON.stringify(configData, null, 2)}
                  </pre>
                );
              },
            },
          ]}
          maxWidth="4xl"
        />
      )}

      <AlertDialog
        open={!!deletingListId}
        onOpenChange={(open) => !open && setDeletingListId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the static list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingListId && handleDelete(deletingListId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
