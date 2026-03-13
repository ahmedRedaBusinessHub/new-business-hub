"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { fetchSpaces } from "@/lib/api/spaces";
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
import { SpaceType, SpaceListItem } from "@/types/api/spaces";
import { Badge } from "@/components/ui/Badge";
import { DeleteSpaceDialog } from "@/components/features/admin/delete-space-dialog";

export default function AdminSpacesPage() {
    const t = useTranslations();
    const [spaceToDelete, setSpaceToDelete] = useState<SpaceListItem | null>(null);

    const { data: spacesData, isLoading, isError } = useQuery({
        queryKey: ["admin_spaces"],
        queryFn: () => fetchSpaces({}, 1, 50), // Get a larger list for admin view by default
    });

    const spaces = spacesData?.data || [];
    console.log("🚀 ~ AdminSpacesPage ~ spaces:", spaces)

    const getSpaceTypeLabel = (type: SpaceType) => {
        return t(`workspaces_type_${(type as string).toLowerCase()}`) || type as string;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t("admin_spaces_title") || "Spaces Management"}</h1>
                    <p className="text-muted-foreground mt-2">
                        {t("dashboard_welcome") || "Manage all coworking spaces across your branches."}
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/spaces/create">
                        <Plus className="mr-2 h-4 w-4" />
                        {t("admin_space_create_title") || "Create New Space"}
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border">
                {isLoading ? (
                    <SkeletonTable rows={5} columns={5} />
                ) : isError ? (
                    <div className="p-8 text-center text-red-500">
                        {t("workspaces_error_description") || "Failed to load spaces."}
                    </div>
                ) : spaces.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        {t("workspaces_empty_description") || "No spaces found. Create one to get started."}
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("admin_space_form_name_en") || "Name (EN)"}</TableHead>
                                <TableHead>{t("admin_space_form_name_ar") || "Name (AR)"}</TableHead>
                                <TableHead>{t("admin_space_form_type") || "Type"}</TableHead>
                                <TableHead>{t("admin_space_form_capacity") || "Capacity"}</TableHead>
                                <TableHead>{t("statusHelper") || "Status"}</TableHead>
                                <TableHead className="text-right">{t("actions") || "Actions"}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {spaces.map((space: SpaceListItem) => (
                                <TableRow key={space.id}>
                                    <TableCell className="font-medium">{space.name_en}</TableCell>
                                    <TableCell>{space.name_ar}</TableCell>
                                    <TableCell>{getSpaceTypeLabel(space.space_type)}</TableCell>
                                    <TableCell>{space.capacity}</TableCell>
                                    <TableCell>
                                        <Badge variant={space.status === 1 ? "default" : "secondary"}>

                                            {space.status === 1 ? (t("statusActive") || "Active") : (t("statusInactive") || "Inactive")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/spaces/${space.id}/edit`}>
                                                    <Edit className="h-4 w-4" />
                                                    <span className="sr-only">Edit</span>
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-600"
                                                onClick={() => setSpaceToDelete(space)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Delete</span>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            {spaceToDelete && (
                <DeleteSpaceDialog
                    spaceId={spaceToDelete.id}
                    spaceName={spaceToDelete.name_en}
                    open={!!spaceToDelete}
                    onOpenChange={(open) => !open && setSpaceToDelete(null)}
                />
            )}
        </div>
    );
}
