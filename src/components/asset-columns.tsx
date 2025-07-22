
"use client";

import type { Asset } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "./ui/checkbox";

export const getColumns = (
  onEdit: (asset: Asset) => void,
  onDelete: (assetId: string) => void
): ColumnDef<Asset>[] => [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
  {
    accessorKey: "assetTag",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Asset Tag
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("assetTag")}</div>,
  },
  {
    accessorKey: "hostName",
    header: "Host Name",
  },
  {
    accessorKey: "assetType",
    header: "Asset Type",
  },
   {
    accessorKey: "make",
    header: "Make",
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "serialNumber",
    header: "Serial No.",
  },
  {
    accessorKey: "processor",
    header: "Processor",
  },
  {
      accessorKey: "os",
      header: "OS",
  },
  {
      accessorKey: "osVersion",
      header: "OS Version"
  },
  {
      accessorKey: "ram",
      header: "RAM"
  },
  {
      accessorKey: "hddSsd",
      header: "HDD/SSD"
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant = {
        Assigned: "default",
        Unassigned: "secondary",
        "Under Maintenance": "destructive",
      }[status] as "default" | "secondary" | "destructive" | "outline" | null | undefined;
      return (
        <Badge variant={variant} className="capitalize">{status}</Badge>
      )
    },
  },
  {
      accessorKey: "assignedTo",
      header: "Assigned To"
  },
  {
      accessorKey: "remark",
      header: "Remark"
  },
    {
    accessorKey: "warrantyStatus",
    header: "Warranty Status",
    cell: ({ row }) => {
        const status = row.getValue("warrantyStatus") as string;
        const variant = {
            Active: "default",
            Expired: "destructive",
        }[status] as "default" | "secondary" | "destructive" | "outline" | null | undefined;
        return <Badge variant={variant}>{status}</Badge>
    }
  },
  {
      accessorKey: "warrantyExpiration",
      header: "Warranty Expiration Date"
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const asset = row.original;

      return (
        <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(asset)}>Edit</Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(asset.assetTag)}>Delete</Button>
        </div>
      );
    },
  },
];

