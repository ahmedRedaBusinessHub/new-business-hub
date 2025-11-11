"use client";
import { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

// Generate comprehensive sample data (50+ records)
const generateSampleData = () => {
  const baseData = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.johnson@company.com",
      age: 32,
      status: "Active",
      department: "Engineering",
      salary: 95000,
      joinDate: "2021-03-15",
      performance: 92,
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob.smith@company.com",
      age: 28,
      status: "Active",
      department: "Sales",
      salary: 75000,
      joinDate: "2022-01-20",
      performance: 78,
    },
    {
      id: 3,
      name: "Carol White",
      email: "carol.white@company.com",
      age: 41,
      status: "Inactive",
      department: "HR",
      salary: 82000,
      joinDate: "2020-06-10",
      performance: 65,
    },
    {
      id: 4,
      name: "David Brown",
      email: "david.brown@company.com",
      age: 35,
      status: "Active",
      department: "Marketing",
      salary: 88000,
      joinDate: "2021-11-05",
      performance: 85,
    },
    {
      id: 5,
      name: "Emma Davis",
      email: "emma.davis@company.com",
      age: 29,
      status: "Pending",
      department: "Engineering",
      salary: 92000,
      joinDate: "2023-02-14",
      performance: 88,
    },
    {
      id: 6,
      name: "Frank Wilson",
      email: "frank.wilson@company.com",
      age: 38,
      status: "Active",
      department: "Sales",
      salary: 79000,
      joinDate: "2020-09-22",
      performance: 81,
    },
    {
      id: 7,
      name: "Grace Lee",
      email: "grace.lee@company.com",
      age: 31,
      status: "Active",
      department: "Engineering",
      salary: 98000,
      joinDate: "2021-07-13",
      performance: 94,
    },
    {
      id: 8,
      name: "Henry Martinez",
      email: "henry.martinez@company.com",
      age: 44,
      status: "Inactive",
      department: "Marketing",
      salary: 85000,
      joinDate: "2019-04-28",
      performance: 72,
    },
    {
      id: 9,
      name: "Ivy Taylor",
      email: "ivy.taylor@company.com",
      age: 26,
      status: "Active",
      department: "HR",
      salary: 68000,
      joinDate: "2023-01-10",
      performance: 76,
    },
    {
      id: 10,
      name: "Jack Anderson",
      email: "jack.anderson@company.com",
      age: 37,
      status: "Active",
      department: "Sales",
      salary: 81000,
      joinDate: "2021-05-19",
      performance: 87,
    },
    {
      id: 11,
      name: "Karen Thomas",
      email: "karen.thomas@company.com",
      age: 33,
      status: "Pending",
      department: "Engineering",
      salary: 96000,
      joinDate: "2022-08-30",
      performance: 91,
    },
    {
      id: 12,
      name: "Leo Garcia",
      email: "leo.garcia@company.com",
      age: 40,
      status: "Active",
      department: "Marketing",
      salary: 87000,
      joinDate: "2020-12-05",
      performance: 83,
    },
    {
      id: 13,
      name: "Maria Rodriguez",
      email: "maria.rodriguez@company.com",
      age: 30,
      status: "Active",
      department: "HR",
      salary: 70000,
      joinDate: "2022-03-17",
      performance: 79,
    },
    {
      id: 14,
      name: "Nathan Jackson",
      email: "nathan.jackson@company.com",
      age: 36,
      status: "Inactive",
      department: "Engineering",
      salary: 94000,
      joinDate: "2019-10-12",
      performance: 68,
    },
    {
      id: 15,
      name: "Olivia White",
      email: "olivia.white@company.com",
      age: 27,
      status: "Active",
      department: "Sales",
      salary: 76000,
      joinDate: "2023-05-22",
      performance: 84,
    },
    {
      id: 16,
      name: "Peter Harris",
      email: "peter.harris@company.com",
      age: 39,
      status: "Active",
      department: "Engineering",
      salary: 97000,
      joinDate: "2021-02-08",
      performance: 90,
    },
    {
      id: 17,
      name: "Quinn Clark",
      email: "quinn.clark@company.com",
      age: 34,
      status: "Pending",
      department: "Marketing",
      salary: 84000,
      joinDate: "2022-09-14",
      performance: 86,
    },
    {
      id: 18,
      name: "Rachel Lewis",
      email: "rachel.lewis@company.com",
      age: 29,
      status: "Active",
      department: "HR",
      salary: 72000,
      joinDate: "2022-11-03",
      performance: 80,
    },
    {
      id: 19,
      name: "Samuel Miller",
      email: "samuel.miller@company.com",
      age: 42,
      status: "Active",
      department: "Sales",
      salary: 83000,
      joinDate: "2020-07-21",
      performance: 82,
    },
    {
      id: 20,
      name: "Tina Davis",
      email: "tina.davis@company.com",
      age: 31,
      status: "Inactive",
      department: "Engineering",
      salary: 93000,
      joinDate: "2019-12-09",
      performance: 71,
    },
    {
      id: 21,
      name: "Uma Patel",
      email: "uma.patel@company.com",
      age: 28,
      status: "Active",
      department: "Marketing",
      salary: 86000,
      joinDate: "2022-06-13",
      performance: 88,
    },
    {
      id: 22,
      name: "Victor Singh",
      email: "victor.singh@company.com",
      age: 35,
      status: "Active",
      department: "HR",
      salary: 71000,
      joinDate: "2021-09-27",
      performance: 77,
    },
    {
      id: 23,
      name: "Wendy Martin",
      email: "wendy.martin@company.com",
      age: 33,
      status: "Pending",
      department: "Sales",
      salary: 80000,
      joinDate: "2023-04-10",
      performance: 85,
    },
    {
      id: 24,
      name: "Xavier Robinson",
      email: "xavier.robinson@company.com",
      age: 38,
      status: "Active",
      department: "Engineering",
      salary: 99000,
      joinDate: "2021-01-18",
      performance: 93,
    },
    {
      id: 25,
      name: "Yara Chen",
      email: "yara.chen@company.com",
      age: 26,
      status: "Active",
      department: "Marketing",
      salary: 83000,
      joinDate: "2023-03-06",
      performance: 87,
    },
  ];

  // Generate additional records to reach 50+
  const additionalData = [];
  const names = [
    "Zoe",
    "Adam",
    "Bella",
    "Chris",
    "Diana",
    "Ethan",
    "Fiona",
    "George",
    "Hannah",
    "Isaac",
    "Julia",
    "Kevin",
    "Laura",
    "Mike",
    "Nina",
    "Oscar",
    "Paula",
    "Quentin",
    "Rose",
    "Steve",
    "Tara",
    "Ulysses",
    "Violet",
    "Walter",
    "Xena",
    "Yale",
    "Zelda",
  ];
  const lastNames = [
    "Adams",
    "Baker",
    "Cooper",
    "Dixon",
    "Evans",
    "Foster",
    "Gray",
    "Hall",
  ];
  const departments = ["Engineering", "Sales", "Marketing", "HR"];
  const statuses = ["Active", "Inactive", "Pending"];

  for (let i = 0; i < 30; i++) {
    const firstName = names[i % names.length];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const dept = departments[Math.floor(Math.random() * departments.length)];

    additionalData.push({
      id: 26 + i,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      age: 24 + Math.floor(Math.random() * 25),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      department: dept,
      salary: 65000 + Math.floor(Math.random() * 40000),
      joinDate: `20${19 + Math.floor(Math.random() * 5)}-${String(
        Math.floor(Math.random() * 12) + 1
      ).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(
        2,
        "0"
      )}`,
      performance: 60 + Math.floor(Math.random() * 40),
    });
  }

  return [...baseData, ...additionalData];
};

