
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Employee } from '@/lib/types';
import { format } from 'date-fns';
import { ScrollArea } from './ui/scroll-area';

interface ViewEmployeeDialogProps {
  employee: Employee | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ViewEmployeeDialog({ employee, isOpen, onOpenChange }: ViewEmployeeDialogProps) {
  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
          <DialogDescription>
            Viewing details for Employee: {employee.name} ({employee.employeeId})
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 py-4 text-sm">
                <div><span className="font-semibold text-muted-foreground">Employee ID:</span> {employee.employeeId}</div>
                <div><span className="font-semibold text-muted-foreground">Name:</span> {employee.name}</div>
                <div><span className="font-semibold text-muted-foreground">Email:</span> {employee.email || 'N/A'}</div>
                <div><span className="font-semibold text-muted-foreground">Department:</span> {employee.department || 'N/A'}</div>
                <div><span className="font-semibold text-muted-foreground">Designation:</span> {employee.designation || 'N/A'}</div>
                <div><span className="font-semibold text-muted-foreground">Phone:</span> {employee.phone || 'N/A'}</div>
                <div className="col-span-2"><span className="font-semibold text-muted-foreground">Created At:</span> {format(new Date(employee.createdAt), 'PPp')}</div>

                <div className="col-span-2 mt-4">
                  <h3 className="text-lg font-semibold">Asset Allocation</h3>
                </div>
                <div><span className="font-semibold text-muted-foreground">Desktop/Laptop:</span> {employee.desktopLaptop || 'N/A'}</div>
                <div><span className="font-semibold text-muted-foreground">Asset Tag:</span> {employee.assetTag || 'N/A'}</div>
                <div><span className="font-semibold text-muted-foreground">Monitor 1:</span> {employee.monitor1 || 'N/A'}</div>
                <div><span className="font-semibold text-muted-foreground">Monitor 2:</span> {employee.monitor2 || 'N/A'}</div>
                <div><span className="font-semibold text-muted-foreground">Webcam:</span> {employee.webcam || 'N/A'}</div>
                <div><span className="font-semibold text-muted-foreground">Docking Station:</span> {employee.dStation || 'N/A'}</div>
                <div><span className="font-semibold text-muted-foreground">Headphone:</span> {employee.headphone || 'N/A'}</div>
                <div><span className="font-semibold text-muted-foreground">Bag:</span> {employee.bag || 'N/A'}</div>
                <div><span className="font-semibold text-muted-foreground">Mouse:</span> {employee.mouse || 'N/A'}</div>
                <div><span className="font-semibold text-muted-foreground">Allocation Date:</span> {employee.allocationDate ? format(new Date(employee.allocationDate), 'PPP') : 'N/A'}</div>

            </div>
        </ScrollArea>
        <DialogFooter className="pt-4">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
