"use client";
import { Paper, TextField, Box, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useState } from "react";
import { EmployeeListContainer } from "./EmployeeListContainer";
import { type EmployeeListLayout } from "@/types/EmployeeListLayout";

export function SearchEmployees() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [layout, setLayout] = useState<EmployeeListLayout>("list");
  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        flex: 1,
        p: 2,
      }}
    >
      <TextField
        placeholder="検索キーワードを入力してください"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />
      <Box display="flex" justifyContent="flex-end">
        <ToggleButtonGroup
          value={layout}
          onChange={(_, value) => setLayout(value as unknown as EmployeeListLayout)}
          exclusive
          aria-label="layout"
        >
          <ToggleButton value="list">リスト</ToggleButton>
          <ToggleButton value="card">カード</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <EmployeeListContainer
        key="employeesContainer"
        filterText={searchKeyword}
        layout={layout}
      />
    </Paper>
  );
}
