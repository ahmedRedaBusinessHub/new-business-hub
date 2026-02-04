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
import { Button } from "@/components/ui/Button";
import { Search, Eye } from "lucide-react";
import DynamicView from "../shared/DynamicView";
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
import { staticListsCache } from "@/lib/staticListsCache";
import { getLocalizedLabel } from "@/lib/localizedLabel";
import { useI18n } from "@/hooks/useI18n";

interface UserProgramsProps {
  userId: number;
}

export function UserPrograms({ userId }: UserProgramsProps) {
  const { language } = useI18n();
  const [loading, setLoading] = useState(true);
  const [userPrograms, setUserPrograms] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingUserProgram, setViewingUserProgram] = useState<any | null>(null);
  const [statuses, setStatuses] = useState<any[]>([]);
  const statusesFetchedRef = useRef(false);
  const fetchingProgramsRef = useRef(false);
  const lastFetchedParamsRef = useRef<string>("");

  // Fetch statuses from static_lists cache (only once)
  useEffect(() => {
    if (statusesFetchedRef.current) return;
    
    const fetchStatuses = async () => {
      try {
        statusesFetchedRef.current = true;
        const statusesConfig = await staticListsCache.getByNamespace('user_program.statuses');
        setStatuses(statusesConfig);
      } catch (error) {
        console.error("Error fetching statuses:", error);
        statusesFetchedRef.current = false; // Reset on error to allow retry
      }
    };
    fetchStatuses();
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchPrograms = useCallback(async () => {
    if (!userId) return;

    // Create params string to check for duplicate calls
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: pageSize.toString(),
      ...(debouncedSearch && { search: debouncedSearch }),
    });
    const paramsString = params.toString();

    // Prevent duplicate calls with same parameters
    if (fetchingProgramsRef.current && lastFetchedParamsRef.current === paramsString) {
      return;
    }

    // Mark as fetching and track params
    fetchingProgramsRef.current = true;
    lastFetchedParamsRef.current = paramsString;

    try {
      setLoading(true);
      const response = await fetch(`/api/user-program/user/${userId}?${paramsString}`).catch(() => null);
      
      if (response?.ok) {
        const data = await response.json();
        setUserPrograms(Array.isArray(data.data) ? data.data : []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 0);
      } else {
        setUserPrograms([]);
        setTotal(0);
        setTotalPages(0);
      }
    } catch (error: any) {
      console.error("Error fetching user programs:", error);
      setUserPrograms([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      fetchingProgramsRef.current = false;
      setLoading(false);
    }
  }, [userId, currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchPrograms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, currentPage, pageSize, debouncedSearch]);

  const handleView = (userProgram: any) => {
    setViewingUserProgram(userProgram);
    setIsViewOpen(true);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewingUserProgram(null);
  };

  const getDocuments = (userProgram: any): Array<{ name: string; file_id: number; file_url?: string }> => {
    if (!userProgram.upload_documents || !Array.isArray(userProgram.upload_documents)) {
      return [];
    }
    return userProgram.upload_documents
      .filter((doc: any) => doc?.file_id)
      .map((doc: any) => ({
        name: doc.name || `File ${doc.file_id}`,
        file_id: doc.file_id,
        file_url: doc.file_url,
      }));
  };

  const getStatusName = (statusId: number | null): string => {
    if (statusId === null) return "-";
    const status = statuses.find(s => s.id === statusId);
    return status ? getLocalizedLabel(status.name_en, status.name_ar, language) : String(statusId);
  };

  if (loading) {
    return <div className="p-4 text-center">Loading programs...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Programs ({total})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search programs..."
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
        {userPrograms.length === 0 && !loading ? (
          <p className="text-sm text-muted-foreground">No programs enrolled</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Enrolled At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userPrograms.map((program: any) => (
                  <TableRow key={program.id}>
                    <TableCell>
                      {getLocalizedLabel(program.programs?.name_en, program.programs?.name_ar, language) || program.program_name || "-"}
                    </TableCell>
                    <TableCell>
                      {getStatusName(program.status)}
                    </TableCell>
                    <TableCell>
                      {program.created_at
                        ? new Date(program.created_at).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(program)}
                        title="View program details"
                      >
                        <Eye className="size-4" />
                      </Button>
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

      {viewingUserProgram && (
        <DynamicView
          data={viewingUserProgram}
          open={isViewOpen}
          onOpenChange={handleCloseView}
          title="User Program Details"
          tabs={[
            {
              id: "details",
              label: "Details",
              gridCols: 2,
              fields: [
                { 
                  name: "program_name", 
                  label: "Program Name", 
                  type: "text", 
                  render: (_value: any, data: any) =>
                    getLocalizedLabel(data.programs?.name_en, data.programs?.name_ar, language) || data.programs?.name || "-"
                },
                { name: "company_name", label: "Company Name", type: "text" },
                { name: "project_name", label: "Project Name", type: "text" },
                { name: "project_description", label: "Project Description", type: "text", colSpan: 12 },
                { name: "team_size", label: "Team Size", type: "text" },
                { name: "fund_needed", label: "Fund Needed", type: "text", render: (value: number | null) => value ? `$${value}` : "-" },
                { name: "why_applying", label: "Why Applying", type: "text", colSpan: 12 },
                { 
                  name: "status", 
                  label: "Status", 
                  type: "text", 
                  render: (value: number | null) => getStatusName(value) 
                },
                { name: "created_at", label: "Enrolled At", type: "datetime" },
                { name: "updated_at", label: "Updated At", type: "datetime" },
              ],
            },
            {
              id: "documents",
              label: "Documents",
              customContent: (data: any) => {
                const documents = getDocuments(data);
                if (documents.length === 0) {
                  return <p className="text-muted-foreground">No documents uploaded</p>;
                }
                return (
                  <div className="space-y-2">
                    {documents.map((doc) => {
                      // Construct file URL from file_url if available
                      const fileUrl = doc.file_url 
                        ? (doc.file_url.startsWith('http') || doc.file_url.startsWith('/api/public/file') 
                            ? doc.file_url 
                            : `/api/public/file?file_url=${encodeURIComponent(doc.file_url)}`)
                        : null;
                      
                      return (
                        <div key={doc.file_id} className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                          {fileUrl ? (
                            <>
                              <a 
                                href={fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm hover:underline text-primary flex-1"
                              >
                                {doc.name}
                              </a>
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-muted-foreground hover:text-primary"
                              >
                                Open
                              </a>
                            </>
                          ) : (
                            <span className="text-sm text-muted-foreground flex-1">
                              {doc.name}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              },
            },
          ]}
          maxWidth="4xl"
        />
      )}
    </Card>
  );
}
