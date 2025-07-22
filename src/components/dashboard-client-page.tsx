
"use client";

import { useState } from "react";
import type { Asset } from "@/types";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddAssetSheet } from "@/components/add-asset-sheet";


interface DashboardClientPageProps {
  initialAssets: Asset[];
}

function SummaryCard({ title, value }: { title: string; value: string | number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

export function DashboardClientPage({ initialAssets }: DashboardClientPageProps) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [isAddAssetSheetOpen, setIsAddAssetSheetOpen] = useState(false);

  const handleAssetAdd = (newAsset: Asset) => {
    setAssets(prevAssets => [newAsset, ...prevAssets]);
  };

  const totalAssets = assets.length;
  const assignedAssets = assets.filter(asset => asset.status === 'Assigned').length;
  const unassignedAssets = totalAssets - assignedAssets;
  const underMaintenanceAssets = assets.filter(asset => asset.status === 'Under Maintenance').length;

  const recentAssets = assets.slice(0, 5);

  return (
    <>
      <main className="flex-1 flex flex-col">
        <PageHeader 
            title="Dashboard" 
        >
          <Button onClick={() => setIsAddAssetSheetOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Asset
          </Button>
        </PageHeader>
        <div className="flex-1 px-6 md:px-8 pb-8 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SummaryCard title="Total Assets" value={totalAssets} />
            <SummaryCard title="Assigned" value={assignedAssets} />
            <SummaryCard title="Unassigned" value={unassignedAssets} />
            <SummaryCard title="Under Maintenance" value={underMaintenanceAssets} />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Recent Assets</h2>
            <div className="rounded-md border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset Tag</TableHead>
                    <TableHead>Asset Type</TableHead>
                    <TableHead>Make</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAssets.map((asset) => (
                    <TableRow key={asset.assetTag}>
                      <TableCell>{asset.assetTag}</TableCell>
                      <TableCell>{asset.assetType}</TableCell>
                      <TableCell>{asset.make}</TableCell>
                      <TableCell>{asset.model}</TableCell>
                      <TableCell>
                        <Badge variant={
                          asset.status === 'Assigned' ? "default" 
                          : asset.status === 'Under Maintenance' ? "destructive"
                          : "secondary"
                        }>{asset.status}</Badge>
                      </TableCell>
                      <TableCell>{asset.assignedTo || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>
      <AddAssetSheet 
        open={isAddAssetSheetOpen}
        onOpenChange={setIsAddAssetSheetOpen}
        onAssetAdd={handleAssetAdd}
      />
    </>
  );
}
