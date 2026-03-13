"use client";
import { motion } from "motion/react";
import {
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useI18n } from "@/hooks/useI18n";

export default function PrivacyPage() {
  const { t } = useI18n("privacy");

  const sectionIcons = [Database, Lock, Shield, Eye, UserCheck, AlertTriangle];

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: "var(--theme-bg-primary)" }}
    >
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 ltr:right-0 rtl:left-0 w-full h-96 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: "var(--theme-primary)" }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
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
              <Shield
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
              {t("title")}
            </h1>

            <p
              className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-8"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {t("subtitle")}
            </p>

            <p
              className="text-sm"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {t("lastUpdated")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Sections */}
      <section
        className="py-16 sm:py-24"
        style={{ backgroundColor: "var(--theme-bg-secondary)" }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sectionIcons.map((Icon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className="p-6 sm:p-8 border-0 h-full"
                  style={{
                    backgroundColor: "var(--theme-bg-primary)",
                    boxShadow:
                      "0 10px 40px color-mix(in srgb, var(--theme-primary) 5%, transparent)",
                  }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="p-3 rounded-xl"
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--theme-primary) 15%, transparent)",
                      }}
                    >
                      <Icon
                        className="w-6 h-6"
                        style={{ color: "var(--theme-primary)" }}
                      />
                    </div>
                    <h2
                      className="text-2xl sm:text-3xl flex-1"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      {t(`sections.${index}.title`)}
                    </h2>
                  </div>
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: "var(--theme-text-secondary)" }}
                  >
                    {t(`sections.${index}.content`)}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Types */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl leading-20 text-center mb-12"
            style={{ color: "var(--theme-text-primary)" }}
          >
            {t("dataTypes.title")}
          </motion.h2>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className="p-6 border-0 h-full"
                  style={{
                    backgroundColor: "var(--theme-bg-secondary)",
                    boxShadow:
                      "0 10px 40px color-mix(in srgb, var(--theme-accent) 5%, transparent)",
                  }}
                >
                  <h3
                    className="text-xl mb-4"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    {t(`dataTypes.categories.${index}.title`)}
                  </h3>
                  <ul className="space-y-2">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: "var(--theme-primary)" }}
                        />
                        <span style={{ color: "var(--theme-text-secondary)" }}>
                          {t(`dataTypes.categories.${index}.items.${idx}`)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
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
              className="text-lg mb-8"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {t("cta.description")}
            </p>
            <a
              href="#contact"
              className="inline-block px-8 py-4 rounded-xl text-white transition-transform hover:scale-105"
              style={{
                backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
              }}
            >
              {t("cta.button")}
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
