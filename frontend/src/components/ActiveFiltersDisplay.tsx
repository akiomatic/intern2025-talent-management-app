"use client";
import { Box, Chip, Typography, Button } from "@mui/material";
import { EmployeeFilters } from "../models/Employee";

interface ActiveFiltersDisplayProps {
  filters: EmployeeFilters;
  onRemoveFilter: (
    filterType: "minAge" | "maxAge" | "skills",
    value?: string
  ) => void;
  onClearAll: () => void;
}

export function ActiveFiltersDisplay({
  filters,
  onRemoveFilter,
  onClearAll,
}: ActiveFiltersDisplayProps) {
  // フィルター条件が何もない場合は表示しない
  const hasFilters =
    filters.minAge !== undefined ||
    filters.maxAge !== undefined ||
    (filters.skills && filters.skills.length > 0);

  if (!hasFilters) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography variant="body2" color="text.secondary">
        📋 適用中のフィルター:
      </Typography>
      <Box
        sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}
      >
        {/* 年齢フィルター */}
        {(filters.minAge !== undefined || filters.maxAge !== undefined) && (
          <Chip
            label={`年齢: ${filters.minAge ?? 18}-${filters.maxAge ?? 70}歳`}
            onDelete={() => {
              onRemoveFilter("minAge");
              onRemoveFilter("maxAge");
            }}
            color="primary"
            variant="outlined"
          />
        )}

        {/* スキルフィルター */}
        {filters.skills?.map((skill) => (
          <Chip
            key={skill}
            label={skill}
            onDelete={() => onRemoveFilter("skills", skill)}
            color="secondary"
            variant="outlined"
          />
        ))}

        {/* すべてクリアボタン */}
        <Button size="small" onClick={onClearAll} sx={{ ml: 1 }}>
          すべてクリア
        </Button>
      </Box>
    </Box>
  );
}
