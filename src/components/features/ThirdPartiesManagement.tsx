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
import { ThirdPartyForm } from "./ThirdPartyForm";
import { ThirdPartyServicesManagement } from "./ThirdPartyServicesManagement";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import DynamicView, { type ViewTab } from "../shared/DynamicView";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { useI18n } from "@/hooks/useI18n";

export interface ThirdParty {
  id: number;
  name: string;
  namespace: string;
  website: string | null;
  status: number;
  order_no: number | null;
  organization_id: number;
  image_url?: string | null; // Image URL from API response
  created_at: string | null;
  updated_at: string | null;
}

export function ThirdPartiesManagement() {
  const { t } = useI18n("admin");
  const [thirdParties, setThirdParties] = useState<ThirdParty[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingThirdParty, setEditingThirdParty] = useState<ThirdParty | null>(null);
  const [viewingThirdParty, setViewingThirdParty] = useState<ThirdParty | null>(null);
  const [deletingThirdPartyId, setDeletingThirdPartyId] = useState<number | null>(null);
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

  const fetchThirdParties = useCallback(async () => {
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
      const response = await fetch(`/api/third-parties?${paramsString}`);
      if (!response.ok) {
        throw new Error(t("entities.thirdParties.failedToLoad"));
      }
      const data = await response.json();
      const thirdPartiesData = Array.isArray(data.data) ? data.data : [];
      setThirdParties(thirdPartiesData);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error: any) {
      console.error("Error fetching third parties:", error);
      toast.error(t("entities.thirdParties.failedToLoad"));
      setThirdParties([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchThirdParties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, debouncedSearch]);

  const handleCreate = async (thirdPartyData: Omit<ThirdParty, "id" | "created_at" | "updated_at" | "image_url"> & { profileImage?: File[] }) => {
    try {
      const { profileImage, ...payload } = thirdPartyData;
      const response = await fetch("/api/third-parties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("entities.thirdParties.failedToCreate"));
      }

      const responseData = await response.json();
      const thirdPartyId = responseData.id || responseData.data?.id;

      // Upload image if provided
      if (profileImage && Array.isArray(profileImage) && profileImage.length > 0 && thirdPartyId) {
        const imageFile = profileImage[0];
        if (imageFile instanceof File) {
          await uploadThirdPartyImage(thirdPartyId, imageFile);
        }
      }

      toast.success(t("entities.thirdParties.created"));
      setIsFormOpen(false);
      fetchThirdParties();
    } catch (error: any) {
      toast.error(error.message || t("entities.thirdParties.failedToCreate"));
    }
  };

  const handleUpdate = async (thirdPartyData: Omit<ThirdParty, "id" | "created_at" | "updated_at" | "image_url"> & { profileImage?: File[] }) => {
    if (!editingThirdParty) return;

    try {
      const { profileImage, ...payload } = thirdPartyData;
      const response = await fetch(`/api/third-parties/${editingThirdParty.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("entities.thirdParties.failedToUpdate"));
      }

      // Upload image if provided
      if (profileImage && Array.isArray(profileImage) && profileImage.length > 0) {
        const imageFile = profileImage[0];
        if (imageFile instanceof File) {
          await uploadThirdPartyImage(editingThirdParty.id, imageFile);
        }
      }

      toast.success(t("entities.thirdParties.updated"));
      setEditingThirdParty(null);
      setIsFormOpen(false);
      fetchThirdParties();
    } catch (error: any) {
      toast.error(error.message || t("entities.thirdParties.failedToUpdate"));
    }
  };

  const uploadThirdPartyImage = async (thirdPartyId: number, imageFile: File) => {
    try {
      const formData = new FormData();
      formData.append("files", imageFile);
      formData.append("refColumn", "image_id");

      const response = await fetch(`/api/third-parties/${thirdPartyId}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(t("entities.news.failedToUploadImage"));
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(t("entities.news.failedToUploadImage"));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/third-parties/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("entities.thirdParties.failedToDelete"));
      }

      toast.success(t("entities.thirdParties.deleted"));
      setDeletingThirdPartyId(null);
      fetchThirdParties();
    } catch (error: any) {
      toast.error(error.message || t("entities.thirdParties.failedToDelete"));
    }
  };

  const handleEdit = (thirdParty: ThirdParty) => {
    setEditingThirdParty(thirdParty);
    setIsFormOpen(true);
  };

  const handleView = (thirdParty: ThirdParty) => {
    setViewingThirdParty(thirdParty);
    setIsViewOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingThirdParty(null);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewingThirdParty(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h2>Third Parties Management</h2>
          <p className="text-muted-foreground">
            Manage third parties with services and logs
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add Third Party
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("entities.thirdParties.search")}
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("common.name")}</TableHead>
              <TableHead>{t("roles.namespace")}</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>{t("objects.orderNo")}</TableHead>
              <TableHead>{t("common.status")}</TableHead>
              <TableHead className="text-right">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {t("common.loading")}
                </TableCell>
              </TableRow>
            ) : thirdParties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {t("table.noResults")}
                </TableCell>
              </TableRow>
            ) : (
              thirdParties.map((tp) => (
                <TableRow key={tp.id}>
                  <TableCell className="font-medium">{tp.name}</TableCell>
                  <TableCell>{tp.namespace}</TableCell>
                  <TableCell>{tp.website || "-"}</TableCell>
                  <TableCell>{tp.order_no || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={tp.status === 1 ? "default" : "secondary"}
                    >
                      {tp.status === 1 ? t("common.active") : t("common.inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(tp)}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(tp)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingThirdPartyId(tp.id)}
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
        {t("table.showing")} {thirdParties.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
        {Math.min(currentPage * pageSize, total)} {t("table.of")} {total} {t("table.results")}
      </div>

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-4xl sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingThirdParty ? t("entities.thirdParties.edit") : t("entities.thirdParties.createNew")}
            </DialogTitle>
          </DialogHeader>
          <ThirdPartyForm
            thirdParty={editingThirdParty}
            onSubmit={editingThirdParty ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {viewingThirdParty && (
        <DynamicView
          data={viewingThirdParty}
          open={isViewOpen}
          onOpenChange={handleCloseView}
          title={t("entities.thirdParties.details")}
          header={{
            type: "avatar",
            title: (data: ThirdParty) => data.name || "Third Party",
            subtitle: (data: ThirdParty) => data.website || data.namespace || "",
            imageIdField: "image_id",
            avatarFallback: (data: ThirdParty) => 
              data.name?.[0] || "T",
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
                { name: "name", label: "Name", type: "text" },
                { name: "namespace", label: "Namespace", type: "text" },
                { name: "website", label: "Website", type: "text" },
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
            {
              id: "services",
              label: "Services",
              customContent: <ThirdPartyServicesManagement thirdPartyId={viewingThirdParty.id} />,
            },
          ]}
          maxWidth="4xl"
        />
      )}

      <AlertDialog
        open={!!deletingThirdPartyId}
        onOpenChange={(open) => !open && setDeletingThirdPartyId(null)}
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
              onClick={() => deletingThirdPartyId && handleDelete(deletingThirdPartyId)}
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

