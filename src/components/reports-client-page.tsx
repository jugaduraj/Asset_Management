"use client";

import * as React from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip, Legend, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import type { Asset } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "./page-header";

interface ReportsClientPageProps {
  assets: Asset[];
}

const COLORS = ["#3498db", "#9b59b6", "#e74c3c", "#f1c40f", "#2ecc71"];

export function ReportsClientPage({ assets }: ReportsClientPageProps) {
  const categoryData = React.useMemo(() => {
    const counts = assets.reduce((acc, asset) => {
      const category = asset.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [assets]);

  const locationValueData = React.useMemo(() => {
    const values = assets.reduce((acc, asset) => {
        acc[asset.location] = (acc[asset.location] || 0) + (asset.value || 0);
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(values).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [assets]);

  return (
    <main className="flex-1 flex flex-col">
      <PageHeader
        title="Reports"
        description="Visualize your asset data with insightful charts."
      />
      <div className="flex-1 px-6 md:px-8 pb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Assets by Category</CardTitle>
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
        <Card>
          <CardHeader>
            <CardTitle>Total Asset Value by Location</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
               <BarChart data={locationValueData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => `$${value/1000}k`}/>
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}/>
                    <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
