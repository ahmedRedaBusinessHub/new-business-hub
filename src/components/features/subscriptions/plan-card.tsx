"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { SubscriptionPlanDetails } from "@/types/api/subscriptions";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Check, Star } from "lucide-react";
import { motion } from "motion/react";

interface PlanCardProps {
    planDetails: SubscriptionPlanDetails;
    onSubscribe: (plan: SubscriptionPlanDetails) => void;
    isLoading?: boolean;
    isCurrent?: boolean;
}

export function PlanCard({ planDetails, onSubscribe, isLoading = false, isCurrent = false }: PlanCardProps) {
    const t = useTranslations();
    const locale = useLocale();

    const name = locale === "ar" ? planDetails.name_ar : planDetails.name_en;
    const description = locale === "ar" ? planDetails.description_ar : planDetails.description_en;

    return (
        <Card className={`relative h-full flex flex-col transition-all duration-300 hover:shadow-xl ${isCurrent ? "border-primary border-2 shadow-primary/20 shadow-lg" : ""}`}>
            {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 z-10 shadow-sm">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{t("subscriptions_current_plan", { defaultMessage: "Current Plan" })}</span>
                </div>
            )}

            <CardHeader className="text-center pb-4 pt-6">
                <CardTitle className="text-2xl font-bold">{name}</CardTitle>
                <CardDescription className="min-h-[40px] mt-2">{description}</CardDescription>

                <div className="mt-6 mb-2">
                    <span className="text-4xl font-extrabold">{planDetails.monthlyPrice}</span>
                    <span className="text-muted-foreground ml-1">
                        {t("subscription_price_unit")}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="flex-grow">
                <div className="space-y-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        {t("subscriptions_plan_benefits", { defaultMessage: "Benefits included" })}
                    </h4>

                    <ul className="space-y-3">
                        {planDetails.features.map((feature, idx) => (
                            <li key={idx} className="flex flex-start gap-3">
                                <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                                    <Check className="w-3 h-3 text-primary font-bold" />
                                </div>
                                <span className="text-sm leading-tight text-card-foreground/80">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>

            <CardFooter className="pt-6 pb-6">
                <Button
                    className="w-full h-12 rounded-xl text-md font-medium"
                    variant={isCurrent ? "outline" : "default"}
                    disabled={isCurrent || isLoading}
                    onClick={() => onSubscribe(planDetails)}
                >
                    {isCurrent ? t("subscriptions_current_plan", { defaultMessage: "Current Plan" }) : t("subscriptions_subscribe_cta", { defaultMessage: "Subscribe Now" })}
                </Button>
            </CardFooter>
        </Card>
    );
}
