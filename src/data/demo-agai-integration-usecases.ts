// ─── AGAI integration use cases demo: "Janice's December Risk Committee" ───────────────────────
// Scripted, presentation-style flow that shows what Ask GovernAI can do for a
// director once Task Hub, Decision Hub and Data Room are indexed, on top of
// today's book indexing. Only active in demo mode (the director view);
// nothing here is reachable from the regular director or admin chats.
//
// Mock world (keep numbers consistent with src/data/documents.ts):
//   Meridian Capital Group · Janice Whitfield (Risk Committee chair)
//   Demo "today" Nov 12, 2026 · next meeting Dec 4, 2026

import type { Source } from "./mockData.js";
import type { RichBlock } from "./hybrid-search.constants.js";
import { approvalProgressPath, dataRoomFilePath, taskPath } from "./demo-products.js";

export const DEMO_QUERY_PARAM = "demo";
export const DEMO_QUERY_VALUE = "AGAI-integration-usecases";
export const DEMO_START_PATH = "/director";

/** The director view (and the product pages it links to) is always the demo. */
export const isDemoPath = (pathname: string): boolean =>
  /^\/(director|tasks|data-room|decision-hub|demo)(\/|$)/.test(pathname);
export const DEMO_SUMMARY_PATH = "/demo/AGAI-integration-usecases/summary";
export const DEMO_SOURCE_PATH = "/demo/AGAI-integration-usecases/open";

/** Stand-in page a Tasks / Decision hub source chip opens in a new tab. */
export function demoSourceUrl(module: string, item: string): string {
  return `${DEMO_SOURCE_PATH}?${new URLSearchParams({ module, item }).toString()}`;
}

/** Time each reasoning step stays active before the next one (or the answer). */
export const DEMO_THINKING_LABEL_MS = 1200;

export const DEMO_DIRECTOR = { name: "Janice Whitfield", initials: "JW", id: "janice-whitfield" };

export interface DemoRailUseCase {
  /** Use cases doc section, e.g. "Task Hub UC 1: What is due when". */
  label: string;
  /** Anchor link to that section of the use cases page in Confluence. */
  href: string;
  /** Short bullets on what the use case covers. */
  points: string[];
}

export interface DemoRailNote {
  /** Module the answer comes from. */
  source: string;
  /** User flow without the MCP connection, as bullets: what the user has to do by
   *  hand today. When AGAI can already answer, says so. */
  today: string[];
  /** How the MCP connector helps with this request: time saved, or information
   *  the user couldn't see before (e.g. correlations across aggregated data). */
  benefits: string[];
  /** True when AGAI can already answer this question today. */
  possibleToday: boolean;
  /** Use cases this step demonstrates. */
  useCases: DemoRailUseCase[];
}

export interface DemoReasoningStep {
  /** Short, sentence-case name of what the AI did. */
  title: string;
  /** What it looked at, where, and what it found. */
  detail: string;
}

export interface DemoStep {
  /** Exact prompt. Clicking the chip sends this; typing it verbatim works too. */
  prompt: string;
  threadTitle: string;
  /** Reasoning steps, shown one after another (DEMO_THINKING_LABEL_MS each) before
   *  the answer, then kept on the message as an audit trail of what the AI did. */
  reasoning: DemoReasoningStep[];
  /** One-line plan shown at the top of the reasoning block ("This is what I will do…"). */
  reasoningIntro: string;
  sources: Source[];
  richContent: RichBlock[];
  rail: DemoRailNote;
  /** Share step only: the answer carries a confirmation card instead of retrieval. */
  action?: "share";
}

/** Use cases page (Confluence). Section anchors: spaces become hyphens, symbols are percent-encoded. */
const USE_CASES_URL =
  "https://diligentbrands.atlassian.net/wiki/spaces/~71202007b8e0be4c464eda9f35b9e7508bdfa1/pages/7498465309/Use+cases";
const uc = (anchor: string) => `${USE_CASES_URL}#${anchor}`;

const TASK_HUB_PROJECT = "Task Hub · Risk Committee — December 2026 book";

