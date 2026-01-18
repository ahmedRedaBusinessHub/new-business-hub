import * as z from "zod";
import type { Project } from "./ProjectsManagement";
import DynamicForm from "../shared/DynamicForm";

const formSchema = z.object({
  title_ar: z.string().min(2, "Arabic title must be at least 2 characters"),
  title_en: z.string().optional(),
  detail_ar: z.string().optional(),
  detail_en: z.string().optional(),
  link: z.string().url("Invalid URL").optional().or(z.literal("")),
  status: z.coerce.number().int().min(0).max(1),
  organization_id: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().int().nullable().optional()
  ),
});

interface ProjectFormProps {
  project: Project | null;
  onSubmit: (data: Omit<Project, "id" | "created_at" | "updated_at" | "main_image_id" | "image_ids" | "file_ids" | "category_ids" | "type" | "social_media">) => void;
  onCancel: () => void;
}

export function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const validated = formSchema.parse(data);
      
      onSubmit({
        title_ar: validated.title_ar,
        title_en: validated.title_en || null,
        detail_ar: validated.detail_ar || null,
        detail_en: validated.detail_en || null,
        link: validated.link || null,
        status: validated.status,
        organization_id: validated.organization_id ?? project?.organization_id ?? 1,
        main_image_id: project?.main_image_id ?? null,
        image_ids: project?.image_ids || [],
        file_ids: project?.file_ids || [],
        category_ids: project?.category_ids || [],
        type: project?.type ?? null,
        social_media: project?.social_media ?? null,
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
            name: "title_ar",
            label: "Title (Arabic)",
            type: "text",
            placeholder: "Enter Arabic title",
            validation: formSchema.shape.title_ar,
            required: true,
            helperText: "Arabic title (required)",
          },
          {
            name: "title_en",
            label: "Title (English)",
            type: "text",
            placeholder: "Enter English title",
            validation: formSchema.shape.title_en,
            required: false,
            helperText: "English title (optional)",
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
            name: "link",
            label: "Link",
            type: "url",
            placeholder: "https://example.com",
            validation: formSchema.shape.link,
            required: false,
            helperText: "Project link (optional)",
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            placeholder: "Select status",
            validation: formSchema.shape.status,
            required: true,
            helperText: "Project status",
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
        submitText={project ? "Update Project" : "Create Project"}
        onSuccess={onCancel}
        defaultValues={{
          title_ar: project?.title_ar || "",
          title_en: project?.title_en || "",
          detail_ar: project?.detail_ar || "",
          detail_en: project?.detail_en || "",
          link: project?.link || "",
          status: project?.status?.toString() || "1",
          organization_id: project?.organization_id?.toString() || "1",
        }}
      />
    </>
  );
}

