import { motion } from "motion/react";
import { DollarSign, Users, TrendingUp, UserCheck } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface StatsSectionProps {}

export default function StatsSection({}: StatsSectionProps) {
  const { t } = useI18n();
  const stats = [
    {
      value: "500M+",
      label: t("Venture Market Capitalization"),
      icon: DollarSign,
      color: "from-[#0D5BDC] to-[#4587F4]",
    },
    {
      value: "10K+",
      label: t("Subscriber"),
      icon: Users,
      color: "from-[#00B0F0] to-[#007D9B]",
    },
    {
      value: "200M+",
      label: t("Investment Value"),
      icon: TrendingUp,
      color: "from-[#00717D] to-[#005671]",
    },
    {
      value: "150+",
      label: t("Advisor"),
      icon: UserCheck,
      color: "from-[#340F87] to-[#0E3F9F]",
    },
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-mesh"></div>
      <div className="absolute inset-0 bg-[#0A2F78]/40"></div>

      {/* Floating orbs */}
      <motion.div
        className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full glassmorphism mb-4"
          >
            <span className="text-white/90">{t("Our Achievements")}</span>
          </motion.div>
          <h2 className="text-white mb-4">{t("withnumbers")}</h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            {t("withnumbersdoc")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="relative group"
            >
              <div className="glassmorphism rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300">
                {/* Icon with gradient */}
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${stat.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </div>

                {/* Value */}
                <motion.div
                  initial={{ scale: 1 }}
                  whileInView={{ scale: [1, 1.1, 1] }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  className="text-5xl leading-20 mb-3 bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent"
                >
                  {stat.value}
                </motion.div>

                {/* Label */}
                <p className="text-white/90">{stat.label}</p>

                {/* Glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 blur-xl rounded-2xl transition-opacity duration-300`}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
