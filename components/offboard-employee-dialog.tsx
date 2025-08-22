
'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Employee, Asset } from '@/lib/types';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

interface OffboardEmployeeDialogProps {
  employee: Employee | null;
  assets: Asset[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmOffboarding: (employeeId: string, returnedAssetTags: string[]) => void;
}

export default function OffboardEmployeeDialog({
  employee,
  assets,
  isOpen,
  onOpenChange,
  onConfirmOffboarding,
}: OffboardEmployeeDialogProps) {
  const [returnedAssets, setReturnedAssets] = useState<Record<string, boolean>>({});

  const assignedAssets = useMemo(() => {
    if (!employee) return [];
    const assignedAssetTags = [
      employee.assetTag,
      employee.monitor1,
      employee.monitor2,
      employee.webcam,
      employee.dStation,
    ].filter(Boolean) as string[];
    
    return assets.filter(asset => assignedAssetTags.includes(asset.assetTag));
  }, [employee, assets]);

  useEffect(() => {
    if (isOpen) {
      const initialReturnedState: Record<string, boolean> = {};
      assignedAssets.forEach(asset => {
        initialReturnedState[asset.assetTag] = true; // Default all to returned
      });
      setReturnedAssets(initialReturnedState);
    }
  }, [isOpen, assignedAssets]);


  const handleCheckboxChange = (assetTag: string, checked: boolean) => {
    setReturnedAssets(prev => ({ ...prev, [assetTag]: checked }));
  };

  const handleConfirm = () => {
    if (!employee) return;
    const returnedAssetTags = Object.entries(returnedAssets)
      .filter(([, isReturned]) => isReturned)
      .map(([assetTag]) => assetTag);
    
    onConfirmOffboarding(employee._id, returnedAssetTags);
    onOpenChange(false);
  };
  
  const allAssetsMarked = Object.values(returnedAssets).every(Boolean);

  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Offboard Employee</DialogTitle>
          <DialogDescription>
            Confirm asset returns for {employee.name} to finalize the offboarding process.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <h4 className="font-semibold mb-2">Assigned Assets</h4>
          <Separator />
          <ScrollArea className="h-64 mt-4 pr-4">
            <div className="space-y-4">
                {assignedAssets.length > 0 ? (
                    assignedAssets.map(asset => (
                        <div key={asset._id} className="flex items-center justify-between p-2 border rounded-md">
                            <div>
                                <p className="font-medium">{asset.type}: {asset.make} {asset.model}</p>
                                <p className="text-sm text-muted-foreground">Tag: {asset.assetTag}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id={`return-${asset.assetTag}`}
                                    checked={returnedAssets[asset.assetTag] || false}
                                    onCheckedChange={(checked) => handleCheckboxChange(asset.assetTag, !!checked)}
                                />
                                <Label htmlFor={`return-${asset.assetTag}`}>Returned</Label>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-muted-foreground p-8">
                        No assets are assigned to this employee.
                    </div>
                )}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!allAssetsMarked && assignedAssets.length > 0}>
            Confirm Offboarding
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    