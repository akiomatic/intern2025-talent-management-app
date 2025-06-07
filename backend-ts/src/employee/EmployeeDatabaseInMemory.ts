import { EmployeeDatabase } from "./EmployeeDatabase";
import { Employee } from "./Employee";

export class EmployeeDatabaseInMemory implements EmployeeDatabase {
  private employees: Map<string, Employee>;

  constructor() {
    this.employees = new Map<string, Employee>();
    this.employees.set("1", {
      id: "1",
      name: "Jane Doe",
      furigana: "じぇーんどぅ",
      age: 22,
      skills: ["Python", "AWS"],
    });
    this.employees.set("2", {
      id: "2",
      name: "John Smith",
      furigana: "じょんすみす",
      age: 28,
      skills: ["AWS"],
    });
    this.employees.set("3", {
      id: "3",
      name: "山田 太郎",
      furigana: "やまだたろう",
      age: 27,
      skills: ["React"],
    });
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async getEmployees(filterText: string): Promise<Employee[]> {
    const employees = Array.from(this.employees.values());
    if (filterText === "") {
      return employees;
    }
    return employees.filter((employee) =>
      employee.furigana.startsWith(filterText)
    );
  }
}
