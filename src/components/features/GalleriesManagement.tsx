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
import { GalleryForm } from "./GalleryForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import DynamicView from "../shared/DynamicView";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

export interface Gallery {
  id: number;
  title_en: string | null;
  title_ar: string;
  main_image_id: number | null;
  main_image_url?: string | null;
  image_ids: number[];
  image_urls?: string[];
  status: number;
  organization_id: number;
  created_at: string | null;
  updated_at: string | null;
}

export function GalleriesManagement() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [viewingGallery, setViewingGallery] = useState<Gallery | null>(null);
  const [deletingGalleryId, setDeletingGalleryId] = useState<number | null>(null);
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

  const fetchGalleries = useCallback(async () => {
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
      const response = await fetch(`/api/galleries?${paramsString}`);
      if (!response.ok) {
        throw new Error("Failed to fetch galleries");
      }
      const data = await response.json();
      const galleriesData = Array.isArray(data.data) ? data.data : [];
      setGalleries(galleriesData);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error: any) {
      console.error("Error fetching galleries:", error);
      toast.error("Failed to load galleries");
      setGalleries([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchGalleries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, debouncedSearch]);

  const handleCreate = async (galleryData: Omit<Gallery, "id" | "created_at" | "updated_at" | "main_image_url" | "image_urls"> & { mainImage?: File[]; imageIds?: File[] }) => {
    try {
      const { mainImage, imageIds, ...payload } = galleryData;
      const response = await fetch("/api/galleries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create gallery");
      }

      const responseData = await response.json();
      const galleryId = responseData.id || responseData.data?.id;

      // Upload main image if provided
      if (mainImage && Array.isArray(mainImage) && mainImage.length > 0 && galleryId) {
        const imageFile = mainImage[0];
        if (imageFile instanceof File) {
          await uploadGalleryImage(galleryId, imageFile, "main_image_id");
        }
      }

      // Upload gallery images if provided
      if (imageIds && Array.isArray(imageIds) && imageIds.length > 0 && galleryId) {
        await uploadGalleryImages(galleryId, imageIds);
      }

      toast.success("Gallery created successfully!");
      setIsFormOpen(false);
      fetchGalleries();
    } catch (error: any) {
      toast.error(error.message || "Failed to create gallery");
    }
  };

  const handleUpdate = async (galleryData: Omit<Gallery, "id" | "created_at" | "updated_at" | "main_image_url" | "image_urls"> & { mainImage?: File[]; imageIds?: File[] }) => {
    if (!editingGallery) return;

    try {
      const { mainImage, imageIds, ...payload } = galleryData;
      const response = await fetch(`/api/galleries/${editingGallery.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update gallery");
      }

      // Upload main image if provided
      if (mainImage && Array.isArray(mainImage) && mainImage.length > 0) {
        const imageFile = mainImage[0];
        if (imageFile instanceof File) {
          await uploadGalleryImage(editingGallery.id, imageFile, "main_image_id");
        }
      }

      // Upload gallery images if provided
      if (imageIds && Array.isArray(imageIds) && imageIds.length > 0) {
        await uploadGalleryImages(editingGallery.id, imageIds);
      }

      toast.success("Gallery updated successfully!");
      setEditingGallery(null);
      setIsFormOpen(false);
      fetchGalleries();
    } catch (error: any) {
      toast.error(error.message || "Failed to update gallery");
    }
  };

  const uploadGalleryImage = async (galleryId: number, imageFile: File, refColumn: string = "main_image_id") => {
    try {
      const formData = new FormData();
      formData.append("files", imageFile);
      formData.append("refColumn", refColumn);

      const response = await fetch(`/api/galleries/${galleryId}/upload`, {
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

  const uploadGalleryImages = async (galleryId: number, imageFiles: File[]) => {
    try {
      const formData = new FormData();
      imageFiles.forEach((file) => {
        if (file instanceof File) {
          formData.append("files", file);
        }
      });
      formData.append("refColumn", "image_ids");

      const response = await fetch(`/api/galleries/${galleryId}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload gallery images");
      }
    } catch (error: any) {
      console.error("Error uploading gallery images:", error);
      toast.error("Failed to upload gallery images");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/galleries/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete gallery");
      }

      toast.success("Gallery deleted successfully!");
      setDeletingGalleryId(null);
      fetchGalleries();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete gallery");
    }
  };

  const handleEdit = (gallery: Gallery) => {
    setEditingGallery(gallery);
    setIsFormOpen(true);
  };

  const handleView = (gallery: Gallery) => {
    setViewingGallery(gallery);
    setIsViewOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingGallery(null);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewingGallery(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h2>Galleries Management</h2>
          <p className="text-muted-foreground">
            Manage galleries with full CRUD operations
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add Gallery
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search galleries..."
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
              <TableHead>Title (Arabic)</TableHead>
              <TableHead>Title (English)</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading galleries...
                </TableCell>
              </TableRow>
            ) : galleries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No galleries found.
                </TableCell>
              </TableRow>
            ) : (
              galleries.map((gallery) => (
                <TableRow key={gallery.id}>
                  <TableCell className="font-medium">{gallery.title_ar}</TableCell>
                  <TableCell>{gallery.title_en || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {gallery.image_ids?.length || 0} images
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={gallery.status === 1 ? "default" : "secondary"}
                    >
                      {gallery.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(gallery)}
                        title="View gallery details"
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(gallery)}
                        title="Edit gallery"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingGalleryId(gallery.id)}
                        title="Delete gallery"
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
        Showing {galleries.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
        {Math.min(currentPage * pageSize, total)} of {total} galleries
      </div>

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-3xl sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingGallery ? "Edit Gallery" : "Create New Gallery"}
            </DialogTitle>
          </DialogHeader>
          <GalleryForm
            gallery={editingGallery}
            onSubmit={editingGallery ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {viewingGallery && (
        <DynamicView
          data={viewingGallery}
          open={isViewOpen}
          onOpenChange={handleCloseView}
          title="Gallery Details"
          header={{
            type: "avatar",
            title: (data: Gallery) => data.title_ar || "Gallery",
            subtitle: (data: Gallery) => data.title_en || "",
            imageIdField: "main_image_id",
            avatarFallback: (data: Gallery) => 
              data.title_ar?.[0] || data.title_en?.[0] || "G",
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
                { name: "title_ar", label: "Title (Arabic)", type: "text", colSpan: 12 },
                { name: "title_en", label: "Title (English)", type: "text", colSpan: 12 },
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
              id: "images",
              label: "Images",
              customContent: (data: Gallery) => {
                const mainImageUrl = data.main_image_url;
                const imageUrls = data.image_urls || [];
                
                return (
                  <div className="space-y-6">
                    {mainImageUrl && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Main Image</h4>
                        <div className="border rounded-lg overflow-hidden w-fit">
                          <img
                            src={mainImageUrl.startsWith('http') || mainImageUrl.startsWith('/api/public/file') 
                              ? mainImageUrl 
                              : `/api/public/file?file_url=${encodeURIComponent(mainImageUrl)}`}
                            alt="Main"
                            className="max-w-xs max-h-48 object-cover"
                          />
                        </div>
                      </div>
                    )}
                    
                    {imageUrls.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Gallery Images ({imageUrls.length})</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {imageUrls.map((url, index) => (
                            <div key={index} className="border rounded-lg overflow-hidden">
                              <img
                                src={url.startsWith('http') || url.startsWith('/api/public/file') 
                                  ? url 
                                  : `/api/public/file?file_url=${encodeURIComponent(url)}`}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-32 object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {!mainImageUrl && imageUrls.length === 0 && (
                      <p className="text-muted-foreground text-sm">No images uploaded</p>
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
        open={!!deletingGalleryId}
        onOpenChange={(open) => !open && setDeletingGalleryId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the gallery and all its images.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingGalleryId && handleDelete(deletingGalleryId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
