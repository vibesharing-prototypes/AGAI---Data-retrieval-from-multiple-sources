import { useEffect, useRef, useState } from "react";
import {
  Box,
  Chip,
  Divider,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
  useTheme,
  type SxProps,
  type Theme,
} from "@mui/material";

import { ONBOARDING_PROMPT } from "../data/hybrid-search.constants.js";

// ─── Leading icons (figma-exports/icons) ────────────────────────────────────
// Inlined verbatim from the design's SVG exports so the chips show the exact
// Figma glyphs. `width/height: 1em` lets the Atlas chip icon styling drive the
// render size; `currentColor` matches the chip's text color.

type IconProps = React.SVGProps<SVGSVGElement>;

const Svg = ({ d, ...rest }: IconProps & { d: string }) => (
  <svg
    viewBox="0 0 20 20"
    width="1em"
    height="1em"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path d={d} />
  </svg>
);

const SearchIcon = (p: IconProps) => (
  <Svg
    viewBox="0 0 24 24"
    {...p}
    d="M19.5422 20.577L13.2615 14.2962C12.7615 14.7091 12.1865 15.0321 11.5365 15.2655C10.8865 15.4988 10.214 15.6155 9.51916 15.6155C7.80999 15.6155 6.36348 15.0237 5.17961 13.8401C3.99574 12.6566 3.40381 11.2104 3.40381 9.50169C3.40381 7.79296 3.99559 6.34628 5.17916 5.16167C6.36273 3.97707 7.80888 3.38477 9.51761 3.38477C11.2263 3.38477 12.673 3.9767 13.8576 5.16057C15.0422 6.34443 15.6345 7.79095 15.6345 9.50012C15.6345 10.2142 15.5147 10.8963 15.2749 11.5463C15.0352 12.1963 14.7153 12.7616 14.3153 13.2424L20.5961 19.5232L19.5422 20.577ZM9.51916 14.1155C10.8076 14.1155 11.899 13.6684 12.7932 12.7742C13.6874 11.8799 14.1346 10.7886 14.1346 9.50012C14.1346 8.21165 13.6874 7.1203 12.7932 6.22607C11.899 5.33183 10.8076 4.88472 9.51916 4.88472C8.23069 4.88472 7.13934 5.33183 6.24511 6.22607C5.35089 7.1203 4.90378 8.21165 4.90378 9.50012C4.90378 10.7886 5.35089 11.8799 6.24511 12.7742C7.13934 13.6684 8.23069 14.1155 9.51916 14.1155Z"
  />
);

const TaskIcon = (p: IconProps) => (
  <Svg
    {...p}
    d="M12.8336 15.7023L9.60128 12.4491L10.3753 11.6751L12.8336 14.1542L17.4538 9.53402L18.2278 10.308L12.8336 15.7023ZM16.5836 7.99875H15.5003V4.49875H13.5836V6.67821H6.41699V4.49875H4.5003V15.4988H9.00031V16.5821H3.41699V3.41544H8.51156C8.58528 3.06502 8.75515 2.77016 9.02116 2.53085C9.28717 2.29154 9.61356 2.17188 10.0003 2.17188C10.3764 2.17188 10.6987 2.29154 10.9674 2.53085C11.2361 2.77016 11.4073 3.06502 11.481 3.41544H16.5836V7.99875ZM9.99733 4.59492C10.1863 4.59492 10.3456 4.53101 10.4755 4.40319C10.6053 4.27537 10.6702 4.11698 10.6702 3.92802C10.6702 3.73908 10.6063 3.5797 10.4785 3.4499C10.3506 3.32009 10.1922 3.25519 10.0033 3.25519C9.81434 3.25519 9.65497 3.3191 9.52516 3.44692C9.39534 3.57474 9.33043 3.73312 9.33043 3.92206C9.33043 4.11102 9.39434 4.2704 9.52216 4.40021C9.64998 4.53001 9.80837 4.59492 9.99733 4.59492Z"
  />
);

const ChartLineIcon = (p: IconProps) => (
  <Svg
    {...p}
    d="M3.06227 14.7725L2.32031 14.0305L8.03183 8.31901L11.3027 11.569L16.8588 5.27734L17.6953 5.97282L11.3812 13.1523L8.03183 9.80293L3.06227 14.7725Z"
  />
);

