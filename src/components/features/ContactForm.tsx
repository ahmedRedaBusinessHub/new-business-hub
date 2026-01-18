import * as z from "zod";
import type { Contact } from "./ContactsManagement";
import DynamicForm from "../shared/DynamicForm";

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
  organization_id: z.preprocess(
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
        organization_id: validated.organization_id ?? contact?.organization_id ?? 1,
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
            type: "number",
            placeholder: "Enter contact type",
            validation: formSchema.shape.contact_type,
            required: false,
            helperText: "Contact type (optional)",
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
            label: "User ID",
            type: "number",
            placeholder: "Enter user ID",
            validation: formSchema.shape.user_id,
            required: false,
            helperText: "Link to user (optional)",
          },
          {
            name: "organization_id",
            label: "Organization ID",
            type: "number",
            placeholder: "Enter organization ID",
            validation: formSchema.shape.organization_id,
            required: false,
            helperText: "Organization ID (optional, defaults to 1)",
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
          organization_id: contact?.organization_id?.toString() || "1",
        }}
      />
    </>
  );
}

