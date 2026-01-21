"use client";

import { useState, useEffect } from "react";
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
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { getImageUrl, getReadTime } from "@/lib/utils";

interface News {
  id: number;
  title_ar: string;
  title_en: string | null;
  detail_ar: string | null;
  detail_en: string | null;
  main_image_url?: string | null;
  created_at: string | null;
}

export default function NewsSection() {
  const { t, language } = useI18n("news");
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryColors = [
    "var(--theme-primary)",
    "var(--theme-accent)",
    "var(--theme-accent-light)",
  ];

  const ArrowIcon = language === "ar" ? ArrowLeft : ArrowRight;

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        setLoading(true);
        // Fetch only 3 items
        const response = await fetch("/api/public/news?limit=3");
        if (response.ok) {
          const data = await response.json();
          // Ensure we take up to 3 items
          const items = Array.isArray(data.data) ? data.data : [];
          setNews(items.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch news section data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, []);



  // If loading or no news, we might render a skeleton or nothing. 
  // For the homepage, it's better to show nothing if no news, or skeletons if loading.
  // I will implement skeletons for loading.

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
              {t("badge") || (language === "ar" ? "أحدث الأخبار" : "Latest News")}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 text-3xl sm:text-4xl lg:text-5xl leading-20"
            style={{ color: "var(--theme-text-primary)" }}
          >
            {t("title") || (language === "ar" ? "مقالات ورؤى" : "Articles & Insights")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-base sm:text-lg"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            {t("subtitle") || (language === "ar" ? "اكتشف أحدث التطورات في عالم الأعمال" : "Discover the latest developments in the business world")}
          </motion.p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[400px] rounded-3xl animate-pulse bg-gray-200 dark:bg-gray-800" />
            ))
          ) : (
            news.map((item, index) => {
              const title = language === "ar" ? item.title_ar : (item.title_en || item.title_ar);
              const content = language === "ar" ? item.detail_ar : (item.detail_en || item.detail_ar);
              const date = new Date(item.created_at || Date.now());
              const color = categoryColors[index % categoryColors.length];

              return (
                <Link key={item.id} href={`/news/${item.id}`}>
                  <motion.article
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative h-full"
                  >
                    {/* Glow effect on hover */}
                    <div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"
                      style={{ backgroundColor: color }}
                    />

                    {/* Card */}
                    <div className="relative rounded-3xl overflow-hidden glassmorphism transition-all duration-500 h-full flex flex-col">
                      {/* Image */}
                      <div className="relative h-56 sm:h-64 overflow-hidden">
                        <ImageWithFallback
                          src={`${item.main_image_url}`}
                          alt={title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Gradient overlay */}
                        <div
                          className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                          style={{
                            backgroundImage: `linear-gradient(to top, ${color}, transparent)`,
                          }}
                        />

                        {/* Category Badge */}
                        <div className="absolute top-4 ltr:left-4 rtl:right-4">
                          <Badge className="px-4 py-2 glassmorphism-dark text-white border-0">
                            <Tag className="w-3 h-3 ltr:mr-1 rtl:ml-1" />
                            {language === "ar" ? "أخبار" : "News"}
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
                            <span>{date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{getReadTime(content)} {t("meta.minutes") || (language === "ar" ? "دقيقة" : "min")}</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3
                          className="mb-4 line-clamp-2 text-lg sm:text-xl lg:text-2xl font-semibold"
                          style={{ color: "var(--theme-text-primary)" }}
                        >
                          {title}
                        </h3>

                        {/* Excerpt */}
                        <p
                          className="mb-6 line-clamp-3 text-sm sm:text-base flex-1"
                          style={{ color: "var(--theme-text-secondary)" }}
                        >
                          {content ? content.substring(0, 100) + "..." : ""}
                        </p>

                        {/* Read More Link */}
                        <div className="mt-auto">
                          <Button
                            variant="ghost"
                            className="group/btn p-0 h-auto hover:bg-transparent justify-start"
                          >
                            <span
                              className="flex items-center gap-2 text-sm sm:text-base"
                              style={{ color }}
                            >
                              {t("readMore") || (language === "ar" ? "اقرأ المزيد" : "Read More")}
                              <ArrowIcon className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1 ltr:ml-1 rtl:mr-1" />
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              )
            }))}

        </div>

        {/* View All Button */}
        {!loading && news.length > 0 && (
          <div className="mt-16 text-center">
            <Link href="/news">
              <Button
                size="lg"
                className="px-8 rounded-full"
                style={{ backgroundColor: "var(--theme-primary)", color: "white" }}
              >
                {language === "ar" ? "عرض جميع الأخبار" : "View All News"}
                <ArrowIcon className="w-4 h-4 ltr:ml-2 rtl:mr-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