const InfoIcon = (p: IconProps) => (
  <Svg
    viewBox="0 0 24 24"
    {...p}
    d="M11.25 16.75H12.75V11H11.25V16.75ZM12 9.28845C12.2288 9.28845 12.4207 9.21105 12.5755 9.05625C12.7303 8.90145 12.8077 8.70963 12.8077 8.48078C12.8077 8.25194 12.7303 8.06012 12.5755 7.9053C12.4207 7.7505 12.2288 7.6731 12 7.6731C11.7711 7.6731 11.5793 7.7505 11.4245 7.9053C11.2697 8.06012 11.1923 8.25194 11.1923 8.48078C11.1923 8.70963 11.2697 8.90145 11.4245 9.05625C11.5793 9.21105 11.7711 9.28845 12 9.28845ZM12.0016 21.5C10.6877 21.5 9.45268 21.2506 8.29655 20.752C7.1404 20.2533 6.13472 19.5765 5.2795 18.7217C4.42427 17.8669 3.74721 16.8616 3.24833 15.706C2.74944 14.5504 2.5 13.3156 2.5 12.0017C2.5 10.6877 2.74933 9.45268 3.248 8.29655C3.74667 7.1404 4.42342 6.13472 5.27825 5.2795C6.1331 4.42427 7.13834 3.74721 8.29398 3.24833C9.44959 2.74944 10.6844 2.5 11.9983 2.5C13.3122 2.5 14.5473 2.74933 15.7034 3.248C16.8596 3.74667 17.8652 4.42342 18.7205 5.27825C19.5757 6.1331 20.2527 7.13834 20.7516 8.29398C21.2505 9.44959 21.5 10.6844 21.5 11.9983C21.5 13.3122 21.2506 14.5473 20.752 15.7034C20.2533 16.8596 19.5765 17.8652 18.7217 18.7205C17.8669 19.5757 16.8616 20.2527 15.706 20.7516C14.5504 21.2505 13.3156 21.5 12.0016 21.5ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76664 19.225 7.87498 17.675 6.32498C16.125 4.77498 14.2333 3.99998 12 3.99998C9.76664 3.99998 7.87498 4.77498 6.32498 6.32498C4.77498 7.87498 3.99998 9.76664 3.99998 12C3.99998 14.2333 4.77498 16.125 6.32498 17.675C7.87498 19.225 9.76664 20 12 20Z"
  />
);

// Plus glyph for the "Show more" overflow chip (full-screen + home hero, where
// only the first few chips are shown inline and the rest collapse into a menu).
const PlusIcon = (p: IconProps) => (
  <Svg {...p} d="M9.5 9.5V4.5H10.5V9.5H15.5V10.5H10.5V15.5H9.5V10.5H4.5V9.5H9.5Z" />
);

// AIBM agent-mode chip icons (figma-exports, 24×24)
const BriefcaseChipIcon = (p: IconProps) => (
  <Svg
    viewBox="0 0 24 24"
    {...p}
    d="M2.5 20.4999V6.49995H8.5V3H15.5V6.49995H21.5V20.4999H2.5ZM9.99998 6.49995H14V4.49995H9.99998V6.49995ZM20 14.7499H14.5V16.4999H9.5V14.7499H3.99998V18.9999H20V14.7499ZM11 14.9999H13V12.9999H11V14.9999ZM3.99998 13.25H9.5V11.5H14.5V13.25H20V7.99993H3.99998V13.25Z"
  />
);

const ShieldSearchChipIcon = SearchIcon;

const ListCheckChipIcon = (p: IconProps) => (
  <Svg
    viewBox="0 0 24 24"
    {...p}
    d="M12.0016 21.5C10.6877 21.5 9.45268 21.2506 8.29655 20.752C7.1404 20.2533 6.13472 19.5765 5.2795 18.7217C4.42427 17.8669 3.74721 16.8616 3.24833 15.706C2.74944 14.5504 2.5 13.3156 2.5 12.0017C2.5 10.6877 2.74937 9.45268 3.24812 8.29655C3.74688 7.1404 4.42375 6.13472 5.27875 5.2795C6.13375 4.42427 7.13917 3.74721 8.295 3.24833C9.45082 2.74944 10.6858 2.5 12 2.5H12.75V10.7077C12.9859 10.8526 13.1698 11.0332 13.3019 11.2497C13.4339 11.4662 13.5 11.7167 13.5 12.0012C13.5 12.4093 13.3522 12.7612 13.0567 13.0567C12.7612 13.3522 12.4089 13.5 12 13.5C11.591 13.5 11.2388 13.3522 10.9433 13.0567C10.6478 12.7612 10.5 12.4097 10.5 12.0023C10.5 11.7183 10.566 11.4652 10.6981 11.243C10.8301 11.0207 11.0141 10.8423 11.25 10.7077V8.0865C10.3192 8.26215 9.54485 8.71376 8.9269 9.44133C8.30895 10.1689 7.99998 11.0218 7.99998 12C7.99998 13.1 8.39164 14.0416 9.17498 14.825C9.95831 15.6083 10.9 16 12 16C13.1 16 14.0416 15.6083 14.825 14.825C15.6083 14.0416 16 13.1 16 12C16 11.4 15.8791 10.8458 15.6375 10.3375C15.3958 9.82914 15.0666 9.38331 14.65 8.99998L15.7192 7.93078C16.264 8.43589 16.6971 9.03723 17.0182 9.7348C17.3394 10.4324 17.5 11.1874 17.5 12C17.5 13.5277 16.9655 14.8263 15.8965 15.8958C14.8275 16.9652 13.5294 17.5 12.0023 17.5C10.4751 17.5 9.17628 16.9652 8.10578 15.8958C7.03526 14.8263 6.5 13.5277 6.5 12C6.5 10.5961 6.95417 9.38173 7.8625 8.35673C8.77083 7.33173 9.9 6.73141 11.25 6.55578V4.03075C9.20897 4.21663 7.49037 5.06759 6.0942 6.58363C4.69805 8.09964 3.99998 9.90509 3.99998 12C3.99998 14.2333 4.77498 16.125 6.32498 17.675C7.87498 19.225 9.76664 20 12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 10.85 19.775 9.77498 19.325 8.77498C18.875 7.77498 18.2583 6.90831 17.475 6.17498L18.5442 5.10578C19.4557 5.97756 20.1762 7.0035 20.7057 8.1836C21.2352 9.36368 21.5 10.6349 21.5 11.9971C21.5 13.3118 21.2506 14.5473 20.752 15.7034C20.2533 16.8596 19.5765 17.8652 18.7217 18.7205C17.8669 19.5757 16.8616 20.2527 15.706 20.7516C14.5504 21.2505 13.3156 21.5 12.0016 21.5Z"
  />
);

