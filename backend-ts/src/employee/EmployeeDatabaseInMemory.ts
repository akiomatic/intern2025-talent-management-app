import { EmployeeDatabase } from "./EmployeeDatabase";
import { Employee } from "./Employee";
import { randomUUID } from "crypto";

type EmployeeCreationData = Omit<Employee, 'id'>;

export class EmployeeDatabaseInMemory implements EmployeeDatabase {
  private employees: Map<string, Employee>;

  constructor() {
    this.employees = new Map<string, Employee>();
    this.employees.set("1", {
      id: "1",
      name: "Jane Doe",
      furigana: "じぇーんどぅ",
      nameRomaji: "Jane doe",
      age: 22,
      skills: ["Python", "AWS"],
    });
    this.employees.set("2", {
      id: "2",
      name: "John Smith",
      furigana: "じょんすみす",
      nameRomaji: "Jone smith",
      age: 28,
      skills: ["AWS"],
    });
    this.employees.set("3", {
      id: "3",
      name: "山田 太郎",
      furigana: "やまだたろう",
      nameRomaji: "yamada taro",
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
      [employee.name, employee.furigana, employee.nameRomaji].some((field) =>
        field.toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }

  async createEmployee(employeeData: EmployeeCreationData): Promise<Employee> {
    const id = randomUUID(); // 一意のIDを生成
    const newEmployee: Employee = {
      id: id,
      ...employeeData, // 受け取ったデータ（名前、年齢、スキル）を展開
    };
    this.employees.set(id, newEmployee);
    console.log("Created new employee:", newEmployee);
    return newEmployee;
  }
}
