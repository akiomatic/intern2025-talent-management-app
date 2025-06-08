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
import { Employee, EmployeeT } from "./Employee";
import { randomUUID } from "crypto";

type EmployeeCreationData = Omit<Employee, 'id'>;

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
      name: item["name"].S,
      furigana: item["furigana"]?.S ?? "",
      nameRomaji: item["nameRomaji"]?.S ?? "",
      age: mapNullable(item["age"].N, (value) => parseInt(value, 10)),
      skills: item["skills"]?.L?.map((skill) => skill.S ?? "") ?? [],
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
          id: item["id"].S,
          name: item["name"].S,
          furigana: item["furigana"]?.S ?? "",
          nameRomaji: item["nameRomaji"]?.S ?? "",
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
        skills: { L: newEmployee.skills.map(skill => ({ S: skill })) },
      },
    };

    const command = new PutItemCommand(input);
    await this.client.send(command);

    return newEmployee;
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
