// src/components/home/CTASection.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { EnvelopeIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type NewsletterForm = z.infer<typeof newsletterSchema>;

export default function CTASection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterForm) => {
    try {
      setIsSubmitting(true);

      const response = await fetch(
        process.env.EXTERNAL_API_URL + "/api/newsletter/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to subscribe");
      }

      toast.success("Successfully subscribed to newsletter!");
      reset();
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
      console.error("Newsletter subscription error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-white">
      <div className="max-w-4xl mx-auto">
        {/* Main CTA */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Find Your Perfect Workspace?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of businesses and start your journey with BusinessHub
            today
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/signup"
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Book Now
              <ArrowRightIcon className="w-5 h-5" />
            </Link>

            <Link
              href="/spaces"
              className="px-8 py-4 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition border border-blue-400 w-full sm:w-auto text-center"
            >
              Explore Spaces
            </Link>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-blue-900/50 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-blue-400/30">
          <h3 className="text-2xl font-bold mb-4 text-center">
            Stay Updated with the Latest Offers
          </h3>
          <p className="text-center text-blue-100 mb-8">
            Subscribe to our newsletter for exclusive deals and market insights
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <div className="flex-1 relative">
              <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
              <input
                type="email"
                placeholder="Your email address"
                {...register("email")}
                disabled={isSubmitting}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 text-white placeholder-blue-200 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
          </form>

          {errors.email && (
            <p className="text-center text-red-300 text-sm mt-2">
              {errors.email.message}
            </p>
          )}

          <p className="text-center text-blue-200 text-xs mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>

        {/* Bottom Message */}
        <div className="text-center mt-12">
          <p className="text-blue-100 mb-4">
            Need help? Contact our support team at support@businesshub.com
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm">
            <Link
              href="/contact"
              className="text-white hover:text-blue-200 transition"
            >
              Contact Us
            </Link>
            <span className="text-blue-300 hidden sm:block">•</span>
            <Link
              href="/faq"
              className="text-white hover:text-blue-200 transition"
            >
              FAQ
            </Link>
            <span className="text-blue-300 hidden sm:block">•</span>
            <Link
              href="/terms"
              className="text-white hover:text-blue-200 transition"
            >
              Terms
            </Link>
            <span className="text-blue-300 hidden sm:block">•</span>
            <Link
              href="/privacy"
              className="text-white hover:text-blue-200 transition"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
