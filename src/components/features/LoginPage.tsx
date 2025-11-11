"use client";
import { useState } from "react";
import { motion } from "motion/react";
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Facebook,
  Linkedin,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import { Checkbox } from "@/components/ui/Checkbox";
import { toast } from "sonner";
import Logo from "@/components/features/Logo";
import { useI18n } from "@/hooks/useI18n";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { t, language } = useI18n("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      toast.error(t("validation.allFieldsRequired"));
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t("validation.invalidEmail"));
      return;
    }

    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      toast.success(t("messages.loginSuccess"));
      goToHome();
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(t("messages.socialLogin").replace("{provider}", provider));
    goToHome();
  };

  const goToHome = async () => {
    const res: any = await signIn("credentials", {
      redirect: false,
      username: "username",
      password: "password",
    });

    if (res?.error) {
      toast.error(res.error || t("messages.loginFailed"));
    } else {
      router.push("/");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden"
      style={{ backgroundColor: "var(--theme-bg-primary)" }}
    >
      {/* Back to Home Link */}
      <Link href={"/"}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute top-6 ltr:left-6 rtl:right-6 z-20 flex items-center gap-2 px-4 py-2 rounded-xl hover:scale-105 transition-transform"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--theme-bg-secondary) 80%, transparent)",
            color: "var(--theme-text-primary)",
          }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{ transform: language === "ar" ? "rotate(180deg)" : "none" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>{t("backToHome")}</span>
        </motion.div>
      </Link>

      {/* Animated Background Elements */}
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

      <div className="w-full max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding & Features */}
          <motion.div
            initial={{ opacity: 0, x: language === "ar" ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="space-y-8">
              {/* Logo & Brand */}
              <div className="flex items-center gap-4">
                <Logo
                  className="w-16 h-16"
                  style={{ color: "var(--theme-primary)" }}
                />
                <div>
                  <h1
                    className="text-3xl mb-1"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    {t("brand.nameAr")}
                  </h1>
                  <p style={{ color: "var(--theme-text-secondary)" }}>
                    {t("brand.tagline")}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--theme-primary) 15%, transparent)",
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: "var(--theme-primary)" }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3
                        className="text-xl mb-1"
                        style={{ color: "var(--theme-text-primary)" }}
                      >
                        {t(`features.${index}.title`)}
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: "var(--theme-text-secondary)" }}
                      >
                        {t(`features.${index}.description`)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                {Array.from({ length: 3 }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    className="text-center"
                  >
                    <div
                      className="text-3xl mb-1"
                      style={{ color: "var(--theme-primary)" }}
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
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: language === "ar" ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card
              className="p-8 sm:p-10 border-0"
              style={{
                backgroundColor: "var(--theme-bg-secondary)",
                boxShadow:
                  "0 20px 80px color-mix(in srgb, var(--theme-primary) 15%, transparent)",
              }}
            >
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                <Logo
                  className="w-12 h-12"
                  style={{ color: "var(--theme-primary)" }}
                />
                <span
                  className="text-2xl"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  {t("brand.nameAr")}
                </span>
              </div>

              {/* Header */}
              <div className="mb-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--theme-primary) 10%, transparent)",
                  }}
                >
                  <LogIn
                    className="w-5 h-5"
                    style={{ color: "var(--theme-primary)" }}
                  />
                  <span style={{ color: "var(--theme-text-primary)" }}>
                    {t("header.badge")}
                  </span>
                </motion.div>

                <h2
                  className="text-3xl sm:text-4xl mb-2"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  {t("header.title")}
                </h2>
                <p style={{ color: "var(--theme-text-secondary)" }}>
                  {t("header.subtitle")}
                </p>
              </div>

              {/* Social Login */}
              <div className="space-y-3 mb-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-center gap-3 py-6"
                  style={{
                    borderColor: "var(--theme-border)",
                    color: "var(--theme-text-primary)",
                  }}
                  onClick={() => handleSocialLogin("Google")}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {t("social.google")}
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="justify-center gap-2 py-6"
                    style={{
                      borderColor: "var(--theme-border)",
                      color: "var(--theme-text-primary)",
                    }}
                    onClick={() => handleSocialLogin("Facebook")}
                  >
                    <Facebook
                      className="w-5 h-5"
                      style={{ color: "#1877F2" }}
                    />
                    {t("social.facebook")}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="justify-center gap-2 py-6"
                    style={{
                      borderColor: "var(--theme-border)",
                      color: "var(--theme-text-primary)",
                    }}
                    onClick={() => handleSocialLogin("LinkedIn")}
                  >
                    <Linkedin
                      className="w-5 h-5"
                      style={{ color: "#0A66C2" }}
                    />
                    {t("social.linkedin")}
                  </Button>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <Separator
                  className="flex-1"
                  style={{ backgroundColor: "var(--theme-border)" }}
                />
                <span
                  className="text-sm"
                  style={{ color: "var(--theme-text-secondary)" }}
                >
                  {t("social.divider")}
                </span>
                <Separator
                  className="flex-1"
                  style={{ backgroundColor: "var(--theme-border)" }}
                />
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    {t("form.email.label")}
                  </Label>
                  <div className="relative">
                    <Mail
                      className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5"
                      style={{ color: "var(--theme-text-secondary)" }}
                    />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e: any) => setEmail(e.target.value)}
                      placeholder={t("form.email.placeholder")}
                      className="ltr:pl-10 rtl:pr-10 py-6"
                      style={{
                        backgroundColor: "var(--theme-bg-primary)",
                        borderColor: "var(--theme-border)",
                        color: "var(--theme-text-primary)",
                      }}
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    {t("form.password.label")}
                  </Label>
                  <div className="relative">
                    <Lock
                      className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5"
                      style={{ color: "var(--theme-text-secondary)" }}
                    />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e: any) => setPassword(e.target.value)}
                      placeholder={t("form.password.placeholder")}
                      className="ltr:pl-10 ltr:pr-10 rtl:pr-10 rtl:pl-10 py-6"
                      style={{
                        backgroundColor: "var(--theme-bg-primary)",
                        borderColor: "var(--theme-border)",
                        color: "var(--theme-text-primary)",
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--theme-text-secondary)" }}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked: any) =>
                        setRememberMe(checked as boolean)
                      }
                      style={{
                        borderColor: "var(--theme-border)",
                      }}
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm cursor-pointer"
                      style={{ color: "var(--theme-text-secondary)" }}
                    >
                      {t("form.rememberMe")}
                    </Label>
                  </div>
                  <a
                    href="#forgot-password"
                    className="text-sm hover:underline"
                    style={{ color: "var(--theme-primary)" }}
                  >
                    {t("form.forgotPassword")}
                  </a>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full py-6 text-white border-0 group"
                  disabled={isLoading}
                  style={{
                    backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t("form.submitting")}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {t("form.submit")}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <span style={{ color: "var(--theme-text-secondary)" }}>
                  {t("signup.text")}{" "}
                </span>
                <a
                  href="#signup"
                  className="hover:underline"
                  style={{ color: "var(--theme-primary)" }}
                >
                  {t("signup.link")}
                </a>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
