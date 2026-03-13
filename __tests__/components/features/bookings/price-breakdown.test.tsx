import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PriceBreakdown } from "@/components/features/bookings/price-breakdown";
import { NextIntlClientProvider } from "next-intl";

const mockEstimate = {
    base_price: 100,
    discount_applied: 10,
    tax_amount: 15,
    total_price: 105,
    breakdown: {
        hourly_rate: 10,
        total_hours: 10,
    }
};

const messages = {
    "booking_price_total": "Total Price",
    "booking_price_base": "Base Price",
    "booking_price_tax": "Tax",
    "booking_tenant_discount_label": "Tenant Discount",
    "space_pricing_hourly": "Hourly Rate"
};

const renderWithIntl = (component: React.ReactNode) => {
    return render(
        <NextIntlClientProvider locale="en" messages={messages}>
            {component}
        </NextIntlClientProvider>
    );
};

describe("PriceBreakdown", () => {
    it("renders the valid price estimate elements", () => {
        renderWithIntl(<PriceBreakdown estimate={mockEstimate} />);

        expect(screen.getByText("Total Price", { selector: "h3" })).toBeInTheDocument();
        expect(screen.getByText("Base Price")).toBeInTheDocument();
        // Since the component displays "Tax (15%)" or similar, just text match 'Tax'
        expect(screen.getByText(/Tax/)).toBeInTheDocument();
        expect(screen.getByText("Tenant Discount")).toBeInTheDocument();
        expect(screen.getByText("Total Price", { selector: "span" })).toBeInTheDocument();

        // Checking currency using more generic regexes since i18n adds arabic formatting and SAR 
        expect(screen.getByText(/100/)).toBeInTheDocument();
        expect(screen.getByText(/10/)).toBeInTheDocument();
        expect(screen.getByText(/15/)).toBeInTheDocument();
        expect(screen.getByText(/105/)).toBeInTheDocument();
    });

    it("displays the breakdown details correctly when hourly", () => {
        renderWithIntl(<PriceBreakdown estimate={mockEstimate} />);
        expect(screen.getByText(/10 hrs/)).toBeInTheDocument();
    });
});
