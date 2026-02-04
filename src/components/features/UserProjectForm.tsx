"use client";
import * as z from "zod";
import { useState, useEffect, useRef } from "react";
import DynamicForm from "../shared/DynamicForm";
import { FileUploader } from "@/components/ui/FileUploader";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { staticListsCache } from "@/lib/staticListsCache";
import { getLocalizedLabel } from "@/lib/localizedLabel";
import { useI18n } from "@/hooks/useI18n";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
}

export interface UserProject {
  id: number;
  user_id: number;
  project_id: number;
  company_name: string | null;
  project_name: string | null;
  project_description: string | null;
  team_size: number | null;
  fund_needed: number | null;
  why_applying: string | null;
  upload_documents: any[];
  status: number | null;
  organization_id: number;
  created_at: string | null;
  updated_at: string | null;
}

const formSchema = z.object({
  user_id: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().int().min(1, "User is required")
  ),
  company_name: z.string().optional(),
  project_name: z.string().optional(),
  project_description: z.string().optional(),
  team_size: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().int().positive().nullable().optional()
  ),
  fund_needed: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().positive().nullable().optional()
  ),
  why_applying: z.string().optional(),
  status: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().int().nullable().optional()
  ),
  files: z.any().optional(),
});

interface UserProjectFormProps {
  userProject: UserProject | null;
  projectId: number;
  onSubmit: (data: Omit<UserProject, "id" | "project_id" | "created_at" | "updated_at" | "organization_id"> & { files?: File[]; fileNames?: string[] }) => void;
  onCancel: () => void;
}

interface StatusOption {
  id: number;
  name_en: string;
  name_ar: string;
}

