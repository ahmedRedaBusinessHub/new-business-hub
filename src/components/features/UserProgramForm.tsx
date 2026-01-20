import * as z from "zod";
import { useState, useEffect } from "react";
import DynamicForm from "../shared/DynamicForm";
import { FileUploader } from "@/components/ui/FileUploader";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { staticListsCache } from "@/lib/staticListsCache";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
}

export interface UserProgram {
  id: number;
  user_id: number;
  program_id: number;
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

interface UserProgramFormProps {
  userProgram: UserProgram | null;
  programId: number;
  onSubmit: (data: Omit<UserProgram, "id" | "program_id" | "created_at" | "updated_at" | "organization_id"> & { files?: File[]; fileNames?: string[] }) => void;
  onCancel: () => void;
}

interface StatusOption {
  id: number;
  name_en: string;
  name_ar: string;
}

export function UserProgramForm({ userProgram, programId, onSubmit, onCancel }: UserProgramFormProps) {
  const isEdit = !!userProgram;
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [statuses, setStatuses] = useState<StatusOption[]>([]);
  const [loadingStatuses, setLoadingStatuses] = useState(true);
  const [deletedFileIds, setDeletedFileIds] = useState<number[]>([]);
  const [fileFiles, setFileFiles] = useState<Array<{ file: File; name: string }>>([]);

  // Fetch users for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await fetch("/api/users?limit=1000");
        if (response.ok) {
          const data = await response.json();
          const usersData = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
          setUsers(usersData);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch statuses from static_lists cache
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        setLoadingStatuses(true);
        const statusesConfig = await staticListsCache.getByNamespace('user_program.statuses');
        setStatuses(statusesConfig);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      } finally {
        setLoadingStatuses(false);
      }
    };
    fetchStatuses();
  }, []);

  const handleDeleteFile = async (fileId: number) => {
    if (!userProgram?.id || !fileId) {
      setDeletedFileIds(prev => [...prev, fileId]);
      toast.success("File marked for deletion");
      return;
    }

    try {
      const response = await fetch(
        `/api/user-program/${userProgram.id}/remove-file`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileId: fileId,
            refColumn: 'upload_documents',
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete file');
      }

      setDeletedFileIds(prev => [...prev, fileId]);
      toast.success("File deleted successfully");
    } catch (error: any) {
      console.error('Error deleting file:', error);
      toast.error(error.message || "Failed to delete file");
    }
  };

  const handleFileChange = (files: File[]) => {
    // Initialize file names with original filenames, but allow editing
    const filesWithNames = files.map(file => ({
      file,
      name: file.name.split('.')[0] || file.name, // Use filename without extension as default
    }));
    setFileFiles(filesWithNames);
  };

  const handleFileNameChange = (index: number, name: string) => {
    const updated = [...fileFiles];
    updated[index] = { ...updated[index], name };
    setFileFiles(updated);
  };

  const handleRemoveFile = (index: number) => {
    const updated = fileFiles.filter((_, i) => i !== index);
    setFileFiles(updated);
  };

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const validated = formSchema.parse(data);
      
      // Prepare files with names - files are handled separately via FileUploader component
      const filesToUpload = fileFiles.length > 0 ? fileFiles.map(f => f.file) : undefined;
      const fileNamesToUpload = fileFiles.length > 0 ? fileFiles.map(f => f.name) : undefined;
      
      onSubmit({
        user_id: validated.user_id!,
        company_name: validated.company_name || null,
        project_name: validated.project_name || null,
        project_description: validated.project_description || null,
        team_size: validated.team_size ?? null,
        fund_needed: validated.fund_needed ?? null,
        why_applying: validated.why_applying || null,
        status: validated.status ?? null,
        // Don't include upload_documents in the payload - it's handled separately via file upload
        files: filesToUpload,
        fileNames: fileNamesToUpload,
      });
    } catch (error) {
      console.error("Form validation error:", error);
      throw error;
    }
  };

  // Extract documents from upload_documents JSON array
  // Each document has { name, file_id } and optionally file_url
  const getDocuments = (): Array<{ name: string; file_id: number; file_url?: string }> => {
    if (!userProgram?.upload_documents || !Array.isArray(userProgram.upload_documents)) {
      return [];
    }
    return userProgram.upload_documents
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
            helperText: "Select the user for this program",
            options: [
              { value: "", label: "Select a user" },
              ...users.map((user) => ({
                value: user.id.toString(),
                label: `${user.first_name} ${user.last_name || ""} (${user.email})`,
              })),
            ],
          },
          {
            name: "company_name",
            label: "Company Name",
            type: "text",
            placeholder: "Enter company name",
            validation: formSchema.shape.company_name,
            required: false,
            helperText: "Company name (optional)",
          },
          {
            name: "project_name",
            label: "Project Name",
            type: "text",
            placeholder: "Enter project name",
            validation: formSchema.shape.project_name,
            required: false,
            helperText: "Project name (optional)",
          },
          {
            name: "project_description",
            label: "Project Description",
            type: "textarea",
            placeholder: "Enter project description",
            validation: formSchema.shape.project_description,
            required: false,
            helperText: "Project description (optional)",
          },
          {
            name: "team_size",
            label: "Team Size",
            type: "number",
            placeholder: "Enter team size",
            validation: formSchema.shape.team_size,
            required: false,
            helperText: "Team size (optional)",
          },
          {
            name: "fund_needed",
            label: "Fund Needed",
            type: "number",
            placeholder: "Enter fund needed",
            validation: formSchema.shape.fund_needed,
            required: false,
            helperText: "Fund needed amount (optional)",
          },
          {
            name: "why_applying",
            label: "Why Applying",
            type: "textarea",
            placeholder: "Enter reason for applying",
            validation: formSchema.shape.why_applying,
            required: false,
            helperText: "Reason for applying (optional)",
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            placeholder: loadingStatuses ? "Loading statuses..." : "Select status (optional)",
            validation: formSchema.shape.status,
            required: false,
            helperText: "User program status (optional)",
            options: [
              { value: "", label: "None" },
              ...statuses.map((status) => ({
                value: status.id.toString(),
                label: `${status.name_en} / ${status.name_ar}`,
              })),
            ],
          },
          ...(isEdit ? [] : []),
        ]}
        onSubmit={handleSubmit}
        submitText={userProgram ? "Update User Program" : "Create User Program"}
        onSuccess={onCancel}
        defaultValues={{
          user_id: userProgram?.user_id?.toString() || "",
          company_name: userProgram?.company_name || "",
          project_name: userProgram?.project_name || "",
          project_description: userProgram?.project_description || "",
          team_size: userProgram?.team_size?.toString() || "",
          fund_needed: userProgram?.fund_needed?.toString() || "",
          why_applying: userProgram?.why_applying || "",
          status: userProgram?.status?.toString() || "",
          files: undefined,
        }}
      />

      {/* File upload section with name inputs for new uploads */}
      {!isEdit && (
        <div className="mt-4 space-y-4 border-t pt-4">
          <div>
            <Label className="text-sm font-medium">Upload Documents</Label>
            <p className="text-xs text-muted-foreground mt-1">
              You can upload multiple documents. Each document will be added to the list.
            </p>
          </div>
          <div className="bg-muted/50 rounded-xl p-4">
            <FileUploader
              multiple={true}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              maxSize={10 * 1024 * 1024}
              onChange={handleFileChange}
              onError={(error) => toast.error(error)}
            />
            {fileFiles.length > 0 && (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium">Enter names for uploaded files:</p>
                {fileFiles.map((fileWithName, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-background">
                    <div className="flex-1">
                      <Label htmlFor={`file-name-${index}`} className="text-xs text-muted-foreground mb-1 block">
                        File: {fileWithName.file.name}
                      </Label>
                      <Input
                        id={`file-name-${index}`}
                        type="text"
                        placeholder="Enter document name"
                        value={fileWithName.name}
                        onChange={(e) => handleFileNameChange(index, e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Display existing files in edit mode */}
      {isEdit && getDocuments().length > 0 && (
        <div className="mt-6 space-y-4 border-t pt-4">
          <Label className="text-sm font-medium">Existing Documents</Label>
          <div className="space-y-2">
            {getDocuments().map((doc) => {
              // Construct file URL from file_url if available
              const fileUrl = doc.file_url 
                ? (doc.file_url.startsWith('http') || doc.file_url.startsWith('/api/public/file') 
                    ? doc.file_url 
                    : `/api/public/file?file_url=${encodeURIComponent(doc.file_url)}`)
                : null;
              
              return (
                <div key={doc.file_id} className="flex items-center gap-2 p-2 border rounded-lg group hover:bg-muted/50 transition-colors">
                  {fileUrl ? (
                    <a 
                      href={fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 text-sm hover:underline text-primary"
                    >
                      {doc.name}
                    </a>
                  ) : (
                    <span className="flex-1 text-sm text-muted-foreground">
                      {doc.name}
                    </span>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteFile(doc.file_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
          
          {deletedFileIds.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {deletedFileIds.length} file(s) marked for deletion. Upload new files to replace them.
            </p>
          )}
        </div>
      )}

      {/* Upload new files section in edit mode */}
      {isEdit && (
        <div className="mt-4 space-y-4 border-t pt-4">
          <div>
            <Label className="text-sm font-medium">Upload Additional Documents</Label>
            <p className="text-xs text-muted-foreground mt-1">
              New files will be added to existing documents
            </p>
          </div>
          <div className="bg-muted/50 rounded-xl p-4">
            <FileUploader
              multiple={true}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              maxSize={10 * 1024 * 1024}
              onChange={handleFileChange}
              onError={(error) => toast.error(error)}
            />
            {fileFiles.length > 0 && (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium">Enter names for uploaded files:</p>
                {fileFiles.map((fileWithName, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-background">
                    <div className="flex-1">
                      <Label htmlFor={`file-name-edit-${index}`} className="text-xs text-muted-foreground mb-1 block">
                        File: {fileWithName.file.name}
                      </Label>
                      <Input
                        id={`file-name-edit-${index}`}
                        type="text"
                        placeholder="Enter document name"
                        value={fileWithName.name}
                        onChange={(e) => handleFileNameChange(index, e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoveFile(index)}
                    >
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
