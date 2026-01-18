import * as z from "zod";
import type { NewsletterSubscription } from "./NewsletterSubscriptionsManagement";
import DynamicForm from "../shared/DynamicForm";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional(),
  status: z.coerce.number().int().min(0).max(1),
  organization_id: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().int().nullable().optional()
  ),
});

interface NewsletterSubscriptionFormProps {
  subscription: NewsletterSubscription | null;
  onSubmit: (data: Omit<NewsletterSubscription, "id" | "created_at" | "updated_at">) => void;
  onCancel: () => void;
}

export function NewsletterSubscriptionForm({ subscription, onSubmit, onCancel }: NewsletterSubscriptionFormProps) {
  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const validated = formSchema.parse(data);
      
      onSubmit({
        email: validated.email,
        name: validated.name || null,
        status: validated.status,
        organization_id: validated.organization_id ?? subscription?.organization_id ?? 1,
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
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "Enter email address",
            validation: formSchema.shape.email,
            required: true,
            helperText: "Email address (required)",
          },
          {
            name: "name",
            label: "Name",
            type: "text",
            placeholder: "Enter name",
            validation: formSchema.shape.name,
            required: false,
            helperText: "Subscriber name (optional)",
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            placeholder: "Select status",
            validation: formSchema.shape.status,
            required: true,
            helperText: "Subscription status",
            options: [
              { value: "1", label: "Active" },
              { value: "0", label: "Inactive" },
            ],
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
        submitText={subscription ? "Update Subscription" : "Create Subscription"}
        onSuccess={onCancel}
        defaultValues={{
          email: subscription?.email || "",
          name: subscription?.name || "",
          status: subscription?.status?.toString() || "1",
          organization_id: subscription?.organization_id?.toString() || "1",
        }}
      />
    </>
  );
}

