"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePlans, useUserSubscriptions, useCreateSubscription } from "@/lib/hooks/use-subscriptions";
import { PlanCard } from "@/components/features/subscriptions/plan-card";
import { SubscriptionPlanDetails, SubscriptionPlan } from "@/types/api/subscriptions";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Sparkles, Check } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SubscriptionsPage() {
    const t = useTranslations();
    const locale = useLocale();
    const { user } = useUser();
    const router = useRouter();

    const { data: plansData, isLoading: isLoadingPlans, isError: isErrorPlans }: any = usePlans();
    const { data: userSubsData, isLoading: isLoadingUserSubs }: any = useUserSubscriptions();
    const { mutate: createSubscription, isPending: isCreating } = useCreateSubscription();

    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanDetails | null>(null);

    const plans = plansData?.data?.data || [];
    const userSubscriptions = userSubsData?.data?.data || [];
    const activeSubscription = userSubscriptions.find((sub: any) => sub.status === 'active');

    const handleSubscribe = (planDetails: SubscriptionPlanDetails) => {
        if (!user) {
            router.push('/login');
            return;
        }

        setSelectedPlan(planDetails);
        createSubscription({ plan: planDetails.plan, monthlyPrice: planDetails.monthlyPrice }, {
            onSuccess: (res) => {
                if (res.data.paymentUrl) {
                    window.location.href = res.data.paymentUrl;
                } else {
                    router.push(`/${locale}/account/subscriptions`);
                }
            },
            onSettled: () => setSelectedPlan(null)
        });
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--theme-bg-primary)" }}>
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div
                        className="absolute inset-0 opacity-40"
                        style={{
                            backgroundImage: `radial-gradient(circle at 20% 30%, var(--theme-primary) 0%, transparent 50%),
                                             radial-gradient(circle at 80% 70%, var(--theme-accent) 0%, transparent 50%)`,
                        }}
                    />
                </div>

                <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 glassmorphism"
                    >
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-foreground">
                            {t("subscriptions_title", { defaultMessage: "Memberships" })}
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-5xl leading-tight md:text-6xl lg:text-7xl mb-6 bg-clip-text text-transparent font-bold"
                        style={{ backgroundImage: `linear-gradient(to right, var(--theme-text-primary), var(--theme-primary))` }}
                    >
                        {t("subscriptions_plans_title", { defaultMessage: "Subscription Plans" })}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl sm:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed text-muted-foreground"
                    >
                        {t("subscriptions_hero_subtitle", { defaultMessage: "Choose the perfect membership plan for your working style." })}
                    </motion.p>
                </div>
            </section>

            {/* Plans Section */}
            <section className="py-12 relative z-10">
                <div className="container mx-auto px-4">
                    {isLoadingPlans ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        </div>
                    ) : isErrorPlans ? (
                        <div className="text-center py-20">
                            <h3 className="text-2xl font-bold text-destructive mb-4">{t("error_loading_data", { defaultMessage: "Error loading plans" })}</h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            <AnimatePresence>
                                {plans.map((plan, idx) => (
                                    <motion.div
                                        key={plan.plan}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="h-full"
                                    >
                                        <PlanCard
                                            planDetails={plan}
                                            onSubscribe={handleSubscribe}
                                            isCurrent={activeSubscription?.plan === plan.plan}
                                            isLoading={isCreating && selectedPlan?.plan === plan.plan}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
