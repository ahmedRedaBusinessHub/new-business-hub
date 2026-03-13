import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Label } from "./Label";

export interface RadioOption {
  label: string;
  value: string;
}

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: Error | { message?: string } | string;
  label?: string;
  options?: RadioOption[];
  helperText?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, error, label, options, helperText, ...props }, ref) => {
    const errorMessage = typeof error === 'string' ? error : error?.message;

    return (
      <div className="flex flex-col">
        <div className="space-y-3">
          <span className="text-sm font-medium text-gray-900">
            {label}
            {props.required && <span className="ml-1 text-red-600">*</span>}
          </span>

          {options?.map((option) => (
            <Label key={option.value} className="flex items-center space-x-3">
              <input
                ref={ref}
                type="radio"
                className={cn(
                  "h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500",
                  className,
                  error ? "border-red-500" : ""
                )}
                {...props}
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </Label>
          ))}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
            <span>⚠</span>
            <span>{errorMessage}</span>
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

Radio.displayName = "Radio";

export { Radio };
