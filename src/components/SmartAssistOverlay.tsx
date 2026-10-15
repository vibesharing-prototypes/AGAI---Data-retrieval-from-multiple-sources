import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import smartAssistAvatarUrl from "../assets/smart-assist-avatar.svg";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
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
  AIChatBox,
  AIChatContent,
  AIChatAIMessage,
  AIChatUserMessage,
  AIChatMessageHeader,
  AIChatMessageAvatar,
  AIChatMessageTextBlock,
  AIChatMessageFooter,
  AIChatThinkingIndicator,
  AIChatTimestamp,
  useAIChatContext,
} from "@diligentcorp/atlas-react-bundle";

import AiSparkleIcon from "@diligentcorp/atlas-react-bundle/icons/AiSparkle";
import AiSummaryIcon from "@diligentcorp/atlas-react-bundle/icons/AiSummary";
import AiInsightsIcon from "@diligentcorp/atlas-react-bundle/icons/AiInsights";
import AiLegalScanIcon from "@diligentcorp/atlas-react-bundle/icons/AiLegalScan";
import AddCircleIcon from "@diligentcorp/atlas-react-bundle/icons/AddCircle";
import CloseIcon from "@diligentcorp/atlas-react-bundle/icons/Close";
import CollapseSideNavIcon from "@diligentcorp/atlas-react-bundle/icons/CollapseSideNav";
import ExpandSideNavIcon from "@diligentcorp/atlas-react-bundle/icons/ExpandSideNav";
import ExpandRightIcon from "@diligentcorp/atlas-react-bundle/icons/ExpandRight";
import DockToRightIcon from "@diligentcorp/atlas-react-bundle/icons/DockToRight";
import SettingsIcon from "@diligentcorp/atlas-react-bundle/icons/Settings";
import BellIcon from "@diligentcorp/atlas-react-bundle/icons/Bell";
import NotesIcon from "@diligentcorp/atlas-react-bundle/icons/Notes";
import MoreIcon from "@diligentcorp/atlas-react-bundle/icons/More";
import NewsAnalyticsIcon from "@diligentcorp/atlas-react-bundle/icons/NewsAnalytics";
import ProjectsIcon from "@diligentcorp/atlas-react-bundle/icons/Projects";
import ReloadIcon from "@diligentcorp/atlas-react-bundle/icons/Reload";
import TaskIcon from "@diligentcorp/atlas-react-bundle/icons/Task";
import InfoIcon from "@diligentcorp/atlas-react-bundle/icons/Info";
import ExternalLinkIcon from "@diligentcorp/atlas-react-bundle/icons/ExternalLink";
import FolderIcon from "@diligentcorp/atlas-react-bundle/icons/Folder";
import MessageIcon from "@diligentcorp/atlas-react-bundle/icons/Message";
import CaretDownIcon from "@diligentcorp/atlas-react-bundle/icons/CaretDown";
import AuditAnalyticsIcon from "@diligentcorp/atlas-react-bundle/icons/AuditAnalytics";
import RiskEssentialsIcon from "@diligentcorp/atlas-react-bundle/icons/RiskEssentials";
import LockedIcon from "@diligentcorp/atlas-react-bundle/icons/Locked";
import StrategyIcon from "@diligentcorp/atlas-react-bundle/icons/Strategy";
import BriefcaseIcon from "@diligentcorp/atlas-react-bundle/icons/Briefcase";
import ReportsIcon from "@diligentcorp/atlas-react-bundle/icons/Reports";
import TargetIcon from "@diligentcorp/atlas-react-bundle/icons/Target";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditIcon from "@diligentcorp/atlas-react-bundle/icons/Edit";
import PinIcon from "@diligentcorp/atlas-react-bundle/icons/Pin";
import TrashIcon from "@diligentcorp/atlas-react-bundle/icons/Trash";
import { InsightsEmptyStateIllustration, SmartSummaryIcon, SmartPrepIcon, SmartRiskScannerIcon, AuditSmartPrepIcon } from "./InsightIcons.js";
import { InsightSummaryView, InsightPrepView, InsightRiskView, InsightAuditView } from "./InsightDetailViews.js";
import InsightTOC from "./InsightTOC.js";

import {
  smartSummaryText,
} from "../data/mockData.js";

import {
  type ChatThread,
  STATIC_CHAT_THREADS,
} from "../data/hybrid-search.constants.js";

import AIMoreMenu from "./AIMoreMenu.js";
import ChatThreadItem from "./ChatThreadItem.js";
import DeleteAllChatsMenu from "./DeleteAllChatsMenu.js";
import AIBMSettingsPage from "./AIBMSettingsPage.js";
import ExpertSkillsPage from "./ExpertSkillsPage.js";
import RichAIMessageContent, { parseCiteText } from "./RichAIMessageContent.js";
import SourcesBlock from "./SourcesBlock.js";
import DemoRail from "./demo/DemoRail.js";
import DemoShareCard from "./demo/DemoShareCard.js";
import DemoReasoning from "./demo/DemoReasoning.js";
import { DEMO_DIRECTOR, DEMO_STEPS } from "../data/demo-agai-integration-usecases.js";
import SuggestionChips from "./SuggestionChips.js";
import { AiInaccuracyDisclaimer } from "./AiDisclaimers.js";
import CitationPreviewPanel from "./CitationPreviewPanel.js";
import { useSmartAssist } from "../context/SmartAssistContext.js";
import { useCitationPreview } from "../context/CitationPreviewContext.js";

// ─── Figma-sourced constants ───────────────────────────────────────────────────

const LEFT_PANEL_WIDTH = 272;

// ─── Chatbox toolbar icons (from Figma SVG exports) ──────────────────────────

export function UploadFileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.58334 18.2372C8.36433 18.2372 7.32774 17.8101 6.47357 16.9559C5.6194 16.1018 5.19232 15.0652 5.19232 13.8462V4.83972C5.19232 3.96272 5.50459 3.21195 6.12913 2.58743C6.75366 1.9629 7.50443 1.65063 8.38143 1.65063C9.25843 1.65063 10.0092 1.9629 10.6337 2.58743C11.2582 3.21195 11.5705 3.96272 11.5705 4.83972V12.9647C11.5705 13.5211 11.3784 13.9914 10.9942 14.3756C10.6099 14.7598 10.1396 14.9519 9.58311 14.9519C9.02664 14.9519 8.55636 14.7598 8.17228 14.3756C7.78821 13.9914 7.59618 13.5211 7.59618 12.9647V4.83972H8.58974V12.9647C8.58974 13.2463 8.68496 13.4822 8.87541 13.6727C9.06585 13.8631 9.30183 13.9583 9.58334 13.9583C9.86486 13.9583 10.1008 13.8631 10.2913 13.6727C10.4817 13.4822 10.5769 13.2463 10.5769 12.9647V4.83972C10.5769 4.22497 10.3646 3.70536 9.94005 3.28091C9.51545 2.85643 8.99568 2.6442 8.38074 2.6442C7.76581 2.6442 7.24627 2.85643 6.82211 3.28091C6.39797 3.70536 6.18591 4.22497 6.18591 4.83972V13.8462C6.18591 14.7842 6.51763 15.5849 7.18109 16.2484C7.84455 16.9119 8.6453 17.2436 9.58334 17.2436C10.5214 17.2436 11.3221 16.9119 11.9856 16.2484C12.6491 15.5849 12.9808 14.7842 12.9808 13.8462V4.83972H13.9744V13.8462C13.9744 15.0652 13.5473 16.1018 12.6931 16.9559C11.8389 17.8101 10.8024 18.2372 9.58334 18.2372Z" fill="currentColor"/>
    </svg>
  );
}

export function ToolsSliderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.37498 17.2916V12.7083H10.6249V14.375H17.2916V15.6249H10.6249V17.2916H9.37498ZM2.70831 15.6249V14.375H7.29161V15.6249H2.70831ZM6.04165 12.2916V10.6249H2.70831V9.37498H6.04165V7.70831H7.29161V12.2916H6.04165ZM9.37498 10.6249V9.37498H17.2916V10.6249H9.37498ZM12.7083 7.29161V2.70831H13.9583V4.37498H17.2916V5.62494H13.9583V7.29161H12.7083ZM2.70831 5.62494V4.37498H10.6249V5.62494H2.70831Z" fill="currentColor"/>
    </svg>
  );
}

export function ChatMicrophoneIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 14C11.8013 14 11.2099 13.758 10.7259 13.274C10.242 12.79 10 12.1987 10 11.5V5.49998C10 4.80128 10.242 4.20993 10.7259 3.72595C11.2099 3.24198 11.8013 3 12.5 3C13.1987 3 13.79 3.24198 14.274 3.72595C14.758 4.20993 15 4.80128 15 5.49998V11.5C15 12.1987 14.758 12.79 14.274 13.274C13.79 13.758 13.1987 14 12.5 14ZM11.75 21.25V17.9538C10.1 17.7653 8.72917 17.0576 7.6375 15.8307C6.54583 14.6038 6 13.1602 6 11.5H7.49997C7.49997 12.8833 7.98747 14.0625 8.96247 15.0375C9.93747 16.0125 11.1166 16.5 12.5 16.5C13.8833 16.5 15.0625 16.0125 16.0375 15.0375C17.0125 14.0625 17.5 12.8833 17.5 11.5H19C19 13.1602 18.4541 14.6038 17.3625 15.8307C16.2708 17.0576 14.8999 17.7653 13.2499 17.9538V21.25H11.75ZM12.5 12.5C12.7833 12.5 13.0208 12.4041 13.2125 12.2125C13.4041 12.0208 13.5 11.7833 13.5 11.5V5.49998C13.5 5.21664 13.4041 4.97914 13.2125 4.78748C13.0208 4.59581 12.7833 4.49998 12.5 4.49998C12.2166 4.49998 11.9791 4.59581 11.7875 4.78748C11.5958 4.97914 11.5 5.21664 11.5 5.49998V11.5C11.5 11.7833 11.5958 12.0208 11.7875 12.2125C11.9791 12.4041 12.2166 12.5 12.5 12.5Z" fill="currentColor"/>
    </svg>
  );
}

// ─── Tools menu data ─────────────────────────────────────────────────────────

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

function FolderAddIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.66663 16.25V3.75H7.74831L9.41498 5.41667H17.4999V16.25H1.66663ZM2.91661 15H16.2499V6.66665H8.90231L7.23713 4.99998H2.91661V15ZM11.4583 13.125H12.7083V11.4583H14.3749V10.2083H12.7083V8.54167H11.4583V10.2083H9.79163V11.4583H11.4583V13.125Z" fill="currentColor"/>
    </svg>
  );
}

function MessageBubblePlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.37504 11.4583H10.625V8.9583H13.125V7.70834H10.625V5.20834H9.37504V7.70834H6.87504V8.9583H9.37504V11.4583ZM2.08337 17.532V2.08334H17.9167V14.5833H5.03208L2.08337 17.532ZM4.50004 13.3333H16.4103C16.4744 13.3333 16.5331 13.3066 16.5866 13.2532C16.64 13.1998 16.6667 13.141 16.6667 13.0769V3.58976C16.6667 3.52565 16.64 3.46688 16.5866 3.41345C16.5331 3.36003 16.4744 3.33332 16.4103 3.33332H3.58979C3.52568 3.33332 3.46691 3.36003 3.41348 3.41345C3.36006 3.46688 3.33335 3.52565 3.33335 3.58976V14.4872L4.50004 13.3333Z" fill="currentColor"/>
    </svg>
  );
}

function VerticalDotsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.99998 16.0577C9.65624 16.0577 9.36198 15.9353 9.11719 15.6905C8.8724 15.4457 8.75 15.1515 8.75 14.8077C8.75 14.464 8.8724 14.1697 9.11719 13.9249C9.36198 13.6801 9.65624 13.5577 9.99998 13.5577C10.3437 13.5577 10.638 13.6801 10.8828 13.9249C11.1276 14.1697 11.25 14.464 11.25 14.8077C11.25 15.1515 11.1276 15.4457 10.8828 15.6905C10.638 15.9353 10.3437 16.0577 9.99998 16.0577ZM9.99998 11.25C9.65624 11.25 9.36198 11.1276 9.11719 10.8828C8.8724 10.638 8.75 10.3438 8.75 10C8.75 9.65629 8.8724 9.36203 9.11719 9.11724C9.36198 8.87245 9.65624 8.75005 9.99998 8.75005C10.3437 8.75005 10.638 8.87245 10.8828 9.11724C11.1276 9.36203 11.25 9.65629 11.25 10C11.25 10.3438 11.1276 10.638 10.8828 10.8828C10.638 11.1276 10.3437 11.25 9.99998 11.25ZM9.99998 6.44232C9.65624 6.44232 9.36198 6.31992 9.11719 6.07513C8.8724 5.83036 8.75 5.53609 8.75 5.19234C8.75 4.84861 8.8724 4.55434 9.11719 4.30955C9.36198 4.06477 9.65624 3.94238 9.99998 3.94238C10.3437 3.94238 10.638 4.06477 10.8828 4.30955C11.1276 4.55434 11.25 4.84861 11.25 5.19234C11.25 5.53609 11.1276 5.83036 10.8828 6.07513C10.638 6.31992 10.3437 6.44232 9.99998 6.44232Z" fill="currentColor"/>
    </svg>
  );
}

