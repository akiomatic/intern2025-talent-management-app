"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";
import { EmployeeFilters } from "../models/Employee";
import { useTranslations } from "next-intl";

interface DetailedFilterModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: EmployeeFilters) => void;
  initialFilters?: EmployeeFilters;
}

// 利用可能なスキル一覧（後で動的に取得可能）
const AVAILABLE_SKILLS = ["Python", "AWS", "React", "TypeScript", "JavaScript"];

export function DetailedFilterModal({
  open,
  onClose,
  onApply,
  initialFilters = {},
}: DetailedFilterModalProps) {
  const t = useTranslations("page.home.filter");
  const [ageRange, setAgeRange] = useState<number[]>([
    initialFilters.minAge ?? 20,
    initialFilters.maxAge ?? 60,
  ]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    initialFilters.skills ?? []
  );

  useEffect(() => {
    setAgeRange([initialFilters.minAge ?? 20, initialFilters.maxAge ?? 60]);
    setSelectedSkills(initialFilters.skills ?? []);
  }, [initialFilters]);

  const handleAgeChange = (event: Event, newValue: number | number[]) => {
    setAgeRange(newValue as number[]);
  };

  const handleSkillChange = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleApply = () => {
    const filters: EmployeeFilters = {
      minAge: ageRange[0],
      maxAge: ageRange[1],
      skills: selectedSkills.length > 0 ? selectedSkills : undefined,
    };
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    setAgeRange([20, 60]);
    setSelectedSkills([]);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("title")}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>{t("ageRange")}</Typography>
          <Slider
            value={ageRange}
            onChange={handleAgeChange}
            valueLabelDisplay="auto"
            min={18}
            max={70}
            marks={[
              { value: 20, label: "20" },
              { value: 30, label: "30" },
              { value: 40, label: "40" },
              { value: 50, label: "50" },
              { value: 60, label: "60" },
            ]}
          />
          <Typography variant="body2" color="text.secondary">
            {t("minToMaxAge", { min: ageRange[0], max: ageRange[1] })}
          </Typography>
        </Box>

        <Box>
          <Typography gutterBottom>{t("skills")}</Typography>
          <FormGroup>
            {AVAILABLE_SKILLS.map((skill) => (
              <FormControlLabel
                key={skill}
                control={
                  <Checkbox
                    checked={selectedSkills.includes(skill)}
                    onChange={() => handleSkillChange(skill)}
                  />
                }
                label={skill}
              />
            ))}
          </FormGroup>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClear}>{t("clear")}</Button>
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button onClick={handleApply} variant="contained">
          {t("apply")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
