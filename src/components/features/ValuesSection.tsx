import { motion } from "motion/react";
import { Users, Shield, Zap, TrendingUp, Headphones } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface ValuesSectionProps {}

export default function ValuesSection({}: ValuesSectionProps) {
  const { t } = useI18n();
  const values = [
    {
      title: t("Collaboration and Adaptation"),
      icon: Users,
      description: t("Collaboration and Adaptation doc"),
      color: "from-[#0D5BDC] to-[#4587F4]",
    },
    {
      title: t("Reliability"),
      icon: Shield,
      description: t("Reliability doc"),
      color: "from-[#340F87] to-[#0E3F9F]",
    },
    {
      title: t("Capability and Excellence"),
      icon: Zap,
      description: t("Capability and Excellence doc"),
      color: "from-[#00B0F0] to-[#007D9B]",
    },
    {
      title: t("Sustainable Growth"),
      icon: TrendingUp,
      description: t("Sustainable Growth doc"),
      color: "from-[#00717D] to-[#005671]",
    },
    {
      title: t("Responsiveness and Availability"),
      icon: Headphones,
      description: t("Responsiveness and Availability doc"),
      color: "from-[#0A2F78] to-[#0D5BDC]",
    },
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-[#F2F2F2] to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-[#0D5BDC]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-[#340F87]/10 rounded-full blur-3xl"></div>

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
            className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-[#0D5BDC]/10 to-[#340F87]/10 mb-4"
          >
            <span className="bg-gradient-to-r from-[#0D5BDC] to-[#340F87] bg-clip-text text-transparent">
              {t("values_badge")}
            </span>
          </motion.div>
          <h2 className="mb-4 bg-gradient-to-r from-[#262626] to-[#0A2F78] bg-clip-text text-transparent">
            {t("values_title")}
          </h2>
          <p className="text-[#262626]/70 max-w-2xl mx-auto">
            {t("values_subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
            >
              <div className="relative p-6 rounded-2xl bg-white transition-all duration-300 border border-[#F2F2F2] overflow-hidden">
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                ></div>

                <div className="relative z-10">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${value.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <value.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="mb-2 text-[#262626]">{value.title}</h3>
                  <p className="text-[#262626]/70 text-sm">
                    {value.description}
                  </p>
                </div>

                {/* Decorative corner */}
                <div
                  className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${value.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-300`}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
