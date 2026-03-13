"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Amenity } from "@/types/api/spaces";
import { Badge } from "@/components/ui/Badge";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";

interface AmenitySelectorProps {
    availableAmenities: Amenity[];
    selectedAmenityIds: number[];
    onChange: (amenityIds: number[]) => void;
    error?: string;
}

export function AmenitySelector({
    availableAmenities,
    selectedAmenityIds,
    onChange,
    error,
}: AmenitySelectorProps) {
    const t = useTranslations();
    const locale = useLocale();
    const isArabic = locale === "ar";

    const [search, setSearch] = useState("");

    const handleToggle = (id: number) => {
        if (selectedAmenityIds.includes(id)) {
            onChange(selectedAmenityIds.filter((existingId) => existingId !== id));
        } else {
            onChange([...selectedAmenityIds, id]);
        }
    };

    const filteredAmenities = availableAmenities.filter((amenity) => {
        const name = isArabic ? amenity.name_ar : amenity.name_en;
        return name.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end gap-4">
                <div className="flex-1">
                    <Label htmlFor="amenity-search">{t("admin_space_form_amenities") || "Amenities"}</Label>
                    <input
                        id="amenity-search"
                        className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                        placeholder={t("search") || "Search..."}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 border rounded-md p-4 max-h-64 overflow-y-auto">
                {filteredAmenities.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500 py-4">
                        {t("noResults") || "No amenities found"}
                    </div>
                ) : (
                    filteredAmenities.map((amenity) => {
                        const name = isArabic ? amenity.name_ar : amenity.name_en;
                        const isSelected = selectedAmenityIds.includes(amenity.id);
                        return (
                            <div
                                key={amenity.id}
                                className={`flex items-start space-x-2 space-x-reverse cursor-pointer p-2 rounded-md transition-colors ${isSelected ? "bg-primary/5" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                                onClick={() => handleToggle(amenity.id)}
                            >
                                <Checkbox
                                    id={`amenity-${amenity.id}`}
                                    checked={isSelected}
                                    onCheckedChange={() => handleToggle(amenity.id)}
                                    // Prevent double toggle when clicking the container
                                    onClick={(e) => e.stopPropagation()}
                                    className={isArabic ? "ml-2" : "mr-2"}
                                />
                                <Label
                                    htmlFor={`amenity-${amenity.id}`}
                                    className="cursor-pointer font-normal leading-tight"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {name}
                                </Label>
                            </div>
                        );
                    })
                )}
            </div>

            {selectedAmenityIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedAmenityIds.map((id) => {
                        const amenity = availableAmenities.find(a => a.id === id);
                        if (!amenity) return null;
                        const name = isArabic ? amenity.name_ar : amenity.name_en;
                        return (
                            <Badge key={id} variant="secondary" className="flex items-center gap-1">
                                {name}
                                <button
                                    onClick={() => handleToggle(id)}
                                    className="ml-1 text-gray-500 hover:text-red-500"
                                >
                                    &times;
                                </button>
                            </Badge>
                        );
                    })}
                </div>
            )}

            {error && (
                <p className="text-sm font-medium text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
}
