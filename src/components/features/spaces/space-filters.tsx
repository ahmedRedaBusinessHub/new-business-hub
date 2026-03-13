"use client";

import { useTranslations, useLocale } from "next-intl";
import { SpaceFilters, SpaceType } from "@/types/api/spaces";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { useState, useEffect, useRef } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce"; // Assuming this exists or we will implement it

interface SpaceFiltersProps {
    initialFilters?: SpaceFilters;
    onFilterChange: (filters: SpaceFilters) => void;
    branches?: { id: number; name_en: string; name_ar: string }[];
}

export function SpaceFiltersPanel({ initialFilters, onFilterChange, branches = [] }: SpaceFiltersProps) {
    const t = useTranslations();
    const locale = useLocale();
    const [filters, setFilters] = useState<SpaceFilters>(initialFilters || {});
    const [search, setSearch] = useState(initialFilters?.search || "");
    const debouncedSearch = useDebounce(search, 500);

    // Keep a ref to the latest filters so the search effect can read the current
    // value without adding `filters` to its dependency array (which would cause
    // a re-run loop every time setFilters mutates the object).
    const filtersRef = useRef(filters);
    filtersRef.current = filters;

    useEffect(() => {
        const currentSearch = filtersRef.current.search || "";
        if (debouncedSearch === currentSearch) return;

        const newFilters = { ...filtersRef.current };
        if (debouncedSearch) {
            newFilters.search = debouncedSearch;
        } else {
            delete newFilters.search;
        }
        setFilters(newFilters);
        onFilterChange(newFilters);
    }, [debouncedSearch, onFilterChange]);

    const updateFilter = (key: keyof SpaceFilters, value: any) => {
        const newFilters = { ...filters };

        if (value === "all" || value === "" || value === undefined) {
            delete newFilters[key];
        } else {
            newFilters[key] = value;
        }

        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        setSearch("");
        setFilters({});
        onFilterChange({});
    };

    const hasActiveFilters = Object.keys(filters).length > 0;

    return (
        <div className="space-y-6 bg-card/80 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-xl shadow-primary/5">
            <div className="flex items-center justify-between pb-4 border-b border-border/50">
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                        <SlidersHorizontal className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg tracking-tight">{t("workspaces_filters", { defaultMessage: "Filters" })}</h3>
                </div>
                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-3 text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors rounded-full">
                        <X className="w-3.5 h-3.5 mr-1" />
                        {t("workspaces_filter_clear", { defaultMessage: "Clear all" })}
                    </Button>
                )}
            </div>

            <div className="space-y-5">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground px-1">{t("workspaces_search_placeholder", { defaultMessage: "Search spaces..." })}</label>
                    <div className="relative group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder={t("workspaces_search_placeholder", { defaultMessage: "Search spaces..." })}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 bg-background/50 focus:bg-background transition-colors border-border/50 rounded-xl"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Select
                        label={t("workspaces_filter_branch", { defaultMessage: "Branch" })}
                        value={filters.branch_id?.toString() || "all"}
                        onChange={(e) => updateFilter("branch_id", e.target.value === "all" ? undefined : parseInt(e.target.value))}
                    >
                        <option value="all">{t("workspaces_filter_branch_all", { defaultMessage: "All Branches" })}</option>
                        {branches.map(branch => (
                            <option key={branch.id} value={branch.id.toString()}>
                                {locale === "ar" ? branch.name_ar : branch.name_en}
                            </option>
                        ))}
                    </Select>
                </div>

                <div className="space-y-2">
                    <Select
                        label={t("workspaces_filter_type", { defaultMessage: "Space Type" })}
                        value={filters.space_type?.toString() || "all"}
                        onChange={(e) => updateFilter("space_type", e.target.value === "all" ? undefined : e.target.value as SpaceType)}
                    >
                        <option value="all">{t("workspaces_filter_type_all", { defaultMessage: "All Types" })}</option>
                        <option value={SpaceType.HOT_DESK}>{t("workspaces_type_desk", { defaultMessage: "Hot Desk" })}</option>
                        <option value={SpaceType.PRIVATE_OFFICE}>{t("workspaces_type_office", { defaultMessage: "Private Office" })}</option>
                        <option value={SpaceType.MEETING_ROOM}>{t("workspaces_type_meeting_room", { defaultMessage: "Meeting Room" })}</option>
                        <option value={SpaceType.EVENT_SPACE}>{t("workspaces_type_event_space", { defaultMessage: "Event Space" })}</option>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Select
                        label={t("workspaces_filter_capacity", { defaultMessage: "Minimum Capacity" })}
                        value={filters.min_capacity?.toString() || "all"}
                        onChange={(e) => updateFilter("min_capacity", e.target.value === "all" ? undefined : parseInt(e.target.value))}
                    >
                        <option value="all">{t("workspaces_filter_capacity_all", { defaultMessage: "Any Capacity" })}</option>
                        {[2, 4, 10, 20, 50].map(n => (
                            <option key={n} value={n.toString()}>
                                {t("workspaces_filter_capacity_min_people", { n })}
                            </option>
                        ))}
                    </Select>
                </div>
            </div>
        </div>
    );
}
