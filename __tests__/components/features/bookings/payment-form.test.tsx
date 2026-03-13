import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PaymentForm } from "@/components/features/bookings/payment-form";
import { NextIntlClientProvider } from "next-intl";

const messages = {
    "booking_payment_title": "Payment Details",
    "payment_card_name_label": "Name on Card",
    "payment_card_number_label": "Card Number",
    "payment_expiry_label": "Expiry Date",
    "payment_pay_now_cta": "Pay Now"
};

const renderWithIntl = (component: React.ReactNode) => {
    return render(
        <NextIntlClientProvider locale="en" messages={messages}>
            {component}
        </NextIntlClientProvider>
    );
};

describe("PaymentForm", () => {
    it("renders payment fields", () => {
        const mockOnPay = vi.fn();
        renderWithIntl(<PaymentForm onPay={mockOnPay} />);

        expect(screen.getByText("Payment Details")).toBeInTheDocument();
        expect(screen.getByLabelText("Name on Card")).toBeInTheDocument();
        expect(screen.getByLabelText("Card Number")).toBeInTheDocument();
        expect(screen.getByLabelText("Expiry Date")).toBeInTheDocument();
        expect(screen.getByLabelText("CVV")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Pay Now" })).toBeInTheDocument();
    });

    it("calls onPay when submitted", () => {
        const mockOnPay = vi.fn();
        renderWithIntl(<PaymentForm onPay={mockOnPay} />);

        const formSubmitButton = screen.getByRole("button", { name: "Pay Now" });
        fireEvent.click(formSubmitButton);

        expect(mockOnPay).toHaveBeenCalled();
    });

    it("disables submit button and shows loading state", () => {
        const mockOnPay = vi.fn();
        renderWithIntl(<PaymentForm onPay={mockOnPay} isLoading={true} />);

        const submitButton = screen.getByRole("button");
        expect(submitButton).toBeDisabled();
        expect(screen.getByText("Processing...")).toBeInTheDocument();
    });
});
