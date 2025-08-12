"use client";

import type { Asset } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Laptop,
  Monitor,
  Server,
  Printer,
  Router,
  Smartphone,
  Tablet,
  HardDrive,
  LucideIcon,
  PcCase,
  Network,
  Shield,
  Wifi,
  Video,
  Camera,
} from "lucide-react";
import { Badge } from "../ui/badge";

interface AssetTypeBreakdownProps {
  assets: Asset[];
}

const iconMap: Record<string, LucideIcon> = {
  Laptop: Laptop,
  Desktop: PcCase,
  Server: Server,
  Monitor: Monitor,
  Printer: Printer,
  Router: Router,
  Switch: Network,
  Phone: Smartphone,
  Tablet: Tablet,
  Firewall: Shield,
  "Access Point": Wifi,
  Webcam: Camera,
  NVR: Video,
  Other: HardDrive,
};

export function AssetTypeBreakdown({ assets }: AssetTypeBreakdownProps) {
  const assetTypeCounts = assets.reduce((acc, asset) => {
    acc[asset.type] = (acc[asset.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedAssetTypes = Object.entries(assetTypeCounts).sort(([, a], [, b]) => b - a);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Types</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedAssetTypes.map(([type, count]) => {
                const Icon = iconMap[type] || HardDrive;
                return (
                    <div key={type} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium text-sm">{type}</span>
                        </div>
                        <Badge variant="secondary">{count}</Badge>
                    </div>
                )
            })}
        </div>
      </CardContent>
    </Card>
  );
}
