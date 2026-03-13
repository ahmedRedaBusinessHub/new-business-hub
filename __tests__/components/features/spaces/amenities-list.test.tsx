import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AmenitiesList } from "@/components/features/spaces/amenities-list";
import { NextIntlClientProvider } from "next-intl";

const messages = {
    space_detail_amenities_title: "Amenities & Features",
    space_amenities_empty: "No amenities listed"
};

const renderWithIntl = (component: React.ReactNode) => {
    return render(
        <NextIntlClientProvider locale="en" messages={messages}>
            {component}
        </NextIntlClientProvider>
    );
};

const mockAmenities = [
    { id: 1, name_en: "Fast WiFi", name_ar: "واي فاي سريع" },
    { id: 2, name_en: "Coffee", name_ar: "قهوة" },
];

describe("AmenitiesList", () => {
    it("renders correctly with amenities", () => {
        renderWithIntl(<AmenitiesList amenities={mockAmenities} />);

        expect(screen.getByText("Amenities & Features")).toBeInTheDocument();
        expect(screen.getByText("Fast WiFi")).toBeInTheDocument();
        expect(screen.getByText("Coffee")).toBeInTheDocument();
    });

    it("renders empty state", () => {
        renderWithIntl(<AmenitiesList amenities={[]} />);
        expect(screen.getByText("No amenities listed")).toBeInTheDocument();
    });
});
