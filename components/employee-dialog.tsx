
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Employee } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { Separator } from './ui/separator';

const employeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  contactNo: z.string().min(1, 'Contact number is required'),
  department: z.string().min(2, 'Department is required.'),
  role: z.string().min(2, 'Role is required.'),
  assets: z.object({
      desktopLaptop: z.string().optional(),
      assetTag: z.string().optional(),
      monitor1: z.string().optional(),
      monitor2: z.string().optional(),
      webcamDockingStation: z.string().optional(),
      headphone: z.string().optional(),
      bagMouse: z.string().optional(),
      allocationDate: z.date().optional(),
  })
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

type EmployeeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: Omit<Employee, 'id' | 'avatar'>, id?: string) => void;
  employee?: Employee | null;
};

export function EmployeeDialog({ open, onOpenChange, onSave, employee }: EmployeeDialogProps) {
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: '',
      email: '',
      contactNo: '',
      department: '',
      role: '',
      assets: {
        desktopLaptop: '',
        assetTag: '',
        monitor1: '',
        monitor2: '',
        webcamDockingStation: '',
        headphone: '',
        bagMouse: '',
      }
    },
  });

  useEffect(() => {
    if (employee) {
      form.reset({
        ...employee,
        assets: {
            ...employee.assets,
            allocationDate: employee.assets.allocationDate ? new Date(employee.assets.allocationDate) : undefined,
        }
      });
    } else {
      form.reset({
        name: '',
        email: '',
        contactNo: '',
        department: '',
        role: '',
        assets: {
          desktopLaptop: '',
          assetTag: '',
          monitor1: '',
          monitor2: '',
          webcamDockingStation: '',
          headphone: '',
          bagMouse: '',
        }
      });
    }
  }, [employee, form, open]);

  const onSubmit = (values: EmployeeFormValues) => {
    onSave({
        ...values,
        assets: {
            ...values.assets,
            allocationDate: values.assets.allocationDate ? format(values.assets.allocationDate, 'yyyy-MM-dd') : undefined,
        }
    }, employee?.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{employee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
          <DialogDescription>
            {employee ? 'Update the details of the existing employee.' : 'Fill in the details for the new employee.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="e.g., john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="contactNo" render={({ field }) => (
                    <FormItem><FormLabel>Contact No.</FormLabel><FormControl><Input placeholder="e.g., 123-456-7890" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="department" render={({ field }) => (
                    <FormItem><FormLabel>Department</FormLabel><FormControl><Input placeholder="e.g., Engineering" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
             </div>

            <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem><FormLabel>Role</FormLabel><FormControl><Input placeholder="e.g., Software Engineer" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <Separator className="my-6" />

            <h3 className="text-lg font-medium">Assigned Assets</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="assets.desktopLaptop" render={({ field }) => (
                    <FormItem><FormLabel>Desktop/Laptop</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="assets.assetTag" render={({ field }) => (
                    <FormItem><FormLabel>Asset Tag</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="assets.monitor1" render={({ field }) => (
                    <FormItem><FormLabel>Monitor 1</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="assets.monitor2" render={({ field }) => (
                    <FormItem><FormLabel>Monitor 2</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField control={form.control} name="assets.webcamDockingStation" render={({ field }) => (
                    <FormItem><FormLabel>Webcam/Docking Station</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="assets.headphone" render={({ field }) => (
                    <FormItem><FormLabel>Headphone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField control={form.control} name="assets.bagMouse" render={({ field }) => (
                    <FormItem><FormLabel>Bag/Mouse</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="assets.allocationDate" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Allocation Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                    <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                    </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent></Popover><FormMessage /></FormItem>
                )} />
            </div>


            <DialogFooter className="pt-4 pr-6">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Employee</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
