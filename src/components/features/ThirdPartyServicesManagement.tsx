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
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { ThirdPartyServiceForm } from "./ThirdPartyServiceForm";
import { ThirdPartyLogsManagement } from "./ThirdPartyLogsManagement";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import DynamicView, { type ViewTab } from "../shared/DynamicView";
import { toast } from "sonner";
import { useI18n } from "@/hooks/useI18n";

export interface ThirdPartyService {
  id: number;
  third_party_id: number;
  name: string;
  namespace: string;
  service_url: string | null;
  config: any;
  status: number;
  order_no: number | null;
  organization_id: number;
  image_url?: string | null; // Image URL from API response
  created_at: string | null;
  updated_at: string | null;
}

interface ThirdPartyServicesManagementProps {
  thirdPartyId: number;
}

export function ThirdPartyServicesManagement({ thirdPartyId }: ThirdPartyServicesManagementProps) {
  const [services, setServices] = useState<ThirdPartyService[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingService, setEditingService] = useState<ThirdPartyService | null>(null);
  const [viewingService, setViewingService] = useState<ThirdPartyService | null>(null);
  const [deletingServiceId, setDeletingServiceId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/third-party-services?third_party_id=${thirdPartyId}`);
      if (!response.ok) {
        throw new Error(t("entities.thirdPartyServices.failedToLoad"));
      }
      const data = await response.json();
      setServices(data.data || data);
    } catch (error: any) {
      console.error("Error fetching services:", error);
      toast.error(t("entities.thirdPartyServices.failedToLoad"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (thirdPartyId) {
      fetchServices();
    }
  }, [thirdPartyId]);

  const handleCreate = async (serviceData: Omit<ThirdPartyService, "id" | "created_at" | "updated_at" | "config" | "image_url"> & { profileImage?: File[] }) => {
    try {
      const { profileImage, ...payload } = serviceData;
      const response = await fetch("/api/third-party-services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...payload, third_party_id: thirdPartyId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create service");
      }

      const responseData = await response.json();
      const serviceId = responseData.id || responseData.data?.id;

      // Upload image if provided
      if (profileImage && Array.isArray(profileImage) && profileImage.length > 0 && serviceId) {
        const imageFile = profileImage[0];
        if (imageFile instanceof File) {
          await uploadThirdPartyServiceImage(serviceId, imageFile);
        }
      }

      toast.success("Service created successfully!");
      setIsFormOpen(false);
      fetchServices();
    } catch (error: any) {
      toast.error(error.message || "Failed to create service");
    }
  };

  const handleUpdate = async (serviceData: Omit<ThirdPartyService, "id" | "created_at" | "updated_at" | "config" | "image_url"> & { profileImage?: File[] }) => {
    if (!editingService) return;

    try {
      const { profileImage, ...payload } = serviceData;
      const response = await fetch(`/api/third-party-services/${editingService.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update service");
      }

      // Upload image if provided
      if (profileImage && Array.isArray(profileImage) && profileImage.length > 0) {
        const imageFile = profileImage[0];
        if (imageFile instanceof File) {
          await uploadThirdPartyServiceImage(editingService.id, imageFile);
        }
      }

      toast.success("Service updated successfully!");
      setEditingService(null);
      setIsFormOpen(false);
      fetchServices();
    } catch (error: any) {
      toast.error(error.message || "Failed to update service");
    }
  };

  const uploadThirdPartyServiceImage = async (serviceId: number, imageFile: File) => {
    try {
      const formData = new FormData();
      formData.append("files", imageFile);
      formData.append("refColumn", "image_id");

      const response = await fetch(`/api/third-party-services/${serviceId}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/third-party-services/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete service");
      }

      toast.success("Service deleted successfully!");
      setDeletingServiceId(null);
      fetchServices();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete service");
    }
  };

  const handleEdit = (service: ThirdPartyService) => {
    setEditingService(service);
    setIsFormOpen(true);
  };

  const handleView = (service: ThirdPartyService) => {
    setViewingService(service);
    setIsViewOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingService(null);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewingService(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3>Third Party Services</h3>
          <p className="text-sm text-muted-foreground">
            Manage services for this third party
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} size="sm">
          <Plus className="mr-2 size-4" />
          Add Service
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Namespace</TableHead>
              <TableHead>Service URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading services...
                </TableCell>
              </TableRow>
            ) : services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No services found.
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.namespace}</TableCell>
                  <TableCell>{service.service_url || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={service.status === 1 ? "default" : "secondary"}
                    >
                      {service.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(service)}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(service)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingServiceId(service.id)}
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
              {editingService ? "Edit Service" : "Create New Service"}
            </DialogTitle>
          </DialogHeader>
          <ThirdPartyServiceForm
            service={editingService}
            thirdPartyId={thirdPartyId}
            onSubmit={editingService ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {viewingService && (
        <DynamicView
          data={viewingService}
          open={isViewOpen}
          onOpenChange={handleCloseView}
          title="Service Details"
          header={{
            type: "avatar",
            title: (data: ThirdPartyService) => data.name || "Service",
            subtitle: (data: ThirdPartyService) => data.service_url || data.namespace || "",
            imageIdField: "image_id",
            avatarFallback: (data: ThirdPartyService) => 
              data.name?.[0] || "S",
            badges: [
              {
                field: "status",
                map: {
                  1: { label: "Active", variant: "default" },
                  0: { label: "Inactive", variant: "secondary" },
                },
              },
            ],
          }}
          tabs={[
            {
              id: "details",
              label: "Details",
              gridCols: 2,
              fields: [
                { name: "name", label: "Name", type: "text" },
                { name: "namespace", label: "Namespace", type: "text" },
                { name: "service_url", label: "Service URL", type: "text" },
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
              id: "logs",
              label: "Logs",
              customContent: <ThirdPartyLogsManagement serviceId={viewingService.id} />,
            },
          ]}
          maxWidth="4xl"
        />
      )}

      <AlertDialog
        open={!!deletingServiceId}
        onOpenChange={(open) => !open && setDeletingServiceId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the service.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingServiceId && handleDelete(deletingServiceId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

