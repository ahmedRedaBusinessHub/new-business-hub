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
import { ProgramForm } from "./ProgramForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import DynamicView, { type ViewTab } from "../shared/DynamicView";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

export interface Program {
  id: number;
  name_ar: string;
  name_en: string | null;
  detail_ar: string | null;
  detail_en: string | null;
  document_ar_id: number | null;
  document_en_id: number | null;
  from_datetime: string | null;
  to_datetime: string | null;
  last_registration_date: string | null;
  type: number | null;
  subtype: number | null;
  values: any;
  progress_steps: any;
  application_requirements: any;
  documents_requirements: any;
  status: number;
  organization_id: number;
  created_at: string | null;
  updated_at: string | null;
}

export function ProgramsManagement() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [viewingProgram, setViewingProgram] = useState<Program | null>(null);
  const [deletingProgramId, setDeletingProgramId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/programs");
      if (!response.ok) {
        throw new Error("Failed to fetch programs");
      }
      const data = await response.json();
      setPrograms(data.data || data);
    } catch (error: any) {
      console.error("Error fetching programs:", error);
      toast.error("Failed to load programs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleCreate = async (programData: Omit<Program, "id" | "created_at" | "updated_at">) => {
    try {
      const response = await fetch("/api/programs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(programData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create program");
      }

      toast.success("Program created successfully!");
      setIsFormOpen(false);
      fetchPrograms();
    } catch (error: any) {
      toast.error(error.message || "Failed to create program");
    }
  };

  const handleUpdate = async (programData: Omit<Program, "id" | "created_at" | "updated_at">) => {
    if (!editingProgram) return;

    try {
      const response = await fetch(`/api/programs/${editingProgram.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(programData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update program");
      }

      toast.success("Program updated successfully!");
      setEditingProgram(null);
      setIsFormOpen(false);
      fetchPrograms();
    } catch (error: any) {
      toast.error(error.message || "Failed to update program");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/programs/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete program");
      }

      toast.success("Program deleted successfully!");
      setDeletingProgramId(null);
      fetchPrograms();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete program");
    }
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setIsFormOpen(true);
  };

  const handleView = (program: Program) => {
    setViewingProgram(program);
    setIsViewOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProgram(null);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewingProgram(null);
  };

  const filteredPrograms = programs.filter(
    (program) =>
      program.name_ar?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.name_en?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h2>Programs Management</h2>
          <p className="text-muted-foreground">
            Manage programs with full CRUD operations
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add Program
        </Button>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search programs..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name (AR)</TableHead>
              <TableHead>Name (EN)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Loading programs...
                </TableCell>
              </TableRow>
            ) : filteredPrograms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No programs found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPrograms.map((program) => (
                <TableRow key={program.id}>
                  <TableCell className="font-medium">{program.name_ar}</TableCell>
                  <TableCell>{program.name_en || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={program.status === 1 ? "default" : "secondary"}
                    >
                      {program.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(program)}
                        title="View program details"
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(program)}
                        title="Edit program"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingProgramId(program.id)}
                        title="Delete program"
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
              {editingProgram ? "Edit Program" : "Create New Program"}
            </DialogTitle>
          </DialogHeader>
          <ProgramForm
            program={editingProgram}
            onSubmit={editingProgram ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {viewingProgram && (
        <DynamicView
          data={viewingProgram}
          open={isViewOpen}
          onOpenChange={handleCloseView}
          title="Program Details"
          tabs={[
            {
              id: "details",
              label: "Details",
              gridCols: 2,
              fields: [
                { name: "name_ar", label: "Name (AR)", type: "text", colSpan: 12 },
                { name: "name_en", label: "Name (EN)", type: "text", colSpan: 12 },
                { name: "detail_ar", label: "Detail (AR)", type: "text", colSpan: 12 },
                { name: "detail_en", label: "Detail (EN)", type: "text", colSpan: 12 },
                { name: "type", label: "Type", type: "number" },
                { name: "subtype", label: "Subtype", type: "number" },
                { name: "document_ar_id", label: "Document AR ID", type: "number" },
                { name: "document_en_id", label: "Document EN ID", type: "number" },
                { name: "from_datetime", label: "From Date", type: "datetime" },
                { name: "to_datetime", label: "To Date", type: "datetime" },
                { name: "last_registration_date", label: "Last Registration Date", type: "datetime" },
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
        open={!!deletingProgramId}
        onOpenChange={(open) => !open && setDeletingProgramId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the program.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingProgramId && handleDelete(deletingProgramId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

