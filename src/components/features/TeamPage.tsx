"use client";
import { motion } from "motion/react";
import {
  Mail,
  Linkedin,
  Phone,
  MapPin,
  Award,
  Users,
  Target,
  Briefcase,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { useI18n } from "@/hooks/useI18n";
import x from "@/assets/images/Tariq Zeyad Afandi.jpg";
import x2 from "@/assets/images/WhatsApp Image 2025-11-09 at 08.40.27.jpeg";
import Ibrahim from "@/assets/images/Ibrahim.png";
import Ahmad from "@/assets/images/Ahmad Yousef.jpg";
import Jomaa from "@/assets/images/Ahmad Jomaa.png";
import Almutairy from "@/assets/images/Muhammad Almutairy ai enhanced transparent.png";

import Nadia from "@/assets/images/Nadia.png";
import Woman from "@/assets/images/Woman Placeholder.png";
import Safia from "@/assets/images/Safia.png";
import Ohoud from "@/assets/images/Ohoud Transparent.png";

import Yousuf from "@/assets/images/Yousuf Hamza Sheikh Transparent.png";
import Essa from "@/assets/images/Essa Bazzari Transparent.png";

export default function TeamPage() {
  const { t } = useI18n("team");

  const statIcons = [Users, Award, Target, Briefcase];
  const statColors = [
    "var(--theme-primary)",
    "var(--theme-accent)",
    "var(--theme-secondary)",
    "var(--theme-accent-light)",
  ];

  const executiveImages = [x2.src, x.src];

  const managementImages = [Almutairy.src, Jomaa.src, Ahmad.src, Ibrahim.src];

  const departmentImages = [
    Yousuf.src,
    Essa.src,
    Woman.src,
    Safia.src,
    Nadia.src,
    Ohoud.src,
  ];

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: "var(--theme-bg-primary)" }}
    >
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 ltr:right-0 rtl:left-0 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: "var(--theme-primary)" }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-0 ltr:left-0 rtl:right-0 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: "var(--theme-accent)" }}
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.2, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphism mb-6"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--theme-primary) 10%, transparent)",
              }}
            >
              <Users
                className="w-5 h-5"
                style={{ color: "var(--theme-primary)" }}
              />
              <span style={{ color: "var(--theme-text-primary)" }}>
                {t("badge")}
              </span>
            </motion.div>

            <h1
              className="text-4xl sm:text-5xl leading-20 md:text-6xl lg:text-7xl mb-6"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {t("title")}
            </h1>

            <p
              className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-12"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {t("subtitle")}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto"
          >
            {statIcons.map((Icon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="glassmorphism p-6 rounded-2xl text-center"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--theme-bg-secondary) 80%, transparent)",
                }}
              >
                <Icon
                  className="w-8 h-8 mx-auto mb-3"
                  style={{ color: statColors[index] }}
                />
                <div
                  className="text-3xl sm:text-4xl mb-2"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  {t(`stats.${index}.value`)}
                </div>
                <div
                  className="text-sm"
                  style={{ color: "var(--theme-text-secondary)" }}
                >
                  {t(`stats.${index}.label`)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Executive Team */}
      <section
        className="py-16 sm:py-24 lg:py-32"
        style={{ backgroundColor: "var(--theme-bg-secondary)" }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl leading-20 mb-4"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {t("executive.title")}
            </h2>
            <p
              className="text-lg sm:text-xl max-w-3xl mx-auto"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {t("executive.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2   gap-6 lg:gap-8">
            {executiveImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className="group overflow-hidden border-0 transition-all duration-500 hover:scale-105  "
                  style={{
                    backgroundColor: "var(--theme-bg-primary)",
                    boxShadow:
                      "0 10px 40px color-mix(in srgb, var(--theme-primary) 10%, transparent)",
                  }}
                >
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={image}
                      alt={t(`executive.members.${index}.name`)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        backgroundImage: `linear-gradient(to top, var(--theme-primary), transparent)`,
                      }}
                    />
                  </div>

                  <div className="p-6">
                    <h3
                      className="text-xl sm:text-2xl mb-2"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      {t(`executive.members.${index}.name`)}
                    </h3>
                    <p
                      className="mb-4"
                      style={{ color: "var(--theme-primary)" }}
                    >
                      {t(`executive.members.${index}.position`)}
                    </p>
                    <p
                      className="text-sm mb-4"
                      style={{ color: "var(--theme-text-secondary)" }}
                    >
                      {t(`executive.members.${index}.bio`)}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          style={{
                            backgroundColor:
                              "color-mix(in srgb, var(--theme-primary) 15%, transparent)",
                            color: "var(--theme-primary)",
                          }}
                        >
                          {t(`executive.members.${index}.specialties.${i}`)}
                        </Badge>
                      ))}
                    </div>

                    {/* <div className="flex flex-col gap-2 text-sm">
                      <a
                        href={`mailto:${t(`executive.members.${index}.email`)}`}
                        className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                        style={{ color: "var(--theme-text-secondary)" }}
                      >
                        <Mail className="w-4 h-4" />
                        <span className="truncate">
                          {t(`executive.members.${index}.email`)}
                        </span>
                      </a>
                      <a
                        href={`tel:${t(`executive.members.${index}.phone`)}`}
                        className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                        style={{ color: "var(--theme-text-secondary)" }}
                      >
                        <Phone className="w-4 h-4" />
                        <span>{t(`executive.members.${index}.phone`)}</span>
                      </a>
                      <a
                        href="#"
                        className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                        style={{ color: "var(--theme-text-secondary)" }}
                      >
                        <Linkedin className="w-4 h-4" />
                        <span>LinkedIn</span>
                      </a>
                    </div> */}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Management Team */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl leading-20 mb-4"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {t("management.title")}
            </h2>
            <p
              className="text-lg sm:text-xl max-w-3xl mx-auto"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {t("management.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {managementImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className="group overflow-hidden border-0 transition-all duration-500 hover:scale-105 h-full"
                  style={{
                    backgroundColor: "var(--theme-bg-secondary)",
                    boxShadow:
                      "0 10px 40px color-mix(in srgb, var(--theme-accent) 10%, transparent)",
                  }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={image}
                      alt={t(`management.members.${index}.name`)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        backgroundImage: `linear-gradient(to top, var(--theme-accent), transparent)`,
                      }}
                    />
                  </div>

                  <div className="p-5">
                    <Badge
                      className="mb-3"
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--theme-accent) 15%, transparent)",
                        color: "var(--theme-accent)",
                      }}
                    >
                      {t(`management.members.${index}.department`)}
                    </Badge>

                    <h3
                      className="text-lg sm:text-xl mb-2"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      {t(`management.members.${index}.name`)}
                    </h3>
                    <p
                      className="text-sm mb-4"
                      style={{ color: "var(--theme-text-secondary)" }}
                    >
                      {t(`management.members.${index}.position`)}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            backgroundColor:
                              "color-mix(in srgb, var(--theme-primary) 10%, transparent)",
                            color: "var(--theme-text-secondary)",
                          }}
                        >
                          {t(`management.members.${index}.specialties.${i}`)}
                        </span>
                      ))}
                    </div>

                    {/* <a
                      href={`mailto:${t(`management.members.${index}.email`)}`}
                      className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
                      style={{ color: "var(--theme-text-secondary)" }}
                    >
                      <Mail className="w-4 h-4" />
                      <span className="truncate">
                        {t(`management.members.${index}.email`)}
                      </span>
                    </a> */}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Department Heads */}
      <section
        className="py-16 sm:py-24 lg:py-32"
        style={{ backgroundColor: "var(--theme-bg-secondary)" }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl leading-20 mb-4"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {t("departmentHeads.title")}
            </h2>
            <p
              className="text-lg sm:text-xl max-w-3xl mx-auto"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {t("departmentHeads.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {departmentImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4"
                >
                  <Avatar
                    className="w-32 h-32 mx-auto border-4 transition-all duration-300"
                    style={{ borderColor: "var(--theme-primary)" }}
                  >
                    <AvatarImage
                      src={image}
                      alt={t(`departmentHeads.members.${index}.name`)}
                    />
                    <AvatarFallback>
                      {t(`departmentHeads.members.${index}.name`).charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>

                <Badge
                  className="mb-2"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--theme-secondary) 15%, transparent)",
                    color: "var(--theme-secondary)",
                  }}
                >
                  {t(`departmentHeads.members.${index}.department`)}
                </Badge>

                <h3
                  className="text-lg mb-1"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  {t(`departmentHeads.members.${index}.name`)}
                </h3>
                <p
                  className="text-sm mb-3"
                  style={{ color: "var(--theme-text-secondary)" }}
                >
                  {t(`departmentHeads.members.${index}.position`)}
                </p>

                {/* <a
                  href={`mailto:${t(`departmentHeads.members.${index}.email`)}`}
                  className="inline-flex items-center gap-1 text-xs hover:opacity-70 transition-opacity"
                  style={{ color: "var(--theme-primary)" }}
                >
                  <Mail className="w-3 h-3" />
                  <span>{t("contact")}</span>
                </a> */}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent), var(--theme-secondary))`,
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl leading-20 mb-6"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {t("cta.title")}
            </h2>
            <p
              className="text-lg sm:text-xl mb-8"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {t("cta.subtitle")}
            </p>
            <Button
              size="lg"
              className="px-8 py-6 text-white border-0"
              style={{
                backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
                boxShadow:
                  "0 20px 60px color-mix(in srgb, var(--theme-primary) 30%, transparent)",
              }}
            >
              {t("cta.button")}
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
