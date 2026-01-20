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
import { Badge } from "@/components/ui/Badge";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { UserProgramForm, UserProgram } from "./UserProgramForm";
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

interface ProgramUserProgramsProps {
  programId: number;
}

export function ProgramUserPrograms({ programId }: ProgramUserProgramsProps) {
  const [userPrograms, setUserPrograms] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingUserProgram, setEditingUserProgram] = useState<UserProgram | null>(null);
  const [viewingUserProgram, setViewingUserProgram] = useState<any | null>(null);
  const [deletingUserProgramId, setDeletingUserProgramId] = useState<number | null>(null);
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

  // Fetch statuses from static_lists cache
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const statusesConfig = await staticListsCache.getByNamespace('user_program.statuses');
        setStatuses(statusesConfig);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };
    fetchStatuses();
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchUserPrograms = useCallback(async () => {
    if (!programId) return;

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
      const response = await fetch(`/api/user-program/program/${programId}?${paramsString}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user programs");
      }
      const data = await response.json();
      setUserPrograms(Array.isArray(data.data) ? data.data : []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error: any) {
      console.error("Error fetching user programs:", error);
      toast.error("Failed to load user programs");
      setUserPrograms([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [programId, currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    if (programId) {
      fetchUserPrograms();
    }
  }, [fetchUserPrograms, programId]);

  const handleCreate = async (userProgramData: Omit<UserProgram, "id" | "program_id" | "created_at" | "updated_at" | "organization_id"> & { files?: File[]; fileNames?: string[] }) => {
    try {
      const { files, fileNames, ...payload } = userProgramData;
      const response = await fetch("/api/user-program", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...payload, program_id: programId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create user program");
      }

      const responseData = await response.json();
      const userProgramId = responseData.id || responseData.data?.id;

      // Upload files if provided
      if (files && Array.isArray(files) && files.length > 0 && userProgramId) {
        await uploadUserProgramFiles(userProgramId, files, fileNames);
      }

      toast.success("User program created successfully!");
      setIsFormOpen(false);
      fetchUserPrograms();
    } catch (error: any) {
      toast.error(error.message || "Failed to create user program");
    }
  };

  const handleUpdate = async (userProgramData: Omit<UserProgram, "id" | "program_id" | "created_at" | "updated_at" | "organization_id"> & { files?: File[]; fileNames?: string[] }) => {
    if (!editingUserProgram) return;

    try {
      const { files, fileNames, ...payload } = userProgramData;
      const response = await fetch(`/api/user-program/${editingUserProgram.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update user program");
      }

      // Upload files if provided
      if (files && Array.isArray(files) && files.length > 0) {
        await uploadUserProgramFiles(editingUserProgram.id, files, fileNames);
      }

      toast.success("User program updated successfully!");
      setEditingUserProgram(null);
      setIsFormOpen(false);
      fetchUserPrograms();
    } catch (error: any) {
      toast.error(error.message || "Failed to update user program");
    }
  };

  const uploadUserProgramFiles = async (userProgramId: number, files: File[], fileNames?: string[]) => {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append("files", file);
        // Append file name if provided, otherwise use original filename without extension
        const fileName = fileNames && fileNames[index] 
          ? fileNames[index] 
          : file.name.split('.')[0] || file.name;
        formData.append("fileNames", fileName);
      });
      formData.append("refColumn", "upload_documents");

      const response = await fetch(`/api/user-program/${userProgramId}/upload`, {
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

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/user-program/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete user program");
      }

      toast.success("User program deleted successfully!");
      setDeletingUserProgramId(null);
      fetchUserPrograms();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user program");
    }
  };

  const handleEdit = (userProgram: any) => {
    setEditingUserProgram(userProgram as UserProgram);
    setIsFormOpen(true);
  };

  const handleView = (userProgram: any) => {
    setViewingUserProgram(userProgram);
    setIsViewOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUserProgram(null);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewingUserProgram(null);
  };

  const getUserName = (userProgram: any): string => {
    if (!userProgram) return "-";
    const user = userProgram.users_user_program_user_idTousers;
    if (!user) return "-";
    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
    return fullName || user.email || "-";
  };

  const getUserEmail = (userProgram: any): string => {
    if (!userProgram) return "-";
    return userProgram.users_user_program_user_idTousers?.email || "-";
  };

  const getStatusName = (statusId: number | null): string => {
    if (statusId === null) return "-";
    const status = statuses.find(s => s.id === statusId);
    return status ? `${status.name_en} / ${status.name_ar}` : String(statusId);
  };

  const getDocuments = (userProgram: any): Array<{ name: string; file_id: number; file_url?: string }> => {
    if (!userProgram.upload_documents || !Array.isArray(userProgram.upload_documents)) {
      return [];
    }
    return userProgram.upload_documents
      .filter((doc: any) => doc?.file_id)
      .map((doc: any) => ({
        name: doc.name || `File ${doc.file_id}`,
        file_id: doc.file_id,
        file_url: doc.file_url,
      }));
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3>User Programs</h3>
          <p className="text-sm text-muted-foreground">
            Manage user program enrollments for this program
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} size="sm">
          <Plus className="mr-2 size-4" />
          Add User Program
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search user programs..."
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
              <TableHead>User</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Fund Needed</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading user programs...
                </TableCell>
              </TableRow>
            ) : userPrograms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No user programs found.
                </TableCell>
              </TableRow>
            ) : (
              userPrograms.map((userProgram) => (
                <TableRow key={userProgram.id}>
                  <TableCell className="font-medium">{getUserName(userProgram)}</TableCell>
                  <TableCell>{userProgram.company_name || "-"}</TableCell>
                  <TableCell>{userProgram.project_name || "-"}</TableCell>
                  <TableCell>{getStatusName(userProgram.status)}</TableCell>
                  <TableCell>{userProgram.fund_needed ? `$${userProgram.fund_needed}` : "-"}</TableCell>
                  <TableCell>
                    {userProgram.created_at 
                      ? new Date(userProgram.created_at).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(userProgram)}
                        title="View user program details"
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(userProgram)}
                        title="Edit user program"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingUserProgramId(userProgram.id)}
                        title="Delete user program"
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
        Showing {userPrograms.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
        {Math.min(currentPage * pageSize, total)} of {total} user programs
      </div>

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-4xl sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingUserProgram ? "Edit User Program" : "Create New User Program"}
            </DialogTitle>
          </DialogHeader>
          <UserProgramForm
            userProgram={editingUserProgram}
            programId={programId}
            onSubmit={editingUserProgram ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {viewingUserProgram && (
        <DynamicView
          data={viewingUserProgram}
          open={isViewOpen}
          onOpenChange={handleCloseView}
          title="User Program Details"
          tabs={[
            {
              id: "details",
              label: "Details",
              gridCols: 2,
              fields: [
                { 
                  name: "user", 
                  label: "User", 
                  type: "text", 
                  render: (value: any, data: any) => {
                    return getUserName(data);
                  }
                },
                { 
                  name: "email", 
                  label: "Email", 
                  type: "text", 
                  render: (value: any, data: any) => {
                    return getUserEmail(data);
                  }
                },
                { name: "company_name", label: "Company Name", type: "text" },
                { name: "project_name", label: "Project Name", type: "text" },
                { name: "project_description", label: "Project Description", type: "text", colSpan: 12 },
                { name: "team_size", label: "Team Size", type: "text" },
                { name: "fund_needed", label: "Fund Needed", type: "text", render: (value: number | null) => value ? `$${value}` : "-" },
                { name: "why_applying", label: "Why Applying", type: "text", colSpan: 12 },
                { 
                  name: "status", 
                  label: "Status", 
                  type: "text", 
                  render: (value: number | null) => getStatusName(value) 
                },
                { name: "created_at", label: "Created At", type: "datetime" },
                { name: "updated_at", label: "Updated At", type: "datetime" },
              ],
            },
            {
              id: "documents",
              label: "Documents",
              customContent: (data: any) => {
                const documents = getDocuments(data);
                if (documents.length === 0) {
                  return <p className="text-muted-foreground">No documents uploaded</p>;
                }
                return (
                  <div className="space-y-2">
                    {documents.map((doc) => {
                      // Construct file URL from file_url if available
                      const fileUrl = doc.file_url 
                        ? (doc.file_url.startsWith('http') || doc.file_url.startsWith('/api/public/file') 
                            ? doc.file_url 
                            : `/api/public/file?file_url=${encodeURIComponent(doc.file_url)}`)
                        : null;
                      
                      return (
                        <div key={doc.file_id} className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                          {fileUrl ? (
                            <>
                              <a 
                                href={fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm hover:underline text-primary flex-1"
                              >
                                {doc.name}
                              </a>
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-muted-foreground hover:text-primary"
                              >
                                Open
                              </a>
                            </>
                          ) : (
                            <span className="text-sm text-muted-foreground flex-1">
                              {doc.name}
                            </span>
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

      <AlertDialog
        open={!!deletingUserProgramId}
        onOpenChange={(open) => !open && setDeletingUserProgramId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user program.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingUserProgramId && handleDelete(deletingUserProgramId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
