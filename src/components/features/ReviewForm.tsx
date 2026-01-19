import * as z from "zod";
import { useState, useEffect } from "react";
import type { Review } from "./ReviewsManagement";
import DynamicForm from "../shared/DynamicForm";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";

const formSchema = z.object({
  name_ar: z.string().min(2, "Arabic name must be at least 2 characters"),
  name_en: z.string().optional(),
  comment_ar: z.string().optional(),
  comment_en: z.string().optional(),
  job_title_ar: z.string().optional(),
  job_title_en: z.string().optional(),
  status: z.coerce.number().int().min(0).max(1),
  profileImage: z.any().optional(),
});

interface ReviewFormProps {
  review: Review | null;
  onSubmit: (data: Omit<Review, "id" | "created_at" | "updated_at" | "image_url"> & { profileImage?: File[] }) => void;
  onCancel: () => void;
}

export function ReviewForm({ review, onSubmit, onCancel }: ReviewFormProps) {
  const isEdit = !!review;
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  // Use image_url from review data instead of fetching
  useEffect(() => {
    if (review?.image_url) {
      // If image_url is already a full URL, use it directly
      // If it's a file path, prepend the public file endpoint
      if (review.image_url.startsWith('http') || review.image_url.startsWith('/api/public/file')) {
        setExistingImageUrl(review.image_url);
      } else {
        setExistingImageUrl(`/api/public/file?file_url=${encodeURIComponent(review.image_url)}`);
      }
    } else {
      setExistingImageUrl(null);
    }
  }, [review]);

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
        profileImage: validated.profileImage,
      });
    } catch (error) {
      console.error("Form validation error:", error);
      throw error;
    }
  };

  return (
    <>
      {isEdit && existingImageUrl && (
        <div className="mb-6 flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
          <Avatar className="size-20">
            <AvatarImage src={existingImageUrl} alt="Current profile picture" />
            <AvatarFallback>
              {review?.name_ar?.[0] || review?.name_en?.[0] || "R"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">Current Profile Picture</p>
            <p className="text-xs text-muted-foreground">
              Upload a new image below to replace this one
            </p>
          </div>
        </div>
      )}
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
            name: "profileImage",
            label: "Profile Image",
            type: "imageuploader",
            validation: formSchema.shape.profileImage,
            required: false,
            helperText: "Upload profile image (JPG, PNG, WEBP - Max 5MB)",
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
          profileImage: undefined,
        }}
      />
    </>
  );
}

