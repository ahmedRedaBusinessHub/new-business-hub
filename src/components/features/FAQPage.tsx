"use client";
import { useState } from "react";
import { motion } from "motion/react";
import {
  HelpCircle,
  Plus,
  Minus,
  Search,
  MessageCircle,
  Phone,
  Mail,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/hooks/useI18n";

export default function FAQPage() {
  const { t, language } = useI18n("faq");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const contactIcons = [MessageCircle, Phone, Mail];
  const contactGradients = [
    "from-[#0D5BDC] to-[#4587F4]",
    "from-[#340F87] to-[#0E3F9F]",
    "from-[#00B0F0] to-[#007D9B]",
  ];

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Get all FAQ items from translations
  const allFaqs = Array.from({ length: 13 }).map((_, index) => ({
    category: t(`items.${index}.category`),
    question: t(`items.${index}.question`),
    answer: t(`items.${index}.answer`),
  }));

  const filteredFaqs = allFaqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      className="min-h-screen bg-white"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0D5BDC] via-[#340F87] to-[#0A2F78]">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 ltr:left-1/4 rtl:right-1/4 w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--theme-primary) 30%, transparent)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 ltr:right-1/4 rtl:left-1/4 w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--theme-secondary) 30%, transparent)",
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphism mb-6"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-white text-sm">{t("hero.badge")}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-white text-4xl sm:text-5xl md:text-7xl mb-6"
          >
            {t("hero.title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-white/90 text-lg sm:text-xl max-w-2xl mx-auto mb-8"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="max-w-2xl mx-auto relative"
          >
            <Search
              className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 ${
                language === "ar" ? "right-4" : "left-4"
              }`}
            />
            <Input
              type="text"
              placeholder={t("hero.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`h-14 text-lg glassmorphism border-white/30 text-white placeholder:text-white/60 ${
                language === "ar" ? "pr-12" : "pl-12"
              }`}
            />
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-[#F2F2F2]">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {Array.from({ length: 6 }).map((_, index) => {
              const categoryId = t(`categories.${index}.id`);
              return (
                <Button
                  key={categoryId}
                  variant={
                    activeCategory === categoryId ? "default" : "outline"
                  }
                  onClick={() => setActiveCategory(categoryId)}
                  className={`px-6 py-2 rounded-full transition-all duration-300 ${
                    activeCategory === categoryId
                      ? "bg-gradient-to-r from-[#0D5BDC] to-[#340F87] text-white border-0"
                      : "bg-white text-[#262626] border-[#0D5BDC]/20 hover:border-[#0D5BDC]/50"
                  }`}
                >
                  {t(`categories.${index}.name`)}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgb(13 91 220 / 0.15) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#262626]/70">{t("noResults")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div
                    className={`relative p-6 rounded-2xl bg-gradient-to-br from-[#F2F2F2] to-white border cursor-pointer transition-all duration-300 ${
                      openItems.includes(index)
                        ? "border-[#0D5BDC] shadow-lg"
                        : "border-[#F2F2F2] hover:border-[#0D5BDC]/30"
                    }`}
                    onClick={() => toggleItem(index)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg text-[#262626] flex-1">
                        {faq.question}
                      </h3>
                      <motion.div
                        animate={{
                          rotate: openItems.includes(index) ? 180 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0"
                      >
                        {openItems.includes(index) ? (
                          <Minus className="w-5 h-5 text-[#0D5BDC]" />
                        ) : (
                          <Plus className="w-5 h-5 text-[#262626]/60" />
                        )}
                      </motion.div>
                    </div>

                    <motion.div
                      initial={false}
                      animate={{
                        height: openItems.includes(index) ? "auto" : 0,
                        opacity: openItems.includes(index) ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-[#262626]/70 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-20 bg-[#F2F2F2] relative overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="mb-4 text-[#262626]">{t("contact.title")}</h2>
            <p className="text-[#262626]/70 text-lg">{t("contact.subtitle")}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {contactIcons.map((Icon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className="relative h-full p-8 rounded-3xl bg-gradient-to-br from-[#F2F2F2] to-white border border-[#F2F2F2] hover:border-transparent transition-all duration-500 overflow-hidden text-center">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${contactGradients[index]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  ></div>
                  <div className="absolute inset-0 backdrop-blur-0 group-hover:backdrop-blur-sm transition-all duration-500"></div>

                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${contactGradients[index]} mb-4`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className="mb-2 text-[#262626] group-hover:text-white transition-colors duration-300">
                      {t(`contact.methods.${index}.title`)}
                    </h3>

                    <p className="text-[#262626]/70 group-hover:text-white/90 transition-colors duration-300">
                      {t(`contact.methods.${index}.description`)}
                    </p>
                  </div>

                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl"></div>
                </div>

                <div
                  className={`absolute inset-0 bg-gradient-to-br ${contactGradients[index]} opacity-0 group-hover:opacity-30 blur-2xl -z-10 transition-opacity duration-500`}
                ></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
