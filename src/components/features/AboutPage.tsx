"use client";
import AboutSection from "@/components/features/AboutSection";
import MissionSection from "@/components/features/MissionSection";
import ValuesSection from "@/components/features/ValuesSection";
import CEOSection from "@/components/features/CEOSection";
import StatsSection from "@/components/features/StatsSection";
import PartnersSection from "@/components/features/PartnersSection";
import { motion } from "motion/react";

export default function AboutPage() {
  return (
    <div className="min-h-screen  relative ">
      <AboutSection />
      <motion.div
        className="absolute top-0 ltr:right-0 rtl:left-0 w-full h-[500px] rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: "var(--theme-primary)" }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <MissionSection />
      <ValuesSection />
      <StatsSection />
      <CEOSection />
      <PartnersSection />
    </div>
  );
}
