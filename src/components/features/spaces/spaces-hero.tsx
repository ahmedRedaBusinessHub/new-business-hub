"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

interface ParticleProps {
    id: number;
    delay: number;
    duration: number;
    size: number;
    initialX: number;
    initialY: number;
    animX: number;
}

const FloatingParticle = ({ particle }: { particle: ParticleProps }) => {
    return (
        <motion.div
            className="absolute rounded-full bg-white/20 backdrop-blur-sm"
            style={{
                width: particle.size,
                height: particle.size,
                left: `${particle.initialX}%`,
                top: `${particle.initialY}%`,
            }}
            animate={{
                y: [0, -30, 0],
                x: [0, particle.animX, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
            }}
            transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    );
};

export function SpacesHero() {
    const t = useTranslations();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [particles, setParticles] = useState<ParticleProps[]>([]);

    useEffect(() => {
        // Generate particles on client to avoid hydration mismatch and keep render pure
        const clientParticles = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            delay: i * 0.5,
            duration: 15 + i * 2,
            size: 3 + Math.random() * 5,
            initialX: Math.random() * 100,
            initialY: Math.random() * 100,
            animX: Math.random() * 30 - 15,
        }));
        setParticles(clientParticles);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const pageGradient = "from-[#0D5BDC] to-[#4587F4]";

    return (
        <section className="relative min-h-[75vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden  mb-12  shadow-2xl shadow-primary/10 border border-border/10" >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-slate-950" style={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                <div className={`absolute inset-0 bg-gradient-to-br from-primary/30 via-blue-900/30 to-slate-950 mix-blend-screen`}></div>

                {/* Dynamic glowing orbs */}
                <motion.div
                    className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/30 rounded-full blur-[120px]"
                    animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px]"
                    animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Floating Particles */}
                {particles.map((particle) => (
                    <FloatingParticle key={particle.id} particle={particle} />
                ))}

                {/* Animated Gradient Mesh guided by mouse pointer */}
                <motion.div
                    className="absolute inset-0 z-0 opacity-40 mix-blend-overlay pointer-events-none transition-transform duration-300 ease-out"
                    style={{
                        background: `radial-gradient(circle 800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.2), transparent 60%)`,
                    }}
                />

                {/* Micro-dot overlay */}
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: `radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)`,
                        backgroundSize: "32px 32px",
                    }}
                />
            </div>

            <div className="container    px-6 relative z-10 text-center flex flex-col items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
                    className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/5 backdrop-blur-md mb-8 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] cursor-default"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="p-1 bg-primary/20 rounded-full"
                    >
                        <Sparkles className="w-4 h-4 text-white" />
                    </motion.div>
                    <span className="text-white/90 text-sm md:text-base font-medium tracking-wide">
                        {t("workspaces_hero_subtitle", { defaultMessage: "Find the perfect environment for your work" })}
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.3 }}
                    className="text-white text-5xl sm:text-6xl md:text-7xl mb-6 leading-tight font-extrabold tracking-tight"
                >
                    <motion.span
                        className="inline-block"
                        animate={{
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        style={{
                            backgroundImage: "linear-gradient(90deg, #fff, #93C5FD, #EFF6FF, #fff)",
                            backgroundSize: "200% auto",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            textShadow: "0 0 40px rgba(255,255,255,0.2)"
                        }}
                    >
                        {t("workspaces_hero_title", { defaultMessage: "Coworking Spaces" })}
                    </motion.span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-white/80 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light"
                >
                    {t("workspaces_hero_description", {
                        defaultMessage: "Discover our premium coworking spaces designed to foster innovation, collaboration, and productivity.",
                    })}
                </motion.p>
            </div>
        </section>
    );
}
