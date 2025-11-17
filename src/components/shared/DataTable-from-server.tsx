"use client";

import { useState, useCallback, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";

// Types for server response
interface DataTableResponse {
  data: any[];
  columns: ColumnDef<any>[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface PaginationParams {
  page: number;
  pageSize: number;
  sorting?: SortingState;
  search?: string;
}

// Status Badge Component
const StatusBadge = ({ status }: any) => {
  const statusStyles: any = {
    Active:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Inactive:
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    Pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        statusStyles[status] || statusStyles.Active
      }`}
    >
      {status}
    </span>
  );
};

// Column Visibility Dropdown Component
const ColumnVisibilityDropdown = ({ table, isOpen, setIsOpen }: any) => {
  if (!isOpen) return null;
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
      {table.getAllLeafColumns().map((column: any) => (
        <label
          key={column.id}
          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={column.getIsVisible()}
            onChange={column.getToggleVisibilityHandler()}
            className="rounded border-gray-300"
          />
          <span className="text-sm capitalize">{column.id}</span>
        </label>
      ))}
    </div>
  );
};

// Loading Skeleton
const TableSkeleton = () => (
  <div className="space-y-2 p-4">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
      />
    ))}
  </div>
);

// Main DataTable Component
interface DataTableProps {
  apiEndpoint: string; // e.g., "/api/users"
  pageSize?: number;
  enableSearch?: boolean;
  enableColumnVisibility?: boolean;
}

export function DataTable({
  apiEndpoint,
  pageSize = 10,
  enableSearch = true,
  enableColumnVisibility = true,
}: DataTableProps) {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<ColumnDef<any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [columnVisibilityOpen, setColumnVisibilityOpen] = useState(false);

  // Fetch data from server
  const fetchData = useCallback(
    async (pageIndex: number, pageSize: number, sort?: SortingState) => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: (pageIndex + 1).toString(), // Server typically expects 1-based indexing
          pageSize: pageSize.toString(),
          ...(globalFilter && { search: globalFilter }),
          ...(sort && sort.length > 0 && {
            sortBy: sort[0].id,
            sortOrder: sort[0].desc ? "desc" : "asc",
          }),
        });

        const response = await fetch(`${apiEndpoint}?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result: DataTableResponse = await response.json();

        setData(result.data);
        setColumns(result.columns);
        setTotal(result.total);
        setTotalPages(result.totalPages);
        setPagination({ pageIndex, pageSize });
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [apiEndpoint, globalFilter]
  );

  // Initial fetch and refetch on dependencies change
  useEffect(() => {
    fetchData(pagination.pageIndex, pagination.pageSize, sorting);
  }, [pagination.pageIndex, pagination.pageSize, sorting, fetchData]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination({ ...pagination, pageIndex: 0 }); // Reset to first page on search
      fetchData(0, pagination.pageSize, sorting);
    }, 300);

    return () => clearTimeout(timer);
  }, [globalFilter, sorting, pagination.pageSize]);

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
      columnVisibility,
      globalFilter,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true, // Important: tells table that pagination is handled by server
    pageCount: totalPages,
  });

  return (
    <div className="w-full space-y-4">
      {/* Header with Search and Controls */}
      <div className="flex gap-4 items-center justify-between">
        {enableSearch && (
          <input
            placeholder="Search..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white flex-1 max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
        {enableColumnVisibility && (
          <div className="relative">
            <button
              onClick={() => setColumnVisibilityOpen(!columnVisibilityOpen)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Columns
            </button>
            <ColumnVisibilityDropdown
              table={table}
              isOpen={columnVisibilityOpen}
              setIsOpen={setColumnVisibilityOpen}
            />
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        {loading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        <div className="flex items-center gap-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <button
                              onClick={header.column.getToggleSortingHandler()}
                              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                              {header.column.getIsSorted() === "asc" ? (
                                <span>↑</span>
                              ) : header.column.getIsSorted() === "desc" ? (
                                <span>↓</span>
                              ) : (
                                <span className="text-gray-400">↕</span>
                              )}
                            </button>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex gap-4 items-center justify-between py-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {data.length > 0 ? pagination.pageIndex * pagination.pageSize + 1 : 0} to{" "}
          {Math.min(
            (pagination.pageIndex + 1) * pagination.pageSize,
            total
          )}{" "}
          of {total} results
        </div>

        <div className="flex gap-2">
          <button
            onClick={() =>
              table.setPageIndex(Math.max(0, pagination.pageIndex - 1))
            }
            disabled={pagination.pageIndex === 0}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {pagination.pageIndex + 1} of {totalPages}
            </span>
          </div>

          <button
            onClick={() =>
              table.setPageIndex(Math.min(totalPages - 1, pagination.pageIndex + 1))
            }
            disabled={pagination.pageIndex >= totalPages - 1}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Next
          </button>
        </div>

        <select
          value={pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>
      </div>

      {/* No Results Message */}
      {!loading && data.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No results found
        </div>
      )}
    </div>
  );
}