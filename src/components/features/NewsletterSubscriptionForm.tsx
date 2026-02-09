import * as z from "zod";
import { useMemo } from "react";
import type { NewsletterSubscription } from "./NewsletterSubscriptionsManagement";
import DynamicForm, { type FormField } from "../shared/DynamicForm";
import { useI18n } from "@/hooks/useI18n";

interface NewsletterSubscriptionFormProps {
  subscription: NewsletterSubscription | null;
  onSubmit: (data: Omit<NewsletterSubscription, "id" | "created_at" | "updated_at">) => void;
  onCancel: () => void;
}

export function NewsletterSubscriptionForm({ subscription, onSubmit, onCancel }: NewsletterSubscriptionFormProps) {
  const { t } = useI18n("admin");

  const formSchema = useMemo(() => z.object({
    email: z.string().email(t("entities.newsletterSubscriptions.emailHelper")),
    name: z.string().optional(),
    status: z.coerce.number().int().min(0).max(1),
  }), [t]);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const validated = formSchema.parse(data);

      onSubmit({
        email: validated.email,
        name: validated.name || null,
        status: validated.status,
        organization_id: subscription?.organization_id || 1,
      });
    } catch (error) {
      console.error("Form validation error:", error);
      throw error;
    }
  };

  const formConfig = useMemo((): FormField[] => [
    {
      name: "email",
      label: t("entities.newsletterSubscriptions.email"),
      type: "email",
      placeholder: t("entities.newsletterSubscriptions.emailPlaceholder"),
      validation: formSchema.shape.email,
      required: true,
      helperText: t("entities.newsletterSubscriptions.emailHelper"),
    },
    {
      name: "name",
      label: t("entities.newsletterSubscriptions.subscriberName"),
      type: "text",
      placeholder: t("entities.newsletterSubscriptions.subscriberNamePlaceholder"),
      validation: formSchema.shape.name,
      required: false,
      helperText: t("entities.newsletterSubscriptions.nameHelper"),
    },
    {
      name: "status",
      label: t("common.status"),
      type: "select",
      placeholder: t("common.status"),
      validation: formSchema.shape.status,
      required: true,
      helperText: t("entities.newsletterSubscriptions.statusHelper"),
      options: [
        { value: "1", label: t("entities.newsletterSubscriptions.statusActive") },
        { value: "0", label: t("entities.newsletterSubscriptions.statusInactive") },
      ],
    },
  ], [formSchema, t]);

  return (
    <>
      <DynamicForm
        config={formConfig}
        onSubmit={handleSubmit}
        submitText={subscription ? t("entities.newsletterSubscriptions.edit") : t("entities.newsletterSubscriptions.createNew")}
        onSuccess={onCancel}
        defaultValues={{
          email: subscription?.email || "",
          name: subscription?.name || "",
          status: subscription?.status?.toString() || "1",
        }}
      />
    </>
  );
}

