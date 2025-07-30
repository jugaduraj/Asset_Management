
'use client';

import { useState, useMemo, useTransition, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UserPlus, Search, Download } from 'lucide-react';
import type { Employee } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { EmployeeTable } from '@/components/employees-table';
import { EmployeeDialog } from '@/components/employee-dialog';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import { downloadCsv } from '@/lib/export';
import { saveEmployee, deleteEmployee, getEmployees } from '@/lib/actions';

type EmployeesPageProps = {}

export const EmployeesPage = forwardRef<any, EmployeesPageProps>((props, ref) => {
  const [isPending, startTransition] = useTransition();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  const { toast } = useToast();

  const fetchEmployees = async () => {
      setIsLoading(true);
      try {
          const employeesData = await getEmployees();
          setEmployees(employeesData);
      } catch (error) {
          console.error("Failed to fetch employees:", error);
          toast({ title: "Error", description: "Could not fetch employees.", variant: "destructive" });
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);
  
  useImperativeHandle(ref, () => ({
    openAddDialog: () => {
        handleOpenAddDialog();
    }
  }));

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
    if (deletingEmployee) {
        startTransition(async () => {
            await deleteEmployee(deletingEmployee.id);
            toast({ title: "Employee Deleted", description: `Successfully deleted ${deletingEmployee.name}.`, variant: "destructive" });
            setIsDeleteDialogOpen(false);
            setDeletingEmployee(null);
            fetchEmployees(); // Refetch employees
        });
    }
  };

  const handleSaveEmployee = (values: Omit<Employee, 'id' | 'avatar'>, id?: string) => {
    startTransition(async () => {
        await saveEmployee(values, id);
        toast({ title: id ? "Employee Updated" : "Employee Added", description: `Successfully saved ${values.name}.` });
        setIsEmployeeDialogOpen(false);
        setEditingEmployee(null);
        fetchEmployees(); // Refetch employees
    });
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
                {isLoading ? (
                    <div className="text-center py-10">Loading employees...</div>
                ) : (
                    <EmployeeTable
                    employees={filteredEmployees}
                    onEdit={handleOpenEditDialog}
                    onDelete={handleOpenDeleteDialog}
                    />
                )}
            </CardContent>
        </Card>

        <EmployeeDialog
            open={isEmployeeDialogOpen}
            onOpenChange={setIsEmployeeDialogOpen}
            onSave={handleSaveEmployee}
            employee={editingEmployee}
            isSaving={isPending}
        />
        
        <DeleteConfirmDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirm={handleDeleteConfirm}
            isDeleting={isPending}
            assetName={deletingEmployee?.name}
        />
    </div>
  );
});
EmployeesPage.displayName = "EmployeesPage";
