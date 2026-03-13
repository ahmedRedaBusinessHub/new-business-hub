"use client";

import { useTranslations, useLocale } from "next-intl";
import { RecurringBooking, BookingStatus, RecurrencePattern } from "@/types/api/bookings";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { formatCurrency, formatDateTime, formatDate } from "@/lib/utils";
import { Calendar, Users, MapPin, CreditCard, Info, AlertTriangle, Repeat, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCancelBookingInstance } from "@/lib/hooks/use-bookings";

interface RecurringBookingDetailsProps {
    booking: RecurringBooking;
    onCancelSeries?: () => void;
    canCancel?: boolean;
}

export function RecurringBookingDetails({
    booking,
    onCancelSeries,
    canCancel = false,
}: RecurringBookingDetailsProps) {
    const t = useTranslations();
    const locale = useLocale() as 'ar-SA' | 'en-US' | 'ar' | 'en';
    const currencyLocale = locale.startsWith('ar') ? 'ar-SA' : 'en-US';
    const dateLocale = locale.startsWith('ar') ? 'ar-SA' : 'en-US';

    const cancelInstanceMutation = useCancelBookingInstance();

    const spaceName = locale.startsWith('ar') ? booking.space?.name_ar : booking.space?.name_en;
    const branchName = locale.startsWith('ar') ? booking.space?.branch?.name_ar : booking.space?.branch?.name_en;
    const branchAddress = locale.startsWith('ar') ? booking.space?.branch?.address_ar : booking.space?.branch?.address_en;

    const getStatusVariant = (status: 'active' | 'completed' | 'cancelled') => {
        switch (status) {
            case 'active': return "success";
            case 'cancelled': return "destructive";
            case 'completed': return "secondary";
            default: return "outline";
        }
    };

    const getStatusLabel = (status: 'active' | 'completed' | 'cancelled') => {
        switch (status) {
            case 'active': return t("booking_status_confirmed");
            case 'cancelled': return t("booking_status_cancelled");
            case 'completed': return t("booking_status_completed");
            default: return status;
        }
    };

    const getInstanceStatusLabel = (status: BookingStatus | string) => {
        switch (status) {
            case BookingStatus.CONFIRMED: return t("booking_status_confirmed");
            case BookingStatus.PENDING: return t("booking_status_pending");
            case BookingStatus.CANCELLED: return t("booking_status_cancelled");
            case BookingStatus.COMPLETED: return t("booking_status_completed");
            default: return status;
        }
    };

    const getPatternLabel = (pattern: RecurrencePattern) => {
        switch (pattern) {
            case RecurrencePattern.DAILY: return t("recurring_booking_daily");
            case RecurrencePattern.WEEKLY: return t("recurring_booking_weekly");
            case RecurrencePattern.MONTHLY: return t("recurring_booking_monthly");
            default: return pattern;
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Repeat className="w-5 h-5 text-primary" />
                        {t("recurring_booking_title")}
                    </CardTitle>
                    <Badge variant={getStatusVariant(booking.status) as any} className="px-3 py-1">
                        {getStatusLabel(booking.status)}
                    </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-base">{spaceName || t("workspaces_hero_title")}</h4>
                                    <p className="text-sm text-muted-foreground">{branchName}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{branchAddress}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{t("booking_form_start_time")}: {formatDateTime(booking.start_date, dateLocale)}</p>
                                    {booking.end_date && (
                                        <p className="text-sm text-muted-foreground">{t("recurring_booking_end_date")}: {formatDate(booking.end_date, dateLocale)}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <Repeat className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{t("recurring_booking_pattern_label")}: {getPatternLabel(booking.pattern)}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                        {booking.occurrences ? `${t("recurring_booking_occurrences")}: ${booking.occurrences}` : ''}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{booking.attendees} {booking.attendees === 1 ? t("booking_person_label") : t("booking_people_label")}</p>
                                    <p className="text-xs text-muted-foreground">{t("max_capacity_label", { capacity: booking.space?.capacity || 'N/A' })}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="pt-6 border-t">
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            {t("booking_summary_title")}
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between pt-2 border-t font-bold text-base">
                                <span>{t("booking_price_total")}</span>
                                <span>{formatCurrency(booking.total_cost || 0, currencyLocale)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Instances Section */}
                    {booking.instances && booking.instances.length > 0 && (
                        <div className="pt-6 border-t">
                            <h4 className="font-semibold mb-3">{t("recurring_booking_summary")}</h4>
                            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                                {booking.instances.map((instance) => {
                                    const isCancellable = instance.status === BookingStatus.CONFIRMED || instance.status === BookingStatus.PENDING;
                                    return (
                                        <div key={instance.id} className="flex justify-between items-center p-3 bg-muted/30 rounded border text-sm">
                                            <span className="font-medium">{formatDate(instance.instance_date, dateLocale)}</span>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant={instance.status === BookingStatus.CANCELLED ? "destructive" : instance.status === BookingStatus.COMPLETED ? "secondary" : "outline"}
                                                    className="text-xs"
                                                >
                                                    {getInstanceStatusLabel(instance.status)}
                                                </Badge>
                                                {canCancel && isCancellable && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                                        disabled={cancelInstanceMutation.isPending}
                                                        onClick={() => cancelInstanceMutation.mutate({
                                                            recurringId: booking.id,
                                                            instanceId: instance.id,
                                                        })}
                                                        title={t("recurring_booking_cancel_instance")}
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </CardContent>

                {/* Actions Footer */}
                {canCancel && booking.status === 'active' && (
                    <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t justify-end bg-muted/10">
                        <Button variant="destructive" onClick={onCancelSeries} className="w-full sm:w-auto">
                            {t("recurring_booking_manage_series")}
                        </Button>
                    </CardFooter>
                )}
            </Card>

            {/* Policy Info Card */}
            <Card className="border-warning/20 bg-warning/5 overflow-hidden">
                <CardHeader className="py-3 bg-warning/10 border-b border-warning/10">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-warning-700">
                        <Info className="w-4 h-4" />
                        {t("booking_cancel_policy_title")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-4 text-xs space-y-2 text-muted-foreground italic">
                    <p>• {t("booking_cancel_policy_full_refund")}</p>
                    <p>• {t("booking_cancel_policy_partial_refund")}</p>
                    <p>• {t("booking_cancel_policy_no_refund")}</p>
                </CardContent>
            </Card>

            {booking.status === 'cancelled' && (
                <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <p className="font-bold">{t("booking_status_cancelled")}</p>
                </div>
            )}
        </div>
    );
}
