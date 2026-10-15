import { useState } from "react";
import { useNavigate } from "react-router";
import { SectionHeader } from "@diligentcorp/atlas-react-bundle";
import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";

import AiSparkleIcon from "@diligentcorp/atlas-react-bundle/icons/AiSparkle";
import SmartAssistSidenav from "../components/SmartAssistSidenav.js";
import SmartAssistOverlay from "../components/SmartAssistOverlay.js";
import { MVP_DIRECTOR_PROMPTS } from "../components/SuggestionChips.js";
import { useSmartAssist } from "../context/SmartAssistContext.js";
import { AiBadge, AiInaccuracyDisclaimer } from "../components/AiDisclaimers.js";
import CalendarIcon from "@diligentcorp/atlas-react-bundle/icons/Calendar";
import EducationCertificationIcon from "@diligentcorp/atlas-react-bundle/icons/EducationCertification";
import ExpandDownIcon from "@diligentcorp/atlas-react-bundle/icons/ExpandDown";
import FilterIcon from "@diligentcorp/atlas-react-bundle/icons/Filter";
import GroupIcon from "@diligentcorp/atlas-react-bundle/icons/Group";
import MoreIcon from "@diligentcorp/atlas-react-bundle/icons/More";

/** Branded multi-color Diligent "D" icon matching the Figma Smart Assist logo */
function DaiaColorIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="23 20 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M43.1621 35.6875C43.0801 35.8054 42.9953 35.9208 42.9082 36.0361C42.6312 36.4003 42.329 36.7472 42.0059 37.0703C40.5692 38.5069 38.7008 39.5105 36.6074 39.8594L29.0938 32.3447L31.4492 29.9873H31.4512L31.4541 29.9844L43.1621 35.6875Z" fill="#D3222A"/>
      <path d="M43.0889 24.2129C44.2535 25.847 44.9365 27.8452 44.9365 30C44.9365 32.1162 44.2824 34.074 43.1641 35.6875L31.4551 29.9844L43.0889 24.2129Z" fill="#EE312E"/>
      <path d="M36.6074 39.8584C36.0638 39.9507 35.5048 40 34.9355 40H26.7617L27.9551 33.4805L29.0938 32.3447L36.6074 39.8584Z" fill="#AF292E"/>
      <path d="M30.4663 30.0009L27.9998 31.2299L26.7623 33.7007L25.529 31.2299L23.0625 30.0009L25.529 28.7634L26.7623 26.2969L26.7749 26.3179L27.9998 28.7634L30.4663 30.0009Z" fill="#1E1E1E"/>
      <path d="M36.6064 20.1416C39.1025 20.5598 41.2858 21.9042 42.7891 23.8076C42.8941 23.9409 42.9941 24.0745 43.0889 24.2129L31.4551 29.9844H31.4492L29.1074 27.6396L36.6064 20.1416Z" fill="#D3222A"/>
      <path d="M34.9355 20C35.5049 20 36.0617 20.0483 36.6055 20.1406L29.1064 27.6396L27.9443 26.4775L26.7617 20H34.9355Z" fill="#AF292E"/>
      <path d="M32.7223 29.9996L27.6152 24.8926V26.5949L30.5943 29.9996L27.6152 32.9787V35.1066L32.7223 29.9996Z" fill="#F8F8FA"/>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const books = [
  { title: "Innovation in Performance Wear: Product Roadmap Review", date: "Sept 19, 2025", committee: "Audit Committee", members: "+2", updates: 44 },
  { title: "Cutting-Edge Athletic Gear: Product Planning Review", date: "Sept 19, 2025", committee: "Audit Committee", members: "+2", updates: 0 },
  { title: "Future of Performance Apparel: Product Strategy Insights", date: "Sept 19, 2025", committee: "Audit Committee", members: "+2", updates: 13 },
  { title: "Advanced Sportswear: Product Development Blueprint", date: "Sept 19, 2025", committee: "Audit Committee", members: "+2", updates: 36 },
  { title: "Revolutionizing Performance Clothing: Product Roadmap Overview", date: "Sept 19, 2025", committee: "Audit Committee", members: "+2", updates: 42 },
  { title: "Next-Gen Activewear: Strategic Development Overview", date: "Sept 19, 2025", committee: "Audit Committee", members: "+2", updates: 42 },
];


