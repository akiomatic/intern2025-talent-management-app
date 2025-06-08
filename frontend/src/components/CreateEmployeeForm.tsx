"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Divider,
  FormControl,    // ★ 追加
  InputLabel,     // ★ 追加
  Select,         // ★ 追加
  MenuItem,       // ★ 追加
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Project } from "@/models/Employee";

// ★ ドロップダウンの選択肢を定義
const workloadOptions = ["高", "中", "低"];
const typeOptions = ["メイン", "サブ"];

export function CreateEmployeeForm() {
  const [name, setName] = useState("");
  const [furigana, setFurigana] = useState("");
  const [nameRomaji, setNameRomaji] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [age, setAge] = useState("");
  const [skills, setSkills] = useState("");
  
  const [projects, setProjects] = useState<Project[]>([
    // ★ Stateの初期値を設定
    { projectName: "", workload: "中", role: "", type: "メイン" },
  ]);

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // ★ Stateを安全に更新するための、より堅牢な実装に変更
  const handleProjectChange = (index: number, field: keyof Project, value: string) => {
    const newProjects = projects.map((project, i) => {
      if (i === index) {
        // 変更があったプロジェクトだけ、新しいオブジェクトを作成して返す
        return { ...project, [field]: value };
      }
      // 変更がなかったプロジェクトは、そのまま返す
      return project;
    });
    setProjects(newProjects);
  };

  const handleAddProject = () => {
    setProjects([...projects, { projectName: "", workload: "中", role: "", type: "メイン" }]);
  };

  const handleRemoveProject = (index: number) => {
    const newProjects = projects.filter((_, i) => i !== index);
    setProjects(newProjects);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const employeeData = {
      name,
      furigana,
      nameRomaji,
      age: parseInt(age, 10),
      skills: skills.split(",").map(s => s.trim()).filter(s => s),
      position,
      department,
      projects: projects.filter(p => p.projectName.trim() !== ""),
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
        router.push("/");
        router.refresh();
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
        <TextField label="氏名" value={name} onChange={(e) => setName(e.target.value)} required />
        <TextField label="ふりがな" value={furigana} onChange={(e) => setFurigana(e.target.value)} />
        <TextField label="ローマ字氏名" value={nameRomaji} onChange={(e) => setNameRomaji(e.target.value)} />
        <TextField label="所属部署" value={department} onChange={(e) => setDepartment(e.target.value)} required />
        <TextField label="役職" value={position} onChange={(e) => setPosition(e.target.value)} required />
        <TextField label="年齢" type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
        <TextField label="スキル (カンマ区切り)" helperText="例: React, TypeScript, AWS" value={skills} onChange={(e) => setSkills(e.target.value)} />
        
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">担当プロジェクト</Typography>
        {projects.map((project, index) => (
          <Paper key={index} variant="outlined" sx={{ p: 2, mt: 1, position: 'relative' }}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField label="プロジェクト名" value={project.projectName} onChange={(e) => handleProjectChange(index, 'projectName', e.target.value)} />
              <TextField label="役割" value={project.role} onChange={(e) => handleProjectChange(index, 'role', e.target.value)} />
              
              {/* ★ TextFieldをSelect（ドロップダウン）に変更 */}
              <FormControl fullWidth>
                <InputLabel id={`workload-label-${index}`}>稼働</InputLabel>
                <Select
                  labelId={`workload-label-${index}`}
                  value={project.workload}
                  label="稼働"
                  onChange={(e) => handleProjectChange(index, 'workload', e.target.value)}
                >
                  {workloadOptions.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id={`type-label-${index}`}>タイプ</InputLabel>
                <Select
                  labelId={`type-label-${index}`}
                  value={project.type}
                  label="タイプ"
                  onChange={(e) => handleProjectChange(index, 'type', e.target.value)}
                >
                  {typeOptions.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {projects.length > 1 && (
              <IconButton onClick={() => handleRemoveProject(index)} sx={{ position: 'absolute', top: 8, right: 8 }} aria-label="delete">
                <RemoveCircleOutlineIcon />
              </IconButton>
            )}
          </Paper>
        ))}

        <Button startIcon={<AddCircleOutlineIcon />} onClick={handleAddProject} sx={{ mt: 1, alignSelf: 'flex-start' }}>
          プロジェクトを追加
        </Button>
        
        {/* ★ キャンセルボタンを追加し、ボタンの配置を調整 */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <Button variant="outlined" onClick={() => router.push('/')}>
            キャンセル
          </Button>
          <Button type="submit" variant="contained">
            社員を登録する
          </Button>
        </Box>
        {error && <Typography color="error" mt={2}>{error}</Typography>}
      </Box>
    </Paper>
  );
}