import { z } from "zod";
import { SpaceType } from "@/types/api/spaces";

export const createSpaceSchema = z.object({
    branch_id: z.number().min(1, "Branch is required"),
    code: z.string().regex(/^[A-Z0-9-]+$/, "Code must contain only uppercase letters, numbers, and hyphens"),
    name_ar: z.string().min(2, "Arabic name is required"),
    name_en: z.string().min(2, "English name is required"),
    description_ar: z.string().optional(),
    description_en: z.string().optional(),
    space_type: z.nativeEnum(SpaceType, {
        message: "Invalid space type",
    }),
    capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
    hourly_rate: z.coerce.number().min(0).optional(),
    daily_rate: z.coerce.number().min(0).optional(),
    weekly_rate: z.coerce.number().min(0).optional(),
    monthly_rate: z.coerce.number().min(0).optional(),
    status: z.union([z.literal(1), z.literal(0)]).default(1),
    amenity_ids: z.array(z.number()).optional(),
    // For images, we can do an array of File or string paths depending on implementation logic
    // Typically we send the IDs of pre-uploaded images or the FormData itself
}).refine(data => data.hourly_rate || data.daily_rate || data.weekly_rate || data.monthly_rate, {
    message: "At least one pricing tier must be set",
    path: ["hourly_rate"],
});

export type CreateSpaceData = z.infer<typeof createSpaceSchema>;

export const updateSpaceSchema = createSpaceSchema.partial();
export type UpdateSpaceData = z.infer<typeof updateSpaceSchema>;
