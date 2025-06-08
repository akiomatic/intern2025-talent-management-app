"use client";

import { useState } from "react";
import Papa from "papaparse";
import { Button, Box, Typography } from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { EmployeeCreationData } from "@/models/Employee"; // 型をインポート

export function CsvImporter() {
  const [message, setMessage] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setMessage("ファイルが選択されませんでした。");
      return;
    }

    setMessage("CSVを処理中...");

    // PapaparseでCSVを解析
    Papa.parse(file, {
      header: true, // 1行目をヘッダーとして扱う
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as any[];
        let successCount = 0;
        let errorCount = 0;

        // 1行ずつAPIに送信
        for (const row of rows) {
          // CSVのヘッダーをEmployeeのデータ構造に変換
          const employeeData: EmployeeCreationData = {
            name: row.name || "",
            furigana: row.furigana || "",
            nameRomaji: row.nameRomaji || "",
            age: parseInt(row.age, 10) || 0,
            skills: row.skills ? row.skills.split(",").map((s: string) => s.trim()) : [],
            position: row.position || "",
            department: row.department || "",
            // プロジェクトはCSVでの一括登録が複雑なため、今回は空で登録
            projects: [], 
          };
          
          try {
            const response = await fetch("/api/employees", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(employeeData),
            });

            if (response.ok) {
              successCount++;
            } else {
              errorCount++;
            }
          } catch (error) {
            errorCount++;
            console.error("API call failed for row:", row, error);
          }
        }
        
        setMessage(`処理完了：成功 ${successCount}件, 失敗 ${errorCount}件`);
        // 成功後、一覧を更新するためにページをリロード
        window.location.reload();
      },
      error: (error) => {
        setMessage("CSVの解析に失敗しました。");
        console.error(error);
      },
    });
  };

  return (
    <Box sx={{ my: 2, p: 2, border: '1px dashed grey', borderRadius: '4px' }}>
      <Typography variant="h6" gutterBottom>CSVから一括登録</Typography>
      <Button
        component="label"
        variant="outlined"
        startIcon={<UploadFileIcon />}
      >
        CSVファイルを選択
        <input type="file" accept=".csv" hidden onChange={handleFileUpload} />
      </Button>
      {message && <Typography sx={{ mt: 1 }}>{message}</Typography>}
    </Box>
  );
}