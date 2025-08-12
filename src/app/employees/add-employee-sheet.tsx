"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Employee, Asset } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { v4 as uuidv4 } from 'uuid';

interface AddEmployeeSheetProps {
  employee?: Employee | null;
  onSuccess?: (employee: Employee) => void;
  children?: React.ReactNode;
  assets: Asset[];
}

export function AddEmployeeSheet({ employee, onSuccess, children, assets }: AddEmployeeSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);
  const [availableMonitors, setAvailableMonitors] = useState<Asset[]>([]);

  const getInitialFormData = () => ({
    employeeId: "",
    name: "",
    email: "",
    designation: "",
    department: "",
    phone: "",
    desktop_laptop: "",
    asset_tag: "",
    monitor_1: "",
    monitor_2: "",
    webcam_dstation: "",
    headphone: "",
    bag_mouse: "",
    allocation_date: "",
  });

  const [formData, setFormData] = useState(getInitialFormData());

    useEffect(() => {
        if (isOpen) {
            const unassignedLaptopsOrDesktops = assets.filter(asset => 
                (asset.type === 'Laptop' || asset.type === 'Desktop') && 
                (!asset.assignedTo || (employee && asset.assignedTo === employee.id))
            );
            setAvailableAssets(unassignedLaptopsOrDesktops);

            const monitors = assets.filter(asset => asset.type === "Monitor" && (!asset.assignedTo || (employee && asset.assignedTo === employee.id)));
            setAvailableMonitors(monitors);
        }
    }, [employee, isOpen, assets]);


  useEffect(() => {
    if (isOpen && employee) {
      setFormData({
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email || "",
        designation: employee.designation || "",
        department: employee.department || "",
        phone: employee.phone || "",
        desktop_laptop: employee.desktop_laptop || "",
        asset_tag: employee.asset_tag || "",
        monitor_1: employee.monitor_1 || "",
        monitor_2: employee.monitor_2 || "",
        webcam_dstation: employee.webcam_dstation || "",
        headphone: employee.headphone || "",
        bag_mouse: employee.bag_mouse || "",
        allocation_date: employee.allocation_date || "",
      });
      if (employee.allocation_date) {
        setDate(new Date(employee.allocation_date));
      } else {
        setDate(undefined);
      }
    } else if (isOpen && !employee) {
        setFormData(getInitialFormData());
        setDate(undefined);
    }
  }, [employee, isOpen]);
  
  useEffect(() => {
    if (date) {
        setFormData(prev => ({...prev, allocation_date: format(date, 'yyyy-MM-dd')}))
    }
  }, [date])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const newEmployeeData: Employee = {
        id: employee ? employee.id : uuidv4(),
        createdAt: employee ? employee.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...formData,
        email: formData.email || null,
        department: formData.department || null,
        designation: formData.designation || null,
        phone: formData.phone || null,
        desktop_laptop: formData.desktop_laptop || null,
        asset_tag: formData.asset_tag || null,
        monitor_1: formData.monitor_1 || null,
        monitor_2: formData.monitor_2 || null,
        webcam_dstation: formData.webcam_dstation || null,
        headphone: formData.headphone || null,
        bag_mouse: formData.bag_mouse || null,
        allocation_date: formData.allocation_date || null,
    };
    
    await new Promise(resolve => setTimeout(resolve, 500));

    toast({ title: "Success", description: `Employee ${employee ? 'updated' : 'created'} successfully!` });
    onSuccess?.(newEmployeeData);
    setIsOpen(false);
    setLoading(false);
  };


  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="sm:max-w-4xl w-full flex flex-col">
        <SheetHeader>
          <SheetTitle>{employee ? "Edit Employee" : "Add Employee"}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-grow pr-6 -mr-6">
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employeeId">Employee ID *</Label>
              <Input id="employeeId" value={formData.employeeId} onChange={(e) => setFormData(d => ({...d, employeeId: e.target.value}))} placeholder="Employee ID" required />
            </div>
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData(d => ({...d, name: e.target.value}))} placeholder="Name" required/>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData(d => ({...d, email: e.target.value}))} placeholder="Email" />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input id="department" value={formData.department} onChange={(e) => setFormData(d => ({...d, department: e.target.value}))} placeholder="Department" />
            </div>
            <div>
              <Label htmlFor="designation">Designation</Label>
              <Input id="designation" value={formData.designation} onChange={(e) => setFormData(d => ({...d, designation: e.target.value}))} placeholder="Designation" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData(d => ({...d, phone: e.target.value}))} placeholder="Phone" />
            </div>
          </div>
            
          <div className="col-span-2 pt-4">
            <h3 className="text-lg font-semibold mb-4 text-primary">Asset Allocation</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="desktop_laptop">Desktop/Laptop</Label>
                <Select value={formData.desktop_laptop} onValueChange={(value) => setFormData(d => ({...d, desktop_laptop: value}))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Laptop">Laptop</SelectItem>
                        <SelectItem value="Desktop">Desktop</SelectItem>
                        <SelectItem value="N/A">N/A</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div>
                <Label htmlFor="asset_tag">Asset Tag</Label>
                <Select value={formData.asset_tag} onValueChange={(value) => setFormData(d => ({...d, asset_tag: value === 'unassigned' ? '' : value}))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select an asset" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {availableAssets.map(asset => (
                            <SelectItem key={asset.id} value={asset.assetTag}>{asset.assetTag} ({asset.make} {asset.model})</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="monitor_1">Monitor 1</Label>
                <Select value={formData.monitor_1} onValueChange={(value) => setFormData(d => ({...d, monitor_1: value}))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a monitor" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="N/A">N/A</SelectItem>
                        {availableMonitors.map(monitor => (
                            <SelectItem key={monitor.id} value={monitor.assetTag}>{monitor.assetTag}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="monitor_2">Monitor 2</Label>
                <Select value={formData.monitor_2} onValueChange={(value) => setFormData(d => ({...d, monitor_2: value}))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a monitor" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="N/A">N/A</SelectItem>
                        {availableMonitors.map(monitor => (
                            <SelectItem key={monitor.id} value={monitor.assetTag}>{monitor.assetTag}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="webcam_dstation">Webcam/D.Station</Label>
                <Input id="webcam_dstation" value={formData.webcam_dstation} onChange={(e) => setFormData(d => ({...d, webcam_dstation: e.target.value}))} />
            </div>
            <div>
                <Label htmlFor="headphone">Headphone</Label>
                <Input id="headphone" value={formData.headphone} onChange={(e) => setFormData(d => ({...d, headphone: e.target.value}))} />
            </div>
            <div>
                <Label htmlFor="bag_mouse">Bag/Mouse</Label>
                <Input id="bag_mouse" value={formData.bag_mouse} onChange={(e) => setFormData(d => ({...d, bag_mouse: e.target.value}))} />
            </div>
            <div>
                <Label htmlFor="allocation_date">Allocation Date</Label>
                 <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
            </div>
          </div>
        
            <SheetFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : employee ? "Update Employee" : "Create Employee"}
                </Button>
            </SheetFooter>
        </form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
