import { motion } from "motion/react";
import { Target, Eye, CheckCircle2, Rocket } from "lucide-react";
import { useTranslations } from "next-intl";
import { useI18n } from "@/hooks/useI18n";

export default function MissionSection() {
  const { t } = useI18n();

  const objectives = [
    "mission_objective1",
    "mission_objective2",
    "mission_objective3",
    "mission_objective4",
  ];

  return (
    <section
      className="py-20 sm:py-32 lg:py-40 relative overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: "var(--theme-bg-secondary)" }}
    >
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full blur-3xl opacity-10"
            style={{
              backgroundColor:
                i % 2 === 0 ? "var(--theme-primary)" : "var(--theme-secondary)",
              top: `${20 + i * 25}%`,
              left: `${10 + i * 30}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glassmorphism mb-6"
          >
            <Rocket
              className="w-4 h-4"
              style={{ color: "var(--theme-accent)" }}
            />
            <span
              className="text-sm bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
              }}
            >
              {t("mission_badge")}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl leading-20"
            style={{ color: "var(--theme-text-primary)" }}
          >
            {t("mission_title")}
          </motion.h2>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            <div
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"
              style={{
                backgroundImage: `linear-gradient(135deg, var(--theme-primary), var(--theme-gradient-mid))`,
              }}
            />
            <div className="relative p-8 sm:p-10 rounded-3xl glassmorphism h-full">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `linear-gradient(135deg, var(--theme-gradient-start), var(--theme-gradient-mid))`,
                    }}
                  />
                  <Target className="w-8 h-8 sm:w-10 sm:h-10 text-white relative z-10" />
                </div>
                <div>
                  <h3
                    className="text-2xl sm:text-3xl mb-2"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    {t("mission_missionTitle")}
                  </h3>
                  <div
                    className="h-1 w-20 rounded-full"
                    style={{ backgroundColor: "var(--theme-accent)" }}
                  />
                </div>
              </div>
              <p
                className="leading-relaxed text-base sm:text-lg"
                style={{ color: "var(--theme-text-secondary)" }}
              >
                {t("mission_missionText")}
              </p>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            <div
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"
              style={{
                backgroundImage: `linear-gradient(135deg, var(--theme-accent), var(--theme-accent-light))`,
              }}
            />
            <div className="relative p-8 sm:p-10 rounded-3xl glassmorphism h-full">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `linear-gradient(135deg, var(--theme-accent), var(--theme-accent-light))`,
                    }}
                  />
                  <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-white relative z-10" />
                </div>
                <div>
                  <h3
                    className="text-2xl sm:text-3xl mb-2"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    {t("mission_visionTitle")}
                  </h3>
                  <div
                    className="h-1 w-20 rounded-full"
                    style={{ backgroundColor: "var(--theme-primary)" }}
                  />
                </div>
              </div>
              <p
                className="leading-relaxed text-base sm:text-lg"
                style={{ color: "var(--theme-text-secondary)" }}
              >
                {t("mission_visionText")}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Objectives */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div
            className="absolute inset-0 rounded-3xl opacity-50 blur-3xl"
            style={{ backgroundColor: "var(--theme-primary)" }}
          />
          <div className="relative p-8 sm:p-12 rounded-3xl glassmorphism">
            <h3
              className="text-2xl sm:text-3xl mb-8 text-center"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {t("mission_badge")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {objectives.map((objectiveKey, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-start gap-4 p-5 sm:p-6 rounded-2xl hover:bg-white/5 dark:hover:bg-white/5 transition-all duration-300"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundImage: `linear-gradient(135deg, var(--theme-accent), var(--theme-accent-light))`,
                    }}
                  >
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <span
                    className="text-base sm:text-lg pt-1"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    {t(objectiveKey)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
