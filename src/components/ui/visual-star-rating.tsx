"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface VisualStarRatingProps {
    rating: number;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function VisualStarRating({ rating, size = "md", className }: VisualStarRatingProps) {
    const sizeClasses = {
        sm: "w-3 h-3",
        md: "w-4 h-4",
        lg: "w-5 h-5",
    };

    return (
        <div className={cn("flex items-center gap-0.5", className)}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={cn(
                        sizeClasses[size],
                        star <= rating 
                            ? "text-yellow-500 fill-yellow-500" 
                            : "text-gray-300"
                    )}
                />
            ))}
        </div>
    );
}
