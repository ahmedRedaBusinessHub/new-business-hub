"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { BookingForm } from "./booking-form";
import { PriceBreakdown } from "./price-breakdown";
import { Booking, CreateBookingData } from "@/types/api/bookings";
import { getPriceEstimate, PriceEstimateResponse } from "@/lib/api/bookings";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { ArrowRight, Loader2, Calendar, Package, CheckCircle2, XCircle } from "lucide-react";

interface ModifyBookingDialogProps {
    booking: Booking;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: Partial<CreateBookingData>) => void;
    isLoading?: boolean;
}

export function ModifyBookingDialog({ booking, isOpen, onClose, onConfirm, isLoading }: ModifyBookingDialogProps) {
    const t = useTranslations();
    const locale = useLocale() as 'ar' | 'en' | 'ar-SA' | 'en-US';
    const currencyLocale = locale.startsWith('ar') ? 'ar-SA' : 'en-US';

    const [pendingData, setPendingData] = useState<Partial<CreateBookingData> | null>(null);
    const [priceEstimate, setPriceEstimate] = useState<PriceEstimateResponse | null>(null);
    const [isEstimating, setIsEstimating] = useState(false);

    const currentTotal = booking.final_amount ?? booking.total_cost ?? 0;

    if (!booking.coworking_space) return null;

    const handleFormSubmit = async (data: CreateBookingData) => {
        setIsEstimating(true);
        try {
            const estimate = await getPriceEstimate(data);
            setPendingData(data);
            setPriceEstimate(estimate);
        } catch {
            // Estimate failed — skip the preview step and confirm directly
            onConfirm(data);
        } finally {
            setIsEstimating(false);
        }
    };

    const handleConfirmWithPreview = () => {
        if (pendingData) {
            onConfirm(pendingData);
            setPendingData(null);
            setPriceEstimate(null);
        }
    };

    const handleBack = () => {
        setPendingData(null);
        setPriceEstimate(null);
    };

    const handleClose = () => {
        setPendingData(null);
        setPriceEstimate(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{t("booking_modify_title", { defaultMessage: "Modify Booking" })}</DialogTitle>
                    <DialogDescription>
                        {t("booking_modify_description", { defaultMessage: "Update your booking details and review changes before confirming." })}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto">
                    {priceEstimate && pendingData ? (
                        <div className="py-4 space-y-6">
                        {/* Date/Time Changes */}
                        <div className="p-4 border rounded-xl bg-muted/30 space-y-3">
                            <h4 className="font-semibold text-sm flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {t("booking_schedule_changes", { defaultMessage: "Schedule Changes" })}
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">{t("booking_price_current_total")}</p>
                                    <p className="text-xs">{formatDateTime(booking.start_datetime || booking.start_date || "", locale)}</p>
                                    <p className="text-xs text-muted-foreground">{t("to")} {formatDateTime(booking.end_datetime || booking.end_date || "", locale)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">{t("booking_price_new_total")}</p>
                                    <p className="text-xs">{formatDateTime(pendingData.start_date || "", locale)}</p>
                                    <p className="text-xs text-muted-foreground">{t("to")} {formatDateTime(pendingData.end_date || "", locale)}</p>
                                </div>
                            </div>
                            {pendingData.attendees && pendingData.attendees !== booking.attendees && (
                                <div className="pt-2 border-t text-xs flex items-center gap-2">
                                    <span className="text-muted-foreground">{t("space_capacity_label", { capacity: "" }).trim()}:</span>
                                    <span className="line-through opacity-60">{booking.attendees}</span>
                                    <ArrowRight className="w-3 h-3" />
                                    <span className="font-medium">{pendingData.attendees}</span>
                                </div>
                            )}
                        </div>

                        {/* Services Changes */}
                        {((booking.additional_services && booking.additional_services.length > 0) ||
                            (pendingData.additional_service_ids && pendingData.additional_service_ids.length > 0)) && (
                                <div className="p-4 border rounded-xl bg-muted/30 space-y-3">
                                    <h4 className="font-semibold text-sm flex items-center gap-2">
                                        <Package className="w-4 h-4" />
                                        {t("services_title", { defaultMessage: "Services" })}
                                    </h4>
                                    <div className="space-y-2 text-xs">
                                        {/* Current services */}
                                        {booking.additional_services && booking.additional_services.length > 0 && (
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">{t("booking_price_current_total")}:</p>
                                                {booking.additional_services.map((service, idx) => {
                                                    const isRemoved = !pendingData.additional_service_ids?.includes(service.service_id);
                                                    return (
                                                        <div key={idx} className="flex items-center gap-2 py-1">
                                                            {isRemoved ? (
                                                                <XCircle className="w-3 h-3 text-destructive shrink-0" />
                                                            ) : (
                                                                <CheckCircle2 className="w-3 h-3 text-success shrink-0" />
                                                            )}
                                                            <span className={isRemoved ? "line-through opacity-60" : ""}>
                                                                {locale.startsWith('ar') ? service.service_name_ar : service.service_name_en}
                                                            </span>
                                                            <span className="text-muted-foreground ml-auto">
                                                                {formatCurrency(service.total_price, currencyLocale)}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* New services */}
                                        {priceEstimate.breakdown.services && priceEstimate.breakdown.services.length > 0 && (
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1 mt-3">{t("booking_price_new_total")}:</p>
                                                {priceEstimate.breakdown.services.map((service, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 py-1">
                                                        <CheckCircle2 className="w-3 h-3 text-success shrink-0" />
                                                        <span>{service.name}</span>
                                                        <span className="text-muted-foreground ml-auto">
                                                            {formatCurrency(service.price, currencyLocale)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* Price Breakdown */}
                        <PriceBreakdown estimate={priceEstimate} />

                        {/* Total Price Comparison */}
                        <div className="p-4 border rounded-xl bg-primary/5 space-y-4">
                            <h4 className="font-semibold text-sm">{t("booking_price_adjustment_label", { defaultMessage: "Price Adjustment" })}</h4>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="flex-1 text-center">
                                    <p className="text-xs text-muted-foreground mb-1">{t("booking_price_current_total")}</p>
                                    <p className="text-lg font-bold">{formatCurrency(currentTotal, currencyLocale)}</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0" />
                                <div className="flex-1 text-center">
                                    <p className="text-xs text-muted-foreground mb-1">{t("booking_price_new_total")}</p>
                                    <p className={`text-lg font-bold ${priceEstimate.total_price > currentTotal ? 'text-destructive' : priceEstimate.total_price < currentTotal ? 'text-success' : ''}`}>
                                        {formatCurrency(priceEstimate.total_price, currencyLocale)}
                                    </p>
                                </div>
                            </div>
                            {priceEstimate.total_price !== currentTotal && (
                                <p className={`text-xs text-center font-medium ${priceEstimate.total_price > currentTotal ? 'text-destructive' : 'text-success'}`}>
                                    {priceEstimate.total_price > currentTotal ? '+' : ''}
                                    {formatCurrency(priceEstimate.total_price - currentTotal, currencyLocale)}
                                </p>
                            )}
                        </div>

                            <DialogFooter className="gap-3 sm:gap-0">
                                <Button variant="ghost" onClick={handleBack} disabled={isLoading}>
                                    {t("common_back", { defaultMessage: "Back" })}
                                </Button>
                                <Button onClick={handleConfirmWithPreview} disabled={isLoading}>
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            {t("common_saving", { defaultMessage: "Saving..." })}
                                        </span>
                                    ) : t("common_save", { defaultMessage: "Save" })}
                                </Button>
                            </DialogFooter>
                        </div>
                    ) : (
                        <div className="py-4">
                            {isEstimating ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                </div>
                            ) : (
                                <BookingForm
                                    space={booking.coworking_space}
                                    onSubmit={handleFormSubmit}
                                    isLoading={isEstimating}
                                    initialStartDate={booking.start_date}
                                    initialEndDate={booking.end_date}
                                    initialAttendees={booking.attendees}
                                    initialServiceIds={booking.additional_services?.map(s => s.service_id)}
                                    submitLabel={t("common_save")}
                                />
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
