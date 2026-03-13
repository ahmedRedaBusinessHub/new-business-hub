"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export default function SpaceDetailsError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const t = useTranslations();

    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Spacedetails loading error", error);
    }, [error]);

    return (
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
            <h2 className="text-2xl font-bold">{t("error_generic_title") || "Something went wrong!"}</h2>
            <p className="text-muted-foreground max-w-md">
                {t("error_generic_desc") || "We couldn't load the space details. Please try again later."}
            </p>
            <Button onClick={() => reset()} variant="default">
                {t("action_try_again") || "Try again"}
            </Button>
        </div>
    );
}
