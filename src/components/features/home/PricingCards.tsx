// src/components/home/PricingCards.tsx

"use client";

import Link from "next/link";
import { CheckIcon } from "@heroicons/react/24/solid";

interface PricingTier {
  name: string;
  description: string;
  price: string;
  period: string;
  cta: string;
  ctaLink: string;
  features: string[];
  highlighted: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    description: "Perfect for freelancers and small teams",
    price: "$299",
    period: "per month",
    cta: "Get Started",
    ctaLink: "/signup",
    highlighted: false,
    features: [
      "Private desk",
      "High-speed WiFi",
      "Access 9am-5pm",
      "Basic support",
      "1 parking spot",
    ],
  },
  {
    name: "Professional",
    description: "Ideal for growing businesses",
    price: "$799",
    period: "per month",
    cta: "Choose Plan",
    ctaLink: "/signup",
    highlighted: true,
    features: [
      "Private office (small)",
      "24/7 access",
      "High-speed WiFi",
      "Meeting room credits",
      "Priority support",
      "3 parking spots",
      "Mail handling",
    ],
  },
  {
    name: "Enterprise",
    description: "For established corporations",
    price: "Custom",
    period: "contact us",
    cta: "Contact Sales",
    ctaLink: "/contact",
    highlighted: false,
    features: [
      "Custom office space",
      "24/7 access",
      "Dedicated manager",
      "Unlimited meeting rooms",
      "24/7 support",
      "Unlimited parking",
      "Custom amenities",
    ],
  },
];

export default function PricingCards() {
  return (
    <div id="pricing">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl leading-20 font-bold text-gray-900 mb-4">
          Transparent Pricing
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the perfect plan for your business needs. All plans include
          access to our facilities.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {pricingTiers.map((tier, index) => (
          <div
            key={index}
            className={`relative rounded-2xl overflow-hidden transition transform hover:scale-105 ${
              tier.highlighted
                ? "bg-gradient-to-br from-blue-600 to-blue-800 text-white ring-2 ring-blue-600 md:scale-105"
                : "bg-white border border-gray-200 text-gray-900"
            }`}
          >
            {/* Badge */}
            {tier.highlighted && (
              <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                Most Popular
              </div>
            )}

            {/* Content */}
            <div className="p-8">
              {/* Tier Name */}
              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <p
                className={`mb-6 ${
                  tier.highlighted ? "text-blue-100" : "text-gray-600"
                }`}
              >
                {tier.description}
              </p>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl leading-20 font-bold">
                    {tier.price}
                  </span>
                  <span
                    className={
                      tier.highlighted ? "text-blue-100" : "text-gray-600"
                    }
                  >
                    {tier.period}
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href={tier.ctaLink}
                className={`w-full block text-center px-6 py-3 rounded-lg font-semibold mb-8 transition ${
                  tier.highlighted
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {tier.cta}
              </Link>

              {/* Features List */}
              <div className="space-y-4">
                {tier.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-3">
                    <CheckIcon
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        tier.highlighted ? "text-yellow-300" : "text-green-500"
                      }`}
                    />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Divider */}
            <div
              className={`h-1 ${
                tier.highlighted
                  ? "bg-yellow-400"
                  : "bg-gradient-to-r from-gray-200 to-transparent"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-16 text-center">
        <p className="text-gray-600 mb-4">
          All plans include a 14-day free trial. No credit card required.
        </p>
        <Link
          href="/pricing-faq"
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          View Pricing FAQ →
        </Link>
      </div>
    </div>
  );
}
