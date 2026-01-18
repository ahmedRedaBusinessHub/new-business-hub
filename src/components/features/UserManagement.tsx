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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Plus, Pencil, Trash2, Search, Eye } from "lucide-react";
import { UserForm } from "./UserForm";
import DynamicView, { type ViewHeader, type ViewTab } from "../shared/DynamicView";
import { UserRoles } from "./UserRoles";
import { UserAccessTokens } from "./UserAccessTokens";
import { UserPrograms } from "./UserPrograms";
import { UserContacts } from "./UserContacts";
import { UserResetPasswordTokens } from "./UserResetPasswordTokens";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

export interface User {
  id: number;
  username: string;
  email: string;
  country_code: string;
  mobile: string;
  first_name: string;
  last_name: string | null;
  dob: string | null;
  gender: number | null;
  national_id: string | null;
  image_id: number | null;
  status: number;
  organization_id: number | null;
  email_verified_at: string | null;
  sms_verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Component to fetch and display user avatar image
function UserAvatarImage({ userId }: { userId: number }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (response.ok) {
          const responseData = await response.json();
          const userData = responseData.data || responseData;
          const fileUrl = userData.image || userData.image_url || null;
          
          if (fileUrl) {
            setImageUrl(`/api/public/file?file_url=${encodeURIComponent(fileUrl)}`);
          }
        }
      } catch (error) {
        console.error(`Error fetching image for user ${userId}:`, error);
      }
    };
    
    fetchImage();
  }, [userId]);

  if (!imageUrl) return null;
  
  return <AvatarImage src={imageUrl} alt="User avatar" />;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      const usersData = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
      setUsers(usersData);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (userData: Omit<User, "id" | "created_at" | "updated_at" | "organization_id" | "email_verified_at" | "sms_verified_at"> & { password?: string; profileImage?: File[] }) => {
    try {
      const { profileImage, ...userPayload } = userData;
      
      // Convert date to ISO DateTime format for Prisma
      const createPayload: any = { ...userPayload };
      if (createPayload.dob && typeof createPayload.dob === "string") {
        if (!createPayload.dob.includes("T")) {
          // Convert date string (YYYY-MM-DD) to ISO DateTime
          createPayload.dob = new Date(createPayload.dob + "T00:00:00.000Z").toISOString();
        }
      }
      
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createPayload),
      });

      if (!response.ok) {
        let errorMessage = "Failed to create user";
        let fieldErrors: Record<string, string> = {};
        
        try {
          const error = await response.json();
          // Handle error object structure: {statusCode: 400, message: "..."}
          errorMessage = error.message || error.error || errorMessage;
          
          // Parse error message (handle both English and Arabic messages)
          if (error.message && typeof error.message === "string") {
            const errorMsg = error.message;
            const errorMsgLower = errorMsg.toLowerCase();
            
            // Check for unique constraint on email
            if (errorMsgLower.includes("unique constraint failed on the fields: (`email`)") || 
                (errorMsgLower.includes("email") && errorMsgLower.includes("unique")) ||
                errorMsg.includes("البريد الإلكتروني") || 
                errorMsg.includes("البريد الإلكتروني مستخدم")) {
              fieldErrors.email = "This email is already registered. Please use a different email.";
              errorMessage = "Email already exists";
            }
            // Check for unique constraint on mobile (handle Arabic: "رقم الجوال مستخدم بالفعل")
            // This handles the exact error: {statusCode: 400, message: "رقم الجوال مستخدم بالفعل"}
            if (errorMsgLower.includes("unique constraint failed on the fields: (`mobile`)") ||
                (errorMsgLower.includes("mobile") && errorMsgLower.includes("unique")) ||
                errorMsg.includes("رقم الجوال") || 
                errorMsg.includes("رقم الجوال مستخدم بالفعل")) {
              fieldErrors.mobile = "This mobile number is already registered. Please use a different mobile number.";
              errorMessage = "Mobile number already exists";
            }
            // Check for unique constraint on username
            if (errorMsgLower.includes("unique constraint failed on the fields: (`username`)") ||
                (errorMsgLower.includes("username") && errorMsgLower.includes("unique")) ||
                errorMsg.includes("اسم المستخدم") ||
                errorMsg.includes("اسم المستخدم مستخدم")) {
              fieldErrors.username = "This username is already taken. Please choose a different username.";
              errorMessage = "Username already exists";
            }
          }
        } catch (e) {
          // If response is not JSON, try to get text
          try {
            const text = await response.text();
            errorMessage = text || errorMessage;
          } catch (textError) {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
        }
        
        // Create error with field information
        const error = new Error(errorMessage) as any;
        error.fieldErrors = fieldErrors;
        // Ensure error is thrown to prevent modal from closing
        throw error;
      }

      const createdUser = await response.json();
      const userId = createdUser.id || createdUser.data?.id;

      // Upload image if provided
      if (profileImage && Array.isArray(profileImage) && profileImage.length > 0 && userId) {
        const imageFile = profileImage[0];
        if (imageFile instanceof File) {
          await uploadUserImage(userId, imageFile);
        }
      }

      toast.success("User created successfully!");
      setIsFormOpen(false);
      fetchUsers();
    } catch (error: any) {
      // If there are field-specific errors, they will be shown in the form
      // Only show toast if there are no field-specific errors
      if (!error.fieldErrors || Object.keys(error.fieldErrors).length === 0) {
        toast.error(error.message || "Failed to create user");
      }
      // IMPORTANT: Re-throw error to let DynamicForm handle it
      // This ensures:
      // - onError is called (not onSuccess)
      // - Form is NOT reset
      // - Modal stays open
      // - Form data is preserved
      throw error;
    }
  };

  const handleUpdate = async (userData: Omit<User, "id" | "created_at" | "updated_at" | "organization_id" | "email_verified_at" | "sms_verified_at"> & { password?: string; profileImage?: File[] }) => {
    if (!editingUser) return;

    try {
      const { profileImage, password, ...userPayload } = userData;
      
      // Clean up payload: remove empty strings, keep nulls for optional fields
      const updatePayload: any = {};
      Object.keys(userPayload).forEach((key) => {
        const value = userPayload[key as keyof typeof userPayload];
        // Keep null values, but skip empty strings (convert to null)
        if (value === "" || value === undefined) {
          updatePayload[key] = null;
        } else if (key === "dob" && value) {
          // Convert date to ISO DateTime format for Prisma
          // Handle both date strings (YYYY-MM-DD) and DateTime strings
          if (typeof value === "string") {
            if (value.includes("T")) {
              // Already a DateTime string
              updatePayload[key] = value;
            } else {
              // Convert date string to ISO DateTime
              updatePayload[key] = new Date(value + "T00:00:00.000Z").toISOString();
            }
          } else {
            updatePayload[key] = value;
          }
        } else {
          updatePayload[key] = value;
        }
      });
      
      // Only include password if provided and not empty
      if (password && password.trim() !== "") {
        updatePayload.password = password;
      }

      console.log("Updating user with payload:", updatePayload);

      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        let errorMessage = "Failed to update user";
        let fieldErrors: Record<string, string> = {};
        const contentType = response.headers.get("content-type");
        
        try {
          if (contentType && contentType.includes("application/json")) {
            const error = await response.json();
            errorMessage = error.message || error.error || JSON.stringify(error) || errorMessage;
            
            // Parse Prisma unique constraint errors (handle both English and Arabic messages)
            if (error.message && typeof error.message === "string") {
              const errorMsg = error.message.toLowerCase();
              
              // Check for unique constraint on email
              if (errorMsg.includes("unique constraint failed on the fields: (`email`)") || 
                  (errorMsg.includes("email") && errorMsg.includes("unique")) ||
                  errorMsg.includes("البريد الإلكتروني") || errorMsg.includes("email")) {
                fieldErrors.email = "This email is already registered. Please use a different email.";
                errorMessage = "Email already exists";
              }
              // Check for unique constraint on mobile (handle Arabic: "رقم الجوال مستخدم بالفعل")
              if (errorMsg.includes("unique constraint failed on the fields: (`mobile`)") ||
                  (errorMsg.includes("mobile") && errorMsg.includes("unique")) ||
                  errorMsg.includes("رقم الجوال") || errorMsg.includes("mobile")) {
                fieldErrors.mobile = "This mobile number is already registered. Please use a different mobile number.";
                errorMessage = "Mobile number already exists";
              }
              // Check for unique constraint on username
              if (errorMsg.includes("unique constraint failed on the fields: (`username`)") ||
                  (errorMsg.includes("username") && errorMsg.includes("unique")) ||
                  errorMsg.includes("اسم المستخدم")) {
                fieldErrors.username = "This username is already taken. Please choose a different username.";
                errorMessage = "Username already exists";
              }
            }
          } else {
            const text = await response.text();
            errorMessage = text || errorMessage;
          }
        } catch (e) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        console.error("Update error details:", {
          status: response.status,
          statusText: response.statusText,
          payload: updatePayload,
          errorMessage,
        });
        
        // Create error with field information
        const error = new Error(errorMessage) as any;
        error.fieldErrors = fieldErrors;
        throw error;
      }

      // Upload image if provided
      if (profileImage && Array.isArray(profileImage) && profileImage.length > 0) {
        const imageFile = profileImage[0];
        if (imageFile instanceof File) {
          await uploadUserImage(editingUser.id, imageFile);
        }
      }

      toast.success("User updated successfully!");
      setEditingUser(null);
      setIsFormOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error("Update error:", error);
      // If there are field-specific errors, they will be shown in the form
      // Only show toast if there are no field-specific errors
      if (!error.fieldErrors || Object.keys(error.fieldErrors).length === 0) {
        toast.error(error.message || "Failed to update user");
      }
      // Re-throw to let DynamicForm handle field errors
      throw error;
    }
  };

  const uploadUserImage = async (userId: number, imageFile: File) => {
    try {
      const formData = new FormData();
      formData.append("files", imageFile);
      formData.append("refColumn", "image_id");

      const response = await fetch(`/api/users/${userId}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload image");
      }

      return await response.json();
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error("User updated but image upload failed");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete user");
      }

      toast.success("User deleted successfully!");
      setDeletingUserId(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const handleView = (user: User) => {
    setViewingUser(user);
    setIsViewOpen(true);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewingUser(null);
  };

  const fetchUserImage = async (data: User): Promise<string | null> => {
    if (!data?.image_id) return null;
    
    try {
      const response = await fetch(`/api/users/${data.id}`);
      if (response.ok) {
        const responseData = await response.json();
        const userData = responseData.data || responseData;
        const fileUrl = userData.image || userData.image_url || null;
        
        // If we have a file_url, use the /api/public/file endpoint
        if (fileUrl) {
          return `/api/public/file?file_url=${encodeURIComponent(fileUrl)}`;
        }
      }
    } catch (error) {
      console.error("Error fetching user image:", error);
    }
    return null;
  };

  const viewHeader: ViewHeader = {
    type: "avatar",
    title: (data: User) => `${data.first_name} ${data.last_name || ""}`,
    subtitle: (data: User) => data.email,
    imageIdField: "image_id",
    fetchImageUrl: fetchUserImage,
    avatarFallback: (data: User) => 
      `${data.first_name?.[0] || ""}${data.last_name?.[0] || ""}`,
    badges: [
      {
        field: "status",
        variant: "default",
        map: {
          1: { label: "Active", variant: "default" },
          0: { label: "Inactive", variant: "secondary" },
        },
      },
    ],
  };

  const viewTabs: ViewTab[] = [
    {
      id: "details",
      label: "Details",
      gridCols: 2,
      fields: [
        { name: "username", label: "Username", type: "text" },
        { name: "first_name", label: "First Name", type: "text" },
        { name: "last_name", label: "Last Name", type: "text" },
        { name: "email", label: "Email", type: "text" },
        {
          name: "mobile",
          label: "Mobile Number",
          type: "text",
          format: (value: string, data: User) =>
            data.country_code && value ? `${data.country_code} ${value}` : value || "-",
        },
        { name: "dob", label: "Date of Birth", type: "date" },
        {
          name: "gender",
          label: "Gender",
          type: "text",
          format: (value: number | null) => {
            if (value === null || value === undefined) return "-";
            switch (value) {
              case 0: return "Male";
              case 1: return "Female";
              case 2: return "Other";
              default: return "-";
            }
          },
        },
        { name: "national_id", label: "National ID", type: "text" },
        {
          name: "status",
          label: "Status",
          type: "badge",
          badgeMap: {
            1: { label: "Active", variant: "default" },
            0: { label: "Inactive", variant: "secondary" },
          },
        },
        { name: "email_verified_at", label: "Email Verified At", type: "datetime" },
        { name: "sms_verified_at", label: "SMS Verified At", type: "datetime" },
        { name: "created_at", label: "Created At", type: "datetime" },
      ],
    },
    {
      id: "programs",
      label: "Programs",
      customContent: viewingUser ? <UserPrograms userId={viewingUser.id} /> : null,
    },
    {
      id: "roles",
      label: "User Roles",
      customContent: viewingUser ? <UserRoles userId={viewingUser.id} /> : null,
    },
    {
      id: "contacts",
      label: "Contacts",
      customContent: viewingUser ? <UserContacts userId={viewingUser.id} /> : null,
    },
    {
      id: "tokens",
      label: "Access Tokens",
      customContent: viewingUser ? <UserAccessTokens userId={viewingUser.id} /> : null,
    },
    {
      id: "reset-tokens",
      label: "Reset Password Tokens",
      customContent: viewingUser ? <UserResetPasswordTokens userId={viewingUser.id} /> : null,
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.mobile.includes(searchQuery)
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h2>User Management</h2>
          <p className="text-muted-foreground">
            Manage users with full CRUD operations
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add User
        </Button>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users..."
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
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        {user.image_id && (
                          <UserAvatarImage userId={user.id} />
                        )}
                        <AvatarFallback>
                          {user.first_name?.[0] || ""}
                          {user.last_name?.[0] || ""}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {user.first_name} {user.last_name || ""}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.country_code} {user.mobile}
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === 1
                          ? "default"
                          : "secondary"
                      }
                    >
                      {user.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(user)}
                        title="View user details"
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(user)}
                        title="Edit user"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingUserId(user.id)}
                        title="Delete user"
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
              {editingUser ? "Edit User" : "Create New User"}
            </DialogTitle>
          </DialogHeader>
          <UserForm
            user={editingUser}
            onSubmit={editingUser ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {viewingUser && (
        <DynamicView
          data={viewingUser}
          open={isViewOpen}
          onOpenChange={handleCloseView}
          title="User Details"
          header={viewHeader}
          tabs={viewTabs}
          maxWidth="4xl"
        />
      )}

      <AlertDialog
        open={!!deletingUserId}
        onOpenChange={(open) => !open && setDeletingUserId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingUserId && handleDelete(deletingUserId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
