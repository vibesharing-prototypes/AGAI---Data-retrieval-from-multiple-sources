import { useSearchParams } from "react-router";
import { Box, Container, Stack, Typography, useTheme } from "@mui/material";

// AGAI integration use cases demo: stand-in for the product page a Tasks / Decision hub source chip
// would open. Source chips open it in a new browser tab.
export default function DemoSourceStubPage() {
  const { tokens: { semantic: { color }, core: { spacing } } } = useTheme();
  const [params] = useSearchParams();
  const module = params.get("module") ?? "Source";
  const item = params.get("item") ?? "";

  return (
    <Box sx={{ height: "100%", overflowY: "auto", py: spacing["6"].value }}>
      <Container maxWidth="lg">
        <Stack gap={spacing["2"].value} sx={{ maxWidth: 720 }}>
          <Typography variant="body2" sx={{ color: color.type.muted.value, fontWeight: 600 }}>
            {module}
          </Typography>
          <Typography variant="h1" component="h1">
            {item}
          </Typography>
          <Typography variant="body1" sx={{ color: color.type.default.value }}>
            In the product, this opens the item in {module}. This page stands in for it in the prototype.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
