"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Calendar } from "@/components/ui/Calendar";
import { DateRange } from "react-day-picker";
import { useAvailability } from "@/lib/hooks/use-availability";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Clock, CheckCircle2, AlertCircle, Calendar as CalendarIcon, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { OperatingHours } from "@/types/api/branches";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

const WEEK_DAYS = [
    "sunday", "monday", "tuesday", "wednesday",
    "thursday", "friday", "saturday",
] as const;

interface AvailabilityCalendarProps {
    spaceId: number;
    operatingHours?: OperatingHours;
}

export function AvailabilityCalendar({ spaceId, operatingHours }: AvailabilityCalendarProps) {
    const t = useTranslations();
    const router = useRouter();
    const locale = useLocale();

    // Default to today 09:00 to 18:00
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    });

    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("18:00");

    // Find operating hours for the currently selected day
    const currentDayOH = useMemo(() => {
        if (!dateRange?.from || !operatingHours?.schedule) return null;
        const dayName = WEEK_DAYS[dateRange.from.getDay()];
        return operatingHours.schedule[dayName] ?? null;
    }, [dateRange?.from, operatingHours]);

    // Adjust selected times if they fall outside newly selected day's operating hours
    useEffect(() => {
        if (currentDayOH) {
            if (startTime < currentDayOH.open) setStartTime(currentDayOH.open);
            if (startTime > currentDayOH.close) setStartTime(currentDayOH.open);
            if (endTime > currentDayOH.close) setEndTime(currentDayOH.close);
            if (endTime < currentDayOH.open) setEndTime(currentDayOH.close);
        }
    }, [currentDayOH, startTime, endTime]);

    const timeOptions = useMemo(() => {
        const options: { label: string; value: string; disabled?: boolean }[] = [];
        for (let i = 0; i < 24; i++) {
            const hour = i.toString().padStart(2, '0');
            ['00', '30'].forEach(minute => {
                const time = `${hour}:${minute}`;
                let disabled = false;
                if (currentDayOH) {
                    disabled = time < currentDayOH.open || time > currentDayOH.close;
                }
                options.push({
                    label: time,
                    value: time,
                    disabled
                });
            });
        }
        return options;
    }, [currentDayOH]);

    const fullStartDateTime = useMemo(() => {
        if (!dateRange?.from) return null;
        const date = new Date(dateRange.from);
        const [hours, minutes] = startTime.split(':').map(Number);
        date.setHours(hours, minutes, 0, 0);
        return date.toISOString();
    }, [dateRange?.from, startTime]);

    const fullEndDateTime = useMemo(() => {
        const baseDate = dateRange?.to || dateRange?.from;
        if (!baseDate) return null;
        const date = new Date(baseDate);
        const [hours, minutes] = endTime.split(':').map(Number);
        date.setHours(hours, minutes, 0, 0);
        return date.toISOString();
    }, [dateRange?.to, dateRange?.from, endTime]);

    // Identify days that are completely closed (missing from schedule)
    const disabledDays = useMemo(() => {
        if (!operatingHours?.schedule) return [];
        return [0, 1, 2, 3, 4, 5, 6].filter(
            (d) => !operatingHours.schedule[WEEK_DAYS[d]]
        );
    }, [operatingHours]);

    const { data: availability, isLoading } = useAvailability(
        {
            space_id: spaceId,
            start_datetime: fullStartDateTime || new Date().toISOString(),
            end_datetime: fullEndDateTime || new Date().toISOString(),
            attendees: 1,
        },
        !!fullStartDateTime && !!fullEndDateTime
    );

    return (
        <div className="bg-card rounded-3xl border shadow-xl overflow-hidden">
            <div className="p-6 bg-primary/5 border-b flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary font-bold">
                        <CalendarIcon size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold tracking-tight">{t("space_availability_title") || "Check Availability"}</h3>
                        <p className="text-xs text-muted-foreground font-medium">{t("space_select_dates_times") || "Select dates and times for your booking"}</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Step Indicator */}
                <div className="flex items-center justify-between px-2 pb-2">
                    <div className="flex flex-col items-center gap-1">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-[10px] text-primary-foreground font-bold">1</span>
                        <span className="text-[10px] font-bold uppercase tracking-tight opacity-60">{t("dates")}</span>
                    </div>
                    <div className="h-px flex-1 bg-border mx-2 mt-[-14px]" />
                    <div className="flex flex-col items-center gap-1">
                        <span className={cn(
                            "flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold",
                            dateRange?.from ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}>2</span>
                        <span className="text-[10px] font-bold uppercase tracking-tight opacity-60">{t("times")}</span>
                    </div>
                    <div className="h-px flex-1 bg-border mx-2 mt-[-14px]" />
                    <div className="flex flex-col items-center gap-1">
                        <span className={cn(
                            "flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold",
                            availability?.available ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}>3</span>
                        <span className="text-[10px] font-bold uppercase tracking-tight opacity-60">{t("book")}</span>
                    </div>
                </div>

                <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={1}
                    style={{ direction: 'ltr' }}
                    disabled={(date) => {
                        const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                        const isClosed = disabledDays.includes(date.getDay());
                        return isPast || isClosed;
                    }}
                    className="bg-muted/30 rounded-2xl p-2 border border-muted/50"
                />


                {/* Operating Hours Info */}
                {currentDayOH && (
                    <div className="px-4 py-2 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center gap-3 text-blue-900 animate-in fade-in slide-in-from-top-1">
                        <Info size={16} className="text-blue-600 shrink-0" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                                {t("space_operating_hours_label")}
                            </span>
                            <span className="text-sm font-bold tracking-tight">
                                {currentDayOH.open} — {currentDayOH.close}
                            </span>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 ml-1">
                            <Clock size={12} /> {t("space_time_start")}
                        </label>
                        <Select
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            options={timeOptions}
                            className="bg-muted/50 border-transparent hover:border-primary/30 transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 ml-1">
                            <Clock size={12} /> {t("space_time_end")}
                        </label>
                        <Select
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            options={timeOptions}
                            className="bg-muted/50 border-transparent hover:border-primary/30 transition-colors"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    {isLoading ? (
                        <div className="p-4 rounded-2xl bg-muted/50 flex items-center gap-3 text-muted-foreground">
                            <Loader2 size={20} className="animate-spin text-primary" />
                            <span className="text-sm font-medium">{t("space_checking")}</span>
                        </div>
                    ) : availability ? (
                        <div className={cn(
                            "p-5 rounded-2xl border-2 transition-all duration-300",
                            availability.available
                                ? "bg-green-50/50 border-green-100 text-green-900"
                                : "bg-red-50/50 border-red-100 text-red-900"
                        )}>
                            <div className="flex items-start gap-3">
                                {availability.available ? (
                                    <CheckCircle2 size={24} className="text-green-600 shrink-0 mt-0.5" />
                                ) : (
                                    <AlertCircle size={24} className="text-red-600 shrink-0 mt-0.5" />
                                )}
                                <div className="space-y-2">
                                    <p className="font-bold leading-tight">
                                        {availability.available ? t("space_available") : t("space_unavailable")}
                                    </p>
                                    {availability.validations && (
                                        <ul className="text-sm space-y-1 opacity-80 font-medium">
                                            {availability.validations.map((v, i) => {
                                                const key = `validation_${v.code}`;
                                                let translated = v.message;
                                                try {
                                                    // @ts-ignore
                                                    const tResult = t(key);
                                                    if (tResult && tResult !== key && !tResult.startsWith("validation_")) {
                                                        translated = tResult;
                                                    }
                                                } catch (e) {
                                                    // fallback to backend message
                                                }

                                                return (
                                                    <li key={i} className="flex items-center gap-2">
                                                        <span className={v.passed ? "text-green-600" : "text-red-600"}>
                                                            {v.passed ? "✓" : "✗"}
                                                        </span>
                                                        {translated}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 rounded-2xl bg-muted/30 border-2 border-dashed flex flex-col items-center text-center gap-2">
                            <CalendarIcon size={40} className="text-muted-foreground/30" />
                            <p className="text-sm text-muted-foreground font-medium">
                                {t("space_select_dates_times") || "Select date and time to check availability"}
                            </p>
                        </div>
                    )}
                </div>

                <div className="group relative">
                    {!availability?.available && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-zinc-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {t("space_select_available_dates_first") || "Select available dates first"}
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-800 rotate-45" />
                        </div>
                    )}
                    <Button
                        className="w-full h-12 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transform active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed disabled:transform-none"
                        disabled={!availability?.available || isLoading || !dateRange?.from}
                        onClick={() => {
                            if (availability?.available && fullStartDateTime && fullEndDateTime) {
                                const params = new URLSearchParams({
                                    space_id: String(spaceId),
                                    start_date: fullStartDateTime,
                                    end_date: fullEndDateTime,
                                });
                                router.push(`/${locale}/bookings/create?${params.toString()}`);
                            }
                        }}
                    >
                        {t("space_book_now_cta")}
                    </Button>
                </div>

                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-tighter font-bold">
                    {t("space_booking_trust_badge")}
                </p>
            </div>
        </div>
    );
}
