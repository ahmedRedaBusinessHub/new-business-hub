"use client";

import { OperatingHours } from "@/types/space";
import { useOpenNowStatus } from "@/lib/hooks/use-current-time";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/Collapsible";
import { ChevronDown, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { OperatingHoursList } from "./operating-hours-list";
import { SpecialHoursList } from "./special-hours-list";

interface OperatingHoursCardProps {
  operatingHours: OperatingHours;
  permanentlyClosed?: boolean;
}

export function OperatingHoursCard({
  operatingHours,
  permanentlyClosed,
}: OperatingHoursCardProps) {
  const t = useTranslations();
  const [isSpecialHoursOpen, setIsSpecialHoursOpen] = useState(false);
  const status = useOpenNowStatus(operatingHours, operatingHours.timezone);

  if (permanentlyClosed) {
    return (
      <Card className="border-red-200/50 bg-red-50/50 dark:bg-red-950/20 backdrop-blur-sm overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
        <CardContent className="pt-6 flex gap-4 items-start">
          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full text-red-600 dark:text-red-400">
            <AlertCircle size={20} />
          </div>
          <div>
            <p className="text-lg font-semibold text-red-700 dark:text-red-400">
              {t("operating_hours_permanently_closed")}
            </p>
            <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">
              {t("operating_hours_permanently_closed_desc")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusMessage =
    status?.message === "Open Now"
      ? t("operating_hours_open_now")
      : status?.message === "Closed"
        ? t("operating_hours_closed")
        : status?.message === "Open 24/7"
          ? t("operating_hours_open_24_7")
          : status?.message;

  const isOpenNow = status?.isOpen;
  const is24_7 = status?.message === "Open 24/7";

  let statusClasses =
    "bg-secondary text-secondary-foreground border-transparent";
  if (is24_7) {
    statusClasses =
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
  } else if (isOpenNow) {
    statusClasses =
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  } else if (statusMessage) {
    statusClasses =
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
  }

  return (
    <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300 dark:bg-zinc-900/40 backdrop-blur-xl">
      <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Clock size={18} />
            </div>
            <h3 className="text-lg font-semibold tracking-tight">
              {t("operating_hours_title")}
            </h3>
          </div>
          {status && (
            <Badge
              variant="outline"
              className={`px-3 py-1 font-medium capitalize flex items-center gap-1.5 ${statusClasses}`}
            >
              {isOpenNow && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
              {!isOpenNow && (
                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
              )}
              {statusMessage}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        <OperatingHoursList operatingHours={operatingHours} />

        {operatingHours.specialHours &&
          operatingHours.specialHours.length > 0 && (
            <Collapsible
              open={isSpecialHoursOpen}
              onOpenChange={setIsSpecialHoursOpen}
              className="bg-muted/30 rounded-xl border border-border/40 p-1"
            >
              <CollapsibleTrigger asChild>
                <button className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50">
                  <span className="flex items-center gap-2">
                    <AlertCircle size={14} className="text-orange-500" />
                    {t("operating_hours_special_hours_count", {
                      count: operatingHours.specialHours.length,
                    })}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${isSpecialHoursOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <div className="px-3 pb-3 pt-1 mt-1">
                  <SpecialHoursList
                    specialHours={operatingHours.specialHours}
                    timezone={operatingHours.timezone}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
      </CardContent>
    </Card>
  );
}
