"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

export function CreateEmployeeForm() {
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
      setError("氏名と正しい年齢を入力してください。");
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
        alert("社員が追加されました！");
        router.push("/"); // 社員一覧ページ（ルート）にリダイレクト
        router.refresh(); // サーバーのデータを再取得して一覧を更新
      } else {
        const errorData = await response.text();
        setError(`作成に失敗しました: ${errorData}`);
      }
    } catch (e) {
      setError("通信エラーが発生しました。");
      console.error(e);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>社員の追加</Typography>
      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
        <TextField
          label="氏名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="年齢"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <TextField
          label="スキル (カンマ区切り)"
          helperText="例: React, TypeScript, AWS"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          追加する
        </Button>
        {error && <Typography color="error" mt={2}>{error}</Typography>}
      </Box>
    </Paper>
  );
}