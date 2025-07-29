'use client';

import { useState, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CalendarIcon, Bot, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import type { Asset, AssetStatus, AssetType, WarrantyStatus } from '@/lib/types';
import { assetStatuses, assetTypes, warrantyStatuses } from '@/lib/types';
import { suggestCategoryAction } from '@/lib/actions';
import { useToast } from "@/hooks/use-toast";

const assetSchema = z.object({
  name: z.string().min(2, 'Host Name must be at least 2 characters.'),
  assetTag: z.string().min(2, 'Asset Tag is required.'),
  type: z.enum(assetTypes),
  make: z.string().min(2, 'Make is required.'),
  model: z.string().min(2, 'Model is required.'),
  serialNumber: z.string().min(2, 'Serial number is required.'),
  processor: z.string().optional(),
  os: z.string().optional(),
  osVersion: z.string().optional(),
  ram: z.string().optional(),
  storage: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(assetStatuses),
  assignedUser: z.string().min(2, 'Assigned To is required.'),
  remark: z.string().optional(),
  warrantyStatus: z.enum(warrantyStatuses),
  warrantyExpirationDate: z.date().optional(),
  purchaseDate: z.date({ required_error: 'Purchase date is required.' }),
  department: z.string().min(2, 'Department is required.'),
  category: z.string().min(2, 'Category is required.'),
  licenseInfo: z.string().optional(),
}).refine(data => !(data.type === 'Software' && !data.licenseInfo), {
  message: "License info is required for software assets.",
  path: ["licenseInfo"],
});

type AssetFormValues = z.infer<typeof assetSchema>;

type AssetDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: Omit<Asset, 'id' | 'maintenanceHistory'>, id?: string) => void;
  asset?: Asset | null;
};

export function AssetDialog({ open, onOpenChange, onSave, asset }: AssetDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: '',
      assetTag: '',
      type: 'Hardware',
      make: '',
      model: '',
      serialNumber: '',
      processor: '',
      os: '',
      osVersion: '',
      ram: '',
      storage: '',
      location: '',
      status: 'Active',
      assignedUser: '',
      remark: '',
      warrantyStatus: 'Expired',
      department: '',
      category: '',
      licenseInfo: '',
    },
  });
  
  const watchedType = form.watch('type');

  useEffect(() => {
    if (asset) {
      form.reset({
        ...asset,
        purchaseDate: new Date(asset.purchaseDate),
        warrantyExpirationDate: asset.warrantyExpirationDate ? new Date(asset.warrantyExpirationDate) : undefined,
      });
    } else {
      form.reset();
    }
    setSuggestedCategories([]);
  }, [asset, form, open]);

  const handleSuggestCategory = () => {
    const { name, model, serialNumber, make } = form.getValues();
    if (!name && !model && !serialNumber && !make) {
        toast({
            title: "Cannot Suggest Category",
            description: "Please fill in Name, Make, Model, or Serial Number for AI suggestions.",
            variant: "destructive"
        })
      return;
    }
    
    startTransition(async () => {
      const assetDetails = `Name: ${name}, Make: ${make}, Model: ${model}, Serial Number: ${serialNumber}`;
      const suggestions = await suggestCategoryAction({ assetDetails });
      setSuggestedCategories(suggestions);
    });
  };

  const onSubmit = (values: AssetFormValues) => {
    onSave({
        ...values,
        purchaseDate: format(values.purchaseDate, 'yyyy-MM-dd'),
        warrantyExpirationDate: values.warrantyExpirationDate ? format(values.warrantyExpirationDate, 'yyyy-MM-dd') : undefined,
    }, asset?.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{asset ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
          <DialogDescription>
            {asset ? 'Update the details of the existing asset.' : 'Fill in the details for the new asset.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="assetTag" render={({ field }) => (
                <FormItem><FormLabel>Asset Tag</FormLabel><FormControl><Input placeholder="e.g., ASSET-001" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Host Name</FormLabel><FormControl><Input placeholder="e.g., Marketing-Laptop-01" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem><FormLabel>Asset Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select asset type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Hardware">Hardware</SelectItem><SelectItem value="Software">Software</SelectItem></SelectContent></Select><FormMessage /></FormItem>
              )} />
                <FormField control={form.control} name="make" render={({ field }) => (
                    <FormItem><FormLabel>Make</FormLabel><FormControl><Input placeholder="e.g., Dell, Apple, Adobe" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="model" render={({ field }) => (
                <FormItem><FormLabel>Model</FormLabel><FormControl><Input placeholder="e.g., XPS 15" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="serialNumber" render={({ field }) => (
                <FormItem><FormLabel>Serial No. / License Key</FormLabel><FormControl><Input placeholder="e.g., SN-XYZ789" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
               <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="e.g., Workstation, Server, License" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div>
                <Button type="button" variant="outline" size="sm" onClick={handleSuggestCategory} disabled={isPending} className="mt-7">
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                  Suggest with AI
                </Button>
                {suggestedCategories.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {suggestedCategories.map(cat => (
                      <Badge key={cat} variant="secondary" className="cursor-pointer" onClick={() => form.setValue('category', cat, { shouldValidate: true })}>
                        {cat}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {watchedType === 'Hardware' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="processor" render={({ field }) => (
                            <FormItem><FormLabel>Processor</FormLabel><FormControl><Input placeholder="e.g., Intel Core i7" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="ram" render={({ field }) => (
                            <FormItem><FormLabel>RAM</FormLabel><FormControl><Input placeholder="e.g., 16GB DDR4" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="storage" render={({ field }) => (
                            <FormItem><FormLabel>HDD/SSD</FormLabel><FormControl><Input placeholder="e.g., 512GB SSD" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="os" render={({ field }) => (
                            <FormItem><FormLabel>OS</FormLabel><FormControl><Input placeholder="e.g., Windows 11 Pro" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="osVersion" render={({ field }) => (
                            <FormItem><FormLabel>OS Version</FormLabel><FormControl><Input placeholder="e.g., 23H2" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                </>
            )}

            {watchedType === 'Software' && (
              <FormField control={form.control} name="licenseInfo" render={({ field }) => (
                <FormItem><FormLabel>License Information</FormLabel><FormControl><Textarea placeholder="e.g., Subscription valid until..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField control={form.control} name="purchaseDate" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Purchase Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                  <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                </PopoverContent></Popover><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent>
                  {assetStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                </SelectContent></Select><FormMessage /></FormItem>
              )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="warrantyStatus" render={({ field }) => (
                    <FormItem><FormLabel>Warranty Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select warranty status" /></SelectTrigger></FormControl><SelectContent>
                        {warrantyStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                    </SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="warrantyExpirationDate" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Warranty Expiration Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                    <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                    </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent></Popover><FormMessage /></FormItem>
                )} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="assignedUser" render={({ field }) => (
                <FormItem><FormLabel>Assigned To</FormLabel><FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="department" render={({ field }) => (
                <FormItem><FormLabel>Department</FormLabel><FormControl><Input placeholder="e.g., Marketing" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., Main Office, Rack 5" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>

            <FormField control={form.control} name="remark" render={({ field }) => (
                <FormItem><FormLabel>Remark</FormLabel><FormControl><Textarea placeholder="Any additional notes..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            
            <DialogFooter className="pt-4 pr-6">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Asset</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
