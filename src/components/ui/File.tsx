import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Label } from "./Label";

export interface FileProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: any;
  label?: string;
  helperText?: string;
}

const File = forwardRef<HTMLInputElement, FileProps>(
  ({ className, error, label, helperText, ...props }, ref) => {
    return (
      <div className="flex flex-col">
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
          type="file"
          className={cn(
            "w-full rounded-md border border-gray-300 px-4 py-2 text-sm file:mr-4 file:rounded file:border-0 file:bg-blue-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-200",
            className,
            error ? "border-red-500" : ""
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
);

File.displayName = "File";

export { File };
