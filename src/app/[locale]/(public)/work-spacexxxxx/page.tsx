// src/app/(customer)/page.tsx

"use client";

import { Suspense } from "react";

import HeroSection from "@/components/features/home/HeroSection";
import SearchBar from "@/components/features/home/SearchBar";
import FeaturedSpaces from "@/components/features/home/FeaturedSpaces";
import BenefitsSection from "@/components/features/home/BenefitsSection";
import PricingCards from "@/components/features/home/PricingCards";
import TestimonialsSection from "@/components/features/home/TestimonialsSection";
import CTASection from "@/components/features/home/CTASection";

export default function LandingPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <HeroSection />

      {/* Search Bar Section */}
      <section className="bg-gray-50 py-8 -mt-6 relative z-10">
        <div className="container mx-auto px-4">
          <Suspense fallback={<div className="h-16 bg-gray-200 rounded-lg" />}>
            <SearchBar />
          </Suspense>
        </div>
      </section>

      {/* Featured Spaces */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <Suspense fallback={<div className="h-96 bg-gray-200 rounded-lg" />}>
            <FeaturedSpaces />
          </Suspense>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <BenefitsSection />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <PricingCards />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <TestimonialsSection />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4">
          <CTASection />
        </div>
      </section>
    </main>
  );
}
