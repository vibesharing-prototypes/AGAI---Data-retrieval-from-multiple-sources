import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { AiBadge } from "../components/AiDisclaimers.js";
import { BookStateIcon } from "../components/BookStateIcons.js";
import DirectorHomeSearch from "../components/DirectorHomeSearch.js";
import MaxWidthBody from "../components/MaxWidthBody.js";
import SmartAssistOverlay from "../components/SmartAssistOverlay.js";
import SmartAssistSidenav from "../components/SmartAssistSidenav.js";
import { useSmartAssist } from "../context/SmartAssistContext.js";
import { directorHomeBooks } from "../data/mockData.js";
import { Box, Button, Collapse, Stack, Typography, useTheme } from "@mui/material";

import ArrowLeftIcon from "@diligentcorp/atlas-react-bundle/icons/ArrowLeft";
import ArrowRightIcon from "@diligentcorp/atlas-react-bundle/icons/ArrowRight";
import CheckedIcon from "@diligentcorp/atlas-react-bundle/icons/Checked";
import ClipboardCheckIcon from "@diligentcorp/atlas-react-bundle/icons/ClipboardCheck";
import InfoIcon from "@diligentcorp/atlas-react-bundle/icons/Info";
import QuestionnairesIcon from "@diligentcorp/atlas-react-bundle/icons/Questionnaires";

// ─── Typography helper ──────────────────────────────────────────────────────
// Spread an Atlas semantic font token (e.g. tokens.semantic.font.text.md)
// into MUI sx properties. Pass `weight` to override the token's fontWeight
// (e.g. tokens.semantic.fontWeight.emphasis.value for 600).
type FontToken = {
  fontFamily: { value: string };
  fontSize: { value: string };
  fontWeight: { value: number };
  lineHeight: { value: string };
  letterSpacing: { value: string };
};
const textSx = (t: FontToken, weight?: number) => ({
  fontFamily: t.fontFamily.value,
  fontSize: t.fontSize.value,
  fontWeight: weight ?? t.fontWeight.value,
  lineHeight: t.lineHeight.value,
  letterSpacing: t.letterSpacing.value,
});

// ─── Data ────────────────────────────────────────────────────────────────────
// The director Home page shows published books only — `directorHomeBooks`
// (shared with the admin book list) is already filtered to `status:
// "Published"`, so unpublished and archived books never appear here.

const UPCOMING_BOOKS_VISIBLE = 4;

// One shared timeline so the hero, the panel slide, and the content reflow all
// move together as a single cohesive motion (300ms, matching the panel's own
// transition in SmartAssistSidenav). The hero is counter-translated to stay
// horizontally fixed (pure up/down) and fades as it collapses so the brief edge
// clip against the incoming panel is never visible.
const HERO_ANIM_MS = 300;
const HERO_EASE = "cubic-bezier(0.2, 0, 0, 1)";
// Half the docked-panel footprint (DRAWER_WIDTH + 24 = 464px). The centered hero
// would drift left by this much as the column shrinks; translating it right by
// the same amount, on the same timeline, cancels the drift frame-for-frame.
const HERO_COUNTER_SHIFT = 232;

type CompetitorUpdate = {
  title: string;
  source: string;
  date: string;
  description: string;
  /** Optional — Explore tab uses this to align cards with the feed filter chips. */
  company?: "Marriott International" | "Hilton Worldwide Holdings Inc." | "Hyatt Hotels Corporation";
};