const competitorUpdates = [
  { title: "Computershare Posts Higher Fiscal 2025 Management Earnings, Lower Revenue", source: "Market Screener - Latest", date: "Aug 13, 2025", description: "Computershare Limited reported an increase in management earnings for fiscal year 2025, despite experiencing a decrease in revenue." },
  { title: "Computershare Posts Higher Fiscal 2025 Management Earnings, Lower Revenue", source: "Market Screener - Latest", date: "Aug 13, 2025", description: "Computershare Limited reported an increase in management earnings for fiscal year 2025, despite experiencing a decrease in revenue." },
];

const educationItems = [
  { title: "AI Ethics & Board Oversight", type: "Certification", tag: "Latest", description: "Our most popular course among modern directors helps board members like you navigate this new world of AI." },
  { title: "AI Ethics & Board Oversight", type: "Course", tag: "", description: "Our most popular course among modern directors helps board members like you navigate this new world of AI." },
];

// ---------------------------------------------------------------------------
// BookCard
// ---------------------------------------------------------------------------

function BookCard({ book }: { book: (typeof books)[0] & { onClick?: () => void } }) {
  const { tokens: { core: { spacing }, semantic: { color, radius } } } = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: color.surface.variant.value,
        borderRadius: radius.lg.value,
        p: "4px",
      }}
    >
      {/* Main card row */}
      <Box
        onClick={book.onClick}
        sx={{
          backgroundColor: color.surface.default.value,
          border: `1px solid ${color.ui.divider.default.value}`,
          borderRadius: radius.lg.value,
          px: spacing["2"].value,
          py: spacing["1_5"].value,
          display: "flex",
          alignItems: "center",
          gap: spacing["1_5"].value,
          cursor: book.onClick ? "pointer" : "default",
          "&:hover": book.onClick ? { backgroundColor: color.surface.variant.value } : {},
        }}
      >
        <Stack sx={{ flex: 1, gap: spacing["1"].value, overflow: "hidden" }}>
          <Typography
            variant="body1"
            sx={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {book.title}
          </Typography>
          <Stack direction="row" alignItems="center" gap={spacing["1"].value} flexWrap="wrap">
            <Stack direction="row" alignItems="center" gap="4px">
              <CalendarIcon size="md" />
              <Typography variant="textMd">{book.date}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap="4px">
              <GroupIcon size="md" />
              <Typography variant="textMd">{book.committee}</Typography>
            </Stack>
            <Typography variant="textMd" sx={{ fontWeight: 600 }}>{book.members}</Typography>
          </Stack>
        </Stack>
        <IconButton aria-label="More options" size="small">
          <MoreIcon />
        </IconButton>
      </Box>

      {/* Smart Summary + Updates row */}
      <Stack
        direction="row"
        alignItems="center"
        gap={spacing["1_5"].value}
        sx={{ px: spacing["1_5"].value, py: "4px" }}
      >
        <Button variant="text" color="ai" size="small" startIcon={<AiSparkleIcon />}>
          Smart Summary
        </Button>
        {book.updates > 0 && (
          <Stack direction="row" alignItems="center" gap={spacing["1"].value}>
            <Typography variant="body1">Updates</Typography>
            <Chip label={book.updates} size="small" variant="outlined" />
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// SmartAssistPanel
// ---------------------------------------------------------------------------

function SmartAssistPanel({
  onOpenAssistant,
  onSelectTemplate,
}: {
  onOpenAssistant: () => void;
  onSelectTemplate: (prompt: string) => void;
}) {
  const { tokens: { semantic: { color, radius } } } = useTheme();

  // Figma tokens: accent/blue/background=#e4f3ff, accent/blue/content=#004c6c
  const chipBg = color.accent.blue.background.value;
  const chipText = "#004c6c"; // Figma value for accent/blue/content

  return (
    <Stack sx={{ gap: "12px" /* spacing/between-cards */, width: 340, flexShrink: 0, pt: "12px" /* spacing/1_5 — Figma: right column top offset */ }}>
      {/* ---- Smart Assist Card ---- */}
      <Box
        sx={{
          backgroundColor: color.surface.default.value,
          border: `1px solid ${color.ui.divider.default.value}`,
          borderRadius: "24px" /* component/card/xl/radius */,
          overflow: "hidden",
        }}
      >
        {/* Header: Daia icon + Smart Assist label — with gradient border */}
        <Box
          sx={{
            position: "relative",
            pt: "12px" /* spacing/1_5 */,
            pb: "6px",
            px: "16px" /* spacing/2 */,
            borderWidth: "1px",
            borderStyle: "solid",
            borderImage: "linear-gradient(90deg, #BE0C1E 0%, #AB48DA 50%, #4069FE 100%) 1",
            borderLeft: "none",
            borderRight: "none",
            borderTop: "none",
            overflow: "visible",
          }}
        >
          <Stack direction="row" alignItems="center" gap="8px" /* spacing/1 */>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: radius.lg.value /* 12px */,
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DaiaColorIcon size={22} />
            </Box>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#242628",
                letterSpacing: "0.3px",
                lineHeight: "16px",
              }}
            >
              Ask GovernAI
            </Typography>
          </Stack>
        </Box>

        {/* Scrollable content area */}
        <Box sx={{ pt: "16px", px: "16px" /* spacing/2 */ }}>
          <Stack gap="12px" /* spacing/between-cards */>
            {/* Response text */}
            <Stack gap="8px" /* spacing/1 */ sx={{ px: "8px" /* spacing/1 */ }}>
              <Typography
                sx={{
                  fontSize: "16px" /* text/md */,
                  fontWeight: 600,
                  color: color.type.default.value,
                  lineHeight: "24px",
                  letterSpacing: "0.2px",
                }}
              >
                What would you like to know?
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px" /* text/md */,
                  fontWeight: 400,
                  color: color.type.muted.value,
                  lineHeight: "20px",
                  letterSpacing: "0.2px",
                }}
              >
                Select a prompt to get started, or ask your own question.
              </Typography>
            </Stack>

            {/* Prompt template list items */}
            <Stack sx={{ gap: 0 }}>
              {MVP_DIRECTOR_PROMPTS.map((t, i) => (
                <Box
                  key={t.label}
                  component=”button”
                  onClick={() => onSelectTemplate(t.prompt)}
                  sx={{
                    all: “unset”,
                    boxSizing: “border-box”,
                    cursor: “pointer”,
                    display: “flex”,
                    alignItems: “center”,
                    gap: “8px” /* spacing/1 */,
                    px: “8px” /* spacing/1 */,
                    py: “12px” /* spacing/1_5 */,
                    borderRadius: “12px” /* component/card/md/radius */,
                    width: “100%”,
                    position: “relative”,
                    “&:hover”: { backgroundColor: color.surface.variant.value },
                  }}
                >
                  <Stack gap=”12px” /* spacing/1_5 */ sx={{ flex: 1 }}>
                    {/* Accent pill chip with icon */}
                    <Box>
                      <Box
                        sx={{
                          display: “inline-flex”,
                          alignItems: “center”,
                          gap: “6px”,
                          height: “24px”,
                          px: “10px”,
                          py: “2px” /* spacing/0_25 */,
                          borderRadius: “9999px” /* radius/full */,
                          backgroundColor: chipBg,
                          color: chipText,
                        }}
                      >
                        <Box sx={{ display: “flex”, fontSize: “14px”, color: “inherit” }}>
                          <t.Icon />
                        </Box>
                        <Typography
                          sx={{
                            fontSize: “12px”,
                            fontWeight: 600,
                            color: “inherit”,
                            lineHeight: “16px”,
                            letterSpacing: “0.3px”,
                            whiteSpace: “nowrap”,
                            wordWrap: “break-word”,
                          }}
                        >
                          {t.label}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: “12px”,
                        fontWeight: 400,
                        color: color.type.muted.value,
                        lineHeight: “16px”,
                        letterSpacing: “0.3px”,
                        wordWrap: “break-word”,
                      }}
                    >
                      {`”${t.prompt}”`}
                    </Typography>
                  </Stack>
                  {/* Divider */}
                  {i < MVP_DIRECTOR_PROMPTS.length - 1 && (
                    <Box
                      sx={{
                        position: “absolute”,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: “1px”,
                        backgroundColor: color.ui.divider.default.value,
                      }}
                    />
                  )}
                </Box>
              ))}
            </Stack>
          </Stack>
        </Box>

        {/* Footer with button */}
        <Box sx={{ px: "24px" /* component/card/xl/padding */, py: "16px" }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={onOpenAssistant}
            sx={{ borderRadius: "8px" /* radius/md */, borderColor: "#282e37", color: "#282e37" }}
          >
            Open Ask GovernAI
          </Button>
        </Box>
      </Box>

      {/* ---- Competitor Updates ---- */}
      <Box sx={{ borderRadius: "12px" /* corner-radius/wip-card-medium */, overflow: "hidden" }}>
        {/* Section header */}
        <Box sx={{ px: "12px" /* wip-card-small-padding */, pt: "12px" }}>
          <Stack
            direction="row"
            alignItems="center"
            gap="12px" /* spacing/1_5 */
            sx={{ borderBottom: `1px solid ${color.ui.divider.default.value}`, pb: "8px" /* spacing/1 */ }}
          >
            <ExpandDownIcon size="lg" />
            <Stack sx={{ flex: 1, gap: 0 }}>
              <Typography
                sx={{ fontSize: "14px", fontWeight: 600, color: color.type.default.value, lineHeight: "20px", letterSpacing: "0.2px" }}
              >
                Competitor updates
              </Typography>
              <AiBadge>Curated and summarised by AI</AiBadge>
            </Stack>
          </Stack>
        </Box>

        {/* Update items */}
        <Stack sx={{ px: "12px", py: "8px", gap: "12px" }}>
          {competitorUpdates.map((update, i) => (
            <Stack
              key={i}
              gap="4px"
              sx={{ borderLeft: `2px solid ${color.ui.divider.default.value}`, pl: "12px" }}
            >
              <Typography sx={{ fontSize: "14px", fontWeight: 600, color: color.type.default.value, lineHeight: "20px" }}>
                {update.title}
              </Typography>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: "10px", color: color.type.muted.value, lineHeight: "12px" }}>{update.source}</Typography>
                <Typography sx={{ fontSize: "10px", color: color.type.muted.value, lineHeight: "12px" }}>{update.date}</Typography>
              </Stack>
              <Typography sx={{ fontSize: "10px", color: color.type.muted.value, lineHeight: "12px" }}>{update.description}</Typography>
            </Stack>
          ))}
        </Stack>

        {/* Read more updates */}
        <Typography
          sx={{ fontSize: "14px", fontWeight: 600, textAlign: "center", cursor: "pointer", py: "8px", color: color.type.default.value }}
        >
          Read more updates
        </Typography>
      </Box>

      {/* ---- AI Disclaimer ---- */}
      <AiInaccuracyDisclaimer />

      {/* ---- Education and templates ---- */}
      <Box sx={{ borderRadius: "12px", overflow: "hidden" }}>
        {/* Section header */}
        <Box sx={{ px: "12px", pt: "12px" }}>
          <Stack
            direction="row"
            alignItems="center"
            gap="12px"
            sx={{ borderBottom: `1px solid ${color.ui.divider.default.value}`, pb: "8px" }}
          >
            <ExpandDownIcon size="lg" />
            <Stack sx={{ flex: 1, gap: 0 }}>
              <Typography
                sx={{ fontSize: "14px", fontWeight: 600, color: color.type.default.value, lineHeight: "20px", letterSpacing: "0.2px" }}
              >
                Education and templates
              </Typography>
              <Typography sx={{ fontSize: "11px", color: color.type.muted.value, lineHeight: "16px", letterSpacing: "0.4px" }}>
                Curriculum provided by Diligent
              </Typography>
            </Stack>
            <EducationCertificationIcon size="lg" />
          </Stack>
        </Box>

        {/* Education items */}
        <Stack sx={{ px: "12px", py: "8px", gap: "12px" }}>
          {educationItems.map((item, i) => (
            <Stack key={i} gap="4px">
              <Typography sx={{ fontSize: "14px", fontWeight: 600, color: color.type.default.value, lineHeight: "20px" }}>
                {item.title}
              </Typography>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: "10px", color: color.type.muted.value, lineHeight: "12px" }}>{item.type}</Typography>
                {item.tag && (
                  <Typography sx={{ fontSize: "10px", color: color.type.muted.value, lineHeight: "12px" }}>{item.tag}</Typography>
                )}
              </Stack>
              <Typography sx={{ fontSize: "10px", color: color.type.muted.value, lineHeight: "12px" }}>
                {item.description}
              </Typography>
            </Stack>
          ))}
        </Stack>

        {/* Browse more */}
        <Typography
          sx={{ fontSize: "14px", fontWeight: 600, textAlign: "center", cursor: "pointer", py: "8px", color: color.type.default.value }}
        >
          Browse more
        </Typography>
      </Box>
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// IndexPage
// ---------------------------------------------------------------------------

