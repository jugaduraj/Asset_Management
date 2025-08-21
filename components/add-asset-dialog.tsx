
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from './ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Calendar } from './ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Asset, Employee } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from './ui/textarea';

const assetFormSchema = z.object({
  assetTag: z.string().min(1, 'Asset Tag is required'),
  hostname: z.string().optional(),
  type: z.string().min(1, 'Asset Type is required'),
  make: z.string().optional(),
  model: z.string().optional(),
  serialNo: z.string().optional(),
  processor: z.string().optional(),
  os: z.string().optional(),
  osVersion: z.string().optional(),
  ram: z.string().optional(),
  hddSsd: z.string().optional(),
  location: z.string().optional(),
  status: z.string().min(1, 'Status is required'),
  warrantyStatus: z.string().min(1, 'Warranty Status is required'),
  warrantyExpiration: z.date().optional().nullable(),
  assignedTo: z.string().optional(),
  remark: z.string().optional(),
});

type AssetFormValues = z.infer<typeof assetFormSchema>;

interface AddAssetDialogProps {
  children?: React.ReactNode;
  onAssetSubmit: (asset: Asset | Omit<Asset, '_id' | 'createdAt'>) => void;
  asset?: Asset | null;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  employees: Employee[];
}

export default function AddAssetDialog({ children, onAssetSubmit, asset, isOpen: controlledIsOpen, onOpenChange: controlledOnOpenChange, employees }: AddAssetDialogProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined && controlledOnOpenChange !== undefined;

  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const setOpen = isControlled ? controlledOnOpenChange : setInternalIsOpen;

  const isEditing = !!asset;

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      assetTag: '',
      hostname: '',
      type: 'Laptop',
      make: '',
      model: '',
      serialNo: '',
      processor: '',
      os: '',
      osVersion: '',
      ram: '',
      hddSsd: '',
      location: '',
      status: 'Active',
      warrantyStatus: 'Not Applicable',
      assignedTo: 'Unassigned',
      remark: '',
      warrantyExpiration: null,
    },
  });

  useEffect(() => {
    if (isEditing && asset) {
        form.reset({
            ...asset,
            warrantyExpiration: asset.warrantyExpiration ? new Date(asset.warrantyExpiration) : null,
        })
    } else {
        form.reset({
             assetTag: '',
              hostname: '',
              type: 'Laptop',
              make: '',
              model: '',
              serialNo: '',
              processor: '',
              os: '',
              osVersion: '',
              ram: '',
              hddSsd: '',
              location: '',
              status: 'Active',
              warrantyStatus: 'Not Applicable',
              assignedTo: 'Unassigned',
              remark: '',
              warrantyExpiration: null,
        })
    }
  }, [asset, isEditing, form, isOpen])

  function onSubmit(data: AssetFormValues) {
    const newOrUpdatedAsset = {
      ...(asset || {}),
      ...data,
      warrantyExpiration: data.warrantyExpiration?.toISOString(),
    };
    onAssetSubmit(newOrUpdatedAsset as Asset | Omit<Asset, '_id' | 'createdAt'>);
    setOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details for the asset.' : 'Fill in the details for the asset.'} Click save when you\'re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[60vh] pr-6">
              <div className="grid grid-cols-2 gap-4 py-4">
                <FormField
                  control={form.control}
                  name="assetTag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Tag *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hostname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Host Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Type *</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an asset type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Laptop">Laptop</SelectItem>
                          <SelectItem value="Desktop">Desktop</SelectItem>
                          <SelectItem value="Monitor">Monitor</SelectItem>
                          <SelectItem value="Docking Station">Docking Station</SelectItem>
                          <SelectItem value="Printer">Printer</SelectItem>
                          <SelectItem value="Router">Router</SelectItem>
                          <SelectItem value="Switch">Switch</SelectItem>
                          <SelectItem value="Phone">Phone</SelectItem>
                          <SelectItem value="Tablet">Tablet</SelectItem>
                          <SelectItem value="Firewall">Firewall</SelectItem>
                          <SelectItem value="Access Point">Access Point</SelectItem>
                          <SelectItem value="Webcam">Webcam</SelectItem>
                          <SelectItem value="NVR">NVR</SelectItem>
                          <SelectItem value="Server">Server</SelectItem>
                          <SelectItem value="TV">TV</SelectItem>
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
                        <Input {...field} />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serialNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serial No.</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="processor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Processor</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>OS</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RAM</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 8GB, 16GB" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hddSsd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>HDD/SSD</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 500GB SSD, 1T" {...field} />
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
                        <Input {...field} />
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
                      <FormLabel>Status *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="In Repair">In Repair</SelectItem>
                          <SelectItem value="Retired">Retired</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="warrantyStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warranty Status *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select warranty status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="warrantyExpiration"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Warranty Expiration Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                           <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              captionLayout="dropdown-buttons"
                              fromYear={new Date().getFullYear() - 10}
                              toYear={new Date().getFullYear() + 20}
                              disabled={(date) =>
                                date < new Date('1900-01-01')
                              }
                              initialFocus
                            />
                        </PopoverContent>
                      </Popover>
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
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select employee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="Unassigned">Unassigned</SelectItem>
                           <SelectItem value="Deployed">Deployed</SelectItem>
                           {employees.map(employee => (
                            <SelectItem key={employee._id} value={employee.name}>{employee.name}</SelectItem>
                           ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="remark"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Remark</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add a remark..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
