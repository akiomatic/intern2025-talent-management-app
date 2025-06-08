import type {
  LambdaFunctionURLEvent,
  LambdaFunctionURLResult,
} from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Employee } from "./employee/Employee";
import { EmployeeDatabaseDynamoDB } from "./employee/EmployeeDatabaseDynamoDB";
import { EmployeeDatabase } from "./employee/EmployeeDatabase";

const createEmployeeHandler = async (
  database: EmployeeDatabase,
  body: string | undefined
): Promise<LambdaFunctionURLResult> => {
  if (body == null) {
    return { statusCode: 400, body: "Request body is missing." };
  }
  try {
    const employeeData = JSON.parse(body);
    const createdEmployee = await database.createEmployee(employeeData);
    return {
      statusCode: 201,
      body: JSON.stringify(createdEmployee),
    };
  } catch (e) {
    console.error("Failed to parse request body or create employee.", e);
    return { statusCode: 400, body: "Invalid request body." };
  }
};

const getEmployeeHandler = async (
  database: EmployeeDatabase,
  id: string
): Promise<LambdaFunctionURLResult> => {
  const employee: Employee | undefined = await database.getEmployee(id);
  if (employee == null) {
    console.log("A user is not found.");
    return { statusCode: 404 };
  }
  return {
    statusCode: 200,
    body: JSON.stringify(employee),
  };
};

const getEmployeesHandler = async (
  database: EmployeeDatabase,
  filterText: string
): Promise<LambdaFunctionURLResult> => {
  const employees: Employee[] = await database.getEmployees(filterText);
  return {
    statusCode: 200,
    body: JSON.stringify(employees),
  };
};

const getEmployeesFilteredHandler = async (
  database: EmployeeDatabase,
  filters: any
): Promise<LambdaFunctionURLResult> => {
  const employees: Employee[] = await database.getEmployeesFiltered(filters);
  return {
    statusCode: 200,
    body: JSON.stringify(employees),
  };
};

export const handle = async (
  event: LambdaFunctionURLEvent
): Promise<LambdaFunctionURLResult> => {
  console.log("event", event);
  try {
    const tableName = process.env.EMPLOYEE_TABLE_NAME;
    if (tableName == null) {
      throw new Error(
        "The environment variable EMPLOYEE_TABLE_NAME is not specified."
      );
    }
    const client = new DynamoDBClient();
    const database = new EmployeeDatabaseDynamoDB(client, tableName);
    // https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/urls-invocation.html
    const httpMethod = event.requestContext.http.method;
    const path = normalizePath(event.requestContext.http.path);
    const query = event.queryStringParameters;
    // GET /api/employees
    if (httpMethod === "GET" && path === "/api/employees") {
      return getEmployeesHandler(database, query?.filterText ?? "");
    }

    // POST /api/employees
    if (httpMethod === "POST" && path === "/api/employees") {
      return createEmployeeHandler(database, event.body);
    }

    // POST /api/employees/filtered
    if (httpMethod === "POST" && path === "/api/employees/filtered") {
      const filters = JSON.parse(event.body || "{}");
      return getEmployeesFilteredHandler(database, filters);
    }

    // GET /api/employees/:id
    if (httpMethod === "GET" && path.startsWith("/api/employees/")) {
      const id = path.substring("/api/employees/".length);
      return getEmployeeHandler(database, id);
    }

    // 上のどの条件にも当てはまらなかった場合は、すべて無効なリクエストとして扱う
    console.log("Invalid path or method", path, httpMethod);
    return { statusCode: 404, body: "Not Found" };
  } catch (e) {
    console.error("Internal Server Error", e);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error",
      }),
    };
  }
};

function normalizePath(path: string): string {
  return path.endsWith("/") ? path.slice(0, -1) : path;
}
