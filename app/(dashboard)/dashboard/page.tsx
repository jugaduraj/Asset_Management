

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Briefcase,
  Database,
  Wrench,
  CheckCircle,
  Loader2,
  List,
} from 'lucide-react';
import type { Asset, Employee, Log } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import {
    Bar,
    BarChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Cell,
    Legend,
} from 'recharts';
import { format, formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function DashboardPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [assetsRes, employeesRes, logsRes] = await Promise.all([
        fetch('/api/assets'),
        fetch('/api/employees'),
        fetch('/api/logs')
      ]);
      const assetsData = await assetsRes.json();
      const employeesData = await employeesRes.json();
      const logsData = await logsRes.json();

      setAssets(Array.isArray(assetsData) ? assetsData : []);
      setEmployees(Array.isArray(employeesData) ? employeesData : []);
      setLogs(Array.isArray(logsData) ? logsData.slice(0, 5) : []); // Get latest 5 logs

    } catch (error) {
      toast({ variant: 'destructive', title: 'Error fetching dashboard data' });
      setAssets([]);
      setEmployees([]);
      setLogs([]);
    } finally {
        setLoading(false);
    }
  }, [toast]);


  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const assetStatusData = useMemo(() => {
    if (!Array.isArray(assets)) return [];
    const statusCounts = assets.reduce((acc, asset) => {
        const status = asset.status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [assets]);

  const assetTypeData = useMemo(() => {
     if (!Array.isArray(assets)) return [];
    const typeCounts = assets.reduce((acc, asset) => {
        const type = asset.type || 'Other';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    return Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
  }, [assets])

  if (loading) {
    return (
        <div className="flex justify-center items-center h-[80vh]">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return (
    <>
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/assets">
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Assets
                </CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assets.length}</div>
              </CardContent>
            </Card>
        </Link>
         <Link href="/assets">
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Deployed Assets
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assets.filter(a => a.status === 'Active' && a.assignedTo !== 'Unassigned').length}</div>
              </CardContent>
            </Card>
        </Link>
         <Link href="/assets">
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Assets in Repair
                </CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assets.filter(a => a.status === 'In Repair').length}</div>
              </CardContent>
            </Card>
        </Link>
        <Link href="/employees">
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Employees
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employees.length}</div>
              </CardContent>
            </Card>
        </Link>
      </div>

       <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 mt-4">
          <Card className="lg:col-span-3">
              <CardHeader>
                  <CardTitle>Assets by Type</CardTitle>
              </CardHeader>
              <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={assetTypeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)",
                            }}
                        />
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
              </CardContent>
          </Card>
           <Card className="lg:col-span-2">
              <CardHeader>
                  <CardTitle>Asset Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                 <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={assetStatusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                return (
                                <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12}>
                                    {`${(percent * 100).toFixed(0)}%`}
                                </text>
                                );
                            }}
                        >
                            {assetStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)",
                            }}
                        />
                        <Legend iconSize={10} />
                    </PieChart>
                 </ResponsiveContainer>
              </CardContent>
          </Card>
      </div>
       <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-4">
                {logs.length > 0 ? logs.map(log => (
                  <div key={log._id} className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{log.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-sm text-muted-foreground">{log.details}</p>
                    </div>
                    <p className="text-xs text-muted-foreground" title={format(new Date(log.timestamp), 'PPpp')}>
                      {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                )) : (
                  <div className="flex items-center justify-center text-muted-foreground h-48">
                    No recent activity found.
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
