import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  FormControl,
  InputLabel,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import CloseIcon from "@diligentcorp/atlas-react-bundle/icons/Close";
import ExpandRightIcon from "@diligentcorp/atlas-react-bundle/icons/ExpandRight";
import ExpandDownIcon from "@diligentcorp/atlas-react-bundle/icons/ExpandDown";

function AddSvgIcon({ width = 16, height = 16 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.45964 10.5417H5.41797V9.45842H9.45964V5.41675H10.5429V9.45842H14.5846V10.5417H10.5429V14.5834H9.45964V10.5417Z" fill="currentColor"/>
    </svg>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const CHIP_PAGE_SIZE = 5;
export const CHAR_LIMIT = 200;

export const ROLES_ADMIN = [
  "Corporate Secretary",
  "Board Administrator",
  "Governance Manager",
  "Paralegal",
  "Executive Assistant",
];

export const ROLES_DIRECTOR = [
  "Non-executive director",
  "Independent director",
  "Committee chair",
  "Board chair",
  "CEO",
  "CFO",
  "COO",
];

export const LANGUAGES = [
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "en-AU", label: "English (Australian)" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "es", label: "Spanish" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "nl", label: "Dutch" },
  { value: "ja", label: "Japanese" },
  { value: "ar", label: "Arabic" },
  { value: "he", label: "Hebrew" },
];

// ─── About-you chips ──────────────────────────────────────────────────────────

export const ABOUT_CHIPS = [
  // Director focus-area chips (shared pool, keyed by committee/topic)
  { id: "d-audit", label: "Audit Committee", text: "I sit on the Audit Committee and focus on controls, reporting, and oversight." },
  { id: "d-risk", label: "Risk Committee", text: "I focus on enterprise risk, emerging risks, and mitigation." },
  { id: "d-remuneration", label: "Remuneration Committee", text: "I focus on executive pay, incentives, and remuneration policy." },
  { id: "d-nomination", label: "Nomination Committee", text: "I focus on board composition, succession, and governance." },
  { id: "d-cyber", label: "Cybersecurity oversight", text: "I pay close attention to cybersecurity oversight and material technology risk." },
  { id: "d-esg", label: "ESG reporting", text: "I focus on ESG reporting, disclosures, and long-term oversight." },
  // Role-variant overrides used in per-role orderings (same topic, different framing)
  { id: "d-audit-ind", label: "Audit Committee", text: "I sit on the Audit Committee and focus on financial oversight and controls." },
  { id: "d-audit-chair", label: "Audit Committee", text: "I chair the Audit Committee and focus on reporting, controls, and audit matters." },
  { id: "d-audit-cfo", label: "Audit Committee", text: "I focus on financial reporting, controls, and audit-related matters." },
  { id: "d-audit-coo", label: "Audit Committee", text: "I focus on controls, process gaps, and execution risk." },
  { id: "d-risk-ind", label: "Risk Committee", text: "I focus on major risks, controls, and regulatory exposure." },
  { id: "d-risk-chair", label: "Risk Committee", text: "I chair the Risk Committee and focus on major exposures and mitigation." },
  { id: "d-risk-board-chair", label: "Risk Committee", text: "I focus on major board-level risks and cross-committee implications." },
  { id: "d-risk-ceo", label: "Risk Committee", text: "I focus on enterprise risk, strategic exposure, and business impact." },
  { id: "d-risk-cfo", label: "Risk Committee", text: "I focus on financial risk, controls, and material exposures." },
  { id: "d-risk-coo", label: "Risk Committee", text: "I focus on operational risk, resilience, and execution gaps." },
  { id: "d-risk-advisory", label: "Risk Committee", text: "I focus on major risks and how they affect strategic choices." },
  { id: "d-remuneration-chair", label: "Remuneration Committee", text: "I chair the Remuneration Committee and focus on executive pay and incentives." },
  { id: "d-nomination-ind", label: "Nomination Committee", text: "I focus on board composition, succession, and governance." },
  { id: "d-nomination-chair", label: "Nomination Committee", text: "I chair the Nomination Committee and focus on succession and board composition." },
  { id: "d-nomination-board-chair", label: "Nomination Committee", text: "I focus on board composition, succession, and leadership continuity." },
  { id: "d-nomination-ceo", label: "Nomination Committee", text: "I focus on leadership succession and governance implications." },
  { id: "d-nomination-advisory", label: "Nomination Committee", text: "I focus on governance quality, succession, and board effectiveness." },
  { id: "d-cyber-board-chair", label: "Cybersecurity oversight", text: "I focus on cyber risk, resilience, and governance preparedness." },
  { id: "d-cyber-ceo", label: "Cybersecurity oversight", text: "I focus on cybersecurity risk, resilience, and leadership implications." },
  { id: "d-cyber-cfo", label: "Cybersecurity oversight", text: "I focus on cyber risk with financial, control, or disclosure implications." },
  { id: "d-cyber-coo", label: "Cybersecurity oversight", text: "I focus on cybersecurity preparedness, incident risk, and operational resilience." },
  { id: "d-cyber-advisory", label: "Cybersecurity oversight", text: "I focus on cybersecurity, resilience, and strategic technology risk." },
  { id: "d-esg-ind", label: "ESG reporting", text: "I focus on governance, disclosure quality, and long-term risk." },
  { id: "d-esg-board-chair", label: "ESG reporting", text: "I focus on material ESG issues and board-level oversight." },
  { id: "d-esg-ceo", label: "ESG reporting", text: "I focus on ESG reporting that could affect strategy, reputation, or stakeholders." },
  { id: "d-esg-cfo", label: "ESG reporting", text: "I focus on ESG disclosures that affect reporting, investor expectations, or risk." },
  { id: "d-esg-coo", label: "ESG reporting", text: "I focus on operational implications of ESG commitments and reporting." },
  { id: "d-esg-advisory", label: "ESG reporting", text: "I focus on ESG reporting, stakeholder expectations, and long-term themes." },
  // Corporate Secretary chips
  { id: "cs-agenda", label: "Agenda management", text: "I focus on agenda management and board meeting coordination." },
  { id: "cs-approvals", label: "Approvals and signatures", text: "I manage approvals, signatures, and resolution workflows." },
  { id: "cs-minutes", label: "Minutes and resolutions", text: "I'm responsible for minutes, resolutions, and decision records." },
  { id: "cs-audit-trail", label: "Audit trail", text: "I need strong audit trails and evidence for governance activity." },
  { id: "cs-cross-committee", label: "Cross-committee planning", text: "I coordinate work across multiple boards and committees." },
  // Board Administrator chips
  { id: "ba-board-book", label: "Board book management", text: "I manage board books, materials, and publishing workflows." },
  { id: "ba-publishing", label: "Publishing readiness", text: "I focus on publishing readiness and final quality checks." },
  { id: "ba-deadline-tracking", label: "Deadline tracking", text: "I track publishing deadlines, submission windows, and board calendar milestones." },
  { id: "ba-notifications", label: "Notifications", text: "I coordinate notifications and board pack distribution." },
  { id: "ba-historical", label: "Historical search", text: "I often need to find past materials and prior decisions quickly." },
  // Governance Manager chips
  { id: "gm-operations", label: "Governance operations", text: "I focus on governance operations across boards and committees." },
  { id: "gm-policy", label: "Policy and procedure", text: "I manage governance policies, procedures, and process consistency." },
  { id: "gm-committee", label: "Committee structure", text: "I work on committee structure, roles, and governance setup." },
  { id: "gm-compliance", label: "Compliance planning", text: "I track compliance-sensitive deadlines and governance obligations." },
  { id: "gm-reporting", label: "Governance reporting", text: "I prepare governance reports, registers, and compliance summaries." },
  // Paralegal chips
  { id: "pl-resolution", label: "Resolution support", text: "I support resolutions, approvals, and governance records." },
  { id: "pl-doc-history", label: "Document history", text: "I often need document history, prior versions, and supporting evidence." },
  { id: "pl-records", label: "Record keeping", text: "I focus on accurate records, archives, and traceability." },
  { id: "pl-verification", label: "Verification", text: "I need to verify details against source documents." },
  { id: "pl-statutory", label: "Statutory filings", text: "I assist with statutory filings, lodgements, and regulatory submissions." },
  // Executive Assistant chips
  { id: "ea-logistics", label: "Meeting logistics", text: "I support meeting logistics and coordination." },
  { id: "ea-reminders", label: "Reminders and follow-up", text: "I handle reminders, follow-up, and deadline tracking." },
  { id: "ea-director-support", label: "Director support", text: "I support directors and executives with board-related tasks." },
  { id: "ea-status", label: "Quick status checks", text: "I need quick status checks on what is ready and what is missing." },
  { id: "ea-prep", label: "Pre-meeting preparation", text: "I prepare briefing notes, agendas, and materials ahead of meetings." },
];

export const ABOUT_ORDER: Record<string, string[]> = {
  director: ["d-risk", "d-audit", "d-cyber", "d-esg", "d-nomination", "d-remuneration"],
  "non-executive-director": ["d-risk", "d-audit", "d-cyber", "d-esg", "d-nomination"],
  "independent-director": ["d-audit-ind", "d-risk-ind", "d-nomination-ind", "d-esg-ind", "d-cyber"],
  "committee-chair": ["d-audit-chair", "d-risk-chair", "d-remuneration-chair", "d-nomination-chair", "d-cyber"],
  "board-chair": ["d-risk-board-chair", "d-nomination-board-chair", "d-cyber-board-chair", "d-esg-board-chair", "d-remuneration"],
  "chief-executive-officer": ["d-risk-ceo", "d-cyber-ceo", "d-esg-ceo", "d-nomination-ceo", "d-audit"],
  "chief-financial-officer": ["d-audit-cfo", "d-risk-cfo", "d-esg-cfo", "d-cyber-cfo", "d-nomination"],
  "chief-operating-officer": ["d-risk-coo", "d-cyber-coo", "d-audit-coo", "d-esg-coo", "d-nomination"],
  "corporate-secretary": ["cs-agenda", "cs-approvals", "cs-minutes", "cs-audit-trail", "cs-cross-committee"],
  "board-administrator": ["ba-board-book", "ba-publishing", "ba-deadline-tracking", "ba-notifications", "ba-historical"],
  "governance-manager": ["gm-operations", "gm-policy", "gm-committee", "gm-compliance", "gm-reporting"],
  paralegal: ["pl-resolution", "pl-doc-history", "pl-records", "pl-verification", "pl-statutory"],
  "executive-assistant": ["ea-logistics", "ea-reminders", "ea-director-support", "ea-status", "ea-prep"],
  default: ["cs-agenda", "ba-board-book", "gm-operations", "pl-records", "ea-logistics", "cs-minutes", "cs-approvals", "gm-policy"],
};

// ─── Preference chips ─────────────────────────────────────────────────────────

export const PREF_CHIPS = [
  // Director pref chips (shared pool, keyed to avoid collisions with role-variant versions)
  { id: "d-lead-risks", label: "Lead with the risks", text: "Lead with the key risks, open issues, and decisions I should pay attention to." },
  { id: "d-short-answer", label: "Short answer first", text: "Lead with the direct answer in one or two sentences, then supporting detail below." },
  { id: "d-tables", label: "Tables for comparisons", text: "When comparing items, periods, or committees, use a table rather than bullets." },
  { id: "d-3-5-bullets", label: "Keep it to 3–5 bullets", text: "Keep responses to three to five bullets. Use full sentences, not fragments." },
  { id: "d-under-200", label: "Keep responses under 200 words", text: "Keep responses under 200 words unless more detail is necessary." },
  // Role-variant overrides for lead-with-risks
  { id: "d-lead-risks-ind", label: "Lead with the risks", text: "Lead with the risks, tradeoffs, and unresolved concerns." },
  { id: "d-lead-risks-chair", label: "Lead with the risks", text: "Lead with the biggest issues, decisions, and escalation points." },
  { id: "d-lead-risks-board-chair", label: "Lead with the risks", text: "Lead with the most material risks and decisions for the board." },
  { id: "d-lead-risks-ceo", label: "Lead with the risks", text: "Lead with strategic risks, implications, and actions." },
  { id: "d-lead-risks-cfo", label: "Lead with the risks", text: "Lead with financial risks, controls issues, and key implications." },
  { id: "d-lead-risks-coo", label: "Lead with the risks", text: "Lead with operational risks, bottlenecks, and next steps." },
  { id: "d-under-200-board-chair", label: "Keep responses under 200 words", text: "Keep responses under 200 words and focus on what matters most." },
  { id: "d-under-200-ceo", label: "Keep responses under 200 words", text: "Keep responses under 200 words unless I ask for more depth." },
  // Admin chips (retained)
  { id: "checklists", label: "Use checklists for reviews", text: "Use checklist format for readiness reviews, action tracking, and to-do items." },
  { id: "tables", label: "Use tables for comparisons", text: "Present comparative data in tables when comparing across periods, documents, or entities." },
  { id: "regulatory", label: "Include regulatory context", text: "Reference relevant regulatory frameworks and compliance implications when discussing governance topics." },
  { id: "verify", label: "Remind me to verify high-stakes items", text: "Add a verification reminder when discussing regulatory filings, legal matters, or board votes." },
  { id: "board-ready", label: "Summarise in board-ready format", text: "Format summaries in a board-ready style suitable for distribution to the board." },
  { id: "historical", label: "Include historical context", text: "When relevant, include historical context from previous meetings or decisions on the same topic." },
  { id: "flag-attention", label: "Flag items needing board attention", text: "Proactively flag items that may require board or committee escalation." },
  { id: "concise", label: "Keep responses concise", text: "Keep responses concise — focus on key points and conclusions." },
  { id: "action-owners", label: "Identify action owners", text: "Where possible, identify who is responsible for each action or decision." },
  { id: "follow-up", label: "Highlight follow-up items", text: "Explicitly list follow-up items and outstanding actions at the end of each response." },
  { id: "plain-language", label: "Use plain language", text: "Avoid jargon and explain technical terms when used." },
  { id: "timeline", label: "Include key dates", text: "Highlight key deadlines, reporting dates, and milestone timelines." },
  { id: "best-practice", label: "Note governance best practice", text: "Where relevant, note applicable governance best practice or regulatory guidance." },
  // Corporate Secretary pref chips
  { id: "cs-concise-structured", label: "Concise and structured", text: "Keep answers concise, structured, and easy to scan." },
  { id: "cs-risks-deadlines", label: "Risks and deadlines first", text: "Lead with risks, deadlines, missing items, and blockers." },
  { id: "cs-checklist", label: "Checklist format", text: "Use checklists and clear next steps when helpful." },
  // Board Administrator pref chips
  { id: "ba-status-first", label: "Operational summary first", text: "Start with status, blockers, and recommended actions." },
  { id: "ba-short-summaries", label: "Short summaries", text: "Prefer short summaries over long explanations." },
  { id: "ba-action-oriented", label: "Action-oriented", text: "Keep responses direct, operational, and action-oriented." },
  // Governance Manager pref chips
  { id: "gm-gov-tone", label: "Governance tone", text: "Use a professional and governance-oriented tone." },
  { id: "gm-implications", label: "Implications first", text: "Highlight implications, dependencies, and compliance-sensitive points." },
  { id: "gm-balanced", label: "Balanced detail", text: "Be concise, but include enough context for sound governance decisions." },
  // Paralegal pref chips
  { id: "pl-precise", label: "Precise wording", text: "Be precise and avoid loose paraphrasing." },
  { id: "pl-evidence", label: "Evidence-oriented", text: "Separate facts from summaries and make verification easy." },
  { id: "pl-cautious", label: "Cautious tone", text: "Use a careful, professional tone for legally sensitive topics." },
  // Executive Assistant pref chips
  { id: "ea-plain", label: "Plain language", text: "Use plain language and keep things easy to understand." },
  { id: "ea-brief", label: "Brief and actionable", text: "Keep answers brief and highly actionable." },
  { id: "ea-steps", label: "Step by step", text: "Use simple step-by-step guidance when giving instructions." },
];

export const PREF_ORDER: Record<string, string[]> = {
  director: ["d-lead-risks", "d-short-answer", "d-tables", "d-3-5-bullets", "d-under-200"],
  "non-executive-director": ["d-lead-risks", "d-short-answer", "d-tables", "d-3-5-bullets", "d-under-200"],
  "independent-director": ["d-lead-risks-ind", "d-short-answer", "d-tables", "d-3-5-bullets", "d-under-200"],
  "committee-chair": ["d-lead-risks-chair", "d-short-answer", "d-tables", "d-3-5-bullets", "d-under-200"],
  "board-chair": ["d-lead-risks-board-chair", "d-under-200-board-chair", "d-short-answer", "d-tables", "d-3-5-bullets"],
  "chief-executive-officer": ["d-lead-risks-ceo", "d-under-200-ceo", "d-short-answer", "d-tables", "d-3-5-bullets"],
  "chief-financial-officer": ["d-lead-risks-cfo", "d-short-answer", "d-tables", "d-3-5-bullets", "d-under-200"],
  "chief-operating-officer": ["d-lead-risks-coo", "d-short-answer", "d-tables", "d-3-5-bullets", "d-under-200"],
  "corporate-secretary": ["cs-concise-structured", "cs-risks-deadlines", "cs-checklist", "board-tone", "checklists", "action-owners", "timeline"],
  "board-administrator": ["ba-status-first", "ba-short-summaries", "ba-action-oriented", "checklists", "action-owners", "timeline"],
  "governance-manager": ["gm-gov-tone", "gm-implications", "gm-balanced", "regulatory", "best-practice", "verify"],
  paralegal: ["pl-precise", "pl-evidence", "pl-cautious", "verify", "historical", "regulatory", "action-owners"],
  "executive-assistant": ["ea-plain", "ea-brief", "ea-steps", "checklists", "timeline", "action-owners"],
  default: ["cs-concise-structured", "ba-status-first", "gm-gov-tone", "checklists", "plain-language", "action-owners", "timeline"],
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PersonalizationState {
  userRole: string;
  aboutMeText: string;
  instructionsText: string;
  userLanguage: string;
  isPersonalizationEnabled: boolean;
  usedAboutChips: string[];
  usedInstrChips: string[];
}

export const DEFAULT_STATE: PersonalizationState = {
  userRole: "",
  aboutMeText: "",
  instructionsText: "",
  userLanguage: "en-US",
  isPersonalizationEnabled: false,
  usedAboutChips: [],
  usedInstrChips: [],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Session-scoped: resets on page refresh. Persists across dialog open/close within the same page load.
let sessionState: PersonalizationState = DEFAULT_STATE;

export function loadState(): PersonalizationState {
  return sessionState;
}

export function saveState(next: PersonalizationState) {
  sessionState = next;
}

export type RoleGroup =
  | "director"
  | "non-executive-director"
  | "independent-director"
  | "committee-chair"
  | "board-chair"
  | "chief-executive-officer"
  | "chief-financial-officer"
  | "chief-operating-officer"
  | "corporate-secretary"
  | "board-administrator"
  | "governance-manager"
  | "paralegal"
  | "executive-assistant"
  | "default";

export function getRoleGroup(role: string): RoleGroup {
  const r = role.toLowerCase();
  // Admin roles
  if (/corporate secretary|company secretary/.test(r)) return "corporate-secretary";
  if (/board administrator/.test(r)) return "board-administrator";
  if (/governance manager/.test(r)) return "governance-manager";
  if (/paralegal/.test(r)) return "paralegal";
  if (/executive assistant/.test(r)) return "executive-assistant";
  // Director roles — specific before generic
  if (/non.executive director/.test(r)) return "non-executive-director";
  if (/independent director/.test(r)) return "independent-director";
  if (/committee chair/.test(r)) return "committee-chair";
  if (/board chair/.test(r)) return "board-chair";
  if (/chief executive|\bceo\b/.test(r)) return "chief-executive-officer";
  if (/chief financial|\bcfo\b/.test(r)) return "chief-financial-officer";
  if (/chief operating|\bcoo\b/.test(r)) return "chief-operating-officer";
  if (/director|chair/.test(r)) return "director";
  return "default";
}

export function getOrderedChips<T extends { id: string }>(
  all: T[],
  order: Record<string, string[]>,
  group: string,
): T[] {
  const ids = order[group] ?? order.default;
  const map = Object.fromEntries(all.map((c) => [c.id, c]));
  return ids.flatMap((id) => (map[id] ? [map[id]] : []));
}

export function getChipPage<T extends { id: string }>(
  ordered: T[],
  used: string[],
  page: number,
): T[] {
  const available = ordered.filter((c) => !used.includes(c.id));
  if (available.length === 0) return [];
  const totalPages = Math.ceil(available.length / CHIP_PAGE_SIZE);
  const safe = page % totalPages;
  return available.slice(safe * CHIP_PAGE_SIZE, safe * CHIP_PAGE_SIZE + CHIP_PAGE_SIZE);
}

function buildPromptPreview(form: PersonalizationState): string {
  const lang = LANGUAGES.find((l) => l.value === form.userLanguage)?.label ?? "English (US)";
  const parts: string[] = [];
  if (form.userRole) {
    parts.push(`## User Context\nThe current user is a ${form.userRole}.`);
  }
  if (form.aboutMeText) {
    parts.push(`## About this user\n${form.aboutMeText}`);
  }
  if (form.instructionsText) {
    parts.push(`## Custom Instructions\n${form.instructionsText}`);
  }
  parts.push(`## Language & Locale\nRespond in ${lang}. Use ${lang} spelling, terminology, and date formats.`);
  return parts.join("\n\n");
}

// ─── RoleField ────────────────────────────────────────────────────────────────

export function RoleField({
  value,
  onChange,
  audience = "admin",
}: {
  value: string;
  onChange: (v: string, fromDropdown?: boolean) => void;
  audience?: "admin" | "director";
}) {
  const { tokens: { semantic: { color } } } = useTheme();
  const roles = audience === "director" ? ROLES_DIRECTOR : ROLES_ADMIN;
  const productName = "Ask GovernAI";

  return (
    <Autocomplete
      freeSolo
      disableClearable={!value}
      options={roles}
      value={value}
      inputValue={value}
      sx={{
        "& .MuiAutocomplete-clearIndicator": { visibility: "hidden" },
        "&:hover .MuiAutocomplete-clearIndicator, & .Mui-focused .MuiAutocomplete-clearIndicator": {
          visibility: "visible",
        },
      }}
      onInputChange={(_, newValue, reason) => {
        if (reason === "input") onChange(newValue, false);
        if (reason === "clear") onChange("", true);
      }}
      onChange={(_, newValue) => {
        if (typeof newValue === "string") onChange(newValue, true);
        else if (newValue === null) onChange("", true);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          InputLabelProps={{ ...params.InputLabelProps, shrink: false }}
          inputProps={{ ...params.inputProps, placeholder: !value ? "Select or enter a role" : undefined }}
          sx={{
            "& .MuiInputBase-root": { backgroundColor: color.surface.default.value },
            "& .MuiInputBase-input::placeholder": {
              color: color.type.muted.value,
              opacity: 1,
            },
            ...(value ? {
              "& .MuiOutlinedInput-notchedOutline": { borderColor: color.outline.default.value },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: color.outline.hover.value },
            } : {}),
          }}
        />
      )}
    />
  );
}

// ─── ChipSuggestions ──────────────────────────────────────────────────────────

export function ChipSuggestions({
  chips,
  animKey,
  onChipClick,
}: {
  chips: Array<{ id: string; label: string; text: string }>;
  animKey: number;
  onChipClick: (chip: { id: string; label: string; text: string }) => void;
}) {
  const { tokens: { semantic: { color } } } = useTheme();

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px", mt: "12px" }}>
      {chips.map((chip, i) => (
        <Chip
          key={`${animKey}-${chip.id}`}
          icon={<AddSvgIcon />}
          label={chip.label}
          size="small"
          onClick={() => onChipClick(chip)}
          sx={{
            backgroundColor: color.action.secondary.variant.value,
            border: "none",
            "& .MuiChip-icon": { color: color.type.default.value, ml: "8px" },
            "@keyframes chipFadeIn": {
              "0%": { opacity: 0, transform: "translateY(4px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
            animation: "chipFadeIn 200ms ease both",
            animationDelay: `${i * 40}ms`,
            cursor: "pointer",
          }}
        />
      ))}
    </Box>
  );
}

// ─── LimitedTextField ────────────────────────────────────────────────────────

export function LimitedTextField({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const { tokens: { semantic: { color } } } = useTheme();
  const over = value.length > CHAR_LIMIT;
  const countColor = over ? color.status.error.text.value : color.type.muted.value;

  return (
    <Box>
      <Box sx={{ position: "relative" }}>
        <TextField
          multiline
          rows={rows}
          fullWidth
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          variant="outlined"
          error={over}
          inputProps={{ style: { fontSize: "14px" } }}
        />
        <Typography
          sx={{
            position: "absolute",
            bottom: "10px",
            right: "12px",
            fontSize: "12px",
            lineHeight: "16px",
            color: countColor,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {value.length}/{CHAR_LIMIT}
        </Typography>
      </Box>
      {over && (
        <Typography sx={{ fontSize: "12px", lineHeight: "16px", color: color.status.error.text.value, mt: "6px" }}>
          Enter {CHAR_LIMIT} characters or fewer.
        </Typography>
      )}
    </Box>
  );
}

// ─── SectionHeader ────────────────────────────────────────────────────────────

export function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const { tokens: { semantic: { color } } } = useTheme();
  return (
    <Box>
      <Typography sx={{ fontSize: "16px", fontWeight: 600, lineHeight: "24px", color: color.type.default.value }}>
        {title}
      </Typography>
      <Typography sx={{ display: "block", fontSize: "14px", lineHeight: "20px", color: color.type.muted.value, mt: "4px" }}>
        {subtitle}
      </Typography>
    </Box>
  );
}

// ─── PromptPreview ────────────────────────────────────────────────────────────

export function PromptPreview({ form }: { form: PersonalizationState }) {
  const { tokens: { semantic: { color, radius } } } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const preStyle = {
    fontFamily: "'Fira Code', Menlo, monospace",
    fontSize: "13px",
    lineHeight: 1.65,
    color: "#374151",
    whiteSpace: "pre-wrap" as const,
    margin: 0,
    wordBreak: "break-word" as const,
  };

  return (
    <Box>
      <Box
        component="button"
        onClick={() => setExpanded((e) => !e)}
        sx={{
          all: "unset",
          display: "block",
          width: "100%",
          boxSizing: "border-box",
          cursor: "pointer",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", color: color.type.default.value }}>
            {expanded ? <ExpandDownIcon size="md" /> : <ExpandRightIcon size="md" />}
          </Box>
          <Typography sx={{ fontSize: "16px", fontWeight: 600, lineHeight: "24px", color: color.type.default.value }}>
            Prompt preview
          </Typography>
        </Box>
        <Typography sx={{ display: "block", fontSize: "14px", lineHeight: "20px", color: color.type.muted.value, mt: "4px", pl: "28px" }}>
          Exactly what's used at the start of every conversation.
        </Typography>
      </Box>

      {expanded && (
        <Box
          sx={{
            mt: "12px",
            border: `1px solid ${color.ui.divider.default.value}`,
            borderRadius: radius.md.value,
            overflow: "hidden",
            backgroundColor: "#f9fafb",
          }}
        >
          {/* Org context */}
          <Box sx={{ p: "16px" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "10px" }}>
              <Typography sx={{ fontSize: "12px", color: "#6b7280" }}>Organisation context</Typography>
              <Box sx={{ px: "8px", py: "2px", backgroundColor: "#e5e7eb", borderRadius: "9999px" }}>
                <Typography sx={{ fontSize: "11px", lineHeight: "16px", color: "#374151" }}>
                  Set in organization settings
                </Typography>
              </Box>
            </Box>
            <Box component="pre" sx={preStyle}>{`## Organisation Context
The user's organisation is Meridian Holdings Ltd, based in United Kingdom.
Industries: Financial Services, Asset Management.
Organisation size: 5,000–20,000 employees.

## Governance
We have 4 standing committees: Audit, Risk, Remuneration, and Nomination & Governance. The Audit and Risk committees share overlapping membership.`}</Box>
          </Box>

          <Divider sx={{ borderColor: color.ui.divider.default.value }} />

          {/* Personalisation block */}
          <Box
            sx={{
              p: "16px",
              opacity: form.isPersonalizationEnabled ? 1 : 0.42,
              transition: "opacity 0.2s ease",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "10px" }}>
              <Typography sx={{ fontSize: "12px", color: "#6b7280" }}>Your personalisation</Typography>
              {!form.isPersonalizationEnabled && (
                <Box sx={{ px: "8px", py: "2px", backgroundColor: "#fff2aa", borderRadius: "9999px" }}>
                  <Typography sx={{ fontSize: "11px", lineHeight: "16px", color: "#92400e" }}>
                    Paused
                  </Typography>
                </Box>
              )}
            </Box>
            <Box component="pre" sx={preStyle}>{buildPromptPreview(form)}</Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

// ─── PersonalizationDialog ────────────────────────────────────────────────────

interface PersonalizationDialogProps {
  open: boolean;
  onClose: () => void;
  audience?: "admin" | "director";
}

export default function PersonalizationDialog({ open, onClose, audience = "admin" }: PersonalizationDialogProps) {
  const { tokens: { semantic: { color, radius } } } = useTheme();
  const productName = "Ask GovernAI";

  const [form, setForm] = useState<PersonalizationState>(DEFAULT_STATE);
  const [snapshot, setSnapshot] = useState<PersonalizationState>(DEFAULT_STATE);
  // committedRole drives chip computation — updated immediately on dropdown select, debounced on freetext typing
  const [committedRole, setCommittedRole] = useState("");
  const [roleIsFromDropdown, setRoleIsFromDropdown] = useState(false);
  const chipDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [animKey, setAnimKey] = useState(0);
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    if (open) {
      const saved = loadState();
      setForm(saved);
      setSnapshot(saved);
      setCommittedRole(saved.userRole);
      setRoleIsFromDropdown(getRoleGroup(saved.userRole) !== "default");
      setAnimKey(0);
    }
  }, [open]);

  const roleGroup = getRoleGroup(committedRole);
  const orderedAbout = getOrderedChips(ABOUT_CHIPS, ABOUT_ORDER, roleGroup);
  const orderedInstr = getOrderedChips(PREF_CHIPS, PREF_ORDER, roleGroup);
  const aboutChips = getChipPage(orderedAbout, form.usedAboutChips, 0);
  const instrChips = getChipPage(orderedInstr, form.usedInstrChips, 0);

  const handleRoleChange = (v: string, fromDropdown = false) => {
    setForm((f) => ({ ...f, userRole: v }));
    if (chipDebounceRef.current) clearTimeout(chipDebounceRef.current);
    if (fromDropdown) {
      setCommittedRole(v);
      setRoleIsFromDropdown(true);
      setAnimKey((k) => k + 1);
    } else {
      setRoleIsFromDropdown(false);
      chipDebounceRef.current = setTimeout(() => {
        setCommittedRole(v);
        setAnimKey((k) => k + 1);
      }, 500);
    }
  };

  const handleSave = () => {
    saveState(form);
    setToastOpen(true);
    onClose();
  };

  const handleCancel = () => {
    setForm(snapshot);
    onClose();
  };

  const appendAboutChip = (chip: (typeof ABOUT_CHIPS)[0]) => {
    setForm((f) => ({
      ...f,
      aboutMeText: f.aboutMeText ? `${f.aboutMeText.trimEnd()} ${chip.text}` : chip.text,
      usedAboutChips: [...f.usedAboutChips, chip.id],
    }));
  };

  const appendInstrChip = (chip: (typeof PREF_CHIPS)[0]) => {
    setForm((f) => ({
      ...f,
      instructionsText: f.instructionsText ? `${f.instructionsText.trimEnd()} ${chip.text}` : chip.text,
      usedInstrChips: [...f.usedInstrChips, chip.id],
    }));
  };

  return (
    <>
    <Dialog
      open={open}
      onClose={(_e, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        onClose();
      }}
      disableEscapeKeyDown
      maxWidth={false}
      PaperProps={{
        sx: {
          maxWidth: 800,
          width: "100%",
          maxHeight: "90vh",
          borderRadius: radius.lg.value,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* ── Header ── */}
      <Box
        sx={{
          flexShrink: 0,
          px: "24px",
          pt: "20px",
          pb: "16px",
          borderBottom: `1px solid ${color.ui.divider.default.value}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
          <Box>
            <Typography sx={{ fontSize: "18px", fontWeight: 600, lineHeight: "28px", color: color.type.default.value }}>
              Preferences
            </Typography>
            <Typography sx={{ fontSize: "14px", lineHeight: "20px", color: color.type.muted.value, mt: "4px" }}>
              Set how {productName} responds to you. All fields are optional. Preferences shape relevance and wording, not what {productName} can access, cite, or verify.
            </Typography>
          </Box>
          <IconButton onClick={handleCancel} size="small" sx={{ p: "4px", flexShrink: 0, mt: "2px" }}>
            <CloseIcon size="md" />
          </IconButton>
        </Box>
      </Box>

      {/* ── Body ── */}
      <DialogContent sx={{ p: "24px", overflowY: "auto", flex: 1 }}>
        <Stack gap="24px" sx={{ px: "4px", py: "8px" }}>

          {/* ── Section 1: About you ── */}
          <Stack gap="24px">
            <SectionHeader
              title="About you"
              subtitle={`Add your role and focus areas so ${productName} can prioritize the content that matters to you.`}
            />

            <Box>
              <Typography sx={{ fontSize: "14px", fontWeight: 600, lineHeight: "20px", color: color.type.default.value, mb: "4px" }}>
                Primary role
              </Typography>
              <Typography sx={{ fontSize: "12px", lineHeight: "16px", color: color.type.muted.value, mb: "8px" }}>
                If you hold more than one role, select the one you use {productName} for most.
              </Typography>
              <RoleField value={form.userRole} onChange={handleRoleChange} audience={audience} />
            </Box>

            <Box>
              <Typography sx={{ fontSize: "14px", fontWeight: 600, lineHeight: "20px", color: color.type.default.value, mb: "4px" }}>
                Focus areas
              </Typography>
              <Typography sx={{ fontSize: "12px", lineHeight: "16px", color: color.type.muted.value, mb: "8px" }}>
                Describe what you focus on. {productName} uses this to decide what to surface first. It never limits what gets searched.
              </Typography>
              <LimitedTextField
                value={form.aboutMeText}
                onChange={(v) => setForm((f) => ({ ...f, aboutMeText: v }))}
                placeholder={audience === "director"
                  ? "For example: I sit on the Audit and Risk committees and focus on regulatory compliance"
                  : "For example: I support the Audit and Risk committees and prepare board packs and minutes"}
              />
              {committedRole && roleIsFromDropdown && aboutChips.length > 0 && (
                <ChipSuggestions chips={aboutChips} animKey={animKey} onChipClick={appendAboutChip} />
              )}
            </Box>
          </Stack>

          <Divider sx={{ borderColor: color.ui.divider.default.value }} />

          {/* ── Section 2: Output settings ── */}
          <Stack gap="24px">
            <SectionHeader
              title="Response style"
              subtitle={`Set how ${productName} writes responses. These preferences apply to all your conversations.`}
            />

            <Box>
              <Typography sx={{ fontSize: "14px", fontWeight: 600, lineHeight: "20px", color: color.type.default.value, mb: "4px" }}>
                Custom instructions
              </Typography>
              <Typography sx={{ fontSize: "12px", lineHeight: "16px", color: color.type.muted.value, mb: "8px" }}>
                Set your defaults for structure, length, and tone. What you ask for in a message takes priority over what you save here.
              </Typography>
              <LimitedTextField
                value={form.instructionsText}
                onChange={(v) => setForm((f) => ({ ...f, instructionsText: v }))}
                placeholder={audience === "director"
                  ? "For example: Lead with the risks and keep responses under 200 words"
                  : "For example: Use bullet points, name the source document in every answer, and flag anything missing"}
              />
              {committedRole && roleIsFromDropdown && instrChips.length > 0 && (
                <ChipSuggestions chips={instrChips} animKey={animKey} onChipClick={appendInstrChip} />
              )}
            </Box>

            <Stack gap="4px">
              <FormControl sx={{ maxWidth: 320 }} variant="outlined">
                <InputLabel>Response language</InputLabel>
                <Select
                  value={form.userLanguage}
                  label="Response language"
                  onChange={(e) => setForm((f) => ({ ...f, userLanguage: e.target.value }))}
                >
                  {LANGUAGES.map((l) => (
                    <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography sx={{ fontSize: "12px", lineHeight: "16px", color: color.type.muted.value, mt: "4px" }}>
                {productName} will respond in your chosen language and use the corresponding spelling, terminology, and date formats.
              </Typography>
            </Stack>
          </Stack>

          {/* ── Prompt preview accordion (hidden) ── */}
          <Box sx={{ display: "none" }}><PromptPreview form={form} /></Box>

          <Divider sx={{ borderColor: color.ui.divider.default.value }} />

          {/* ── Toggle row ── */}
          {(() => {
            const hasContent = !!(form.userRole || form.aboutMeText.trim() || form.instructionsText.trim());
            return (
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: "8px", py: "12px" }}>
                <Switch
                  checked={form.isPersonalizationEnabled}
                  disabled={!hasContent}
                  onChange={(e) => setForm((f) => ({ ...f, isPersonalizationEnabled: e.target.checked }))}
                  color="default"
                  size="small"
                  sx={{ flexShrink: 0, mt: "2px", ml: "-4px" }}
                />
                <Stack gap="4px">
                  <Typography sx={{ fontSize: "14px", lineHeight: "20px", color: color.type.default.value }}>
                    Apply my preferences
                  </Typography>
                  <Typography sx={{ fontSize: "12px", lineHeight: "16px", color: color.type.muted.value }}>
                    {productName} uses these preferences only when this setting is on. Turning it off keeps your entries saved. Context set by your administrator still applies.
                  </Typography>
                </Stack>
              </Box>
            );
          })()}

        </Stack>
      </DialogContent>

      {/* ── Footer ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          px: "24px",
          py: "16px",
          borderTop: `1px solid ${color.ui.divider.default.value}`,
        }}
      >
        <Button variant="outlined" color="primary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave} disabled={form.aboutMeText.length > CHAR_LIMIT || form.instructionsText.length > CHAR_LIMIT}>
          Save
        </Button>
      </Box>
    </Dialog>

    <Snackbar
      open={toastOpen}
      autoHideDuration={5000}
      onClose={(_e, reason) => {
        if (reason === "clickaway") return;
        setToastOpen(false);
      }}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{ top: "24px !important", right: "24px !important" }}
    >
      <Alert
        severity="success"
        aria-live="polite"
        action={
          <IconButton size="small" aria-label="Dismiss" onClick={() => setToastOpen(false)}>
            <CloseIcon size="md" />
          </IconButton>
        }
        sx={{
          border: `1px solid ${color.outline.default.value}`,
          "&&&&": {
            boxShadow:
              "0px 32px 32px rgba(15, 17, 19, 0.10), 0px 0px 2px rgba(15, 17, 19, 0.10)",
          },
        }}
      >
        Personalization settings saved. Changes will apply to new chats.
      </Alert>
    </Snackbar>
    </>
  );
}
