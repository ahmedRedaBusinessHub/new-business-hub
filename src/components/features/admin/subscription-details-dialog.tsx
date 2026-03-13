"use client";

import { useTranslations, useLocale } from "next-intl";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import { User, Mail, Phone, CalendarIcon, Clock, DollarSign, Shield } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { AdminSubscription } from "@/types/api/subscriptions";

interface SubscriptionDetailsDialogProps {
    subscription: AdminSubscription | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SubscriptionDetailsDialog({
    subscription,
    open,
    onOpenChange,
}: SubscriptionDetailsDialogProps) {
    const t = useTranslations();
    const locale = useLocale();
    const dateLocale = locale === "ar" ? "ar-SA" : "en-US";

    if (!subscription) return null;

    const statusVariant = (
        subscription.status === "active"
            ? "default"
            : subscription.status === "cancelled"
            ? "secondary"
            : "destructive"
    ) as "default" | "secondary" | "destructive";

    const hasBenefits =
        subscription.benefits &&
        Object.values(subscription.benefits).some(Boolean);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        {t("admin_subscription_details_title")}
                    </DialogTitle>
                    <DialogDescription>
                        {t("admin_subscription_details_desc")}
                    </DialogDescription>
                </DialogHeader>

                {/* Plan + Status */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                        {t("admin_subscription_plan_label")}:{" "}
                        <span className="text-foreground font-semibold">
                            {t(`subscription_plan_${subscription.plan}`, {
                                defaultMessage: subscription.plan,
                            })}
                        </span>
                    </span>
                    <Badge variant={statusVariant}>
                        {t(`subscriptions_status_${subscription.status}`, {
                            defaultMessage: subscription.status,
                        })}
                    </Badge>
                </div>

                <Separator />

                {/* Client Info */}
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold">
                        {t("admin_subscription_user_section")}
                    </h4>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground shrink-0" />
                            <span>{subscription.user.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                            <span>{subscription.user.email}</span>
                        </div>
                        {subscription.user.phone && (
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                                <span>{subscription.user.phone}</span>
                            </div>
                        )}
                    </div>
                </div>

                <Separator />

                {/* Dates + Price + Auto-renew */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                        <CalendarIcon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs text-muted-foreground">
                                {t("admin_subscription_start_date")}
                            </p>
                            <p className="font-medium">
                                {formatDate(subscription.startDate, dateLocale)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs text-muted-foreground">
                                {t("admin_subscription_renewal_date")}
                            </p>
                            <p className="font-medium">
                                {formatDate(subscription.renewalDate, dateLocale)}
                            </p>
                        </div>
                    </div>

                    {subscription.endDate && (
                        <div className="flex items-start gap-2 col-span-2">
                            <CalendarIcon className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    {t("admin_subscription_end_date")}
                                </p>
                                <p className="font-medium text-destructive">
                                    {formatDate(subscription.endDate, dateLocale)}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs text-muted-foreground">
                                {t("admin_subscription_monthly_price")}
                            </p>
                            <p className="font-medium">
                                {formatCurrency(subscription.monthlyPrice, dateLocale)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs text-muted-foreground">
                                {t("subscription_auto_renew_label")}
                            </p>
                            <p className="font-medium">
                                {subscription.autoRenew
                                    ? t("common_yes")
                                    : t("common_no")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Benefits */}
                {hasBenefits && (
                    <>
                        <Separator />
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold">
                                {t("subscriptions_plan_benefits")}
                            </h4>
                            <ul className="space-y-1.5 text-sm text-muted-foreground">
                                {subscription.benefits.freeMeetingRoomHours && (
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                                        {subscription.benefits.freeMeetingRoomHours}{" "}
                                        {t("free_hours_month")}
                                    </li>
                                )}
                                {subscription.benefits.discountPercentage && (
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                        {subscription.benefits.discountPercentage}%{" "}
                                        {t("booking_discount")}
                                    </li>
                                )}
                                {subscription.benefits.priorityBooking && (
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                                        {t("priority_booking")}
                                    </li>
                                )}
                            </ul>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
