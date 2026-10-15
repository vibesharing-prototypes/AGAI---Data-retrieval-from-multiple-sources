import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  IconButton,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import AiSparkleIcon from "@diligentcorp/atlas-react-bundle/icons/AiSparkle";
import ExpandRightIcon from "@diligentcorp/atlas-react-bundle/icons/ExpandRight";
import CollapseListIcon from "@diligentcorp/atlas-react-bundle/icons/CollapseList";
import AddCircleIcon from "@diligentcorp/atlas-react-bundle/icons/AddCircle";
import MoreIcon from "@diligentcorp/atlas-react-bundle/icons/More";
import ExpandDownIcon from "@diligentcorp/atlas-react-bundle/icons/ExpandDown";
import CollapseSideNavIcon from "@diligentcorp/atlas-react-bundle/icons/CollapseSideNav";
import ExpandSideNavIcon from "@diligentcorp/atlas-react-bundle/icons/ExpandSideNav";
import SelectToolIcon from "@diligentcorp/atlas-react-bundle/icons/SelectTool";
import LinkIcon from "@diligentcorp/atlas-react-bundle/icons/Link";
import FullscreenIcon from "@diligentcorp/atlas-react-bundle/icons/Fullscreen";
import FacePagesIcon from "@diligentcorp/atlas-react-bundle/icons/FacePages";
import ExpandListIcon from "@diligentcorp/atlas-react-bundle/icons/ExpandList";
import SearchIcon from "@diligentcorp/atlas-react-bundle/icons/Search";
import EditIcon from "@diligentcorp/atlas-react-bundle/icons/Edit";

import DocumentIcon from "@diligentcorp/atlas-react-bundle/icons/Document";

import PageIcon from "@diligentcorp/atlas-react-bundle/icons/Page";
import KeyIcon from "@diligentcorp/atlas-react-bundle/icons/Key";

import MaxWidthBody from "../components/MaxWidthBody.js";
import SmartAssistSidenav from "../components/SmartAssistSidenav.js";
import SmartAssistOverlay from "../components/SmartAssistOverlay.js";
import DocumentViewerToolbar from "../components/DocumentViewerToolbar.js";
import { useCitationPreview } from "../context/CitationPreviewContext.js";
import { useSmartAssist } from "../context/SmartAssistContext.js";
import {
  DOCUMENTS,
  getBookPageForCitation,
  q2BoardPackageNav,
  q2BoardPackageNavPageById,
  q2BoardPackagePages,
  q2BoardPackageBuildStructure,
  type BookNavItem,
  type DocumentId,
} from "../data/documents.js";
import {
  type BookTab,
  type BookDocument,
  adminBooks,
  bookStructure,
  reviewNavStructure,
} from "../data/mockData.js";

/** Q2 2026 Board Package (book id "1") renders the assembled 14-document pack. */
const Q2_BOARD_PACKAGE_ID = "1";


// ─── Build book tab ───────────────────────────────────────────────────────────

type TreeNode = BookTab | BookDocument;

const INDENT_PER_LEVEL = 48;

// Book-reader nav selection — matches the director book reader's active row:
// an #ECF0FF fill with a 2×20 #0040D5 rounded indicator bar pinned to its left.
const NAV_SELECTED_BG = "#ECF0FF";
const NAV_SELECTED_FG = "#0040D5";

