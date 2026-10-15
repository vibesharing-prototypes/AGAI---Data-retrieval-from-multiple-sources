import { Button, Typography, useTheme } from "@mui/material";
import { AIChatToolCall } from "@diligentcorp/atlas-react-bundle";
import LockedFileIcon from "@diligentcorp/atlas-react-bundle/icons/LockedFile";
import { useSmartAssist } from "../../context/SmartAssistContext.js";
import { DEMO_SHARE_FILE_TITLE } from "../../data/demo-agai-integration-usecases.js";

// Step 6 of the AGAI integration use cases demo: the one action. Sharing changes state, so it is a
// gated Atlas tool call: Paused until the user approves, and nothing is shared
// before then. The row stays in the message afterwards as the audit trail.
export default function DemoShareCard() {
  const { tokens: { semantic: { color } } } = useTheme();
  const { demoShare, resolveDemoShare } = useSmartAssist();
  const text = { fontSize: "14px", lineHeight: "22px", color: color.type.default.value } as const;

  // Data room leading icon (same one as the Data room source chip).
  const icon = <LockedFileIcon />;
  // Tool call text follows the 14px AI output size.
  const textSlots = { label: { sx: { fontSize: "14px", lineHeight: "20px" } }, content: { sx: { fontSize: "14px", lineHeight: "20px" } } };
  const details = `Share "${DEMO_SHARE_FILE_TITLE}" with your board admin. They will get view access to this file only. Nothing else in the data room is shared.`;

  if (demoShare === "pending") {
    return (
      <AIChatToolCall
        label="Share file in Data room – awaiting approval"
        status="paused"
        icon={icon}
        slotProps={textSlots}
        authorization={
          <>
            <Button variant="outlined" size="xsmall" onClick={() => resolveDemoShare("cancelled")}>
              Deny
            </Button>
            <Button variant="contained" size="xsmall" onClick={() => resolveDemoShare("shared")}>
              Approve
            </Button>
          </>
        }
      >
        {details}
      </AIChatToolCall>
    );
  }

  if (demoShare === "shared") {
    return (
      <>
        <AIChatToolCall label="Share file in Data room" status="success" icon={icon} slotProps={textSlots}>
          {details}
        </AIChatToolCall>
        <Typography sx={{ ...text, mt: "8px" }}>
          Shared with your board admin. They'll get the usual Data room share notification.
        </Typography>
        <Typography sx={{ ...text, mt: "8px" }}>
          Your penetration test attestation request is now covered before the meeting.
        </Typography>
      </>
    );
  }

  return (
    <>
      <AIChatToolCall label="Denied: Share file in Data room" status="failed" icon={icon} slotProps={textSlots}>
        You denied this action. Nothing was shared.
      </AIChatToolCall>
      <Typography sx={{ ...text, mt: "8px" }}>Okay, nothing was shared.</Typography>
    </>
  );
}
