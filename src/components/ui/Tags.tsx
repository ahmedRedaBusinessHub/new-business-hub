"use client";

// ui/Tags.tsx
import React, { useState } from "react";

export const Tags = React.forwardRef<HTMLInputElement, any>(
  ({ label, error, helperText, options = [], ...props }, ref) => {
    const [selected, setSelected] = useState([]);
    const handleSelect = (option: any) =>
      setSelected((prev: any) =>
        prev.includes(option)
          ? prev.filter((tag: any) => tag !== option)
          : [...prev, option]
      );
    return (
      <div>
        {label && <label className="block">{label}</label>}
        <div className="flex flex-wrap gap-2">
          {options.map((o: any) => (
            <span
              key={o.value}
              className={`px-3 py-1 rounded cursor-pointer ${
                selected.includes(o.value)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => handleSelect(o.value)}
            >
              {o.label}
            </span>
          ))}
        </div>
        <input type="hidden" ref={ref} {...props} value={selected.join(",")} />
        {helperText && <div className="text-gray-400">{helperText}</div>}
        {error && <div className="text-red-500">{error.message}</div>}
      </div>
    );
  }
);
