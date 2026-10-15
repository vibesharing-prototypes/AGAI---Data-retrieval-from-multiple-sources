import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import SmartAssistSidenav from "../components/SmartAssistSidenav.js";
import SmartAssistOverlay from "../components/SmartAssistOverlay.js";
import DocumentViewerToolbar from "../components/DocumentViewerToolbar.js";
import { useSmartAssist } from "../context/SmartAssistContext.js";
import { useCitationPreview } from "../context/CitationPreviewContext.js";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";

import AiSparkleIcon from "@diligentcorp/atlas-react-bundle/icons/AiSparkle";
import AnnotationsIcon from "@diligentcorp/atlas-react-bundle/icons/Annotations";
import ArrowLeftIcon from "@diligentcorp/atlas-react-bundle/icons/ArrowLeft";
import BookmarkIcon from "@diligentcorp/atlas-react-bundle/icons/Bookmark";
import DocumentIcon from "@diligentcorp/atlas-react-bundle/icons/Document";
import DoubleArrowLeftIcon from "@diligentcorp/atlas-react-bundle/icons/DoubleArrowLeft";
import ExpandDownIcon from "@diligentcorp/atlas-react-bundle/icons/ExpandDown";
import ExpandRightIcon from "@diligentcorp/atlas-react-bundle/icons/ExpandRight";
import ExpandSideNavIcon from "@diligentcorp/atlas-react-bundle/icons/ExpandSideNav";
import ExpandIcon from "@diligentcorp/atlas-react-bundle/icons/Expand";
import FacePagesIcon from "@diligentcorp/atlas-react-bundle/icons/FacePages";
import KeyIcon from "@diligentcorp/atlas-react-bundle/icons/Key";
import MoreIcon from "@diligentcorp/atlas-react-bundle/icons/More";
import SearchIcon from "@diligentcorp/atlas-react-bundle/icons/Search";
import ToolkitBuilderIcon from "@diligentcorp/atlas-react-bundle/icons/ToolkitBuilder";
import ListIcon from "@diligentcorp/atlas-react-bundle/icons/List";

import { directorBooks, reviewNavStructure } from "../data/mockData.js";
import {
  DOCUMENTS,
  getBookPageForCitation,
  q2BoardPackageNav,
  q2BoardPackageNavPageById,
  q2BoardPackagePages,
  type BookNavItem,
  type DocumentId,
} from "../data/documents.js";

const PAGE_IMAGES = Array.from({ length: 10 }, (_, i) => `/boardroom-pages/page-${12 + i}.png`);

/** Q2 2026 Board Package (book id "1") is the assembled 14-document pack;
 *  every other book falls back to the legacy boardroom mock. */
const Q2_BOARD_PACKAGE_ID = "1";
const ZOOM_LEVELS = [50, 75, 100, 125, 150, 200];

// Director-side selection colors (Atlas Light's selection.secondary maps to
// red in this bundle; the director Figma uses indigo).
const SELECTED_BG = "#ECF0FF";
const SELECTED_FG = "#0040D5";

// ─── Left panel ──────────────────────────────────────────────────────────────

