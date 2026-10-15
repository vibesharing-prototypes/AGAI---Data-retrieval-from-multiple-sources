import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

import AddCircleIcon from "@diligentcorp/atlas-react-bundle/icons/AddCircle";
import ExpandDownIcon from "@diligentcorp/atlas-react-bundle/icons/ExpandDown";
import FilterIcon from "@diligentcorp/atlas-react-bundle/icons/Filter";
import MoreIcon from "@diligentcorp/atlas-react-bundle/icons/More";
import SearchIcon from "@diligentcorp/atlas-react-bundle/icons/Search";
import SortIcon from "@diligentcorp/atlas-react-bundle/icons/Sort";
import WorkspacesIcon from "@diligentcorp/atlas-react-bundle/icons/Workspaces";
import LockedIcon from "@diligentcorp/atlas-react-bundle/icons/Locked";

import MaxWidthBody from "../components/MaxWidthBody.js";
import SmartAssistSidenav from "../components/SmartAssistSidenav.js";
import SmartAssistOverlay from "../components/SmartAssistOverlay.js";
import { useSmartAssist } from "../context/SmartAssistContext.js";

// ─── Mock data ────────────────────────────────────────────────────────────────

type PublishState = "published" | "unpublished";

interface Workspace {
  id: string;
  name: string;
  committees: string[];
  extraCommittees: number;
  hasCustomAccess: boolean;
  lastModified: string;
  publishState: PublishState;
}

const workspaces: Workspace[] = [
  {
    id: "1",
    name: "Contracts and agreements",
    committees: ["Audit committee"],
    extraCommittees: 0,
    hasCustomAccess: false,
    lastModified: "Mar 20, 2020",
    publishState: "unpublished",
  },
  {
    id: "2",
    name: "Finance",
    committees: ["Finance committee"],
    extraCommittees: 0,
    hasCustomAccess: true,
    lastModified: "Mar 20, 2020",
    publishState: "published",
  },
  {
    id: "3",
    name: "Board MeetingCalls",
    committees: ["Audit committee"],
    extraCommittees: 1,
    hasCustomAccess: false,
    lastModified: "Today, 7:52 PM",
    publishState: "published",
  },
  {
    id: "4",
    name: "Legal",
    committees: ["Legal committee"],
    extraCommittees: 0,
    hasCustomAccess: false,
    lastModified: "Today, 7:52 PM",
    publishState: "unpublished",
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const COL = {
  committee: 280,
  lastModified: 160,
  actions: 152,
} as const;

// ─── Header cell ──────────────────────────────────────────────────────────────

function HeaderCell({
  label,
  width,
  flex,
  showSort = true,
}: {
  label?: string;
  width?: number;
  flex?: number;
  showSort?: boolean;
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
        height: "44px",
        px: "12px",
      }}
    >
      <Typography
        sx={{
          flex: 1,
          fontSize: "12px",
          fontWeight: 600,
          lineHeight: "16px",
          letterSpacing: "0.3px",
          color: color.type.muted.value,
        }}
      >
        {label ?? ""}
      </Typography>
      {label && showSort && (
        <IconButton size="small" sx={{ ml: "4px", color: color.type.muted.value }}>
          <SortIcon size="md" />
        </IconButton>
      )}
    </Stack>
  );
}

// ─── Body cell ────────────────────────────────────────────────────────────────

function BodyCell({
  width,
  flex,
  children,
  align = "flex-start",
}: {
  width?: number;
  flex?: number;
  children: React.ReactNode;
  align?: "flex-start" | "center" | "flex-end";
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent={align}
      sx={{
        width: width ? `${width}px` : undefined,
        flex,
        flexShrink: flex ? undefined : 0,
        minWidth: 0,
        minHeight: "64px",
        px: "12px",
        py: "12px",
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
  showCommittee,
  showLastModified,
}: {
  workspace: Workspace;
  isLast: boolean;
  showCommittee: boolean;
  showLastModified: boolean;
}) {
  const { tokens: { semantic: { color, radius } } } = useTheme();
  const isPublished = workspace.publishState === "published";

  return (
    <Stack
      direction="row"
      alignItems="stretch"
      sx={{
        borderBottom: isLast ? "none" : `1px solid ${color.ui.divider.default.value}`,
      }}
    >
      {/* Name */}
      <BodyCell flex={1}>
        <Stack direction="row" alignItems="center" gap="12px" sx={{ minWidth: 0, width: "100%" }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: color.surface.variant.value,
              border: `1px solid ${color.ui.divider.default.value}`,
              borderRadius: radius.md.value,
              color: color.type.muted.value,
            }}
          >
            <WorkspacesIcon size="md" />
          </Box>
          <Typography
            component="button"
            type="button"
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "20px",
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

      {/* Committee */}
      {showCommittee && (
        <BodyCell width={COL.committee}>
          <Stack direction="row" alignItems="center" gap="8px" flexWrap="wrap" sx={{ width: "100%" }}>
            {workspace.committees.map((c) => (
              <Chip
                key={c}
                label={c}
                size="small"
                variant="outlined"
                sx={{
                  height: "24px",
                  fontSize: "12px",
                  borderRadius: "9999px",
                  border: `1px solid ${color.action.secondary.outline.value}`,
                  backgroundColor: "transparent",
                  color: color.action.secondary.onSecondary.value,
                  "& .MuiChip-label": { px: "8px" },
                }}
              />
            ))}
            {workspace.extraCommittees > 0 && (
              <Chip
                label={`+${workspace.extraCommittees}`}
                size="small"
                variant="outlined"
                sx={{
                  height: "24px",
                  minWidth: "40px",
                  fontSize: "12px",
                  borderRadius: "9999px",
                  border: `1px solid ${color.action.secondary.outline.value}`,
                  color: color.action.secondary.onSecondary.value,
                  "& .MuiChip-label": { px: "8px" },
                }}
              />
            )}
            {workspace.hasCustomAccess && (
              <Tooltip title="Custom access" placement="top">
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "9999px",
                    backgroundColor: color.surface.variant.value,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: color.type.muted.value,
                    border: `1px solid ${color.surface.default.value}`,
                  }}
                >
                  <LockedIcon size="md" />
                </Box>
              </Tooltip>
            )}
          </Stack>
        </BodyCell>
      )}

      {/* Last modified */}
      {showLastModified && (
        <BodyCell width={COL.lastModified}>
          <Typography sx={{ fontSize: "14px", color: color.type.default.value }}>
            {workspace.lastModified}
          </Typography>
        </BodyCell>
      )}

      {/* Actions */}
      <BodyCell width={COL.actions} align="flex-end">
        <Stack direction="row" alignItems="center" gap="8px">
          {!isPublished && (
            <Button
              variant="outlined"
              size="small"
              onClick={(e) => e.stopPropagation()}
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                borderRadius: "8px",
                px: "12px",
                py: "4px",
                minWidth: "unset",
                border: `1px solid ${color.action.secondary.outline.value}`,
                color: color.action.secondary.onSecondary.value,
                "&:hover": { borderColor: color.action.secondary.outline.value },
              }}
            >
              Publish
            </Button>
          )}
          <IconButton
            size="small"
            onClick={(e) => e.stopPropagation()}
            sx={{ color: color.type.muted.value }}
          >
            <MoreIcon size="lg" />
          </IconButton>
        </Stack>
      </BodyCell>
    </Stack>
  );
}

