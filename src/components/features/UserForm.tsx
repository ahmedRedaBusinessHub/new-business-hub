import * as z from "zod";
import { useMemo, useState, useEffect } from "react";
import type { User } from "./UserManagement";
import DynamicForm, { type FormField } from "../shared/DynamicForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

const createFormSchema = (isEdit: boolean) => z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().optional(),
  email: z.string().email("Invalid email address"),
  country_code: z.string().min(1, "Country code is required"),
  mobile: z.string().min(5, "Mobile number must be at least 5 characters"),
  password: isEdit 
    ? z.preprocess(
        (val) => (val === "" || val === null || val === undefined ? undefined : val),
        z.string().min(6, "Password must be at least 6 characters").optional()
      )
    : z.string().min(6, "Password must be at least 6 characters"),
  dob: z.string().optional(),
  gender: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().int().min(0).max(2).nullable().optional()
  ),
  national_id: z.string().optional(),
  status: z.coerce.number().int().min(0).max(1),
  profileImage: z.any().optional(),
});

interface UserFormProps {
  user: User | null;
  onSubmit: (data: Omit<User, "id" | "created_at" | "updated_at" | "organization_id" | "email_verified_at" | "sms_verified_at"> & { password?: string; profileImage?: File[] }) => void;
  onCancel: () => void;
}

export function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const isEdit = !!user;
  const formSchema = useMemo(() => createFormSchema(isEdit), [isEdit]);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  // Fetch existing image when editing
  useEffect(() => {
    const fetchExistingImage = async () => {
      if (user?.image_id) {
        try {
          const response = await fetch(`/api/users/${user.id}`);
          if (response.ok) {
            const responseData = await response.json();
            const userData = responseData.data || responseData;
            const fileUrl = userData.image || userData.image_url || null;
            
            if (fileUrl) {
              setExistingImageUrl(`/api/public/file?file_url=${encodeURIComponent(fileUrl)}`);
            }
          }
        } catch (error) {
          console.error("Error fetching user image:", error);
        }
      }
    };

    fetchExistingImage();
  }, [user]);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const validated = formSchema.parse(data);
      
      // Convert date string to ISO DateTime format for Prisma
      let dobValue = null;
      if (validated.dob) {
        // If it's already a DateTime string, use it; otherwise convert date to DateTime
        if (validated.dob.includes('T')) {
          dobValue = validated.dob;
        } else {
          // Convert "YYYY-MM-DD" to "YYYY-MM-DDT00:00:00.000Z"
          dobValue = new Date(validated.dob + 'T00:00:00.000Z').toISOString();
        }
      }
      
      onSubmit({
        username: validated.username,
        first_name: validated.first_name,
        last_name: validated.last_name || null,
        email: validated.email,
        country_code: validated.country_code,
        mobile: validated.mobile,
        password: validated.password,
        dob: dobValue,
        gender: validated.gender ?? null,
        image_id: user?.image_id ?? null,
        national_id: validated.national_id || null,
        status: validated.status,
        profileImage: validated.profileImage,
      });
    } catch (error) {
      console.error("Form validation error:", error);
      throw error;
    }
  };

  const defaultValuesMemo = useMemo(() => ({
    username: user?.username || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    country_code: user?.country_code || "",
    mobile: user?.mobile || "",
    password: "",
    dob: user?.dob || "",
    gender: user?.gender?.toString() || "",
    national_id: user?.national_id || "",
    status: user?.status?.toString() || "1",
    profileImage: undefined,
  }), [user]);

  const formConfig = useMemo((): FormField[] => [
          {
            name: "username",
            label: "Username",
            type: "text",
            placeholder: "Enter username",
            validation: formSchema.shape.username,
            required: true,
            helperText: "Unique username (3+ characters)",
          },
          {
            name: "first_name",
            label: "First Name",
            type: "text",
            placeholder: "Enter first name",
            validation: formSchema.shape.first_name,
            required: true,
            helperText: "User's first name",
          },
          {
            name: "last_name",
            label: "Last Name",
            type: "text",
            placeholder: "Enter last name",
            validation: formSchema.shape.last_name,
            required: false,
            helperText: "User's last name (optional)",
          },
          {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "Enter email address",
            validation: formSchema.shape.email,
            required: true,
            helperText: "Valid email address",
          },
          {
            name: "country_code",
            label: "Country Code",
            type: "text",
            placeholder: "e.g., +1, +966",
            validation: formSchema.shape.country_code,
            required: true,
            helperText: "Country calling code (e.g., +1, +966)",
          },
          {
            name: "mobile",
            label: "Mobile Number",
            type: "tel",
            placeholder: "Enter mobile number",
            validation: formSchema.shape.mobile,
            required: true,
            helperText: "Mobile phone number",
          },
          {
            name: "dob",
            label: "Date of Birth",
            type: "date",
            placeholder: "Select date of birth",
            validation: formSchema.shape.dob,
            required: false,
            helperText: "Date of birth (optional)",
          },
          {
            name: "password",
            label: isEdit ? "New Password (leave blank to keep current)" : "Password",
            type: "password",
            placeholder: isEdit ? "Leave blank to keep current password" : "Enter password",
            validation: formSchema.shape.password,
            required: !isEdit,
            helperText: isEdit 
              ? "Enter new password to change (optional, min 6 characters)"
              : "Password must be at least 6 characters",
          },
          {
            name: "gender",
            label: "Gender",
            type: "select",
            placeholder: "Select gender",
            validation: formSchema.shape.gender,
            required: false,
            helperText: "Gender (optional)",
            options: [
              { value: "", label: "Not specified" },
              { value: "0", label: "Male" },
              { value: "1", label: "Female" },
              { value: "2", label: "Other" },
            ],
          },
          {
            name: "national_id",
            label: "National ID",
            type: "text",
            placeholder: "Enter national ID",
            validation: formSchema.shape.national_id,
            required: false,
            helperText: "National identification number (optional)",
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            placeholder: "Select status",
            validation: formSchema.shape.status,
            required: true,
            helperText: "User account status",
            options: [
              { value: "1", label: "Active" },
              { value: "0", label: "Inactive" },
            ],
          },
          {
            name: "profileImage",
            label: "Profile Image",
            type: "imageuploader",
            validation: formSchema.shape.profileImage,
            required: false,
            helperText: "Upload profile picture (JPG, PNG, WEBP - Max 5MB)",
          },
        ], [formSchema, isEdit]);

  return (
    <>
      {isEdit && existingImageUrl && (
        <div className="mb-6 flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
          <Avatar className="size-20">
            <AvatarImage src={existingImageUrl} alt="Current profile picture" />
            <AvatarFallback>
              {user?.first_name?.[0] || ""}
              {user?.last_name?.[0] || ""}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">Current Profile Picture</p>
            <p className="text-xs text-muted-foreground">
              Upload a new image below to replace this one
            </p>
          </div>
        </div>
      )}
      <DynamicForm
        config={formConfig}
        onSubmit={handleSubmit}
        submitText={user ? "Update User" : "Create User"}
        onSuccess={onCancel}
        defaultValues={defaultValuesMemo}
        key={user?.id || "new"}
        onError={(error) => {
          // Field errors are already handled by DynamicForm
          // Only show toast if there are no field-specific errors
          if (!error.fieldErrors || Object.keys(error.fieldErrors).length === 0) {
            // Error toast will be shown by DynamicForm
          }
        }}
      />
    </>
  );
}
