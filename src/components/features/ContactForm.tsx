import * as z from "zod";
import { useState, useEffect, useRef, useMemo } from "react";
import type { Contact } from "./ContactsManagement";
import DynamicForm, { type FormField } from "../shared/DynamicForm";
import { staticListsCache } from "@/lib/staticListsCache";
import { getLocalizedLabel } from "@/lib/localizedLabel";
import { useI18n } from "@/hooks/useI18n";

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

interface ContactFormProps {
  contact: Contact | null;
  onSubmit: (data: Omit<Contact, "id" | "created_at" | "updated_at">) => void;
  onCancel: () => void;
}

export function ContactForm({ contact, onSubmit, onCancel }: ContactFormProps) {
  const { t, language } = useI18n("admin");
  const isEdit = !!contact;
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [contactTypes, setContactTypes] = useState<ContactTypeConfig[]>([]);
  const [loadingContactTypes, setLoadingContactTypes] = useState(true);
  const usersFetchedRef = useRef(false);
  const contactTypesFetchedRef = useRef(false);

  const formSchema = useMemo(() => z.object({
    name: z.string().optional(),
    email: z.string().email(t("entities.contacts.invalidEmail")).optional(),
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
  }), [t]);

  // Fetch users for dropdown (only once)
  useEffect(() => {
    if (usersFetchedRef.current) return;

    const fetchUsers = async () => {
      try {
        usersFetchedRef.current = true;
        setLoadingUsers(true);
        const response = await fetch("/api/users?limit=1000");
        if (response.ok) {
          const data = await response.json();
          const usersData = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
          setUsers(usersData);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        usersFetchedRef.current = false; // Reset on error to allow retry
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch contact types from static_lists cache (only once)
  useEffect(() => {
    if (contactTypesFetchedRef.current) return;

    const fetchContactTypes = async () => {
      try {
        contactTypesFetchedRef.current = true;
        setLoadingContactTypes(true);
        const typesConfig = await staticListsCache.getByNamespace('contact.types');
        setContactTypes(typesConfig);
      } catch (error) {
        console.error("Error fetching contact types:", error);
        contactTypesFetchedRef.current = false; // Reset on error to allow retry
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
        organization_id: contact?.organization_id || 1,
      });
    } catch (error) {
      console.error("Form validation error:", error);
      throw error;
    }
  };

  const formConfig = useMemo((): FormField[] => [
    {
      name: "name",
      label: t("entities.contacts.name"),
      type: "text",
      placeholder: t("entities.contacts.namePlaceholder"),
      validation: formSchema.shape.name,
      required: false,
      helperText: t("entities.contacts.nameHelper"),
    },
    {
      name: "email",
      label: t("entities.contacts.email"),
      type: "email",
      placeholder: t("entities.contacts.emailPlaceholder"),
      validation: formSchema.shape.email,
      required: false,
      helperText: t("entities.contacts.emailHelper"),
    },
    {
      name: "phone",
      label: t("entities.contacts.phone"),
      type: "tel",
      placeholder: t("entities.contacts.phonePlaceholder"),
      validation: formSchema.shape.phone,
      required: false,
      helperText: t("entities.contacts.phoneHelper"),
    },
    {
      name: "contact_type",
      label: t("entities.contacts.contactType"),
      type: "select",
      placeholder: loadingContactTypes ? t("entities.contacts.loadingTypes") : t("entities.contacts.contactTypePlaceholder"),
      validation: formSchema.shape.contact_type,
      required: false,
      helperText: t("entities.contacts.contactTypeHelper"),
      options: [
        { value: "", label: t("entities.contacts.none") },
        ...contactTypes.map((type) => ({
          value: type.id.toString(),
          label: getLocalizedLabel(type.name_en, type.name_ar, language),
        })),
      ],
    },
    {
      name: "notes",
      label: t("entities.contacts.notes"),
      type: "textarea",
      placeholder: t("entities.contacts.notesPlaceholder"),
      validation: formSchema.shape.notes,
      required: false,
      helperText: t("entities.contacts.notesHelper"),
    },
    {
      name: "status",
      label: t("common.status"),
      type: "select",
      placeholder: t("common.status"),
      validation: formSchema.shape.status,
      required: true,
      helperText: t("entities.contacts.statusHelper"),
      options: [
        { value: "1", label: t("entities.contacts.statusActive") },
        { value: "0", label: t("entities.contacts.statusInactive") },
      ],
    },
    {
      name: "user_id",
      label: t("entities.contacts.user"),
      type: "select",
      placeholder: loadingUsers ? t("entities.contacts.loadingUsers") : t("entities.contacts.userPlaceholder"),
      validation: formSchema.shape.user_id,
      required: false,
      helperText: t("entities.contacts.userHelper"),
      options: [
        { value: "", label: t("entities.contacts.none") },
        ...users.map((user) => ({
          value: user.id.toString(),
          label: `${user.first_name}${user.last_name ? ` ${user.last_name}` : ""} (${user.email})`,
        })),
      ],
    },
  ], [formSchema, t, language, loadingContactTypes, contactTypes, loadingUsers, users]);

  return (
    <>
      <DynamicForm
        config={formConfig}
        onSubmit={handleSubmit}
        submitText={contact ? t("entities.contacts.edit") : t("entities.contacts.createNew")}
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

