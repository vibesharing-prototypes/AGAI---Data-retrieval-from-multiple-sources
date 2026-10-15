import { useState, type ReactElement } from "react";
import { Box, Chip, Typography, useTheme } from "@mui/material";
import ApprovalIcon from "@diligentcorp/atlas-react-bundle/icons/Approval";
import BookIcon from "@diligentcorp/atlas-react-bundle/icons/Book";
import ClipboardCheckIcon from "@diligentcorp/atlas-react-bundle/icons/ClipboardCheck";
import LockedFileIcon from "@diligentcorp/atlas-react-bundle/icons/LockedFile";
import ResourceCenterIcon from "@diligentcorp/atlas-react-bundle/icons/ResourceCenter";
import type { Source } from "../data/mockData.js";
import { useCitationPreview } from "../context/CitationPreviewContext.js";

const MAX_VISIBLE = 3;
// Module-tagged sources (AGAI integration use cases demo) show four chips before "+ N"
// (Figma "AI content area sources").
const MAX_VISIBLE_MODULE = 4;

// Module chip: leading icon, bold module name, then "/ data" (document, book or task name).
export const SOURCE_MODULES: Record<NonNullable<Source["module"]>, { label: string; Icon: () => ReactElement }> = {
  Books: { label: "Books", Icon: () => <BookIcon size="md" /> },
  "Task Hub": { label: "Tasks", Icon: () => <ClipboardCheckIcon size="md" /> },
  "Decision Hub": { label: "Decision hub", Icon: () => <ApprovalIcon size="md" /> },
  "Data Room": { label: "Data room", Icon: () => <LockedFileIcon size="md" /> },
  "Resource Center": { label: "Resource center", Icon: () => <ResourceCenterIcon size="md" /> },
};

/**
 * Dedupe sources by documentId for chip display.
 * Source chips represent documents (one chip per doc), not individual citations —
 * clicking a chip opens the document at its cover page (page 1).
 * Sources without a documentId remain distinct (fall through by index).
 */
function dedupeByDocument(sources: Source[]): Source[] {
  const seen = new Set<string>();
  const result: Source[] = [];
  for (const s of sources) {
    const key = s.documentId ?? `__no-doc-${s.index}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(s);
  }
  return result;
}

export default function SourcesBlock({ sources, messageId }: { sources: Source[]; messageId: string }) {
  const { tokens: { semantic: { color } } } = useTheme();
  const { openCitation, activeChipId } = useCitationPreview();
  const [expanded, setExpanded] = useState(false);

  const deduped = dedupeByDocument(sources);
  const hasModules = deduped.some((s) => s.module);
  const limit = hasModules ? MAX_VISIBLE_MODULE : MAX_VISIBLE;
  const visible = expanded ? deduped : deduped.slice(0, limit);
  const overflow = deduped.length - limit;

  // MUI's small Chip label inherits a line-height that sits the text slightly
  // above the chip's optical center. Pin it to the chip height so it centers.
  // Module-tagged source chip labels are 12px.
  const chipLabelSx = {
    "& .MuiChip-label": hasModules
      ? // Block label so the "Module / data" spacing is kept and long names truncate.
        { lineHeight: "16px", fontSize: "12px", display: "block", pl: "2px", pr: 0 }
      : { lineHeight: "normal", display: "flex", alignItems: "center" },
  };

  return (
    // Sources sit 16px below the AI output on module-tagged (AGAI integration use cases demo) answers.
    <Box sx={{ mt: hasModules ? "16px" : "8px" }}>
      <Typography
        sx={{
          fontSize: "12px",
          fontWeight: 600,
          lineHeight: "16px",
          color: color.type.muted.value,
          mb: "6px",
        }}
      >
        Sources
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: hasModules ? "8px" : "6px" }}>
        {visible.map((s) => {
          const chipKey = s.documentId ?? `idx-${s.index}`;
          const chipId = `${messageId}-src-${chipKey}`;
          const isActive = activeChipId === chipId;
          // Module-tagged sources with no document (Task Hub requests, Decision Hub
          // approvals) have nothing to preview, so they open the item's page in a new tab.
          const opensDocument = !s.module || Boolean(s.documentId);
          const opensInNewTab = Boolean(s.module) && !s.documentId && Boolean(s.deepLink);
          const mod = s.module ? SOURCE_MODULES[s.module] : null;
          const data = s.chipData ?? s.title;
          return (
            <Chip
              key={chipKey}
              icon={mod ? <mod.Icon /> : undefined}
              label={
                mod ? (
                  <>
                    <Box component="span" sx={{ fontWeight: 600 }}>{mod.label}</Box>
                    {` / ${data}`}
                  </>
                ) : (
                  s.title
                )
              }
              title={mod ? `${mod.label} / ${data}` : undefined}
              size="small"
              variant="outlined"
              clickable={opensDocument || opensInNewTab}
              onClick={
                opensDocument
                  ? () => openCitation(s, chipId, 1)
                  : opensInNewTab && s.deepLink
                    ? () => window.open(s.deepLink, "_blank", "noopener")
                    : undefined
              }
              sx={{
                ...chipLabelSx,
                maxWidth: "100%",
                // Module chips: 4px left / 6px right padding on the chip, 2px before the label.
                ...(mod ? { pl: "4px", pr: "6px", "& .MuiChip-icon": { ml: 0, mr: 0 } } : {}),
                ...(isActive ? {
                  borderColor: color.outline.default.value,
                  backgroundColor: color.action.secondary.active.value,
                  "&:hover": {
                    borderColor: color.outline.default.value,
                    backgroundColor: color.action.secondary.active.value,
                  },
                } : {}),
              }}
            />
          );
        })}
        {overflow > 0 && !expanded && (
          <Chip
            label={`+ ${overflow}`}
            size="small"
            variant="outlined"
            clickable={hasModules}
            onClick={hasModules ? () => setExpanded(true) : undefined}
            sx={chipLabelSx}
          />
        )}
      </Box>
    </Box>
  );
}
