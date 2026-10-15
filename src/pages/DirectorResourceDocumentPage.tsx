import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router";
import { Box, IconButton, Stack, Tab, Tabs, Typography, useTheme } from "@mui/material";

import ArrowLeftIcon from "@diligentcorp/atlas-react-bundle/icons/ArrowLeft";
import DocumentIcon from "@diligentcorp/atlas-react-bundle/icons/Document";
import DoubleArrowLeftIcon from "@diligentcorp/atlas-react-bundle/icons/DoubleArrowLeft";
import ExpandDownIcon from "@diligentcorp/atlas-react-bundle/icons/ExpandDown";
import ExpandRightIcon from "@diligentcorp/atlas-react-bundle/icons/ExpandRight";
import ExpandSideNavIcon from "@diligentcorp/atlas-react-bundle/icons/ExpandSideNav";
import FolderIcon from "@diligentcorp/atlas-react-bundle/icons/Folder";
import ListIcon from "@diligentcorp/atlas-react-bundle/icons/List";

import DocumentViewerToolbar, { ZOOM_LEVELS } from "../components/DocumentViewerToolbar.js";
import { DOCUMENTS, type DocumentId } from "../data/documents.js";

// Director-side selection colors, same as the book reader.
const SELECTED_BG = "#ECF0FF";
const SELECTED_FG = "#0040D5";

// ─── Resource center structure ───────────────────────────────────────────────
// The workspace tree the left panel shows. Documents resolve through DOCUMENTS.

interface TreeNode {
  id: string;
  label: string;
  documentId?: DocumentId;
  children?: TreeNode[];
}

const RESOURCE_TREE: TreeNode[] = [
  {
    id: "risk-committee",
    label: "Risk Committee",
    children: [
      {
        id: "policies",
        label: "Policies",
        children: [
          {
            id: "rc-vulnerability-incident-policy",
            label: "Vulnerability and incident response policy",
            documentId: "rc-vulnerability-incident-policy",
          },
        ],
      },
    ],
  },
];

const containsDocument = (node: TreeNode, documentId: string): boolean =>
  node.documentId === documentId || !!node.children?.some((c) => containsDocument(c, documentId));

// ─── Tree row ────────────────────────────────────────────────────────────────