export function ExtendedThinkingIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.75001 20.596C8.95134 20.596 8.26451 20.3194 7.68951 19.7663C7.11451 19.2131 6.79818 18.5423 6.74051 17.7538C5.82384 17.6141 5.06101 17.1949 4.45201 16.4963C3.84301 15.7974 3.53851 14.9782 3.53851 14.0385C3.53851 13.7103 3.58118 13.3861 3.66651 13.0658C3.75168 12.7454 3.87951 12.4447 4.05001 12.1635C3.84751 11.8698 3.69559 11.5523 3.59426 11.2108C3.49293 10.8691 3.44226 10.5104 3.44226 10.1348C3.44226 9.17543 3.75801 8.34585 4.38951 7.64602C5.02084 6.94618 5.80259 6.53918 6.73476 6.42502C6.72826 6.39935 6.72501 6.37368 6.72501 6.34801V6.26152C6.75584 5.45635 7.06384 4.7756 7.64901 4.21927C8.23434 3.66293 8.93468 3.38477 9.75001 3.38477C10.209 3.38477 10.618 3.47451 10.977 3.65401C11.336 3.83335 11.677 4.08718 12 4.41552C12.3192 4.08718 12.6577 3.83335 13.0155 3.65401C13.3732 3.47451 13.7847 3.38477 14.25 3.38477C15.0563 3.38477 15.7503 3.66193 16.3318 4.21627C16.9131 4.77077 17.2192 5.44743 17.25 6.24626V6.33277C17.25 6.35843 17.2468 6.3841 17.2403 6.40977C18.1724 6.52377 18.9583 6.93176 19.598 7.63376C20.2378 8.3356 20.5578 9.16927 20.5578 10.1348C20.5578 10.5104 20.5055 10.8691 20.401 11.2108C20.2965 11.5523 20.1429 11.8698 19.9403 12.1635C20.1108 12.4443 20.2403 12.7449 20.3288 13.0653C20.4173 13.3858 20.4615 13.7102 20.4615 14.0385C20.4615 14.9948 20.1544 15.8198 19.5403 16.5135C18.9263 17.207 18.1577 17.6204 17.2345 17.7538C17.1768 18.5423 16.8647 19.2131 16.298 19.7663C15.7313 20.3194 15.0487 20.596 14.25 20.596C13.7885 20.596 13.3779 20.5088 13.0183 20.3345C12.6586 20.1602 12.3192 19.9057 12 19.571C11.6705 19.9057 11.3269 20.1602 10.9693 20.3345C10.6116 20.5088 10.2052 20.596 9.75001 20.596ZM12.75 6.38477V17.5963C12.75 18.0163 12.8954 18.3713 13.1863 18.6613C13.4771 18.9513 13.833 19.0963 14.254 19.0963C14.6552 19.0963 14.999 18.9468 15.2855 18.648C15.5722 18.3493 15.727 18.0013 15.75 17.6038C15.3295 17.5154 14.9413 17.3555 14.5855 17.124C14.2298 16.8927 13.9225 16.5962 13.6635 16.2345C13.5353 16.059 13.487 15.8721 13.5185 15.6738C13.55 15.4754 13.6541 15.3143 13.8308 15.1905C14.0064 15.0622 14.1946 15.0138 14.3953 15.0455C14.5961 15.077 14.7592 15.1811 14.8845 15.3578C15.0913 15.6586 15.3546 15.8889 15.6743 16.0488C15.9939 16.2086 16.3397 16.2885 16.7115 16.2885C17.3385 16.2885 17.8703 16.0703 18.3068 15.6338C18.7433 15.1971 18.9615 14.6653 18.9615 14.0385C18.9615 13.9123 18.9493 13.7863 18.925 13.6603C18.9007 13.5343 18.8622 13.4103 18.8095 13.2885C18.5262 13.4808 18.2137 13.6283 17.872 13.7308C17.5303 13.8333 17.1756 13.8845 16.8078 13.8845C16.5953 13.8845 16.4171 13.8127 16.2733 13.669C16.1296 13.5252 16.0578 13.3469 16.0578 13.1343C16.0578 12.9218 16.1296 12.7437 16.2733 12.6C16.4171 12.4565 16.5953 12.3848 16.8078 12.3848C17.4346 12.3848 17.9663 12.1664 18.403 11.7298C18.8395 11.2933 19.0578 10.7616 19.0578 10.1348C19.0578 9.51777 18.8427 8.99427 18.4125 8.56427C17.9823 8.13427 17.4603 7.90768 16.8463 7.88452C16.6756 8.19102 16.4508 8.45835 16.172 8.68652C15.8932 8.91468 15.582 9.09543 15.2385 9.22877C15.0423 9.3031 14.8508 9.29693 14.664 9.21026C14.4772 9.1236 14.3527 8.9811 14.2905 8.78277C14.2263 8.5866 14.234 8.39393 14.3135 8.20477C14.393 8.01577 14.534 7.88918 14.7365 7.82502C15.0378 7.72252 15.2821 7.54043 15.4693 7.27877C15.6564 7.01727 15.75 6.7176 15.75 6.37977C15.75 5.96243 15.6049 5.60893 15.3148 5.31927C15.0248 5.02943 14.6697 4.88452 14.2495 4.88452C13.8293 4.88452 13.4743 5.02952 13.1845 5.31952C12.8948 5.60952 12.75 5.9646 12.75 6.38477ZM11.25 17.5963V6.38477C11.25 5.9646 11.1049 5.60952 10.8148 5.31952C10.5248 5.02952 10.1697 4.88452 9.74951 4.88452C9.32934 4.88452 8.97434 5.02952 8.68451 5.31952C8.39484 5.60952 8.25001 5.9646 8.25001 6.38477C8.25001 6.7091 8.34101 7.0046 8.52301 7.27126C8.70518 7.53793 8.94684 7.72252 9.24801 7.82502C9.44418 7.88918 9.58776 8.01418 9.67876 8.20002C9.76976 8.38585 9.78376 8.5776 9.72076 8.77527C9.64526 8.97277 9.51301 9.11468 9.32401 9.20101C9.13501 9.28751 8.93918 9.2936 8.73651 9.21927C8.39301 9.08593 8.08184 8.90677 7.80301 8.68177C7.52418 8.45677 7.29943 8.19102 7.12876 7.88452C6.53143 7.90768 6.01768 8.13752 5.58751 8.57402C5.15734 9.01052 4.94226 9.53177 4.94226 10.1378C4.94226 10.7626 5.16051 11.2933 5.59701 11.7298C6.03368 12.1664 6.56543 12.3848 7.19226 12.3848C7.40476 12.3848 7.58293 12.4566 7.72676 12.6003C7.87043 12.7441 7.94226 12.9223 7.94226 13.135C7.94226 13.3475 7.87043 13.5256 7.72676 13.6693C7.58293 13.8128 7.40476 13.8845 7.19226 13.8845C6.82443 13.8845 6.46968 13.8333 6.12801 13.7308C5.78634 13.6283 5.47384 13.4808 5.19051 13.2885C5.13784 13.4103 5.09934 13.5343 5.07501 13.6603C5.05068 13.7863 5.03851 13.9123 5.03851 14.0385C5.03851 14.6653 5.25676 15.1971 5.69326 15.6338C6.12976 16.0703 6.66151 16.2885 7.28851 16.2885C7.66218 16.2885 8.00784 16.2081 8.32551 16.0473C8.64318 15.8863 8.90651 15.6564 9.11551 15.3578C9.24084 15.1811 9.40393 15.077 9.60476 15.0455C9.80543 15.0138 9.99359 15.0605 10.1693 15.1855C10.3449 15.3105 10.4488 15.4727 10.4808 15.672C10.5128 15.8715 10.4647 16.059 10.3365 16.2345C10.0712 16.5962 9.75801 16.8953 9.39701 17.1318C9.03618 17.3683 8.64551 17.5308 8.22501 17.6193C8.24801 18.0168 8.40701 18.3623 8.70201 18.6558C8.99684 18.9494 9.34484 19.0963 9.74601 19.0963C10.167 19.0963 10.5229 18.9513 10.8138 18.6613C11.1046 18.3713 11.25 18.0163 11.25 17.5963Z" fill="currentColor"/>
    </svg>
  );
}
const HEADER_BORDER = "rgb(240,240,243)";
const AI_GRADIENT = "linear-gradient(90deg, #be0c1e 0%, #ab48da 50%, #4069fe 100%)";
const AI_PURPLE = "#ab48da";
const PANEL_DIVIDER = "rgb(226,226,229)";
const TAB_ACTIVE_BORDER = "rgb(118,119,122)";
const ONBOARDING_BG = "rgba(228,243,255,1)";
const TEXT_DEFAULT = "rgb(36,38,40)";
const CHAT_BG = "linear-gradient(135deg, #f9f9fc 31%, #fcfcff 100%)";
const DIRECTOR_FIRST_NAME = "Greg";

// ─── Overlay thread row (hover kebab + optional tooltip, preserves 12px styles) ─

function OverlayThreadRow({
  thread,
  isPinned,
  onPin,
  onLoadThread,
  isActive = false,
  startIcon,
  showTooltip = false,
  showNewChat = false,
}: {
  thread: ChatThread;
  isPinned: boolean;
  onPin: (id: string, currentlyPinned: boolean) => void;
  onLoadThread: (thread: ChatThread) => void;
  isActive?: boolean;
  startIcon?: React.ReactNode;
  showTooltip?: boolean;
  showNewChat?: boolean;
}) {
  const { tokens: { semantic: { color } } } = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isMenuOpen = Boolean(anchorEl);

  const inner = (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        width: "100%",
        pt: "8px", pb: "8px", pl: "8px",
        borderRadius: "12px",
        backgroundColor: isActive ? "#ECF0FF" : "transparent",
        "&:hover": { backgroundColor: isActive ? "#ECF0FF" : "rgba(0,0,0,0.04)" },
        "& .overlay-more-btn": {
          opacity: isMenuOpen ? 1 : 0,
          backgroundColor: isMenuOpen ? "rgba(0,0,0,0.06)" : "transparent",
        },
        "&:hover .overlay-more-btn": { opacity: 1 },
      }}
    >
      <Box
        component="button"
        onClick={() => onLoadThread(thread)}
        sx={{
          all: "unset",
          cursor: "pointer",
          flex: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          paddingRight: showNewChat ? "60px" : "32px",
        }}
      >
        {startIcon && (
          <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", color: TEXT_DEFAULT }}>
            {startIcon}
          </Box>
        )}
        <Box sx={{
          flex: "1 1 0",
          color: isActive ? "#0040D5" : TEXT_DEFAULT,
          fontSize: "12px",
          fontWeight: isActive ? 600 : 400,
          lineHeight: "16px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical" as const,
        }}>
          {thread.title}
        </Box>
      </Box>
      {showNewChat && (
        <IconButton
          className="overlay-more-btn"
          aria-label="New chat in project"
          onClick={(e) => e.stopPropagation()}
          sx={{
            position: "absolute",
            right: "32px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "28px",
            height: "28px",
            borderRadius: "6px",
            transition: "opacity 120ms ease",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.06)" },
          }}
        >
          <MessageBubblePlusIcon />
        </IconButton>
      )}
      <IconButton
        className="overlay-more-btn"
        aria-label="More options"
        onClick={(e) => { e.stopPropagation(); setAnchorEl(e.currentTarget); }}
        sx={{
          position: "absolute",
          right: "4px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "28px",
          height: "28px",
          borderRadius: "6px",
          transition: "opacity 120ms ease",
          "&:hover": { backgroundColor: "rgba(0,0,0,0.06)" },
        }}
      >
        <VerticalDotsIcon />
      </IconButton>
    </Box>
  );

  return (
    <>
      {showTooltip ? (
        <Tooltip
          title={
            <Box sx={{ p: "2px" }}>
              <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#1a1f27", lineHeight: "18px", mb: "2px" }}>
                {new Date(thread.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </Typography>
              <Typography sx={{ fontSize: "13px", fontWeight: 400, color: "#4a4f5a", lineHeight: "18px", maxWidth: "200px", wordBreak: "break-word" }}>
                {thread.title}
              </Typography>
            </Box>
          }
          placement="right"
          arrow
          enterDelay={800}
          disableHoverListener={isMenuOpen}
          componentsProps={{
            tooltip: {
              sx: {
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                px: "12px",
                py: "10px",
                "& .MuiTooltip-arrow": { color: "#fff" },
              },
            },
          }}
        >
          {inner}
        </Tooltip>
      ) : inner}
      <Menu
        open={isMenuOpen}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: "4px",
              borderRadius: "12px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12), 0 0 2px rgba(0,0,0,0.08)",
              minWidth: "200px",
              py: "8px",
              border: `1px solid ${color.ui.divider.default.value}`,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => { onPin(thread.id, isPinned); setAnchorEl(null); }}
          sx={{ px: "16px", py: "12px", gap: 0, "&:hover": { backgroundColor: color.surface.variant.value } }}
        >
          <Stack direction="row" alignItems="center" gap="12px">
            <PinIcon size="md" />
            <Typography sx={{ fontSize: "14px", lineHeight: "20px", color: color.type.default.value }}>
              {isPinned ? "Unpin" : "Pin"}
            </Typography>
          </Stack>
        </MenuItem>
        <MenuItem
          onClick={() => setAnchorEl(null)}
          sx={{ px: "16px", py: "12px", gap: 0, "&:hover": { backgroundColor: color.surface.variant.value } }}
        >
          <Stack direction="row" alignItems="center" gap="12px">
            <EditIcon size="md" />
            <Typography sx={{ fontSize: "14px", lineHeight: "20px", color: color.type.default.value }}>
              Rename
            </Typography>
          </Stack>
        </MenuItem>
        <MenuItem
          onClick={() => setAnchorEl(null)}
          sx={{ px: "16px", py: "12px", gap: 0, "&:hover": { backgroundColor: color.surface.variant.value } }}
        >
          <Stack direction="row" alignItems="center" gap="12px" sx={{ color: color.status.error.text.value }}>
            <TrashIcon size="md" />
            <Typography sx={{ fontSize: "14px", lineHeight: "20px", color: "inherit" }}>
              Delete
            </Typography>
          </Stack>
        </MenuItem>
      </Menu>
    </>
  );
}

// ─── Left panel ───────────────────────────────────────────────────────────────

