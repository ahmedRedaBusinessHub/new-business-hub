import { describe, it, expect } from "vitest";
import { createBookingSchema } from "@/lib/schemas/booking";
import { PricingTier } from "@/types/api/bookings";

describe("Booking API Payload Validation", () => {
    it("should accept a valid payload from the form", () => {
        const validPayload = {
            space_id: 1,
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 3600000).toISOString(),
            pricing_tier: PricingTier.HOURLY,
            attendees: 1,
            additional_service_ids: []
        };

        expect(() => createBookingSchema.parse(validPayload)).not.toThrow();
    });

    it("should reject invalid end times", () => {
        const invalidPayload = {
            space_id: 1,
            start_date: new Date(Date.now() + 3600000).toISOString(),
            // End time is before start time
            end_date: new Date().toISOString(),
            pricing_tier: PricingTier.HOURLY,
            attendees: 1,
            additional_service_ids: []
        };

        expect(() => createBookingSchema.parse(invalidPayload)).toThrow();
    });
});
