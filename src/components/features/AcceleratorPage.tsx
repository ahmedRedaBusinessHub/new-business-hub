"use client";

import { motion } from "motion/react";
import {
  Rocket,
  TrendingUp,
  Users,
  Target,
  Award,
  Zap,
  DollarSign,
  BookOpen,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

import { useI18n } from "@/hooks/useI18n";
export default function AcceleratorPage() {
  const { t, language } = useI18n("accelerator");
  const benefits = [
    {
      icon: Rocket,
      title: t("benefits.items.growth.title"),
      description: t("benefits.items.growth.description"),
    },
    {
      icon: Users,
      title: t("benefits.items.mentorship.title"),
      description: t("benefits.items.mentorship.description"),
    },
    {
      icon: DollarSign,
      title: t("benefits.items.funding.title"),
      description: t("benefits.items.funding.description"),
    },
    {
      icon: BookOpen,
      title: t("benefits.items.training.title"),
      description: t("benefits.items.training.description"),
    },
  ];

  const timeline = [
    {
      phase: t("timeline.phases.phase1.label"),
      title: t("timeline.phases.phase1.title"),
      duration: t("timeline.phases.phase1.duration"),
      activities: [
        t("timeline.phases.phase1.activities.application"),
        t("timeline.phases.phase1.activities.review"),
        t("timeline.phases.phase1.activities.interviews"),
        t("timeline.phases.phase1.activities.acceptance"),
      ],
    },
    {
      phase: t("timeline.phases.phase2.label"),
      title: t("timeline.phases.phase2.title"),
      duration: t("timeline.phases.phase2.duration"),
      activities: [
        t("timeline.phases.phase2.activities.workshops"),
        t("timeline.phases.phase2.activities.mentoring"),
        t("timeline.phases.phase2.activities.development"),
        t("timeline.phases.phase2.activities.teamBuilding"),
      ],
    },
    {
      phase: t("timeline.phases.phase3.label"),
      title: t("timeline.phases.phase3.title"),
      duration: t("timeline.phases.phase3.duration"),
      activities: [
        t("timeline.phases.phase3.activities.scaling"),
        t("timeline.phases.phase3.activities.pitch"),
        t("timeline.phases.phase3.activities.funding"),
        t("timeline.phases.phase3.activities.launch"),
      ],
    },
  ];

  const requirements = [
    {
      title: t("requirements.items.businessModel.title"),
      description: t("requirements.items.businessModel.description"),
    },
    {
      title: t("requirements.items.team.title"),
      description: t("requirements.items.team.description"),
    },
    {
      title: t("requirements.items.mvp.title"),
      description: t("requirements.items.mvp.description"),
    },
    {
      title: t("requirements.items.growth.title"),
      description: t("requirements.items.growth.description"),
    },
  ];

  const stats = [
    {
      value: "100+",
      label: t("stats.companiesAccelerated"),
    },
    {
      value: "500M+",
      label: t("stats.marketValue"),
    },
    { value: "85%", label: t("stats.successRate") },
    { value: "50+", label: t("stats.expertMentors") },
  ];

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: "var(--theme-bg-primary)" }}
    >
      {/* Hero Section */}
      <section className="relative py-50 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1548057407-b022b3f5b6ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80"
              alt="Accelerator"
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
              <Rocket
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
                {t("hero.applyButton")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6"
                style={{
                  borderColor: "var(--theme-primary)",
                  color: "var(--theme-primary)",
                }}
              >
                {t("hero.downloadGuide")}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section
        className="py-16 sm:py-24"
        style={{ backgroundColor: "var(--theme-bg-secondary)" }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div
                  className="text-4xl sm:text-5xl leading-20 mb-2"
                  style={{ color: "var(--theme-primary)" }}
                >
                  {stat.value}
                </div>
                <div style={{ color: "var(--theme-text-secondary)" }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl leading-20 text-center mb-12"
            style={{ color: "var(--theme-text-primary)" }}
          >
            {t("benefits.title")}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
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
                    backgroundColor: "var(--theme-bg-secondary)",
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
                    <benefit.icon
                      className="w-8 h-8"
                      style={{ color: "var(--theme-primary)" }}
                    />
                  </div>
                  <h3
                    className="text-xl mb-3"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    {benefit.title}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "var(--theme-text-secondary)" }}
                  >
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
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
            {t("timeline.title")}
          </motion.h2>

          <div className="max-w-5xl mx-auto space-y-8">
            {timeline.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: language === "ar" ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className="p-6 sm:p-8 border-0"
                  style={{
                    backgroundColor: "var(--theme-bg-primary)",
                    boxShadow:
                      "0 10px 40px color-mix(in srgb, var(--theme-accent) 5%, transparent)",
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    <Badge
                      className="text-lg px-4 py-2 w-fit"
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--theme-primary) 15%, transparent)",
                        color: "var(--theme-primary)",
                      }}
                    >
                      {phase.phase}
                    </Badge>
                    <h3
                      className="text-2xl sm:text-3xl flex-1"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      {phase.title}
                    </h3>
                    <div
                      className="text-sm px-4 py-2 rounded-lg w-fit"
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--theme-accent) 15%, transparent)",
                        color: "var(--theme-accent)",
                      }}
                    >
                      {phase.duration}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {phase.activities.map((activity, idx) => (
                      <span
                        key={idx}
                        className="text-sm px-3 py-1 rounded-full"
                        style={{
                          backgroundColor:
                            "color-mix(in srgb, var(--theme-bg-secondary) 80%, transparent)",
                          color: "var(--theme-text-secondary)",
                        }}
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl leading-20 text-center mb-12"
            style={{ color: "var(--theme-text-primary)" }}
          >
            {t("requirements.title")}
          </motion.h2>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {requirements.map((req, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className="p-6 border-0 h-full"
                  style={{
                    backgroundColor: "var(--theme-bg-secondary)",
                    boxShadow:
                      "0 10px 40px color-mix(in srgb, var(--theme-primary) 5%, transparent)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--theme-primary) 15%, transparent)",
                        color: "var(--theme-primary)",
                      }}
                    >
                      {index + 1}
                    </div>
                    <h3
                      className="text-xl flex-1"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      {req.title}
                    </h3>
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: "var(--theme-text-secondary)" }}
                  >
                    {req.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
            <Button
              size="lg"
              className="px-8 py-6 text-white border-0"
              style={{
                backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
              }}
            >
              {t("cta.button")}
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