function LeftPanel({
  activeTab,
  onTabChange,
  threads,
  currentThreadId,
  onLoadThread,
  onOpenProject,
  onNewChat,
  onPreferences,
  onExpertSkills,
  expertSkillsActive = false,
  onDeleteAll,
  showInsights = false,
  hideInsightsFooter = false,
  audience = "admin",
  selectedInsight,
  onInsightSelect,
  detailScrollRef,
  isNewChatActive = false,
  activeProjectId = null,
  settingsActive = false,
}: {
  activeTab: number;
  onTabChange: (v: number) => void;
  threads: ChatThread[];
  currentThreadId: string | null;
  onLoadThread: (thread: ChatThread) => void;
  onOpenProject: (thread: ChatThread) => void;
  onNewChat: () => void;
  onPreferences?: () => void;
  onExpertSkills?: () => void;
  expertSkillsActive?: boolean;
  settingsActive?: boolean;
  onDeleteAll?: () => void;
  showInsights?: boolean;
  hideInsightsFooter?: boolean;
  audience?: "admin" | "director";
  selectedInsight: "summary" | "prep" | "risk" | null;
  onInsightSelect: (id: "summary" | "prep" | "risk" | null) => void;
  detailScrollRef?: React.RefObject<HTMLElement | null>;
  isNewChatActive?: boolean;
  activeProjectId?: string | null;
}) {
  const { tokens: { semantic: { color } } } = useTheme();
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(() =>
    audience === "director"
      ? new Set(threads.filter(t => STATIC_CHAT_THREADS.some(s => s.id === t.id)).slice(0, 3).map(t => t.id))
      : new Set<string>()
  );
  const [pinsOpen, setPinsOpen] = useState(true);
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(true);
  const handleTogglePin = useCallback((id: string, currentlyPinned: boolean) => {
    setPinnedIds(prev => {
      const next = new Set(prev);
      if (currentlyPinned) next.delete(id); else next.add(id);
      return next;
    });
  }, []);
  const pinnedThreads = threads.filter(t => pinnedIds.has(t.id));
  const unpinnedThreads = threads.filter(t => !pinnedIds.has(t.id));
  return (
    <Box
      sx={{
        width: LEFT_PANEL_WIDTH,
        flexShrink: 0,
        borderRight: `1px solid ${PANEL_DIVIDER}`,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#fff",
      }}
    >
      {showInsights && (
        /* Classic Atlas light-theme tabs. The Atlas theme draws the
           full-width bottom divider and the active underline; only inset the
           labels to the panel's 20px gutter so the divider stays edge-to-edge. */
        <Box sx={{ pt: "12px", px: "20px", flexShrink: 0 }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => onTabChange(v)}
            aria-label="Ask GovernAI sections"
            // Small (default) tab size, matching the docked panel. The group's
            // continuous bottom divider ships at zIndex -1, which hides it behind
            // the panel background; lift it to 0 so it reads as one line (here,
            // inset 20px by the wrapper) under the whole tab group.
            sx={{ "&::after": { zIndex: 0 } }}
          >
            <Tab label="Ask GovernAI" id="sa-overlay-tab-0" aria-controls="sa-overlay-tabpanel-0" />
            <Tab label="Insights" id="sa-overlay-tab-1" aria-controls="sa-overlay-tabpanel-1" />
          </Tabs>
        </Box>
      )}

      {activeTab === 1 ? (
        selectedInsight === null ? (
          <InsightsList onSelect={onInsightSelect} audience={audience} />
        ) : (
          <InsightTOC selectedInsight={selectedInsight} onBack={() => onInsightSelect(null)} scrollContainerRef={detailScrollRef} />
        )
      ) : audience === "director" ? (
        /* ── Director full-screen left panel ── */
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            px: "12px",
            pt: "8px",
            pb: "8px",
            gap: "4px",
          }}
        >
          {/* New chat — atlas nav item (active state with selection indicator) */}
          <Box sx={{ px: "4px" }}>
            <Box
              component="button"
              onClick={onNewChat}
              sx={{
                all: "unset",
                boxSizing: "border-box",
                cursor: "pointer",
                display: "flex",
                width: "100%",
                px: "4px",
                py: "8px",
                overflow: "hidden",
                borderRadius: "12px",
                alignItems: "center",
                gap: "8px",
                position: "relative",
                backgroundColor: isNewChatActive && !expertSkillsActive ? "#ECF0FF" : "transparent",
                "&:hover": { backgroundColor: isNewChatActive && !expertSkillsActive ? "#E0E8FF" : "rgba(0,0,0,0.04)" },
              }}
            >
              {/* Left selection indicator */}
              {isNewChatActive && !expertSkillsActive && (
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: "10px",
                    width: "2px",
                    height: "20px",
                    backgroundColor: "#0040D5",
                    borderRadius: "24px",
                  }}
                />
              )}
              <Box sx={{ width: 20, height: 20, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: TEXT_DEFAULT }}>
                <AddCircleIcon size="md" />
              </Box>
              <Box sx={{ flex: "1 1 0", maxHeight: 48, fontSize: "12px", fontWeight: 400, lineHeight: "16px", color: isNewChatActive && !expertSkillsActive ? "#0040D5" : TEXT_DEFAULT }}>
                New chat
              </Box>
            </Box>
          </Box>

          {/* Tasks nav item */}
          <Box sx={{ px: "4px" }}>
            <Box
              component="button"
              sx={{
                all: "unset",
                boxSizing: "border-box",
                cursor: "pointer",
                display: "flex",
                width: "100%",
                px: "4px",
                py: "8px",
                overflow: "hidden",
                borderRadius: "12px",
                alignItems: "center",
                gap: "8px",
                color: TEXT_DEFAULT,
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
              }}
            >
              <Box sx={{ width: 20, height: 20, flexShrink: 0, display: "flex", alignItems: "center" }}><TaskIcon size="md" /></Box>
              <Box sx={{ flex: "1 1 0", fontSize: "12px", fontWeight: 400, lineHeight: "16px" }}>Tasks</Box>
            </Box>
          </Box>

          {/* ── Pinned / Projects / Chat history sections ── */}
          <Box sx={{ pt: "8px", display: "flex", flexDirection: "column", gap: "20px", flex: 1, overflowY: "auto" }}>

          {/* ── Pinned section ── */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <Box
              onClick={() => setPinsOpen(o => !o)}
              sx={{
                boxSizing: "border-box",
                cursor: "pointer",
                display: "flex",
                width: "100%",
                padding: "8px",
                overflow: "hidden",
                borderRadius: "12px",
                alignItems: "center",
                gap: "8px",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                "& .section-chevron": { opacity: 0, transition: "opacity 120ms ease" },
                "& .section-trailing": { opacity: 0, transition: "opacity 120ms ease" },
                "&:hover .section-chevron": { opacity: 1 },
                "&:hover .section-trailing": { opacity: 1 },
              }}
            >
              <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", color: TEXT_DEFAULT }}><PinIcon size="md" /></Box>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <Box sx={{ color: TEXT_DEFAULT, fontSize: "12px", fontWeight: 400, lineHeight: "16px" }}>Pinned</Box>
                <Box className="section-chevron" sx={{ display: "flex", alignItems: "center", color: TEXT_DEFAULT }}>
                  {pinsOpen
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11.9997 16.7077L5.3457 10.0537L6.404 8.99536L11.9997 14.591L17.5953 8.99536L18.6537 10.0537L11.9997 16.7077Z" fill="currentColor"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M13.9463 12.0003L8.35059 6.40466L9.4089 5.34636L15.5089 11.4003L15.063 11.9462L9.4089 18.654L8.35059 17.5957L13.9463 12.0003Z" fill="currentColor"/></svg>}
                </Box>
              </Box>
              <Box sx={{ flex: 1 }} />
            </Box>

            {pinsOpen && (
              pinnedThreads.length === 0 ? (
                <Typography sx={{ fontSize: "12px", fontWeight: 400, lineHeight: "16px", color: color.type.muted.value, pl: "12px", pt: "4px" }}>
                  No pinned items
                </Typography>
              ) : (
                <Box sx={{ pl: "16px", display: "flex" }}>
                  <Box sx={{ flex: "1 1 0", display: "flex", flexDirection: "column" }}>
                    {pinnedThreads.map((thread) => (
                      <OverlayThreadRow
                        key={thread.id}
                        thread={thread}
                        isActive={currentThreadId === thread.id || (thread.isProject && activeProjectId === thread.id)}
                        onLoadThread={onLoadThread}
                        isPinned={true}
                        onPin={handleTogglePin}
                        startIcon={thread.isProject ? <FolderIcon size="md" /> : <MessageIcon size="md" />}
                        showTooltip={!thread.isProject}
                      />
                    ))}
                    <Box component="button" sx={{ all: "unset", cursor: "pointer", display: "flex",
                      pl: "12px", pr: "4px", py: "8px", borderRadius: "12px", "&:hover": { opacity: 0.8 } }}>
                      <Box sx={{ color: "#1C4EE4", fontSize: "12px", fontWeight: 600, lineHeight: "16px" }}>View all</Box>
                    </Box>
                  </Box>
                </Box>
              )
            )}
          </Box>

          {/* ── Projects section ── */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <Box
              onClick={() => setProjectsOpen(o => !o)}
              sx={{
                boxSizing: "border-box",
                cursor: "pointer",
                display: "flex",
                width: "100%",
                padding: "8px",
                overflow: "hidden",
                borderRadius: "12px",
                alignItems: "center",
                gap: "8px",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                "& .section-chevron": { opacity: 0, transition: "opacity 120ms ease" },
                "& .section-trailing": { opacity: 0, transition: "opacity 120ms ease" },
                "&:hover .section-chevron": { opacity: 1 },
                "&:hover .section-trailing": { opacity: 1 },
              }}
            >
              <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", color: TEXT_DEFAULT }}><FolderIcon size="md" /></Box>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <Box sx={{ color: TEXT_DEFAULT, fontSize: "12px", fontWeight: 400, lineHeight: "16px" }}>Projects</Box>
                <Box className="section-chevron" sx={{ display: "flex", alignItems: "center", color: TEXT_DEFAULT }}>
                  {projectsOpen
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11.9997 16.7077L5.3457 10.0537L6.404 8.99536L11.9997 14.591L17.5953 8.99536L18.6537 10.0537L11.9997 16.7077Z" fill="currentColor"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M13.9463 12.0003L8.35059 6.40466L9.4089 5.34636L15.5089 11.4003L15.063 11.9462L9.4089 18.654L8.35059 17.5957L13.9463 12.0003Z" fill="currentColor"/></svg>}
                </Box>
              </Box>
              <Box sx={{ flex: 1 }} />
              <Box
                className="section-trailing"
                sx={{ display: "flex", alignItems: "center", gap: "2px" }}
                onClick={e => e.stopPropagation()}
              >
                <IconButton size="small" sx={{ width: 24, height: 24, borderRadius: "6px", "&:hover": { backgroundColor: "rgba(0,0,0,0.06)" } }}>
                  <FolderAddIcon />
                </IconButton>
              </Box>
            </Box>
            {projectsOpen && unpinnedThreads.length > 0 && (
              <Box sx={{ pl: "16px", display: "flex" }}>
                <Box sx={{ flex: "1 1 0", display: "flex", flexDirection: "column" }}>
                  {unpinnedThreads.slice(0, 4).map((thread) => (
                    <OverlayThreadRow
                      key={thread.id}
                      thread={thread}
                      isActive={activeProjectId === thread.id}
                      onLoadThread={(t) => onOpenProject(t)}
                      isPinned={false}
                      onPin={handleTogglePin}
                      showTooltip={false}
                    />
                  ))}
                  <Box component="button" sx={{ all: "unset", cursor: "pointer", display: "flex",
                    pl: "12px", pr: "4px", py: "8px", borderRadius: "12px", "&:hover": { opacity: 0.8 } }}>
                    <Box sx={{ color: "#1C4EE4", fontSize: "12px", fontWeight: 600, lineHeight: "16px" }}>View all</Box>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

          {/* ── Chat history section ── */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <Box
              onClick={() => setHistoryOpen(o => !o)}
              sx={{
                boxSizing: "border-box",
                cursor: "pointer",
                display: "flex",
                width: "100%",
                padding: "8px",
                overflow: "hidden",
                borderRadius: "12px",
                alignItems: "center",
                gap: "8px",
                flexShrink: 0,
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                "& .section-chevron": { opacity: 0, transition: "opacity 120ms ease" },
                "& .section-trailing": { opacity: 0, transition: "opacity 120ms ease" },
                "&:hover .section-chevron": { opacity: 1 },
                "&:hover .section-trailing": { opacity: 1 },
              }}
            >
              <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", color: TEXT_DEFAULT }}><MessageIcon size="md" /></Box>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <Box sx={{ color: TEXT_DEFAULT, fontSize: "12px", fontWeight: 400, lineHeight: "16px" }}>Chat history</Box>
                <Box className="section-chevron" sx={{ display: "flex", alignItems: "center", color: TEXT_DEFAULT }}>
                  {historyOpen
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11.9997 16.7077L5.3457 10.0537L6.404 8.99536L11.9997 14.591L17.5953 8.99536L18.6537 10.0537L11.9997 16.7077Z" fill="currentColor"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M13.9463 12.0003L8.35059 6.40466L9.4089 5.34636L15.5089 11.4003L15.063 11.9462L9.4089 18.654L8.35059 17.5957L13.9463 12.0003Z" fill="currentColor"/></svg>}
                </Box>
              </Box>
              <Box sx={{ flex: 1 }} />
              <Box
                className="section-trailing"
                sx={{ display: "flex", alignItems: "center" }}
                onClick={e => e.stopPropagation()}
              >
                <DeleteAllChatsMenu onDeleteAll={onDeleteAll} />
              </Box>
            </Box>

            {historyOpen && (
              <Box sx={{ pl: "16px", display: "flex" }}>
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  {unpinnedThreads.length === 0 ? (
                    <Typography sx={{ fontSize: "12px", fontWeight: 400, lineHeight: "16px", color: color.type.muted.value, pl: "8px", pt: "4px" }}>
                      No recent chats
                    </Typography>
                  ) : (
                    <>
                      {unpinnedThreads.map((thread) => (
                        <OverlayThreadRow
                          key={thread.id}
                          thread={thread}
                          isActive={currentThreadId === thread.id}
                          onLoadThread={onLoadThread}
                          isPinned={false}
                          onPin={handleTogglePin}
                          showTooltip={true}
                        />
                      ))}
                      <Box component="button" sx={{ all: "unset", cursor: "pointer", display: "flex",
                        pl: "12px", pr: "4px", py: "8px", borderRadius: "12px", "&:hover": { opacity: 0.8 } }}>
                        <Box sx={{ color: "#1C4EE4", fontSize: "12px", fontWeight: 600, lineHeight: "16px" }}>View all</Box>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            )}
          </Box>

          {/* close sections wrapper */}
          </Box>

          {/* ── Bottom footer: Expert skills + Settings ── */}
          <Box
            sx={({ tokens: { semantic: { color } } }) => ({
              flexShrink: 0,
              borderTop: `1px solid ${PANEL_DIVIDER}`,
              backgroundColor: color.surface.default.value,
              mx: "-12px",
              pl: "16px",
              pr: "20px",
              py: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            })}
          >
            {/* Expert skills */}
            <Box
              component="button"
              onClick={onExpertSkills}
              sx={{ all: "unset", boxSizing: "border-box", cursor: "pointer", display: "flex", width: "100%" }}
            >
              <Box
                sx={{
                  flex: "1 0 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "24px",
                  px: "12px",
                  py: "8px",
                  borderRadius: "12px",
                  position: "relative",
                  backgroundColor: expertSkillsActive ? "rgba(0,64,213,0.06)" : "transparent",
                  "&:hover": { backgroundColor: expertSkillsActive ? "rgba(0,64,213,0.10)" : "rgba(0,0,0,0.04)" },
                }}
              >
                {expertSkillsActive && (
                  <Box sx={{ position: "absolute", left: 0, top: "25%", bottom: "25%", width: "2px", backgroundColor: "#0040D5", borderRadius: "24px" }} />
                )}
                <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", color: expertSkillsActive ? "#0040D5" : TEXT_DEFAULT }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.2213 14.7884H12.7789L12.8905 13.7019C13.0879 13.6519 13.2729 13.5791 13.4453 13.4836C13.6177 13.3881 13.7649 13.2698 13.8867 13.1288L14.8636 13.5807L15.6424 12.2558L14.777 11.6115C14.8488 11.4077 14.8847 11.2038 14.8847 11C14.8847 10.7961 14.8488 10.5923 14.777 10.3884L15.6424 9.7442L14.8636 8.41923L13.8867 8.87115C13.7649 8.73012 13.6177 8.61184 13.4453 8.51633C13.2729 8.42081 13.0879 8.34805 12.8905 8.29805L12.7789 7.21153H11.2213L11.1097 8.29805C10.9123 8.34805 10.7274 8.42081 10.5549 8.51633C10.3825 8.61184 10.2354 8.73012 10.1136 8.87115L9.13667 8.41923L8.35784 9.7442L9.22322 10.3884C9.15142 10.5923 9.11552 10.7961 9.11552 11C9.11552 11.2038 9.15142 11.4077 9.22322 11.6115L8.35784 12.2558L9.13667 13.5807L10.1136 13.1288C10.2354 13.2698 10.3825 13.3881 10.5549 13.4836C10.7274 13.5791 10.9123 13.6519 11.1097 13.7019L11.2213 14.7884ZM12.0001 12.6827C11.5322 12.6827 11.1347 12.5192 10.8078 12.1923C10.4809 11.8654 10.3174 11.4679 10.3174 11C10.3174 10.532 10.4809 10.1346 10.8078 9.80765C11.1347 9.48073 11.5322 9.31728 12.0001 9.31728C12.4681 9.31728 12.8655 9.48073 13.1924 9.80765C13.5194 10.1346 13.6828 10.532 13.6828 11C13.6828 11.4679 13.5194 11.8654 13.1924 12.1923C12.8655 12.5192 12.4681 12.6827 12.0001 12.6827ZM6.50014 21.5V17.4692C5.55014 16.6025 4.81264 15.6093 4.28764 14.4894C3.76264 13.3695 3.50014 12.2032 3.50014 10.9904C3.50014 8.6314 4.32707 6.6266 5.98092 4.97595C7.63475 3.32532 9.64115 2.5 12.0001 2.5C13.9424 2.5 15.6793 3.08045 17.2107 4.24135C18.7421 5.40225 19.7366 6.90833 20.1943 8.7596L21.6308 14.5H18.5001V19.5H14.5001V21.5H13.0001V18H17.0001V13H19.7001L18.7501 9.12498C18.3668 7.60189 17.5469 6.36696 16.2905 5.42018C15.0341 4.47338 13.604 3.99998 12.0001 3.99998C10.0668 3.99998 8.41678 4.67658 7.05012 6.02978C5.68345 7.38299 5.00012 9.02627 5.00012 10.9596C5.00012 11.9596 5.20428 12.908 5.61262 13.8048C6.02095 14.7016 6.60012 15.5 7.35012 16.2L8.00012 16.8V21.5H6.50014Z" fill="currentColor"/>
                  </svg>
                </Box>
                <Box sx={{ fontSize: "14px", fontWeight: 400, lineHeight: "20px", letterSpacing: "0.2px", color: expertSkillsActive ? "#0040D5" : TEXT_DEFAULT }}>
                  Expert skills
                </Box>
              </Box>
            </Box>

            {/* Preferences / Settings */}
            {onPreferences && (
              <Box
                component="button"
                onClick={onPreferences}
                sx={{ all: "unset", boxSizing: "border-box", cursor: "pointer", display: "flex", width: "100%" }}
              >
                <Box
                  sx={{
                    flex: "1 0 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "24px",
                    px: "12px",
                    py: "8px",
                    borderRadius: "12px",
                    position: "relative",
                    backgroundColor: settingsActive ? "rgba(0,64,213,0.06)" : "transparent",
                    "&:hover": { backgroundColor: settingsActive ? "rgba(0,64,213,0.10)" : "rgba(0,0,0,0.04)" },
                  }}
                >
                  {settingsActive && (
                    <Box sx={{ position: "absolute", left: 0, top: "25%", bottom: "25%", width: "2px", backgroundColor: "#0040D5", borderRadius: "24px" }} />
                  )}
                  <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", color: settingsActive ? "#0040D5" : TEXT_DEFAULT }}>
                    <SettingsIcon size="lg" />
                  </Box>
                  <Box sx={{ fontSize: "14px", fontWeight: 400, lineHeight: "20px", letterSpacing: "0.2px", color: settingsActive ? "#0040D5" : TEXT_DEFAULT }}>
                    Preferences
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

        </Box>
      ) : (
        /* ── Admin full-screen left panel (unchanged) ── */
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            pt: "24px",
            pl: "20px",
          }}
        >
          <Button
            variant="text"
            size="small"
            startIcon={<AddCircleIcon size="lg" />}
            onClick={onNewChat}
            sx={{
              height: "24px",
              pl: "8px !important",
              pr: "8px !important",
              py: "4px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              lineHeight: "16px",
              letterSpacing: "0.3px",
              color: "#242628",
              textTransform: "none",
              "& .MuiButton-startIcon": { marginRight: "4px !important", color: "#242628" },
              alignSelf: "flex-start",
            }}
          >
            New chat
          </Button>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: "24px", pl: "12px", pr: "8px" }}>
            <Typography sx={{ fontSize: "12px", fontWeight: 600, lineHeight: "16px", letterSpacing: "0.3px", color: color.type.muted.value }}>
              Chat history
            </Typography>
            {threads.length > 0 && <DeleteAllChatsMenu onDeleteAll={onDeleteAll} />}
          </Stack>

          <Box sx={{ flex: 1, overflowY: "auto", pr: "8px", mt: "8px" }}>
            {isNewChatActive && (
              <Box
                sx={{
                  borderRadius: "6px",
                  backgroundColor: "rgba(0,0,0,0.04)",
                  px: "12px",
                  py: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  lineHeight: "20px",
                  color: TEXT_DEFAULT,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                New chat
              </Box>
            )}
            {threads.length === 0 && !isNewChatActive ? (
              <Typography sx={({ tokens: { semantic: { color } } }) => ({ fontSize: "12px", fontWeight: 600, lineHeight: "16px", letterSpacing: "0.3px", color: color.type.muted.value, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", pl: "12px", pt: "4px" })}>
                No recent chats
              </Typography>
            ) : (
              <Stack>
                {threads.map((thread) => (
                  <ChatThreadItem
                    key={thread.id}
                    thread={thread}
                    variant="overlay"
                    isActive={currentThreadId === thread.id}
                    onLoadThread={onLoadThread}
                    onNewChat={onNewChat}
                  />
                ))}
              </Stack>
            )}
          </Box>

          {onPreferences && (
            <Box
              sx={({ tokens: { semantic: { color } } }) => ({
                flexShrink: 0,
                borderTop: `1px solid ${PANEL_DIVIDER}`,
                p: "12px",
                backgroundColor: color.surface.default.value,
                display: "flex",
                justifyContent: "flex-end",
              })}
            >
              <Button
                variant="text"
                size="small"
                startIcon={<SettingsIcon size="md" />}
                onClick={onPreferences}
                sx={({ tokens: { semantic: { color } } }) => ({
                  textTransform: "none",
                  color: color.type.default.value,
                  fontSize: "14px",
                  fontWeight: 600,
                  "& .MuiButton-startIcon": { color: color.type.default.value },
                })}
              >
                Preferences
              </Button>
            </Box>
          )}

        </Box>
      )}

      {activeTab === 1 && !hideInsightsFooter && (
        <Box
          sx={({ tokens: { semantic: { color } } }) => ({
            flexShrink: 0,
            borderTop: `1px solid ${PANEL_DIVIDER}`,
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: "16px",
            backgroundColor: color.surface.default.value,
          })}
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
    </Box>
  );
}

// ─── Insights panel ───────────────────────────────────────────────────────────

const INSIGHT_ITEMS_ADMIN = [
  { id: "summary" as const, Icon: SmartSummaryIcon, label: "Smart Summary", desc: "Create and read an accurate executive summary" },
  { id: "prep" as const, Icon: SmartPrepIcon, label: "Smart Prep", desc: "Prepare smarter with suggested discussion topics" },
  { id: "risk" as const, Icon: SmartRiskScannerIcon, label: "Smart Risk Scanner", desc: "Identify potential business risks" },
];

const INSIGHT_ITEMS_DIRECTOR = [
  { id: "summary" as const, Icon: SmartSummaryIcon, label: "Smart Summary", desc: "Read a summary before or after reviewing materials" },
  { id: "prep" as const, Icon: SmartPrepIcon, label: "Smart Prep", desc: "Prepare confidently with suggested discussion topics and questions" },
  { id: "risk" as const, Icon: SmartRiskScannerIcon, label: "Smart Risk Scanner", desc: "Identify potential business risks" },
];

const INSIGHT_ITEMS_ADMIN_EXPLO = [
  ...INSIGHT_ITEMS_ADMIN,
  { id: "audit" as const, Icon: AuditSmartPrepIcon, label: "Audit Smart Prep", desc: "Prepare for the audit committee with an expert lens" },
];

const INSIGHT_ITEMS_DIRECTOR_EXPLO = [
  ...INSIGHT_ITEMS_DIRECTOR,
  { id: "audit" as const, Icon: AuditSmartPrepIcon, label: "Audit Smart Prep", desc: "Prepare for the audit committee with an expert lens" },
];

function InsightsList({ onSelect, audience = "admin" }: { onSelect: (id: "summary" | "prep" | "risk" | "audit") => void; audience?: "admin" | "director" }) {
  const { tokens: { semantic: { color, fontWeight }, core: { spacing } } } = useTheme();
  const items = audience === "director" ? INSIGHT_ITEMS_DIRECTOR_EXPLO : INSIGHT_ITEMS_ADMIN_EXPLO;
  return (
    <Box sx={{ flex: 1, overflowY: "auto", px: "24px", pt: "24px", pb: "16px", backgroundColor: "#fff" }}>
      {audience === "director" && (
        <Stack gap={spacing["1"].value} sx={{ mb: spacing["3"].value }}>
          <Typography variant="body1" sx={{ fontWeight: fontWeight.emphasis.value, color: TEXT_DEFAULT }}>
            Your own AI governance advisor: Instant insights for better governance
          </Typography>
          <Typography variant="textMd" sx={{ color: color.type.muted.value }}>
            Insights brings intelligent assistance to streamline the way boards and executives prepare for, participate in, and follow up on meetings. Backed by Diligent's 20+ years of governance expertise and built with enterprise-grade security, sharpen your focus and unlock faster insights with AI-powered governance.
          </Typography>
        </Stack>
      )}
      <Stack gap="12px" sx={{ mt: audience === "director" ? 0 : spacing["1"].value }}>
        {items.map(({ id, Icon, label, desc }) => (
          <Box
            key={id}
            component="button"
            onClick={() => onSelect(id)}
            sx={{
              all: "unset",
              boxSizing: "border-box",
              cursor: "pointer",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              p: "16px",
              border: `1px solid ${PANEL_DIVIDER}`,
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
              <Typography variant="body1" sx={{ fontWeight: fontWeight.emphasis.value, color: TEXT_DEFAULT }}>
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
  );
}

function InsightsEmptyState() {
  return (
    <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: "24px" }}>
      <Box
        sx={{
          flex: 1,
          alignSelf: "stretch",
          backgroundColor: "#fff",
          border: `1px solid ${PANEL_DIVIDER}`,
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: "24px",
        }}
      >
        <Stack alignItems="center" gap="48px" sx={{ width: "688px", maxWidth: "100%" }}>
          <InsightsEmptyStateIllustration />
          <Typography
            sx={{
              width: "100%",
              textAlign: "center",
              color: "#282E37",
              fontFamily: "var(--lens-semantic-font-title-h3-lg-font-family)",
              fontSize: "var(--lens-semantic-font-title-h3-lg-font-size)",
              fontWeight: "var(--lens-semantic-font-weight-emphasis)",
              letterSpacing: "var(--lens-semantic-font-title-h3-lg-letter-spacing)",
              lineHeight: "var(--lens-semantic-font-title-h3-lg-line-height)",
            }}
          >
            Content appears here once you select an AI tool
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}

function InsightDetail({
  view,
  scrollRef,
}: {
  view: "summary" | "prep" | "risk" | "audit";
  bookTitle?: string;
  scrollRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <Box ref={scrollRef} sx={{ flex: 1, overflowY: "auto", px: "48px", py: "32px" }}>
      <Box sx={{ width: "100%", maxWidth: "916px", mx: "auto" }}>
        {view === "summary" && <InsightSummaryView />}
        {view === "prep" && <InsightPrepView />}
        {view === "risk" && <InsightRiskView />}
        {view === "audit" && <InsightAuditView />}
      </Box>
    </Box>
  );
}

// ─── Project page ─────────────────────────────────────────────────────────────

function ProjectThreadCard({
  thread,
  onLoad,
}: {
  thread: ChatThread;
  onLoad: (t: ChatThread) => void;
}) {
  const { tokens: { semantic: { color } } } = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const formattedDate = new Date(thread.updatedAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
  return (
    <>
      <Box
        onClick={() => onLoad(thread)}
        sx={{
          border: `1px solid ${color.ui.divider.default.value}`,
          borderRadius: "12px",
          p: "16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          cursor: "pointer",
          backgroundColor: color.surface.default.value,
          "&:hover": {
            backgroundColor: color.surface.variant.value,
            "& .project-card-more": { opacity: 1 },
          },
          "& .project-card-more": {
            opacity: Boolean(anchorEl) ? 1 : 0,
            transition: "opacity 120ms ease",
          },
        }}
      >
        <Stack sx={{ flex: 1, gap: "4px", minWidth: 0 }}>
          <Typography sx={{ fontSize: "14px", fontWeight: 500, lineHeight: "20px", color: TEXT_DEFAULT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {thread.title}
          </Typography>
          <Typography sx={{ fontSize: "12px", lineHeight: "16px", color: color.type.muted.value }}>
            {formattedDate}
          </Typography>
        </Stack>
        <IconButton
          className="project-card-more"
          size="small"
          onClick={(e) => { e.stopPropagation(); setAnchorEl(e.currentTarget); }}
          disableRipple
          sx={{
            width: 32, height: 32, borderRadius: "8px", flexShrink: 0,
            "&:hover": { backgroundColor: "rgba(0,0,0,0.06)" },
            "&.Mui-focusVisible": { outline: "none", boxShadow: "none" },
          }}
        >
          <MoreIcon size="md" />
        </IconButton>
      </Box>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { mt: "4px", borderRadius: "12px", boxShadow: "0 4px 16px rgba(0,0,0,0.12), 0 0 2px rgba(0,0,0,0.08)", minWidth: "200px", py: "8px", border: `1px solid ${color.ui.divider.default.value}` } } }}
      >
        <MenuItem onClick={() => setAnchorEl(null)} sx={{ px: "16px", py: "12px", gap: 0, "&:hover": { backgroundColor: color.surface.variant.value } }}>
          <Stack direction="row" alignItems="center" gap="12px"><EditIcon size="md" /><Typography sx={{ fontSize: "14px", lineHeight: "20px", color: color.type.default.value }}>Rename</Typography></Stack>
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)} sx={{ px: "16px", py: "12px", gap: 0, "&:hover": { backgroundColor: color.surface.variant.value } }}>
          <Stack direction="row" alignItems="center" gap="12px"><PinIcon size="md" /><Typography sx={{ fontSize: "14px", lineHeight: "20px", color: color.type.default.value }}>Pin</Typography></Stack>
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)} sx={{ px: "16px", py: "12px", gap: 0, "&:hover": { backgroundColor: color.surface.variant.value } }}>
          <Stack direction="row" alignItems="center" gap="12px" sx={{ color: color.status.error.text.value }}><TrashIcon size="md" /><Typography sx={{ fontSize: "14px", lineHeight: "20px", color: "inherit" }}>Delete</Typography></Stack>
        </MenuItem>
      </Menu>
    </>
  );
}

function ProjectPage({
  project,
  childThreads,
  onLoadThread,
  leadingActions,
  trailingActions,
  onSubmit,
  composerPlaceholder,
  setComposerAnchor,
}: {
  project: ChatThread;
  childThreads: ChatThread[];
  onLoadThread: (thread: ChatThread) => void;
  leadingActions: React.ReactNode;
  trailingActions: React.ReactNode;
  onSubmit: (text: string) => void;
  composerPlaceholder: string;
  setComposerAnchor: (el: HTMLDivElement | null) => void;
}) {
  const { tokens: { semantic: { color } } } = useTheme();
  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: CHAT_BG }}>
      {/* Scrollable body */}
      <Box sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", px: "48px" }}>
        <Box sx={{ width: "100%", maxWidth: "708px" }}>

          {/* Header */}
          <Box sx={{ pt: "32px", pb: "32px", display: "flex", alignItems: "center", gap: "12px" }}>
            <Box sx={{ color: TEXT_DEFAULT, display: "flex", alignItems: "center", flexShrink: 0 }}><FolderIcon size="lg" /></Box>
            <Typography sx={{ fontSize: "20px", fontWeight: 600, lineHeight: "28px", color: TEXT_DEFAULT, flex: 1 }}>{project.title}</Typography>
            <Stack direction="row" alignItems="center" gap="4px" sx={{ flexShrink: 0 }}>
              <IconButton size="small" sx={{ width: 32, height: 32, borderRadius: "8px", "&:hover": { backgroundColor: "rgba(0,0,0,0.06)" } }}>
                <PinIcon size="md" />
              </IconButton>
              <IconButton size="small" sx={{ width: 32, height: 32, borderRadius: "8px", "&:hover": { backgroundColor: "rgba(0,0,0,0.06)" } }}>
                <VerticalDotsIcon />
              </IconButton>
            </Stack>
          </Box>

          {/* Real AIChatBox — matches welcome screen exactly */}
          <Box ref={setComposerAnchor} sx={{ pb: "32px" }}>
            <Box sx={{
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid #DEE0E9",
              boxShadow: "-1px 4px 8px rgba(135,135,135,0.08), -2px 9px 12px rgba(135,135,135,0.06), -12px 38px 24px rgba(135,135,135,0.02)",
            }}>
              <AIChatBox
                onSubmit={onSubmit}
                onStop={() => {}}
                isUploadAvailable={false}
                leadingActions={leadingActions}
                trailingActions={trailingActions}
                contentBelow={null}
                sx={{
                  "& .MuiInputBase-input": { padding: "16px 24px 12px", fontSize: "14px !important" },
                  "& .AtlasAIGlow-root": { display: "none !important" },
                  "& .AtlasAIChatBox-gradient-border": { display: "none !important" },
                }}
                slotProps={{
                  textField: { placeholder: composerPlaceholder },
                  disclaimer: { stackProps: { style: { display: "none" } } },
                }}
              />
            </Box>
          </Box>

          {/* Recent chats */}
          <Box sx={{ pb: "48px" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px", mb: "16px" }}>
              <Typography sx={{ fontSize: "14px", fontWeight: 600, lineHeight: "20px", color: color.type.muted.value, flexShrink: 0 }}>
                Recent chats
              </Typography>
              <Box sx={{ flex: 1, height: "1px", backgroundColor: color.ui.divider.default.value }} />
            </Box>
            {childThreads.length === 0 ? (
              <Typography sx={{ fontSize: "14px", color: color.type.muted.value, pl: "4px" }}>No chats yet</Typography>
            ) : (
              <Stack gap="8px">
                {childThreads.map((thread) => (
                  <ProjectThreadCard key={thread.id} thread={thread} onLoad={onLoadThread} />
                ))}
              </Stack>
            )}
          </Box>

        </Box>
      </Box>
    </Box>
  );
}

// ─── Project files side panel ─────────────────────────────────────────────────

const MOCK_PROJECT_DOCS = [
  { id: "d1", name: "Cybersecurity Q2 Report.pdf",       date: "Jun 15, 2026" },
  { id: "d2", name: "Risk Assessment 2026.docx",         date: "May 3, 2026"  },
  { id: "d3", name: "Incident Response Framework.pdf",   date: "Apr 20, 2026" },
];

const MOCK_PROJECT_ARTIFACTS = [
  { id: "a1", name: "Risk Summary",          date: "Today"         },
  { id: "a2", name: "Key Findings Analysis", date: "Yesterday"     },
  { id: "a3", name: "Action Items",          date: "Jun 14, 2026"  },
];

function ProjectFilesPanel({ onClose }: { onClose: () => void }) {
  const { tokens: { semantic: { color } } } = useTheme();
  return (
    <Box sx={{
      width: 272,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      borderLeft: `1px solid ${color.ui.divider.default.value}`,
      backgroundColor: "#fff",
      overflow: "hidden",
    }}>
      {/* Header */}
      <Box sx={{ px: "16px", py: "10px", borderBottom: `1px solid ${color.ui.divider.default.value}`, display: "flex", alignItems: "center", gap: "8px" }}>
        <IconButton size="small" onClick={onClose} disableRipple sx={{ width: 32, height: 32, borderRadius: "8px", flexShrink: 0, "&:hover": { backgroundColor: "rgba(0,0,0,0.06)" } }}>
          <CollapseSideNavIcon size="md" />
        </IconButton>
        <Typography sx={{ fontSize: "14px", fontWeight: 600, lineHeight: "20px", color: TEXT_DEFAULT }}>Files</Typography>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflowY: "auto", px: "12px", py: "16px" }}>
        {/* Documents */}
        <Typography sx={{ fontSize: "11px", fontWeight: 600, lineHeight: "16px", letterSpacing: "0.5px", color: color.type.muted.value, textTransform: "uppercase", mb: "6px", px: "8px" }}>
          Documents
        </Typography>
        <Stack gap="2px" sx={{ mb: "20px" }}>
          {MOCK_PROJECT_DOCS.map(doc => (
            <Box key={doc.id} sx={{ display: "flex", alignItems: "center", gap: "10px", px: "8px", py: "7px", borderRadius: "8px", cursor: "pointer", "&:hover": { backgroundColor: color.surface.variant.value } }}>
              <Box sx={{ color: color.type.muted.value, flexShrink: 0, display: "flex" }}><ReportsIcon size="md" /></Box>
              <Stack sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: "13px", fontWeight: 500, lineHeight: "18px", color: TEXT_DEFAULT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.name}</Typography>
                <Typography sx={{ fontSize: "11px", lineHeight: "16px", color: color.type.muted.value }}>{doc.date}</Typography>
              </Stack>
            </Box>
          ))}
        </Stack>

        {/* AI Artifacts */}
        <Typography sx={{ fontSize: "11px", fontWeight: 600, lineHeight: "16px", letterSpacing: "0.5px", color: color.type.muted.value, textTransform: "uppercase", mb: "6px", px: "8px" }}>
          AI Artifacts
        </Typography>
        <Stack gap="2px">
          {MOCK_PROJECT_ARTIFACTS.map(artifact => (
            <Box key={artifact.id} sx={{ display: "flex", alignItems: "center", gap: "10px", px: "8px", py: "7px", borderRadius: "8px", cursor: "pointer", "&:hover": { backgroundColor: color.surface.variant.value } }}>
              <Box sx={{ color: color.type.muted.value, flexShrink: 0, display: "flex" }}><AiSparkleIcon size="md" /></Box>
              <Stack sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: "13px", fontWeight: 500, lineHeight: "18px", color: TEXT_DEFAULT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{artifact.name}</Typography>
                <Typography sx={{ fontSize: "11px", lineHeight: "16px", color: color.type.muted.value }}>{artifact.date}</Typography>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface SmartAssistOverlayProps {
  open: boolean;
  onClose: () => void;
  onCollapse?: () => void;
  bookTitle?: string;
  showInsights?: boolean;
  audience?: "admin" | "director";
  hideInsightsFooter?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SmartAssistOverlay({ open, onClose, onCollapse, bookTitle, showInsights = false, audience = "admin", hideInsightsFooter = false }: SmartAssistOverlayProps) {
  // Shared conversation state from context
  const {
    messages,
    sources,
    isGenerating,
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
    overlayLeftPanelOpen,
    setOverlayLeftPanelOpen,
    activeTab,
    setActiveTab,
    selectedInsight,
    setSelectedInsight,
    setAudience,
    composerFocusNonce,
    requestComposerFocus,
    consumeComposerFocus,
    consumePersonalizationRequest,
    demoMode,
    demoStepsDone,
    demoPending,
    demoNotesOpen,
    setDemoNotesOpen,
  } = useSmartAssist();

  const { tokens: { semantic: { color } } } = useTheme();

  // AGAI integration use cases demo: the thread list isn't part of the story, so give the chat
  // and the presenter notes the width.
  useEffect(() => {
    if (!demoMode) return;
    setOverlayLeftPanelOpen(false);
    return () => setOverlayLeftPanelOpen(true);
  }, [demoMode, setOverlayLeftPanelOpen]);

  useEffect(() => {
    setAudience(audience);
  }, [audience, setAudience]);

  // The Insights tab only exists in the GovernAI (book) context. `activeTab`
  // lives in shared context and persists across navigation, so opening Insights
  // inside a book and then opening Smart Assist outside one would otherwise
  // render the Insights view in the content area. Force the chat tab whenever
  // insights aren't available here.
  const effectiveTab = showInsights ? activeTab : 0;

  // setPrompt is still needed for suggestion card clicks (populate AIChatBox input)
  const { setPrompt, prompt } = useAIChatContext();

  // AGAI integration use cases demo: clicking into an empty composer drops in the next scripted
  // query, so the presenter only has to press send.
  const prefillDemoPrompt = () => {
    const next = DEMO_STEPS[demoStepsDone];
    if (demoMode && next && !isGenerating && !prompt.trim()) setPrompt(next.prompt);
  };

  const { previewSource, closeCitation } = useCitationPreview();

  // UI-only local state
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<HTMLElement | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [projectFilesPanelOpen, setProjectFilesPanelOpen] = useState(false);
  const [personalizationOpen, setPersonalizationOpen] = useState(false);
  const promptBeforePrefs = useRef<string>("");
  const [expertSkillsPageOpen, setExpertSkillsPageOpen] = useState(false);

  // Chatbox toolbar state
  const [extendedThinking, setExtendedThinking] = useState(false);
  const [toolsMenuAnchor, setToolsMenuAnchor] = useState<HTMLElement | null>(null);
  const toolsButtonRef = useRef<HTMLDivElement | null>(null);
  const [expertSkillsAnchor, setExpertSkillsAnchor] = useState<HTMLElement | null>(null);
  const [agentReportingAnchor, setAgentReportingAnchor] = useState<HTMLElement | null>(null);
  const [searchScopeAnchor, setSearchScopeAnchor] = useState<HTMLElement | null>(null);

  // Active mode chips (agent + expert combinable; agent + research mutually exclusive)
  const [activeExpertSkill, setActiveExpertSkill] = useState<string | null>(null);
  const [activeAgentMode, setActiveAgentMode] = useState<string | null>(null);
  const [deepResearchActive, setDeepResearchActive] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  // Search scope: null = default (all materials), "books" = Current & archived books, "resource" = Resource center, "book" = current book
  const [searchScope, setSearchScope] = useState<"books" | "resource" | "dataroom" | "tasks" | "decisions" | "questionnaires" | "book" | null>(inBook ? "book" : null);
  const submenuDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  // @ mention autocomplete state — must be declared before registerComposerInput
  const [atMentionOpen, setAtMentionOpen] = useState(false);
  const [atMentionQuery, setAtMentionQuery] = useState("");
  const atMentionListRef = useRef<HTMLDivElement>(null);

  // / slash (expert skills) autocomplete state
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashMenuQuery, setSlashMenuQuery] = useState("");
  const slashMenuListRef = useRef<HTMLDivElement>(null);
  const closeToolsMenus = () => { if (submenuDelayRef.current) clearTimeout(submenuDelayRef.current); setToolsMenuAnchor(null); setExpertSkillsAnchor(null); setAgentReportingAnchor(null); setSearchScopeAnchor(null); };

  const handleTabChange = (v: number) => {
    setActiveTab(v);
    if (v !== 1) setSelectedInsight(null);
    setPersonalizationOpen(false);
    setExpertSkillsPageOpen(false);
  };

  // Selecting a chat or starting a new one leaves the personalization / expert-skills page.
  const handleNewChat = () => {
    setPersonalizationOpen(false);
    setExpertSkillsPageOpen(false);
    setActiveProjectId(null);
    setProjectFilesPanelOpen(false);
    closeCitation();
    resetChat();
  };

  const handleLoadThread = (thread: ChatThread) => {
    setPersonalizationOpen(false);
    setExpertSkillsPageOpen(false);
    if (thread.isProject) {
      setActiveProjectId(thread.id);
      setProjectFilesPanelOpen(true);
      return;
    }
    setActiveProjectId(null);
    closeCitation();
    loadThread(thread.messages, thread.id);
  };

  const handleOpenProject = (thread: ChatThread) => {
    setPersonalizationOpen(false);
    setExpertSkillsPageOpen(false);
    setActiveProjectId(thread.id);
    setProjectFilesPanelOpen(false);
    resetChat();
  };

  // A document preview never carries over into a reopened chat.
  useEffect(() => {
    if (!open) closeCitation();
  }, [open, closeCitation]);

  // Mutual exclusion: citation preview and history panel can't both be open
  useEffect(() => {
    if (previewSource) {
      setOverlayLeftPanelOpen(false);
    }
  }, [previewSource]);

  // Close files panel whenever we leave a project context or navigate to a full-screen page.
  useEffect(() => {
    if (activeProjectId === null || expertSkillsPageOpen || personalizationOpen) {
      setProjectFilesPanelOpen(false);
    }
  }, [activeProjectId, expertSkillsPageOpen, personalizationOpen]);

  // Closing the whole overlay leaves the personalization/expert-skills page, so
  // reopening lands back on the chat view rather than a settings page.
  useEffect(() => {
    if (!open) { setPersonalizationOpen(false); setExpertSkillsPageOpen(false); }
  }, [open]);

  // When the docked panel requests personalization, it expands to this overlay
  // and signals via the shared nonce; show the page once we're the visible
  // surface. Gated on `open` so only the live overlay claims the request.
  useEffect(() => {
    if (!open) return;
    if (consumePersonalizationRequest()) { promptBeforePrefs.current = prompt; setPersonalizationOpen(true); }
  }, [open, consumePersonalizationRequest]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const insightDetailScrollRef = useRef<HTMLDivElement>(null);
  const composerInputRef = useRef<HTMLTextAreaElement>(null);
  // The composer wrapper element, used to anchor the suggestion dropdown above
  // it. Stored in state (callback ref) so the dropdown re-renders once mounted.
  const [composerAnchor, setComposerAnchor] = useState<HTMLDivElement | null>(null);

  // Keep the latest handleSend reachable from the imperatively-attached keydown
  // listener below without re-binding it every render (handleSend is a fresh
  // closure each render).
  const handleSendRef = useRef(handleSend);
  handleSendRef.current = handleSend;

  // Callback ref for the AIChatBox textarea. Besides storing the node (for the
  // focus effect), it attaches a capture-phase Enter handler so Enter ALWAYS
  // submits — Atlas AIChatBox only submits on Enter while single-line and
  // otherwise inserts a newline. Capturing before the component's own handler
  // lets us submit (Shift+Enter still adds a line break).
  const registerComposerInput = useCallback((node: HTMLTextAreaElement | null) => {
    composerInputRef.current = node;
    if (!node) return;
    node.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Escape") { setAtMentionOpen(false); setSlashMenuOpen(false); return; }
        if (e.key !== "Enter" || e.shiftKey || e.isComposing) return;
        e.preventDefault();
        e.stopPropagation();
        const value = node.value;
        if (value.trim()) handleSendRef.current(value);
      },
      true,
    );
  }, []);

  // Focus the AIChatBox composer when a prompt template is selected in this
  // overlay. Gated on `open` so only the visible full-screen surface consumes
  // the focus request (never a closed/other composer). Deferred a frame to win
  // over the dialog's focus trap on enter.
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

  // Scroll to bottom when a new message arrives
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }, [messages.length]);

  // Insert selected @agent tag into the composer, replacing the @… word at cursor
  const handleAtSelect = useCallback((agent: typeof AGENT_REPORTING[0]) => {
    setAtMentionOpen(false);
    const el = composerInputRef.current;
    if (!el) return;
    const text = el.value;
    const cursor = el.selectionStart ?? text.length;
    const before = text.slice(0, cursor);
    const lastSpace = Math.max(before.lastIndexOf(" "), before.lastIndexOf("\n"));
    const atStart = lastSpace + 1;
    const newText = text.slice(0, atStart) + agent.tag + " " + text.slice(cursor);
    setPrompt(newText);
    const newCursor = atStart + agent.tag.length + 1;
    requestAnimationFrame(() => {
      const el2 = composerInputRef.current;
      if (!el2) return;
      el2.focus();
      el2.setSelectionRange(newCursor, newCursor);
    });
  }, [setPrompt]);

  // Close @ mention on outside click
  useEffect(() => {
    if (!atMentionOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      if (atMentionListRef.current?.contains(e.target as Node)) return;
      if (composerInputRef.current?.contains(e.target as Node)) return;
      setAtMentionOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [atMentionOpen]);

  // Drive @ mention and / slash from the controlled prompt value — more reliable
  // than a native DOM input event on Atlas's controlled AIChatBox.
  useEffect(() => {
    if (!prompt) {
      setAtMentionOpen(false); setAtMentionQuery("");
      setSlashMenuOpen(false); setSlashMenuQuery("");
      return;
    }
    const el = composerInputRef.current;
    const cursor = el ? (el.selectionStart ?? prompt.length) : prompt.length;
    const before = prompt.slice(0, cursor);
    const lastSpace = Math.max(before.lastIndexOf(" "), before.lastIndexOf("\n"));
    const word = before.slice(lastSpace + 1);
    if (word.startsWith("@")) {
      setAtMentionQuery(word.slice(1).toLowerCase());
      setAtMentionOpen(true);
      setSlashMenuOpen(false); setSlashMenuQuery("");
    } else if (word.startsWith("/")) {
      setSlashMenuQuery(word.slice(1).toLowerCase());
      setSlashMenuOpen(true);
      setAtMentionOpen(false); setAtMentionQuery("");
    } else {
      setAtMentionOpen(false); setAtMentionQuery("");
      setSlashMenuOpen(false); setSlashMenuQuery("");
    }
  }, [prompt]);

  // Close slash menu on outside click
  useEffect(() => {
    if (!slashMenuOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      if (slashMenuListRef.current?.contains(e.target as Node)) return;
      if (composerInputRef.current?.contains(e.target as Node)) return;
      setSlashMenuOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [slashMenuOpen]);

  // Insert selected /skill slash into the composer, replacing the /… word at cursor
  const handleSlashSelect = useCallback((skill: typeof EXPERT_SKILLS[0] | null) => {
    setSlashMenuOpen(false);
    if (!skill) return; // "Manage expert skills" — just close
    const el = composerInputRef.current;
    if (!el) return;
    const text = el.value;
    const cursor = el.selectionStart ?? text.length;
    const before = text.slice(0, cursor);
    const lastSpace = Math.max(before.lastIndexOf(" "), before.lastIndexOf("\n"));
    const slashStart = lastSpace + 1;
    const newText = text.slice(0, slashStart) + skill.slash + " " + text.slice(cursor);
    setPrompt(newText);
    const newCursor = slashStart + skill.slash.length + 1;
    requestAnimationFrame(() => {
      const el2 = composerInputRef.current;
      if (!el2) return;
      el2.focus();
      el2.setSelectionRange(newCursor, newCursor);
    });
  }, [setPrompt]);

  const filteredAgents = AGENT_REPORTING.filter(a =>
    !atMentionQuery ||
    a.label.toLowerCase().includes(atMentionQuery) ||
    a.tag.toLowerCase().includes(atMentionQuery)
  );

  const filteredSkills = EXPERT_SKILLS.filter(s =>
    !slashMenuQuery ||
    s.label.toLowerCase().includes(slashMenuQuery) ||
    s.id.toLowerCase().includes(slashMenuQuery)
  );

  // Which Tools parent item currently has its submenu open — used to keep its
  // hover highlight visible while the submenu is showing.
  const activeToolsItem = searchScopeAnchor ? "scope" : expertSkillsAnchor ? "expert" : agentReportingAnchor ? "agent" : null;

  const searchScopeLabel = searchScope === "book" ? (currentBookTitle ?? "This book") : searchScope === "resource" ? "Resource center" : searchScope === "dataroom" ? "Data room" : searchScope === "tasks" ? "Tasks" : searchScope === "decisions" ? "Decision hub" : searchScope === "questionnaires" ? "Questionnaires" : searchScope === "books" ? "Current & archived books" : "";

  const MENU_PAPER_SX = {
    minWidth: 224,
    borderRadius: "8px",
    border: "1px solid #DEE0E9",
    boxShadow: "0 8px 16px rgba(0,0,0,0.1), 0 0 2px rgba(0,0,0,0.08)",
    overflow: "visible",
  };

  const activeExpertSkillData = activeExpertSkill ? (EXPERT_SKILLS.find(s => s.id === activeExpertSkill) ?? null) : null;
  const activeAgentModeData = activeAgentMode ? (AGENT_REPORTING.find(a => a.id === activeAgentMode) ?? null) : null;
  const anyChipActive = webSearchEnabled || searchScope !== null || !!activeExpertSkillData || !!activeAgentModeData || deepResearchActive;

  const scopedPlaceholder = "Ask anything about your board materials";
  const chatboxLeadingActions = (
    <>
      <Tooltip title="Attach file">
        <IconButton size="small" onClick={() => attachmentInputRef.current?.click()} sx={{ width: 32, height: 32, p: "4px", borderRadius: "12px", color: "#232429" }}>
          <UploadFileIcon />
        </IconButton>
      </Tooltip>
      <Box ref={toolsButtonRef} sx={{ display: "inline-flex", alignSelf: "center" }}>
        {anyChipActive ? (
          <Tooltip title="Tools">
            <IconButton
              size="small"
              onClick={() => setToolsMenuAnchor(toolsMenuAnchor ? null : toolsButtonRef.current)}
              sx={{ width: 32, height: 32, p: "4px", borderRadius: "8px", color: "#232429" }}
            >
              <ToolsSliderIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Button
            variant="text"
            size="small"
            startIcon={<ToolsSliderIcon />}
            endIcon={<CaretDownIcon size="md" />}
            onClick={() => setToolsMenuAnchor(toolsMenuAnchor ? null : toolsButtonRef.current)}
            sx={{ borderRadius: "12px", px: "8px", py: "4px", fontWeight: 500, fontSize: "14px", lineHeight: "20px", minWidth: 0, color: "#232429", textTransform: "none" }}
          >
            Tools
          </Button>
        )}
      </Box>
      {webSearchEnabled && (
        <Chip
          variant="outlined"
          size="small"
          icon={<svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 18.3333C8.84722 18.3333 7.76389 18.1146 6.75 17.6771C5.73611 17.2396 4.85417 16.6424 4.10417 15.8854C3.35417 15.1285 2.76042 14.2396 2.32292 13.2188C1.88542 12.1979 1.66667 11.1111 1.66667 9.95833C1.66667 8.80556 1.88542 7.72222 2.32292 6.70833C2.76042 5.69444 3.35417 4.81597 4.10417 4.07292C4.85417 3.32986 5.73611 2.73958 6.75 2.30208C7.76389 1.86458 8.84722 1.64583 10 1.64583C11.1528 1.64583 12.2361 1.86458 13.25 2.30208C14.2639 2.73958 15.1458 3.32986 15.8958 4.07292C16.6458 4.81597 17.2396 5.69444 17.677 6.70833C18.1146 7.72222 18.3333 8.80556 18.3333 9.95833C18.3333 11.1111 18.1146 12.1979 17.677 13.2188C17.2396 14.2396 16.6458 15.1285 15.8958 15.8854C15.1458 16.6424 14.2639 17.2396 13.25 17.6771C12.2361 18.1146 11.1528 18.3333 10 18.3333ZM10 16.8542C10.3889 16.3264 10.7257 15.7674 11.0104 15.1771C11.2951 14.5868 11.5278 13.9444 11.7083 13.25H8.29167C8.47222 13.9444 8.70486 14.5868 8.98958 15.1771C9.27431 15.7674 9.61111 16.3264 10 16.8542ZM8.10417 16.5833C7.84722 16.1111 7.61806 15.6007 7.41667 15.0521C7.21528 14.5035 7.04167 13.9028 6.89583 13.25H3.77083C4.25 14.1667 4.89236 14.9444 5.69792 15.5833C6.50347 16.2222 7.25 16.5069 8.10417 16.5833ZM11.8958 16.5833C12.75 16.5069 13.4965 16.2222 14.302 15.5833C15.1076 14.9444 15.75 14.1667 16.2292 13.25H13.1042C12.9583 13.9028 12.7847 14.5035 12.5833 15.0521C12.3819 15.6007 12.1528 16.1111 11.8958 16.5833ZM3.22917 11.75H6.64583C6.60417 11.4861 6.57292 11.2257 6.55208 10.9688C6.53125 10.7118 6.52083 10.3542 6.52083 9.95833C6.52083 9.5625 6.53125 9.20486 6.55208 8.94792C6.57292 8.69097 6.60417 8.44444 6.64583 8.20833H3.22917C3.15972 8.44444 3.10764 8.69097 3.07292 8.94792C3.03819 9.20486 3.02083 9.5625 3.02083 9.95833C3.02083 10.3542 3.03819 10.7118 3.07292 10.9688C3.10764 11.2257 3.15972 11.4861 3.22917 11.75ZM8.10417 11.75H11.8958C11.9375 11.4861 11.9688 11.2257 11.9896 10.9688C12.0104 10.7118 12.0208 10.3542 12.0208 9.95833C12.0208 9.5625 12.0104 9.20486 11.9896 8.94792C11.9688 8.69097 11.9375 8.44444 11.8958 8.20833H8.10417C8.0625 8.44444 8.03125 8.69097 8.01042 8.94792C7.98958 9.20486 7.97917 9.5625 7.97917 9.95833C7.97917 10.3542 7.98958 10.7118 8.01042 10.9688C8.03125 11.2257 8.0625 11.4861 8.10417 11.75ZM13.3542 11.75H16.7708C16.8403 11.4861 16.8924 11.2257 16.9271 10.9688C16.9618 10.7118 16.9792 10.3542 16.9792 9.95833C16.9792 9.5625 16.9618 9.20486 16.9271 8.94792C16.8924 8.69097 16.8403 8.44444 16.7708 8.20833H13.3542C13.3958 8.44444 13.4271 8.69097 13.4479 8.94792C13.4688 9.20486 13.4792 9.5625 13.4792 9.95833C13.4792 10.3542 13.4688 10.7118 13.4479 10.9688C13.4271 11.2257 13.3958 11.4861 13.3542 11.75ZM13.1042 6.70833H16.2292C15.75 5.79167 15.1076 5.01389 14.302 4.375C13.4965 3.73611 12.75 3.45139 11.8958 3.375C12.1528 3.84722 12.3819 4.35764 12.5833 4.90625C12.7847 5.45486 12.9583 6.05556 13.1042 6.70833ZM8.29167 6.70833H11.7083C11.5278 6.01389 11.2951 5.37153 11.0104 4.78125C10.7257 4.19097 10.3889 3.63194 10 3.10417C9.61111 3.63194 9.27431 4.19097 8.98958 4.78125C8.70486 5.37153 8.47222 6.01389 8.29167 6.70833ZM3.77083 6.70833H6.89583C7.04167 6.05556 7.21528 5.45486 7.41667 4.90625C7.61806 4.35764 7.84722 3.84722 8.10417 3.375C7.25 3.45139 6.50347 3.73611 5.69792 4.375C4.89236 5.01389 4.25 5.79167 3.77083 6.70833Z" fill="currentColor"/></svg>}
          label=""
          onDelete={() => setWebSearchEnabled(false)}
          sx={{
            alignSelf: "center",
            height: 24,
            borderRadius: "9999px",
            borderColor: "#888B9A",
            color: "#232429",
            "& .MuiChip-label": { padding: 0, width: 0 },
            "& .MuiChip-icon": { ml: "6px", color: "#232429" },
            "& .MuiChip-deleteIcon": { mr: "4px" },
          }}
        />
      )}
      {searchScope !== null && (
        <Chip
          variant="outlined"
          size="small"
          icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.8894 16.6474L10.9263 11.6843C10.5096 12.0005 10.0527 12.2454 9.55559 12.4191C9.05848 12.5927 8.54553 12.6795 8.01674 12.6795C6.71694 12.6795 5.61196 12.2245 4.7018 11.3146C3.79163 10.4047 3.33655 9.30026 3.33655 8.00133C3.33655 6.70238 3.79151 5.59751 4.70142 4.68672C5.61134 3.77595 6.71577 3.32056 8.01471 3.32056C9.31365 3.32056 10.4185 3.77564 11.3293 4.68581C12.2401 5.59597 12.6955 6.70095 12.6955 8.00074C12.6955 8.54556 12.606 9.06653 12.427 9.56364C12.2481 10.0608 12.0058 10.5096 11.7003 10.9103L16.6634 15.8734L15.8894 16.6474ZM8.01601 11.5962C9.02028 11.5962 9.87071 11.2479 10.5673 10.5513C11.2639 9.85472 11.6122 9.00429 11.6122 8.00002C11.6122 6.99574 11.2639 6.14531 10.5673 5.44872C9.87071 4.75214 9.02028 4.40385 8.01601 4.40385C7.01173 4.40385 6.1613 4.75214 5.46471 5.44872C4.76815 6.14531 4.41986 6.99574 4.41986 8.00002C4.41986 9.00429 4.76815 9.85472 5.46471 10.5513C6.1613 11.2479 7.01173 11.5962 8.01601 11.5962Z" fill="currentColor"/></svg>}
          label={searchScopeLabel}
          onDelete={() => setSearchScope(inBook ? "book" : null)}
          sx={{ alignSelf: "center", height: 24, borderRadius: "9999px", borderColor: "#888B9A", fontSize: "12px", fontWeight: 400, lineHeight: "16px", color: "#232429", "& .MuiChip-icon": { color: "#232429", width: 16, height: 16, ml: "6px", flexShrink: 0 } }}
        />
      )}
      {activeExpertSkillData && (
        <Chip
          variant="outlined"
          size="small"
          label={activeExpertSkillData.label}
          onDelete={() => setActiveExpertSkill(null)}
          sx={{ alignSelf: "center", height: 24, borderRadius: "9999px", borderColor: "#888B9A", fontSize: "12px", fontWeight: 400, lineHeight: "16px", color: "#232429" }}
        />
      )}
      {activeAgentModeData && (
        <Chip
          variant="outlined"
          size="small"
          label={activeAgentModeData.label}
          onDelete={() => setActiveAgentMode(null)}
          sx={{ alignSelf: "center", height: 24, borderRadius: "9999px", borderColor: "#888B9A", fontSize: "12px", fontWeight: 400, lineHeight: "16px", color: "#232429" }}
        />
      )}
      {deepResearchActive && (
        <Chip
          variant="outlined"
          size="small"
          label="Deep research"
          onDelete={() => setDeepResearchActive(false)}
          sx={{ alignSelf: "center", height: 24, borderRadius: "9999px", borderColor: "#888B9A", fontSize: "12px", fontWeight: 400, lineHeight: "16px", color: "#232429" }}
        />
      )}
    </>
  );

  const chatboxTrailingActions = (
    <>
      <Tooltip title="Voice input" placement="top">
        <IconButton size="small" sx={{ width: 32, height: 32, p: "4px", borderRadius: "8px", color: "#232429" }}>
          <ChatMicrophoneIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  return (
    <>
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1300,
        background: CHAT_BG,
        overflow: "hidden",
        opacity: open ? 1 : 0,
        visibility: open ? "visible" : "hidden",
        transition: open ? "none" : "opacity 0.15s ease, visibility 0s ease 0.15s",
        pointerEvents: open ? "auto" : "none",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>

        {/* ── Header ── */}
        <Stack
          direction="row"
          alignItems="center"
          gap="8px"
          sx={({ tokens: { semantic: { color } } }) => ({
            flexShrink: 0,
            px: "16px",
            py: "10px",
            backgroundColor: "#fff",
            borderBottom: `1px solid ${color.surface.variant.value}`,
          })}
        >
          <IconButton
            size="small"
            onClick={() => {
              const opening = !overlayLeftPanelOpen;
              if (opening) closeCitation();
              setOverlayLeftPanelOpen(opening);
            }}
            title="Toggle side panel"
            sx={{ width: 40, height: 40, borderRadius: "12px", padding: "8px", flexShrink: 0 }}
          >
            {overlayLeftPanelOpen ? <CollapseSideNavIcon size="md" /> : <ExpandSideNavIcon size="md" />}
          </IconButton>

          <Typography sx={{ flex: 1, fontSize: "16px", fontWeight: 600, color: TEXT_DEFAULT, lineHeight: "20px" }}>
            {showInsights
              ? bookTitle
                ? `GovernAI – ${bookTitle}`
                : "GovernAI"
              : "Ask GovernAI"}
          </Typography>

          <Stack direction="row" gap="8px" alignItems="center">
            {demoMode && (
              <IconButton
                size="small"
                aria-label="Notes"
                aria-pressed={demoNotesOpen}
                title="Notes"
                onClick={() => setDemoNotesOpen(!demoNotesOpen)}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "12px",
                  padding: "8px",
                  // Active while the notes panel is open.
                  ...(demoNotesOpen
                    ? { backgroundColor: color.action.secondary.active.value, "&:hover": { backgroundColor: color.action.secondary.active.value } }
                    : {}),
                }}
              >
                <NotesIcon size="md" />
              </IconButton>
            )}
            <IconButton size="small" sx={{ width: 40, height: 40, borderRadius: "12px", padding: "8px" }} title="Notifications">
              <BellIcon size="md" />
            </IconButton>
            <IconButton size="small" sx={{ width: 40, height: 40, borderRadius: "12px", padding: "8px" }} title="More options" onClick={(e) => setMoreMenuAnchor(e.currentTarget)}>
              <MoreIcon size="md" />
            </IconButton>
            {onCollapse && (
              <IconButton
                size="small"
                onClick={onCollapse}
                title="Dock to right panel"
                sx={{ width: 40, height: 40, borderRadius: "12px", padding: "8px" }}
              >
                <DockToRightIcon size="md" />
              </IconButton>
            )}
            <IconButton
              size="small"
              onClick={onClose}
              title="Close"
              sx={{ width: 40, height: 40, borderRadius: "12px", padding: "8px" }}
            >
              <CloseIcon size="md" />
            </IconButton>
          </Stack>
        </Stack>

        {/* ── Body ── */}
        <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {overlayLeftPanelOpen && (
            <LeftPanel
              activeTab={effectiveTab}
              onTabChange={handleTabChange}
              threads={threads}
              currentThreadId={currentThreadId}
              onLoadThread={handleLoadThread}
              onOpenProject={handleOpenProject}
              onNewChat={handleNewChat}
              onPreferences={() => { promptBeforePrefs.current = prompt; setPersonalizationOpen(true); setExpertSkillsPageOpen(false); }}
              onExpertSkills={() => { setExpertSkillsPageOpen(true); setPersonalizationOpen(false); }}
              expertSkillsActive={expertSkillsPageOpen}
              settingsActive={personalizationOpen}
              onDeleteAll={deleteAllThreads}
              showInsights={showInsights}
              hideInsightsFooter={hideInsightsFooter}
              audience={audience}
              selectedInsight={selectedInsight}
              onInsightSelect={setSelectedInsight}
              detailScrollRef={insightDetailScrollRef}
              isNewChatActive={currentThreadId === null && !personalizationOpen && !expertSkillsPageOpen && activeProjectId === null}
              activeProjectId={activeProjectId}
            />
          )}

          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: CHAT_BG, minWidth: 0, position: "relative" }}>

            {/* ── Floating sidebar toggle button (project page only, hidden when panel is open) ── */}
            {!personalizationOpen && !expertSkillsPageOpen && effectiveTab === 0 && activeProjectId !== null && !projectFilesPanelOpen && (
              <IconButton
                size="small"
                onClick={() => {
                  const opening = !projectFilesPanelOpen;
                  if (opening) closeCitation();
                  setProjectFilesPanelOpen(opening);
                }}
                title="Toggle files panel"
                sx={{
                  position: "absolute",
                  top: "32px",
                  right: "16px",
                  zIndex: 10,
                  width: 40,
                  height: 40,
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12), 0 0 2px rgba(0,0,0,0.06)",
                  "&:hover": { backgroundColor: "#f5f5f8" },
                }}
              >
                {projectFilesPanelOpen ? <CollapseSideNavIcon size="md" /> : <ExpandSideNavIcon size="md" />}
              </IconButton>
            )}

            {/* ── Project page ── */}
            {!personalizationOpen && !expertSkillsPageOpen && effectiveTab === 0 && activeProjectId !== null && (() => {
              const project = STATIC_CHAT_THREADS.find(t => t.id === activeProjectId);
              const childThreads = STATIC_CHAT_THREADS.filter(t => t.projectId === activeProjectId);
              if (!project) return null;
              return (
                <ProjectPage
                  project={project}
                  childThreads={childThreads}
                  onLoadThread={handleLoadThread}
                  leadingActions={chatboxLeadingActions}
                  trailingActions={chatboxTrailingActions}
                  onSubmit={handleSend}
                  composerPlaceholder={scopedPlaceholder}
                  setComposerAnchor={setComposerAnchor}
                />
              );
            })()}

            {/* ── Smart Assist tab ── */}
            {!personalizationOpen && !expertSkillsPageOpen && effectiveTab === 0 && activeProjectId === null && (
              <>
                {messages.length === 0 ? (

                  <>
                    <Box sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                    <Stack
                      sx={{
                        alignItems: "center",
                        px: "48px",
                        py: "48px",
                        width: "100%",
                        gap: "32px",
                        my: "auto",
                      }}
                    >
                      <Stack sx={{ gap: "4px", alignItems: "center", textAlign: "center" }}>
                        <Typography
                          component="h1"
                          sx={({ tokens: { semantic: { color, font, fontWeight } } }) => ({
                            fontFamily: font.title.h1Billboard.fontFamily.value,
                            fontSize: font.title.h1Billboard.fontSize.value,
                            fontWeight: fontWeight.emphasis.value,
                            lineHeight: font.title.h1Billboard.lineHeight.value,
                            letterSpacing: font.title.h1Billboard.letterSpacing.value,
                            color: color.type.default.value,
                          })}
                        >
                          What would you like to know?
                        </Typography>
                        <Typography
                          sx={({ tokens: { semantic: { color, font } } }) => ({
                            fontFamily: font.title.h6Xs.fontFamily.value,
                            fontSize: font.title.h6Xs.fontSize.value,
                            fontWeight: font.title.h6Xs.fontWeight.value,
                            lineHeight: font.title.h6Xs.lineHeight.value,
                            letterSpacing: font.title.h6Xs.letterSpacing.value,
                            color: color.type.muted.value,
                          })}
                        >
                          Select a prompt to get started, or ask your own question.
                        </Typography>
                      </Stack>

                      {/* Composer, then chips 16px below it, then the AI
                          disclaimer 16px below the chips. */}
                      <Stack sx={{ width: "100%", maxWidth: "708px", gap: "16px", alignItems: "center" }}>
                        <Box ref={setComposerAnchor} onFocus={prefillDemoPrompt} onClick={prefillDemoPrompt} sx={{ width: "100%", position: "relative" }}>
                          {/* Indigo blur glow behind chatbox (Figma-specified) */}
                          <Box sx={{
                            width: "660px", height: "140px",
                            position: "absolute",
                            left: "50%", top: "-14px",
                            transform: "translateX(-50%)",
                            opacity: 0.48,
                            background: "linear-gradient(90deg, rgba(255,255,255,0.5) 0%, rgba(64,105,254,0.5) 23%, rgba(0,64,213,0.5) 49%, rgba(64,105,254,0.5) 73%, rgba(255,255,255,0.5) 100%)",
                            borderRadius: "9999px",
                            filter: "blur(77px)",
                            pointerEvents: "none",
                            zIndex: 0,
                          }} />
                          <Box sx={{
                            position: "relative",
                            zIndex: 1,
                            borderRadius: "12px",
                            overflow: "hidden",
                            border: "1px solid #DEE0E9",
                            boxShadow: "-1px 4px 8px rgba(135,135,135,0.08), -2px 9px 12px rgba(135,135,135,0.06), -12px 38px 24px rgba(135,135,135,0.02), -12px 40px 20px rgba(135,135,135,0.01)",
                          }}>
                            <AIChatBox
                              onSubmit={handleSend}
                              onStop={() => {}}
                              isUploadAvailable={false}
                              leadingActions={chatboxLeadingActions}
                              trailingActions={chatboxTrailingActions}
                              sx={{
                                "& .MuiInputBase-input": { padding: "16px 24px 12px", fontSize: "14px !important" },
                                "& .AtlasAIGlow-root": { display: "none !important" },
                                "& .AtlasAIChatBox-gradient-border": { display: "none !important" },
                              }}
                              slotProps={{
                                textField: {
                                  placeholder: scopedPlaceholder,
                                  slotProps: { textField: { inputRef: registerComposerInput } },
                                },
                                disclaimer: { stackProps: { style: { display: "none" } } },
                              }}
                            />
                          </Box>
                        </Box>

                        <SuggestionChips
                          size="large"
                          align="center"
                          audience={audience}
                          maxVisible={3}
                          anchorEl={composerAnchor}
                          showIcon
                          onSelectPrompt={(p) => { setPrompt(p); requestComposerFocus(); }}
                          onChipOpen={requestComposerFocus}
                          sx={{ width: "100%" }}
                        />
                      </Stack>
                    </Stack>
                  </Box>
                  </>

                ) : (

                  <>
                    <Box sx={{ flex: 1, overflowY: "auto", px: "48px", py: "32px" }}>
                      <Box sx={{ width: "100%", maxWidth: "708px", mx: "auto", "& .AtlasAIChatUserMessage .MuiTypography-body1": { fontSize: "14px !important" }, "& li": { fontSize: "14px" }, ...(demoMode ? { "& .AtlasAIChatUserMessage-message": { fontSize: "14px !important", lineHeight: "20px !important" } } : {}) }}>
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
                                      name={demoMode ? DEMO_DIRECTOR.name : audience === "director" ? "Josh Doe" : "Jane Doe"}
                                      time={msg.timestamp}
                                      avatar={
                                        <AIChatMessageAvatar
                                          uniqueId={demoMode ? DEMO_DIRECTOR.id : audience === "director" ? "josh-doe" : "jane-doe"}
                                          initials={demoMode ? DEMO_DIRECTOR.initials : "JD"}
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
                                  {demoMode && msg.demoStep !== undefined && DEMO_STEPS[msg.demoStep] && (
                                    <DemoReasoning steps={DEMO_STEPS[msg.demoStep].reasoning} intro={DEMO_STEPS[msg.demoStep].reasoningIntro} activeIndex={null} />
                                  )}
                                  {msg.richContent
                                    ? <RichAIMessageContent blocks={msg.richContent} sources={msg.sources} messageId={msg.id} bodyFontSize={demoMode ? "14px" : undefined} />
                                    : /\[\d+\]/.test(msg.content) && msg.sources
                                      ? <RichAIMessageContent blocks={[{ type: "p", spans: parseCiteText(msg.content) }]} sources={msg.sources} messageId={msg.id} />
                                      : <AIChatMessageTextBlock>{msg.content}</AIChatMessageTextBlock>
                                  }
                                  {demoMode && msg.demoStep !== undefined && DEMO_STEPS[msg.demoStep]?.action === "share" && (
                                    <DemoShareCard />
                                  )}
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
                              {demoMode && demoPending ? (
                                <DemoReasoning steps={DEMO_STEPS[demoPending.step].reasoning} intro={DEMO_STEPS[demoPending.step].reasoningIntro} activeIndex={demoPending.active} />
                              ) : (
                                <AIChatThinkingIndicator label="Thinking" />
                              )}
                            </AIChatAIMessage>
                          )}
                          <div ref={messagesEndRef} />
                        </AIChatContent>
                      </Box>
                    </Box>

                    <Box sx={{ flexShrink: 0, px: "48px", py: "16px" }}>
                      <Box ref={setComposerAnchor} onFocus={prefillDemoPrompt} onClick={prefillDemoPrompt} sx={{ width: "100%", maxWidth: "708px", mx: "auto" }}>
                        <AIChatBox
                          onSubmit={handleSend}
                          onStop={() => {}}
                          isUploadAvailable={false}
                          leadingActions={chatboxLeadingActions}
                          trailingActions={chatboxTrailingActions}
                          sx={{ "& .MuiInputBase-input": { padding: "16px 24px 12px", fontSize: "14px !important" }, "& .AtlasAIGlow-root": { display: "none" } }}
                          slotProps={{
                            textField: {
                              placeholder: scopedPlaceholder,
                              slotProps: { textField: { inputRef: registerComposerInput } },
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  </>
                )}
              </>
            )}

            {/* ── Insights tab ── */}
            {!personalizationOpen && !expertSkillsPageOpen && effectiveTab === 1 && (
              selectedInsight === null
                ? <InsightsEmptyState />
                : <InsightDetail view={selectedInsight} bookTitle={bookTitle} scrollRef={insightDetailScrollRef} />
            )}

            {/* ── Settings page (tabbed: Customize / Data retention / Usage data / Data connectors) ── */}
            <AIBMSettingsPage
              open={personalizationOpen}
              onClose={() => setPersonalizationOpen(false)}
              onCancel={() => { setPrompt(promptBeforePrefs.current); setPersonalizationOpen(false); }}
              audience={audience}
            />

            {/* ── Expert skills page ── */}
            <ExpertSkillsPage
              open={expertSkillsPageOpen}
              onClose={() => setExpertSkillsPageOpen(false)}
            />

          </Box>

          <CitationPreviewPanel />
          {demoMode && <DemoRail />}
          {projectFilesPanelOpen && activeProjectId !== null && (
            <ProjectFilesPanel onClose={() => setProjectFilesPanelOpen(false)} />
          )}
        </Box>
      </Box>
    </Box>
    {/* Hidden file input for attachment button */}
    <input ref={attachmentInputRef} type="file" style={{ display: "none" }} />

    {/* ── @ mention dropdown ── */}
    <Popper
      open={atMentionOpen && Boolean(composerAnchor) && filteredAgents.length > 0}
      anchorEl={composerAnchor}
      placement="top"
      modifiers={[
        { name: "offset", options: { offset: [0, 8] } },
        { name: "flip", enabled: false },
      ]}
      sx={{ zIndex: 1400 }}
    >
      <Paper
        ref={atMentionListRef}
        elevation={0}
        sx={{
          width: composerAnchor ? composerAnchor.offsetWidth : undefined,
          maxWidth: "100%",
          borderRadius: "12px",
          border: `1px solid ${color.ui.divider.default.value}`,
          boxShadow: "0 4px 16px rgba(0,0,0,0.12), 0 0 2px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: "16px",
            py: "8px",
            borderBottom: `1px solid ${color.ui.divider.default.value}`,
          }}
        >
          <Typography sx={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.6px", color: color.type.muted.value }}>
            AGENT REPORTING
          </Typography>
        </Box>
        <MenuList sx={{ py: "4px" }}>
          {filteredAgents.map((agent) => (
            <MenuItem
              key={agent.id}
              onClick={() => handleAtSelect(agent)}
              sx={{ px: "12px", py: "8px", gap: "10px", alignItems: "flex-start", minHeight: "auto", "&:hover": { backgroundColor: color.surface.variant.value } }}
            >
              <Box sx={{ mt: "2px", color: "#575A67", flexShrink: 0 }}><agent.Icon size="md" /></Box>
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "#232429", lineHeight: "20px" }}>{agent.label}</Typography>
                  <Typography component="span" sx={{ fontSize: "11px", fontWeight: 500, color: "#4069FE", background: "rgba(64,105,254,0.08)", borderRadius: "4px", px: "4px", py: "1px", lineHeight: "16px" }}>{agent.tag}</Typography>
                </Box>
                <Typography sx={{ fontSize: "12px", color: "#575A67", lineHeight: "16px", mt: "2px" }}>{agent.desc}</Typography>
              </Box>
            </MenuItem>
          ))}
        </MenuList>
      </Paper>
    </Popper>

    {/* ── / slash (expert skills) dropdown ── */}
    <Popper
      open={slashMenuOpen && Boolean(composerAnchor) && (filteredSkills.length > 0)}
      anchorEl={composerAnchor}
      placement="top"
      modifiers={[
        { name: "offset", options: { offset: [0, 8] } },
        { name: "flip", enabled: false },
      ]}
      sx={{ zIndex: 1400 }}
    >
      <Paper
        ref={slashMenuListRef}
        elevation={0}
        sx={{
          width: composerAnchor ? composerAnchor.offsetWidth : undefined,
          maxWidth: "100%",
          borderRadius: "12px",
          border: `1px solid ${color.ui.divider.default.value}`,
          boxShadow: "0 4px 16px rgba(0,0,0,0.12), 0 0 2px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <Box sx={{ px: "16px", py: "8px", borderBottom: `1px solid ${color.ui.divider.default.value}` }}>
          <Typography sx={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.6px", color: color.type.muted.value }}>
            EXPERT SKILLS
          </Typography>
        </Box>
        <MenuList sx={{ py: "4px" }}>
          {filteredSkills.map((skill) => (
            <MenuItem
              key={skill.id}
              onClick={() => handleSlashSelect(skill)}
              sx={{ px: "12px", py: "8px", gap: "10px", alignItems: "flex-start", minHeight: "auto", "&:hover": { backgroundColor: color.surface.variant.value } }}
            >
              <Box sx={{ mt: "2px", color: "#575A67", flexShrink: 0 }}><skill.Icon size="md" /></Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "#232429", lineHeight: "20px" }}>{skill.label}</Typography>
                  <Typography component="span" sx={{ fontSize: "11px", fontWeight: 500, color: "#575A67", background: "rgba(0,0,0,0.06)", borderRadius: "4px", px: "4px", py: "1px", lineHeight: "16px", whiteSpace: "nowrap" }}>{skill.slash}</Typography>
                </Box>
                <Typography sx={{ fontSize: "12px", color: "#575A67", lineHeight: "16px", mt: "2px" }}>{skill.desc}</Typography>
              </Box>
            </MenuItem>
          ))}
        </MenuList>
        <Divider sx={{ my: 0 }} />
        <MenuItem
          onClick={() => { handleSlashSelect(null); setPersonalizationOpen(false); setExpertSkillsPageOpen(true); }}
          sx={{ px: "12px", py: "8px", gap: "10px", alignItems: "center", minHeight: "auto", "&:hover": { backgroundColor: color.surface.variant.value } }}
        >
          <Box sx={{ color: "#575A67", flexShrink: 0 }}><SettingsIcon size="md" /></Box>
          <Typography sx={{ fontSize: "14px", fontWeight: 400, color: "#232429", lineHeight: "20px" }}>Manage expert skills</Typography>
        </MenuItem>
      </Paper>
    </Popper>

    {/* ── Tools menu ── */}
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
        <ChevronRightIcon sx={{ fontSize: 20, color: "inherit", flexShrink: 0 }} />
      </MenuItem>

      {/* Select a skill */}
      <MenuItem
        onMouseEnter={(e) => { const el = e.currentTarget; if (submenuDelayRef.current) clearTimeout(submenuDelayRef.current); submenuDelayRef.current = setTimeout(() => { setExpertSkillsAnchor(el); setAgentReportingAnchor(null); setSearchScopeAnchor(null); }, 560); }}
        onMouseLeave={() => { if (submenuDelayRef.current) clearTimeout(submenuDelayRef.current); }}
        onClick={(e) => { const el = e.currentTarget; if (submenuDelayRef.current) clearTimeout(submenuDelayRef.current); setExpertSkillsAnchor(el); setAgentReportingAnchor(null); setSearchScopeAnchor(null); }}
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: "12px", py: "8px", fontSize: "14px", color: "#232429", gap: "32px", minHeight: "auto", backgroundColor: activeToolsItem === "expert" ? "rgba(0,0,0,0.04)" : undefined, "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}
      >
        Select a skill
        <ChevronRightIcon sx={{ fontSize: 20, color: "inherit", flexShrink: 0 }} />
      </MenuItem>

      {/* Generate insights */}
      <MenuItem
        onMouseEnter={(e) => { const el = e.currentTarget; if (submenuDelayRef.current) clearTimeout(submenuDelayRef.current); submenuDelayRef.current = setTimeout(() => { setAgentReportingAnchor(el); setExpertSkillsAnchor(null); setSearchScopeAnchor(null); }, 560); }}
        onMouseLeave={() => { if (submenuDelayRef.current) clearTimeout(submenuDelayRef.current); }}
        onClick={(e) => { const el = e.currentTarget; if (submenuDelayRef.current) clearTimeout(submenuDelayRef.current); setAgentReportingAnchor(el); setExpertSkillsAnchor(null); setSearchScopeAnchor(null); }}
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: "12px", py: "8px", fontSize: "14px", color: "#232429", gap: "32px", minHeight: "auto", backgroundColor: activeToolsItem === "agent" ? "rgba(0,0,0,0.04)" : undefined, "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}
      >
        Generate insights
        <ChevronRightIcon sx={{ fontSize: 20, color: "inherit", flexShrink: 0 }} />
      </MenuItem>

      {/* Search the web (toggle) */}
      <Box
        onMouseEnter={() => { if (submenuDelayRef.current) clearTimeout(submenuDelayRef.current); setExpertSkillsAnchor(null); setAgentReportingAnchor(null); setSearchScopeAnchor(null); }}
        onClick={(e) => { e.stopPropagation(); setWebSearchEnabled((v) => !v); }}
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: "12px", py: "8px", cursor: "pointer", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}
      >
        <Typography sx={{ fontSize: "14px", color: "#232429", lineHeight: "20px" }}>Search the web</Typography>
        <Switch
          size="small"
          checked={webSearchEnabled}
          onChange={(e) => { e.stopPropagation(); setWebSearchEnabled((v) => !v); }}
          onClick={(e) => e.stopPropagation()}
        />
      </Box>

    </Menu>

    {/* ── Search only in submenu ── */}
    <Popper
      open={Boolean(searchScopeAnchor)}
      anchorEl={searchScopeAnchor}
      placement="left-start"
      style={{ zIndex: 1400, marginRight: "4px" }}
    >
      <Paper sx={{ ...MENU_PAPER_SX, minWidth: 232 }}>
        <MenuList sx={{ py: "4px" }}>
          {inBook && (
            <MenuItem
              onClick={() => { setSearchScope("book"); closeToolsMenus(); }}
              sx={{ px: "12px", py: "8px", gap: "10px", alignItems: "center", minHeight: "auto", justifyContent: "space-between", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}
            >
              <Typography sx={{ fontSize: "14px", color: "#232429", lineHeight: "20px" }}>{currentBookTitle ?? "This book"}</Typography>
              {searchScope === "book" && <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.97917 14.3958L3.85417 10.2708L4.72917 9.375L7.97917 12.625L15.2708 5.33333L16.1458 6.22917L7.97917 14.3958Z" fill="#232429"/></svg>}
            </MenuItem>
          )}
          <MenuItem
            onClick={() => { setSearchScope("books"); closeToolsMenus(); }}
            sx={{ px: "12px", py: "8px", gap: "10px", alignItems: "center", minHeight: "auto", justifyContent: "space-between", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}
          >
            <Typography sx={{ fontSize: "14px", color: "#232429", lineHeight: "20px" }}>Current & archived books</Typography>
            {searchScope === "books" && <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.97917 14.3958L3.85417 10.2708L4.72917 9.375L7.97917 12.625L15.2708 5.33333L16.1458 6.22917L7.97917 14.3958Z" fill="#232429"/></svg>}
          </MenuItem>
          <MenuItem
            onClick={() => { setSearchScope("resource"); closeToolsMenus(); }}
            sx={{ px: "12px", py: "8px", gap: "10px", alignItems: "center", minHeight: "auto", justifyContent: "space-between", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}
          >
            <Typography sx={{ fontSize: "14px", color: "#232429", lineHeight: "20px" }}>Resource center</Typography>
            {searchScope === "resource" && <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.97917 14.3958L3.85417 10.2708L4.72917 9.375L7.97917 12.625L15.2708 5.33333L16.1458 6.22917L7.97917 14.3958Z" fill="#232429"/></svg>}
          </MenuItem>
          <MenuItem
            onClick={() => { setSearchScope("dataroom"); closeToolsMenus(); }}
            sx={{ px: "12px", py: "8px", gap: "10px", alignItems: "center", minHeight: "auto", justifyContent: "space-between", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}
          >
            <Typography sx={{ fontSize: "14px", color: "#232429", lineHeight: "20px" }}>Data room</Typography>
            {searchScope === "dataroom" && <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.97917 14.3958L3.85417 10.2708L4.72917 9.375L7.97917 12.625L15.2708 5.33333L16.1458 6.22917L7.97917 14.3958Z" fill="#232429"/></svg>}
          </MenuItem>
          <MenuItem
            onClick={() => { setSearchScope("tasks"); closeToolsMenus(); }}
            sx={{ px: "12px", py: "8px", gap: "10px", alignItems: "center", minHeight: "auto", justifyContent: "space-between", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}
          >
            <Typography sx={{ fontSize: "14px", color: "#232429", lineHeight: "20px" }}>Tasks</Typography>
            {searchScope === "tasks" && <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.97917 14.3958L3.85417 10.2708L4.72917 9.375L7.97917 12.625L15.2708 5.33333L16.1458 6.22917L7.97917 14.3958Z" fill="#232429"/></svg>}
          </MenuItem>
          <MenuItem
            onClick={() => { setSearchScope("decisions"); closeToolsMenus(); }}
            sx={{ px: "12px", py: "8px", gap: "10px", alignItems: "center", minHeight: "auto", justifyContent: "space-between", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}
          >
            <Typography sx={{ fontSize: "14px", color: "#232429", lineHeight: "20px" }}>Decision hub</Typography>
            {searchScope === "decisions" && <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.97917 14.3958L3.85417 10.2708L4.72917 9.375L7.97917 12.625L15.2708 5.33333L16.1458 6.22917L7.97917 14.3958Z" fill="#232429"/></svg>}
          </MenuItem>
          <MenuItem
            onClick={() => { setSearchScope("questionnaires"); closeToolsMenus(); }}
            sx={{ px: "12px", py: "8px", gap: "10px", alignItems: "center", minHeight: "auto", justifyContent: "space-between", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}
          >
            <Typography sx={{ fontSize: "14px", color: "#232429", lineHeight: "20px" }}>Questionnaires</Typography>
            {searchScope === "questionnaires" && <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.97917 14.3958L3.85417 10.2708L4.72917 9.375L7.97917 12.625L15.2708 5.33333L16.1458 6.22917L7.97917 14.3958Z" fill="#232429"/></svg>}
          </MenuItem>
        </MenuList>
      </Paper>
    </Popper>

    {/* ── Select a skill submenu ── */}
    <Popper
      open={Boolean(expertSkillsAnchor)}
      anchorEl={expertSkillsAnchor}
      placement="left-start"
      style={{ zIndex: 1400, marginRight: "4px" }}
    >
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
            onClick={() => { closeToolsMenus(); setPersonalizationOpen(false); setExpertSkillsPageOpen(true); }}
            sx={{ px: "12px", py: "8px", gap: "10px", alignItems: "center", minHeight: "auto", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}
          >
            <Box sx={{ color: "#575A67", flexShrink: 0 }}><SettingsIcon size="md" /></Box>
            <Typography sx={{ fontSize: "14px", fontWeight: 400, color: "#232429", lineHeight: "20px" }}>Manage expert skills</Typography>
          </MenuItem>
        </MenuList>
      </Paper>
    </Popper>

    {/* ── Generate insights submenu ── */}
    <Popper
      open={Boolean(agentReportingAnchor)}
      anchorEl={agentReportingAnchor}
      placement="left-start"
      style={{ zIndex: 1400, marginRight: "4px" }}
    >
      <Paper sx={{ ...MENU_PAPER_SX, minWidth: 296, maxWidth: 296 }}>
        <MenuList sx={{ py: "4px" }}>
          {AGENT_REPORTING.map(({ id, label, tag, desc, Icon }) => (
            <MenuItem key={id} onClick={() => { closeToolsMenus(); setActiveAgentMode(id); setDeepResearchActive(false); }} sx={{ px: "12px", py: "8px", gap: "10px", alignItems: "flex-start", minHeight: "auto" }}>
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

    <AIMoreMenu
      anchorEl={moreMenuAnchor}
      onClose={() => setMoreMenuAnchor(null)}
    />
    </>
  );
}
