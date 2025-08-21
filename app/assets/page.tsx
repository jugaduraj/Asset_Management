
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Asset, Employee } from '@/lib/types';
import {
  Plus,
  Upload,
  Database,
  CheckCircle,
  Wrench,
  AlertTriangle,
  Laptop,
  Search,
  Eye,
  FilePenLine,
  Trash2,
  Loader2,
  Smartphone,
  Server,
  Monitor,
  HardDrive,
  Printer,
  Router,
  Network,
  Tablet,
  Shield,
  Wifi,
  Video,
  Camera,
  XCircle,
  Tv,
} from 'lucide-react';
import AddAssetDialog from '@/components/add-asset-dialog';
import { format } from 'date-fns';
import ViewAssetDialog from '@/components/view-asset-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { createLog, exportToCsv } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';


const AssetTypeIcon = ({ type }: { type: string }) => {
    const iconProps = { className: 'h-5 w-5' };
    switch (type) {
        case 'Laptop': return <Laptop {...iconProps} />;
        case 'Desktop': return <Monitor {...iconProps} />;
        case 'Monitor': return <Monitor {...iconProps} />;
        case 'Docking Station': return <HardDrive {...iconProps} />;
        case 'Printer': return <Printer {...iconProps} />;
        case 'Router': return <Router {...iconProps} />;
        case 'Switch': return <Network {...iconProps} />;
        case 'Phone': return <Smartphone {...iconProps} />;
        case 'Tablet': return <Tablet {...iconProps} />;
        case 'Firewall': return <Shield {...iconProps} />;
        case 'Access Point': return <Wifi {...iconProps} />;
        case 'Webcam': return <Camera {...iconProps} />;
        case 'NVR': return <Video {...iconProps} />;
        case 'Server': return <Server {...iconProps} />;
        case 'TV': return <Tv {...iconProps} />;
        case 'Other': return <Server {...iconProps} />;
        default: return <Server {...iconProps} />;
    }
}


