"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSpaces } from "@/lib/hooks/use-spaces";
import { SpaceFilters, SpaceType, SpacesListResponse } from "@/types/api/spaces";
import { SpaceCard } from "./space-card";
import { SpaceFiltersPanel } from "./space-filters";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/Pagination";
import { MapPin } from "lucide-react";
import { motion } from "motion/react";

interface SpacesViewProps {
  initialData: SpacesListResponse;
  initialFilters: SpaceFilters;
  initialPage: number;
  branches?: { id: number; name_en: string; name_ar: string }[];
}

export function SpacesView({
  initialData,
  initialPage,
  branches = [],
}: SpacesViewProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(initialPage);

  // Derive filters directly from URL — single source of truth.
  // When router.push updates the URL, useSearchParams triggers a re-render
  // and React Query detects the new key, re-fetching the filtered data.
  const filters = useMemo<SpaceFilters>(() => {
    const spaceType = searchParams.get("space_type");
    const branchId = searchParams.get("branch_id");
    const minCapacity = searchParams.get("min_capacity");
    const search = searchParams.get("search");
    return {
      branch_id: branchId ? parseInt(branchId) : undefined,
      space_type: spaceType ? (spaceType as SpaceType) : undefined,
      min_capacity: minCapacity ? parseInt(minCapacity) : undefined,
      search: search || undefined,
    };
  }, [searchParams]);

  // React Query hook handles the fetching, using initialData from server as placeholder
  const { data, isLoading, isError }: any = useSpaces(filters, page, 12);
  // data is already a SpacesListResponse (transformed in fetchSpaces)
  const spacesData: SpacesListResponse = data || initialData;

  const handleFilterChange = useCallback(
    (newFilters: SpaceFilters) => {
      setPage(1); // Reset to page 1 on filter change

      // Update URL — this triggers useSearchParams to update, which
      // recomputes filters and causes React Query to re-fetch.
      const params = new URLSearchParams();
      if (newFilters.branch_id)
        params.set("branch_id", newFilters.branch_id.toString());
      if (newFilters.space_type)
        params.set("space_type", newFilters.space_type.toString());
      if (newFilters.min_capacity)
        params.set("min_capacity", newFilters.min_capacity.toString());
      if (newFilters.search) params.set("search", newFilters.search);

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router],
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start relative">
      <div className="lg:col-span-1 lg:sticky lg:top-24 z-10 w-full transition-all duration-300">
        <SpaceFiltersPanel
          initialFilters={filters}
          onFilterChange={handleFilterChange}
          branches={branches}
        />
      </div>

      <div className="lg:col-span-3 pb-20">
        {/* Results Header */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            <span className="font-semibold text-foreground">
              {spacesData.total}
            </span>{" "}
            {t("workspaces_results_count", { defaultMessage: "Spaces Found" })}
          </p>
        </div>
        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col h-full rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm"
              >
                <Skeleton className="w-full aspect-[4/3] rounded-none" />
                <div className="p-5 flex flex-col gap-4 grow">
                  <Skeleton className="w-3/4 h-7" />
                  <Skeleton className="w-1/2 h-5" />
                  <Skeleton className="w-full h-12 mt-auto rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Error State */}
        {isError && !isLoading && (
          <EmptyState
            icon={<MapPin className="text-destructive w-12 h-12" />}
            title={t("workspaces_error_title")}
            description={t("workspaces_error_description")}
            action={
              <Button onClick={() => router.refresh()}>
                {t("workspaces_error_retry")}
              </Button>
            }
          />
        )}
        {/* Empty State */}
        {!isLoading && !isError && spacesData.data.length === 0 && (
          <EmptyState
            icon={<MapPin className="text-muted-foreground w-12 h-12" />}
            title={t("workspaces_no_results")}
            description={t("workspaces_empty_description")}
            action={
              <Button onClick={() => handleFilterChange({})}>
                {t("workspaces_filter_clear")}
              </Button>
            }
          />
        )}
        {/* Space Cards Grid */}
        {!isLoading && !isError && spacesData.data.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
          >
            {spacesData.data.map((space) => (
              <motion.div
                key={space.id}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1 }
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              >
                <SpaceCard space={space} />
              </motion.div>
            ))}
          </motion.div>
        )}
        {/* Pagination */}
        {!isLoading && (spacesData.total / spacesData.limit) > 1 && (
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) handlePageChange(page - 1);
                    }}
                    className={
                      page <= 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from(
                  { length: spacesData.total / spacesData.limit },
                  (_, i) => i + 1,
                ).map((pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      isActive={page === pageNum}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageNum);
                      }}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < (spacesData.total / spacesData.limit))
                        handlePageChange(page + 1);
                    }}
                    className={
                      page >= (spacesData.total / spacesData.limit)
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
