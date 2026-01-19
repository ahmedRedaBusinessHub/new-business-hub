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
import { Plus, Pencil, Trash2, Search, Eye, Copy, ChevronRight } from "lucide-react";
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
import { ObjectForm } from "./ObjectForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import DynamicView from "../shared/DynamicView";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

export interface ObjectItem {
  id: number;
  name: string;
  namespace: string;
  type: number;
  icon: string | null;
  parent_id: number | null;
  description: string | null;
  order_no: number | null;
  status: number;
  organization_id: number;
  created_at: string | null;
  updated_at: string | null;
  parent?: ObjectItem | null;
}

const TYPE_LABELS: Record<number, string> = {
  1: "Menu",
  2: "Module",
  3: "Permission",
  4: "Page",
  5: "Action",
};

export function ObjectsManagement() {
  const [objects, setObjects] = useState<ObjectItem[]>([]);
  const [allObjects, setAllObjects] = useState<ObjectItem[]>([]); // For parent dropdown
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingObject, setEditingObject] = useState<ObjectItem | null>(null);
  const [viewingObject, setViewingObject] = useState<ObjectItem | null>(null);
  const [deletingObjectId, setDeletingObjectId] = useState<number | null>(null);
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

  const fetchObjects = useCallback(async () => {
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
      const response = await fetch(`/api/objects?${paramsString}`);
      if (!response.ok) {
        throw new Error("Failed to fetch objects");
      }
      const data = await response.json();
      const objectsData = Array.isArray(data.data) ? data.data : [];
      setObjects(objectsData);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error: any) {
      console.error("Error fetching objects:", error);
      toast.error("Failed to load objects");
      setObjects([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentPage, pageSize, debouncedSearch]);

  // Fetch all objects for parent dropdown
  const fetchAllObjects = useCallback(async () => {
    try {
      const response = await fetch(`/api/objects?limit=1000`);
      if (!response.ok) {
        throw new Error("Failed to fetch objects");
      }
      const data = await response.json();
      const objectsData = Array.isArray(data.data) ? data.data : [];
      setAllObjects(objectsData);
    } catch (error: any) {
      console.error("Error fetching all objects:", error);
    }
  }, []);

  useEffect(() => {
    fetchObjects();
    fetchAllObjects();
  }, [fetchObjects, fetchAllObjects]);

  const handleCreate = async (objectData: Omit<ObjectItem, "id" | "created_at" | "updated_at" | "parent">) => {
    try {
      const response = await fetch("/api/objects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objectData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create object");
      }

      toast.success("Object created successfully!");
      setIsFormOpen(false);
      fetchObjects();
      fetchAllObjects();
    } catch (error: any) {
      toast.error(error.message || "Failed to create object");
    }
  };

  const handleUpdate = async (objectData: Omit<ObjectItem, "id" | "created_at" | "updated_at" | "parent">) => {
    if (!editingObject) return;

    try {
      const response = await fetch(`/api/objects/${editingObject.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objectData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update object");
      }

      toast.success("Object updated successfully!");
      setEditingObject(null);
      setIsFormOpen(false);
      fetchObjects();
      fetchAllObjects();
    } catch (error: any) {
      toast.error(error.message || "Failed to update object");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/objects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete object");
      }

      toast.success("Object deleted successfully!");
      setDeletingObjectId(null);
      fetchObjects();
      fetchAllObjects();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete object");
    }
  };

  const handleEdit = (object: ObjectItem) => {
    setEditingObject(object);
    setIsFormOpen(true);
  };

  const handleView = (object: ObjectItem) => {
    setViewingObject(object);
    setIsViewOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingObject(null);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewingObject(null);
  };

  const copyNamespace = (namespace: string) => {
    navigator.clipboard.writeText(namespace);
    toast.success("Namespace copied to clipboard!");
  };

  const getTypeLabel = (type: number) => TYPE_LABELS[type] || `Type ${type}`;

  const getParentName = (parentId: number | null) => {
    if (!parentId) return "-";
    const parent = allObjects.find(o => o.id === parentId);
    return parent?.name || `ID: ${parentId}`;
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h2>Objects Management</h2>
          <p className="text-muted-foreground">
            Manage system objects, menus, and permissions
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add Object
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search objects..."
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
              <TableHead>Type</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading objects...
                </TableCell>
              </TableRow>
            ) : objects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No objects found.
                </TableCell>
              </TableRow>
            ) : (
              objects.map((object) => (
                <TableRow key={object.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {object.icon && <span>{object.icon}</span>}
                      {object.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {object.namespace}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyNamespace(object.namespace)}
                        title="Copy namespace"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getTypeLabel(object.type)}</Badge>
                  </TableCell>
                  <TableCell>
                    {object.parent_id ? (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <ChevronRight className="h-3 w-3" />
                        {getParentName(object.parent_id)}
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{object.order_no ?? "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={object.status === 1 ? "default" : "secondary"}
                    >
                      {object.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(object)}
                        title="View object details"
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(object)}
                        title="Edit object"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingObjectId(object.id)}
                        title="Delete object"
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
        Showing {objects.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
        {Math.min(currentPage * pageSize, total)} of {total} objects
      </div>

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-2xl sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingObject ? "Edit Object" : "Create New Object"}
            </DialogTitle>
          </DialogHeader>
          <ObjectForm
            object={editingObject}
            allObjects={allObjects}
            onSubmit={editingObject ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {viewingObject && (
        <DynamicView
          data={viewingObject}
          open={isViewOpen}
          onOpenChange={handleCloseView}
          title="Object Details"
          header={{
            type: "simple",
            title: (data: ObjectItem) => data.name,
            subtitle: (data: ObjectItem) => data.namespace,
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
                { 
                  name: "type", 
                  label: "Type", 
                  type: "text",
                  render: (value: number) => getTypeLabel(value),
                },
                { name: "icon", label: "Icon", type: "text" },
                { 
                  name: "parent_id", 
                  label: "Parent", 
                  type: "text",
                  render: (value: number | null) => getParentName(value),
                },
                { name: "order_no", label: "Order", type: "text" },
                { name: "description", label: "Description", type: "text", colSpan: 12 },
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
          maxWidth="2xl"
        />
      )}

      <AlertDialog
        open={!!deletingObjectId}
        onOpenChange={(open) => !open && setDeletingObjectId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the object and may affect related permissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingObjectId && handleDelete(deletingObjectId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
