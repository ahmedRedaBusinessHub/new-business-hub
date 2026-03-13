"use client";

import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { CreateSpaceData } from "@/lib/schemas/space";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";

interface PricingTiersFormProps {
    form: UseFormReturn<CreateSpaceData>;
}

export function PricingTiersForm({ form }: PricingTiersFormProps) {
    const t = useTranslations();

    return (
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
            <h3 className="text-lg font-medium mb-4">{t("admin_space_form_pricing") || "Pricing Options"}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                    control={form.control}
                    name="hourly_rate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("space_pricing_hourly") || "Hourly Rate"}</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    {...field}
                                    value={field.value ?? ""}
                                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                    placeholder="0.00"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="daily_rate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("space_pricing_daily") || "Daily Rate"}</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    {...field}
                                    value={field.value ?? ""}
                                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                    placeholder="0.00"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="weekly_rate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("space_pricing_weekly") || "Weekly Rate"}</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    {...field}
                                    value={field.value ?? ""}
                                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                    placeholder="0.00"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="monthly_rate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("space_pricing_monthly") || "Monthly Rate"}</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    {...field}
                                    value={field.value ?? ""}
                                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                    placeholder="0.00"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            {form.formState.errors.root && (
                <p className="text-sm font-medium text-red-500 mt-2">
                    {form.formState.errors.root.message}
                </p>
            )}
        </div>
    );
}
