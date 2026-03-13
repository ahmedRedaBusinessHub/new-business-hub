"use client";
import React, { useState, useEffect } from "react";

interface RatingProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: { message: string };
  helperText?: string;
  readOnly?: boolean;
}

export const Rating = React.forwardRef<HTMLInputElement, RatingProps>(
  ({ label, error, helperText, readOnly, ...props }, ref) => {
    const [value, setValue] = useState(props.value || 0);

    // Sync value if props.value changes externally (e.g., in readOnly mode)
    useEffect(() => {
      if (props.value !== undefined) {
        setValue(props.value);
      }
    }, [props.value]);

    return (
      <div>
        {label && <label className="block">{label}</label>}
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              disabled={readOnly}
              className={`text-2xl ${Number(value) >= star ? "text-yellow-400" : "text-border"
                } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
              onClick={() => {
                if (!readOnly) {
                  setValue(star);
                  if (props.onChange) {
                    props.onChange({ target: { value: star } } as any);
                  }
                }
              }}
            >
              ★
            </button>
          ))}
          {!readOnly && <input type="hidden" ref={ref} {...props} value={value} />}
        </div>
        {helperText && !readOnly && <div className="text-muted-foreground">{helperText}</div>}
        {error && !readOnly && <div className="text-destructive font-medium">{error.message}</div>}
      </div>
    );
  }
);

Rating.displayName = "Rating";
