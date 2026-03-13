"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { BranchForm } from "@/components/features/admin/branch-form";
import { useBranchDetails, useUpdateBranch } from "@/lib/hooks/use-branches";
import { Skeleton } from "@/components/ui/Skeleton";

export default function EditBranchPage() {
    const t = useTranslations();
    const params = useParams();
    const id = params?.id as string;

    const { data: branch, isLoading: isFetchLoading, isError } = useBranchDetails(id);
    const updateBranchMutation = useUpdateBranch();

    if (isFetchLoading) {
        return (
            <div className="space-y-6 max-w-5xl mx-auto">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-4 w-96" />
                <div className="space-y-8 mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Skeleton className="h-64 rounded-xl" />
                        <Skeleton className="h-64 rounded-xl" />
                    </div>
                    <Skeleton className="h-96 rounded-xl" />
                </div>
            </div>
        );
    }

    if (isError || !branch) {
        return (
            <div className="p-12 text-center">
                <h2 className="text-2xl font-bold text-destructive">{t("common_error_loading")}</h2>
                <p className="text-muted-foreground mt-2">Could not find the requested branch.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("admin_branch_edit_title")}</h1>
                <p className="text-muted-foreground mt-2">
                    {t("admin_branch_edit_desc", { name: branch.name_en }) || `Update information for ${branch.name_en}`}
                </p>
            </div>

            <BranchForm
                initialData={branch}
                onSubmit={async (data) => {
                    await updateBranchMutation.mutateAsync({ id, data });
                }}
                isLoading={updateBranchMutation.isPending}
            />
        </div>
    );
}