// Mirrors the admin Review-book nav (BookEditorPage's NavTreeItem): the same
// tab/document tree, expand behavior, and navigation. The one difference is
// the leaf icon — directors get a plain document icon.
function StructureRow({
  item,
  activeId,
  onSelect,
  depth = 0,
}: {
  item: BookNavItem;
  activeId: string;
  onSelect: (id: string) => void;
  depth?: number;
}) {
  const {
    tokens: { semantic: { color } },
  } = useTheme();
  const [expanded, setExpanded] = useState(item.expanded ?? false);
  const isActive = item.id === activeId;

  // Tabs/subtabs are section headings; documents are leaves. Falls back to the
  // legacy label-prefix heuristic for books without an explicit kind.
  const isSection = item.kind ? item.kind !== "document" : /^\d|^Agenda/.test(item.label);

  if (isSection) {
    return (
      <Box>
        {/* Mirrors the document-row pattern: outer Box owns depth indent +
            click target; inner Stack carries the visual padding + the 8px
            rounded hover background. */}
        <Box
          onClick={() => {
            onSelect(item.id);
            if (item.children) setExpanded((v) => !v);
          }}
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
              {item.children && expanded ? (
                <ExpandDownIcon size="md" />
              ) : (
                <ExpandRightIcon size="md" />
              )}
            </IconButton>
          </Stack>
        </Box>
        {expanded && item.children && (
          <Box>
            {item.children.map((child) => (
              <StructureRow
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

  // Document item — selected state: a rounded #ECF0FF fill with a 2×20 #0040D5
  // indicator bar pinned to its left edge. Uses a regular document icon.
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
          backgroundColor: isActive ? SELECTED_BG : "transparent",
          "&:hover": {
            backgroundColor: isActive ? SELECTED_BG : color.surface.variant.value,
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
              backgroundColor: SELECTED_FG,
              borderRadius: "24px",
            }}
          />
        )}
        <Box sx={{ flexShrink: 0, color: color.type.muted.value }}>
          <DocumentIcon size="md" />
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
          <Box
            sx={{
              height: 24,
              minWidth: 40,
              px: "2px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              // Atlas accent.gray (#F0F0F3 bg / #454749 content) — not in the
              // bundled token tree, so values are inlined per the Figma spec.
              backgroundColor: "#F0F0F3",
              borderRadius: "9999px",
              outline: `1px ${color.surface.default.value} solid`,
              outlineOffset: "-1px",
              color: "#454749",
              flexShrink: 0,
            }}
          >
            <KeyIcon size="md" />
          </Box>
        )}
      </Stack>
    </Box>
  );
}

function LeftPanel({
  activeId,
  onSelectItem,
  onCollapse,
  navStructure,
}: {
  activeId: string;
  onSelectItem: (id: string) => void;
  onCollapse: () => void;
  navStructure: BookNavItem[];
}) {
  const {
    tokens: { semantic: { color, radius } },
    presets: { TabsPresets },
  } = useTheme();
  const [menuTab, setMenuTab] = useState<"content" | "search" | "annotations" | "toolkit" | "bookmark">("content");
  const [innerTab, setInnerTab] = useState(0);

  // Plain styled <button> — MUI Button's internal sizing was causing
  // siblings to overlap when the selected "Content" item expanded its label.
  const MenuIconButton = ({
    id,
    label,
    icon,
  }: {
    id: typeof menuTab;
    label: string;
    icon: React.ReactNode;
  }) => {
    const selected = menuTab === id;
    // Only "Content" has a real panel built out — Search / Annotations /
    // Toolkit / Bookmark are not wired up, so they stay visible (with hover)
    // but don't switch the panel.
    return (
      <Box
        component="button"
        type="button"
        aria-label={label}
        onClick={() => { if (id === "content") setMenuTab(id); }}
        sx={{
          all: "unset",
          boxSizing: "border-box",
          flexShrink: 0,
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          height: 32,
          p: "4px",
          pr: selected && id === "content" ? "8px" : "4px",
          borderRadius: "8px",
          cursor: "pointer",
          color: selected ? SELECTED_FG : color.action.secondary.onSecondary.value,
          backgroundColor: selected ? SELECTED_BG : "transparent",
          "&:hover": {
            backgroundColor: selected ? SELECTED_BG : color.surface.variant.value,
          },
        }}
      >
        {icon}
        {selected && id === "content" && (
          <Typography
            sx={{
              fontSize: "16px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              lineHeight: "24px",
              letterSpacing: "0.2px",
              color: SELECTED_FG,
            }}
          >
            Content
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        width: 340,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        backgroundColor: color.surface.default.value,
        borderRadius: radius.lg.value,
        outline: `1px ${color.outline.fixed.value} solid`,
        outlineOffset: "-1px",
        overflow: "hidden",
      }}
    >
      {/* Menu bar — 5 tool icons clustered left (4px apart); collapse pinned
          to the right via marginLeft: auto. */}
      <Stack
        direction="row"
        alignItems="center"
        gap="4px"
        sx={{ pt: "16px", pb: "8px", px: "12px" }}
      >
        <MenuIconButton id="content" label="Content" icon={<ListIcon size="lg" />} />
        <MenuIconButton id="search" label="Search" icon={<SearchIcon size="lg" />} />
        <MenuIconButton id="annotations" label="Annotations" icon={<AnnotationsIcon size="lg" />} />
        <MenuIconButton id="toolkit" label="Toolkit" icon={<ToolkitBuilderIcon size="lg" />} />
        <MenuIconButton id="bookmark" label="Bookmark" icon={<BookmarkIcon size="lg" />} />
        <IconButton
          aria-label="Collapse panel"
          onClick={onCollapse}
          sx={{
            flexShrink: 0,
            ml: "auto",
            p: "4px",
            borderRadius: "8px",
            color: color.type.default.value,
          }}
        >
          <DoubleArrowLeftIcon size="lg" />
        </IconButton>
      </Stack>

      {/* Structure / Thumbnails tabs — same edge-to-edge divider pattern as the
          home page tabs (12px inset instead of 32px), without the AI gradient. */}
      {menuTab === "content" && (
        <Tabs
          value={innerTab}
          // Only "Structure" is built out — "Thumbnails" keeps its hover state
          // but doesn't switch since there's no thumbnails view yet.
          onChange={(_, v) => { if (v === 0) setInnerTab(v); }}
          {...TabsPresets.Tabs.alignToPageHeader}
          sx={{
            width: "100%",
            pl: "12px",
            pr: "12px",
            mt: "8px",
            minHeight: "28px",
            isolation: "isolate",
            "& .MuiTabs-flexContainer": { gap: 0 },
            "&::after": { left: "12px", right: "12px" },
            "& .MuiTab-root::after": { display: "none" },
            "& .MuiTab-root.Mui-selected::after": {
              display: "block",
              height: "2px",
              bottom: 0,
              top: "auto",
              borderTopLeftRadius: "2px",
              borderTopRightRadius: "2px",
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
            "& .MuiTab-root": {
              minHeight: "28px",
              px: "12px",
              py: "6px",
              fontSize: "12px",
              fontWeight: 600,
              lineHeight: "16px",
              letterSpacing: "0.3px",
              textTransform: "none",
              borderRadius: "8px",
            },
          }}
        >
          <Tab label="Structure" />
          <Tab label="Thumbnails" />
        </Tabs>
      )}

      {/* Body — 12px side padding mirrors the menu bar / tabs above so the
          document tree sits inset from the panel outline, matching admin. */}
      <Box sx={{ flex: 1, overflowY: "auto", pt: "4px", pb: "8px", px: "12px" }}>
        {menuTab === "content" && innerTab === 0 && (
          <Box>
            {navStructure.map((item) => (
              <StructureRow
                key={item.id}
                item={item}
                activeId={activeId}
                onSelect={onSelectItem}
              />
            ))}
          </Box>
        )}
        {menuTab === "content" && innerTab === 1 && (
          <Box sx={{ p: "16px", color: color.type.muted.value, fontSize: 12 }}>Thumbnails</Box>
        )}
        {menuTab !== "content" && (
          <Box sx={{ p: "16px", color: color.type.muted.value, fontSize: 12, textTransform: "capitalize" }}>
            {menuTab}
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DirectorBookReaderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    tokens: { semantic: { color, radius } },
  } = useTheme();

  // Directors can only open published or archived books — `directorBooks`
  // excludes unpublished books, so an unpublished id falls back to the first
  // visible book rather than rendering a book directors shouldn't see.
  const book = directorBooks.find((b) => b.id === id) ?? directorBooks[0];

  // The Q2 2026 Board Package (book id "1") is assembled from the 14 generated
  // documents cited by Smart Summary / Prep / Risk. Every other book still uses
  // the legacy boardroom mock pages + nav.
  const isQ2BoardPackage = id === Q2_BOARD_PACKAGE_ID;
  // A citation "Open" into a non-Q2 book arrives with the cited document in
  // location.state. Those legacy books have no assembled-page set of their own,
  // so the reader renders the cited document's own pages instead of the generic
  // boardroom mock — that's how single-document citations open "in the book".
  const queryDocId = new URLSearchParams(location.search).get("documentId");
  const navState = (location.state as { documentId?: string; documentPage?: number; from?: string } | null)
    ?? (queryDocId
      ? { documentId: queryDocId, documentPage: Number(new URLSearchParams(location.search).get("documentPage")) || 1 }
      : null);
  const backDestRef = useRef<string>(navState?.from ?? "/director");
  const stateDoc =
    !isQ2BoardPackage && navState?.documentId && navState.documentId in DOCUMENTS
      ? DOCUMENTS[navState.documentId as DocumentId]
      : null;
  // Directors see the same tab/document tree as the admin Review-book nav.
  const navStructure: BookNavItem[] = isQ2BoardPackage
    ? q2BoardPackageNav
    : reviewNavStructure;
  const pageImages = isQ2BoardPackage
    ? q2BoardPackagePages.map((p) => p.image)
    : stateDoc
      ? stateDoc.pages.map((p) => p.image)
      : PAGE_IMAGES;
  const totalPages = pageImages.length;

  // GovernAI panel/overlay state lives in shared context so it persists across
  // navigation, matching admin BookEditorPage behavior. Inside the book, the
  // button opens the docked panel by default — but if the user switched to
  // overlay earlier this session, openInBook reopens in overlay. Insights are
  // enabled either way.
  const {
    panelOpen: sidenavOpen,
    overlayOpen,
    openInBook,
    closePanel,
    closeOverlay,
    expandToOverlay,
    collapseToPanel,
    bookPanelDismissed,
    setBookPanelDismissed,
  } = useSmartAssist();

  // GovernAI opens automatically when the director enters a book, unless they
  // closed it earlier this session — that choice is remembered (panel stays
  // closed) until the browser is refreshed.
  const openBookPanel = () => {
    setBookPanelDismissed(false);
    openInBook();
  };
  const dismissBookPanel = () => {
    setBookPanelDismissed(true);
    closePanel();
  };
  const dismissBookOverlay = () => {
    setBookPanelDismissed(true);
    closeOverlay();
  };

  useEffect(() => {
    if (!bookPanelDismissed && !sidenavOpen && !overlayOpen) openInBook();
    // Run once on entering the book; dismissal state gates the auto-open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [activeNavId, setActiveNavId] = useState(
    isQ2BoardPackage ? `doc:${q2BoardPackagePages[0].documentId}` : "s1-2-1-1-d1",
  );
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomIndex, setZoomIndex] = useState(2); // 100%
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const zoomPct = ZOOM_LEVELS[zoomIndex];

  // Structure-nav click → scroll the assembled book to the page that nav row
  // maps to (tabs/subtabs jump to their first document; documents to their
  // own page). Legacy books keep the highlight-only nav.
  const handleSelectNavItem = (navId: string) => {
    setActiveNavId(navId);
    const bookPage = q2BoardPackageNavPageById[navId];
    if (typeof bookPage === "number") {
      setCurrentPage(Math.min(totalPages, Math.max(1, bookPage)));
    }
  };

  // Hide the global app header + side nav while in the book reader; the
  // book's own header is the only top nav on this route.
  useEffect(() => {
    document.body.classList.add("book-reader-route");
    return () => {
      document.body.classList.remove("book-reader-route");
    };
  }, []);

  useEffect(() => {
    pageRefs.current[currentPage - 1]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentPage]);

  // Citation preview behavior inside the book reader:
  //  • Panel mode + citation into *this* book → scroll the book to the cited
  //    page in place (no right-side doc preview). Applies to both "insight"
  //    and "chat" contexts so clicking chat response chips also scrolls.
  //  • Panel mode + citation into a *different* book → can't be shown in place,
  //    so expand to the full-screen overlay and show it in the side preview.
  //  • Overlay mode → stay in full screen; the overlay's CitationPreviewPanel
  //    renders the cited document (handled by leaving previewSource set).
  const { previewSource, previewContext, dismissPreview } = useCitationPreview();
  const overlayOpenRef = useRef(overlayOpen);
  overlayOpenRef.current = overlayOpen;
  const expandRef = useRef(expandToOverlay);
  expandRef.current = expandToOverlay;
  useEffect(() => {
    if (!previewSource) return;
    const isPanelContext = previewContext === "insight" || previewContext === "chat";
    if (isPanelContext && !overlayOpenRef.current) {
      // Home book of the cited document — only same-book citations can be
      // shown by scrolling the currently open book.
      const citedBookId = previewSource.documentId
        ? DOCUMENTS[previewSource.documentId]?.bookId
        : undefined;
      if (citedBookId === id) {
        // Scroll the assembled book to the cited document's page. For the Q2
        // Board Package, map (documentId, targetPage) → assembled book page;
        // otherwise fall back to the source's literal page number.
        const bookPage =
          previewSource.documentId
            ? getBookPageForCitation(previewSource.documentId, previewSource.targetPage ?? 1)
            : parseInt(previewSource.page ?? "", 10);
        if (!Number.isNaN(bookPage)) {
          setCurrentPage(Math.min(totalPages, Math.max(1, bookPage)));
        }
        // Dismiss the preview surface but keep the clicked chip highlighted.
        dismissPreview();
        return;
      }
      // Cross-book citation → fall through to the overlay preview.
    }
    if (!overlayOpenRef.current) {
      expandRef.current();
    }
  }, [previewSource, previewContext, dismissPreview, totalPages, id]);

  // "Open in Boards" from a citation preview navigates here with the cited
  // document in location.state. For the Q2 Board Package, map the citation into
  // the assembled-book page space; for a non-Q2 book the reader is already
  // showing the cited document's own pages, so scroll straight to that page.
  useEffect(() => {
    const state = navState;
    if (!state?.documentId || !(state.documentId in DOCUMENTS)) return;
    const bookPage = stateDoc
      ? state.documentPage ?? 1
      : getBookPageForCitation(state.documentId as DocumentId, state.documentPage ?? 1);
    setCurrentPage(Math.min(totalPages, Math.max(1, bookPage)));
  }, [location.key, totalPages]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", backgroundColor: color.surface.default.value }}>
      {/* ── Header ── full-width; sits above the panel-pushed content row */}
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          py: "8px",
          pl: "20px",
          pr: "12px",
          backgroundColor: color.surface.default.value,
          flexShrink: 0,
        }}
      >
        <IconButton
          aria-label="Back"
          onClick={() => navigate(backDestRef.current)}
          sx={{ p: "4px", borderRadius: "8px", color: color.action.secondary.onSecondary.value }}
        >
          <ArrowLeftIcon size="lg" />
        </IconButton>

        <Stack direction="row" alignItems="center" sx={{ flex: 1, justifyContent: "space-between", minWidth: 0 }}>
          <Box sx={{ flex: 1, px: "8px", minWidth: 0 }}>
            <Box
              sx={{
                px: "12px",
                py: "8px",
                borderRadius: "100px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  color: color.type.default.value,
                  fontSize: "16px",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  lineHeight: "24px",
                  letterSpacing: "0.2px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {book.title}
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" alignItems="center" gap="24px" sx={{ flexShrink: 0 }}>
            <Button
              variant="outlined"
              color="ai"
              startIcon={<AiSparkleIcon size="lg" />}
              onClick={sidenavOpen ? dismissBookPanel : openBookPanel}
              aria-pressed={sidenavOpen}
              sx={{
                height: 40,
                px: "12px",
                fontSize: "16px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                lineHeight: "24px",
                letterSpacing: "0.16px",
                textTransform: "none",
                border: "1px solid transparent !important",
                backgroundColor: "transparent !important",
                backgroundImage: sidenavOpen
                  ? "linear-gradient(#e6e6e6, #e6e6e6), linear-gradient(128deg, #b11f62 17.49%, #1c4ee4 100%) !important"
                  : "linear-gradient(#fff, #fff), linear-gradient(128deg, #b11f62 17.49%, #1c4ee4 100%) !important",
                backgroundOrigin: "border-box !important",
                backgroundClip: "padding-box, border-box !important",
                "&::before": { display: "none" },
                "&:hover, &:not(.Mui-disabled):hover": {
                  border: "1px solid transparent !important",
                  backgroundColor: "transparent !important",
                  backgroundImage: sidenavOpen
                    ? "linear-gradient(#dcdcdc, #dcdcdc), linear-gradient(128deg, #b11f62 17.49%, #1c4ee4 100%) !important"
                    : "linear-gradient(#f3f3f3, #f3f3f3), linear-gradient(128deg, #b11f62 17.49%, #1c4ee4 100%) !important",
                  backgroundOrigin: "border-box !important",
                  backgroundClip: "padding-box, border-box !important",
                },
                "&:hover::before, &::after, &:hover::after": { display: "none" },
              }}
            >
              GovernAI
            </Button>
            <IconButton aria-label="Focus" sx={{ p: 0, color: color.type.default.value }}>
              <ExpandIcon size="lg" />
            </IconButton>
            <IconButton aria-label="View mode" sx={{ p: 0, color: color.type.default.value }}>
              <FacePagesIcon size="lg" />
            </IconButton>
            <IconButton aria-label="More" sx={{ p: 0, color: color.type.default.value }}>
              <MoreIcon size="lg" />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>

      {/* ── Body row: left book nav + doc preview + GovernAI sidenav all
          share the same gradient container. Header above is full-width. */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          position: "relative",
          display: "flex",
          gap: "8px",
          pt: "12px",
          pl: "12px",
          pr: "12px",
          pb: "12px",
          background:
            "radial-gradient(101.36% 125.08% at 0% 0%, var(--lens-semantic-color-background-base-gradient-start, #f9f9fc) 31%, var(--lens-semantic-color-background-base-gradient-end, #fcfcff) 100%)",
          borderTopLeftRadius: "24px",
        }}
      >
        {leftPanelOpen ? (
          <LeftPanel
            activeId={activeNavId}
            onSelectItem={handleSelectNavItem}
            onCollapse={() => setLeftPanelOpen(false)}
            navStructure={navStructure}
          />
        ) : (
          // Collapsed: 48×48 "expand side nav" button. Sits in the LeftPanel
          // slot. 12px on top/left/bottom comes from the gradient body's
          // padding; the 4px right margin + 8px parent gap = 12px gap to
          // the doc viewer. Figma node 4373:349731.
          <IconButton
            aria-label="Expand panel"
            onClick={() => setLeftPanelOpen(true)}
            sx={{
              flexShrink: 0,
              alignSelf: "flex-start",
              width: 48,
              height: 48,
              mr: "4px",
              p: 0,
              backgroundColor: color.surface.default.value,
              border: `1px solid ${color.outline.fixed.value}`,
              borderRadius: "12px",
              color: color.type.default.value,
            }}
          >
            <ExpandSideNavIcon size="lg" />
          </IconButton>
        )}

        {/* Document viewer — transparent so the gradient shows through.
            overflow stays visible so the absolutely-positioned bottom toolbar's
            elevation shadow isn't clipped. The inner scroll Box clips page
            content on its own. */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            borderRadius: radius.md.value,
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              pt: "20px",
              px: "16px",
              pb: "100px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {pageImages.map((src, idx) => (
              <Box
                key={idx}
                ref={(el: HTMLDivElement | null) => {
                  pageRefs.current[idx] = el;
                }}
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

          <DocumentViewerToolbar
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            zoomIndex={zoomIndex}
            onZoomIndexChange={setZoomIndex}
            showViewToggle
          />
        </Box>

        {/* GovernAI sidenav. Sits inside the gradient body container as a
            sibling of LeftPanel + doc viewer. The wrapping Box neutralizes
            SmartAssistSidenav's built-in 12px Drawer-paper margins so the
            gradient container's 12px padding alone defines the panel's
            top / bottom / right margin. Width: 440px. */}
        <Box
          sx={{
            flexShrink: 0,
            width: sidenavOpen ? "440px" : 0,
            transition: "width 0.2s",
            // `&&` bumps specificity above SmartAssistSidenav's own Drawer sx so
            // these overrides actually win — otherwise the Drawer keeps its
            // built-in 12px paper margins and the panel overflows 12px past the
            // gradient body, getting clipped on the right.
            "&& .MuiDrawer-root": { width: sidenavOpen ? "440px" : 0 },
            "&& .MuiDrawer-paper": {
              margin: 0,
              height: "100%",
              width: "440px",
            },
          }}
        >
          <SmartAssistSidenav
            open={sidenavOpen}
            onClose={dismissBookPanel}
            onExpand={expandToOverlay}
            bookTitle={book.title}
            title="GovernAI"
            variant="persistent"
            showInsights
            audience="director"
            hideInsightsFooter
          />
        </Box>
      </Box>

      <SmartAssistOverlay
        open={overlayOpen}
        onClose={dismissBookOverlay}
        onCollapse={collapseToPanel}
        bookTitle={book.title}
        showInsights
        audience="director"
        hideInsightsFooter
      />
    </Box>
  );
}
