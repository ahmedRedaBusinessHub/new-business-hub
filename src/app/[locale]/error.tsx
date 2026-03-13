"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function GlobalLocaleError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const t = useTranslations();

    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Global route error:", error);
    }, [error]);

    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
            <div className="mb-6 rounded-full bg-destructive/10 p-4 text-destructive">
                <AlertCircle className="h-10 w-10" />
            </div>
            <h2 className="mb-2 text-2xl font-bold tracking-tight">
                {t("common_error_title") || "Something went wrong!"}
            </h2>
            <p className="mb-8 max-w-md text-muted-foreground">
                {error.message || t("common_error_description") || "An unexpected error occurred. Please try again later."}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={() => reset()} variant="default">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    {t("common_retry") || "Try Again"}
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/">
                        <Home className="mr-2 h-4 w-4" />
                        {t("common_return_home") || "Back to Home"}
                    </Link>
                </Button>
            </div>
        </div>
    );
}
