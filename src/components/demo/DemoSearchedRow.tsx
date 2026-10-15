import { Typography, useTheme } from "@mui/material";
import { modulesSearched } from "../../data/demo-agai-integration-usecases.js";
import type { Source } from "../../data/mockData.js";

// One-line "Searched: Task Hub · Books" row under each demo answer.
export default function DemoSearchedRow({ sources }: { sources?: Source[] }) {
  const { tokens: { semantic: { color } } } = useTheme();
  const modules = modulesSearched(sources);
  if (modules.length === 0) return null;
  return (
    <Typography sx={{ fontSize: "12px", lineHeight: "16px", color: color.type.muted.value, mt: "8px" }}>
      Searched: {modules.join(" · ")}
    </Typography>
  );
}
