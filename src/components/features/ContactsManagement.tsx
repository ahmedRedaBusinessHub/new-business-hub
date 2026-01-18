"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { Badge } from "@/components/ui/Badge";
import { Plus, Pencil, Trash2, Search, Eye } from "lucide-react";
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
import { ContactForm } from "./ContactForm";
import { ContactInteractionManagement } from "./ContactInteractionManagement";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import DynamicView, { type ViewTab } from "../shared/DynamicView";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

export interface Contact {
  id: number;
  user_id: number | null;
  contact_type: number | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  status: number;
  organization_id: number;
  created_at: string | null;
  updated_at: string | null;
}

export function ContactsManagement() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);
  const [deletingContactId, setDeletingContactId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page when search changes
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const isFetchingRef = useRef(false);
  const lastFetchParamsRef = useRef<string>("");

  const fetchContacts = useCallback(async () => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: pageSize.toString(),
      ...(debouncedSearch && { search: debouncedSearch }),
    });
    const paramsString = params.toString();

    // Prevent duplicate calls with same parameters
    if (isFetchingRef.current && lastFetchParamsRef.current === paramsString) {
      return;
    }

    isFetchingRef.current = true;
    lastFetchParamsRef.current = paramsString;

    try {
      setLoading(true);
      const response = await fetch(`/api/contacts?${paramsString}`);
      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }
      const data = await response.json();
      const contactsData = Array.isArray(data.data) ? data.data : [];
      setContacts(contactsData);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error: any) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to load contacts");
      setContacts([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleCreate = async (contactData: Omit<Contact, "id" | "created_at" | "updated_at">) => {
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create contact");
      }

      toast.success("Contact created successfully!");
      setIsFormOpen(false);
      fetchContacts();
    } catch (error: any) {
      toast.error(error.message || "Failed to create contact");
    }
  };

  const handleUpdate = async (contactData: Omit<Contact, "id" | "created_at" | "updated_at">) => {
    if (!editingContact) return;

    try {
      const response = await fetch(`/api/contacts/${editingContact.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update contact");
      }

      toast.success("Contact updated successfully!");
      setEditingContact(null);
      setIsFormOpen(false);
      fetchContacts();
    } catch (error: any) {
      toast.error(error.message || "Failed to update contact");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete contact");
      }

      toast.success("Contact deleted successfully!");
      setDeletingContactId(null);
      fetchContacts();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete contact");
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsFormOpen(true);
  };

  const handleView = (contact: Contact) => {
    setViewingContact(contact);
    setIsViewOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingContact(null);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewingContact(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h2>Contacts Management</h2>
          <p className="text-muted-foreground">
            Manage contacts with full CRUD operations
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add Contact
        </Button>
      </div>

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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading contacts...
                </TableCell>
              </TableRow>
            ) : contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No contacts found.
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name || "-"}</TableCell>
                  <TableCell>{contact.email || "-"}</TableCell>
                  <TableCell>{contact.phone || "-"}</TableCell>
                  <TableCell>{contact.contact_type || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={contact.status === 1 ? "default" : "secondary"}
                    >
                      {contact.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(contact)}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(contact)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingContactId(contact.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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

      <div className="text-sm text-muted-foreground">
        Showing {contacts.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
        {Math.min(currentPage * pageSize, total)} of {total} contacts
      </div>

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-4xl sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingContact ? "Edit Contact" : "Create New Contact"}
            </DialogTitle>
          </DialogHeader>
          <ContactForm
            contact={editingContact}
            onSubmit={editingContact ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {viewingContact && (
        <DynamicView
          data={viewingContact}
          open={isViewOpen}
          onOpenChange={handleCloseView}
          title="Contact Details"
          tabs={[
            {
              id: "details",
              label: "Details",
              gridCols: 2,
              fields: [
                { name: "name", label: "Name", type: "text" },
                { name: "email", label: "Email", type: "text" },
                { name: "phone", label: "Phone", type: "text" },
                { name: "contact_type", label: "Type", type: "text" },
                { name: "notes", label: "Notes", type: "text", colSpan: 12 },
              ],
            },
            {
              id: "interactions",
              label: "Interactions",
              customContent: <ContactInteractionManagement contactId={viewingContact.id} />,
            },
          ]}
          maxWidth="4xl"
        />
      )}

      <AlertDialog
        open={!!deletingContactId}
        onOpenChange={(open) => !open && setDeletingContactId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              contact and remove it from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingContactId && handleDelete(deletingContactId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

