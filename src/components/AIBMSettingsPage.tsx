import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Divider,
  IconButton,
  Link,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { SectionHeader } from "@diligentcorp/atlas-react-bundle";
import CloseIcon from "@diligentcorp/atlas-react-bundle/icons/Close";
import EditIcon from "@diligentcorp/atlas-react-bundle/icons/Edit";
import TrashIcon from "@diligentcorp/atlas-react-bundle/icons/Trash";

const TABS = ["Profile", "Memory", "Voice & Audio", "Data connectors"] as const;

// ─── Profile data ─────────────────────────────────────────────────────────────

const PLATFORM_AI_INSTRUCTIONS =
  "I sit on the Audit and Risk committees and focus on regulatory compliance. Keep answers brief.";
const MAX_INSTRUCTIONS = 200;

const USER_PROFILE = {
  preferredName: "David",
  businessRole: "Independent board member",
  language: "English (US)",
  timeZone: "Pacific Time (PT)",
  dateFormat: "Independent board member",
};

const COMPANY_PROFILE = {
  organisationName: "Meridian Holdings Ltd.",
  country: "United States",
  organisationSize: "English (US)",
  organisationSizeDetail: "1000-5,000 employees",
  industry: "Financial Services",
  governanceStructure:
    "We have 5 committees (Audit, Risk, Remuneration, Nomination, and ESG). We are transitioning from a dual to a unitary board structure effective Q3 2026. We are a private equity-backed company. The board includes investor directors representing our PE sponsor, with governance arrangements set in the shareholder agreement.",
};

// ─── Memory data ──────────────────────────────────────────────────────────────

const INITIAL_ENTITIES = [
  "User is associated with McDonald's board",
  "User is an independent board member at Meridian Holdings Ltd.",
  "Organisation: Meridian Holdings Ltd., Financial Services sector",
  "User sits on the Audit and Risk committees",
  "PE sponsor: Blackstone Capital Partners, represented by investor directors",
  "CFO: Helen Barker; CEO: Richard Osei",
];

const INITIAL_STATED_FACTS = [
  "User prefers concise answers, ideally under 200 words",
  "Audit Committee meets quarterly; next session scheduled late Q4",
  "Q3 2026 board restructuring: dual to unitary board structure in progress",
  "Risk Committee flagged cybersecurity controls as a high-priority item",
  "ESG reporting framework under review — external consultant approved",
  "KPMG external audit concluded with no material findings",
  "CFO presented revised FY2025 budget projections in October board meeting",
  "Board approved acquisition of TechBridge Ltd pending regulatory clearance",
  "Remuneration Committee approved CEO pay increase subject to shareholder vote",
  "Annual governance review due in January; user to lead Nomination sub-committee",
  "User has asked AIBM to lead responses with key risks and open issues",
  "Investment committee approved £50M capital allocation to infrastructure assets",
  "D&O insurance policy updated following legal counsel review in Q3",
  "Board pack for December meeting published; awaiting user review on Item 6",
];

const INITIAL_DECISIONS = [
  "User decided to abstain on the executive bonus vote pending ESG outcome metrics",
  "Board resolved to delay the rights issue until market conditions improve",
  "Agreed to commission an independent review of Q2 transaction audit trail",
  "Risk Committee escalated cyber incident reporting to full board level",
  "User confirmed support for the unitary board structure transition proposal",
  "Board approved updated D&O insurance policy following legal counsel review",
  "User flagged TechBridge due diligence report for re-review before approval",
  "Nomination Committee deferred succession planning discussion to Q1 2027",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProfileField({ label, value }: { label: string; value: string }) {
  const { tokens: { semantic: { color } } } = useTheme();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }}>
      <Typography sx={{ fontSize: "12px", fontWeight: 600, lineHeight: "16px", letterSpacing: "0.3px", color: color.type.default.value }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: "14px", lineHeight: "20px", letterSpacing: "0.2px", color: color.type.muted.value, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {value}
      </Typography>
    </Box>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: expanded ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 150ms ease", display: "block" }}
    >
      <path d="M8.00017 10.7884L4.23096 7.01921L4.85017 6.39999L8.00017 9.54999L11.1502 6.39999L11.7694 7.01921L8.00017 10.7884Z" fill="#232429"/>
    </svg>
  );
}