export function UserProjectForm({ userProject, projectId, onSubmit, onCancel }: UserProjectFormProps) {
  const { language } = useI18n();
  const isEdit = !!userProject;
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [statuses, setStatuses] = useState<StatusOption[]>([]);
  const [loadingStatuses, setLoadingStatuses] = useState(true);
  const [deletedFileIds, setDeletedFileIds] = useState<number[]>([]);
  const [fileFiles, setFileFiles] = useState<Array<{ file: File; name: string }>>([]);
  const usersFetchedRef = useRef(false);
  const statusesFetchedRef = useRef(false);

  useEffect(() => {
    if (usersFetchedRef.current) return;
    const fetchUsers = async () => {
      try {
        usersFetchedRef.current = true;
        setLoadingUsers(true);
        const response = await fetch("/api/users?limit=1000");
        if (response.ok) {
          const data = await response.json();
          const usersData = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
          setUsers(usersData);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        usersFetchedRef.current = false;
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (statusesFetchedRef.current) return;
    const fetchStatuses = async () => {
      try {
        statusesFetchedRef.current = true;
        setLoadingStatuses(true);
        const statusesConfig = await staticListsCache.getByNamespace("user_project.statuses");
        setStatuses(statusesConfig || []);
      } catch (error) {
        console.error("Error fetching statuses:", error);
        statusesFetchedRef.current = false;
      } finally {
        setLoadingStatuses(false);
      }
    };
    fetchStatuses();
  }, []);

  const handleDeleteFile = async (fileId: number) => {
    if (!userProject?.id || !fileId) {
      setDeletedFileIds((prev) => [...prev, fileId]);
      toast.success("File marked for deletion");
      return;
    }
    try {
      const response = await fetch(`/api/user-project/${userProject.id}/remove-file`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, refColumn: "upload_documents" }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete file");
      }
      setDeletedFileIds((prev) => [...prev, fileId]);
      toast.success("File deleted successfully");
    } catch (error: any) {
      console.error("Error deleting file:", error);
      toast.error(error.message || "Failed to delete file");
    }
  };

  const handleFileChange = (files: File[]) => {
    setFileFiles(files.map((file) => ({ file, name: file.name.split(".")[0] || file.name })));
  };

  const handleFileNameChange = (index: number, name: string) => {
    const updated = [...fileFiles];
    updated[index] = { ...updated[index], name };
    setFileFiles(updated);
  };

  const handleRemoveFile = (index: number) => {
    setFileFiles(fileFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const validated = formSchema.parse(data);
      const filesToUpload = fileFiles.length > 0 ? fileFiles.map((f) => f.file) : undefined;
      const fileNamesToUpload = fileFiles.length > 0 ? fileFiles.map((f) => f.name) : undefined;
      onSubmit({
        user_id: validated.user_id!,
        company_name: validated.company_name || null,
        project_name: validated.project_name || null,
        project_description: validated.project_description || null,
        team_size: validated.team_size ?? null,
        fund_needed: validated.fund_needed ?? null,
        why_applying: validated.why_applying || null,
        status: validated.status ?? null,
        files: filesToUpload,
        fileNames: fileNamesToUpload,
      });
    } catch (error) {
      console.error("Form validation error:", error);
      throw error;
    }
  };

  const getDocuments = (): Array<{ name: string; file_id: number; file_url?: string }> => {
    if (!userProject?.upload_documents || !Array.isArray(userProject.upload_documents)) return [];
    return userProject.upload_documents
      .filter((doc: any) => doc?.file_id && !deletedFileIds.includes(doc.file_id))
      .map((doc: any) => ({
        name: doc.name || `File ${doc.file_id}`,
        file_id: doc.file_id,
        file_url: doc.file_url,
      }));
  };

  return (
    <>
      <DynamicForm
        config={[
          {
            name: "user_id",
            label: "User",
            type: "select",
            placeholder: loadingUsers ? "Loading users..." : "Select user",
            validation: formSchema.shape.user_id,
            required: true,
            helperText: "Select the user for this project",
            options: [
              { value: "", label: "Select a user" },
              ...users.map((u) => ({
                value: u.id.toString(),
                label: `${u.first_name} ${u.last_name || ""} (${u.email})`,
              })),
            ],
          },
          { name: "company_name", label: "Company Name", type: "text", placeholder: "Enter company name", validation: formSchema.shape.company_name, required: false },
          { name: "project_name", label: "Project Name", type: "text", placeholder: "Enter project name", validation: formSchema.shape.project_name, required: false },
          { name: "project_description", label: "Project Description", type: "textarea", placeholder: "Enter description", validation: formSchema.shape.project_description, required: false },
          { name: "team_size", label: "Team Size", type: "number", placeholder: "Enter team size", validation: formSchema.shape.team_size, required: false },
          { name: "fund_needed", label: "Fund Needed", type: "number", placeholder: "Enter fund needed", validation: formSchema.shape.fund_needed, required: false },
          { name: "why_applying", label: "Why Applying", type: "textarea", placeholder: "Enter reason", validation: formSchema.shape.why_applying, required: false },
          {
            name: "status",
            label: "Status",
            type: "select",
            placeholder: loadingStatuses ? "Loading statuses..." : "Select status",
            validation: formSchema.shape.status,
            required: false,
            options: [
              { value: "", label: "None" },
              ...statuses.map((s) => ({ value: s.id.toString(), label: getLocalizedLabel(s.name_en, s.name_ar, language) })),
            ],
          },
        ]}
        onSubmit={handleSubmit}
        submitText={userProject ? "Update User Project" : "Create User Project"}
        onSuccess={onCancel}
        defaultValues={{
          user_id: userProject?.user_id?.toString() || "",
          company_name: userProject?.company_name || "",
          project_name: userProject?.project_name || "",
          project_description: userProject?.project_description || "",
          team_size: userProject?.team_size?.toString() || "",
          fund_needed: userProject?.fund_needed?.toString() || "",
          why_applying: userProject?.why_applying || "",
          status: userProject?.status?.toString() || "",
          files: undefined,
        }}
      />
      {!isEdit && (
        <div className="mt-4 space-y-4 border-t pt-4">
          <Label className="text-sm font-medium">Upload Documents</Label>
          <div className="bg-muted/50 rounded-xl p-4">
            <FileUploader multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" maxSize={10 * 1024 * 1024} onChange={handleFileChange} onError={(e) => toast.error(e)} />
            {fileFiles.length > 0 && (
              <div className="mt-4 space-y-3">
                {fileFiles.map((fw, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-background">
                    <Input className="flex-1" placeholder="Document name" value={fw.name} onChange={(e) => handleFileNameChange(index, e.target.value)} />
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleRemoveFile(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {isEdit && getDocuments().length > 0 && (
        <div className="mt-6 space-y-4 border-t pt-4">
          <Label className="text-sm font-medium">Existing Documents</Label>
          <div className="space-y-2">
            {getDocuments().map((doc) => {
              const fileUrl = doc.file_url
                ? doc.file_url.startsWith("http") || doc.file_url.startsWith("/api/public/file")
                  ? doc.file_url
                  : `/api/public/file?file_url=${encodeURIComponent(doc.file_url)}`
                : null;
              return (
                <div key={doc.file_id} className="flex items-center gap-2 p-2 border rounded-lg">
                  {fileUrl ? (
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-sm hover:underline text-primary">
                      {doc.name}
                    </a>
                  ) : (
                    <span className="flex-1 text-sm text-muted-foreground">{doc.name}</span>
                  )}
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteFile(doc.file_id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {isEdit && (
        <div className="mt-4 space-y-4 border-t pt-4">
          <Label className="text-sm font-medium">Upload Additional Documents</Label>
          <div className="bg-muted/50 rounded-xl p-4">
            <FileUploader multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" maxSize={10 * 1024 * 1024} onChange={handleFileChange} onError={(e) => toast.error(e)} />
            {fileFiles.length > 0 && (
              <div className="mt-4 space-y-3">
                {fileFiles.map((fw, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-background">
                    <Input className="flex-1" placeholder="Document name" value={fw.name} onChange={(e) => handleFileNameChange(index, e.target.value)} />
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleRemoveFile(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
