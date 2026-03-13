"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Amenity } from "@/types/api/spaces";
import {
    Wifi,
    Coffee,
    Monitor,
    Printer,
    Wind,
    Video,
    Car,
    Shield,
    Smartphone,
    DoorClosed,
    Users,
    Zap,
    CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AmenitiesListProps {
    amenities: Amenity[];
}

export function AmenitiesList({ amenities }: AmenitiesListProps) {
    const t = useTranslations();
    const params = useParams();
    const locale = params.locale as string;

    if (!amenities || amenities.length === 0) {
        return (
            <div className="text-muted-foreground p-8 bg-muted/20 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="w-10 h-10 mb-2 opacity-20" />
                <p className="font-medium">{t("space_amenities_empty") || "Standard professional amenities included."}</p>
            </div>
        );
    }

    // Icon mapping uses English name detection regardless of current locale for consistent key matching
    const getIcon = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes("wifi") || lowerName.includes("internet")) return <Wifi />;
        if (lowerName.includes("coffee") || lowerName.includes("cafe") || lowerName.includes("beverage") || lowerName.includes("hospitality")) return <Coffee />;
        if (lowerName.includes("screen") || lowerName.includes("monitor") || lowerName.includes("projector")) return <Monitor />;
        if (lowerName.includes("print") || lowerName.includes("scan") || lowerName.includes("office services")) return <Printer />;
        if (lowerName.includes("ac") || lowerName.includes("air") || lowerName.includes("conditioning")) return <Wind />;
        if (lowerName.includes("video") || lowerName.includes("camera") || lowerName.includes("zoom")) return <Video />;
        if (lowerName.includes("park")) return <Car />;
        if (lowerName.includes("secure") || lowerName.includes("fingerprint") || lowerName.includes("locker")) return <Shield />;
        if (lowerName.includes("24/7") || lowerName.includes("access")) return <Zap />;
        if (lowerName.includes("phone") || lowerName.includes("booth")) return <Smartphone />;
        if (lowerName.includes("meeting") || lowerName.includes("conference")) return <Users />;
        if (lowerName.includes("private") || lowerName.includes("door")) return <DoorClosed />;
        return <CheckCircle2 />;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold tracking-tight">
                    {t("space_detail_amenities_title") || "World-Class Amenities"}
                </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((amenity) => (
                    <div
                        key={amenity.id}
                        className="group flex flex-col p-4 rounded-2xl bg-secondary/30 border border-transparent hover:border-primary/20 hover:bg-secondary/50 transition-all duration-300"
                    >
                        <div className="p-2.5 w-fit rounded-xl bg-background shadow-sm text-primary mb-3 group-hover:scale-110 transition-transform">
                            {getIcon(amenity.name_en)}
                        </div>
                        <span className="text-sm font-bold text-foreground/80 group-hover:text-foreground transition-colors">
                            {locale === "ar" ? amenity.name_ar : amenity.name_en}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
