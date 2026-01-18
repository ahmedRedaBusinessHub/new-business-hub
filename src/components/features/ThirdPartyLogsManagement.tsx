"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";

export interface ThirdPartyLog {
  id: number;
  third_party_service_id: number;
  called_url: string | null;
  ref_table: string | null;
  ref_id: string | null;
  request_body: string | null;
  response_body: string | null;
  result_status: string | null;
  result: string | null;
  organization_id: number;
  created_at: string | null;
}

interface ThirdPartyLogsManagementProps {
  serviceId: number;
}

export function ThirdPartyLogsManagement({ serviceId }: ThirdPartyLogsManagementProps) {
  const [logs, setLogs] = useState<ThirdPartyLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      // Note: This endpoint might need to be created in the backend
      // For now, we'll try to fetch logs filtered by service_id
      const response = await fetch(`/api/third-party-services/${serviceId}/logs`);
      if (!response.ok) {
        // If endpoint doesn't exist, just show empty state
        setLogs([]);
        return;
      }
      const data = await response.json();
      setLogs(data.data || data);
    } catch (error: any) {
      console.error("Error fetching logs:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (serviceId) {
      fetchLogs();
    }
  }, [serviceId]);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h4>Service Logs</h4>
        <p className="text-sm text-muted-foreground">
          View logs for this service
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Called URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Loading logs...
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No logs found.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="max-w-xs truncate">
                    {log.called_url || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={log.result_status === "success" ? "default" : "destructive"}>
                      {log.result_status || "-"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {log.result || "-"}
                  </TableCell>
                  <TableCell>
                    {log.created_at 
                      ? new Date(log.created_at).toLocaleDateString()
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

