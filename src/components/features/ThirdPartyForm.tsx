import * as z from "zod";
import { useState, useEffect } from "react";
import type { ThirdParty } from "./ThirdPartiesManagement";
import DynamicForm from "../shared/DynamicForm";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  namespace: z.string().min(2, "Namespace must be at least 2 characters"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  status: z.coerce.number().int().min(0).max(1),
  order_no: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().int().positive().optional()
  ),
  profileImage: z.any().optional(),
});

interface ThirdPartyFormProps {
  thirdParty: ThirdParty | null;
  onSubmit: (data: Omit<ThirdParty, "id" | "created_at" | "updated_at" | "image_url"> & { profileImage?: File[] }) => void;
  onCancel: () => void;
}

export function ThirdPartyForm({ thirdParty, onSubmit, onCancel }: ThirdPartyFormProps) {
  const isEdit = !!thirdParty;
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  // Use image_url from thirdParty data instead of fetching
  useEffect(() => {
    if (thirdParty?.image_url) {
      // If image_url is already a full URL, use it directly
      // If it's a file path, prepend the public file endpoint
      if (thirdParty.image_url.startsWith('http') || thirdParty.image_url.startsWith('/api/public/file')) {
        setExistingImageUrl(thirdParty.image_url);
      } else {
        setExistingImageUrl(`/api/public/file?file_url=${encodeURIComponent(thirdParty.image_url)}`);
      }
    } else {
      setExistingImageUrl(null);
    }
  }, [thirdParty]);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const validated = formSchema.parse(data);
      
      onSubmit({
        name: validated.name,
        namespace: validated.namespace,
        website: validated.website || null,
        status: validated.status,
        order_no: validated.order_no ?? null,
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
              {thirdParty?.name?.[0] || "T"}
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
            name: "name",
            label: "Name",
            type: "text",
            placeholder: "Enter third party name",
            validation: formSchema.shape.name,
            required: true,
            helperText: "Third party name (required)",
          },
          {
            name: "namespace",
            label: "Namespace",
            type: "text",
            placeholder: "Enter unique namespace",
            validation: formSchema.shape.namespace,
            required: true,
            helperText: "Unique namespace identifier (required)",
          },
          {
            name: "website",
            label: "Website",
            type: "url",
            placeholder: "https://example.com",
            validation: formSchema.shape.website,
            required: false,
            helperText: "Website URL (optional)",
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            placeholder: "Select status",
            validation: formSchema.shape.status,
            required: true,
            helperText: "Third party status",
            options: [
              { value: "1", label: "Active" },
              { value: "0", label: "Inactive" },
            ],
          },
          {
            name: "order_no",
            label: "Order Number",
            type: "number",
            placeholder: "Enter order number",
            validation: formSchema.shape.order_no,
            required: false,
            helperText: "Display order (optional)",
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
        submitText={thirdParty ? "Update Third Party" : "Create Third Party"}
        onSuccess={onCancel}
        defaultValues={{
          name: thirdParty?.name || "",
          namespace: thirdParty?.namespace || "",
          website: thirdParty?.website || "",
          status: thirdParty?.status?.toString() || "1",
          order_no: thirdParty?.order_no ?? undefined,
          profileImage: undefined,
        }}
      />
    </>
  );
}

