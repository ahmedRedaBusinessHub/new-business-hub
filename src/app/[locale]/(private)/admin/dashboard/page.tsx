"use client";

import { useTranslations } from "next-intl";

export default function AdminDashboardPage() {
    const t = useTranslations();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("admin_spaces_title") || "Admin Dashboard"}</h1>
                <p className="text-muted-foreground mt-2">
                    {t("dashboard_welcome") || "Welcome to the BusinessHub Admin Dashboard."}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Stats cards can go here */}
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Total Spaces</h3>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">12</div>
                    </div>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Active Bookings</h3>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">48</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