const exploreCompetitorUpdates: CompetitorUpdate[] = [
  {
    title: "Marriott finance chief Leeny Oberg to retire next year",
    source: "Market Screener - Latest",
    date: "August 6, 2025",
    description:
      "A key executive shift is underway at Marriott International. Leeny Oberg, the company's Chief Financial Officer since 2016, will retire on March 31, 2026, after navigating Marriott through pivotal periods including the COVID-19 pandemic. Jen Mason, a veteran Marriott executive currently serving as global treasurer and risk management officer, will succeed Oberg as CFO. Additionally, Shawn Hill is slated to",
    company: "Marriott International",
  },
  {
    title: "Marriott raises full-year RevPAR outlook on stronger group demand",
    source: "Reuters - Travel & Leisure",
    date: "August 5, 2025",
    description:
      "Marriott International lifted the upper end of its 2025 revenue-per-available-room growth forecast to 4% after Q2 group bookings outpaced internal forecasts by roughly 9%. Executives flagged a robust pipeline of corporate offsites and association meetings into 2026, and confirmed plans to add more than 100,000 rooms across luxury and select-service brands by year end. The update lifted Marriott shares 3.4% in pre-market trading.",
    company: "Marriott International",
  },
  {
    title: "Hilton beats Q2 earnings as international travel rebounds",
    source: "Bloomberg - Hospitality",
    date: "July 30, 2025",
    description:
      "Hilton Worldwide reported adjusted EPS of $1.91 for Q2, ahead of the $1.85 consensus, helped by an 11% year-on-year jump in EMEA RevPAR. CEO Chris Nassetta highlighted accelerating leisure demand in Southern Europe and the Middle East, and said development signings reached a record 36,500 rooms during the quarter. The company narrowed its full-year RevPAR guidance to a range of 2% to 3.5%.",
    company: "Hilton Worldwide Holdings Inc.",
  },
  {
    title: "Hilton signs largest luxury pipeline in company history with new Waldorf Astoria deals",
    source: "Skift",
    date: "July 22, 2025",
    description:
      "Hilton announced 14 new Waldorf Astoria and Conrad properties in development across Asia-Pacific and the Middle East, taking its luxury pipeline to roughly 600 hotels — its largest ever. The push reflects the chain's bet that high-end demand will outlast any near-term softening in the broader travel market, and follows the recent reopening of the flagship Waldorf Astoria New York after a multi-year renovation.",
    company: "Hilton Worldwide Holdings Inc.",
  },
  {
    title: "Hyatt completes $2.6B acquisition of Standard International, expanding lifestyle portfolio",
    source: "Wall Street Journal",
    date: "August 1, 2025",
    description:
      "Hyatt Hotels Corporation closed its $2.6 billion acquisition of Standard International, adding the Standard, Bunkhouse, and Peri brands to its lifestyle portfolio and bringing its total room count past 365,000. CEO Mark Hoplamazian said the deal more than doubles Hyatt's lifestyle footprint and accelerates its asset-light growth strategy, with management expecting the transaction to be accretive to adjusted EBITDA within 12 months.",
    company: "Hyatt Hotels Corporation",
  },
];

const feedFilters = [
  "All",
  "Marriott International",
  "Hilton Worldwide Holdings Inc.",
  "Hyatt Hotels Corporation",
];


// ─── Review items ("Waiting for your review") ───────────────────────────────

type ReviewItem = { id: string; title: string; published: string; status: string; href?: string };

const REVIEW_TITLE =
  "Global Enterprise Board Governance Coordination, Committee Approval Management, Strategic Decision Lifecycle";

const approvalItems: ReviewItem[] = [0, 1, 2, 3].map((i) => ({
  id: `approval-${i}`,
  title: REVIEW_TITLE,
  published: "06/03/2026",
  status: "In progress",
  href: "/decision-hub/approvals/cyber-investment-2026",
}));
const questionnaireItems: ReviewItem[] = [0, 1, 2, 3].map((i) => ({
  id: `questionnaire-${i}`,
  title: REVIEW_TITLE,
  published: "06/03/2026",
  status: "Not started",
}));
const QUESTIONNAIRE_COUNT = 12;

// ─── HomeSection ─────────────────────────────────────────────────────────────
// Divider + 24px gap + header row (title, optional trailing, action) + body.