export default function IndexPage() {
  const [tabValue, setTabValue] = useState(0);
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const { tokens: { core: { spacing } }, presets: { TabsPresets } } = useTheme();
  const navigate = useNavigate();
  const { setPrompt, requestComposerFocus } = useSmartAssist();

  const handleOpenAssistant = () => setSidenavOpen(true);
  // Selecting a prompt template drops it into the composer, opens the panel,
  // and focuses the input (requestComposerFocus is consumed once the panel's
  // composer mounts) so the chatbox lands active and ready to send.
  const handleSelectTemplate = (prompt: string) => {
    setPrompt(prompt);
    requestComposerFocus();
    setSidenavOpen(true);
  };
  const handleExpand = () => { setSidenavOpen(false); setOverlayOpen(true); };
  const handleCollapseOverlay = () => { setOverlayOpen(false); setSidenavOpen(true); };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: "radial-gradient(125.08% 101.36% at 0% 0%, var(--lens-semantic-color-background-base-gradient-start, #f9f9fc) 30.53%, var(--lens-semantic-color-background-base-gradient-end, #fcfcff) 100%)" }}>
      <Tabs
        value={tabValue}
        onChange={(_, v) => setTabValue(v)}
        {...TabsPresets.Tabs.alignToPageHeader}
        sx={{
          ml: "32px" /* content/margin */,
          mt: "12px" /* spacing/1_5 */,
          minHeight: "40px",
          "& .MuiTab-root": {
            minHeight: "40px",
            height: "40px",
            px: "20px" /* spacing/2_5 */,
            pt: "8px",
            pb: "8px",
          },
        }}
      >
        <Tab label="Overview" id="tab-overview" aria-controls="tabpanel-overview" />
        <Tab label="Explore" id="tab-explore" aria-controls="tabpanel-explore" />
      </Tabs>

      <div role="tabpanel" hidden={tabValue !== 0} id="tabpanel-overview" aria-labelledby="tab-overview" style={{ overflow: "hidden" }}>
        {tabValue === 0 && (
          <Box
            sx={{
              display: "flex",
              gap: spacing["3"].value,
              p: spacing["3"].value,
              alignItems: "flex-start",
            }}
          >
            {/* Main content */}
            <Stack sx={{ flex: 1, gap: spacing["1"].value, minWidth: 0 }}>
              <SectionHeader
                title="Books"
                subtitle="Board materials, ordered by meeting date."
                buttonArray={
                  <ButtonGroup>
                    <Button variant="text" startIcon={<FilterIcon />}>Filter</Button>
                  </ButtonGroup>
                }
              />
              <Stack gap={spacing["1"].value}>
                {books.map((book, i) => (
                  <BookCard key={i} book={{ ...book, onClick: () => navigate(`/books/${i + 1}`) }} />
                ))}
              </Stack>
            </Stack>

            {/* Right panel */}
            <SmartAssistPanel onOpenAssistant={handleOpenAssistant} onSelectTemplate={handleSelectTemplate} />
          </Box>
        )}
      </div>

      <div role="tabpanel" hidden={tabValue !== 1} id="tabpanel-explore" aria-labelledby="tab-explore">
        {tabValue === 1 && (
          <Box sx={{ p: spacing["3"].value }}>
            <Typography variant="h3">Explore content</Typography>
          </Box>
        )}
      </div>

      <SmartAssistSidenav
        open={sidenavOpen}
        onClose={() => setSidenavOpen(false)}
        onExpand={handleExpand}
        variant="temporary"
      />
      <SmartAssistOverlay
        open={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        onCollapse={handleCollapseOverlay}
      />
    </Box>
  );
}
