import * as t from "io-ts";

export const EmployeeT = t.type({
  id: t.string,
  name: t.string,
  furigana: t.string,
  nameRomaji: t.string,
  age: t.number,
  skills: t.array(t.string),
});

export type Employee = t.TypeOf<typeof EmployeeT>;

// フィルター用
export interface EmployeeFilters {
  name?: string;
  minAge?: number;
  maxAge?: number;
  skills?: string[];
}
