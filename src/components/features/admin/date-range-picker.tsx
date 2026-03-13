"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { DateRange } from "react-day-picker";
import { useLocale, useTranslations } from "next-intl";
import { ar } from "date-fns/locale/ar";
import { enUS } from "date-fns/locale/en-US";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/Popover";

interface DateRangePickerProps {
    className?: string;
    value?: DateRange;
    onChange?: (range: DateRange | undefined) => void;
}

export function DateRangePicker({
    className,
    value,
    onChange,
}: DateRangePickerProps) {
    const locale = useLocale();
    const t = useTranslations();
    const dateFnsLocale = locale === "ar" ? ar : enUS;

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !value && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                        {value?.from ? (
                            value.to ? (
                                <>
                                    {format(value.from, "LLL dd, y", { locale: dateFnsLocale })} -{" "}
                                    {format(value.to, "LLL dd, y", { locale: dateFnsLocale })}
                                </>
                            ) : (
                                format(value.from, "LLL dd, y", { locale: dateFnsLocale })
                            )
                        ) : (
                            <span>{t("select_date_range_placeholder") || "Pick a date"}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={value?.from}
                        selected={value}
                        onSelect={onChange}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
