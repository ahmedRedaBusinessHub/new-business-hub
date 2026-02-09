import { forwardRef, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Label } from "./Label";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error: any;
  label?: string;
  helperText?: string;
  options?: { label: string; value: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      children,
      error,
      name,
      required,
      helperText,
      label,
      options,
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex flex-col">
        {label ? (
          <Label
            htmlFor={name}
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            {label}
            {required && <span className="ml-1 text-red-600">*</span>}
          </Label>
        ) : null}
        <select
          ref={ref}
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            className,
            // "flex h-10 w-full rounded-md border border-gray-300",
            // "bg-(--color-background) px-3 py-2 text-sm",
            // "text-(--color-foreground)",
            // "focus:outline-none focus:ring-2 focus:ring-(--color-primary)",
            // "disabled:cursor-not-allowed disabled:opacity-50",
            // "w-full rounded-md border px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-500",
            // "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
            // className,
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : ""
          )}
          name={name}
          required={required}
          {...props}
        >
          {label && <option value="">{label}</option>}
          {options?.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          {children}
        </select>
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
);

Select.displayName = "Select";

export { Select };
