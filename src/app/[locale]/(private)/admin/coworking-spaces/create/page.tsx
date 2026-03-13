"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateSpace } from "@/lib/hooks/use-spaces";
import { SpaceForm } from "@/components/features/admin/space-form";
import { CreateSpaceData } from "@/lib/schemas/space";

export default function AdminCreateSpacePage() {
    const t = useTranslations();
    const router = useRouter();
    const createSpaceMutation = useCreateSpace();

    const onSubmit = (data: CreateSpaceData) => {
        createSpaceMutation.mutate(data, {
            onSuccess: () => {
                toast.success(t("booking_success_title") || "Space created successfully");
                router.push("/admin/spaces");
            },
            onError: (error) => {
                toast.error(error.message || t("error_generic_title") || "Failed to create space");
            }
        });
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto py-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("admin_space_create_title") || "Create New Space"}</h1>
                <p className="text-muted-foreground mt-2">
                    {t("admin_space_form_desc_en") || "Fill out the information below to add a new coworking space."}
                </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border rounded-lg p-6">
                <SpaceForm
                    onSubmit={onSubmit}
                    isLoading={createSpaceMutation.isPending}
                />
            </div>
        </div>
    );
}
