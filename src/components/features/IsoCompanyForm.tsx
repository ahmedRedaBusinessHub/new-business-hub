import * as z from "zod";
import { useState, useEffect, useMemo } from "react";
import type { IsoCompany } from "./IsoCompaniesManagement";
import DynamicForm, { type FormField } from "../shared/DynamicForm";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { useI18n } from "@/hooks/useI18n";

interface IsoCompanyFormProps {
  company: IsoCompany | null;
  onSubmit: (data: Omit<IsoCompany, "id" | "created_at" | "updated_at" | "image_url"> & { mainImage?: File[] }) => void;
  onCancel: () => void;
}

export function IsoCompanyForm({ company, onSubmit, onCancel }: IsoCompanyFormProps) {
  const { t } = useI18n("admin");
  const isEdit = !!company;
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const formSchema = useMemo(() => z.object({
    company_name: z.string().optional(),
    name: z.string().min(2, t("entities.isoCompanies.companyNamePlaceholder")),
    position: z.string().optional(),
    email: z.union([z.string().email(t("users.emailHelper")), z.literal("")]).optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    website: z.union([z.string().url(t("entities.isoCompanies.websitePlaceholder")), z.literal("")]).optional(),
    certificate_code: z.string().optional(),
    certificate_name_ar: z.string().optional(),
    certificate_name_en: z.string().optional(),
    notes: z.string().optional(),
    status: z.coerce.number().int().min(0).max(1),
    mainImage: z.any().optional(),
  }), [t]);

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
        certificate_code: validated.certificate_code || null,
        certificate_name_ar: validated.certificate_name_ar || null,
        certificate_name_en: validated.certificate_name_en || null,
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

  const formConfig = useMemo((): FormField[] => [
    {
      name: "company_name",
      label: t("entities.isoCompanies.companyName"),
      type: "text",
      placeholder: t("entities.isoCompanies.companyNamePlaceholder"),
      validation: formSchema.shape.company_name,
      required: false,
      helperText: `${t("entities.isoCompanies.companyName")} ${t("entities.isoCompanies.helperTextOptional")}`,
    },
    {
      name: "name",
      label: t("entities.isoCompanies.contactPerson"),
      type: "text",
      placeholder: t("entities.isoCompanies.contactPersonPlaceholder"),
      validation: formSchema.shape.name,
      required: true,
      helperText: `${t("entities.isoCompanies.contactPerson")} ${t("entities.isoCompanies.helperTextRequired")}`,
    },
    {
      name: "position",
      label: t("entities.isoCompanies.position"),
      type: "text",
      placeholder: t("entities.isoCompanies.positionPlaceholder"),
      validation: formSchema.shape.position,
      required: false,
      helperText: `${t("entities.isoCompanies.position")} ${t("entities.isoCompanies.helperTextOptional")}`,
    },
    {
      name: "email",
      label: t("entities.isoCompanies.email"),
      type: "email",
      placeholder: t("entities.isoCompanies.emailPlaceholder"),
      validation: formSchema.shape.email,
      required: false,
      helperText: `${t("entities.isoCompanies.email")} ${t("entities.isoCompanies.helperTextOptional")}`,
    },
    {
      name: "phone",
      label: t("entities.isoCompanies.phone"),
      type: "text",
      placeholder: t("entities.isoCompanies.phonePlaceholder"),
      validation: formSchema.shape.phone,
      required: false,
      helperText: `${t("entities.isoCompanies.phone")} ${t("entities.isoCompanies.helperTextOptional")}`,
    },
    {
      name: "website",
      label: t("entities.isoCompanies.website"),
      type: "url",
      placeholder: t("entities.isoCompanies.websitePlaceholder"),
      validation: formSchema.shape.website,
      required: false,
      helperText: `${t("entities.isoCompanies.website")} ${t("entities.isoCompanies.helperTextOptional")}`,
    },
    {
      name: "certificate_code",
      label: t("entities.isoCompanies.certificateCode"),
      type: "text",
      placeholder: t("entities.isoCompanies.certificateCodePlaceholder"),
      validation: formSchema.shape.certificate_code,
      required: false,
      helperText: `${t("entities.isoCompanies.certificateCode")} ${t("entities.isoCompanies.helperTextOptional")}`,
    },
    {
      name: "certificate_name_ar",
      label: t("entities.isoCompanies.certificateNameAr"),
      type: "text",
      placeholder: t("entities.isoCompanies.certificateNameArPlaceholder"),
      validation: formSchema.shape.certificate_name_ar,
      required: false,
      helperText: `${t("entities.isoCompanies.certificateNameAr")} ${t("entities.isoCompanies.helperTextOptional")}`,
    },
    {
      name: "certificate_name_en",
      label: t("entities.isoCompanies.certificateNameEn"),
      type: "text",
      placeholder: t("entities.isoCompanies.certificateNameEnPlaceholder"),
      validation: formSchema.shape.certificate_name_en,
      required: false,
      helperText: `${t("entities.isoCompanies.certificateNameEn")} ${t("entities.isoCompanies.helperTextOptional")}`,
    },
    {
      name: "address",
      label: t("entities.isoCompanies.address"),
      type: "textarea",
      placeholder: t("entities.isoCompanies.addressPlaceholder"),
      validation: formSchema.shape.address,
      required: false,
      helperText: `${t("entities.isoCompanies.address")} ${t("entities.isoCompanies.helperTextOptional")}`,
    },
    {
      name: "notes",
      label: t("entities.isoCompanies.notes"),
      type: "textarea",
      placeholder: t("entities.isoCompanies.notesPlaceholder"),
      validation: formSchema.shape.notes,
      required: false,
      helperText: `${t("entities.isoCompanies.notes")} ${t("entities.isoCompanies.helperTextOptional")}`,
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
        { value: "1", label: t("common.active") },
        { value: "0", label: t("common.inactive") },
      ],
    },
    {
      name: "mainImage",
      label: t("entities.isoCompanies.companyImage"),
      type: "imageuploader",
      validation: formSchema.shape.mainImage,
      required: false,
      helperText: t("entities.isoCompanies.companyImageHelper"),
    },
  ], [formSchema, t]);

  return (
    <>
      {isEdit && existingImageUrl && (
        <div className="mb-6 flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
          <Avatar className="size-20">
            <AvatarImage src={existingImageUrl} alt={t("entities.isoCompanies.currentImage")} />
            <AvatarFallback>
              {company?.company_name?.[0] || company?.name?.[0] || "I"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">{t("entities.isoCompanies.currentImage")}</p>
            <p className="text-xs text-muted-foreground">
              {t("entities.isoCompanies.uploadNewImage")}
            </p>
          </div>
        </div>
      )}
      <DynamicForm
        config={formConfig}
        onSubmit={handleSubmit}
        submitText={company ? t("entities.isoCompanies.edit") : t("entities.isoCompanies.createNew")}
        onSuccess={onCancel}
        defaultValues={{
          company_name: company?.company_name || "",
          name: company?.name || "",
          position: company?.position || "",
          email: company?.email || "",
          phone: company?.phone || "",
          website: company?.website || "",
          certificate_code: company?.certificate_code || "",
          certificate_name_ar: company?.certificate_name_ar || "",
          certificate_name_en: company?.certificate_name_en || "",
          address: company?.address || "",
          notes: company?.notes || "",
          status: company?.status?.toString() || "1",
          mainImage: undefined,
        }}
      />
    </>
  );
}
