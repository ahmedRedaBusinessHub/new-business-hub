// src/components/home/SearchBar.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface SearchFilters {
  query: string;
  category: string;
  location: string;
}

export default function SearchBar() {
  const router = useRouter();
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "",
    location: "",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (filters.query) params.append("q", filters.query);
    if (filters.category) params.append("category", filters.category);
    if (filters.location) params.append("location", filters.location);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-2xl shadow-xl p-6 md:p-8 -translate-y-1/2"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Query */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What are you looking for?
          </label>
          <input
            type="text"
            placeholder="e.g., Private Office, Coworking"
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="office">Private Office</option>
            <option value="coworking">Coworking</option>
            <option value="meeting">Meeting Rooms</option>
            <option value="event">Event Spaces</option>
            <option value="retail">Retail Spaces</option>
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            placeholder="City or area"
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
            Search
          </button>
        </div>
      </div>

      {/* Recent Searches */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3">Popular searches:</p>
        <div className="flex flex-wrap gap-2">
          {[
            "Private Office",
            "Coworking Space",
            "Meeting Rooms",
            "Event Venue",
          ].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setFilters({ ...filters, query: tag })}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
