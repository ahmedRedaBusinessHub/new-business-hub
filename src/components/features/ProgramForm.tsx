import * as z from "zod";
import type { Program } from "./ProgramsManagement";
import DynamicForm from "../shared/DynamicForm";

const formSchema = z.object({
  name_ar: z.string().min(2, "Arabic name must be at least 2 characters"),
  name_en: z.string().optional(),
  detail_ar: z.string().optional(),
  detail_en: z.string().optional(),
  status: z.coerce.number().int().min(0).max(1),
  organization_id: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().int().nullable().optional()
  ),
});

interface ProgramFormProps {
  program: Program | null;
  onSubmit: (data: Omit<Program, "id" | "created_at" | "updated_at" | "document_ar_id" | "document_en_id" | "from_datetime" | "to_datetime" | "last_registration_date" | "type" | "subtype" | "values" | "progress_steps" | "application_requirements" | "documents_requirements">) => void;
  onCancel: () => void;
}

export function ProgramForm({ program, onSubmit, onCancel }: ProgramFormProps) {
  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const validated = formSchema.parse(data);
      
      onSubmit({
        name_ar: validated.name_ar,
        name_en: validated.name_en || null,
        detail_ar: validated.detail_ar || null,
        detail_en: validated.detail_en || null,
        status: validated.status,
        organization_id: validated.organization_id ?? program?.organization_id ?? 1,
        document_ar_id: program?.document_ar_id ?? null,
        document_en_id: program?.document_en_id ?? null,
        from_datetime: program?.from_datetime ?? null,
        to_datetime: program?.to_datetime ?? null,
        last_registration_date: program?.last_registration_date ?? null,
        type: program?.type ?? null,
        subtype: program?.subtype ?? null,
        values: program?.values ?? null,
        progress_steps: program?.progress_steps ?? null,
        application_requirements: program?.application_requirements ?? null,
        documents_requirements: program?.documents_requirements ?? null,
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
            name: "name_ar",
            label: "Name (Arabic)",
            type: "text",
            placeholder: "Enter Arabic name",
            validation: formSchema.shape.name_ar,
            required: true,
            helperText: "Arabic name (required)",
          },
          {
            name: "name_en",
            label: "Name (English)",
            type: "text",
            placeholder: "Enter English name",
            validation: formSchema.shape.name_en,
            required: false,
            helperText: "English name (optional)",
          },
          {
            name: "detail_ar",
            label: "Detail (Arabic)",
            type: "textarea",
            placeholder: "Enter Arabic detail",
            validation: formSchema.shape.detail_ar,
            required: false,
            helperText: "Arabic detail (optional)",
          },
          {
            name: "detail_en",
            label: "Detail (English)",
            type: "textarea",
            placeholder: "Enter English detail",
            validation: formSchema.shape.detail_en,
            required: false,
            helperText: "English detail (optional)",
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            placeholder: "Select status",
            validation: formSchema.shape.status,
            required: true,
            helperText: "Program status",
            options: [
              { value: "1", label: "Active" },
              { value: "0", label: "Inactive" },
            ],
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
        submitText={program ? "Update Program" : "Create Program"}
        onSuccess={onCancel}
        defaultValues={{
          name_ar: program?.name_ar || "",
          name_en: program?.name_en || "",
          detail_ar: program?.detail_ar || "",
          detail_en: program?.detail_en || "",
          status: program?.status?.toString() || "1",
          organization_id: program?.organization_id?.toString() || "1",
        }}
      />
    </>
  );
}

