"use client";
import { useState, useEffect, useRef } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
} from "motion/react";

import {
    Sparkles,
    ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useI18n } from "@/hooks/useI18n";
import { ProgramsList, Program } from "./ProgramsList";

// Floating Particle Component
const FloatingParticle = ({ delay = 0, duration = 20, size = 4 }) => {
    return (
        <motion.div
            className="absolute rounded-full bg-white/20 backdrop-blur-sm"
            style={{
                width: size,
                height: size,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
            }}
            animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 30 - 15, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
            }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    );
};

// Magnetic Button Component
const MagneticButton = ({ children, className, ...props }: any) => {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current!.getBoundingClientRect();
        const x = (clientX - (left + width / 2)) * 0.3;
        const y = (clientY - (top + height / 2)) * 0.3;
        setPosition({ x, y });
    };

    const reset = () => setPosition({ x: 0, y: 0 });

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={position}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

interface ProgramsPageProps {
    initialData?: {
        data: Program[];
        total: number;
    };
}

export default function ProgramsPage({ initialData }: ProgramsPageProps) {
    const { language: locale } = useI18n();
    const language = (typeof locale === 'string' ? locale : locale?.[0]) || 'ar';
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Default gradient for the page
    const pageGradient = "from-[#0D5BDC] to-[#4587F4]";

    return (
        <div className="min-h-screen bg-white overflow-hidden">
            {/* Animated Cursor Follower */}
            <motion.div
                className="fixed w-6 h-6 rounded-full border-2 border-[#0D5BDC] pointer-events-none z-50 hidden lg:block"
                animate={{
                    x: mousePosition.x - 12,
                    y: mousePosition.y - 12,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
            />

            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div
                        className={`absolute inset-0 bg-gradient-to-br ${pageGradient}`}
                    ></div>

                    {/* Floating Particles */}
                    {[...Array(20)].map((_, i) => (
                        <FloatingParticle
                            key={i}
                            delay={i * 0.5}
                            duration={15 + i * 2}
                            size={3 + Math.random() * 5}
                        />
                    ))}

                    {/* Animated Gradient Mesh */}
                    <motion.div
                        className="absolute top-0 ltr:left-0 rtl:right-0 w-full h-full opacity-30"
                        style={{
                            background: `radial-gradient(circle at ${mousePosition.x / 10}% ${mousePosition.y / 10
                                }%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
                        }}
                    />

                    {/* Grid Pattern Overlay */}
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
                            backgroundSize: "50px 50px",
                        }}
                    />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full glassmorphism mb-8 border border-white/20"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-5 h-5 text-white" />
                        </motion.div>
                        <span className="text-white">
                            {language === "ar" ? "برامجنا" : "Our Programs"}
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-8 leading-tight"
                    >
                        <motion.span
                            className="inline-block"
                            animate={{
                                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                            }}
                            transition={{ duration: 5, repeat: Infinity }}
                            style={{
                                backgroundImage: "linear-gradient(90deg, #fff, #a0d4ff, #fff)",
                                backgroundSize: "200% auto",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            {language === "ar" ? "اكتشف الفرص" : "Discover Opportunities"}
                        </motion.span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="text-white/90 text-lg sm:text-xl max-w-3xl mx-auto mb-12 leading-relaxed"
                    >
                        {language === "ar"
                            ? "استكشف مجموعة واسعة من البرامج المصممة لتسريع نمو أعمالك وتحقيق أهدافك"
                            : "Explore a wide range of programs designed to accelerate your business growth and achieve your goals"}
                    </motion.p>
                </div>
            </section>

            {/* Programs List Section */}
            <ProgramsList initialData={initialData} />
        </div>
    );
}