function DocumentRow({
  doc,
  depth,
  selected,
  onToggle,
  showDivider,
}: {
  doc: BookDocument;
  depth: number;
  selected: boolean;
  onToggle: (id: string) => void;
  showDivider: boolean;
}) {
  const { tokens: { semantic: { color } } } = useTheme();
  const notApproved = doc.status === "not_approved";

  return (
    <Stack direction="row" alignItems="stretch" sx={{ width: "100%" }}>
      <Box sx={{ width: `${depth * INDENT_PER_LEVEL}px`, flexShrink: 0 }} />
      <Stack
        direction="row"
        alignItems="center"
        gap="12px"
        sx={{
          flex: 1,
          height: "64px",
          px: "12px",
          py: "12px",
          borderRadius: "12px",
          position: "relative",
          backgroundColor: selected ? color.accent.blue.background.value : "transparent",
          "&:hover": { backgroundColor: selected ? color.accent.blue.background.value : color.surface.variant.value },
          ...(showDivider && {
            "&::after": {
              content: '""',
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "1px",
              backgroundColor: color.ui.divider.default.value,
            },
          }),
        }}
      >
        <Checkbox
          checked={selected}
          onChange={() => onToggle(doc.id)}
          sx={{ p: 0, width: 24, height: 24 }}
        />
        <Box sx={{ width: 24, height: 24, color: color.type.default.value, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <DocumentIcon size="md" />
        </Box>
        <Stack sx={{ flex: 1, minWidth: 0, pl: "4px" }}>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "0.2px",
              color: color.type.default.value,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {doc.name}
          </Typography>
          {notApproved ? (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "20px",
                letterSpacing: "0.2px",
                color: color.status.error.text.value,
              }}
            >
              Not approved
            </Typography>
          ) : doc.size ? (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "20px",
                letterSpacing: "0.2px",
                color: color.type.default.value,
              }}
            >
              {doc.size}
            </Typography>
          ) : null}
        </Stack>
        {notApproved && (
          <Button variant="text" size="medium" sx={{ fontWeight: 600, fontSize: "16px", px: "12px" }}>
            Approve
          </Button>
        )}
        <IconButton size="medium" sx={{ width: 40, height: 40 }}>
          <MoreIcon size="md" />
        </IconButton>
      </Stack>
    </Stack>
  );
}

