"use client";

import { useTranslations } from "next-intl";
import { BranchForm } from "@/components/features/admin/branch-form";
import { useCreateBranch } from "@/lib/hooks/use-branches";

export default function CreateBranchPage() {
    const t = useTranslations();
    const createBranchMutation = useCreateBranch();

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("admin_branch_create_title")}</h1>
                <p className="text-muted-foreground mt-2">
                    {t("admin_branch_create_desc") || "Add a new branch location to the BusinessHub network."}
                </p>
            </div>

            <BranchForm
                onSubmit={async (data) => {
                    await createBranchMutation.mutateAsync(data);
                }}
                isLoading={createBranchMutation.isPending}
            />
        </div>
    );
}
