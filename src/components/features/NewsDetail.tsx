"use client";

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

export default function NewsDetailPage() {
  const { id } = useParams();
  const { t, language } = useI18n("newsDetailPage");

  // Mock news data - in real app, fetch from API
  const newsArticles = [
    {
      id: "1",
      titleAr: "بيزنس هب تطلق برنامج تسريع جديد للشركات التقنية",
      titleEn:
        "Business Hub Launches New Acceleration Program for Tech Startups",
      contentAr: `أعلنت بيزنس هب اليوم عن إطلاق برنامج تسريع جديد مخصص للشركات الناشئة في قطاع التقنية. يهدف البرنامج إلى دعم 20 شركة ناشئة على مدار 6 أشهر بتمويل يصل إلى 500 ألف ريال لكل شركة.

يتضمن البرنامج جلسات إرشادية مكثفة مع خبراء في مجال التقنية، وورش عمل متخصصة في تطوير المنتجات، والتسويق، والمبيعات، بالإضافة إلى فرص الوصول إلى شبكة واسعة من المستثمرين والشركاء المحتملين.

وقال المدير التنفيذي لبيزنس هب: "نحن متحمسون جداً لإطلاق هذا البرنامج الذي يمثل خطوة مهمة في دعم النظام البيئي للشركات الناشئة في المملكة. نؤمن بأن الشركات التقنية هي المستقبل، ونحن ملتزمون بتوفير كل الدعم اللازم لنجاحها."

## معايير القبول

يستهدف البرنامج الشركات الناشئة التي:
- لديها منتج تقني مبتكر في مرحلة MVP أو أكثر تقدماً
- فريق مؤسس ملتزم بدوام كامل
- نموذج عمل واضح وقابل للتوسع
- تعمل في أحد المجالات: الذكاء الاصطناعي، الأمن السيبراني، التقنية المالية، أو التعليم التقني

## كيفية التقديم

يمكن للشركات المهتمة التقديم عبر الموقع الإلكتروني لبيزنس هب حتى نهاية الشهر الحالي. سيتم الإعلان عن الشركات المقبولة في غضون شهر من انتهاء فترة التقديم.`,
      contentEn: `Business Hub announced today the launch of a new acceleration program dedicated to startups in the technology sector. The program aims to support 20 startups over 6 months with funding of up to 500,000 SAR per company.

The program includes intensive mentoring sessions with technology experts, specialized workshops in product development, marketing, and sales, as well as opportunities to access a wide network of investors and potential partners.

The CEO of Business Hub said: "We are very excited to launch this program, which represents an important step in supporting the startup ecosystem in the Kingdom. We believe that tech companies are the future, and we are committed to providing all the necessary support for their success."

## Acceptance Criteria

The program targets startups that:
- Have an innovative tech product at MVP stage or more advanced
- A committed full-time founding team
- A clear and scalable business model
- Working in one of these areas: AI, Cybersecurity, FinTech, or EdTech

## How to Apply

Interested companies can apply through the Business Hub website until the end of this month. Accepted companies will be announced within one month of the application deadline.`,
      date: "2025-01-15",
      author: "فريق بيزنس هب",
      authorEn: "Business Hub Team",
      category: "برامج",
      categoryEn: "Programs",
      readTime: 5,
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72",
    },
    {
      id: "2",
      titleAr: "شراكة استراتيجية مع صندوق الاستثمارات العامة",
      titleEn: "Strategic Partnership with Public Investment Fund",
      contentAr: `وقعت بيزنس هب اتفاقية شراكة استراتيجية مع صندوق الاستثمارات العامة لدعم الشركات الناشئة الواعدة في المملكة. تهدف هذه الشراكة إلى توفير فرص تمويل أكبر للشركات الناشئة في مراحلها المختلفة.

## تفاصيل الشراكة

بموجب هذه الاتفاقية، ستتاح للشركات المحتضنة في بيزنس هب فرصة الوصول إلى:
- تمويل يصل إلى 10 ملايين ريال للشركات في مراحل النمو
- برامج إرشاد متخصصة من خبراء الصندوق
- فرص الشراكة مع الشركات التابعة للصندوق
- دعم في التوسع الإقليمي والدولي

تأتي هذه الشراكة في إطار رؤية المملكة 2030 لتعزيز قطاع ريادة الأعمال وتنويع الاقتصاد الوطني.`,
      contentEn: `Business Hub has signed a strategic partnership agreement with the Public Investment Fund to support promising startups in the Kingdom. This partnership aims to provide greater funding opportunities for startups at different stages.

## Partnership Details

Under this agreement, companies incubated at Business Hub will have access to:
- Funding up to 10 million SAR for growth-stage companies
- Specialized mentorship programs from Fund experts
- Partnership opportunities with Fund-affiliated companies
- Support in regional and international expansion

This partnership comes within the framework of the Kingdom's Vision 2030 to strengthen the entrepreneurship sector and diversify the national economy.`,
      date: "2025-01-10",
      author: "إدارة التسويق",
      authorEn: "Marketing Department",
      category: "شراكات",
      categoryEn: "Partnerships",
      readTime: 4,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    },
  ];

  const currentArticle =
    newsArticles.find((article) => article.id === id) || newsArticles[0];
  const relatedArticles = newsArticles
    .filter((article) => article.id !== currentArticle.id)
    .slice(0, 2);

  const handleShare = (platform: string) => {
    toast.success(`${t("share.toast")}${platform}`);
  };

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
                : currentArticle.titleEn
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
                    { icon: Facebook, name: "Facebook", color: "#1877F2" },
                    { icon: Twitter, name: "Twitter", color: "#1DA1F2" },
                    { icon: Linkedin, name: "LinkedIn", color: "#0A66C2" },
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
                      __html: (language === "ar"
                        ? currentArticle.contentAr
                        : currentArticle.contentEn
                      )
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
                            className={`w-4 h-4 ${
                              language === "ar" ? "mr-1" : "ml-1"
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
              <Link href="/follow">
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