function HomeSection({
  title,
  titleAdornment,
  action,
  children,
}: {
  title: string;
  titleAdornment?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const {
    tokens: {
      semantic: { color, font, fontWeight },
    },
  } = useTheme();
  return (
    <Box component="section" sx={{ px: "16px" }}>
      <Box sx={{ height: "1px", backgroundColor: color.ui.divider.default.value, mb: "24px" }} />
      <Stack sx={{ gap: "24px" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ gap: "16px" }}>
          <Stack direction="row" alignItems="center" sx={{ gap: "8px", minWidth: 0 }}>
            <Typography
              component="h2"
              sx={{
                ...textSx(font.title.h4Md, fontWeight.emphasis.value),
                // Pinned so a deploy-time Atlas token shift can't resize it.
                fontSize: "18px",
                color: color.type.default.value,
              }}
            >
              {title}
            </Typography>
            {titleAdornment}
          </Stack>
          {action}
        </Stack>
        {children}
      </Stack>
    </Box>
  );
}

function SectionLink({ label, onClick }: { label: string; onClick?: () => void }) {
  const {
    tokens: {
      semantic: { color, font, fontWeight },
    },
  } = useTheme();
  return (
    <Button
      variant="text"
      onClick={onClick}
      endIcon={<ArrowRightIcon size="md" />}
      sx={{
        ...textSx(font.label.lg, fontWeight.emphasis.value),
        flexShrink: 0,
        color: color.type.default.value,
        textTransform: "none",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Button>
  );
}

// ─── WaitingForReview ────────────────────────────────────────────────────────

function ReviewTab({
  label,
  count,
  selected,
  onClick,
}: {
  label: string;
  count: number;
  selected: boolean;
  onClick: () => void;
}) {
  const {
    tokens: {
      semantic: { color, radius, font, fontWeight },
    },
  } = useTheme();
  return (
    <Box
      component="button"
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      sx={{
        ...textSx(font.label.lg, fontWeight.emphasis.value),
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        height: "32px",
        px: "12px",
        border: "none",
        borderRadius: radius.md.value,
        cursor: "pointer",
        backgroundColor: selected ? color.surface.default.value : "transparent",
        color: selected ? color.action.link.default.value : color.type.default.value,
        "&:focus-visible": { outline: "2px solid #1C4EE4", outlineOffset: "2px" },
      }}
    >
      {label}
      <Box
        component="span"
        sx={{
          ...textSx(font.label.sm, fontWeight.emphasis.value),
          minWidth: "20px",
          height: "20px",
          px: "6px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "999px",
          backgroundColor: selected ? "#1C4EE4" : color.surface.variant.value,
          color: selected ? "#FFFFFF" : color.type.muted.value,
        }}
      >
        {count}
      </Box>
    </Box>
  );
}

function ReviewCard({ item, icon, onClick }: { item: ReviewItem; icon: React.ReactNode; onClick?: () => void }) {
  const {
    tokens: {
      semantic: { color, radius, font, fontWeight },
    },
  } = useTheme();
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        all: "unset",
        boxSizing: "border-box",
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        p: "12px",
        backgroundColor: color.surface.default.value,
        border: `1px solid ${color.ui.divider.default.value}`,
        borderRadius: "12px",
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick ? { backgroundColor: color.action.secondary.hoverFill.value } : undefined,
        "&:focus-visible": { outline: "2px solid #1C4EE4", outlineOffset: "2px" },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          backgroundColor: color.surface.variant.value,
          border: `1px solid ${color.ui.divider.default.value}`,
          borderRadius: radius.md.value,
          color: color.type.default.value,
        }}
      >
        {icon}
      </Box>
      <Stack sx={{ flex: 1, minWidth: 0, gap: "2px" }}>
        <Typography
          noWrap
          sx={{ ...textSx(font.text.md, fontWeight.emphasis.value), fontSize: "12px", color: color.type.default.value }}
        >
          {item.title}
        </Typography>
        <Typography sx={{ ...textSx(font.text.md), fontSize: "12px", color: color.type.muted.value }}>
          Published on: {item.published}
        </Typography>
      </Stack>
      <Box
        component="span"
        sx={{
          ...textSx(font.label.sm, fontWeight.emphasis.value),
          display: "inline-flex",
          alignItems: "center",
          height: "24px",
          px: "8px",
          flexShrink: 0,
          borderRadius: "999px",
          backgroundColor: color.accent.blue.background.value,
          color: color.accent.blue.content.value,
        }}
      >
        {item.status}
      </Box>
    </Box>
  );
}