function ResizeHandleIcon({ color: c }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M17 13L13 17" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17 10L10 17" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17 16.5L16.5 17" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MemoryCard({
  text,
  onEdit,
  onDelete,
}: {
  text: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { tokens: { semantic: { color, radius } } } = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        border: `1px solid #dee0e9`,
        borderRadius: radius.lg?.value ?? "12px",
        px: "20px",
        py: "16px",
        backgroundColor: color.surface.default.value,
        transition: "background-color 120ms ease",
        "& .memory-actions": { opacity: 0, transition: "opacity 120ms ease" },
        "&:hover": { backgroundColor: "#eeeff5" },
        "&:hover .memory-actions": { opacity: 1 },
      }}
    >
      <Typography
        sx={{
          flex: 1,
          fontSize: "14px",
          lineHeight: "20px",
          color: color.type.default.value,
          minWidth: 0,
        }}
      >
        {text}
      </Typography>
      <Box className="memory-actions" sx={{ display: "flex", gap: "4px", flexShrink: 0 }}>
        <IconButton
          size="small"
          aria-label="Edit"
          onClick={onEdit}
          sx={{ color: color.type.muted.value, p: "4px" }}
        >
          <EditIcon size="sm" />
        </IconButton>
        <IconButton
          size="small"
          aria-label="Delete"
          onClick={onDelete}
          sx={{ color: color.type.muted.value, p: "4px" }}
        >
          <TrashIcon size="sm" />
        </IconButton>
      </Box>
    </Box>
  );
}

