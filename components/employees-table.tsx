
'use client';

import type { Employee } from '@/lib/types';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical, Trash2, Pencil } from 'lucide-react';
import { format } from 'date-fns';

type EmployeeTableProps = {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
};

export function EmployeeTable({ employees, onEdit, onDelete }: EmployeeTableProps) {
  if (employees.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>No employees found.</p>
        <p className="text-sm">Try adjusting your search or adding a new employee.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact No.</TableHead>
            <TableHead>Mail ID</TableHead>
            <TableHead>Desktop/Laptop</TableHead>
            <TableHead>Asset Tag</TableHead>
            <TableHead>Monitor</TableHead>
            <TableHead>Monitor</TableHead>
            <TableHead>Webcam/D.Station</TableHead>
            <TableHead>Headphone</TableHead>
            <TableHead>Bag/Mouse</TableHead>
            <TableHead>Allocation Date</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={employee.avatar} alt={employee.name} data-ai-hint="avatar person" />
                        <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{employee.name}</span>
                </div>
              </TableCell>
              <TableCell>{employee.contactNo}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.assets.desktopLaptop}</TableCell>
              <TableCell>{employee.assets.assetTag}</TableCell>
              <TableCell>{employee.assets.monitor1}</TableCell>
              <TableCell>{employee.assets.monitor2}</TableCell>
              <TableCell>{employee.assets.webcamDockingStation}</TableCell>
              <TableCell>{employee.assets.headphone}</TableCell>
              <TableCell>{employee.assets.bagMouse}</TableCell>
              <TableCell>
                {employee.assets.allocationDate ? format(new Date(employee.assets.allocationDate), 'PPP') : ''}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => onEdit(employee)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => onDelete(employee)} className="text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Employee
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
