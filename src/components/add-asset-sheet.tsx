
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import type { Asset, AssetHistoryEvent } from "@/types";
import { Cpu } from "lucide-react";

const formSchema = z.object({
  assetTag: z.string().min(1, "Asset Tag is required."),
  hostName: z.string().min(1, "Hostname is required."),
  assetType: z.string({ required_error: "Please select an asset type." }),
  make: z.string().min(1, "Make is required."),
  model: z.string().min(1, "Model is required."),
  serialNumber: z.string().min(1, "Serial Number is required."),
  location: z.string().min(1, "Location is required."),
  status: z.enum(["Assigned", "Unassigned", "Under Maintenance"]),
  assignedTo: z.string().optional(),
  remark: z.string().optional(),
  warrantyExpiration: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  os: z.string().optional(),
  osVersion: z.string().optional(),
});

type AddAssetSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssetAdd: (asset: Asset) => void;
};

export function AddAssetSheet({ open, onOpenChange, onAssetAdd }: AddAssetSheetProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assetTag: "",
      hostName: "",
      make: "",
      model: "",
      serialNumber: "",
      location: "",
      status: "Unassigned",
      assignedTo: "",
      remark: "",
      warrantyExpiration: new Date().toISOString().split("T")[0],
      os: "",
      osVersion: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    
    const creationEvent: AssetHistoryEvent = {
        date: new Date().toISOString(),
        type: 'Created',
        description: `Asset created ${values.status === 'Assigned' && values.assignedTo ? 'and assigned to ' + values.assignedTo : ''}`.trim()
    }

    const newAsset: Asset = {
      ...values,
      processor: "", // Defaulting non-form fields
      ram: "",
      hddSsd: "",
      category: "Uncategorized", // Default category
      value: 0, // Default value
      warrantyStatus: new Date(values.warrantyExpiration) > new Date() ? "Active" : "Expired",
      history: [creationEvent],
      os: values.os || "",
      osVersion: values.osVersion || "",
    };

    onAssetAdd(newAsset);
    toast({
      title: "Asset Added",
      description: `Successfully added "${newAsset.assetTag}".`,
    });
    form.reset();
    onOpenChange(false);
  }

  const handleFetchSystemInfo = () => {
    const ua = navigator.userAgent;
    let os = "Unknown";
    let osVersion = "Unknown";

    if (ua.indexOf("Win") !== -1) {
        os = "Windows";
        const match = ua.match(/Windows NT (\d+\.\d+)/);
        if (match) {
            const version = match[1];
            if (version === "10.0") osVersion = "10/11";
            else if (version === "6.3") osVersion = "8.1";
            else if (version === "6.2") osVersion = "8";
            else if (version === "6.1") osVersion = "7";
        }
    }
    if (ua.indexOf("Mac") !== -1) {
        os = "macOS";
        const match = ua.match(/Mac OS X ([\d_]+)/);
        if (match) {
            osVersion = match[1].replace(/_/g, ".");
        }
    }
    if (ua.indexOf("Linux") !== -1) os = "Linux";
    
    form.setValue("os", os);
    form.setValue("osVersion", osVersion);

    toast({
        title: "System Info Fetched",
        description: `Detected OS: ${os} ${osVersion}`
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
            <SheetHeader>
              <SheetTitle>Add New Asset</SheetTitle>
              <SheetDescription>
                Fill in the details below to add a new asset to the system.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto py-6 px-1 space-y-4">
              <FormField
                control={form.control}
                name="assetTag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Tag</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., AST-1004" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="hostName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hostname</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Host-04" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                  control={form.control}
                  name="assetType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an asset type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Laptop">Laptop</SelectItem>
                          <SelectItem value="Server">Server</SelectItem>
                          <SelectItem value="Monitor">Monitor</SelectItem>
                          <SelectItem value="Smartphone">Smartphone</SelectItem>
                           <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Apple" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., MacBook Pro 16" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial No.</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., SN456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="os"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operating System</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Windows" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="osVersion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OS Version</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 11 Pro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Remote" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                         <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Assigned">Assigned</SelectItem>
                          <SelectItem value="Unassigned">Unassigned</SelectItem>
                          <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned To</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="warrantyExpiration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warranty Expiration</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="remark"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remark</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any notes about the asset..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <SheetFooter>
               <Button type="button" variant="secondary" onClick={handleFetchSystemInfo} className="mr-auto">
                <Cpu className="mr-2 h-4 w-4" />
                Fetch System Info
              </Button>
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <Button type="submit">Save Asset</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
