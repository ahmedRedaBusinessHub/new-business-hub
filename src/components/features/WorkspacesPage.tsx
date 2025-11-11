"use client";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Building2,
  Users,
  Briefcase,
  Building,
  Shield,
  Droplet,
  Clock,
  Wifi,
  Printer,
  Archive,
  SignpostBig,
  Fingerprint,
  Check,
  X,
  Star,
  Phone,
  Calendar,
  MapPin,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/hooks/useI18n";

export default function WorkspacesPage() {
  const { t, language } = useI18n("workspaces");
  const [selectedService, setSelectedService] = useState<number | null>(null);

  const serviceIcons = [Users, Briefcase, Building2, Building];
  const serviceGradients = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-orange-500 to-red-500",
    "from-green-500 to-emerald-500",
  ];
  const serviceColors = ["#0EA5E9", "#A855F7", "#F97316", "#10B981"];

  const featureIcons = [
    Shield,
    Droplet,
    Clock,
    Wifi,
    Printer,
    Archive,
    SignpostBig,
    Fingerprint,
  ];
  const featureGradients = [
    "from-blue-500 to-cyan-500",
    "from-cyan-500 to-blue-400",
    "from-purple-500 to-pink-500",
    "from-orange-500 to-red-500",
    "from-green-500 to-emerald-500",
    "from-yellow-500 to-orange-500",
    "from-pink-500 to-rose-500",
    "from-indigo-500 to-purple-500",
  ];

  const statIcons = [Building2, Users, TrendingUp];

  // Feature mapping for services
  const serviceFeatures = [
    [
      { included: true, index: 1 },
      { included: true, index: 3 },
      { included: true, index: 4 },
      { included: false, index: 0 },
      { included: false, index: 2 },
      { included: false, index: 5 },
      { included: false, index: 6 },
      { included: false, index: 7 },
    ],
    [
      { included: true, index: 4 },
      { included: true, index: 6 },
      { included: false, index: 0 },
      { included: false, index: 1 },
      { included: false, index: 2 },
      { included: false, index: 3 },
      { included: false, index: 5 },
      { included: false, index: 7 },
    ],
    [
      { included: true, index: 0 },
      { included: true, index: 1 },
      { included: true, index: 2 },
      { included: true, index: 3 },
      { included: true, index: 4 },
      { included: true, index: 5 },
      { included: true, index: 6 },
      { included: false, index: 7 },
    ],
    [
      { included: true, index: 0 },
      { included: true, index: 1 },
      { included: true, index: 2 },
      { included: true, index: 3 },
      { included: true, index: 4 },
      { included: true, index: 5 },
      { included: true, index: 6 },
      { included: true, index: 7 },
    ],
  ];

  const handleBooking = (serviceName: string) => {
    window.open(
      "https://businesshub.mahjoz.net/ar/shrk-mltk-alaaamal-alabdaaay-llastthmar"
    );
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
          className="absolute top-40 ltr:right-[10%] rtl:left-[10%] w-96 h-96 rounded-full opacity-20 blur-[100px]"
          style={{ backgroundColor: "var(--theme-accent)" }}
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
              <Building2
                className="w-4 h-4"
                style={{ color: "var(--theme-accent)" }}
              />
              <span style={{ color: "var(--theme-text-primary)" }}>
                {t("hero.badge")}
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
              {t("hero.title")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl sm:text-2xl mb-10 max-w-3xl mx-auto"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto"
            >
              {statIcons.map((Icon, index) => (
                <div
                  key={index}
                  className="glassmorphism p-4 sm:p-6 rounded-2xl"
                >
                  <Icon
                    className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2"
                    style={{ color: "var(--theme-accent)" }}
                  />
                  <div
                    className="text-2xl sm:text-3xl mb-1"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    {t(`stats.${index}.value`)}
                  </div>
                  <div
                    className="text-xs sm:text-sm"
                    style={{ color: "var(--theme-text-secondary)" }}
                  >
                    {t(`stats.${index}.label`)}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Workspace Services Section */}
      <section className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 glassmorphism"
            >
              <Sparkles
                className="w-4 h-4"
                style={{ color: "var(--theme-accent)" }}
              />
              <span style={{ color: "var(--theme-text-primary)" }}>
                {t("services.badge")}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl leading-20 mb-4"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {t("services.title")}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg sm:text-xl max-w-2xl mx-auto"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {t("services.subtitle")}
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            {serviceIcons.map((Icon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <Card className="p-8 h-full glassmorphism border-white/20 relative overflow-hidden">
                  {/* Popular Badge */}
                  {index === 2 && (
                    <div className="absolute top-0 ltr:right-0 rtl:left-0">
                      <Badge
                        className="ltr:rounded-tl-none rtl:rounded-tr-none ltr:rounded-tr-2xl rtl:rounded-tl-2xl ltr:rounded-br-none rtl:rounded-bl-none ltr:rounded-bl-2xl rtl:rounded-br-2xl text-white border-0"
                        style={{
                          backgroundImage: `linear-gradient(135deg, var(--theme-gradient-start), var(--theme-gradient-mid))`,
                        }}
                      >
                        <Star className="w-3 h-3 ltr:mr-1 rtl:ml-1" />
                        {t("services.pricing.popular")}
                      </Badge>
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`w-20 h-20 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br ${serviceGradients[index]}`}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  {/* Title & Subtitle */}
                  <div className="mb-4">
                    <h3
                      className="text-2xl sm:text-3xl mb-2"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      {t(`services.items.${index}.name`)}
                    </h3>
                    <p
                      className="text-sm mb-2"
                      style={{ color: "var(--theme-accent)" }}
                    >
                      {t(`services.items.${index}.subtitle`)}
                    </p>
                  </div>

                  {/* Description */}
                  <p
                    className="mb-6 leading-relaxed"
                    style={{ color: "var(--theme-text-secondary)" }}
                  >
                    {t(`services.items.${index}.description`)}
                  </p>

                  {/* Ideal For */}
                  <div className="flex items-center gap-2 mb-6 p-3 rounded-xl glassmorphism">
                    <Users
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: "var(--theme-accent)" }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      {t(`services.items.${index}.ideal`)}
                    </span>
                  </div>

                  {/* Book Button */}
                  <Button
                    onClick={() =>
                      handleBooking(t(`services.items.${index}.name`))
                    }
                    className="w-full text-white border-0 relative overflow-hidden group"
                    style={{
                      background: serviceColors[index],
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {t("services.pricing.cta")}
                      <Calendar className="w-4 h-4" />
                    </span>
                  </Button>

                  {/* Features List (Expandable) */}
                  {selectedService === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-6 border-t border-white/10"
                    >
                      <h4
                        className="text-sm mb-3"
                        style={{ color: "var(--theme-text-primary)" }}
                      >
                        {t("details.included")}
                      </h4>
                      <ul className="space-y-2">
                        {serviceFeatures[index].map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-sm"
                          >
                            {feature.included ? (
                              <Check
                                className="w-4 h-4 flex-shrink-0"
                                style={{ color: "#10B981" }}
                              />
                            ) : (
                              <X
                                className="w-4 h-4 flex-shrink-0"
                                style={{ color: "#EF4444" }}
                              />
                            )}
                            <span
                              style={{
                                color: feature.included
                                  ? "var(--theme-text-primary)"
                                  : "var(--theme-text-secondary)",
                              }}
                            >
                              {t(`features.items.${feature.index}.name`)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </Card>

                {/* Glow Effect */}
                <div
                  className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 bg-gradient-to-br ${serviceGradients[index]}`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px]"
            style={{ backgroundColor: "var(--theme-primary)" }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 glassmorphism"
            >
              <Star
                className="w-4 h-4"
                style={{ color: "var(--theme-accent)" }}
              />
              <span style={{ color: "var(--theme-text-primary)" }}>
                {t("features.badge")}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl leading-20 mb-4"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {t("features.title")}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg sm:text-xl max-w-2xl mx-auto"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {t("features.subtitle")}
            </motion.p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {featureIcons.map((Icon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group"
              >
                <Card className="p-6 h-full glassmorphism border-white/20">
                  <div
                    className={`w-16 h-16 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br ${featureGradients[index]}`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3
                    className="text-xl mb-3"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    {t(`features.items.${index}.name`)}
                  </h3>

                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--theme-text-secondary)" }}
                  >
                    {t(`features.items.${index}.description`)}
                  </p>
                </Card>

                {/* Glow Effect */}
                <div
                  className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 bg-gradient-to-br ${featureGradients[index]}`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
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
                {t("comparison.badge")}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl leading-20 mb-4"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {t("comparison.title")}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg sm:text-xl max-w-2xl mx-auto"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {t("comparison.subtitle")}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-x-auto"
          >
            <div className="min-w-[800px] glassmorphism rounded-3xl p-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th
                      className="text-left py-4 px-4"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      {t("comparison.tableHeaders.feature")}
                    </th>
                    {serviceIcons.map((Icon, index) => (
                      <th key={index} className="text-center py-4 px-4">
                        <div
                          className={`w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center bg-gradient-to-br ${serviceGradients[index]}`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div
                          className="text-sm"
                          style={{ color: "var(--theme-text-primary)" }}
                        >
                          {t(`services.items.${index}.name`)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {featureIcons.map((Icon, featureIndex) => (
                    <tr
                      key={featureIndex}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-4 flex items-center gap-3">
                        <Icon
                          className="w-5 h-5"
                          style={{ color: "var(--theme-accent)" }}
                        />
                        <span style={{ color: "var(--theme-text-primary)" }}>
                          {t(`features.items.${featureIndex}.name`)}
                        </span>
                      </td>
                      {serviceFeatures.map((serviceFeature, serviceIndex) => {
                        const feature = serviceFeature.find(
                          (f) => f.index === featureIndex
                        );
                        return (
                          <td
                            key={serviceIndex}
                            className="text-center py-4 px-4"
                          >
                            {feature?.included ? (
                              <Check
                                className="w-6 h-6 mx-auto"
                                style={{ color: "#10B981" }}
                              />
                            ) : (
                              <X
                                className="w-6 h-6 mx-auto"
                                style={{ color: "#EF4444" }}
                              />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative p-12 sm:p-16 rounded-3xl glassmorphism overflow-hidden">
              {/* Background Gradient */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent))`,
                }}
              />

              {/* Floating Elements */}
              <motion.div
                className="absolute top-10 ltr:right-10 rtl:left-10 w-32 h-32 rounded-full opacity-20 blur-3xl"
                style={{ backgroundColor: "var(--theme-accent)" }}
                animate={{
                  y: [0, -20, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <div className="relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 glassmorphism">
                  <Calendar
                    className="w-4 h-4"
                    style={{ color: "var(--theme-accent)" }}
                  />
                  <span style={{ color: "var(--theme-text-primary)" }}>
                    {t("cta.badge")}
                  </span>
                </div>

                <h2
                  className="text-3xl sm:text-4xl md:text-5xl leading-20 mb-4"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  {t("cta.title")}
                </h2>

                <p
                  className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto"
                  style={{ color: "var(--theme-text-secondary)" }}
                >
                  {t("cta.subtitle")}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    size="lg"
                    onClick={() => {
                      handleBooking("");
                      toast.success(
                        language === "ar"
                          ? "تم إرسال طلب الجولة بنجاح!"
                          : "Tour request sent successfully!"
                      );
                    }}
                    className="text-white border-0 relative overflow-hidden group px-8 py-6"
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
                      <Calendar className="w-5 h-5" />
                      {t("cta.button")}
                    </span>
                  </Button>

                  <div className="flex items-center gap-3">
                    <span style={{ color: "var(--theme-text-secondary)" }}>
                      {t("cta.call")}
                    </span>
                    <a
                      href={`tel:${process.env.NEXT_PUBLIC_PHONE}`}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl glassmorphism transition-all hover:scale-105"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      <Phone
                        className="w-5 h-5"
                        style={{ color: "var(--theme-accent)" }}
                      />
                      <span dir="ltr">{process.env.NEXT_PUBLIC_PHONE}</span>
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div
                  className="mt-8 flex items-center justify-center gap-2 text-sm"
                  style={{ color: "var(--theme-text-secondary)" }}
                >
                  <MapPin
                    className="w-4 h-4"
                    style={{ color: "var(--theme-accent)" }}
                  />
                  <span>{t("cta.location")}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
