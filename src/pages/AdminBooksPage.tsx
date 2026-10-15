import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import AddIcon from "@diligentcorp/atlas-react-bundle/icons/Add";
import FilterIcon from "@diligentcorp/atlas-react-bundle/icons/Filter";
import ColumnsIcon from "@diligentcorp/atlas-react-bundle/icons/Columns";
import MoreIcon from "@diligentcorp/atlas-react-bundle/icons/More";
import SearchIcon from "@diligentcorp/atlas-react-bundle/icons/Search";
import SortIcon from "@diligentcorp/atlas-react-bundle/icons/Sort";
import ExpandDownIcon from "@diligentcorp/atlas-react-bundle/icons/ExpandDown";

import { BookStateIcon } from "../components/BookStateIcons.js";
import MaxWidthBody from "../components/MaxWidthBody.js";
import SmartAssistSidenav from "../components/SmartAssistSidenav.js";
import SmartAssistOverlay from "../components/SmartAssistOverlay.js";
import { type AdminBook, type AdminBookStatus, adminBooks } from "../data/mockData.js";
import { useSmartAssist } from "../context/SmartAssistContext.js";

// ─── Column widths (px) ───────────────────────────────────────────────────────

const COL = {
  titleMin: 240,
  status: 100,
  meetingDate: 105,
  committee: 240,
  lastUpdated: 99,
  actions: 64,
} as const;

const STATUS_COLORS: Record<AdminBookStatus, { bg: string; fg: string }> = {
  Published: { bg: "#E4F3FF", fg: "#004C6C" },
  Unpublished: { bg: "#FFF2AA", fg: "#504700" },
  Archived: { bg: "#F0F0F3", fg: "#454749" },
};

// ─── Header cell ──────────────────────────────────────────────────────────────

function HeaderCell({
  label,
  width,
  flex,
}: {
  label: string;
  width?: number;
  flex?: number;
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
          textTransform: "none",
        }}
      >
        {label}
      </Typography>
      <IconButton size="small" sx={{ ml: "4px", color: color.type.muted.value }}>
        <SortIcon size="md" />
      </IconButton>
    </Stack>
  );
}

// ─── Body cell wrapper ────────────────────────────────────────────────────────

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

// ─── Status indicator picker ──────────────────────────────────────────────────

function BookStatusBadge({ status }: { status: AdminBookStatus }) {
  const palette = STATUS_COLORS[status];
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        height: "24px",
        px: "8px",
        borderRadius: "9999px",
        backgroundColor: palette.bg,
        color: palette.fg,
        fontSize: "12px",
        fontWeight: 600,
        lineHeight: "16px",
        letterSpacing: "0.3px",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </Box>
  );
}

// ─── Table row ────────────────────────────────────────────────────────────────

function BookRow({
  book,
  isLast,
  showCommittee,
  showLastUpdated,
}: {
  book: AdminBook;
  isLast: boolean;
  showCommittee: boolean;
  showLastUpdated: boolean;
}) {
  const { tokens: { semantic: { color, radius } } } = useTheme();
  const navigate = useNavigate();

  return (
    <Stack
      direction="row"
      alignItems="stretch"
      sx={{
        borderBottom: isLast ? "none" : `1px solid ${color.ui.divider.default.value}`,
      }}
    >
      {/* Title */}
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
            <BookStateIcon status={book.status} />
          </Box>
          <Typography
            component="button"
            type="button"
            onClick={() => navigate(`/admin/books/${book.id}`)}
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
            {book.title}
          </Typography>
        </Stack>
      </BodyCell>

      {/* Status */}
      <BodyCell width={COL.status} align="center">
        <BookStatusBadge status={book.status} />
      </BodyCell>

      {/* Meeting date */}
      <BodyCell width={COL.meetingDate}>
        <Typography sx={{ fontSize: "14px", color: color.type.default.value }}>
          {book.meetingDate}
        </Typography>
      </BodyCell>

      {/* Committee */}
      {showCommittee && (
        <BodyCell width={COL.committee}>
          <Stack direction="row" alignItems="center" gap="4px" sx={{ width: "100%", minWidth: 0 }}>
            <Typography
              sx={{
                flex: 1,
                fontSize: "14px",
                color: color.type.muted.value,
              }}
            >
              {book.committees[0]}
            </Typography>
            {book.extraCommittees > 0 && (
              <Button
                variant="text"
                size="small"
                onClick={(e) => e.stopPropagation()}
                sx={{
                  minWidth: "auto",
                  px: "6px",
                  py: "2px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: color.type.muted.value,
                }}
              >
                +{book.extraCommittees}
              </Button>
            )}
          </Stack>
        </BodyCell>
      )}

      {/* Last updated */}
      {showLastUpdated && (
        <BodyCell width={COL.lastUpdated}>
          <Typography sx={{ fontSize: "14px", color: color.type.default.value }}>
            {book.lastUpdated}
          </Typography>
        </BodyCell>
      )}

      {/* Actions */}
      <BodyCell width={COL.actions} align="flex-end">
        <IconButton
          size="small"
          onClick={(e) => e.stopPropagation()}
          sx={{ color: color.type.muted.value }}
        >
          <MoreIcon size="lg" />
        </IconButton>
      </BodyCell>
    </Stack>
  );
}

