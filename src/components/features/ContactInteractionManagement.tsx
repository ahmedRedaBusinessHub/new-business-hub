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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ContactInteractionForm } from "./ContactInteractionForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { toast } from "sonner";

export interface ContactInteraction {
  id: number;
  contact_id: number;
  type: number | null;
  subject: string | null;
  details: string | null;
  organization_id: number;
  created_at: string | null;
  updated_at: string | null;
}

interface ContactInteractionManagementProps {
  contactId: number;
}

export function ContactInteractionManagement({ contactId }: ContactInteractionManagementProps) {
  const [interactions, setInteractions] = useState<ContactInteraction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState<ContactInteraction | null>(null);
  const [deletingInteractionId, setDeletingInteractionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchInteractions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/contact-interaction?contact_id=${contactId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch interactions");
      }
      const data = await response.json();
      setInteractions(data.data || data);
    } catch (error: any) {
      console.error("Error fetching interactions:", error);
      toast.error("Failed to load interactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contactId) {
      fetchInteractions();
    }
  }, [contactId]);

  const handleCreate = async (interactionData: Omit<ContactInteraction, "id" | "created_at" | "updated_at"> & { files?: File[] }) => {
    try {
      const { files, ...payload } = interactionData;
      const response = await fetch("/api/contact-interaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...payload, contact_id: contactId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create interaction");
      }

      const responseData = await response.json();
      const interactionId = responseData.id || responseData.data?.id;

      // Upload files if provided
      if (files && Array.isArray(files) && files.length > 0 && interactionId) {
        await uploadInteractionFiles(interactionId, files);
      }

      toast.success("Interaction created successfully!");
      setIsFormOpen(false);
      fetchInteractions();
    } catch (error: any) {
      toast.error(error.message || "Failed to create interaction");
    }
  };

  const handleUpdate = async (interactionData: Omit<ContactInteraction, "id" | "created_at" | "updated_at"> & { files?: File[] }) => {
    if (!editingInteraction) return;

    try {
      const { files, ...payload } = interactionData;
      const response = await fetch(`/api/contact-interaction/${editingInteraction.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update interaction");
      }

      // Upload files if provided
      if (files && Array.isArray(files) && files.length > 0) {
        await uploadInteractionFiles(editingInteraction.id, files);
      }

      toast.success("Interaction updated successfully!");
      setEditingInteraction(null);
      setIsFormOpen(false);
      fetchInteractions();
    } catch (error: any) {
      toast.error(error.message || "Failed to update interaction");
    }
  };

  const uploadInteractionFiles = async (interactionId: number, files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("refColumn", "file_ids");

      const response = await fetch(`/api/contact-interaction/${interactionId}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload files");
      }
    } catch (error: any) {
      console.error("Error uploading files:", error);
      toast.error("Failed to upload files");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/contact-interaction/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete interaction");
      }

      toast.success("Interaction deleted successfully!");
      setDeletingInteractionId(null);
      fetchInteractions();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete interaction");
    }
  };

  const handleEdit = (interaction: ContactInteraction) => {
    setEditingInteraction(interaction);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingInteraction(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3>Contact Interactions</h3>
          <p className="text-sm text-muted-foreground">
            Manage interactions for this contact
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} size="sm">
          <Plus className="mr-2 size-4" />
          Add Interaction
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading interactions...
                </TableCell>
              </TableRow>
            ) : interactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No interactions found.
                </TableCell>
              </TableRow>
            ) : (
              interactions.map((interaction) => (
                <TableRow key={interaction.id}>
                  <TableCell>{interaction.type || "-"}</TableCell>
                  <TableCell>{interaction.subject || "-"}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {interaction.details || "-"}
                  </TableCell>
                  <TableCell>
                    {interaction.created_at 
                      ? new Date(interaction.created_at).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(interaction)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingInteractionId(interaction.id)}
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
              {editingInteraction ? "Edit Interaction" : "Create New Interaction"}
            </DialogTitle>
          </DialogHeader>
          <ContactInteractionForm
            interaction={editingInteraction}
            contactId={contactId}
            onSubmit={editingInteraction ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingInteractionId}
        onOpenChange={(open) => !open && setDeletingInteractionId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              interaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingInteractionId && handleDelete(deletingInteractionId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

