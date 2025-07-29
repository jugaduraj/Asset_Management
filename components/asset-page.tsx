
'use client';

import { useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import { AssetTable } from '@/components/asset-table';
import { AssetDialog } from '@/components/asset-dialog';
import { MaintenanceDialog } from '@/components/maintenance-dialog';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Boxes, PlusCircle, Search, Download } from 'lucide-react';
import type { Asset, MaintenanceEntry, AssetStatus, AssetType, LogEntry } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { initialAssets } from '@/lib/data';
import { downloadCsv } from '@/lib/export';

type AssetPageProps = {
  addLogEntry: (log: Omit<LogEntry, 'id'>) => void;
}

export const AssetPage = forwardRef(({ addLogEntry }: AssetPageProps, ref) => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
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
    const user = 'Guest User'; // In a real app, this would come from auth
    if (id) {
      setAssets(assets.map(a => a.id === id ? { ...a, ...values, maintenanceHistory: a.maintenanceHistory } : a));
      toast({ title: "Asset Updated", description: `Successfully updated ${values.name}.` });
      addLogEntry({
          timestamp: new Date().toISOString(),
          user,
          action: 'Updated Asset',
          details: `Asset "${values.name}" (${values.assetTag}) was updated.`
      });
    } else {
      const newAsset: Asset = {
        ...values,
        id: new Date().toISOString(),
        maintenanceHistory: [],
      };
      setAssets([...assets, newAsset]);
      toast({ title: "Asset Added", description: `Successfully added ${values.name}.` });
      addLogEntry({
          timestamp: new Date().toISOString(),
          user,
          action: 'Created Asset',
          details: `Asset "${values.name}" (${values.assetTag}) was created.`
      });
    }
    setIsAssetDialogOpen(false);
    setEditingAsset(null);
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
    const user = 'Guest User'; // In a real app, this would come from auth
    let assetName = '';
    setAssets(assets.map(a => {
        if (a.id === assetId) {
            assetName = a.name;
            const newLog = {...log, id: new Date().toISOString()};
            return { ...a, maintenanceHistory: [...a.maintenanceHistory, newLog] };
        }
        return a;
    }));
    toast({ title: "Maintenance Logged", description: `New maintenance entry added for asset.` });
    addLogEntry({
        timestamp: new Date().toISOString(),
        user,
        action: 'Logged Maintenance',
        details: `Maintenance logged for "${assetName}": ${log.description}`
    });
  };


  const handleOpenDeleteDialog = (asset: Asset) => {
    setDeletingAsset(asset);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    const user = 'Guest User'; // In a real app, this would come from auth
    if (deletingAsset) {
      setAssets(assets.filter(a => a.id !== deletingAsset.id));
      toast({ title: "Asset Deleted", description: `Successfully deleted ${deletingAsset.name}.`, variant: "destructive" });
      addLogEntry({
          timestamp: new Date().toISOString(),
          user,
          action: 'Deleted Asset',
          details: `Asset "${deletingAsset.name}" (${deletingAsset.assetTag}) was deleted.`
      });
      setIsDeleteDialogOpen(false);
      setDeletingAsset(null);
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
            <AssetTable
              assets={filteredAssets}
              onEdit={handleOpenEditDialog}
              onDelete={handleOpenDeleteDialog}
              onLogMaintenance={handleOpenMaintenanceDialog}
            />
          </CardContent>
        </Card>

      <AssetDialog
        open={isAssetDialogOpen}
        onOpenChange={setIsAssetDialogOpen}
        onSave={handleSaveAsset}
        asset={editingAsset}
      />
      
      <MaintenanceDialog
        open={isMaintenanceDialogOpen}
        onOpenChange={setIsMaintenanceDialogOpen}
        asset={maintenanceAsset}
        onSaveLog={handleSaveMaintenanceLog}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        assetName={deletingAsset?.name}
      />
    </div>
  );
});
AssetPage.displayName = "AssetPage";
