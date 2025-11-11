import { motion } from "motion/react";
import { Flag, Calendar, MapPin, Lightbulb } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface RequirementsSectionProps {}

export default function RequirementsSection({}: RequirementsSectionProps) {
  const { t } = useI18n();
  const requirements = [
    {
      title: t("Saudi National"),
      icon: Flag,
      gradient: "from-[#0D5BDC] to-[#4587F4]",
    },
    {
      title: t("+18 Suitable Age for Application"),
      icon: Calendar,
      gradient: "from-[#340F87] to-[#0E3F9F]",
    },
    {
      title: t("From Medina"),
      icon: MapPin,
      gradient: "from-[#00B0F0] to-[#007D9B]",
    },
    {
      title: t("Has an Idea to Implement"),
      icon: Lightbulb,
      gradient: "from-[#00717D] to-[#005671]",
    },
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-white via-[#F2F2F2] to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-[#0D5BDC]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-[#340F87]/10 rounded-full blur-3xl"></div>

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
            className="inline-block px-4 py-2 rounded-full bg-white border border-[#F2F2F2] mb-4"
          >
            <span className="bg-gradient-to-r from-[#0D5BDC] to-[#340F87] bg-clip-text text-transparent">
              {t("Requirements")}
            </span>
          </motion.div>
          <h2 className="mb-4 bg-gradient-to-r from-[#262626] to-[#0A2F78] bg-clip-text text-transparent">
            {t("What you should know before applying to the program")}
          </h2>
          <p className="text-[#262626]/70 max-w-2xl mx-auto">
            {t(
              "Make sure you meet these requirements before applying to our programs"
            )}{" "}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {requirements.map((requirement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.03 }}
              className="group relative"
            >
              <div className="relative h-full flex flex-col items-center text-center p-8 rounded-3xl bg-white transition-all duration-500 border border-[#F2F2F2] overflow-hidden">
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${requirement.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>

                {/* Blur overlay on hover */}
                <div className="absolute inset-0 backdrop-blur-0 group-hover:backdrop-blur-sm transition-all duration-500"></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${requirement.gradient} mb-6 transition-shadow duration-300`}
                  >
                    <requirement.icon className="w-10 h-10 text-white" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-[#262626] group-hover:text-white transition-colors duration-300">
                    {requirement.title}
                  </h3>
                </div>

                {/* Decorative corner glow */}
                <div
                  className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${requirement.gradient} opacity-20 blur-3xl group-hover:opacity-40 transition-opacity duration-500`}
                ></div>
              </div>

              {/* External glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${requirement.gradient} opacity-0 group-hover:opacity-30 blur-xl -z-10 rounded-3xl transition-opacity duration-500`}
              ></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
