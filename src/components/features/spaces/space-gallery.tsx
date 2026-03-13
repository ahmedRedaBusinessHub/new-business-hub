"use client";

import { useState } from "react";
import Image from "next/image";
import { SpaceImage } from "@/types/api/spaces";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/Carousel";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface SpaceGalleryProps {
    images: SpaceImage[];
}

export function SpaceGallery({ images }: SpaceGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-64 md:h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No images available</span>
            </div>
        );
    }

    // Ensure images are sorted by display_order
    const sortedImages = [...images].sort((a, b) => a.display_order - b.display_order);

    return (
        <div className="space-y-4">
            <div
                className="relative w-full aspect-video md:aspect-[2/1] rounded-xl overflow-hidden bg-gray-100 cursor-pointer group"
                onClick={() => setIsFullscreen(true)}
            >
                <Image
                    src={sortedImages[selectedIndex].image_url}
                    alt={sortedImages[selectedIndex].caption_en || "Space image"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-md transition-all">
                        Click to view full screen
                    </span>
                </div>
            </div>

            {sortedImages.length > 1 && (
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2">
                        {sortedImages.map((image, index) => (
                            <CarouselItem key={image.id} className="pl-2 basis-1/3 md:basis-1/4 lg:basis-1/5">
                                <div
                                    className={cn(
                                        "relative aspect-video cursor-pointer overflow-hidden rounded-md border-2 transition-all",
                                        selectedIndex === index ? "border-primary" : "border-transparent hover:opacity-80"
                                    )}
                                    onClick={() => setSelectedIndex(index)}
                                >
                                    <Image
                                        src={image.image_url}
                                        alt={image.caption_en || `Thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {sortedImages.length > 3 && (
                        <>
                            <CarouselPrevious className="left-2" />
                            <CarouselNext className="right-2" />
                        </>
                    )}
                </Carousel>
            )}

            {isFullscreen && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-200">
                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all z-50"
                        aria-label="Close fullscreen"
                    >
                        <X className="w-6 h-6 md:w-8 md:h-8" />
                    </button>

                    <div className="relative w-full h-[100dvh] max-w-[100vw] flex items-center justify-center p-4 md:p-12">
                        <Image
                            src={sortedImages[selectedIndex].image_url}
                            alt={sortedImages[selectedIndex].caption_en || "Space image fullscreen"}
                            fill
                            className="object-contain"
                            priority
                            sizes="100vw"
                            quality={100}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
