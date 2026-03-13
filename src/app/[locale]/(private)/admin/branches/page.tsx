"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useBranches } from "@/lib/hooks/use-branches";
import { Button } from "@/components/ui/Button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
import { Badge } from "@/components/ui/Badge";
import { DeleteBranchDialog } from "@/components/features/admin/delete-branch-dialog";
import { Branch } from "@/types/api/branches";

export default function AdminBranchesPage() {
    const t = useTranslations();
    const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);

    const { data: branchesData, isLoading, isError } = useBranches({}, 1, 50);

    const branches = branchesData?.data || [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t("admin_branches_title")}</h1>
                    <p className="text-muted-foreground mt-2">
                        {t("admin_branch_manage_desc") || "Manage branch locations and operating hours."}
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/branches/create">
                        <Plus className="mr-2 h-4 w-4" />
                        {t("admin_branches_add_cta")}
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border bg-card shadow-sm">
                {isLoading ? (
                    <SkeletonTable rows={5} columns={6} />
                ) : isError ? (
                    <div className="p-12 text-center text-destructive">
                        {t("common_error_loading") || "Failed to load branches."}
                    </div>
                ) : branches.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                        {t("admin_branches_no_results")}
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("admin_branch_form_code")}</TableHead>
                                <TableHead>{t("admin_branch_form_name_en")}</TableHead>
                                <TableHead>{t("admin_branch_form_name_ar")}</TableHead>
                                <TableHead>{t("admin_branch_form_city_ar")}</TableHead>
                                <TableHead>{t("admin_branch_form_has_studio")}</TableHead>
                                <TableHead className="text-right">{t("common_actions") || "Actions"}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {branches.map((branch: Branch) => (
                                <TableRow key={branch.id} className="hover:bg-muted/50 transition-colors">
                                    <TableCell className="font-mono text-sm font-medium">{branch.code}</TableCell>
                                    <TableCell>{branch.name_en}</TableCell>
                                    <TableCell className="text-right" dir="rtl">{branch.name_ar}</TableCell>
                                    <TableCell className="text-right" dir="rtl">{branch.city_ar}</TableCell>
                                    <TableCell>
                                        <Badge variant={branch.has_studio ? "default" : "outline"}>
                                            {branch.has_studio ? t("common_yes") || "Yes" : t("common_no") || "No"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild title={t("common_edit") || "Edit"}>
                                                <Link href={`/admin/branches/${branch.id}/edit`}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                                onClick={() => setBranchToDelete(branch)}
                                                title={t("common_delete") || "Delete"}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            {branchToDelete && (
                <DeleteBranchDialog
                    branchId={branchToDelete.id}
                    branchName={branchToDelete.name_en}
                    open={!!branchToDelete}
                    onOpenChange={(open) => !open && setBranchToDelete(null)}
                    hasSpaces={(branchToDelete.spaces_count ?? 0) > 0}
                />
            )}
        </div>
    );
}
