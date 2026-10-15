import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Box, Button, Card, Link, MenuItem, Select, Stack, TextField, Typography, useTheme } from "@mui/material";
import { DropZone, OverflowBreadcrumbs, PageHeader, StatusIndicator } from "@diligentcorp/atlas-react-bundle";
import UploadIcon from "@diligentcorp/atlas-react-bundle/icons/Upload";
import { TASKS, TASK_STATUSES, type TaskPriority, type TaskStatus } from "../data/demo-products.js";

const STATUS_COLOR: Record<TaskStatus, "default" | "info" | "success" | "warning"> = {
  Open: "default",
  "In progress": "info",
  Completed: "success",
  Blocked: "warning",
};

const PRIORITY_COLOR: Record<TaskPriority, "error" | "warning" | "success"> = {
  High: "error",
  Medium: "warning",
  Low: "success",
};

// AGAI integration use cases demo: Tasks detail page, opened in a new tab from an AI answer's source chip.
export default function TaskDetailPage() {
  const { tokens: { semantic: { color }, core: { spacing } } } = useTheme();
  const navigate = useNavigate();
  const { taskId = "" } = useParams();
  const task = TASKS[taskId];
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "Open");
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  const [files, setFiles] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const addFiles = (list: FileList | null) => {
    if (list?.length) setFiles((f) => [...f, ...Array.from(list).map((x) => x.name)]);
  };
  const sendNote = () => {
    const text = noteText.trim();
    if (!text) return;
    setNotes((n) => [...n, text]);
    setNoteText("");
  };

  if (!task) {
    return (
      <Box sx={{ height: "100%", overflowY: "auto", p: spacing["6"].value }}>
        <Typography variant="h1" component="h1">We couldn't find this task</Typography>
      </Box>
    );
  }

  const labelSx = { fontWeight: 600, color: color.type.default.value };

  return (
    <Box sx={{ height: "100%", overflowY: "auto", py: spacing["4"].value, px: spacing["6"].value }}>
      <Stack gap={spacing["3"].value} sx={{ maxWidth: 1200, mx: "auto" }}>
        <PageHeader
          pageTitle={task.title}
          slotProps={{ backButton: { "aria-label": "Back to tasks", onClick: () => navigate(-1) } }}
          breadcrumbs={
            <OverflowBreadcrumbs
              leadingElement={<span>AI Boards</span>}
              items={[
                { id: "tasks", label: "Tasks", url: "" },
                { id: "task", label: task.title, url: "", isCurrent: true },
              ]}
              aria-label="Breadcrumbs"
            >
              {({ label }) => <span>{label}</span>}
            </OverflowBreadcrumbs>
          }
        />

        <Box sx={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)", gap: spacing["3"].value, alignItems: "start" }}>
          <Stack gap={spacing["2"].value}>
            <Card variant="outlined" sx={{ p: spacing["3"].value }}>
              <Stack gap={spacing["1"].value}>
                <Typography component="h2" variant="subtitle1" sx={labelSx}>Details</Typography>
                <Typography variant="body2">{task.details}</Typography>
              </Stack>
            </Card>

            {notes.length > 0 && (
              <Stack component="ul" gap={spacing["1"].value} sx={{ m: 0, p: 0, listStyle: "none" }} aria-label="Notes">
                {notes.map((n, i) => (
                  <Card key={i} component="li" variant="outlined" sx={{ p: spacing["2"].value }}>
                    <Typography variant="body2">{n}</Typography>
                  </Card>
                ))}
              </Stack>
            )}

            <Stack
              component="form"
              direction="row"
              gap={spacing["1"].value}
              onSubmit={(e) => { e.preventDefault(); sendNote(); }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Add a note"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                inputProps={{ "aria-label": "Add a note" }}
              />
              <Button type="submit" variant="outlined" disabled={!noteText.trim()}>Send</Button>
            </Stack>

            <input ref={fileInput} type="file" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
            <DropZone
              isDragging={isDragging}
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); }}
              sx={{ width: "100%", cursor: "pointer" }}
              onClick={() => fileInput.current?.click()}
            >
              <Stack alignItems="center" gap="4px">
                <UploadIcon />
                <Link
                  component="button"
                  type="button"
                  variant="subtitle2"
                  underline="none"
                  onClick={(e) => { e.stopPropagation(); fileInput.current?.click(); }}
                  sx={{ color: color.type.default.value, fontWeight: 600 }}
                >
                  Drag a file here or click to browse
                </Link>
                <Typography variant="body2" sx={{ color: color.type.muted.value }}>
                  You can also reply to the email with the file attached
                </Typography>
              </Stack>
            </DropZone>
            {files.length > 0 && (
              <Stack component="ul" gap="4px" sx={{ m: 0, p: 0, listStyle: "none" }} aria-label="Uploaded files">
                {files.map((f, i) => <Typography key={i} component="li" variant="body2">{f}</Typography>)}
              </Stack>
            )}
          </Stack>

          <Stack gap={spacing["2"].value}>
            <Stack gap={spacing["1"].value}>
              <Typography component="label" id="task-status-label" variant="body2" sx={labelSx}>Status</Typography>
              <Select
                size="small"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                inputProps={{ "aria-labelledby": "task-status-label" }}
                renderValue={(v) => <StatusIndicator color={STATUS_COLOR[v as TaskStatus]} label={v as string} />}
              >
                {TASK_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </Stack>

            <Card variant="outlined" sx={{ p: spacing["3"].value }}>
              <Stack gap={spacing["2"].value}>
                <Typography component="h2" variant="subtitle1" sx={labelSx}>Assigned to You</Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: spacing["2"].value }}>
                  <Stack gap="4px">
                    <Typography variant="body2" sx={labelSx}>Due date</Typography>
                    <Typography variant="body1">{task.dueDate}</Typography>
                  </Stack>
                  <Stack gap="4px" alignItems="flex-start">
                    <Typography variant="body2" sx={labelSx}>Priority</Typography>
                    <StatusIndicator color={PRIORITY_COLOR[task.priority]} label={task.priority} />
                  </Stack>
                </Box>
              </Stack>
            </Card>

            <Typography variant="caption" sx={{ color: color.type.muted.value }}>
              Created by: {task.createdBy}, {task.createdOn}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
