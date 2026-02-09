"use client";

import MyProgramsList from "@/components/features/MyProgramsList";
import { useI18n } from "@/hooks/useI18n";
import { motion } from "motion/react";
import {
    Rocket,
    Target,
    BookOpen,
    Trophy,
    Sparkles,
    GraduationCap,
    TrendingUp
} from "lucide-react";

export default function MyProgramsPage() {
    const { t } = useI18n();

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--theme-bg-primary)" }}>
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div
                        className="absolute inset-0 opacity-40"
                        style={{
                            backgroundImage: `radial-gradient(circle at 20% 30%, var(--theme-primary) 0%, transparent 50%),
                                             radial-gradient(circle at 80% 70%, var(--theme-accent) 0%, transparent 50%)`,
                        }}
                    />
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `
                                linear-gradient(var(--theme-text-primary) 1px, transparent 1px),
                                linear-gradient(90deg, var(--theme-text-primary) 1px, transparent 1px)
                            `,
                            backgroundSize: "50px 50px",
                        }}
                    />
                </div>

                {/* Floating Animated Elements */}
                <motion.div
                    className="absolute top-20 ltr:left-[10%] rtl:right-[10%] w-64 h-64 rounded-full opacity-20 blur-[80px]"
                    style={{ backgroundColor: "var(--theme-primary)" }}
                    animate={{
                        y: [0, 30, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-20 ltr:right-[10%] rtl:left-[10%] w-96 h-96 rounded-full opacity-20 blur-[100px]"
                    style={{ backgroundColor: "var(--theme-accent)" }}
                    animate={{
                        y: [0, -40, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                <div className="container mx-auto px-4 sm:px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 glassmorphism"
                        >
                            <Sparkles
                                className="w-4 h-4"
                                style={{ color: "var(--theme-accent)" }}
                            />
                            <span style={{ color: "var(--theme-text-primary)" }}>
                                {t("my_programs_hero_badge") || "Your Learning Journey"}
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl sm:text-5xl leading-tight md:text-6xl lg:text-7xl mb-6 bg-clip-text text-transparent font-bold"
                            style={{
                                backgroundImage: `linear-gradient(to right, var(--theme-text-primary), var(--theme-primary))`,
                            }}
                        >
                            {t("my_programs_hero_title") || "My Programs"}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl sm:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed"
                            style={{ color: "var(--theme-text-secondary)" }}
                        >
                            {t("my_programs_hero_desc") || "Manage your enrolled programs, track your progress, and access your exclusive resources all in one place."}
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-12 sm:py-16 relative">
                <div className="container mx-auto px-4 sm:px-6 relative z-10">
                    <MyProgramsList />
                </div>
            </section>
        </div>
    );
}
