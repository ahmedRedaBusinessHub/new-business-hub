import * as z from "zod";
import { useState, useEffect } from "react";
import type { ContactInteraction } from "./ContactInteractionManagement";
import DynamicForm from "../shared/DynamicForm";
import { staticListsCache } from "@/lib/staticListsCache";
import { FileUploader } from "@/components/ui/FileUploader";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface InteractionTypeConfig {
  id: number;
  name_en: string;
  name_ar: string;
}

const formSchema = z.object({
  type: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().int().nullable().optional()
  ),
  subject: z.string().optional(),
  details: z.string().optional(),
  files: z.any().optional(),
});

interface ContactInteractionFormProps {
  interaction: ContactInteraction | null;
  contactId: number;
  onSubmit: (data: Omit<ContactInteraction, "id" | "contact_id" | "created_at" | "updated_at"> & { files?: File[] }) => void;
  onCancel: () => void;
}

export function ContactInteractionForm({ interaction, contactId, onSubmit, onCancel }: ContactInteractionFormProps) {
  const isEdit = !!interaction;
  const [interactionTypes, setInteractionTypes] = useState<InteractionTypeConfig[]>([]);
  const [loadingInteractionTypes, setLoadingInteractionTypes] = useState(true);
  const [deletedFileUrls, setDeletedFileUrls] = useState<string[]>([]);
  const [fileFiles, setFileFiles] = useState<File[]>([]);

  // Fetch interaction types from static_lists cache
  useEffect(() => {
    const fetchInteractionTypes = async () => {
      try {
        setLoadingInteractionTypes(true);
        const typesConfig = await staticListsCache.getByNamespace('contact_interaction.types');
        setInteractionTypes(typesConfig);
      } catch (error) {
        console.error("Error fetching interaction types:", error);
      } finally {
        setLoadingInteractionTypes(false);
      }
    };
    fetchInteractionTypes();
  }, []);

  const handleDeleteFile = async (url: string, fileId?: number) => {
    if (!interaction?.id || !fileId) {
      // For new interactions or if no fileId, just remove from display
      setDeletedFileUrls(prev => [...prev, url]);
      toast.success("File marked for deletion");
      return;
    }

    try {
      const response = await fetch(
        `/api/contact-interaction/${interaction.id}/remove-file`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileId: fileId,
            refColumn: 'file_ids',
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete file');
      }

      setDeletedFileUrls(prev => [...prev, url]);
      toast.success("File deleted successfully");
    } catch (error: any) {
      console.error('Error deleting file:', error);
      toast.error(error.message || "Failed to delete file");
    }
  };

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const validated = formSchema.parse(data);
      
      onSubmit({
        type: validated.type ?? null,
        subject: validated.subject || null,
        details: validated.details || null,
        files: isEdit ? (fileFiles.length > 0 ? fileFiles : undefined) : validated.files,
      });
    } catch (error) {
      console.error("Form validation error:", error);
      throw error;
    }
  };

  return (
    <>
      <DynamicForm
        config={[
          {
            name: "type",
            label: "Type",
            type: "select",
            placeholder: loadingInteractionTypes ? "Loading types..." : "Select interaction type (optional)",
            validation: formSchema.shape.type,
            required: false,
            helperText: "Interaction type (optional)",
            options: [
              { value: "", label: "None" },
              ...interactionTypes.map((type) => ({
                value: type.id.toString(),
                label: type.name_en,
              })),
            ],
          },
          {
            name: "subject",
            label: "Subject",
            type: "text",
            placeholder: "Enter subject",
            validation: formSchema.shape.subject,
            required: false,
            helperText: "Interaction subject (optional)",
          },
          {
            name: "details",
            label: "Details",
            type: "textarea",
            placeholder: "Enter details",
            validation: formSchema.shape.details,
            required: false,
            helperText: "Interaction details (optional)",
          },
          ...(isEdit ? [] : [{
            name: "files",
            label: "Files",
            type: "fileuploader",
            validation: formSchema.shape.files,
            required: false,
            helperText: "Upload files (PDF, DOC, DOCX, Images - Max 10MB)",
            accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
            multiple: true,
          }]),
        ]}
        onSubmit={handleSubmit}
        submitText={interaction ? "Update Interaction" : "Create Interaction"}
        onSuccess={onCancel}
        defaultValues={{
          type: interaction?.type?.toString() || "",
          subject: interaction?.subject || "",
          details: interaction?.details || "",
          files: undefined,
        }}
      />

      {/* Display existing files in edit mode */}
      {isEdit && interaction?.file_urls && interaction.file_urls.length > 0 && (
        <div className="mt-6 space-y-4 border-t pt-4">
          <Label className="text-sm font-medium">Existing Files</Label>
          <div className="space-y-2">
            {interaction.file_urls
              .filter(url => url != null && !deletedFileUrls.includes(url))
              .map((url, index) => {
                const fileName = url.split('/').pop() || `File ${index + 1}`;
                const fileUrl = url.startsWith('http') || url.startsWith('/api/public/file') 
                  ? url 
                  : `/api/public/file?file_url=${encodeURIComponent(url)}`;
                const fileId = interaction.file_ids?.[index];
                
                return (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded-lg group hover:bg-muted/50 transition-colors">
                    <a 
                      href={fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 text-sm hover:underline text-primary"
                    >
                      {fileName}
                    </a>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteFile(url, fileId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
          </div>
          
          {deletedFileUrls.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {deletedFileUrls.length} file(s) marked for deletion. Upload new files to replace them.
            </p>
          )}
        </div>
      )}

      {/* Upload new files section in edit mode */}
      {isEdit && (
        <div className="mt-4 space-y-2 border-t pt-4">
          <Label className="text-sm font-medium">Upload New Files</Label>
          <div className="bg-muted/50 rounded-xl p-4">
            <FileUploader
              multiple={true}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              maxSize={10 * 1024 * 1024}
              onChange={(files) => setFileFiles(files)}
              onError={(error) => toast.error(error)}
            />
            {fileFiles.length > 0 && (
              <p className="text-xs text-green-600 mt-2">
                Selected: {fileFiles.length} file(s)
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

