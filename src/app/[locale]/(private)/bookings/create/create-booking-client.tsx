"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { CoworkingSpace } from "@/types/api/spaces";
import {
  CreateBookingData,
  CreateRecurringBookingData,
  RecurrencePattern,
} from "@/types/api/bookings";
import { BookingForm } from "@/components/features/bookings/booking-form";
import { RecurringBookingForm } from "@/components/features/bookings/recurring-booking-form";
import { RecurringInstancesPreview } from "@/components/features/bookings/recurring-instances-preview";
import { PriceBreakdown } from "@/components/features/bookings/price-breakdown";
import { PaymentForm } from "@/components/features/bookings/payment-form";
import {
  useCreateBooking,
  usePriceEstimate,
  useCreateRecurringBooking,
} from "@/lib/hooks/use-bookings";
import { PriceEstimateResponse } from "@/lib/api/bookings";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";

interface CreateBookingClientProps {
  space: CoworkingSpace;
  start_date?: string;
  end_date?: string;
}

export function CreateBookingClient({
  space,
  start_date,
  end_date,
}: CreateBookingClientProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const createBooking = useCreateBooking();
  const createRecurringBooking = useCreateRecurringBooking();
  const priceEstimate = usePriceEstimate();

  const [isRecurring, setIsRecurring] = useState(false);
  const [bookingData, setBookingData] = useState<CreateBookingData | null>(
    null,
  );
  const [recurringBookingData, setRecurringBookingData] =
    useState<CreateRecurringBookingData | null>(null);
  const [estimate, setEstimate] = useState<PriceEstimateResponse | null>(null);
  const [step, setStep] = useState<"form" | "payment">("form");

  const [recurringPreviewData, setRecurringPreviewData] = useState<{
    startDate: string;
    pattern: RecurrencePattern;
    occurrences?: number;
    endDate?: string;
  } | null>(null);

  const handleFormSubmit = async (data: CreateBookingData) => {
    try {
      const result = await priceEstimate.mutateAsync(data);
      setEstimate(result);
      setBookingData(data);
      setRecurringBookingData(null);
      setStep("payment");
    } catch (error) {
      console.error("Failed to get price estimate:", error);
    }
  };

  const handleRecurringFormSubmit = async (
    data: CreateRecurringBookingData,
  ) => {
    try {
      // For recurring bookings, use the base item for price estimate
      const baseData: CreateBookingData = {
        space_id: data.space_id,
        start_date: data.start_date,
        end_date:
          data.end_date ||
          new Date(new Date(data.start_date).getTime() + 3600000).toISOString(),
        pricing_tier: data.pricing_tier,
        attendees: data.attendees,
        additional_service_ids: data.additional_service_ids,
      };
      const result = await priceEstimate.mutateAsync(baseData);

      // If we have occurrences instead of end_date, multiply the estimate manually
      if (data.occurrences && data.occurrences > 1) {
        const multiplier = data.occurrences;
        result.base_price *= multiplier;
        result.total_price *= multiplier;
        result.tax_amount *= multiplier;
        if (result.discount_applied) {
          result.discount_applied *= multiplier;
        }
      }

      setEstimate(result);
      setRecurringBookingData(data);
      setBookingData(null);

      // Set preview data
      setRecurringPreviewData({
        startDate: data.start_date,
        pattern: data.pattern,
        occurrences: data.occurrences,
        endDate: data.end_date,
      });

      setStep("payment");
    } catch (error) {
      console.error(
        "Failed to get price estimate for recurring booking:",
        error,
      );
    }
  };

  const handlePayment = async () => {
    try {
      if (isRecurring && recurringBookingData) {
        const booking =
          await createRecurringBooking.mutateAsync(recurringBookingData);
        router.push(`/${locale}/bookings/confirm?booking_id=${booking.id}`);
      } else if (!isRecurring && bookingData) {
        const booking = await createBooking.mutateAsync(bookingData);
        router.push(`/${locale}/bookings/confirm?booking_id=${booking.id}`);
      }
    } catch (error) {
      console.error("Failed to process payment:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-100">
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {t("booking_confirm_title") || "Complete Your Booking"}
          </h1>
          <p className="text-gray-500">
            {space.name_en} • {space.branch?.name_en}
          </p>
        </div>

        {step === "form" ? (
          <>
            <div className="flex items-center space-x-3 mb-6 p-4 bg-muted/50 rounded-lg">
              <Switch
                id="recurring-mode"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
              />
              <Label
                htmlFor="recurring-mode"
                className="font-medium cursor-pointer"
              >
                {t("recurring_booking_enable", {
                  defaultMessage: "Make this a recurring booking",
                })}
              </Label>
            </div>

            {isRecurring ? (
              <RecurringBookingForm
                space={space}
                onSubmit={handleRecurringFormSubmit}
                isLoading={priceEstimate.isPending}
                initialStartDate={start_date}
              />
            ) : (
              <BookingForm
                space={space}
                onSubmit={handleFormSubmit}
                isLoading={priceEstimate.isPending}
                initialStartDate={start_date}
                initialEndDate={end_date}
              />
            )}
          </>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {isRecurring && recurringPreviewData && (
              <RecurringInstancesPreview
                startDate={recurringPreviewData.startDate}
                pattern={recurringPreviewData.pattern}
                occurrences={recurringPreviewData.occurrences}
                endDate={recurringPreviewData.endDate}
                locale={locale}
              />
            )}
            <PaymentForm
              onPay={handlePayment}
              isLoading={
                isRecurring
                  ? createRecurringBooking.isPending
                  : createBooking.isPending
              }
            />
            <button
              className="text-sm text-primary hover:underline font-medium"
              onClick={() => setStep("form")}
              disabled={
                isRecurring
                  ? createRecurringBooking.isPending
                  : createBooking.isPending
              }
            >
              {t("booking_back_to_details")}
            </button>
          </div>
        )}
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24">
          {estimate ? (
            <PriceBreakdown estimate={estimate} />
          ) : (
            <div className="bg-muted/50 rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] text-muted-foreground text-center border border-dashed">
              <p>{t("booking_price_estimate_hint")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
