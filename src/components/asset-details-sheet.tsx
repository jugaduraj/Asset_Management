
import type { Asset, AssetHistoryEvent } from "@/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wrench, PackagePlus, HardDrive, CircleCheck } from "lucide-react";


interface AssetDetailsSheetProps {
  asset: Asset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const historyIconMap: Record<AssetHistoryEvent['type'], React.ReactNode> = {
    "Repair": <Wrench className="h-5 w-5 text-destructive" />,
    "Software Installation": <PackagePlus className="h-5 w-5 text-blue-500" />,
    "Maintenance": <HardDrive className="h-5 w-5 text-gray-500" />,
    "Created": <CircleCheck className="h-5 w-5 text-green-500" />
};

export function AssetDetailsSheet({ asset, open, onOpenChange }: AssetDetailsSheetProps) {
  if (!asset) return null;

  const formattedWarranty = new Intl.DateTimeFormat("en-US", {
      year: 'numeric', month: 'long', day: 'numeric' 
  }).format(new Date(asset.warrantyExpiration));

  const statusVariant = {
    "Assigned": "default",
    "Unassigned": "secondary",
    "Under Maintenance": "destructive",
  }[asset.status] as "default" | "secondary" | "destructive" | "outline" | null | undefined;
  
   const warrantyStatusVariant = {
    "Active": "default",
    "Expired": "destructive",
  }[asset.warrantyStatus] as "default" | "secondary" | "destructive" | "outline" | null | undefined;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl w-full flex flex-col">
        <SheetHeader className="text-left">
          <SheetTitle>{asset.make} {asset.model}</SheetTitle>
          <SheetDescription>Asset Tag: {asset.assetTag}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 pr-6 -mr-6">
            <div className="py-6 space-y-6">
                <div className="space-y-4">
                    <h3 className="font-medium text-lg">Asset Details</h3>
                     <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <span className="text-muted-foreground">Asset Type</span>
                        <span className="text-right">{asset.assetType}</span>
                        
                        <span className="text-muted-foreground">Hostname</span>
                        <span className="text-right">{asset.hostName}</span>

                        <span className="text-muted-foreground">Serial No.</span>
                        <span className="text-right">{asset.serialNumber}</span>

                        <span className="text-muted-foreground">Location</span>
                        <span className="text-right">{asset.location}</span>

                        <span className="text-muted-foreground">Status</span>
                        <div className="text-right"><Badge variant={statusVariant}>{asset.status}</Badge></div>
                        
                        <span className="text-muted-foreground">Assigned To</span>
                        <span className="text-right">{asset.assignedTo || "N/A"}</span>
                    </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                    <h3 className="font-medium text-lg">Technical Specifications</h3>
                     <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <span className="text-muted-foreground">Processor</span>
                        <span className="text-right">{asset.processor || "N/A"}</span>

                        <span className="text-muted-foreground">Operating System</span>
                        <span className="text-right">{asset.os ? `${asset.os} ${asset.osVersion}` : "N/A"}</span>
                        
                         <span className="text-muted-foreground">RAM</span>
                        <span className="text-right">{asset.ram || "N/A"}</span>
                        
                         <span className="text-muted-foreground">Storage</span>
                        <span className="text-right">{asset.hddSsd || "N/A"}</span>
                    </div>
                </div>
                
                 <Separator />
                 
                <div className="space-y-4">
                    <h3 className="font-medium text-lg">Warranty Information</h3>
                     <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <span className="text-muted-foreground">Warranty Status</span>
                        <div className="text-right"><Badge variant={warrantyStatusVariant}>{asset.warrantyStatus}</Badge></div>
                        
                        <span className="text-muted-foreground">Expiration Date</span>
                        <span className="text-right">{formattedWarranty}</span>
                    </div>
                </div>

                 <Separator />

                 <div className="space-y-4">
                    <h3 className="font-medium text-lg">Asset History</h3>
                    <div className="relative pl-6">
                        <div className="absolute left-0 top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
                        <ul className="space-y-8">
                            {asset.history?.map((event, index) => (
                                <li key={index} className="flex items-start gap-4">
                                    <div className="flex-shrink-0 bg-background rounded-full p-2 border absolute left-0 -translate-x-1/2">
                                        {historyIconMap[event.type]}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <p className="font-medium">{event.type}</p>
                                            <time className="text-xs text-muted-foreground">
                                                {new Intl.DateTimeFormat("en-US", {dateStyle: 'medium'}).format(new Date(event.date))}
                                            </time>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{event.description}</p>
                                    </div>
                                </li>
                             ))}
                        </ul>
                    </div>
                </div>

                 <Separator />

                 <div className="space-y-2">
                    <h3 className="font-medium text-lg">Remarks</h3>
                    <p className="text-sm text-muted-foreground">{asset.remark || "No remarks."}</p>
                </div>
            </div>
        </ScrollArea>
        <SheetFooter className="mt-auto pt-6">
            <Button onClick={() => onOpenChange(false)} className="w-full">Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
