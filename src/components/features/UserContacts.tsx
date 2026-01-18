"use client";
import { useState, useEffect, useCallback } from "react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
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

interface UserContactsProps {
  userId: number;
}

export function UserContacts({ userId }: UserContactsProps) {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchContacts = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
      });

      const response = await fetch(`/api/contacts/user/${userId}?${params.toString()}`).catch(() => null);
      if (response?.ok) {
        const data = await response.json();
        setContacts(Array.isArray(data.data) ? data.data : []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 0);
      } else {
        setContacts([]);
        setTotal(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setContacts([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [userId, currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  if (loading) {
    return <div className="p-4 text-center">Loading contacts...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacts ({total})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search contacts..."
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
        {contacts.length === 0 && !loading ? (
          <p className="text-sm text-muted-foreground">No contacts</p>
        ) : (
          <>
            <div className="space-y-4">
              {contacts.map((contact: any) => (
                <ContactWithInteractions key={contact.id} contact={contact} />
              ))}
            </div>
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

// Component to display contact with its interactions
function ContactWithInteractions({ contact }: { contact: any }) {
  const [interactions, setInteractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/contact-interaction?contact_id=${contact.id}`);
        if (response.ok) {
          const data = await response.json();
          setInteractions(Array.isArray(data.data) ? data.data : []);
        }
      } catch (error) {
        console.error("Error fetching contact interactions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (contact.id) {
      fetchInteractions();
    }
  }, [contact.id]);

  return (
    <Accordion type="single" collapsible className="border rounded-lg">
      <AccordionItem value={`contact-${contact.id}`}>
        <AccordionTrigger className="px-4">
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="font-medium">{contact.name || "-"}</p>
                <p className="text-sm text-muted-foreground">
                  {contact.email || contact.phone || "No contact info"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={contact.status === 1 ? "default" : "secondary"}>
                {contact.status === 1 ? "Active" : "Inactive"}
              </Badge>
              {interactions.length > 0 && (
                <Badge variant="outline">{interactions.length} interactions</Badge>
              )}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Type: </span>
                {contact.contact_type || "-"}
              </div>
              <div>
                <span className="font-medium">Phone: </span>
                {contact.phone || "-"}
              </div>
              {contact.notes && (
                <div className="col-span-2">
                  <span className="font-medium">Notes: </span>
                  {contact.notes}
                </div>
              )}
            </div>
            {interactions.length > 0 && (
              <div className="mt-4">
                <p className="font-medium text-sm mb-2">Interactions:</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {interactions.map((interaction: any) => (
                      <TableRow key={interaction.id}>
                        <TableCell>{interaction.interaction_type || "-"}</TableCell>
                        <TableCell>{interaction.notes || "-"}</TableCell>
                        <TableCell>
                          {interaction.created_at
                            ? new Date(interaction.created_at).toLocaleDateString()
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            {!loading && interactions.length === 0 && (
              <p className="text-sm text-muted-foreground">No interactions</p>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
