"use client";

import { useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  useAdminSubscriptions,
  useAdminCancelSubscription,
} from "@/lib/hooks/use-admin-subscriptions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
import { CancelSubscriptionDialog } from "@/components/features/subscriptions/cancel-subscription-dialog";
import { SubscriptionDetailsDialog } from "@/components/features/admin/subscription-details-dialog";
import { Eye, XCircle, Search } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import { SubscriptionPlan } from "@/types/api/subscriptions";
import type {
  AdminSubscription,
  AdminSubscriptionFilters,
} from "@/types/api/subscriptions";

const STATUS_OPTIONS = ["active", "cancelled", "expired"] as const;
const PLAN_OPTIONS = Object.values(SubscriptionPlan);
const LIMIT = 20;

export default function AdminSubscriptionsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const dateLocale = locale === "ar" ? "ar-SA" : "en-US";

  // Filter state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    AdminSubscriptionFilters["status"] | "all"
  >("all");
  const [planFilter, setPlanFilter] = useState<SubscriptionPlan | "all">("all");
  const [page, setPage] = useState(1);

  // Dialog state
  const [selectedSubscription, setSelectedSubscription] =
    useState<AdminSubscription | null>(null);
  const [subscriptionToCancel, setSubscriptionToCancel] =
    useState<AdminSubscription | null>(null);

  const filters: AdminSubscriptionFilters = {
    ...(search && { search }),
    ...(statusFilter !== "all" && { status: statusFilter }),
    ...(planFilter !== "all" && { plan: planFilter }),
    page,
    limit: LIMIT,
  };

  const { data, isLoading, isError } = useAdminSubscriptions(filters);
  const cancelMutation = useAdminCancelSubscription();

  const subscriptions = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const handleCancelConfirm = useCallback(() => {
    if (!subscriptionToCancel) return;
    cancelMutation.mutate(subscriptionToCancel.id, {
      onSuccess: () => setSubscriptionToCancel(null),
    });
  }, [cancelMutation, subscriptionToCancel]);

  const statusBadgeVariant = (status: AdminSubscription["status"]) => {
    if (status === "active") return "default";
    if (status === "cancelled") return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("admin_subscriptions_title")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("admin_subscriptions_desc")}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            className="ps-9"
            placeholder={t("admin_subscriptions_search_placeholder")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <Select
          className="w-full sm:w-44"
          value={statusFilter as string}
          onChange={(e) => {
            setStatusFilter(e.target.value as typeof statusFilter);
            setPage(1);
          }}
          options={[
            { label: t("admin_subscriptions_filter_all_statuses"), value: "all" },
            ...STATUS_OPTIONS.map((s) => ({
              label: t(`subscriptions_status_${s}`),
              value: s,
            })),
          ]}
        />

        <Select
          className="w-full sm:w-52"
          value={planFilter as string}
          onChange={(e) => {
            setPlanFilter(e.target.value as typeof planFilter);
            setPage(1);
          }}
          options={[
            { label: t("admin_subscriptions_filter_all_plans"), value: "all" },
            ...PLAN_OPTIONS.map((p) => ({
              label: t(`subscription_plan_${p}`),
              value: p,
            })),
          ]}
        />
      </div>

      {/* Table */}
      <div className="rounded-md border bg-card shadow-sm">
        {isLoading ? (
          <SkeletonTable rows={8} columns={8} />
        ) : isError ? (
          <div className="p-12 text-center text-destructive">
            {t("common_error_loading")}
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            {t("admin_subscriptions_no_results")}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin_subscriptions_col_user")}</TableHead>
                <TableHead>{t("admin_subscriptions_col_email")}</TableHead>
                <TableHead>{t("admin_subscriptions_col_plan")}</TableHead>
                <TableHead>{t("admin_subscriptions_col_status")}</TableHead>
                <TableHead>{t("admin_subscriptions_col_start_date")}</TableHead>
                <TableHead>
                  {t("admin_subscriptions_col_renewal_date")}
                </TableHead>
                <TableHead>{t("admin_subscriptions_col_price")}</TableHead>
                <TableHead className="text-right">
                  {t("common_actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => (
                <TableRow
                  key={sub.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium">{sub.user.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {sub.user.email}
                  </TableCell>
                  <TableCell>
                    {t(`subscription_plan_${sub.plan}`, {
                      defaultMessage: sub.plan,
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant(sub.status)}>
                      {t(`subscriptions_status_${sub.status}`, {
                        defaultMessage: sub.status,
                      })}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(sub.startDate, dateLocale)}</TableCell>
                  <TableCell>
                    {formatDate(sub.renewalDate, dateLocale)}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(sub.monthlyPrice, dateLocale)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title={t("admin_subscriptions_view_details")}
                        onClick={() => setSelectedSubscription(sub)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {sub.status === "active" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                          title={t("admin_subscriptions_cancel_cta")}
                          onClick={() => setSubscriptionToCancel(sub)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            {t("pagination_previous")}
          </Button>
          <span className="text-sm text-muted-foreground">
            {t("pagination_page")} {page} {t("pagination_of")} {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            {t("pagination_next")}
          </Button>
        </div>
      )}

      {/* Dialogs */}
      <SubscriptionDetailsDialog
        subscription={selectedSubscription}
        open={!!selectedSubscription}
        onOpenChange={(open) => !open && setSelectedSubscription(null)}
      />

      <CancelSubscriptionDialog
        isOpen={!!subscriptionToCancel}
        onClose={() => setSubscriptionToCancel(null)}
        onConfirm={handleCancelConfirm}
        isLoading={cancelMutation.isPending}
      />
    </div>
  );
}