// ─── Admin leading icons (figma-exports/icons, 24×24) ────────────────────────
// These come from the admin chip set's Figma exports. They're 24×24 multi-path
// glyphs (unlike the 20×20 single-path director icons above), so they render
// their own <svg> rather than going through the `Svg` helper.

const TraceIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...p}>
    <path d="M3 3H9.65085V9.65085H3V3ZM11.8679 3H18.5187V9.65085H11.8679V3ZM3 11.8679H9.65085V18.5187H3V11.8679ZM13.198 4.33014V8.32071H17.1886V4.33014H13.198ZM4.33013 4.33014V8.32071H8.32072V4.33014H4.33013ZM4.33013 13.198V17.1886H8.32072V13.198H4.33013Z" />
    <path d="M15.5514 17.9048C16.2063 17.9048 16.7622 17.6763 17.2193 17.2193C17.6763 16.7622 17.9048 16.2063 17.9048 15.5514C17.9048 14.8966 17.6763 14.3406 17.2193 13.8836C16.7622 13.4265 16.2063 13.198 15.5514 13.198C14.8965 13.198 14.3406 13.4265 13.8836 13.8836C13.4265 14.3406 13.198 14.8966 13.198 15.5514C13.198 16.2063 13.4265 16.7622 13.8836 17.2193C14.3406 17.6763 14.8965 17.9048 15.5514 17.9048ZM20.074 21L17.6456 18.5716C17.3318 18.7899 16.9994 18.955 16.6484 19.067C16.2973 19.179 15.9317 19.235 15.5514 19.235C14.5282 19.235 13.6585 18.8768 12.9422 18.1606C12.226 17.4443 11.8679 16.5746 11.8679 15.5514C11.8679 14.5282 12.226 13.6585 12.9422 12.9422C13.6585 12.226 14.5282 11.8679 15.5514 11.8679C16.5746 11.8679 17.4443 12.226 18.1606 12.9422C18.8768 13.6585 19.235 14.5282 19.235 15.5514C19.235 15.9317 19.179 16.2973 19.067 16.6484C18.955 16.9994 18.7899 17.3318 18.5716 17.6456L21 20.074L20.074 21Z" />
  </svg>
);

const OnboardIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...p}>
    <path d="M5.4189 9.62066L7.6189 10.5514C7.8907 10.0078 8.18044 9.48251 8.48814 8.97546C8.79584 8.46839 9.13495 7.96935 9.50547 7.47833L8.03815 7.19371C7.98686 7.18089 7.93718 7.18249 7.8891 7.19851C7.84103 7.21454 7.79776 7.24179 7.7593 7.28026L5.4189 9.62066ZM8.81502 11.4937L11.6554 14.3187C12.4003 14.0072 13.1727 13.5764 13.9727 13.0264C14.7727 12.4764 15.5323 11.8418 16.2516 11.1226C17.3734 10.0008 18.241 8.77865 18.8544 7.45623C19.4679 6.1338 19.7714 4.77322 19.765 3.37448C18.3663 3.36808 17.0047 3.67161 15.6804 4.28506C14.356 4.89853 13.133 5.76615 12.0112 6.88793C11.292 7.60717 10.6573 8.36839 10.1073 9.17161C9.55735 9.97481 9.12657 10.7488 8.81502 11.4937ZM13.6304 9.49368C13.292 9.15523 13.1227 8.7437 13.1227 8.25908C13.1227 7.77448 13.292 7.36295 13.6304 7.02448C13.9689 6.68603 14.3846 6.51681 14.8775 6.51681C15.3705 6.51681 15.7862 6.68603 16.1246 7.02448C16.4631 7.36295 16.6323 7.77448 16.6323 8.25908C16.6323 8.7437 16.4631 9.15523 16.1246 9.49368C15.7862 9.83215 15.3705 10.0014 14.8775 10.0014C14.3846 10.0014 13.9689 9.83215 13.6304 9.49368ZM13.5188 17.7302L15.8593 15.3898C15.8977 15.3514 15.925 15.3081 15.941 15.26C15.957 15.212 15.9586 15.1623 15.9458 15.111L15.6612 13.6437C15.1702 14.0142 14.6711 14.3507 14.1641 14.6533C13.657 14.9559 13.1317 15.243 12.5881 15.5148L13.5188 17.7302ZM21.1323 2.00143C21.3464 3.92835 21.1185 5.75462 20.4486 7.48026C19.7788 9.20589 18.6765 10.836 17.1419 12.3706L16.9688 12.5437L17.4208 14.8071C17.481 15.1084 17.4676 15.4014 17.3804 15.686C17.2932 15.9706 17.1426 16.2199 16.9285 16.4341L13.0073 20.3456L11.1285 15.9302L7.2093 12.011L2.79395 10.1226L6.69007 6.21106C6.90419 5.99696 7.15611 5.84472 7.44584 5.75433C7.73558 5.66393 8.03109 5.64887 8.33237 5.70913L10.615 6.17066C10.6471 6.13861 10.6744 6.10976 10.6968 6.08411C10.7192 6.05847 10.7465 6.02963 10.7785 5.99758C12.3131 4.46298 13.9407 3.35978 15.6612 2.68798C17.3817 2.0162 19.2054 1.78735 21.1323 2.00143ZM4.52087 15.0706C5.00804 14.5834 5.60194 14.3389 6.30257 14.337C7.0032 14.3351 7.5971 14.5777 8.08427 15.0649C8.57145 15.552 8.81248 16.1459 8.80735 16.8466C8.80221 17.5472 8.55606 18.1411 8.0689 18.6283C7.6907 19.0065 7.07019 19.3311 6.20737 19.6023C5.34455 19.8734 4.23752 20.0904 2.88627 20.2532C3.04909 18.902 3.26767 17.7949 3.54202 16.9321C3.81639 16.0693 4.14267 15.4488 4.52087 15.0706ZM5.59007 16.1341C5.41059 16.3135 5.23751 16.6225 5.07085 17.061C4.90418 17.4995 4.79071 17.9469 4.73045 18.4033C5.18686 18.343 5.6343 18.2305 6.07277 18.0658C6.51122 17.9011 6.8202 17.7289 6.9997 17.5494C7.1997 17.3494 7.30482 17.1094 7.31507 16.8293C7.32532 16.5491 7.23045 16.3091 7.03045 16.1091C6.83045 15.9091 6.59039 15.8132 6.31027 15.8216C6.03014 15.8299 5.79007 15.9341 5.59007 16.1341Z" />
  </svg>
);

