import { z } from "zod";

const dayScheduleSchema = z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
}).nullable().optional();

export const operatingHoursSchema = z.object({
    timezone: z.string().default("Asia/Riyadh"),
    schedule: z.object({
        sunday: dayScheduleSchema,
        monday: dayScheduleSchema,
        tuesday: dayScheduleSchema,
        wednesday: dayScheduleSchema,
        thursday: dayScheduleSchema,
        friday: dayScheduleSchema,
        saturday: dayScheduleSchema,
    }),
    special_hours: z.array(z.object({
        date: z.string(),
        open: z.string().optional(),
        close: z.string().optional(),
        is_closed: z.boolean().optional(),
        reason: z.string().optional(),
    })).optional(),
});

export const createBranchSchema = z.object({
    code: z.string().min(2, "Code is required"),
    name_ar: z.string().min(2, "Arabic name is required"),
    name_en: z.string().min(2, "English name is required"),
    description_ar: z.string().optional(),
    description_en: z.string().optional(),
    city_ar: z.string().min(2, "Arabic city is required"),
    city_en: z.string().optional(),
    address_ar: z.string().min(2, "Arabic address is required"),
    address_en: z.string().optional(),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    has_studio: z.boolean().default(false),
    status: z.union([z.literal(1), z.literal(0)]).default(1),
    operating_hours: operatingHoursSchema.optional(),
});

export type CreateBranchData = z.infer<typeof createBranchSchema>;

export const updateBranchSchema = createBranchSchema.partial();
export type UpdateBranchData = z.infer<typeof updateBranchSchema>;
