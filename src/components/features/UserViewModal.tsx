"use client";
import DynamicView, { type ViewHeader, type ViewTab } from "../shared/DynamicView";
import { Badge } from "@/components/ui/Badge";
import type { User } from "./UserManagement";

interface UserViewModalProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserViewModal({ user, open, onOpenChange }: UserViewModalProps) {
  const fetchUserImage = async (data: User): Promise<string | null> => {
    if (!data?.image_id) return null;
    
    try {
      const response = await fetch(`/api/users/${data.id}`);
      if (response.ok) {
        const responseData = await response.json();
        const userData = responseData.data || responseData;
        return userData.image || null;
      }
    } catch (error) {
      console.error("Error fetching user image:", error);
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
          1: { label: "Active", variant: "default" },
          0: { label: "Inactive", variant: "secondary" },
        },
      },
    ],
  };

  const tabs: ViewTab[] = [
    {
      id: "details",
      label: "Details",
      gridCols: 2,
      fields: [
        { name: "username", label: "Username", type: "text" },
        { name: "email", label: "Email", type: "text" },
        { name: "country_code", label: "Country Code", type: "text" },
        {
          name: "mobile",
          label: "Mobile Number",
          type: "text",
          format: (value: string, data: User) =>
            data.country_code && value ? `${data.country_code} ${value}` : value || "-",
        },
        { name: "first_name", label: "First Name", type: "text" },
        { name: "last_name", label: "Last Name", type: "text" },
        { name: "dob", label: "Date of Birth", type: "date" },
        {
          name: "gender",
          label: "Gender",
          type: "text",
          format: (value: number | null) => {
            if (value === null || value === undefined) return "-";
            switch (value) {
              case 0: return "Male";
              case 1: return "Female";
              case 2: return "Other";
              default: return "-";
            }
          },
        },
        { name: "national_id", label: "National ID", type: "text" },
        {
          name: "status",
          label: "Status",
          type: "badge",
          badgeMap: {
            1: { label: "Active", variant: "default" },
            0: { label: "Inactive", variant: "secondary" },
          },
        },
      ],
    },
    {
      id: "additional",
      label: "Additional Info",
      gridCols: 2,
      fields: [
        { name: "id", label: "User ID", type: "number" },
        { name: "organization_id", label: "Organization ID", type: "number" },
        { name: "image_id", label: "Image ID", type: "number" },
        {
          name: "user_access_tokens_count",
          label: "Access Tokens",
          type: "badge",
          badgeVariant: "outline",
          format: (value: number | undefined) => value ?? 0,
        },
        {
          name: "user_roles_count",
          label: "Roles",
          type: "badge",
          badgeVariant: "outline",
          format: (value: number | undefined) => value ?? 0,
        },
        { name: "created_at", label: "Created At", type: "datetime" },
        { name: "updated_at", label: "Updated At", type: "datetime" },
      ],
    },
  ];

  return (
    <DynamicView
      data={user}
      open={open}
      onOpenChange={onOpenChange}
      title="User Details"
      header={header}
      tabs={tabs}
      maxWidth="4xl"
    />
  );
}

