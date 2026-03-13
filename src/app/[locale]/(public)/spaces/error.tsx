"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useTranslations } from "next-intl";
import { AlertCircle } from "lucide-react";

export default function SpacesError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const t = useTranslations();

    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Spaces page error:", error);
    }, [error]);

    return (
        <div className="container py-24 flex items-center justify-center min-h-[60vh]">
            <div className="max-w-md w-full border rounded-xl overflow-hidden shadow-sm bg-card p-8">
                <EmptyState
                    icon={<AlertCircle className="w-16 h-16 text-destructive mb-4" />}
                    title={t("error_generic_title", { defaultMessage: "Something went wrong!" })}
                    description={error.message || t("error_generic_desc", { defaultMessage: "We encountered an issue loading the coworking spaces." })}
                    action={
                        <Button onClick={() => reset()} size="lg" className="mt-4">
                            {t("action_try_again", { defaultMessage: "Try again" })}
                        </Button>
                    }
                />
            </div>
        </div>
    );
}