const MIN_SOURCE = (index: number) => ({
  index,
  title: "Minutes — Risk Committee, December 3, 2025",
  book: "Risk Committee — March 2026",
  page: "3",
  documentId: "rk-minutes-dec-2025" as const,
  targetPage: 3,
  module: "Books" as const,
  chipData: "Risk Committee — March 2026",
});

export const DEMO_STEPS: DemoStep[] = [
  // ── 1 · what do I owe ──────────────────────────────────────────────────────
  {
    prompt: "What's due for the December book?",
    threadTitle: "December Risk Committee requests",
    reasoningIntro: "I'll look in Task Hub for requests sent to you, check the due dates against the meeting date, then look in your minutes for anything that depends on them.",
    reasoning: [
      { title: "Search Task Hub", detail: "Looked in Task Hub for requests sent to you in Risk Committee — December 2026 book. Found 2 from your board admin." },
      { title: "Check meeting dates", detail: "Compared the due dates with the December 4 meeting. One request is due December 5, after it." },
      { title: "Search board books", detail: "Looked in approved Risk Committee minutes for items linked to these requests. Found a deferred policy review in the December 3, 2025 minutes that depends on the penetration test attestation." },
    ],
    sources: [
      { index: 1, title: "Request: chair's report", book: TASK_HUB_PROJECT, module: "Task Hub", chipData: "Chair's report", deepLink: taskPath("chair-report-cyber-resilience") },
      { index: 2, title: "Request: penetration test attestation", book: TASK_HUB_PROJECT, module: "Task Hub", chipData: "Penetration test attestation", deepLink: taskPath("pentest-attestation") },
      MIN_SOURCE(3),
    ],
    richContent: [
      { type: "p", spans: ["Your board admin has sent you 2 requests for the December 4 Risk Committee book."] },
      {
        type: "table",
        columns: ["Request", "Due", "Status"],
        defaultTextColor: true,
        rows: [
          [["Risk Committee chair's report: cyber resilience and vendor incident readiness"], ["Nov 27"], ["Open"]],
          [["Penetration test attestation (signed copy)"], ["Dec 5 ⚠"], ["Open"]],
        ],
      },
      {
        type: "p",
        spans: [
          "The penetration test attestation is due the day after the meeting, so it won't make it into the book unless it arrives earlier.",
        ],
      },
      {
        type: "p",
        spans: [
          "It also matters for another item. The December 2025 minutes say the deferred review of the vulnerability and incident response policy will be considered together with the penetration test attestation, so that review may not be ready on December 4. ",
          { cite: 3 },
        ],
      },
      { type: "p", spans: ["I'm only showing requests sent to you."] },
    ],
    rail: {
      source: "Task Hub + Books",
      today: [
        "Open the Document Collection email from your board admin, or the project in Task Hub.",
        "Read each request's due date. Your board admin has set them up, and nothing flags a date that lands after the meeting.",
        "Open the December 2025 minutes if you remember that something there depends on a request.",
      ],
      benefits: [
        "One answer replaces an email, a Task Hub project and a set of minutes.",
        "Acts as a safety net for the request setup: flags that the attestation is due after the meeting, which a busy admin can easily miss.",
        "Links the request to the deferred policy review in the minutes, a dependency that Task Hub and the minutes don't show side by side.",
      ],
      possibleToday: false,
      useCases: [
        {
          label: "Task Hub UC 1: What is due when",
          href: uc("UC-1%3A-What-is-due-when"),
          points: ["Ask what is due this week or before a meeting.", "Deadline crossing: Task Hub due dates against agenda dates."],
        },
        {
          label: "Task Hub UC 3: Outstanding-request aggregation",
          href: uc("UC-3%3A-Outstanding-request-aggregation"),
          points: ["See every request sent to one person in one answer."],
        },
      ],
    },
  },

  // ── 2 · catch me up (agendas + approved minutes) ───────────────────────────
  {
    prompt: "When was vendor cyber risk last on the agenda?",
    threadTitle: "Vendor cyber risk catch-up",
    reasoningIntro: "I'll look through the agendas and approved minutes in your published Risk Committee books for vendor cyber risk, then pick out what's still open.",
    reasoning: [
      { title: "Search board books", detail: "Looked through finalised agendas in published Risk Committee books. Found the topic on September 17, 2025 (item 6) and December 3, 2025 (item 5)." },
      { title: "Read the minutes", detail: "Opened the approved December 3, 2025 minutes in the Risk Committee — March 2026 book. Found the decision, one condition and one deferred review." },
    ],
    sources: [
      {
        index: 1,
        title: "Agenda — Risk Committee, September 17, 2025",
        book: "Risk Committee — September 2025",
        page: "2",
        documentId: "rk-agenda-sep-2025",
        targetPage: 2,
        module: "Books",
        chipData: "Risk Committee — September 2025",
      },
      {
        index: 2,
        title: "Agenda — Risk Committee, December 3, 2025",
        book: "Risk Committee — December 2025",
        page: "2",
        documentId: "rk-agenda-dec-2025",
        targetPage: 2,
        module: "Books",
        chipData: "Risk Committee — December 2025",
      },
      MIN_SOURCE(3),
    ],
    richContent: [
      { type: "p", spans: ["It came up twice, and the committee made a decision in December 2025:"] },
      {
        type: "list",
        items: [
          [
            "September 17, 2025, item 6: reviewed cyber risk through third-party vendors. ",
            { cite: 1 },
          ],
          [
            "December 3, 2025, item 5: the cyber resilience programme for FY2026 was on the agenda for decision. ",
            { cite: 2 },
            "The committee agreed to recommend the programme, including an independent annual penetration test and more investment in endpoint detection and identity controls, subject to a final business case. ",
            { cite: 3 },
          ],
        ],
      },
      { type: "p", spans: ["Two things came out of that decision and are still open:"] },
      {
        type: "list",
        items: [
          ["Condition: run an incident tabletop exercise with critical vendors before the end of Q4 2026. ", { cite: 3 }],
          ["Deferred: the review of the vulnerability and incident response policy, moved to Q4 2026. ", { cite: 3 }],
        ],
      },
      {
        type: "p",
        spans: [
          "It hasn't been on an agenda since December 2025, and the December 2026 agenda isn't published yet. Both open items fall in this quarter, so they may come up on December 4.",
        ],
      },
    ],
    rail: {
      source: "Books (finalised agendas and approved minutes)",
      today: [
        "Already possible: agendas and approved minutes are both inside published books.",
        "Open the September and December 2025 books to find the agenda items.",
        "Open the March 2026 book to read the minutes.",
      ],
      benefits: [
        "Reads agendas and minutes together, across books and years, in one answer.",
        "Pulls out what's still open (the condition and the deferred review) without paging through the minutes.",
        "Shows the topic hasn't been on an agenda since, so you know it may come up on December 4.",
      ],
      possibleToday: true,
      useCases: [
        {
          label: "Agendas UC 3: Historical / cross-agenda topic lookup",
          href: uc("%E2%98%85-UC-3%3A-Historical-%2F-cross-agenda-topic-lookup"),
          points: ["Find when a topic was on an agenda, and in which meeting.", "Works across committees and years."],
        },
        {
          label: "Minutes UC 1: Decision & resolution recall",
          href: uc("UC-1%3A-Decision-%26-resolution-recall"),
          points: ["Recall what was decided, when, and what was left open.", "Cited to the exact minutes section."],
        },
      ],
    },
  },

  // ── 3 · how did we vote ────────────────────────────────────────────────────
  {
    prompt: "How did I vote on the cyber investment, and what budget was approved?",
    threadTitle: "Cyber investment vote and budget",
    reasoningIntro: "I'll look in Decision Hub for the approval, the votes and the signed resolution.",
    reasoning: [
      { title: "Search Decision Hub", detail: "Looked in Decision Hub for the cyber investment approval. Found the vote counts, your vote, the budget and the signed resolution." },
    ],
    sources: [
      {
        index: 3,
        title: "Approve $3.2M incremental investment in endpoint detection and identity controls",
        book: "Decision Hub · Approval",
        module: "Decision Hub",
        chipData: "Cyber investment 2026",
        deepLink: approvalProgressPath("cyber-investment-2026"),
      },
      {
        index: 1,
        title: "Resolution — Incremental investment in endpoint detection and identity controls (signed)",
        book: "Decision Hub",
        page: "2",
        documentId: "dh-cyber-investment-fy2026",
        targetPage: 2,
        module: "Decision Hub",
        chipData: "Cyber investment resolution (signed)",
        deepLink: approvalProgressPath("cyber-investment-2026"),
      },
      {
        index: 2,
        title: "Resolution — Incremental investment in endpoint detection and identity controls (signed)",
        book: "Decision Hub",
        page: "3",
        documentId: "dh-cyber-investment-fy2026",
        targetPage: 3,
        module: "Decision Hub",
        chipData: "Cyber investment resolution (signed)",
        deepLink: approvalProgressPath("cyber-investment-2026"),
      },
    ],
    richContent: [
      {
        type: "p",
        spans: [
          "You voted for. The approved budget is $3.2M of incremental investment in endpoint detection and identity controls. ",
          { cite: 1 },
        ],
      },
      { type: "p", spans: ["The approval closed on June 9, 2026 and was approved. Here's how the vote went:"] },
      {
        type: "table",
        columns: ["Vote", "Count"],
        defaultTextColor: true,
        rows: [
          [["For"], ["4"]],
          [["Abstained"], ["1"]],
          [["Against"], ["0"]],
        ],
      },
      {
        type: "p",
        spans: ["The signed resolution is attached to the approval. ", { cite: 2 }],
      },
    ],
    rail: {
      source: "Decision Hub",
      today: [
        "Open Decision Hub and find the approval.",
        "Read the vote counts and your vote.",
        "Open the signed resolution and find the budget on page 2.",
      ],
      benefits: [
        "Vote counts, your own vote and the approved budget in one answer, from the approval and its signed PDF.",
        "No need to open the approval or hunt through the resolution for the figure.",
        "Decision Hub data becomes part of the same conversation as your books.",
      ],
      possibleToday: false,
      useCases: [
        {
          label: "Approvals UC 2: Director-side personal history",
          href: uc("%E2%98%85-UC-2%3A-Director-side-personal-history"),
          points: ["Ask how you voted on past approvals.", "Value is reporting, not what to approve today."],
        },
        {
          label: "Approvals UC 3: Free-text queries over approval properties",
          href: uc("UC-3%3A-Free-text-queries-over-approval-properties"),
          points: ["Ask about outcome, votes, budget or the signed PDF in plain language."],
        },
        {
          label: "Decision Hub UC 1: Questions and reports over existing approvals",
          href: uc("UC-1%3A-Questions-and-reports-over-existing-approvals"),
          points: ["Answer questions about past approvals and list them for a period."],
        },
      ],
    },
  },

  // ── 4 · find the attestation, check it against the policy ─────────────────
  {
    prompt: "Find the signed penetration test attestation. Are the high-severity findings within policy?",
    threadTitle: "Penetration test attestation",
    reasoningIntro: "I'll look in the Risk Committee data room for the penetration test attestation and check which version is signed, then check the findings against the policy in Resource center.",
    reasoning: [
      { title: "Search Data Room", detail: "Looked in the Risk Committee data room: Files → Security assurance. Found 2 versions of the attestation." },
      { title: "Check versions", detail: "Compared the signed attestation (October 9, 2026) with the September draft. Used the signed version." },
      { title: "Search Resource Center", detail: "Looked in the published Risk Committee policies. Found the vulnerability and incident response policy: high-severity findings must be remediated within 90 days of being reported." },
    ],
    sources: [
      {
        index: 1,
        title: "Northgate Security Partners — Annual penetration test attestation FY2026 (signed)",
        book: "Data Room · Risk Committee",
        page: "3",
        documentId: "ns-pentest-fy2026-signed",
        targetPage: 3,
        module: "Data Room",
        chipData: "Pen test attestation FY2026 (signed)",
        deepLink: dataRoomFilePath("security-assurance", "ns-pentest-fy2026-signed"),
      },
      {
        index: 2,
        title: "Northgate Security Partners — Annual penetration test attestation FY2026 (draft)",
        book: "Data Room · Risk Committee",
        page: "3",
        documentId: "ns-pentest-fy2026-draft",
        targetPage: 3,
        module: "Data Room",
        chipData: "Pen test attestation FY2026 (draft)",
        deepLink: dataRoomFilePath("security-assurance", "ns-pentest-fy2026-draft"),
      },
      {
        index: 3,
        title: "Vulnerability and incident response policy",
        book: "Resource Center",
        page: "2",
        documentId: "rc-vulnerability-incident-policy",
        targetPage: 2,
        module: "Resource Center",
        chipData: "Vulnerability response policy",
        deepLink: "/director/resource-center",
      },
    ],
    richContent: [
      {
        type: "p",
        spans: [
          "The penetration test found no critical findings and 2 high-severity findings, both in the vendor access gateway. Both were reported on October 9, 2026 and are in remediation. ",
          { cite: 1 },
        ],
      },
      {
        type: "p",
        spans: [
          "That's within our policy. The published policy requires high-severity findings to be remediated within 90 days of being reported, so both are due by January 7, 2027. Today is day 34 of 90. ",
          { cite: 3 },
        ],
      },
      {
        type: "p",
        spans: [
          "The attestation is in the Risk Committee data room: Files → Security assurance. It was signed on October 9, 2026. ",
          { cite: 1 },
        ],
      },
      {
        type: "p",
        spans: [
          "There's also a September draft in the same folder with a different figure (3 high-severity findings). I used the signed version. ",
          { cite: 2 },
        ],
      },
    ],
    rail: {
      source: "Data Room + Resource Center",
      today: [
        "Open the Risk Committee data room, then Files → Security assurance.",
        "Open the signed attestation, read the findings on page 3, and check you're not reading the draft.",
        "Open Resource center and find the vulnerability and incident response policy.",
        "Read the remediation window on page 2. Nothing connects it to the attestation, so the comparison and the date maths are on you.",
      ],
      benefits: [
        "Finds the signed attestation by description and picks it over the draft.",
        "Checks the findings against the published remediation window and does the maths: 2 high findings, due January 7, 2027, 56 days left.",
        "Correlates a Data room file with a Resource center policy, two products with no link between them.",
        "Spots the draft's different figure (3 high findings) so you don't quote the wrong one.",
      ],
      possibleToday: false,
      useCases: [
        {
          label: "Resource Center: Find the rule in a policy or charter",
          href: uc("Resource-Center"),
          points: ["Get the rule with a link to the page in the policy.", "Only published versions are used for directors."],
        },
        {
          label: "Data Room UC 1: Locate a document by description",
          href: uc("UC-1%3A-Locate-a-document-by-description"),
          points: ["Describe a document in plain words and get it back with its folder path.", "Only documents you can open are returned."],
        },
        {
          label: "Data Room UC 2: Find the information, not the file",
          href: uc("%E2%98%85-UC-2%3A-Find-the-information%2C-not-the-file"),
          points: ["Get the passage, with a link that opens the page.", "A signed version outranks a draft."],
        },
      ],
    },
  },

  // ── 5 · share with pre-check (action) ──────────────────────────────────────
  {
    prompt: "Share it with my board admin.",
    threadTitle: "Share penetration test attestation",
    reasoningIntro: "I'll check that you can share this file and that your board admin can be given access.",
    reasoning: [
      { title: "Check Janice's permission", detail: "Confirmed you can share this file. It's in the Risk Committee data room: Files → Security assurance." },
      { title: "Check your board admin's access", detail: "Checked that your board admin can get view access to this file only." },
    ],
    sources: [
      {
        index: 1,
        title: "Northgate Security Partners — Annual penetration test attestation FY2026 (signed)",
        book: "Data Room · Risk Committee",
        documentId: "ns-pentest-fy2026-signed",
        targetPage: 1,
        module: "Data Room",
        chipData: "Pen test attestation FY2026 (signed)",
        deepLink: dataRoomFilePath("security-assurance", "ns-pentest-fy2026-signed"),
      },
    ],
    // The confirmation card is rendered by the overlay (DemoShareCard); nothing
    // is shared until the user clicks Share.
    richContent: [],
    action: "share",
    rail: {
      source: "Data Room (+ Task Hub context from step 1)",
      today: [
        "Open the file in Data room and choose Share.",
        "Add your board admin with view access.",
        "Message your board admin to confirm they can open it.",
        "Update the request in Task Hub.",
      ],
      benefits: [
        "Shares from the conversation, right after finding the file.",
        "Checks your permission and your board admin's access before anything changes.",
        "Always ends in a confirm step, so nothing is shared by surprise. This is the step towards agentic actions.",
      ],
      possibleToday: false,
      useCases: [
        {
          label: "Data Room: Share with pre-check (future-forward)",
          href: uc("Data-Room"),
          points: ["Checks each recipient's access before sharing and warns you.", "Always ends in a confirm step before anything changes."],
        },
      ],
    },
  },

  // ── 6 · open commitments across the year (aggregated) ──────────────────────
  {
    prompt: "What did the committee commit to this year, and what's still open?",
    threadTitle: "Risk Committee open commitments",
    reasoningIntro: "I'll collect the commitments from your Risk Committee minutes and reports, then check Decision Hub and Task Hub to see where each one stands.",
    reasoning: [
      { title: "Search board books", detail: "Read the approved minutes and committee reports in your published Risk Committee books from the last 12 months. Found 4 commitments." },
      { title: "Search Decision Hub", detail: "Looked for the approvals behind them. The cyber investment approval closed on June 9, 2026 and has a signed resolution." },
      { title: "Search Task Hub", detail: "Looked for requests linked to them. The penetration test attestation is still open and due December 5." },
    ],
    sources: [
      MIN_SOURCE(1),
      { index: 2, title: "Request: penetration test attestation", book: TASK_HUB_PROJECT, module: "Task Hub", chipData: "Penetration test attestation", deepLink: taskPath("pentest-attestation") },
      {
        index: 3,
        title: "Approve $3.2M incremental investment in endpoint detection and identity controls",
        book: "Decision Hub · Approval",
        module: "Decision Hub",
        chipData: "Cyber investment 2026",
        deepLink: approvalProgressPath("cyber-investment-2026"),
      },
      {
        index: 4,
        title: "Cybersecurity Quarterly Update — Q2 2026",
        book: "Q2 2026 Board Package",
        page: "2",
        documentId: "cyber-quarterly-q2-2026",
        targetPage: 2,
        module: "Books",
        chipData: "Q2 2026 Board Package",
      },
    ],
    richContent: [
      { type: "p", spans: ["The Risk Committee has made 4 commitments in your books over the last 12 months. 1 is done and 3 are open."] },
      {
        type: "table",
        columns: ["Commitment", "Came from", "Where it stands"],
        defaultTextColor: true,
        rows: [
          [
            ["Run an incident tabletop exercise with critical vendors before the end of Q4 2026"],
            ["December 3, 2025 minutes ", { cite: 1 }],
            ["Open. Not started: there's no task for it and it's not on a published agenda."],
          ],
          [
            ["Review the vulnerability and incident response policy"],
            ["Deferred to Q4 2026 in the December 3, 2025 minutes ", { cite: 1 }],
            ["Open. It depends on the penetration test attestation, which is due December 5, after the meeting. ", { cite: 2 }],
          ],
          [
            ["Record the cyber investment as an approval and circulate the signed resolution"],
            ["December 3, 2025 minutes ", { cite: 1 }],
            ["Done. The approval closed on June 9, 2026 and the signed resolution is attached. ", { cite: 3 }],
          ],
          [
            ["Remediate the 2 OCC third-party risk findings"],
            ["Q2 2026 cybersecurity update ", { cite: 4 }],
            ["Open. Remediation plans are approved and the work is in progress."],
          ],
        ],
      },
      {
        type: "p",
        spans: [
          "Before December 4, the vendor tabletop is the one with no owner or date, and Q4 ends in 7 weeks. The policy review may also not be ready on the day.",
        ],
      },
      { type: "p", spans: ["I only included commitments written in minutes and committee reports in your published books."] },
    ],
    rail: {
      source: "Books + Decision Hub + Task Hub",
      today: [
        "Open the year's Risk Committee books and read the minutes and committee reports for commitments.",
        "Check Decision Hub for the approvals and Task Hub for related requests to see which are done.",
        "Your board admin tracks follow-ups, but no product gives you this view across books, approvals and requests.",
      ],
      benefits: [
        "Turns a manual sweep through a year of books into one answer you can check against the sources.",
        "Correlates three sources: commitments from books, approvals from Decision Hub, requests from Task Hub.",
        "Surfaces gaps that can slip past even a careful admin: the vendor tabletop has no owner or date with Q4 almost over, and the policy review may not be ready on the day.",
      ],
      possibleToday: false,
      useCases: [
        {
          label: "Minutes: Open actions across meetings (future-forward)",
          href: uc("Minutes"),
          points: [
            "One answer across minutes, approvals and tasks, over a year.",
            "Presenter note: actions aren't structured fields and Tasks aren't indexed yet, so status is inferred from the three sources.",
          ],
        },
      ],
    },
  },
];