// ─── Suggestion chips (Figma node 5894:243481) ──────────────────────────────
// Labels + leading icons come straight from the design. Clicking a chip opens a
// dropdown of starter prompts above the composer (`directPaste` chips skip the
// dropdown and drop their single prompt straight in). Shared across the home
// hero (small chips), the full-screen overlay and the docked panel (large).

export type SuggestionChip = {
  label: string;
  tag?: string;
  Icon: (p: IconProps) => React.ReactElement;
  // Up to three starter prompts surfaced in the dropdown. Bracketed [tokens]
  // are placeholders the user replaces (e.g. [committee], [topic]).
  prompts: string[];
  // When true (Learn), there is no dropdown — clicking the chip pastes
  // `prompts[0]` straight into the composer (no submit) for the user to send.
  directPaste?: boolean;
  // When true (MVP Learn), clicking pastes AND submits `prompts[0]` straight to
  // the chat (via onSubmitPrompt) rather than only populating the composer.
  submit?: boolean;
};

export const DIRECTOR_SUGGESTION_CHIPS: SuggestionChip[] = [
  {
    label: "Summarize & brief",
    tag: "@briefcase",
    Icon: BriefcaseChipIcon,
    prompts: [
      "Summarize the key takeaways from the latest board pack in under 1500 words",
      "What are the top 3 risks the board should know about [topic]?",
      "Give me a board-ready synthesis of [document] with clear takeaways",
    ],
  },
  {
    label: "Due diligence",
    tag: "@diligence",
    Icon: ShieldSearchChipIcon,
    prompts: [
      "Run a due-diligence deep-dive on [company or topic]",
      "Cross-reference findings across our governance documents and flag inconsistencies",
      "Produce a structured risk assessment with an executive summary on [topic]",
    ],
  },
  {
    label: "Track commitments",
    tag: "@follow-through",
    Icon: ListCheckChipIcon,
    prompts: [
      "What commitments are still open from the last board meeting?",
      "Give me a status update on action items owned by [person]",
      "Which follow-ups from [committee] are overdue?",
    ],
  },
  {
    label: "Trace decisions",
    Icon: TraceIcon,
    prompts: [
      "How has the board's view on [topic] changed over the last year?",
      "What was the board's rationale for [decision], and were any concerns or dissent recorded?",
      "Trace the history of [initiative] — when it was first raised, discussed, and approved.",
    ],
  },
  {
    label: "Learn about Ask GovernAI",
    Icon: InfoIcon,
    // Matches ONBOARDING_PROMPT so submitting it returns the dedicated
    // "what can I help with" onboarding answer rather than a generic reply.
    prompts: [ONBOARDING_PROMPT],
    directPaste: true,
  },
];

