"use client";
import { useI18n } from "@/hooks/useI18n";

import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowUpRight, Building2 } from "lucide-react";

import Link from "next/link";

export default function CompaniesSection() {
  const { t } = useI18n("companies");
  // Static images array - these don't need translation
  const companyImages = [
    {
      image:
        "https://images.unsplash.com/photo-1518107616985-bd48230d3b20?w=800&q=80",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&q=80",
    },
    {
      image:
        "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=800&q=80",
      logo: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&q=80",
    },
    {
      image:
        "https://images.unsplash.com/photo-1575956011521-4d7f5cf0b18e?w=800&q=80",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&q=80",
    },
    {
      image:
        "https://images.unsplash.com/photo-1630344745908-ed5ffd73199a?w=800&q=80",
      logo: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&q=80",
    },
  ];

  return (
    <section
      className="py-16 sm:py-24 lg:py-32 relative overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: "var(--theme-bg-secondary)" }}
    >
      {/* Background decorations */}
      <div
        className="absolute top-40 ltr:right-10 rtl:left-10 w-48 h-48 sm:w-72 sm:h-72 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: "var(--theme-primary)" }}
      />
      <div
        className="absolute bottom-40 ltr:left-10 rtl:right-10 w-48 h-48 sm:w-72 sm:h-72 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: "var(--theme-secondary)" }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full glassmorphism mb-4"
            style={{
              backgroundImage: `linear-gradient(to right, 
                color-mix(in srgb, var(--theme-primary) 10%, transparent), 
                color-mix(in srgb, var(--theme-secondary) 10%, transparent))`,
            }}
          >
            <span
              className="text-sm bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
              }}
            >
              {t("badge")}
            </span>
          </motion.div>
          <h2 className="mb-4" style={{ color: "var(--theme-text-primary)" }}>
            {t("title")}
          </h2>
          <p
            className="max-w-2xl mx-auto text-sm sm:text-base"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {companyImages.map((companyImage, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative rounded-2xl overflow-hidden glassmorphism transition-all duration-500"
            >
              {/* Background Image */}
              <div className="relative h-48 sm:h-64 overflow-hidden">
                <ImageWithFallback
                  src={companyImage.image}
                  alt={t(`items.${index}.name`)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                  style={{
                    backgroundImage: `linear-gradient(to top right, 
                      color-mix(in srgb, var(--theme-primary) 80%, transparent), 
                      color-mix(in srgb, var(--theme-secondary) 60%, transparent))`,
                  }}
                />

                {/* Logo */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="absolute top-4 sm:top-6 ltr:left-4 ltr:sm:left-6 rtl:right-4 rtl:sm:right-6 w-14 h-14 sm:w-16 sm:h-16 rounded-xl glassmorphism-dark overflow-hidden border-2 border-white/30"
                >
                  <div
                    className="w-full h-full flex items-center justify-center p-2"
                    style={{ backgroundColor: "var(--theme-bg-primary)" }}
                  >
                    <Building2
                      className="w-8 h-8"
                      style={{ color: "var(--theme-primary)" }}
                    />
                  </div>
                </motion.div>

                {/* Category Badge */}
                <div className="absolute top-4 sm:top-6 ltr:right-4 ltr:sm:right-6 rtl:left-4 rtl:sm:left-6">
                  <span className="px-3 py-1 rounded-full text-xs sm:text-sm glassmorphism-dark text-white border border-white/20">
                    {t(`items.${index}.category`)}
                  </span>
                </div>

                {/* Arrow Icon */}
                <motion.div
                  className="absolute bottom-4 sm:bottom-6 ltr:right-4 ltr:sm:right-6 rtl:left-4 rtl:sm:left-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center glassmorphism-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.1, rotate: 45 }}
                >
                  <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8">
                <h3
                  className="mb-2 text-lg sm:text-xl"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  {t(`items.${index}.name`)}
                </h3>
                <p
                  className="text-sm sm:text-base"
                  style={{ color: "var(--theme-text-secondary)" }}
                >
                  {t(`items.${index}.description`)}
                </p>
              </div>

              {/* Hover gradient border */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, 
                    color-mix(in srgb, var(--theme-primary) 50%, transparent), 
                    color-mix(in srgb, var(--theme-accent) 50%, transparent))`,
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  padding: "2px",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="text-center pt-20">
        <Link href={"/projects"}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-[#0D5BDC]/10 to-[#340F87]/10 border border-[#0D5BDC]/20 mb-4"
          >
            <span className="bg-gradient-to-r from-[#0D5BDC] to-[#340F87] bg-clip-text text-transparent">
              {t("viewMore")}
            </span>
          </motion.div>
        </Link>
      </div>
    </section>
  );
}
