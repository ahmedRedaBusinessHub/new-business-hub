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
import { useI18n } from "@/hooks/useI18n";

export interface News {
  id: number;
  title_ar: string;
  title_en: string | null;
  detail_ar: string | null;
  detail_en: string | null;
  social_media: any;
  status: number;
  organization_id: number;
  main_image_id?: number | null;
  main_image_url?: string | null;
  image_ids?: number[];
  image_urls?: string[];
  created_at: string | null;
  updated_at: string | null;
}

export function NewsManagement() {
  const { t } = useI18n("admin");
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
        throw new Error(t("entities.news.failedToLoad"));
      }
      const data = await response.json();
      const newsData = Array.isArray(data.data) ? data.data : [];
      setNews(newsData);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error: any) {
      console.error("Error fetching news:", error);
      toast.error(t("entities.news.failedToLoad"));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, debouncedSearch]);

  const handleCreate = async (newsData: Omit<News, "id" | "created_at" | "updated_at" | "main_image_url"> & { mainImage?: File[]; imageIds?: File[] }) => {
    try {
      const { mainImage, imageIds, ...payload } = newsData;
      const response = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("entities.news.failedToCreate"));
      }

      const responseData = await response.json();
      const newsId = responseData.id || responseData.data?.id;

      // Upload main image if provided
      if (mainImage && Array.isArray(mainImage) && mainImage.length > 0 && newsId) {
        const imageFile = mainImage[0];
        if (imageFile instanceof File) {
          await uploadNewsImage(newsId, imageFile, "main_image_id");
        }
      }

      // Upload additional images if provided
      if (imageIds && Array.isArray(imageIds) && imageIds.length > 0 && newsId) {
        await uploadNewsFiles(newsId, imageIds, "image_ids");
      }

      toast.success(t("entities.news.created"));
      setIsFormOpen(false);
      fetchNews();
    } catch (error: any) {
        toast.error(error.message || t("entities.news.failedToCreate"));
    }
  };

  const handleUpdate = async (newsData: Omit<News, "id" | "created_at" | "updated_at" | "main_image_url"> & { mainImage?: File[]; imageIds?: File[] }) => {
    if (!editingNews) return;

    try {
      const { mainImage, imageIds, ...payload } = newsData;
      const response = await fetch(`/api/news/${editingNews.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("entities.news.failedToUpdate"));
      }

      // Upload main image if provided
      if (mainImage && Array.isArray(mainImage) && mainImage.length > 0) {
        const imageFile = mainImage[0];
        if (imageFile instanceof File) {
          await uploadNewsImage(editingNews.id, imageFile, "main_image_id");
        }
      }

      // Upload additional images if provided
      if (imageIds && Array.isArray(imageIds) && imageIds.length > 0) {
        await uploadNewsFiles(editingNews.id, imageIds, "image_ids");
      }

      toast.success(t("entities.news.updated"));
      setEditingNews(null);
      setIsFormOpen(false);
      fetchNews();
    } catch (error: any) {
        toast.error(error.message || t("entities.news.failedToUpdate"));
    }
  };

  const uploadNewsImage = async (newsId: number, imageFile: File, refColumn: string = "main_image_id") => {
    try {
      const formData = new FormData();
      formData.append("files", imageFile);
      formData.append("refColumn", refColumn);

      const response = await fetch(`/api/news/${newsId}/upload`, {
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

  const uploadNewsFiles = async (newsId: number, files: File[], refColumn: string) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("refColumn", refColumn);

      const response = await fetch(`/api/news/${newsId}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(t("entities.news.failedToUploadFiles"));
      }
    } catch (error: any) {
      console.error("Error uploading files:", error);
      toast.error(t("entities.news.failedToUploadFiles"));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("entities.news.failedToDelete"));
      }

      toast.success(t("entities.news.deleted"));
      setDeletingNewsId(null);
      fetchNews();
    } catch (error: any) {
      toast.error(error.message || t("entities.news.failedToDelete"));
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
          <h2>{t("entities.news.title")}</h2>
          <p className="text-muted-foreground">
            {t("entities.news.subtitle")}
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 size-4" />
          {t("entities.news.add")}
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("entities.news.search")}
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
              <TableHead>{t("common.status")}</TableHead>
              <TableHead className="text-right">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  {t("common.loading")}
                </TableCell>
              </TableRow>
            ) : news.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  {t("common.noData")}
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
                      {item.status === 1 ? t("common.active") : t("common.inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(item)}
                        title={t("entities.news.viewDetails")}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(item)}
                        title={t("entities.news.editTooltip")}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingNewsId(item.id)}
                        title={t("entities.news.deleteTooltip")}
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
        {t("table.showing")} {news.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} {t("table.of")}{" "}
        {Math.min(currentPage * pageSize, total)} {t("table.of")} {total} {t("table.results")}
      </div>

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-4xl sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingNews ? t("entities.news.edit") : t("entities.news.createNew")}
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
          title={t("entities.news.details")}
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
            {
              id: "social",
              label: "Social Media",
              customContent: (data: News) => {
                const socialMedia = typeof data.social_media === 'string' 
                  ? JSON.parse(data.social_media || '{}') 
                  : (data.social_media || {});
                const platforms = Object.entries(socialMedia).filter(([_, url]) => url);
                if (platforms.length === 0) {
                  return <p className="text-muted-foreground">No social media links</p>;
                }
                return (
                  <div className="space-y-2">
                    {platforms.map(([platform, url]) => (
                      <div key={platform} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                        <span className="capitalize font-medium w-24">{platform}:</span>
                        <a 
                          href={url as string} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate"
                        >
                          {url as string}
                        </a>
                      </div>
                    ))}
                  </div>
                );
              },
            },
            {
              id: "images",
              label: "Images",
              customContent: (data: News) => {
                const hasMainImage = data.main_image_url;
                const hasImages = data.image_urls && data.image_urls.length > 0;
                if (!hasMainImage && !hasImages) {
                  return <p className="text-muted-foreground">No images uploaded</p>;
                }
                return (
                  <div className="space-y-6">
                    {hasMainImage && (
                      <div>
                        <p className="text-sm font-medium mb-2">Main Image</p>
                        <img
                          src={data.main_image_url!.startsWith('http') || data.main_image_url!.startsWith('/api/public/file') 
                            ? data.main_image_url! 
                            : `/api/public/file?file_url=${encodeURIComponent(data.main_image_url!)}`}
                          alt="Main"
                          className="max-w-xs h-auto rounded-lg border"
                        />
                      </div>
                    )}
                    {hasImages && (
                      <div>
                        <p className="text-sm font-medium mb-2">Gallery Images</p>
                        <div className="grid grid-cols-3 gap-4">
                          {data.image_urls!.filter(url => url != null).map((url, index) => (
                            <img
                              key={index}
                              src={url.startsWith('http') || url.startsWith('/api/public/file') 
                                ? url 
                                : `/api/public/file?file_url=${encodeURIComponent(url)}`}
                              alt={`Image ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              },
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
            <AlertDialogTitle>{t("common.areYouSure")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("common.thisActionCannotBeUndone")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingNewsId && handleDelete(deletingNewsId)}
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

