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
  organization_id: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().int().nullable().optional()
  ),
});

interface ContactInteractionFormProps {
  interaction: ContactInteraction | null;
  contactId: number;
  onSubmit: (data: Omit<ContactInteraction, "id" | "contact_id" | "created_at" | "updated_at" | "file_ids">) => void;
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
        file_ids: interaction?.file_ids || [],
        organization_id: validated.organization_id ?? interaction?.organization_id ?? 1,
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
            name: "organization_id",
            label: "Organization ID",
            type: "number",
            placeholder: "Enter organization ID",
            validation: formSchema.shape.organization_id,
            required: false,
            helperText: "Organization ID (optional, defaults to 1)",
          },
        ]}
        onSubmit={handleSubmit}
        submitText={interaction ? "Update Interaction" : "Create Interaction"}
        onSuccess={onCancel}
        defaultValues={{
          type: interaction?.type?.toString() || "",
          subject: interaction?.subject || "",
          details: interaction?.details || "",
          organization_id: interaction?.organization_id?.toString() || "1",
        }}
      />
    </>
  );
}

