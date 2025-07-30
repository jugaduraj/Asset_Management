
'use client';

import { useState, useMemo, forwardRef, useImperativeHandle, useTransition, useEffect } from 'react';
import { AssetTable } from '@/components/asset-table';
import { AssetDialog } from '@/components/asset-dialog';
import { MaintenanceDialog } from '@/components/maintenance-dialog';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Boxes, PlusCircle, Search, Download } from 'lucide-react';
import type { Asset, MaintenanceEntry, AssetStatus, AssetType } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { downloadCsv } from '@/lib/export';
import { saveAsset, deleteAsset, saveMaintenanceLog, getAssets } from '@/lib/actions';

type AssetPageProps = {}

export const AssetPage = forwardRef<any, AssetPageProps>((props, ref) => {
  const [isPending, startTransition] = useTransition();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AssetStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<AssetType | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [isAssetDialogOpen, setIsAssetDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [maintenanceAsset, setMaintenanceAsset] = useState<Asset | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingAsset, setDeletingAsset] = useState<Asset | null>(null);
  
  const { toast } = useToast();

  const fetchAssets = async () => {
      setIsLoading(true);
      try {
          const assetsData = await getAssets();
          setAssets(assetsData);
      } catch (error) {
          console.error("Failed to fetch assets:", error);
          toast({ title: "Error", description: "Could not fetch assets.", variant: "destructive" });
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
    fetchAssets();
  }, []);
  
  useImperativeHandle(ref, () => ({
    openAddDialog: () => {
        handleOpenAddDialog();
    }
  }));

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const searchMatch =
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.assignedUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === 'all' || asset.status === statusFilter;
      const typeMatch = typeFilter === 'all' || asset.type === typeFilter;
      const categoryMatch = asset.category.toLowerCase().includes(categoryFilter.toLowerCase());
      return searchMatch && statusMatch && typeMatch && categoryMatch;
    });
  }, [assets, searchTerm, statusFilter, typeFilter, categoryFilter]);

  const handleSaveAsset = (values: Omit<Asset, 'id' | 'maintenanceHistory'>, id?: string) => {
    startTransition(async () => {
        await saveAsset(values, id);
        toast({ title: id ? "Asset Updated" : "Asset Added", description: `Successfully saved ${values.name}.` });
        setIsAssetDialogOpen(false);
        setEditingAsset(null);
        fetchAssets(); // Refetch assets
    });
  };
  
  const handleOpenAddDialog = () => {
    setEditingAsset(null);
    setIsAssetDialogOpen(true);
  }

  const handleOpenEditDialog = (asset: Asset) => {
    setEditingAsset(asset);
    setIsAssetDialogOpen(true);
  };

  const handleOpenMaintenanceDialog = (asset: Asset) => {
    setMaintenanceAsset(asset);
    setIsMaintenanceDialogOpen(true);
  };
  
  const handleSaveMaintenanceLog = (assetId: string, log: Omit<MaintenanceEntry, 'id'>) => {
     startTransition(async () => {
        await saveMaintenanceLog(assetId, log);
        toast({ title: "Maintenance Logged", description: `New maintenance entry added for asset.` });
        fetchAssets(); // Refetch to show updated history
     });
  };

  const handleOpenDeleteDialog = (asset: Asset) => {
    setDeletingAsset(asset);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingAsset) {
        startTransition(async () => {
            await deleteAsset(deletingAsset.id);
            toast({ title: "Asset Deleted", description: `Successfully deleted ${deletingAsset.name}.`, variant: "destructive" });
            setIsDeleteDialogOpen(false);
            setDeletingAsset(null);
            fetchAssets(); // Refetch assets
        });
    }
  };

  const handleExportAssets = () => {
    downloadCsv(filteredAssets, 'assets');
  };

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6 lg:p-8 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Asset Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative col-span-1 md:col-span-2 lg:col-span-1">
                <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as AssetStatus | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="In Repair">In Repair</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as AssetType | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Hardware">Hardware</SelectItem>
                  <SelectItem value="Software">Software</SelectItem>
                </SelectContent>
              </Select>
               <Input
                  placeholder="Filter by category..."
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Asset Overview</CardTitle>
            <Button variant="outline" onClick={handleExportAssets}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="text-center py-10">Loading assets...</div>
            ) : (
                <AssetTable
                assets={filteredAssets}
                onEdit={handleOpenEditDialog}
                onDelete={handleOpenDeleteDialog}
                onLogMaintenance={handleOpenMaintenanceDialog}
                />
            )}
          </CardContent>
        </Card>

      <AssetDialog
        open={isAssetDialogOpen}
        onOpenChange={setIsAssetDialogOpen}
        onSave={handleSaveAsset}
        asset={editingAsset}
        isSaving={isPending}
      />
      
      <MaintenanceDialog
        open={isMaintenanceDialogOpen}
        onOpenChange={setIsMaintenanceDialogOpen}
        asset={maintenanceAsset}
        onSaveLog={handleSaveMaintenanceLog}
        isSaving={isPending}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={isPending}
        assetName={deletingAsset?.name}
      />
    </div>
  );
});
AssetPage.displayName = "AssetPage";
