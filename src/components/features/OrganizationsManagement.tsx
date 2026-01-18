"use client";
import { useState, useEffect } from "react";
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
import { OrganizationForm } from "./OrganizationForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import DynamicView, { type ViewTab } from "../shared/DynamicView";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

export interface Organization {
  id: number;
  name: string;
  namespace: string;
  email: string | null;
  country_code: string | null;
  mobile: string | null;
  category_id: number | null;
  image_id: number | null;
  status: number;
  organization_id: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export function OrganizationsManagement() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [viewingOrganization, setViewingOrganization] = useState<Organization | null>(null);
  const [deletingOrganizationId, setDeletingOrganizationId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/organizations");
      if (!response.ok) {
        throw new Error("Failed to fetch organizations");
      }
      const data = await response.json();
      setOrganizations(data.data || data);
    } catch (error: any) {
      console.error("Error fetching organizations:", error);
      toast.error("Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleCreate = async (organizationData: Omit<Organization, "id" | "created_at" | "updated_at">) => {
    try {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(organizationData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create organization");
      }

      toast.success("Organization created successfully!");
      setIsFormOpen(false);
      fetchOrganizations();
    } catch (error: any) {
      toast.error(error.message || "Failed to create organization");
    }
  };

  const handleUpdate = async (organizationData: Omit<Organization, "id" | "created_at" | "updated_at">) => {
    if (!editingOrganization) return;

    try {
      const response = await fetch(`/api/organizations/${editingOrganization.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(organizationData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update organization");
      }

      toast.success("Organization updated successfully!");
      setEditingOrganization(null);
      setIsFormOpen(false);
      fetchOrganizations();
    } catch (error: any) {
      toast.error(error.message || "Failed to update organization");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/organizations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete organization");
      }

      toast.success("Organization deleted successfully!");
      setDeletingOrganizationId(null);
      fetchOrganizations();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete organization");
    }
  };

  const handleEdit = (organization: Organization) => {
    setEditingOrganization(organization);
    setIsFormOpen(true);
  };

  const handleView = (organization: Organization) => {
    setViewingOrganization(organization);
    setIsViewOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingOrganization(null);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewingOrganization(null);
  };

  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.namespace?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h2>Organizations Management</h2>
          <p className="text-muted-foreground">
            Manage organizations with full CRUD operations
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add Organization
        </Button>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search organizations..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Namespace</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading organizations...
                </TableCell>
              </TableRow>
            ) : filteredOrganizations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No organizations found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrganizations.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell>{org.namespace}</TableCell>
                  <TableCell>{org.email || "-"}</TableCell>
                  <TableCell>{org.mobile || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={org.status === 1 ? "default" : "secondary"}
                    >
                      {org.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(org)}
                        title="View organization details"
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(org)}
                        title="Edit organization"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingOrganizationId(org.id)}
                        title="Delete organization"
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

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-4xl sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingOrganization ? "Edit Organization" : "Create New Organization"}
            </DialogTitle>
          </DialogHeader>
          <OrganizationForm
            organization={editingOrganization}
            onSubmit={editingOrganization ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {viewingOrganization && (
        <DynamicView
          data={viewingOrganization}
          open={isViewOpen}
          onOpenChange={handleCloseView}
          title="Organization Details"
          tabs={[
            {
              id: "details",
              label: "Details",
              gridCols: 2,
              fields: [
                { name: "name", label: "Name", type: "text" },
                { name: "namespace", label: "Namespace", type: "text" },
                { name: "email", label: "Email", type: "text" },
                {
                  name: "mobile",
                  label: "Mobile",
                  type: "text",
                  format: (value: string | null, data: Organization) =>
                    data.country_code && value ? `${data.country_code} ${value}` : value || "-",
                },
                { name: "country_code", label: "Country Code", type: "text" },
                { name: "category_id", label: "Category ID", type: "number" },
                { name: "image_id", label: "Image ID", type: "number" },
                { name: "organization_id", label: "Organization ID", type: "number" },
                {
                  name: "status",
                  label: "Status",
                  type: "badge",
                  badgeMap: {
                    1: { label: "Active", variant: "default" },
                    0: { label: "Inactive", variant: "secondary" },
                  },
                },
                { name: "created_at", label: "Created At", type: "datetime" },
                { name: "updated_at", label: "Updated At", type: "datetime" },
              ],
            },
          ]}
          maxWidth="4xl"
        />
      )}

      <AlertDialog
        open={!!deletingOrganizationId}
        onOpenChange={(open) => !open && setDeletingOrganizationId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              organization and remove it from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingOrganizationId && handleDelete(deletingOrganizationId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

