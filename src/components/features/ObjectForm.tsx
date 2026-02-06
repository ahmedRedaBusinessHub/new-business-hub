import * as z from "zod";
import { useState } from "react";
import type { ObjectItem } from "./ObjectsManagement";
import DynamicForm from "../shared/DynamicForm";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  namespace: z.string().min(2, "Namespace must be at least 2 characters").regex(/^[a-z0-9._-]+$/, "Namespace must be lowercase with dots, dashes, or underscores only"),
  type: z.coerce.number().int().min(1, "Type is required"),
  icon: z.string().optional().nullable(),
  parent_id: z.coerce.number().int().optional().nullable(),
  description: z.string().optional().nullable(),
  order_no: z.coerce.number().int().optional().nullable(),
  status: z.coerce.number().int().min(0).max(1),
});

interface ObjectFormProps {
  object: ObjectItem | null;
  allObjects: ObjectItem[];
  onSubmit: (data: Omit<ObjectItem, "id" | "created_at" | "updated_at" | "parent">) => void;
  onCancel: () => void;
}

export function ObjectForm({ object, allObjects, onSubmit, onCancel }: ObjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter out the current object from parent options (to prevent self-reference)
  const parentOptions = allObjects
    .filter(o => o.id !== object?.id)
    .map(o => ({
      value: o.id.toString(),
      label: `${o.name} (${o.namespace})`,
    }));

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      setIsSubmitting(true);
      const validated = formSchema.parse(data);

      onSubmit({
        name: validated.name,
        namespace: validated.namespace,
        type: validated.type,
        icon: validated.icon || null,
        parent_id: validated.parent_id || null,
        description: validated.description || null,
        order_no: validated.order_no || null,
        status: validated.status,
        organization_id: object?.organization_id || 1,
      });
    } catch (error) {
      console.error("Form validation error:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DynamicForm
      config={[
        {
          name: "name",
          label: "Name",
          type: "text",
          placeholder: "Enter object name",
          validation: formSchema.shape.name,
          required: true,
          helperText: "Display name for the object",
        },
        {
          name: "namespace",
          label: "Namespace",
          type: "select",
          placeholder: "e.g., admin.users, admin.settings",
          validation: formSchema.shape.namespace,
          required: true,
          helperText: "Unique identifier (lowercase, dots, dashes, underscores)",
          options: [

            { value: "all", label: "all" },
            { value: "news", label: "news" },

            { value: "programs", label: "programs" },
            { value: "projects", label: "projects" },
            { value: "reviews", label: "reviews" },
            { value: "dashboard", label: "dashboard" },
            { value: "users", label: "users" },
            { value: "newsletter-subscriptions", label: "newsletter-subscriptions" },
            { value: "iso-companies", label: "iso-companies" },
            { value: "success-partners", label: "success-partners" },
            { value: "contacts", label: "contacts" },
            { value: "roles", label: "roles" },
            { value: "objects", label: "objects" },
            { value: "galleries", label: "galleries" },
            { value: "static-lists", label: "static-lists" },
            { value: "settings", label: "settings" },
            { value: "cache-management", label: "cache-management" },
            { value: "permissions", label: "permissions" },
            { value: "role-permissions", label: "role-permissions" },
            { value: "user-roles", label: "user-roles" }

          ],
        },

        {
          name: "type",
          label: "Type",
          type: "select",
          placeholder: "Select type",
          validation: formSchema.shape.type,
          required: true,
          helperText: "Object type",
          options: [
            { value: "1", label: "Menu" },
            { value: "2", label: "Module" },
            { value: "3", label: "Permission" },
            { value: "4", label: "Page" },
            { value: "5", label: "Action" },
          ],
        },
        {
          name: "parent_id",
          label: "Parent Object",
          type: "select",
          placeholder: "Select parent (optional)",
          validation: formSchema.shape.parent_id,
          required: false,
          helperText: "Parent object for hierarchy",
          options: [
            { value: "", label: "None (Root Level)" },
            ...parentOptions,
          ],
        },
        {
          name: "icon",
          label: "Icon",
          type: "text",
          placeholder: "Enter icon name or emoji",
          validation: formSchema.shape.icon,
          required: false,
          helperText: "Icon identifier or emoji (optional)",
        },
        {
          name: "order_no",
          label: "Order",
          type: "number",
          placeholder: "Enter display order",
          validation: formSchema.shape.order_no,
          required: false,
          helperText: "Display order (optional)",
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          placeholder: "Enter description",
          validation: formSchema.shape.description,
          required: false,
          helperText: "Object description (optional)",
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          placeholder: "Select status",
          validation: formSchema.shape.status,
          required: true,
          helperText: "Object status",
          options: [
            { value: "1", label: "Active" },
            { value: "0", label: "Inactive" },
          ],
        },
      ]}
      onSubmit={handleSubmit}
      submitText={object ? "Update Object" : "Create Object"}
      onSuccess={onCancel}
      defaultValues={{
        name: object?.name || "",
        namespace: object?.namespace || "",
        type: object?.type?.toString() || "",
        parent_id: object?.parent_id?.toString() || "",
        icon: object?.icon || "",
        order_no: object?.order_no?.toString() || "",
        description: object?.description || "",
        status: object?.status?.toString() || "1",
      }}
    />
  );
}
