import * as React from "react";

import { cn } from "./utils";
import { Label } from "./Label";

function Textarea({
  name,
  label,
  required,
  error,
  className,
  helperText,
  ...props
}: React.ComponentProps<"textarea"> & any) {
  return (
    <div className="flex flex-col">
      <Label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-gray-900"
      >
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </Label>
      <textarea
        data-slot="textarea"
        className={cn(
          "resize-none border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-input-background px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
          <span>⚠</span>
          <span>{error?.message as string}</span>
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

export { Textarea };
