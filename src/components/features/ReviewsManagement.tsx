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
import { ReviewForm } from "./ReviewForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import DynamicView, { type ViewTab, type ViewHeader } from "../shared/DynamicView";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { useI18n } from "@/hooks/useI18n";

export interface Review {
  id: number;
  name_en: string | null;
  name_ar: string;
  comment_en: string | null;
  comment_ar: string | null;
  job_title_en: string | null;
  job_title_ar: string | null;
  status: number;
  organization_id: number;
  image_url?: string | null; // Image URL from API response
  created_at: string | null;
  updated_at: string | null;
}

export function ReviewsManagement() {
  const { t } = useI18n("admin");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [viewingReview, setViewingReview] = useState<Review | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);
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

  const fetchReviews = useCallback(async () => {
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
      const response = await fetch(`/api/reviews?${paramsString}`);
      if (!response.ok) {
        throw new Error(t("entities.reviews.failedToLoad"));
      }
      const data = await response.json();
      const reviewsData = Array.isArray(data.data) ? data.data : [];
      setReviews(reviewsData);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      toast.error(t("entities.reviews.failedToLoad"));
      setReviews([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, debouncedSearch]);

  const handleCreate = async (reviewData: Omit<Review, "id" | "created_at" | "updated_at" | "image_url"> & { profileImage?: File[] }) => {
    try {
      const { profileImage, ...payload } = reviewData;
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("entities.reviews.failedToCreate"));
      }

      const responseData = await response.json();
      const reviewId = responseData.id || responseData.data?.id;

      // Upload image if provided
      if (profileImage && Array.isArray(profileImage) && profileImage.length > 0 && reviewId) {
        const imageFile = profileImage[0];
        if (imageFile instanceof File) {
          await uploadReviewImage(reviewId, imageFile);
        }
      }

      toast.success(t("entities.reviews.created"));
      setIsFormOpen(false);
      fetchReviews();
    } catch (error: any) {
      toast.error(error.message || t("entities.reviews.failedToCreate"));
    }
  };

  const handleUpdate = async (reviewData: Omit<Review, "id" | "created_at" | "updated_at" | "image_url"> & { profileImage?: File[] }) => {
    if (!editingReview) return;

    try {
      const { profileImage, ...payload } = reviewData;
      const response = await fetch(`/api/reviews/${editingReview.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("entities.reviews.failedToUpdate"));
      }

      // Upload image if provided
      if (profileImage && Array.isArray(profileImage) && profileImage.length > 0) {
        const imageFile = profileImage[0];
        if (imageFile instanceof File) {
          await uploadReviewImage(editingReview.id, imageFile);
        }
      }

      toast.success(t("entities.reviews.updated"));
      setEditingReview(null);
      setIsFormOpen(false);
      fetchReviews();
    } catch (error: any) {
      toast.error(error.message || t("entities.reviews.failedToUpdate"));
    }
  };

  const uploadReviewImage = async (reviewId: number, imageFile: File) => {
    try {
      const formData = new FormData();
      formData.append("files", imageFile);
      formData.append("refColumn", "image_id");

      const response = await fetch(`/api/reviews/${reviewId}/upload`, {
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
      const response = await fetch(`/api/reviews/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("entities.reviews.failedToDelete"));
      }

      toast.success(t("entities.reviews.deleted"));
      setDeletingReviewId(null);
      fetchReviews();
    } catch (error: any) {
      toast.error(error.message || t("entities.reviews.failedToDelete"));
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setIsFormOpen(true);
  };

  const handleView = (review: Review) => {
    setViewingReview(review);
    setIsViewOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingReview(null);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewingReview(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h2>{t("entities.reviews.title")}</h2>
          <p className="text-muted-foreground">
            {t("entities.reviews.subtitle")}
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 size-4" />
          {t("entities.reviews.add")}
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("entities.reviews.search")}
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
              <TableHead>{t("common.name")} (AR)</TableHead>
              <TableHead>{t("common.name")} (EN)</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>{t("common.status")}</TableHead>
              <TableHead className="text-right">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t("common.loading")}
                </TableCell>
              </TableRow>
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t("table.noResults")}
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">{review.name_ar}</TableCell>
                  <TableCell>{review.name_en || "-"}</TableCell>
                  <TableCell>{review.job_title_ar || review.job_title_en || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={review.status === 1 ? "default" : "secondary"}
                    >
                      {review.status === 1 ? t("common.active") : t("common.inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(review)}
                        title={t("entities.reviews.viewDetails")}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(review)}
                        title={t("entities.reviews.editTooltip")}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingReviewId(review.id)}
                        title={t("entities.reviews.deleteTooltip")}
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

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-4xl sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingReview ? t("entities.reviews.edit") : t("entities.reviews.createNew")}
            </DialogTitle>
          </DialogHeader>
          <ReviewForm
            review={editingReview}
            onSubmit={editingReview ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {viewingReview && (
        <DynamicView
          data={viewingReview}
          open={isViewOpen}
          onOpenChange={handleCloseView}
          title={t("entities.reviews.details")}
          header={{
            type: "avatar",
            title: (data: Review) => data.name_ar || data.name_en || "Review",
            subtitle: (data: Review) => data.job_title_ar || data.job_title_en || "",
            imageIdField: "image_id",
            avatarFallback: (data: Review) => 
              data.name_ar?.[0] || data.name_en?.[0] || "R",
            badges: [
              {
                field: "status",
                map: {
                  1: { label: t("common.active"), variant: "default" },
                  0: { label: t("common.inactive"), variant: "secondary" },
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
                { name: "name_ar", label: "Name (AR)", type: "text" },
                { name: "name_en", label: "Name (EN)", type: "text" },
                { name: "job_title_ar", label: "Job Title (AR)", type: "text" },
                { name: "job_title_en", label: "Job Title (EN)", type: "text" },
                { name: "comment_ar", label: "Comment (AR)", type: "text", colSpan: 12 },
                { name: "comment_en", label: "Comment (EN)", type: "text", colSpan: 12 },
                { name: "created_at", label: "Created At", type: "datetime" },
                { name: "updated_at", label: "Updated At", type: "datetime" },
              ],
            },
          ]}
          maxWidth="4xl"
        />
      )}

      <AlertDialog
        open={!!deletingReviewId}
        onOpenChange={(open) => !open && setDeletingReviewId(null)}
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
              onClick={() => deletingReviewId && handleDelete(deletingReviewId)}
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

