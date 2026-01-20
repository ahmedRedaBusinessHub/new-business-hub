import * as z from "zod";
import { useState, useEffect } from "react";
import type { Contact } from "./ContactsManagement";
import DynamicForm from "../shared/DynamicForm";
import { staticListsCache } from "@/lib/staticListsCache";

interface User {
  id: number;
  first_name: string;
  last_name: string | null;
  email: string;
}

interface ContactTypeConfig {
  id: number;
  name_en: string;
  name_ar: string;
}

const createFormSchema = (isEdit: boolean) => z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().optional(),
  contact_type: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().int().nullable().optional()
  ),
  notes: z.string().optional(),
  status: z.coerce.number().int().min(0).max(1),
  user_id: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().int().nullable().optional()
  ),
});

interface ContactFormProps {
  contact: Contact | null;
  onSubmit: (data: Omit<Contact, "id" | "created_at" | "updated_at">) => void;
  onCancel: () => void;
}

export function ContactForm({ contact, onSubmit, onCancel }: ContactFormProps) {
  const isEdit = !!contact;
  const formSchema = createFormSchema(isEdit);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [contactTypes, setContactTypes] = useState<ContactTypeConfig[]>([]);
  const [loadingContactTypes, setLoadingContactTypes] = useState(true);

  // Fetch users for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await fetch("/api/users?limit=1000");
        if (response.ok) {
          const data = await response.json();
          const usersData = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
          setUsers(usersData);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch contact types from static_lists cache
  useEffect(() => {
    const fetchContactTypes = async () => {
      try {
        setLoadingContactTypes(true);
        const typesConfig = await staticListsCache.getByNamespace('contact.types');
        setContactTypes(typesConfig);
      } catch (error) {
        console.error("Error fetching contact types:", error);
      } finally {
        setLoadingContactTypes(false);
      }
    };
    fetchContactTypes();
  }, []);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const validated = formSchema.parse(data);
      
      onSubmit({
        name: validated.name || null,
        email: validated.email || null,
        phone: validated.phone || null,
        contact_type: validated.contact_type ?? null,
        notes: validated.notes || null,
        status: validated.status,
        user_id: validated.user_id ?? null,
      });
    } catch (error) {
      console.error("Form validation error:", error);
      throw error;
    }
  };

  return (
    <>
      <DynamicForm
        config={[
          {
            name: "name",
            label: "Name",
            type: "text",
            placeholder: "Enter contact name",
            validation: formSchema.shape.name,
            required: false,
            helperText: "Contact name (optional)",
          },
          {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "Enter email address",
            validation: formSchema.shape.email,
            required: false,
            helperText: "Email address (optional)",
          },
          {
            name: "phone",
            label: "Phone",
            type: "tel",
            placeholder: "Enter phone number",
            validation: formSchema.shape.phone,
            required: false,
            helperText: "Phone number (optional)",
          },
          {
            name: "contact_type",
            label: "Contact Type",
            type: "select",
            placeholder: loadingContactTypes ? "Loading types..." : "Select contact type (optional)",
            validation: formSchema.shape.contact_type,
            required: false,
            helperText: "Contact type (optional)",
            options: [
              { value: "", label: "None" },
              ...contactTypes.map((type) => ({
                value: type.id.toString(),
                label: type.name_en,
              })),
            ],
          },
          {
            name: "notes",
            label: "Notes",
            type: "textarea",
            placeholder: "Enter notes",
            validation: formSchema.shape.notes,
            required: false,
            helperText: "Additional notes (optional)",
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            placeholder: "Select status",
            validation: formSchema.shape.status,
            required: true,
            helperText: "Contact status",
            options: [
              { value: "1", label: "Active" },
              { value: "0", label: "Inactive" },
            ],
          },
          {
            name: "user_id",
            label: "User",
            type: "select",
            placeholder: loadingUsers ? "Loading users..." : "Select user (optional)",
            validation: formSchema.shape.user_id,
            required: false,
            helperText: "Link to user (optional)",
            options: [
              { value: "", label: "None" },
              ...users.map((user) => ({
                value: user.id.toString(),
                label: `${user.first_name}${user.last_name ? ` ${user.last_name}` : ""} (${user.email})`,
              })),
            ],
          },
        ]}
        onSubmit={handleSubmit}
        submitText={contact ? "Update Contact" : "Create Contact"}
        onSuccess={onCancel}
        defaultValues={{
          name: contact?.name || "",
          email: contact?.email || "",
          phone: contact?.phone || "",
          contact_type: contact?.contact_type?.toString() || "",
          notes: contact?.notes || "",
          status: contact?.status?.toString() || "1",
          user_id: contact?.user_id?.toString() || "",
        }}
      />
    </>
  );
}