// ─── AdminBooksPage ───────────────────────────────────────────────────────────

export default function AdminBooksPage() {
  const { tokens: { semantic: { color, radius } } } = useTheme();
  const [searchValue, setSearchValue] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const { panelOpen, overlayOpen, closePanel, closeOverlay, expandToOverlay, collapseToPanel } = useSmartAssist();

  const showCommittee = !panelOpen;
  const showLastUpdated = !panelOpen;

  const filtered = adminBooks.filter((b) =>
    b.title.toLowerCase().includes(searchValue.toLowerCase()),
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
          "radial-gradient(125.08% 101.36% at 0% 0%, var(--lens-semantic-color-background-base-gradient-start, #f9f9fc) 30.53%, var(--lens-semantic-color-background-base-gradient-end, #fcfcff) 100%)",
      }}
    >
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
      <MaxWidthBody
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          pl: "32px",
          pr: panelOpen ? "12px" : "32px",
          pt: "24px",
          pb: "32px",
          gap: "16px",
          transition: "padding-right 0.3s ease",
        }}
      >
        {/* Page header */}
        <Stack direction="row" alignItems="center" gap="16px">
          <Typography
            sx={{
              flex: 1,
              fontSize: "24px",
              fontWeight: 600,
              lineHeight: "32px",
              color: color.type.default.value,
            }}
          >
            Books
          </Typography>
          <Button variant="contained" startIcon={<AddIcon size="lg" />} sx={{ fontWeight: 600, fontSize: "16px" }}>
            Create book
          </Button>
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
            sx={{ color: color.type.default.value }}
          >
            Filter
          </Button>
          <Button
            variant="text"
            startIcon={<ColumnsIcon size="lg" />}
            sx={{ color: color.type.default.value }}
          >
            Column
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
            <HeaderCell label="Title" flex={1} />
            <HeaderCell label="Status" width={COL.status} />
            <HeaderCell label="Meeting date" width={COL.meetingDate} />
            {showCommittee && <HeaderCell label="Committee" width={COL.committee} />}
            {showLastUpdated && <HeaderCell label="Last updated" width={COL.lastUpdated} />}
            <Box sx={{ width: `${COL.actions}px`, flexShrink: 0 }} />
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
            {visible.map((book, i) => (
              <BookRow
                key={book.id}
                book={book}
                isLast={i === visible.length - 1}
                showCommittee={showCommittee}
                showLastUpdated={showLastUpdated}
              />
            ))}
          </Box>

          {/* Show more footer (sits on outer gray bg) */}
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
      </MaxWidthBody>
      </Box>

      {/* Smart Assist sidenav */}
      <SmartAssistSidenav
        open={panelOpen}
        onClose={closePanel}
        onExpand={expandToOverlay}
        variant="persistent"
      />
      <SmartAssistOverlay
        open={overlayOpen}
        onClose={closeOverlay}
        onCollapse={collapseToPanel}
      />
    </Box>
  );
}
