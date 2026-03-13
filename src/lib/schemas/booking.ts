import { z } from 'zod';
import { PricingTier, RecurrencePattern } from '@/types/api/bookings';

export const createBookingSchema = z.object({
    space_id: z.number().int().positive(),
    start_date: z.string().datetime({ message: 'Invalid start date' }),
    end_date: z.string().datetime({ message: 'Invalid end date' }),
    pricing_tier: z.nativeEnum(PricingTier),
    attendees: z.number().int().min(1),
    additional_service_ids: z.array(z.number()).optional(),
}).refine((data) => {
    return new Date(data.start_date) < new Date(data.end_date);
}, {
    message: 'End date must be after start date',
    path: ['end_date'],
});

export type CreateBookingData = z.infer<typeof createBookingSchema>;

export const createRecurringBookingSchema = z.object({
    space_id: z.number().int().positive(),
    start_date: z.string().datetime({ message: 'Invalid start date' }),
    pattern: z.nativeEnum(RecurrencePattern, { message: 'Please select a recurrence pattern' }),
    end_date: z.string().datetime({ message: 'Invalid end date' }).optional(),
    occurrences: z.number().int().positive().optional(),
    pricing_tier: z.nativeEnum(PricingTier),
    attendees: z.number().int().min(1),
    additional_service_ids: z.array(z.number()).optional(),
}).refine((data) => {
    if (data.end_date && new Date(data.start_date) >= new Date(data.end_date)) {
        return false;
    }
    return true;
}, {
    message: 'End date must be after start date',
    path: ['end_date'],
}).refine((data) => !!data.end_date || !!data.occurrences, {
    message: 'Either end date or number of occurrences must be provided',
    path: ['end_date'], // You could choose to put this on occurrences as well
});

export type CreateRecurringBookingData = z.infer<typeof createRecurringBookingSchema>;