// Admin chip set (Figma node — admin home). Same chip behaviour as the director
// set (dropdown of starter prompts; Learn pastes the onboarding prompt straight
// in), but the use cases are reframed around what a board administrator does:
// find materials, trace decisions, answer questions, onboard a director.
export const ADMIN_SUGGESTION_CHIPS: SuggestionChip[] = [
  {
    label: "Find materials",
    Icon: SearchIcon,
    prompts: [
      "Find materials related to [topic] from last year.",
      "Which board and committee packs reference [topic / document] since [year]?",
      "Locate the latest version of [policy / charter / report] and where it was last circulated.",
    ],
  },
  {
    label: "Trace decisions",
    Icon: TraceIcon,
    prompts: [
      "When was [initiative / policy] formally approved?",
      "Which committee approved [decision], and what was recorded in the minutes?",
      "Show the approval trail for [initiative] — from first tabled to final sign-off.",
    ],
  },
  {
    label: "Answer questions",
    Icon: InfoIcon,
    prompts: [
      "Has the board previously discussed [topic]?",
      "What did the board conclude the last time [topic] was raised?",
      "Which committee or directors have ownership of [topic / action]?",
    ],
  },
  {
    label: "Onboard director",
    Icon: OnboardIcon,
    prompts: [
      "Find induction materials and recent board context.",
      "What are the key decisions and approvals from the past year a new director should know?",
      "Which committee papers and policies should a new director read before their first [committee] meeting?",
    ],
  },
  {
    label: "Learn about Ask GovernAI",
    Icon: InfoIcon,
    // Same as the director side — pastes the onboarding prompt straight in so
    // submitting it returns the dedicated "what can I help with" answer.
    prompts: [ONBOARDING_PROMPT],
    directPaste: true,
  },
];

// ─── MVP prompt set ──────────────────────────────────────────────────────────
// The MVP branch reverts to the original four single-prompt templates per
// persona (no "Learn"/onboarding entry, no multi-prompt dropdown). Clicking a
// chip or card inserts the one prompt straight into the composer. Labels +
// prompts come from the design; cards display the prompt quoted, but the clean
// (unquoted) string is what gets inserted.

export type MvpPrompt = {
  label: string;
  Icon: (p: IconProps) => React.ReactElement;
  prompt: string;
};

export const MVP_ADMIN_PROMPTS: MvpPrompt[] = [
  { label: "Find materials",      Icon: SearchIcon,  prompt: "Find materials related to [topic] from last year." },
  { label: "Trace decisions",     Icon: TraceIcon,   prompt: "When was [initiative / policy] formally approved?" },
  { label: "Answer questions",    Icon: InfoIcon,    prompt: "Has the board previously discussed [topic]?" },
  { label: "Onboard director",    Icon: OnboardIcon, prompt: "Find induction materials and recent board context." },
];

export const MVP_DIRECTOR_PROMPTS: MvpPrompt[] = [
  { label: "Find topics",           Icon: SearchIcon,    prompt: "When did the board approve [policy], and what was resolved?" },
  { label: "Prepare for meetings",  Icon: TaskIcon,      prompt: "What should I review before [committee] based on last meeting's follow-ups?" },
  { label: "Monitor trends",        Icon: ChartLineIcon, prompt: "How has [risk / metric / topic] changed across the last [X] board cycles?" },
  { label: "Trace decisions",       Icon: TraceIcon,     prompt: "How has the board's view on [topic] changed over the last year?" },
];

export const mvpPromptsForAudience = (audience: "admin" | "director") =>
  audience === "director" ? MVP_DIRECTOR_PROMPTS : MVP_ADMIN_PROMPTS;

// ─── MVP prompt cards (full-screen overlay) ──────────────────────────────────
// "Ideas to get you started" header + a 4-up grid of template cards: a blue
// category pill over the quoted prompt. Clicking inserts the prompt.

export function PromptSuggestionCards({
  audience = "admin",
  onSelect,
  onLearn,
}: {
  audience?: "admin" | "director";
  onSelect: (prompt: string) => void;
  // When provided, renders a "Learn about Smart Assist" button below the cards
  // that submits the onboarding prompt straight to the chat.
  onLearn?: (prompt: string) => void;
}) {
  const { tokens: { semantic: { color, radius } } } = useTheme();
  const cards = mvpPromptsForAudience(audience);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: "24px" }}>
        <Typography sx={{ fontSize: "18px", fontWeight: 600, lineHeight: "28px", color: color.type.default.value }}>
          Start here
        </Typography>
        <Typography sx={{ fontSize: "13px", lineHeight: "20px", color: color.type.muted.value }}>
          Select a prompt to get started, or ask your own question.
        </Typography>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", width: "100%" }}>
        {cards.map((card) => (
          <Box
            key={card.label}
            component="button"
            type="button"
            onClick={() => onSelect(card.prompt)}
            sx={{
              all: "unset",
              boxSizing: "border-box",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              p: "14px",
              borderRadius: radius.lg.value,
              border: `1px solid ${color.ui.divider.default.value}`,
              backgroundColor: color.surface.default.value,
              textAlign: "left",
              transition: "background-color 0.15s ease",
              "&:hover": { backgroundColor: color.surface.variant.value },
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignSelf: "flex-start",
                alignItems: "center",
                gap: "8px",
                height: "24px",
                px: "10px",
                borderRadius: "9999px",
                backgroundColor: color.accent.blue.background.value,
                color: "#004c6c",
              }}
            >
              <Box sx={{ display: "flex", fontSize: "16px", color: "inherit" }}>
                <card.Icon />
              </Box>
              <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "inherit", lineHeight: "16px", letterSpacing: "0.3px" }}>
                {card.label}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: "12px", fontWeight: 400, color: color.type.muted.value, lineHeight: "16px", letterSpacing: "0.3px" }}>
              {`"${card.prompt}"`}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Learn about Smart Assist — centered below the cards. Submits the
          onboarding prompt straight to the chat. */}
      {onLearn && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: "24px" }}>
          <Box
            component="button"
            type="button"
            onClick={() => onLearn(ONBOARDING_PROMPT)}
            sx={{
              all: "unset",
              boxSizing: "border-box",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              px: "16px",
              height: "40px",
              borderRadius: radius.lg.value,
              border: `1px solid ${color.ui.divider.default.value}`,
              backgroundColor: color.surface.default.value,
              color: color.type.default.value,
              transition: "background-color 0.15s ease",
              "&:hover": { backgroundColor: color.surface.variant.value },
            }}
          >
            <Box sx={{ display: "flex", fontSize: "20px", color: color.type.default.value }}>
              <InfoIcon />
            </Box>
            <Typography sx={{ fontSize: "14px", fontWeight: 600, lineHeight: "20px", color: color.type.default.value }}>
              {"Learn about Ask GovernAI"}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────
