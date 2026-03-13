"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useUpdateSpace } from "@/lib/hooks/use-spaces";
import { SpaceForm } from "@/components/features/admin/space-form";
import { CreateSpaceData } from "@/lib/schemas/space";
import { fetchSpaceDetails } from "@/lib/api/spaces";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminEditSpacePage() {
    const t = useTranslations();
    const router = useRouter();
    const params = useParams();
    const spaceId = params.id as string;

    const [initialData, setInitialData] = useState<Partial<CreateSpaceData> | null>(null);

    const { data: spaceData, isLoading: isLoadingSpace, isError } = useQuery({
        queryKey: ["admin_space_details", spaceId],
        queryFn: () => fetchSpaceDetails(spaceId),
        enabled: !!spaceId,
    });

    useEffect(() => {
        if (spaceData) {
            const space = spaceData;
            setInitialData({
                branch_id: space.branch?.id || 1, // Add proper mapping if available 
                name_en: space.name_en,
                name_ar: space.name_ar,
                code: space.code,
                description_en: space.description_en,
                description_ar: space.description_ar,
                space_type: space.space_type,
                capacity: space.capacity,
                hourly_rate: space.hourly_rate,
                daily_rate: space.daily_rate,
                weekly_rate: space.weekly_rate,
                monthly_rate: space.monthly_rate,
                status: space.status || 1,
                amenity_ids: space.space_amenities?.map((a: any) => a.id) || [],
            });
        }
    }, [spaceData]);

    const updateSpaceMutation = useUpdateSpace();

    const onSubmit = (data: CreateSpaceData) => {
        updateSpaceMutation.mutate({ id: spaceId, data }, {
            onSuccess: () => {
                toast.success(t("booking_success_title") || "Space updated successfully");
                router.push("/admin/spaces");
            },
            onError: (error) => {
                toast.error(error.message || t("error_generic_title") || "Failed to update space");
            }
        });
    };

    if (isLoadingSpace) {
        return (
            <div className="space-y-6 max-w-4xl mx-auto py-6">
                <div>
                    <Skeleton className="h-10 w-64 mb-2" />
                    <Skeleton className="h-6 w-96" />
                </div>
                <div className="bg-white dark:bg-gray-900 border rounded-lg p-6 space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        );
    }

    if (isError || !initialData) {
        return (
            <div className="space-y-6 max-w-4xl mx-auto py-6">
                <div className="text-center p-12 bg-white dark:bg-gray-900 border rounded-lg">
                    <p className="text-red-500 mb-4">{t("error_generic_title") || "Failed to load space details."}</p>
                    <button
                        onClick={() => router.push("/admin/spaces")}
                        className="text-primary hover:underline"
                    >
                        {t("cancel") || "Go back to spaces list"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto py-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("admin_space_edit_title") || "Edit Space"}</h1>
                <p className="text-muted-foreground mt-2">
                    {t("admin_space_form_desc_en") || "Update the information for this coworking space."}
                </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border rounded-lg p-6">
                <SpaceForm
                    initialData={initialData}
                    onSubmit={onSubmit}
                    isLoading={updateSpaceMutation.isPending}
                />
            </div>
        </div>
    );
}
