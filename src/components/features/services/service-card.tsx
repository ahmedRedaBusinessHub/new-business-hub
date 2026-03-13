"use client";

import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AdditionalService } from "@/types/api/services";
import { cn } from "@/lib/utils";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface ServiceCardProps {
    service: AdditionalService;
    onSelect?: (service: AdditionalService) => void;
    isSelected?: boolean;
    className?: string;
}

export function ServiceCard({
    service,
    onSelect,
    isSelected,
    className,
}: ServiceCardProps) {
    const t = useTranslations();
    const locale = useLocale();

    const name = locale === "ar" ? service.name_ar : service.name_en;
    const description = locale === "ar" ? service.description_ar : service.description_en;

    const getPricingTypeLabel = (type: string) => {
        switch (type) {
            case "per_hour":
                return t("space_pricing_hourly");
            case "per_attendee":
                return "/ " + t("space_capacity_label").toLowerCase();
            default:
                return "";
        }
    };

    return (
        <Card
            className={cn(
                "group relative overflow-hidden transition-all duration-300 hover:shadow-xl",
                isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border bg-card hover:border-primary/50",
                className
            )}
        >
            {/* Visual background element */}
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />

            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary hover:bg-primary/20">
                        {service.category}
                    </Badge>
                    {isSelected && (
                        <CheckCircle2 className="h-5 w-5 text-primary animate-in zoom-in" />
                    )}
                </div>
                <CardTitle className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {name}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {description && (
                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                        {description}
                    </p>
                )}

                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-foreground">
                        {service.price}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                        SAR {getPricingTypeLabel(service.pricingType)}
                    </span>
                </div>
            </CardContent>

            <CardFooter className="pt-0">
                <Button
                    onClick={() => onSelect?.(service)}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                        "w-full transition-all duration-300",
                        !isSelected && "hover:bg-primary hover:text-primary-foreground"
                    )}
                >
                    {isSelected ? (
                        <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            {t("added")}
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            {t("service_book_cta")}
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
