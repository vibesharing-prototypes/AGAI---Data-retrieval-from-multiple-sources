import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Box, Button, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import LinkIcon from "@diligentcorp/atlas-react-bundle/icons/Link";
import CheckedIcon from "@diligentcorp/atlas-react-bundle/icons/Checked";
import DocumentViewerToolbar, { ZOOM_LEVELS } from "./DocumentViewerToolbar.js";
import { useCitationPreview } from "../context/CitationPreviewContext.js";
import { DOCUMENTS, getDocumentPage, type DocumentDef } from "../data/documents.js";
import type { Source } from "../data/mockData.js";
import { SOURCE_MODULES } from "./SourcesBlock.js";

const PANEL_WIDTH = 600;
const PAGE_WIDTH_BASE = 540; // logical width at 100% zoom

// ─── Image-based document renderer ────────────────────────────────────────────

function ImageDocument({
  doc,
  page,
  zoomPct,
}: {
  doc: DocumentDef;
  page: number;
  zoomPct: number;
}) {
  const pageDef = getDocumentPage(doc.id, page);
  const width = (zoomPct / 100) * PAGE_WIDTH_BASE;

  return (
    <Box
      sx={{
        flexShrink: 0,
        width: `${width}px`,
        backgroundColor: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "inset 0 0 0 0.68px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.12)",
        lineHeight: 0,
      }}
    >
      <img
        key={pageDef.image}
        src={pageDef.image}
        alt={`${doc.title} — ${pageDef.label}`}
        loading="eager"
        style={{ display: "block", width: "100%", height: "auto" }}
      />
    </Box>
  );
}

// ─── Fallback renderer for sources with no documentId ─────────────────────────