// Status Badge Component
const StatusBadge = ({ status }: any) => {
  const statusStyles: any = {
    Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Inactive: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    Pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
};

// Column Visibility Dropdown Component
const ColumnVisibilityDropdown = ({ table, isOpen, setIsOpen }: any) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 fade-in">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Column Visibility
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {table.getAllLeafColumns().map((column: any) => {
            if (column.id === "select") return null;
            return (
              <label
                key={column.id}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {typeof column.columnDef.header === "string"
                    ? column.columnDef.header
                    : column.id}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Main DataTable Component
const DataTable = () => {
  const [data] = useState<any>(() => generateSampleData());
  const [globalFilter, setGlobalFilter] = useState<any>("");
  const [columnVisibility, setColumnVisibility] = useState<any>({});
  const [columnOrder, setColumnOrder] = useState<any>([]);
  const [columnPinning, setColumnPinning] = useState<any>({});
  const [rowSelection, setRowSelection] = useState<any>({});
  const [sorting, setSorting] = useState<any>([]);

  const [showColumnVisibility, setShowColumnVisibility] = useState<any>(false);
  const [columnSizing, setColumnSizing] = useState<any>({});

  // Define columns
  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }: any) => (
          <input
            type="checkbox"
            ref={(el) => {
              if (el) {
                el.indeterminate = table.getIsSomeRowsSelected();
              }
            }}
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            aria-label="Select all rows"
          />
        ),
        cell: ({ row }: any) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            aria-label={`Select row ${row.id}`}
          />
        ),
        size: 50,
        enableSorting: false,
        enableResizing: false,
      },
      {
        accessorKey: "id",
        header: "ID",
        size: 80,
        cell: (info: any) => (
          <span className="font-mono text-sm">{info.getValue()}</span>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        size: 200,
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 250,
        cell: (info) => (
          <span className="text-gray-600 dark:text-gray-400">
            {info.getValue()}
          </span>
        ),
      },
      {
        accessorKey: "age",
        header: "Age",
        size: 80,
        cell: (info) => (
          <span className="text-center block">{info.getValue()}</span>
        ),
      },
      {
        accessorKey: "department",
        header: "Department",
        size: 150,
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 120,
        cell: (info) => <StatusBadge status={info.getValue()} />,
      },
      {
        accessorKey: "salary",
        header: "Salary",
        size: 120,
        cell: (info) => (
          <span className="font-semibold text-green-600 dark:text-green-400">
            ${info.getValue().toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: "joinDate",
        header: "Join Date",
        size: 120,
        cell: (info) => {
          const date = new Date(info.getValue());
          return (
            <span>
              {date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          );
        },
      },
      {
        accessorKey: "performance",
        header: "Performance",
        size: 120,
        cell: (info) => (
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full"
                style={{ width: `${info.getValue()}%` }}
              ></div>
            </div>
            <span className="text-xs font-medium">{info.getValue()}%</span>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnVisibility,
      columnOrder,
      columnPinning,
      rowSelection,
      sorting,
      columnSizing,
    },
    enableRowSelection: true,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnSizingChange: setColumnSizing,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const selectedRowsCount = Object.keys(rowSelection).length;
  const totalRows = table.getFilteredRowModel().rows.length;
  const pageRows = table.getRowModel().rows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min(startRow + pageRows - 1, totalRows);

  return (
    <div className="max-w-[1600px] mx-auto p-6 space-y-6">
      {/* Controls Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[300px]">
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e: any) => setGlobalFilter(e.target.value)}
              placeholder="Search all columns..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              aria-label="Global search"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => alert("Export functionality - Data exported!")}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export
            </button>
            <div className="relative">
              <button
                onClick={() => setShowColumnVisibility(!showColumnVisibility)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Columns
              </button>
              <ColumnVisibilityDropdown
                table={table}
                isOpen={showColumnVisibility}
                setIsOpen={setShowColumnVisibility}
              />
            </div>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e: any) => table.setPageSize(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              aria-label="Rows per page"
            >
              {[10, 20, 30, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize} rows
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Statistics */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="font-medium">Total Records:</span>
            <span className="text-gray-900 dark:text-gray-100 font-semibold">
              {totalRows}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span className="font-medium">Showing:</span>
            <span className="text-gray-900 dark:text-gray-100 font-semibold">
              {startRow}-{endRow}
            </span>
          </div>
          {selectedRowsCount > 0 && (
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">Selected:</span>
              <span className="text-primary-600 dark:text-primary-400 font-semibold">
                {selectedRowsCount}
              </span>
            </div>
          )}
          {globalFilter && (
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="font-medium">Filter active:</span>
              <span className="text-primary-600 dark:text-primary-400 font-semibold">
                "{globalFilter}"
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="table-container">
          <table className="w-full">
            <thead className="sticky-header bg-gray-50 dark:bg-gray-700">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{ width: header.getSize() }}
                      className="relative px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none flex items-center gap-2 flex-1"
                              : "flex-1",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <span className="text-gray-400">
                              {header.column.getIsSorted() === "asc" ? (
                                <svg
                                  className="w-4 h-4 text-primary-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 15l7-7 7 7"
                                  />
                                </svg>
                              ) : header.column.getIsSorted() === "desc" ? (
                                <svg
                                  className="w-4 h-4 text-primary-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                                  />
                                </svg>
                              )}
                            </span>
                          )}
                        </div>
                        {header.column.id !== "select" && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => header.column.pin("left")}
                              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                                header.column.getIsPinned() === "left"
                                  ? "text-primary-600"
                                  : "text-gray-400"
                              }`}
                              title="Pin left"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => header.column.pin(false)}
                              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                                !header.column.getIsPinned()
                                  ? "text-primary-600"
                                  : "text-gray-400"
                              }`}
                              title="Unpin"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => header.column.pin("right")}
                              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                                header.column.getIsPinned() === "right"
                                  ? "text-primary-600"
                                  : "text-gray-400"
                              }`}
                              title="Pin right"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`resizer ${
                            header.column.getIsResizing() ? "isResizing" : ""
                          }`}
                        />
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                      className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
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
      </div>

      {/* Pagination Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Page{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {table.getState().pagination.pageIndex + 1}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {table.getPageCount()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="First page"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <input
              type="number"
              min="1"
              max={table.getPageCount()}
              value={table.getState().pagination.pageIndex + 1}
              onChange={(e: any) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              aria-label="Go to page"
            />
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Last page"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DataTable;

// Column Visibility Dropdown Component
