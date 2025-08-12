"use client"

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Asset, Employee } from "@/types";
import { Download, PlusCircle, Search, Eye, FilePenLine, Trash2, Package, CheckCircle, Wrench, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddAssetSheet } from "./add-asset-sheet";
import { StatCard } from "@/components/dashboard/stat-card";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AssetDetailsModal } from './asset-details-modal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { AssetTypeBreakdown } from '@/components/assets/asset-type-breakdown';

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const handleViewAsset = (asset: Asset) => {
    const assignedEmployee = getAssignedEmployee(asset.assignedTo);
    setSelectedAsset({...asset, assignedEmployee});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAsset(null);
  };
  
  const handleSheetSuccess = (newAsset: Asset) => {
    if(selectedAsset) {
        setAssets(assets.map(a => a.id === newAsset.id ? newAsset : a));
    } else {
        setAssets([newAsset, ...assets]);
    }
    setIsSheetOpen(false);
    setSelectedAsset(null);
  }

  const handleDelete = (assetId: string) => {
    setAssets(assets.filter(asset => asset.id !== assetId));
    toast({
        title: "Success",
        description: "Asset deleted successfully!",
    });
  }
  
  const getStatusBadgeVariant = (status: string): "secondary" | "outline" | "destructive" => {
      switch (status) {
          case "Active":
          case "In Use":
              return "secondary";
          case "Inactive":
          case "In Stock":
              return "outline"
          case "Maintenance":
          case "Retired":
          default:
              return "destructive";
      }
  }

  const getWarrantyBadgeVariant = (status: string, endDate?: string | null): "default" | "destructive" | "secondary" => {
      if (status === 'Expired') return 'destructive';
      if (status === 'Not Applicable') return 'secondary';
      
      if (endDate && isClient) {
          const expDate = new Date(endDate);
          const thirtyDaysFromNow = new Date();
          thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
          if (expDate <= thirtyDaysFromNow) {
              return 'destructive';
          }
      }
      return 'default';
  }

  const getAssignedEmployee = (employeeId: string | null | undefined): Employee | undefined => {
    if (!employeeId) return undefined;
    return employees.find(emp => emp.id === employeeId);
  }

  const filteredAssets = assets.filter(asset =>
    asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (asset.hostName && asset.hostName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (asset.location && asset.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (asset.make && asset.make.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (asset.model && asset.model.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalAssets = assets.length;
  const activeAssets = assets.filter((a) => a.status === "Active" || a.status === "In Use").length;
  const inMaintenance = assets.filter(
    (a) => a.status === "Maintenance"
  ).length;
  const warrantyExpiringSoon = isClient ? assets.filter(a => a.warrantyStatus === 'Active' && a.warrantyExpiration && new Date(a.warrantyExpiration) <= new Date(new Date().setDate(new Date().getDate() + 30))).length : 0; 

  const exportToCSV = () => {
    if(!isClient) return;
    const headers = [
      'Asset Tag', 'Host Name', 'Type', 'Make', 'Model', 'Serial No.',
      'Processor', 'OS', 'OS Version', 'RAM', 'HDD/SSD', 'Location',
      'Status', 'Remark', 'Warranty Status', 'Warranty Expiration Date', 'Assigned To'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredAssets.map(asset => {
        const assignedEmployee = getAssignedEmployee(asset.assignedTo);
        return [
        asset.assetTag,
        asset.hostName || '',
        asset.type,
        asset.make || '',
        asset.model || '',
        asset.serialNo || '',
        asset.processor || '',
        asset.os || '',
        asset.osVersion || '',
        asset.ram || '',
        asset.hddSsd || '',
        asset.location || '',
        asset.status,
        asset.remark || '',
        asset.warrantyStatus,
        asset.warrantyExpiration || '',
        assignedEmployee ? `${assignedEmployee.name} (${assignedEmployee.employeeId})` : 'Unassigned'
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')})
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assets.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">IT Asset Management</h1>
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportToCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
            </Button>
            <AddAssetSheet onSuccess={handleSheetSuccess} employees={employees}>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Asset
                </Button>
            </AddAssetSheet>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Assets"
          value={totalAssets.toString()}
          icon={Package}
        />
        <StatCard
          title="Active Assets"
          value={activeAssets.toString()}
          icon={CheckCircle}
        />
        <StatCard
          title="Under Maintenance"
          value={inMaintenance.toString()}
          icon={Wrench}
        />
        <StatCard
          title="Warranty Expiring Soon"
          value={warrantyExpiringSoon.toString()}
          icon={AlertTriangle}
          description="Expiring in next 30 days"
        />
      </div>

      <AssetTypeBreakdown assets={assets} />

      <Card>
        <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search assets by tag, hostname, location, make, or model..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset Tag</TableHead>
              <TableHead>Host Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Make/Model</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Warranty</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                <TableRow>
                    <TableCell colSpan={9} className="text-center">Loading assets...</TableCell>
                </TableRow>
            ) : filteredAssets.map((asset) => {
              const assignedEmployee = getAssignedEmployee(asset.assignedTo);
              return (
              <TableRow key={asset.id}>
                <TableCell className="font-medium">{asset.assetTag}</TableCell>
                <TableCell>{asset.hostName || "N/A"}</TableCell>
                <TableCell>{asset.type}</TableCell>
                <TableCell>{asset.make} {asset.model}</TableCell>
                <TableCell>
                  {assignedEmployee ? (
                    `${assignedEmployee.name} (${assignedEmployee.employeeId.toUpperCase()})`
                  ) : (
                    <span className="text-muted-foreground">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>{asset.location}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(asset.status)}>
                    {asset.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <Badge variant={getWarrantyBadgeVariant(asset.warrantyStatus, asset.warrantyExpiration)} className="w-fit">
                      {asset.warrantyStatus}
                    </Badge>
                    {asset.warrantyExpiration && isClient &&
                      <span className={`text-xs ${new Date(asset.warrantyExpiration) <= new Date(new Date().setDate(new Date().getDate() + 30)) ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>{new Date(asset.warrantyExpiration).toLocaleDateString()}</span>
                    }
                  </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewAsset(asset)}>
                            <Eye className="h-4 w-4" />
                        </Button>
                        <AddAssetSheet asset={asset} onSuccess={handleSheetSuccess} employees={employees}>
                           <Button variant="ghost" size="icon" className="h-8 w-8">
                                <FilePenLine className="h-4 w-4" />
                            </Button>
                        </AddAssetSheet>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Asset</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete asset "{asset.assetTag}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(asset.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </div>
      <AssetDetailsModal asset={selectedAsset} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
