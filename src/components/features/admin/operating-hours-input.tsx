"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";

const DAYS = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
] as const;

export function OperatingHoursInput() {
    const t = useTranslations();
    const { register, watch, setValue } = useFormContext();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{t("admin_branch_hours_label")}</h3>
                <div className="flex items-center gap-4">
                    <Label htmlFor="timezone" className="whitespace-nowrap">{t("admin_branch_form_timezone")}</Label>
                    <Input
                        id="timezone"
                        className="w-48"
                        {...register("operating_hours.timezone")}
                        placeholder="Asia/Riyadh"
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {DAYS.map((day) => {
                    const scheduleValue = watch(`operating_hours.schedule.${day}`);
                    const isClosed = scheduleValue === null;

                    return (
                        <div key={day} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg bg-card shadow-sm transition-colors hover:border-primary/20">
                            <div className="w-32 font-medium capitalize text-foreground">
                                {t(`day_${day}`)}
                            </div>

                            <div className="flex items-center gap-2 mr-auto">
                                <Switch
                                    id={`closed-${day}`}
                                    checked={!isClosed}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const checked = e.target.checked;
                                        if (checked) {
                                            setValue(`operating_hours.schedule.${day}`, { open: "08:00", close: "17:00" });
                                        } else {
                                            setValue(`operating_hours.schedule.${day}`, null);
                                        }
                                    }}
                                />
                                <Label htmlFor={`closed-${day}`} className="cursor-pointer">
                                    {isClosed ? t("branch_status_closed") : t("branch_status_open")}
                                </Label>
                            </div>

                            {!isClosed && (
                                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
                                    <div className="flex flex-col gap-1">
                                        <Input
                                            type="time"
                                            className="w-32 h-9"
                                            {...register(`operating_hours.schedule.${day}.open`)}
                                        />
                                    </div>
                                    <span className="text-muted-foreground">-</span>
                                    <div className="flex flex-col gap-1">
                                        <Input
                                            type="time"
                                            className="w-32 h-9"
                                            {...register(`operating_hours.schedule.${day}.close`)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
