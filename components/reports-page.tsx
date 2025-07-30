
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { LogEntry } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Button } from './ui/button';
import { Download, RefreshCw } from 'lucide-react';
import { downloadCsv } from '@/lib/export';


type ReportsPageProps = {
  logs: LogEntry[];
  onRefresh: () => void;
};

export function ReportsPage({ logs, onRefresh }: ReportsPageProps) {

  const handleExportLogs = () => {
    // Re-format logs for export
    const exportedLogs = logs.map(log => ({
      ...log,
      timestamp: new Date(log.timestamp).toLocaleString(),
    }));
    downloadCsv(exportedLogs, 'activity-logs');
  }

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6 lg:p-8 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Activity Log</CardTitle>
           <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleExportLogs}>
                <Download className="mr-2 h-4 w-4" />
                Export
            </Button>
           </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                  </TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
