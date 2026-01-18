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
import { NewsForm } from "./NewsForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import DynamicView, { type ViewTab } from "../shared/DynamicView";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

export interface News {
  id: number;
  title_ar: string;
  title_en: string | null;
  detail_ar: string | null;
  detail_en: string | null;
  social_media: any;
  status: number;
  organization_id: number;
  main_image_url?: string | null; // Image URL from API response
  created_at: string | null;
  updated_at: string | null;
}

export function NewsManagement() {
  const [news, setNews] = useState<News[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [viewingNews, setViewingNews] = useState<News | null>(null);
  const [deletingNewsId, setDeletingNewsId] = useState<number | null>(null);
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

  const fetchNews = useCallback(async () => {
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
      const response = await fetch(`/api/news?${paramsString}`);
      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }
      const data = await response.json();
      const newsData = Array.isArray(data.data) ? data.data : [];
      setNews(newsData);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error: any) {
      console.error("Error fetching news:", error);
      toast.error("Failed to load news");
      setNews([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleCreate = async (newsData: Omit<News, "id" | "created_at" | "updated_at" | "main_image_url" | "social_media"> & { mainImage?: File[] }) => {
    try {
      const { mainImage, ...payload } = newsData;
      const response = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create news");
      }

      const responseData = await response.json();
      const newsId = responseData.id || responseData.data?.id;

      // Upload image if provided
      if (mainImage && Array.isArray(mainImage) && mainImage.length > 0 && newsId) {
        const imageFile = mainImage[0];
        if (imageFile instanceof File) {
          await uploadNewsImage(newsId, imageFile);
        }
      }

      toast.success("News created successfully!");
      setIsFormOpen(false);
      fetchNews();
    } catch (error: any) {
      toast.error(error.message || "Failed to create news");
    }
  };

  const handleUpdate = async (newsData: Omit<News, "id" | "created_at" | "updated_at" | "main_image_url" | "social_media"> & { mainImage?: File[] }) => {
    if (!editingNews) return;

    try {
      const { mainImage, ...payload } = newsData;
      const response = await fetch(`/api/news/${editingNews.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update news");
      }

      // Upload image if provided
      if (mainImage && Array.isArray(mainImage) && mainImage.length > 0) {
        const imageFile = mainImage[0];
        if (imageFile instanceof File) {
          await uploadNewsImage(editingNews.id, imageFile);
        }
      }

      toast.success("News updated successfully!");
      setEditingNews(null);
      setIsFormOpen(false);
      fetchNews();
    } catch (error: any) {
      toast.error(error.message || "Failed to update news");
    }
  };

  const uploadNewsImage = async (newsId: number, imageFile: File) => {
    try {
      const formData = new FormData();
      formData.append("files", imageFile);
      formData.append("refColumn", "main_image_id");

      const response = await fetch(`/api/news/${newsId}/upload`, {
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
      const response = await fetch(`/api/news/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete news");
      }

      toast.success("News deleted successfully!");
      setDeletingNewsId(null);
      fetchNews();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete news");
    }
  };

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setIsFormOpen(true);
  };

  const handleView = (newsItem: News) => {
    setViewingNews(newsItem);
    setIsViewOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingNews(null);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewingNews(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h2>News Management</h2>
          <p className="text-muted-foreground">
            Manage news articles with full CRUD operations
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add News
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search news..."
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
              <TableHead>Title (AR)</TableHead>
              <TableHead>Title (EN)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Loading news...
                </TableCell>
              </TableRow>
            ) : news.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No news found.
                </TableCell>
              </TableRow>
            ) : (
              news.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title_ar}</TableCell>
                  <TableCell>{item.title_en || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={item.status === 1 ? "default" : "secondary"}
                    >
                      {item.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(item)}
                        title="View news details"
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(item)}
                        title="Edit news"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingNewsId(item.id)}
                        title="Delete news"
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
        Showing {news.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
        {Math.min(currentPage * pageSize, total)} of {total} news
      </div>

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-4xl sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingNews ? "Edit News" : "Create New News"}
            </DialogTitle>
          </DialogHeader>
          <NewsForm
            news={editingNews}
            onSubmit={editingNews ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {viewingNews && (
        <DynamicView
          data={viewingNews}
          open={isViewOpen}
          onOpenChange={handleCloseView}
          title="News Details"
          header={{
            type: "avatar",
            title: (data: News) => data.title_ar || data.title_en || "News",
            subtitle: (data: News) => data.detail_ar || data.detail_en || "",
            imageIdField: "main_image_id",
            avatarFallback: (data: News) => 
              data.title_ar?.[0] || data.title_en?.[0] || "N",
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
                { name: "title_ar", label: "Title (AR)", type: "text", colSpan: 12 },
                { name: "title_en", label: "Title (EN)", type: "text", colSpan: 12 },
                { name: "detail_ar", label: "Detail (AR)", type: "text", colSpan: 12 },
                { name: "detail_en", label: "Detail (EN)", type: "text", colSpan: 12 },
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
        open={!!deletingNewsId}
        onOpenChange={(open) => !open && setDeletingNewsId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the news article.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingNewsId && handleDelete(deletingNewsId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

