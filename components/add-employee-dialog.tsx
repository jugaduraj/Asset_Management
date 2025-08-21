
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
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Employee, Asset } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { Separator } from './ui/separator';

const employeeFormSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  department: z.string().optional(),
  designation: z.string().optional(),
  phone: z.string().optional(),
  desktopLaptop: z.string().optional(),
  assetTag: z.string().optional(),
  monitor1: z.string().optional(),
  monitor2: z.string().optional(),
  webcam: z.string().optional(),
  dStation: z.string().optional(),
  headphone: z.string().optional(),
  bag: z.string().optional(),
  mouse: z.string().optional(),
  allocationDate: z.date().optional().nullable(),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

interface AddEmployeeDialogProps {
  children?: React.ReactNode;
  onEmployeeSubmit: (employee: Omit<Employee, '_id' | 'createdAt'> | Employee) => void;
  employee?: Employee | null;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  availableMonitors: Asset[];
  allMonitors?: Asset[];
  availableLaptopsOrDesktops: Asset[];
  allLaptopsOrDesktops?: Asset[];
  availableWebcams: Asset[];
  allWebcams?: Asset[];
  availableDStations: Asset[];
  allDStations?: Asset[];
}

export default function AddEmployeeDialog({ 
    children, 
    onEmployeeSubmit, 
    employee, 
    isOpen: controlledIsOpen, 
    onOpenChange: controlledOnOpenChange, 
    availableMonitors,
    allMonitors = [],
    availableLaptopsOrDesktops,
    allLaptopsOrDesktops = [],
    availableWebcams,
    allWebcams = [],
    availableDStations,
    allDStations = []
}: AddEmployeeDialogProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined && controlledOnOpenChange !== undefined;

  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const setOpen = isControlled ? controlledOnOpenChange : setInternalIsOpen;

  const isEditing = !!employee;
  
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      employeeId: '',
      name: '',
      email: '',
      department: '',
      designation: '',
      phone: '',
      desktopLaptop: '',
      assetTag: '',
      monitor1: '',
      monitor2: '',
      webcam: '',
      dStation: '',
      headphone: 'No',
      bag: 'No',
      mouse: 'No',
      allocationDate: null,
    },
  });

  useEffect(() => {
    if (isEditing && employee) {
        form.reset({
            ...employee,
            allocationDate: employee.allocationDate ? new Date(employee.allocationDate) : null,
        })
    } else {
        form.reset({
            employeeId: '',
            name: '',
            email: '',
            department: '',
            designation: '',
            phone: '',
            desktopLaptop: '',
            assetTag: '',
            monitor1: '',
            monitor2: '',
            webcam: '',
            dStation: '',
            headphone: 'No',
            bag: 'No',
            mouse: 'No',
            allocationDate: null,
        })
    }
  }, [employee, isEditing, form, isOpen])

  function onSubmit(data: EmployeeFormValues) {
    const newOrUpdatedEmployee = {
      ...(employee || {}),
      ...data,
      allocationDate: data.allocationDate?.toISOString(),
    } as Employee | Omit<Employee, '_id' | 'createdAt'>;
    onEmployeeSubmit(newOrUpdatedEmployee);
    setOpen(false);
  }

  const currentlyAssignedMonitor1 = isEditing && employee?.monitor1 ? allMonitors.find(m => m.assetTag === employee.monitor1) : null;
  const monitor1Options = currentlyAssignedMonitor1 ? [currentlyAssignedMonitor1, ...availableMonitors] : availableMonitors;

  const currentlyAssignedMonitor2 = isEditing && employee?.monitor2 ? allMonitors.find(m => m.assetTag === employee.monitor2) : null;
  const monitor2Options = currentlyAssignedMonitor2 ? [currentlyAssignedMonitor2, ...availableMonitors] : availableMonitors;

  const currentlyAssignedLaptopOrDesktop = isEditing && employee?.assetTag ? allLaptopsOrDesktops.find(a => a.assetTag === employee.assetTag) : null;
  const laptopOrDesktopOptions = currentlyAssignedLaptopOrDesktop ? [currentlyAssignedLaptopOrDesktop, ...availableLaptopsOrDesktops] : availableLaptopsOrDesktops;

  const currentlyAssignedWebcam = isEditing && employee?.webcam ? allWebcams.find(w => w.assetTag === employee.webcam) : null;
  const webcamOptions = currentlyAssignedWebcam ? [currentlyAssignedWebcam, ...availableWebcams] : availableWebcams;

  const currentlyAssignedDStation = isEditing && employee?.dStation ? allDStations.find(d => d.assetTag === employee.dStation) : null;
  const dStationOptions = currentlyAssignedDStation ? [currentlyAssignedDStation, ...availableDStations] : availableDStations;


  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details for the employee.' : "Fill in the details for the new employee. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[70vh] pr-6">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 py-4">
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="col-span-2 mt-4">
                  <h3 className="text-lg font-semibold">Asset Allocation</h3>
                  <Separator className="my-2" />
                </div>

                <FormField
                  control={form.control}
                  name="desktopLaptop"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desktop/Laptop</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Desktop">Desktop</SelectItem>
                          <SelectItem value="Laptop">Laptop</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="assetTag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Tag</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an asset" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="N/A">N/A</SelectItem>
                           {laptopOrDesktopOptions.map(asset => (
                             <SelectItem key={asset._id} value={asset.assetTag}>{asset.assetTag} - {asset.make} {asset.model}</SelectItem>
                           ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="monitor1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monitor 1</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a monitor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="N/A">N/A</SelectItem>
                           {monitor1Options.map(monitor => (
                            <SelectItem key={monitor._id} value={monitor.assetTag}>{monitor.assetTag} - {monitor.make} {monitor.model}</SelectItem>
                           ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="monitor2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monitor 2</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a monitor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="N/A">N/A</SelectItem>
                           {monitor2Options.map(monitor => (
                            <SelectItem key={monitor._id} value={monitor.assetTag}>{monitor.assetTag} - {monitor.make} {monitor.model}</SelectItem>
                           ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="webcam"
                  render={({ field }) => (
                     <FormItem>
                      <FormLabel>Webcam</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a webcam" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="N/A">N/A</SelectItem>
                           {webcamOptions.map(webcam => (
                            <SelectItem key={webcam._id} value={webcam.assetTag}>{webcam.assetTag} - {webcam.make} {webcam.model}</SelectItem>
                           ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="dStation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Docking Station</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a docking station" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="N/A">N/A</SelectItem>
                           {dStationOptions.map(dStation => (
                            <SelectItem key={dStation._id} value={dStation.assetTag}>{dStation.assetTag} - {dStation.make} {dStation.model}</SelectItem>
                           ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="headphone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Headphone</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="Yes">Yes</SelectItem>
                           <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="bag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bag</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="Yes">Yes</SelectItem>
                           <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="mouse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mouse</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="Yes">Yes</SelectItem>
                           <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="allocationDate"
                  render={({ field }) => (
                     <FormItem className="flex flex-col">
                      <FormLabel>Allocation Date</FormLabel>
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
                            fromYear={new Date().getFullYear() - 70}
                            toYear={new Date().getFullYear()}
                            disabled={(date) =>
                                date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                            />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">{isEditing ? 'Save Changes' : 'Create Employee'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
