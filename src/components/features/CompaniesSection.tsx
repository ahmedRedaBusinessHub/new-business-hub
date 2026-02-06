"use client";
import { useI18n } from "@/hooks/useI18n";
import { useEffect, useState } from "react";

import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowUpRight, Building2, Facebook, Twitter, Linkedin, Instagram, Youtube, Globe } from "lucide-react";
import { Badge } from "../ui/Badge";

import Link from "next/link";

interface Company {
  id: number;
  title_ar?: string;
  title_en?: string;
  detail_ar?: string;
  detail_en?: string;
  main_image_url?: string;
  image_urls?: string[];
  type?: number;
  category_ids?: number[];
  categories?: Category[];
  link?: string;
  social_media?: any;
}

interface Category {
  id: number;
  name_ar?: string;
  name_en?: string;
}

interface CompaniesSectionProps {
  limit?: number;
}

export default function CompaniesSection({ limit = 6 }: CompaniesSectionProps) {
  const { t, language } = useI18n("companies");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await fetch(`/api/public/projects-by-type?type=2&limit=${limit}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch companies: ${response.status}`);
        }

        const data = await response.json();
        setCompanies(data.data || []);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, []);

  const getCompanyTitle = (company: Company) => {
    return language === "ar" ? company.title_ar : company.title_en;
  };

  const getCompanyDescription = (company: Company) => {
    return language === "ar" ? company.detail_ar : company.detail_en;
  };

  const getCompanyImage = (company: Company) => {
    return company.main_image_url || company.image_urls?.[0] || "";
  };

  const getCategoryName = (category: Category) => {
    return language === "ar" ? category.name_ar : category.name_en;
  };

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
          {companies.map((company, index) => {
            const title = getCompanyTitle(company);
            const description = getCompanyDescription(company);
            const image = getCompanyImage(company);

            // Parse social media
            const socialMedia = typeof company.social_media === 'string'
              ? JSON.parse(company.social_media)
              : company.social_media || {};

            const hasMainLink = !!company.link;
            const hasSocialLinks = Object.keys(socialMedia).length > 0;

            const SocialIcon = ({ platform, className }: { platform: string, className?: string }) => {
              switch (platform.toLowerCase()) {
                case 'facebook': return <Facebook className={className} />;
                case 'twitter':
                case 'x': return <Twitter className={className} />;
                case 'linkedin': return <Linkedin className={className} />;
                case 'instagram': return <Instagram className={className} />;
                case 'youtube': return <Youtube className={className} />;
                default: return <Globe className={className} />;
              }
            };

            return (
              <motion.div
                key={company.id}
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
                    src={image}
                    alt={title || "Company"}
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
                    className="absolute top-4 sm:top-6 ltr:left-4 ltr:sm:left-6 rtl:right-4 rtl:sm:right-6 w-14 h-14 sm:w-16 sm:h-16 rounded-xl glassmorphism-dark overflow-hidden border-2 border-white/30 z-20"
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
                  <div className="absolute top-4 sm:top-6 ltr:right-4 ltr:sm:right-6 rtl:left-4 rtl:sm:left-6 z-20">
                    <span className="px-3 py-1 rounded-full text-xs sm:text-sm glassmorphism-dark text-white border border-white/20">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Social Media Icons - Bottom Start */}
                  {hasSocialLinks && (
                    <div className="absolute bottom-4 sm:bottom-6 ltr:left-4 ltr:sm:left-6 rtl:right-4 rtl:sm:right-6 flex gap-2 z-20">
                      {Object.entries(socialMedia).map(([platform, url], i) => (
                        <Link
                          key={platform}
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }} // Show initially? Or wait for hover? Let's show it on hover better for cleaner look
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center glassmorphism-dark opacity-0 group-hover:opacity-100 transition-all duration-300"
                            style={{ transitionDelay: `${i * 50}ms` }}
                            whileHover={{ scale: 1.1, y: -2 }}
                            title={platform}
                          >
                            <SocialIcon platform={platform} className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Arrow Icon / Main Link - Bottom End */}
                  {hasMainLink ? (
                    <Link href={company.link!} target="_blank" rel="noopener noreferrer">
                      <motion.div
                        className="absolute bottom-4 sm:bottom-6 ltr:right-4 ltr:sm:right-6 rtl:left-4 rtl:sm:left-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center glassmorphism-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 cursor-pointer"
                        whileHover={{ scale: 1.1, rotate: 45 }}
                      >
                        <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </motion.div>
                    </Link>
                  ) : (
                    <motion.div
                      className="absolute bottom-4 sm:bottom-6 ltr:right-4 ltr:sm:right-6 rtl:left-4 rtl:sm:left-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center glassmorphism-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"
                    >
                      <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </motion.div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">

                  <h3
                    className="mb-2 text-lg sm:text-xl"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    {title}
                  </h3>
                  {/* Category Tags */}
                  {company.categories && company.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {company.categories.map((category) => (
                        <Badge
                          key={category.id}
                          variant="secondary"
                          className={`bg-gradient-to-r   text-white border-none transition-shadow duration-300`}
                          style={{
                            background: `linear-gradient(135deg, 
                                var(--theme-primary) 0%, 
                                var(--theme-secondary) 100%)`,
                          }}
                        >
                          {getCategoryName(category)}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p
                    className="text-sm sm:text-base"
                    style={{ color: "var(--theme-text-secondary)" }}
                  >
                    {description}
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
            );
          })}
        </div>
      </div>

      {limit <= 6 && <div className="text-center pt-20">
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
      </div>}
    </section>
  );
}
