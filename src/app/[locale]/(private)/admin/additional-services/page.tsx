"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { AdminServiceBookingsTable } from "@/components/features/additional-services/AdminServiceBookingsTable";
import { AdminServiceCatalogTable } from "@/components/features/additional-services/AdminServiceCatalogTable";
import { AdminBranchAssignmentsTab } from "@/components/features/additional-services/AdminBranchAssignmentsTab";
import { AdminServicesSummaryCards } from "@/components/features/additional-services/AdminServicesSummaryCards";
import {
  useAdminServiceBookings,
  useAdminServiceCatalog,
} from "@/lib/hooks/use-admin-additional-services";
import {
  AdminServiceBookingFilters,
  AdminServiceCatalogFilters,
} from "@/types/api/additional-services-admin";

export default function AdditionalServicesAdminPage() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState("summary");
  const [bookingFilters, setBookingFilters] =
    useState<AdminServiceBookingFilters>({
      page: 1,
      limit: 20,
    });
  const [catalogFilters, setCatalogFilters] =
    useState<AdminServiceCatalogFilters>({
      page: 1,
      limit: 20,
    });

  const { data, isLoading: bookingsLoading } = useAdminServiceBookings(
    bookingFilters,
    activeTab === "bookings",
  );
  const { data: catalogDataX, isLoading: catalogLoading } =
    useAdminServiceCatalog(catalogFilters, activeTab === "catalog");
  const catalogData: any = catalogDataX?.data || {
    data: [],
    total: 0,
    page: 1,
    limit: 20,
  };
  const bookingsData: any = data?.data || {
    data: [],
    total: 0,
    page: 1,
    limit: 20,
  };
  console.log("🚀 ~ AdditionalServicesAdminPage ~ bookingsData:", bookingsData);
  const handleBookingFiltersChange = (
    newFilters: AdminServiceBookingFilters,
  ) => {
    setBookingFilters(newFilters);
  };

  const handleBookingPageChange = (page: number) => {
    setBookingFilters({ ...bookingFilters, page });
  };

  const handleCatalogFiltersChange = (
    newFilters: AdminServiceCatalogFilters,
  ) => {
    setCatalogFilters(newFilters);
  };

  const handleCatalogPageChange = (page: number) => {
    setCatalogFilters({ ...catalogFilters, page });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("additional_services_management")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("additional_services_management_description")}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">{t("summary")}</TabsTrigger>
          <TabsTrigger value="bookings">{t("bookings")}</TabsTrigger>
          <TabsTrigger value="catalog">{t("catalog")}</TabsTrigger>
          <TabsTrigger value="branches">{t("branch_assignments")}</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="mt-6">
          <AdminServiceBookingsTable
            bookings={bookingsData?.data || []}
            total={bookingsData?.total || 0}
            page={bookingsData?.page || 1}
            limit={bookingsData?.limit || 20}
            isLoading={bookingsLoading}
            onPageChange={handleBookingPageChange}
            onFiltersChange={handleBookingFiltersChange}
            filters={bookingFilters}
          />
        </TabsContent>

        <TabsContent value="catalog" className="mt-6">
          <AdminServiceCatalogTable
            services={catalogData?.data || []}
            total={catalogData?.total || 0}
            page={catalogData?.page || 1}
            limit={catalogData?.limit || 20}
            isLoading={catalogLoading}
            onPageChange={handleCatalogPageChange}
            onFiltersChange={handleCatalogFiltersChange}
            filters={catalogFilters}
          />
        </TabsContent>

        <TabsContent value="branches" className="mt-6">
          <AdminBranchAssignmentsTab />
        </TabsContent>

        <TabsContent value="summary" className="mt-6">
          <AdminServicesSummaryCards />
        </TabsContent>
      </Tabs>
    </div>
  );
}
