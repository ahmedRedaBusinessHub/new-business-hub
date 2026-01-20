import { NextRequest, NextResponse } from "next/server";
import { apiGet, apiPost, apiDelete, createApiResponse, handleApiError } from "@/lib/api";

// Get all permissions for a role
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // First get the role to verify it exists
    const roleRes = await apiGet(`/roles/${id}`, {
      requireAuth: true,
    });
    
    if (!roleRes.ok) {
      return await createApiResponse(roleRes);
    }

    // Get all permissions (fetch with high limit to get all, or fetch all pages)
    let allPermissions: any[] = [];
    let currentPage = 1;
    const pageLimit = 1000; // High limit to get all permissions
    
    while (true) {
      const permissionsRes = await apiGet(`/permissions?page=${currentPage}&limit=${pageLimit}`, {
        requireAuth: true,
      });

      if (!permissionsRes.ok) {
        break;
      }

      const permissionsData = await permissionsRes.json();
      const pagePermissions = Array.isArray(permissionsData.data) 
        ? permissionsData.data 
        : Array.isArray(permissionsData) 
        ? permissionsData 
        : [];
      
      if (pagePermissions.length === 0) {
        break;
      }
      
      allPermissions = allPermissions.concat(pagePermissions);
      
      // If we got fewer than the limit, we've reached the end
      if (pagePermissions.length < pageLimit) {
        break;
      }
      
      currentPage++;
    }

    // Get role permissions for this role using the dedicated endpoint
    let assignedPermissionIds: number[] = [];
    
    try {
      const rolePermissionsRes = await apiGet(`/role-permissions/role/${id}`, {
        requireAuth: true,
      });
      
      if (rolePermissionsRes.ok) {
        const rolePermissionsData = await rolePermissionsRes.json();
        const rolePermissions = Array.isArray(rolePermissionsData.data)
          ? rolePermissionsData.data
          : Array.isArray(rolePermissionsData)
          ? rolePermissionsData
          : [];
        assignedPermissionIds = rolePermissions
          .map((rp: any) => rp.permission_id)
          .filter((id: any) => id != null);
      }
    } catch (error) {
      console.warn("Could not fetch role permissions:", error);
    }

    // Get all objects to group permissions (fetch with high limit to get all)
    let objects: any[] = [];
    currentPage = 1; // Reuse the same variable
    
    while (true) {
      const objectsRes = await apiGet(`/objects?page=${currentPage}&limit=${pageLimit}`, {
        requireAuth: true,
      });

      if (!objectsRes.ok) {
        break;
      }

      const objectsData = await objectsRes.json();
      const pageObjects = Array.isArray(objectsData.data)
        ? objectsData.data
        : Array.isArray(objectsData)
        ? objectsData
        : [];
      
      if (pageObjects.length === 0) {
        break;
      }
      
      objects = objects.concat(pageObjects);
      
      // If we got fewer than the limit, we've reached the end
      if (pageObjects.length < pageLimit) {
        break;
      }
      
      currentPage++;
    }

    // Group permissions by object - only show permissions that exist in the database
    const permissionsByObject = objects.map((obj) => {
      // Get all permissions for this object from the database
      const objectPermissions = allPermissions
        .filter((p: any) => p.object_id === obj.id)
        .map((p: any) => ({
          ...p,
          assigned: assignedPermissionIds.includes(p.id),
        }));
      
      return {
        ...obj,
        permissions: objectPermissions,
      };
    });

    return NextResponse.json({
      data: permissionsByObject,
      assignedPermissionIds,
    });
  } catch (error: any) {
    return handleApiError(error, "Failed to fetch role permissions");
  }
}

// Assign a permission to a role
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { permission_id } = body;

    if (!permission_id) {
      return NextResponse.json(
        { statusCode: 400, message: "permission_id is required" },
        { status: 400 }
      );
    }

    const res = await apiPost(
      "/role-permissions",
      {
        role_id: parseInt(id),
        permission_id: parseInt(permission_id),
      },
      { requireAuth: true }
    );
    return await createApiResponse(res, { successStatus: 201 });
  } catch (error: any) {
    return handleApiError(error, "Failed to assign permission to role");
  }
}

// Unassign a permission from a role
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const permission_id = searchParams.get("permission_id");

    if (!permission_id) {
      return NextResponse.json(
        { statusCode: 400, message: "permission_id is required" },
        { status: 400 }
      );
    }

    // Find the role_permission record using query parameters
    let rolePermissionId: number | null = null;
    
    try {
      const rolePermissionsRes = await apiGet(
        `/role-permissions?role_id=${id}&permission_id=${permission_id}`,
        {
          requireAuth: true,
        }
      );

      if (rolePermissionsRes.ok) {
        const rolePermissionsData = await rolePermissionsRes.json();
        const rolePermissions = Array.isArray(rolePermissionsData.data)
          ? rolePermissionsData.data
          : Array.isArray(rolePermissionsData)
          ? rolePermissionsData
          : [];
        
        if (rolePermissions.length > 0) {
          rolePermissionId = rolePermissions[0].id;
        }
      }
    } catch (error) {
      console.warn("Could not fetch role permissions for deletion:", error);
    }

    if (!rolePermissionId) {
      return NextResponse.json(
        { statusCode: 404, message: "Role permission not found" },
        { status: 404 }
      );
    }

    const res = await apiDelete(`/role-permissions/${rolePermissionId}`, undefined, {
      requireAuth: true,
    });
    return await createApiResponse(res);
  } catch (error: any) {
    return handleApiError(error, "Failed to unassign permission from role");
  }
}
