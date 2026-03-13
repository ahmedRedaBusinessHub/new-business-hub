import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { PricingTable } from "@/components/features/spaces/pricing-table";
import { NextIntlClientProvider } from "next-intl";

const messages = {
    space_pricing_hourly: "hour",
    space_pricing_daily: "day",
    space_pricing_weekly: "week",
    space_pricing_monthly: "month",
    space_pricing_title: "Pricing Options",
    space_pricing_unavailable: "Pricing unavailable"
};

const renderWithIntl = (component: React.ReactNode) => {
    return render(
        <NextIntlClientProvider locale="en" messages={messages}>
            {component}
        </NextIntlClientProvider>
    );
};

describe("PricingTable", () => {
    it("renders pricing correctly", () => {
        renderWithIntl(
            <PricingTable
                hourlyRate={100}
                dailyRate={500}
                weeklyRate={2500}
                monthlyRate={8000}
            />
        );

        expect(screen.getByText("Pricing Options")).toBeInTheDocument();
        expect(screen.getByText("hour")).toBeInTheDocument();
        expect(screen.getByText("day")).toBeInTheDocument();
        expect(screen.getByText("week")).toBeInTheDocument();
        expect(screen.getByText("month")).toBeInTheDocument();

        // Check if formatCurrency works (renders SAR or formatted value, assuming locale)
        // We just check if the number is there
        expect(screen.getByText(/100/i)).toBeInTheDocument();
        expect(screen.getByText(/8,000|8000/i)).toBeInTheDocument();
    });

    it("renders unavailable state when no prices are provided", () => {
        renderWithIntl(<PricingTable />);
        expect(screen.getByText("Pricing unavailable")).toBeInTheDocument();
    });
});
