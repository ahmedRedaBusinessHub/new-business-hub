"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { PricingTier, CreateRecurringBookingData, RecurrencePattern } from "@/types/api/bookings";
import { createRecurringBookingSchema } from "@/lib/schemas/booking";
import { CoworkingSpace } from "@/types/api/spaces";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

interface RecurringBookingFormProps {
    space: CoworkingSpace;
    onSubmit: (data: CreateRecurringBookingData) => void;
    isLoading?: boolean;
    initialStartDate?: string;
    initialAttendees?: number;
    submitLabel?: string;
}

export function RecurringBookingForm({
    space,
    onSubmit,
    isLoading = false,
    initialStartDate,
    initialAttendees = 1,
    submitLabel
}: RecurringBookingFormProps) {
    const t = useTranslations();

    const defaultStart = initialStartDate || new Date().toISOString();

    const form = useForm<CreateRecurringBookingData>({
        resolver: zodResolver(createRecurringBookingSchema),
        defaultValues: {
            space_id: space.id,
            start_date: defaultStart,
            pattern: RecurrencePattern.WEEKLY,
            occurrences: 4,
            pricing_tier: PricingTier.HOURLY,
            attendees: initialAttendees,
            additional_service_ids: [],
        },
    });

    const isSubmitting = isLoading || form.formState.isSubmitting;

    const availableTiers = [
        ...(space.hourly_rate ? [{ label: t("space_pricing_hourly"), value: PricingTier.HOURLY }] : []),
        ...(space.daily_rate ? [{ label: t("space_pricing_daily"), value: PricingTier.DAILY }] : []),
        ...(space.weekly_rate ? [{ label: t("space_pricing_weekly"), value: PricingTier.WEEKLY }] : []),
        ...(space.monthly_rate ? [{ label: t("space_pricing_monthly"), value: PricingTier.MONTHLY }] : []),
    ];

    const recurrencePatterns = [
        { label: t("recurring_booking_daily"), value: RecurrencePattern.DAILY },
        { label: t("recurring_booking_weekly"), value: RecurrencePattern.WEEKLY },
        { label: t("recurring_booking_monthly"), value: RecurrencePattern.MONTHLY },
    ];

    return (
        <Form {...form} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="pattern"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("recurring_booking_pattern_label")}</FormLabel>
                            <FormControl>
                                <Select
                                    options={recurrencePatterns}
                                    {...field}
                                    onChange={e => field.onChange(e.target.value)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="pricing_tier"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("booking_form_duration_label")}</FormLabel>
                            <FormControl>
                                <Select
                                    options={availableTiers}
                                    {...field}
                                    onChange={e => field.onChange(e.target.value)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="attendees"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("space_capacity_label", { capacity: space.capacity })}</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={1}
                                    max={space.capacity}
                                    {...field}
                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("booking_form_start_time")}</FormLabel>
                            <FormControl>
                                <Input
                                    type="datetime-local"
                                    {...field}
                                    value={field.value ? field.value.slice(0, 16) : ""}
                                    onChange={e => {
                                        const dateStr = new Date(e.target.value).toISOString();
                                        field.onChange(dateStr);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="occurrences"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("recurring_booking_occurrences")}</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={1}
                                    {...field}
                                    value={field.value || ""}
                                    onChange={e => {
                                        const val = e.target.value;
                                        if (val) {
                                            field.onChange(parseInt(val));
                                            form.setValue("end_date", undefined); // Clear end_date if occurrences is set
                                        } else {
                                            field.onChange(undefined);
                                        }
                                    }}
                                    placeholder="e.g. 5"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("recurring_booking_end_date")}</FormLabel>
                            <FormControl>
                                <Input
                                    type="datetime-local"
                                    {...field}
                                    value={field.value ? field.value.slice(0, 16) : ""}
                                    onChange={e => {
                                        const val = e.target.value;
                                        if (val) {
                                            const dateStr = new Date(val).toISOString();
                                            field.onChange(dateStr);
                                            form.setValue("occurrences", undefined); // Clear occurrences if end_date is set
                                        } else {
                                            field.onChange(undefined);
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t("common_saving", { defaultMessage: "Processing..." }) : (submitLabel || t("space_book_now_cta"))}
            </Button>
        </Form>
    );
}
