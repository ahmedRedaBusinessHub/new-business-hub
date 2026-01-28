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
import { ProjectForm } from "./ProjectForm";
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
import { staticListsCache } from "@/lib/staticListsCache";
import { TypeName, CategoryNames } from "./ProjectViewHelpers";

export interface Project {
  id: number;
  title_ar: string;
  title_en: string | null;
  detail_ar: string | null;
  detail_en: string | null;
  type: number | null;
  category_ids: number[];
  link: string | null;
  social_media: any;
  status: number;
  organization_id: number;
  main_image_url?: string | null; // Image URL from API response
  main_image_id?: number | null; // Main image file ID
  image_urls?: string[]; // Additional images
  image_ids?: number[]; // Additional image file IDs
  file_urls?: string[]; // Additional files
  file_ids?: number[]; // Additional file IDs
  created_at: string | null;
  updated_at: string | null;
}

export function ProjectsManagement() {
  const { t } = useI18n("admin");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null);
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

  const fetchProjects = useCallback(async () => {
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
      const response = await fetch(`/api/projects?${paramsString}`);
      if (!response.ok) {
        throw new Error(t("entities.projects.failedToLoad"));
      }
      const data = await response.json();
      const projectsData = Array.isArray(data.data) ? data.data : [];
      setProjects(projectsData);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      toast.error(t("entities.projects.failedToLoad"));
      setProjects([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchProjects();
  }, [currentPage, pageSize, debouncedSearch]); // Removed fetchProjects from dependencies

  const handleCreate = async (projectData: Omit<Project, "id" | "created_at" | "updated_at" | "main_image_url"> & { 
    mainImage?: File[];
    imageIds?: File[];
    fileIds?: File[];
  }) => {
    try {
      const { mainImage, imageIds, fileIds, ...payload } = projectData;
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("entities.projects.failedToCreate"));
      }

      const responseData = await response.json();
      const projectId = responseData.id || responseData.data?.id;

      // Upload main image if provided
      if (mainImage && Array.isArray(mainImage) && mainImage.length > 0 && projectId) {
        const imageFile = mainImage[0];
        if (imageFile instanceof File) {
          await uploadProjectImage(projectId, imageFile, "main_image_id");
        }
      }

      // Upload additional images if provided
      if (imageIds && Array.isArray(imageIds) && imageIds.length > 0 && projectId) {
        await uploadProjectFiles(projectId, imageIds, "image_ids");
      }

      // Upload additional files if provided
      if (fileIds && Array.isArray(fileIds) && fileIds.length > 0 && projectId) {
        await uploadProjectFiles(projectId, fileIds, "file_ids");
      }

      toast.success(t("entities.projects.created"));
      setIsFormOpen(false);
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message || t("entities.projects.failedToCreate"));
    }
  };

  const handleUpdate = async (projectData: Omit<Project, "id" | "created_at" | "updated_at" | "main_image_url"> & { 
    mainImage?: File[];
    imageIds?: File[];
    fileIds?: File[];
  }) => {
    if (!editingProject) return;

    try {
      const { mainImage, imageIds, fileIds, ...payload } = projectData;
      const response = await fetch(`/api/projects/${editingProject.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("entities.projects.failedToUpdate"));
      }

      // Upload main image if provided
      if (mainImage && Array.isArray(mainImage) && mainImage.length > 0) {
        const imageFile = mainImage[0];
        if (imageFile instanceof File) {
          await uploadProjectImage(editingProject.id, imageFile, "main_image_id");
        }
      }

      // Upload additional images if provided
      if (imageIds && Array.isArray(imageIds) && imageIds.length > 0) {
        await uploadProjectFiles(editingProject.id, imageIds, "image_ids");
      }

      // Upload additional files if provided
      if (fileIds && Array.isArray(fileIds) && fileIds.length > 0) {
        await uploadProjectFiles(editingProject.id, fileIds, "file_ids");
      }

      toast.success(t("entities.projects.updated"));
      setEditingProject(null);
      setIsFormOpen(false);
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message || t("entities.projects.failedToUpdate"));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("entities.projects.failedToDelete"));
      }

      toast.success(t("entities.projects.deleted"));
      setDeletingProjectId(null);
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message || t("entities.projects.failedToDelete"));
    }
  };

  const uploadProjectImage = async (projectId: number, imageFile: File, refColumn: string = "main_image_id") => {
    try {
      const formData = new FormData();
      formData.append("files", imageFile);
      formData.append("refColumn", refColumn);

      const response = await fetch(`/api/projects/${projectId}/upload`, {
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

  const uploadProjectFiles = async (projectId: number, files: File[], refColumn: string) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append("files", file);
      });
      formData.append("refColumn", refColumn);

      const response = await fetch(`/api/projects/${projectId}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(t("entities.news.failedToUploadFiles"));
      }
    } catch (error: any) {
      console.error(`Error uploading ${refColumn}:`, error);
      toast.error(t("entities.news.failedToUploadFiles"));
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleView = (project: Project) => {
    setViewingProject(project);
    setIsViewOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProject(null);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewingProject(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h2>{t("entities.projects.title")}</h2>
          <p className="text-muted-foreground">
            {t("entities.projects.subtitle")}
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 size-4" />
          {t("entities.projects.add")}
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("entities.projects.search")}
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
            ) : projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  {t("table.noResults")}
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title_ar}</TableCell>
                  <TableCell>{project.title_en || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={project.status === 1 ? "default" : "secondary"}
                    >
                      {project.status === 1 ? t("common.active") : t("common.inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(project)}
                        title={t("entities.projects.viewDetails")}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(project)}
                        title={t("entities.projects.editTooltip")}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingProjectId(project.id)}
                        title={t("entities.projects.deleteTooltip")}
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
        {t("table.showing")} {projects.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
        {Math.min(currentPage * pageSize, total)} {t("table.of")} {total} {t("table.results")}
      </div>

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-4xl sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? t("entities.projects.edit") : t("entities.projects.createNew")}
            </DialogTitle>
          </DialogHeader>
          <ProjectForm
            project={editingProject}
            onSubmit={editingProject ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {viewingProject && (
        <DynamicView
          data={viewingProject}
          open={isViewOpen}
          onOpenChange={handleCloseView}
          title={t("entities.projects.details")}
          header={{
            type: "avatar",
            title: (data: Project) => data.title_ar || data.title_en || "Project",
            subtitle: (data: Project) => data.detail_ar || data.detail_en || "",
            imageIdField: "main_image_id",
            avatarFallback: (data: Project) => 
              data.title_ar?.[0] || data.title_en?.[0] || "P",
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
                {
                  name: "main_image_url",
                  label: "Main Image",
                  type: "custom",
                  colSpan: 12,
                  render: (value: string) => {
                    if (!value) {
                      return <p className="text-sm text-muted-foreground">No main image</p>;
                    }
                    const imageUrl = value.startsWith('http') || value.startsWith('/api/public/file') 
                      ? value 
                      : `/api/public/file?file_url=${encodeURIComponent(value)}`;
                    return (
                      <img
                        src={imageUrl}
                        alt="Main Project Image"
                        className="w-48 h-48 object-cover rounded-lg border"
                      />
                    );
                  },
                },
                { name: "title_ar", label: "Title (AR)", type: "text" },
                { name: "title_en", label: "Title (EN)", type: "text" },
                { name: "detail_ar", label: "Detail (AR)", type: "text", colSpan: 12 },
                { name: "detail_en", label: "Detail (EN)", type: "text", colSpan: 12 },
                {
                  name: "type",
                  label: "Type",
                  type: "custom",
                  render: (value: number) => {
                    if (!value) return "-";
                    return <TypeName typeId={value} />;
                  },
                },
                { name: "link", label: "Link", type: "text" },
                {
                  name: "status",
                  label: "Status",
                  type: "badge",
                  badgeMap: {
                    1: { label: "Active", variant: "default" },
                    0: { label: "Inactive", variant: "secondary" },
                  },
                },
                {
                  name: "category_ids",
                  label: "Categories",
                  type: "custom",
                  render: (value: number[]) => {
                    if (!Array.isArray(value) || value.length === 0) return "-";
                    return <CategoryNames categoryIds={value} />;
                  },
                },
                { name: "created_at", label: "Created At", type: "datetime" },
                { name: "updated_at", label: "Updated At", type: "datetime" },
              ],
            },
            {
              id: "social-media",
              label: "Social Media",
              gridCols: 1,
              fields: [
                {
                  name: "social_media",
                  label: "Social Media Links",
                  type: "custom",
                  render: (value: any) => {
                    const socialMedia = typeof value === 'string' ? JSON.parse(value) : value;
                    if (!socialMedia || Object.keys(socialMedia).length === 0) {
                      return <p className="text-sm text-muted-foreground">No social media links</p>;
                    }
                    return (
                      <div className="space-y-2">
                        {Object.entries(socialMedia).map(([platform, url]) => (
                          <div key={platform} className="flex items-center gap-2">
                            <span className="font-medium capitalize">{platform}:</span>
                            <a 
                              href={url as string} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {url as string}
                            </a>
                          </div>
                        ))}
                      </div>
                    );
                  },
                },
              ],
            },
            {
              id: "images",
              label: "Images",
              gridCols: 1,
              fields: [
                {
                  name: "image_urls",
                  label: "Additional Images",
                  type: "custom",
                  render: (value: string[]) => {
                    if (!value || value.length === 0) {
                      return <p className="text-sm text-muted-foreground">No additional images</p>;
                    }
                    return (
                      <div className="grid grid-cols-3 gap-4">
                        {value.filter(url => url != null).map((url, index) => (
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
                    );
                  },
                },
              ],
            },
            {
              id: "files",
              label: "Files",
              gridCols: 1,
              fields: [
                {
                  name: "file_urls",
                  label: "Additional Files",
                  type: "custom",
                  render: (value: string[]) => {
                    if (!value || value.length === 0) {
                      return <p className="text-sm text-muted-foreground">No additional files</p>;
                    }
                    return (
                      <div className="space-y-2">
                        {value.filter(url => url != null).map((url, index) => {
                          const fileName = url.split('/').pop() || `File ${index + 1}`;
                          const fileUrl = url.startsWith('http') || url.startsWith('/api/public/file') 
                            ? url 
                            : `/api/public/file?file_url=${encodeURIComponent(url)}`;
                          
                          return (
                            <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                              <a 
                                href={fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex-1 text-sm hover:underline text-primary"
                              >
                                {fileName}
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    );
                  },
                },
              ],
            },
          ]}
          maxWidth="4xl"
        />
      )}

      <AlertDialog
        open={!!deletingProjectId}
        onOpenChange={(open) => !open && setDeletingProjectId(null)}
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
              onClick={() => deletingProjectId && handleDelete(deletingProjectId)}
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

