"use client";

import React from "react";
import { Skeleton } from "./Skeleton";

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  className = "",
}) => {
  const rowsArray = Array.from({ length: rows });
  const columnsArray = Array.from({ length: columns });

  return (
    <div className={`w-full overflow-auto ${className}`}>
      <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            {columnsArray.map((_, colIndex) => (
              <th key={colIndex} className="px-4 py-3">
                <Skeleton className="w-[100%] h-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowsArray.map((_, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-gray-200 dark:border-gray-700"
            >
              {columnsArray.map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <Skeleton className="w-[100%] h-20" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
