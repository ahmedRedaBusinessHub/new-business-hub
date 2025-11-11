import { motion } from "motion/react";
import { Hash, TrendingUp, Search, BarChart3 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useI18n } from "@/hooks/useI18n";

export default function SEOSection() {
  const { t } = useI18n();

  const keywords = [
    "seo_keyword1",
    "seo_keyword2",
    "seo_keyword3",
    "seo_keyword4",
    "seo_keyword5",
    "seo_keyword6",
    "seo_keyword7",
    "seo_keyword8",
  ];

  const metrics = [
    {
      icon: TrendingUp,
      value: "95%",
      label: "Visibility Score",
      color: "var(--theme-accent)",
    },
    {
      icon: Search,
      value: "10K+",
      label: "Monthly Searches",
      color: "var(--theme-primary)",
    },
    {
      icon: BarChart3,
      value: "#1",
      label: "Search Ranking",
      color: "var(--theme-accent-light)",
    },
  ];

  return (
    <section
      className="py-20 sm:py-32 lg:py-40 relative overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: "var(--theme-bg-primary)" }}
    >
      {/* Animated rotating gradient */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: "var(--theme-primary)" }}
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glassmorphism mb-6"
          >
            <Search
              className="w-4 h-4"
              style={{ color: "var(--theme-accent)" }}
            />
            <span
              className="text-sm bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
              }}
            >
              {t("seo_badge")}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 text-3xl sm:text-4xl lg:text-5xl leading-20"
            style={{ color: "var(--theme-text-primary)" }}
          >
            {t("seo_title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-base sm:text-lg"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            {t("seo_subtitle")}
          </motion.p>
        </div>

        {/* Keywords Cloud */}
        <div className="max-w-5xl mx-auto mb-16 sm:mb-20">
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
            {keywords.map((keywordKey, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="relative group cursor-pointer"
              >
                {/* Glow effect */}
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"
                  style={{ backgroundColor: "var(--theme-accent)" }}
                />

                {/* Keyword pill */}
                <div
                  className="relative px-5 sm:px-7 py-3 sm:py-4 rounded-full glassmorphism border-2 transition-all duration-300"
                  style={{
                    borderColor: "transparent",
                  }}
                  onMouseEnter={(e: any) => {
                    e.currentTarget.style.borderColor = "var(--theme-accent)";
                    e.currentTarget.style.backgroundImage = `linear-gradient(135deg, 
                      color-mix(in srgb, var(--theme-primary) 10%, transparent), 
                      color-mix(in srgb, var(--theme-accent) 10%, transparent))`;
                  }}
                  onMouseLeave={(e: any) => {
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.style.backgroundImage = "";
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Hash
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      style={{ color: "var(--theme-accent)" }}
                    />
                    <span
                      className="text-sm sm:text-base"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      {t(keywordKey)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SEO Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
            >
              {/* Glow effect */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"
                style={{ backgroundColor: metric.color }}
              />

              {/* Metric card */}
              <div className="relative p-8 sm:p-10 rounded-3xl glassmorphism text-center">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${metric.color}, var(--theme-accent-light))`,
                  }}
                >
                  <metric.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>

                <div
                  className="text-4xl sm:text-5xl leading-20 lg:text-6xl mb-3"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  {metric.value}
                </div>

                <p
                  className="text-sm sm:text-base"
                  style={{ color: "var(--theme-text-secondary)" }}
                >
                  {metric.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
