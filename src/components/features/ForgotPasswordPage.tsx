"use client";
import { useState } from "react";
import { motion } from "motion/react";
import {
  KeyRound,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { toast } from "sonner";
import Logo from "./Logo";
import { useI18n } from "@/hooks/useI18n";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const { t, language } = useI18n("forgotPassword");
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error(t("validation.emailRequired") || "Email or mobile is required");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrMobile: email.trim() }), // Using 'mobile' key as per OtpDto, but backend checks both
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send reset code");

      toast.success(data.message || t("messages.linkSent") || "Reset code sent successfully");
      setStep(2);
    } catch (error: any) {
      console.error("Forget password error:", error);
      toast.error(error.message || "Failed to send reset code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || !newPassword || !confirmPassword) {
      toast.error(t("reset.validation.fillAll") || "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(t("reset.validation.match") || "Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: email.trim(),
          otp: otp.trim(),
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password");

      setIsSuccess(true);
      toast.success(data.message || "Password reset successfully");
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(error.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen py-12 px-4 flex items-center justify-center"
      style={{ backgroundColor: "var(--theme-bg-primary)" }}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: "var(--theme-accent)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: "var(--theme-secondary)" }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.2, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Information */}
          <motion.div
            initial={{ opacity: 0, x: language === "ar" ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block"
          >
            <Link href="/" className="inline-block mb-8">
              <Logo className="h-12" />
            </Link>

            <h1 className="text-5xl mb-6" style={{ color: "var(--theme-text-primary)" }}>
              {t("hero.title")}
            </h1>

            <p className="text-xl mb-12 opacity-80" style={{ color: "var(--theme-text-secondary)" }}>
              {t("hero.subtitle")}
            </p>

            <div className="space-y-6">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: language === "ar" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "var(--theme-accent)" }}
                  >
                    <span style={{ color: "var(--theme-text-primary)" }}>{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="mb-1" style={{ color: "var(--theme-text-primary)" }}>
                      {t(`steps.${index}.title`)}
                    </h3>
                    <p className="opacity-80" style={{ color: "var(--theme-text-secondary)" }}>
                      {t(`steps.${index}.description`)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: language === "ar" ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card
              className="p-8 backdrop-blur-xl border shadow-2xl"
              style={{
                backgroundColor: "var(--theme-card-bg)",
                borderColor: "var(--theme-border)",
              }}
            >
              <div className="lg:hidden text-center mb-6">
                <Link href="/" className="inline-block">
                  <Logo className="h-10 mx-auto" />
                </Link>
              </div>

              {!isSuccess ? (
                <>
                  <div className="text-center mb-8">
                    <div
                      className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: "var(--theme-accent)" }}
                    >
                      <KeyRound className="w-8 h-8" style={{ color: "var(--theme-text-primary)" }} />
                    </div>
                    <h2 className="text-3xl mb-2" style={{ color: "var(--theme-text-primary)" }}>
                      {step === 1 ? t("form.title") : t("reset.title")}
                    </h2>
                    <p style={{ color: "var(--theme-text-secondary)" }}>
                      {step === 1 ? t("form.subtitle") : t("reset.subtitle")}
                    </p>
                  </div>

                  {step === 1 ? (
                    /* Step 1: Request OTP */
                    <form onSubmit={handleRequestOtp} className="space-y-6">
                      <div>
                        <Label htmlFor="email" style={{ color: "var(--theme-text-primary)" }}>
                          {t("form.emailLabel")}
                        </Label>
                        <div className="relative mt-2">
                          <Mail
                            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 opacity-40"
                            style={{
                              [language === "ar" ? "right" : "left"]: "12px",
                              color: "var(--theme-text-primary)",
                            }}
                          />
                          <Input
                            id="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-14 text-lg"
                            style={{
                              [language === "ar" ? "paddingRight" : "paddingLeft"]: "44px",
                              backgroundColor: "var(--theme-bg-secondary)",
                              color: "var(--theme-text-primary)",
                              borderColor: "var(--theme-border)",
                            }}
                            placeholder={t("form.emailPlaceholder")}
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-14 text-lg"
                        disabled={isLoading}
                        style={{
                          backgroundColor: "var(--theme-accent)",
                          color: "var(--theme-text-primary)",
                        }}
                      >
                        {isLoading ? (
                          t("form.submitting")
                        ) : (
                          <>
                            {t("form.submitButton")}
                            <ArrowRight className={`w-5 h-5 ${language === "ar" ? "mr-2" : "ml-2"}`} />
                          </>
                        )}
                      </Button>
                    </form>
                  ) : (
                    /* Step 2: Reset Password */
                    <form onSubmit={handleResetPassword} className="space-y-6">
                      {/* OTP Input */}
                      <div>
                        <Label htmlFor="otp" style={{ color: "var(--theme-text-primary)" }}>
                          {t("reset.otpLabel")}
                        </Label>
                        <Input
                          id="otp"
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="h-14 text-lg mt-2"
                          style={{
                            backgroundColor: "var(--theme-bg-secondary)",
                            color: "var(--theme-text-primary)",
                            borderColor: "var(--theme-border)",
                          }}
                          placeholder={t("reset.otpPlaceholder")}
                        />
                      </div>

                      {/* New Password Input */}
                      <div>
                        <Label htmlFor="newPassword" style={{ color: "var(--theme-text-primary)" }}>
                          {t("reset.newPasswordLabel")}
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="h-14 text-lg mt-2"
                          style={{
                            backgroundColor: "var(--theme-bg-secondary)",
                            color: "var(--theme-text-primary)",
                            borderColor: "var(--theme-border)",
                          }}
                          placeholder={t("reset.newPasswordPlaceholder")}
                        />
                      </div>

                      {/* Confirm Password Input */}
                      <div>
                        <Label htmlFor="confirmPassword" style={{ color: "var(--theme-text-primary)" }}>
                          {t("reset.confirmPasswordLabel")}
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="h-14 text-lg mt-2"
                          style={{
                            backgroundColor: "var(--theme-bg-secondary)",
                            color: "var(--theme-text-primary)",
                            borderColor: "var(--theme-border)",
                          }}
                          placeholder={t("reset.confirmPasswordPlaceholder")}
                        />
                      </div>

                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(1)}
                          className="w-1/3 h-14 text-lg"
                          style={{
                            borderColor: "var(--theme-border)",
                            color: "var(--theme-text-primary)",
                          }}
                        >
                          {t("reset.backButton")}
                        </Button>
                        <Button
                          type="submit"
                          className="w-2/3 h-14 text-lg"
                          disabled={isLoading}
                          style={{
                            backgroundColor: "var(--theme-accent)",
                            color: "var(--theme-text-primary)",
                          }}
                        >
                          {isLoading ? t("form.submitting") : t("reset.submitButton")}
                        </Button>
                      </div>
                    </form>
                  )}

                  <div className="mt-8 text-center">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 transition-colors"
                      style={{ color: "var(--theme-accent)" }}
                    >
                      {language === "ar" ? (
                        <>
                          <span>{t("form.backToLogin")}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <ArrowLeft className="w-4 h-4" />
                          <span>{t("form.backToLogin")}</span>
                        </>
                      )}
                    </Link>
                  </div>
                </>
              ) : (
                /* Success View */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div
                    className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                    style={{ backgroundColor: "var(--theme-accent)" }}
                  >
                    <CheckCircle className="w-10 h-10" style={{ color: "var(--theme-text-primary)" }} />
                  </div>

                  <h2 className="text-3xl mb-4" style={{ color: "var(--theme-text-primary)" }}>
                    {t("reset.successTitle")}
                  </h2>

                  <p className="text-lg mb-8" style={{ color: "var(--theme-text-secondary)" }}>
                    {t("reset.successSubtitle")}
                  </p>

                  <Link href="/login" className="block">
                    <Button
                      className="w-full h-12"
                      style={{
                        backgroundColor: "var(--theme-accent)",
                        color: "var(--theme-text-primary)",
                      }}
                    >
                      {t("success.backToLogin")}
                    </Button>
                  </Link>
                </motion.div>
              )}
            </Card>

            {!isSuccess && step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 text-center"
              >
                <p style={{ color: "var(--theme-text-secondary)" }}>
                  {t("help.prefix")}
                  <Link
                    href="/contact"
                    className="underline"
                    style={{ color: "var(--theme-accent)" }}
                  >
                    {t("help.link")}
                  </Link>
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
