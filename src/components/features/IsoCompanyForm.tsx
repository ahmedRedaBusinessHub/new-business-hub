import * as z from "zod";
import { useState, useEffect } from "react";
import type { IsoCompany } from "./IsoCompaniesManagement";
import DynamicForm from "../shared/DynamicForm";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";

const formSchema = z.object({
  company_name: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  position: z.string().optional(),
  email: z.union([z.string().email("Invalid email"), z.literal("")]).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.union([z.string().url("Invalid URL"), z.literal("")]).optional(),
  notes: z.string().optional(),
  status: z.coerce.number().int().min(0).max(1),
  mainImage: z.any().optional(),
});

interface IsoCompanyFormProps {
  company: IsoCompany | null;
  onSubmit: (data: Omit<IsoCompany, "id" | "created_at" | "updated_at" | "image_url"> & { mainImage?: File[] }) => void;
  onCancel: () => void;
}

export function IsoCompanyForm({ company, onSubmit, onCancel }: IsoCompanyFormProps) {
  const isEdit = !!company;
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  // Use image_url from company data
  useEffect(() => {
    if (company?.image_url) {
      if (company.image_url.startsWith('http') || company.image_url.startsWith('/api/public/file')) {
        setExistingImageUrl(company.image_url);
      } else {
        setExistingImageUrl(`/api/public/file?file_url=${encodeURIComponent(company.image_url)}`);
      }
    } else {
      setExistingImageUrl(null);
    }
  }, [company]);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const validated = formSchema.parse(data);
      
      onSubmit({
        company_name: validated.company_name || null,
        name: validated.name,
        position: validated.position || null,
        email: validated.email || null,
        phone: validated.phone || null,
        address: validated.address || null,
        website: validated.website || null,
        notes: validated.notes || null,
        image_id: company?.image_id || null,
        status: validated.status,
        organization_id: company?.organization_id || 1,
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
              {company?.company_name?.[0] || company?.name?.[0] || "I"}
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
            name: "company_name",
            label: "Company Name",
            type: "text",
            placeholder: "Enter company name",
            validation: formSchema.shape.company_name,
            required: false,
            helperText: "Company name (optional)",
          },
          {
            name: "name",
            label: "Contact Person Name",
            type: "text",
            placeholder: "Enter contact person name",
            validation: formSchema.shape.name,
            required: true,
            helperText: "Contact person name (required)",
          },
          {
            name: "position",
            label: "Position",
            type: "text",
            placeholder: "Enter position/job title",
            validation: formSchema.shape.position,
            required: false,
            helperText: "Job position (optional)",
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
            name: "phone",
            label: "Phone",
            type: "text",
            placeholder: "Enter phone number",
            validation: formSchema.shape.phone,
            required: false,
            helperText: "Phone number (optional)",
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
            name: "address",
            label: "Address",
            type: "textarea",
            placeholder: "Enter address",
            validation: formSchema.shape.address,
            required: false,
            helperText: "Company address (optional)",
          },
          {
            name: "notes",
            label: "Notes",
            type: "textarea",
            placeholder: "Enter any notes",
            validation: formSchema.shape.notes,
            required: false,
            helperText: "Additional notes (optional)",
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            placeholder: "Select status",
            validation: formSchema.shape.status,
            required: true,
            helperText: "Company status",
            options: [
              { value: "1", label: "Active" },
              { value: "0", label: "Inactive" },
            ],
          },
          {
            name: "mainImage",
            label: "Company Logo/Image",
            type: "imageuploader",
            validation: formSchema.shape.mainImage,
            required: false,
            helperText: "Upload company logo or image (JPG, PNG, WEBP - Max 5MB)",
          },
        ]}
        onSubmit={handleSubmit}
        submitText={company ? "Update ISO Company" : "Create ISO Company"}
        onSuccess={onCancel}
        defaultValues={{
          company_name: company?.company_name || "",
          name: company?.name || "",
          position: company?.position || "",
          email: company?.email || "",
          phone: company?.phone || "",
          website: company?.website || "",
          address: company?.address || "",
          notes: company?.notes || "",
          status: company?.status?.toString() || "1",
          mainImage: undefined,
        }}
      />
    </>
  );
}
