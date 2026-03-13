// Mock booking handler to check payload against schema
const { createBookingSchema } = require('./src/lib/schemas/booking.ts');

const testPayload = {
    space_id: 1,
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 3600000).toISOString(),
    pricing_tier: "HOURLY",
    attendees: 1,
    additional_service_ids: []
};

// ... Wait, zod requires typescript compilation to run directly in node easily...
// Let's just create a test file instead!
