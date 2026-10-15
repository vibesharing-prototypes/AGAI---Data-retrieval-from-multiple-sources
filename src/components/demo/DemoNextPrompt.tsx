import { Chip, Stack, useTheme } from "@mui/material";
import { useSmartAssist } from "../../context/SmartAssistContext.js";
import { DEMO_STEPS } from "../../data/demo-agai-integration-usecases.js";

// In demo mode the suggestion area shows only the next scripted prompt as a
// single chip. Like the regular suggestion chips, clicking it pastes the prompt
// into the composer and focuses it; the presenter then sends it.
export default function DemoNextPrompt({ align = "center" }: { align?: "center" | "start" }) {
  const { tokens: { semantic: { color } } } = useTheme();
  const { demoStepsDone, setPrompt, requestComposerFocus, isGenerating } = useSmartAssist();
  const next = DEMO_STEPS[demoStepsDone];
  if (!next) return null;
  return (
    <Stack sx={{ width: "100%", alignItems: align === "center" ? "center" : "flex-start" }}>
      <Chip
        label={next.prompt}
        variant="outlined"
        size="large"
        clickable
        disabled={isGenerating}
        onClick={() => {
          setPrompt(next.prompt);
          requestComposerFocus();
        }}
        sx={{
          maxWidth: "100%",
          "&:hover, &.MuiChip-clickable:hover": { backgroundColor: color.surface.variant.value },
        }}
      />
    </Stack>
  );
}
