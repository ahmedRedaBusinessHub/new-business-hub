"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Select";

interface UserRolesProps {
  userId: number;
}

export function UserRoles({ userId }: UserRolesProps) {
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const fetchingRef = useRef(false);
  const lastFetchedParamsRef = useRef<string>("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchRoles = useCallback(async () => {
    if (!userId) return;

    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: pageSize.toString(),
      ...(debouncedSearch && { search: debouncedSearch }),
    });
    const paramsString = params.toString();

    // Prevent duplicate calls with same parameters
    if (fetchingRef.current && lastFetchedParamsRef.current === paramsString) {
      return;
    }

    // Mark as fetching and track params
    fetchingRef.current = true;
    lastFetchedParamsRef.current = paramsString;

    try {
      setLoading(true);
      const response = await fetch(`/api/user-roles/user/${userId}?${paramsString}`).catch(() => null);
      if (response?.ok) {
        const data = await response.json();
        setUserRoles(Array.isArray(data.data) ? data.data : []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 0);
      } else {
        setUserRoles([]);
        setTotal(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching user roles:", error);
      setUserRoles([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      fetchingRef.current = false;
      setLoading(false);
    }
  }, [userId, currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, currentPage, pageSize, debouncedSearch]);

  if (loading) {
    return <div className="p-4 text-center">Loading roles...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Roles ({total})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search roles..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            error={undefined}
            value={pageSize.toString()}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="w-32"
          >
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </Select>
        </div>
        {userRoles.length === 0 && !loading ? (
          <p className="text-sm text-muted-foreground">No roles assigned</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userRoles.map((role: any) => (
                  <TableRow key={role.id}>
                    <TableCell>{role.roles?.name || role.role_name || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={role.deleted_at ? "secondary" : "default"}>
                        {role.deleted_at ? "Inactive" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {role.created_at
                        ? new Date(role.created_at).toLocaleDateString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
