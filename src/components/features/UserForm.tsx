import * as z from "zod";
import { useMemo, useState, useEffect } from "react";
import type { User } from "./UserManagement";
import DynamicForm, { type FormField } from "../shared/DynamicForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { useI18n } from "@/hooks/useI18n";

const createFormSchema = (isEdit: boolean, t: (key: string) => string) => z.object({
  username: z.string().min(3, t("users.usernameHelper")),
  first_name: z.string().min(2, t("users.firstNameHelper")),
  last_name: z.string().optional(),
  email: z.string().email(t("users.emailHelper")),
  country_code: z.string().min(1, t("users.countryCodeHelper")),
  mobile: z.string().min(5, t("users.mobileHelper")),
  password: isEdit
    ? z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? undefined : val),
      z.string().min(6, t("users.passwordHelper")).optional()
    )
    : z.string().min(6, t("users.passwordHelper")),
  dob: z.string().optional(),
  gender: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().int().min(1).max(2).nullable().optional()
  ),
  national_id: z.string().optional(),
  status: z.coerce.number().int().min(0).max(1),
  profileImage: z.any().optional(),
});

interface UserFormProps {
  user: User | null;
  onSubmit: (data: Omit<User, "id" | "created_at" | "updated_at" | "organization_id" | "email_verified_at" | "sms_verified_at" | "image_id" | "image_url"> & { password?: string; profileImage?: File[] }) => void;
  onCancel: () => void;
  onErrorStateChange?: (hasError: boolean) => void;
}

export function UserForm({ user, onSubmit, onCancel, onErrorStateChange }: UserFormProps) {
  const { t } = useI18n("admin");
  const isEdit = !!user;
  const formSchema = useMemo(() => createFormSchema(isEdit, t), [isEdit, t]);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  // Use image_url from user data instead of fetching
  useEffect(() => {
    if (user?.image_url) {
      if (user.image_url.startsWith('http') || user.image_url.startsWith('/api/public/file')) {
        setExistingImageUrl(user.image_url);
      } else {
        setExistingImageUrl(`/api/public/file?file_url=${encodeURIComponent(user.image_url)}`);
      }
    } else {
      setExistingImageUrl(null);
    }
  }, [user]);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const validated = formSchema.parse(data);

      let dobValue = null;
      if (validated.dob) {
        if (validated.dob.includes('T')) {
          dobValue = validated.dob;
        } else {
          dobValue = new Date(validated.dob + 'T00:00:00.000Z').toISOString();
        }
      }

      await onSubmit({
        username: validated.username,
        first_name: validated.first_name,
        last_name: validated.last_name || null,
        email: validated.email,
        country_code: validated.country_code,
        mobile: validated.mobile,
        password: validated.password,
        dob: dobValue,
        gender: validated.gender ?? null,
        national_id: validated.national_id || null,
        status: validated.status,
        profileImage: validated.profileImage,
      });
    } catch (error: any) {
      if (error.issues || error.name === 'ZodError') {
        console.error("Form validation error:", error);
      }
      throw error;
    }
  };

  const defaultValuesMemo = useMemo(() => {
    let dobValue = "";
    if (user?.dob) {
      try {
        if (typeof user.dob === "string" && !user.dob.includes("T")) {
          dobValue = user.dob;
        } else {
          const date = new Date(user.dob);
          if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            dobValue = `${year}-${month}-${day}`;
          }
        }
      } catch (error) {
        dobValue = "";
      }
    }

    return {
      username: user?.username || "",
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      country_code: user?.country_code || "",
      mobile: user?.mobile || "",
      password: "",
      dob: dobValue,
      gender: user?.gender?.toString() || "",
      national_id: user?.national_id || "",
      status: user?.status?.toString() || "1",
      profileImage: undefined,
    };
  }, [user]);

  const formConfig = useMemo((): FormField[] => [
    {
      name: "username",
      label: t("users.username"),
      type: "text",
      placeholder: t("users.usernamePlaceholder"),
      validation: formSchema.shape.username,
      required: true,
      helperText: t("users.usernameHelper"),
    },
    {
      name: "first_name",
      label: t("users.firstName"),
      type: "text",
      placeholder: t("users.firstNamePlaceholder"),
      validation: formSchema.shape.first_name,
      required: true,
      helperText: t("users.firstNameHelper"),
    },
    {
      name: "last_name",
      label: t("users.lastName"),
      type: "text",
      placeholder: t("users.lastNamePlaceholder"),
      validation: formSchema.shape.last_name,
      required: false,
      helperText: t("users.lastNameHelper"),
    },
    {
      name: "email",
      label: t("users.email"),
      type: "email",
      placeholder: t("users.emailPlaceholder"),
      validation: formSchema.shape.email,
      required: true,
      helperText: t("users.emailHelper"),
    },
    {
      name: "country_code",
      label: t("users.countryCode"),
      type: "text",
      placeholder: t("users.countryCodePlaceholder"),
      validation: formSchema.shape.country_code,
      required: true,
      helperText: t("users.countryCodeHelper"),
    },
    {
      name: "mobile",
      label: t("users.mobile"),
      type: "tel",
      placeholder: t("users.mobilePlaceholder"),
      validation: formSchema.shape.mobile,
      required: true,
      helperText: t("users.mobileHelper"),
    },
    {
      name: "dob",
      label: t("users.dob"),
      type: "date",
      placeholder: t("users.dobPlaceholder"),
      validation: formSchema.shape.dob,
      required: false,
      helperText: t("users.dobHelper"),
    },
    {
      name: "password",
      label: isEdit ? t("users.newPassword") : t("users.password"),
      type: "password",
      placeholder: isEdit ? t("users.newPasswordPlaceholder") : t("users.passwordPlaceholder"),
      validation: formSchema.shape.password,
      required: !isEdit,
      helperText: isEdit
        ? t("users.newPasswordHelper")
        : t("users.passwordHelper"),
    },
    {
      name: "gender",
      label: t("users.gender"),
      type: "select",
      placeholder: t("users.genderPlaceholder"),
      validation: formSchema.shape.gender,
      required: false,
      helperText: t("users.genderHelper"),
      options: [
        { value: "1", label: t("users.male") },
        { value: "2", label: t("users.female") },
      ],
    },
    {
      name: "national_id",
      label: t("users.nationalId"),
      type: "text",
      placeholder: t("users.nationalIdPlaceholder"),
      validation: formSchema.shape.national_id,
      required: false,
      helperText: t("users.nationalIdHelper"),
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
      label: t("users.profileImage"),
      type: "imageuploader",
      validation: formSchema.shape.profileImage,
      required: false,
      helperText: t("users.profileImageHelper"),
    },
  ], [formSchema, isEdit, t]);

  return (
    <>
      {isEdit && existingImageUrl && (
        <div className="mb-6 flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
          <Avatar className="size-20">
            <AvatarImage src={existingImageUrl} alt={t("users.currentProfilePicture")} />
            <AvatarFallback>
              {user?.first_name?.[0] || ""}
              {user?.last_name?.[0] || ""}
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
        submitText={user ? t("users.editUser") : t("users.createNewUser")}
        onSuccess={() => {
          onErrorStateChange?.(false);
          onCancel();
        }}
        defaultValues={defaultValuesMemo}
        key={user?.id || "new"}
        onError={(error) => {
          if (!error.fieldErrors || Object.keys(error.fieldErrors).length === 0) {
            // Error toast will be shown by DynamicForm
          }
          onErrorStateChange?.(true);
        }}
      />
    </>
  );
}
