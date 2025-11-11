import { motion } from "motion/react";
import {
  Award,
  Users,
  Network,
  HeartHandshake,
  TrendingUp,
  Globe,
  Shield,
  Lightbulb,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useI18n } from "@/hooks/useI18n";

export default function AboutSection() {
  const { t } = useI18n();

  const features = [
    {
      icon: Award,
      titleKey: "about_feature1_title",
      descKey: "about_feature1_desc",
    },
    {
      icon: Users,
      titleKey: "about_feature2_title",
      descKey: "about_feature2_desc",
    },
    {
      icon: Network,
      titleKey: "about_feature3_title",
      descKey: "about_feature3_desc",
    },
    {
      icon: HeartHandshake,
      titleKey: "about_feature4_title",
      descKey: "about_feature4_desc",
    },
  ];

  const stats = [
    { icon: TrendingUp, value: "500+", labelKey: "stats_projects" },
    { icon: Globe, value: "50+", labelKey: "partners_title" },
    { icon: Shield, value: "100%", label: "Success Rate" },
    { icon: Lightbulb, value: "10+", label: "Years Experience" },
  ];

  return (
    <section
      id="about"
      className="py-20 sm:py-32 lg:py-40 relative overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: "var(--theme-bg-primary)" }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 ltr:right-0 rtl:left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: "var(--theme-primary)" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 ltr:left-0 rtl:right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: "var(--theme-accent)" }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
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
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--theme-accent)" }}
            />
            <span
              className="text-sm bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
              }}
            >
              {t("about_badge")}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 text-3xl sm:text-4xl lg:text-5xl leading-20"
            style={{ color: "var(--theme-text-primary)" }}
          >
            {t("about_title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-3xl mx-auto text-base sm:text-lg leading-relaxed"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            {t("about_description")}
          </motion.p>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative group"
            >
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                style={{ backgroundColor: "var(--theme-primary)" }}
              />
              <div className="relative p-6 sm:p-8 rounded-2xl glassmorphism text-center">
                <stat.icon
                  className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3"
                  style={{ color: "var(--theme-accent)" }}
                />
                <div
                  className="text-2xl sm:text-3xl lg:text-4xl mb-2"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  {stat.value}
                </div>
                <p
                  className="text-xs sm:text-sm"
                  style={{ color: "var(--theme-text-secondary)" }}
                >
                  {stat.labelKey ? t(stat.labelKey) : stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative group"
            >
              {/* Gradient glow on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"
                style={{
                  backgroundImage: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent))`,
                }}
              />

              {/* Card content */}
              <div className="relative p-6 sm:p-8 rounded-2xl glassmorphism h-full">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden group">
                  <div
                    className="absolute inset-0 opacity-100 group-hover:opacity-0 transition-opacity duration-300"
                    style={{
                      backgroundImage: `linear-gradient(135deg, var(--theme-gradient-start), var(--theme-gradient-mid))`,
                    }}
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      backgroundImage: `linear-gradient(135deg, var(--theme-accent), var(--theme-accent-light))`,
                    }}
                  />
                  <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white relative z-10" />
                </div>

                <h3
                  className="mb-3 text-lg sm:text-xl"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  {t(feature.titleKey)}
                </h3>

                <p
                  className="text-sm sm:text-base leading-relaxed"
                  style={{ color: "var(--theme-text-secondary)" }}
                >
                  {t(feature.descKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
