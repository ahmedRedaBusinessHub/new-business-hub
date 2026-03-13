// src/components/home/FeaturedSpaces.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { StarIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

interface UnitType {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  location: string;
  amenities: string[];
  category: string;
}

async function fetchFeaturedSpaces(): Promise<UnitType[]> {
  const response = await fetch(
    "http://192.168.0.103:3000/api/unit-types?featured=true&limit=6",
    {
      cache: "no-store",
    }
  );

  console.log("🚀 ~ fetchFeaturedSpaces ~ response:", response);
  if (!response.ok) {
    throw new Error("Failed to fetch spaces");
  }

  return response.json();
}

export default function FeaturedSpaces() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const {
    data: spaces = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["featured-spaces"],
    queryFn: fetchFeaturedSpaces,
  });

  const categories = [
    "all",
    "office",
    "coworking",
    "meeting",
    "event",
    "retail",
  ];

  const filteredSpaces =
    selectedCategory === "all"
      ? spaces
      : spaces.filter((space) => space.category === selectedCategory);
  console.log("🚀 ~ FeaturedSpaces ~ filteredSpaces:", filteredSpaces);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          Unable to load featured spaces. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Section Header */}
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl leading-20 font-bold text-gray-900 mb-4">
          Featured Spaces
        </h2>
        <p className="text-xl text-gray-600">
          Discover our most popular and highly-rated workspaces
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-12 flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-full font-medium transition ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Spaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading
          ? Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-xl mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              ))
          : filteredSpaces.map((space: any) => (
              <div
                key={space.id}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <Image
                    src={
                      space.image ||
                      "https://images.unsplash.com/photo-1557893675-69354f341dc3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340"
                    }
                    alt={space.name}
                    fill
                    className="object-cover group-hover:scale-110 transition"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                    {space.name}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <MapPinIcon className="w-4 h-4" />
                    <p className="text-sm">{space.location}</p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {space.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.round(space.rating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {space.rating} ({space.reviews} reviews)
                    </span>
                  </div>

                  {/* Amenities */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {space.features.amenities
                        .slice(0, 3)
                        .map((amenity: any, idx: any) => (
                          <span
                            key={idx}
                            className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        ${space.price}
                      </p>
                      <p className="text-xs text-gray-600">per month</p>
                    </div>
                    <Link
                      href={`/work-space/${space.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* View All CTA */}
      {!isLoading && filteredSpaces.length > 0 && (
        <div className="text-center mt-12">
          <Link
            href="/spaces"
            className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            View All Spaces
          </Link>
        </div>
      )}
    </div>
  );
}
