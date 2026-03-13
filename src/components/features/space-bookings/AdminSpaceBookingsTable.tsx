"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  SelectRoot as Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Check, X, Eye } from "lucide-react";
import {
  AdminSpaceBooking,
  AdminSpaceBookingFilters,
} from "@/types/api/space-bookings-admin";
import {
  useAdminSpaceBookings,
  useApproveSpaceBooking,
  useCancelSpaceBooking,
} from "@/lib/hooks/use-admin-space-bookings";
import { useBranches } from "@/lib/hooks/use-branches";
import { useSpaces } from "@/lib/hooks/use-spaces";
import { ApproveBookingDialog } from "./ApproveBookingDialog";
import { CancelBookingDialog } from "./CancelBookingDialog";
import { SpaceBookingDetailDialog } from "./SpaceBookingDetailDialog";

export function AdminSpaceBookingsTable() {
  const t = useTranslations("adminSpaceBookings");
  const [filters, setFilters] = useState<AdminSpaceBookingFilters>({
    page: 1,
    limit: 10,
    sort_field: "created_at",
    sort_order: "desc",
  });
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<AdminSpaceBooking | null>(null);

  const { data, isLoading } = useAdminSpaceBookings(filters);
  const { data: branchesData } = useBranches(undefined, 1, 100);
  const { data: spacesData } = useSpaces(
    filters.branch_id ? ({ branch_id: filters.branch_id } as any) : undefined,
    1,
    100,
  );
  const approveBooking = useApproveSpaceBooking();
  const cancelBooking = useCancelSpaceBooking();

  const handleApprove = () => {
    if (selectedBooking) {
      approveBooking.mutate(selectedBooking.id);
      setApproveDialogOpen(false);
    }
  };

  const handleCancel = (reason: string, processFullRefund: boolean) => {
    if (selectedBooking) {
      cancelBooking.mutate({
        id: selectedBooking.id,
        payload: { reason, process_full_refund: processFullRefund },
      });
      setCancelDialogOpen(false);
    }
  };

  const handleView = (booking: AdminSpaceBooking) => {
    setSelectedBooking(booking);
    setDetailDialogOpen(true);
  };

  const getStatusBadge = (status: number) => {
    const statusConfig = {
      0: {
        label: t("pending"),
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      1: {
        label: t("confirmed"),
        className: "bg-blue-100 text-blue-800 border-blue-200",
      },
      2: {
        label: t("completed"),
        className: "bg-green-100 text-green-800 border-green-200",
      },
      3: {
        label: t("cancelled"),
        className: "bg-red-100 text-red-800 border-red-200",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config?.className}>{config?.label}</Badge>;
  };

  const handleFilterChange = (
    key: keyof AdminSpaceBookingFilters,
    value: any,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key !== "page" ? { page: 1 } : {}),
    }));
  };

  const totalPages = Math.ceil(
    (data?.data?.total || 0) / (filters.limit || 10),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <Select
          value={filters.status?.toString() || "all"}
          onValueChange={(value) =>
            handleFilterChange(
              "status",
              value === "all" ? undefined : parseInt(value),
            )
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all_statuses")}</SelectItem>
            <SelectItem value="0">{t("pending")}</SelectItem>
            <SelectItem value="1">{t("confirmed")}</SelectItem>
            <SelectItem value="2">{t("completed")}</SelectItem>
            <SelectItem value="3">{t("cancelled")}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.branch_id?.toString() || "all"}
          onValueChange={(value) => {
            handleFilterChange(
              "branch_id",
              value === "all" ? undefined : parseInt(value),
            );
            handleFilterChange("coworking_space_id", undefined);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("branch")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all_branches")}</SelectItem>
            {branchesData?.data?.map((branch) => (
              <SelectItem key={branch.id} value={branch.id.toString()}>
                {branch.name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.coworking_space_id?.toString() || "all"}
          onValueChange={(value) =>
            handleFilterChange(
              "coworking_space_id",
              value === "all" ? undefined : parseInt(value),
            )
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("space")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all_spaces")}</SelectItem>
            {spacesData?.data?.map((space) => (
              <SelectItem key={space.id} value={space.id.toString()}>
                {space.name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.sort_field || "created_at"}
          onValueChange={(value) =>
            handleFilterChange(
              "sort_field",
              value as "start_datetime" | "created_at",
            )
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("sort_by")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">{t("created_date")}</SelectItem>
            <SelectItem value="start_datetime">{t("booking_date")}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.sort_order || "desc"}
          onValueChange={(value) =>
            handleFilterChange("sort_order", value as "asc" | "desc")
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder={t("sort_order")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">{t("ascending")}</SelectItem>
            <SelectItem value="desc">{t("descending")}</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder={t("search_by_name_or_code")}
          value={filters.search || ""}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="max-w-sm"
        />

        <Input
          type="date"
          value={filters.start_date || ""}
          onChange={(e) => handleFilterChange("start_date", e.target.value)}
          className="w-40"
        />

        <Input
          type="date"
          value={filters.end_date || ""}
          onChange={(e) => handleFilterChange("end_date", e.target.value)}
          className="w-40"
        />

        <Select
          value={filters.limit?.toString() || "10"}
          onValueChange={(value) =>
            handleFilterChange("limit", parseInt(value))
          }
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder={t("per_page")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() =>
            setFilters({
              page: 1,
              limit: 10,
              sort_field: "created_at",
              sort_order: "desc",
            })
          }
        >
          {t("reset")}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("confirmation_code")}</TableHead>
            <TableHead>{t("client")}</TableHead>
            <TableHead>{t("space")}</TableHead>
            <TableHead>{t("branch")}</TableHead>
            <TableHead>{t("date_time")}</TableHead>
            <TableHead>{t("amount")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead>{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="animate-pulse bg-gray-100 h-8 rounded"></div>
                </TableCell>
              </TableRow>
            ))
          ) : data?.data && data.data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                {t("no_bookings_match_filters")}
              </TableCell>
            </TableRow>
          ) : (
            data?.data?.data?.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.confirmation_code}</TableCell>
                <TableCell>
                  {booking.user
                    ? `${booking.user.first_name} ${booking.user.last_name}`
                    : "-"}
                </TableCell>
                <TableCell>{booking.coworking_space.name_en}</TableCell>
                <TableCell>
                  {booking.coworking_space.branch?.name_en || "-"}
                </TableCell>
                <TableCell>
                  {new Date(booking.start_datetime).toLocaleString()}
                </TableCell>
                <TableCell>{booking.final_amount} SAR</TableCell>
                <TableCell>{getStatusBadge(booking.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(booking)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {booking.status === 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setApproveDialogOpen(true);
                        }}
                        disabled={approveBooking.isPending}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    {(booking.status === 0 || booking.status === 1) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setCancelDialogOpen(true);
                        }}
                        disabled={cancelBooking.isPending}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {t("showing", {
            from: ((filters.page || 1) - 1) * (filters.limit || 10) + 1,
            to: Math.min(
              (filters.page || 1) * (filters.limit || 10),
              data?.data?.total || 0,
            ),
            total: data?.data?.total || 0,
          })}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              handleFilterChange("page", Math.max(1, (filters.page || 1) - 1))
            }
            disabled={(filters.page || 1) <= 1}
          >
            {t("previous")}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleFilterChange("page", (filters.page || 1) + 1)}
            disabled={(filters.page || 1) >= totalPages}
          >
            {t("next")}
          </Button>
        </div>
      </div>

      <ApproveBookingDialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        onConfirm={handleApprove}
        loading={approveBooking.isPending}
        bookingCode={selectedBooking?.confirmation_code}
      />

      <CancelBookingDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleCancel}
        loading={cancelBooking.isPending}
      />

      <SpaceBookingDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        bookingId={selectedBooking?.id}
      />
    </div>
  );
}
