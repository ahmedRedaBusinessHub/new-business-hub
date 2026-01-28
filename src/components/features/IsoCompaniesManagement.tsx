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
import { IsoCompanyForm } from "./IsoCompanyForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import DynamicView from "../shared/DynamicView";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { useI18n } from "@/hooks/useI18n";

export interface IsoCompany {
  id: number;
  company_name: string | null;
  name: string;
  position: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  notes: string | null;
  image_id: number | null;
  image_url?: string | null;
  status: number;
  organization_id: number;
  created_at: string | null;
  updated_at: string | null;
}

export function IsoCompaniesManagement() {
  const { t } = useI18n("admin");
  const [isoCompanies, setIsoCompanies] = useState<IsoCompany[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<IsoCompany | null>(null);
  const [viewingCompany, setViewingCompany] = useState<IsoCompany | null>(null);
  const [deletingCompanyId, setDeletingCompanyId] = useState<number | null>(null);
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

  const fetchIsoCompanies = useCallback(async () => {
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
      const response = await fetch(`/api/iso-companies?${paramsString}`);
      if (!response.ok) {
        throw new Error(t("entities.isoCompanies.failedToLoad"));
      }
      const data = await response.json();
      const companiesData = Array.isArray(data.data) ? data.data : [];
      setIsoCompanies(companiesData);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error: any) {
      console.error("Error fetching ISO companies:", error);
      toast.error(t("entities.isoCompanies.failedToLoad"));
      setIsoCompanies([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchIsoCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, debouncedSearch]);

  const handleCreate = async (companyData: Omit<IsoCompany, "id" | "created_at" | "updated_at" | "image_url"> & { mainImage?: File[] }) => {
    try {
      const { mainImage, ...payload } = companyData;
      const response = await fetch("/api/iso-companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("entities.isoCompanies.failedToCreate"));
      }

      const responseData = await response.json();
      const companyId = responseData.id || responseData.data?.id;

      // Upload image if provided
      if (mainImage && Array.isArray(mainImage) && mainImage.length > 0 && companyId) {
        const imageFile = mainImage[0];
        if (imageFile instanceof File) {
          await uploadCompanyImage(companyId, imageFile);
        }
      }

      toast.success(t("entities.isoCompanies.created"));
      setIsFormOpen(false);
      fetchIsoCompanies();
    } catch (error: any) {
      toast.error(error.message || t("entities.isoCompanies.failedToCreate"));
    }
  };

  const handleUpdate = async (companyData: Omit<IsoCompany, "id" | "created_at" | "updated_at" | "image_url"> & { mainImage?: File[] }) => {
    if (!editingCompany) return;

    try {
      const { mainImage, ...payload } = companyData;
      const response = await fetch(`/api/iso-companies/${editingCompany.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("entities.isoCompanies.failedToUpdate"));
      }

      // Upload image if provided
      if (mainImage && Array.isArray(mainImage) && mainImage.length > 0) {
        const imageFile = mainImage[0];
        if (imageFile instanceof File) {
          await uploadCompanyImage(editingCompany.id, imageFile);
        }
      }

      toast.success(t("entities.isoCompanies.updated"));
      setEditingCompany(null);
      setIsFormOpen(false);
      fetchIsoCompanies();
    } catch (error: any) {
      toast.error(error.message || t("entities.isoCompanies.failedToUpdate"));
    }
  };

  const uploadCompanyImage = async (companyId: number, imageFile: File) => {
    try {
      const formData = new FormData();
      formData.append("files", imageFile);
      formData.append("refColumn", "image_id");

      const response = await fetch(`/api/iso-companies/${companyId}/upload`, {
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
      const response = await fetch(`/api/iso-companies/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("entities.isoCompanies.failedToDelete"));
      }

      toast.success(t("entities.isoCompanies.deleted"));
      setDeletingCompanyId(null);
      fetchIsoCompanies();
    } catch (error: any) {
      toast.error(error.message || t("entities.isoCompanies.failedToDelete"));
    }
  };

  const handleEdit = (company: IsoCompany) => {
    setEditingCompany(company);
    setIsFormOpen(true);
  };

  const handleView = (company: IsoCompany) => {
    setViewingCompany(company);
    setIsViewOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCompany(null);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewingCompany(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h2>ISO Companies Management</h2>
          <p className="text-muted-foreground">
            Manage ISO companies with full CRUD operations
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add ISO Company
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("entities.isoCompanies.search")}
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
              <TableHead>Contact Person</TableHead>
              <TableHead>{t("users.email")}</TableHead>
              <TableHead>{t("users.mobile")}</TableHead>
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
            ) : isoCompanies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {t("table.noResults")}
                </TableCell>
              </TableRow>
            ) : (
              isoCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.company_name || "-"}</TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.email || "-"}</TableCell>
                  <TableCell>{company.phone || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={company.status === 1 ? "default" : "secondary"}
                    >
                      {company.status === 1 ? t("common.active") : t("common.inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(company)}
                        title={t("entities.isoCompanies.viewDetails")}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(company)}
                        title={t("entities.isoCompanies.editTooltip")}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingCompanyId(company.id)}
                        title={t("entities.isoCompanies.deleteTooltip")}
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
        Showing {isoCompanies.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
        {Math.min(currentPage * pageSize, total)} of {total} ISO companies
      </div>

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-4xl sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCompany ? t("entities.isoCompanies.edit") : t("entities.isoCompanies.createNew")}
            </DialogTitle>
          </DialogHeader>
          <IsoCompanyForm
            company={editingCompany}
            onSubmit={editingCompany ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {viewingCompany && (
        <DynamicView
          data={viewingCompany}
          open={isViewOpen}
          onOpenChange={handleCloseView}
          title={t("entities.isoCompanies.details")}
          header={{
            type: "avatar",
            title: (data: IsoCompany) => data.company_name || data.name || "ISO Company",
            subtitle: (data: IsoCompany) => data.position || "",
            imageIdField: "image_id",
            avatarFallback: (data: IsoCompany) => 
              data.company_name?.[0] || data.name?.[0] || "I",
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
                { name: "company_name", label: "Company Name", type: "text", colSpan: 12 },
                { name: "name", label: "Contact Person", type: "text", colSpan: 12 },
                { name: "position", label: "Position", type: "text" },
                { name: "email", label: "Email", type: "text" },
                { name: "phone", label: "Phone", type: "text" },
                { name: "website", label: "Website", type: "text" },
                { name: "address", label: "Address", type: "text", colSpan: 12 },
                { name: "notes", label: "Notes", type: "text", colSpan: 12 },
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
        open={!!deletingCompanyId}
        onOpenChange={(open) => !open && setDeletingCompanyId(null)}
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
              onClick={() => deletingCompanyId && handleDelete(deletingCompanyId)}
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
