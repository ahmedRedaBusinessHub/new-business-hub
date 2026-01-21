"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Calendar,
  User,
  Tag,
  Share2,
  ArrowLeft,
  ArrowRight,
  Facebook,
  Linkedin,
  Twitter,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/hooks/useI18n";
import { getImageUrl, getReadTime } from "@/lib/utils";

export default function NewsDetailPage() {
  const { id } = useParams();
  const { t, language } = useI18n("newsDetailPage");
  const [article, setArticle] = useState<any>(null);
  const [relatedNews, setRelatedNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/public/news/${id}`);
        if (response.ok) {
          const data = await response.json();
          console.log("🚀 ~ fetchArticle ~ data:", data)
          setArticle(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch article", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedNews = async () => {
      try {
        const response = await fetch(`/api/public/news?limit=3`); // Fetch 3, will filter current one out later or just take first 2 that are not current
        if (response.ok) {
          const data = await response.json();
          const items = Array.isArray(data.data) ? data.data : [];
          setRelatedNews(items);
        }
      } catch (error) {
        console.error("Failed to fetch related news", error);
      }
    };

    if (id) {
      fetchArticle();
      fetchRelatedNews();
    }
  }, [id]);

  const handleShare = (platform: string) => {
    navigator.clipboard.writeText(article.social_media[platform]);
    toast.success(`${t("share.toast")}${platform}`);
  };



  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center" style={{ backgroundColor: "var(--theme-bg-primary)" }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center" style={{ backgroundColor: "var(--theme-bg-primary)" }}>
        <h2 className="text-2xl font-bold mb-4">{language === 'ar' ? 'المقال غير موجود' : 'Article Not Found'}</h2>
        <Link href="/news">
          <Button>{language === 'ar' ? 'العودة للأخبار' : 'Back to News'}</Button>
        </Link>
      </div>
    );
  }

  const currentArticle = {
    image: getImageUrl(article.main_image_url),
    titleAr: article.title_ar,
    titleEn: article.title_en,
    contentAr: article.detail_ar,
    contentEn: article.detail_en,
    category: language === 'ar' ? 'أخبار' : 'News', // Or fetch category if available
    categoryEn: 'News',
    author: language === 'ar' ? 'بيزنس هب' : 'Business Hub',
    authorEn: 'Business Hub',
    date: article.created_at,
    readTime: getReadTime(language === 'ar' ? article.detail_ar : article.detail_en)
  };

  const relatedArticles = relatedNews
    .filter((item: any) => item.id.toString() !== id)
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

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--theme-bg-primary)" }}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Hero Section with Image */}
      <section className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={currentArticle.image}
            alt={
              language === "ar"
                ? currentArticle.titleAr
                : (currentArticle.titleEn || currentArticle.titleAr)
            }
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="container mx-auto max-w-5xl h-full relative z-10 flex items-end px-4 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            {/* <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              {language === "ar" ? (
                <>
                  <span>{t("navigation.backToHome")}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t("navigation.backToHome")}</span>
                </>
              )}
            </Link> */}

            <Badge
              className="mb-4 px-4 py-2"
              style={{
                backgroundColor: "var(--theme-accent)",
                color: "var(--theme-text-primary)",
              }}
            >
              {language === "ar"
                ? currentArticle.category
                : currentArticle.categoryEn}
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              {language === "ar"
                ? currentArticle.titleAr
                : currentArticle.titleEn}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>
                  {language === "ar"
                    ? currentArticle.author
                    : currentArticle.authorEn}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>
                  {new Date(currentArticle.date).toLocaleDateString(
                    language === "ar" ? "ar-SA" : "en-US"
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>
                  {currentArticle.readTime} {t("meta.readTime")}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Sidebar - Share */}
            <motion.div
              initial={{ opacity: 0, x: language === "ar" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 space-y-4">
                <p
                  className="text-sm"
                  style={{ color: "var(--theme-text-secondary)" }}
                >
                  {t("share.title")}
                </p>
                <div className="flex lg:flex-col gap-3">
                  {[
                    { icon: Facebook, name: "facebook", color: "#1877F2" },
                    { icon: Twitter, name: "twitter", color: "#1DA1F2" },
                    { icon: Linkedin, name: "linkedIn", color: "#0A66C2" },
                  ].map((social, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="icon"
                      onClick={() => handleShare(social.name)}
                      className="w-10 h-10 hover:scale-110 transition-transform"
                      style={{
                        borderColor: "var(--theme-border)",
                        backgroundColor: "var(--theme-card-bg)",
                      }}
                    >
                      <social.icon
                        className="w-5 h-5"
                        style={{ color: social.color }}
                      />
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-11"
            >
              <Card
                className="p-8 md:p-12"
                style={{
                  backgroundColor: "var(--theme-card-bg)",
                  borderColor: "var(--theme-border)",
                }}
              >
                <article
                  className="prose prose-lg max-w-none"
                  style={{ color: "var(--theme-text-secondary)" }}
                >
                  <div
                    className="whitespace-pre-wrap leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: `${(language === "ar"
                        ? currentArticle.contentAr
                        : currentArticle.contentEn
                      )}`
                        .replace(
                          /##\s+(.+)/g,
                          `<h2 style="color: var(--theme-text-primary); margin-top: 2rem; margin-bottom: 1rem;">$1</h2>`
                        )
                        .replace(
                          /###\s+(.+)/g,
                          `<h3 style="color: var(--theme-text-primary); margin-top: 1.5rem; margin-bottom: 0.75rem;">$1</h3>`
                        )
                        .replace(
                          /\n\n/g,
                          '</p><p style="margin-bottom: 1rem;">'
                        )
                        .replace(/^/, '<p style="margin-bottom: 1rem;">')
                        .replace(/$/, "</p>"),
                    }}
                  />
                </article>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
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
      )}

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card
              className="p-12 text-center"
              style={{
                backgroundColor: "var(--theme-card-bg)",
                borderColor: "var(--theme-border)",
              }}
            >
              <h2
                className="text-3xl md:text-4xl mb-4"
                style={{ color: "var(--theme-text-primary)" }}
              >
                {t("cta.title")}
              </h2>
              <p
                className="text-xl mb-8 opacity-80"
                style={{ color: "var(--theme-text-secondary)" }}
              >
                {t("cta.subtitle")}
              </p>
              <Link href="/follow-us">
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg"
                  style={{
                    backgroundColor: "var(--theme-accent)",
                    color: "var(--theme-text-primary)",
                  }}
                >
                  {t("cta.button")}
                  <ArrowRight
                    className={`w-5 h-5 ${language === "ar" ? "mr-2" : "ml-2"}`}
                  />
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
