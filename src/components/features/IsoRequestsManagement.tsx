"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { Badge } from "@/components/ui/Badge";
import { Trash2, Search, Eye, CheckCircle } from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Select";
import DynamicView from "../shared/DynamicView";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { useI18n } from "@/hooks/useI18n";

export interface IsoRequest {
    id: number;
    company_name: string | null;
    name: string | null;
    position: string | null;
    email: string | null;
    phone: string | null;
    certificate_type: string | null;
    employees_count: string | null;
    industry: string | null;
    message: string | null;
    status: number;
    created_at: string | null;
}

export function IsoRequestsManagement() {
    const { t } = useI18n("admin");
    const [isoRequests, setIsoRequests] = useState<IsoRequest[]>([]);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewingRequest, setViewingRequest] = useState<IsoRequest | null>(null);
    const [deletingRequestId, setDeletingRequestId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const isFetchingRef = useRef(false);
    const lastFetchParamsRef = useRef<string>("");

    const fetchIsoRequests = useCallback(async () => {
        const params = new URLSearchParams({
            page: currentPage.toString(),
            limit: pageSize.toString(),
            ...(debouncedSearch && { search: debouncedSearch }),
        });
        const paramsString = params.toString();

        if (isFetchingRef.current && lastFetchParamsRef.current === paramsString) {
            return;
        }

        isFetchingRef.current = true;
        lastFetchParamsRef.current = paramsString;

        try {
            setLoading(true);
            const response = await fetch(`/api/iso-requests?${paramsString}`);
            if (!response.ok) {
                throw new Error(t("entities.isoRequests.failedToLoad"));
            }
            const data = await response.json();
            const requestsData = Array.isArray(data.data) ? data.data : [];
            setIsoRequests(requestsData);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 0);
        } catch (error: any) {
            console.error("Error fetching ISO requests:", error);
            toast.error(t("entities.isoRequests.failedToLoad"));
            setIsoRequests([]);
            setTotal(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    }, [currentPage, pageSize, debouncedSearch, t]);

    useEffect(() => {
        fetchIsoRequests();
    }, [fetchIsoRequests]);

    const handleUpdateStatus = async (id: number, status: number) => {
        try {
            const response = await fetch(`/api/iso-requests/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || t("entities.isoRequests.failedToUpdate"));
            }

            toast.success(t("entities.isoRequests.updated"));
            fetchIsoRequests();
        } catch (error: any) {
            toast.error(error.message || t("entities.isoRequests.failedToUpdate"));
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/iso-requests/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || t("entities.isoRequests.failedToDelete"));
            }

            toast.success(t("entities.isoRequests.deleted"));
            setDeletingRequestId(null);
            fetchIsoRequests();
        } catch (error: any) {
            toast.error(error.message || t("entities.isoRequests.failedToDelete"));
        }
    };

    const handleView = (request: IsoRequest) => {
        setViewingRequest(request);
        setIsViewOpen(true);
    };

    const handleCloseView = () => {
        setIsViewOpen(false);
        setViewingRequest(null);
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between">
                <div>
                    <h2>{t("entities.isoRequests.title")}</h2>
                    <p className="text-muted-foreground">
                        {t("entities.isoRequests.subtitle")}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={t("entities.isoRequests.search")}
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select
                    error={undefined}
                    value={pageSize.toString()}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                    className="w-32"
                >
                    <option value="10">10 {t("table.itemsPerPage")}</option>
                    <option value="20">20 {t("table.itemsPerPage")}</option>
                    <option value="50">50 {t("table.itemsPerPage")}</option>
                    <option value="100">100 {t("table.itemsPerPage")}</option>
                </Select>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t("entities.isoRequests.certificateType")}</TableHead>
                            <TableHead>{t("entities.isoCompanies.companyName")}</TableHead>
                            <TableHead>{t("common.name")}</TableHead>
                            <TableHead>{t("users.email")}</TableHead>
                            <TableHead>{t("common.status")}</TableHead>
                            <TableHead className="text-right">{t("common.actions")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    {t("common.loading")}
                                </TableCell>
                            </TableRow>
                        ) : isoRequests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    {t("table.noResults")}
                                </TableCell>
                            </TableRow>
                        ) : (
                            isoRequests.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell className="font-medium">{request.certificate_type || "-"}</TableCell>
                                    <TableCell>{request.company_name || "-"}</TableCell>
                                    <TableCell>{request.name || "-"}</TableCell>
                                    <TableCell>{request.email || "-"}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={request.status === 2 ? "default" : "secondary"}
                                        >
                                            {request.status === 2 ? t("entities.isoRequests.completed") : t("entities.isoRequests.new")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {request.status !== 2 && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleUpdateStatus(request.id, 2)}
                                                    title={t("entities.isoRequests.markAsCompleted")}
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                >
                                                    <CheckCircle className="size-4" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleView(request)}
                                                title={t("entities.isoRequests.viewDetails")}
                                            >
                                                <Eye className="size-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setDeletingRequestId(request.id)}
                                                title={t("entities.isoRequests.deleteTooltip")}
                                                className="text-destructive"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                                }}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            if (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                                return (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage(page);
                                            }}
                                            isActive={currentPage === page}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                                return (
                                    <PaginationItem key={page}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                );
                            }
                            return null;
                        })}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                                }}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}

            <div className="text-sm text-muted-foreground">
                {t("table.showing")} {isoRequests.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} {t("table.of")}{" "}
                {Math.min(currentPage * pageSize, total)} {t("table.of")} {total} {t("table.results")}
            </div>

            {viewingRequest && (
                <DynamicView
                    data={viewingRequest}
                    open={isViewOpen}
                    onOpenChange={handleCloseView}
                    title={t("entities.isoRequests.viewDetails")}
                    header={{
                        type: "avatar",
                        title: (data: IsoRequest) => data.company_name || data.name || t("entities.isoRequests.viewDetails"),
                        subtitle: (data: IsoRequest) => data.certificate_type || "",
                        avatarFallback: (data: IsoRequest) =>
                            data.company_name?.[0] || data.name?.[0] || "R",
                        badges: [
                            {
                                field: "status",
                                map: {
                                    2: { label: t("entities.isoRequests.completed"), variant: "default" },
                                    1: { label: t("entities.isoRequests.new"), variant: "secondary" },
                                },
                            },
                        ],
                    }}
                    tabs={[
                        {
                            id: "details",
                            label: t("entities.isoCompanies.details"),
                            gridCols: 2,
                            fields: [
                                { name: "certificate_type", label: t("entities.isoRequests.certificateType"), type: "text", colSpan: 12 },
                                { name: "company_name", label: t("entities.isoCompanies.companyName"), type: "text", colSpan: 12 },
                                { name: "name", label: t("common.name"), type: "text" },
                                { name: "position", label: t("entities.isoCompanies.position"), type: "text" },
                                { name: "email", label: t("users.email"), type: "text" },
                                { name: "phone", label: t("users.mobile"), type: "text" },
                                { name: "employees_count", label: t("entities.isoRequests.employeesCount"), type: "text" },
                                { name: "industry", label: t("entities.isoRequests.industry"), type: "text" },
                                { name: "message", label: t("entities.isoRequests.message"), type: "text", colSpan: 12 },
                                { name: "created_at", label: t("common.createdAt"), type: "datetime" },
                            ],
                        },
                    ]}
                    maxWidth="2xl"
                />
            )}

            <AlertDialog
                open={!!deletingRequestId}
                onOpenChange={(open) => !open && setDeletingRequestId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("common.areYouSure")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t("common.thisActionCannotBeUndone")}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deletingRequestId && handleDelete(deletingRequestId)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {t("common.delete")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