function WaitingForReview({ onNavigate }: { onNavigate: (to: string) => void }) {
  const [tab, setTab] = useState<"approvals" | "questionnaires">("approvals");
  const {
    tokens: {
      semantic: { color, radius },
    },
  } = useTheme();
  const items = tab === "approvals" ? approvalItems : questionnaireItems;
  return (
    <HomeSection
      title="Waiting for your review"
      titleAdornment={
        <Box component="span" sx={{ display: "inline-flex", color: color.type.default.value }} aria-label="About this list">
          <InfoIcon size="lg" />
        </Box>
      }
      action={<SectionLink label="Go to Decision Hub" onClick={() => onNavigate("/tasks")} />}
    >
      <Stack sx={{ gap: "16px", mt: "-8px" }}>
        <Box
          role="tablist"
          sx={{
            alignSelf: "flex-start",
            display: "inline-flex",
            gap: "8px",
            p: "2px",
            borderRadius: radius.md.value,
            backgroundColor: color.surface.variant.value,
          }}
        >
          <ReviewTab
            label="Approvals"
            count={approvalItems.length}
            selected={tab === "approvals"}
            onClick={() => setTab("approvals")}
          />
          <ReviewTab
            label="Questionnaires"
            count={QUESTIONNAIRE_COUNT}
            selected={tab === "questionnaires"}
            onClick={() => setTab("questionnaires")}
          />
        </Box>
        <Stack sx={{ gap: "8px" }}>
          {items.map((item) => (
            <ReviewCard
              key={item.id}
              item={item}
              icon={tab === "approvals" ? <ClipboardCheckIcon size="lg" /> : <QuestionnairesIcon size="lg" />}
              onClick={item.href ? () => onNavigate(item.href as string) : undefined}
            />
          ))}
        </Stack>
      </Stack>
    </HomeSection>
  );
}

// ─── UpcomingMeetings ────────────────────────────────────────────────────────

const TABLE_COLUMNS = "minmax(240px, 1fr) 120px minmax(160px, 217px)";

