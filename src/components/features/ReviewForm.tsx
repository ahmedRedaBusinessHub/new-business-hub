import * as z from "zod";
import type { Review } from "./ReviewsManagement";
import DynamicForm from "../shared/DynamicForm";

const formSchema = z.object({
  name_ar: z.string().min(2, "Arabic name must be at least 2 characters"),
  name_en: z.string().optional(),
  comment_ar: z.string().optional(),
  comment_en: z.string().optional(),
  job_title_ar: z.string().optional(),
  job_title_en: z.string().optional(),
  status: z.coerce.number().int().min(0).max(1),
  organization_id: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().int().nullable().optional()
  ),
});

interface ReviewFormProps {
  review: Review | null;
  onSubmit: (data: Omit<Review, "id" | "created_at" | "updated_at" | "image_id">) => void;
  onCancel: () => void;
}

export function ReviewForm({ review, onSubmit, onCancel }: ReviewFormProps) {
  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const validated = formSchema.parse(data);
      
      onSubmit({
        name_ar: validated.name_ar,
        name_en: validated.name_en || null,
        comment_ar: validated.comment_ar || null,
        comment_en: validated.comment_en || null,
        job_title_ar: validated.job_title_ar || null,
        job_title_en: validated.job_title_en || null,
        status: validated.status,
        organization_id: validated.organization_id ?? review?.organization_id ?? 1,
        image_id: review?.image_id ?? null,
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
            name: "job_title_ar",
            label: "Job Title (Arabic)",
            type: "text",
            placeholder: "Enter Arabic job title",
            validation: formSchema.shape.job_title_ar,
            required: false,
            helperText: "Arabic job title (optional)",
          },
          {
            name: "job_title_en",
            label: "Job Title (English)",
            type: "text",
            placeholder: "Enter English job title",
            validation: formSchema.shape.job_title_en,
            required: false,
            helperText: "English job title (optional)",
          },
          {
            name: "comment_ar",
            label: "Comment (Arabic)",
            type: "textarea",
            placeholder: "Enter Arabic comment",
            validation: formSchema.shape.comment_ar,
            required: false,
            helperText: "Arabic comment (optional)",
          },
          {
            name: "comment_en",
            label: "Comment (English)",
            type: "textarea",
            placeholder: "Enter English comment",
            validation: formSchema.shape.comment_en,
            required: false,
            helperText: "English comment (optional)",
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            placeholder: "Select status",
            validation: formSchema.shape.status,
            required: true,
            helperText: "Review status",
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
        submitText={review ? "Update Review" : "Create Review"}
        onSuccess={onCancel}
        defaultValues={{
          name_ar: review?.name_ar || "",
          name_en: review?.name_en || "",
          job_title_ar: review?.job_title_ar || "",
          job_title_en: review?.job_title_en || "",
          comment_ar: review?.comment_ar || "",
          comment_en: review?.comment_en || "",
          status: review?.status?.toString() || "1",
          organization_id: review?.organization_id?.toString() || "1",
        }}
      />
    </>
  );
}

