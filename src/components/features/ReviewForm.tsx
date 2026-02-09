import * as z from "zod";
import { useState, useEffect, useMemo } from "react";
import type { Review } from "./ReviewsManagement";
import DynamicForm, { type FormField } from "../shared/DynamicForm";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { useI18n } from "@/hooks/useI18n";

interface ReviewFormProps {
  review: Review | null;
  onSubmit: (data: Omit<Review, "id" | "created_at" | "updated_at" | "image_url"> & { profileImage?: File[] }) => void;
  onCancel: () => void;
}

export function ReviewForm({ review, onSubmit, onCancel }: ReviewFormProps) {
  const { t } = useI18n("admin");
  const isEdit = !!review;
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const formSchema = useMemo(() => z.object({
    name_ar: z.string().min(2, t("entities.reviews.nameArPlaceholder")),
    name_en: z.string().optional(),
    comment_ar: z.string().optional(),
    comment_en: z.string().optional(),
    job_title_ar: z.string().optional(),
    job_title_en: z.string().optional(),
    status: z.coerce.number().int().min(0).max(1),
    profileImage: z.any().optional(),
  }), [t]);

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
        organization_id: review?.organization_id || 1,
        profileImage: validated.profileImage,
      });
    } catch (error) {
      console.error("Form validation error:", error);
      throw error;
    }
  };

  const formConfig = useMemo((): FormField[] => [
    {
      name: "name_ar",
      label: t("entities.reviews.nameAr"),
      type: "text",
      placeholder: t("entities.reviews.nameArPlaceholder"),
      validation: formSchema.shape.name_ar,
      required: true,
      helperText: `${t("entities.reviews.nameAr")} ${t("entities.reviews.helperTextRequired")}`,
    },
    {
      name: "name_en",
      label: t("entities.reviews.nameEn"),
      type: "text",
      placeholder: t("entities.reviews.nameEnPlaceholder"),
      validation: formSchema.shape.name_en,
      required: false,
      helperText: `${t("entities.reviews.nameEn")} ${t("entities.reviews.helperTextOptional")}`,
    },
    {
      name: "job_title_ar",
      label: t("entities.reviews.jobTitleAr"),
      type: "text",
      placeholder: t("entities.reviews.jobTitleArPlaceholder"),
      validation: formSchema.shape.job_title_ar,
      required: false,
      helperText: `${t("entities.reviews.jobTitleAr")} ${t("entities.reviews.helperTextOptional")}`,
    },
    {
      name: "job_title_en",
      label: t("entities.reviews.jobTitleEn"),
      type: "text",
      placeholder: t("entities.reviews.jobTitleEnPlaceholder"),
      validation: formSchema.shape.job_title_en,
      required: false,
      helperText: `${t("entities.reviews.jobTitleEn")} ${t("entities.reviews.helperTextOptional")}`,
    },
    {
      name: "comment_ar",
      label: t("entities.reviews.commentAr"),
      type: "textarea",
      placeholder: t("entities.reviews.commentArPlaceholder"),
      validation: formSchema.shape.comment_ar,
      required: false,
      helperText: `${t("entities.reviews.commentAr")} ${t("entities.reviews.helperTextOptional")}`,
    },
    {
      name: "comment_en",
      label: t("entities.reviews.commentEn"),
      type: "textarea",
      placeholder: t("entities.reviews.commentEnPlaceholder"),
      validation: formSchema.shape.comment_en,
      required: false,
      helperText: `${t("entities.reviews.commentEn")} ${t("entities.reviews.helperTextOptional")}`,
    },
    {
      name: "status",
      label: t("common.status"),
      type: "select",
      placeholder: t("common.status"),
      validation: formSchema.shape.status,
      required: true,
      helperText: t("common.status"),
      options: [
        { value: "1", label: t("common.active") },
        { value: "0", label: t("common.inactive") },
      ],
    },
    {
      name: "profileImage",
      label: t("entities.reviews.profileImage"),
      type: "imageuploader",
      validation: formSchema.shape.profileImage,
      required: false,
      helperText: t("entities.reviews.profileImageHelper"),
    },
  ], [formSchema, t]);

  return (
    <>
      {isEdit && existingImageUrl && (
        <div className="mb-6 flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
          <Avatar className="size-20">
            <AvatarImage src={existingImageUrl} alt={t("entities.reviews.currentImage")} />
            <AvatarFallback>
              {review?.name_ar?.[0] || review?.name_en?.[0] || "R"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">{t("entities.reviews.currentImage")}</p>
            <p className="text-xs text-muted-foreground">
              {t("entities.reviews.uploadNewImage")}
            </p>
          </div>
        </div>
      )}
      <DynamicForm
        config={formConfig}
        onSubmit={handleSubmit}
        submitText={review ? t("entities.reviews.edit") : t("entities.reviews.createNew")}
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

