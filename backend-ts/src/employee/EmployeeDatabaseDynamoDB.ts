import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
  PutItemCommand,
  ScanCommand,
  ScanCommandInput,
} from "@aws-sdk/client-dynamodb";
import { isLeft } from "fp-ts/Either";
import { EmployeeDatabase } from "./EmployeeDatabase";
import { Employee, EmployeeT, EmployeeFilters } from "./Employee";
import { randomUUID } from "crypto";
import { id } from "fp-ts/lib/Refinement";

type EmployeeCreationData = Omit<Employee, "id">;

export class EmployeeDatabaseDynamoDB implements EmployeeDatabase {
  private client: DynamoDBClient;
  private tableName: string;

  constructor(client: DynamoDBClient, tableName: string) {
    this.client = client;
    this.tableName = tableName;
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    const input: GetItemCommandInput = {
      TableName: this.tableName,
      Key: {
        id: { S: id },
      },
    };
    const output = await this.client.send(new GetItemCommand(input));
    const item = output.Item;
    if (item == null) {
      return;
    }
    const employee = {
      id: id,
      name: item["name"]?.S,
      furigana: item["furigana"]?.S,
      nameRomaji: item["nameRomaji"]?.S,
      age: mapNullable(item["age"]?.N, (value) => parseInt(value, 10)),
      skills: item["skills"]?.L?.map((skill) => skill.S ?? "") ?? [],
      position: item["position"]?.S,
      department: item["department"]?.S,
      projects: item["projects"]?.L?.map(p => ({
        projectName: p.M?.projectName?.S ?? "",
        workload: p.M?.workload?.S ?? "",
        role: p.M?.role?.S ?? "",
        type: p.M?.type?.S ?? "",
      })) ?? [],
    };
    const decoded = EmployeeT.decode(employee);
    if (isLeft(decoded)) {
      throw new Error(
        `Employee ${id} is missing some fields. ${JSON.stringify(employee)}`
      );
    } else {
      return decoded.right;
    }
  }

  async getEmployees(filterText: string): Promise<Employee[]> {
    const input: ScanCommandInput = {
      TableName: this.tableName,
    };
    const output = await this.client.send(new ScanCommand(input));
    const items = output.Items;
    if (items == null) {
      return [];
    }
    return items
      .filter((item) => {
        if (filterText === "") return true;
        const lower = filterText.toLowerCase();
        return (
          item["name"]?.S?.toLowerCase().includes(lower) ||
          item["furigana"]?.S?.toLowerCase().includes(lower) ||
          item["nameRomaji"]?.S?.toLowerCase().includes(lower)
        );
      })
      .map((item) => {
        return {
          id: id,
          name: item["name"]?.S,
          furigana: item["furigana"]?.S,
          nameRomaji: item["nameRomaji"]?.S,
          age: mapNullable(item["age"]?.N, (value) => parseInt(value, 10)),
          skills: item["skills"]?.L?.map((skill) => skill.S ?? "") ?? [],
          position: item["position"]?.S,
          department: item["department"]?.S,
          projects: item["projects"]?.L?.map(p => ({
            projectName: p.M?.projectName?.S ?? "",
            workload: p.M?.workload?.S ?? "",
            role: p.M?.role?.S ?? "",
            type: p.M?.type?.S ?? "",
          })) ?? [],
            };
      })
      .flatMap((employee) => {
        const decoded = EmployeeT.decode(employee);
        if (isLeft(decoded)) {
          console.error(
            `Employee ${
              employee.id
            } is missing some fields and skipped. ${JSON.stringify(employee)}`
          );
          return [];
        } else {
          return [decoded.right];
        }
      });
  }

  async createEmployee(employeeData: EmployeeCreationData): Promise<Employee> {
    const id = randomUUID();
    const newEmployee: Employee = {
      id: id,
      ...employeeData,
    };

    const input = {
      TableName: this.tableName,
      Item: {
        id: { S: newEmployee.id },
        name: { S: newEmployee.name },
        age: { N: newEmployee.age.toString() },

        skills: { L: newEmployee.skills.map(s => ({ S: s })) },
        position: { S: newEmployee.position },
        department: { S: newEmployee.department },
        projects: { 
          L: newEmployee.projects.map(p => ({
            M: {
              projectName: { S: p.projectName },
              workload: { S: p.workload },
              role: { S: p.role },
              type: { S: p.type },
            }
          }))
        },
      },
    };

    const command = new PutItemCommand(input);
    await this.client.send(command);

    return newEmployee;
  }

  async getEmployeesFiltered(filters: EmployeeFilters): Promise<Employee[]> {
    const input: ScanCommandInput = {
      TableName: this.tableName,
    };
    const output = await this.client.send(new ScanCommand(input));
    const items = output.Items;
    if (items == null) {
      return [];
    }

    return items
      .map((item) => {
        return {
          id: item["id"].S,
          name: item["name"].S,
          age: mapNullable(item["age"].N, (value) => parseInt(value, 10)),
          skills: item["skills"]?.L?.map((skill) => skill.S ?? "") ?? [],
        };
      })
      .flatMap((employee) => {
        const decoded = EmployeeT.decode(employee);
        if (isLeft(decoded)) {
          console.error(
            `Employee ${
              employee.id
            } is missing some fields and skipped. ${JSON.stringify(employee)}`
          );
          return [];
        } else {
          return [decoded.right];
        }
      })
      .filter((employee) => {
        // 名前フィルター
        if (filters.name && !employee.name.includes(filters.name)) {
          return false;
        }

        // 年齢フィルター
        if (filters.minAge !== undefined && employee.age < filters.minAge) {
          return false;
        }
        if (filters.maxAge !== undefined && employee.age > filters.maxAge) {
          return false;
        }

        // スキルフィルター（OR検索）
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

function mapNullable<T, U>(
  value: T | null | undefined,
  mapper: (value: T) => U
): U | undefined {
  if (value != null) {
    return mapper(value);
  }
}