function TabRow({
  tab,
  depth,
  selected,
  onToggle,
  expanded,
  onToggleExpand,
}: {
  tab: BookTab;
  depth: number;
  selected: boolean;
  onToggle: (id: string) => void;
  expanded: boolean;
  onToggleExpand: (id: string) => void;
}) {
  const { tokens: { semantic: { color } } } = useTheme();

  return (
    <Stack direction="row" alignItems="stretch" sx={{ width: "100%" }}>
      <Box sx={{ width: `${depth * INDENT_PER_LEVEL}px`, flexShrink: 0 }} />
      <Stack
        direction="row"
        alignItems="center"
        gap="12px"
        sx={{
          flex: 1,
          height: "64px",
          px: "12px",
          py: "12px",
          borderRadius: "12px",
          border: `1px solid ${color.ui.divider.default.value}`,
          backgroundColor: selected ? color.accent.blue.background.value : color.surface.default.value,
          "&:hover": { backgroundColor: selected ? color.accent.blue.background.value : color.surface.variant.value },
        }}
      >
        <Checkbox
          checked={selected}
          onChange={() => onToggle(tab.id)}
          sx={{ p: 0, width: 24, height: 24 }}
        />
        <IconButton
          size="small"
          onClick={() => onToggleExpand(tab.id)}
          sx={{ width: 24, height: 24, p: 0 }}
        >
          {expanded ? <ExpandDownIcon size="md" /> : <ExpandRightIcon size="md" />}
        </IconButton>
        <Typography
          sx={{
            flex: 1,
            minWidth: 0,
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "24px",
            letterSpacing: "0.2px",
            color: color.type.default.value,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {(() => {
            const idx = tab.name.indexOf(":");
            if (idx === -1) return tab.name;
            const numbering = tab.name.slice(0, idx + 1);
            const rest = tab.name.slice(idx + 1);
            return (
              <>
                <Box component="span" sx={{ fontWeight: 600 }}>{numbering}</Box>
                {rest}
              </>
            );
          })()}
        </Typography>
        <IconButton size="medium" sx={{ width: 40, height: 40 }}>
          <MoreIcon size="md" />
        </IconButton>
      </Stack>
    </Stack>
  );
}

function BuildBookTree({
  nodes,
  depth = 0,
  selected,
  onToggle,
  expanded,
  onToggleExpand,
}: {
  nodes: TreeNode[];
  depth?: number;
  selected: Set<string>;
  onToggle: (id: string) => void;
  expanded: Set<string>;
  onToggleExpand: (id: string) => void;
}) {
  // Group consecutive documents into a "files" block (rendered with 0 gap),
  // separating them from tab groups (rendered with 4px gap). Top-level uses 12px.
  type Group =
    | { kind: "files"; items: BookDocument[] }
    | { kind: "tab"; node: BookTab };
  const groups: Group[] = [];
  let fileBlock: BookDocument[] = [];
  for (const node of nodes) {
    if (node.type === "document") {
      fileBlock.push(node);
    } else {
      if (fileBlock.length) { groups.push({ kind: "files", items: fileBlock }); fileBlock = []; }
      groups.push({ kind: "tab", node });
    }
  }
  if (fileBlock.length) groups.push({ kind: "files", items: fileBlock });

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {groups.map((g, i) => {
        const prev = groups[i - 1];
        // 12px between sibling tabs (at any depth); 4px between a files block
        // and an adjacent tab; 0 for the first group.
        const mt =
          i === 0
            ? "0px"
            : g.kind === "tab" && prev?.kind === "tab"
              ? "12px"
              : "4px";

        if (g.kind === "files") {
          return (
            <Box key={`f-${i}`} sx={{ width: "100%", mt }}>
              {g.items.map((doc, j) => {
                // Divider only between sibling documents; hidden on the last
                // doc since whatever follows is a tab or end-of-list.
                const showDivider = j < g.items.length - 1;
                return (
                  <DocumentRow
                    key={doc.id}
                    doc={doc}
                    depth={depth}
                    selected={selected.has(doc.id)}
                    onToggle={onToggle}
                    showDivider={showDivider}
                  />
                );
              })}
            </Box>
          );
        }
        const tab = g.node;
        const isExpanded = expanded.has(tab.id);
        return (
          <Stack key={tab.id} gap="4px" sx={{ width: "100%", mt }}>
            <TabRow
              tab={tab}
              depth={depth}
              selected={selected.has(tab.id)}
              onToggle={onToggle}
              expanded={isExpanded}
              onToggleExpand={onToggleExpand}
            />
            {isExpanded && tab.children.length > 0 && (
              <BuildBookTree
                nodes={tab.children}
                depth={depth + 1}
                selected={selected}
                onToggle={onToggle}
                expanded={expanded}
                onToggleExpand={onToggleExpand}
              />
            )}
          </Stack>
        );
      })}
    </Box>
  );
}

function BuildBookTab({ bookTitle: _bookTitle, bookId }: { bookTitle: string; bookId: string }) {
  // The Q2 2026 Board Package uses the assembled tab/subtab/document tree that
  // mirrors the book reader nav and Smart Summary TOC; other books keep the mock.
  const structure = bookId === Q2_BOARD_PACKAGE_ID ? q2BoardPackageBuildStructure : bookStructure;
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const ids = new Set<string>();
    const walk = (nodes: (BookTab | BookDocument)[]) => {
      for (const n of nodes) {
        if (n.type === "tab") {
          if (n.expanded) ids.add(n.id);
          walk(n.children);
        }
      }
    };
    walk(structure);
    return ids;
  });

  const toggleSelected = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Toolbar */}
      <Box
        sx={{
          pb: "16px",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          alignItems: "flex-end",
        }}
      >
        {/* Left group: search + actions, all left-aligned */}
        <Stack direction="row" alignItems="flex-end" gap="8px" sx={{ flex: 1 }}>
          <TextField
            label="Search"
            placeholder="Search"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon size="lg" />
                </InputAdornment>
              ),
            }}
            sx={{ width: "220px" }}
          />
          <Button
            variant="text"
            startIcon={<EditIcon size="md" />}
            endIcon={<ExpandDownIcon size="md" />}
            sx={{ fontSize: "13px", fontWeight: 600 }}
          >
            Actions
          </Button>
          <Button variant="text" startIcon={<AddCircleIcon size="md" />} sx={{ fontSize: "13px", fontWeight: 600 }}>
            Add tab
          </Button>
          <Button variant="text" startIcon={<CollapseListIcon size="md" />} sx={{ fontSize: "13px", fontWeight: 600 }}>
            Collapse
          </Button>
        </Stack>

        {/* Right: approve all */}
        <Stack direction="row" alignItems="flex-end" gap="8px">
          <Button variant="outlined" sx={{ fontSize: "13px", fontWeight: 600 }}>Approve all</Button>
        </Stack>
      </Box>

      {/* Tree */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <BuildBookTree
          nodes={structure}
          selected={selected}
          onToggle={toggleSelected}
          expanded={expanded}
          onToggleExpand={toggleExpanded}
        />
      </Box>
    </Box>
  );
}

// ─── Review book tab ──────────────────────────────────────────────────────────

