import * as t from "io-ts";

export const EmployeeT = t.type({
  id: t.string,
  name: t.string,
  furigana: t.string,
  age: t.number,
  skills: t.array(t.string),
});

export type Employee = t.TypeOf<typeof EmployeeT>;
