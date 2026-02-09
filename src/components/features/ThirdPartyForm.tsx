import * as z from "zod";
import { useState, useEffect, useMemo } from "react";
import type { ThirdParty } from "./ThirdPartiesManagement";
import DynamicForm, { type FormField } from "../shared/DynamicForm";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { useI18n } from "@/hooks/useI18n";

interface ThirdPartyFormProps {
  thirdParty: ThirdParty | null;
  onSubmit: (data: Omit<ThirdParty, "id" | "created_at" | "updated_at" | "image_url"> & { profileImage?: File[] }) => void;
  onCancel: () => void;
}

export function ThirdPartyForm({ thirdParty, onSubmit, onCancel }: ThirdPartyFormProps) {
  const { t } = useI18n("admin");
  const isEdit = !!thirdParty;
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const formSchema = useMemo(() => z.object({
    name: z.string().min(2, t("entities.thirdParties.nameHelper")),
    namespace: z.string().min(2, t("entities.thirdParties.namespaceHelper")),
    website: z.string().url(t("entities.thirdParties.websitePlaceholder")).optional().or(z.literal("")),
    status: z.coerce.number().int().min(0).max(1),
    order_no: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
      z.number().int().positive().optional()
    ),
    profileImage: z.any().optional(),
  }), [t]);

  // Use image_url from thirdParty data instead of fetching
  useEffect(() => {
    if (thirdParty?.image_url) {
      if (thirdParty.image_url.startsWith('http') || thirdParty.image_url.startsWith('/api/public/file')) {
        setExistingImageUrl(thirdParty.image_url);
      } else {
        setExistingImageUrl(`/api/public/file?file_url=${encodeURIComponent(thirdParty.image_url)}`);
      }
    } else {
      setExistingImageUrl(null);
    }
  }, [thirdParty]);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const validated = formSchema.parse(data);

      onSubmit({
        name: validated.name,
        namespace: validated.namespace,
        website: validated.website || null,
        status: validated.status,
        order_no: validated.order_no ?? null,
        organization_id: thirdParty?.organization_id || 1,
        profileImage: validated.profileImage,
      });
    } catch (error) {
      console.error("Form validation error:", error);
      throw error;
    }
  };

  const formConfig = useMemo((): FormField[] => [
    {
      name: "name",
      label: t("entities.thirdParties.name"),
      type: "text",
      placeholder: t("entities.thirdParties.namePlaceholder"),
      validation: formSchema.shape.name,
      required: true,
      helperText: t("entities.thirdParties.nameHelper"),
    },
    {
      name: "namespace",
      label: t("entities.thirdParties.namespace"),
      type: "text",
      placeholder: t("entities.thirdParties.namespacePlaceholder"),
      validation: formSchema.shape.namespace,
      required: true,
      helperText: t("entities.thirdParties.namespaceHelper"),
    },
    {
      name: "website",
      label: t("entities.thirdParties.website"),
      type: "url",
      placeholder: t("entities.thirdParties.websitePlaceholder"),
      validation: formSchema.shape.website,
      required: false,
      helperText: `${t("entities.thirdParties.website")} ${t("entities.thirdParties.helperTextOptional")}`,
    },
    {
      name: "status",
      label: t("common.status"),
      type: "select",
      placeholder: t("common.status"),
      validation: formSchema.shape.status,
      required: true,
      helperText: t("entities.thirdParties.statusHelper"),
      options: [
        { value: "1", label: t("entities.thirdParties.statusActive") },
        { value: "0", label: t("entities.thirdParties.statusInactive") },
      ],
    },
    {
      name: "order_no",
      label: t("entities.thirdParties.orderNo"),
      type: "number",
      placeholder: t("entities.thirdParties.orderNoPlaceholder"),
      validation: formSchema.shape.order_no,
      required: false,
      helperText: t("entities.thirdParties.orderNoHelper"),
    },
    {
      name: "profileImage",
      label: t("entities.thirdParties.profileImage"),
      type: "imageuploader",
      validation: formSchema.shape.profileImage,
      required: false,
      helperText: t("entities.thirdParties.profileImageHelper"),
    },
  ], [formSchema, t]);

  return (
    <>
      {isEdit && existingImageUrl && (
        <div className="mb-6 flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
          <Avatar className="size-20">
            <AvatarImage src={existingImageUrl} alt={t("entities.thirdParties.currentImage")} />
            <AvatarFallback>
              {thirdParty?.name?.[0] || "T"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">{t("entities.thirdParties.currentImage")}</p>
            <p className="text-xs text-muted-foreground">
              {t("entities.thirdParties.uploadNewImage")}
            </p>
          </div>
        </div>
      )}
      <DynamicForm
        config={formConfig}
        onSubmit={handleSubmit}
        submitText={thirdParty ? t("entities.thirdParties.edit") : t("entities.thirdParties.createNew")}
        onSuccess={onCancel}
        defaultValues={{
          name: thirdParty?.name || "",
          namespace: thirdParty?.namespace || "",
          website: thirdParty?.website || "",
          status: thirdParty?.status?.toString() || "1",
          order_no: thirdParty?.order_no ?? undefined,
          profileImage: undefined,
        }}
      />
    </>
  );
}

