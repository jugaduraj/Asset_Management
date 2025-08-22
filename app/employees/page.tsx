
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Employee, Asset } from '@/lib/types';
import {
  Plus,
  Upload,
  Users,
  Briefcase,
  UserPlus,
  Search,
  Eye,
  FilePenLine,
  Trash2,
  Loader2,
  UserMinus,
} from 'lucide-react';
import AddEmployeeDialog from '@/components/add-employee-dialog';
import ViewEmployeeDialog from '@/components/view-employee-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { createLog, exportToCsv } from '@/lib/utils';
import OffboardEmployeeDialog from '@/components/offboard-employee-dialog';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isViewDialogOpen, setViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isOffboardDialogOpen, setOffboardDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await fetch('/api/employees');
      const data = await response.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error fetching employees' });
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  const fetchAssets = useCallback(async () => {
    try {
      const response = await fetch('/api/assets');
      const data = await response.json();
      setAssets(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error fetching assets' });
      setAssets([]);
    }
  }, [toast]);

  useEffect(() => {
    fetchEmployees();
    fetchAssets();
  }, [fetchEmployees, fetchAssets]);

  const handleEmployeeSubmit = async (employeeData: Employee | Omit<Employee, '_id' | 'createdAt'>) => {
    const isEditing = '_id' in employeeData;
    const employee = employeeData as Employee;
    const url = '/api/employees';
    const method = isEditing ? 'PUT' : 'POST';
    
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee),
      });
      if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'add'} employee`);
      const savedEmployee = await response.json();

      const allocatedAssetTags = [
        employee.assetTag,
        employee.monitor1,
        employee.monitor2,
        employee.webcam,
        employee.dStation
      ].filter(Boolean) as string[];

      if (allocatedAssetTags.length > 0) {
        await Promise.all(allocatedAssetTags.map(tag => {
          return fetch('/api/assets', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              _id: assets.find(a => a.assetTag === tag)?._id,
              assignedTo: savedEmployee.name,
              status: 'Active'
            }),
          });
        }));
      }

      toast({ title: `Employee ${isEditing ? 'updated' : 'added'} successfully` });
      
      const logAction = isEditing ? 'Updated Employee' : 'Created Employee';
      const logDetails = `Employee ${employee.name} (${employee.employeeId}) was ${isEditing ? 'updated' : 'created'}.`;
      await createLog('Admin User', logAction, logDetails);

      if (allocatedAssetTags.length > 0) {
        await createLog('System', 'Allocated Assets', `Assets (${allocatedAssetTags.join(', ')}) allocated to ${savedEmployee.name}.`);
      }

      fetchEmployees();
      fetchAssets();
    } catch (error) {
      toast({ variant: 'destructive', title: `Error ${isEditing ? 'updating' : 'adding'} employee` });
    }
    setSelectedEmployee(null);
  };
  
const handleOffboardEmployee = async (employeeId: string, returnedAssetTags: string[]) => {
    const employeeToOffboard = employees.find(e => e._id === employeeId);
    if (!employeeToOffboard) {
        toast({ variant: 'destructive', title: 'Employee not found' });
        return;
    }

    try {
        const assetsToUpdate = assets.filter(asset => returnedAssetTags.includes(asset.assetTag));
        
        // Use Promise.all to update all assets concurrently
        await Promise.all(assetsToUpdate.map(async (asset) => {
            const newHistoryEntry = {
                assignedTo: employeeToOffboard.name,
                assignedDate: employeeToOffboard.allocationDate || asset.createdAt, // Fallback to asset creation date
                returnedDate: new Date().toISOString(),
            };

            const updatedHistory = Array.isArray(asset.assignmentHistory)
                ? [...asset.assignmentHistory, newHistoryEntry]
                : [newHistoryEntry];

            const updateResponse = await fetch('/api/assets', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    _id: asset._id,
                    assignedTo: 'Unassigned',
                    status: 'Inactive',
                    assignmentHistory: updatedHistory,
                }),
            });

            if (!updateResponse.ok) {
                throw new Error(`Failed to de-allocate asset ${asset.assetTag}.`);
            }
        }));

        if (assetsToUpdate.length > 0) {
            await createLog('System', `Offboarded ${employeeToOffboard.name}`, `Returned assets: ${returnedAssetTags.join(', ')}.`);
            toast({ title: `Assets from ${employeeToOffboard.name} processed.` });
        }
        
        // Delete the employee after all assets have been processed
        const deleteResponse = await fetch('/api/employees', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: employeeId }),
        });

        if (!deleteResponse.ok) {
            throw new Error('Failed to delete employee after de-allocating assets.');
        }

        toast({ title: 'Employee offboarded successfully' });
        await createLog('Admin User', 'Deleted Employee', `Employee ${employeeToOffboard.name} (${employeeToOffboard.employeeId}) was removed after offboarding.`);

        fetchEmployees();
        fetchAssets();

    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error during offboarding', description: error.message });
    }
};


  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setViewDialogOpen(true);
  }
  
  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditDialogOpen(true);
  }

  const handleOpenOffboardDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setOffboardDialogOpen(true);
  };

  const handleExport = () => {
    if(employees.length > 0) {
      exportToCsv(employees, `employees-export-${new Date().toISOString().split('T')[0]}.csv`);
      toast({ title: 'Export Successful', description: 'Employee data has been exported to CSV.' });
    } else {
      toast({ variant: 'destructive', title: 'Export Failed', description: 'No data available to export.' });
    }
  }

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  const availableMonitors = Array.isArray(assets) ? assets.filter(asset => 
    asset.type === 'Monitor' && (!asset.assignedTo || asset.assignedTo === 'Unassigned')
  ) : [];
  
  const allMonitors = Array.isArray(assets) ? assets.filter(asset => asset.type === 'Monitor') : [];
  
  const availableLaptopsOrDesktops = Array.isArray(assets) ? assets.filter(asset =>
      (asset.type === 'Laptop' || asset.type === 'Desktop') &&
      (!asset.assignedTo || asset.assignedTo === 'Unassigned')
  ) : [];
  
  const allLaptopsOrDesktops = Array.isArray(assets) ? assets.filter(asset => asset.type === 'Laptop' || asset.type === 'Desktop') : [];

  const availableWebcams = Array.isArray(assets) ? assets.filter(asset => 
    asset.type === 'Webcam' && (!asset.assignedTo || asset.assignedTo === 'Unassigned')
  ) : [];
  const allWebcams = Array.isArray(assets) ? assets.filter(asset => asset.type === 'Webcam') : [];

  const availableDStations = Array.isArray(assets) ? assets.filter(asset =>
    asset.type === 'Docking Station' && (!asset.assignedTo || asset.assignedTo === 'Unassigned')
  ) : [];
  const allDStations = Array.isArray(assets) ? assets.filter(asset => asset.type === 'Docking Station') : [];

  return (
    <>
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Employee Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Upload className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <AddEmployeeDialog onEmployeeSubmit={handleEmployeeSubmit} availableMonitors={availableMonitors} availableLaptopsOrDesktops={availableLaptopsOrDesktops} availableWebcams={availableWebcams} availableDStations={availableDStations}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </AddEmployeeDialog>
        </div>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Employees with Assets
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.filter(e => e.assetTag).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Hires</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              In last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
          <Card>
              <CardHeader>
                  <CardTitle>Departments</CardTitle>
              </CardHeader>
              <CardContent>
                  {/* Placeholder for departments chart or list */}
                  <div className="h-32 flex items-center justify-center text-muted-foreground">
                      Department data will be shown here.
                  </div>
              </CardContent>
          </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, email, or department..."
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Asset Tag</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <TableRow key={employee._id}>
                    <TableCell>{employee.employeeId}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.designation}</TableCell>
                    <TableCell>{employee.assetTag || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewEmployee(employee)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditEmployee(employee)}>
                          <FilePenLine className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleOpenOffboardDialog(employee)}>
                            <UserMinus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                      No employees found. Add your first employee!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedEmployee && <ViewEmployeeDialog employee={selectedEmployee} isOpen={isViewDialogOpen} onOpenChange={setViewDialogOpen} />}
      {selectedEmployee && (
          <AddEmployeeDialog 
              employee={selectedEmployee}
              isOpen={isEditDialogOpen}
              onOpenChange={setEditDialogOpen}
              onEmployeeSubmit={handleEmployeeSubmit}
              availableMonitors={availableMonitors}
              allMonitors={allMonitors}
              availableLaptopsOrDesktops={availableLaptopsOrDesktops}
              allLaptopsOrDesktops={allLaptopsOrDesktops}
              availableWebcams={availableWebcams}
              allWebcams={allWebcams}
              availableDStations={availableDStations}
              allDStations={allDStations}
          />
      )}
      {selectedEmployee && (
        <OffboardEmployeeDialog
            employee={selectedEmployee}
            isOpen={isOffboardDialogOpen}
            onOpenChange={setOffboardDialogOpen}
            onConfirmOffboarding={handleOffboardEmployee}
            assets={assets}
        />
      )}
    </>
  );
}

    
