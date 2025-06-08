import { EmployeeDatabase } from "./EmployeeDatabase";
import { Employee, EmployeeFilters } from "./Employee";
import { randomUUID } from "crypto";

type EmployeeCreationData = Omit<Employee, "id">;

export class EmployeeDatabaseInMemory implements EmployeeDatabase {
  private employees: Map<string, Employee>;

  constructor() {
    this.employees = new Map<string, Employee>();
    this.employees.set("1", {
      id: "1",
      name: "Jane Doe",
      furigana: "ジェーン ドウ",
      nameRomaji: "Jane Doe",
      age: 22,
      skills: ["Python", "AWS", "SQL"],
      position: "シニアエンジニア",
      department: "データ基盤部",
      projects: [
        { projectName: "データ分析基盤構築", workload: "高", role: "リードエンジニア", type: "メイン" },
      ]
    });
    this.employees.set("2", {
      id: "2",
      name: "John Smith",
      furigana: "ジョン スミス",
      nameRomaji: "John Smith",
      age: 28,
      skills: ["AWS", "Terraform", "Go"],
      position: "SRE",
      department: "インフラストラクチャ部",
      projects: [
        { projectName: "サービス監視システム構築", workload: "高", role: "アーキテクト", type: "メイン" },
        { projectName: "CI/CDパイプライン改善", workload: "中", role: "開発担当", type: "サブ" },
      ]
    });
    this.employees.set("3", {
      id: "3",
      name: "山田 太郎",
      furigana: "ヤマダ タロウ",
      nameRomaji: "Taro Yamada",
      age: 27,
      skills: ["React", "TypeScript", "Next.js"],
      position: "フロントエンドエンジニア",
      department: "プロダクト開発部",
      projects: [
        { projectName: "新ECサイト開発", workload: "高", role: "開発担当", type: "メイン" },
        { projectName: "デザインシステム構築", workload: "中", role: "コンポーネント設計", type: "サブ" }
      ]
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

  async getEmployeesFiltered(filters: EmployeeFilters): Promise<Employee[]> {
    const employees = Array.from(this.employees.values());

    return employees.filter((employee) => {
      // 年齢フィルター
      if (filters.minAge != undefined && employee.age < filters.minAge) {
        return false;
      }
      if (filters.maxAge != undefined && employee.age > filters.maxAge) {
        return false;
      }

      if (filters.skills && filters.skills.length > 0) {
        const hasAnySkill = filters.skills.some((skill) =>
          employee.skills.includes(skill)
        );
        if (!hasAnySkill) {
          return false;
        }
      }
      return true;
    });
  }
}
