"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const res: any = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });

      // next-auth returns an object when redirect: false
      if (res?.error) {
        setError(res.error || "Sign in failed");
      } else {
        // Successful sign in: navigate to home (or configured redirect)
        router.push("/");
      }
    } catch (err: any) {
      console.error("Sign in failed:", err);
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-2">
          Username
        </label>
        <Input id="username" name="username" required placeholder="username" />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          placeholder="password"
        />
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? "Signing in…" : "Sign In"}
      </Button>

      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Demo credentials: admin / admin123</p>
      </div>
    </form>
  );
}