function UpcomingMeetings({ onOpenBook, onNavigate }: { onOpenBook: (id: string) => void; onNavigate: (to: string) => void }) {
  const {
    tokens: {
      semantic: { color, radius, font, fontWeight },
    },
  } = useTheme();
  const books = directorHomeBooks.slice(0, UPCOMING_BOOKS_VISIBLE);
  const headerSx = {
    ...textSx(font.label.lg, fontWeight.emphasis.value),
    color: color.type.default.value,
    px: "12px",
  } as const;

  return (
    <HomeSection
      title="Books with upcoming meetings"
      action={<SectionLink label="Go to Books" onClick={() => onNavigate("/director/books")} />}
    >
      <Box sx={{ backgroundColor: color.surface.variant.value, borderRadius: radius.lg.value }}>
        <Box sx={{ display: "grid", gridTemplateColumns: TABLE_COLUMNS, alignItems: "center", height: "40px" }}>
          <Box sx={{ ...headerSx, pl: "64px" }}>Title</Box>
          <Box sx={headerSx}>Meeting date</Box>
          <Box sx={headerSx}>Committee</Box>
        </Box>
        <Box
          sx={{
            backgroundColor: color.surface.default.value,
            border: `1px solid ${color.ui.divider.default.value}`,
            borderRadius: radius.lg.value,
            overflow: "hidden",
          }}
        >
          {books.map((book, i) => (
            <Box
              key={book.id}
              sx={{
                display: "grid",
                gridTemplateColumns: TABLE_COLUMNS,
                alignItems: "center",
                minHeight: "64px",
                borderBottom: i === books.length - 1 ? "none" : `1px solid ${color.ui.divider.default.value}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: "12px", p: "12px", minWidth: 0 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    p: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: color.surface.variant.value,
                    border: `1px solid ${color.ui.divider.default.value}`,
                    borderRadius: radius.md.value,
                    flexShrink: 0,
                  }}
                >
                  <BookStateIcon status={book.status} />
                </Box>
                <Typography
                  component="button"
                  type="button"
                  onClick={() => onOpenBook(book.id)}
                  sx={{
                    ...textSx(font.text.md, fontWeight.emphasis.value),
                    fontSize: "14px",
                    color: color.type.default.value,
                    textAlign: "left",
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                    "&:focus-visible": { outline: "2px solid #1C4EE4", outlineOffset: "2px", borderRadius: "2px" },
                  }}
                >
                  {book.title}
                </Typography>
              </Box>
              <Typography sx={{ ...textSx(font.text.md), fontSize: "14px", color: color.type.muted.value, px: "12px" }}>
                {book.meetingDate}
              </Typography>
              <Stack direction="row" alignItems="center" sx={{ px: "12px", gap: "8px", minWidth: 0 }}>
                <Typography noWrap sx={{ ...textSx(font.text.md), fontSize: "14px", color: color.type.muted.value }}>
                  {book.committees[0]}
                </Typography>
                {book.extraCommittees > 0 && (
                  <Typography sx={{ ...textSx(font.text.md), fontSize: "14px", color: color.type.muted.value, flexShrink: 0 }}>
                    +{book.extraCommittees}
                  </Typography>
                )}
              </Stack>
            </Box>
          ))}
        </Box>
      </Box>
    </HomeSection>
  );
}

// ─── CompetitorUpdates ───────────────────────────────────────────────────────

function CompetitorUpdates({ onReadMore }: { onReadMore: () => void }) {
  const {
    tokens: {
      semantic: { color, font, fontWeight },
    },
  } = useTheme();
  return (
    <HomeSection
      title="Competitor updates"
      titleAdornment={<AiBadge>Curated and summarized by AI</AiBadge>}
      action={<SectionLink label="Read more updates" onClick={onReadMore} />}
    >
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
        {exploreCompetitorUpdates.slice(0, 3).map((update) => (
          <Stack
            key={update.title}
            sx={{
              gap: "12px",
              p: "16px",
              backgroundColor: color.surface.default.value,
              border: `1px solid ${color.ui.divider.default.value}`,
              borderRadius: "12px",
            }}
          >
            <Stack sx={{ gap: "4px" }}>
              <Typography sx={{ ...textSx(font.text.body, fontWeight.emphasis.value), color: color.type.default.value }}>
                {update.title}
              </Typography>
              <Typography sx={{ ...textSx(font.text.sm), color: color.type.muted.value }}>
                {update.source} • {update.date}
              </Typography>
            </Stack>
            <Typography
              sx={{
                ...textSx(font.text.body),
                color: color.type.muted.value,
                display: "-webkit-box",
                WebkitLineClamp: 5,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {update.description}
            </Typography>
          </Stack>
        ))}
      </Box>
    </HomeSection>
  );
}

// ─── ExploreCompetitorCard ───────────────────────────────────────────────────

function ExploreCompetitorCard({ update }: { update: CompetitorUpdate }) {
  const {
    tokens: {
      core: { spacing },
      semantic: { color, radius, font, fontWeight },
    },
  } = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: color.surface.default.value,
        border: `1px solid ${color.ui.divider.default.value}`,
        borderRadius: radius.lg.value,
        p: spacing["3"].value /* 24px */,
        display: "flex",
        flexDirection: "column",
        gap: spacing["1_5"].value /* 12px */,
      }}
    >
      <Stack sx={{ gap: spacing["1"].value /* 8px */ }}>
        {/* Title — styled as a link (underline on hover, focus ring) but the
            click is intentionally a no-op: this prototype doesn't ship article
            detail pages. Keep it focusable so the affordance reads as real. */}
        <Typography
          component="button"
          type="button"
          onClick={(e) => e.preventDefault()}
          sx={{
            ...textSx(font.text.body, fontWeight.emphasis.value),
            color: color.type.default.value,
            display: "inline",
            textAlign: "left",
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
            "&:focus-visible": {
              outline: "2px solid #1C4EE4",
              outlineOffset: "2px",
              borderRadius: "2px",
            },
          }}
        >
          {update.title}
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          sx={{ rowGap: "4px", columnGap: "8px" }}
        >
          <Typography
            sx={{
              ...textSx(font.text.md),
              color: color.type.muted.value,
            }}
          >
            {update.date}
          </Typography>
          <Typography
            sx={{
              ...textSx(font.text.md),
              color: color.type.muted.value,
              textAlign: "right",
            }}
          >
            {update.source}
          </Typography>
        </Stack>
      </Stack>
      <Typography
        sx={{
          ...textSx(font.text.md),
          color: color.type.default.value,
        }}
      >
        {update.description}
      </Typography>
    </Box>
  );
}

// ─── CustomizeYourFeedFilter ─────────────────────────────────────────────────

function CustomizeYourFeedFilter({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (label: string) => void;
}) {
  const {
    tokens: {
      core: { spacing },
      semantic: { color, radius, font, fontWeight },
    },
  } = useTheme();

  return (
    <Box
      sx={{
        borderRadius: radius.lg.value,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        pt: "12px",
        pb: "16px",
        px: "12px",
      }}
    >
      <Stack sx={{ gap: "4px" }}>
        <Typography
          sx={{
            ...textSx(font.text.body, fontWeight.emphasis.value),
            color: color.type.default.value,
          }}
        >
          Customize your feed
        </Typography>
        <Typography
          sx={{
            ...textSx(font.text.sm),
            color: color.type.muted.value,
          }}
        >
          Company filter options are managed by your Boards administrator to ensure accuracy and relevancy. Contact your administrator to update your options.
        </Typography>
      </Stack>

      <Box
        sx={{
          pt: spacing["2"].value /* 16px */,
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {feedFilters.map((label) => {
          const isSelected = label === selected;
          return (
            <Box
              key={label}
              component="button"
              type="button"
              onClick={() => onSelect(label)}
              sx={{
                height: "36px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0,
                px: "8px",
                borderRadius: "9999px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                backgroundColor: isSelected
                  ? color.selection.secondary.default.value
                  : "transparent",
                border: isSelected
                  ? `1px solid ${color.action.secondary.outline.value}`
                  : `1px solid ${color.outline.default.value}`,
                color: color.action.secondary.onSecondary.value,
                "&:focus-visible": {
                  outline: "2px solid #1C4EE4",
                  outlineOffset: "2px",
                },
              }}
            >
              {isSelected && (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: color.action.secondary.onSecondary.value,
                  }}
                >
                  <CheckedIcon size="md" />
                </Box>
              )}
              <Box
                component="span"
                sx={{
                  ...textSx(font.label.lg),
                  px: "8px",
                  color: color.action.secondary.onSecondary.value,
                }}
              >
                {label}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

// ─── DirectorHomePage ────────────────────────────────────────────────────────

export default function DirectorHomePage() {
  // "home" is the Figma home layout; "explore" is the full competitor feed
  // reached through "Read more updates".
  const [view, setView] = useState<"home" | "explore">("home");
  // "All" or one of the company names from feedFilters. Lifted from the filter
  // chips so the Explore card list can react to the selection.
  const [feedFilter, setFeedFilter] = useState<string>("All");
  const visibleExploreUpdates =
    feedFilter === "All"
      ? exploreCompetitorUpdates
      : exploreCompetitorUpdates.filter((u) => u.company === feedFilter);
  const {
    tokens: {
      core: { spacing },
      semantic: { color },
    },
  } = useTheme();
  const navigate = useNavigate();
  const {
    panelOpen,
    overlayOpen,
    closePanel,
    closeOverlay,
    expandToOverlay,
    collapseToPanel,
    demoMode,
  } = useSmartAssist();

  // AGAI integration use cases demo (the director view): stay on the home page. The hero composer drops in the first scripted prompt on click,
  // and sending it opens the full-screen Ask GovernAI view (overlay is the
  // preferred mode, set by expanding then closing it).
  useEffect(() => {
    if (!demoMode) return;
    expandToOverlay();
    closeOverlay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoMode]);

  const openBook = (id: string) => navigate(`/director/books/${id}`, { state: { from: "/director" } });

  return (
    <Box sx={{ display: "flex", height: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minWidth: 0,
          height: "100%",
          // overflowX hidden so the hero's counter-translate can't spawn a
          // transient horizontal scrollbar mid-animation.
          overflowX: "hidden",
          overflowY: "auto",
          background:
            "radial-gradient(125.08% 101.36% at 0% 0%, var(--lens-semantic-color-background-base-gradient-start, #f9f9fc) 30.53%, var(--lens-semantic-color-background-base-gradient-end, #fcfcff) 100%)",
        }}
      >
        <MaxWidthBody sx={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
          {view === "home" ? (
            <Box
              sx={{
                pl: spacing["4"].value /* content/margin = 32 */,
                pr: panelOpen ? "12px" : spacing["4"].value,
                pt: spacing["3"].value /* app-header-to-main = 24 */,
                pb: spacing["4"].value,
                transition: "padding-right 0.3s ease",
              }}
            >
              {/* Hero — Smart Assist composer on the blue AI gradient. Hidden while
                  the Ask GovernAI panel is docked (no chat box, no blue
                  background). One shared 300ms timeline so the hero, panel slide
                  and content reflow read as a single motion. */}
              <Box
                sx={{
                  transition: `transform ${HERO_ANIM_MS}ms ${HERO_EASE}, opacity ${HERO_ANIM_MS}ms ${HERO_EASE}`,
                  willChange: "transform, opacity",
                }}
                style={{
                  transform: panelOpen ? `translateX(${HERO_COUNTER_SHIFT}px)` : "translateX(0px)",
                  opacity: panelOpen ? 0 : 1,
                }}
              >
                <Collapse in={!panelOpen} timeout={HERO_ANIM_MS} easing={HERO_EASE}>
                  <Box
                    sx={{
                      px: spacing["3"].value,
                      py: spacing["5"].value /* 40 */,
                      borderRadius: "24px",
                      backgroundImage:
                        "linear-gradient(180deg, rgba(184, 196, 255, 0.4) 0%, rgba(251, 251, 254, 0) 81.755%), linear-gradient(90deg, #F9F9FC 0%, #F9F9FC 100%)",
                    }}
                  >
                    <DirectorHomeSearch />
                  </Box>
                </Collapse>
              </Box>

              <Stack sx={{ gap: spacing["6"].value /* 48 */, pt: panelOpen ? 0 : spacing["3"].value, px: spacing["3"].value /* 24 + section 16 = Figma inset */ }}>
                <WaitingForReview onNavigate={(to) => navigate(to)} />
                <UpcomingMeetings onOpenBook={openBook} onNavigate={(to) => navigate(to)} />
                <CompetitorUpdates onReadMore={() => setView("explore")} />
              </Stack>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                gap: spacing["3"].value /* content/gutter = 24 */,
                pl: spacing["4"].value,
                pr: panelOpen ? "12px" : spacing["4"].value,
                pt: spacing["3"].value,
                pb: spacing["4"].value,
                alignItems: "flex-start",
                transition: "padding-right 0.3s ease",
              }}
            >
              {/* Left column — fluid */}
              <Stack sx={{ flex: 1, minWidth: 0, gap: spacing["2"].value }}>
                <Box>
                  <Button
                    variant="text"
                    onClick={() => setView("home")}
                    startIcon={<ArrowLeftIcon size="md" />}
                    sx={{ textTransform: "none", color: color.type.default.value }}
                  >
                    Home
                  </Button>
                </Box>
                <Stack sx={{ gap: "4px", px: "12px" }}>
                  <Typography
                    component="h2"
                    sx={{ fontSize: "18px", fontWeight: 600, lineHeight: "28px", color: color.type.default.value }}
                  >
                    Competitor updates
                  </Typography>
                  <AiBadge>Curated and summarized by AI.</AiBadge>
                </Stack>
                <Stack sx={{ gap: "8px", pl: "1px" }}>
                  {visibleExploreUpdates.map((update, i) => (
                    <ExploreCompetitorCard key={i} update={update} />
                  ))}
                </Stack>
              </Stack>

              {/* Right column — adaptive: 343–380px, ~28% of body width. */}
              <Box sx={{ width: "clamp(343px, 28%, 380px)", flexShrink: 0 }}>
                <CustomizeYourFeedFilter selected={feedFilter} onSelect={setFeedFilter} />
              </Box>
            </Box>
          )}
        </MaxWidthBody>
      </Box>

      {/* ── Smart Assist sidenav (panel mode) ── */}
      <SmartAssistSidenav
        open={panelOpen}
        onClose={closePanel}
        onExpand={expandToOverlay}
        variant="persistent"
        audience="director"
      />

      {/* ── Smart Assist overlay (full-screen mode) ── */}
      <SmartAssistOverlay
        open={overlayOpen}
        onClose={closeOverlay}
        onCollapse={collapseToPanel}
        audience="director"
      />
    </Box>
  );
}
