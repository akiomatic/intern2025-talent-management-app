import express, { Request, Response } from "express";
import { EmployeeDatabaseInMemory } from "./employee/EmployeeDatabaseInMemory";

const app = express();
const port = process.env.PORT ?? 8080;
const database = new EmployeeDatabaseInMemory();

app.use(express.json());

app.get("/api/employees", async (req: Request, res: Response) => {
  const filterText = req.query.filterText ?? "";
  // req.query is parsed by the qs module.
  // https://www.npmjs.com/package/qs
  if (Array.isArray(filterText)) {
    // Multiple filterText is not supported
    res.status(400).send();
    return;
  }
  if (typeof filterText !== "string") {
    // Nested query object is not supported
    res.status(400).send();
    return;
  }
  try {
    const employees = await database.getEmployees(filterText);
    res.status(200).send(JSON.stringify(employees));
  } catch (e) {
    console.error(`Failed to load the users filtered by ${filterText}.`, e);
    res.status(500).send();
  }
});

app.get("/api/employees/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const employee = await database.getEmployee(userId);
    if (employee == undefined) {
      res.status(404).send();
      return;
    }
    res.status(200).send(JSON.stringify(employee));
  } catch (e) {
    console.error(`Failed to load the user ${userId}.`, e);
    res.status(500).send();
  }
});

app.post("/api/employees", async (req: Request, res: Response) => {
  try {
    // req.bodyにフロントエンドから送信されたJSONデータが入る
    const newEmployeeData = req.body;

    // バリデーションをここで行うことも可能（今回は省略）

    const createdEmployee = await database.createEmployee(newEmployeeData);
    // 成功した場合、ステータスコード201(Created)と作成されたデータを返す
    res.status(201).send(JSON.stringify(createdEmployee));
  } catch (e) {
    console.error(`Failed to create an employee.`, e);
    res.status(500).send();
  }
});

app.post("/api/employees/filtered", async (req: Request, res: Response) => {
  try {
    const filters = req.body;
    const employees = await database.getEmployeesFiltered(filters);
    res.status(200).send(JSON.stringify(employees));
  } catch (e) {
    console.error(`Failed to filter employees.`, e);
    res.status(500).send();
  }
});

app.listen(port, () => {
  console.log(`App listening on the port ${port}`);
});
