import * as z from "zod";
import type { ThirdParty } from "./ThirdPartiesManagement";
import DynamicForm from "../shared/DynamicForm";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  namespace: z.string().min(2, "Namespace must be at least 2 characters"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  status: z.coerce.number().int().min(0).max(1),
  order_no: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().int().positive().optional()
  ),
  organization_id: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().int().nullable().optional()
  ),
});

interface ThirdPartyFormProps {
  thirdParty: ThirdParty | null;
  onSubmit: (data: Omit<ThirdParty, "id" | "created_at" | "updated_at" | "image_id">) => void;
  onCancel: () => void;
}

export function ThirdPartyForm({ thirdParty, onSubmit, onCancel }: ThirdPartyFormProps) {
  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const validated = formSchema.parse(data);
      
      onSubmit({
        name: validated.name,
        namespace: validated.namespace,
        website: validated.website || null,
        status: validated.status,
        order_no: validated.order_no ?? null,
        organization_id: validated.organization_id ?? thirdParty?.organization_id ?? 1,
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
        submitText={thirdParty ? "Update Third Party" : "Create Third Party"}
        onSuccess={onCancel}
        defaultValues={{
          name: thirdParty?.name || "",
          namespace: thirdParty?.namespace || "",
          website: thirdParty?.website || "",
          status: thirdParty?.status?.toString() || "1",
          order_no: thirdParty?.order_no ?? undefined,
          organization_id: thirdParty?.organization_id?.toString() || "1",
        }}
      />
    </>
  );
}

