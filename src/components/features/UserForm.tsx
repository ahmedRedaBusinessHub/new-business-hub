import { useState } from "react";
import { useForm } from "react-hook-form";

import * as z from "zod";
import type { User } from "./UserManagement";
import DynamicForm from "../shared/DynamicForm";
import {
  fileSchema,
  imageSchema,
  multipleImagesSchema,
} from "@/lib/fileValidation";

const formSchema = {
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  role: z.string().min(1, "Please select a role"),
  department: z.string().min(1, "Please select a department"),
  status: z.string().min(1, "Please select a status"),
  birthDate: z.string().min(1, "Please select a birth date"),
  salary: z.coerce.number().min(0, "Salary must be a positive number"),
  skills: z.array(z.string()).min(1, "Please select at least one skill"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  notifications: z.boolean(),
  newsletter: z.boolean(),
  experience: z.number().min(0).max(50),
  availability: z.string().min(1, "Please select availability"),
  profileImage: z.string().optional(),
  resume: z.string().optional(),
  documents: z.array(z.string()).optional(),
};

type FormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  user: User | null;
  onSubmit: (data: Omit<User, "id">) => void;
  onCancel: () => void;
}

const skillOptions = [
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Python",
  "Java",
  "Marketing",
  "SEO",
  "Design",
  "Management",
];

export function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [profilePreview, setProfilePreview] = useState<string | null>(
    user?.profileImage || null
  );
  const [resumeName, setResumeName] = useState<string | null>(
    user?.resume ? "Current Resume.pdf" : null
  );
  const [documentNames, setDocumentNames] = useState<string[]>(
    user?.documents?.map((_, i) => `Document ${i + 1}`) || []
  );

  const form = useForm<FormValues>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      role: user?.role || "",
      department: user?.department || "",
      status: user?.status || "active",
      birthDate: user?.birthDate || "",
      salary: user?.salary || 50000,
      skills: user?.skills || [],
      bio: user?.bio || "",
      notifications: user?.notifications ?? true,
      newsletter: user?.newsletter ?? false,
      experience: user?.experience || 0,
      availability: user?.availability || "",
      profileImage: user?.profileImage || "",
      resume: user?.resume || "",
      documents: user?.documents || [],
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfilePreview(result);
        form.setValue("profileImage", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("resume", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setDocumentNames(fileArray.map((f) => f.name));

      const promises = fileArray.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(promises).then((results) => {
        form.setValue("documents", results);
      });
    }
  };

  const removeProfileImage = () => {
    setProfilePreview(null);
    form.setValue("profileImage", "");
  };

  const removeResume = () => {
    setResumeName(null);
    form.setValue("resume", "");
  };

  const removeDocument = (index: number) => {
    const currentDocs = form.getValues("documents") || [];
    const newDocs = currentDocs.filter((_, i) => i !== index);
    const newNames = documentNames.filter((_, i) => i !== index);
    setDocumentNames(newNames);
    form.setValue("documents", newDocs);
  };

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <>
      <DynamicForm
        config={[
          {
            name: "firstName",
            label: "firstName",
            type: "text",
            placeholder: "johndoe123",
            validation: formSchema.firstName,
            required: true,
            helperText: "Choose a unique username (3-20 characters)",
          },
          {
            name: "lastName",
            label: "lastName",
            type: "text",
            placeholder: "johndoe123",
            validation: formSchema.lastName,
            required: true,
            helperText: "Choose a unique username (3-20 characters)",
          },

          {
            name: "email",
            label: "email",
            type: "email",
            placeholder: "johndoe123",
            validation: formSchema.email,
            required: true,
            helperText: "Choose a unique username (3-20 characters)",
          },
          {
            name: "phone",
            label: "phone",
            type: "tel",
            placeholder: "johndoe123",
            validation: formSchema.phone,
            required: true,
            helperText: "Choose a unique username (3-20 characters)",
          },
          {
            name: "role",
            label: "role",
            type: "select",
            placeholder: "role",
            validation: formSchema.role,
            required: true,
            helperText: "Choose a unique username (3-20 characters)",
            options: [
              { value: "admin", label: "admin" },
              { value: "user", label: "user" },
              { value: "moderator", label: "moderator" },
              { value: "guest", label: "guest" },
              { value: "other", label: "Other" },
            ],
          },
          {
            name: "department",
            label: "department",
            type: "select",
            placeholder: "department",
            validation: formSchema.department,
            required: true,
            helperText: "Choose a unique username (3-20 characters)",

            options: [
              { value: "Engineering", label: "Engineering" },
              { value: "Marketing", label: "Marketing" },
              { value: "Sales", label: "Sales" },

              { value: "other", label: "Other" },
            ],
          },

          {
            name: "availability",
            label: "availability",
            type: "radio",
            validation: formSchema.availability,
            required: true,
            options: [
              { value: "full-time", label: "full-time" },
              { value: "Part-time", label: "Part-time" },
              { value: "Contract", label: "Contract" },
            ],
          },
          {
            name: "birthDate",
            label: "birthDate",
            type: "date",
            placeholder: "birthDate",
            validation: formSchema.birthDate,
            required: true,
            helperText: "Choose a unique username (3-20 characters)",
          },
          {
            name: "salary",
            label: "salary",
            type: "number",
            placeholder: "salary",
            validation: formSchema.salary,
            required: true,
            helperText: "Choose a unique username (3-20 characters)",
          },
          {
            name: "experience",
            label: "experience",
            type: "range",
            placeholder: "experience",
            validation: formSchema.experience,
            required: true,
            helperText: "Choose a unique username (3-20 characters)",
          },
          {
            name: "skills",
            label: "skills",
            type: "checkbox",
            placeholder: "johndoe123",
            validation: formSchema.skills,
            required: true,
            helperText: "Choose a unique username (3-20 characters)",
          },
          {
            name: "bio",
            label: "bio",
            type: "textarea",
            placeholder: "bio",
            validation: formSchema.bio,
            required: true,
            helperText: "Choose a unique username (3-20 characters)",
          },
          {
            name: "profileImage",
            label: "Profile Picture",
            type: "file",
            helperText:
              "Upload your profile picture (JPG, PNG, WEBP - Max 5MB)",
            validation: imageSchema,
            multiple: false,
            colSize: { desktop: 6, tablet: 12, mobile: 12 },
          },
          {
            name: "portfolioImages",
            label: "Portfolio Images",
            type: "file",
            helperText:
              "Upload up to 10 images (JPG, PNG, WEBP - Max 5MB each)",
            validation: multipleImagesSchema,
            multiple: true,
            colSize: { desktop: 6, tablet: 12, mobile: 12 },
          },
          {
            name: "resume",
            label: "Resume/CV",
            type: "file",
            helperText: "Upload your resume (PDF - Max 10MB)",
            validation: fileSchema,
            multiple: false,
            colSize: { desktop: 12, tablet: 12, mobile: 12 },
          },
        ]}
        onSubmit={handleSubmit}
        submitText="Create Account"
        onSuccess={() => {}}
        className="max-w-md"
      />
    </>
  );
}
