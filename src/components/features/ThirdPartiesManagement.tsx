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
import { ThirdPartyForm } from "./ThirdPartyForm";
import { ThirdPartyServicesManagement } from "./ThirdPartyServicesManagement";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import DynamicView, { type ViewTab } from "../shared/DynamicView";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

export interface ThirdParty {
  id: number;
  name: string;
  namespace: string;
  website: string | null;
  image_id: number | null;
  status: number;
  order_no: number | null;
  organization_id: number;
  created_at: string | null;
  updated_at: string | null;
}

export function ThirdPartiesManagement() {
  const [thirdParties, setThirdParties] = useState<ThirdParty[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingThirdParty, setEditingThirdParty] = useState<ThirdParty | null>(null);
  const [viewingThirdParty, setViewingThirdParty] = useState<ThirdParty | null>(null);
  const [deletingThirdPartyId, setDeletingThirdPartyId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchThirdParties = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/third-parties");
      if (!response.ok) {
        throw new Error("Failed to fetch third parties");
      }
      const data = await response.json();
      setThirdParties(data.data || data);
    } catch (error: any) {
      console.error("Error fetching third parties:", error);
      toast.error("Failed to load third parties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThirdParties();
  }, []);

  const handleCreate = async (thirdPartyData: Omit<ThirdParty, "id" | "created_at" | "updated_at">) => {
    try {
      const response = await fetch("/api/third-parties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(thirdPartyData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create third party");
      }

      toast.success("Third party created successfully!");
      setIsFormOpen(false);
      fetchThirdParties();
    } catch (error: any) {
      toast.error(error.message || "Failed to create third party");
    }
  };

  const handleUpdate = async (thirdPartyData: Omit<ThirdParty, "id" | "created_at" | "updated_at">) => {
    if (!editingThirdParty) return;

    try {
      const response = await fetch(`/api/third-parties/${editingThirdParty.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(thirdPartyData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update third party");
      }

      toast.success("Third party updated successfully!");
      setEditingThirdParty(null);
      setIsFormOpen(false);
      fetchThirdParties();
    } catch (error: any) {
      toast.error(error.message || "Failed to update third party");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/third-parties/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete third party");
      }

      toast.success("Third party deleted successfully!");
      setDeletingThirdPartyId(null);
      fetchThirdParties();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete third party");
    }
  };

  const handleEdit = (thirdParty: ThirdParty) => {
    setEditingThirdParty(thirdParty);
    setIsFormOpen(true);
  };

  const handleView = (thirdParty: ThirdParty) => {
    setViewingThirdParty(thirdParty);
    setIsViewOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingThirdParty(null);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewingThirdParty(null);
  };

  const filteredThirdParties = thirdParties.filter(
    (tp) =>
      tp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tp.namespace?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tp.website?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h2>Third Parties Management</h2>
          <p className="text-muted-foreground">
            Manage third parties with services and logs
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add Third Party
        </Button>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search third parties..."
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
              <TableHead>Website</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading third parties...
                </TableCell>
              </TableRow>
            ) : filteredThirdParties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No third parties found.
                </TableCell>
              </TableRow>
            ) : (
              filteredThirdParties.map((tp) => (
                <TableRow key={tp.id}>
                  <TableCell className="font-medium">{tp.name}</TableCell>
                  <TableCell>{tp.namespace}</TableCell>
                  <TableCell>{tp.website || "-"}</TableCell>
                  <TableCell>{tp.order_no || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={tp.status === 1 ? "default" : "secondary"}
                    >
                      {tp.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(tp)}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(tp)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingThirdPartyId(tp.id)}
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
              {editingThirdParty ? "Edit Third Party" : "Create New Third Party"}
            </DialogTitle>
          </DialogHeader>
          <ThirdPartyForm
            thirdParty={editingThirdParty}
            onSubmit={editingThirdParty ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {viewingThirdParty && (
        <DynamicView
          data={viewingThirdParty}
          open={isViewOpen}
          onOpenChange={handleCloseView}
          title="Third Party Details"
          tabs={[
            {
              id: "details",
              label: "Details",
              gridCols: 2,
              fields: [
                { name: "name", label: "Name", type: "text" },
                { name: "namespace", label: "Namespace", type: "text" },
                { name: "website", label: "Website", type: "text" },
                { name: "order_no", label: "Order", type: "number" },
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
            {
              id: "services",
              label: "Services",
              customContent: <ThirdPartyServicesManagement thirdPartyId={viewingThirdParty.id} />,
            },
          ]}
          maxWidth="4xl"
        />
      )}

      <AlertDialog
        open={!!deletingThirdPartyId}
        onOpenChange={(open) => !open && setDeletingThirdPartyId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              third party and remove it from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingThirdPartyId && handleDelete(deletingThirdPartyId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