function NavTreeItem({ item, activeId, onSelect, depth = 0 }: {
  item: BookNavItem;
  activeId: string;
  onSelect: (id: string) => void;
  depth?: number;
}) {
  const { tokens: { semantic: { color } } } = useTheme();
  const [expanded, setExpanded] = useState(item.expanded ?? false);
  const isActive = item.id === activeId;

  // Tabs/subtabs are section headings; documents are leaves. Falls back to the
  // legacy label-prefix heuristic for books that don't carry an explicit kind.
  const isSection = item.kind ? item.kind !== "document" : /^\d|^Agenda/.test(item.label);

  if (isSection) {
    return (
      <Box>
        {/* Mirrors the document-row pattern: outer Box owns depth indent +
            click target; inner Stack carries the 8px rounded hover background. */}
        <Box
          onClick={() => { onSelect(item.id); if (item.children) setExpanded((v) => !v); }}
          sx={{ pl: `${depth * 16}px`, pr: "8px", cursor: "pointer" }}
        >
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              pl: "12px",
              pr: "4px",
              py: "7px",
              borderRadius: "8px",
              "&:hover": { backgroundColor: color.surface.variant.value },
            }}
          >
            <Typography
              sx={{
                fontSize: "13px",
                color: color.type.default.value,
                flex: 1,
                lineHeight: "18px",
              }}
            >
              {item.label}
            </Typography>
            <IconButton size="small" sx={{ p: "2px", flexShrink: 0 }}>
              {item.children && expanded
                ? <ExpandDownIcon size="md" />
                : <ExpandRightIcon size="md" />}
            </IconButton>
          </Stack>
        </Box>
        {expanded && item.children && (
          <Box>
            {item.children.map((child) => (
              <NavTreeItem
                key={child.id}
                item={child}
                activeId={activeId}
                onSelect={onSelect}
                depth={depth + 1}
              />
            ))}
          </Box>
        )}
      </Box>
    );
  }

  // Document item — selected state mirrors the director book reader: a rounded
  // #ECF0FF fill with a 2×20 #0040D5 indicator bar pinned to its left edge.
  return (
    <Box
      onClick={() => onSelect(item.id)}
      sx={{ pl: `${16 + depth * 16}px`, pr: "8px", cursor: "pointer" }}
    >
      <Stack
        direction="row"
        alignItems="center"
        gap="8px"
        sx={{
          position: "relative",
          pl: "12px",
          pr: "4px",
          py: "8px",
          borderRadius: "8px",
          backgroundColor: isActive ? NAV_SELECTED_BG : "transparent",
          "&:hover": {
            backgroundColor: isActive ? NAV_SELECTED_BG : color.surface.variant.value,
          },
        }}
      >
        {isActive && (
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: "10px",
              width: "2px",
              height: "20px",
              backgroundColor: NAV_SELECTED_FG,
              borderRadius: "24px",
            }}
          />
        )}
        <Box sx={{ flexShrink: 0, color: color.type.muted.value }}>
          <PageIcon size="md" />
        </Box>
        <Typography
          sx={{
            flex: 1,
            fontSize: "12px",
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            lineHeight: "16px",
            letterSpacing: "0.3px",
            color: color.type.default.value,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {item.label}
        </Typography>
        {item.restricted && (
          <Box sx={{ flexShrink: 0, color: color.type.muted.value }}>
            <KeyIcon size="md" />
          </Box>
        )}
      </Stack>
    </Box>
  );
}

// Page images exported from Figma — file numbers 12..21 map to printed pages 1..10
// (page-12 is the cover; page-21 is the back cover).
const PAGE_IMAGES = Array.from({ length: 10 }, (_, i) => `/boardroom-pages/page-${12 + i}.png`);
const ZOOM_LEVELS = [50, 75, 100, 125, 150, 200];

