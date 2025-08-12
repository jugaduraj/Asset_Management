"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import type { Employee } from "@/types";
import { X } from "lucide-react";

interface EmployeeDetailsModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

const DetailItem = ({ label, value }: { label: string; value?: string | null }) => (
  <div>
    <p className="text-sm font-semibold text-muted-foreground">{label}</p>
    <p className="text-sm text-foreground">{value || "N/A"}</p>
  </div>
);

export function EmployeeDetailsModal({
  employee,
  isOpen,
  onClose,
}: EmployeeDetailsModalProps) {

  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Employee Details - {employee.name}</DialogTitle>
          <DialogClose asChild>
            <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogClose>
        </DialogHeader>
        <div className="py-4 space-y-6">
            <div className="space-y-4 border-b pb-4">
                 <h3 className="text-lg font-semibold text-primary">Personal Information</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <DetailItem label="Employee ID:" value={employee.employeeId.toUpperCase()} />
                    <DetailItem label="Full Name:" value={employee.name} />
                    <DetailItem label="Email Address:" value={employee.email} />
                    <DetailItem label="Phone Number:" value={employee.phone} />
                    <DetailItem label="Department:" value={employee.department} />
                    <DetailItem label="Designation:" value={employee.designation} />
                </div>
            </div>

            <div className="space-y-4">
                 <h3 className="text-lg font-semibold text-primary">Allocated Assets</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <DetailItem label="Desktop/Laptop:" value={employee.desktop_laptop} />
                    <DetailItem label="Primary Asset Tag:" value={employee.asset_tag} />
                    <DetailItem label="Monitor 1:" value={employee.monitor_1} />
                    <DetailItem label="Monitor 2:" value={employee.monitor_2} />
                    <DetailItem label="Webcam/Docking Station:" value={employee.webcam_dstation} />
                    <DetailItem label="Headphones:" value={employee.headphone} />
                    <DetailItem label="Bag/Mouse:" value={employee.bag_mouse} />
                    <DetailItem label="Allocation Date:" value={employee.allocation_date ? new Date(employee.allocation_date).toLocaleDateString() : 'N/A'} />
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
