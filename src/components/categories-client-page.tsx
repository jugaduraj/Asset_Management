"use client";

import * as React from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip, Legend, Cell } from "recharts";
import type { Asset } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "./page-header";

interface CategoriesClientPageProps {
  assets: Asset[];
}

const COLORS = ["#3498db", "#9b59b6", "#e74c3c", "#f1c40f", "#2ecc71", "#e67e22", "#1abc9c"];

export function CategoriesClientPage({ assets }: CategoriesClientPageProps) {
  const categoryData = React.useMemo(() => {
    const counts = assets.reduce((acc, asset) => {
      const category = asset.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [assets]);

  return (
    <main className="flex-1 flex flex-col">
      <PageHeader
        title="Asset Categories"
        description="View and manage your asset categories."
      />
      <div className="flex-1 px-6 md:px-8 pb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Category List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Asset Count</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categoryData.map((category) => (
                        <TableRow key={category.name}>
                            <TableCell className="font-medium">{category.name}</TableCell>
                            <TableCell className="text-right">{category.value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
