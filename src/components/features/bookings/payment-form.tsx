"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { CreditCard, CalendarDays, Lock } from "lucide-react";

interface PaymentFormProps {
    onPay: () => void;
    isLoading?: boolean;
}

export function PaymentForm({ onPay, isLoading = false }: PaymentFormProps) {
    const t = useTranslations();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onPay();
    };

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-gray-500" />
                {t("booking_payment_title")}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="cardName">{t("payment_card_name_label") || "Name on Card"}</Label>
                    <Input id="cardName" placeholder="John Doe" required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cardNumber">{t("payment_card_number_label") || "Card Number"}</Label>
                    <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            id="cardNumber"
                            className="pl-10"
                            placeholder="0000 0000 0000 0000"
                            pattern="[\d ]{16,19}"
                            maxLength={19}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="expiry">{t("payment_expiry_label") || "Expiry Date"}</Label>
                        <div className="relative">
                            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                id="expiry"
                                className="pl-10"
                                placeholder="MM/YY"
                                pattern="\d\d\/\d\d"
                                maxLength={5}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" type="password" placeholder="123" pattern="\d{3,4}" maxLength={4} required />
                    </div>
                </div>

                <div className="pt-4">
                    <Button type="submit" className="w-full h-12 text-lg font-medium" disabled={isLoading}>
                        {isLoading ? t("payment_processing_label") : t("payment_pay_now_cta") || "Pay Now"}
                    </Button>
                    <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
                        <Lock className="w-3 h-3" />
                        {t("payment_secure_label")}
                    </p>
                </div>
            </form>
        </div>
    );
}