export const DEMO_SHARE_FILE_TITLE = "Northgate Security Partners — Annual penetration test attestation FY2026 (signed)";

function normalise(text: string): string {
  return text.trim().toLowerCase().replace(/[‘’]/g, "'").replace(/\s+/g, " ").replace(/[?.]+$/, "");
}

const STEP_BY_PROMPT = new Map(DEMO_STEPS.map((s, i) => [normalise(s.prompt), i]));

/** Index of the scripted step whose prompt matches `text` exactly, or -1. */
export function matchDemoStep(text: string): number {
  return STEP_BY_PROMPT.get(normalise(text)) ?? -1;
}

/** Unique modules searched for an answer, in source order. */
export function modulesSearched(sources: Source[] | undefined): string[] {
  const out: string[] = [];
  for (const s of sources ?? []) if (s.module && !out.includes(s.module)) out.push(s.module);
  return out;
}

// ─── Intro, how-she-does-it-today and summary copy ────────────────────────────

export const DEMO_INTRO_1 = {
  name: DEMO_DIRECTOR.name,
  role: "Risk Committee chair",
  bullets: [
    "Independent director at Meridian Capital Group. The Risk Committee meets on December 4.",
    "A peer bank was hit by ransomware through a third-party vendor. Cyber resilience is now the top agenda item.",
    "Her board admin wants a chair's report and the signed penetration test attestation.",
    "First she needs the history: what was discussed, decided and voted, and what the testers found.",
  ],
};

