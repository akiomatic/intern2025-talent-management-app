"use client";
import {
  Paper,
  TextField,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
  Button,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { EmployeeListContainer } from "./EmployeeListContainer";
import { type EmployeeListLayout } from "@/types/EmployeeListLayout";
import { DetailedFilterModal } from "./DetailedFilterModal";
import { EmployeeFilters } from "../models/Employee";
import { useTranslations } from "next-intl";
import { ActiveFiltersDisplay } from "./ActiveFiltersDisplay";
import { CsvImporter } from "./CsvImporter";

export function SearchEmployees() {
  const t = useTranslations("page.home");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [layout, setLayout] = useState<EmployeeListLayout>("list");
  // 並び替えの条件を管理するstate。初期値は「名前 (昇順)」
  const [sortKey, setSortKey] = useState("name_asc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailedFilters, setDetailedFilters] = useState<EmployeeFilters>({});

  const handleApplyFilters = (filters: EmployeeFilters) => {
    setDetailedFilters(filters);
  };

  const handleRemoveFilter = (
    filterType: "minAge" | "maxAge" | "skills",
    value?: string
  ) => {
    const newFilters = { ...detailedFilters };

    if (filterType === "minAge" || filterType === "maxAge") {
      // 年齢フィルターを削除
      delete newFilters.minAge;
      delete newFilters.maxAge;
    } else if (filterType === "skills" && value) {
      // 特定のスキルを削除
      newFilters.skills = newFilters.skills?.filter((skill) => skill !== value);
      if (newFilters.skills?.length === 0) {
        delete newFilters.skills;
      }
    }

    setDetailedFilters(newFilters);
  };

  const handleClearAllFilters = () => {
    setDetailedFilters({});
  };

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
        {/* 検索エリア */}
        <Box display="flex" gap={1}>
          <TextField
            placeholder={t("searchPlaceholder")}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            sx={{ flex: 1 }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setIsModalOpen(true)}
          >
            {t("filter.title")}
          </Button>
        </Box>

        {/* 適用中のフィルタ表示*/}
        <ActiveFiltersDisplay
          filters={detailedFilters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {/* 並び替え用ドロップダウンを追加 */}
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="sort-select-label">{t("sort.title")}</InputLabel>
            <Select
              labelId="sort-select-label"
              value={sortKey}
              label={t("sort.title")}
              onChange={(e) => setSortKey(e.target.value)}
              size="small"
            >
              <MenuItem value="name_asc">{t("sort.nameAsc")}</MenuItem>
              <MenuItem value="name_desc">{t("sort.nameDesc")}</MenuItem>
              <MenuItem value="age_asc">{t("sort.ageAsc")}</MenuItem>
              <MenuItem value="age_desc">{t("sort.ageDesc")}</MenuItem>
              <MenuItem value="skills_desc">{t("sort.skillsDesc")}</MenuItem>
              <MenuItem value="skills_asc">{t("sort.skillsAsc")}</MenuItem>
            </Select>
          </FormControl>

          <ToggleButtonGroup
            value={layout}
            onChange={(_, value) =>
              setLayout(value as unknown as EmployeeListLayout)
            }
            exclusive
            aria-label="layout"
          >
            <ToggleButton value="list">{t("layout.list")}</ToggleButton>
            <ToggleButton value="card">{t("layout.card")}</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <EmployeeListContainer
          key="employeesContainer"
          filterText={searchKeyword}
          layout={layout}
          sortKey={sortKey}
          detailedFilters={detailedFilters}
        />
        <CsvImporter /> 
      </Paper>

      {/*詳細検索 */}
      <DetailedFilterModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApplyFilters}
        initialFilters={detailedFilters}
      />

      <Link href="/employee/new" passHref>
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed", // 画面に固定
            bottom: 32, // 下から32px
            right: 32, // 右から32px
          }}
        >
          <AddIcon />
        </Fab>
      </Link>
    </>
  );
}
