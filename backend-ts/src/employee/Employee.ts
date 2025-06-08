import * as t from "io-ts";

const ProjectT = t.type({
  projectName: t.string,
  workload: t.string,
  role: t.string,
  type: t.string,
});

export const EmployeeT = t.type({
  id: t.string,
  name: t.string,
  furigana: t.string,
  nameRomaji: t.string,
  age: t.number,
  skills: t.array(t.string),
  position: t.string,
  department: t.string,
  projects: t.array(ProjectT),
});

export type Employee = t.TypeOf<typeof EmployeeT>;
export type Project = t.TypeOf<typeof ProjectT>;
export type EmployeeCreationData = Omit<Employee, "id">;


// フィルター用
export interface EmployeeFilters {
  name?: string;
  minAge?: number;
  maxAge?: number;
  skills?: string[];
}
