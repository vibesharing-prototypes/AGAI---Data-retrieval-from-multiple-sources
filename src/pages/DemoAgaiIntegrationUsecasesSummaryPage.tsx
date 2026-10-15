import { useNavigate } from "react-router";
import {
  Alert,
  Box,
  Container,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { useSmartAssist } from "../context/SmartAssistContext.js";
import { DEMO_START_PATH, DEMO_SUMMARY } from "../data/demo-agai-integration-usecases.js";

// AGAI integration use cases demo closing screen: what each step needed, and the ask.
export default function DemoAgaiIntegrationUsecasesSummaryPage() {
  const { tokens: { semantic: { color }, core: { spacing } } } = useTheme();
  const navigate = useNavigate();
  const { restartDemo } = useSmartAssist();

  return (
    <Box sx={{ height: "100%", overflowY: "auto", py: spacing["6"].value }}>
      <Container maxWidth="lg">
        <Stack gap={spacing["4"].value}>
          <Typography variant="h1" component="h1">
            What indexing unlocks
          </Typography>

          <TableContainer>
            <Table aria-label="What each step needed">
              <TableHead>
                <TableRow>
                  <TableCell>Step</TableCell>
                  <TableCell>Question</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Today</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {DEMO_SUMMARY.rows.map((r) => (
                  <TableRow key={r.step}>
                    <TableCell>{r.step}</TableCell>
                    <TableCell>{r.question}</TableCell>
                    <TableCell>{r.source}</TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: r.possibleToday ? color.status.success.text.value : color.status.error.text.value,
                      }}
                    >
                      {r.possibleToday ? "Possible" : "Not possible"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack gap={spacing["1"].value}>
            {DEMO_SUMMARY.lines.map((l) => (
              <Typography key={l} variant="body1" sx={{ color: color.type.default.value }}>
                {l}
              </Typography>
            ))}
          </Stack>

          <Alert severity="info" sx={{ maxWidth: 720 }}>
            {DEMO_SUMMARY.ask}
          </Alert>

          <Box>
            <Link
              component="button"
              type="button"
              underline="always"
              onClick={() => {
                restartDemo();
                navigate(DEMO_START_PATH);
              }}
            >
              Restart demo
            </Link>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
