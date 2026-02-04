"use client";
import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { staticListsCache } from "@/lib/staticListsCache";
import { getLocalizedLabel } from "@/lib/localizedLabel";
import { useI18n } from "@/hooks/useI18n";

interface UserProjectsProps {
  userId: number;
}

export function UserProjects({ userId }: UserProjectsProps) {
  const { language } = useI18n();
  const [loading, setLoading] = useState(true);
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const statusesConfig = await staticListsCache.getByNamespace(
          "user_project.statuses"
        );
        setStatuses(statusesConfig || []);
      } catch {
        // Fallback if no static list
      }
    };
    fetchStatuses();
  }, []);

  const fetchProjects = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/user-project/user/${userId}`).catch(
        () => null
      );
      if (response?.ok) {
        const res = await response.json();
        setUserProjects(Array.isArray(res.data) ? res.data : []);
      } else {
        setUserProjects([]);
      }
    } catch (error) {
      console.error("Error fetching user projects:", error);
      setUserProjects([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const getStatusName = (statusId: number | null): string => {
    if (statusId === null) return "-";
    const status = statuses.find((s: any) => s.id === statusId);
    return status
      ? getLocalizedLabel(status.name_en, status.name_ar, language) || String(statusId)
      : String(statusId);
  };

  const getProjectName = (item: any): string => {
    const p = item.projects;
    if (!p) return item.project_name || "-";
    return getLocalizedLabel(p.title_en, p.title_ar, language) || item.project_name || "-";
  };

  if (loading) {
    return <div className="p-4 text-center">Loading applied projects...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Applied Projects ({userProjects.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {userProjects.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No applied projects
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userProjects.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{getProjectName(item)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={item.status === 1 ? "default" : "secondary"}
                    >
                      {getStatusName(item.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString()
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
