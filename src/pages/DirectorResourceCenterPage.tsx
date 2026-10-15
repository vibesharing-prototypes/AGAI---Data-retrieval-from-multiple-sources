import { useState } from "react";
import {
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import FilterIcon from "@diligentcorp/atlas-react-bundle/icons/Filter";
import SearchIcon from "@diligentcorp/atlas-react-bundle/icons/Search";
import WorkspacesIcon from "@diligentcorp/atlas-react-bundle/icons/Workspaces";

import MaxWidthBody from "../components/MaxWidthBody.js";
import SmartAssistSidenav from "../components/SmartAssistSidenav.js";
import SmartAssistOverlay from "../components/SmartAssistOverlay.js";
import { useSmartAssist } from "../context/SmartAssistContext.js";

// ─── Mock data ────────────────────────────────────────────────────────────────

interface Workspace {
  id: string;
  name: string;
  lastModified: string;
}

const workspaces: Workspace[] = [
  { id: "1", name: "Contracts and agreements", lastModified: "Mar 20, 2020" },
  { id: "2", name: "Board MeetingCalls", lastModified: "Mar 20, 2020" },
  { id: "3", name: "Legal", lastModified: "today, 7:52 PM" },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const COL = {
  lastModified: 160,
} as const;

// ─── Header cell ──────────────────────────────────────────────────────────────

function HeaderCell({
  label,
  width,
  flex,
  pl,
}: {
  label?: string;
  width?: number;
  flex?: number;
  pl?: string;
}) {
  const { tokens: { semantic: { color } } } = useTheme();
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        width: width ? `${width}px` : undefined,
        flex,
        flexShrink: flex ? undefined : 0,
        minWidth: 0,
        minHeight: "40px",
        pl: pl ?? "12px",
        pr: "12px",
        py: "4px",
      }}
    >
      <Typography
        sx={{
          flex: 1,
          fontSize: "10px",
          fontWeight: 600,
          lineHeight: "12px",
          letterSpacing: "0.3px",
          color: color.type.default.value,
        }}
      >
        {label ?? ""}
      </Typography>
    </Stack>
  );
}

// ─── Body cell ────────────────────────────────────────────────────────────────

function BodyCell({
  width,
  flex,
  children,
  pl,
}: {
  width?: number;
  flex?: number;
  children: React.ReactNode;
  pl?: string;
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        width: width ? `${width}px` : undefined,
        flex,
        flexShrink: flex ? undefined : 0,
        minWidth: 0,
        minHeight: "44px",
        pl: pl ?? "12px",
        pr: "12px",
        py: "2px",
      }}
    >
      {children}
    </Stack>
  );
}

// ─── Workspace row ────────────────────────────────────────────────────────────

function WorkspaceRow({
  workspace,
  isLast,
}: {
  workspace: Workspace;
  isLast: boolean;
}) {
  const { tokens: { semantic: { color } } } = useTheme();

  return (
    <Stack
      direction="row"
      alignItems="stretch"
      sx={{
        backgroundColor: color.surface.default.value,
        borderBottom: isLast ? "none" : `1px solid ${color.ui.divider.default.value}`,
      }}
    >
      {/* Name */}
      <BodyCell flex={1}>
        <Stack direction="row" alignItems="center" gap="8px" sx={{ minWidth: 0, width: "100%" }}>
          <Box
            sx={{
              width: 24,
              height: 24,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: color.type.default.value,
            }}
          >
            <WorkspacesIcon size="md" />
          </Box>
          <Typography
            component="button"
            type="button"
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "20px",
              letterSpacing: "0.2px",
              color: color.type.default.value,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "left",
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
              "&:focus-visible": { outline: "2px solid #1C4EE4", outlineOffset: "2px", borderRadius: "2px" },
            }}
          >
            {workspace.name}
          </Typography>
        </Stack>
      </BodyCell>

      {/* Last modified */}
      <BodyCell width={COL.lastModified}>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "20px",
            letterSpacing: "0.2px",
            color: color.type.default.value,
          }}
        >
          {workspace.lastModified}
        </Typography>
      </BodyCell>
    </Stack>
  );
}

// ─── DirectorResourceCenterPage ───────────────────────────────────────────────

export default function DirectorResourceCenterPage() {
  const { tokens: { semantic: { color } } } = useTheme();
  const [searchValue, setSearchValue] = useState("");
  const {
    panelOpen,
    overlayOpen,
    closePanel,
    closeOverlay,
    expandToOverlay,
    collapseToPanel,
  } = useSmartAssist();

  const filtered = workspaces.filter((w) =>
    w.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        overflow: "hidden",
        background:
          "radial-gradient(ellipse 101.36% 125.08% at 0% 0%, var(--lens-semantic-color-background-base-gradient-start, #f9f9fc) 31%, var(--lens-semantic-color-background-base-gradient-end, #fcfcff) 100%)",
      }}
    >
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          borderTopLeftRadius: "24px",
        }}
      >
      <MaxWidthBody
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          pt: "24px",
          pl: "32px",
          pr: panelOpen ? "12px" : "32px",
          pb: "32px",
          gap: "16px",
          transition: "padding-right 0.3s ease",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Header */}
          <Stack direction="row" alignItems="center" gap="16px">
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 600,
                lineHeight: "32px",
                color: color.type.default.value,
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Resource center
            </Typography>
          </Stack>

          {/* Toolbar */}
          <Stack direction="row" alignItems="center" gap="16px">
            <TextField
              placeholder="Search"
              size="small"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon size="lg" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: "300px" }}
            />
            <Button
              variant="text"
              startIcon={<FilterIcon size="lg" />}
              sx={{ fontWeight: 600, color: color.type.default.value }}
            >
              Filter
            </Button>
            <Box sx={{ flex: 1 }} />
          </Stack>

          {/* Table */}
          <Box
            sx={{
              backgroundColor: color.surface.default.value,
              border: `1px solid ${color.ui.divider.default.value}`,
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <Stack
              direction="row"
              alignItems="stretch"
              sx={{
                backgroundColor: color.surface.variant.value,
                borderBottom: `1px solid ${color.ui.divider.default.value}`,
              }}
            >
              <HeaderCell label="Name" flex={1} pl="48px" />
              <HeaderCell label="Last modified" width={COL.lastModified} pl="16px" />
            </Stack>

            {/* Body */}
            <Box>
              {filtered.map((workspace, i) => (
                <WorkspaceRow
                  key={workspace.id}
                  workspace={workspace}
                  isLast={i === filtered.length - 1}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </MaxWidthBody>
      </Box>

      {/* ── Smart Assist sidenav ── */}
      <SmartAssistSidenav
        open={panelOpen}
        onClose={closePanel}
        onExpand={expandToOverlay}
        variant="persistent"
        audience="director"
      />

      {/* ── Smart Assist overlay ── */}
      <SmartAssistOverlay
        open={overlayOpen}
        onClose={closeOverlay}
        onCollapse={collapseToPanel}
        audience="director"
      />
    </Box>
  );
}
