import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import type { ReactNode } from "react";
import type { Cite, RichBlock, Span } from "../data/hybrid-search.constants.js";
import type { Source } from "../data/mockData.js";
import { useCitationPreview, type PreviewContext } from "../context/CitationPreviewContext.js";

// ─── Citation tooltip content ─────────────────────────────────────────────────

export function CitationTooltipContent({ source }: { source: Source }) {
  return (
    <Box sx={{ p: "2px", minWidth: "160px", maxWidth: "240px" }}>
      {source.book && (
        <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#1a1f27", lineHeight: "18px", mb: "2px" }}>
          {source.book}
        </Typography>
      )}
      <Typography sx={{ fontSize: "13px", fontWeight: 400, lineHeight: "18px", color: "#4a4f5a" }}>
        {source.title}{source.page ? `, Page ${source.page}` : ""}
      </Typography>
    </Box>
  );
}

// ─── Parse plain text [N] bracket citations → Span[], cites only after sentences ─

/**
 * Optional sequential chip-number allocator. Pass the same counter across every
 * parseCiteText call in a view (Summary, Smart Prep, Risk Scanner) so each chip
 * gets a unique visible number — even when several chips resolve to the same
 * source document/page.
 */
export type CiteCounter = { n: number };

export function parseCiteText(text: string, counter?: CiteCounter): Span[] {
  const result: Span[] = [];
  const sentenceRe = /([^.!?]*[.!?]+)/g;
  let lastBound = 0;
  let m;

  const processSegment = (seg: string) => {
    const cites: number[] = [];
    const clean = seg.replace(/\s*\[(\d+)\]/g, (_, n) => {
      const num = parseInt(n, 10);
      if (!cites.includes(num)) cites.push(num);
      return "";
    });
    if (clean.length) result.push(clean);
    for (const n of cites) {
      result.push(" ");
      result.push(counter ? { cite: n, label: ++counter.n } : { cite: n });
    }
  };

  while ((m = sentenceRe.exec(text)) !== null) {
    processSegment(m[1]);
    lastBound = m.index + m[0].length;
  }
  if (lastBound < text.length) processSegment(text.slice(lastBound));
  return result;
}

// ─── Inline citation chip ─────────────────────────────────────────────────────

export function CiteBadge({ n, source, id, previewContext }: { n: number; source?: Source; id: string; previewContext?: PreviewContext }) {
  const { tokens: { semantic: { color } } } = useTheme();
  const { openCitation, activeChipId } = useCitationPreview();
  const isActive = activeChipId === id;

  // Figma node 3116:405708 — X Small Filled chip, 16×16, cornerRadius 9999
  const DEFAULT_FILL = color.action.secondary.variant.value;   // #e6e6e6
  const HOVER_FILL   = color.action.secondary.hoverFill.value; // #f3f3f3
  const ACTIVE_FILL  = color.action.secondary.activeFill.value;// pressed
  const BORDER       = color.action.secondary.outline.value;   // #282e37
  const TEXT         = color.action.secondary.onSecondary.value;// #282e37

  // Custom span instead of MUI Chip — Chip's internal styles override height/width sx values
  const chip = (
    <Box
      component="span"
      onClick={source ? () => openCitation(source, id, source.targetPage, previewContext) : undefined}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "16px",
        height: "16px",
        borderRadius: "9999px",
        backgroundColor: isActive ? HOVER_FILL : DEFAULT_FILL,
        boxShadow: isActive ? `inset 0 0 0 1px ${BORDER}` : "none",
        color: TEXT,
        fontSize: "11px",
        fontWeight: 400,
        letterSpacing: "0.4px",
        lineHeight: 1,
        mx: "2px",
        verticalAlign: "middle",
        flexShrink: 0,
        userSelect: "none",
        cursor: source ? "pointer" : "default",
        transition: "background-color 0.1s ease, box-shadow 0.1s ease",
        ...(source && {
          "&:hover": { backgroundColor: HOVER_FILL, boxShadow: `inset 0 0 0 1px ${BORDER}` },
          "&:active": { backgroundColor: ACTIVE_FILL, boxShadow: `inset 0 0 0 1px ${BORDER}` },
        }),
      }}
    >
      {n}
    </Box>
  );

  if (!source) return chip;

  return (
    <Tooltip
      title={<CitationTooltipContent source={source} />}
      placement="top"
      arrow
      enterDelay={800}
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            px: "12px",
            py: "10px",
            "& .MuiTooltip-arrow": { color: "#fff" },
          },
        },
      }}
    >
      {chip}
    </Tooltip>
  );
}

// ─── Span list ────────────────────────────────────────────────────────────────

// The last word before a citation (plus any trailing space). It is kept on one
// line together with the chip, so a chip that doesn't fit never wraps alone onto
// the next line; it takes that word with it.
const TRAILING_WORD = /(\S+\s*)$/;

