"use client";
import { motion } from "motion/react";
import {
  Home,
  Lightbulb,
  Users,
  TrendingUp,
  BookOpen,
  Award,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import StagesSection from "@/components/features/StagesSection";
import RequirementsSection from "@/components/features/RequirementsSection";
import { useI18n } from "@/hooks/useI18n";

export default function IncubationPage() {
  const { t } = useI18n("incubation");

  const featureIcons = [Home, Users, BookOpen, TrendingUp];

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: "var(--theme-bg-primary)" }}
    >
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1750094486377-749cb4244953?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80"
              alt="Incubation"
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(to bottom, var(--theme-primary), transparent, var(--theme-bg-primary))`,
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphism mb-6"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--theme-primary) 10%, transparent)",
              }}
            >
              <Lightbulb
                className="w-5 h-5"
                style={{ color: "var(--theme-primary)" }}
              />
              <span style={{ color: "var(--theme-text-primary)" }}>
                {t("badge")}
              </span>
            </motion.div>

            <h1
              className="text-4xl sm:text-5xl leading-20 md:text-6xl lg:text-7xl mb-6"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {t("hero.title")}
            </h1>

            <p
              className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-12"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {t("hero.description")}
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                className="px-8 py-6 text-white border-0"
                style={{
                  backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
                }}
              >
                {t("hero.ctaButton")}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section
        className="py-16 sm:py-24"
        style={{ backgroundColor: "var(--theme-bg-secondary)" }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl leading-20 text-center mb-12"
            style={{ color: "var(--theme-text-primary)" }}
          >
            {t("features.title")}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureIcons.map((Icon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className="p-6 border-0 h-full text-center"
                  style={{
                    backgroundColor: "var(--theme-bg-primary)",
                    boxShadow:
                      "0 10px 40px color-mix(in srgb, var(--theme-primary) 5%, transparent)",
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--theme-primary) 15%, transparent)",
                    }}
                  >
                    <Icon
                      className="w-8 h-8"
                      style={{ color: "var(--theme-primary)" }}
                    />
                  </div>
                  <h3
                    className="text-xl mb-3"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    {t(`features.items.${index}.title`)}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "var(--theme-text-secondary)" }}
                  >
                    {t(`features.items.${index}.description`)}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use existing components */}
      <StagesSection />
      <RequirementsSection />

      {/* CTA */}
      <section
        className="py-16 sm:py-24 relative overflow-hidden"
        style={{ backgroundColor: "var(--theme-bg-secondary)" }}
      >
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3
              className="text-2xl sm:text-3xl md:text-4xl mb-4"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {t("cta.title")}
            </h3>
            <p
              className="text-lg mb-8 max-w-2xl mx-auto"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {t("cta.description")}
            </p>
            <a href="#contact">
              <Button
                size="lg"
                className="px-8 py-6 text-white border-0"
                style={{
                  backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
                }}
              >
                {t("cta.button")}
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
