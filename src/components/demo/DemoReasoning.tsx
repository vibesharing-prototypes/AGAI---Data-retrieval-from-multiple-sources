import { useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { AIChatReasoningBlock, AILoadingIndicator } from "@diligentcorp/atlas-react-bundle";
import CheckedCircleIcon from "@diligentcorp/atlas-react-bundle/icons/CheckedCircle";
import ExpandDownIcon from "@diligentcorp/atlas-react-bundle/icons/ExpandDown";
import type { DemoReasoningStep } from "../../data/demo-agai-integration-usecases.js";

// Atlas AI content reasoning for the AGAI integration use cases demo. Live while the AI works
// (open, current step expanded with the AI glow icon, finished steps checked),
// then kept on the message, collapsed, as an audit trail of what the AI did.
//
// Layout (Figma): all text 14px; steps indented 24px from the vertical line;
// 16px between the header, the intro, each step title, its details and the next
// step; chevron at the far right of each step; 16px below the block.
export default function DemoReasoning({
  steps,
  intro,
  activeIndex,
}: {
  steps: DemoReasoningStep[];
  /** One-line plan shown at the top of the block. */
  intro?: string;
  /** Index of the step in progress, or null once the answer has arrived. */
  activeIndex: number | null;
}) {
  const working = activeIndex !== null;
  const [blockOpen, setBlockOpen] = useState(working);
  const [openStep, setOpenStep] = useState<number | null>(activeIndex);

  // The current step is always open; when the answer lands everything collapses.
  useEffect(() => {
    setOpenStep(activeIndex);
    setBlockOpen(activeIndex !== null);
  }, [activeIndex]);

  const label = `Reasoning (${steps.length} ${steps.length === 1 ? "step" : "steps"})`;

  return (
    <AIChatReasoningBlock
      label={label}
      description={intro}
      slotProps={{
        root: { sx: { mb: "16px" } },
        label: { sx: { fontSize: "14px", lineHeight: "20px" } },
        collapse: { in: blockOpen },
        expandButton: { onClick: () => setBlockOpen((v) => !v) },
        content: { sx: { maxWidth: "none", width: "100%", pl: "24px", pt: 0, pb: 0, gap: "16px" } },
        description: { sx: { m: 0, fontSize: "14px", lineHeight: "20px" } },
      }}
    >
      {steps.map((step, i) => {
        const done = working ? i < activeIndex : true;
        return (
          <Accordion
            key={step.title + i}
            expanded={openStep === i}
            onChange={(_, expanded) => setOpenStep(expanded ? i : null)}
          >
            <AccordionSummary
              expandIcon={<ExpandDownIcon size="md" />}
              sx={{
                minHeight: 0,
                p: 0,
                flexDirection: "row",
                "& .MuiAccordionSummary-content": { alignItems: "center", gap: "8px", m: 0, flexGrow: 1 },
                // The step title is an <h3> (per the Atlas example); drop its default margins.
                "& h3": { m: 0, fontSize: "14px", lineHeight: "20px", fontWeight: 600 },
                // Down chevron, turned up while the step is open.
                "& .MuiAccordionSummary-expandIconWrapper": { m: 0, transform: "none" },
                "&.Mui-expanded .MuiAccordionSummary-expandIconWrapper": { transform: "rotate(180deg)" },
              }}
            >
              {done ? <CheckedCircleIcon size="md" /> : i === activeIndex ? <AILoadingIndicator size="md" /> : <CheckedCircleIcon size="md" sx={{ visibility: "hidden" }} />}
              <h3>{step.title}</h3>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                // Overrides the Atlas reasoning-block padding (8px) so the 16px rhythm holds.
                padding: "16px 0 0 !important",
                fontSize: "14px",
                lineHeight: "20px",
              }}
            >
              {step.detail}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </AIChatReasoningBlock>
  );
}
