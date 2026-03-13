"use client";
import DynamicView, { type ViewHeader, type ViewTab } from "../shared/DynamicView";
import { Badge } from "@/components/ui/Badge";
import type { User } from "./UserManagement";
import { useI18n } from "@/hooks/useI18n";

interface UserViewModalProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserViewModal({ user, open, onOpenChange }: UserViewModalProps) {
  const { t } = useI18n("admin");

  const fetchUserImage = async (data: User): Promise<string | null> => {
    if (data?.image_url) {
      if (data.image_url.startsWith('http') || data.image_url.startsWith('/api/public/file')) {
        return data.image_url;
      }
      return `/api/public/file?file_url=${encodeURIComponent(data.image_url)}`;
    }
    return null;
  };

  const header: ViewHeader = {
    type: "avatar",
    title: (data: User) => `${data.first_name} ${data.last_name || ""}`,
    subtitle: (data: User) => data.email,
    imageIdField: "image_id",
    fetchImageUrl: fetchUserImage,
    avatarFallback: (data: User) =>
      `${data.first_name?.[0] || ""}${data.last_name?.[0] || ""}`,
    badges: [
      {
        field: "status",
        variant: "default",
        map: {
          1: { label: t("common.active"), variant: "default" },
          0: { label: t("common.inactive"), variant: "secondary" },
        },
      },
    ],
  };

  const tabs: ViewTab[] = [
    {
      id: "details",
      label: t("users.detailsTab"),
      gridCols: 2,
      fields: [
        { name: "username", label: t("users.username"), type: "text" },
        { name: "email", label: t("users.email"), type: "text" },
        { name: "country_code", label: t("users.countryCode"), type: "text" },
        {
          name: "mobile",
          label: t("users.mobile"),
          type: "text",
          format: (value: string, data: User) =>
            data.country_code && value ? `${data.country_code} ${value}` : value || "-",
        },
        { name: "first_name", label: t("users.firstName"), type: "text" },
        { name: "last_name", label: t("users.lastName"), type: "text" },
        { name: "dob", label: t("users.dob"), type: "date" },
        {
          name: "gender",
          label: t("users.gender"),
          type: "text",
          format: (value: number | null) => {
            if (value === null || value === undefined) return "-";
            switch (value) {
              case 1: return t("users.male");
              case 2: return t("users.female");
              default: return "-";
            }
          },
        },
        { name: "national_id", label: t("users.nationalId"), type: "text" },
        {
          name: "status",
          label: t("common.status"),
          type: "badge",
          badgeMap: {
            1: { label: t("common.active"), variant: "default" },
            0: { label: t("common.inactive"), variant: "secondary" },
          },
        },
      ],
    },
    {
      id: "additional",
      label: t("users.additionalInfoTab"),
      gridCols: 2,
      fields: [
        { name: "id", label: t("users.userId"), type: "number" },
        {
          name: "user_access_tokens_count",
          label: t("users.accessTokens"),
          type: "badge",
          badgeVariant: "outline",
          format: (value: number | undefined) => value ?? 0,
        },
        {
          name: "user_roles_count",
          label: t("users.userRoles"),
          type: "badge",
          badgeVariant: "outline",
          format: (value: number | undefined) => value ?? 0,
        },
        { name: "created_at", label: t("common.createdAt"), type: "datetime" },
        { name: "updated_at", label: t("common.updatedAt"), type: "datetime" },
      ],
    },
  ];

  return (
    <DynamicView
      data={user}
      open={open}
      onOpenChange={onOpenChange}
      title={t("users.userDetails")}
      header={header}
      tabs={tabs}
      maxWidth="4xl"
    />
  );
}

