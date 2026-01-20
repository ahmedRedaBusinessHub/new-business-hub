"use client";
import { useState, useEffect, useRef, memo, useCallback } from "react";
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
  image_url?: string | null; // Image URL from API response
  status: number;
  organization_id: number | null;
  email_verified_at: string | null;
  sms_verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Component to display user avatar image using image_url from user data
const UserAvatarImage = memo(function UserAvatarImage({ imageUrl }: { imageUrl: string | null | undefined }) {
  if (!imageUrl) return null;
  
  // If imageUrl is already a full URL, use it directly
  // If it's a file path, prepend the public file endpoint
  const finalUrl = imageUrl.startsWith('http') || imageUrl.startsWith('/api/public/file')
    ? imageUrl
    : `/api/public/file?file_url=${encodeURIComponent(imageUrl)}`;
  
  return <AvatarImage src={finalUrl} alt="User avatar" />;
});

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [hasFormError, setHasFormError] = useState(false); // Track if form has an error to prevent modal from closing
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
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
  
  const fetchUsers = useCallback(async () => {
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

      const response = await fetch(`/api/users?${paramsString}`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      const usersData = Array.isArray(data.data) ? data.data : [];
      setUsers(usersData);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
      setUsers([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, debouncedSearch]);

  const handleCreate = async (userData: Omit<User, "id" | "created_at" | "updated_at" | "organization_id" | "email_verified_at" | "sms_verified_at" | "image_id" | "image_url"> & { password?: string; profileImage?: File[] }) => {
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

      // IMPORTANT: Always parse response body first to check for errors, even if response.ok is true
      // Some APIs return 200 OK with error objects in the body
      let responseData: any;
      try {
        responseData = await response.json();
      } catch (parseError) {
        // If we can't parse JSON, treat as error if response is not OK
        if (!response.ok) {
          throw new Error(`Failed to parse error response: ${response.status} ${response.statusText}`);
        }
        throw parseError;
      }

      // Check for errors in response body (even if response.ok is true)
      if (!response.ok || (responseData.statusCode && responseData.statusCode >= 400)) {
        let errorMessage = "Failed to create user";
        let fieldErrors: Record<string, string> = {};
        
        // Use the already parsed responseData instead of parsing again
        const errorData = responseData;
        // Handle error object structure: {statusCode: 400, message: "..."}
        errorMessage = errorData.message || errorData.error || errorMessage;
        
        // Parse error message (handle both English and Arabic messages)
        if (errorData.message && typeof errorData.message === "string") {
          const errorMsg = errorData.message;
          const errorMsgLower = errorMsg.toLowerCase();
          
          // Check for unique constraint on email
          if (errorMsgLower.includes("unique constraint failed on the fields: (`email`)") || 
              (errorMsgLower.includes("email") && errorMsgLower.includes("unique")) ||
              errorMsg.includes("البريد الإلكتروني") || 
              errorMsg.includes("البريد الإلكتروني مستخدم")) {
            // Use the original API message instead of translated message
            fieldErrors.email = errorData.message;
            errorMessage = "Email already exists";
          }
          // Check for unique constraint on mobile (handle Arabic: "رقم الجوال مستخدم بالفعل")
          // This handles the exact error: {statusCode: 400, message: "رقم الجوال مستخدم بالفعل"}
          if (errorMsgLower.includes("unique constraint failed on the fields: (`mobile`)") ||
              (errorMsgLower.includes("mobile") && errorMsgLower.includes("unique")) ||
              errorMsg.includes("رقم الجوال") || 
              errorMsg.includes("رقم الجوال مستخدم بالفعل")) {
            // Use the original API message instead of translated message
            fieldErrors.mobile = errorData.message;
            errorMessage = "Mobile number already exists";
          }
          // Check for unique constraint on username
          if (errorMsgLower.includes("unique constraint failed on the fields: (`username`)") ||
              (errorMsgLower.includes("username") && errorMsgLower.includes("unique")) ||
              errorMsg.includes("اسم المستخدم") ||
              errorMsg.includes("اسم المستخدم مستخدم")) {
            // Use the original API message instead of translated message
            fieldErrors.username = errorData.message;
            errorMessage = "Username already exists";
          }
        }
        
        // Create error with field information
        // Preserve the original API message for display
        const error = new Error(errorData.message || errorMessage) as any;
        error.fieldErrors = fieldErrors;
        error.originalMessage = errorData.message; // Store original API message (e.g., "البريد الإلكتروني مستخدم بالفعل")
        error.statusCode = errorData.statusCode; // Store status code
        // Ensure error is thrown to prevent modal from closing
        throw error;
      }

      // Response is OK and has no error in body - proceed with success
      const createdUser = responseData;
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
      // Only log to console if there are no field-specific errors (field errors are handled by DynamicForm)
      // Field-specific errors are expected and handled gracefully, so we don't need to log them
      if (!error.fieldErrors || Object.keys(error.fieldErrors).length === 0) {
        console.error("Create error:", error);
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

  const handleUpdate = async (userData: Omit<User, "id" | "created_at" | "updated_at" | "organization_id" | "email_verified_at" | "sms_verified_at" | "image_id" | "image_url"> & { password?: string; profileImage?: File[] }) => {
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

      // IMPORTANT: Always parse response body first to check for errors, even if response.ok is true
      // Some APIs return 200 OK with error objects in the body
      let responseData: any;
      try {
        responseData = await response.json();
      } catch (parseError) {
        // If we can't parse JSON, treat as error if response is not OK
        if (!response.ok) {
          throw new Error(`Failed to parse error response: ${response.status} ${response.statusText}`);
        }
        throw parseError;
      }

      // Check for errors in response body (even if response.ok is true)
      if (!response.ok || (responseData.statusCode && responseData.statusCode >= 400)) {
        let errorMessage = "Failed to update user";
        let fieldErrors: Record<string, string> = {};
        
        // Use the already parsed responseData instead of parsing again
        const errorData = responseData;
        // Handle error object structure: {statusCode: 400, message: "..."}
        errorMessage = errorData.message || errorData.error || errorMessage;
        
        // Parse error message (handle both English and Arabic messages)
        if (errorData.message && typeof errorData.message === "string") {
          const errorMsg = errorData.message;
          const errorMsgLower = errorMsg.toLowerCase();
          
          // Check for unique constraint on email
          if (errorMsgLower.includes("unique constraint failed on the fields: (`email`)") || 
              (errorMsgLower.includes("email") && errorMsgLower.includes("unique")) ||
              errorMsg.includes("البريد الإلكتروني") || 
              errorMsg.includes("البريد الإلكتروني مستخدم")) {
            // Use the original API message instead of translated message
            fieldErrors.email = errorData.message;
            errorMessage = "Email already exists";
          }
          // Check for unique constraint on mobile (handle Arabic: "رقم الجوال مستخدم بالفعل")
          if (errorMsgLower.includes("unique constraint failed on the fields: (`mobile`)") ||
              (errorMsgLower.includes("mobile") && errorMsgLower.includes("unique")) ||
              errorMsg.includes("رقم الجوال") || 
              errorMsg.includes("رقم الجوال مستخدم بالفعل")) {
            // Use the original API message instead of translated message
            fieldErrors.mobile = errorData.message;
            errorMessage = "Mobile number already exists";
          }
          // Check for unique constraint on username
          if (errorMsgLower.includes("unique constraint failed on the fields: (`username`)") ||
              (errorMsgLower.includes("username") && errorMsgLower.includes("unique")) ||
              errorMsg.includes("اسم المستخدم") ||
              errorMsg.includes("اسم المستخدم مستخدم")) {
            // Use the original API message instead of translated message
            fieldErrors.username = errorData.message;
            errorMessage = "Username already exists";
          }
        }
        
        // Create error with field information
        // Preserve the original API message for display
        const errorObj = new Error(errorData.message || errorMessage) as any;
        errorObj.fieldErrors = fieldErrors;
        errorObj.originalMessage = errorData.message; // Store original API message (e.g., "البريد الإلكتروني مستخدم بالفعل")
        errorObj.statusCode = errorData.statusCode; // Store status code
        throw errorObj;
      }

      // Response is OK and has no error in body - proceed with success
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
      // Only log to console if there are no field-specific errors (field errors are handled by DynamicForm)
      // Field-specific errors are expected and handled gracefully, so we don't need to log them
      if (!error.fieldErrors || Object.keys(error.fieldErrors).length === 0) {
        console.error("Update error:", error);
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

  const handleCloseForm = (open?: boolean) => {
    // Always allow user to close the modal (even if there's an error)
    // The error state prevents automatic closing after form submission, but user should be able to close manually
    if (open === false || open === undefined) {
      setIsFormOpen(false);
      setEditingUser(null);
      setHasFormError(false); // Reset error state when closing
    }
    // If open === true, Dialog is opening - do nothing
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
    // Use image_url from user data if available (no need to make API call)
    if (data?.image_url) {
      // If image_url is already a full URL, use it directly
      // If it's a file path, prepend the public file endpoint
      if (data.image_url.startsWith('http') || data.image_url.startsWith('/api/public/file')) {
        return data.image_url;
      }
      return `/api/public/file?file_url=${encodeURIComponent(data.image_url)}`;
    }
    
    // Fallback: if image_url is not available but image_id exists, return null
    // (The image should be available in the users list response)
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
              case 1: return "Male";
              case 2: return "Female";
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

  // No need for client-side filtering - server handles it
  // const filteredUsers = users; // Already filtered by server

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

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
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
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        {user.image_url && (
                          <UserAvatarImage imageUrl={user.image_url} />
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

      {total > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, total)} of {total} users
        </div>
      )}

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
            onErrorStateChange={setHasFormError}
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
