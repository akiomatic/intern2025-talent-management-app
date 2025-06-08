"use client";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
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
import { useTranslations } from "next-intl";

const EXAMPLES_SKILLS: string[] = ["React", "TypeScript", "AWS"];

// ★ ドロップダウンの選択肢を定義
const workloadOptions = ["high", "medium", "low"];
const typeOptions = ["main", "sub"];

export function CreateEmployeeForm() {
  const t = useTranslations("page.employee.new.form");
  const [name, setName] = useState("");
  const [furigana, setFurigana] = useState("");
  const [nameRomaji, setNameRomaji] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [age, setAge] = useState("");
  const [skills, setSkills] = useState("");
  
  const [projects, setProjects] = useState<Project[]>([
    // ★ Stateの初期値を設定
    { projectName: "", workload: "medium", role: "", type: "main" },
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
        <TextField label={t("name")} value={name} onChange={(e) => setName(e.target.value)} required />
        <TextField label={t("furigana")} value={furigana} onChange={(e) => setFurigana(e.target.value)} />
        <TextField label={t("nameRomaji")} value={nameRomaji} onChange={(e) => setNameRomaji(e.target.value)} />
        <TextField label={t("department")} value={department} onChange={(e) => setDepartment(e.target.value)} required />
        <TextField label={t("position")} value={position} onChange={(e) => setPosition(e.target.value)} required />
        <TextField label={t("age")} type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
        <TextField label={t("skills")} helperText={t("helperText", { skills: EXAMPLES_SKILLS.join(", ") })} value={skills} onChange={(e) => setSkills(e.target.value)} />
        
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">{t("projects.title")}</Typography>
        {projects.map((project, index) => (
          <Paper key={index} variant="outlined" sx={{ p: 2, mt: 1, position: 'relative' }}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField label={t("projects.projectName")} value={project.projectName} onChange={(e) => handleProjectChange(index, 'projectName', e.target.value)} />
              <TextField label={t("projects.role")} value={project.role} onChange={(e) => handleProjectChange(index, 'role', e.target.value)} />
              
              {/* ★ TextFieldをSelect（ドロップダウン）に変更 */}
              <FormControl fullWidth>
                <InputLabel id={`workload-label-${index}`}>{t("projects.workload.title")}</InputLabel>
                <Select
                  labelId={`workload-label-${index}`}
                  value={project.workload}
                  label={t("projects.workload.title")}
                  onChange={(e) => handleProjectChange(index, 'workload', e.target.value)}
                >
                  {workloadOptions.map(option => (
                    <MenuItem key={option} value={option}>{t(`projects.workload.${option}`)}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id={`type-label-${index}`}>{t("projects.type.title")}</InputLabel>
                <Select
                  labelId={`type-label-${index}`}
                  value={project.type}
                  label={t("projects.type.title")}
                  onChange={(e) => handleProjectChange(index, 'type', e.target.value)}
                >
                  {typeOptions.map(option => (
                    <MenuItem key={option} value={option}>{t(`projects.type.${option}`)}</MenuItem>
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
          {t("projects.addProject")}
        </Button>
        
        {/* ★ キャンセルボタンを追加し、ボタンの配置を調整 */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <Button variant="outlined" onClick={() => router.push('/')}>
            {t("cancel")}
          </Button>
          <Button type="submit" variant="contained">
            {t("submit")}
          </Button>
        </Box>
        {error && <Typography color="error" mt={2}>{error}</Typography>}
      </Box>
    </Paper>
  );
}