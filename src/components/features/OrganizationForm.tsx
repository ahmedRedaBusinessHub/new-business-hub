import * as z from "zod";
import { useState, useEffect, useMemo } from "react";
import type { Organization } from "./OrganizationsManagement";
import DynamicForm, { type FormField } from "../shared/DynamicForm";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { useI18n } from "@/hooks/useI18n";

interface OrganizationFormProps {
  organization: Organization | null;
  onSubmit: (data: Omit<Organization, "id" | "created_at" | "updated_at" | "image_url" | "organization_id"> & { profileImage?: File[] }) => void;
  onCancel: () => void;
}

export function OrganizationForm({ organization, onSubmit, onCancel }: OrganizationFormProps) {
  const { t } = useI18n("admin");
  const isEdit = !!organization;
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const formSchema = useMemo(() => z.object({
    name: z.string().min(2, t("organizations.orgNameHelper")),
    namespace: z.string().min(2, t("organizations.orgNamespaceHelper")),
    email: z.string().email(t("users.emailHelper")).optional(),
    country_code: z.string().optional(),
    mobile: z.string().optional(),
    category_id: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
      z.number().int().nullable().optional()
    ),
    status: z.coerce.number().int().min(0).max(1),
    profileImage: z.any().optional(),
  }), [t]);

  // Use image_url from organization data instead of fetching
  useEffect(() => {
    if (organization?.image_url) {
      if (organization.image_url.startsWith('http') || organization.image_url.startsWith('/api/public/file')) {
        setExistingImageUrl(organization.image_url);
      } else {
        setExistingImageUrl(`/api/public/file?file_url=${encodeURIComponent(organization.image_url)}`);
      }
    } else {
      setExistingImageUrl(null);
    }
  }, [organization]);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const validated = formSchema.parse(data);

      onSubmit({
        name: validated.name,
        namespace: validated.namespace,
        email: validated.email || null,
        country_code: validated.country_code || null,
        mobile: validated.mobile || null,
        category_id: validated.category_id ?? null,
        status: validated.status,
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
      label: t("organizations.orgName"),
      type: "text",
      placeholder: t("organizations.orgNamePlaceholder"),
      validation: formSchema.shape.name,
      required: true,
      helperText: t("organizations.orgNameHelper"),
    },
    {
      name: "namespace",
      label: t("organizations.orgNamespace"),
      type: "text",
      placeholder: t("organizations.orgNamespacePlaceholder"),
      validation: formSchema.shape.namespace,
      required: true,
      helperText: t("organizations.orgNamespaceHelper"),
    },
    {
      name: "email",
      label: t("users.email"),
      type: "email",
      placeholder: t("users.emailPlaceholder"),
      validation: formSchema.shape.email,
      required: false,
      helperText: t("users.emailHelper"),
    },
    {
      name: "country_code",
      label: t("users.countryCode"),
      type: "text",
      placeholder: t("users.countryCodePlaceholder"),
      validation: formSchema.shape.country_code,
      required: false,
      helperText: t("users.countryCodeHelper"),
    },
    {
      name: "mobile",
      label: t("users.mobile"),
      type: "tel",
      placeholder: t("users.mobilePlaceholder"),
      validation: formSchema.shape.mobile,
      required: false,
      helperText: t("users.mobileHelper"),
    },
    {
      name: "category_id",
      label: t("organizations.categoryId"),
      type: "number",
      placeholder: t("organizations.categoryIdPlaceholder"),
      validation: formSchema.shape.category_id,
      required: false,
      helperText: t("organizations.categoryIdHelper"),
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
      name: "profileImage",
      label: t("organizations.orgProfileImage"),
      type: "imageuploader",
      validation: formSchema.shape.profileImage,
      required: false,
      helperText: t("organizations.orgProfileImageHelper"),
    },
  ], [formSchema, t]);

  return (
    <>
      {isEdit && existingImageUrl && (
        <div className="mb-6 flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
          <Avatar className="size-20">
            <AvatarImage src={existingImageUrl} alt={t("users.currentProfilePicture")} />
            <AvatarFallback>
              {organization?.name?.[0] || "O"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">{t("users.currentProfilePicture")}</p>
            <p className="text-xs text-muted-foreground">
              {t("users.uploadNewImage")}
            </p>
          </div>
        </div>
      )}
      <DynamicForm
        config={formConfig}
        onSubmit={handleSubmit}
        submitText={organization ? t("organizations.edit") : t("organizations.createNew")}
        onSuccess={onCancel}
        defaultValues={{
          name: organization?.name || "",
          namespace: organization?.namespace || "",
          email: organization?.email || "",
          country_code: organization?.country_code || "",
          mobile: organization?.mobile || "",
          category_id: organization?.category_id?.toString() || "",
          status: organization?.status?.toString() || "1",
          profileImage: undefined,
        }}
      />
    </>
  );
}