// ─── ResourceCenterPage ───────────────────────────────────────────────────────

export default function ResourceCenterPage() {
  const { tokens: { semantic: { color, radius } } } = useTheme();
  const [searchValue, setSearchValue] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const { panelOpen, overlayOpen, openPanel, closePanel, closeOverlay, expandToOverlay, collapseToPanel } = useSmartAssist();

  const showCommittee = !panelOpen;
  const showLastModified = !panelOpen;

  const filtered = workspaces.filter((w) =>
    w.name.toLowerCase().includes(searchValue.toLowerCase()),
  );
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

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
          <Box>
            {/* Breadcrumb */}
            <Stack direction="row" alignItems="center" sx={{ mb: "4px", height: 32 }}>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.3px",
                  lineHeight: "16px",
                  color: color.type.muted.value,
                  pr: "16px",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Boards
              </Typography>
              <Typography sx={{ fontSize: "12px", color: color.type.muted.value, mr: "8px" }}>›</Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  letterSpacing: "0.14px",
                  lineHeight: "20px",
                  color: color.type.default.value,
                }}
              >
                Resource center
              </Typography>
            </Stack>

            {/* Title row */}
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

              <Stack direction="row" alignItems="center" gap="16px">
                <Button
                  variant="contained"
                  startIcon={<AddCircleIcon size="lg" />}
                  sx={{ fontWeight: 600, fontSize: "16px", borderRadius: "12px", px: "12px" }}
                >
                  New workspace
                </Button>
              </Stack>
            </Stack>
          </Box>

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
              backgroundColor: color.surface.variant.value,
              border: `1px solid ${color.ui.divider.default.value}`,
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <Stack direction="row" alignItems="stretch">
              <HeaderCell label="Name" flex={1} />
              {showCommittee && <HeaderCell label="Committee" width={COL.committee} />}
              {showLastModified && <HeaderCell label="Last modified" width={COL.lastModified} />}
              <HeaderCell width={COL.actions} showSort={false} />
            </Stack>

            {/* Body */}
            <Box
              sx={{
                backgroundColor: color.surface.default.value,
                borderTop: `1px solid ${color.ui.divider.default.value}`,
                borderBottom: `1px solid ${color.ui.divider.default.value}`,
                borderRadius: radius.lg.value,
                overflow: "hidden",
              }}
            >
              {visible.map((workspace, i) => (
                <WorkspaceRow
                  key={workspace.id}
                  workspace={workspace}
                  isLast={i === visible.length - 1}
                  showCommittee={showCommittee}
                  showLastModified={showLastModified}
                />
              ))}
            </Box>

            {/* Show more footer */}
            {hasMore && (
              <Stack direction="row" justifyContent="center" alignItems="center" sx={{ py: "8px" }}>
                <Button
                  variant="text"
                  size="small"
                  endIcon={<ExpandDownIcon size="md" />}
                  onClick={() => setVisibleCount((c) => c + 5)}
                  sx={{
                    height: "28px",
                    minHeight: "28px",
                    py: 0,
                    fontSize: "12px",
                    color: color.type.default.value,
                    fontWeight: 600,
                  }}
                >
                  Show more
                </Button>
              </Stack>
            )}
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
      />

      {/* ── Smart Assist overlay ── */}
      <SmartAssistOverlay
        open={overlayOpen}
        onClose={closeOverlay}
        onCollapse={collapseToPanel}
      />
    </Box>
  );
}
