"use client";

import type { Employee } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, HardDrive } from "lucide-react";
import { Badge } from "../ui/badge";

interface DepartmentBreakdownProps {
  employees: Employee[];
}

export function DepartmentBreakdown({ employees }: DepartmentBreakdownProps) {
  const departmentCounts = employees.reduce((acc, employee) => {
    const department = employee.department || "No Department";
    acc[department] = (acc[department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedDepartments = Object.entries(departmentCounts).sort(([, a], [, b]) => b - a);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Departments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedDepartments.map(([department, count]) => {
                const Icon = department === "No Department" ? Users : Building;
                return (
                    <div key={department} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium text-sm">{department}</span>
                        </div>
                        <Badge variant="secondary">{count}</Badge>
                    </div>
                )
            })}
        </div>
      </CardContent>
    </Card>
  );
}
