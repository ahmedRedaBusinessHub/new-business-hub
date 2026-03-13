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
import { Eye, Pencil } from "lucide-react";
import {
  AdminServiceBooking,
  AdminServiceBookingFilters,
  ServiceBookingStatus,
  ServiceType,
} from "@/types/api/additional-services-admin";
import { ServiceBookingDetailDialog } from "./ServiceBookingDetailDialog";
import { UpdateBookingStatusDialog } from "./UpdateBookingStatusDialog";
import { useUpdateBookingStatus } from "@/lib/hooks/use-admin-additional-services";

interface AdminServiceBookingsTableProps {
  bookings: AdminServiceBooking[];
  total: number;
  page: number;
  limit: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onFiltersChange: (filters: AdminServiceBookingFilters) => void;
  filters: AdminServiceBookingFilters;
}

export function AdminServiceBookingsTable({
  bookings,
  total,
  page,
  limit,
  isLoading,
  onPageChange,
  onFiltersChange,
  filters,
}: AdminServiceBookingsTableProps) {
  const t = useTranslations();
  const updateBookingStatus = useUpdateBookingStatus();
  const [selectedBooking, setSelectedBooking] =
    useState<AdminServiceBooking | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

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

  const handleViewDetails = (booking: AdminServiceBooking) => {
    setSelectedBooking(booking);
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = (booking: AdminServiceBooking) => {
    setSelectedBooking(booking);
    setIsStatusDialogOpen(true);
  };

  const handleFilterChange = (
    key: keyof AdminServiceBookingFilters,
    value: any,
  ) => {
    onFiltersChange({ ...filters, [key]: value, page: 1 });
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder={t("search_by_name_or_id")}
              value={filters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Select
            value={filters.service_type || "all"}
            onValueChange={(value) =>
              handleFilterChange(
                "service_type",
                value === "all" ? undefined : value,
              )
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("service_type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all_types")}</SelectItem>
              <SelectItem value="PRINTING">{t("printing")}</SelectItem>
              <SelectItem value="STORAGE">{t("storage")}</SelectItem>
              <SelectItem value="MAILBOX">{t("mailbox")}</SelectItem>
              <SelectItem value="STUDIO">{t("studio")}</SelectItem>
            </SelectContent>
          </Select>

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

          <Input
            type="date"
            value={filters.start_date || ""}
            onChange={(e) => handleFilterChange("start_date", e.target.value)}
            className="w-[160px]"
          />

          <Input
            type="date"
            value={filters.end_date || ""}
            onChange={(e) => handleFilterChange("end_date", e.target.value)}
            className="w-[160px]"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("id")}</TableHead>
              <TableHead>{t("user")}</TableHead>
              <TableHead>{t("service")}</TableHead>
              <TableHead>{t("type")}</TableHead>
              <TableHead>{t("branch")}</TableHead>
              <TableHead>{t("date")}</TableHead>
              <TableHead>{t("amount")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  {t("loading")}
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  {t("no_bookings_found")}
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">#{booking.id}</TableCell>
                  <TableCell>{booking.user_name}</TableCell>
                  <TableCell>{booking.service_name_en}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{booking.service_type}</Badge>
                  </TableCell>
                  <TableCell>{booking.branch_name_en || "-"}</TableCell>
                  <TableCell>
                    {new Date(booking.booking_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {booking.amount} SAR
                  </TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(booking)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUpdateStatus(booking)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {t("showing_page_of_total", {
                page,
                total: totalPages,
                count: bookings.length,
              })}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
              >
                {t("previous")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
              >
                {t("next")}
              </Button>
            </div>
          </div>
        )}
      </div>

      <ServiceBookingDetailDialog
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
      />

      {selectedBooking && (
        <UpdateBookingStatusDialog
          isOpen={isStatusDialogOpen}
          onClose={() => {
            setIsStatusDialogOpen(false);
            setSelectedBooking(null);
            setStatusError(null);
          }}
          onConfirm={(status, cancellationReason) => {
            setStatusError(null);
            updateBookingStatus.mutate(
              {
                id: selectedBooking.id,
                payload: {
                  status: `${status as 1 | 2 | 3}`,
                  ...(cancellationReason && {
                    cancellation_reason: cancellationReason,
                  }),
                },
              },
              {
                onSuccess: () => {
                  setIsStatusDialogOpen(false);
                  setSelectedBooking(null);
                  setStatusError(null);
                },
                onError: (err: any) => {
                  setStatusError(
                    err.message || t("failed_to_update_booking_status"),
                  );
                },
              },
            );
          }}
          isLoading={updateBookingStatus.isPending}
          currentStatus={selectedBooking.status}
          error={statusError}
        />
      )}
    </>
  );
}
