import * as z from "zod";
import { useState, useEffect } from "react";
import type { News } from "./NewsManagement";
import DynamicForm from "../shared/DynamicForm";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";

const formSchema = z.object({
  title_ar: z.string().min(2, "Arabic title must be at least 2 characters"),
  title_en: z.string().optional(),
  detail_ar: z.string().optional(),
  detail_en: z.string().optional(),
  status: z.coerce.number().int().min(0).max(1),
  mainImage: z.any().optional(),
});

interface NewsFormProps {
  news: News | null;
  onSubmit: (data: Omit<News, "id" | "created_at" | "updated_at" | "social_media" | "main_image_url"> & { mainImage?: File[] }) => void;
  onCancel: () => void;
}

export function NewsForm({ news, onSubmit, onCancel }: NewsFormProps) {
  const isEdit = !!news;
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  // Use main_image_url from news data instead of fetching
  useEffect(() => {
    if (news?.main_image_url) {
      // If main_image_url is already a full URL, use it directly
      // If it's a file path, prepend the public file endpoint
      if (news.main_image_url.startsWith('http') || news.main_image_url.startsWith('/api/public/file')) {
        setExistingImageUrl(news.main_image_url);
      } else {
        setExistingImageUrl(`/api/public/file?file_url=${encodeURIComponent(news.main_image_url)}`);
      }
    } else {
      setExistingImageUrl(null);
    }
  }, [news]);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const validated = formSchema.parse(data);
      
      onSubmit({
        title_ar: validated.title_ar,
        title_en: validated.title_en || null,
        detail_ar: validated.detail_ar || null,
        detail_en: validated.detail_en || null,
        status: validated.status,
        organization_id: news?.organization_id ?? 1,
        mainImage: validated.mainImage,
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
            <AvatarImage src={existingImageUrl} alt="Current main image" />
            <AvatarFallback>
              {news?.title_ar?.[0] || news?.title_en?.[0] || "N"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">Current Main Image</p>
            <p className="text-xs text-muted-foreground">
              Upload a new image below to replace this one
            </p>
          </div>
        </div>
      )}
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
            name: "status",
            label: "Status",
            type: "select",
            placeholder: "Select status",
            validation: formSchema.shape.status,
            required: true,
            helperText: "News status",
            options: [
              { value: "1", label: "Active" },
              { value: "0", label: "Inactive" },
            ],
          },
          {
            name: "mainImage",
            label: "Main Image",
            type: "imageuploader",
            validation: formSchema.shape.mainImage,
            required: false,
            helperText: "Upload main image (JPG, PNG, WEBP - Max 5MB)",
          },
        ]}
        onSubmit={handleSubmit}
        submitText={news ? "Update News" : "Create News"}
        onSuccess={onCancel}
        defaultValues={{
          title_ar: news?.title_ar || "",
          title_en: news?.title_en || "",
          detail_ar: news?.detail_ar || "",
          detail_en: news?.detail_en || "",
          status: news?.status?.toString() || "1",
          mainImage: undefined,
        }}
      />
    </>
  );
}

