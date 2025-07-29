
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UserPlus, Search, Download } from 'lucide-react';
import type { Employee, LogEntry } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { initialEmployees } from '@/lib/data';
import { EmployeeTable } from '@/components/employees-table';
import { EmployeeDialog } from '@/components/employee-dialog';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import { downloadCsv } from '@/lib/export';

type EmployeesPageProps = {
  addLogEntry: (log: Omit<LogEntry, 'id'>) => void;
}

export function EmployeesPage({ addLogEntry }: EmployeesPageProps) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  const { toast } = useToast();

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  const handleOpenAddDialog = () => {
    setEditingEmployee(null);
    setIsEmployeeDialogOpen(true);
  };

  const handleOpenEditDialog = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEmployeeDialogOpen(true);
  };
  
  const handleOpenDeleteDialog = (employee: Employee) => {
    setDeletingEmployee(employee);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    const user = 'Guest User'; // In a real app, this would come from auth
    if (deletingEmployee) {
      setEmployees(employees.filter(e => e.id !== deletingEmployee.id));
      toast({ title: "Employee Deleted", description: `Successfully deleted ${deletingEmployee.name}.`, variant: "destructive" });
      addLogEntry({
          timestamp: new Date().toISOString(),
          user,
          action: 'Deleted Employee',
          details: `Employee "${deletingEmployee.name}" was deleted.`
      });
      setIsDeleteDialogOpen(false);
      setDeletingEmployee(null);
    }
  };

  const handleSaveEmployee = (values: Omit<Employee, 'id' | 'avatar'>, id?: string) => {
    const user = 'Guest User'; // In a real app, this would come from auth
    if (id) {
      setEmployees(employees.map(e => e.id === id ? { ...e, ...values } : e));
      toast({ title: "Employee Updated", description: `Successfully updated ${values.name}.` });
      addLogEntry({
          timestamp: new Date().toISOString(),
          user,
          action: 'Updated Employee',
          details: `Employee "${values.name}" was updated.`
      });
    } else {
      const newEmployee: Employee = {
        ...values,
        id: new Date().toISOString(),
        avatar: `https://placehold.co/40x40.png?text=${values.name.charAt(0)}`,
        assets: values.assets,
      };
      setEmployees([...employees, newEmployee]);
      toast({ title: "Employee Added", description: `Successfully added ${values.name}.` });
      addLogEntry({
          timestamp: new Date().toISOString(),
          user,
          action: 'Created Employee',
          details: `Employee "${values.name}" was created.`
      });
    }
    setIsEmployeeDialogOpen(false);
    setEditingEmployee(null);
  };

  const handleExportEmployees = () => {
    const dataToExport = filteredEmployees.map(e => ({
        name: e.name,
        email: e.email,
        contactNo: e.contactNo,
        department: e.department,
        role: e.role,
        ...e.assets
    }));
    downloadCsv(dataToExport, 'employees');
  }

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6 lg:p-8 gap-6">
        <div className="flex justify-between items-center">
            <div></div>
            <Button onClick={handleOpenAddDialog}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Employee
            </Button>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Employee Filters</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search employees..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Employee Overview</CardTitle>
                 <Button variant="outline" onClick={handleExportEmployees}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                </Button>
            </CardHeader>
            <CardContent>
                <EmployeeTable
                  employees={filteredEmployees}
                  onEdit={handleOpenEditDialog}
                  onDelete={handleOpenDeleteDialog}
                />
            </CardContent>
        </Card>

        <EmployeeDialog
            open={isEmployeeDialogOpen}
            onOpenChange={setIsEmployeeDialogOpen}
            onSave={handleSaveEmployee}
            employee={editingEmployee}
        />
        
        <DeleteConfirmDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirm={handleDeleteConfirm}
            assetName={deletingEmployee?.name}
        />
    </div>
  );
}
