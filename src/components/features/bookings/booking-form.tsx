"use client";

import { useEffect } from "react";

function toLocalDatetimeValue(isoString: string): string {
  const d = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function localDatetimeToIso(dateStr: string, timeStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date(year, month - 1, day, hours, minutes);
  return date.toISOString();
}

type DaySchedule = { open: string; close: string } | null | undefined;
type WeekSchedule = Record<string, DaySchedule>;

function getScheduleForIso(isoStr: string, schedule: WeekSchedule | undefined): DaySchedule {
  if (!schedule || !isoStr) return null;
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return schedule[dayNames[new Date(isoStr).getDay()]] ?? null;
}
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { PricingTier, CreateBookingData } from "@/types/api/bookings";
import { createBookingSchema } from "@/lib/schemas/booking";
import { CoworkingSpace } from "@/types/api/spaces";
import { useUserSubscriptions } from "@/lib/hooks/use-subscriptions";
import { useServices } from "@/lib/hooks/use-services";
import { PercentDiamond } from "lucide-react";
import { ServicesSelector } from "@/components/features/services/services-selector";
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

interface BookingFormProps {
  space: CoworkingSpace;
  onSubmit: (data: CreateBookingData) => void;
  isLoading?: boolean;
  initialStartDate?: string;
  initialEndDate?: string;
  initialAttendees?: number;
  initialServiceIds?: number[];
  submitLabel?: string;
}

export function BookingForm({
  space,
  onSubmit,
  isLoading = false,
  initialStartDate,
  initialEndDate,
  initialAttendees = 1,
  initialServiceIds,
  submitLabel,
}: BookingFormProps) {
  const t = useTranslations();

  const defaultStart = initialStartDate || new Date().toISOString();
  const defaultEnd =
    initialEndDate || new Date(new Date().getTime() + 3600000).toISOString();

  const form = useForm<CreateBookingData>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      space_id: space.id,
      start_date: defaultStart,
      end_date: defaultEnd,
      pricing_tier: PricingTier.HOURLY,
      attendees: initialAttendees,
      additional_service_ids: initialServiceIds || [],
    },
  });

  const pricingTier = form.watch("pricing_tier");
  const startDate = form.watch("start_date");
  const endDate = form.watch("end_date");
  const isHourly = pricingTier === PricingTier.HOURLY;

  const operatingHours = space.operating_hours || space.branch?.operating_hours;
  const weekSchedule = operatingHours?.schedule as WeekSchedule | undefined;

  const startLocal = startDate ? toLocalDatetimeValue(startDate) : "";
  const startDatePart = startLocal.slice(0, 10);
  const startTimePart = startLocal.slice(11, 16);
  const startSchedule = getScheduleForIso(startDate, weekSchedule);

  const endLocal = endDate ? toLocalDatetimeValue(endDate) : "";
  const endDatePart = endLocal.slice(0, 10);
  const endTimePart = endLocal.slice(11, 16);
  const endSchedule = getScheduleForIso(endDate, weekSchedule);
  const isSameDay = startDatePart === endDatePart;

  useEffect(() => {
    if (isHourly) return;
    const start = new Date(startDate);
    if (isNaN(start.getTime())) return;
    const end = new Date(start);
    if (pricingTier === PricingTier.DAILY) end.setDate(end.getDate() + 1);
    if (pricingTier === PricingTier.WEEKLY) end.setDate(end.getDate() + 7);
    if (pricingTier === PricingTier.MONTHLY) end.setMonth(end.getMonth() + 1);
    form.setValue("end_date", end.toISOString(), { shouldValidate: true });
  }, [pricingTier, startDate]);

  const availableTiers = [
    ...(space.hourly_rate
      ? [{ label: t("space_pricing_hourly"), value: PricingTier.HOURLY }]
      : []),
    ...(space.daily_rate
      ? [{ label: t("space_pricing_daily"), value: PricingTier.DAILY }]
      : []),
    ...(space.weekly_rate
      ? [{ label: t("space_pricing_weekly"), value: PricingTier.WEEKLY }]
      : []),
    ...(space.monthly_rate
      ? [{ label: t("space_pricing_monthly"), value: PricingTier.MONTHLY }]
      : []),
  ];

  const { data: userSubsData } = useUserSubscriptions();
  console.log("🚀 ~ BookingForm ~ userSubsData:", userSubsData)
  const activeSubscription = (userSubsData as { data?: { data?: Array<{ status: string }> } })?.data?.data?.find(
    (sub: { status: string }) => sub.status === "active",
  );
  const benefits = activeSubscription?.benefits;

  const { data: services = [] } = useServices({ branchId: space.branch_id });

  return (
    <Form
      {...form}
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6  "
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  onChange={(e) => field.onChange(e.target.value)}
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
              <FormLabel>
                {t("space_capacity_label", { capacity: space.capacity })}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={space.capacity}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
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
              <FormLabel>
                {isHourly
                  ? t("booking_form_start_time")
                  : t("booking_form_start_date")}
              </FormLabel>
              <FormControl>
                {isHourly ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={startDatePart}
                      onChange={(e) => {
                        if (!startDatePart) return;
                        const iso = localDatetimeToIso(e.target.value, startTimePart || "00:00");
                        field.onChange(iso);
                      }}
                    />
                    <Input
                      type="time"
                      lang="en-GB"
                      min={startSchedule?.open ?? undefined}
                      max={startSchedule?.close ?? undefined}
                      value={startTimePart}
                      onChange={(e) => {
                        if (!e.target.value || !startDatePart) return;
                        const iso = localDatetimeToIso(startDatePart, e.target.value);
                        field.onChange(iso);
                      }}
                    />
                  </div>
                ) : (
                  <Input
                    type="date"
                    {...field}
                    value={field.value ? field.value.slice(0, 10) : ""}
                    onChange={(e) => {
                      const iso = localDatetimeToIso(e.target.value, "00:00");
                      field.onChange(iso);
                    }}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {(isHourly || pricingTier === PricingTier.DAILY) && (
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isHourly ? t("booking_form_end_time") : t("booking_form_end_date")}</FormLabel>
                <FormControl>
                  {isHourly ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        min={startDatePart}
                        value={endDatePart}
                        onChange={(e) => {
                          if (!endDatePart) return;
                          const iso = localDatetimeToIso(e.target.value, endTimePart || "00:00");
                          field.onChange(iso);
                        }}
                      />
                      <Input
                        type="time"
                        lang="en-GB"
                        min={isSameDay ? startTimePart : (endSchedule?.open ?? undefined)}
                        max={endSchedule?.close ?? undefined}
                        value={endTimePart}
                        onChange={(e) => {
                          if (!e.target.value || !endDatePart) return;
                          const iso = localDatetimeToIso(endDatePart, e.target.value);
                          field.onChange(iso);
                        }}
                      />
                    </div>
                  ) : (
                    <Input
                      type="date"
                      {...field}
                      value={field.value ? field.value.slice(0, 10) : ""}
                      onChange={(e) => {
                        const iso = localDatetimeToIso(e.target.value, "00:00");
                        field.onChange(iso);
                      }}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {services.length > 0 && (
        <FormField
          control={form.control}
          name="additional_service_ids"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ServicesSelector
                  services={services}
                  selectedServiceIds={field.value || []}
                  onToggleService={(service) => {
                    const current = field.value || [];
                    const next = current.includes(service.id)
                      ? current.filter((id) => id !== service.id)
                      : [...current, service.id];
                    field.onChange(next);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {benefits && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
          <h4 className="flex items-center gap-2 font-bold text-primary mb-2 text-sm">
            <PercentDiamond className="w-4 h-4" />
            {t("subscription_benefits_applied_label")}
          </h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            {benefits.discountPercentage && (
              <li>
                • {benefits.discountPercentage}% {t("booking_discount")}
              </li>
            )}
            {benefits.freeMeetingRoomHours && (
              <li>
                • {benefits.freeMeetingRoomHours} {t("free_hours_month")}
              </li>
            )}
          </ul>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading
          ? t("common_saving", { defaultMessage: "Processing..." })
          : submitLabel || t("space_book_now_cta")}
      </Button>
    </Form>
  );
}
