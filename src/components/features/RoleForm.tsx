import * as z from "zod";
import { useMemo } from "react";
import type { Role } from "./RoleManagement";
import DynamicForm, { type FormField } from "../shared/DynamicForm";

const createFormSchema = (isEdit: boolean) => z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  namespace: z.string().min(2, "Namespace must be at least 2 characters").regex(/^[a-z0-9_-]+$/, "Namespace must contain only lowercase letters, numbers, hyphens, and underscores"),
  status: z.coerce.number().int().min(0).max(1),
});

interface RoleFormProps {
  role: Role | null;
  onSubmit: (data: Omit<Role, "id" | "created_at" | "updated_at" | "organization_id">) => void;
  onCancel: () => void;
  onErrorStateChange?: (hasError: boolean) => void;
}

export function RoleForm({ role, onSubmit, onCancel, onErrorStateChange }: RoleFormProps) {
  const isEdit = !!role;
  const formSchema = useMemo(() => createFormSchema(isEdit), [isEdit]);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const validated = formSchema.parse(data);
      await onSubmit({
        name: validated.name,
        namespace: validated.namespace,
        status: validated.status,
      });
    } catch (error: any) {
      if (error.issues || error.name === 'ZodError') {
        console.error("Form validation error:", error);
      }
      throw error;
    }
  };

  const defaultValuesMemo = useMemo(() => {
    if (!role) {
      return {
        name: "",
        namespace: "",
        status: "1",
      };
    }

    return {
      name: role.name || "",
      namespace: role.namespace || "",
      status: role.status?.toString() || "1",
    };
  }, [role]);

  const formConfig = useMemo((): FormField[] => [
    {
      name: "name",
      label: "Role Name",
      type: "text",
      placeholder: "Enter role name",
      validation: formSchema.shape.name,
      required: true,
      helperText: "Name of the role (2+ characters)",
    },


    {
      name: "namespace",
      label: "Namespace",
      type: "select",
      placeholder: "e.g., admin, manager, user",
      validation: formSchema.shape.namespace,
      required: true,
      helperText: "Unique identifier (lowercase, numbers, hyphens, underscores only)",
      options: [
        { value: "admin", label: "Admin" },
        { value: "user", label: "User" },

        { value: "operation", label: "Operation" }

      ],
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      validation: formSchema.shape.status,
      required: true,
      helperText: "Role status",
      options: [
        { value: "1", label: "Active" },
        { value: "0", label: "Inactive" },
      ],
    },
  ], [formSchema]);

  return (
    <DynamicForm
      config={formConfig}
      defaultValues={defaultValuesMemo}
      onSubmit={handleSubmit}
      submitText={isEdit ? "Update Role" : "Create Role"}
      onSuccess={() => {
        onErrorStateChange?.(false);
        onCancel();
      }}
      onError={(error) => {
        if (!error.fieldErrors || Object.keys(error.fieldErrors).length === 0) {
          // Error toast will be shown by DynamicForm
        }
        onErrorStateChange?.(true);
      }}
      key={role?.id || "new"}
    />
  );
}
