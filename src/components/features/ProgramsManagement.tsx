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
import { ProgramForm } from "./ProgramForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import DynamicView, { type ViewTab } from "../shared/DynamicView";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { staticListsCache } from "@/lib/staticListsCache";

interface StaticListOption {
  id: number;
  name_en: string;
  name_ar: string;
}

export interface Program {
  id: number;
  name_ar: string;
  name_en: string | null;
  detail_ar: string | null;
  detail_en: string | null;
  from_datetime: string | null;
  to_datetime: string | null;
  last_registration_date: string | null;
  type: number | null;
  subtype: number | null;
  values: any;
  progress_steps: any;
  application_requirements: any;
  documents_requirements: any;
  promo_video: string | null;
  promo_image: string | null;
  status: number;
  organization_id: number;
  document_ar_id?: number | null;
  document_en_id?: number | null;
  document_ar_url?: string | null;
  document_en_url?: string | null;
  main_image_url?: string | null;
  main_image_id?: number | null;
  image_urls?: string[];
  image_ids?: number[];
  created_at: string | null;
  updated_at: string | null;
}

export function ProgramsManagement() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [viewingProgram, setViewingProgram] = useState<Program | null>(null);
  const [deletingProgramId, setDeletingProgramId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [programTypes, setProgramTypes] = useState<StaticListOption[]>([]);
  const [programSubtypes, setProgramSubtypes] = useState<StaticListOption[]>([]);

  // Fetch static lists for type and subtype
  useEffect(() => {
    const fetchStaticLists = async () => {
      try {
        const typesConfig = await staticListsCache.getByNamespace('program.types');
        setProgramTypes(typesConfig);
        
        const subtypesConfig = await staticListsCache.getByNamespace('program.subtypes');
        setProgramSubtypes(subtypesConfig);
      } catch (error) {
        console.error('Error fetching static lists:', error);
      }
    };

    fetchStaticLists();
  }, []);

  // Helper functions to get type/subtype names
  const getTypeName = (typeId: number | null) => {
    if (typeId === null) return "-";
    const type = programTypes.find(t => t.id === typeId);
    return type ? `${type.name_en} / ${type.name_ar}` : String(typeId);
  };

  const getSubtypeName = (subtypeId: number | null) => {
    if (subtypeId === null) return "-";
    const subtype = programSubtypes.find(s => s.id === subtypeId);
    return subtype ? `${subtype.name_en} / ${subtype.name_ar}` : String(subtypeId);
  };

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

  const fetchPrograms = useCallback(async () => {
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
      const response = await fetch(`/api/programs?${paramsString}`);
      if (!response.ok) {
        throw new Error("Failed to fetch programs");
      }
      const data = await response.json();
      const programsData = Array.isArray(data.data) ? data.data : [];
      setPrograms(programsData);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error: any) {
      console.error("Error fetching programs:", error);
      toast.error("Failed to load programs");
      setPrograms([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const handleCreate = async (programData: Omit<Program, "id" | "created_at" | "updated_at" | "organization_id"> & { 
    mainImage?: File[]; 
    imageIds?: File[]; 
    document_ar?: File[]; 
    document_en?: File[];
  }) => {
    try {
      const { mainImage, imageIds, document_ar, document_en, ...payload } = programData;
      const response = await fetch("/api/programs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create program");
      }

      const responseData = await response.json();
      const programId = responseData.id || responseData.data?.id;

      // Upload main image if provided
      if (mainImage && Array.isArray(mainImage) && mainImage.length > 0 && programId) {
        const imageFile = mainImage[0];
        if (imageFile instanceof File) {
          await uploadProgramImage(programId, imageFile, "main_image_id");
        }
      }

      // Upload additional images if provided
      if (imageIds && Array.isArray(imageIds) && imageIds.length > 0 && programId) {
        await uploadProgramFiles(programId, imageIds, "image_ids");
      }

      // Upload documents if provided
      if (document_ar && Array.isArray(document_ar) && document_ar.length > 0 && programId) {
        const docFile = document_ar[0];
        if (docFile instanceof File) {
          await uploadProgramDocument(programId, docFile, "document_ar_id");
        }
      }
      if (document_en && Array.isArray(document_en) && document_en.length > 0 && programId) {
        const docFile = document_en[0];
        if (docFile instanceof File) {
          await uploadProgramDocument(programId, docFile, "document_en_id");
        }
      }

      toast.success("Program created successfully!");
      setIsFormOpen(false);
      fetchPrograms();
    } catch (error: any) {
      toast.error(error.message || "Failed to create program");
    }
  };

  const handleUpdate = async (programData: Omit<Program, "id" | "created_at" | "updated_at" | "organization_id"> & { 
    mainImage?: File[]; 
    imageIds?: File[]; 
    document_ar?: File[]; 
    document_en?: File[];
  }) => {
    if (!editingProgram) return;

    try {
      const { mainImage, imageIds, document_ar, document_en, ...payload } = programData;
      const response = await fetch(`/api/programs/${editingProgram.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update program");
      }

      // Upload main image if provided
      if (mainImage && Array.isArray(mainImage) && mainImage.length > 0) {
        const imageFile = mainImage[0];
        if (imageFile instanceof File) {
          await uploadProgramImage(editingProgram.id, imageFile, "main_image_id");
        }
      }

      // Upload additional images if provided
      if (imageIds && Array.isArray(imageIds) && imageIds.length > 0) {
        await uploadProgramFiles(editingProgram.id, imageIds, "image_ids");
      }

      // Upload documents if provided
      if (document_ar && Array.isArray(document_ar) && document_ar.length > 0) {
        const docFile = document_ar[0];
        if (docFile instanceof File) {
          await uploadProgramDocument(editingProgram.id, docFile, "document_ar_id");
        }
      }
      if (document_en && Array.isArray(document_en) && document_en.length > 0) {
        const docFile = document_en[0];
        if (docFile instanceof File) {
          await uploadProgramDocument(editingProgram.id, docFile, "document_en_id");
        }
      }

      toast.success("Program updated successfully!");
      setEditingProgram(null);
      setIsFormOpen(false);
      fetchPrograms();
    } catch (error: any) {
      toast.error(error.message || "Failed to update program");
    }
  };

  const uploadProgramImage = async (programId: number, imageFile: File, refColumn: string = "main_image_id") => {
    try {
      const formData = new FormData();
      formData.append("files", imageFile);
      formData.append("refColumn", refColumn);

      const response = await fetch(`/api/programs/${programId}/upload`, {
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

  const uploadProgramFiles = async (programId: number, files: File[], refColumn: string) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("refColumn", refColumn);

      const response = await fetch(`/api/programs/${programId}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload files");
      }
    } catch (error: any) {
      console.error("Error uploading files:", error);
      toast.error("Failed to upload files");
    }
  };

  const uploadProgramDocument = async (programId: number, docFile: File, refColumn: string) => {
    try {
      const formData = new FormData();
      formData.append("files", docFile);
      formData.append("refColumn", refColumn);

      const response = await fetch(`/api/programs/${programId}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload document");
      }
    } catch (error: any) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/programs/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete program");
      }

      toast.success("Program deleted successfully!");
      setDeletingProgramId(null);
      fetchPrograms();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete program");
    }
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setIsFormOpen(true);
  };

  const handleView = (program: Program) => {
    setViewingProgram(program);
    setIsViewOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProgram(null);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewingProgram(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h2>Programs Management</h2>
          <p className="text-muted-foreground">
            Manage programs with full CRUD operations
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add Program
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search programs..."
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
              <TableHead>Name (AR)</TableHead>
              <TableHead>Name (EN)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Loading programs...
                </TableCell>
              </TableRow>
            ) : programs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No programs found.
                </TableCell>
              </TableRow>
            ) : (
              programs.map((program) => (
                <TableRow key={program.id}>
                  <TableCell className="font-medium">{program.name_ar}</TableCell>
                  <TableCell>{program.name_en || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={program.status === 1 ? "default" : "secondary"}
                    >
                      {program.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(program)}
                        title="View program details"
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(program)}
                        title="Edit program"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingProgramId(program.id)}
                        title="Delete program"
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
        Showing {programs.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
        {Math.min(currentPage * pageSize, total)} of {total} programs
      </div>

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-4xl sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProgram ? "Edit Program" : "Create New Program"}
            </DialogTitle>
          </DialogHeader>
          <ProgramForm
            program={editingProgram}
            onSubmit={editingProgram ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {viewingProgram && (
        <DynamicView
          data={viewingProgram}
          open={isViewOpen}
          onOpenChange={handleCloseView}
          title="Program Details"
          tabs={[
            {
              id: "details",
              label: "Details",
              gridCols: 2,
              fields: [
                { name: "name_ar", label: "Name (AR)", type: "text", colSpan: 12 },
                { name: "name_en", label: "Name (EN)", type: "text", colSpan: 12 },
                { name: "detail_ar", label: "Detail (AR)", type: "text", colSpan: 12 },
                { name: "detail_en", label: "Detail (EN)", type: "text", colSpan: 12 },
                { name: "type", label: "Type", type: "text", render: (value: number | null) => getTypeName(value) },
                { name: "subtype", label: "Subtype", type: "text", render: (value: number | null) => getSubtypeName(value) },
                { name: "from_datetime", label: "From Date", type: "datetime" },
                { name: "to_datetime", label: "To Date", type: "datetime" },
                { name: "last_registration_date", label: "Last Registration Date", type: "datetime" },
                { name: "promo_video", label: "Promo Video", type: "text" },
                { name: "promo_image", label: "Promo Image", type: "text" },
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
              id: "values",
              label: "Values",
              customContent: (data: Program) => {
                const values = typeof data.values === 'string' ? JSON.parse(data.values || '[]') : (data.values || []);
                if (!Array.isArray(values) || values.length === 0) {
                  return <p className="text-muted-foreground">No values defined</p>;
                }
                return (
                  <div className="space-y-2">
                    {values.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                        {item.icon && <span className="text-lg">{item.icon}</span>}
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                );
              },
            },
            {
              id: "progress",
              label: "Progress Steps",
              customContent: (data: Program) => {
                const steps = typeof data.progress_steps === 'string' ? JSON.parse(data.progress_steps || '[]') : (data.progress_steps || []);
                if (!Array.isArray(steps) || steps.length === 0) {
                  return <p className="text-muted-foreground">No progress steps defined</p>;
                }
                return (
                  <div className="space-y-2">
                    {steps.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                          {item.number || index + 1}
                        </span>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                );
              },
            },
            {
              id: "app-req",
              label: "App Requirements",
              customContent: (data: Program) => {
                const reqs = typeof data.application_requirements === 'string' ? JSON.parse(data.application_requirements || '[]') : (data.application_requirements || []);
                if (!Array.isArray(reqs) || reqs.length === 0) {
                  return <p className="text-muted-foreground">No application requirements defined</p>;
                }
                return (
                  <div className="space-y-2">
                    {reqs.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                        {item.icon && <span className="text-lg">{item.icon}</span>}
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                );
              },
            },
            {
              id: "doc-req",
              label: "Doc Requirements",
              customContent: (data: Program) => {
                const reqs = typeof data.documents_requirements === 'string' ? JSON.parse(data.documents_requirements || '[]') : (data.documents_requirements || []);
                if (!Array.isArray(reqs) || reqs.length === 0) {
                  return <p className="text-muted-foreground">No document requirements defined</p>;
                }
                return (
                  <div className="space-y-2">
                    {reqs.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                        {item.icon && <span className="text-lg">{item.icon}</span>}
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                );
              },
            },
            {
              id: "documents",
              label: "Documents",
              customContent: (data: Program) => {
                const hasDocAr = data.document_ar_url;
                const hasDocEn = data.document_en_url;
                if (!hasDocAr && !hasDocEn) {
                  return <p className="text-muted-foreground">No documents uploaded</p>;
                }
                return (
                  <div className="space-y-4">
                    {hasDocAr && (
                      <div className="p-4 border rounded-lg bg-muted/50">
                        <p className="text-sm font-medium mb-2">Arabic Document</p>
                        <a 
                          href={data.document_ar_url!.startsWith('http') || data.document_ar_url!.startsWith('/api/public/file') 
                            ? data.document_ar_url! 
                            : `/api/public/file?file_url=${encodeURIComponent(data.document_ar_url!)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {data.document_ar_url!.split('/').pop()}
                        </a>
                      </div>
                    )}
                    {hasDocEn && (
                      <div className="p-4 border rounded-lg bg-muted/50">
                        <p className="text-sm font-medium mb-2">English Document</p>
                        <a 
                          href={data.document_en_url!.startsWith('http') || data.document_en_url!.startsWith('/api/public/file') 
                            ? data.document_en_url! 
                            : `/api/public/file?file_url=${encodeURIComponent(data.document_en_url!)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {data.document_en_url!.split('/').pop()}
                        </a>
                      </div>
                    )}
                  </div>
                );
              },
            },
            {
              id: "images",
              label: "Images",
              customContent: (data: Program) => {
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
        open={!!deletingProgramId}
        onOpenChange={(open) => !open && setDeletingProgramId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the program.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingProgramId && handleDelete(deletingProgramId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

