import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import {
  Avatar,
  Box,
  Card,
  Chip,
  InputAdornment,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { OverflowBreadcrumbs, PageHeader, StatusIndicator } from "@diligentcorp/atlas-react-bundle";
import SearchIcon from "@diligentcorp/atlas-react-bundle/icons/Search";
import { DOCUMENTS } from "../data/documents.js";
import { APPROVALS, type ApprovalResponse } from "../data/demo-products.js";

const RESPONSES: ApprovalResponse[] = ["Approved", "Rejected", "Abstained", "Awaiting response"];

const RESPONSE_COLOR: Record<ApprovalResponse, "success" | "error" | "default" | "info"> = {
  Approved: "success",
  Rejected: "error",
  Abstained: "default",
  "Awaiting response": "info",
};

// AGAI integration use cases demo: Decision hub approval detail page, opened in a new tab from an AI
// answer's source chip. Read-only (the approval is closed).
export default function ApprovalDetailPage() {
  const { tokens: { semantic: { color }, core: { spacing } } } = useTheme();
  const { approvalId = "" } = useParams();
  const approval = APPROVALS[approvalId];
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("tab") === "progress" ? 2 : 0);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<ApprovalResponse[]>([]);

  const participants = useMemo(
    () =>
      (approval?.participants ?? []).filter(
        (p) =>
          p.name.toLowerCase().includes(query.trim().toLowerCase()) &&
          (filters.length === 0 || filters.includes(p.response)),
      ),
    [approval, query, filters],
  );

  if (!approval) {
    return (
      <Box sx={{ height: "100%", overflowY: "auto", p: spacing["6"].value }}>
        <Typography variant="h1" component="h1">We couldn't find this approval</Typography>
      </Box>
    );
  }

  const doc = DOCUMENTS[approval.resolutionDocumentId];
  const toggleFilter = (r: ApprovalResponse) =>
    setFilters((f) => (f.includes(r) ? f.filter((x) => x !== r) : [...f, r]));

  return (
    <Box sx={{ height: "100%", overflowY: "auto", py: spacing["4"].value, px: spacing["6"].value }}>
      <Stack gap={spacing["3"].value} sx={{ maxWidth: 1200, mx: "auto" }}>
        <PageHeader
          pageTitle={approval.title}
          statusIndicator={
            <Stack direction="row" gap="8px" sx={{ marginBottom: "auto", marginTop: 0.5 }}>
              <StatusIndicator color={approval.status === "Closed" ? "success" : "info"} label={approval.status} />
              <StatusIndicator color="default" label="View only" />
            </Stack>
          }
          pageSubtitle={`Published: ${approval.published} • Closed: ${approval.closed}`}
          breadcrumbs={
            <OverflowBreadcrumbs
              leadingElement={<span>AI Boards</span>}
              items={[
                { id: "hub", label: "Decision hub", url: "" },
                { id: "approvals", label: "Approvals", url: "" },
                { id: "approval", label: approval.title, url: "", isCurrent: true },
              ]}
              aria-label="Breadcrumbs"
            >
              {({ label }) => <span>{label}</span>}
            </OverflowBreadcrumbs>
          }
        />

        <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="Approval sections">
          <Tab label="Resolution document" id="approval-tab-0" aria-controls="approval-panel-0" />
          <Tab label="Supporting materials" id="approval-tab-1" aria-controls="approval-panel-1" />
          <Tab label="Progress" id="approval-tab-2" aria-controls="approval-panel-2" />
        </Tabs>

        {tab === 0 && (
          <Card variant="outlined" id="approval-panel-0" role="tabpanel" aria-labelledby="approval-tab-0" sx={{ overflow: "hidden" }}>
            <Typography component="h2" variant="subtitle1" sx={{ p: spacing["3"].value, borderBottom: `1px solid ${color.ui.divider.default.value}` }}>
              {approval.resolutionLabel}
            </Typography>
            <Stack alignItems="center" gap={spacing["2"].value} sx={{ py: spacing["3"].value, backgroundColor: color.surface.default.value }}>
              {doc.pages.map((p) => (
                <Box key={p.page} sx={{ width: "min(764px, 90%)", lineHeight: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.12)", backgroundColor: "#fff" }}>
                  <img src={p.image} alt={`${doc.title}, page ${p.page}: ${p.label}`} style={{ display: "block", width: "100%", height: "auto" }} />
                </Box>
              ))}
            </Stack>
          </Card>
        )}

        {tab === 1 && (
          <Box id="approval-panel-1" role="tabpanel" aria-labelledby="approval-tab-1">
            <Typography variant="body1" sx={{ color: color.type.muted.value }}>
              {approval.supportingMaterials.length === 0 ? "No supporting materials were attached to this approval." : ""}
            </Typography>
          </Box>
        )}

        {tab === 2 && (
          <Stack gap={spacing["2"].value} id="approval-panel-2" role="tabpanel" aria-labelledby="approval-tab-2">
            <TextField
              label="Search"
              placeholder="Search for participants"
              size="small"
              fullWidth
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon size="md" /></InputAdornment> }}
            />
            <Stack direction="row" alignItems="center" gap="8px" flexWrap="wrap">
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Filter by</Typography>
              {RESPONSES.map((r) => (
                <Chip
                  key={r}
                  label={r}
                  size="small"
                  variant={filters.includes(r) ? "filled" : "outlined"}
                  onClick={() => toggleFilter(r)}
                />
              ))}
            </Stack>
            <TableContainer>
              <Table aria-label="Participants">
                <TableHead>
                  <TableRow>
                    <TableCell>Participant</TableCell>
                    <TableCell>Committees</TableCell>
                    <TableCell>Response</TableCell>
                    <TableCell>Response timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {participants.map((p) => (
                    <TableRow key={p.name}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" gap="12px">
                          <Avatar>{p.initials}</Avatar>
                          {p.name}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" gap="8px">
                          {p.committees.map((c) => <Chip key={c} label={c} size="small" variant="outlined" />)}
                        </Stack>
                      </TableCell>
                      <TableCell><StatusIndicator color={RESPONSE_COLOR[p.response]} label={p.response} /></TableCell>
                      <TableCell>{p.timestamp}</TableCell>
                    </TableRow>
                  ))}
                  {participants.length === 0 && (
                    <TableRow><TableCell colSpan={4}>No participants match your filters.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
