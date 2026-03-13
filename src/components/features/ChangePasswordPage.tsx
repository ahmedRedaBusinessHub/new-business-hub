"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { KeyRound, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { toast } from "sonner";
import { useI18n } from "@/hooks/useI18n";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const { t, language } = useI18n("changePassword");
  const router = useRouter();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.old_password || !formData.new_password || !formData.confirm_password) {
      toast.error("All fields are required");
      return;
    }

    if (formData.new_password.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      toast.error("New passwords do not match");
      return;
    }

    if (formData.old_password === formData.new_password) {
      toast.error("New password must be different from old password");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          old_password: formData.old_password,
          new_password: formData.new_password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      toast.success(data.message || "Password changed successfully");
      
      // Clear form
      setFormData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });

      // Optionally redirect after a delay
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error: any) {
      console.error("Change password error:", error);
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen py-12 px-4 flex items-center justify-center"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 border-0" style={{ backgroundColor: "var(--theme-bg-secondary)" }}>
          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-primary) 10%, transparent)",
              }}
            >
              <KeyRound
                className="w-5 h-5"
                style={{ color: "var(--theme-primary)" }}
              />
              <span style={{ color: "var(--theme-text-primary)" }}>
                Change Password
              </span>
            </motion.div>

            <h2
              className="text-3xl sm:text-4xl mb-2"
              style={{ color: "var(--theme-text-primary)" }}
            >
              Update Your Password
            </h2>
            <p style={{ color: "var(--theme-text-secondary)" }}>
              Enter your current password and choose a new one
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Old Password */}
            <div>
              <Label htmlFor="old_password" style={{ color: "var(--theme-text-primary)" }}>
                Current Password *
              </Label>
              <div className="relative mt-2">
                <Lock
                  className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 ${
                    language === "ar" ? "right-3" : "left-3"
                  }`}
                  style={{ color: "var(--theme-text-secondary)" }}
                />
                <Input
                  id="old_password"
                  name="old_password"
                  type={showOldPassword ? "text" : "password"}
                  value={formData.old_password}
                  onChange={handleChange}
                  className={`h-12 ${
                    language === "ar" ? "pr-10 pl-10" : "pl-10 pr-10"
                  }`}
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 ${
                    language === "ar" ? "left-3" : "right-3"
                  }`}
                >
                  {showOldPassword ? (
                    <EyeOff className="w-5 h-5" style={{ color: "var(--theme-text-secondary)" }} />
                  ) : (
                    <Eye className="w-5 h-5" style={{ color: "var(--theme-text-secondary)" }} />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <Label htmlFor="new_password" style={{ color: "var(--theme-text-primary)" }}>
                New Password *
              </Label>
              <div className="relative mt-2">
                <Lock
                  className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 ${
                    language === "ar" ? "right-3" : "left-3"
                  }`}
                  style={{ color: "var(--theme-text-secondary)" }}
                />
                <Input
                  id="new_password"
                  name="new_password"
                  type={showNewPassword ? "text" : "password"}
                  value={formData.new_password}
                  onChange={handleChange}
                  className={`h-12 ${
                    language === "ar" ? "pr-10 pl-10" : "pl-10 pr-10"
                  }`}
                  placeholder="Enter new password (min 6 characters)"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 ${
                    language === "ar" ? "left-3" : "right-3"
                  }`}
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" style={{ color: "var(--theme-text-secondary)" }} />
                  ) : (
                    <Eye className="w-5 h-5" style={{ color: "var(--theme-text-secondary)" }} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirm_password" style={{ color: "var(--theme-text-primary)" }}>
                Confirm New Password *
              </Label>
              <div className="relative mt-2">
                <Lock
                  className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 ${
                    language === "ar" ? "right-3" : "left-3"
                  }`}
                  style={{ color: "var(--theme-text-secondary)" }}
                />
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className={`h-12 ${
                    language === "ar" ? "pr-10 pl-10" : "pl-10 pr-10"
                  }`}
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 ${
                    language === "ar" ? "left-3" : "right-3"
                  }`}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" style={{ color: "var(--theme-text-secondary)" }} />
                  ) : (
                    <Eye className="w-5 h-5" style={{ color: "var(--theme-text-secondary)" }} />
                  )}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <Button
                type="submit"
                className="w-full py-6 text-white border-0"
                disabled={isLoading}
                style={{
                  backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
                }}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Changing Password...
                  </div>
                ) : (
                  "Change Password"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-full"
                style={{
                  borderColor: "var(--theme-border)",
                  color: "var(--theme-text-primary)",
                }}
              >
                <ArrowLeft className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}

