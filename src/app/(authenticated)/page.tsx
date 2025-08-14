
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Database, CheckCircle, Users, Briefcase, Loader2 } from 'lucide-react';
import { Asset, Employee, Log } from '../../lib/types';
import { useToast } from '../../hooks/use-toast';


export default function DashboardPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const [assetsRes, employeesRes, logsRes] = await Promise.all([
        fetch('/api/assets'),
        fetch('/api/employees'),
        fetch('/api/logs'),
      ]);
      const assetsData = await assetsRes.json();
      const employeesData = await employeesRes.json();
      const logsData = await logsRes.json();
      
      setAssets(Array.isArray(assetsData) ? assetsData : []);
      setEmployees(Array.isArray(employeesData) ? employeesData : []);
      setLogs(Array.isArray(logsData) ? logsData : []);

    } catch (error) {
      toast({ variant: 'destructive', title: 'Error fetching dashboard data' });
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }
  
  const assetStatusData = [
    { name: 'Active', count: Array.isArray(assets) ? assets.filter((a) => a.status === 'Active').length : 0 },
    { name: 'In Repair', count: Array.isArray(assets) ? assets.filter((a) => a.status === 'In Repair').length : 0 },
    { name: 'Inactive', count: Array.isArray(assets) ? assets.filter((a) => a.status === 'Inactive').length : 0 },
    { name: 'Retired', count: Array.isArray(assets) ? assets.filter((a) => a.status === 'Retired').length : 0 },
  ];

  const employeesWithAssetsCount = Array.isArray(employees) ? employees.filter((e) => e.assetTag).length : 0;

  return (
    <>
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Array.isArray(assets) ? assets.length : 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assets</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assetStatusData.find(s => s.name === 'Active')?.count || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Array.isArray(employees) ? employees.length : 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees with Assets</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employeesWithAssetsCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Asset Status</CardTitle>
          </CardHeader>
          <CardContent>
            {Array.isArray(assets) && assets.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={assetStatusData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No asset data available to display.
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4 h-[300px] overflow-y-auto">
              {Array.isArray(logs) && logs.length > 0 ? (
                logs.slice(0, 5).map((log) => (
                  <div key={log._id} className="flex items-start gap-4">
                     <Avatar className="h-8 w-8">
                        <AvatarFallback>{log.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-none">
                        {log.user} <span className="font-normal text-muted-foreground">{log.action}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">{log.details}</p>
                       <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                   No recent activity to display.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
