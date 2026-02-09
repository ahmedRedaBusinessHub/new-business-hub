"use client";
import { useState, useEffect, useCallback, useRef } from "react";
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
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { UserProjectForm, UserProject } from "./UserProjectForm";
import DynamicView from "../shared/DynamicView";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";
import { staticListsCache } from "@/lib/staticListsCache";
import { getLocalizedLabel } from "@/lib/localizedLabel";
import { useI18n } from "@/hooks/useI18n";
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

interface ProjectUserProjectsProps {
  projectId: number;
}

export function ProjectUserProjects({ projectId }: ProjectUserProjectsProps) {
  const { t, language } = useI18n("admin");
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingUserProject, setEditingUserProject] = useState<UserProject | null>(null);
  const [viewingUserProject, setViewingUserProject] = useState<any | null>(null);
  const [deletingUserProjectId, setDeletingUserProjectId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statuses, setStatuses] = useState<any[]>([]);
  const isFetchingRef = useRef(false);
  const lastFetchParamsRef = useRef<string>("");

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const statusesConfig = await staticListsCache.getByNamespace("user_project.statuses");
        setStatuses(statusesConfig || []);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };
    fetchStatuses();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchUserProjects = useCallback(async () => {
    if (!projectId) return;
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: pageSize.toString(),
      ...(debouncedSearch && { search: debouncedSearch }),
    });
    const paramsString = params.toString();
    if (isFetchingRef.current && lastFetchParamsRef.current === paramsString) return;
    isFetchingRef.current = true;
    lastFetchParamsRef.current = paramsString;
    try {
      setLoading(true);
      const response = await fetch(`/api/user-project/project/${projectId}?${paramsString}`);
      if (!response.ok) throw new Error(t("entities.userProjects.failedToLoad"));
      const data = await response.json();
      setUserProjects(Array.isArray(data.data) ? data.data : []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error: any) {
      console.error("Error fetching user projects:", error);
      toast.error(t("entities.userProjects.failedToLoad"));
      setUserProjects([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [projectId, currentPage, pageSize, debouncedSearch, t]);

  useEffect(() => {
    if (projectId) fetchUserProjects();
  }, [projectId, currentPage, pageSize, debouncedSearch, fetchUserProjects]);

  const handleCreate = async (payload: Omit<UserProject, "id" | "project_id" | "created_at" | "updated_at" | "organization_id" | "upload_documents"> & { files?: File[]; fileNames?: string[]; upload_documents?: any[] }) => {
    try {
      const { files, fileNames, upload_documents, ...rest } = payload;
      const response = await fetch("/api/user-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...rest, project_id: projectId }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("entities.userProjects.failedToCreate"));
      }
      const responseData = await response.json();
      const userProjectId = responseData.id ?? responseData.data?.id;
      if (files && Array.isArray(files) && files.length > 0 && userProjectId) {
        const formData = new FormData();
        files.forEach((file, index) => {
          formData.append("files", file);
          formData.append("fileNames", fileNames?.[index] ?? file.name.split(".")[0] ?? file.name);
        });
        formData.append("refColumn", "upload_documents");
        await fetch(`/api/user-project/${userProjectId}/upload`, { method: "POST", body: formData });
      }
      toast.success(t("entities.userProjects.created"));
      setIsFormOpen(false);
      fetchUserProjects();
    } catch (error: any) {
      toast.error(error.message || t("entities.userProjects.failedToCreate"));
    }
  };

  const handleUpdate = async (payload: Omit<UserProject, "id" | "project_id" | "created_at" | "updated_at" | "organization_id" | "upload_documents"> & { files?: File[]; fileNames?: string[]; upload_documents?: any[] }) => {
    if (!editingUserProject) return;
    try {
      const { files, fileNames, upload_documents, ...rest } = payload;
      const response = await fetch(`/api/user-project/${editingUserProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("entities.userProjects.failedToUpdate"));
      }
      if (files && Array.isArray(files) && files.length > 0) {
        const formData = new FormData();
        files.forEach((file, index) => {
          formData.append("files", file);
          formData.append("fileNames", fileNames?.[index] ?? file.name.split(".")[0] ?? file.name);
        });
        formData.append("refColumn", "upload_documents");
        await fetch(`/api/user-project/${editingUserProject.id}/upload`, { method: "POST", body: formData });
      }
      toast.success(t("entities.userProjects.updated"));
      setEditingUserProject(null);
      setIsFormOpen(false);
      fetchUserProjects();
    } catch (error: any) {
      toast.error(error.message || t("entities.userProjects.failedToUpdate"));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/user-project/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("entities.userProjects.failedToDelete"));
      }
      toast.success(t("entities.userProjects.deleted"));
      setDeletingUserProjectId(null);
      fetchUserProjects();
    } catch (error: any) {
      toast.error(error.message || t("entities.userProjects.failedToDelete"));
    }
  };

  const handleEdit = (userProject: any) => {
    setEditingUserProject(userProject as UserProject);
    setIsFormOpen(true);
  };

  const handleView = (userProject: any) => {
    setViewingUserProject(userProject);
    setIsViewOpen(true);
  };

  const getUserName = (userProject: any): string => {
    if (!userProject) return "-";
    const user = userProject.users_user_project_user_idTousers;
    if (!user) return "-";
    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
    return fullName || user.email || "-";
  };

  const getUserEmail = (userProject: any): string => {
    return userProject?.users_user_project_user_idTousers?.email ?? "-";
  };

  const getStatusName = (statusId: number | null): string => {
    if (statusId === null) return "-";
    const status = statuses.find((s) => s.id === statusId);
    return status ? getLocalizedLabel(status.name_en, status.name_ar, language) : String(statusId);
  };

  const getDocuments = (userProject: any): Array<{ name: string; file_id: number; file_url?: string }> => {
    if (!userProject?.upload_documents || !Array.isArray(userProject.upload_documents)) return [];
    return userProject.upload_documents
      .filter((doc: any) => doc?.file_id)
      .map((doc: any) => ({ name: doc.name || `File ${doc.file_id}`, file_id: doc.file_id, file_url: doc.file_url }));
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3>{t("entities.userProjects.title")}</h3>
          <p className="text-sm text-muted-foreground">{t("entities.userProjects.subtitle")}</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} size="sm">
          <Plus className="mr-2 size-4" />
          {t("entities.userProjects.add")}
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input type="search" placeholder={t("entities.userProjects.search")} className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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
              <TableHead>{t("entities.userProjects.user")}</TableHead>
              <TableHead>{t("entities.userProjects.companyName")}</TableHead>
              <TableHead>{t("entities.userProjects.projectName")}</TableHead>
              <TableHead>{t("common.status")}</TableHead>
              <TableHead>{t("entities.userProjects.fundNeeded")}</TableHead>
              <TableHead>{t("common.createdAt")}</TableHead>
              <TableHead className="text-right">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">{t("common.loading")}</TableCell>
              </TableRow>
            ) : userProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">{t("table.noResults")}</TableCell>
              </TableRow>
            ) : (
              userProjects.map((userProject) => (
                <TableRow key={userProject.id}>
                  <TableCell className="font-medium">{getUserName(userProject)}</TableCell>
                  <TableCell>{userProject.company_name || "-"}</TableCell>
                  <TableCell>{userProject.project_name || "-"}</TableCell>
                  <TableCell>{getStatusName(userProject.status)}</TableCell>
                  <TableCell>{userProject.fund_needed != null ? `$${userProject.fund_needed}` : "-"}</TableCell>
                  <TableCell>{userProject.created_at ? new Date(userProject.created_at).toLocaleDateString() : "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleView(userProject)} title={t("entities.userProjects.viewDetails")}><Eye className="size-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(userProject)} title={t("entities.userProjects.editTooltip")}><Pencil className="size-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeletingUserProjectId(userProject.id)} title={t("entities.userProjects.deleteTooltip")}><Trash2 className="size-4" /></Button>
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
              <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1); }} className={currentPage === 1 ? "pointer-events-none opacity-50" : ""} />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(page); }} isActive={currentPage === page}>{page}</PaginationLink>
                  </PaginationItem>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <PaginationItem key={page}><PaginationEllipsis /></PaginationItem>;
              }
              return null;
            })}
            <PaginationItem>
              <PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(currentPage + 1); }} className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <div className="text-sm text-muted-foreground">
        {t("table.showing")} {userProjects.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} {t("table.of")} {Math.min(currentPage * pageSize, total)} {t("table.of")} {total} {t("table.results")}
      </div>

      <Dialog open={isFormOpen} onOpenChange={(open) => !open && (setIsFormOpen(false), setEditingUserProject(null))}>
        <DialogContent className="max-w-4xl sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingUserProject ? t("entities.userProjects.edit") : t("entities.userProjects.createNew")}</DialogTitle>
          </DialogHeader>
          <UserProjectForm userProject={editingUserProject} projectId={projectId} onSubmit={editingUserProject ? handleUpdate : handleCreate} onCancel={() => (setIsFormOpen(false), setEditingUserProject(null))} />
        </DialogContent>
      </Dialog>

      {viewingUserProject && (
        <DynamicView
          data={viewingUserProject}
          open={isViewOpen}
          onOpenChange={() => (setIsViewOpen(false), setViewingUserProject(null))}
          title={t("entities.userProjects.details")}
          tabs={[
            {
              id: "details",
              label: t("entities.userProjects.details"),
              gridCols: 2,
              fields: [
                { name: "user", label: t("entities.userProjects.user"), type: "text", render: (_: any, data: any) => getUserName(data) },
                { name: "email", label: t("users.email"), type: "text", render: (_: any, data: any) => getUserEmail(data) },
                { name: "company_name", label: t("entities.userProjects.companyName"), type: "text" },
                { name: "project_name", label: t("entities.userProjects.projectName"), type: "text" },
                { name: "project_description", label: t("entities.userProjects.projectDescription"), type: "text", colSpan: 12 },
                { name: "team_size", label: t("entities.userProjects.teamSize"), type: "text" },
                { name: "fund_needed", label: t("entities.userProjects.fundNeeded"), type: "text", render: (v: number | null) => (v != null ? `$${v}` : "-") },
                { name: "why_applying", label: t("entities.userProjects.whyApplying"), type: "text", colSpan: 12 },
                { name: "status", label: t("common.status"), type: "text", render: (v: number | null) => getStatusName(v) },
                { name: "created_at", label: t("common.createdAt"), type: "datetime" },
                { name: "updated_at", label: t("common.updatedAt"), type: "datetime" },
              ],
            },
            {
              id: "documents",
              label: t("entities.userProjects.uploadDocuments"),
              customContent: (data: any) => {
                const documents = getDocuments(data);
                if (documents.length === 0) return <p className="text-muted-foreground">{t("entities.userProjects.noDocuments")}</p>;
                return (
                  <div className="space-y-2">
                    {documents.map((doc) => {
                      const fileUrl = doc.file_url
                        ? doc.file_url.startsWith("http") || doc.file_url.startsWith("/api/public/file")
                          ? doc.file_url
                          : `/api/public/file?file_url=${encodeURIComponent(doc.file_url)}`
                        : null;
                      return (
                        <div key={doc.file_id} className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                          {fileUrl ? (
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline text-primary flex-1">{doc.name}</a>
                          ) : (
                            <span className="text-sm text-muted-foreground flex-1">{doc.name}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              },
            },
          ]}
          maxWidth="4xl"
        />
      )}

      <AlertDialog open={!!deletingUserProjectId} onOpenChange={(open) => !open && setDeletingUserProjectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("common.areYouSure")}</AlertDialogTitle>
            <AlertDialogDescription>{t("common.thisActionCannotBeUndone")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingUserProjectId && handleDelete(deletingUserProjectId)}>{t("common.delete")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
