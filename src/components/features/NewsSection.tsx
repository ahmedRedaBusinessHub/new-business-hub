import { motion } from "motion/react";
import {
  Calendar,
  ArrowRight,
  ArrowLeft,
  Clock,
  Tag,
  Newspaper,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { useI18n } from "@/hooks/useI18n";
import Link from "next/link";

export default function NewsSection() {
  const { t, language } = useI18n("news");

  const categoryColors = [
    "var(--theme-primary)",
    "var(--theme-accent)",
    "var(--theme-accent-light)",
  ];

  const ArrowIcon = language === "ar" ? ArrowLeft : ArrowRight;

  return (
    <section
      className="py-20 sm:py-32 lg:py-40 relative overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: "var(--theme-bg-primary)" }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, var(--theme-primary) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
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
            <Newspaper
              className="w-4 h-4"
              style={{ color: "var(--theme-accent)" }}
            />
            <span
              className="text-sm bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
              }}
            >
              {t("badge")}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 text-3xl sm:text-4xl lg:text-5xl leading-20"
            style={{ color: "var(--theme-text-primary)" }}
          >
            {t("title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-base sm:text-lg"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            {t("subtitle")}
          </motion.p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <Link key={index} href={"/news/12"}>
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"
                  style={{ backgroundColor: categoryColors[index] }}
                />

                {/* Card */}
                <div className="relative rounded-3xl overflow-hidden glassmorphism transition-all duration-500 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-56 sm:h-64 overflow-hidden">
                    <img
                      src={t(`items.${index}.image`)}
                      alt={t(`items.${index}.title`)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient overlay */}
                    <div
                      className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                      style={{
                        backgroundImage: `linear-gradient(to top, ${categoryColors[index]}, transparent)`,
                      }}
                    />

                    {/* Category Badge */}
                    <div className="absolute top-4 ltr:left-4 rtl:right-4">
                      <Badge className="px-4 py-2 glassmorphism-dark text-white border-0">
                        <Tag className="w-3 h-3 ltr:mr-1 rtl:ml-1" />
                        {t(`items.${index}.category`)}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col">
                    {/* Meta Info */}
                    <div
                      className="flex items-center gap-4 mb-4 text-xs sm:text-sm"
                      style={{ color: "var(--theme-text-secondary)" }}
                    >
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{t(`items.${index}.date`)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{t(`items.${index}.readTime`)}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      className="mb-4 line-clamp-2 text-lg sm:text-xl lg:text-2xl"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      {t(`items.${index}.title`)}
                    </h3>

                    {/* Excerpt */}
                    <p
                      className="mb-6 line-clamp-3 text-sm sm:text-base flex-1"
                      style={{ color: "var(--theme-text-secondary)" }}
                    >
                      {t(`items.${index}.excerpt`)}
                    </p>

                    {/* Read More Link */}
                    <Button
                      variant="ghost"
                      className="group/btn p-0 h-auto hover:bg-transparent justify-start"
                    >
                      <span
                        className="flex items-center gap-2 text-sm sm:text-base"
                        style={{ color: categoryColors[index] }}
                      >
                        {t("readMore")}
                        <ArrowIcon className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </span>
                    </Button>
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
