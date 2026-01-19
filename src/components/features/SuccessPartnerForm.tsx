import * as z from "zod";
import { useState, useEffect } from "react";
import type { SuccessPartner } from "./SuccessPartnersManagement";
import DynamicForm from "../shared/DynamicForm";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";

const formSchema = z.object({
  name_ar: z.string().min(2, "Arabic name must be at least 2 characters"),
  name_en: z.string().optional(),
  status: z.coerce.number().int().min(0).max(1),
  mainImage: z.any().optional(),
});

interface SuccessPartnerFormProps {
  partner: SuccessPartner | null;
  onSubmit: (data: Omit<SuccessPartner, "id" | "created_at" | "updated_at" | "image_url"> & { mainImage?: File[] }) => void;
  onCancel: () => void;
}

export function SuccessPartnerForm({ partner, onSubmit, onCancel }: SuccessPartnerFormProps) {
  const isEdit = !!partner;
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  // Use image_url from partner data
  useEffect(() => {
    if (partner?.image_url) {
      if (partner.image_url.startsWith('http') || partner.image_url.startsWith('/api/public/file')) {
        setExistingImageUrl(partner.image_url);
      } else {
        setExistingImageUrl(`/api/public/file?file_url=${encodeURIComponent(partner.image_url)}`);
      }
    } else {
      setExistingImageUrl(null);
    }
  }, [partner]);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const validated = formSchema.parse(data);
      
      onSubmit({
        name_ar: validated.name_ar,
        name_en: validated.name_en || null,
        image_id: partner?.image_id || null,
        status: validated.status,
        organization_id: partner?.organization_id || 1,
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
            <AvatarImage src={existingImageUrl} alt="Current image" />
            <AvatarFallback>
              {partner?.name_ar?.[0] || partner?.name_en?.[0] || "S"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">Current Image</p>
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
            placeholder: "Enter name in Arabic",
            validation: formSchema.shape.name_ar,
            required: true,
            helperText: "Partner name in Arabic (required)",
          },
          {
            name: "name_en",
            label: "Name (English)",
            type: "text",
            placeholder: "Enter name in English",
            validation: formSchema.shape.name_en,
            required: false,
            helperText: "Partner name in English (optional)",
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            placeholder: "Select status",
            validation: formSchema.shape.status,
            required: true,
            helperText: "Partner status",
            options: [
              { value: "1", label: "Active" },
              { value: "0", label: "Inactive" },
            ],
          },
          {
            name: "mainImage",
            label: "Partner Logo/Image",
            type: "imageuploader",
            validation: formSchema.shape.mainImage,
            required: false,
            helperText: "Upload partner logo or image (JPG, PNG, WEBP - Max 5MB)",
          },
        ]}
        onSubmit={handleSubmit}
        submitText={partner ? "Update Success Partner" : "Create Success Partner"}
        onSuccess={onCancel}
        defaultValues={{
          name_ar: partner?.name_ar || "",
          name_en: partner?.name_en || "",
          status: partner?.status?.toString() || "1",
          mainImage: undefined,
        }}
      />
    </>
  );
}
