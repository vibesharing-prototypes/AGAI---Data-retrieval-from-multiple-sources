import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Menu,
  MenuItem,
  Popover,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import ConfigureIcon from "@diligentcorp/atlas-react-bundle/icons/Configure";
import CaretDownIcon from "@diligentcorp/atlas-react-bundle/icons/CaretDown";
import CloseIcon from "@diligentcorp/atlas-react-bundle/icons/Close";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Source {
  id: string;
  label: string;
  enabled: boolean;
}

// Explorations branch keeps the original flat three-toggle set (rendered as
// switches). MVP uses the scope-driven set below.
export const INITIAL_SOURCES: Source[] = [
  { id: "current",  label: "Current books",   enabled: true },
  { id: "archived", label: "Archived books",  enabled: true },
  { id: "resource", label: "Resource center", enabled: true },
];

// ─── MVP scope model ────────────────────────────────────────────────────────────
// Scope belongs to the CONVERSATION, not the page, and is a single choice:
//   • This book              → only available inside a book reader
//   • Current & Archived books (global) → everywhere else
// A new chat defaults to where it began (inside a book → that book; otherwise
// global). The first message pins the scope; navigating away never changes it
// silently. The source selector is shown ONLY inside a book; if a book-scoped
// chat is carried outside its book, the scope surfaces as a removable context
// chip in the selector's place (clearing it switches to global).

export type SourceScope = "book" | "document" | "books" | "resource" | "home";

const BOOK_READER_RE = /^\/(?:director\/|admin\/)?books\/[^/]+/; // .../books/:id

/** True when the path is a book reader (admin or director). */
export function isBookReaderPath(pathname: string): boolean {
  return BOOK_READER_RE.test(pathname);
}

/** Derive the source scope from the current route. */
export function sourceScopeForPath(pathname: string): SourceScope {
  if (BOOK_READER_RE.test(pathname)) return "book";
  return "home";
}

/**
 * The default selection for a scope. MVP carries two mutually-exclusive
 * sources: the open book, or all current & archived books. `bookTitle` labels
 * the book source so the dropdown and the carried-over chip name the book.
 */
export function mvpSourcesForScope(scope: SourceScope, bookTitle?: string): Source[] {
  const isBook = scope === "book" || scope === "document";
  return [
    { id: "this-book",        label: bookTitle ?? "This book",     enabled: isBook },
    { id: "current-archived", label: "Current & Archived books",   enabled: !isBook },
  ];
}

// ─── Constants (explorations switch UI) ─────────────────────────────────────────

const TEXT_DEFAULT  = "rgb(36,38,40)";
const ROW_DIVIDER   = "rgba(218,218,218,1)";

// ─── MVP control (scope dropdown inside a book, chip outside) ────────────────────

export interface MvpScopeProps {
  /** Whether the current route is a book reader. */
  inBook: boolean;
  /** Title of the book currently open (for the dropdown's book option). */
  currentBookTitle: string | null;
  /** Title of the book the conversation is scoped to (chip label); null = global. */
  bookScopeTitle: string | null;
  /** Whether the conversation is currently scoped to a book. */
  isBookScope: boolean;
  /** Whether the conversation is scoped to the Resource center. */
  isResourceScope?: boolean;
  onSelectBook: () => void;
  onSelectGlobal: () => void;
  onSelectResource?: () => void;
  /** Whether internet sources are included. */
  internetEnabled?: boolean;
  onToggleInternet?: () => void;
}

const GLOBAL_LABEL = "Current & Archived books";
const RESOURCE_LABEL = "Resource center";

