
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Asset } from '../lib/types';
import { format } from 'date-fns';
import { ScrollArea } from './ui/scroll-area';

interface ViewAssetDialogProps {
  asset: Asset | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ViewAssetDialog({ asset, isOpen, onOpenChange }: ViewAssetDialogProps) {
  if (!asset) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Asset Details</DialogTitle>
          <DialogDescription>
            Viewing details for Asset Tag: {asset.assetTag}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 py-4 text-sm">
                <div><span className="font-semibold text-muted-foreground">Asset Tag:</span> {asset.assetTag}</div>
                <div><span className="font-semibold text-muted-foreground">Host Name:</span> {asset.hostname || 'N/A'}</div>
                <div><span className="font-semibold text-muted-foreground">Asset Type:</span> {asset.type}</div>
                <div><span className="font-semibold text-muted-foreground">Make:</span> {asset.make || 'N/A'}</div>
                <div><span className="font-semibold text-muted-foreground">Model:</span> {asset.model || 'N/A'}</div>
                <div><span className="font-semibold text-muted-foreground">Serial No.:</span> {asset.serialNo || 'N/A'}</div>
                <div><span className="font-semibold text-muted-foreground">Processor:</span> {asset.processor || 'N/A'}</div>
                <div><span className="font-semibold text-muted-foreground">OS:</span> {asset.os || 'N/A'}</div>
                <div><span className="font-semibold text-muted-foreground">OS Version:</span> {asset.osVersion || 'N/A'}</div>
                <div><span className="font-semibold text-muted-foreground">RAM:</span> {asset.ram || 'N/A'}</div>
                <div><span className="font-semibold text-muted-foreground">HDD/SSD:</span> {asset.hddSsd || 'N/A'}</div>
                <div><span className="font-semibold text-muted-foreground">Location:</span> {asset.location || 'N/A'}</div>
                <div><span className="font-semibold text-muted-foreground">Status:</span> {asset.status}</div>
                <div><span className="font-semibold text-muted-foreground">Warranty Status:</span> {asset.warrantyStatus}</div>
                <div><span className="font-semibold text-muted-foreground">Warranty Expiration:</span> {asset.warrantyExpiration ? format(new Date(asset.warrantyExpiration), 'PPP') : 'N/A'}</div>
                <div><span className="font-semibold text-muted-foreground">Assigned To:</span> {asset.assignedTo || 'N/A'}</div>
                <div className="col-span-2"><span className="font-semibold text-muted-foreground">Remark:</span> {asset.remark || 'N/A'}</div>
                <div><span className="font-semibold text-muted-foreground">Created At:</span> {format(new Date(asset.createdAt), 'PPp')}</div>
            </div>
        </ScrollArea>
        <DialogFooter className="pt-4">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
