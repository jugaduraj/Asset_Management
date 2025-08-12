"use client";

import { useState, useEffect } from 'react';
import {
  Package,
  Users,
  Wrench,
  CheckCircle,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { AssetStatusChart } from "@/components/dashboard/asset-status-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import type { Asset, Employee, Log } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedAssets = localStorage.getItem('assets');
    const storedEmployees = localStorage.getItem('employees');
    const storedLogs = localStorage.getItem('logs');
    
    if (storedAssets) {
      setAssets(JSON.parse(storedAssets));
    }
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    }
     if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
    }
  }, []);

  const totalAssets = assets.length;
  const assignedAssets = assets.filter((a) => a.status === "In Use").length;
  const inMaintenance = assets.filter(
    (a) => a.status === "Maintenance"
  ).length;
  const totalEmployees = employees.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Assets"
          value={totalAssets.toString()}
          icon={Package}
        />
        <StatCard
          title="Assigned Assets"
          value={assignedAssets.toString()}
          icon={CheckCircle}
        />
        <StatCard
          title="In Maintenance"
          value={inMaintenance.toString()}
          icon={Wrench}
        />
        <StatCard
          title="Total Employees"
          value={totalEmployees.toString()}
          icon={Users}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Asset Status</CardTitle>
          </CardHeader>
          <CardContent>
            <AssetStatusChart assets={assets} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity logs={logs.slice(0, 5)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
