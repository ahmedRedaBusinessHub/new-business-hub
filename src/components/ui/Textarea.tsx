import { forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-md border border-gray-300",
          "bg-[var(--color-background)] px-3 py-2 text-sm",
          "text-[var(--color-foreground)]",
          "placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "rtl:text-right",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
