import React, { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import smartAssistAvatarUrl from "../assets/smart-assist-avatar.svg";
import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
  Switch,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

import {
  AIChatContent,
  AIChatAIMessage,
  AIChatUserMessage,
  AIChatMessageHeader,
  AIChatMessageAvatar,
  AIChatMessageTextBlock,
  AIChatMessageFooter,
  AIChatThinkingIndicator,
  AIChatTimestamp,
} from "@diligentcorp/atlas-react-bundle";

import AiSparkleIcon from "@diligentcorp/atlas-react-bundle/icons/AiSparkle";
import { SmartSummaryIcon, SmartPrepIcon, SmartRiskScannerIcon, AuditSmartPrepIcon } from "./InsightIcons.js";
import { InsightSummaryView, InsightPrepView, InsightRiskView, InsightAuditView } from "./InsightDetailViews.js";
import { AiBadge, AiInaccuracyDisclaimer } from "./AiDisclaimers.js";
import AddCircleIcon from "@diligentcorp/atlas-react-bundle/icons/AddCircle";
import ArrowLeftIcon from "@diligentcorp/atlas-react-bundle/icons/ArrowLeft";
import ArrowUpIcon from "@diligentcorp/atlas-react-bundle/icons/ArrowUp";
import CloseIcon from "@diligentcorp/atlas-react-bundle/icons/Close";
import ExpandRightIcon from "@diligentcorp/atlas-react-bundle/icons/ExpandRight";
import FullscreenIcon from "@diligentcorp/atlas-react-bundle/icons/Fullscreen";
import SettingsIcon from "@diligentcorp/atlas-react-bundle/icons/Settings";
import MoreIcon from "@diligentcorp/atlas-react-bundle/icons/More";
import BellIcon from "@diligentcorp/atlas-react-bundle/icons/Bell";
import FolderIcon from "@diligentcorp/atlas-react-bundle/icons/Folder";
import MessageIcon from "@diligentcorp/atlas-react-bundle/icons/Message";
import PinIcon from "@diligentcorp/atlas-react-bundle/icons/Pin";
import ReloadIcon from "@diligentcorp/atlas-react-bundle/icons/Reload";
import TaskIcon from "@diligentcorp/atlas-react-bundle/icons/Task";
import AuditAnalyticsIcon from "@diligentcorp/atlas-react-bundle/icons/AuditAnalytics";
import BriefcaseIcon from "@diligentcorp/atlas-react-bundle/icons/Briefcase";
import LockedIcon from "@diligentcorp/atlas-react-bundle/icons/Locked";
import ReportsIcon from "@diligentcorp/atlas-react-bundle/icons/Reports";
import RiskEssentialsIcon from "@diligentcorp/atlas-react-bundle/icons/RiskEssentials";
import StrategyIcon from "@diligentcorp/atlas-react-bundle/icons/Strategy";
import TargetIcon from "@diligentcorp/atlas-react-bundle/icons/Target";

import { type ChatThread, STATIC_CHAT_THREADS } from "../data/hybrid-search.constants.js";
import RichAIMessageContent, { parseCiteText } from "./RichAIMessageContent.js";
import SourcesBlock from "./SourcesBlock.js";
import SuggestionChips from "./SuggestionChips.js";
import AIMoreMenu from "./AIMoreMenu.js";
import ChatThreadItem from "./ChatThreadItem.js";
import DeleteAllChatsMenu from "./DeleteAllChatsMenu.js";
import { useSmartAssist } from "../context/SmartAssistContext.js";

// ─── Constants ────────────────────────────────────────────────────────────────

const AI_GRADIENT = "linear-gradient(90deg, #be0c1e 0%, #ab48da 50%, #4069fe 100%)";
const THREAD_BG = "linear-gradient(135deg, #f9f9fc 31%, #fcfcff 100%)";
const AI_PURPLE = "#ab48da";
const DRAWER_WIDTH = 440;

const EXPERT_SKILLS: { id: string; label: string; desc: string; slash: string; Icon: React.ElementType }[] = [
  { id: "audit",    label: "Audit & financial", desc: "Financial reporting, controls, the auditor",     slash: "/audit",    Icon: AuditAnalyticsIcon },
  { id: "risk",     label: "Enterprise risk",   desc: "Strategic & operational risk, concentrations",   slash: "/risk",     Icon: RiskEssentialsIcon },
  { id: "cyber",    label: "Cyber & privacy",   desc: "Security, data protection, third parties",       slash: "/cyber",    Icon: LockedIcon },
  { id: "strategy", label: "Strategy",          desc: "Board-level strategy & execution",               slash: "/strategy", Icon: StrategyIcon },
];

const AGENT_REPORTING: { id: string; label: string; tag: string; desc: string; Icon: React.ElementType }[] = [
  { id: "brief",         label: "Summarize & brief",  tag: "@briefcase",      desc: "Quick research synthesized into a board-ready brief.",             Icon: BriefcaseIcon },
  { id: "diligence",     label: "Due diligence", tag: "@diligence",      desc: "Multi-area research with risk assessment and executive summary.",   Icon: ReportsIcon },
  { id: "followthrough", label: "Track commitments",  tag: "@follow-through", desc: "Tracks who owns what and what's overdue.",                         Icon: TargetIcon },
];

// ─── Composer toolbar icons ───────────────────────────────────────────────────

function UploadFileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.58334 18.2372C8.36433 18.2372 7.32774 17.8101 6.47357 16.9559C5.6194 16.1018 5.19232 15.0652 5.19232 13.8462V4.83972C5.19232 3.96272 5.50459 3.21195 6.12913 2.58743C6.75366 1.9629 7.50443 1.65063 8.38143 1.65063C9.25843 1.65063 10.0092 1.9629 10.6337 2.58743C11.2582 3.21195 11.5705 3.96272 11.5705 4.83972V12.9647C11.5705 13.5211 11.3784 13.9914 10.9942 14.3756C10.6099 14.7598 10.1396 14.9519 9.58311 14.9519C9.02664 14.9519 8.55636 14.7598 8.17228 14.3756C7.78821 13.9914 7.59618 13.5211 7.59618 12.9647V4.83972H8.58974V12.9647C8.58974 13.2463 8.68496 13.4822 8.87541 13.6727C9.06585 13.8631 9.30183 13.9583 9.58334 13.9583C9.86486 13.9583 10.1008 13.8631 10.2913 13.6727C10.4817 13.4822 10.5769 13.2463 10.5769 12.9647V4.83972C10.5769 4.22497 10.3646 3.70536 9.94005 3.28091C9.51545 2.85643 8.99568 2.6442 8.38074 2.6442C7.76581 2.6442 7.24627 2.85643 6.82211 3.28091C6.39797 3.70536 6.18591 4.22497 6.18591 4.83972V13.8462C6.18591 14.7842 6.51763 15.5849 7.18109 16.2484C7.84455 16.9119 8.6453 17.2436 9.58334 17.2436C10.5214 17.2436 11.3221 16.9119 11.9856 16.2484C12.6491 15.5849 12.9808 14.7842 12.9808 13.8462V4.83972H13.9744V13.8462C13.9744 15.0652 13.5473 16.1018 12.6931 16.9559C11.8389 17.8101 10.8024 18.2372 9.58334 18.2372Z" fill="currentColor"/>
    </svg>
  );
}

function ToolsSliderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.37498 17.2916V12.7083H10.6249V14.375H17.2916V15.6249H10.6249V17.2916H9.37498ZM2.70831 15.6249V14.375H7.29161V15.6249H2.70831ZM6.04165 12.2916V10.6249H2.70831V9.37498H6.04165V7.70831H7.29161V12.2916H6.04165ZM9.37498 10.6249V9.37498H17.2916V10.6249H9.37498ZM12.7083 7.29161V2.70831H13.9583V4.37498H17.2916V5.62494H13.9583V7.29161H12.7083ZM2.70831 5.62494V4.37498H10.6249V5.62494H2.70831Z" fill="currentColor"/>
    </svg>
  );
}

function ExtendedThinkingIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.75001 20.596C8.95134 20.596 8.26451 20.3194 7.68951 19.7663C7.11451 19.2131 6.79818 18.5423 6.74051 17.7538C5.82384 17.6141 5.06101 17.1949 4.45201 16.4963C3.84301 15.7974 3.53851 14.9782 3.53851 14.0385C3.53851 13.7103 3.58118 13.3861 3.66651 13.0658C3.75168 12.7454 3.87951 12.4447 4.05001 12.1635C3.84751 11.8698 3.69559 11.5523 3.59426 11.2108C3.49293 10.8691 3.44226 10.5104 3.44226 10.1348C3.44226 9.17543 3.75801 8.34585 4.38951 7.64602C5.02084 6.94618 5.80259 6.53918 6.73476 6.42502C6.72826 6.39935 6.72501 6.37368 6.72501 6.34801V6.26152C6.75584 5.45635 7.06384 4.7756 7.64901 4.21927C8.23434 3.66293 8.93468 3.38477 9.75001 3.38477C10.209 3.38477 10.618 3.47451 10.977 3.65401C11.336 3.83335 11.677 4.08718 12 4.41552C12.3192 4.08718 12.6577 3.83335 13.0155 3.65401C13.3732 3.47451 13.7847 3.38477 14.25 3.38477C15.0563 3.38477 15.7503 3.66193 16.3318 4.21627C16.9131 4.77077 17.2192 5.44743 17.25 6.24626V6.33277C17.25 6.35843 17.2468 6.3841 17.2403 6.40977C18.1724 6.52377 18.9583 6.93176 19.598 7.63376C20.2378 8.3356 20.5578 9.16927 20.5578 10.1348C20.5578 10.5104 20.5055 10.8691 20.401 11.2108C20.2965 11.5523 20.1429 11.8698 19.9403 12.1635C20.1108 12.4443 20.2403 12.7449 20.3288 13.0653C20.4173 13.3858 20.4615 13.7102 20.4615 14.0385C20.4615 14.9948 20.1544 15.8198 19.5403 16.5135C18.9263 17.207 18.1577 17.6204 17.2345 17.7538C17.1768 18.5423 16.8647 19.2131 16.298 19.7663C15.7313 20.3194 15.0487 20.596 14.25 20.596C13.7885 20.596 13.3779 20.5088 13.0183 20.3345C12.6586 20.1602 12.3192 19.9057 12 19.571C11.6705 19.9057 11.3269 20.1602 10.9693 20.3345C10.6116 20.5088 10.2052 20.596 9.75001 20.596ZM12.75 6.38477V17.5963C12.75 18.0163 12.8954 18.3713 13.1863 18.6613C13.4771 18.9513 13.833 19.0963 14.254 19.0963C14.6552 19.0963 14.999 18.9468 15.2855 18.648C15.5722 18.3493 15.727 18.0013 15.75 17.6038C15.3295 17.5154 14.9413 17.3555 14.5855 17.124C14.2298 16.8927 13.9225 16.5962 13.6635 16.2345C13.5353 16.059 13.487 15.8721 13.5185 15.6738C13.55 15.4754 13.6541 15.3143 13.8308 15.1905C14.0064 15.0622 14.1946 15.0138 14.3953 15.0455C14.5961 15.077 14.7592 15.1811 14.8845 15.3578C15.0913 15.6586 15.3546 15.8889 15.6743 16.0488C15.9939 16.2086 16.3397 16.2885 16.7115 16.2885C17.3385 16.2885 17.8703 16.0703 18.3068 15.6338C18.7433 15.1971 18.9615 14.6653 18.9615 14.0385C18.9615 13.9123 18.9493 13.7863 18.925 13.6603C18.9007 13.5343 18.8622 13.4103 18.8095 13.2885C18.5262 13.4808 18.2137 13.6283 17.872 13.7308C17.5303 13.8333 17.1756 13.8845 16.8078 13.8845C16.5953 13.8845 16.4171 13.8127 16.2733 13.669C16.1296 13.5252 16.0578 13.3469 16.0578 13.1343C16.0578 12.9218 16.1296 12.7437 16.2733 12.6C16.4171 12.4565 16.5953 12.3848 16.8078 12.3848C17.4346 12.3848 17.9663 12.1664 18.403 11.7298C18.8395 11.2933 19.0578 10.7616 19.0578 10.1348C19.0578 9.51777 18.8427 8.99427 18.4125 8.56427C17.9823 8.13427 17.4603 7.90768 16.8463 7.88452C16.6756 8.19102 16.4508 8.45835 16.172 8.68652C15.8932 8.91468 15.582 9.09543 15.2385 9.22877C15.0423 9.3031 14.8508 9.29693 14.664 9.21026C14.4772 9.1236 14.3527 8.9811 14.2905 8.78277C14.2263 8.5866 14.234 8.39393 14.3135 8.20477C14.393 8.01577 14.534 7.88918 14.7365 7.82502C15.0378 7.72252 15.2821 7.54043 15.4693 7.27877C15.6564 7.01727 15.75 6.7176 15.75 6.37977C15.75 5.96243 15.6049 5.60893 15.3148 5.31927C15.0248 5.02943 14.6697 4.88452 14.2495 4.88452C13.8293 4.88452 13.4743 5.02952 13.1845 5.31952C12.8948 5.60952 12.75 5.9646 12.75 6.38477ZM11.25 17.5963V6.38477C11.25 5.9646 11.1049 5.60952 10.8148 5.31952C10.5248 5.02952 10.1697 4.88452 9.74951 4.88452C9.32934 4.88452 8.97434 5.02952 8.68451 5.31952C8.39484 5.60952 8.25001 5.9646 8.25001 6.38477C8.25001 6.7091 8.34101 7.0046 8.52301 7.27126C8.70518 7.53793 8.94684 7.72252 9.24801 7.82502C9.44418 7.88918 9.58776 8.01418 9.67876 8.20002C9.76976 8.38585 9.78376 8.5776 9.72076 8.77527C9.64526 8.97277 9.51301 9.11468 9.32401 9.20101C9.13501 9.28751 8.93918 9.2936 8.73651 9.21927C8.39301 9.08593 8.08184 8.90677 7.80301 8.68177C7.52418 8.45677 7.29943 8.19102 7.12876 7.88452C6.53143 7.90768 6.01768 8.13752 5.58751 8.57402C5.15734 9.01052 4.94226 9.53177 4.94226 10.1378C4.94226 10.7626 5.16051 11.2933 5.59701 11.7298C6.03368 12.1664 6.56543 12.3848 7.19226 12.3848C7.40476 12.3848 7.58293 12.4566 7.72676 12.6003C7.87043 12.7441 7.94226 12.9223 7.94226 13.135C7.94226 13.3475 7.87043 13.5256 7.72676 13.6693C7.58293 13.8128 7.40476 13.8845 7.19226 13.8845C6.82443 13.8845 6.46968 13.8333 6.12801 13.7308C5.78634 13.6283 5.47384 13.4808 5.19051 13.2885C5.13784 13.4103 5.09934 13.5343 5.07501 13.6603C5.05068 13.7863 5.03851 13.9123 5.03851 14.0385C5.03851 14.6653 5.25676 15.1971 5.69326 15.6338C6.12976 16.0703 6.66151 16.2885 7.28851 16.2885C7.66218 16.2885 8.00784 16.2081 8.32551 16.0473C8.64318 15.8863 8.90651 15.6564 9.11551 15.3578C9.24084 15.1811 9.40393 15.077 9.60476 15.0455C9.80543 15.0138 9.99359 15.0605 10.1693 15.1855C10.3449 15.3105 10.4488 15.4727 10.4808 15.672C10.5128 15.8715 10.4647 16.059 10.3365 16.2345C10.0712 16.5962 9.75801 16.8953 9.39701 17.1318C9.03618 17.3683 8.64551 17.5308 8.22501 17.6193C8.24801 18.0168 8.40701 18.3623 8.70201 18.6558C8.99684 18.9494 9.34484 19.0963 9.74601 19.0963C10.167 19.0963 10.5229 18.9513 10.8138 18.6613C11.1046 18.3713 11.25 18.0163 11.25 17.5963Z" fill="currentColor"/>
    </svg>
  );
}

function ChatMicrophoneIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 14C11.8013 14 11.2099 13.758 10.7259 13.274C10.242 12.79 10 12.1987 10 11.5V5.49998C10 4.80128 10.242 4.20993 10.7259 3.72595C11.2099 3.24198 11.8013 3 12.5 3C13.1987 3 13.79 3.24198 14.274 3.72595C14.758 4.20993 15 4.80128 15 5.49998V11.5C15 12.1987 14.758 12.79 14.274 13.274C13.79 13.758 13.1987 14 12.5 14ZM11.75 21.25V17.9538C10.1 17.7653 8.72917 17.0576 7.6375 15.8307C6.54583 14.6038 6 13.1602 6 11.5H7.49997C7.49997 12.8833 7.98747 14.0625 8.96247 15.0375C9.93747 16.0125 11.1166 16.5 12.5 16.5C13.8833 16.5 15.0625 16.0125 16.0375 15.0375C17.0125 14.0625 17.5 12.8833 17.5 11.5H19C19 13.1602 18.4541 14.6038 17.3625 15.8307C16.2708 17.0576 14.8999 17.7653 13.2499 17.9538V21.25H11.75ZM12.5 12.5C12.7833 12.5 13.0208 12.4041 13.2125 12.2125C13.4041 12.0208 13.5 11.7833 13.5 11.5V5.49998C13.5 5.21664 13.4041 4.97914 13.2125 4.78748C13.0208 4.59581 12.7833 4.49998 12.5 4.49998C12.2166 4.49998 11.9791 4.59581 11.7875 4.78748C11.5958 4.97914 11.5 5.21664 11.5 5.49998V11.5C11.5 11.7833 11.5958 12.0208 11.7875 12.2125C11.9791 12.4041 12.2166 12.5 12.5 12.5Z" fill="currentColor"/>
    </svg>
  );
}

// ─── Project item ─────────────────────────────────────────────────────────────

