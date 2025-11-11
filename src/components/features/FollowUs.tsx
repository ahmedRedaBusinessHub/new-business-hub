"use client";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Share2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MessageCircle,
  Send,
  FileDown,
  FileText,
  Globe,
  Download,
  Mail,
  ArrowRight,
  Users,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useI18n } from "@/hooks/useI18n";

export default function FollowUsPage() {
  const { t, language } = useI18n();
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const router = useRouter();
  const socialPlatforms = [
    {
      name: "Facebook",
      icon: Facebook,
      color: "#1877F2",
      gradient: "from-blue-600 to-blue-400",
      followers: "25.4K",
      url: process.env.NEXT_PUBLIC_LINKEDIN,
      description: t("Follow us on Facebook for latest news and updates"),
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "#1DA1F2",
      gradient: "from-sky-500 to-blue-400",
      followers: "18.2K",
      url: process.env.NEXT_PUBLIC_X,
      description: t("Join our conversations on Twitter"),
    },
    {
      name: "Instagram",
      icon: Instagram,
      color: "#E4405F",
      gradient: "from-pink-600 via-purple-600 to-orange-400",
      followers: "42.8K",
      url: process.env.NEXT_PUBLIC_INSTAGRAM,
      description: t("See our success stories on Instagram"),
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "#0A66C2",
      gradient: "from-blue-700 to-blue-500",
      followers: "15.6K",
      url: process.env.NEXT_PUBLIC_LINKEDIN,
      description: t("Connect with us professionally on LinkedIn"),
    },
    {
      name: "YouTube",
      icon: Youtube,
      color: "#FF0000",
      gradient: "from-red-600 to-red-400",
      followers: "32.1K",
      url: process.env.NEXT_PUBLIC_LINKEDIN,
      description: t("Watch educational videos on YouTube"),
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "#25D366",
      gradient: "from-green-600 to-green-400",
      followers: "8.5K",
      url: `https://wa.me/${process.env.NEXT_PUBLIC_PHONE}`,
      description: t("Chat with us directly on WhatsApp"),
    },
    {
      name: "Telegram",
      icon: Send,
      color: "#0088CC",
      gradient: "from-cyan-600 to-blue-400",
      followers: "12.3K",
      url: process.env.NEXT_PUBLIC_LINKEDIN,
      description: t("Join our channel on Telegram"),
    },
    {
      name: "TikTok",
      icon: Share2,
      color: "#000000",
      gradient: "from-gray-900 via-pink-500 to-cyan-400",
      followers: "56.7K",
      url: process.env.NEXT_PUBLIC_LINKEDIN,
      description: t("Watch short content on TikTok"),
    },
  ];

  const profileDownloads = [
    {
      title: t("follow_profile_arabic"),
      icon: FileText,
      language: "العربية",
      size: "2.4 MB",
      gradient: "from-blue-600 to-cyan-500",
      url: "https://drive.google.com/file/d/1TK7iuTAGJR4QmsvDHRh0zHQ-8tTD7SpK/view?usp=sharing",
    },
    {
      title: t("follow_profile_english"),
      icon: Globe,
      language: "English",
      size: "2.3 MB",
      gradient: "from-purple-600 to-pink-500",
      url: "https://drive.google.com/file/d/1TK7iuTAGJR4QmsvDHRh0zHQ-8tTD7SpK/view?usp=sharing",
    },
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error(t("Please enter your email"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t("Invalid email address"));
      return;
    }

    setIsSubscribing(true);

    setTimeout(() => {
      toast.success(t("follow_newsletter_success"));
      setEmail("");
      setIsSubscribing(false);
    }, 1500);
  };

  const handleDownload = (url: string) => {
    window.open(url);
    // In a real app, this would trigger an actual download
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
              <Share2
                className="w-4 h-4"
                style={{ color: "var(--theme-accent)" }}
              />
              <span style={{ color: "var(--theme-text-primary)" }}>
                {t("follow_hero_badge")}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl   md:text-6xl lg:text-7xl mb-6 bg-clip-text text-transparent leading-20"
              style={{
                backgroundImage: `linear-gradient(to right, var(--theme-text-primary), var(--theme-primary))`,
              }}
            >
              {t("follow_hero_title")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl sm:text-2xl mb-10 max-w-3xl mx-auto"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {t("follow_hero_subtitle")}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Social Media Platforms Section */}
      <section className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 glassmorphism"
            >
              <Users
                className="w-4 h-4"
                style={{ color: "var(--theme-accent)" }}
              />
              <span style={{ color: "var(--theme-text-primary)" }}>
                {t("follow_social_badge")}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl leading-20 mb-4"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {t("follow_social_title")}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg sm:text-xl max-w-2xl mx-auto"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {t("follow_social_subtitle")}
            </motion.p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {socialPlatforms.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group"
              >
                <div className="p-6 rounded-2xl glassmorphism h-full flex flex-col">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br ${platform.gradient}`}
                  >
                    <platform.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Platform Name */}
                  <h3
                    className="text-2xl mb-2"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    {platform.name}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-sm mb-4 flex-1"
                    style={{ color: "var(--theme-text-secondary)" }}
                  >
                    {platform.description}
                  </p>

                  {/* Followers */}
                  <div className="flex items-center gap-2 mb-4">
                    <Users
                      className="w-4 h-4"
                      style={{ color: "var(--theme-accent)" }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: "var(--theme-text-secondary)" }}
                    >
                      {platform.followers} {t("follow_social_followers")}
                    </span>
                  </div>

                  {/* Follow Button */}
                  <Button
                    onClick={() => window.open(platform.url, "_blank")}
                    className="w-full text-white border-0 relative overflow-hidden group"
                    style={{
                      background: `linear-gradient(to right, ${platform.color}, ${platform.color})`,
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {t("follow_social_follow")}
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </Button>
                </div>

                {/* Glow Effect */}
                <div
                  className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"
                  style={{
                    background: platform.color,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Profile Downloads Section */}
      <section className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 glassmorphism"
            >
              <FileDown
                className="w-4 h-4"
                style={{ color: "var(--theme-accent)" }}
              />
              <span style={{ color: "var(--theme-text-primary)" }}>
                {t("follow_profile_badge")}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl leading-20 mb-4"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {t("follow_profile_title")}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg sm:text-xl max-w-2xl mx-auto"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {t("follow_profile_subtitle")}
            </motion.p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {profileDownloads.map((profile, index) => (
                <motion.div
                  key={profile.title}
                  initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="relative group"
                >
                  <div className="p-8 rounded-2xl glassmorphism h-full">
                    <div
                      className={`w-20 h-20 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br ${profile.gradient}`}
                    >
                      <profile.icon className="w-10 h-10 text-white" />
                    </div>

                    <h3
                      className="text-2xl mb-2"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      {profile.title}
                    </h3>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <FileText
                          className="w-4 h-4"
                          style={{ color: "var(--theme-accent)" }}
                        />
                        <span
                          className="text-sm"
                          style={{ color: "var(--theme-text-secondary)" }}
                        >
                          {t("follow_profile_size")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe
                          className="w-4 h-4"
                          style={{ color: "var(--theme-accent)" }}
                        />
                        <span
                          className="text-sm"
                          style={{ color: "var(--theme-text-secondary)" }}
                        >
                          {profile.language}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleDownload(profile.url)}
                      className="w-full text-white border-0"
                      style={{
                        backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
                      }}
                    >
                      <Download className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                      {profile.title}
                    </Button>
                  </div>

                  {/* Glow Effect */}
                  <div
                    className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 bg-gradient-to-br ${profile.gradient}`}
                  />
                </motion.div>
              ))}
            </div>

            {/* Download Both Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Button
                onClick={() => handleDownload(profileDownloads[0].url)}
                size="lg"
                className="text-white border-0 relative overflow-hidden group px-8 py-6"
                style={{
                  backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-end))`,
                }}
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    backgroundImage: `linear-gradient(to left, var(--theme-gradient-start), var(--theme-gradient-end))`,
                  }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  {t("follow_profile_both")}
                </span>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative p-10 sm:p-12 rounded-3xl glassmorphism overflow-hidden">
              {/* Background Gradient */}
              <div
                className="absolute inset-0 opacity-10"
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

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 glassmorphism">
                    <Mail
                      className="w-4 h-4"
                      style={{ color: "var(--theme-accent)" }}
                    />
                    <span style={{ color: "var(--theme-text-primary)" }}>
                      {t("follow_newsletter_badge")}
                    </span>
                  </div>

                  <h2
                    className="text-3xl sm:text-4xl mb-4"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    {t("follow_newsletter_title")}
                  </h2>

                  <p
                    className="text-lg max-w-2xl mx-auto"
                    style={{ color: "var(--theme-text-secondary)" }}
                  >
                    {t("follow_newsletter_subtitle")}
                  </p>
                </div>

                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto"
                >
                  <div className="flex-1 relative">
                    <Mail className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 w-5 h-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder={t("follow_newsletter_email")}
                      value={email}
                      onChange={(e: any) => setEmail(e.target.value)}
                      className="ltr:pl-12 rtl:pr-12 h-14 glassmorphism border-white/20 text-lg"
                      style={{ color: "var(--theme-text-primary)" }}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubscribing}
                    className="text-white border-0 h-14 px-8 whitespace-nowrap"
                    style={{
                      backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
                    }}
                  >
                    {isSubscribing ? (
                      t("Subscribing")
                    ) : (
                      <>
                        <Send className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                        {t("follow_newsletter_subscribe")}
                      </>
                    )}
                  </Button>
                </form>

                {/* Benefits */}
                <div className="grid sm:grid-cols-3 gap-4 mt-10">
                  {[
                    t("Weekly Updates"),
                    t("Exclusive Tips"),
                    t("Premium Content"),
                  ].map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 justify-center"
                    >
                      <CheckCircle2
                        className="w-5 h-5"
                        style={{ color: "var(--theme-accent)" }}
                      />
                      <span style={{ color: "var(--theme-text-primary)" }}>
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="p-10 sm:p-12 rounded-3xl glassmorphism">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 glassmorphism">
                <MessageCircle
                  className="w-4 h-4"
                  style={{ color: "var(--theme-accent)" }}
                />
                <span style={{ color: "var(--theme-text-primary)" }}>
                  {t("follow_contact_badge")}
                </span>
              </div>

              <h2
                className="text-3xl sm:text-4xl mb-4"
                style={{ color: "var(--theme-text-primary)" }}
              >
                {t("follow_contact_title")}
              </h2>

              <p
                className="text-lg mb-8 max-w-xl mx-auto"
                style={{ color: "var(--theme-text-secondary)" }}
              >
                {t("follow_contact_subtitle")}
              </p>

              <Button
                onClick={() => {
                  router.push("/contact-us");
                }}
                size="lg"
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
                  {t("follow_contact_button")}
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
