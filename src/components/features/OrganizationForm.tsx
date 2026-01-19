import * as z from "zod";
import { useState, useEffect } from "react";
import type { Organization } from "./OrganizationsManagement";
import DynamicForm from "../shared/DynamicForm";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  namespace: z.string().min(2, "Namespace must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional(),
  country_code: z.string().optional(),
  mobile: z.string().optional(),
  category_id: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().int().nullable().optional()
  ),
  status: z.coerce.number().int().min(0).max(1),
  profileImage: z.any().optional(),
});

interface OrganizationFormProps {
  organization: Organization | null;
  onSubmit: (data: Omit<Organization, "id" | "created_at" | "updated_at" | "image_url"> & { profileImage?: File[] }) => void;
  onCancel: () => void;
}

export function OrganizationForm({ organization, onSubmit, onCancel }: OrganizationFormProps) {
  const isEdit = !!organization;
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  // Use image_url from organization data instead of fetching
  useEffect(() => {
    if (organization?.image_url) {
      // If image_url is already a full URL, use it directly
      // If it's a file path, prepend the public file endpoint
      if (organization.image_url.startsWith('http') || organization.image_url.startsWith('/api/public/file')) {
        setExistingImageUrl(organization.image_url);
      } else {
        setExistingImageUrl(`/api/public/file?file_url=${encodeURIComponent(organization.image_url)}`);
      }
    } else {
      setExistingImageUrl(null);
    }
  }, [organization]);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const validated = formSchema.parse(data);
      
      onSubmit({
        name: validated.name,
        namespace: validated.namespace,
        email: validated.email || null,
        country_code: validated.country_code || null,
        mobile: validated.mobile || null,
        category_id: validated.category_id ?? null,
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
              {organization?.name?.[0] || "O"}
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
            placeholder: "Enter organization name",
            validation: formSchema.shape.name,
            required: true,
            helperText: "Organization name (required)",
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
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "Enter email address",
            validation: formSchema.shape.email,
            required: false,
            helperText: "Email address (optional)",
          },
          {
            name: "country_code",
            label: "Country Code",
            type: "text",
            placeholder: "e.g., +1, +966",
            validation: formSchema.shape.country_code,
            required: false,
            helperText: "Country calling code (optional)",
          },
          {
            name: "mobile",
            label: "Mobile Number",
            type: "tel",
            placeholder: "Enter mobile number",
            validation: formSchema.shape.mobile,
            required: false,
            helperText: "Mobile phone number (optional)",
          },
          {
            name: "category_id",
            label: "Category ID",
            type: "number",
            placeholder: "Enter category ID",
            validation: formSchema.shape.category_id,
            required: false,
            helperText: "Category ID (optional)",
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            placeholder: "Select status",
            validation: formSchema.shape.status,
            required: true,
            helperText: "Organization status",
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
        submitText={organization ? "Update Organization" : "Create Organization"}
        onSuccess={onCancel}
        defaultValues={{
          name: organization?.name || "",
          namespace: organization?.namespace || "",
          email: organization?.email || "",
          country_code: organization?.country_code || "",
          mobile: organization?.mobile || "",
          category_id: organization?.category_id?.toString() || "",
          status: organization?.status?.toString() || "1",
          profileImage: undefined,
        }}
      />
    </>
  );
}

