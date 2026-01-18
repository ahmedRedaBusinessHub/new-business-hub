import * as z from "zod";
import type { ContactInteraction } from "./ContactInteractionManagement";
import DynamicForm from "../shared/DynamicForm";

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
  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const validated = formSchema.parse(data);
      
      onSubmit({
        type: validated.type ?? null,
        subject: validated.subject || null,
        details: validated.details || null,
        organization_id: interaction?.organization_id ?? 1,
        files: validated.files,
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
            type: "number",
            placeholder: "Enter interaction type",
            validation: formSchema.shape.type,
            required: false,
            helperText: "Interaction type (optional)",
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
          {
            name: "files",
            label: "Files",
            type: "fileuploader",
            validation: formSchema.shape.files,
            required: false,
            helperText: "Upload files (PDF, DOC, DOCX, Images - Max 10MB)",
            accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
            multiple: true,
          },
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
    </>
  );
}

