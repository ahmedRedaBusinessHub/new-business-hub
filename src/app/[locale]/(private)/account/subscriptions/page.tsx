"use client";

import { useTranslations } from "next-intl";
import { useUserSubscriptions, usePlans, useCancelSubscription } from "@/lib/hooks/use-subscriptions";
import { SubscriptionStatus } from "@/components/features/subscriptions/subscription-status";
import { CancelSubscriptionDialog } from "@/components/features/subscriptions/cancel-subscription-dialog";
import { Loader2, Plus, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useState } from "react";
import { useLocale } from "next-intl";
import { PLAN_TYPE_MAP } from "@/lib/api/subscriptions";

export default function AccountSubscriptionsPage() {
    const t = useTranslations();
    const locale = useLocale();

    const { data: userSubsData, isLoading: isLoadingSubs, isError: isErrorSubs }: any = useUserSubscriptions();
    const { data: plansData, isLoading: isLoadingPlans }: any = usePlans();
    const { mutate: cancelSubscription, isPending: isCancelling } = useCancelSubscription();

    const [subscriptionToCancel, setSubscriptionToCancel] = useState<number | null>(null);

    if (isLoadingSubs || isLoadingPlans) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (isErrorSubs) {
        return (
            <div className="text-center py-20 min-h-[50vh]">
                <h3 className="text-2xl font-bold text-destructive mb-4">{t("error_loading_data", { defaultMessage: "Failed to load subscriptions" })}</h3>
            </div>
        );
    }

    const subscriptions = userSubsData?.data?.data || [];
    console.log("🚀 ~ AccountSubscriptionsPage ~ subscriptions:", subscriptions)
    const plans = plansData?.data?.data || [];
    console.log("🚀 ~ AccountSubscriptionsPage ~ plans:", plans)

    const activeSubscriptions = subscriptions.filter((sub: any) => sub.status == '1');
    const pastSubscriptions = subscriptions.filter((sub: any) => sub.status != '1');

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-bold">{t("subscriptions_my_subscriptions", { defaultMessage: "My Subscriptions" })}</h1>
                <Link href={`/${locale}/subscriptions`}>
                    <Button className="rounded-full gap-2">
                        <Plus className="w-4 h-4" />
                        {t("subscriptions_select_plan", { defaultMessage: "Browse Plans" })}
                    </Button>
                </Link>
            </div>

            <div className="space-y-12">
                {/* Active Subscriptions */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">{t("subscriptions_status_active", { defaultMessage: "Active" })}</h2>

                    {activeSubscriptions.length > 0 ? (
                        <div className="space-y-6">
                            {activeSubscriptions.map((sub: any) => {
                                const planDetails = plans.find((p: any) => PLAN_TYPE_MAP[p.plan] == sub.plan_type);
                                return (
                                    <div key={sub.id} className="relative">
                                        <SubscriptionStatus subscription={sub} planDetails={planDetails} />

                                        <div className="flex justify-end -mt-4">
                                            <Button
                                                variant="destructive"
                                                onClick={() => setSubscriptionToCancel(sub.id)}
                                            >
                                                {t("common_cancel", { defaultMessage: "Cancel Subscription" })}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed">
                            <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium">{t("subscriptions_no_subscriptions", { defaultMessage: "You don't have any active subscriptions." })}</h3>
                            <Link href={`/${locale}/subscriptions`}>
                                <Button variant="outline" className="mt-4 rounded-full">
                                    {t("subscriptions_select_plan", { defaultMessage: "Explore Plans" })}
                                </Button>
                            </Link>
                        </div>
                    )}
                </section>

                {/* Past Subscriptions */}
                {pastSubscriptions.length > 0 && (
                    <section>
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-muted-foreground">{t("past_subscriptions", { defaultMessage: "Past Subscriptions" })}</h2>

                        <div className="space-y-6 opacity-75 grayscale-[30%]">
                            {pastSubscriptions.map((sub: any) => {
                                const planDetails = plans.find((p: any) => p.plan === sub.plan);
                                return (
                                    <SubscriptionStatus key={sub.id} subscription={sub} planDetails={planDetails} />
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>

            <CancelSubscriptionDialog
                isOpen={subscriptionToCancel !== null}
                onClose={() => setSubscriptionToCancel(null)}
                isLoading={isCancelling}
                onConfirm={() => {
                    if (subscriptionToCancel !== null) {
                        cancelSubscription(subscriptionToCancel, {
                            onSuccess: () => setSubscriptionToCancel(null)
                        });
                    }
                }}
            />
        </div>
    );
}