function Spans({ spans, sources, idPrefix, previewContext }: { spans: Span[]; sources?: Source[]; idPrefix?: string; previewContext?: PreviewContext }) {
  const badge = (i: number) => {
    const span = spans[i] as Cite;
    return (
      <CiteBadge
        key={i}
        n={span.label ?? span.cite}
        source={sources?.find((s) => s.index === span.cite)}
        id={idPrefix ? `${idPrefix}-c${i}` : `badge-${i}`}
        previewContext={previewContext}
      />
    );
  };

  const nodes: ReactNode[] = [];
  for (let i = 0; i < spans.length; i++) {
    const span = spans[i];
    const next = spans[i + 1];
    if (typeof span === "string" && next !== undefined && typeof next !== "string") {
      const m = span.match(TRAILING_WORD);
      if (m && m.index !== undefined) {
        // Text before the glued word wraps normally; the word + the run of
        // adjacent chips (separated only by spaces) stay together.
        if (m.index > 0) nodes.push(<span key={`${i}-head`}>{span.slice(0, m.index)}</span>);
        const group: ReactNode[] = [m[0]];
        let j = i + 1;
        while (j < spans.length) {
          const s = spans[j];
          if (typeof s !== "string") group.push(badge(j));
          else if (s.trim() === "" && spans[j + 1] !== undefined && typeof spans[j + 1] !== "string") group.push(s);
          else break;
          j++;
        }
        nodes.push(<span key={`${i}-glue`} style={{ whiteSpace: "nowrap" }}>{group}</span>);
        i = j - 1;
        continue;
      }
    }
    nodes.push(typeof span === "string" ? <span key={i}>{span}</span> : badge(i));
  }
  return <>{nodes}</>;
}

// ─── Main renderer ────────────────────────────────────────────────────────────

export default function RichAIMessageContent({ blocks, sources, messageId, previewContext, bodyFontSize }: { blocks: RichBlock[]; sources?: Source[]; messageId?: string; previewContext?: PreviewContext; /** Overrides the 13px table text (the AGAI integration use cases demo uses 14px throughout). */ bodyFontSize?: string }) {
  const { tokens: { semantic: { color } } } = useTheme();

  const DIVIDER = color.ui.divider.default.value;
  const TEXT    = color.type.default.value;
  const MUTED   = color.type.muted.value;
  const SURFACE = color.surface.variant.value;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {blocks.map((block, i) => {
        // ── Paragraph ───────────────────────────────────────────────────────
        if (block.type === "p") {
          return (
            <Typography key={i} sx={{ fontSize: "14px", lineHeight: "22px", color: TEXT }}>
              <Spans spans={block.spans} sources={sources} idPrefix={messageId ? `${messageId}-b${i}` : undefined} previewContext={previewContext} />
            </Typography>
          );
        }

        // ── Section header ──────────────────────────────────────────────────
        if (block.type === "h") {
          return (
            <Typography
              key={i}
              sx={{ fontSize: "14px", fontWeight: 700, lineHeight: "20px", color: TEXT, mt: "6px" }}
            >
              {block.text}
            </Typography>
          );
        }

        // ── Bullet list ─────────────────────────────────────────────────────
        if (block.type === "list") {
          return (
            <Box
              key={i}
              component="ul"
              sx={{ m: 0, pl: "20px", display: "flex", flexDirection: "column", gap: "4px" }}
            >
              {block.items.map((item, j) => (
                <Typography key={j} component="li" sx={{ fontSize: "14px", lineHeight: "22px", color: TEXT }}>
                  {typeof item === "string"
                    ? item
                    : <Spans spans={item} sources={sources} idPrefix={messageId ? `${messageId}-b${i}-li${j}` : undefined} previewContext={previewContext} />}
                </Typography>
              ))}
            </Box>
          );
        }

        // ── Table ───────────────────────────────────────────────────────────
        if (block.type === "table") {
          return (
            <TableContainer
              key={i}
              sx={{ border: `1px solid ${DIVIDER}`, borderRadius: "8px", overflowX: "auto", mt: "4px" }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: SURFACE }}>
                    {block.columns.map((col) => (
                      <TableCell
                        key={col}
                        sx={{
                          fontSize: bodyFontSize ?? "13px",
                          fontWeight: 600,
                          color: TEXT,
                          lineHeight: "18px",
                          py: "10px",
                          px: "16px",
                          borderBottom: `1px solid ${DIVIDER}`,
                          whiteSpace: "normal",
                          minWidth: "200px",
                        }}
                      >
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {block.rows.map((row, ri) => (
                    <TableRow key={ri}>
                      {row.map((cell, ci) => (
                        <TableCell
                          key={ci}
                          sx={{
                            fontSize: bodyFontSize ?? "13px",
                            color: block.defaultTextColor ? TEXT : (ci === 0 ? TEXT : MUTED),
                            fontWeight: block.defaultTextColor ? 400 : (ci === 0 ? 500 : 400),
                            lineHeight: "20px",
                            py: "12px",
                            px: "16px",
                            borderBottom: ri === block.rows.length - 1 ? "none" : `1px solid ${DIVIDER}`,
                            verticalAlign: "top",
                            whiteSpace: "normal",
                            minWidth: "200px",
                          }}
                        >
                          <Spans spans={cell} sources={sources} idPrefix={messageId ? `${messageId}-b${i}-r${ri}-c${ci}` : undefined} previewContext={previewContext} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          );
        }

        return null;
      })}
    </Box>
  );
}
