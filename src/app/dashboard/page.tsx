
'use client';

import { useState, useMemo, useRef, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarHeader, SidebarFooter, SidebarSeparator } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AssetPage } from '@/components/asset-page';
import { EmployeesPage } from '@/components/employees-page';
import { ReportsPage } from '@/components/reports-page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, LayoutDashboard, Users, Component, FileText, LogOut, Package } from 'lucide-react';
import Image from 'next/image';
import { RapidoLogo } from '@/components/rapido-logo';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { LogEntry, AssetStatus, Asset, Employee } from '@/lib/types';
import { getAssets, getEmployees, getLogs } from '@/lib/actions';

type Page = 'dashboard' | 'employees' | 'assets' | 'reports';

export default function Dashboard() {
  const router = useRouter();
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const assetPageRef = useRef<{ openAddDialog: () => void }>(null);
  const employeePageRef = useRef<{ openAddDialog: () => void }>(null);


  const fetchData = async () => {
    setIsLoading(true);
    try {
        const [assetsData, employeesData, logsData] = await Promise.all([
            getAssets(),
            getEmployees(),
            getLogs()
        ]);
        setAssets(assetsData);
        setEmployees(employeesData);
        setLogs(logsData);
    } catch (error) {
        console.error("Failed to fetch data:", error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    router.push('/');
  }

  const renderPage = () => {
    if (isLoading) {
        return <div className="flex justify-center items-center h-full">Loading...</div>
    }
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage setActivePage={setActivePage} assets={assets} employees={employees} />;
      case 'assets':
        return <AssetPage ref={assetPageRef} />;
      case 'employees':
        return <EmployeesPage ref={employeePageRef} />;
      case 'reports':
        return <ReportsPage logs={logs} onRefresh={fetchData} />;
      default:
        return <DashboardPage setActivePage={setActivePage} assets={assets} employees={employees} />;
    }
  };
  
  const handleOpenAddDialog = () => {
    if (activePage === 'assets' && assetPageRef.current) {
        assetPageRef.current.openAddDialog();
    } else if (activePage === 'employees' && employeePageRef.current) {
        employeePageRef.current.openAddDialog();
    }
  }

  const renderHeaderButton = () => {
    switch (activePage) {
      case 'assets':
        return (
             <Button onClick={handleOpenAddDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Asset
            </Button>
         )
      case 'employees':
        return (
             <Button onClick={handleOpenAddDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Employee
            </Button>
        )
      case 'reports':
      case 'dashboard':
      default:
        return null;
    }
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
            <div className="flex items-center gap-2">
                <RapidoLogo className="h-6 w-auto text-sidebar-primary" />
                <h1 className="text-xl font-bold">iRapido</h1>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setActivePage('dashboard')} isActive={activePage === 'dashboard'} tooltip="Dashboard">
                <LayoutDashboard />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setActivePage('employees')} isActive={activePage === 'employees'} tooltip="Employees">
                <Users />
                Employees
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setActivePage('assets')} isActive={activePage === 'assets'} tooltip="Assets">
                <Component />
                Assets
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setActivePage('reports')} isActive={activePage === 'reports'} tooltip="Reports">
                <FileText />
                Reports
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                    <LogOut />
                    Logout
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <SidebarSeparator />
            <div className="flex items-center gap-3 p-2">
                <Avatar>
                    <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="avatar user"/>
                    <AvatarFallback>N</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-sm group-data-[collapsible=icon]:hidden">
                    <span className="font-semibold text-sidebar-foreground">Guest User</span>
                </div>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 md:px-6 border-b bg-card">
            <div className="flex items-center gap-2">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold capitalize">{activePage}</h1>
            </div>
            {renderHeaderButton()}
        </header>
        <main className="flex-1 overflow-auto">
            {renderPage()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

const DashboardPage = ({ setActivePage, assets, employees }: { setActivePage: (page: Page) => void, assets: Asset[], employees: Employee[] }) => {
    const assetStats = useMemo(() => {
        const statusCounts: Record<AssetStatus, number> = { 'Active': 0, 'Inactive': 0, 'In Repair': 0, 'Retired': 0 };
        const categoryCounts: Record<string, number> = {};

        assets.forEach(asset => {
            statusCounts[asset.status]++;
            categoryCounts[asset.category] = (categoryCounts[asset.category] || 0) + 1;
        });

        const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, count: value }));
        const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

        const totalAssets = assets.length;
        const totalEmployees = employees.length;

        return { statusData, categoryData, totalAssets, totalEmployees };
    }, [assets, employees]);

    const PIE_COLORS = [
        'hsl(var(--chart-1))',
        'hsl(var(--chart-2))',
        'hsl(var(--chart-3))',
        'hsl(var(--chart-4))',
        'hsl(var(--chart-5))',
    ];


    return (
        <div className="p-4 md:p-6 lg:p-8">
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="cursor-pointer hover:bg-muted" onClick={() => setActivePage('assets')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{assetStats.totalAssets}</div>
                        <p className="text-xs text-muted-foreground">All hardware and software</p>
                    </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-muted" onClick={() => setActivePage('employees')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{assetStats.totalEmployees}</div>
                        <p className="text-xs text-muted-foreground">Users with assigned assets</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-6 mt-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Assets by Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="min-h-[200px] w-full">
                            <BarChart data={assetStats.statusData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                                <YAxis />
                                <Tooltip content={<ChartTooltipContent />} />
                                <Legend />
                                <Bar dataKey="count" fill="hsl(var(--primary))" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Assets by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                         <ChartContainer config={{}} className="min-h-[200px] w-full">
                            <PieChart>
                                <Tooltip content={<ChartTooltipContent nameKey="name" />} />
                                <Pie
                                    data={assetStats.categoryData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {assetStats.categoryData.map((entry, index) => (
                                        <Cell key={`cell-${entry.name}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
