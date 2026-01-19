import * as z from "zod";
import { useState, useEffect } from "react";
import type { ThirdPartyService } from "./ThirdPartyServicesManagement";
import DynamicForm from "../shared/DynamicForm";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  namespace: z.string().min(2, "Namespace must be at least 2 characters"),
  service_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  status: z.coerce.number().int().min(0).max(1),
  order_no: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().int().positive().optional()
  ),
  profileImage: z.any().optional(),
});

interface ThirdPartyServiceFormProps {
  service: ThirdPartyService | null;
  thirdPartyId: number;
  onSubmit: (data: Omit<ThirdPartyService, "id" | "created_at" | "updated_at" | "third_party_id" | "config" | "image_url"> & { profileImage?: File[] }) => void;
  onCancel: () => void;
}

export function ThirdPartyServiceForm({ service, thirdPartyId, onSubmit, onCancel }: ThirdPartyServiceFormProps) {
  const isEdit = !!service;
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  // Use image_url from service data instead of fetching
  useEffect(() => {
    if (service?.image_url) {
      // If image_url is already a full URL, use it directly
      // If it's a file path, prepend the public file endpoint
      if (service.image_url.startsWith('http') || service.image_url.startsWith('/api/public/file')) {
        setExistingImageUrl(service.image_url);
      } else {
        setExistingImageUrl(`/api/public/file?file_url=${encodeURIComponent(service.image_url)}`);
      }
    } else {
      setExistingImageUrl(null);
    }
  }, [service]);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const validated = formSchema.parse(data);
      
      onSubmit({
        name: validated.name,
        namespace: validated.namespace,
        service_url: validated.service_url || null,
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
              {service?.name?.[0] || "S"}
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
            placeholder: "Enter service name",
            validation: formSchema.shape.name,
            required: true,
            helperText: "Service name (required)",
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
            name: "service_url",
            label: "Service URL",
            type: "url",
            placeholder: "https://api.example.com",
            validation: formSchema.shape.service_url,
            required: false,
            helperText: "Service URL (optional)",
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            placeholder: "Select status",
            validation: formSchema.shape.status,
            required: true,
            helperText: "Service status",
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
        submitText={service ? "Update Service" : "Create Service"}
        onSuccess={onCancel}
        defaultValues={{
          name: service?.name || "",
          namespace: service?.namespace || "",
          service_url: service?.service_url || "",
          status: service?.status?.toString() || "1",
          order_no: service?.order_no ?? undefined,
          profileImage: undefined,
        }}
      />
    </>
  );
}

