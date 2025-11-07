// src/components/home/TestimonialsSection.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

interface Testimonial {
  id: number;
  name: string;
  company: string;
  role: string;
  content: string;
  image: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    company: "TechStart Co.",
    role: "CEO",
    content:
      "BusinessHub transformed how we work. Finding and managing our office space is now incredibly easy and affordable.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    company: "Design Studio Pro",
    role: "Founder",
    content:
      "The support team is amazing. They helped us transition smoothly and answered all our questions. Highly recommended!",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    company: "Marketing Plus",
    role: "Director",
    content:
      "Best decision we made. The facilities are top-notch and the flexibility with contracts is exactly what we needed.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    rating: 5,
  },
  {
    id: 4,
    name: "David Park",
    company: "Consulting Group",
    role: "Partner",
    content:
      "Professional environment, great amenities, and transparent pricing. Everything we wanted in a workspace provider.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
  ];

  return (
    <div id="testimonials">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          What Our Customers Say
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join thousands of satisfied businesses using BusinessHub
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {visibleTestimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition"
          >
            {/* Rating */}
            <div className="flex gap-1 mb-4">
              {Array(testimonial.rating)
                .fill(0)
                .map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                ))}
            </div>

            {/* Quote */}
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              "{testimonial.content}"
            </p>

            {/* Author Info */}
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">
                  {testimonial.role} at {testimonial.company}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={prev}
          className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white transition"
          aria-label="Previous testimonial"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full transition ${
                idx === currentIndex ? "bg-blue-600" : "bg-gray-300"
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white transition"
          aria-label="Next testimonial"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Trust Indicators */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6 bg-blue-50 rounded-xl">
          <p className="text-3xl font-bold text-blue-600 mb-2">10K+</p>
          <p className="text-gray-700">Happy Customers</p>
        </div>
        <div className="p-6 bg-blue-50 rounded-xl">
          <p className="text-3xl font-bold text-blue-600 mb-2">4.8★</p>
          <p className="text-gray-700">Average Rating</p>
        </div>
        <div className="p-6 bg-blue-50 rounded-xl">
          <p className="text-3xl font-bold text-blue-600 mb-2">98%</p>
          <p className="text-gray-700">Satisfaction Rate</p>
        </div>
      </div>
    </div>
  );
}
