"use client";

import { AlertCircle, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { useI18n } from "@/hooks/useI18n";

interface ForbiddenErrorProps {
  title?: string;
  message?: string;
  resource?: string;
}

export function ForbiddenError({
  title,
  message,
  resource,
}: ForbiddenErrorProps) {
  const { t } = useI18n("admin");
  const titleText = title ?? t("common.accessForbidden");
  const messageText = message ?? t("common.youDoNotHavePermission");

  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-destructive/10 p-2">
            <Shield className="size-5 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-destructive">{titleText}</CardTitle>
            {resource && (
              <CardDescription className="mt-1">
                {t("common.resourceLabel")} <code className="text-xs">{resource}</code>
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 size-5 text-destructive" />
          <div className="flex-1 space-y-2">
            <p className="text-sm text-muted-foreground">{messageText}</p>
            <p className="text-sm text-muted-foreground">
              {t("common.contactAdmin")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
