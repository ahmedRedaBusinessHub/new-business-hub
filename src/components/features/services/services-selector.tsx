"use client";

import { useTranslations } from "next-intl";
import { useServices } from "@/lib/hooks/use-services";
import { AdditionalService } from "@/types/api/services";
import { ServiceCard } from "./service-card";
import { Skeleton } from "@/components/ui/Skeleton";

interface ServicesSelectorProps {
    branchId?: number;
    // Make it flexible to support either the hook's own data or provided data
    services?: AdditionalService[];
    selectedServiceIds?: number[];
    onToggleService?: (service: AdditionalService) => void;
    // Additional props for page usage where parent doesn't hold state
    selectedServices?: AdditionalService[];
    onChange?: (services: AdditionalService[]) => void;
}

export function ServicesSelector({
    branchId,
    services: providedServices,
    selectedServiceIds,
    onToggleService,
    selectedServices,
    onChange,
}: ServicesSelectorProps) {
    const t = useTranslations();

    // Only fetch if services not provided by parent
    const { data: fetchedServices, isLoading, error } = useServices(
        { branchId },
        { enabled: !providedServices },
    );

    const services = providedServices ?? fetchedServices;
    const loading = providedServices ? false : isLoading;

    const handleToggle = (service: AdditionalService) => {
        // Determine state structure and apply appropriate callback
        if (onToggleService && selectedServiceIds !== undefined) {
            onToggleService(service);
        } else if (onChange && selectedServices !== undefined) {
            const isSelected = selectedServices.some((s) => s.id === service.id);
            if (isSelected) {
                onChange(selectedServices.filter((s) => s.id !== service.id));
            } else {
                onChange([...selectedServices, service]);
            }
        }
    };

    const isServiceSelected = (service: AdditionalService) => {
        if (selectedServiceIds) {
            return selectedServiceIds.includes(service.id);
        }
        if (selectedServices) {
            return selectedServices.some((s) => s.id === service.id);
        }
        return false;
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-48 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    if (error || !services) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-400">
                {t("services_no_services")}
            </div>
        );
    }

    if (services.length === 0) {
        return (
            <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">{t("services_no_services")}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
                <ServiceCard
                    key={service.id}
                    service={service}
                    isSelected={isServiceSelected(service)}
                    onSelect={handleToggle}
                />
            ))}
        </div>
    );
}
