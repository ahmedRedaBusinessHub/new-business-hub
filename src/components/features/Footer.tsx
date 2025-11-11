"use client";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";
import { Separator } from "@/components/ui/Separator";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion } from "motion/react";
import Logo from "./Logo";
import Link from "next/link";
import { useI18n } from "@/hooks/useI18n";

interface FooterProps {}

export default function Footer({}: FooterProps) {
  const { t } = useI18n("footer");

  const socialLinks = [
    { icon: Facebook, href: process.env.NEXT_PUBLIC_LINKEDIN },
    { icon: Twitter, href: process.env.NEXT_PUBLIC_X },
    { icon: Instagram, href: process.env.NEXT_PUBLIC_INSTAGRAM },
    { icon: Linkedin, href: process.env.NEXT_PUBLIC_LINKEDIN },
  ];

  return (
    <footer
      className="relative text-white pt-12 sm:pt-20 pb-8 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom right, 
          color-mix(in srgb, var(--theme-text-primary) 90%, transparent), 
          color-mix(in srgb, var(--theme-primary-dark) 80%, transparent), 
          color-mix(in srgb, var(--theme-secondary) 90%, transparent))`,
      }}
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 ltr:left-20 rtl:right-20 w-48 h-48 sm:w-72 sm:h-72 rounded-full blur-3xl"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--theme-primary) 10%, transparent)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 ltr:right-20 rtl:left-20 w-48 h-48 sm:w-72 sm:h-72 rounded-full blur-3xl"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--theme-secondary) 10%, transparent)",
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.1, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Logo
                  className="w-12 h-12 sm:w-14 sm:h-14"
                  style={{ color: "white" }}
                />
                <div>
                  <span
                    className="text-xl sm:text-2xl bg-clip-text text-transparent block"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, white, rgba(255, 255, 255, 0.8))",
                    }}
                  >
                    {t("brand.nameAr")}
                  </span>
                  <span
                    className="text-xs hidden sm:block"
                    style={{
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {t("brand.name")}
                  </span>
                </div>
              </div>
              <p className="text-white/70 mb-6 leading-relaxed text-sm sm:text-base">
                {t("brand.tagline")}
              </p>
              <div className="hidden lg:block">
                {/* Newsletter */}
                <div className="mb-6">
                  <h4 className="text-white mb-3 text-sm sm:text-base">
                    {t("newsletter.title")}
                  </h4>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder={t("newsletter.placeholder")}
                      className="glassmorphism-dark border-white/20 text-white placeholder:text-white/50 text-sm"
                    />
                    <Button
                      size="icon"
                      className="flex-shrink-0 text-white border-0"
                      style={{
                        backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
                      }}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-3 flex-wrap">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl glassmorphism-dark flex items-center justify-center transition-all duration-300"
                      style={{
                        ["--tw-hover-bg" as string]: "var(--theme-primary)",
                      }}
                      onMouseEnter={(e: any) => {
                        e.currentTarget.style.background =
                          "var(--theme-primary)";
                      }}
                      onMouseLeave={(e: any) => {
                        e.currentTarget.style.background = "";
                      }}
                    >
                      <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Services Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="mb-4 sm:mb-6 text-white text-sm sm:text-base">
              {t("sections.services.title")}
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <li key={index}>
                  <Link
                    href={t(`sections.services.links.${index}.href`)}
                    className="text-white/70 hover:text-white ltr:hover:translate-x-1 rtl:hover:-translate-x-1 inline-block transition-all duration-300 text-sm"
                  >
                    {t(`sections.services.links.${index}.text`)}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="mb-4 sm:mb-6 text-white text-sm sm:text-base">
              {t("sections.company.title")}
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <li key={index}>
                  <Link
                    href={t(`sections.company.links.${index}.href`)}
                    className="text-white/70 hover:text-white ltr:hover:translate-x-1 rtl:hover:-translate-x-1 inline-block transition-all duration-300 text-sm"
                  >
                    {t(`sections.company.links.${index}.text`)}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="mb-4 sm:mb-6 text-white text-sm sm:text-base">
              {t("sections.contact.title")}
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-3 text-white/70 hover:text-white transition-colors duration-300 group">
                <MapPin
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 transition-colors"
                  style={{
                    ["--tw-group-hover-color" as string]:
                      "var(--theme-accent-light)",
                  }}
                  onMouseEnter={(e: any) => {
                    e.currentTarget.style.color = "var(--theme-accent-light)";
                  }}
                  onMouseLeave={(e: any) => {
                    e.currentTarget.style.color = "";
                  }}
                />
                <span
                  onClick={() => {
                    window.open(`${process.env.NEXT_PUBLIC_MAP_URL}`);
                  }}
                  className="cursor-pointer text-sm"
                >
                  {t("sections.contact.address")}
                </span>
              </li>
              <li className="flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-300 group">
                <Phone
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-colors"
                  onMouseEnter={(e: any) => {
                    e.currentTarget.style.color = "var(--theme-accent-light)";
                  }}
                  onMouseLeave={(e: any) => {
                    e.currentTarget.style.color = "";
                  }}
                />
                <span
                  dir="ltr"
                  onClick={() => {
                    window.open(`tel:${process.env.NEXT_PUBLIC_PHONE}`);
                  }}
                  className="cursor-pointer text-sm"
                >
                  {process.env.NEXT_PUBLIC_PHONE}
                </span>
              </li>
              <li className="flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-300 group">
                <Mail
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-colors"
                  onMouseEnter={(e: any) => {
                    e.currentTarget.style.color = "var(--theme-accent-light)";
                  }}
                  onMouseLeave={(e: any) => {
                    e.currentTarget.style.color = "";
                  }}
                />
                <span
                  onClick={() => {
                    window.open(`mailto:${process.env.NEXT_PUBLIC_EMAIL}`);
                  }}
                  className="cursor-pointer text-sm"
                >
                  {process.env.NEXT_PUBLIC_EMAIL}
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Mobile Newsletter & Social */}
        <div className="mb-6 lg:hidden">
          {/* Newsletter */}
          <div className="mb-6">
            <h4 className="text-white mb-3 text-sm sm:text-base">
              {t("newsletter.title")}
            </h4>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder={t("newsletter.placeholder")}
                className="glassmorphism-dark border-white/20 text-white placeholder:text-white/50 text-sm"
              />
              <Button
                size="icon"
                className="flex-shrink-0 text-white border-0"
                style={{
                  backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
                }}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-3 flex-wrap">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl glassmorphism-dark flex items-center justify-center transition-all duration-300"
                style={{
                  ["--tw-hover-bg" as string]: "var(--theme-primary)",
                }}
                onMouseEnter={(e: any) => {
                  e.currentTarget.style.background = "var(--theme-primary)";
                }}
                onMouseLeave={(e: any) => {
                  e.currentTarget.style.background = "";
                }}
              >
                <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.a>
            ))}
          </div>
        </div>

        <Separator className="bg-white/10 mb-6 sm:mb-8" />

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <p className="text-white/60 text-xs sm:text-sm text-center sm:text-left">
            {t("copyright")}
          </p>
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
            {Array.from({ length: 3 }).map((_, index) => (
              <Link
                key={index}
                href={t(`sections.legal.links.${index}.href`)}
                className="text-white/60 hover:text-white transition-colors text-xs sm:text-sm"
              >
                {t(`sections.legal.links.${index}.text`)}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