function MvpScopeControl({
  inBook,
  currentBookTitle,
  bookScopeTitle,
  isBookScope,
  isResourceScope = false,
  onSelectBook,
  onSelectGlobal,
  onSelectResource,
  internetEnabled = false,
  onToggleInternet,
}: MvpScopeProps) {
  const { tokens: { semantic: { color, font } } } = useTheme();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  // Outside a book: no source selector. The only affordance is a removable
  // context chip when the conversation is pinned to a book's scope — clearing
  // it switches the conversation to the global scope.
  if (!inBook) {
    if (!bookScopeTitle) return null;
    return (
      <Chip
        label={bookScopeTitle}
        size="small"
        variant="outlined"
        onDelete={onSelectGlobal}
        deleteIcon={<CloseIcon size="md" aria-label="Clear book scope" />}
        sx={{
          height: "28px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: 600,
          color: color.type.default.value,
          borderColor: color.ui.divider.default.value,
          "& .MuiChip-deleteIcon": {
            width: 16,
            height: 16,
            color: color.type.muted.value,
            "&:hover": { color: color.type.default.value },
          },
        }}
      />
    );
  }

  const bookLabel = currentBookTitle ?? "This book";
  const activeScope = isBookScope ? bookLabel : isResourceScope ? RESOURCE_LABEL : GLOBAL_LABEL;

  const options = [
    { key: "book",     label: bookLabel,     selected: isBookScope,     onClick: onSelectBook },
    { key: "global",   label: GLOBAL_LABEL,  selected: !isBookScope && !isResourceScope, onClick: onSelectGlobal },
    { key: "resource", label: RESOURCE_LABEL, selected: isResourceScope, onClick: () => onSelectResource?.() },
  ];

  return (
    <>
      <Button
        type="button"
        variant="text"
        size="small"
        endIcon={<CaretDownIcon size="md" />}
        onClick={(e) => setAnchor(e.currentTarget as HTMLElement)}
        sx={{
          color: color.type.default.value,
          fontWeight: 600,
          "& .MuiButton-endIcon": { color: "inherit" },
        }}
      >
        {activeScope}
      </Button>

      <Menu
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              mb: "6px",
              minWidth: 240,
              borderRadius: "8px",
              border: `1px solid ${color.ui.divider.default.value}`,
              backgroundColor: color.surface.default.value,
              boxShadow: "0 8px 16px rgba(0,0,0,0.1), 0 0 2px rgba(0,0,0,0.1)",
            },
          },
        }}
        MenuListProps={{ sx: { py: "4px" } }}
      >
        <Box sx={{ px: "12px", py: "6px" }}>
          <Typography sx={{ fontSize: "11px", fontWeight: 600, color: color.type.muted.value, textTransform: "uppercase", letterSpacing: "0.6px" }}>
            Search scope
          </Typography>
        </Box>
        {options.map((opt) => (
          <MenuItem
            key={opt.key}
            selected={opt.selected}
            onClick={() => { opt.onClick(); setAnchor(null); }}
            disableRipple
            sx={{
              minHeight: "auto",
              px: "12px",
              py: "8px",
              backgroundColor: opt.selected ? color.selection.secondary.default.value : "transparent",
              "&:hover": { backgroundColor: color.surface.variant.value },
              "&.Mui-selected": { backgroundColor: color.selection.secondary.default.value },
              "&.Mui-selected:hover": { backgroundColor: color.selection.secondary.default.value },
            }}
          >
            <Typography
              sx={{
                fontFamily: font.text.md.fontFamily.value,
                fontSize: font.text.md.fontSize.value,
                lineHeight: font.text.md.lineHeight.value,
                letterSpacing: font.text.md.letterSpacing.value,
                fontWeight: opt.selected ? 600 : 400,
                color: color.type.default.value,
              }}
            >
              {opt.label}
            </Typography>
          </MenuItem>
        ))}
        {onToggleInternet !== undefined && (
          <>
            <Box sx={{ mx: "12px", my: "4px", height: "1px", backgroundColor: color.ui.divider.default.value }} />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: "12px",
                py: "8px",
                cursor: "pointer",
                "&:hover": { backgroundColor: color.surface.variant.value },
              }}
              onClick={(e) => { e.stopPropagation(); onToggleInternet?.(); }}
            >
              <Typography
                sx={{
                  fontFamily: font.text.md.fontFamily.value,
                  fontSize: font.text.md.fontSize.value,
                  lineHeight: font.text.md.lineHeight.value,
                  color: color.type.default.value,
                }}
              >
                Include internet sources
              </Typography>
              <Switch
                size="small"
                checked={internetEnabled}
                onChange={(e) => { e.stopPropagation(); onToggleInternet?.(); }}
                onClick={(e) => e.stopPropagation()}
              />
            </Box>
          </>
        )}
      </Menu>
    </>
  );
}

// ─── Explorations control (original switch UI) ──────────────────────────────────

function SwitchSourcesControl({
  sources,
  onToggle,
  allLabel = "All board materials",
}: {
  sources: Source[];
  onToggle: (id: string) => void;
  allLabel?: string;
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const allEnabled   = sources.every((s) => s.enabled);
  const enabledCount = sources.filter((s) => s.enabled).length;

  return (
    <>
      <Button
        type="button"
        variant="text"
        size="small"
        startIcon={<ConfigureIcon />}
        onClick={(e) => setAnchor(e.currentTarget as HTMLElement)}
      >
        {allEnabled ? allLabel : "Selected sources"}
      </Button>

      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        PaperProps={{
          sx: {
            mb: "6px",
            borderRadius: "8px",
            boxShadow: "0 8px 16px rgba(0,0,0,0.1), 0 0 2px rgba(0,0,0,0.1)",
            width: "316px",
            overflow: "hidden",
            p: 0,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: "12px",
            height: "43px",
            borderBottom: `1px solid ${ROW_DIVIDER}`,
          }}
        >
          <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "rgba(40,46,55,1)" }}>
            Search within
          </Typography>
        </Box>

        {sources.map((source) => {
          const isLastEnabled = source.enabled && enabledCount === 1;
          return (
            <Box
              key={source.id}
              onClick={(e) => {
                e.stopPropagation();
                if (!isLastEnabled) onToggle(source.id);
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                p: "12px",
                gap: "12px",
                cursor: isLastEnabled ? "default" : "pointer",
                "&:hover": { backgroundColor: isLastEnabled ? "transparent" : "rgba(0,0,0,0.03)" },
              }}
            >
              <Switch
                checked={source.enabled}
                disabled={isLastEnabled}
                size="small"
                onChange={(e) => { e.stopPropagation(); onToggle(source.id); }}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  flexShrink: 0,
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "#fff" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "rgba(36,38,40,1)",
                    opacity: 1,
                  },
                  "& .MuiSwitch-track": { backgroundColor: "rgba(36,38,40,0.25)", opacity: 1 },
                  "& .MuiSwitch-switchBase.Mui-disabled": { opacity: 1 },
                  "& .MuiSwitch-switchBase.Mui-disabled + .MuiSwitch-track": {
                    backgroundColor: "rgba(36,38,40,1)",
                    opacity: 0.4,
                  },
                }}
              />
              <Typography
                sx={{
                  fontSize: "14px",
                  color: TEXT_DEFAULT,
                  opacity: isLastEnabled ? 0.4 : 1,
                  userSelect: "none",
                  flex: 1,
                }}
              >
                {source.label}
              </Typography>
            </Box>
          );
        })}
      </Popover>
    </>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SourcesFilterButton(props: {
  sources: Source[];
  onToggle: (id: string) => void;
  /** Label shown when every source is enabled (switch UI fallback). */
  allLabel?: string;
  /** Scope props. Omit to render nothing (e.g. the director home hero). */
  mvp?: MvpScopeProps;
}) {
  return props.mvp ? <MvpScopeControl {...props.mvp} /> : null;
}
