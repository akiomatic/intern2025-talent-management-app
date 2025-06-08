import { Employee } from "./Employee";

export interface EmployeeDatabase {
    getEmployee(id: string): Promise<Employee | undefined>
    getEmployees(filterText: string): Promise<Employee[]>
    createEmployee(employeeData: EmployeeCreationData): Promise<Employee>
}
