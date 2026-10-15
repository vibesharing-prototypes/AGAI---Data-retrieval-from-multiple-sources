import { useNavigate } from "react-router";
import { Box, Button, Divider, Link, Stack, Typography, useTheme } from "@mui/material";
import { useSmartAssist } from "../../context/SmartAssistContext.js";
import { useCitationPreview } from "../../context/CitationPreviewContext.js";
import { DEMO_STEPS, DEMO_SUMMARY_PATH } from "../../data/demo-agai-integration-usecases.js";

const RAIL_WIDTH = 320;
const RAIL_BG = "#FCFCFF";

// Presenter notes beside the chat (AGAI integration use cases demo only). Opened and closed from
// the notes button in the header. Sits outside the answer column so it never
// covers citations or source cards.
export default function DemoRail() {
  const { tokens: { semantic: { color } } } = useTheme();
  const navigate = useNavigate();
  const { demoStepsDone, demoNotesOpen, closeOverlay, restartDemo } = useSmartAssist();
  const { closeCitation } = useCitationPreview();

  if (!demoNotesOpen) return null;

  const total = DEMO_STEPS.length;
  const done = Math.min(demoStepsDone, total);
  const note = done > 0 ? DEMO_STEPS[done - 1].rail : null;
  const finished = done >= total;

  const label = (text: string) => (
    <Typography sx={{ fontSize: "12px", fontWeight: 600, lineHeight: "16px", color: color.type.muted.value }}>
      {text}
    </Typography>
  );
  const body = { fontSize: "14px", lineHeight: "20px", color: color.type.default.value } as const;
  const bullets = (items: string[], extra: object = {}) => (
    <Box component="ul" sx={{ m: 0, mt: "4px", pl: "20px" }}>
      {items.map((t) => (
        <Typography key={t} component="li" sx={{ ...body, ...extra }}>
          {t}
        </Typography>
      ))}
    </Box>
  );

  return (
    <Box
      component="aside"
      aria-label="Presentation notes"
      sx={{
        width: RAIL_WIDTH,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        borderLeft: `1px solid ${color.ui.divider.default.value}`,
        backgroundColor: RAIL_BG,
        height: "100%",
      }}
    >
      <Stack gap="20px" sx={{ p: "20px", flex: 1, overflowY: "auto" }}>
        <Typography component="h2" sx={{ fontSize: "16px", fontWeight: 600, lineHeight: "24px", color: color.type.default.value }}>
          Presentation notes
        </Typography>
        {note ? (
          <>
            <Box>
              {label("User flow without the MCP connection")}
              {bullets(
                note.today,
                // Possible today keeps its positive colour; otherwise it's what the user has to do by hand.
                note.possibleToday ? { color: color.status.success.text.value } : {},
              )}
            </Box>
            <Box>
              {label("Source")}
              <Typography sx={{ ...body, mt: "2px" }}>{note.source}</Typography>
            </Box>
            <Box>
              {label("How the MCP connector can help in this user request")}
              {bullets(note.benefits)}
            </Box>
            <Box>
              {label("Use case")}
              <Stack gap="12px" sx={{ mt: "4px" }}>
                {note.useCases.map((uc) => (
                  <Box key={uc.href}>
                    <Link href={uc.href} target="_blank" rel="noopener noreferrer" sx={{ fontSize: "14px", lineHeight: "20px", fontWeight: 600 }}>
                      {uc.label}
                    </Link>
                    <Box component="ul" sx={{ m: 0, mt: "4px", pl: "20px" }}>
                      {uc.points.map((p) => (
                        <Typography key={p} component="li" sx={body}>
                          {p}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          </>
        ) : (
          <Typography sx={body}>Send the first prompt to start. Notes for each step show here.</Typography>
        )}
      </Stack>

      <Divider />
      <Stack gap="12px" sx={{ px: "20px", py: "16px" }}>
        {finished && (
          <Button
            variant="contained"
            onClick={() => {
              closeOverlay();
              navigate(DEMO_SUMMARY_PATH);
            }}
          >
            Finish
          </Button>
        )}
        {/* Back to the welcome chat screen; skips the intro story. */}
        <Button
          variant="outlined"
          onClick={() => {
            restartDemo();
            closeCitation();
          }}
        >
          Restart proto
        </Button>
      </Stack>
    </Box>
  );
}
