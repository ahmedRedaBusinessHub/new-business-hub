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
import { SuccessPartnerForm } from "./SuccessPartnerForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import DynamicView from "../shared/DynamicView";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

export interface SuccessPartner {
  id: number;
  name_en: string | null;
  name_ar: string;
  image_id: number | null;
  image_url?: string | null;
  status: number;
  organization_id: number;
  created_at: string | null;
  updated_at: string | null;
}

export function SuccessPartnersManagement() {
  const [partners, setPartners] = useState<SuccessPartner[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<SuccessPartner | null>(null);
  const [viewingPartner, setViewingPartner] = useState<SuccessPartner | null>(null);
  const [deletingPartnerId, setDeletingPartnerId] = useState<number | null>(null);
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

  const fetchPartners = useCallback(async () => {
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
      const response = await fetch(`/api/success-partners?${paramsString}`);
      if (!response.ok) {
        throw new Error("Failed to fetch success partners");
      }
      const data = await response.json();
      const partnersData = Array.isArray(data.data) ? data.data : [];
      setPartners(partnersData);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error: any) {
      console.error("Error fetching success partners:", error);
      toast.error("Failed to load success partners");
      setPartners([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const handleCreate = async (partnerData: Omit<SuccessPartner, "id" | "created_at" | "updated_at" | "image_url"> & { mainImage?: File[] }) => {
    try {
      const { mainImage, ...payload } = partnerData;
      const response = await fetch("/api/success-partners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create success partner");
      }

      const responseData = await response.json();
      const partnerId = responseData.id || responseData.data?.id;

      // Upload image if provided
      if (mainImage && Array.isArray(mainImage) && mainImage.length > 0 && partnerId) {
        const imageFile = mainImage[0];
        if (imageFile instanceof File) {
          await uploadPartnerImage(partnerId, imageFile);
        }
      }

      toast.success("Success partner created successfully!");
      setIsFormOpen(false);
      fetchPartners();
    } catch (error: any) {
      toast.error(error.message || "Failed to create success partner");
    }
  };

  const handleUpdate = async (partnerData: Omit<SuccessPartner, "id" | "created_at" | "updated_at" | "image_url"> & { mainImage?: File[] }) => {
    if (!editingPartner) return;

    try {
      const { mainImage, ...payload } = partnerData;
      const response = await fetch(`/api/success-partners/${editingPartner.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update success partner");
      }

      // Upload image if provided
      if (mainImage && Array.isArray(mainImage) && mainImage.length > 0) {
        const imageFile = mainImage[0];
        if (imageFile instanceof File) {
          await uploadPartnerImage(editingPartner.id, imageFile);
        }
      }

      toast.success("Success partner updated successfully!");
      setEditingPartner(null);
      setIsFormOpen(false);
      fetchPartners();
    } catch (error: any) {
      toast.error(error.message || "Failed to update success partner");
    }
  };

  const uploadPartnerImage = async (partnerId: number, imageFile: File) => {
    try {
      const formData = new FormData();
      formData.append("files", imageFile);
      formData.append("refColumn", "image_id");

      const response = await fetch(`/api/success-partners/${partnerId}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/success-partners/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete success partner");
      }

      toast.success("Success partner deleted successfully!");
      setDeletingPartnerId(null);
      fetchPartners();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete success partner");
    }
  };

  const handleEdit = (partner: SuccessPartner) => {
    setEditingPartner(partner);
    setIsFormOpen(true);
  };

  const handleView = (partner: SuccessPartner) => {
    setViewingPartner(partner);
    setIsViewOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPartner(null);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewingPartner(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h2>Success Partners Management</h2>
          <p className="text-muted-foreground">
            Manage success partners with full CRUD operations
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add Success Partner
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search success partners..."
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
              <TableHead>Name (Arabic)</TableHead>
              <TableHead>Name (English)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Loading success partners...
                </TableCell>
              </TableRow>
            ) : partners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No success partners found.
                </TableCell>
              </TableRow>
            ) : (
              partners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell className="font-medium">{partner.name_ar}</TableCell>
                  <TableCell>{partner.name_en || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={partner.status === 1 ? "default" : "secondary"}
                    >
                      {partner.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(partner)}
                        title="View success partner details"
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(partner)}
                        title="Edit success partner"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingPartnerId(partner.id)}
                        title="Delete success partner"
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
        Showing {partners.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
        {Math.min(currentPage * pageSize, total)} of {total} success partners
      </div>

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-2xl sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPartner ? "Edit Success Partner" : "Create New Success Partner"}
            </DialogTitle>
          </DialogHeader>
          <SuccessPartnerForm
            partner={editingPartner}
            onSubmit={editingPartner ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {viewingPartner && (
        <DynamicView
          data={viewingPartner}
          open={isViewOpen}
          onOpenChange={handleCloseView}
          title="Success Partner Details"
          header={{
            type: "avatar",
            title: (data: SuccessPartner) => data.name_ar || "Success Partner",
            subtitle: (data: SuccessPartner) => data.name_en || "",
            imageIdField: "image_id",
            avatarFallback: (data: SuccessPartner) => 
              data.name_ar?.[0] || data.name_en?.[0] || "S",
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
                { name: "name_ar", label: "Name (Arabic)", type: "text", colSpan: 12 },
                { name: "name_en", label: "Name (English)", type: "text", colSpan: 12 },
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
        open={!!deletingPartnerId}
        onOpenChange={(open) => !open && setDeletingPartnerId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the success partner.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingPartnerId && handleDelete(deletingPartnerId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
