"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { createBranchSchema, type CreateBranchData } from "@/lib/schemas/branch";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { OperatingHoursInput } from "./operating-hours-input";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import type { Branch } from "@/types/api/branches";

interface BranchFormProps {
    initialData?: Partial<Branch>;
    onSubmit: (data: CreateBranchData) => Promise<any>;
    isLoading?: boolean;
}

export function BranchForm({ initialData, onSubmit, isLoading }: BranchFormProps) {
    const t = useTranslations();
    const router = useRouter();
    const params = useParams();
    const locale = params?.locale as string;

    const methods = useForm<CreateBranchData>({
        resolver: zodResolver(createBranchSchema) as any,
        defaultValues: initialData || {
            code: "",
            name_ar: "",
            name_en: "",
            description_ar: "",
            description_en: "",
            city_ar: "",
            address_ar: "",
            phone: "",
            whatsapp: "",
            email: "",
            has_studio: false,
            status: 1,
            operating_hours: {
                timezone: "Asia/Riyadh",
                schedule: {
                    sunday: { open: "08:00", close: "17:00" },
                    monday: { open: "08:00", close: "17:00" },
                    tuesday: { open: "08:00", close: "17:00" },
                    wednesday: { open: "08:00", close: "17:00" },
                    thursday: { open: "08:00", close: "17:00" },
                    friday: null,
                    saturday: null,
                },
                special_hours: [],
            }
        },
    });

    const { register, handleSubmit, formState: { errors } } = methods;

    const onFormSubmit = async (data: CreateBranchData) => {
        try {
            await onSubmit(data);
            toast.success(initialData ? t("branch_updated_success") : t("branch_created_success"));
            router.push(`/${locale}/admin/branches`);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : t("branch_save_error"));
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="space-y-6 bg-card p-6 border rounded-xl shadow-sm">
                        <h3 className="text-lg font-semibold border-b pb-2">{t("admin_branch_basic_info")}</h3>

                        <div className="space-y-2">
                            <Label htmlFor="code">{t("admin_branch_form_code")}</Label>
                            <Input id="code" {...register("code")} placeholder="e.g. OLA-01" />
                            {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name_en">{t("admin_branch_form_name_en")}</Label>
                            <Input id="name_en" {...register("name_en")} placeholder="e.g. Olaya Branch" />
                            {errors.name_en && <p className="text-sm text-destructive">{errors.name_en.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name_ar">{t("admin_branch_form_name_ar")}</Label>
                            <Input
                                id="name_ar"
                                {...register("name_ar")}
                                placeholder="فرع العليا"
                                className="text-right"
                                dir="rtl"
                            />
                            {errors.name_ar && <p className="text-sm text-destructive text-right">{errors.name_ar.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description_en">{t("admin_branch_form_description_en")}</Label>
                            <Input id="description_en" {...register("description_en")} placeholder="Brief description..." />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description_ar">{t("admin_branch_form_description_ar")}</Label>
                            <Input
                                id="description_ar"
                                {...register("description_ar")}
                                placeholder="وصف مختصر..."
                                className="text-right"
                                dir="rtl"
                            />
                        </div>
                    </div>

                    {/* Location Info */}
                    <div className="space-y-6 bg-card p-6 border rounded-xl shadow-sm">
                        <h3 className="text-lg font-semibold border-b pb-2">{t("admin_branch_location_info")}</h3>

                        <div className="space-y-2">
                            <Label htmlFor="city_ar">{t("admin_branch_form_city_ar")}</Label>
                            <Input id="city_ar" {...register("city_ar")} placeholder="الرياض" className="text-right" dir="rtl" />
                            {errors.city_ar && <p className="text-sm text-destructive text-right">{errors.city_ar.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address_ar">{t("admin_branch_form_address_ar")}</Label>
                            <Input id="address_ar" {...register("address_ar")} placeholder="شارع العليا العام" className="text-right" dir="rtl" />
                            {errors.address_ar && <p className="text-sm text-destructive text-right">{errors.address_ar.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="latitude">{t("admin_branch_form_latitude")}</Label>
                                <Input id="latitude" type="number" step="any" {...register("latitude")} placeholder="24.7136" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="longitude">{t("admin_branch_form_longitude")}</Label>
                                <Input id="longitude" type="number" step="any" {...register("longitude")} placeholder="46.6753" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30 mt-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="has_studio" className="cursor-pointer">{t("admin_branch_form_has_studio")}</Label>
                                <p className="text-xs text-muted-foreground">{t("admin_branch_form_has_studio_desc")}</p>
                            </div>
                            <Switch
                                id="has_studio"
                                checked={methods.watch("has_studio")}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => methods.setValue("has_studio", e.target.checked)}
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="bg-card p-6 border rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold border-b pb-2 mb-6">{t("admin_branch_contact_info")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="phone">{t("admin_branch_form_phone")}</Label>
                            <Input id="phone" type="tel" {...register("phone")} placeholder="+966 11 000 0000" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="whatsapp">{t("admin_branch_form_whatsapp")}</Label>
                            <Input id="whatsapp" type="tel" {...register("whatsapp")} placeholder="+966 5X XXX XXXX" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">{t("admin_branch_form_email")}</Label>
                            <Input id="email" type="email" {...register("email")} placeholder="branch@businesshub.sa" />
                            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Operating Hours */}
                <div className="bg-card p-6 border rounded-xl shadow-sm">
                    <OperatingHoursInput />
                </div>

                <div className="flex justify-end gap-4 border-t pt-6">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        {t("common_cancel")}
                    </Button>
                    <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                {t("common_saving")}
                            </span>
                        ) : initialData ? t("common_save") : t("common_create")}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
