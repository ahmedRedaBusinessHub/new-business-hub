"use client";
// ui/Rating.tsx
import React, { useState } from "react";

export const Rating = React.forwardRef<HTMLInputElement, any>(
  ({ label, error, helperText, ...props }, ref) => {
    const [value, setValue] = useState(props.value || 0);
    return (
      <div>
        {label && <label className="block">{label}</label>}
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              className={`text-2xl ${
                value >= star ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => {
                setValue(star);
                props.onChange({ target: { value: star } });
              }}
            >
              ★
            </button>
          ))}
          <input type="hidden" ref={ref} {...props} value={value} />
        </div>
        {helperText && <div className="text-gray-400">{helperText}</div>}
        {error && <div className="text-red-500">{error.message}</div>}
      </div>
    );
  }
);
