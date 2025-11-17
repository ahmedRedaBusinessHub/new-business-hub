"use client";

import * as React from "react";

import { cn } from "./utils";

export const Switch = React.forwardRef<HTMLInputElement, any>(
  ({ label, error, helperText, ...props }, ref) => (
    <div className="flex items-center space-x-2">
      <label className="flex items-center cursor-pointer">
        <input type="checkbox" ref={ref} {...props} className="sr-only peer" />
        <span className="w-11 h-6 bg-gray-200 rounded-full relative peer-checked:bg-blue-600 transition">
          <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition peer-checked:translate-x-5"></span>
        </span>
      </label>
      {label && <span className="ml-2">{label}</span>}
      {helperText && <span className="ml-2 text-gray-400">{helperText}</span>}
      {error && <span className="text-red-500">{error.message}</span>}
    </div>
  )
);
