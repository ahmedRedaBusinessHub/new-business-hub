import * as z from "zod";
import type { Setting } from "./SettingsManagement";
import DynamicForm from "../shared/DynamicForm";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  namespace: z.string().min(2, "Namespace must be at least 2 characters"),
  key_value: z.string().optional(),
  status: z.coerce.number().int().min(0).max(1),
  order_no: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().int().positive().optional()
  ),
});

type FormValues = z.infer<typeof formSchema>;

interface SettingsFormProps {
  setting: Setting | null;
  onSubmit: (data: Omit<Setting, "id" | "created_at" | "updated_at">) => void;
  onCancel: () => void;
}

export function SettingsForm({
  setting,
  onSubmit,
  onCancel,
}: SettingsFormProps) {
  const handleSubmit = async (data: Record<string, any>) => {
    const validated = formSchema.parse(data);
    const payload = {
      name: validated.name,
      namespace: validated.namespace,
      key_value: validated.key_value !== undefined ? validated.key_value : null,
      status: validated.status,
      order_no: validated.order_no ?? null,
    };
    onSubmit(payload);
  };

  return (
    <>
      <DynamicForm
        config={[
          {
            name: "name",
            label: "Name",
            type: "text",
            placeholder: "Enter setting name",
            validation: formSchema.shape.name,
            required: true,
            helperText: "A descriptive name for this setting",
          },

          {
            name: "namespace",
            label: "Namespace",
            type: "select",
            placeholder: "e.g., app.title",
            validation: formSchema.shape.namespace,
            required: true,
            helperText: "Unique identifier for this setting (e.g., app.title, site.name)",
            options: [
              { value: "TWO_FACTOR_AUTHENTICATION_FLAG", label: "TWO_FACTOR_AUTHENTICATION_FLAG" },
              { value: "Unauthorized", label: "Unauthorized" },

            ],
          },
          {
            name: "key_value",
            label: "Value",
            type: "textarea",
            placeholder: "Enter setting value",
            validation: formSchema.shape.key_value,
            required: false,
            helperText: "The value for this setting",
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            placeholder: "Select status",
            validation: formSchema.shape.status,
            required: true,
            helperText: "Active settings are enabled in the system",
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
        ]}
        onSubmit={handleSubmit}
        submitText={setting ? "Update Setting" : "Create Setting"}
        onSuccess={onCancel}
        defaultValues={{
          name: setting?.name || "",
          namespace: setting?.namespace || "",
          key_value: setting?.key_value || "",
          status: setting?.status?.toString() || "1",
          order_no: setting?.order_no ?? undefined,
        }}
      />
    </>
  );
}

