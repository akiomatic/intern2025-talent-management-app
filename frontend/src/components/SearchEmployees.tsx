"use client";
import { Paper, TextField, Box, ToggleButtonGroup, ToggleButton, FormControl, InputLabel, Select, MenuItem, Fab, } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { useState } from "react";
import { EmployeeListContainer } from "./EmployeeListContainer";
import { type EmployeeListLayout } from "@/types/EmployeeListLayout";

export function SearchEmployees() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [layout, setLayout] = useState<EmployeeListLayout>("list");
  // 並び替えの条件を管理するstate。初期値は「名前 (昇順)」
  const [sortKey, setSortKey] = useState("name_asc");
  return (
    <>
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
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {/* 並び替え用ドロップダウンを追加 */}
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="sort-select-label">並び替え</InputLabel>
            <Select
              labelId="sort-select-label"
              value={sortKey}
              label="並び替え"
              onChange={(e) => setSortKey(e.target.value)}
              size="small"
            >
              <MenuItem value="name_asc">名前 (昇順)</MenuItem>
              <MenuItem value="name_desc">名前 (降順)</MenuItem>
              <MenuItem value="age_asc">年齢 (若い順)</MenuItem>
              <MenuItem value="age_desc">年齢 (高い順)</MenuItem>
              <MenuItem value="skills_desc">スキルの数 (多い順)</MenuItem>
              <MenuItem value="skills_asc">スキルの数 (少ない順)</MenuItem>
            </Select>
          </FormControl>

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
          sortKey={sortKey}
        />
      </Paper>
      <Link href="/employee/new" passHref>
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed', // 画面に固定
            bottom: 32,      // 下から32px
            right: 32,       // 右から32px
          }}
        >
          <AddIcon />
        </Fab>
      </Link>
    </>
  );
}
