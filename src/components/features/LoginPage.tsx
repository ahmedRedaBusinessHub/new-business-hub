"use client";
import { useState } from "react";
import { motion } from "motion/react";
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
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
import OTPVerification from "./OTPVerification";
import { OtpChannel, OtpType } from "@/types/auth";

type LoginMode = "email" | "mobile";

export default function LoginPage() {
  const { t, language } = useI18n("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState<LoginMode>("email");
  const [identifier, setIdentifier] = useState("");
  const [countryCode, setCountryCode] = useState("+966");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpData, setOtpData] = useState<{
    identifier: string;
    country_code?: string;
    channel: OtpChannel;
    type?: OtpType;
    retryAfter?: string;
    loginCredentials?: {
      identifier: string;
      password: string;
      country_code?: string;
      platform?: string;
      client_info?: string;
    };
  } | null>(null);
  const router = useRouter();

  // Detect if identifier is mobile number (only digits)
  const isMobileNumber = (value: string) => {
    return /^\d+$/.test(value.replace(/\s/g, ""));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!identifier || !password) {
      toast.error(t("validation.allFieldsRequired"));
      return;
    }

    // Determine login mode and validate
    const isMobile = isMobileNumber(identifier);
    if (isMobile && !countryCode) {
      toast.error(t("validation.countryCodeRequired") || "Country code is required for mobile login");
      return;
    }

    if (loginMode === "email" && !isMobile) {
      // Email/username validation - basic check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailRegex.test(identifier);
      const isValidUsername = /^[a-zA-Z0-9_]+$/.test(identifier);

      if (!isValidEmail && !isValidUsername) {
        toast.error(t("validation.invalidEmail") || "Please enter a valid email or username");
        return;
      }
    }

    setIsLoading(true);

    try {
      const credentials: any = {
        identifier,
        password,
        platform: "web",
        client_info: typeof window !== "undefined" ? navigator.userAgent : "",
      };

      // Add country_code if mobile login
      if (isMobile && countryCode) {
        credentials.country_code = countryCode;
      }

      const res: any = await signIn("credentials", {
        redirect: false,
        ...credentials,
      });

      console.log('res',  res);

      if (res?.error) {
        // Helper function to extract and parse 2FA error
        const extract2FAError = (errorString: string): any => {
          // console.log('errorString', errorString);
          if (!errorString) return null;

          try {
            // Try to parse directly
            const parsed = JSON.parse(errorString);
            if (parsed.type === "2FA_REQUIRED") {
              return parsed;
            }
          } catch (e) {
            // If direct parse fails, try to extract from NextAuth wrapped error
          }

          // Try to find JSON object containing "2FA_REQUIRED" in the string
          // This handles cases where NextAuth wraps the error
          const jsonPatterns = [
            /\{[\s\S]*"type"\s*:\s*"2FA_REQUIRED"[\s\S]*\}/, // Most specific
            /\{[\s\S]*"2FA_REQUIRED"[\s\S]*\}/, // Less specific
            /\{[^}]*"actions"[^}]*\}/, // Look for actions field
          ];

          for (const pattern of jsonPatterns) {
            const match = errorString.match(pattern);
            if (match) {
              try {
                const parsed = JSON.parse(match[0]);
                if (parsed.type === "2FA_REQUIRED" || parsed.actions) {
                  return parsed;
                }
              } catch (parseErr) {
                // Continue to next pattern
              }
            }
          }

          // Try to extract from NextAuth wrapped error patterns
          const wrapperPatterns = [
            /CallbackRouteError:\s*(.+?)(?:\.\s*Read more at|$)/,
            /Error:\s*(.+?)(?:\.\s*Read more at|$)/,
            /cause[:\s]*(\{[\s\S]*\})/i, // Look for cause: { ... }
          ];

          for (const pattern of wrapperPatterns) {
            const match = errorString.match(pattern);
            if (match && match[1]) {
              try {
                const parsed = JSON.parse(match[1].trim());
                if (parsed.type === "2FA_REQUIRED" || parsed.actions) {
                  return parsed;
                }
              } catch (parseErr) {
                // Continue to next pattern
              }
            }
          }

          return null;
        };

        // Helper function to determine OTP channel from actions string
        const getChannelFromActions = (actions: string | string[] | undefined): OtpChannel => {
          const actionsStr = typeof actions === 'string'
            ? actions
            : Array.isArray(actions)
            ? actions.join('')
            : '';

          // Check for email in actions: 'sent_email' | 'already_sent_email'
          if (actionsStr.includes("email")) {
            return OtpChannel.EMAIL;
          }
          // Otherwise it's SMS: 'sent_sms' | 'already_sent_sms'
          return OtpChannel.SMS;
        };

        // Check if it's a 2FA error
        const errorData = extract2FAError(res.error);

        if (errorData && (errorData.type === "2FA_REQUIRED" || errorData.actions)) {
          // Determine OTP channel from actions string
          // actions can be: 'sent_email' | 'sent_sms' | 'already_sent_email' | 'already_sent_sms'
          const channel = getChannelFromActions(errorData.actions);

          // Use identifier from error data if available, otherwise use form input
          const finalIdentifier = errorData.identifier || identifier;
          const finalCountryCode = errorData.country_code || (isMobile ? countryCode : undefined);

          setOtpData({
            identifier: finalIdentifier,
            country_code: finalCountryCode,
            channel,
            type: OtpType.LOGIN,
            retryAfter: errorData.retry_after,
            loginCredentials: {
              identifier,
              password,
              country_code: isMobile ? countryCode : undefined,
              platform: "web",
              client_info: typeof window !== "undefined" ? navigator.userAgent : "",
            },
          });
          setShowOTP(true);
          toast.success(errorData.message || "OTP sent successfully");
          setIsLoading(false);
          return;
        }

        // Display the error message from the API
        // NextAuth v5 wraps errors, extract the message properly
        let errorMessage: string | null = null;

        // Handle different error formats from NextAuth v5
        if (typeof res.error === "string") {
          // Try to parse as JSON first (for 2FA errors)
          try {
            const parsed = JSON.parse(res.error);

            if (parsed.type === "2FA_REQUIRED") {
              // Already handled above, but just in case
              return;
            }
          } catch (e) {
            // Not JSON - check if it's the error message directly
            // NextAuth v5 wraps errors in "CallbackRouteError: <message>. Read more at..."
            const errorStr = res.error;

            // Try to extract the actual error message if it's wrapped
            // Pattern: "CallbackRouteError: <message>. Read more at..." or "Error: <message>"
            let extracted = null;

            // First, try to extract from CallbackRouteError format
            const callbackRouteMatch = errorStr.match(/CallbackRouteError:\s*(.+?)(?:\.\s*Read more at|$)/);
            if (callbackRouteMatch && callbackRouteMatch[1]) {
              extracted = callbackRouteMatch[1].trim();

              // Try to parse extracted as JSON (might be JSON string)
              try {
                const extractedParsed = JSON.parse(extracted);
                if (extractedParsed.type === "2FA_REQUIRED") {
                  // Handle 2FA here
                  const channel = extractedParsed.actions?.includes("email") ? OtpChannel.EMAIL : OtpChannel.SMS;
                  setOtpData({
                    identifier: extractedParsed.identifier || identifier,
                    country_code: extractedParsed.country_code || (isMobile ? countryCode : undefined),
                    channel,
                    type: OtpType.LOGIN,
                    retryAfter: extractedParsed.retry_after,
                    loginCredentials: {
                      identifier,
                      password,
                      country_code: isMobile ? countryCode : undefined,
                      platform: "web",
                      client_info: typeof window !== "undefined" ? navigator.userAgent : "",
                    },
                  });
                  setShowOTP(true);
                  toast.success(extractedParsed.message || "OTP sent successfully");
                  setIsLoading(false);
                  return;
                }
              } catch (parseErr) {
                // Extracted is not JSON, continue with regular error handling
              }
            }

            // If not found, try Error: format
            if (!extracted) {
              const errorMatch = errorStr.match(/Error:\s*(.+?)(?:\.\s*Read more at|$)/);
              if (errorMatch && errorMatch[1]) {
                extracted = errorMatch[1].trim();

                // Try to parse extracted as JSON
                try {
                  const extractedParsed = JSON.parse(extracted);
                  if (extractedParsed.type === "2FA_REQUIRED") {
                    // Handle 2FA here
                    const channel = extractedParsed.actions?.includes("email") ? OtpChannel.EMAIL : OtpChannel.SMS;
                    setOtpData({
                      identifier: extractedParsed.identifier || identifier,
                      country_code: extractedParsed.country_code || (isMobile ? countryCode : undefined),
                      channel,
                      type: OtpType.LOGIN,
                      retryAfter: extractedParsed.retry_after,
                      loginCredentials: {
                        identifier,
                        password,
                        country_code: isMobile ? countryCode : undefined,
                        platform: "web",
                        client_info: typeof window !== "undefined" ? navigator.userAgent : "",
                      },
                    });
                    setShowOTP(true);
                    toast.success(extractedParsed.message || "OTP sent successfully");
                    setIsLoading(false);
                    return;
                  }
                } catch (parseErr) {
                  // Extracted is not JSON, continue with regular error handling
                }
              }
            }

            // If still not found, use the string as-is (might be the message directly)
            errorMessage = extracted || errorStr;
          }
        } else if (typeof res.error === "object" && res.error !== null) {
          // Try to extract from various possible error structures
          // NextAuth v5 wraps errors, check common properties

          // First, try to get the cause (most common in NextAuth v5)
          if (res.error.cause) {
            if (res.error.cause instanceof Error) {
              errorMessage = res.error.cause.message;

              // Try to parse cause.message as JSON
              try {
                if (errorMessage) {
                  const causeParsed = JSON.parse(errorMessage);
                  if (causeParsed.type === "2FA_REQUIRED") {
                    // Handle 2FA here
                    const channel = causeParsed.actions?.includes("email") ? OtpChannel.EMAIL : OtpChannel.SMS;
                    setOtpData({
                      identifier: causeParsed.identifier || identifier,
                      country_code: causeParsed.country_code || (isMobile ? countryCode : undefined),
                      channel,
                      type: OtpType.LOGIN,
                      retryAfter: causeParsed.retry_after,
                      loginCredentials: {
                        identifier,
                        password,
                        country_code: isMobile ? countryCode : undefined,
                        platform: "web",
                        client_info: typeof window !== "undefined" ? navigator.userAgent : "",
                      },
                    });
                    setShowOTP(true);
                    toast.success(causeParsed.message || "OTP sent successfully");
                    setIsLoading(false);
                    return;
                  }
                }
              } catch (parseErr) {
                // Not JSON, continue
              }
            } else if (typeof res.error.cause === "string") {
              errorMessage = res.error.cause;

              // Try to parse cause as JSON
              try {
                if (errorMessage) {
                  const causeParsed = JSON.parse(errorMessage);
                  if (causeParsed.type === "2FA_REQUIRED") {
                    // Handle 2FA here
                    const channel = causeParsed.actions?.includes("email") ? OtpChannel.EMAIL : OtpChannel.SMS;
                    setOtpData({
                      identifier: causeParsed.identifier || identifier,
                      country_code: causeParsed.country_code || (isMobile ? countryCode : undefined),
                      channel,
                      type: OtpType.LOGIN,
                      retryAfter: causeParsed.retry_after,
                      loginCredentials: {
                        identifier,
                        password,
                        country_code: isMobile ? countryCode : undefined,
                        platform: "web",
                        client_info: typeof window !== "undefined" ? navigator.userAgent : "",
                      },
                    });
                    setShowOTP(true);
                    toast.success(causeParsed.message || "OTP sent successfully");
                    setIsLoading(false);
                    return;
                  }
                }
              } catch (parseErr) {
                // Not JSON, continue
              }
            } else if (res.error.cause?.message) {
              errorMessage = typeof res.error.cause.message === "string"
                ? res.error.cause.message
                : String(res.error.cause.message);

              // Try to parse cause.message as JSON
              try {
                if (errorMessage) {
                  const causeParsed = JSON.parse(errorMessage);
                  if (causeParsed.type === "2FA_REQUIRED") {
                    // Handle 2FA here
                    const channel = causeParsed.actions?.includes("email") ? OtpChannel.EMAIL : OtpChannel.SMS;
                    setOtpData({
                      identifier: causeParsed.identifier || identifier,
                      country_code: causeParsed.country_code || (isMobile ? countryCode : undefined),
                      channel,
                      type: OtpType.LOGIN,
                      retryAfter: causeParsed.retry_after,
                      loginCredentials: {
                        identifier,
                        password,
                        country_code: isMobile ? countryCode : undefined,
                        platform: "web",
                        client_info: typeof window !== "undefined" ? navigator.userAgent : "",
                      },
                    });
                    setShowOTP(true);
                    toast.success(causeParsed.message || "OTP sent successfully");
                    setIsLoading(false);
                    return;
                  }
                }
              } catch (parseErr) {
                // Not JSON, continue
              }
            }
          }

          // Fallback to message property
          if (!errorMessage && res.error.message) {
            errorMessage = typeof res.error.message === "string"
              ? res.error.message
              : String(res.error.message);
          }

          // Try to extract from stringified error (for deeply nested structures)
          if (!errorMessage) {
            try {
              const errorStr = JSON.stringify(res.error);
              // Look for message in various formats
              const patterns = [
                /"message":\s*"([^"]+)"/,
                /"cause":\s*"([^"]+)"/,
                /Error:\s*"([^"]+)"/,
              ];

              for (const pattern of patterns) {
                const match = errorStr.match(pattern);
                if (match && match[1]) {
                  errorMessage = match[1];
                  break;
                }
              }
            } catch (e) {
              // Ignore JSON stringify errors
            }
          }
        }

        // Fallback to default message if we couldn't extract one
        const finalErrorMessage = errorMessage || t("messages.loginFailed");
        toast.error(finalErrorMessage);
        setIsLoading(false);
      } else if (res?.ok) {
        // Login successful
        toast.success(t("messages.loginSuccess"));
        const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
        router.push(callbackUrl || "/");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || t("messages.loginFailed"));
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(t("messages.socialLogin").replace("{provider}", provider));
  };

  // Handle OTP verification completion
  const handleOTPBack = () => {
    setShowOTP(false);
    setOtpData(null);
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
          {!showOTP && (
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
          )}

          {/* Right Side - Login Form or OTP Verification */}
          {showOTP && otpData ? (
            <motion.div
              initial={{ opacity: 0, x: language === "ar" ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full flex justify-center"
            >
              <div className="w-full max-w-md">
                <OTPVerification
                  identifier={otpData.identifier}
                  country_code={otpData.country_code}
                  channel={otpData.channel}
                  type={otpData.type || OtpType.LOGIN}
                  retryAfter={otpData.retryAfter}
                  onBack={handleOTPBack}
                  loginCredentials={otpData.loginCredentials}
                />
              </div>
            </motion.div>
          ) : (
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

                {/* Login Mode Toggle */}
                <div className="flex gap-2 mb-6 p-1 rounded-lg" style={{ backgroundColor: "var(--theme-bg-primary)" }}>
                  <button
                    type="button"
                    onClick={() => setLoginMode("email")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      loginMode === "email"
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                    style={
                      loginMode === "email"
                        ? {
                            backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
                          }
                        : {
                            color: "var(--theme-text-secondary)",
                          }
                    }
                  >
                    {t("form.mode.email") || "Email / Username"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMode("mobile")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      loginMode === "mobile"
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                    style={
                      loginMode === "mobile"
                        ? {
                            backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
                          }
                        : {
                            color: "var(--theme-text-secondary)",
                          }
                    }
                  >
                    {t("form.mode.mobile") || "Mobile"}
                  </button>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                  {/* Identifier Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="identifier"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      {loginMode === "email"
                        ? t("form.email.label") || "Email or Username"
                        : t("form.mobile.label") || "Mobile Number"}
                    </Label>
                    {loginMode === "mobile" && (
                      <div className="flex gap-2">
                        <div className="w-24">
                          <Input
                            id="countryCode"
                            type="text"
                            value={countryCode}
                            onChange={(e: any) => setCountryCode(e.target.value)}
                            placeholder="+966"
                            className="py-6 text-center"
                            style={{
                              backgroundColor: "var(--theme-bg-primary)",
                              borderColor: "var(--theme-border)",
                              color: "var(--theme-text-primary)",
                            }}
                            required
                          />
                        </div>
                        <div className="flex-1 relative">
                          <Phone
                            className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5"
                            style={{ color: "var(--theme-text-secondary)" }}
                          />
                          <Input
                            id="identifier"
                            type="tel"
                            value={identifier}
                            onChange={(e: any) => setIdentifier(e.target.value)}
                            placeholder={t("form.mobile.placeholder") || "580629187"}
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
                    )}
                    {loginMode === "email" && (
                      <div className="relative">
                        <Mail
                          className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5"
                          style={{ color: "var(--theme-text-secondary)" }}
                        />
                        <Input
                          id="identifier"
                          type="text"
                          value={identifier}
                          onChange={(e: any) => setIdentifier(e.target.value)}
                          placeholder={t("form.email.placeholder") || "name@example.com or username"}
                          className="ltr:pl-10 rtl:pr-10 py-6"
                          style={{
                            backgroundColor: "var(--theme-bg-primary)",
                            borderColor: "var(--theme-border)",
                            color: "var(--theme-text-primary)",
                          }}
                          required
                        />
                      </div>
                    )}
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
                    <Link
                      href="/forgot-password"
                      className="text-sm hover:underline"
                      style={{ color: "var(--theme-primary)" }}
                    >
                      {t("form.forgotPassword")}
                    </Link>
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
                  <Link
                    href="/register"
                    className="hover:underline"
                    style={{ color: "var(--theme-primary)" }}
                  >
                    {t("signup.link")}
                  </Link>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
