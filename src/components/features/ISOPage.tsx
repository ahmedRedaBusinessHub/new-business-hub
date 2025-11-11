"use client";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Award,
  Building2,
  Users,
  TrendingUp,
  CheckCircle2,
  Shield,
  Leaf,
  AlertCircle,
  Lock,
  Utensils,
  Zap,
  ArrowRight,
  Send,
  Building,
  User,
  Mail,
  Phone,
  Briefcase,
  Hash,
  Factory,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useI18n } from "@/hooks/useI18n";

export default function ISOPage() {
  const { t, language } = useI18n();
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    position: "",
    email: "",
    phone: "",
    isoType: "",
    employees: "",
    industry: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isoTypes = [
    {
      value: "iso-9001",
      icon: Award,
      label: t("iso_types_9001_title"),
      desc: t("iso_types_9001_desc"),
    },
    {
      value: "iso-14001",
      icon: Leaf,
      label: t("iso_types_14001_title"),
      desc: t("iso_types_14001_desc"),
    },
    {
      value: "iso-45001",
      icon: Shield,
      label: t("iso_types_45001_title"),
      desc: t("iso_types_45001_desc"),
    },
    {
      value: "iso-27001",
      icon: Lock,
      label: t("iso_types_27001_title"),
      desc: t("iso_types_27001_desc"),
    },
    {
      value: "iso-22000",
      icon: Utensils,
      label: t("iso_types_22000_title"),
      desc: t("iso_types_22000_desc"),
    },
    {
      value: "iso-50001",
      icon: Zap,
      label: t("iso_types_50001_title"),
      desc: t("iso_types_50001_desc"),
    },
  ];

  const importanceItems = [
    {
      icon: Building2,
      title: t("iso_importance_companies_title"),
      desc: t("iso_importance_companies_desc"),
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Building,
      title: t("iso_importance_institutions_title"),
      desc: t("iso_importance_institutions_desc"),
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Users,
      title: t("iso_importance_individuals_title"),
      desc: t("iso_importance_individuals_desc"),
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: TrendingUp,
      title: t("iso_importance_market_title"),
      desc: t("iso_importance_market_desc"),
      gradient: "from-green-500 to-teal-500",
    },
  ];

  const benefits = [
    t("iso_benefits_1"),
    t("iso_benefits_2"),
    t("iso_benefits_3"),
    t("iso_benefits_4"),
    t("iso_benefits_5"),
    t("iso_benefits_6"),
  ];

  const processSteps = [
    {
      title: t("iso_process_step1_title"),
      desc: t("iso_process_step1_desc"),
      icon: AlertCircle,
    },
    {
      title: t("iso_process_step2_title"),
      desc: t("iso_process_step2_desc"),
      icon: CheckCircle2,
    },
    {
      title: t("iso_process_step3_title"),
      desc: t("iso_process_step3_desc"),
      icon: Award,
    },
    {
      title: t("iso_process_step4_title"),
      desc: t("iso_process_step4_desc"),
      icon: Shield,
    },
    {
      title: t("iso_process_step5_title"),
      desc: t("iso_process_step5_desc"),
      icon: CheckCircle2,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.company ||
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.isoType
    ) {
      toast.error(t("Pleasefillallfields"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error(t("Invalid email address"));
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      toast.success(t("iso_booking_success"));
      setFormData({
        company: "",
        name: "",
        position: "",
        email: "",
        phone: "",
        isoType: "",
        employees: "",
        industry: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--theme-bg-primary)" }}
    >
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 20%, var(--theme-primary) 0%, transparent 50%),
                               radial-gradient(circle at 70% 80%, var(--theme-accent) 0%, transparent 50%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(var(--theme-text-primary) 1px, transparent 1px),
                linear-gradient(90deg, var(--theme-text-primary) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <motion.div
          className="absolute top-40 ltr:left-[10%] rtl:right-[10%] w-96 h-96 rounded-full opacity-20 blur-[100px]"
          style={{ backgroundColor: "var(--theme-primary)" }}
          animate={{
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 glassmorphism"
            >
              <Award
                className="w-4 h-4"
                style={{ color: "var(--theme-accent)" }}
              />
              <span style={{ color: "var(--theme-text-primary)" }}>
                {t("iso_hero_badge")}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl leading-20 md:text-6xl lg:text-7xl mb-6 bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, var(--theme-text-primary), var(--theme-primary))`,
              }}
            >
              {t("iso_hero_title")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl sm:text-2xl mb-10 max-w-3xl mx-auto"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {t("iso_hero_subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={() => {
                  document
                    .getElementById("booking-form")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-white border-0 relative overflow-hidden group px-8 py-6 text-lg"
                style={{
                  backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
                }}
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    backgroundImage: `linear-gradient(to right, var(--theme-gradient-mid), var(--theme-gradient-end))`,
                  }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  {t("iso_booking_badge")}
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What is ISO Section */}
      <section className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 glassmorphism">
                <AlertCircle
                  className="w-4 h-4"
                  style={{ color: "var(--theme-accent)" }}
                />
                <span style={{ color: "var(--theme-text-primary)" }}>
                  {t("iso_what_badge")}
                </span>
              </div>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl leading-20 mb-6"
                style={{ color: "var(--theme-text-primary)" }}
              >
                {t("iso_what_title")}
              </h2>
            </div>

            <div className="p-8 sm:p-10 rounded-3xl glassmorphism">
              <p
                className="text-lg sm:text-xl leading-relaxed"
                style={{ color: "var(--theme-text-secondary)" }}
              >
                {t("iso_what_desc")}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Importance Section */}
      <section className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 glassmorphism"
            >
              <CheckCircle2
                className="w-4 h-4"
                style={{ color: "var(--theme-accent)" }}
              />
              <span style={{ color: "var(--theme-text-primary)" }}>
                {t("iso_importance_badge")}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl leading-20 mb-4"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {t("iso_importance_title")}
            </motion.h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {importanceItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="p-6 rounded-2xl glassmorphism text-center"
              >
                <div
                  className="w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center"
                  style={{
                    backgroundImage: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent))`,
                  }}
                >
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3
                  className="text-xl mb-3"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  {item.title}
                </h3>
                <p style={{ color: "var(--theme-text-secondary)" }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ISO Types Section */}
      <section className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 glassmorphism"
            >
              <Award
                className="w-4 h-4"
                style={{ color: "var(--theme-accent)" }}
              />
              <span style={{ color: "var(--theme-text-primary)" }}>
                {t("iso_types_badge")}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl leading-20 mb-4"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {t("iso_types_title")}
            </motion.h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {isoTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="p-8 rounded-2xl glassmorphism group cursor-pointer"
              >
                <div
                  className="w-14 h-14 rounded-xl mb-4 flex items-center justify-center"
                  style={{
                    backgroundImage: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent))`,
                  }}
                >
                  <type.icon className="w-7 h-7 text-white" />
                </div>
                <h3
                  className="text-2xl mb-2"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  {type.label}
                </h3>
                <p style={{ color: "var(--theme-text-secondary)" }}>
                  {type.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 glassmorphism"
            >
              <TrendingUp
                className="w-4 h-4"
                style={{ color: "var(--theme-accent)" }}
              />
              <span style={{ color: "var(--theme-text-primary)" }}>
                {t("iso_importance_badge")}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl leading-20 mb-4"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {t("iso_importance_title")}
            </motion.h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-6 rounded-2xl glassmorphism"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                  style={{
                    backgroundImage: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent))`,
                  }}
                >
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <p
                  className="text-lg"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  {benefit}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 glassmorphism"
            >
              <ArrowRight
                className="w-4 h-4"
                style={{ color: "var(--theme-accent)" }}
              />
              <span style={{ color: "var(--theme-text-primary)" }}>
                {t("iso_process_badge")}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl leading-20 mb-4"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {t("iso_process_title")}
            </motion.h2>
          </div>

          <div className="max-w-5xl mx-auto">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: language === "ar" ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Connector Line */}
                {index < processSteps.length - 1 && (
                  <div
                    className="absolute top-16 ltr:left-7 rtl:right-7 w-0.5 h-20 opacity-30"
                    style={{ backgroundColor: "var(--theme-primary)" }}
                  />
                )}

                <div className="flex items-start gap-6 mb-8">
                  <div className="relative">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10"
                      style={{
                        backgroundImage: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent))`,
                      }}
                    >
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                    <div
                      className="absolute inset-0 rounded-xl blur-lg opacity-50"
                      style={{
                        backgroundColor: "var(--theme-primary)",
                      }}
                    />
                  </div>

                  <div className="flex-1 pt-2">
                    <div className="p-6 rounded-2xl glassmorphism">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="text-2xl opacity-50"
                          style={{ color: "var(--theme-accent)" }}
                        >
                          {(index + 1).toString().padStart(2, "0")}
                        </span>
                        <h3
                          className="text-xl"
                          style={{ color: "var(--theme-text-primary)" }}
                        >
                          {step.title}
                        </h3>
                      </div>
                      <p style={{ color: "var(--theme-text-secondary)" }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking-form" className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 glassmorphism"
            >
              <Send
                className="w-4 h-4"
                style={{ color: "var(--theme-accent)" }}
              />
              <span style={{ color: "var(--theme-text-primary)" }}>
                {t("iso_booking_badge")}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl leading-20 mb-4"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {t("iso_booking_title")}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg sm:text-xl max-w-2xl mx-auto"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {t("iso_booking_subtitle")}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative p-8 sm:p-10 rounded-3xl glassmorphism">
              <div
                className="absolute inset-0 rounded-3xl opacity-50 -z-10"
                style={{
                  background: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent))`,
                  filter: "blur(20px)",
                }}
              />

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Company Name */}
                  <div className="space-y-2 sm:col-span-2">
                    <Label
                      htmlFor="company"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      {t("iso_booking_company")}
                      <span className="text-red-500 ltr:ml-1 rtl:mr-1">*</span>
                    </Label>
                    <div className="relative">
                      <Building className="absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 w-5 h-5 text-gray-400" />
                      <Input
                        id="company"
                        type="text"
                        placeholder={t("iso_booking_company")}
                        value={formData.company}
                        onChange={(e: any) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        className="ltr:pl-10 rtl:pr-10 glassmorphism border-white/20"
                        style={{ color: "var(--theme-text-primary)" }}
                      />
                    </div>
                  </div>

                  {/* Contact Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      {t("iso_booking_name")}
                      <span className="text-red-500 ltr:ml-1 rtl:mr-1">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 w-5 h-5 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder={t("iso_booking_name")}
                        value={formData.name}
                        onChange={(e: any) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="ltr:pl-10 rtl:pr-10 glassmorphism border-white/20"
                        style={{ color: "var(--theme-text-primary)" }}
                      />
                    </div>
                  </div>

                  {/* Position */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="position"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      {t("iso_booking_position")}
                    </Label>
                    <div className="relative">
                      <Briefcase className="absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 w-5 h-5 text-gray-400" />
                      <Input
                        id="position"
                        type="text"
                        placeholder={t("iso_booking_position")}
                        value={formData.position}
                        onChange={(e: any) =>
                          setFormData({ ...formData, position: e.target.value })
                        }
                        className="ltr:pl-10 rtl:pr-10 glassmorphism border-white/20"
                        style={{ color: "var(--theme-text-primary)" }}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      {t("iso_booking_email")}
                      <span className="text-red-500 ltr:ml-1 rtl:mr-1">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={t("iso_booking_email")}
                        value={formData.email}
                        onChange={(e: any) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="ltr:pl-10 rtl:pr-10 glassmorphism border-white/20"
                        style={{ color: "var(--theme-text-primary)" }}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      {t("iso_booking_phone")}
                      <span className="text-red-500 ltr:ml-1 rtl:mr-1">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 w-5 h-5 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder={t("iso_booking_phone")}
                        value={formData.phone}
                        onChange={(e: any) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="ltr:pl-10 rtl:pr-10 glassmorphism border-white/20"
                        style={{ color: "var(--theme-text-primary)" }}
                      />
                    </div>
                  </div>

                  {/* ISO Type */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="isoType"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      {t("iso_booking_isoType")}
                      <span className="text-red-500 ltr:ml-1 rtl:mr-1">*</span>
                    </Label>
                    <Select
                      value={formData.isoType}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, isoType: value })
                      }
                    >
                      <SelectTrigger
                        className="glassmorphism border-white/20"
                        style={{ color: "var(--theme-text-primary)" }}
                      >
                        <SelectValue placeholder={t("iso_booking_isoType")} />
                      </SelectTrigger>
                      <SelectContent>
                        {isoTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Number of Employees */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="employees"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      {t("iso_booking_employees")}
                    </Label>
                    <div className="relative">
                      <Hash className="absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 w-5 h-5 text-gray-400" />
                      <Input
                        id="employees"
                        type="text"
                        placeholder={t("iso_booking_employees")}
                        value={formData.employees}
                        onChange={(e: any) =>
                          setFormData({
                            ...formData,
                            employees: e.target.value,
                          })
                        }
                        className="ltr:pl-10 rtl:pr-10 glassmorphism border-white/20"
                        style={{ color: "var(--theme-text-primary)" }}
                      />
                    </div>
                  </div>

                  {/* Industry */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="industry"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      {t("iso_booking_industry")}
                    </Label>
                    <div className="relative">
                      <Factory className="absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 w-5 h-5 text-gray-400" />
                      <Input
                        id="industry"
                        type="text"
                        placeholder={t("iso_booking_industry")}
                        value={formData.industry}
                        onChange={(e: any) =>
                          setFormData({ ...formData, industry: e.target.value })
                        }
                        className="ltr:pl-10 rtl:pr-10 glassmorphism border-white/20"
                        style={{ color: "var(--theme-text-primary)" }}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2 sm:col-span-2">
                    <Label
                      htmlFor="message"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      {t("iso_booking_message")}
                    </Label>
                    <Textarea
                      id="message"
                      placeholder={t("iso_booking_message")}
                      value={formData.message}
                      onChange={(e: any) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      rows={4}
                      className="glassmorphism border-white/20 resize-none"
                      style={{ color: "var(--theme-text-primary)" }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-white border-0 relative overflow-hidden group py-6"
                    style={{
                      backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        backgroundImage: `linear-gradient(to right, var(--theme-gradient-mid), var(--theme-gradient-end))`,
                      }}
                    />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        t("Sending")
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          {t("iso_booking_submit")}
                        </>
                      )}
                    </span>
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