function TreeRow({
  node,
  activeDocumentId,
  onOpen,
  depth = 0,
}: {
  node: TreeNode;
  activeDocumentId: string;
  onOpen: (documentId: DocumentId) => void;
  depth?: number;
}) {
  const { tokens: { semantic: { color } } } = useTheme();
  const isFolder = !!node.children;
  const [expanded, setExpanded] = useState(() => containsDocument(node, activeDocumentId));
  const isActive = !isFolder && node.documentId === activeDocumentId;

  return (
    <Box>
      <Box
        onClick={() => {
          if (isFolder) setExpanded((v) => !v);
          else if (node.documentId) onOpen(node.documentId);
        }}
        sx={{ pl: `${depth * 16}px`, pr: "8px", cursor: "pointer" }}
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
            "&:hover": { backgroundColor: isActive ? SELECTED_BG : color.surface.variant.value },
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
            {isFolder ? <FolderIcon size="md" /> : <DocumentIcon size="md" />}
          </Box>
          <Typography
            sx={{
              flex: 1,
              fontSize: "12px",
              fontWeight: isFolder ? 600 : 400,
              lineHeight: "16px",
              letterSpacing: "0.3px",
              color: color.type.default.value,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {node.label}
          </Typography>
          {isFolder && (
            <Box sx={{ flexShrink: 0, display: "flex", color: color.type.default.value }}>
              {expanded ? <ExpandDownIcon size="md" /> : <ExpandRightIcon size="md" />}
            </Box>
          )}
        </Stack>
      </Box>
      {isFolder && expanded &&
        node.children!.map((child) => (
          <TreeRow
            key={child.id}
            node={child}
            activeDocumentId={activeDocumentId}
            onOpen={onOpen}
            depth={depth + 1}
          />
        ))}
    </Box>
  );
}

// ─── Left panel ──────────────────────────────────────────────────────────────

function LeftPanel({
  activeDocumentId,
  onOpen,
  onCollapse,
}: {
  activeDocumentId: string;
  onOpen: (documentId: DocumentId) => void;
  onCollapse: () => void;
}) {
  const {
    tokens: { semantic: { color, radius } },
    presets: { TabsPresets },
  } = useTheme();
  const [innerTab, setInnerTab] = useState(0);

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
      <Stack direction="row" alignItems="center" gap="4px" sx={{ pt: "16px", pb: "8px", px: "12px" }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            height: 32,
            p: "4px",
            pr: "8px",
            borderRadius: "8px",
            color: SELECTED_FG,
            backgroundColor: SELECTED_BG,
          }}
        >
          <ListIcon size="lg" />
          <Typography sx={{ fontSize: "16px", fontWeight: 600, lineHeight: "24px", letterSpacing: "0.2px", color: SELECTED_FG }}>
            Content
          </Typography>
        </Box>
        <IconButton
          aria-label="Collapse panel"
          onClick={onCollapse}
          sx={{ flexShrink: 0, ml: "auto", p: "4px", borderRadius: "8px", color: color.type.default.value }}
        >
          <DoubleArrowLeftIcon size="lg" />
        </IconButton>
      </Stack>

      <Tabs
        value={innerTab}
        // Only "Structure" is built out; "Thumbnails" keeps its hover state only.
        onChange={(_, v) => { if (v === 0) setInnerTab(v); }}
        {...TabsPresets.Tabs.alignToPageHeader}
        sx={{
          width: "100%",
          px: "12px",
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

      <Box sx={{ flex: 1, overflowY: "auto", pt: "4px", pb: "8px", px: "12px" }}>
        {RESOURCE_TREE.map((node) => (
          <TreeRow key={node.id} node={node} activeDocumentId={activeDocumentId} onOpen={onOpen} />
        ))}
      </Box>
    </Box>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DirectorResourceDocumentPage() {
  const { documentId = "" } = useParams<{ documentId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { tokens: { semantic: { color, radius } } } = useTheme();

  const doc = documentId in DOCUMENTS ? DOCUMENTS[documentId as DocumentId] : null;
  const totalPages = doc?.pages.length ?? 1;
  const initialPage = Number(searchParams.get("documentPage")) || 1;

  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(Math.min(Math.max(1, initialPage), totalPages));
  const [zoomIndex, setZoomIndex] = useState(2); // 100%
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const zoomPct = ZOOM_LEVELS[zoomIndex];

  // Opening another document from the tree resets to its first page.
  useEffect(() => {
    setCurrentPage(Math.min(Math.max(1, Number(searchParams.get("documentPage")) || 1), totalPages));
  }, [documentId, totalPages, searchParams]);

  useEffect(() => {
    pageRefs.current[currentPage - 1]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentPage, documentId]);

  if (!doc) return <Navigate to="/director/resource-center" replace />;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", backgroundColor: color.surface.default.value }}>
      {/* ── Header ── */}
      <Stack
        direction="row"
        alignItems="center"
        sx={{ py: "8px", pl: "20px", pr: "12px", backgroundColor: color.surface.default.value, flexShrink: 0 }}
      >
        <IconButton
          aria-label="Back"
          onClick={() => navigate("/director/resource-center")}
          sx={{ p: "4px", borderRadius: "8px", color: color.action.secondary.onSecondary.value }}
        >
          <ArrowLeftIcon size="lg" />
        </IconButton>
        <Box sx={{ flex: 1, px: "8px", minWidth: 0 }}>
          <Typography
            sx={{
              px: "12px",
              py: "8px",
              color: color.type.default.value,
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "0.2px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {doc.title}
          </Typography>
        </Box>
      </Stack>

      {/* ── Body row: content tree + document preview ── */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          gap: "8px",
          p: "12px",
          background:
            "radial-gradient(101.36% 125.08% at 0% 0%, var(--lens-semantic-color-background-base-gradient-start, #f9f9fc) 31%, var(--lens-semantic-color-background-base-gradient-end, #fcfcff) 100%)",
          borderTopLeftRadius: "24px",
        }}
      >
        {leftPanelOpen ? (
          <LeftPanel
            activeDocumentId={documentId}
            onOpen={(id) => navigate(`/director/resource-center/doc/${id}`)}
            onCollapse={() => setLeftPanelOpen(false)}
          />
        ) : (
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

        <Box sx={{ flex: 1, minWidth: 0, borderRadius: radius.md.value, display: "flex", flexDirection: "column", position: "relative" }}>
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
            {doc.pages.map((p, idx) => (
              <Box
                key={`${doc.id}-${p.page}`}
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
                <img src={p.image} alt={`${doc.title} — ${p.label}`} style={{ height: "100%", width: "auto", display: "block" }} />
              </Box>
            ))}
          </Box>

          <DocumentViewerToolbar
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            zoomIndex={zoomIndex}
            onZoomIndexChange={setZoomIndex}
            showAgenda={false}
          />
        </Box>
      </Box>
    </Box>
  );
}
