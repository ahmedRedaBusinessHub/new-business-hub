"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { DayPicker, useDayPicker } from "react-day-picker";
import { useLocale, useTranslations } from "next-intl";
import { ar } from "date-fns/locale/ar";
import { enUS } from "date-fns/locale/en-US";

import { cn } from "./utils";
import { buttonVariants } from "./Button";

/**
 * Custom navigation component for the Calendar.
 * Provides buttons for navigating by month and year.
 */
function CustomNav() {
  const { goToMonth, months, previousMonth, nextMonth } = useDayPicker();
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";

  const handlePrevYear = () => {
    const firstMonth = months[0].date;
    const d = new Date(firstMonth);
    d.setFullYear(d.getFullYear() - 1);
    goToMonth(d);
  };

  const handleNextYear = () => {
    const firstMonth = months[0].date;
    const d = new Date(firstMonth);
    d.setFullYear(d.getFullYear() + 1);
    goToMonth(d);
  };

  return (
    <div className={cn(
      "flex items-center justify-between absolute inset-x-0 top-0 h-10 px-2 pointer-events-none z-20",
      isRTL ? "flex-row-reverse" : "flex-row"
    )}>
      <div className="flex items-center gap-1 pointer-events-auto">
        <button
          onClick={handlePrevYear}
          aria-label={t("cal_prev_year_aria_label") || "Previous Year"}
          type="button"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "size-8 p-0 opacity-70 hover:opacity-100 transition-opacity"
          )}
        >
          {isRTL ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
        </button>
        <button
          onClick={() => previousMonth && goToMonth(previousMonth)}
          disabled={!previousMonth}
          aria-label={t("cal_prev_month_aria_label") || "Previous Month"}
          type="button"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "size-8 p-0 opacity-70 hover:opacity-100 transition-opacity"
          )}
        >
          {isRTL ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>
      <div className="flex items-center gap-1 pointer-events-auto">
        <button
          onClick={() => nextMonth && goToMonth(nextMonth)}
          disabled={!nextMonth}
          aria-label={t("cal_next_month_aria_label") || "Next Month"}
          type="button"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "size-8 p-0 opacity-70 hover:opacity-100 transition-opacity"
          )}
        >
          {isRTL ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
        </button>
        <button
          onClick={handleNextYear}
          aria-label={t("cal_next_year_aria_label") || "Next Year"}
          type="button"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "size-8 p-0 opacity-70 hover:opacity-100 transition-opacity"
          )}
        >
          {isRTL ? <ChevronsLeft className="size-4" /> : <ChevronsRight className="size-4" />}
        </button>
      </div>
    </div>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const locale = useLocale();
  const dateFnsLocale = locale === "ar" ? ar : enUS;

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={dateFnsLocale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={cn("p-4 bg-white rounded-xl shadow-lg border border-border", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2 relative",
        month: "flex flex-col gap-4 w-full",
        month_caption: "flex justify-center pt-1 relative items-center h-10 mb-4",
        caption_label: "text-lg font-semibold text-foreground capitalize",
        nav: "flex items-center",
        month_grid: "w-full border-collapse",
        weekdays: "flex w-full justify-between mb-2",
        weekday: cn(
          "text-foreground uppercase font-bold text-[0.7rem] underline underline-offset-4 decoration-dashed decoration-foreground/30 w-10 text-center flex-1",
          "[&:nth-child(1)]:text-red-500 [&:nth-child(7)]:text-red-500"
        ),
        week: "flex w-full mt-2 justify-between",
        day: "p-0 size-10 flex items-center justify-center relative flex-1 translate-z-0",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-10 p-0 font-normal aria-selected:opacity-100 rounded-none hover:bg-accent hover:text-accent-foreground transition-all duration-200"
        ),
        selected: cn(
          "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white rounded-none shadow-md",
          "aria-selected:bg-blue-600 aria-selected:text-white"
        ),
        today: "bg-accent/50 text-accent-foreground font-semibold",
        outside: "text-muted-foreground opacity-40 grayscale-[50%]",
        disabled: "text-muted-foreground opacity-30",
        range_middle: "bg-accent text-accent-foreground",
        range_start: "bg-blue-600 text-white rounded-l-md",
        range_end: "bg-blue-600 text-white rounded-r-md",
        ...classNames,
      }}
      components={{
        Nav: CustomNav,
      }}
      modifiers={{
        weekend: (date) => date.getDay() === 0 || date.getDay() === 6,
      }}
      modifiersClassNames={{
        weekend: "text-red-500 aria-selected:text-white",
      }}
      {...props}
    />
  );
}

export { Calendar };

