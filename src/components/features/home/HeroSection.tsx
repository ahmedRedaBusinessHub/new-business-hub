// src/components/home/HeroSection.tsx

"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Find Your Ideal Business Space
          </h1>

          <p className="text-xl md:text-2xl text-blue-100 mb-10">
            Discover, book, and manage professional workspaces tailored to your
            business needs
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="#search"
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Explore Spaces
              <ArrowRightIcon className="w-5 h-5" />
            </Link>

            <Link
              href="#featured"
              className="px-8 py-4 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition border border-blue-500 w-full sm:w-auto text-center"
            >
              See Featured Spaces
            </Link>
          </div>

          {/* Stats/Trust indicators */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center max-w-2xl mx-auto">
            <div>
              <p className="text-3xl font-bold">500+</p>
              <p className="text-blue-100">Business Spaces</p>
            </div>
            <div>
              <p className="text-3xl font-bold">10K+</p>
              <p className="text-blue-100">Active Members</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-3xl font-bold">4.8★</p>
              <p className="text-blue-100">Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
