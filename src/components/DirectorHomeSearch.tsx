import { useCallback, useRef, useState } from "react";
import { Box, Button, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";

import { AIChatBox } from "@diligentcorp/atlas-react-bundle";
import CaretDownIcon from "@diligentcorp/atlas-react-bundle/icons/CaretDown";

import SuggestionChips from "./SuggestionChips.js";
import {
  ChatMicrophoneIcon,
  ExtendedThinkingIcon,
  ToolsSliderIcon,
  UploadFileIcon,
} from "./SmartAssistOverlay.js";
import { useSmartAssist } from "../context/SmartAssistContext.js";
import { DEMO_STEPS } from "../data/demo-agai-integration-usecases.js";

// ─── Component ────────────────────────────────────────────────────────────────
// Centered home hero: the Smart Assist composer lifted out of the right rail
// and dropped into the main content area, above the Overview/Explore tabs.
// Not sticky — it scrolls with the page. Composer caps at 700px, width 100%.

export default function DirectorHomeSearch() {
  const {
    tokens: {
      semantic: { color, font, fontWeight, borderWidth },
      component: { aiChatBox },
    },
  } = useTheme();
  const { handleSend, openSmartAssist, demoMode, demoStepsDone, prompt, setPrompt } = useSmartAssist();

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  // The composer wrapper element, used to anchor the suggestion dropdown above
  // it. Stored in state (callback ref) so the dropdown re-renders once mounted.
  const [composerAnchor, setComposerAnchor] = useState<HTMLDivElement | null>(null);
  const [extendedThinking, setExtendedThinking] = useState(false);

  // Drop a starter prompt in and focus the composer so the cursor blinks and
  // the user can immediately edit the pasted template.
  const fillAndFocus = (text: string) => {
    setPrompt(text);
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      // Caret at the end so the user can keep typing from where the template ends.
      el.setSelectionRange(text.length, text.length);
    });
  };

  // Focus the composer without changing its draft — used when a chip opens its
  // suggestion dropdown (nothing is pasted until the user picks a prompt).
  const focusComposer = () => {
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    });
  };

  // Always a fresh entry point — start a new session regardless of what was
  // open before.
  const submit = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      // Open first: openSmartAssist() may consume a pending fresh-open reset
      // (after navigating here), which clears messages. Sending afterwards keeps
      // the new user message instead of having it wiped.
      openSmartAssist();
      handleSend(text, { newSession: true });
      setPrompt("");
    },
    [handleSend, setPrompt, openSmartAssist],
  );
  const submitRef = useRef(submit);
  submitRef.current = submit;

  // Atlas AIChatBox only submits on Enter while single-line, so capture Enter
  // ourselves (Shift+Enter still adds a line break) — same as the full-screen view.
  const registerInput = useCallback((node: HTMLTextAreaElement | null) => {
    inputRef.current = node;
    if (!node) return;
    node.addEventListener(
      "keydown",
      (e) => {
        if (e.key !== "Enter" || e.shiftKey || e.isComposing) return;
        e.preventDefault();
        e.stopPropagation();
        if (node.value.trim()) submitRef.current(node.value);
      },
      true,
    );
  }, []);

  // AGAI integration use cases demo: clicking into an empty composer drops in the next scripted
  // prompt, so the presenter can start the story from the home page.
  const prefillDemoPrompt = () => {
    const next = DEMO_STEPS[demoStepsDone];
    if (demoMode && next && !prompt.trim()) fillAndFocus(next.prompt);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        // Section caps at 800px and centers within the Overview left column.
        alignItems: "center",
      }}
    >
      {/* Base gap is 12px (the spacing the chips sit below the composer). The
          subtitle→composer gap is 32px (+20px top margin) and chips→Open-Smart-
          Assist is bumped back to 16px with a compensating +4px top margin. */}
      <Stack sx={{ width: "100%", maxWidth: "708px", gap: "12px" }}>
        {/* Heading + subtitle */}
        <Stack sx={{ gap: "4px", textAlign: "center" }}>
          <Typography
            component="h2"
            sx={{
              // Atlas h2-display (28px / 34px), weight 600. fontSize pinned so a
              // deploy-time token shift can't resize it.
              fontFamily: font.title.h2Display.fontFamily.value,
              fontSize: "28px",
              fontWeight: fontWeight.emphasis.value,
              lineHeight: font.title.h2Display.lineHeight.value,
              letterSpacing: font.title.h2Display.letterSpacing.value,
              color: color.type.default.value,
            }}
          >
            What would you like to know?
          </Typography>
          <Typography
            sx={{
              fontFamily: font.text.md.fontFamily.value,
              fontSize: font.text.md.fontSize.value,
              fontWeight: font.text.md.fontWeight.value,
              lineHeight: font.text.md.lineHeight.value,
              letterSpacing: font.text.md.letterSpacing.value,
              color: color.type.muted.value,
            }}
          >
            Select a prompt to get started, or ask your own question.
          </Typography>
        </Stack>

        {/* Composer — same treatment as the full-screen Ask GovernAI composer:
            indigo blur glow behind, a 1px #DEE0E9 frame with the Atlas low
            elevation shadow, and the Atlas gradient-border/glow turned off. */}
        <Box
          ref={setComposerAnchor}
          onFocus={prefillDemoPrompt}
          onClick={prefillDemoPrompt}
          sx={{
            position: "relative",
            width: "100%",
            // +20px so subtitle→composer is 32px against the 12px Stack gap.
            mt: "20px",
          }}
        >
          <Box
            role="presentation"
            sx={{
              width: "660px",
              maxWidth: "100%",
              height: "140px",
              position: "absolute",
              left: "50%",
              top: "-14px",
              transform: "translateX(-50%)",
              opacity: 0.48,
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.5) 0%, rgba(64,105,254,0.5) 23%, rgba(0,64,213,0.5) 49%, rgba(64,105,254,0.5) 73%, rgba(255,255,255,0.5) 100%)",
              borderRadius: "9999px",
              filter: "blur(77px)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid #DEE0E9",
              boxShadow:
                "-1px 4px 8px rgba(135,135,135,0.08), -2px 9px 12px rgba(135,135,135,0.06), -12px 38px 24px rgba(135,135,135,0.02), -12px 40px 20px rgba(135,135,135,0.01)",
            }}
          >
            <AIChatBox
              onSubmit={submit}
              onStop={() => {}}
              isUploadAvailable={false}
              leadingActions={
                <>
                  <Tooltip title="Attach file">
                    <IconButton size="small" sx={{ width: 32, height: 32, p: "4px", borderRadius: "12px", color: "#232429" }}>
                      <UploadFileIcon />
                    </IconButton>
                  </Tooltip>
                  <Box sx={{ display: "inline-flex", alignSelf: "center" }}>
                    <Button
                      variant="text"
                      size="small"
                      startIcon={<ToolsSliderIcon />}
                      endIcon={<CaretDownIcon size="md" />}
                      sx={{ borderRadius: "12px", px: "8px", py: "4px", fontWeight: 500, fontSize: "14px", lineHeight: "20px", minWidth: 0, color: "#232429", textTransform: "none" }}
                    >
                      Tools
                    </Button>
                  </Box>
                </>
              }
              trailingActions={
                <>
                  <Tooltip title="Voice input" placement="top">
                    <IconButton size="small" sx={{ width: 32, height: 32, p: "4px", borderRadius: "8px", color: "#232429" }}>
                      <ChatMicrophoneIcon />
                    </IconButton>
                  </Tooltip>
                </>
              }
              sx={{
                "& .MuiInputBase-input": { padding: "16px 24px 12px", fontSize: "14px !important" },
                "& .AtlasAIGlow-root": { display: "none !important" },
                "& .AtlasAIChatBox-gradient-border": { display: "none !important" },
              }}
              slotProps={{
                textField: {
                  placeholder: "Ask anything about your board materials",
                  slotProps: { textField: { inputRef: registerInput } },
                },
                disclaimer: { stackProps: { style: { display: "none" } } },
              }}
            />
          </Box>
        </Box>

        {/* Suggestion chips — small Atlas outlined chips, centered below the
            composer. Clicking drops a starter prompt into the input. Shared with
            the full-screen and panel Smart Assist views (which use large). */}
        <SuggestionChips
          size="small"
          align="center"
          audience="director"
          maxVisible={3}
          promptSet="default"
          anchorEl={composerAnchor}
          placement="bottom"
          showIcon
          onSelectPrompt={fillAndFocus}
          onChipOpen={focusComposer}
          sx={{ mt: "4px" }}
        />


      </Stack>
    </Box>
  );
}
