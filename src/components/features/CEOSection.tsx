import { motion } from "motion/react";
import {
  Quote,
  Award,
  Target,
  Users,
  Linkedin,
  Twitter,
  Mail,
} from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import Im2 from "@/assets/images/WhatsApp Image 2025-11-09 at 08.40.26.jpeg";

import Im from "@/assets/images/WhatsApp Image 2025-11-09 at 08.40.27.jpeg";
export default function CEOSection() {
  const { language, t } = useI18n();
  const ceoData = {
    name: t("ceo.name"),
    title: t("ceo.title"),
    image: Im2.src,
    quote: t("ceo.quote"),
    bio: t("ceo.bio"),
    achievements: [
      {
        icon: Award,
        value: "15+",
        label: t("ceo.experience"),
      },
      {
        icon: Target,
        value: "500+",
        label: t("ceo.successful_projects"),
      },
      {
        icon: Users,
        value: "50+",
        label: t("ceo.strategic_partners"),
      },
    ],
    social: [
      { icon: Linkedin, href: "#", label: t("linkedin") },
      { icon: Twitter, href: "#", label: t("twitter") },
      {
        icon: Mail,
        href: `mailto:${process.env.NEXT_PUBLIC_EMAIL}`,
        label: t("email"),
      },
    ],
  };

  return (
    <section
      className="py-20 sm:py-32 lg:py-40 relative overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: "var(--theme-bg-secondary)" }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 ltr:right-0 rtl:left-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: "var(--theme-primary)" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 ltr:left-0 rtl:right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: "var(--theme-accent)" }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
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
            <Award
              className="w-4 h-4"
              style={{ color: "var(--theme-accent)" }}
            />
            <span
              className="text-sm bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
              }}
            >
              {t("leadership")}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl leading-20"
            style={{ color: "var(--theme-text-primary)" }}
          >
            {t("CEO_message")}
          </motion.h2>
        </div>

        {/* CEO Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side - Image */}
            <motion.div
              initial={{ opacity: 0, x: language === "ar" ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              {/* Gradient glow behind image */}
              <div
                className="absolute inset-0 rounded-[3rem] opacity-50 group-hover:opacity-75 blur-3xl transition-opacity duration-500"
                style={{
                  backgroundImage: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent))`,
                }}
              />

              {/* Image container */}
              <div className="relative rounded-[3rem] overflow-hidden aspect-square">
                <img
                  src={ceoData.image}
                  alt={ceoData.name}
                  className="w-full h-full object-cover rtl:scale-x-[-1]"
                />
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `linear-gradient(to top, var(--theme-primary), transparent)`,
                  }}
                />
              </div>

              {/* Floating stats cards */}
              <div className="absolute -bottom-6 ltr:-right-6 rtl:-left-6 grid grid-cols-3 gap-3 w-full max-w-md">
                {ceoData.achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="relative group/stat "
                  >
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover/stat:opacity-100 blur-xl transition-opacity duration-300 "
                      style={{ backgroundColor: "var(--theme-accent)" }}
                    />
                    <div className="relative p-4 rounded-2xl glassmorphism text-center h-full">
                      <achievement.icon
                        className="w-6 h-6 mx-auto mb-2"
                        style={{ color: "var(--theme-accent)" }}
                      />
                      <div
                        className="text-xl mb-1"
                        style={{ color: "var(--theme-text-primary)" }}
                      >
                        {achievement.value}
                      </div>
                      <p
                        className="text-xs leading-tight"
                        style={{ color: "var(--theme-text-secondary)" }}
                      >
                        {achievement.label}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: language === "ar" ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Name and Title */}
              <div>
                <h3
                  className="text-3xl sm:text-4xl lg:text-5xl leading-20 mb-3"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  {ceoData.name}
                </h3>
                <p
                  className="text-xl sm:text-2xl bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
                  }}
                >
                  {ceoData.title}
                </p>
              </div>

              {/* Quote */}
              <div className="relative">
                <div
                  className="absolute -top-4 ltr:-left-4 rtl:-right-4 w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundImage: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent))`,
                  }}
                >
                  <Quote className="w-8 h-8 text-white" />
                </div>
                <div className="pt-8 ltr:pl-16 rtl:pr-16">
                  <p
                    className="text-lg sm:text-xl leading-relaxed italic"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    "{ceoData.quote}"
                  </p>
                </div>
              </div>

              {/* Bio */}
              <p
                className="text-base sm:text-lg leading-relaxed"
                style={{ color: "var(--theme-text-secondary)" }}
              >
                {ceoData.bio}
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-4 pt-4">
                {ceoData.social.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center relative overflow-hidden group"
                  >
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
                    <social.icon className="w-5 h-5 text-white relative z-10" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
