"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Checkbox } from "@/components/ui/Checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { DynamicIcon } from "@/lib/icon-map";
import { useI18n } from "@/hooks/useI18n";

interface Permission {
  id: number;
  object_id: number;
  action: string;
  assigned: boolean;
}

interface ObjectWithPermissions {
  id: number;
  name: string;
  namespace: string;
  icon?: string | null;
  permissions: Permission[];
}

interface RolePermissionsProps {
  roleId: number;
}

export function RolePermissions({ roleId }: RolePermissionsProps) {
  const { t } = useI18n("admin");
  const [objects, setObjects] = useState<ObjectWithPermissions[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const fetchingRef = useRef(false);
  const lastFetchedRoleIdRef = useRef<number | null>(null);

  const fetchPermissions = useCallback(async () => {
    // Prevent duplicate calls - if already fetching for this roleId, return early
    if (fetchingRef.current && lastFetchedRoleIdRef.current === roleId) {
      return;
    }

    // Mark as fetching and track the roleId
    fetchingRef.current = true;
    lastFetchedRoleIdRef.current = roleId;

    try {
      setLoading(true);
      const response = await fetch(`/api/roles/${roleId}/permissions`);
      
      if (!response.ok) {
        throw new Error(t("permissions.failedToLoad"));
      }

      const data = await response.json();
      
      // Only update state if we're still fetching for this roleId
      if (lastFetchedRoleIdRef.current === roleId) {
        setObjects(data.data || []);
      }
    } catch (error: any) {
      console.error("Error fetching permissions:", error);
      toast.error(t("permissions.failedToLoad"));
      if (lastFetchedRoleIdRef.current === roleId) {
        setObjects([]);
      }
    } finally {
      // Only update loading state if we're still fetching for this roleId
      if (lastFetchedRoleIdRef.current === roleId) {
        fetchingRef.current = false;
        setLoading(false);
      }
    }
  }, [roleId]);

  useEffect(() => {
    if (!roleId) return;
    
    // Only fetch if we haven't already fetched for this roleId
    if (!fetchingRef.current || lastFetchedRoleIdRef.current !== roleId) {
      fetchPermissions();
    }
    
    // Cleanup: reset fetching flag when component unmounts or roleId changes
    return () => {
      if (lastFetchedRoleIdRef.current !== roleId) {
        fetchingRef.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleId]);

  const handleTogglePermission = async (permission: Permission) => {
    try {
      setUpdating(permission.id);

      if (permission.assigned) {
        // Unassign permission
        const response = await fetch(
          `/api/roles/${roleId}/permissions?permission_id=${permission.id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || t("permissions.failedToUnassign"));
        }

        toast.success(t("permissions.permissionUnassigned"));
      } else {
        // Assign permission
        const response = await fetch(`/api/roles/${roleId}/permissions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            permission_id: permission.id,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || t("permissions.failedToAssign"));
        }

        toast.success(t("permissions.permissionAssigned"));
      }

      // Refresh permissions
      await fetchPermissions();
    } catch (error: any) {
      console.error("Error toggling permission:", error);
      toast.error(error.message || t("permissions.failedToUpdate"));
    } finally {
      setUpdating(null);
    }
  };

  const handleToggleAllForObject = async (object: ObjectWithPermissions) => {
    const unassignedPermissions = object.permissions.filter((p) => !p.assigned);
    const assignedPermissions = object.permissions.filter((p) => p.assigned);

    try {
      if (unassignedPermissions.length > 0) {
        // Assign all unassigned permissions
        const promises = unassignedPermissions.map((p) =>
          fetch(`/api/roles/${roleId}/permissions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              permission_id: p.id,
            }),
          })
        );

        await Promise.all(promises);
        toast.success(t("permissions.permissionAssigned"));
      } else if (assignedPermissions.length > 0) {
        // Unassign all assigned permissions
        const promises = assignedPermissions.map((p) =>
          fetch(
            `/api/roles/${roleId}/permissions?permission_id=${p.id}`,
            {
              method: "DELETE",
            }
          )
        );

        await Promise.all(promises);
        toast.success(t("permissions.permissionUnassigned"));
      }

      // Refresh permissions
      await fetchPermissions();
    } catch (error: any) {
      console.error("Error toggling permissions:", error);
      toast.error(t("permissions.failedToUpdate"));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">{t("permissions.loadingPermissions")}</span>
      </div>
    );
  }

  if (objects.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        {t("permissions.noPermissions")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {objects.map((object) => {
        const assignedCount = object.permissions.filter((p) => p.assigned).length;
        const totalCount = object.permissions.length;
        const allAssigned = totalCount > 0 && assignedCount === totalCount;

        return (
          <Card key={object.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {object.icon && <DynamicIcon name={object.icon} className="text-muted-foreground" size={20} />}
                    {object.name}
                  </CardTitle>
                  <CardDescription>
                    {object.namespace} • {t("permissions.assignedCount", { count: assignedCount, total: totalCount })}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleAllForObject(object)}
                  disabled={totalCount === 0}
                >
                  {allAssigned ? t("permissions.unassignAll") : t("permissions.assignAll")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {object.permissions.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("permissions.noPermissionsForObject")}</p>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                  {object.permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent"
                    >
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={permission.assigned}
                        onCheckedChange={() => handleTogglePermission(permission)}
                        disabled={updating === permission.id}
                      />
                      <label
                        htmlFor={`permission-${permission.id}`}
                        className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        <div className="flex items-center justify-between">
                          <span>{permission.action}</span>
                          {permission.assigned && (
                            <Badge variant="default" className="ml-2">
                              {t("permissions.assigned")}
                            </Badge>
                          )}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
