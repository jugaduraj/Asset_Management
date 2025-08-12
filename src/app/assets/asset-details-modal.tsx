"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import type { Asset } from "@/types";
import { X } from "lucide-react";

interface AssetDetailsModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
}

const DetailItem = ({ label, value }: { label: string; value?: string | null }) => (
  <div>
    <p className="text-sm font-semibold text-muted-foreground">{label}</p>
    <p className="text-sm text-foreground">{value || "N/A"}</p>
  </div>
);

export function AssetDetailsModal({
  asset,
  isOpen,
  onClose,
}: AssetDetailsModalProps) {

  if (!asset) return null;

  const employeeDisplay = asset.assignedEmployee
    ? `${asset.assignedEmployee.name} (${asset.assignedEmployee.employeeId.toUpperCase()})`
    : "Unassigned";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Asset Details - {asset.assetTag}</DialogTitle>
          <DialogClose asChild>
            <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogClose>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 py-4">
          <DetailItem label="Host Name:" value={asset.hostName} />
          <DetailItem label="Asset Type:" value={asset.type} />
          <DetailItem label="Make:" value={asset.make} />
          <DetailItem label="Model:" value={asset.model} />
          <DetailItem label="Serial No.:" value={asset.serialNo} />
          <DetailItem label="Processor:" value={asset.processor} />
          <DetailItem label="OS:" value={asset.os} />
          <DetailItem label="OS Version:" value={asset.osVersion} />
          <DetailItem label="RAM:" value={asset.ram} />
          <DetailItem label="HDD/SSD:" value={asset.hddSsd} />
          <DetailItem label="Location:" value={asset.location} />
          <DetailItem label="Status:" value={asset.status} />
          <DetailItem label="Warranty Status:" value={asset.warrantyStatus} />
          <DetailItem label="Warranty Expiration:" value={asset.warrantyExpiration ? new Date(asset.warrantyExpiration).toLocaleDateString() : 'N/A'} />
        </div>
        <div className="pt-2">
            <DetailItem label="Assigned To:" value={employeeDisplay} />
        </div>
        <div className="pt-2">
            <DetailItem label="Remarks:" value={asset.remark} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
