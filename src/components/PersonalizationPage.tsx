import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Divider,
  IconButton,
  Snackbar,
  Stack,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import { SectionHeader } from "@diligentcorp/atlas-react-bundle";
import CloseIcon from "@diligentcorp/atlas-react-bundle/icons/Close";

import {
  ABOUT_CHIPS,
  ABOUT_ORDER,
  CHAR_LIMIT,
  ChipSuggestions,
  DEFAULT_STATE,
  LimitedTextField,
  PREF_CHIPS,
  PREF_ORDER,
  PromptPreview,
  RoleField,
  getChipPage,
  getOrderedChips,
  getRoleGroup,
  loadState,
  saveState,
  type PersonalizationState,
} from "./PersonalizationDialog.js";

// Page-mode personalization. Same fields, behaviour, and copy as the dialog —
// the only differences are structural: it renders inline in the full-screen
// overlay content area (not as a modal), the title uses the Atlas SectionHeader
// with the action buttons in its buttonArray, the apply toggle moves to the top,
// and Save only enables once something has changed.

const CONTENT_MAX_WIDTH = 708;

export interface PersonalizationPageHandle {
  save: () => void;
  cancel: () => void;
}

interface PersonalizationPageProps {
  open: boolean;
  onClose: () => void;
  onCancel?: () => void;
  audience?: "admin" | "director";
  hideHeader?: boolean;
  onDirtyChange?: (dirty: boolean) => void;
}

const PersonalizationPage = forwardRef<PersonalizationPageHandle, PersonalizationPageProps>(
function PersonalizationPage({ open, onClose, onCancel, audience = "admin", hideHeader = false, onDirtyChange }, ref) {
  const { tokens: { semantic: { color } } } = useTheme();
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

  // Save only enables once the user has changed something.
  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(snapshot),
    [form, snapshot],
  );

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

  const handleSave = useCallback(() => {
    saveState(form);
    setSnapshot(form);
    setToastOpen(true);
  }, [form]);

  const handleCancel = useCallback(() => {
    setForm(snapshot);
    if (onCancel) onCancel();
    else onClose();
  }, [snapshot, onCancel, onClose]);

  useImperativeHandle(ref, () => ({ save: handleSave, cancel: handleCancel }), [handleSave, handleCancel]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

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
      {open && (
        <Box sx={{ flex: 1, overflowY: "auto", px: "48px", py: "32px", display: "flex", flexDirection: "column" }}>
          <Box sx={{ width: "100%", maxWidth: `${CONTENT_MAX_WIDTH}px`, mx: "auto", my: "auto" }}>

            {/* ── Page header (Atlas) — hidden when embedded in a tabbed container ── */}
            {!hideHeader && (
              <SectionHeader
                headingLevel="h4"
                title="Preferences"
                subtitle={`Set how ${productName} responds to you. All fields are optional. Preferences shape relevance and wording, not what ${productName} can access, cite, or verify.`}
                sx={{
                  "& h4": { fontSize: "18px !important", lineHeight: "28px !important" },
                  "& p": { fontSize: "14px !important", lineHeight: "20px !important" },
                }}
                buttonArray={
                  <ButtonGroup>
                    <Button size="small" variant="text" color="primary" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button size="small" variant="contained" color="primary" onClick={handleSave} disabled={!isDirty || form.aboutMeText.length > CHAR_LIMIT || form.instructionsText.length > CHAR_LIMIT}>
                      Save
                    </Button>
                  </ButtonGroup>
                }
              />
            )}

            <Stack gap="24px" sx={{ mt: hideHeader ? "0px" : "32px" }}>

              {/* ── Section 1: About you ── */}
              <Stack gap="24px">
                <SectionHeader
                  headingLevel="h4"
                  title="About you"
                  subtitle={`Add your role and focus areas so ${productName} can prioritize the content that matters to you.`}
                />

                <Box sx={{ maxWidth: 560, width: "100%" }}>
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
                  headingLevel="h4"
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
              </Stack>

              {/* ── Prompt preview (hidden) ── */}
              <Box sx={{ display: "none" }}><PromptPreview form={form} /></Box>

              <Divider sx={{ borderColor: color.ui.divider.default.value }} />

              {/* ── Apply toggle (bottom) ── */}
              {(() => {
                const hasContent = !!(form.userRole || form.aboutMeText.trim() || form.instructionsText.trim());
                return (
                  <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "24px" }}>
                    <Stack gap="4px" sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: "16px", fontWeight: 600, lineHeight: "24px", color: color.type.default.value }}>
                        Apply my preferences
                      </Typography>
                      <Typography sx={{ fontSize: "14px", lineHeight: "20px", color: color.type.muted.value }}>
                        {productName} uses these preferences only when this setting is on. Turning it off keeps your entries saved. Context set by your administrator still applies.
                      </Typography>
                    </Stack>
                    <Box
                      component="span"
                      onClick={() => { if (hasContent) setForm((f) => ({ ...f, isPersonalizationEnabled: !f.isPersonalizationEnabled })); }}
                      sx={{ flexShrink: 0, display: "inline-flex", alignItems: "center", cursor: hasContent ? "pointer" : "default" }}
                    >
                      <Switch
                        checked={form.isPersonalizationEnabled}
                        disabled={!hasContent}
                        onChange={(e) => setForm((f) => ({ ...f, isPersonalizationEnabled: e.target.checked }))}
                        color="primary"
                        sx={{ pointerEvents: "none" }}
                        inputProps={{ "aria-label": "Apply preferences" }}
                      />
                    </Box>
                  </Box>
                );
              })()}

            </Stack>
          </Box>
        </Box>
      )}

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
});

export default PersonalizationPage;
