import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Label } from "./Label";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: any;
  label?: string;
  helperText?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, error, label, helperText, ...props }, ref) => {
    return (
      <div className="flex flex-col">
        <Label className="flex items-center space-x-3">
          <input
            ref={ref}
            type="checkbox"
            className={cn(
              "h-4 w-4 rounded border border-gray-300",
              "bg-background text-primary",
              "focus:outline-none focus:ring-2 focus:ring-primary",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "h-4 w-4 rounded border-gray-300 text-blue-600 transition-colors focus:ring-blue-500 disabled:bg-gray-100",
              className,
              error ? "border-red-500" : ""
            )}
            {...props}
          />
          <span className="text-sm font-medium text-gray-900">
            {label}
            {props.required && <span className="ml-1 text-red-600">*</span>}
          </span>
        </Label>
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

Checkbox.displayName = "Checkbox";

export { Checkbox };
