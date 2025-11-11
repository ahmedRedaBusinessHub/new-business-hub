"use client";
import { motion } from "motion/react";
import { useI18n } from "@/hooks/useI18n";
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
import { Mail, Phone, MapPin, Send, User, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function ContactSection() {
  const { t, language } = useI18n("contact");
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    inquiryType: "",
    details: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.name ||
      !formData.mobile ||
      !formData.email ||
      !formData.inquiryType ||
      !formData.details
    ) {
      toast.error(t("form.validation.allFieldsRequired"));
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error(t("form.validation.invalidEmail"));
      return;
    }

    // Mobile validation (Saudi format)
    const mobileRegex = /^(05|5)[0-9]{8}$/;
    if (!mobileRegex.test(formData.mobile.replace(/\s/g, ""))) {
      toast.error(t("form.validation.invalidMobile"));
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success(t("form.success"));
      setFormData({
        name: "",
        mobile: "",
        email: "",
        inquiryType: "",
        details: "",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section
      id="contact"
      className="relative pb-16 pt-35 sm:pb-24 overflow-hidden"
      style={{ backgroundColor: "var(--theme-bg-primary)" }}
    >
      {/* Gradient Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, var(--theme-primary) 0%, transparent 50%),
                           radial-gradient(circle at 80% 50%, var(--theme-accent) 0%, transparent 50%)`,
        }}
      />

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 ltr:left-10 rtl:right-10 w-full h-72 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: "var(--theme-primary)" }}
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 ltr:right-10 rtl:left-10 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: "var(--theme-accent)" }}
        animate={{
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glassmorphism mb-6"
          >
            <MessageSquare
              className="w-4 h-4"
              style={{ color: "var(--theme-accent)" }}
            />
            <span style={{ color: "var(--theme-text-primary)" }}>
              {t("badge")}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl leading-20 mb-4"
            style={{ color: "var(--theme-text-primary)" }}
          >
            {t("title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl max-w-2xl mx-auto"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            {t("subtitle")}
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: language === "ar" ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative p-8 sm:p-10 rounded-3xl glassmorphism">
              {/* Gradient Border */}
              <div
                className="absolute inset-0 rounded-3xl opacity-50 -z-10"
                style={{
                  background: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent))`,
                  filter: "blur(20px)",
                }}
              />

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    {t("form.labels.fullName")}
                    <span className="text-red-500 ltr:ml-1 rtl:mr-1">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 w-5 h-5 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder={t("form.placeholders.fullName")}
                      value={formData.name}
                      onChange={(e: any) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="ltr:pl-10 rtl:pr-10 glassmorphism border-white/20"
                      style={{ color: "var(--theme-text-primary)" }}
                    />
                  </div>
                </div>

                {/* Mobile Number Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="mobile"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    {t("form.labels.mobileNumber")}
                    <span className="text-red-500 ltr:ml-1 rtl:mr-1">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 w-5 h-5 text-gray-400" />
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder={t("form.placeholders.mobileNumber")}
                      value={formData.mobile}
                      onChange={(e: any) =>
                        setFormData({ ...formData, mobile: e.target.value })
                      }
                      className="ltr:pl-10 rtl:pr-10 glassmorphism border-white/20"
                      style={{ color: "var(--theme-text-primary)" }}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    {t("form.labels.email")}
                    <span className="text-red-500 ltr:ml-1 rtl:mr-1">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("form.placeholders.email")}
                      value={formData.email}
                      onChange={(e: any) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="ltr:pl-10 rtl:pr-10 glassmorphism border-white/20"
                      style={{ color: "var(--theme-text-primary)" }}
                    />
                  </div>
                </div>

                {/* Inquiry Type Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="inquiryType"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    {t("form.labels.inquiryType")}
                    <span className="text-red-500 ltr:ml-1 rtl:mr-1">*</span>
                  </Label>
                  <Select
                    value={formData.inquiryType}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, inquiryType: value })
                    }
                  >
                    <SelectTrigger
                      className="glassmorphism border-white/20"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      <SelectValue
                        placeholder={t("form.placeholders.inquiryType")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <SelectItem
                          key={t(`inquiryTypes.${index}.value`)}
                          value={t(`inquiryTypes.${index}.value`)}
                        >
                          {t(`inquiryTypes.${index}.label`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Request Details Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="details"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    {t("form.labels.requestDetails")}
                    <span className="text-red-500 ltr:ml-1 rtl:mr-1">*</span>
                  </Label>
                  <Textarea
                    id="details"
                    placeholder={t("form.placeholders.requestDetails")}
                    value={formData.details}
                    onChange={(e: any) =>
                      setFormData({ ...formData, details: e.target.value })
                    }
                    rows={5}
                    className="glassmorphism border-white/20 resize-none"
                    style={{ color: "var(--theme-text-primary)" }}
                  />
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
                        t("form.buttons.sending")
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          {t("form.buttons.send")}
                        </>
                      )}
                    </span>
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: language === "ar" ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center space-y-8"
          >
            {/* Contact Cards */}
            <div className="space-y-6">
              {/* Phone Card */}
              <motion.div
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl glassmorphism"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundImage: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent))`,
                    }}
                  >
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3
                      className="text-lg mb-2"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      {t("info.phone.title")}
                    </h3>
                    <a
                      href={`tel:${process.env.NEXT_PUBLIC_PHONE}`}
                      className="text-lg hover:underline"
                      style={{ color: "var(--theme-accent)" }}
                    >
                      {process.env.NEXT_PUBLIC_PHONE}
                    </a>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "var(--theme-text-secondary)" }}
                    >
                      {t("info.phone.hours")}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Email Card */}
              <motion.div
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl glassmorphism"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundImage: `linear-gradient(135deg, var(--theme-accent), var(--theme-primary))`,
                    }}
                  >
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3
                      className="text-lg mb-2"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      {t("info.email.title")}
                    </h3>
                    <p
                      onClick={() => {
                        window.open(`mailto:${process.env.NEXT_PUBLIC_EMAIL}`);
                      }}
                      className="cursor-pointer text-lg hover:underline"
                      style={{ color: "var(--theme-accent)" }}
                    >
                      {process.env.NEXT_PUBLIC_EMAIL}
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "var(--theme-text-secondary)" }}
                    >
                      {t("info.email.response")}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Address Card */}
              <motion.div
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl glassmorphism"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundImage: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent-light))`,
                    }}
                  >
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3
                      className="text-lg mb-2"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      {t("info.location.title")}
                    </h3>
                    <p
                      onClick={() => {
                        window.open(process.env.NEXT_PUBLIC_MAP_URL);
                      }}
                      className="cursor-pointer text-lg"
                      style={{ color: "var(--theme-accent)" }}
                    >
                      {t("info.location.city")}
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "var(--theme-text-secondary)" }}
                    >
                      {t("info.location.country")}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Working Hours Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl"
              style={{
                backgroundImage: `linear-gradient(135deg, 
                  color-mix(in srgb, var(--theme-primary) 10%, transparent), 
                  color-mix(in srgb, var(--theme-accent) 10%, transparent))`,
                border: "1px solid",
                borderColor: "var(--theme-border)",
              }}
            >
              <h3
                className="text-lg mb-4"
                style={{ color: "var(--theme-text-primary)" }}
              >
                {t("info.workingHours.title")}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span style={{ color: "var(--theme-text-secondary)" }}>
                    {t("info.workingHours.weekdays")}
                  </span>
                  <span style={{ color: "var(--theme-text-primary)" }}>
                    {t("info.workingHours.weekdaysTime")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: "var(--theme-text-secondary)" }}>
                    {t("info.workingHours.weekend")}
                  </span>
                  <span style={{ color: "var(--theme-text-primary)" }}>
                    {t("info.workingHours.closed")}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
