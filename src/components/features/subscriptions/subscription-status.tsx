"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Subscription, SubscriptionPlanDetails } from "@/types/api/subscriptions";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/utils";
import { Shield, Clock, CalendarIcon, AlertCircle } from "lucide-react";

interface SubscriptionStatusProps {
    subscription: Subscription;
    planDetails?: SubscriptionPlanDetails;
}

export function SubscriptionStatus({ subscription, planDetails }: SubscriptionStatusProps) {
    console.log("🚀 ~ SubscriptionStatus ~ subscription, planDetails:", subscription, planDetails)
    const t = useTranslations();
    const locale = useLocale();

    const planName = planDetails
        ? (locale === "ar" ? planDetails.name_ar : planDetails.name_en)
        : t(`subscription_plan_${subscription.plan}`, { defaultMessage: subscription.plan });

    return (
        <Card className="mb-6 relative overflow-hidden border-2">
            <div className="absolute top-0 right-0 p-4 rtl:auto rtl:left-0 opacity-10">
                <Shield className="w-32 h-32" />
            </div>

            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            {planName}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            {t("subscriptions_my_subscriptions", { defaultMessage: "Your Active Membership" })}
                        </p>
                    </div>

                    <Badge variant={subscription.status == '1' ? 'default' : subscription.status == '0' ? 'secondary' : 'destructive'} className="uppercase">
                        {t(`subscriptions_status_${subscription.status}`, { defaultMessage: subscription.status })}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <CalendarIcon className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("start_date", { defaultMessage: "Started On" })}</p>
                            <p className="font-semibold">{formatDateTime(subscription.start_date, locale === "ar" ? "ar-SA" : "en-US")}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Clock className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("subscriptions_renewal_date", { date: "", defaultMessage: "Renews On" })}</p>
                            <p className="font-semibold">{formatDateTime(subscription.end_date, locale === "ar" ? "ar-SA" : "en-US")}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-accent/10 rounded-lg text-accent">
                            <AlertCircle className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("subscription_auto_renew_label")}</p>
                            <p className="font-semibold">{subscription.autoRenew ? t("yes", { defaultMessage: "Yes" }) : t("no", { defaultMessage: "No" })}</p>
                        </div>
                    </div>
                </div>

                {subscription.benefits && Object.keys(subscription.benefits).length > 0 && (
                    <div className="mt-6 pt-4 border-t">
                        <h4 className="text-sm font-semibold mb-3">{t("subscriptions_plan_benefits", { defaultMessage: "Your Benefits" })}</h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {subscription.benefits.freeMeetingRoomHours && (
                                <li className="text-sm flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500" />
                                    {subscription.benefits.freeMeetingRoomHours} {t("free_hours_month")}
                                </li>
                            )}
                            {subscription.benefits.discountPercentage && (
                                <li className="text-sm flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                                    {subscription.benefits.discountPercentage}% {t("booking_discount")}
                                </li>
                            )}
                            {subscription.benefits.priorityBooking && (
                                <li className="text-sm flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                                    {t("priority_booking")}
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
