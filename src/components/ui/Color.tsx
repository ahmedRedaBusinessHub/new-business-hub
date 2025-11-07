import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Label } from "./Label";

export interface ColorProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: any;
  label?: string;
  helperText?: string;
}

const Color = forwardRef<HTMLInputElement, ColorProps>(
  ({ className, error, label, name, required, helperText, ...props }, ref) => {
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
          ref={ref}
          type="color"
          className={cn(
            "h-12 w-full rounded-md border border-gray-300 cursor-pointer",
            className,
            error ? "border-red-500" : ""
          )}
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

Color.displayName = "Color";

export { Color };
