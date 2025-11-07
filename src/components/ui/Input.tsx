import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Label } from "./Label";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: any;
  label?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, error, label, name, helperText, required, ...props },
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
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-gray-300",
            "bg-[var(--color-background)] px-3 py-2 text-sm",
            "text-[var(--color-foreground)]",
            "placeholder:text-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "rtl:text-right",
            "w-full rounded-md border px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-500 ",
            "border-gray-300 focus:border-blue-500 focus:ring-blue-500",

            className,
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : ""
          )}
          ref={ref}
          name={name}
          required={required}
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
);

Input.displayName = "Input";

export { Input };
