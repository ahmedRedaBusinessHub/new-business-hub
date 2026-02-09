"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
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
import { useI18n } from "@/hooks/useI18n";
import DynamicForm from "../shared/DynamicForm";
import { z } from "zod";
// import { ProductFormPage } from "./TestForm";

const isoValidations = {
  company: z.string(),
  name: z.string(),
  position: z.string(),
  email: z.string(),
  phone: z.string(),
  isoType: z.string(),
  employees: z.string(),
  industry: z.string(),
  message: z.string(),
};
export default function ISOPage() {
  const { t, language } = useI18n();
  const [certificates, setCertificates] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/public/iso-companies')
      .then(res => res.json())
      .then(data => {
        if (data?.data) {
          setCertificates(data.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

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

  const handleSubmit = async (data: Record<string, any>) => {
    const response = await fetch('/api/public/iso-request', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(t("iso_booking_error"));
    }
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

      {/* Certificates Section */}
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
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="p-8 rounded-2xl glassmorphism group cursor-pointer flex flex-col items-center text-center"
              >
                <div
                  className="w-20 h-20 rounded-full mb-6 flex items-center justify-center overflow-hidden border-2 border-white/10"
                  style={{
                    backgroundColor: "var(--theme-primary)",
                  }}
                >
                  <Award className="w-8 h-8 text-white" />

                </div>
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  {cert.certificate_code}
                </h3>
                <div
                  className="px-3 py-1 rounded-full text-sm mb-4 bg-white/5"
                  style={{ color: "var(--theme-accent)" }}
                >
                  {language === 'ar' ? cert.certificate_name_ar : cert.certificate_name_en}
                </div>
                {/* <p style={{ color: "var(--theme-text-secondary)" }}>
                  {cert.company_name}
                </p> */}
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

              <DynamicForm
                config={[
                  {
                    name: "company",
                    label: t("iso_booking_company"),
                    type: "text",
                    placeholder: t("iso_booking_company"),
                    validation: isoValidations.company,
                    required: true,

                    colSize: {
                      desktop: 12,
                      tablet: 12,
                      mobile: 12,
                    },
                  },
                  {
                    name: "name",
                    label: t("iso_booking_name"),
                    type: "text",
                    placeholder: t("iso_booking_name"),
                    validation: isoValidations.name,
                    required: true,

                    colSize: {
                      desktop: 6,
                      tablet: 6,
                      mobile: 12,
                    },
                  },
                  {
                    name: "position",
                    label: t("iso_booking_position"),
                    type: "text",
                    placeholder: t("iso_booking_position"),
                    validation: isoValidations.position,
                    required: true,

                    colSize: {
                      desktop: 6,
                      tablet: 6,
                      mobile: 12,
                    },
                  },
                  {
                    name: "email",
                    label: t("iso_booking_email"),
                    type: "email",
                    placeholder: t("iso_booking_email"),
                    validation: isoValidations.email,
                    required: true,

                    colSize: {
                      desktop: 6,
                      tablet: 6,
                      mobile: 12,
                    },
                  },
                  {
                    name: "phone",
                    label: t("iso_booking_phone"),
                    type: "tel",
                    placeholder: t("iso_booking_phone"),
                    validation: isoValidations.phone,
                    required: true,

                    colSize: {
                      desktop: 6,
                      tablet: 6,
                      mobile: 12,
                    },
                  },
                  {
                    name: "isoType",
                    label: t("iso_booking_isoType"),
                    type: "select",
                    placeholder: t("iso_booking_isoType"),
                    validation: isoValidations.isoType,
                    options: isoTypes,
                    required: true,

                    colSize: {
                      desktop: 4,
                      tablet: 6,
                      mobile: 12,
                    },
                  },
                  {
                    name: "employees",
                    label: t("iso_booking_employees"),
                    type: "number",
                    placeholder: t("iso_booking_employees"),
                    validation: isoValidations.employees,
                    required: true,

                    colSize: {
                      desktop: 4,
                      tablet: 6,
                      mobile: 12,
                    },
                  },
                  {
                    name: "industry",
                    label: t("iso_booking_industry"),
                    type: "text",
                    placeholder: t("iso_booking_industry"),
                    validation: isoValidations.industry,
                    required: true,

                    colSize: {
                      desktop: 4,
                      tablet: 6,
                      mobile: 12,
                    },
                  },
                  {
                    name: "message",
                    label: t("iso_booking_message"),
                    type: "textarea",
                    placeholder: t("iso_booking_message"),
                    validation: isoValidations.message,
                    required: true,

                    colSize: {
                      desktop: 12,
                      tablet: 12,
                      mobile: 12,
                    },
                  },
                ]}
                onSubmit={handleSubmit}
                submitText={t("iso_booking_submit")}
                onSuccess={() => toast.success(t("iso_booking_success"))}
                className="space-y-6"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