// Atlas outlined chips with a leading icon. `size="small"` is the compact home
// hero treatment (24px tall, 20px icon); `size="large"` is the roomier
// treatment used in the full-screen and panel Smart Assist views (36px tall,
// 24px icon).
//
// Clicking a chip opens a dropdown of that chip's starter prompts, anchored to
// `anchorEl` (the composer) and floated *above* it. Nothing is pasted until the
// user picks a prompt — that calls `onSelectPrompt`. `onChipOpen` fires when the
// dropdown opens so the surface can move focus to its composer. The Learn chip
// (`directPaste`) skips the dropdown and pastes its prompt immediately.
//
// We use a non-modal `Popper` (not a modal `Popover`/`Menu`): a modal would mark
// the page `aria-hidden` and steal/return focus, which fights the "caret stays
// blinking in the composer while the dropdown shows" behaviour from the design.
// The panel itself is built from Atlas `Paper` + `MenuList` + `MenuItem`.

export default function SuggestionChips({
  size = "small",
  align = "center",
  anchorEl = null,
  placement = "top",
  audience = "admin",
  maxVisible,
  variant = "outlined",
  layout = "wrap",
  promptSet = "default",
  showLearn = false,
  showIcon = true,
  onSelectPrompt,
  onSubmitPrompt,
  onChipOpen,
  sx,
}: {
  size?: "small" | "large";
  align?: "center" | "flex-start";
  // When set and there are more chips than this, only the first `maxVisible`
  // render inline; the rest collapse behind a "Show more" chip that opens a
  // menu (full-screen + home hero). Leave undefined to show every chip (panel).
  maxVisible?: number;
  // "outlined" → standard Atlas outlined chip (full-screen + home hero).
  // "plain" → no stroke / transparent fill, used by the docked panel list.
  variant?: "outlined" | "plain";
  // "wrap" → chips flow horizontally and wrap (full-screen + home hero).
  // "list" → chips stack vertically (the docked panel).
  layout?: "wrap" | "list";
  // Which chip set to show. "admin" → find/trace/answer/onboard/learn;
  // "director" → find/prepare/monitor/trace/learn. Behaviour is identical;
  // only the labels, icons and starter prompts differ.
  audience?: "admin" | "director";
  // "default" → the multi-prompt dropdown chips (Explorations). "mvp" → the
  // reverted single-prompt set: clicking a chip inserts its one prompt straight
  // into the composer (no dropdown, no "Learn"/onboarding entry, no overflow).
  promptSet?: "default" | "mvp";
  // MVP only: append a "Learn about Smart Assist" entry that submits the
  // onboarding prompt straight to the chat. Used by the panel + full-screen
  // welcome screens, not the home hero.
  showLearn?: boolean;
  // When false, chip icons are hidden (text-only chips). Default true.
  showIcon?: boolean;
  // The composer element to anchor the dropdown to.
  anchorEl?: HTMLElement | null;
  // Which edge of the composer the dropdown opens from. "top" floats it above
  // the chat box (overlay + panel); "bottom" pins it to the bottom edge so it
  // opens downward (home hero, where the chips sit below the composer).
  placement?: "top" | "bottom";
  // Paste the chosen prompt into the composer (and focus it). Also used by the
  // direct-paste Learn chip, which drops its prompt in without submitting.
  onSelectPrompt: (prompt: string) => void;
  // Submit a prompt straight to the chat (MVP Learn entry).
  onSubmitPrompt?: (prompt: string) => void;
  // Focus the composer when a chip's dropdown opens.
  onChipOpen?: () => void;
  sx?: SxProps<Theme>;
}) {
  const {
    tokens: {
      semantic: { color },
    },
  } = useTheme();
  const isMvp = promptSet === "mvp";
  // MVP set → map the single-prompt templates onto the chip shape with
  // `directPaste` so a click inserts the one prompt (no dropdown, no Learn).
  const chips: SuggestionChip[] = isMvp
    ? [
        ...mvpPromptsForAudience(audience).map((p) => ({
          label: p.label,
          Icon: p.Icon,
          prompts: [p.prompt],
          directPaste: true,
        })),
        // MVP Learn entry (panel + full-screen welcome only): submits the
        // onboarding prompt straight to the chat.
        ...(showLearn
          ? [{
              label: "Learn about Ask GovernAI",
              Icon: InfoIcon,
              prompts: [ONBOARDING_PROMPT],
              submit: true,
            } as SuggestionChip]
          : []),
      ]
    : audience === "director"
      ? DIRECTOR_SUGGESTION_CHIPS
      : ADMIN_SUGGESTION_CHIPS;
  const isLarge = size === "large";
  // Atlas Chip: small → 20px icon, large → 24px icon.
  const iconPx = isLarge ? "24px" : "20px";
  // Class the size-specific overrides target (paddings differ from Atlas
  // defaults so the leading icon isn't crowded against the chip's left edge).
  const sizeClass = isLarge ? "MuiChip-sizeLarge" : "MuiChip-sizeSmall";

  const isPlain = variant === "plain";
  const isList = layout === "list";

  // Split into inline chips and the overflow set hidden behind "Show more".
  // `maxVisible` undefined (panel) → show every chip, no overflow. MVP shows all
  // four templates inline (no "Show more").
  const hasOverflow = !isMvp && maxVisible != null && chips.length > maxVisible;
  const inlineChips = hasOverflow ? chips.slice(0, maxVisible) : chips;
  const overflowChips = hasOverflow ? chips.slice(maxVisible) : [];

  // Which chip's dropdown is open (by label), or null when closed.
  const [openLabel, setOpenLabel] = useState<string | null>(null);
  // Anchor for the "Show more" overflow menu (null when closed).
  const [showMoreAnchor, setShowMoreAnchor] = useState<HTMLElement | null>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const activeChip = chips.find((c) => c.label === openLabel) ?? null;
  const popperOpen = Boolean(openLabel && anchorEl && activeChip && !activeChip.directPaste);

  const handleChipClick = (chip: SuggestionChip) => {
    if (chip.submit) {
      // Learn (MVP) — paste + submit the onboarding prompt straight to the chat.
      setOpenLabel(null);
      onSubmitPrompt?.(chip.prompts[0]);
      return;
    }
    if (chip.directPaste) {
      // Learn — paste prompts[0] straight into the composer (no dropdown, no
      // submit) so the user can edit it or send it themselves.
      setOpenLabel(null);
      onSelectPrompt(chip.prompts[0]);
      return;
    }
    // Toggle this chip's dropdown; switching from another chip just re-points it.
    const willOpen = openLabel !== chip.label;
    setOpenLabel(willOpen ? chip.label : null);
    if (willOpen) onChipOpen?.();
  };

  const handleSelectPrompt = (prompt: string) => {
    setOpenLabel(null);
    onSelectPrompt(prompt);
  };

  // Close the prompt dropdown and/or "Show more" menu on outside click
  // (including clicking into the composer) and on Escape. Clicks on the chips
  // themselves are ignored here so a chip's own handler can toggle/switch
  // without this listener racing it closed.
  useEffect(() => {
    if (!popperOpen && !showMoreAnchor) return;
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (paperRef.current?.contains(target)) return;
      if (moreRef.current?.contains(target)) return;
      if (chipsRef.current?.contains(target)) return;
      setOpenLabel(null);
      setShowMoreAnchor(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenLabel(null);
        setShowMoreAnchor(null);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [popperOpen, showMoreAnchor]);

  // Shared chip styling. Atlas shrinks the left padding when a leading icon is
  // present (a high-specificity :has() rule), so we re-assert it on both the
  // size class and that same :has() selector. The plain variant (panel) drops
  // the stroke/fill and pulls the icon to an 8px inset so it lines up with the
  // panel's "How can I assist you?" title.
  const chipPadLeft = isPlain ? "8px" : isLarge ? "12px" : "8px";
  const chipSx: SxProps<Theme> = {
    [`&.${sizeClass}`]: {
      paddingLeft: chipPadLeft,
      paddingRight: "16px",
    },
    [`&.${sizeClass}:has(.MuiChip-icon + .MuiChip-label)`]: {
      paddingLeft: chipPadLeft,
    },
    "& .MuiChip-icon": {
      fontSize: iconPx,
      width: iconPx,
      height: iconPx,
      margin: 0,
    },
    "& .MuiChip-label": {
      paddingLeft: showIcon ? "8px" : 0,
      paddingRight: 0,
    },
    ...(isPlain && {
      border: "none",
      backgroundColor: "transparent",
      "&:hover, &.MuiChip-clickable:hover": {
        backgroundColor: color.surface.variant.value,
      },
    }),
  };

  const renderChip = (chip: SuggestionChip) => {
    const { label, Icon } = chip;
    const expanded = !chip.directPaste && openLabel === label;
    return (
      <Chip
        key={label}
        label={label}
        variant="outlined"
        size={size}
        clickable
        {...(showIcon ? { icon: <Icon /> } : {})}
        onClick={() => handleChipClick(chip)}
        aria-haspopup={chip.directPaste ? undefined : "menu"}
        aria-expanded={chip.directPaste ? undefined : expanded}
        sx={chipSx}
      />
    );
  };

  return (
    <>
      <Box
        ref={chipsRef}
        sx={{
          display: "flex",
          flexDirection: isList ? "column" : "row",
          flexWrap: isList ? "nowrap" : "wrap",
          alignItems: isList ? "flex-start" : "center",
          justifyContent: isList ? "flex-start" : align,
          gap: "8px",
          ...sx,
        }}
      >
        {inlineChips.map((chip) => renderChip(chip))}

        {/* Overflow — the chips past `maxVisible` collapse here. Clicking opens
            a menu of the remaining chips; picking one behaves like clicking the
            chip directly (opens its prompt dropdown, or pastes for Learn). */}
        {hasOverflow && (
          <Chip
            label="Show more"
            variant="outlined"
            size={size}
            clickable
            {...(showIcon ? { icon: <PlusIcon /> } : {})}
            onClick={(e) =>
              setShowMoreAnchor((prev) => (prev ? null : (e.currentTarget as HTMLElement)))
            }
            aria-haspopup="menu"
            aria-expanded={Boolean(showMoreAnchor)}
            sx={chipSx}
          />
        )}
      </Box>

      {/* "Show more" overflow menu — opens below the chip, lists the collapsed
          chips with their leading icons. */}
      <Popper
        open={Boolean(showMoreAnchor)}
        anchorEl={showMoreAnchor}
        placement="bottom-start"
        modifiers={[
          { name: "offset", options: { offset: [0, 8] } },
          { name: "flip", enabled: false },
        ]}
        sx={{ zIndex: 1400 }}
      >
        <Paper
          ref={moreRef}
          elevation={0}
          sx={{
            minWidth: "220px",
            borderRadius: "12px",
            border: `1px solid ${color.ui.divider.default.value}`,
            boxShadow: "0 4px 16px rgba(0,0,0,0.12), 0 0 2px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <MenuList sx={{ py: "4px" }}>
            {overflowChips.map((chip) => {
              const { label, Icon } = chip;
              return (
                <MenuItem
                  key={label}
                  onClick={() => {
                    setShowMoreAnchor(null);
                    handleChipClick(chip);
                  }}
                  sx={{
                    display: "flex",
                    gap: "12px",
                    px: "16px",
                    py: "10px",
                    "&:hover": { backgroundColor: color.surface.variant.value },
                  }}
                >
                  <Box sx={{ display: "flex", fontSize: "20px", color: color.type.default.value }}>
                    <Icon />
                  </Box>
                  <Typography sx={{ fontSize: "14px", lineHeight: "20px", color: color.type.default.value }}>
                    {label}
                  </Typography>
                </MenuItem>
              );
            })}
          </MenuList>
        </Paper>
      </Popper>

      {/* Prompt dropdown — floats above the composer. Header names the selected
          chip, then its three starter prompts. */}
      <Popper
        open={popperOpen}
        anchorEl={anchorEl}
        placement={placement}
        // Disable flip so the dropdown stays on its chosen edge consistently
        // (e.g. the home hero always opens downward from the bottom of the box)
        // rather than jumping to the opposite side when space is tight.
        modifiers={[
          { name: "offset", options: { offset: [0, 8] } },
          { name: "flip", enabled: false },
        ]}
        sx={{ zIndex: 1400 }}
      >
        {activeChip && (
          <Paper
            ref={paperRef}
            elevation={0}
            sx={{
              width: anchorEl ? anchorEl.offsetWidth : undefined,
              maxWidth: "100%",
              borderRadius: "12px",
              border: `1px solid ${color.ui.divider.default.value}`,
              boxShadow: "0 4px 16px rgba(0,0,0,0.12), 0 0 2px rgba(0,0,0,0.08)",
              overflow: "hidden",
            }}
          >
            {/* Header — which chip was selected (e.g. "Prepare"). */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                px: "16px",
                py: "10px",
                color: color.type.muted.value,
              }}
            >
              <Box sx={{ display: "flex", fontSize: "18px" }}>
                <activeChip.Icon />
              </Box>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  lineHeight: "18px",
                  letterSpacing: "0.4px",
                  color: color.type.muted.value,
                }}
              >
                {activeChip.label}{activeChip.tag ? ` · ${activeChip.tag}` : ""}
              </Typography>
            </Box>

            <Divider sx={{ borderColor: color.ui.divider.default.value }} />

            <MenuList sx={{ py: "4px" }}>
              {activeChip.prompts.map((prompt) => (
                <MenuItem
                  key={prompt}
                  onClick={() => handleSelectPrompt(prompt)}
                  sx={{
                    px: "16px",
                    py: "10px",
                    whiteSpace: "normal",
                    "&:hover": { backgroundColor: color.surface.variant.value },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "14px",
                      lineHeight: "20px",
                      color: color.type.default.value,
                    }}
                  >
                    {prompt}
                  </Typography>
                </MenuItem>
              ))}
            </MenuList>
          </Paper>
        )}
      </Popper>
    </>
  );
}
