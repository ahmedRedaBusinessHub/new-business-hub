// src/components/home/BenefitsSection.tsx

"use client";

import {
  CheckCircleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserGroupIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";

interface Benefit {
  title: string;
  description: string;
  icon: React.ComponentType<{ className: string }>;
}

const benefits: Benefit[] = [
  {
    title: "Verified Spaces",
    description:
      "All our listed spaces are thoroughly verified and quality-assured",
    icon: CheckCircleIcon,
  },
  {
    title: "Secure Bookings",
    description: "Safe and transparent transactions with buyer protection",
    icon: ShieldCheckIcon,
  },
  {
    title: "Flexible Terms",
    description: "Month-to-month leases with flexible cancellation policies",
    icon: ClockIcon,
  },
  {
    title: "Expert Support",
    description: "Dedicated team to help you find and manage your workspace",
    icon: UserGroupIcon,
  },
  {
    title: "Prime Locations",
    description: "Access to premium business locations in major cities",
    icon: MapPinIcon,
  },
  {
    title: "Amazing Amenities",
    description: "Top-tier facilities including WiFi, parking, and more",
    icon: SparklesIcon,
  },
];

export default function BenefitsSection() {
  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl leading-20 font-bold text-gray-900 mb-4">
          Why Choose BusinessHub?
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We provide the most reliable and transparent business space
          marketplace
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div
              key={index}
              className="bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition group"
            >
              {/* Icon */}
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="mt-16 bg-blue-50 rounded-2xl p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-blue-600 mb-2">24/7</p>
            <p className="text-gray-700">Customer Support</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-600 mb-2">100%</p>
            <p className="text-gray-700">Satisfaction Guarantee</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-600 mb-2">Zero</p>
            <p className="text-gray-700">Hidden Fees</p>
          </div>
        </div>
      </div>
    </div>
  );
}
