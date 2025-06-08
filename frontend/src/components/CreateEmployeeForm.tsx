"use client";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useTranslations } from "next-intl";

const EXAMPLES_SKILLS: string[] = ["React", "TypeScript", "AWS"];

export function CreateEmployeeForm() {
  const t = useTranslations("page.employee.new.form");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [skills, setSkills] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const employeeData = {
      name,
      age: parseInt(age, 10),
      // スキルはカンマ区切りで入力させ、配列に変換
      skills: skills.split(",").map(s => s.trim()).filter(s => s),
    };

    if (!name || isNaN(employeeData.age) || employeeData.age <= 0) {
      setError(t("errors.invalidInput"));
      return;
    }

    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData),
      });
      if (response.ok) {
        alert(t("success"));
        router.push("/"); // 社員一覧ページ（ルート）にリダイレクト
        router.refresh(); // サーバーのデータを再取得して一覧を更新
      } else {
        const errorData = await response.text();
        setError(t("errors.failedToCreate", { error: errorData }));
      }
    } catch (e) {
      setError(t("errors.communicationError"));
      console.error(e);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>{t("title")}</Typography>
      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
        <TextField
          label={t("name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label={t("age")}
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <TextField
          label={t("skills")}
          helperText={t("helperText", { skills: EXAMPLES_SKILLS.join(", ") })}
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          {t("submit")}
        </Button>
        {error && <Typography color="error" mt={2}>{error}</Typography>}
      </Box>
    </Paper>
  );
}