export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isViewDialogOpen, setViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const fetchAssets = useCallback(async () => {
    try {
      const response = await fetch('/api/assets');
      const data = await response.json();
      setAssets(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error fetching assets' });
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await fetch('/api/employees');
      const data = await response.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error fetching employees' });
      setEmployees([]);
    }
  }, [toast]);

  useEffect(() => {
    fetchAssets();
    fetchEmployees();
  }, [fetchAssets, fetchEmployees]);
  
  const handleAddAsset = async (newAsset: Omit<Asset, '_id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAsset),
      });
      if (!response.ok) throw new Error('Failed to add asset');
      toast({ title: 'Asset added successfully' });
      await createLog('Admin User', 'Created Asset', `New asset with tag ${newAsset.assetTag} was created.`);
      fetchAssets(); // Refresh asset list
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error adding asset' });
    }
  };
  
  const handleUpdateAsset = async (asset: Asset | Omit<Asset, '_id' | 'createdAt'>) => {
    if (!('_id' in asset)) {
      toast({ variant: 'destructive', title: 'Error updating asset', description: 'Asset ID is missing.' });
      return;
    }
    const updatedAsset = asset as Asset;

    try {
      const { _id, ...assetData } = updatedAsset;
      const response = await fetch('/api/assets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({_id: _id, ...assetData}),
      });
      if (!response.ok) throw new Error('Failed to update asset');
      toast({ title: 'Asset updated successfully' });
      await createLog('Admin User', 'Updated Asset', `Asset with tag ${updatedAsset.assetTag} was updated.`);
      fetchAssets(); // Refresh asset list
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error updating asset' });
    }
    setSelectedAsset(null);
  };

  const handleDeleteAsset = async (assetId: string) => {
    try {
      const assetToDelete = assets.find(a => a._id === assetId);
      const response = await fetch('/api/assets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: assetId }),
      });
      if (!response.ok) throw new Error('Failed to delete asset');
      toast({ title: 'Asset deleted successfully' });
      if(assetToDelete) {
        await createLog('Admin User', 'Deleted Asset', `Asset with tag ${assetToDelete.assetTag} was deleted.`);
      }
      fetchAssets(); // Refresh asset list
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error deleting asset' });
    }
  }

  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setViewDialogOpen(true);
  }
  
  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setEditDialogOpen(true);
  }

  const assetTypes = useMemo(() => {
    if (!Array.isArray(assets)) return [];
    return assets.reduce((acc, asset) => {
        const type = asset.type || 'Other';
        if (!acc[type]) {
            acc[type] = 0;
        }
        acc[type]++;
        return acc;
    }, {} as Record<string, number>);
  }, [assets]);

  const filteredAssets = useMemo(() => {
    let filtered = Array.isArray(assets) ? assets : [];
    if (typeFilter) {
      filtered = filtered.filter(asset => asset.type === typeFilter);
    }
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(asset =>
        asset.assetTag.toLowerCase().includes(lowercasedTerm) ||
        (asset.hostname && asset.hostname.toLowerCase().includes(lowercasedTerm)) ||
        (asset.location && asset.location.toLowerCase().includes(lowercasedTerm)) ||
        (asset.make && asset.make.toLowerCase().includes(lowercasedTerm)) ||
        (asset.model && asset.model.toLowerCase().includes(lowercasedTerm))
      );
    }
    return filtered;
  }, [assets, typeFilter, searchTerm]);

  const handleExport = () => {
    if(filteredAssets.length > 0) {
      exportToCsv(filteredAssets, `assets-export-${new Date().toISOString().split('T')[0]}.csv`);
      toast({ title: 'Export Successful', description: 'Asset data has been exported to CSV.' });
    } else {
      toast({ variant: 'destructive', title: 'Export Failed', description: 'No data available to export.' });
    }
  }
  
  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return (
    <>
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">IT Asset Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Upload className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <AddAssetDialog onAssetSubmit={handleAddAsset} employees={employees}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Asset
            </Button>
          </AddAssetDialog>
        </div>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Assets
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Array.isArray(assets) ? assets.length : 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Assets
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Array.isArray(assets) ? assets.filter(a => a.status === 'Active').length : 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Under Maintenance
            </CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Array.isArray(assets) ? assets.filter(a => a.status === 'In Repair').length : 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Warranty Expiring Soon
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Expiring in next 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Asset Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-40">
                <div className="space-y-2">
                 {Object.entries(assetTypes).length > 0 ? (
                    Object.entries(assetTypes).map(([type, count]) => (
                        <div key={type}
                           onClick={() => setTypeFilter(type)}
                           className={cn(
                            "flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors",
                            typeFilter === type ? "bg-muted" : "hover:bg-muted/50"
                           )}
                        >
                            <div className="flex items-center gap-2">
                                <AssetTypeIcon type={type} />
                                <span className="font-medium">{type}</span>
                            </div>
                            <Badge variant={typeFilter === type ? "default" : "secondary"}>{count}</Badge>
                        </div>
                    ))
                 ) : (
                    <div className="flex items-center justify-center text-muted-foreground h-32">
                        No asset types found.
                    </div>
                 )}
                </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                placeholder="Search assets by tag, hostname, location, make, or model..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {typeFilter && (
                <Button variant="ghost" onClick={() => setTypeFilter(null)} className="ml-4">
                    <XCircle className="mr-2 h-4 w-4"/>
                    Clear Filter
                </Button>
            )}
           </div>
        </CardHeader>
        <CardContent>
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.length > 0 ? filteredAssets.map((asset) => (
                <TableRow key={asset._id}>
                  <TableCell>{asset.assetTag}</TableCell>
                  <TableCell>{asset.hostname}</TableCell>
                  <TableCell>{asset.type}</TableCell>
                  <TableCell>{asset.make} {asset.model}</TableCell>
                  <TableCell>{asset.assignedTo}</TableCell>
                  <TableCell>{asset.location}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        asset.status === 'Inactive'
                          ? 'outline'
                          : 'default'
                      }
                    >
                      {asset.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <Badge variant={asset.warrantyExpiration ? (new Date(asset.warrantyExpiration) < new Date() ? 'destructive' : 'default') : 'outline'}>
                        {asset.warrantyExpiration ? (new Date(asset.warrantyExpiration) < new Date() ? 'Expired' : 'Active') : 'N/A'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                         {asset.warrantyExpiration ? format(new Date(asset.warrantyExpiration), 'P') : ''}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewAsset(asset)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEditAsset(asset)}>
                        <FilePenLine className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the asset
                              and remove its data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteAsset(asset._id)}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center h-24">
                      No assets found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {selectedAsset && <ViewAssetDialog asset={selectedAsset} isOpen={isViewDialogOpen} onOpenChange={setViewDialogOpen}/>}

      {selectedAsset && (
          <AddAssetDialog 
              asset={selectedAsset}
              isOpen={isEditDialogOpen}
              onOpenChange={setEditDialogOpen}
              onAssetSubmit={handleUpdateAsset}
              employees={employees}
          />
      )}
    </>
  );
}

    