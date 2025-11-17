# DataTable with Server-Side Pagination - Usage Guide

## Overview
The updated `DataTable.tsx` component now fetches data and columns directly from your server with built-in pagination, sorting, and search capabilities.

## Key Changes

### 1. **Server-Driven Data & Columns**
- Data and columns are fetched from an API endpoint
- Columns are now dynamic and come from the server
- No hardcoded sample data

### 2. **Server-Side Pagination**
- Uses `manualPagination: true` to handle pagination server-side
- Sends page number and page size to the server
- Reduces data transfer and improves performance

### 3. **API Request Parameters**
The component sends the following query parameters:
```
GET /api/users?page=1&pageSize=10&sortBy=name&sortOrder=asc&search=john
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | 1-based page number |
| `pageSize` | number | Items per page (10, 20, 30, etc.) |
| `sortBy` | string | Column ID to sort by |
| `sortOrder` | string | `asc` or `desc` |
| `search` | string | Global search term |

### 4. **Expected Server Response**
Your API should return this JSON structure:

```json
{
  "data": [
    { "id": 1, "name": "Alice", "email": "alice@example.com", "status": "Active" },
    { "id": 2, "name": "Bob", "email": "bob@example.com", "status": "Inactive" }
  ],
  "columns": [
    {
      "accessorKey": "id",
      "header": "ID",
      "enableSorting": true
    },
    {
      "accessorKey": "name",
      "header": "Name",
      "enableSorting": true
    },
    {
      "accessorKey": "email",
      "header": "Email",
      "enableSorting": false
    },
    {
      "accessorKey": "status",
      "header": "Status",
      "cell": "StatusBadge"
    }
  ],
  "total": 55,
  "page": 1,
  "pageSize": 10,
  "totalPages": 6
}
```

## Usage Example

### Component Usage
```tsx
import { DataTable } from '@/components/DataTable';

export default function UsersPage() {
  return (
    <DataTable
      apiEndpoint="/api/users"
      pageSize={10}
      enableSearch={true}
      enableColumnVisibility={true}
    />
  );
}
```

### API Endpoint Example (Next.js)
```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const sortBy = searchParams.get('sortBy') || 'id';
  const sortOrder = searchParams.get('sortOrder') || 'asc';
  const search = searchParams.get('search') || '';

  // Fetch from database or external API
  const data = await fetchUsersFromDB({
    page,
    pageSize,
    sortBy,
    sortOrder,
    search,
  });

  return NextResponse.json({
    data: data.items,
    columns: [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'status', header: 'Status' },
    ],
    total: data.total,
    page,
    pageSize,
    totalPages: Math.ceil(data.total / pageSize),
  });
}
```

## Features

### ✅ Implemented
- **Server-side pagination** - Fetch only needed pages
- **Server-side sorting** - Sort on the backend
- **Debounced search** - Efficient search handling (300ms delay)
- **Column visibility toggle** - Show/hide columns
- **Loading states** - Skeleton loader during data fetch
- **Responsive design** - Mobile-friendly layout
- **Dark mode support** - Built-in dark mode styling
- **Page size selector** - Choose rows per page

### Component Props
```typescript
interface DataTableProps {
  apiEndpoint: string;      // Required: Your API endpoint
  pageSize?: number;         // Default: 10
  enableSearch?: boolean;    // Default: true
  enableColumnVisibility?: boolean; // Default: true
}
```

## Advanced Customization

### Custom Cell Rendering
In your server response, pass custom render functions:
```json
{
  "columns": [
    {
      "accessorKey": "joinDate",
      "header": "Join Date",
      "cell": "formatDate" // Custom formatter
    },
    {
      "accessorKey": "salary",
      "header": "Salary",
      "cell": "formatCurrency"
    }
  ]
}
```

### Error Handling
The component has built-in error handling. You can customize it:
```tsx
<DataTable
  apiEndpoint="/api/users"
  onError={(error) => {
    // Custom error handling
    console.error('Table error:', error);
  }}
/>
```

## Performance Tips

1. **Index your database** - Ensure columns used for sorting are indexed
2. **Implement efficient search** - Use full-text search on backend
3. **Limit returned fields** - Only send necessary data
4. **Cache when possible** - Cache frequently accessed pages
5. **Use pagination** - Never return all rows at once

## Migration from Old Version

### Before (Static Data)
```tsx
const data = generateSampleData(); // 50+ hardcoded records
```

### After (Server-Driven)
```tsx
<DataTable apiEndpoint="/api/users" />
// Server handles all data fetching and pagination
```

## Troubleshooting

### Data not loading?
- Check API endpoint URL
- Verify response format matches expected structure
- Check browser console for network errors

### Pagination not working?
- Ensure `totalPages` in response is correct
- Verify `page` parameter is 1-based on server

### Sorting not working?
- Ensure `sortBy` parameter matches your column `accessorKey`
- Check backend sorting implementation

### Search not updating?
- Verify search endpoint returns filtered results
- Check debounce timing (default 300ms)