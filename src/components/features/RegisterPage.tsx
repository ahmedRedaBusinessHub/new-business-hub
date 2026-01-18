"use client";
import { useState } from "react";
import { motion } from "motion/react";
import {
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building,
  Phone,
  Facebook,
  Linkedin,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import { Checkbox } from "@/components/ui/Checkbox";
import { toast } from "sonner";
import Logo from "./Logo";
import { useI18n } from "@/hooks/useI18n";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OTPVerification from "./OTPVerification";
import { OtpType, OtpChannel } from "@/types/auth";

export default function RegisterPage() {
  const { t, language } = useI18n("register");
  const navigate = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpData, setOtpData] = useState<{
    identifier: string;
    country_code?: string;
    channel: OtpChannel;
    type: OtpType;
    userId?: number;
  } | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    country_code: "+966",
    mobile: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.username ||
      !formData.email ||
      !formData.country_code ||
      !formData.mobile ||
      !formData.first_name ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error(t("validation.requiredFields"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error(t("validation.invalidEmail"));
      return;
    }

    if (formData.password.length < 6) {
      toast.error(t("validation.passwordLength") || "Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error(t("validation.passwordMismatch"));
      return;
    }

    if (!agreedToTerms) {
      toast.error(t("validation.termsRequired"));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          country_code: formData.country_code,
          mobile: formData.mobile,
          first_name: formData.first_name,
          last_name: formData.last_name || undefined,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Check if verification is required
      if (data.actions && data.actions.length > 0) {
        // Determine which channel needs verification
        const emailAction = data.actions.find((a: any) => 
          a.action === "sent_email" || a.action === "auto_verified_email"
        );
        const smsAction = data.actions.find((a: any) => 
          a.action === "sent_sms" || a.action === "auto_verified_sms"
        );

        // If email verification is required
        if (emailAction && emailAction.action === "sent_email") {
          setOtpData({
            identifier: formData.email,
            channel: OtpChannel.EMAIL,
            type: OtpType.VERIFICATION,
            userId: data.userId,
          });
          setShowOTP(true);
          toast.success(emailAction.message || "Verification code sent to your email");
          setIsLoading(false);
          return;
        }

        // If SMS verification is required
        if (smsAction && smsAction.action === "sent_sms") {
          setOtpData({
            identifier: formData.mobile,
            country_code: formData.country_code,
            channel: OtpChannel.SMS,
            type: OtpType.VERIFICATION,
            userId: data.userId,
          });
          setShowOTP(true);
          toast.success(smsAction.message || "Verification code sent to your mobile");
          setIsLoading(false);
          return;
        }

        // If both are auto-verified, redirect to login
        toast.success(t("messages.success"));
        setTimeout(() => {
          navigate.push("/login");
        }, 1000);
      } else {
        toast.success(t("messages.success"));
        setTimeout(() => {
          navigate.push("/login");
        }, 1000);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = (provider: string) => {
    toast.info(`${t("messages.socialRegister")}${provider}...`);
  };

  return (
    <div
      className="min-h-screen bg-white relative overflow-hidden"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 ltr:left-20 rtl:right-20 w-96 h-96 rounded-full blur-3xl"
          style={{
            backgroundColor: "color-mix(in srgb, #0D5BDC 20%, transparent)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 ltr:right-20 rtl:left-20 w-96 h-96 rounded-full blur-3xl"
          style={{
            backgroundColor: "color-mix(in srgb, #340F87 20%, transparent)",
          }}
          animate={{
            scale: [1.3, 1, 1.3],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: language === "ar" ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block"
          >
            <Link href="/" className="inline-block mb-8">
              <Logo className="h-12" />
            </Link>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#0D5BDC]/10 to-[#340F87]/10 border border-[#0D5BDC]/20 mb-6">
              <Sparkles className="w-4 h-4 text-[#0D5BDC]" />
              <span className="bg-gradient-to-r from-[#0D5BDC] to-[#340F87] bg-clip-text text-transparent">
                {t("hero.badge")}
              </span>
            </div>

            <h1 className="mb-6 bg-gradient-to-r from-[#262626] to-[#0A2F78] bg-clip-text text-transparent">
              {t("hero.title")}
            </h1>

            <p className="text-xl text-[#262626]/70 mb-8">
              {t("hero.subtitle")}
            </p>

            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: language === "ar" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#0D5BDC] to-[#4587F4]">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-[#262626]">
                      {t(`features.${index}.title`)}
                    </h3>
                    <p className="text-[#262626]/70">
                      {t(`features.${index}.description`)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Register Form */}
          <motion.div
            initial={{ opacity: 0, x: language === "ar" ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#F2F2F2] to-white border border-[#F2F2F2]">
              {/* Mobile Logo */}
              <div className="lg:hidden text-center mb-6">
                <Link href="/" className="inline-block">
                  <Logo className="h-10 mx-auto" />
                </Link>
              </div>

              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0D5BDC] to-[#4587F4] mb-4">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h2 className="mb-2 text-[#262626]">{t("form.title")}</h2>
                <p className="text-[#262626]/70">{t("form.subtitle")}</p>
              </div>

              {showOTP && otpData ? (
                <OTPVerification
                  identifier={otpData.identifier}
                  country_code={otpData.country_code}
                  channel={otpData.channel}
                  type={otpData.type}
                  onBack={() => setShowOTP(false)}
                  onSuccess={() => {
                    toast.success("Registration successful! Please login.");
                    navigate.push("/login");
                  }}
                />
              ) : (
                <form onSubmit={handleRegister} className="space-y-5">
                  {/* Username */}
                  <div>
                    <Label htmlFor="username" className="text-[#262626]">
                      Username *
                    </Label>
                    <div className="relative mt-2">
                      <User
                        className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[#262626]/40 ${
                          language === "ar" ? "right-3" : "left-3"
                        }`}
                      />
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        className={`h-12 bg-white border-[#0D5BDC]/20 focus:border-[#0D5BDC] text-[#262626] ${
                          language === "ar" ? "pr-10" : "pl-10"
                        }`}
                        placeholder="Enter username"
                      />
                    </div>
                  </div>

                  {/* First Name */}
                  <div>
                    <Label htmlFor="first_name" className="text-[#262626]">
                      First Name *
                    </Label>
                    <div className="relative mt-2">
                      <User
                        className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[#262626]/40 ${
                          language === "ar" ? "right-3" : "left-3"
                        }`}
                      />
                      <Input
                        id="first_name"
                        name="first_name"
                        type="text"
                        value={formData.first_name}
                        onChange={handleChange}
                        className={`h-12 bg-white border-[#0D5BDC]/20 focus:border-[#0D5BDC] text-[#262626] ${
                          language === "ar" ? "pr-10" : "pl-10"
                        }`}
                        placeholder="Enter first name"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div>
                    <Label htmlFor="last_name" className="text-[#262626]">
                      Last Name
                    </Label>
                    <div className="relative mt-2">
                      <User
                        className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[#262626]/40 ${
                          language === "ar" ? "right-3" : "left-3"
                        }`}
                      />
                      <Input
                        id="last_name"
                        name="last_name"
                        type="text"
                        value={formData.last_name}
                        onChange={handleChange}
                        className={`h-12 bg-white border-[#0D5BDC]/20 focus:border-[#0D5BDC] text-[#262626] ${
                          language === "ar" ? "pr-10" : "pl-10"
                        }`}
                        placeholder="Enter last name (optional)"
                      />
                    </div>
                  </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-[#262626]">
                    {t("form.email")} *
                  </Label>
                  <div className="relative mt-2">
                    <Mail
                      className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[#262626]/40 ${
                        language === "ar" ? "right-3" : "left-3"
                      }`}
                    />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`h-12 bg-white border-[#0D5BDC]/20 focus:border-[#0D5BDC] text-[#262626] ${
                        language === "ar" ? "pr-10" : "pl-10"
                      }`}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                  {/* Mobile & Country Code */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country_code" className="text-[#262626]">
                        Country Code *
                      </Label>
                      <div className="relative mt-2">
                        <Phone
                          className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[#262626]/40 ${
                            language === "ar" ? "right-3" : "left-3"
                          }`}
                        />
                        <Input
                          id="country_code"
                          name="country_code"
                          type="text"
                          value={formData.country_code}
                          onChange={handleChange}
                          className={`h-12 bg-white border-[#0D5BDC]/20 focus:border-[#0D5BDC] text-[#262626] ${
                            language === "ar" ? "pr-10" : "pl-10"
                          }`}
                          placeholder="+966"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="mobile" className="text-[#262626]">
                        Mobile Number *
                      </Label>
                      <div className="relative mt-2">
                        <Phone
                          className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[#262626]/40 ${
                            language === "ar" ? "right-3" : "left-3"
                          }`}
                        />
                        <Input
                          id="mobile"
                          name="mobile"
                          type="tel"
                          value={formData.mobile}
                          onChange={handleChange}
                          className={`h-12 bg-white border-[#0D5BDC]/20 focus:border-[#0D5BDC] text-[#262626] ${
                            language === "ar" ? "pr-10" : "pl-10"
                          }`}
                          placeholder="580629187"
                        />
                      </div>
                    </div>
                  </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password" className="text-[#262626]">
                    {t("form.password")} *
                  </Label>
                  <div className="relative mt-2">
                    <Lock
                      className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[#262626]/40 ${
                        language === "ar" ? "right-3" : "left-3"
                      }`}
                    />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className={`h-12 bg-white border-[#0D5BDC]/20 focus:border-[#0D5BDC] text-[#262626] ${
                        language === "ar" ? "pr-10 pl-10" : "pl-10 pr-10"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute top-1/2 -translate-y-1/2 ${
                        language === "ar" ? "left-3" : "right-3"
                      }`}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-[#262626]/40" />
                      ) : (
                        <Eye className="w-5 h-5 text-[#262626]/40" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <Label htmlFor="confirmPassword" className="text-[#262626]">
                    {t("form.confirmPassword")} *
                  </Label>
                  <div className="relative mt-2">
                    <Lock
                      className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[#262626]/40 ${
                        language === "ar" ? "right-3" : "left-3"
                      }`}
                    />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`h-12 bg-white border-[#0D5BDC]/20 focus:border-[#0D5BDC] text-[#262626] ${
                        language === "ar" ? "pr-10 pl-10" : "pl-10 pr-10"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className={`absolute top-1/2 -translate-y-1/2 ${
                        language === "ar" ? "left-3" : "right-3"
                      }`}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5 text-[#262626]/40" />
                      ) : (
                        <Eye className="w-5 h-5 text-[#262626]/40" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked: any) =>
                      setAgreedToTerms(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm cursor-pointer text-[#262626]/70"
                  >
                    {t("form.termsPrefix")}
                    <Link
                      href="/terms"
                      className="text-[#0D5BDC] hover:underline"
                    >
                      {t("form.termsLink")}
                    </Link>
                    {t("form.termsAnd")}
                    <Link
                      href="/privacy"
                      className="text-[#0D5BDC] hover:underline"
                    >
                      {t("form.privacyLink")}
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-lg bg-gradient-to-r from-[#0D5BDC] to-[#340F87] text-white border-0 hover:scale-105 transition-transform"
                  disabled={isLoading}
                >
                  {isLoading ? t("form.submitting") : t("form.submitButton")}
                </Button>
                </form>
              )}

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <Separator className="flex-1" />
                <span className="text-sm text-[#262626]/60">
                  {t("form.divider")}
                </span>
                <Separator className="flex-1" />
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleSocialRegister("Facebook")}
                  className="h-12 border-[#0D5BDC]/20 hover:border-[#0D5BDC]/50 text-[#262626]"
                >
                  <Facebook className="w-5 h-5 mx-2" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleSocialRegister("LinkedIn")}
                  className="h-12 border-[#0D5BDC]/20 hover:border-[#0D5BDC]/50 text-[#262626]"
                >
                  <Linkedin className="w-5 h-5 mx-2" />
                  LinkedIn
                </Button>
              </div>

              {/* Login Link */}
              <p className="text-center mt-6 text-[#262626]/70">
                {t("form.loginPrompt")}
                <Link href="/login" className="text-[#0D5BDC] hover:underline">
                  {t("form.loginLink")}
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
