import { useTranslations, useLocale } from "next-intl";
import { formatCurrency } from "@/lib/utils";
import { PriceEstimateResponse } from "@/lib/api/bookings";

interface PriceBreakdownProps {
    estimate: PriceEstimateResponse;
}

export function PriceBreakdown({ estimate }: PriceBreakdownProps) {
    const t = useTranslations();
    const locale = useLocale() as "ar-SA" | "en-US" | "ar" | "en";
    const currencyLocale = locale.startsWith('ar') ? 'ar-SA' : 'en-US';

    return (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold">{t("booking_price_total")}</h3>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>{t("booking_price_base")}</span>
                    <span>{formatCurrency(estimate.base_price, currencyLocale)}</span>
                </div>

                {estimate.discount_applied > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
                        <span>{t("booking_tenant_discount_label", { defaultMessage: "Discount" })}</span>
                        <span>-{formatCurrency(estimate.discount_applied, currencyLocale)}</span>
                    </div>
                )}

                {estimate.breakdown.services_total && estimate.breakdown.services_total > 0 && (
                    <div className="pt-2">
                        <div className="flex justify-between text-gray-800 dark:text-gray-200 font-medium mb-1">
                            <span>{t("services_title")}</span>
                            <span>{formatCurrency(estimate.breakdown.services_total, currencyLocale)}</span>
                        </div>
                        {estimate.breakdown.services && estimate.breakdown.services.length > 0 && (
                            <ul className="text-xs text-muted-foreground ml-2 space-y-1">
                                {estimate.breakdown.services.map((service, idx) => (
                                    <li key={idx} className="flex justify-between">
                                        <span>• {service.name}</span>
                                        <span>{formatCurrency(service.price, currencyLocale)}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>{t("booking_price_tax")} (15%)</span>
                    <span>{formatCurrency(estimate.tax_amount, currencyLocale)}</span>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800 flex justify-between font-bold text-lg">
                    <span>{t("booking_price_total")}</span>
                    <span className="text-primary">{formatCurrency(estimate.total_price, currencyLocale)}</span>
                </div>
            </div>
        </div>
    );
}
