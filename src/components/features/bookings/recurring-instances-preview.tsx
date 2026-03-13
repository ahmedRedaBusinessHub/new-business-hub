"use client";

import { useTranslations } from "next-intl";
import { RecurrencePattern } from "@/types/api/bookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";

interface RecurringInstancesPreviewProps {
    startDate: string;
    pattern: RecurrencePattern;
    endDate?: string;
    occurrences?: number;
    locale?: string;
}

export function RecurringInstancesPreview({
    startDate,
    pattern,
    endDate,
    occurrences,
    locale = "en"
}: RecurringInstancesPreviewProps) {
    const t = useTranslations();

    if (!startDate || (!endDate && !occurrences)) {
        return null; // Not enough data to preview
    }

    // A simple preview calculation for the UI
    const generatePreviewDates = () => {
        const dates: Date[] = [];
        let current = new Date(startDate);
        const end = endDate ? new Date(endDate) : null;
        let count = 0;
        const maxOccurrences = occurrences || 365; // Prevent infinite loops
        const previewLimit = 5; // How many to show in preview

        while (true) {
            if (end && current > end) break;
            if (count >= maxOccurrences) break;

            dates.push(new Date(current));
            count++;

            switch (pattern) {
                case RecurrencePattern.DAILY:
                    current.setDate(current.getDate() + 1);
                    break;
                case RecurrencePattern.WEEKLY:
                    current.setDate(current.getDate() + 7);
                    break;
                case RecurrencePattern.MONTHLY:
                    current.setMonth(current.getMonth() + 1);
                    break;
                default:
                    // Fallback to prevent infinite loop
                    count = maxOccurrences;
                    break;
            }
        }
        return {
            dates: dates.slice(0, previewLimit),
            total: dates.length
        };
    };

    const { dates, total } = generatePreviewDates();

    if (total === 0) return null;

    return (
        <Card className="mt-6 bg-muted/30">
            <CardHeader className="py-4">
                <CardTitle className="text-base font-semibold">{t("recurring_booking_summary")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-foreground/80">
                    <span className="font-semibold">{t("recurring_booking_instances_count")}</span> {total}
                </p>
                <div>
                    <ul className="space-y-2">
                        {dates.map((date, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground before:content-['•'] before:text-brand-500">
                                {formatDate(date, locale === 'ar' ? 'ar-SA' : 'en-US')}
                            </li>
                        ))}
                        {total > dates.length && (
                            <li className="text-sm text-muted-foreground italic mt-2">
                                {t("recurring_booking_and_more", { count: total - dates.length })}
                            </li>
                        )}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
