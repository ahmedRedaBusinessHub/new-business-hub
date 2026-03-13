"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { CreateSpaceData, createSpaceSchema } from "@/lib/schemas/space";
import { SpaceType } from "@/types/api/spaces";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

import { useBranches } from "@/lib/hooks/use-branches";

interface SpaceFormProps {
    initialData?: Partial<CreateSpaceData>;
    onSubmit: (data: CreateSpaceData) => void;
    isLoading?: boolean;
}

export function SpaceForm({ initialData, onSubmit, isLoading = false }: SpaceFormProps) {
    const t = useTranslations();

    // Fetch branches for the selector
    const { data: branchesData } = useBranches({}, 1, 100);

    const form = useForm<CreateSpaceData>({
        resolver: zodResolver(createSpaceSchema) as any,
        defaultValues: {
            branch_id: initialData?.branch_id || 1,
            code: initialData?.code || "",
            name_en: initialData?.name_en || "",
            name_ar: initialData?.name_ar || "",
            description_en: initialData?.description_en || "",
            description_ar: initialData?.description_ar || "",
            space_type: initialData?.space_type || SpaceType.SHARED_DESK,
            capacity: initialData?.capacity || 1,
            hourly_rate: initialData?.hourly_rate ?? undefined,
            daily_rate: initialData?.daily_rate ?? undefined,
            weekly_rate: initialData?.weekly_rate ?? undefined,
            monthly_rate: initialData?.monthly_rate ?? undefined,
            status: initialData?.status ?? 1,
            amenity_ids: initialData?.amenity_ids || [],
        },
    });

    const spaceTypeOptions = Object.values(SpaceType).map((type) => ({
        label: t(`workspaces_type_${(type as string).toLowerCase()}`) || type as string,
        value: type as string,
    }));

    const statusOptions = [
        { label: t("statusActive") || "Active", value: "1" },
        { label: t("statusInactive") || "Inactive", value: "0" },
    ];

    const branchOptions = branchesData?.data?.map((branch) => ({
        label: branch.name_en || branch.name_ar,
        value: branch.id.toString(),
    })) || [{ label: "Loading branches...", value: "1" }];

    return (
        <Form {...form} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="name_en"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("admin_space_form_name_en") || "Name (English)"}</FormLabel>
                            <FormControl>
                                <Input placeholder="Space Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name_ar"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("admin_space_form_name_ar") || "Name (Arabic)"}</FormLabel>
                            <FormControl>
                                <Input placeholder="اسم المساحة" {...field} dir="rtl" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("admin_space_form_code") || "Space Code"}</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. SPACE-001" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="branch_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("admin_space_form_branch") || "Branch"}</FormLabel>
                            <FormControl>
                                <Select
                                    options={branchOptions}
                                    value={field.value.toString()}
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="space_type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("admin_space_form_type") || "Space Type"}</FormLabel>
                            <FormControl>
                                <Select
                                    options={spaceTypeOptions}
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.value)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("admin_space_form_capacity") || "Capacity"}</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={1}
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="description_en"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("admin_space_form_desc_en") || "Description (English)"}</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Space description" {...field} rows={4} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description_ar"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("admin_space_form_desc_ar") || "Description (Arabic)"}</FormLabel>
                            <FormControl>
                                <Textarea placeholder="وصف المساحة" {...field} rows={4} dir="rtl" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                <h3 className="text-lg font-medium mb-4">{t("admin_space_form_pricing") || "Pricing Options"}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField
                        control={form.control}
                        name="hourly_rate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("space_pricing_hourly") || "Hourly Rate"}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        {...field}
                                        value={field.value ?? ""}
                                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                        placeholder="0.00"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="daily_rate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("space_pricing_daily") || "Daily Rate"}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        {...field}
                                        value={field.value ?? ""}
                                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                        placeholder="0.00"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="weekly_rate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("space_pricing_weekly") || "Weekly Rate"}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        {...field}
                                        value={field.value ?? ""}
                                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                        placeholder="0.00"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="monthly_rate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("space_pricing_monthly") || "Monthly Rate"}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        {...field}
                                        value={field.value ?? ""}
                                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                        placeholder="0.00"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {form.formState.errors.root && (
                    <p className="text-sm font-medium text-red-500 mt-2">
                        {form.formState.errors.root.message}
                    </p>
                )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem className="max-w-xs">
                            <FormLabel>{t("statusHelper") || "Status"}</FormLabel>
                            <FormControl>
                                <Select
                                    options={statusOptions}
                                    {...field}
                                    value={field.value?.toString()}
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    {t("cancel") || "Cancel"}
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? t("saving") || "Saving..." : t("save") || "Save"}
                </Button>
            </div>
        </Form>
    );
}
