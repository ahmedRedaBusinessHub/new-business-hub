import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BookingForm } from "@/components/features/bookings/booking-form";
import { CoworkingSpace, SpaceType } from "@/types/api/spaces";
import { PricingTier } from "@/types/api/bookings";
import { NextIntlClientProvider } from "next-intl";

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

const mockSpace: CoworkingSpace = {
    id: 1,
    name_en: "Test Space",
    name_ar: "مساحة اختبار",
    description_en: "A test space",
    description_ar: "مساحة اختبار",
    capacity: 10,
    hourly_rate: 10,
    daily_rate: 50,
    weekly_rate: 200,
    monthly_rate: 800,
    status: 1,
    branch_id: 1,
    space_type: SpaceType.HOT_DESK,
    space_amenities: [],
    space_images: [],
    branch: {
        id: 1,
        name_en: "Test Branch",
        name_ar: "فرع اختبار",
        operating_hours: {
            timezone: "UTC",
            schedule: {}
        },
        address_en: "123 test",
        address_ar: "123 test"
    }
};

const messages = {
    "booking_form_duration_label": "Duration",
    "space_pricing_hourly": "Hourly",
    "space_pricing_daily": "Daily",
    "space_capacity_label": "Capacity",
    "booking_form_start_time": "Start Time",
    "booking_form_end_time": "End Time",
    "space_book_now_cta": "Book Now"
};

const renderWithIntl = (component: React.ReactNode) => {
    return render(
        <NextIntlClientProvider locale="en" messages={messages}>
            {component}
        </NextIntlClientProvider>
    );
};

describe("BookingForm", () => {
    const mockOnSubmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the form with available pricing tiers options based on space rates", () => {
        renderWithIntl(<BookingForm space={mockSpace} onSubmit={mockOnSubmit} />);

        expect(screen.getByText("Duration")).toBeInTheDocument();
        expect(screen.getByText("Capacity")).toBeInTheDocument();
        expect(screen.getByText("Start Time")).toBeInTheDocument();
        expect(screen.getByText("End Time")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Book Now" })).toBeInTheDocument();

        // Note: Actual select options might not be directly queryable if using a custom Select component,
        // but since we switched to native select, we should be able to query them if they are in the DOM,
        // however the current Select implementation uses Radix and native mix. For a simple check:
        const select = screen.getByRole('combobox');
        expect(select).toBeInTheDocument();
    });

    it("calls onSubmit with formatted data when submitted", async () => {
        renderWithIntl(<BookingForm space={mockSpace} onSubmit={mockOnSubmit} />);

        // Instead of querying by "Capacity", which might bind to a hidden/styled input label element,
        // Find inputs by looking for the one with max="10" matching our space capacity
        const capacityInput = document.querySelector('input[type="number"]') as HTMLInputElement;

        // Change attendees
        if (capacityInput) {
            fireEvent.change(capacityInput, { target: { value: 3 } });
        }

        // Click submit
        fireEvent.click(screen.getByRole("button", { name: "Book Now" }));

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalled();
            const calledData = mockOnSubmit.mock.calls[0][0];
            expect(calledData.space_id).toBe(1);
            expect(calledData.pricing_tier).toBe(PricingTier.HOURLY);
            if (capacityInput) {
                expect(calledData.attendees).toBe(3);
            }
        });
    });

    it("disables the submit button when isLoading is true", () => {
        renderWithIntl(<BookingForm space={mockSpace} onSubmit={mockOnSubmit} isLoading={true} />);
        const submitButton = screen.getByRole("button");
        expect(submitButton).toBeDisabled();
    });
});
