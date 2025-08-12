"use client";

import { useState, useEffect } from "react";
import type { Employee, Asset, Log } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Search, Trash2, Download, Users, UserCheck, UserPlus, FilePenLine, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddEmployeeSheet } from "./add-employee-sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { StatCard } from "@/components/dashboard/stat-card";
import { DepartmentBreakdown } from "@/components/employees/department-breakdown";
import { EmployeeDetailsModal } from "./employee-details-modal";
import { v4 as uuidv4 } from 'uuid';


export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
        setEmployees(JSON.parse(storedEmployees));
    }
    const storedAssets = localStorage.getItem('assets');
    if (storedAssets) {
        setAssets(JSON.parse(storedAssets));
    }
    setLoading(false);
  }, []);

  const addLog = (action: string, details: string) => {
    const storedLogs = localStorage.getItem('logs') || '[]';
    const logs: Log[] = JSON.parse(storedLogs);
    const newLog: Log = {
      id: uuidv4(),
      user: 'Admin',
      action,
      details,
      timestamp: new Date().toISOString(),
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fDE?q=80&w=2080&auto=format&fit=crop"
    };
    const updatedLogs = [newLog, ...logs];
    localStorage.setItem('logs', JSON.stringify(updatedLogs));
  };


  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleDelete = (employeeId: string, employeeName: string) => {
    const updatedEmployees = employees.filter(emp => emp.id !== employeeId)
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    addLog('Removed Employee', `Removed employee ${employeeName}`);
    toast({ title: "Success", description: "Employee removed successfully!" });
  }

  const handleSuccess = (newEmployee: Employee) => {
    let updatedEmployees;
    if(employees.find(e => e.id === newEmployee.id)) {
        updatedEmployees = employees.map(e => e.id === newEmployee.id ? newEmployee : e);
        addLog('Updated Employee', `Updated details for ${newEmployee.name}`);
    } else {
        updatedEmployees = [newEmployee, ...employees];
        addLog('Added Employee', `Added new employee ${newEmployee.name}`);
    }
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    setSelectedEmployee(null);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (employee.department && employee.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const exportToCSV = () => {
    const headers = [
      'Employee ID', 'Name', 'Email', 'Department', 'Designation', 'Phone',
      'Desktop/Laptop', 'Asset Tag'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredEmployees.map(employee => [
        employee.employeeId,
        employee.name,
        employee.email,
        employee.department || 'NA',
        employee.designation || 'NA',
        employee.phone || 'NA',
        employee.desktop_laptop || 'NA',
        employee.asset_tag || 'NA',
      ].map(field => `"${String(field || "").replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };
  
  const totalEmployees = employees.length;
  const employeesWithAssets = employees.filter(emp => emp.asset_tag).length;
  const newHires = isClient ? employees.filter(emp => {
      if (!emp.allocation_date) return false;
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return new Date(emp.allocation_date) > thirtyDaysAgo;
  }).length : 0;


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Employee Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
          </Button>
          <AddEmployeeSheet onSuccess={handleSuccess} assets={assets}>
            <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
          </AddEmployeeSheet>
        </div>
      </div>
      
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={totalEmployees.toString()}
          icon={Users}
        />
        <StatCard
          title="Employees with Assets"
          value={employeesWithAssets.toString()}
          icon={UserCheck}
        />
        <StatCard
          title="New Hires"
          value={newHires.toString()}
          icon={UserPlus}
          description="In last 30 days"
        />
      </div>

      <DepartmentBreakdown employees={employees} />

      <Card>
        <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, ID, email, or department..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
        </CardContent>
      </Card>
        
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
              <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Asset Tag</TableHead>
              <TableHead className="text-right">Actions</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
              {loading ? (
                  <TableRow>
                      <TableCell colSpan={7} className="text-center">Loading employees...</TableCell>
                  </TableRow>
              ) : filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                  <TableCell className="font-medium whitespace-nowrap">{employee.employeeId.toUpperCase()}</TableCell>
                  <TableCell className="whitespace-nowrap">{employee.name}</TableCell>
                  <TableCell className="whitespace-nowrap">{employee.email}</TableCell>
                  <TableCell className="whitespace-nowrap">{employee.department || "NA"}</TableCell>
                  <TableCell className="whitespace-nowrap">{employee.designation || "NA"}</TableCell>
                  <TableCell className="whitespace-nowrap">{employee.asset_tag || <span className="text-muted-foreground">None</span>}</TableCell>
                  <TableCell>
                      <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewEmployee(employee)}>
                              <Eye className="h-4 w-4" />
                          </Button>
                          <AddEmployeeSheet employee={employee} onSuccess={handleSuccess} assets={assets}>
                             <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <FilePenLine className="h-4 w-4" />
                              </Button>
                          </AddEmployeeSheet>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Employee</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove {employee.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(employee.id, employee.name)}>
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                      </div>
                  </TableCell>
              </TableRow>
              ))}
          </TableBody>
        </Table>
        {filteredEmployees.length === 0 && !loading && (
          <p className="text-center text-muted-foreground py-8">
          {searchTerm ? "No employees found matching your search." : "No employees found. Add your first employee!"}
          </p>
        )}
      </div>
      <EmployeeDetailsModal employee={selectedEmployee} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
