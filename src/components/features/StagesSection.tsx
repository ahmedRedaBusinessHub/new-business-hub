import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface StagesSectionProps {}

export default function StagesSection({}: StagesSectionProps) {
  const { t } = useI18n();
  const stages = [
    {
      number: "01",
      title: t("Submission and Screening"),
      description: t("Submitting applications and reviewing proposed ideas"),
      color: "from-[#0D5BDC] to-[#4587F4]",
    },
    {
      number: "02",
      title: t("Evaluation and Selection"),
      description: t(
        "Evaluating ideas and selecting the most suitable for the program"
      ),
      color: "from-[#340F87] to-[#0E3F9F]",
    },
    {
      number: "03",
      title: t("Training and Development"),
      description: t("Intensive training programs to develop skills"),
      color: "from-[#00B0F0] to-[#007D9B]",
    },
    {
      number: "04",
      title: t("Implementation and Follow-up"),
      description: t("Project implementation with continuous follow-up"),
      color: "from-[#00717D] to-[#005671]",
    },
    {
      number: "05",
      title: t("Launch and Growth"),
      description: t("Project Launch and Supporting Sustainable Growth"),
      color: "from-[#0A2F78] to-[#0D5BDC]",
    },
  ];

  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-br from-[#262626] via-[#0A2F78] to-[#340F87]">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-[#0D5BDC]/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-[#340F87]/20 rounded-full blur-3xl"
        animate={{
          scale: [1.3, 1, 1.3],
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 15,
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
            className="inline-block px-4 py-2 rounded-full glassmorphism-dark mb-4"
          >
            <span className="text-white/90">{t("Stages")}</span>
          </motion.div>
          <h2 className="text-white mb-4">
            {t("Stages of turning an idea into a project")}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            {t(
              "We accompany you every step of the way in your journey to transforming your idea into a successful project"
            )}
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 transform -translate-y-1/2">
            <svg className="w-full h-2" preserveAspectRatio="none">
              <motion.path
                d="M0 1 L100% 1"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                fill="none"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient
                  id="lineGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#0D5BDC" />
                  <stop offset="25%" stopColor="#340F87" />
                  <stop offset="50%" stopColor="#00B0F0" />
                  <stop offset="75%" stopColor="#00717D" />
                  <stop offset="100%" stopColor="#0A2F78" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
            {stages.map((stage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Card */}
                <motion.div
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="relative mb-6 w-full"
                >
                  <div className="glassmorphism-dark rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                    {/* Number badge */}
                    <div className="relative mb-4 inline-block">
                      <div
                        className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${stage.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <span className="text-2xl text-white">
                          {stage.number}
                        </span>
                      </div>
                      <motion.div
                        className="absolute -bottom-2 -right-2"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: index * 0.15 + 0.3,
                          type: "spring",
                        }}
                      >
                        <CheckCircle2 className="w-8 h-8 text-[#00B0F0]" />
                      </motion.div>
                    </div>

                    {/* Title */}
                    <h3 className="mb-2 text-white">{stage.title}</h3>

                    {/* Description */}
                    <p className="text-white/70 text-sm">{stage.description}</p>
                  </div>

                  {/* Glow effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stage.color} opacity-0 group-hover:opacity-30 blur-2xl rounded-2xl -z-10 transition-opacity duration-300`}
                  ></div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
