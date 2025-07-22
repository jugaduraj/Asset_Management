import { EmployeesClientPage } from "@/components/employees-client-page";
import { mockEmployees } from "@/lib/data";
import type { Employee } from "@/types";

async function getEmployees(): Promise<Employee[]> {
  // Simulate fetching data from a database
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockEmployees);
    }, 500); // Simulate network delay
  });
}

export default async function EmployeesPage() {
  const employees = await getEmployees();
  return <EmployeesClientPage initialEmployees={employees} />;
}
