
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import type { Log } from '@/lib/types';
import {
  Clock,
  FileText,
  MoreHorizontal,
  Loader2,
  User,
  Info,
  Search,
  Activity,
  Users,
  AlertCircle,
  PlusCircle,
  FilePenLine,
  Trash2,
  UserPlus,
  UserCog,
  UserMinus,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { format, formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const LogActionIcon = ({ action }: { action: string }) => {
    const iconProps = { className: 'h-5 w-5 text-muted-foreground' };
    if (action.includes('Create') || action.includes('Created')) {
        return action.includes('User') || action.includes('Employee') ? <UserPlus {...iconProps} /> : <PlusCircle {...iconProps} />;
    }
    if (action.includes('Update') || action.includes('Updated')) {
        return action.includes('User') || action.includes('Employee') ? <UserCog {...iconProps} /> : <FilePenLine {...iconProps} />;
    }
    if (action.includes('Delete') || action.includes('Deleted')) {
        return action.includes('User') || action.includes('Employee') ? <UserMinus {...iconProps} /> : <Trash2 {...iconProps} />;
    }
    if (action.includes('Login') || action.includes('Logout')) {
        return <User {...iconProps} />
    }
    return <AlertCircle {...iconProps} />;
};


export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [isDetailDialogOpen, setDetailDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchLogs = useCallback(async () => {
    try {
        const response = await fetch('/api/logs');
        const data = await response.json();
        setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error fetching logs' });
        setLogs([]);
    } finally {
        setLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);
  
  const handleViewDetails = (log: Log) => {
    setSelectedLog(log);
    setDetailDialogOpen(true);
  };
  
  const filteredLogs = useMemo(() => {
    if (!searchTerm) return logs;
    return logs.filter(log => 
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [logs, searchTerm]);

  const { totalLogs, uniqueUsers, mostCommonAction } = useMemo(() => {
    const totalLogs = logs.length;
    const uniqueUsers = new Set(logs.map(log => log.user)).size;
    const actionCounts = logs.reduce((acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const mostCommonAction = Object.keys(actionCounts).length > 0 
        ? Object.entries(actionCounts).sort((a, b) => b[1] - a[1])[0][0] 
        : 'N/A';
    
    return { totalLogs, uniqueUsers, mostCommonAction };
  }, [logs]);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-[80vh]">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return (
    <>
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Activity Logs</h1>
      </header>

       <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLogs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Frequent Action</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate" title={mostCommonAction}>{mostCommonAction}</div>
          </CardContent>
        </Card>
      </div>


      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs by user, action, or details..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
         <ScrollArea className="h-[55vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                    <span className="sr-only">Icon</span>
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell>
                    <LogActionIcon action={log.action} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{log.user.slice(0,2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{log.user}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                      {log.action}
                  </TableCell>
                  <TableCell className="max-w-[350px] truncate" title={log.details}>{log.details}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span title={format(new Date(log.timestamp), 'PPpp')}>
                        {formatDistanceToNow(new Date(log.timestamp), {
                              addSuffix: true,
                            })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(log)}>View Details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        No logs found.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {selectedLog && (
        <AlertDialog open={isDetailDialogOpen} onOpenChange={setDetailDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Log Details</AlertDialogTitle>
                    <AlertDialogDescription>
                        Detailed information about the recorded activity.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4 text-sm break-all">
                    <div className="flex items-start gap-2">
                        <User className="h-4 w-4 mt-0.5 text-muted-foreground"/>
                        <div>
                            <span className="font-semibold">User:</span> {selectedLog.user}
                        </div>
                    </div>
                     <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 mt-0.5 text-muted-foreground"/>
                        <div>
                            <span className="font-semibold">Action:</span> {selectedLog.action}
                        </div>
                    </div>
                     <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 mt-0.5 text-muted-foreground"/>
                        <div>
                            <span className="font-semibold">Details:</span>
                            <p className="mt-1">{selectedLog.details}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 mt-0.5 text-muted-foreground"/>
                        <div>
                            <span className="font-semibold">Timestamp:</span> {format(new Date(selectedLog.timestamp), 'PPpp')}
                        </div>
                    </div>
                </div>
                <AlertDialogFooter>
                    <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
