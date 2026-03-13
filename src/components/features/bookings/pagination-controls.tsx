"use client";

import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function PaginationControls({
    currentPage,
    totalPages,
    onPageChange,
    className = "",
}: PaginationControlsProps) {
    const t = useTranslations();

    if (totalPages <= 1) return null;

    return (
        <div className={`flex items-center justify-center gap-4 ${className}`}>
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                aria-label={t("pagination_previous")}
            >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            </Button>

            <div className="flex items-center gap-2">
                <span className="text-sm border px-4 py-2 rounded-md" style={{ borderColor: 'var(--theme-border)', color: 'var(--theme-text-primary)' }}>
                    {t("pagination_page")} {currentPage} {t("pagination_of")} {totalPages}
                </span>
            </div>

            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                aria-label={t("pagination_next")}
            >
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </Button>
        </div>
    );
}