function ReviewBookTab({
  bookTitle: _bookTitle,
  bookId,
  assistOpen,
  forcedPage,
  forcedPageNonce,
  forcedDocumentId,
}: {
  bookTitle: string;
  bookId: string;
  assistOpen: boolean;
  forcedPage?: number;
  forcedPageNonce?: number;
  forcedDocumentId?: DocumentId;
}) {
  const { tokens: { semantic: { color } } } = useTheme();

  // The Q2 2026 Board Package (book id "1") is the assembled 14-document pack
  // cited by Smart Summary / Prep / Risk. Other books keep the boardroom mock.
  const isQ2BoardPackage = bookId === Q2_BOARD_PACKAGE_ID;
  const navStructure: BookNavItem[] = isQ2BoardPackage ? q2BoardPackageNav : reviewNavStructure;

  const [navOpen, setNavOpen] = useState(true);
  const [activeNavId, setActiveNavId] = useState(
    isQ2BoardPackage ? `doc:${q2BoardPackagePages[0].documentId}` : "s1-2-1-1-d1",
  );
  const [currentPage, setCurrentPage] = useState(forcedPage ?? 1);
  const [zoomIndex, setZoomIndex] = useState(2); // 100%
  const zoomPct = ZOOM_LEVELS[zoomIndex];
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // For the Q2 Board Package the assembled pages ARE the cited documents, so
  // no overlay is needed. For other books, when a document is "opened" via the
  // citation preview's Open button, overlay its pages onto the boardroom mock
  // at the document's bookStartPage offset.
  const pageImages = (() => {
    if (isQ2BoardPackage) return q2BoardPackagePages.map((p) => p.image);
    if (!forcedDocumentId) return PAGE_IMAGES;
    const doc = DOCUMENTS[forcedDocumentId];
    if (!doc) return PAGE_IMAGES;
    const imgs = [...PAGE_IMAGES];
    doc.pages.forEach((p, i) => {
      const bookIdx = (doc.bookStartPage ?? 1) - 1 + i;
      if (bookIdx >= 0 && bookIdx < imgs.length) imgs[bookIdx] = p.image;
    });
    return imgs;
  })();
  const totalPages = pageImages.length;

  // Structure-nav click → scroll the assembled book to the page that nav row
  // maps to (tabs/subtabs jump to their first document; documents to their
  // own page). Q2 Board Package only.
  const handleSelectNavItem = (navId: string) => {
    setActiveNavId(navId);
    const bookPage = q2BoardPackageNavPageById[navId];
    if (typeof bookPage === "number") {
      setCurrentPage(Math.min(totalPages, Math.max(1, bookPage)));
    }
  };

  useEffect(() => {
    if (assistOpen) setNavOpen(false);
  }, [assistOpen]);

  // Externally-driven page change (Open button). forcedPageNonce makes repeat
  // triggers to the same page fire again.
  useEffect(() => {
    if (typeof forcedPage === "number") {
      setCurrentPage(Math.min(totalPages, Math.max(1, forcedPage)));
    }
  }, [forcedPage, forcedPageNonce, totalPages]);

  useEffect(() => {
    pageRefs.current[currentPage - 1]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentPage]);

  const cardSx = {
    borderRadius: "12px",
    outline: `1px ${color.ui.divider.default.value} solid`,
    outlineOffset: "-1px",
    backgroundColor: color.surface.default.value,
  } as const;

  const toolIconSx = {
    width: 24, height: 24, display: "flex", alignItems: "center",
    justifyContent: "center", cursor: "pointer", flexShrink: 0,
  } as const;

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* ── Floating top toolbar ── */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ flexShrink: 0, mb: "12px", px: "24px", py: "8px", ...cardSx }}
      >
        <Stack direction="row" alignItems="center" gap="24px">
          {/* Nav sub-group */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: navOpen ? "299px" : "auto", flexShrink: 0 }}>
            <Stack direction="row" alignItems="center" gap="8px">
              <Box onClick={() => setNavOpen((v) => !v)} sx={{ ...toolIconSx, color: color.type.default.value }}>
                {navOpen ? <CollapseSideNavIcon size="lg" /> : <ExpandSideNavIcon size="lg" />}
              </Box>
              {navOpen && (
                <Typography sx={{ fontSize: "14px", fontWeight: 400, lineHeight: "20px", letterSpacing: "0.20px", color: color.type.default.value, whiteSpace: "nowrap" }}>
                  Navigation
                </Typography>
              )}
            </Stack>
            {navOpen && (
              <Box sx={{ ...toolIconSx, color: color.type.default.value }}>
                <ExpandListIcon size="lg" />
              </Box>
            )}
          </Stack>
          {/* Tool icons */}
          <Stack direction="row" alignItems="center" gap="24px" sx={{ pl: "24px" }}>
            <Box sx={{ ...toolIconSx, color: color.action.primary.default.value }}>
              <SelectToolIcon size="lg" />
            </Box>
            <Box sx={{ ...toolIconSx, color: color.type.default.value }}>
              <LinkIcon size="lg" />
            </Box>
          </Stack>
        </Stack>

        {/* Right: icon + label column */}
        <Stack direction="row" alignItems="center" gap="24px">
          {(["Focus", "View mode", "More"] as const).map((label) => (
            <Stack key={label} direction="column" alignItems="center" gap="2px" sx={{ cursor: "pointer" }}>
              <Box sx={{ ...toolIconSx, color: color.type.default.value }}>
                {label === "Focus" && <FullscreenIcon size="lg" />}
                {label === "View mode" && <FacePagesIcon size="lg" />}
                {label === "More" && <MoreIcon size="lg" />}
              </Box>
              <Typography sx={{ fontSize: "10px", fontWeight: 600, lineHeight: "12px", letterSpacing: "0.30px", color: color.type.default.value, whiteSpace: "nowrap" }}>
                {label}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>

      {/* ── Content row: floating nav panel + document area ── */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden", mb: "12px", gap: "12px" }}>

        {/* Floating nav panel — no tabs */}
        {navOpen && (
          <Box sx={{ width: "300px", flexShrink: 0, display: "flex", flexDirection: "column", overflow: "hidden", ...cardSx }}>
            <Box sx={{ flex: 1, overflowY: "auto", p: "16px 8px 4px" }}>
              {navStructure.map((item) => (
                <NavTreeItem key={item.id} item={item} activeId={activeNavId} onSelect={handleSelectNavItem} />
              ))}
            </Box>
          </Box>
        )}

        {/* Document area */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
          <Box sx={{ flex: 1, overflow: "auto", pt: "20px", px: "16px", pb: "80px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            {pageImages.map((src, idx) => (
              <Box
                key={idx}
                ref={(el: HTMLDivElement | null) => { pageRefs.current[idx] = el; }}
                sx={{
                  flexShrink: 0,
                  height: `${zoomPct}%`,
                  display: "flex",
                  borderRadius: "12px",
                  overflow: "hidden",
                  scrollMarginTop: "20px",
                  boxShadow: `inset 0 0 0 0.68px ${color.outline.fixed.value}, 0 1px 4px #0000001f`,
                }}
              >
                <img
                  src={src}
                  alt={`Page ${idx + 1}`}
                  style={{ height: "100%", width: "auto", display: "block" }}
                />
              </Box>
            ))}
          </Box>

          {/* Bottom toolbar — 25px inside doc area + 12px content-row mb = 37px from viewport bottom */}
          <DocumentViewerToolbar
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            zoomIndex={zoomIndex}
            onZoomIndexChange={setZoomIndex}
          />
        </Box>
      </Box>
    </Box>
  );
}

// ─── BookEditorPage ───────────────────────────────────────────────────────────

function collapseGlobalNav() {
  const mockNav = document.querySelector("mock-hb-global-navigator") as HTMLElement | null;
  if (!mockNav?.shadowRoot) return;
  const globalNav = mockNav.shadowRoot.querySelector("atlas-global-nav") as (HTMLElement & { shadowRoot: ShadowRoot }) | null;
  if (!globalNav?.shadowRoot) return;
  const btn = globalNav.shadowRoot.querySelector("button.menu-button") as HTMLButtonElement | null;
  btn?.click();
}

export default function BookEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { tokens: { semantic: { color } }, presets: { TabsPresets } } = useTheme();

  const book = adminBooks.find((b) => b.id === id) ?? adminBooks[0];

  // GovernAI visibility lives in the shared SmartAssistContext so panel/overlay
  // state persists across navigation between admin books, resource center, and
  // book editor pages. Inside a book, fresh opens default to the docked panel —
  // unless the user switched to overlay earlier this session, in which case
  // openInBook honors that choice.
  const {
    panelOpen: sidenavOpen,
    overlayOpen,
    openInBook,
    closePanel,
    closeOverlay,
    expandToOverlay,
    collapseToPanel,
  } = useSmartAssist();

  const [activeTab, setActiveTab] = useState(0);
  const [reviewForcedPage, setReviewForcedPage] = useState<number | undefined>();
  const [forcedPageNonce, setForcedPageNonce] = useState(0);
  const [forcedDocumentId, setForcedDocumentId] = useState<DocumentId | undefined>();

  // Consume routed state from the citation preview's "Open" button: switch to
  // "Review book", overlay the document's pages onto the assembled book, and
  // scroll to the cited page. Keyed on location.key so it re-fires even when
  // navigating to the same pathname.
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const fromQuery = sp.get("documentId")
      ? { openTab: sp.get("openTab") ?? undefined, documentId: sp.get("documentId") as DocumentId, documentPage: Number(sp.get("documentPage")) || 1 }
      : null;
    const state = (location.state as
      | { openTab?: string; documentId?: DocumentId; documentPage?: number }
      | null) ?? fromQuery;
    if (!state) return;
    if (state.openTab === "review") setActiveTab(1);
    if (state.documentId && DOCUMENTS[state.documentId]) {
      const docPage = typeof state.documentPage === "number" ? state.documentPage : 1;
      setForcedDocumentId(state.documentId);
      setReviewForcedPage(getBookPageForCitation(state.documentId, docPage));
      setForcedPageNonce((n) => n + 1);
    }
    navigate(location.pathname, { replace: true, state: null });
  }, [location.key]);

  // Reset the overlaid document when the user navigates to a different book.
  useEffect(() => {
    setForcedDocumentId(undefined);
  }, [id]);

  // Collapse the global app nav when entering this page; restore on leave.
  useEffect(() => {
    const wasOpen = document.body.classList.contains("atlas-gn-panel--open");
    if (wasOpen) {
      collapseGlobalNav();
      return () => { collapseGlobalNav(); };
    }
  }, []);

  // Open GovernAI by default whenever the book editor mounts or switches
  // books. Honors the session mode preference via openInBook (panel by
  // default; overlay if the user switched earlier this session).
  const openInBookRef = useRef(openInBook);
  openInBookRef.current = openInBook;
  useEffect(() => {
    openInBookRef.current();
  }, [id]);

  const handleGovernAI = openInBook;
  const handleExpand = expandToOverlay;
  const handleCollapse = collapseToPanel;

  const { previewSource, previewContext, dismissPreview } = useCitationPreview();
  const overlayOpenRef = useRef(overlayOpen);
  overlayOpenRef.current = overlayOpen;
  const handleExpandRef = useRef(handleExpand);
  handleExpandRef.current = handleExpand;

  useEffect(() => {
    if (!previewSource) return;
    // When the GovernAI panel is docked, an Insights citation into *this* book
    // scrolls to the cited page in the book viewer instead of opening the
    // right-side doc preview. A citation into a *different* book can't be shown
    // in place, so it falls through to the overlay preview. In overlay mode the
    // doc preview is fine either way — there's room for it next to the chat.
    if (previewContext === "insight" && !overlayOpenRef.current) {
      const citedBookId = previewSource.documentId
        ? DOCUMENTS[previewSource.documentId]?.bookId
        : undefined;
      if (citedBookId === id) {
        let bookPage: number | undefined;
        if (previewSource.documentId && DOCUMENTS[previewSource.documentId]) {
          const docPage = previewSource.targetPage ?? 1;
          setForcedDocumentId(previewSource.documentId);
          bookPage = getBookPageForCitation(previewSource.documentId, docPage);
        } else {
          const parsed = parseInt(previewSource.page ?? "", 10);
          if (!Number.isNaN(parsed)) bookPage = parsed;
        }
        if (typeof bookPage === "number") {
          setActiveTab(1);
          setReviewForcedPage(bookPage);
          setForcedPageNonce((n) => n + 1);
        }
        // Dismiss the preview surface but keep the clicked chip highlighted.
        dismissPreview();
        return;
      }
      // Cross-book citation → fall through to the overlay preview.
    }
    if (!overlayOpenRef.current) {
      handleExpandRef.current();
    }
  }, [previewSource, previewContext, dismissPreview, id]);

  return (
    <Box sx={{ display: "flex", height: "100%", overflow: "hidden", background: "radial-gradient(125.08% 101.36% at 0% 0%, var(--lens-semantic-color-background-base-gradient-start, #f9f9fc) 30.53%, var(--lens-semantic-color-background-base-gradient-end, #fcfcff) 100%)" }}>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <MaxWidthBody sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", pl: "32px", pr: sidenavOpen ? "12px" : "32px", transition: "padding-right 0.3s ease" }}>
        {/* Page header */}
        <Box sx={{ position: "relative" }}>
          <Box sx={{ pt: "24px", pb: "0" }}>
            {/* Breadcrumb */}
            <Stack direction="row" alignItems="center" gap="6px" sx={{ mb: "8px" }}>
              <Typography
                component="span"
                sx={{ fontSize: "12px", color: color.type.muted.value, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                onClick={() => navigate("/")}
              >
                Boards
              </Typography>
              <Typography sx={{ fontSize: "12px", color: color.type.muted.value }}>›</Typography>
              <Typography
                component="span"
                sx={{ fontSize: "12px", color: color.type.muted.value, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                onClick={() => navigate("/admin/books")}
              >
                Books
              </Typography>
              <Typography sx={{ fontSize: "12px", color: color.type.muted.value }}>›</Typography>
              <Typography sx={{ fontSize: "12px", color: color.type.default.value, fontWeight: 600, maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {book.title}
              </Typography>
            </Stack>

            {/* Title + actions */}
            <Stack direction="row" alignItems="center" gap="10px" sx={{ mb: "12px" }}>
              <Typography sx={{ fontSize: "24px", fontWeight: 600, lineHeight: "32px", color: color.type.default.value, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {book.title}
              </Typography>
              <Chip
                label={book.status === "Published" ? "Published" : "Draft"}
                size="small"
                sx={{
                  height: "22px",
                  fontSize: "12px",
                  fontWeight: 600,
                  backgroundColor:
                    book.status === "Published"
                      ? "rgb(236, 240, 255)"
                      : color.surface.variant.value,
                }}
              />
              {book.status === "Published" ? (
                <Button variant="outlined" sx={{ fontWeight: 600, fontSize: "16px", minWidth: "90px", ml: "auto" }}>Unpublish</Button>
              ) : (
                <Button variant="contained" sx={{ fontWeight: 600, fontSize: "16px", minWidth: "90px", ml: "auto" }}>Publish</Button>
              )}
              {!sidenavOpen && (
                <Button
                  variant="outlined"
                  color="ai"
                  startIcon={<AiSparkleIcon size="md" />}
                  onClick={handleGovernAI}
                  sx={{
                    fontSize: "16px",
                    border: "1px solid transparent !important",
                    backgroundColor: "transparent !important",
                    backgroundImage:
                      "linear-gradient(#fff, #fff), linear-gradient(128deg, #b11f62 17.49%, #1c4ee4 100%) !important",
                    backgroundOrigin: "border-box !important",
                    backgroundClip: "padding-box, border-box !important",
                    "&::before": { display: "none" },
                    "&:hover, &:not(.Mui-disabled):hover": {
                      border: "1px solid transparent !important",
                      backgroundColor: "transparent !important",
                      backgroundImage:
                        "linear-gradient(#f3f3f3, #f3f3f3), linear-gradient(128deg, #b11f62 17.49%, #1c4ee4 100%) !important",
                      backgroundOrigin: "border-box !important",
                      backgroundClip: "padding-box, border-box !important",
                    },
                    "&:hover::before, &::after, &:hover::after": { display: "none" },
                  }}
                >
                  GovernAI
                </Button>
              )}
              <IconButton size="small"><MoreIcon /></IconButton>
            </Stack>
          </Box>

          {/* Tabs */}
          <Box>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              {...TabsPresets.Tabs.alignToPageHeader}
              sx={{
                minHeight: "40px",
                borderBottom: `1px solid ${color.ui.divider.default.value}`,
                "& .MuiTab-root": {
                  minHeight: "40px",
                  px: "16px",
                  fontSize: "14px",
                  borderBottom: "none",
                  borderRadius: "8px",
                  "&:not(.Mui-selected)::after": { display: "none" },
                },
              }}
            >
              <Tab label="Build book" />
              <Tab label="Review book" />
            </Tabs>
          </Box>

        </Box>

        {/* Tab content — shared container for both tabs */}
        <Box sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", pt: "16px" }}>
          {activeTab === 0 && <BuildBookTab bookTitle={book.title} bookId={book.id} />}
          {activeTab === 1 && (
            <ReviewBookTab
              bookTitle={book.title}
              bookId={book.id}
              assistOpen={sidenavOpen || overlayOpen}
              forcedPage={reviewForcedPage}
              forcedPageNonce={forcedPageNonce}
              forcedDocumentId={forcedDocumentId}
            />
          )}
        </Box>
      </MaxWidthBody>
      </Box>

      {/* GovernAI sidenav */}
      <SmartAssistSidenav
        open={sidenavOpen}
        onClose={closePanel}
        onExpand={handleExpand}
        bookTitle={book.title}
        title="GovernAI"
        variant="persistent"
        showInsights
      />
      <SmartAssistOverlay
        open={overlayOpen}
        onClose={closeOverlay}
        onCollapse={handleCollapse}
        bookTitle={book.title}
        showInsights
      />
    </Box>
  );
}
