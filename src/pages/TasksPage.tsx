import { NavLink } from "react-router";
import { Box, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import { StatusIndicator } from "@diligentcorp/atlas-react-bundle";
import { TASKS, TASK_LIST, taskPath, type TaskPriority, type TaskStatus } from "../data/demo-products.js";

const STATUS_COLOR: Record<TaskStatus, "default" | "info" | "success" | "warning"> = {
  Open: "default",
  "In progress": "info",
  Completed: "success",
  Blocked: "warning",
};
const PRIORITY_COLOR: Record<TaskPriority, "error" | "warning" | "success"> = { High: "error", Medium: "warning", Low: "success" };

// AGAI integration use cases demo: Tasks list, reached from the left navigation.
export default function TasksPage() {
  const { tokens: { core: { spacing } } } = useTheme();
  return (
    <Box sx={{ height: "100%", overflowY: "auto", py: spacing["4"].value, px: spacing["6"].value }}>
      <Stack gap={spacing["3"].value} sx={{ maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h1" component="h1">Tasks</Typography>
        <TableContainer>
          <Table aria-label="Tasks">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Due date</TableCell>
                <TableCell>Priority</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {TASK_LIST.map((id) => {
                const t = TASKS[id];
                return (
                  <TableRow key={id}>
                    <TableCell><Link component={NavLink} to={taskPath(id)}>{t.title}</Link></TableCell>
                    <TableCell><StatusIndicator color={STATUS_COLOR[t.status]} label={t.status} /></TableCell>
                    <TableCell>{t.dueDate}</TableCell>
                    <TableCell><StatusIndicator color={PRIORITY_COLOR[t.priority]} label={t.priority} /></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
  );
}