function MemorySection({
  title,
  items,
  expanded,
  onToggle,
  onEdit,
  onDelete,
}: {
  title: string;
  items: string[];
  expanded: boolean;
  onToggle: () => void;
  onEdit: (i: number) => void;
  onDelete: (i: number) => void;
}) {
  const { tokens: { semantic: { color } } } = useTheme();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Section header row */}
      <Box
        component="button"
        onClick={onToggle}
        sx={{
          all: "unset",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          cursor: "pointer",
          userSelect: "none",
          color: color.type.default.value,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ChevronIcon expanded={expanded} />
        </Box>
        <Typography sx={{ fontSize: "16px", fontWeight: 600, lineHeight: "24px", color: color.type.default.value }}>
          {title} ({items.length})
        </Typography>
      </Box>

      {/* Cards */}
      {expanded && (
        <Stack gap="10px">
          {items.map((item, i) => (
            <MemoryCard
              key={i}
              text={item}
              onEdit={() => onEdit(i)}
              onDelete={() => onDelete(i)}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface AIBMSettingsPageProps {
  open: boolean;
  onClose: () => void;
  onCancel?: () => void;
  audience?: "admin" | "director";
}

export default function AIBMSettingsPage({ open, onClose, onCancel }: AIBMSettingsPageProps) {
  const { tokens: { semantic: { color, radius } } } = useTheme();

  const [tabValue, setTabValue] = useState(0);

  // Profile tab state
  const [isOverriding, setIsOverriding] = useState(false);
  const [instructionsText, setInstructionsText] = useState(PLATFORM_AI_INSTRUCTIONS);
  const [toastOpen, setToastOpen] = useState(false);

  // Memory tab state
  const [entities, setEntities] = useState(INITIAL_ENTITIES);
  const [statedFacts, setStatedFacts] = useState(INITIAL_STATED_FACTS);
  const [decisions, setDecisions] = useState(INITIAL_DECISIONS);
  const [expanded, setExpanded] = useState({ entities: true, statedFacts: false, decisions: false });

  const isDirty = tabValue === 0 && isOverriding && instructionsText !== PLATFORM_AI_INSTRUCTIONS;

  const handleSave = () => setToastOpen(true);

  const handleCancel = () => {
    setInstructionsText(PLATFORM_AI_INSTRUCTIONS);
    setIsOverriding(false);
    if (onCancel) onCancel();
    else onClose();
  };

  const deleteItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (i: number) => {
    setter((prev) => prev.filter((_, idx) => idx !== i));
  };

  const clearAll = () => {
    setEntities([]);
    setStatedFacts([]);
    setDecisions([]);
  };

  if (!open) return null;

  return (
    <>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* ── Header ── */}
        <Box sx={{ flexShrink: 0, px: "48px", pt: "32px" }}>
          <Box sx={{ width: "100%", maxWidth: "708px", mx: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
            <SectionHeader
              headingLevel="h4"
              title="Preferences"
              sx={{
                "& h4": { fontSize: "18px !important", lineHeight: "28px !important" },
                "& p": { fontSize: "14px !important", lineHeight: "20px !important" },
              }}
              buttonArray={
                <ButtonGroup>
                  <Button size="small" variant="text" color="primary" onClick={handleCancel}>Cancel</Button>
                  <Button size="small" variant="contained" color="primary" onClick={handleSave} disabled={!isDirty}>Save</Button>
                </ButtonGroup>
              }
            />
            <Tabs
              value={tabValue}
              onChange={(_, v) => setTabValue(v)}
              aria-label="Preferences sections"
              sx={{ "&::after": { zIndex: 0 } }}
            >
              {TABS.map((label, i) => (
                <Tab key={label} label={label} id={`prefs-tab-${i}`} aria-controls={`prefs-tabpanel-${i}`} />
              ))}
            </Tabs>
          </Box>
        </Box>

        {/* ── Profile tab ── */}
        {tabValue === 0 && (
          <Box role="tabpanel" id="prefs-tabpanel-0" aria-labelledby="prefs-tab-0"
            sx={{ flex: 1, overflowY: "auto", px: "48px", py: "32px" }}>
            <Box sx={{ width: "100%", maxWidth: "708px", mx: "auto" }}>
              <Stack gap="24px">
                <Box>
                  <Typography sx={{ fontSize: "16px", fontWeight: 600, lineHeight: "24px", color: color.type.default.value }}>
                    User profile
                  </Typography>
                  <Typography component="p" sx={{ fontSize: "14px", lineHeight: "20px", letterSpacing: "0.2px", color: color.type.muted.value, mt: "4px" }}>
                    Help Ask GovernAI to understand you and prioritizes its responses.{" "}
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      You can manage this in your{" "}
                      <Link href="#" underline="always" color="primary" onClick={(e) => e.preventDefault()} sx={{ cursor: "pointer", fontWeight: 600 }}>
                        platform settings
                      </Link>
                      .
                    </Box>
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: "24px" }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}><ProfileField label="Preferred name" value={USER_PROFILE.preferredName} /></Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}><ProfileField label="Business role" value={USER_PROFILE.businessRole} /></Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}><ProfileField label="Language" value={USER_PROFILE.language} /></Box>
                </Box>

                <Box sx={{ display: "flex", gap: "24px" }}>
                  <Box sx={{ width: "220px", flexShrink: 0 }}><ProfileField label="Time zone" value={USER_PROFILE.timeZone} /></Box>
                  <Box sx={{ width: "220px", flexShrink: 0 }}><ProfileField label="Date format" value={USER_PROFILE.dateFormat} /></Box>
                </Box>

                {/* Instructions for AI */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <Box sx={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: "12px", fontWeight: 600, lineHeight: "16px", color: color.type.default.value }}>
                        Instructions for AI
                      </Typography>
                      <Typography sx={{ fontSize: "10px", lineHeight: "12px", color: color.type.muted.value, mt: "2px" }}>
                        Anything the platform AI should know about how you like to work. You can override this instruction here for Ask GovernAI only.
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: "10px", lineHeight: "12px", color: color.type.muted.value, flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>
                      {instructionsText.length}/{MAX_INSTRUCTIONS}
                    </Typography>
                  </Box>
                  <Box sx={{ backgroundColor: isOverriding ? color.surface.default.value : "#edeff1", border: `1px solid ${color.outline.default.value}`, borderRadius: radius.md?.value ?? "8px", pl: "8px", pr: "2px", pt: "8px", pb: "4px" }}>
                    <TextField
                      multiline minRows={3} fullWidth value={instructionsText}
                      onChange={(e) => { if (isOverriding) setInstructionsText(e.target.value); }}
                      inputProps={{ readOnly: !isOverriding, maxLength: MAX_INSTRUCTIONS }}
                      variant="standard"
                      sx={{
                        "& .MuiInput-root": { color: color.type.default.value, "&:before, &:after": { display: "none" } },
                        "& .MuiInputBase-input": { fontSize: "14px !important", lineHeight: "20px", cursor: isOverriding ? "text" : "default", caretColor: isOverriding ? "auto" : "transparent" },
                      }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "flex-end", pr: "2px" }}>
                      <ResizeHandleIcon color={color.type.muted.value} />
                    </Box>
                  </Box>
                  {!isOverriding ? (
                    <Button variant="outlined" size="small" onClick={() => setIsOverriding(true)} sx={{ alignSelf: "flex-start" }}>Override for AIBM</Button>
                  ) : (
                    <Button variant="outlined" size="small" onClick={() => { setInstructionsText(PLATFORM_AI_INSTRUCTIONS); setIsOverriding(false); }} sx={{ alignSelf: "flex-start" }}>Use platform setting</Button>
                  )}
                </Box>

                <Divider sx={{ borderColor: color.ui.divider.default.value }} />

                {/* Company profile */}
                <Box>
                  <Typography sx={{ fontSize: "16px", fontWeight: 600, lineHeight: "24px", color: color.type.default.value }}>Company profile</Typography>
                  <Typography sx={{ fontSize: "14px", lineHeight: "20px", letterSpacing: "0.2px", color: color.type.muted.value, mt: "4px" }}>
                    Help Ask GovernAI to understand your organization when reading your board materials.{" "}
                    <Box component="span" sx={{ fontWeight: 600 }}>This is managed by your admin.</Box>
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: "24px" }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}><ProfileField label="Organisation name" value={COMPANY_PROFILE.organisationName} /></Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}><ProfileField label="Country" value={COMPANY_PROFILE.country} /></Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}><ProfileField label="Organisation size" value={COMPANY_PROFILE.organisationSize} /></Box>
                </Box>

                <Box sx={{ display: "flex", gap: "24px" }}>
                  <Box sx={{ width: "220px", flexShrink: 0 }}><ProfileField label="Organisation size" value={COMPANY_PROFILE.organisationSizeDetail} /></Box>
                  <Box sx={{ width: "220px", flexShrink: 0 }}><ProfileField label="Industry" value={COMPANY_PROFILE.industry} /></Box>
                </Box>

                <Box>
                  <Typography sx={{ fontSize: "12px", fontWeight: 600, lineHeight: "16px", letterSpacing: "0.3px", color: color.type.default.value, mb: "4px" }}>
                    Governance structure
                  </Typography>
                  <Typography sx={{ fontSize: "14px", lineHeight: "20px", letterSpacing: "0.2px", color: color.type.muted.value }}>
                    {COMPANY_PROFILE.governanceStructure}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        )}

        {/* ── Memory tab ── */}
        {tabValue === 1 && (
          <Box role="tabpanel" id="prefs-tabpanel-1" aria-labelledby="prefs-tab-1"
            sx={{ flex: 1, overflowY: "auto", px: "48px", py: "32px" }}>
            <Box sx={{ width: "100%", maxWidth: "708px", mx: "auto" }}>
              <Stack gap="24px">

                {/* Memory section header */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Typography sx={{ flex: 1, fontSize: "14px", lineHeight: "20px", color: color.type.muted.value }}>
                    Durable facts AIBM has learned from your conversations. Edit or remove anything — these are added to relevant future chats.
                  </Typography>
                  <Box sx={{ flexShrink: 0 }}>
                    <Button variant="outlined" size="small" onClick={clearAll}>
                      Clear all
                    </Button>
                  </Box>
                </Box>

                {/* Entities */}
                <MemorySection
                  title="Entities"
                  items={entities}
                  expanded={expanded.entities}
                  onToggle={() => setExpanded((e) => ({ ...e, entities: !e.entities }))}
                  onEdit={() => {}}
                  onDelete={deleteItem(setEntities)}
                />

                {/* Stated facts */}
                <MemorySection
                  title="Stated facts"
                  items={statedFacts}
                  expanded={expanded.statedFacts}
                  onToggle={() => setExpanded((e) => ({ ...e, statedFacts: !e.statedFacts }))}
                  onEdit={() => {}}
                  onDelete={deleteItem(setStatedFacts)}
                />

                {/* Decisions */}
                <MemorySection
                  title="Decisions"
                  items={decisions}
                  expanded={expanded.decisions}
                  onToggle={() => setExpanded((e) => ({ ...e, decisions: !e.decisions }))}
                  onEdit={() => {}}
                  onDelete={deleteItem(setDecisions)}
                />

              </Stack>
            </Box>
          </Box>
        )}

        {/* ── Placeholder tabs (Voice & Audio, Data connectors) ── */}
        {tabValue > 1 && (
          <Box
            role="tabpanel"
            id={`prefs-tabpanel-${tabValue}`}
            aria-labelledby={`prefs-tab-${tabValue}`}
            sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <Typography sx={{ color: color.type.muted.value, fontSize: "14px" }}>
              {TABS[tabValue]}
            </Typography>
          </Box>
        )}

      </Box>

      {/* ── Toast ── */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={5000}
        onClose={(_e, reason) => { if (reason === "clickaway") return; setToastOpen(false); }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ top: "24px !important", right: "24px !important" }}
      >
        <Alert
          severity="success"
          aria-live="polite"
          action={<IconButton size="small" aria-label="Dismiss" onClick={() => setToastOpen(false)}><CloseIcon size="md" /></IconButton>}
          sx={{ border: `1px solid ${color.outline.default.value}`, "&&&&": { boxShadow: "0px 32px 32px rgba(15, 17, 19, 0.10), 0px 0px 2px rgba(15, 17, 19, 0.10)" } }}
        >
          Preferences saved.
        </Alert>
      </Snackbar>
    </>
  );
}
