"use client";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { SelectRoot as Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";

export interface ReviewFiltersProps {
  branchId?: number;
  setBranchId: (value: number | undefined) => void;
  minRating?: number;
  setMinRating: (value: number | undefined) => void;
  dateFrom?: string;
  setDateFrom: (value: string | undefined) => void;
  dateTo?: string;
  setDateTo: (value: string | undefined) => void;
  availableBranches?: { id: number; name: string }[];
  hasNoResults?: boolean;
}

export function ReviewFilters({
  branchId,
  setBranchId,
  minRating,
  setMinRating,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  availableBranches = [],
  hasNoResults = false,
}: ReviewFiltersProps) {
  const clearFilters = () => {
    setBranchId(undefined);
    setMinRating(undefined);
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const hasActiveFilters =
    branchId !== undefined ||
    minRating !== undefined ||
    dateFrom !== undefined ||
    dateTo !== undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Branch Filter */}
        <div className="space-y-2">
          <Label>Branch</Label>
          <Select value={branchId?.toString() ?? "all"} onValueChange={(v) => setBranchId(v !== "all" ? parseInt(v) : undefined)}>
            <SelectTrigger>
              <SelectValue placeholder="All branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All branches</SelectItem>
              {availableBranches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id.toString()}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Minimum Rating Filter */}
        <div className="space-y-2">
          <Label>Minimum Rating</Label>
          <Select value={minRating?.toString() ?? "all"} onValueChange={(v) => setMinRating(v !== "all" ? parseInt(v) : undefined)}>
            <SelectTrigger>
              <SelectValue placeholder="All ratings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ratings</SelectItem>
              {[5, 4, 3, 2, 1].map((rating) => (
                <SelectItem key={rating} value={rating.toString()}>
                  {rating}+ stars
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range - From */}
        <div className="space-y-2">
          <Label>Date From</Label>
          <Input
            type="date"
            value={dateFrom || ""}
            onChange={(e) => setDateFrom(e.target.value || undefined)}
          />
        </div>

        {/* Date Range - To */}
        <div className="space-y-2">
          <Label>Date To</Label>
          <Input
            type="date"
            value={dateTo || ""}
            onChange={(e) => setDateTo(e.target.value || undefined)}
          />
        </div>
      </div>

      {/* No Results Placeholder */}
      {hasNoResults && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-lg font-medium">No reviews found</p>
          <p className="text-sm mt-2">Try adjusting your filters to see more results.</p>
        </div>
      )}
    </div>
  );
}
