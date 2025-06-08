import PersonIcon from "@mui/icons-material/Person";
import { Avatar, Box, List, ListItem, ListItemText, Paper, Tab, Tabs, Typography } from "@mui/material";
import { Employee } from "../models/Employee";
import { useCallback, useState } from "react";
import { Chip } from "@mui/material";

const tabPanelValue = {
  basicInfo: "基本情報",
  projects: "担当プロジェクト",
};

type TabPanelValue = keyof typeof tabPanelValue;

interface TabContentProps {
  value: TabPanelValue;
  selectedValue: TabPanelValue;
  children: React.ReactNode;
}

function TabContent({ value, selectedValue, children }: TabContentProps) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== selectedValue}
      id={`tabpanel-${value}`}
      sx={{ pt : 2 }}
    >
      {children}
    </Box>
  );
}

export type EmployeeDetailsProps = {
  employee: Employee;
};

export function EmployeeDetails(prop: EmployeeDetailsProps) {
  const [selectedTabValue, setSelectedTabValue] =
    useState<TabPanelValue>("basicInfo");
  const employee = prop.employee;

  const handleTabValueChange = useCallback(
    (event: React.SyntheticEvent, newValue: TabPanelValue) => {
      setSelectedTabValue(newValue);
    },
    []
  );

  return (
    <Paper sx={{ p: 2 }}>
      <Box
        display={"flex"}
        flexDirection="column"
        alignItems="flex-start"
        gap={1}
      >
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          p={2}
          gap={2}
        >
          <Avatar sx={{ width: 128, height: 128 }}>
            <PersonIcon sx={{ fontSize: 128 }} />
          </Avatar>
          <Box>
            <Typography variant="h4">{employee.name}</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {employee.nameRomaji} ({employee.furigana})
            </Typography>
          </Box>
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}>
          <Tabs value={selectedTabValue} onChange={handleTabValueChange}>
            <Tab label={tabPanelValue.basicInfo} value={"basicInfo"} />
            <Tab label={tabPanelValue.projects} value={"projects"} />
          </Tabs>
        </Box>

        <TabContent value={"basicInfo"} selectedValue={selectedTabValue}>
          <Box p={2} display="flex" flexDirection="column" gap={3}>
            <Box>
              <Typography variant="h6">基本情報</Typography>
              <Typography>所属: {employee.department}</Typography>
              <Typography>役職: {employee.position}</Typography>
              <Typography>年齢: {employee.age}歳</Typography>
            </Box>
            <Box>
              <Typography variant="h6">スキル</Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                {employee.skills.length > 0 ? (
                  employee.skills.map((skill) => (
                    <Chip key={skill} label={skill} color="primary" />
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    登録されているスキルはありません。
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </TabContent>

        <TabContent value={"projects"} selectedValue={selectedTabValue}>
          <Box p={2} display="flex" flexDirection="column" gap={1}>
            <Typography variant="h6">担当プロジェクト</Typography>
            {employee.projects.length > 0 ? (
              <List>
                {employee.projects.map((project, index) => (
                  <ListItem key={index} disableGutters>
                    <ListItemText
                      primary={`${project.projectName} (${project.type})`}
                      secondary={`役割: ${project.role} | 稼働: ${project.workload}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary" mt={1}>
                担当プロジェクトはありません。
              </Typography>
            )}
          </Box>
        </TabContent>
      </Box>
    </Paper>
  );
}