export const DEMO_INTRO_2 = {
  headline: "6 places to look. 2 dates to remember. Nothing connects them.",
  steps: [
    "Reads the Document Collection email with her board admin's 2 requests.",
    "Opens the September and December 2025 Risk Committee books to find the agenda items.",
    "Opens the March 2026 book to read the December minutes.",
    "Opens Decision Hub to find the approval and the votes.",
    "Searches the Risk Committee data room for the signed penetration test attestation.",
    "Opens Resource Center to find the vulnerability and incident response policy and check the remediation window.",
    "Shares the file with her board admin from the Data Room.",
    "Pages through a year of minutes and reports, then checks Decision Hub and Task Hub, to see what the committee still owes.",
  ],
  footer: "Today AGAI can help with steps 2 and 3 only. Let's see what changes when it can search everything she can access.",
};

export const DEMO_SUMMARY = {
  rows: [
    { step: 1, question: "What do I owe?", source: "Task Hub + Books" },
    { step: 2, question: "Catch me up on vendor cyber risk", source: "Books" },
    { step: 3, question: "Votes and budget", source: "Decision Hub" },
    { step: 4, question: "The pen test and the policy window", source: "Data Room + Resource Center" },
    { step: 5, question: "Share with your board admin", source: "Data Room" },
    { step: 6, question: "Open commitments this year", source: "Books + Decision Hub + Task Hub" },
  ].map((r, i) => ({ ...r, possibleToday: DEMO_STEPS[i].rail.possibleToday })),
  lines: [
    "One question, one answer, with sources, without opening each module.",
    "Every answer is limited to what Janice can access.",
  ],
  // Placeholder text; to be edited by the presenter.
  ask: "Index Task Hub, Decision Hub and Data Room for AGAI.",
};
