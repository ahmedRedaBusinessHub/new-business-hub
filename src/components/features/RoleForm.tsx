import * as z from "zod";
import { useMemo } from "react";
import type { Role } from "./RoleManagement";
import DynamicForm, { type FormField } from "../shared/DynamicForm";
import { useI18n } from "@/hooks/useI18n";

const createFormSchema = (isEdit: boolean, t: (key: string) => string) => z.object({
  name: z.string().min(2, t("roles.roleNameHelper")),
  namespace: z.string().min(2, t("roles.namespaceHelper")).regex(/^[a-z0-9_-]+$/, t("roles.namespaceHelper")),
  status: z.coerce.number().int().min(0).max(1),
});

interface RoleFormProps {
  role: Role | null;
  onSubmit: (data: Omit<Role, "id" | "created_at" | "updated_at" | "organization_id">) => void;
  onCancel: () => void;
  onErrorStateChange?: (hasError: boolean) => void;
}

export function RoleForm({ role, onSubmit, onCancel, onErrorStateChange }: RoleFormProps) {
  const { t } = useI18n("admin");
  const isEdit = !!role;
  const formSchema = useMemo(() => createFormSchema(isEdit, t), [isEdit, t]);

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
      label: t("roles.roleName"),
      type: "text",
      placeholder: t("roles.roleNamePlaceholder"),
      validation: formSchema.shape.name,
      required: true,
      helperText: t("roles.roleNameHelper"),
    },
    {
      name: "namespace",
      label: t("roles.namespace"),
      type: "select",
      placeholder: t("roles.namespacePlaceholder"),
      validation: formSchema.shape.namespace,
      required: true,
      helperText: t("roles.namespaceHelper"),
      options: [
        { value: "admin", label: "Admin" },
        { value: "user", label: "User" },
        { value: "operation", label: "Operation" }
      ],
    },
    {
      name: "status",
      label: t("common.status"),
      type: "select",
      validation: formSchema.shape.status,
      required: true,
      helperText: t("common.status"),
      options: [
        { value: "1", label: t("common.active") },
        { value: "0", label: t("common.inactive") },
      ],
    },
  ], [formSchema, t]);

  return (
    <DynamicForm
      config={formConfig}
      defaultValues={defaultValuesMemo}
      onSubmit={handleSubmit}
      submitText={isEdit ? t("roles.editRole") : t("roles.createNewRole")}
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
