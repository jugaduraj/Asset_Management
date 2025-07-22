"use client";

import { useState } from "react";
import type { Employee } from "@/types";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/employee-columns";
import { AddEmployeeSheet } from "@/components/add-employee-sheet";

interface EmployeesClientPageProps {
  initialEmployees: Employee[];
}

export function EmployeesClientPage({ initialEmployees }: EmployeesClientPageProps) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [isAddEmployeeSheetOpen, setIsAddEmployeeSheetOpen] = useState(false);

  const handleEmployeeAdd = (newEmployee: Employee) => {
    setEmployees((prev) => [newEmployee, ...prev]);
  };

  return (
    <>
      <main className="flex-1 flex flex-col">
        <PageHeader 
          title="Employees"
          description="Manage your company's employees."
        >
          <Button onClick={() => setIsAddEmployeeSheetOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Employee
          </Button>
        </PageHeader>
        <div className="flex-1 px-6 md:px-8 pb-8">
          <DataTable columns={columns} data={employees} filterColumn="name" />
        </div>
      </main>
      <AddEmployeeSheet
        open={isAddEmployeeSheetOpen}
        onOpenChange={setIsAddEmployeeSheetOpen}
        onEmployeeAdd={handleEmployeeAdd}
      />
    </>
  );
}
