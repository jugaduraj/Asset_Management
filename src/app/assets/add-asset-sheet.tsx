"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import type { Asset, Employee, AssetStatus, WarrantyStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

interface AddAssetSheetProps {
  asset?: Asset | null;
  onSuccess?: (asset: Asset) => void;
  children?: React.ReactNode;
  employees: Employee[];
}

export function AddAssetSheet({ asset, onSuccess, children, employees }: AddAssetSheetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    
    const getInitialFormData = () => ({
        assetTag: "",
        hostName: "",
        type: "Laptop",
        make: "",
        model: "",
        serialNo: "",
        processor: "",
        os: "",
        osVersion: "",
        ram: "",
        hddSsd: "",
        location: "",
        status: "Active",
        remark: "",
        warrantyStatus: "Not Applicable",
        warrantyExpiration: "",
        assignedTo: "",
    });

    const [formData, setFormData] = useState(getInitialFormData());
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && asset) {
            setFormData({
                assetTag: asset.assetTag,
                hostName: asset.hostName || "",
                type: asset.type,
                make: asset.make || "",
                model: asset.model || "",
                serialNo: asset.serialNo || "",
                processor: asset.processor || "",
                os: asset.os || "",
                osVersion: asset.osVersion || "",
                ram: asset.ram || "",
                hddSsd: asset.hddSsd || "",
                location: asset.location || "",
                status: asset.status,
                remark: asset.remark || "",
                warrantyStatus: asset.warrantyStatus,
                warrantyExpiration: asset.warrantyExpiration ? new Date(asset.warrantyExpiration).toISOString().split('T')[0] : "",
                assignedTo: asset.assignedTo || "",
            });
        } else if (isOpen && !asset) {
            // Reset form when opening to add a new asset
            setFormData(getInitialFormData());
        }
    }, [asset, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const newAssetData: Asset = {
          id: asset ? asset.id : uuidv4(),
          createdAt: asset ? asset.createdAt : new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...formData,
          status: formData.status as AssetStatus,
          warrantyStatus: formData.warrantyStatus as WarrantyStatus,
          hostName: formData.hostName || null,
          make: formData.make || null,
          model: formData.model || null,
          serialNo: formData.serialNo || null,
          processor: formData.processor || null,
          os: formData.os || null,
          osVersion: formData.osVersion || null,
          ram: formData.ram || null,
          hddSsd: formData.hddSsd || null,
          location: formData.location || null,
          remark: formData.remark || null,
          warrantyExpiration: formData.warrantyExpiration || null,
          assignedTo: formData.assignedTo || null,
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        toast({ title: "Success", description: `Asset ${asset ? 'updated' : 'created'} successfully!` });
        onSuccess?.(newAssetData);
        setIsOpen(false);
        setLoading(false);
    };

    const assetTypes = ["Desktop", "Laptop", "Server", "Monitor", "Printer", "Router", "Switch", "Phone", "Tablet", "Firewall", "Access Point", "Webcam", "NVR", "Other"];
    const statusOptions = ["Active", "Inactive", "In Use", "In Stock", "Maintenance", "Retired"];
    const warrantyStatusOptions = ["Active", "Expired", "Not Applicable"];


  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children || (
            <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Asset
            </Button>
        )}
      </SheetTrigger>
      <SheetContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{asset ? "Edit Asset" : "Add New Asset"}</SheetTitle>
          <SheetDescription>
            Fill in the details for the asset. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assetTag">Asset Tag *</Label>
              <Input id="assetTag" value={formData.assetTag} onChange={(e) => setFormData({ ...formData, assetTag: e.target.value })} required />
            </div>

            <div>
              <Label htmlFor="hostName">Host Name</Label>
              <Input id="hostName" value={formData.hostName} onChange={(e) => setFormData({ ...formData, hostName: e.target.value })} />
            </div>

            <div>
                <Label htmlFor="asset_type">Asset Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger><SelectValue placeholder="Select asset type" /></SelectTrigger>
                    <SelectContent>
                    {assetTypes.map((type) => ( <SelectItem key={type} value={type}>{type}</SelectItem> ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
              <Label htmlFor="make">Make</Label>
              <Input id="make" value={formData.make} onChange={(e) => setFormData({ ...formData, make: e.target.value })} />
            </div>

            <div>
              <Label htmlFor="model">Model</Label>
              <Input id="model" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} />
            </div>

            <div>
              <Label htmlFor="serialNo">Serial No.</Label>
              <Input id="serialNo" value={formData.serialNo} onChange={(e) => setFormData({ ...formData, serialNo: e.target.value })} />
            </div>

            <div>
              <Label htmlFor="processor">Processor</Label>
              <Input id="processor" value={formData.processor} onChange={(e) => setFormData({ ...formData, processor: e.target.value })} />
            </div>

            <div>
              <Label htmlFor="os">OS</Label>
              <Input id="os" value={formData.os} onChange={(e) => setFormData({ ...formData, os: e.target.value })} />
            </div>

            <div>
              <Label htmlFor="osVersion">OS Version</Label>
              <Input id="osVersion" value={formData.osVersion} onChange={(e) => setFormData({ ...formData, osVersion: e.target.value })} />
            </div>

            <div>
              <Label htmlFor="ram">RAM</Label>
              <Input id="ram" value={formData.ram} onChange={(e) => setFormData({ ...formData, ram: e.target.value })} placeholder="e.g. 8GB, 16GB" />
            </div>

            <div>
              <Label htmlFor="hddSsd">HDD/SSD</Label>
              <Input id="hddSsd" value={formData.hddSsd} onChange={(e) => setFormData({ ...formData, hddSsd: e.target.value })} placeholder="e.g. 500GB SSD, 1TB HDD"/>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}/>
            </div>

            <div>
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                    {statusOptions.map((status) => (<SelectItem key={status} value={status}>{status}</SelectItem>))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="warranty_status">Warranty Status *</Label>
                <Select value={formData.warrantyStatus} onValueChange={(value: any) => setFormData({ ...formData, warrantyStatus: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {warrantyStatusOptions.map((status) => (<SelectItem key={status} value={status}>{status}</SelectItem>))}
                    </SelectContent>
                </Select>
            </div>

            <div>
              <Label htmlFor="warrantyExpiration">Warranty Expiration Date</Label>
              <Input id="warrantyExpiration" type="date" value={formData.warrantyExpiration} onChange={(e) => setFormData({ ...formData, warrantyExpiration: e.target.value })}/>
            </div>
            
            <div>
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Select value={formData.assignedTo} onValueChange={(value) => setFormData({ ...formData, assignedTo: value === "unassigned" ? "" : value })}>
                <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} ({employee.employeeId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Remark</Label>
            <Textarea id="notes" value={formData.remark} onChange={(e) => setFormData({ ...formData, remark: e.target.value })} rows={3}/>
          </div>
        
            <SheetFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : asset ? "Update Asset" : "Create Asset"}
                </Button>
            </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
