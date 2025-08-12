"use client"

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import type { Log } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const storedLogs = localStorage.getItem('logs');
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
    }
    setLoading(false);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Activity Logs</h1>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                <TableRow>
                    <TableCell colSpan={4} className="text-center">Loading logs...</TableCell>
                </TableRow>
            ) : logs.length > 0 ? logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={log.avatarUrl} alt={log.user} data-ai-hint="person avatar" />
                      <AvatarFallback>{log.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{log.user}</span>
                  </div>
                </TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell className="text-muted-foreground">
                  {log.details}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(log.timestamp), "MMM d, yyyy 'at' h:mm a")}
                </TableCell>
              </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">No activity logs found.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
