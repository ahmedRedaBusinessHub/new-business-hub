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
import { NewsletterSubscriptionForm } from "./NewsletterSubscriptionForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import DynamicView, { type ViewTab } from "../shared/DynamicView";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

export interface NewsletterSubscription {
  id: number;
  email: string;
  name: string | null;
  status: number;
  organization_id: number;
  created_at: string | null;
  updated_at: string | null;
}

export function NewsletterSubscriptionsManagement() {
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<NewsletterSubscription | null>(null);
  const [viewingSubscription, setViewingSubscription] = useState<NewsletterSubscription | null>(null);
  const [deletingSubscriptionId, setDeletingSubscriptionId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/newsletter-subscriptions");
      if (!response.ok) {
        throw new Error("Failed to fetch subscriptions");
      }
      const data = await response.json();
      setSubscriptions(data.data || data);
    } catch (error: any) {
      console.error("Error fetching subscriptions:", error);
      toast.error("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleCreate = async (subscriptionData: Omit<NewsletterSubscription, "id" | "created_at" | "updated_at">) => {
    try {
      const response = await fetch("/api/newsletter-subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscriptionData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create subscription");
      }

      toast.success("Subscription created successfully!");
      setIsFormOpen(false);
      fetchSubscriptions();
    } catch (error: any) {
      toast.error(error.message || "Failed to create subscription");
    }
  };

  const handleUpdate = async (subscriptionData: Omit<NewsletterSubscription, "id" | "created_at" | "updated_at">) => {
    if (!editingSubscription) return;

    try {
      const response = await fetch(`/api/newsletter-subscriptions/${editingSubscription.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscriptionData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update subscription");
      }

      toast.success("Subscription updated successfully!");
      setEditingSubscription(null);
      setIsFormOpen(false);
      fetchSubscriptions();
    } catch (error: any) {
      toast.error(error.message || "Failed to update subscription");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/newsletter-subscriptions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete subscription");
      }

      toast.success("Subscription deleted successfully!");
      setDeletingSubscriptionId(null);
      fetchSubscriptions();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete subscription");
    }
  };

  const handleEdit = (subscription: NewsletterSubscription) => {
    setEditingSubscription(subscription);
    setIsFormOpen(true);
  };

  const handleView = (subscription: NewsletterSubscription) => {
    setViewingSubscription(subscription);
    setIsViewOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSubscription(null);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewingSubscription(null);
  };

  const filteredSubscriptions = subscriptions.filter(
    (sub) =>
      sub.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h2>Newsletter Subscriptions Management</h2>
          <p className="text-muted-foreground">
            Manage newsletter subscriptions with full CRUD operations
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add Subscription
        </Button>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search subscriptions..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Loading subscriptions...
                </TableCell>
              </TableRow>
            ) : filteredSubscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No subscriptions found.
                </TableCell>
              </TableRow>
            ) : (
              filteredSubscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.email}</TableCell>
                  <TableCell>{sub.name || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={sub.status === 1 ? "default" : "secondary"}
                    >
                      {sub.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(sub)}
                        title="View subscription details"
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(sub)}
                        title="Edit subscription"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingSubscriptionId(sub.id)}
                        title="Delete subscription"
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
              {editingSubscription ? "Edit Subscription" : "Create New Subscription"}
            </DialogTitle>
          </DialogHeader>
          <NewsletterSubscriptionForm
            subscription={editingSubscription}
            onSubmit={editingSubscription ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {viewingSubscription && (
        <DynamicView
          data={viewingSubscription}
          open={isViewOpen}
          onOpenChange={handleCloseView}
          title="Newsletter Subscription Details"
          tabs={[
            {
              id: "details",
              label: "Details",
              gridCols: 2,
              fields: [
                { name: "email", label: "Email", type: "text" },
                { name: "name", label: "Name", type: "text" },
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
        open={!!deletingSubscriptionId}
        onOpenChange={(open) => !open && setDeletingSubscriptionId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the subscription.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingSubscriptionId && handleDelete(deletingSubscriptionId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

