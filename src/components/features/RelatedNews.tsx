"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useI18n } from "@/hooks/useI18n";
import { getImageUrl, getReadTime } from "@/lib/utils";

interface RelatedNewsProps {
    currentId: string;
}

export default function RelatedNews({ currentId }: RelatedNewsProps) {
    const { t, language } = useI18n("newsDetailPage");
    const [relatedArticles, setRelatedArticles] = useState<any[]>([]);

    useEffect(() => {
        const fetchRelatedNews = async () => {
            try {
                const response = await fetch(`/api/public/news?limit=3`);
                if (response.ok) {
                    const data = await response.json();
                    const items = Array.isArray(data.data) ? data.data : [];

                    const filtered = items
                        .filter((item: any) => item.id.toString() !== currentId)
                        .slice(0, 2)
                        .map((item: any) => ({
                            id: item.id,
                            image: getImageUrl(item.main_image_url),
                            titleAr: item.title_ar,
                            titleEn: item.title_en,
                            date: item.created_at,
                            readTime: getReadTime(language === 'ar' ? item.detail_ar : item.detail_en),
                            category: language === 'ar' ? 'أخبار' : 'News',
                            categoryEn: 'News'
                        }));

                    setRelatedArticles(filtered);
                }
            } catch (error) {
                console.error("Failed to fetch related news", error);
            }
        };

        if (currentId) {
            fetchRelatedNews();
        }
    }, [currentId, language]);

    if (relatedArticles.length === 0) return null;

    return (
        <section
            className="py-16 px-4"
            style={{ backgroundColor: "var(--theme-bg-secondary)" }}
        >
            <div className="container mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2
                        className="text-3xl md:text-4xl mb-4"
                        style={{ color: "var(--theme-text-primary)" }}
                    >
                        {t("relatedNews.title")}
                    </h2>
                    <p
                        className="text-xl opacity-80"
                        style={{ color: "var(--theme-text-secondary)" }}
                    >
                        {t("relatedNews.subtitle")}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {relatedArticles.map((article, index) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                        >
                            <Link href={`/news/${article.id}`}>
                                <Card
                                    className="overflow-hidden h-full transition-all duration-300 hover:shadow-xl"
                                    style={{
                                        backgroundColor: "var(--theme-card-bg)",
                                        borderColor: "var(--theme-border)",
                                    }}
                                >
                                    <div className="relative h-56 overflow-hidden">
                                        <ImageWithFallback
                                            src={article.image}
                                            alt={
                                                language === "ar"
                                                    ? article.titleAr
                                                    : article.titleEn
                                            }
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                        />
                                        <Badge
                                            className="absolute top-4 left-4 right-auto"
                                            style={{
                                                backgroundColor: "var(--theme-accent)",
                                                color: "var(--theme-text-primary)",
                                            }}
                                        >
                                            {language === "ar"
                                                ? article.category
                                                : article.categoryEn}
                                        </Badge>
                                    </div>

                                    <div className="p-6">
                                        <div
                                            className="flex items-center gap-4 text-sm mb-3"
                                            style={{ color: "var(--theme-text-secondary)" }}
                                        >
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(article.date).toLocaleDateString(
                                                    language === "ar" ? "ar-SA" : "en-US"
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {article.readTime} {t("meta.minutes")}
                                            </div>
                                        </div>

                                        <h3
                                            className="text-xl mb-3 line-clamp-2"
                                            style={{ color: "var(--theme-text-primary)" }}
                                        >
                                            {language === "ar"
                                                ? article.titleAr
                                                : article.titleEn}
                                        </h3>

                                        <Button
                                            variant="link"
                                            className="p-0 h-auto"
                                            style={{ color: "var(--theme-accent)" }}
                                        >
                                            {t("relatedNews.readMore")}
                                            <ArrowRight
                                                className={`w-4 h-4 ${language === "ar" ? "mr-1" : "ml-1"
                                                    }`}
                                            />
                                        </Button>
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
