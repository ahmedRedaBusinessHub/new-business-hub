"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Shield, ArrowLeft, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/Input-otp";
import { toast } from "sonner";
import { useI18n } from "@/hooks/useI18n";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { OtpType, OtpChannel } from "@/types/auth";

interface OTPVerificationProps {
  identifier: string;
  country_code?: string;
  channel: OtpChannel;
  type: OtpType;
  retryAfter?: string;
  onBack: () => void;
  onSuccess?: () => void;
  loginCredentials?: {
    identifier: string;
    password: string;
    country_code?: string;
    platform?: string;
    client_info?: string;
  };
}

export default function OTPVerification({
  identifier,
  country_code,
  channel,
  type,
  retryAfter,
  onBack,
  onSuccess,
  loginCredentials,
}: OTPVerificationProps) {
  const { t, language } = useI18n("login");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const router = useRouter();

  // Calculate countdown from retryAfter timestamp
  useEffect(() => {
    if (retryAfter) {
      const calculateCountdown = () => {
        const retryTime = new Date(retryAfter).getTime();
        const now = Date.now();
        const diff = Math.max(0, Math.floor((retryTime - now) / 1000));
        setCountdown(diff);
      };

      calculateCountdown();
      const interval = setInterval(calculateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [retryAfter]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error(t("otp.validation.incomplete") || "Please enter the complete 6-digit OTP");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          country_code,
          otp,
          type,
          channel,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      // Handle different OTP types
      if (type === OtpType.LOGIN) {
        // If verification successful, complete login with NextAuth
        if (data.access_token) {
          // Use the access_token directly for authentication
          const loginRes = await signIn("credentials", {
            redirect: false,
            identifier,
            access_token: data.access_token,
          });

          if (loginRes?.error) {
            throw new Error(loginRes.error);
          }

          toast.success(t("otp.messages.success") || "Login successful!");
          
          // Get callback URL from query params if exists
          const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
          router.push(callbackUrl || "/");
        } else {
          throw new Error("Invalid response from server");
        }
      } else if (type === OtpType.VERIFICATION) {
        // Registration verification - check if successful
        if (data.status === 1 && data.actions) {
          const successAction = data.actions.find((a: any) => 
            a.action.includes("verified") || a.action.includes("success")
          );
          
          if (successAction) {
            toast.success(successAction.message || "Verification successful!");
            if (onSuccess) {
              onSuccess();
            } else {
              // Default: redirect to login
              router.push("/login");
            }
          } else {
            toast.success("Verification successful!");
            if (onSuccess) {
              onSuccess();
            } else {
              router.push("/login");
            }
          }
        } else {
          throw new Error("Verification failed");
        }
      } else if (type === OtpType.RESET_PASSWORD) {
        // Password reset verification
        if (data.status === 1) {
          toast.success("OTP verified successfully!");
          if (onSuccess) {
            onSuccess();
          }
        } else {
          throw new Error("Verification failed");
        }
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      toast.error(error.message || t("otp.messages.failed") || "OTP verification failed");
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown && countdown > 0) {
      toast.error(
        t("otp.messages.wait")?.replace("{time}", formatCountdown(countdown)) ||
          `Please wait ${formatCountdown(countdown)} before requesting a new OTP`
      );
      return;
    }

    // For login type, we need login credentials
    if (type === OtpType.LOGIN && (!loginCredentials || !loginCredentials.password)) {
      toast.error(
        t("otp.messages.resendError") ||
          "Unable to resend OTP. Please go back and try logging in again."
      );
      return;
    }

    setIsLoading(true);
    try {
      // Call resend-otp API
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          country_code,
          type,
          channel,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to resend OTP");
      }

      const data = await res.json();
      
      // For login type, trigger login again to get new OTP
      if (type === OtpType.LOGIN && loginCredentials) {
        const loginRes = await signIn("credentials", {
          redirect: false,
          ...loginCredentials,
        });

        if (loginRes?.error) {
          try {
            const errorData = JSON.parse(loginRes.error);
            if (errorData.type === "2FA_REQUIRED") {
              toast.success(errorData.message || "OTP sent successfully");
              // Update retry_after if provided
              if (errorData.retry_after) {
                // The countdown will update automatically via useEffect
              }
            } else {
              throw new Error(loginRes.error);
            }
          } catch (e) {
            throw new Error(loginRes.error);
          }
        }
      } else {
        // For verification type, just show success message
        toast.success(data.message || "OTP sent successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="p-8 sm:p-10 border-0"
        style={{
          backgroundColor: "var(--theme-bg-secondary)",
          boxShadow:
            "0 20px 80px color-mix(in srgb, var(--theme-primary) 15%, transparent)",
        }}
      >
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
            <Shield
              className="w-5 h-5"
              style={{ color: "var(--theme-primary)" }}
            />
            <span style={{ color: "var(--theme-text-primary)" }}>
              {t("otp.header.badge") || "Two-Factor Authentication"}
            </span>
          </motion.div>

          <h2
            className="text-3xl sm:text-4xl mb-2"
            style={{ color: "var(--theme-text-primary)" }}
          >
            {t("otp.header.title") || "Verify Your Identity"}
          </h2>
          <p style={{ color: "var(--theme-text-secondary)" }}>
            {channel === OtpChannel.EMAIL
              ? t("otp.header.subtitleEmail")?.replace("{email}", identifier) ||
                `We've sent a verification code to ${identifier}`
              : t("otp.header.subtitleSms")?.replace("{phone}", `${country_code || ""}${identifier}`) ||
                `We've sent a verification code to ${country_code || ""}${identifier}`}
          </p>
        </div>

        {/* OTP Input */}
        <div className="space-y-6 mb-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              disabled={isLoading}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {countdown !== null && countdown > 0 && (
            <p className="text-center text-sm" style={{ color: "var(--theme-text-secondary)" }}>
              {t("otp.messages.countdown")?.replace("{time}", formatCountdown(countdown)) ||
                `Resend available in ${formatCountdown(countdown)}`}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            type="button"
            onClick={handleVerifyOTP}
            className="w-full py-6 text-white border-0 group"
            disabled={isLoading || otp.length !== 6}
            style={{
              backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
            }}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t("otp.button.verifying") || "Verifying..."}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {t("otp.button.verify") || "Verify OTP"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </Button>

          <div className="flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
              style={{
                borderColor: "var(--theme-border)",
                color: "var(--theme-text-primary)",
              }}
            >
              <ArrowLeft className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
              {t("otp.button.back") || "Back"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleResendOTP}
              className="flex-1"
              disabled={isLoading || (countdown !== null && countdown > 0)}
              style={{
                borderColor: "var(--theme-border)",
                color: "var(--theme-text-primary)",
              }}
            >
              {t("otp.button.resend") || "Resend OTP"}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