function ProjectItem({ project, children, onLoadThread }: {
  project: ChatThread;
  children: ChatThread[];
  onLoadThread: (t: ChatThread) => void;
}) {
  const { tokens: { semantic: { color } } } = useTheme();
  const [open, setOpen] = useState(true);

  return (
    <Box>
      <Box
        component="button"
        onClick={() => setOpen(o => !o)}
        sx={{
          all: "unset", boxSizing: "border-box", cursor: "pointer",
          display: "flex", width: "100%", px: "4px", py: "8px",
          borderRadius: "8px", alignItems: "center", gap: "8px",
          "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
        }}
      >
        <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", color: color.type.default.value }}>
          <FolderIcon size="md" />
        </Box>
        <Box sx={{ flex: "1 1 0", fontSize: "12px", fontWeight: 500, lineHeight: "16px", color: color.type.default.value, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {project.title}
        </Box>
        <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", color: color.type.muted.value }}>
          {open
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11.9997 16.7077L5.3457 10.0537L6.404 8.99536L11.9997 14.591L17.5953 8.99536L18.6537 10.0537L11.9997 16.7077Z" fill="currentColor"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M13.9463 12.0003L8.35059 6.40466L9.4089 5.34636L15.5089 11.4003L15.063 11.9462L9.4089 18.654L8.35059 17.5957L13.9463 12.0003Z" fill="currentColor"/></svg>}
        </Box>
      </Box>
      {open && children.length > 0 && (
        <Box sx={{ pl: "20px", display: "flex" }}>
          <Box sx={{ flex: "1 1 0" }}>
            {children.map(child => (
              <Box
                key={child.id}
                component="button"
                onClick={() => onLoadThread(child)}
                sx={{
                  all: "unset", boxSizing: "border-box", cursor: "pointer",
                  display: "flex", width: "100%", px: "8px", py: "6px",
                  borderRadius: "8px",
                  fontSize: "12px", lineHeight: "16px", color: color.type.default.value,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                }}
              >
                {child.title}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface SmartAssistSidenavProps {
  open: boolean;
  onClose: () => void;
  onExpand: () => void;
  bookTitle?: string;
  title?: string;
  variant?: "temporary" | "persistent";
  showInsights?: boolean;
  audience?: "admin" | "director";
  hideInsightsFooter?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SmartAssistSidenav({
  open,
  onClose,
  onExpand,
  bookTitle: _bookTitle,
  title,
  variant = "temporary",
  showInsights = false,
  audience = "admin",
  hideInsightsFooter = false,
}: SmartAssistSidenavProps) {
  const { tokens: { semantic: { color, radius, fontWeight }, core: { spacing } } } = useTheme();
  const {
    messages,
    sources,
    isGenerating,
    prompt,
    setPrompt,
    composerFocusNonce,
    requestComposerFocus,
    consumeComposerFocus,
    requestPersonalization,
    handleSend,
    inBook,
    currentBookTitle,
    composerPlaceholder,
    resetChat,
    deleteAllThreads,
    loadThread,
    threads,
    chatTimestamp,
    threadSplitIndex,
    currentThreadId,
    activeTab,
    setActiveTab,
    selectedInsight,
    setSelectedInsight,
    setAudience,
  } = useSmartAssist();

  useEffect(() => {
    setAudience(audience);
  }, [audience, setAudience]);

  const [smartAssistView, setSmartAssistView] = useState<"new-chat" | "thread-list">("new-chat");
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<HTMLElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const composerInputRef = useRef<HTMLTextAreaElement>(null);
  // The composer wrapper element, used to anchor the suggestion dropdown above
  // it. Stored in state (callback ref) so the dropdown re-renders once mounted.
  const [composerAnchor, setComposerAnchor] = useState<HTMLDivElement | null>(null);

  // Thread-list section collapse state
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(() =>
    audience === "director"
      ? new Set(threads.filter(t => STATIC_CHAT_THREADS.some(s => s.id === t.id)).slice(0, 2).map(t => t.id))
      : new Set<string>()
  );
  const handlePin = (id: string, currentlyPinned: boolean) => {
    setPinnedIds(prev => {
      const next = new Set(prev);
      if (currentlyPinned) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const [pinsOpen, setPinsOpen] = useState(true);
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(true);

  // Composer toolbar state
  const [extendedThinking, setExtendedThinking] = useState(false);
  const [toolsMenuAnchor, setToolsMenuAnchor] = useState<HTMLElement | null>(null);
  const [expertSkillsAnchor, setExpertSkillsAnchor] = useState<HTMLElement | null>(null);
  const [agentReportingAnchor, setAgentReportingAnchor] = useState<HTMLElement | null>(null);
  const [searchScopeAnchor, setSearchScopeAnchor] = useState<HTMLElement | null>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [searchScope, setSearchScope] = useState<"books" | "resource" | "dataroom" | "tasks" | "decisions" | "questionnaires" | "book" | null>(inBook ? "book" : null);
  const [activeExpertSkill, setActiveExpertSkill] = useState<string | null>(null);
  const [activeAgentMode, setActiveAgentMode] = useState<string | null>(null);
  const [deepResearchActive, setDeepResearchActive] = useState(false);
  const submenuDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeToolsMenus = () => { if (submenuDelayRef.current) clearTimeout(submenuDelayRef.current); setToolsMenuAnchor(null); setExpertSkillsAnchor(null); setAgentReportingAnchor(null); setSearchScopeAnchor(null); };
  const activeExpertSkillData = activeExpertSkill ? (EXPERT_SKILLS.find(s => s.id === activeExpertSkill) ?? null) : null;
  const activeAgentModeData = activeAgentMode ? (AGENT_REPORTING.find(a => a.id === activeAgentMode) ?? null) : null;
  const searchScopeLabel = searchScope === "book" ? (currentBookTitle ?? "This book") : searchScope === "resource" ? "Resource center" : searchScope === "dataroom" ? "Data room" : searchScope === "tasks" ? "Tasks" : searchScope === "decisions" ? "Decision hub" : searchScope === "questionnaires" ? "Questionnaires" : searchScope === "books" ? "Current & archived books" : "";
  const activeToolsItem = searchScopeAnchor ? "scope" : expertSkillsAnchor ? "expert" : agentReportingAnchor ? "agent" : null;

  const scopedPlaceholder = "Ask anything about your board materials";

  // Extended thinking phase animation
  const THINKING_PHASES = ["Searching documents", "Analyzing context", "Composing response"];
  const [thinkingPhaseIdx, setThinkingPhaseIdx] = useState(0);
  useEffect(() => {
    if (!extendedThinking || !isGenerating) { setThinkingPhaseIdx(0); return; }
    setThinkingPhaseIdx(0);
    const t1 = setTimeout(() => setThinkingPhaseIdx(1), 700);
    const t2 = setTimeout(() => setThinkingPhaseIdx(2), 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isGenerating, extendedThinking]);

  const pinnedThreads = threads.filter(t => pinnedIds.has(t.id));
  const unpinnedThreads = threads.filter(t => !pinnedIds.has(t.id));

  // Focus the composer when a prompt template is selected (here, or via the
  // shared signal when this panel is opened by a selection on another surface
  // such as the admin home rail). Gated on `open` so a closed/other surface
  // never consumes the focus request — the visible panel claims it. Deferred a
  // frame so it wins over the Drawer's focus trap, which grabs focus on enter.
  useEffect(() => {
    if (!open) return;
    if (!consumeComposerFocus()) return;
    const id = requestAnimationFrame(() => {
      const el = composerInputRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    });
    return () => cancelAnimationFrame(id);
  }, [composerFocusNonce, open, consumeComposerFocus]);

  const chatStarted = messages.length > 0;

  // The Insights tab only exists in the GovernAI (book) context. `activeTab`
  // lives in shared context and persists across navigation, so opening Insights
  // inside a book and then opening Smart Assist outside one would otherwise
  // render the Insights view in the chat area. Force the chat tab whenever
  // insights aren't available here.
  const effectiveTab = showInsights ? activeTab : 0;

  const handleTabChange = (idx: number) => {
    setActiveTab(idx);
    if (idx === 0) setSmartAssistView("new-chat");
    if (idx === 1) setSelectedInsight(null);
  };

  const handleNewChat = () => {
    resetChat();
    setSmartAssistView("new-chat");
  };

  const handleLoadThread = (thread: ChatThread) => {
    loadThread(thread.messages, thread.id);
    setSmartAssistView("new-chat");
  };

  const showSubheader =
    (effectiveTab === 0 && smartAssistView === "new-chat") ||
    (effectiveTab === 1 && selectedInsight !== null);
  const insightLabel = selectedInsight === "summary"
    ? "Smart Summary"
    : selectedInsight === "prep"
      ? "Smart Prep"
      : selectedInsight === "risk"
        ? "Smart Risk Scanner"
        : selectedInsight === "audit"
          ? "Audit Smart Prep"
          : null;
  const subheaderLabel =
    effectiveTab === 0
      ? currentThreadId !== null
        ? threads.find((t) => t.id === currentThreadId)?.title ?? "New chat"
        : "New chat"
      : insightLabel;
  const handleSubheaderBack = () => {
    if (effectiveTab === 0) setSmartAssistView("thread-list");
    else setSelectedInsight(null);
  };

  const showInput = effectiveTab === 0 && smartAssistView === "new-chat";

  // Scroll the chat's own container to the bottom without disturbing
  // ancestor scrollers (using scrollIntoView on a sentinel can scroll the
  // whole page when the panel mounts — produces a visible jump on nav).
  const scrollChatToBottom = (smooth: boolean) => {
    const sentinel = messagesEndRef.current;
    if (!sentinel) return;
    let el: HTMLElement | null = sentinel.parentElement;
    while (el && el.scrollHeight <= el.clientHeight) el = el.parentElement;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  };

  // When panel mounts/opens with an active thread, show the chat (not the
  // thread list) and jump to the latest message before paint — useLayoutEffect
  // avoids the flicker of seeing scrollTop=0 between mount and a deferred scroll.
  useLayoutEffect(() => {
    if (open && currentThreadId !== null) {
      setSmartAssistView("new-chat");
      scrollChatToBottom(false);
    }
  }, [open]);

  // Scroll to bottom whenever a new message arrives
  useEffect(() => {
    if (messages.length > 0) {
      scrollChatToBottom(true);
    }
  }, [messages.length]);

  return (
    <>
    <Drawer
      anchor="right"
      open={open}
      variant={variant}
      onClose={onClose}
      // Keep the paper's slide in lockstep with the root width transition above
      // and with the home hero, so opening/closing reads as one coordinated move.
      transitionDuration={300}
      SlideProps={{ easing: "cubic-bezier(0.2, 0, 0, 1)" }}
      sx={{
        width: open ? DRAWER_WIDTH + 24 : 0,
        minWidth: 0,
        overflow: "hidden",
        flexShrink: 0,
        // Animate the layout slot so closing slides the panel out in step with
        // the home hero re-expanding, instead of snapping width to 0 (which
        // clipped the paper and made the panel vanish instantly). Matches the
        // hero's easing so the two move together.
        transition: "width 300ms cubic-bezier(0.2, 0, 0, 1)",
        ...(variant === "persistent" && { height: "100%" }),
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          padding: 0,
          border: `1px solid ${color.outline.fixed.value}`,
          boxShadow: "none",
          display: "flex",
          flexDirection: "column",
          gap: 0,
          overflow: "hidden",
          borderRadius: "12px",
          marginTop: "12px",
          marginRight: "12px",
          marginBottom: "12px",
          marginLeft: "12px",
          position: variant === "persistent" ? "relative" : "fixed",
          height: variant === "persistent" ? "calc(100% - 24px)" : "calc(100vh - 24px)",
        },
      }}
    >
      {/* ── Header ── */}
      <Box
        sx={{
          position: "relative",
          flexShrink: 0,
          backgroundColor: color.surface.default.value,
        }}
      >
        {/* Title row */}
        <Stack
          direction="row"
          alignItems="center"
          gap="12px"
          sx={{ px: "12px", pt: "12px", pb: "12px" }}
        >
          <Stack direction="row" alignItems="center" gap="8px" sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: AI_PURPLE }}>
              <AiSparkleIcon size="lg" />
            </Box>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "20px",
                color: color.type.default.value,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {title ?? "Ask GovernAI"}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" gap="6px" sx={{ flexShrink: 0 }}>
            <IconButton sx={{ p: "4px", width: 32, height: 32 }} title="Notifications">
              <BellIcon size="lg" />
            </IconButton>
            <IconButton sx={{ p: "4px", width: 32, height: 32 }} title="More options" onClick={(e) => setMoreMenuAnchor(e.currentTarget)}>
              <MoreIcon size="lg" />
            </IconButton>
            <IconButton sx={{ p: "4px", width: 32, height: 32 }} onClick={onExpand} title="Open full screen">
              <FullscreenIcon size="lg" />
            </IconButton>
            <IconButton sx={{ p: "4px", width: 32, height: 32 }} onClick={onClose} title="Close">
              <CloseIcon size="lg" />
            </IconButton>
          </Stack>
        </Stack>

        {/* Tabs row — only in GovernAI (book) context */}
        {showInsights && (
          /* Classic Atlas light-theme tabs. The Atlas theme draws the
             full-width bottom divider and the active underline; only inset the
             labels to the panel's 16px gutter so the divider stays edge-to-edge. */
          <Box sx={{ flexShrink: 0 }}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => handleTabChange(v)}
              aria-label="Ask GovernAI sections"
              // The group's continuous bottom divider ships at zIndex -1, which
              // hides it behind the panel background and leaves a gap between the
              // per-tab dividers. Lift it to 0 so it reads as one edge-to-edge
              // line under the whole tab group (full panel width in the dock).
              sx={{ "& .MuiTabs-flexContainer": { pl: "16px" }, "&::after": { zIndex: 0 } }}
            >
              <Tab label="Ask GovernAI" id="sa-panel-tab-0" aria-controls="sa-panel-tabpanel-0" />
              <Tab label="Insights" id="sa-panel-tab-1" aria-controls="sa-panel-tabpanel-1" />
            </Tabs>
          </Box>
        )}

      </Box>

      {/* ── Subheader (secondary navigation) ── */}
      {showSubheader && (
        <Stack
          direction="row"
          alignItems="center"
          gap="4px"
          sx={{
            flexShrink: 0,
            // Align the secondary-nav gutter to the tab inset, fix the row to
            // 40px tall, and drop the top border when tabs are present — the
            // tab strip already draws the divider above, so a second line would
            // double it up.
            px: "16px",
            py: "4px",
            height: "40px",
            borderTop: showInsights ? "none" : `1px solid ${color.ui.divider.default.value}`,
            backgroundColor: color.surface.default.value,
          }}
        >
          <IconButton sx={{ p: "4px", width: 32, height: 32 }} onClick={handleSubheaderBack} title="Back">
            <ArrowLeftIcon size="lg" />
          </IconButton>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "20px",
              color: color.type.default.value,
              flex: 1,
              minWidth: 0,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              overflowWrap: "anywhere",
            }}
          >
            {subheaderLabel}
          </Typography>
        </Stack>
      )}

      {/* Accent border at the bottom of the full header area. Suppressed when
          the tab group is shown without a subheader — the tab strip's own bottom
          divider already closes the header, so a second line would double it. */}
      {!(showInsights && !showSubheader) && (
        <Box sx={{ height: "1px", flexShrink: 0, background: color.ui.divider.default.value }} />
      )}

      {/* ── Smart Assist tab — new chat ── */}
      {effectiveTab === 0 && smartAssistView === "new-chat" && (
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            pt: "16px",
            px: "16px",
            pb: "16px",
            background: THREAD_BG,
          }}
        >
          {!chatStarted ? (
            <Box sx={{ minHeight: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", pb: "16px" }}>
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 600,
                  lineHeight: "28px",
                  color: color.type.default.value,
                  mt: "8px",
                  mb: "24px",
                  // 8px side padding lines the title's text up with the (plain,
                  // borderless) chips' content below it.
                  px: "8px",
                }}
              >
                What would you like to know?
              </Typography>
              {/* Suggestion chips — in the panel all five render as a plain
                  (borderless) vertical list. Shared with the home hero (small)
                  and full-screen view, which instead show three outlined chips
                  plus a "Show more" overflow. Clicking populates the composer. */}
              <SuggestionChips
                size="large"
                align="flex-start"
                audience={audience}
                variant="plain"
                layout="list"
                promptSet="default"
                showLearn={false}
                anchorEl={composerAnchor}
                onSelectPrompt={(p) => { setPrompt(p); requestComposerFocus(); }}
                onSubmitPrompt={(p) => handleSend(p)}
                onChipOpen={requestComposerFocus}
              />
            </Box>
          ) : (
            <Box sx={{ "& .AtlasAIChatUserMessage .MuiTypography-body1": { fontSize: "14px !important" }, "& li": { fontSize: "14px" } }}>
            <AIChatContent>
              {chatTimestamp && threadSplitIndex === null && <AIChatTimestamp time={chatTimestamp} />}
              {messages.map((msg, index) => (
                <Fragment key={msg.id}>
                  {chatTimestamp && threadSplitIndex !== null && threadSplitIndex >= 0 && index === threadSplitIndex && (
                    <AIChatTimestamp time={chatTimestamp} />
                  )}
                  {msg.role === "user" ? (
                    <AIChatUserMessage
                      alignment="end"
                      message={msg.content}
                      header={
                        <AIChatMessageHeader
                          name={audience === "director" ? "Josh Doe" : "Jane Doe"}
                          time={msg.timestamp}
                          avatar={
                            <AIChatMessageAvatar
                              uniqueId={audience === "director" ? "josh-doe" : "jane-doe"}
                              initials="JD"
                            />
                          }
                          slotProps={{ root: { sx: { flexDirection: "row-reverse" } } }}
                        />
                      }
                      slotProps={{
                        root: {
                          sx: {
                            "& > div:last-child": {
                              boxShadow: "inset 0 0 0 1px #DEE0E9 !important",
                            },
                          },
                        },
                      }}
                    />
                  ) : (
                    <AIChatAIMessage
                      header={
                        <AIChatMessageHeader
                          name="Ask GovernAI"
                          time={msg.timestamp}
                          avatar={<AIChatMessageAvatar uniqueId="smart-assist" imageUrl={smartAssistAvatarUrl} avatarProps={{ sx: { borderRadius: "8px", backgroundColor: "transparent", border: "none", boxShadow: "none" } }} />}
                        />
                      }
                      footer={
                        <AIChatMessageFooter
                          leadingActions={
                            <Button variant="text" size="small" startIcon={<ReloadIcon size="md" />}>
                              Regenerate
                            </Button>
                          }
                        />
                      }
                    >
                      {msg.richContent
                        ? <RichAIMessageContent blocks={msg.richContent} sources={msg.sources} messageId={msg.id} />
                        : /\[\d+\]/.test(msg.content) && msg.sources
                          ? <RichAIMessageContent blocks={[{ type: "p", spans: parseCiteText(msg.content) }]} sources={msg.sources} messageId={msg.id} />
                          : <AIChatMessageTextBlock>{msg.content}</AIChatMessageTextBlock>
                      }
                      {msg.sources && msg.sources.length > 0 && (
                        <SourcesBlock sources={msg.sources} messageId={msg.id} />
                      )}
                    </AIChatAIMessage>
                  )}
                </Fragment>
              ))}
              {isGenerating && (
                <AIChatAIMessage
                  header={
                    <AIChatMessageHeader
                      name="Ask GovernAI"
                      time=""
                      avatar={<AIChatMessageAvatar uniqueId="smart-assist-thinking" imageUrl={smartAssistAvatarUrl} avatarProps={{ sx: { borderRadius: "8px", backgroundColor: "transparent", border: "none", boxShadow: "none" } }} />}
                    />
                  }
                >
                  <AIChatThinkingIndicator label={extendedThinking ? THINKING_PHASES[thinkingPhaseIdx] : "Thinking"} />
                </AIChatAIMessage>
              )}
              <div ref={messagesEndRef} />
            </AIChatContent>
            </Box>
          )}
        </Box>
      )}

      {/* ── Smart Assist tab — thread list ── */}
      {effectiveTab === 0 && smartAssistView === "thread-list" && (
        <>
        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", background: THREAD_BG, pt: "8px", px: "12px", pb: "16px" }}>


          {/* New chat */}
          <Box sx={{ px: "4px", mb: "4px" }}>
            <Box
              component="button"
              onClick={handleNewChat}
              sx={{
                all: "unset", boxSizing: "border-box", cursor: "pointer",
                display: "flex", width: "100%", px: "4px", py: "8px",
                borderRadius: "12px", alignItems: "center", gap: "8px",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
              }}
            >
              <Box sx={{ width: 20, height: 20, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: color.type.default.value }}>
                <AddCircleIcon size="md" />
              </Box>
              <Box sx={{ flex: "1 1 0", fontSize: "12px", fontWeight: 400, lineHeight: "16px", color: color.type.default.value }}>New chat</Box>
            </Box>
          </Box>

          {/* Tasks nav item */}
          <Box sx={{ px: "4px", mb: "4px" }}>
            <Box
              component="button"
              sx={{
                all: "unset", boxSizing: "border-box", cursor: "pointer",
                display: "flex", width: "100%", px: "4px", py: "8px",
                borderRadius: "12px", alignItems: "center", gap: "8px",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
              }}
            >
              <Box sx={{ width: 20, height: 20, flexShrink: 0, display: "flex", alignItems: "center", color: color.type.default.value }}><TaskIcon size="md" /></Box>
              <Box sx={{ flex: "1 1 0", fontSize: "12px", fontWeight: 400, lineHeight: "16px", color: color.type.default.value }}>Tasks</Box>
            </Box>
          </Box>

          {/* Sections */}
          <Box sx={{ pt: "8px", display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Pinned */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <Box
                onClick={() => setPinsOpen(o => !o)}
                sx={{ cursor: "pointer", display: "flex", width: "100%", px: "8px", py: "8px", borderRadius: "12px", alignItems: "center", gap: "8px", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}
              >
                <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", color: color.type.default.value }}><PinIcon size="md" /></Box>
                <Box sx={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Box sx={{ color: color.type.default.value, fontSize: "12px", fontWeight: 400, lineHeight: "16px" }}>Pinned</Box>
                  <Box sx={{ display: "flex", alignItems: "center", color: color.type.default.value }}>
                    {pinsOpen
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11.9997 16.7077L5.3457 10.0537L6.404 8.99536L11.9997 14.591L17.5953 8.99536L18.6537 10.0537L11.9997 16.7077Z" fill="currentColor"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M13.9463 12.0003L8.35059 6.40466L9.4089 5.34636L15.5089 11.4003L15.063 11.9462L9.4089 18.654L8.35059 17.5957L13.9463 12.0003Z" fill="currentColor"/></svg>}
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }} />
              </Box>
              {pinsOpen && (
                pinnedThreads.length === 0 ? (
                  <Typography sx={{ fontSize: "12px", lineHeight: "16px", color: color.type.muted.value, pl: "20px", pt: "2px" }}>No pinned items</Typography>
                ) : (
                  <Box sx={{ pl: "16px", display: "flex" }}>
                    <Box sx={{ flex: "1 1 0" }}>
                      {pinnedThreads.map((thread) => (
                        <ChatThreadItem key={thread.id} thread={thread} variant="sidenav" onLoadThread={handleLoadThread} onNewChat={handleNewChat} isPinned onPin={handlePin} />
                      ))}
                      <Box component="button" sx={{ all: "unset", cursor: "pointer", display: "flex", pl: "12px", pr: "4px", py: "8px", borderRadius: "12px", "&:hover": { opacity: 0.8 } }}>
                        <Box sx={{ color: "#1C4EE4", fontSize: "12px", fontWeight: 600, lineHeight: "16px" }}>View all</Box>
                      </Box>
                    </Box>
                  </Box>
                )
              )}
            </Box>

            {/* Projects */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <Box
                onClick={() => setProjectsOpen(o => !o)}
                sx={{ cursor: "pointer", display: "flex", width: "100%", px: "8px", py: "8px", borderRadius: "12px", alignItems: "center", gap: "8px", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}
              >
                <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", color: color.type.default.value }}><FolderIcon size="md" /></Box>
                <Box sx={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Box sx={{ color: color.type.default.value, fontSize: "12px", fontWeight: 400, lineHeight: "16px" }}>Projects</Box>
                  <Box sx={{ display: "flex", alignItems: "center", color: color.type.default.value }}>
                    {projectsOpen
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11.9997 16.7077L5.3457 10.0537L6.404 8.99536L11.9997 14.591L17.5953 8.99536L18.6537 10.0537L11.9997 16.7077Z" fill="currentColor"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M13.9463 12.0003L8.35059 6.40466L9.4089 5.34636L15.5089 11.4003L15.063 11.9462L9.4089 18.654L8.35059 17.5957L13.9463 12.0003Z" fill="currentColor"/></svg>}
                  </Box>
                </Box>
              </Box>
              {projectsOpen && (() => {
                const staticProjects = STATIC_CHAT_THREADS.filter(t => t.isProject);
                if (staticProjects.length === 0) {
                  return <Typography sx={{ fontSize: "12px", lineHeight: "16px", color: color.type.muted.value, pl: "20px", pt: "2px" }}>No projects yet</Typography>;
                }
                return (
                  <Box sx={{ pl: "16px", display: "flex" }}>
                    <Box sx={{ flex: "1 1 0" }}>
                      {staticProjects.map(project => {
                        const children = STATIC_CHAT_THREADS.filter(t => t.projectId === project.id);
                        return <ProjectItem key={project.id} project={project} children={children} onLoadThread={handleLoadThread} />;
                      })}
                      <Box component="button" sx={{ all: "unset", cursor: "pointer", display: "flex", pl: "12px", pr: "4px", py: "8px", borderRadius: "12px", "&:hover": { opacity: 0.8 } }}>
                        <Box sx={{ color: "#1C4EE4", fontSize: "12px", fontWeight: 600, lineHeight: "16px" }}>View all</Box>
                      </Box>
                    </Box>
                  </Box>
                );
              })()}
            </Box>

            {/* Chat history */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <Box
                onClick={() => setHistoryOpen(o => !o)}
                sx={{ cursor: "pointer", display: "flex", width: "100%", px: "8px", py: "8px", borderRadius: "12px", alignItems: "center", gap: "8px", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}
              >
                <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", color: color.type.default.value }}><MessageIcon size="md" /></Box>
                <Box sx={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Box sx={{ color: color.type.default.value, fontSize: "12px", fontWeight: 400, lineHeight: "16px" }}>Chat history</Box>
                  <Box sx={{ display: "flex", alignItems: "center", color: color.type.default.value }}>
                    {historyOpen
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11.9997 16.7077L5.3457 10.0537L6.404 8.99536L11.9997 14.591L17.5953 8.99536L18.6537 10.0537L11.9997 16.7077Z" fill="currentColor"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M13.9463 12.0003L8.35059 6.40466L9.4089 5.34636L15.5089 11.4003L15.063 11.9462L9.4089 18.654L8.35059 17.5957L13.9463 12.0003Z" fill="currentColor"/></svg>}
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }} />
                {unpinnedThreads.length > 0 && <DeleteAllChatsMenu onDeleteAll={deleteAllThreads} />}
              </Box>
              {historyOpen && (
                unpinnedThreads.length === 0 ? (
                  <Typography sx={{ fontSize: "12px", lineHeight: "16px", color: color.type.muted.value, pl: "20px", pt: "2px" }}>No recent chats</Typography>
                ) : (
                  <Box sx={{ pl: "16px", display: "flex" }}>
                    <Box sx={{ flex: "1 1 0" }}>
                      {unpinnedThreads.map((thread) => (
                        <ChatThreadItem key={thread.id} thread={thread} variant="sidenav" onLoadThread={handleLoadThread} onNewChat={handleNewChat} isPinned={false} onPin={handlePin} />
                      ))}
                      <Box component="button" sx={{ all: "unset", cursor: "pointer", display: "flex", pl: "12px", pr: "4px", py: "8px", borderRadius: "12px", "&:hover": { opacity: 0.8 } }}>
                        <Box sx={{ color: "#1C4EE4", fontSize: "12px", fontWeight: 600, lineHeight: "16px" }}>View all</Box>
                      </Box>
                    </Box>
                  </Box>
                )
              )}
            </Box>

          </Box>

        </Box>
        {/* Thread-list sticky footer */}
        <Box
          sx={{
            flexShrink: 0,
            borderTop: `1px solid ${color.ui.divider.default.value}`,
            px: "4px",
            py: "8px",
            backgroundColor: color.surface.default.value,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Expert skills */}
          <Box
            component="button"
            sx={{ all: "unset", boxSizing: "border-box", cursor: "pointer", display: "flex" }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                px: "12px",
                py: "8px",
                borderRadius: "12px",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
              }}
            >
              <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", color: color.type.default.value }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.2213 14.7884H12.7789L12.8905 13.7019C13.0879 13.6519 13.2729 13.5791 13.4453 13.4836C13.6177 13.3881 13.7649 13.2698 13.8867 13.1288L14.8636 13.5807L15.6424 12.2558L14.777 11.6115C14.8488 11.4077 14.8847 11.2038 14.8847 11C14.8847 10.7961 14.8488 10.5923 14.777 10.3884L15.6424 9.7442L14.8636 8.41923L13.8867 8.87115C13.7649 8.73012 13.6177 8.61184 13.4453 8.51633C13.2729 8.42081 13.0879 8.34805 12.8905 8.29805L12.7789 7.21153H11.2213L11.1097 8.29805C10.9123 8.34805 10.7274 8.42081 10.5549 8.51633C10.3825 8.61184 10.2354 8.73012 10.1136 8.87115L9.13667 8.41923L8.35784 9.7442L9.22322 10.3884C9.15142 10.5923 9.11552 10.7961 9.11552 11C9.11552 11.2038 9.15142 11.4077 9.22322 11.6115L8.35784 12.2558L9.13667 13.5807L10.1136 13.1288C10.2354 13.2698 10.3825 13.3881 10.5549 13.4836C10.7274 13.5791 10.9123 13.6519 11.1097 13.7019L11.2213 14.7884ZM12.0001 12.6827C11.5322 12.6827 11.1347 12.5192 10.8078 12.1923C10.4809 11.8654 10.3174 11.4679 10.3174 11C10.3174 10.532 10.4809 10.1346 10.8078 9.80765C11.1347 9.48073 11.5322 9.31728 12.0001 9.31728C12.4681 9.31728 12.8655 9.48073 13.1924 9.80765C13.5194 10.1346 13.6828 10.532 13.6828 11C13.6828 11.4679 13.5194 11.8654 13.1924 12.1923C12.8655 12.5192 12.4681 12.6827 12.0001 12.6827ZM6.50014 21.5V17.4692C5.55014 16.6025 4.81264 15.6093 4.28764 14.4894C3.76264 13.3695 3.50014 12.2032 3.50014 10.9904C3.50014 8.6314 4.32707 6.6266 5.98092 4.97595C7.63475 3.32532 9.64115 2.5 12.0001 2.5C13.9424 2.5 15.6793 3.08045 17.2107 4.24135C18.7421 5.40225 19.7366 6.90833 20.1943 8.7596L21.6308 14.5H18.5001V19.5H14.5001V21.5H13.0001V18H17.0001V13H19.7001L18.7501 9.12498C18.3668 7.60189 17.5469 6.36696 16.2905 5.42018C15.0341 4.47338 13.604 3.99998 12.0001 3.99998C10.0668 3.99998 8.41678 4.67658 7.05012 6.02978C5.68345 7.38299 5.00012 9.02627 5.00012 10.9596C5.00012 11.9596 5.20428 12.908 5.61262 13.8048C6.02095 14.7016 6.60012 15.5 7.35012 16.2L8.00012 16.8V21.5H6.50014Z" fill="currentColor"/>
                </svg>
              </Box>
              <Box sx={{ fontSize: "14px", fontWeight: 400, lineHeight: "20px", letterSpacing: "0.2px", color: color.type.default.value }}>
                Expert skills
              </Box>
            </Box>
          </Box>

          {/* Preferences */}
          <Box
            component="button"
            onClick={requestPersonalization}
            sx={{ all: "unset", boxSizing: "border-box", cursor: "pointer", display: "flex" }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                px: "12px",
                py: "8px",
                borderRadius: "12px",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
              }}
            >
              <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", color: color.type.default.value }}>
                <SettingsIcon size="md" />
              </Box>
              <Box sx={{ fontSize: "14px", fontWeight: 400, lineHeight: "20px", letterSpacing: "0.2px", color: color.type.default.value }}>
                Preferences
              </Box>
            </Box>
          </Box>
        </Box>
        </>
      )}

      {/* ── Insights tab — feature list ── */}
      {effectiveTab === 1 && selectedInsight === null && (
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            px: "16px",
            pt: "24px",
            pb: "16px",
            background: THREAD_BG,
          }}
        >
          {audience === "director" && (
            <Stack gap={spacing["1"].value} sx={{ mb: spacing["3"].value }}>
              <Typography variant="body1" sx={{ fontWeight: fontWeight.emphasis.value, color: color.type.default.value }}>
                Your own AI governance advisor: Instant insights for better governance
              </Typography>
              <Typography variant="textMd" sx={{ color: color.type.muted.value }}>
                Insights brings intelligent assistance to streamline the way boards and executives prepare for, participate in, and follow up on meetings. Backed by Diligent's 20+ years of governance expertise and built with enterprise-grade security, sharpen your focus and unlock faster insights with AI-powered governance.
              </Typography>
            </Stack>
          )}
          <Stack gap="12px" sx={{ mt: audience === "director" ? 0 : spacing["1"].value }}>
            {(audience === "director"
              ? ([
                  { Icon: SmartSummaryIcon, id: "summary", label: "Smart Summary", desc: "Read a summary before or after reviewing materials" },
                  { Icon: SmartPrepIcon, id: "prep", label: "Smart Prep", desc: "Prepare confidently with suggested discussion topics and questions" },
                  { Icon: SmartRiskScannerIcon, id: "risk", label: "Smart Risk Scanner", desc: "Identify potential business risks" },
                  { Icon: AuditSmartPrepIcon, id: "audit" as const, label: "Audit Smart Prep", desc: "Prepare for the audit committee with an expert lens" },
                ] as const)
              : ([
                  { Icon: SmartSummaryIcon, id: "summary", label: "Smart Summary", desc: "Create and read an accurate executive summary" },
                  { Icon: SmartPrepIcon, id: "prep", label: "Smart Prep", desc: "Prepare smarter with suggested discussion topics" },
                  { Icon: SmartRiskScannerIcon, id: "risk", label: "Smart Risk Scanner", desc: "Identify potential business risks" },
                  { Icon: AuditSmartPrepIcon, id: "audit" as const, label: "Audit Smart Prep", desc: "Prepare for the audit committee with an expert lens" },
                ] as const)
            ).map(({ Icon, id, label, desc }) => (
              <Box
                key={label}
                component="button"
                onClick={() => setSelectedInsight(id)}
                sx={{
                  all: "unset",
                  boxSizing: "border-box",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  p: "16px",
                  border: `1px solid ${color.ui.divider.default.value}`,
                  borderRadius: "12px",
                  backgroundColor: color.surface.default.value,
                  width: "100%",
                  transition: "background-color 0.15s ease",
                  "&:hover": { backgroundColor: color.surface.variant.value },
                }}
              >
                <Box sx={{ flexShrink: 0, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={24} />
                </Box>
                <Stack gap="4px" sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body1" sx={{ fontWeight: fontWeight.emphasis.value, color: color.type.default.value }}>
                    {label}
                  </Typography>
                  <Typography variant="textMd" sx={{ alignSelf: "stretch", color: color.type.muted.value }}>
                    {desc}
                  </Typography>
                </Stack>
                <Box sx={{ flexShrink: 0, p: "4px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#242628" }}>
                  <ExpandRightIcon size="lg" />
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* ── Insights tab — feature view ── */}
      {effectiveTab === 1 && selectedInsight !== null && (
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            pt: "16px",
            px: "16px",
            pb: "16px",
            background: THREAD_BG,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: "16px" }}>
            <Typography sx={{ fontSize: "12px", lineHeight: "16px", color: color.type.muted.value }}>
              Updated: April 23, 2024, 9:03 AM
            </Typography>
            <AiBadge />
          </Stack>

          {selectedInsight === "summary" && <InsightSummaryView />}
          {selectedInsight === "prep" && <InsightPrepView />}
          {selectedInsight === "risk" && <InsightRiskView />}
          {selectedInsight === "audit" && <InsightAuditView />}
        </Box>
      )}

      {/* ── Insights footer (Regenerate) ── */}
      {effectiveTab === 1 && !hideInsightsFooter && (
        <Box
          sx={{
            flexShrink: 0,
            px: "16px",
            py: "12px",
            borderTop: `1px solid ${color.ui.divider.default.value}`,
            backgroundColor: color.surface.default.value,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Box
            component="button"
            sx={{
              all: "unset",
              boxSizing: "border-box",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              px: "12px",
              height: "32px",
              borderRadius: "8px",
              border: "1px solid transparent",
              background:
                "linear-gradient(#fff, #fff) padding-box, linear-gradient(128deg, #b11f62 17.49%, #1c4ee4 100%) border-box",
              transition: "background 0.15s ease",
              "&:hover": {
                background:
                  "linear-gradient(#f3f3f3, #f3f3f3) padding-box, linear-gradient(128deg, #b11f62 17.49%, #1c4ee4 100%) border-box",
              },
            }}
          >
            <Box sx={{ width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AiSparkleIcon size="md" />
            </Box>
            <Box sx={{ height: 20, display: "flex", alignItems: "center" }}>
              <Typography sx={{ fontSize: "14px", fontWeight: 600, lineHeight: "20px", letterSpacing: "0.2px", color: "#242628" }}>
                Regenerate
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* ── Input area (Smart Assist / new chat only) ── */}
      {showInput && <Box ref={setComposerAnchor} sx={{ position: "relative", flexShrink: 0, backgroundColor: color.surface.default.value }}>
        {/* AI gradient highlight top border */}
        <Box
          sx={{
            height: "1px",
            background: `linear-gradient(90deg, transparent 0%, ${color.ai.default.gradientStart.value} 15%, ${color.ai.default.gradientMiddle.value} 50%, ${color.ai.default.gradientEnd.value} 85%, transparent 100%)`,
          }}
        />
        {/* Focus-ring wrapper: 2px inset ring drawn via pseudo-element on focus,
            so it appears around the input area without shifting layout. */}
        <Box
          sx={{
            position: "relative",
            "&:focus-within::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              boxShadow: `inset 0 0 0 2px ${color.action.primary.default.value}`,
            },
          }}
        >
        <InputBase
          multiline
          fullWidth
          inputRef={composerInputRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && prompt.trim()) {
              e.preventDefault();
              handleSend(prompt);
            }
          }}
          placeholder={scopedPlaceholder}
          sx={{
            color: color.type.default.value,
            "& .MuiInputBase-input": { padding: "16px 24px 12px !important", height: "80px !important", overflow: "auto !important", fontSize: "14px !important", lineHeight: "20px !important" },
            "& .MuiInputBase-input::placeholder": { color: color.type.muted.value, opacity: 1 },
            alignItems: "flex-start",
          }}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: "8px",
            pb: "8px",
          }}
        >
          {/* Leading: attach + tools + sources */}
          <Stack direction="row" alignItems="center" gap="2px">
            <input type="file" ref={attachmentInputRef} style={{ display: "none" }} />
            <Tooltip title="Attach file">
              <IconButton
                size="small"
                onClick={() => attachmentInputRef.current?.click()}
                sx={{ width: 32, height: 32, p: "4px", borderRadius: "8px", color: color.type.default.value }}
              >
                <UploadFileIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Tools">
              <IconButton
                size="small"
                onClick={(e) => setToolsMenuAnchor(toolsMenuAnchor ? null : e.currentTarget)}
                sx={{ width: 32, height: 32, p: "4px", borderRadius: "8px", color: color.type.default.value }}
              >
                <ToolsSliderIcon />
              </IconButton>
            </Tooltip>
            {webSearchEnabled && (
              <Chip
                variant="outlined"
                size="small"
                icon={<svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M10 18.3333C8.84722 18.3333 7.76389 18.1146 6.75 17.6771C5.73611 17.2396 4.85417 16.6424 4.10417 15.8854C3.35417 15.1285 2.76042 14.2396 2.32292 13.2188C1.88542 12.1979 1.66667 11.1111 1.66667 9.95833C1.66667 8.80556 1.88542 7.72222 2.32292 6.70833C2.76042 5.69444 3.35417 4.81597 4.10417 4.07292C4.85417 3.32986 5.73611 2.73958 6.75 2.30208C7.76389 1.86458 8.84722 1.64583 10 1.64583C11.1528 1.64583 12.2361 1.86458 13.25 2.30208C14.2639 2.73958 15.1458 3.32986 15.8958 4.07292C16.6458 4.81597 17.2396 5.69444 17.677 6.70833C18.1146 7.72222 18.3333 8.80556 18.3333 9.95833C18.3333 11.1111 18.1146 12.1979 17.677 13.2188C17.2396 14.2396 16.6458 15.1285 15.8958 15.8854C15.1458 16.6424 14.2639 17.2396 13.25 17.6771C12.2361 18.1146 11.1528 18.3333 10 18.3333ZM10 16.8542C10.3889 16.3264 10.7257 15.7674 11.0104 15.1771C11.2951 14.5868 11.5278 13.9444 11.7083 13.25H8.29167C8.47222 13.9444 8.70486 14.5868 8.98958 15.1771C9.27431 15.7674 9.61111 16.3264 10 16.8542ZM8.10417 16.5833C7.84722 16.1111 7.61806 15.6007 7.41667 15.0521C7.21528 14.5035 7.04167 13.9028 6.89583 13.25H3.77083C4.25 14.1667 4.89236 14.9444 5.69792 15.5833C6.50347 16.2222 7.25 16.5069 8.10417 16.5833ZM11.8958 16.5833C12.75 16.5069 13.4965 16.2222 14.302 15.5833C15.1076 14.9444 15.75 14.1667 16.2292 13.25H13.1042C12.9583 13.9028 12.7847 14.5035 12.5833 15.0521C12.3819 15.6007 12.1528 16.1111 11.8958 16.5833ZM3.22917 11.75H6.64583C6.60417 11.4861 6.57292 11.2257 6.55208 10.9688C6.53125 10.7118 6.52083 10.3542 6.52083 9.95833C6.52083 9.5625 6.53125 9.20486 6.55208 8.94792C6.57292 8.69097 6.60417 8.44444 6.64583 8.20833H3.22917C3.15972 8.44444 3.10764 8.69097 3.07292 8.94792C3.03819 9.20486 3.02083 9.5625 3.02083 9.95833C3.02083 10.3542 3.03819 10.7118 3.07292 10.9688C3.10764 11.2257 3.15972 11.4861 3.22917 11.75ZM8.10417 11.75H11.8958C11.9375 11.4861 11.9688 11.2257 11.9896 10.9688C12.0104 10.7118 12.0208 10.3542 12.0208 9.95833C12.0208 9.5625 12.0104 9.20486 11.9896 8.94792C11.9688 8.69097 11.9375 8.44444 11.8958 8.20833H8.10417C8.0625 8.44444 8.03125 8.69097 8.01042 8.94792C7.98958 9.20486 7.97917 9.5625 7.97917 9.95833C7.97917 10.3542 7.98958 10.7118 8.01042 10.9688C8.03125 11.2257 8.0625 11.4861 8.10417 11.75ZM13.3542 11.75H16.7708C16.8403 11.4861 16.8924 11.2257 16.9271 10.9688C16.9618 10.7118 16.9792 10.3542 16.9792 9.95833C16.9792 9.5625 16.9618 9.20486 16.9271 8.94792C16.8924 8.69097 16.8403 8.44444 16.7708 8.20833H13.3542C13.3958 8.44444 13.4271 8.69097 13.4479 8.94792C13.4688 9.20486 13.4792 9.5625 13.4792 9.95833C13.4792 10.3542 13.4688 10.7118 13.4479 10.9688C13.4271 11.2257 13.3958 11.4861 13.3542 11.75ZM13.1042 6.70833H16.2292C15.75 5.79167 15.1076 5.01389 14.302 4.375C13.4965 3.73611 12.75 3.45139 11.8958 3.375C12.1528 3.84722 12.3819 4.35764 12.5833 4.90625C12.7847 5.45486 12.9583 6.05556 13.1042 6.70833ZM8.29167 6.70833H11.7083C11.5278 6.01389 11.2951 5.37153 11.0104 4.78125C10.7257 4.19097 10.3889 3.63194 10 3.10417C9.61111 3.63194 9.27431 4.19097 8.98958 4.78125C8.70486 5.37153 8.47222 6.01389 8.29167 6.70833ZM3.77083 6.70833H6.89583C7.04167 6.05556 7.21528 5.45486 7.41667 4.90625C7.61806 4.35764 7.84722 3.84722 8.10417 3.375C7.25 3.45139 6.50347 3.73611 5.69792 4.375C4.89236 5.01389 4.25 5.79167 3.77083 6.70833Z" fill="currentColor"/></svg>}
                label=""
                onDelete={() => setWebSearchEnabled(false)}
                sx={{ alignSelf: "center", height: 24, borderRadius: "9999px", borderColor: "#888B9A", color: color.type.default.value, "& .MuiChip-label": { padding: 0, width: 0 }, "& .MuiChip-icon": { ml: "6px", color: color.type.default.value }, "& .MuiChip-deleteIcon": { mr: "4px" } }}
              />
            )}
            {searchScope !== null && (
              <Chip
                variant="outlined"
                size="small"
                icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.8894 16.6474L10.9263 11.6843C10.5096 12.0005 10.0527 12.2454 9.55559 12.4191C9.05848 12.5927 8.54553 12.6795 8.01674 12.6795C6.71694 12.6795 5.61196 12.2245 4.7018 11.3146C3.79163 10.4047 3.33655 9.30026 3.33655 8.00133C3.33655 6.70238 3.79151 5.59751 4.70142 4.68672C5.61134 3.77595 6.71577 3.32056 8.01471 3.32056C9.31365 3.32056 10.4185 3.77564 11.3293 4.68581C12.2401 5.59597 12.6955 6.70095 12.6955 8.00074C12.6955 8.54556 12.606 9.06653 12.427 9.56364C12.2481 10.0608 12.0058 10.5096 11.7003 10.9103L16.6634 15.8734L15.8894 16.6474ZM8.01601 11.5962C9.02028 11.5962 9.87071 11.2479 10.5673 10.5513C11.2639 9.85472 11.6122 9.00429 11.6122 8.00002C11.6122 6.99574 11.2639 6.14531 10.5673 5.44872C9.87071 4.75214 9.02028 4.40385 8.01601 4.40385C7.01173 4.40385 6.1613 4.75214 5.46471 5.44872C4.76815 6.14531 4.41986 6.99574 4.41986 8.00002C4.41986 9.00429 4.76815 9.85472 5.46471 10.5513C6.1613 11.2479 7.01173 11.5962 8.01601 11.5962Z" fill="currentColor"/></svg>}
                label={searchScopeLabel}
                onDelete={() => setSearchScope(inBook ? "book" : null)}
                sx={{ alignSelf: "center", height: 24, borderRadius: "9999px", borderColor: "#888B9A", fontSize: "12px", fontWeight: 400, lineHeight: "16px", color: color.type.default.value, "& .MuiChip-icon": { color: color.type.default.value, width: 16, height: 16, ml: "6px", flexShrink: 0 } }}
              />
            )}
            {activeExpertSkillData && (
              <Chip
                variant="outlined"
                size="small"
                label={activeExpertSkillData.label}
                onDelete={() => setActiveExpertSkill(null)}
                sx={{ alignSelf: "center", height: 24, borderRadius: "9999px", borderColor: "#888B9A", fontSize: "12px", fontWeight: 400, lineHeight: "16px", color: color.type.default.value }}
              />
            )}
            {activeAgentModeData && (
              <Chip
                variant="outlined"
                size="small"
                label={activeAgentModeData.label}
                onDelete={() => setActiveAgentMode(null)}
                sx={{ alignSelf: "center", height: 24, borderRadius: "9999px", borderColor: "#888B9A", fontSize: "12px", fontWeight: 400, lineHeight: "16px", color: color.type.default.value }}
              />
            )}
            {deepResearchActive && (
              <Chip
                variant="outlined"
                size="small"
                label="Deep research"
                onDelete={() => setDeepResearchActive(false)}
                sx={{ alignSelf: "center", height: 24, borderRadius: "9999px", borderColor: "#888B9A", fontSize: "12px", fontWeight: 400, lineHeight: "16px", color: color.type.default.value }}
              />
            )}
          </Stack>
          {/* Trailing: extended thinking + voice + submit */}
          <Stack direction="row" alignItems="center" gap="4px">
            <Tooltip title="Voice input" placement="top">
              <IconButton size="small" sx={{ width: 32, height: 32, p: "4px", borderRadius: "8px", color: color.type.default.value }}>
                <ChatMicrophoneIcon />
              </IconButton>
            </Tooltip>
            <IconButton
              size="small"
              onClick={() => { if (prompt.trim()) handleSend(prompt); }}
              disabled={!prompt.trim() || isGenerating}
              sx={{
                width: 40,
                height: 40,
                borderRadius: "10px",
                border: `1px solid ${color.ui.divider.default.value}`,
                color: prompt.trim() ? color.type.default.value : color.type.muted.value,
              }}
            >
              <ArrowUpIcon size="md" />
            </IconButton>
          </Stack>
        </Box>
        </Box>
        <Box
          sx={{
            borderTop: `1px solid ${color.ui.divider.default.value}`,
            px: "16px",
            py: "12px",
            // Force light-theme colors — Drawer renders in a DOM portal that doesn't
            // inherit AppLayout's CSS custom properties, so tokens must be applied explicitly.
            "& p, & span": { color: `${color.type.muted.value} !important` },
            "& a": { color: `${color.action.primary.default.value} !important` },
          }}
        >
          <AiInaccuracyDisclaimer />
        </Box>
      </Box>}
    </Drawer>
    <AIMoreMenu
      anchorEl={moreMenuAnchor}
      onClose={() => setMoreMenuAnchor(null)}
    />

    {/* ── Tools menu ── */}
    {(() => {
      const MENU_PAPER_SX = { minWidth: 220, borderRadius: "8px", border: "1px solid #DEE0E9", boxShadow: "0 8px 16px rgba(0,0,0,0.1), 0 0 2px rgba(0,0,0,0.08)", overflow: "visible" };
      return (
        <>
          <Menu
            open={Boolean(toolsMenuAnchor)}
            anchorEl={toolsMenuAnchor}
            onClose={closeToolsMenus}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
            transformOrigin={{ vertical: "bottom", horizontal: "left" }}
            slotProps={{ paper: { sx: { ...MENU_PAPER_SX, mb: "6px" } } }}
            MenuListProps={{ sx: { py: "4px" } }}
          >
            {/* Search only in */}
            <MenuItem
              onMouseEnter={(e) => { const el = e.currentTarget; if (submenuDelayRef.current) clearTimeout(submenuDelayRef.current); submenuDelayRef.current = setTimeout(() => { setSearchScopeAnchor(el); setExpertSkillsAnchor(null); setAgentReportingAnchor(null); }, 560); }}
              onMouseLeave={() => { if (submenuDelayRef.current) clearTimeout(submenuDelayRef.current); }}
              onClick={(e) => { const el = e.currentTarget; if (submenuDelayRef.current) clearTimeout(submenuDelayRef.current); setSearchScopeAnchor(el); setExpertSkillsAnchor(null); setAgentReportingAnchor(null); }}
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: "12px", py: "8px", fontSize: "14px", color: "#232429", gap: "32px", minHeight: "auto", backgroundColor: activeToolsItem === "scope" ? "rgba(0,0,0,0.04)" : undefined, "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}
            >
              Search only in
              <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, flexShrink: 0 }}><path d="M13.9463 12.0003L8.35059 6.40466L9.4089 5.34636L15.5089 11.4003L15.063 11.9462L9.4089 18.654L8.35059 17.5957L13.9463 12.0003Z" fill="currentColor"/></svg>
            </MenuItem>

            {/* Select a skill */}
            <MenuItem
              onMouseEnter={(e) => { const el = e.currentTarget; if (submenuDelayRef.current) clearTimeout(submenuDelayRef.current); submenuDelayRef.current = setTimeout(() => { setExpertSkillsAnchor(el); setAgentReportingAnchor(null); setSearchScopeAnchor(null); }, 560); }}
              onMouseLeave={() => { if (submenuDelayRef.current) clearTimeout(submenuDelayRef.current); }}
              onClick={(e) => { const el = e.currentTarget; if (submenuDelayRef.current) clearTimeout(submenuDelayRef.current); setExpertSkillsAnchor(el); setAgentReportingAnchor(null); setSearchScopeAnchor(null); }}
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: "12px", py: "8px", fontSize: "14px", color: "#232429", gap: "32px", minHeight: "auto", backgroundColor: activeToolsItem === "expert" ? "rgba(0,0,0,0.04)" : undefined, "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}
            >
              Select a skill
              <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, flexShrink: 0 }}><path d="M13.9463 12.0003L8.35059 6.40466L9.4089 5.34636L15.5089 11.4003L15.063 11.9462L9.4089 18.654L8.35059 17.5957L13.9463 12.0003Z" fill="currentColor"/></svg>
            </MenuItem>

            {/* Generate insights */}
            <MenuItem
              onMouseEnter={(e) => { const el = e.currentTarget; if (submenuDelayRef.current) clearTimeout(submenuDelayRef.current); submenuDelayRef.current = setTimeout(() => { setAgentReportingAnchor(el); setExpertSkillsAnchor(null); setSearchScopeAnchor(null); }, 560); }}
              onMouseLeave={() => { if (submenuDelayRef.current) clearTimeout(submenuDelayRef.current); }}
              onClick={(e) => { const el = e.currentTarget; if (submenuDelayRef.current) clearTimeout(submenuDelayRef.current); setAgentReportingAnchor(el); setExpertSkillsAnchor(null); setSearchScopeAnchor(null); }}
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: "12px", py: "8px", fontSize: "14px", color: "#232429", gap: "32px", minHeight: "auto", backgroundColor: activeToolsItem === "agent" ? "rgba(0,0,0,0.04)" : undefined, "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}
            >
              Generate insights
              <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, flexShrink: 0 }}><path d="M13.9463 12.0003L8.35059 6.40466L9.4089 5.34636L15.5089 11.4003L15.063 11.9462L9.4089 18.654L8.35059 17.5957L13.9463 12.0003Z" fill="currentColor"/></svg>
            </MenuItem>

            {/* Search the web (toggle) */}
            <Box
              onMouseEnter={() => { if (submenuDelayRef.current) clearTimeout(submenuDelayRef.current); setSearchScopeAnchor(null); setExpertSkillsAnchor(null); setAgentReportingAnchor(null); }}
              onClick={(e) => { e.stopPropagation(); setWebSearchEnabled((v) => !v); }}
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: "12px", py: "8px", cursor: "pointer", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}
            >
              <Typography sx={{ fontSize: "14px", color: "#232429", lineHeight: "20px" }}>Search the web</Typography>
              <Switch size="small" checked={webSearchEnabled} onChange={(e) => { e.stopPropagation(); setWebSearchEnabled((v) => !v); }} onClick={(e) => e.stopPropagation()} />
            </Box>

          </Menu>

          {/* ── Search only in submenu ── */}
          <Popper open={Boolean(searchScopeAnchor)} anchorEl={searchScopeAnchor} placement="left-start" style={{ zIndex: 1400, marginRight: "4px" }}>
            <Paper sx={{ ...MENU_PAPER_SX, minWidth: 232 }}>
              <MenuList sx={{ py: "4px" }}>
                {inBook && (
                  <MenuItem onClick={() => { setSearchScope("book"); closeToolsMenus(); }} sx={{ px: "12px", py: "8px", gap: "10px", alignItems: "center", minHeight: "auto", justifyContent: "space-between", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}>
                    <Typography sx={{ fontSize: "14px", color: "#232429", lineHeight: "20px" }}>{currentBookTitle ?? "This book"}</Typography>
                    {searchScope === "book" && <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.97917 14.3958L3.85417 10.2708L4.72917 9.375L7.97917 12.625L15.2708 5.33333L16.1458 6.22917L7.97917 14.3958Z" fill="#232429"/></svg>}
                  </MenuItem>
                )}
                <MenuItem onClick={() => { setSearchScope("books"); closeToolsMenus(); }} sx={{ px: "12px", py: "8px", gap: "10px", alignItems: "center", minHeight: "auto", justifyContent: "space-between", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}>
                  <Typography sx={{ fontSize: "14px", color: "#232429", lineHeight: "20px" }}>Current & archived books</Typography>
                  {searchScope === "books" && <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.97917 14.3958L3.85417 10.2708L4.72917 9.375L7.97917 12.625L15.2708 5.33333L16.1458 6.22917L7.97917 14.3958Z" fill="#232429"/></svg>}
                </MenuItem>
                <MenuItem onClick={() => { setSearchScope("resource"); closeToolsMenus(); }} sx={{ px: "12px", py: "8px", gap: "10px", alignItems: "center", minHeight: "auto", justifyContent: "space-between", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}>
                  <Typography sx={{ fontSize: "14px", color: "#232429", lineHeight: "20px" }}>Resource center</Typography>
                  {searchScope === "resource" && <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.97917 14.3958L3.85417 10.2708L4.72917 9.375L7.97917 12.625L15.2708 5.33333L16.1458 6.22917L7.97917 14.3958Z" fill="#232429"/></svg>}
                </MenuItem>
                <MenuItem onClick={() => { setSearchScope("dataroom"); closeToolsMenus(); }} sx={{ px: "12px", py: "8px", gap: "10px", alignItems: "center", minHeight: "auto", justifyContent: "space-between", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}>
                  <Typography sx={{ fontSize: "14px", color: "#232429", lineHeight: "20px" }}>Data room</Typography>
                  {searchScope === "dataroom" && <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.97917 14.3958L3.85417 10.2708L4.72917 9.375L7.97917 12.625L15.2708 5.33333L16.1458 6.22917L7.97917 14.3958Z" fill="#232429"/></svg>}
                </MenuItem>
                <MenuItem onClick={() => { setSearchScope("tasks"); closeToolsMenus(); }} sx={{ px: "12px", py: "8px", gap: "10px", alignItems: "center", minHeight: "auto", justifyContent: "space-between", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}>
                  <Typography sx={{ fontSize: "14px", color: "#232429", lineHeight: "20px" }}>Tasks</Typography>
                  {searchScope === "tasks" && <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.97917 14.3958L3.85417 10.2708L4.72917 9.375L7.97917 12.625L15.2708 5.33333L16.1458 6.22917L7.97917 14.3958Z" fill="#232429"/></svg>}
                </MenuItem>
                <MenuItem onClick={() => { setSearchScope("decisions"); closeToolsMenus(); }} sx={{ px: "12px", py: "8px", gap: "10px", alignItems: "center", minHeight: "auto", justifyContent: "space-between", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}>
                  <Typography sx={{ fontSize: "14px", color: "#232429", lineHeight: "20px" }}>Decision hub</Typography>
                  {searchScope === "decisions" && <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.97917 14.3958L3.85417 10.2708L4.72917 9.375L7.97917 12.625L15.2708 5.33333L16.1458 6.22917L7.97917 14.3958Z" fill="#232429"/></svg>}
                </MenuItem>
                <MenuItem onClick={() => { setSearchScope("questionnaires"); closeToolsMenus(); }} sx={{ px: "12px", py: "8px", gap: "10px", alignItems: "center", minHeight: "auto", justifyContent: "space-between", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}>
                  <Typography sx={{ fontSize: "14px", color: "#232429", lineHeight: "20px" }}>Questionnaires</Typography>
                  {searchScope === "questionnaires" && <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.97917 14.3958L3.85417 10.2708L4.72917 9.375L7.97917 12.625L15.2708 5.33333L16.1458 6.22917L7.97917 14.3958Z" fill="#232429"/></svg>}
                </MenuItem>
              </MenuList>
            </Paper>
          </Popper>

          {/* ── Select a skill submenu ── */}
          <Popper open={Boolean(expertSkillsAnchor)} anchorEl={expertSkillsAnchor} placement="left-start" style={{ zIndex: 1400, marginRight: "4px" }}>
            <Paper sx={{ ...MENU_PAPER_SX, minWidth: 280 }}>
              <MenuList sx={{ py: "4px" }}>
                {EXPERT_SKILLS.map(({ id, label, desc, slash, Icon }) => (
                  <MenuItem key={id} onClick={() => { closeToolsMenus(); setActiveExpertSkill(id); }} sx={{ px: "12px", py: "8px", gap: "10px", alignItems: "flex-start", minHeight: "auto", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}>
                    <Box sx={{ mt: "2px", color: "#575A67", flexShrink: 0 }}><Icon size="md" /></Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "#232429", lineHeight: "20px" }}>{label}</Typography>
                        <Typography component="span" sx={{ fontSize: "11px", fontWeight: 500, color: "#575A67", background: "rgba(0,0,0,0.06)", borderRadius: "4px", px: "4px", py: "1px", lineHeight: "16px", whiteSpace: "nowrap" }}>{slash}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: "12px", color: "#575A67", lineHeight: "16px", mt: "2px" }}>{desc}</Typography>
                    </Box>
                  </MenuItem>
                ))}
                <Divider sx={{ my: "4px" }} />
                <MenuItem
                  onClick={() => closeToolsMenus()}
                  sx={{ px: "12px", py: "8px", gap: "10px", alignItems: "center", minHeight: "auto", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}
                >
                  <Box sx={{ color: "#575A67", flexShrink: 0 }}><SettingsIcon size="md" /></Box>
                  <Typography sx={{ fontSize: "14px", fontWeight: 400, color: "#232429", lineHeight: "20px" }}>Manage expert skills</Typography>
                </MenuItem>
              </MenuList>
            </Paper>
          </Popper>

          {/* ── Generate insights submenu ── */}
          <Popper open={Boolean(agentReportingAnchor)} anchorEl={agentReportingAnchor} placement="left-start" style={{ zIndex: 1400, marginRight: "4px" }}>
            <Paper sx={{ ...MENU_PAPER_SX, minWidth: 296, maxWidth: 296 }}>
              <MenuList sx={{ py: "4px" }}>
                {AGENT_REPORTING.map(({ id, label, tag, desc, Icon }) => (
                  <MenuItem key={id} onClick={() => { closeToolsMenus(); setActiveAgentMode(id); setDeepResearchActive(false); }} sx={{ px: "12px", py: "8px", gap: "10px", alignItems: "flex-start", minHeight: "auto", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}>
                    <Box sx={{ mt: "2px", color: "#575A67", flexShrink: 0 }}><Icon size="md" /></Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                        <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "#232429", lineHeight: "20px" }}>{label}</Typography>
                        <Typography component="span" sx={{ fontSize: "11px", fontWeight: 500, color: "#4069FE", background: "rgba(64,105,254,0.08)", borderRadius: "4px", px: "4px", py: "1px", lineHeight: "16px", whiteSpace: "nowrap" }}>{tag}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: "12px", color: "#575A67", lineHeight: "16px", mt: "2px", whiteSpace: "normal", wordBreak: "break-word" }}>{desc}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </MenuList>
            </Paper>
          </Popper>
        </>
      );
    })()}
    </>
  );
}
