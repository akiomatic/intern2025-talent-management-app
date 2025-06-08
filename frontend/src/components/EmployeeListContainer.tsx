"use client";
import { useEffect, useMemo } from "react";
import useSWR from "swr";
import * as t from "io-ts";
import { isLeft } from "fp-ts/Either";
import { EmployeeListItem } from "./EmployeeListItem";
import { Employee, EmployeeT, EmployeeFilters } from "../models/Employee";
import { type EmployeeListLayout } from "@/types/EmployeeListLayout";
import { Grid } from "@mui/material";

export type EmployeesContainerProps = {
  filterText: string;
  layout: EmployeeListLayout;
  sortKey: string;
  detailedFilters: EmployeeFilters;
};

const EmployeesT = t.array(EmployeeT);

const employeesFetcher = async (url: string): Promise<Employee[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch employees at ${url}`);
  }
  const body = await response.json();
  const decoded = EmployeesT.decode(body);
  if (isLeft(decoded)) {
    throw new Error(`Failed to decode employees ${JSON.stringify(body)}`);
  }
  return decoded.right;
};

// 詳細フィルター用のfetcher
const detailedEmployeesFetcher = async (
  nameFilter: string,
  filters: EmployeeFilters
): Promise<Employee[]> => {
  const response = await fetch("/api/employees/filtered", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: nameFilter,
      ...filters,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch filtered employees`);
  }

  const body = await response.json();
  const decoded = EmployeesT.decode(body);
  if (isLeft(decoded)) {
    throw new Error(`Failed to decode employees ${JSON.stringify(body)}`);
  }
  return decoded.right;
};

export function EmployeeListContainer({
  filterText,
  layout,
  sortKey,
  detailedFilters,
}: EmployeesContainerProps) {
  const encodedFilterText = encodeURIComponent(filterText);

  const shouldUseDetailedFilter =
    detailedFilters.minAge != undefined ||
    detailedFilters.maxAge != undefined ||
    (detailedFilters.skills && detailedFilters.skills.length > 0);

  const { data, error, isLoading } = useSWR<Employee[], Error>(
    shouldUseDetailedFilter
      ? `filtered-employees-${encodedFilterText}-${JSON.stringify(
          detailedFilters
        )}`
      : `/api/employees?filterText=${encodedFilterText}`,
    shouldUseDetailedFilter
      ? () => detailedEmployeesFetcher(filterText, detailedFilters)
      : employeesFetcher
  );

  // useMemoを使って、dataかsortKeyが変更された時だけ並び替えを実行
  const sortedData = useMemo(() => {
    // APIからデータがまだ返ってきていない場合は空配列を返す
    if (!data) {
      return [];
    }
    // 元のdata配列を直接変更しないようにコピーを作成
    const newEmployees = [...data];
    newEmployees.sort((a, b) => {
      const [key, direction] = sortKey.split("_");
      const isAsc = direction === "asc";
      const order = isAsc ? 1 : -1;

      switch (key) {
        case "name":
          return a.name.localeCompare(b.name) * order;
        case "age":
          return (a.age - b.age) * order;
        case "skills":
          return (a.skills.length - b.skills.length) * order;
        default:
          return 0;
      }
    });
    return newEmployees;
  }, [data, sortKey]);

  useEffect(() => {
    if (error != null) {
      console.error(`Failed to fetch employees filtered by filterText`, error);
    }
  }, [error, filterText]);
  if (data != null) {
    // 表示する際には、元の `data` の代わりにソート済みの `sortedData` を使う
    if (layout === "list") {
      return sortedData.map((employee) => (
        <EmployeeListItem employee={employee} key={employee.id} />
      ));
    }
    return (
      <Grid container spacing={2}>
        {sortedData.map((employee) => (
          <Grid key={employee.id} size={{ xs: 6, md: 4 }}>
            <EmployeeListItem employee={employee} />
          </Grid>
        ))}
      </Grid>
    );
  }
  if (isLoading) {
    return <p>Loading employees...</p>;
  }
}
