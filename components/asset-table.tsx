
'use client';

import type { Asset, AssetStatus } from '@/lib/types';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, Wrench, Trash2, Pencil, Eye } from 'lucide-react';
import { format } from 'date-fns';

type AssetTableProps = {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
  onLogMaintenance: (asset: Asset) => void;
};

const getStatusVariant = (status: AssetStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'Active':
      return 'default';
    case 'Inactive':
      return 'secondary';
    case 'In Repair':
      return 'outline';
    case 'Retired':
      return 'destructive';
    default:
      return 'secondary';
  }
};

export function AssetTable({ assets, onEdit, onDelete, onLogMaintenance }: AssetTableProps) {
  if (assets.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>No assets found.</p>
        <p className="text-sm">Try adjusting your filters or adding a new asset.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset Tag</TableHead>
            <TableHead>Host Name</TableHead>
            <TableHead className="hidden xl:table-cell">Asset Type</TableHead>
            <TableHead className="hidden lg:table-cell">Model</TableHead>
            <TableHead className="hidden xl:table-cell">Serial No.</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Assigned To</TableHead>
            <TableHead className="hidden xl:table-cell">Department</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell>
                <button
                    onClick={() => onEdit(asset)}
                    className="font-medium text-primary hover:underline"
                >
                    {asset.assetTag}
                </button>
              </TableCell>
              <TableCell>{asset.name}</TableCell>
              <TableCell className="hidden xl:table-cell">{asset.type}</TableCell>
              <TableCell className="hidden lg:table-cell">{asset.model}</TableCell>
              <TableCell className="hidden xl:table-cell">{asset.serialNumber}</TableCell>
              <TableCell className="hidden md:table-cell">{asset.category}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(asset.status)}>{asset.status}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">{asset.assignedUser}</TableCell>
              <TableCell className="hidden xl:table-cell">{asset.department}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => onEdit(asset)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit / View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onLogMaintenance(asset)}>
                      <Wrench className="mr-2 h-4 w-4" />
                      Maintenance Log
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => onDelete(asset)} className="text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Asset
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
