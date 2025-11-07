import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Label } from "./Label";

export interface RangeProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: any;
  label?: string;
  value?: any;
  helperText?: string;
}

const Range = forwardRef<HTMLInputElement, RangeProps>(
  ({ className, error, label, value, helperText, ...props }, ref) => {
    return (
      <div className="flex flex-col">
        <div className="flex items-center space-x-4">
          {label ? (
            <Label
              htmlFor={props.name}
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              {label}
              {props.required && <span className="ml-1 text-red-600">*</span>}
            </Label>
          ) : null}
          <input
            ref={ref}
            type="range"
            className={cn(
              "flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600",
              className,
              error ? "border-red-500" : ""
            )}
            {...props}
          />
          <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
            {value}
          </span>
        </div>

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

Range.displayName = "Range";

export { Range };
