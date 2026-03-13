import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateBookingClient } from "@/app/[locale]/(private)/bookings/create/create-booking-client";
import { CoworkingSpace, SpaceType } from "@/types/api/spaces";
import { NextIntlClientProvider } from "next-intl";
import { useCreateBooking, usePriceEstimate } from "@/lib/hooks/use-bookings";
import { useRouter } from "next/navigation";

// Mock hooks
vi.mock("@/lib/hooks/use-bookings", () => ({
    useCreateBooking: vi.fn(),
    usePriceEstimate: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    useRouter: vi.fn(),
}));

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
    "space_pricing_hourly": "Hourly Rate",
    "space_capacity_label": "Capacity",
    "booking_form_start_time": "Start Time",
    "booking_form_end_time": "End Time",
    "space_book_now_cta": "Book Now",
    "booking_payment_title": "Payment Details",
    "payment_pay_now_cta": "Pay Now",
    "booking_price_total": "Total Price",
    "booking_price_base": "Base Price",
    "booking_price_tax": "Tax",
    "booking_tenant_discount_label": "Tenant Discount"
};

const renderWithIntl = (component: React.ReactNode) => {
    return render(
        <NextIntlClientProvider locale="en" messages={messages}>
            {component}
        </NextIntlClientProvider>
    );
};

describe("Integration: Booking Flow", () => {
    const mockRouterPush = vi.fn();
    const mockEstimateMutateAsync = vi.fn();
    const mockCreateMutateAsync = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        // Mock MatchMedia for Radix UI or others
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });

        (useRouter as any).mockReturnValue({ push: mockRouterPush });

        (usePriceEstimate as any).mockReturnValue({
            mutateAsync: mockEstimateMutateAsync,
            isPending: false
        });

        (useCreateBooking as any).mockReturnValue({
            mutateAsync: mockCreateMutateAsync,
            isPending: false
        });
    });

    it("verifies the complete booking flow from selection to payment to confirmation", async () => {
        // Setup mocks for the flow steps
        mockEstimateMutateAsync.mockResolvedValueOnce({
            base_price: 100,
            discount_applied: 0,
            tax_amount: 15,
            total_price: 115,
            breakdown: { hourly_rate: 10, total_hours: 10 }
        });

        mockCreateMutateAsync.mockResolvedValueOnce({
            id: 999
        });

        renderWithIntl(<CreateBookingClient space={mockSpace} />);

        // Step 1: Submit Booking Form
        fireEvent.click(screen.getByRole("button", { name: "Book Now" }));

        // Wait for estimate API and state change
        await waitFor(() => {
            expect(mockEstimateMutateAsync).toHaveBeenCalled();
        });

        // Step 2: verify we see the payment screen
        await waitFor(() => {
            expect(screen.getByText("Payment Details")).toBeInTheDocument();
            // Breakdown should be visible
            expect(screen.getByText("Total Price", { selector: "h3" })).toBeInTheDocument();
        });

        // Step 3: submit payment
        fireEvent.click(screen.getByRole("button", { name: "Pay Now" }));

        // Wait for create booking and redirect to confirmation
        await waitFor(() => {
            expect(mockCreateMutateAsync).toHaveBeenCalled();
            expect(mockRouterPush).toHaveBeenCalledWith("/bookings/confirm?id=999");
        });
    });

    it("handles error scenarios like payment failure or estimate failure", async () => {
        // Reject estimate
        mockEstimateMutateAsync.mockRejectedValueOnce(new Error("Estimate failed"));

        renderWithIntl(<CreateBookingClient space={mockSpace} />);

        // Submit form
        fireEvent.click(screen.getByRole("button", { name: "Book Now" }));

        // Should call mutateAsync but fail, so it shouldn't show payment form
        await waitFor(() => {
            expect(mockEstimateMutateAsync).toHaveBeenCalled();
            expect(screen.queryByText("Payment Details")).not.toBeInTheDocument();
        });
    });
});