function FallbackDocument({ source, zoomPct }: { source: Source; zoomPct: number }) {
  const width = (zoomPct / 100) * PAGE_WIDTH_BASE;
  return (
    <Box
      sx={{
        flexShrink: 0,
        width: `${width}px`,
        minHeight: `${width * 1.3}px`,
        backgroundColor: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "inset 0 0 0 0.68px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.12)",
        p: "32px 40px",
        fontFamily: "Georgia, serif",
      }}
    >
      <Typography sx={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#666", mb: "8px" }}>
        {source.book ?? "Document"}
      </Typography>
      <Typography sx={{ fontSize: "20px", fontWeight: 700, color: "#1a1a2e", lineHeight: "26px", mb: "16px" }}>
        {source.title}
      </Typography>
      <Box sx={{ height: "1px", backgroundColor: "#ddd", mb: "20px" }} />
      <Typography sx={{ fontSize: "13px", color: "#444", lineHeight: "20px" }}>
        Document preview is not available for this source. Open the document in Boards to view its full content.
      </Typography>
    </Box>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export default function CitationPreviewPanel() {
  const { tokens: { semantic: { color } } } = useTheme();
  const { previewSource, previewPage, previewContext, setPreviewPage, closeCitation } = useCitationPreview();
  const location = useLocation();
  const isDirectorRoute = location.pathname.startsWith("/director");

  const [zoomIndex, setZoomIndex] = useState(2); // 100%
  const [copied, setCopied] = useState(false);

  const doc = previewSource?.documentId ? DOCUMENTS[previewSource.documentId] : null;
  const totalPages = doc?.pages.length ?? 1;
  const zoomPct = ZOOM_LEVELS[zoomIndex];
  const currentPage = Math.min(Math.max(1, previewPage), totalPages);
  const currentPageDef = doc ? getDocumentPage(doc.id, currentPage) : null;

  // Reset zoom whenever a new source is opened.
  useEffect(() => {
    if (previewSource) setZoomIndex(2);
  }, [previewSource]);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpen = () => {
    // Resource center documents open in the resource center document viewer.
    if (previewSource?.module === "Resource Center" && previewSource.documentId && isDirectorRoute) {
      const params = new URLSearchParams({ documentPage: String(previewPage) });
      window.open(`/director/resource-center/doc/${previewSource.documentId}?${params.toString()}`, "_blank", "noopener");
      return;
    }
    // Documents outside a book (Decision hub, Data room) open the page they live in.
    if (previewSource?.deepLink && !doc?.bookId) {
      window.open(previewSource.deepLink, "_blank", "noopener");
      return;
    }
    if (!previewSource?.documentId) return;
    const targetDoc = DOCUMENTS[previewSource.documentId];
    if (!targetDoc?.bookId) return;
    const documentId = previewSource.documentId;
    const params = new URLSearchParams({ documentId, documentPage: String(previewPage) });
    if (!isDirectorRoute) params.set("openTab", "review");
    const base = isDirectorRoute ? "/director/books" : "/admin/books";
    // Open in a new tab; router state doesn't cross tabs, so pass it as query params.
    window.open(`${base}/${targetDoc.bookId}?${params.toString()}`, "_blank", "noopener");
  };

  const open = previewSource !== null;

  return (
    <Box
      sx={{
        width: open ? PANEL_WIDTH : 0,
        flexShrink: 0,
        overflow: "hidden",
        transition: "width 0.25s ease",
        borderLeft: open ? `1px solid ${color.ui.divider.default.value}` : "none",
        display: "flex",
        flexDirection: "column",
        backgroundColor: color.surface.default.value,
        height: "100%",
      }}
    >
      {previewSource && (
        <>
          {/* ── Section header ── */}
          <Box
            sx={{
              flexShrink: 0,
              pr: "24px",
              pl: "16px",
              py: "10px",
              borderBottom: `1px solid ${color.ui.divider.default.value}`,
              minWidth: PANEL_WIDTH,
              backgroundColor: color.surface.default.value,
            }}
          >
            <Stack direction="row" alignItems="center" gap="8px">
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 600,
                    lineHeight: "24px",
                    color: color.type.default.value,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {previewSource.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 400,
                    lineHeight: "16px",
                    color: color.type.muted.value,
                    mt: "2px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {[doc?.location ?? doc?.book ?? previewSource.book, currentPageDef?.label ?? `Page ${currentPage}`]
                    .filter(Boolean)
                    .join(" · ")}
                </Typography>
              </Box>

              <Tooltip title={copied ? "Page link copied" : "Copy page link"}>
                <IconButton
                  aria-label="Copy page link"
                  onClick={handleCopy}
                  sx={{ flexShrink: 0 }}
                >
                  {copied ? <CheckedIcon size="md" /> : <LinkIcon size="md" />}
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {/* ── Document body ── */}
          <Box
            sx={{
              flex: 1,
              position: "relative",
              backgroundColor: "transparent",
              overflow: "hidden",
              minWidth: PANEL_WIDTH,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                flex: 1,
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: "24px",
                px: "16px",
                pb: "88px", // space for floating toolbar
              }}
            >
              {doc ? (
                <ImageDocument doc={doc} page={currentPage} zoomPct={zoomPct} />
              ) : (
                <FallbackDocument source={previewSource} zoomPct={zoomPct} />
              )}
            </Box>

            <DocumentViewerToolbar
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPreviewPage}
              zoomIndex={zoomIndex}
              onZoomIndexChange={setZoomIndex}
            />
          </Box>

          {/* ── Footer ── */}
          <Box
            sx={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pt: "12px",
              px: "24px",
              pb: "24px",
              borderTop: `1px solid ${color.ui.divider.default.value}`,
              minWidth: PANEL_WIDTH,
              backgroundColor: color.surface.default.value,
              gap: "8px",
            }}
          >
            <Button
              variant="text"
              size="medium"
              onClick={closeCitation}
              sx={{ fontWeight: 600 }}
            >
              Close
            </Button>

            <Button
              variant="outlined"
              size="medium"
              onClick={handleOpen}
              disabled={!doc?.bookId && !previewSource.deepLink}
              sx={{ fontWeight: 600 }}
            >
              {!doc?.bookId && previewSource.module ? `Open in ${SOURCE_MODULES[previewSource.module].label}` : "Open in Boards"}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
