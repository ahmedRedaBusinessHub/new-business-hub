import * as z from "zod";
import { useState, useEffect, useMemo } from "react";
import type { SuccessPartner } from "./SuccessPartnersManagement";
import DynamicForm, { type FormField } from "../shared/DynamicForm";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { useI18n } from "@/hooks/useI18n";

interface SuccessPartnerFormProps {
  partner: SuccessPartner | null;
  onSubmit: (data: Omit<SuccessPartner, "id" | "created_at" | "updated_at" | "image_url"> & { mainImage?: File[] }) => void;
  onCancel: () => void;
}

export function SuccessPartnerForm({ partner, onSubmit, onCancel }: SuccessPartnerFormProps) {
  const { t } = useI18n("admin");
  const isEdit = !!partner;
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const formSchema = useMemo(() => z.object({
    name_ar: z.string().min(2, t("entities.successPartners.nameArPlaceholder")),
    name_en: z.string().optional(),
    status: z.coerce.number().int().min(0).max(1),
    mainImage: z.any().optional(),
  }), [t]);

  // Use image_url from partner data
  useEffect(() => {
    if (partner?.image_url) {
      if (partner.image_url.startsWith('http') || partner.image_url.startsWith('/api/public/file')) {
        setExistingImageUrl(partner.image_url);
      } else {
        setExistingImageUrl(`/api/public/file?file_url=${encodeURIComponent(partner.image_url)}`);
      }
    } else {
      setExistingImageUrl(null);
    }
  }, [partner]);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const validated = formSchema.parse(data);

      onSubmit({
        name_ar: validated.name_ar,
        name_en: validated.name_en || null,
        image_id: partner?.image_id || null,
        status: validated.status,
        organization_id: partner?.organization_id || 1,
        mainImage: validated.mainImage,
      });
    } catch (error) {
      console.error("Form validation error:", error);
      throw error;
    }
  };

  const formConfig = useMemo((): FormField[] => [
    {
      name: "name_ar",
      label: t("entities.successPartners.nameAr"),
      type: "text",
      placeholder: t("entities.successPartners.nameArPlaceholder"),
      validation: formSchema.shape.name_ar,
      required: true,
      helperText: `${t("entities.successPartners.nameAr")} ${t("entities.successPartners.helperTextRequired")}`,
    },
    {
      name: "name_en",
      label: t("entities.successPartners.nameEn"),
      type: "text",
      placeholder: t("entities.successPartners.nameEnPlaceholder"),
      validation: formSchema.shape.name_en,
      required: false,
      helperText: `${t("entities.successPartners.nameEn")} ${t("entities.successPartners.helperTextOptional")}`,
    },
    {
      name: "status",
      label: t("common.status"),
      type: "select",
      placeholder: t("common.status"),
      validation: formSchema.shape.status,
      required: true,
      helperText: t("common.status"),
      options: [
        { value: "1", label: t("entities.successPartners.statusActive") },
        { value: "0", label: t("entities.successPartners.statusInactive") },
      ],
    },
    {
      name: "mainImage",
      label: t("entities.successPartners.partnerImage"),
      type: "imageuploader",
      validation: formSchema.shape.mainImage,
      required: false,
      helperText: t("entities.successPartners.partnerImageHelper"),
    },
  ], [formSchema, t]);

  return (
    <>
      {isEdit && existingImageUrl && (
        <div className="mb-6 flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
          <Avatar className="size-20">
            <AvatarImage src={existingImageUrl} alt={t("entities.successPartners.currentImage")} />
            <AvatarFallback>
              {partner?.name_ar?.[0] || partner?.name_en?.[0] || "S"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">{t("entities.successPartners.currentImage")}</p>
            <p className="text-xs text-muted-foreground">
              {t("entities.successPartners.uploadNewImage")}
            </p>
          </div>
        </div>
      )}
      <DynamicForm
        config={formConfig}
        onSubmit={handleSubmit}
        submitText={partner ? t("entities.successPartners.edit") : t("entities.successPartners.createNew")}
        onSuccess={onCancel}
        defaultValues={{
          name_ar: partner?.name_ar || "",
          name_en: partner?.name_en || "",
          status: partner?.status?.toString() || "1",
          mainImage: undefined,
        }}
      />
    </>
  );
}
