import type { ChatMessage } from "./mockData.js";

// ─── Rich content types ───────────────────────────────────────────────────────

// `cite` is the source index used to resolve the document/page for the preview.
// `label` is the number actually rendered on the chip — when present it lets the
// same source carry a different visible number at each citation site.
export type Cite = { cite: number; label?: number };
export type Span = string | Cite;

export interface RichParagraph { type: "p"; spans: Span[] }
export interface RichHeader    { type: "h"; text: string }
export interface RichList      { type: "list"; items: (string | Span[])[] }
export interface RichTable {
  type: "table";
  columns: string[];
  rows: Span[][][]; // [row][cell][span]
  /** If true, every cell uses the default text color (no muted columns). */
  defaultTextColor?: boolean;
}
export type RichBlock = RichParagraph | RichHeader | RichList | RichTable;

// Note: each variant inlines its own approvals table because cite numbers are
// response-scoped — the same row may carry a different cite number in Variant 0
// vs Variant 2 if the table is preceded by prose that already introduced some
// (document, page) pairs.

// ─── Conversation variants ────────────────────────────────────────────────────

interface ConversationVariant {
  /** Replaces the user's actual typed text in the chat bubble. */
  userQuestion: string;
  /** ≤5-word title used for the thread list entry (AI-generated style). */
  threadTitle: string;
  sources: ChatMessage["sources"];
  richContent: RichBlock[];
}

export const CONVERSATION_VARIANTS: ConversationVariant[] = [
  // ── Variant 0 — default structured response ───────────────────────────────
  // Cites in order of first appearance:
  //   [1] Minutes p.3 — Approval of Prior Minutes section
  //   [2] FY2026 Plan p.3 — Consolidated Budget
  //   [3] Minutes p.4 — FY2026 Operating Plan section
  //   [4] FY2026 Plan p.6 — Risks / Variance Reporting cadence
  //   [5] Resolution p.2 — Resolution text
  //   [6] Minutes p.5 — Cybersecurity section
  //   [7] Resolution p.4 — Roles, sign-off, Tabletop cadence
  {
    userQuestion: "What was formally approved at the last board meeting?",
    threadTitle: "Last board meeting approvals",
    sources: [
      { index: 1, title: "Minutes, Board meeting Q4 2025",                              book: "Board Book Q4 2025", page: "3", documentId: "minutes-q4-2025", targetPage: 3 },
      { index: 2, title: "FY2026 Operating Plan & Budget",                              book: "Board Book Q4 2025", page: "3", documentId: "fy2026-plan",      targetPage: 3 },
      { index: 3, title: "Minutes, Board meeting Q4 2025",                              book: "Board Book Q4 2025", page: "4", documentId: "minutes-q4-2025", targetPage: 4 },
      { index: 4, title: "FY2026 Operating Plan & Budget",                              book: "Board Book Q4 2025", page: "6", documentId: "fy2026-plan",      targetPage: 6 },
      { index: 5, title: "Resolution – Approval of Incident Response Framework",       book: "Board Book Q4 2025", page: "2", documentId: "ir-resolution",    targetPage: 2 },
      { index: 6, title: "Minutes, Board meeting Q4 2025",                              book: "Board Book Q4 2025", page: "5", documentId: "minutes-q4-2025", targetPage: 5 },
      { index: 7, title: "Resolution – Approval of Incident Response Framework",       book: "Board Book Q4 2025", page: "4", documentId: "ir-resolution",    targetPage: 4 },
    ],
    richContent: [
      {
        type: "p",
        spans: [
          "According to the last board meeting documents from December 10, 2025, the Board approved the following items:",
        ],
      },
      {
        type: "table",
        columns: ["Approval name", "Description", "Actions"],
        defaultTextColor: true,
        rows: [
          [
            ["Approval of prior board meeting minutes"],
            [
              "The Board approved the minutes from the September 18, 2025 board meeting as presented, confirming the official record of discussions and decisions.",
              " ", { cite: 1 },
            ],
            ["No follow-up actions were recorded."],
          ],
          [
            ["FY2026 operating plan and budget"],
            [
              "The Board approved management's proposed FY2026 operating plan and consolidated budget, including planned investments in product development, headcount growth, and international expansion.",
              " ", { cite: 2 }, " ", { cite: 3 },
            ],
            [
              "Management to circulate the final approved budget deck and provide quarterly variance reporting beginning Q1 2026.",
              " ", { cite: 4 },
            ],
          ],
          [
            ["Cybersecurity: Incident Response Framework"],
            [
              "The Board approved the updated Incident Response Framework, establishing formal escalation thresholds, board notification triggers, and defined roles and responsibilities for handling cybersecurity incidents between board meetings.",
              " ", { cite: 5 }, " ", { cite: 6 },
            ],
            [
              "Management to finalize and publish the framework internally and schedule a tabletop incident response exercise in early 2026.",
              " ", { cite: 7 },
            ],
          ],
        ],
      },
    ],
  },

  // ── Variant 1 — multi-cycle trace ─────────────────────────────────────────
  // Cites in order of first appearance:
  //   [1] Risk & Cybersecurity Update p.3 — Cybersecurity Escalation Readiness
  //   [2] Risk & Cybersecurity Update p.4 — Findings, Gaps, Recommendations (roadmap)
  //   [3] Minutes p.5 — Cybersecurity section
  //   [4] Resolution p.2 — Resolution text
  {
    userQuestion: "How did the Incident Response Framework come to be approved?",
    threadTitle: "Incident Response Framework history",
    sources: [
      { index: 1, title: "Risk & Cybersecurity Update",                              book: "Board Book Q3 2024", page: "3", documentId: "risk-cyber-2024-q3", targetPage: 3 },
      { index: 2, title: "Risk & Cybersecurity Update",                              book: "Board Book Q3 2024", page: "4", documentId: "risk-cyber-2024-q3", targetPage: 4 },
      { index: 3, title: "Minutes, Board meeting Q4 2025",                           book: "Board Book Q4 2025", page: "5", documentId: "minutes-q4-2025",    targetPage: 5 },
      { index: 4, title: "Resolution – Approval of Incident Response Framework",   book: "Board Book Q4 2025", page: "2", documentId: "ir-resolution",      targetPage: 2 },
    ],
    richContent: [
      {
        type: "p",
        spans: [
          "The approval of the Incident Response Framework was the outcome of a multi-cycle discussion that evolved across several board meetings and board materials.",
        ],
      },
      { type: "h", text: "Initial discussion (September 2024)" },
      {
        type: "p",
        spans: [
          "Cybersecurity escalation readiness was first raised during a Risk & Cybersecurity Update presented to the Board, where management highlighted inconsistent escalation thresholds and limited board visibility during active incidents.",
          " ", { cite: 1 },
        ],
      },
      { type: "h", text: "Recommended roadmap and interim updates (Sept 2024 – Sept 2025)" },
      {
        type: "p",
        spans: [
          "The same update set out a multi-cycle roadmap: development of a formal Incident Response Framework with quantitative escalation thresholds, named accountable executives, and same-day notification for S1/S2 incidents, with interim updates at the March and June 2025 board meetings and a finalized draft circulated for feedback in September 2025.",
          " ", { cite: 2 },
        ],
      },
      { type: "h", text: "Final approval (December 2025)" },
      {
        type: "p",
        spans: [
          "At the December 10, 2025 meeting, management presented a finalized Incident Response Framework incorporating prior board feedback. The Board approved the framework following confirmation that escalation thresholds, notification timelines, and management accountability were clearly defined.",
          " ", { cite: 3 }, " ", { cite: 4 },
        ],
      },
    ],
  },

  // ── Variant 2 — full summary with cybersecurity detail ───────────────────
  // Cites in order of first appearance:
  //   [1]  Minutes p.6        — Resolutions, Action Items, Sign-Off (intro prose)
  //   [2]  Minutes p.5        — Cybersecurity section (relevance prose)
  //   [3]  Resolution p.2     — Resolution text (formal resolution prose)
  //   [4]  Minutes p.3        — Approval of Prior Minutes (table row 1)
  //   [5]  FY2026 Plan p.3    — Consolidated Budget (table row 2 desc)
  //   [6]  Minutes p.4        — Operating Plan section (table row 2 desc)
  //   [7]  FY2026 Plan p.6    — Variance Reporting (table row 2 actions)
  //   [8]  Resolution p.4     — Roles, sign-off, Tabletop cadence (table row 3 actions)
  //   [9]  Risk & Cyber p.3   — Cyber Escalation Readiness (evolution prose)
  //   [10] Risk & Cyber p.4   — Findings / roadmap (evolution prose)
  // Reuses: table row 3 desc reuses [3] and [2]; final prose reuses [8].
  {
    userQuestion: "Can you give me a summary of recent approvals and how the cybersecurity decision evolved?",
    threadTitle: "Recent approvals and cyber evolution",
    sources: [
      { index: 1,  title: "Minutes, Board meeting Q4 2025",                            book: "Board Book Q4 2025", page: "6", documentId: "minutes-q4-2025",    targetPage: 6 },
      { index: 2,  title: "Minutes, Board meeting Q4 2025",                            book: "Board Book Q4 2025", page: "5", documentId: "minutes-q4-2025",    targetPage: 5 },
      { index: 3,  title: "Resolution – Approval of Incident Response Framework",   book: "Board Book Q4 2025", page: "2", documentId: "ir-resolution",      targetPage: 2 },
      { index: 4,  title: "Minutes, Board meeting Q4 2025",                            book: "Board Book Q4 2025", page: "3", documentId: "minutes-q4-2025",    targetPage: 3 },
      { index: 5,  title: "FY2026 Operating Plan & Budget",                            book: "Board Book Q4 2025", page: "3", documentId: "fy2026-plan",        targetPage: 3 },
      { index: 6,  title: "Minutes, Board meeting Q4 2025",                            book: "Board Book Q4 2025", page: "4", documentId: "minutes-q4-2025",    targetPage: 4 },
      { index: 7,  title: "FY2026 Operating Plan & Budget",                            book: "Board Book Q4 2025", page: "6", documentId: "fy2026-plan",        targetPage: 6 },
      { index: 8,  title: "Resolution – Approval of Incident Response Framework",   book: "Board Book Q4 2025", page: "4", documentId: "ir-resolution",      targetPage: 4 },
      { index: 9,  title: "Risk & Cybersecurity Update",                              book: "Board Book Q3 2024", page: "3", documentId: "risk-cyber-2024-q3", targetPage: 3 },
      { index: 10, title: "Risk & Cybersecurity Update",                              book: "Board Book Q3 2024", page: "4", documentId: "risk-cyber-2024-q3", targetPage: 4 },
    ],
    richContent: [
      {
        type: "p",
        spans: [
          "Here's a summary of what I found regarding recent approvals and the background on the cybersecurity item you asked about.",
        ],
      },
      { type: "h", text: "Summary of approvals (December 10, 2025 Board Meeting)" },
      {
        type: "p",
        spans: [
          "At the December 10, 2025 board meeting, the Board formally approved several items, including the FY2026 operating plan and budget, routine approval of the prior meeting minutes, and the updated Incident Response Framework.",
          " ", { cite: 1 },
        ],
      },
      {
        type: "p",
        spans: [
          "Of particular relevance to cybersecurity, the Board approved the Incident Response Framework, which establishes formal escalation thresholds, board notification triggers, and clear roles and responsibilities for managing cybersecurity incidents between meetings. This approval was recorded in the Board Meeting Minutes and finalized through a formal Board resolution.",
          " ", { cite: 2 }, " ", { cite: 3 },
        ],
      },
      {
        type: "table",
        columns: ["Approval name", "Description", "Actions"],
        defaultTextColor: true,
        rows: [
          [
            ["Approval of prior board meeting minutes"],
            [
              "The Board approved the minutes from the September 18, 2025 board meeting as presented, confirming the official record of discussions and decisions.",
              " ", { cite: 4 },
            ],
            ["No follow-up actions were recorded."],
          ],
          [
            ["FY2026 operating plan and budget"],
            [
              "The Board approved management's proposed FY2026 operating plan and consolidated budget, including planned investments in product development, headcount growth, and international expansion.",
              " ", { cite: 5 }, " ", { cite: 6 },
            ],
            [
              "Management to circulate the final approved budget deck and provide quarterly variance reporting beginning Q1 2026.",
              " ", { cite: 7 },
            ],
          ],
          [
            ["Cybersecurity: Incident Response Framework"],
            [
              "The Board approved the updated Incident Response Framework, establishing formal escalation thresholds, board notification triggers, and defined roles and responsibilities for handling cybersecurity incidents between board meetings.",
              " ", { cite: 3 }, " ", { cite: 2 },
            ],
            [
              "Management to finalize and publish the framework internally and schedule a tabletop incident response exercise in early 2026.",
              " ", { cite: 8 },
            ],
          ],
        ],
      },
      { type: "h", text: "How the cybersecurity decision evolved" },
      {
        type: "p",
        spans: [
          "The approval of the Incident Response Framework followed a series of discussions over multiple board cycles rather than a single meeting. The topic first came up in late 2024 during a Risk & Cybersecurity Update, where management highlighted gaps in escalation clarity and board visibility during incidents.",
          " ", { cite: 9 },
        ],
      },
      {
        type: "p",
        spans: [
          "The same update set out a multi-cycle roadmap with interim updates at the March and June 2025 meetings, a draft framework circulated in September 2025, and the final version presented and approved at the December 10, 2025 meeting.",
          " ", { cite: 10 }, " ", { cite: 8 },
        ],
      },
    ],
  },
];

// ─── Director home (outside-book) conversation variants ──────────────────────
// Shown when the director is on the home page, books list, or resource centre —
// i.e. not inside a book reader. Library-scoped questions that don't assume a
// specific book is open.

export const DIRECTOR_HOME_CONVERSATION_VARIANTS: ConversationVariant[] = [
  // ── Variant 0 — upcoming meetings + ready books ──────────────────────────
  {
    userQuestion: "What meetings do I have coming up, and which board books are ready?",
    threadTitle: "Upcoming meetings and board books",
    sources: [
      { index: 1, title: "Q2 2026 Board Package",               book: "Q2 2026 Board Package",  page: "1", documentId: "q2-2026-board-package",    targetPage: 1 },
      { index: 2, title: "Audit Committee Report — June 2026",  book: "Q2 2026 Board Package",  page: "2", documentId: "audit-committee-jun-2026", targetPage: 2 },
    ],
    richContent: [
      {
        type: "p",
        spans: [
          "You have two upcoming meetings on the calendar and the following board materials are ready to review:",
        ],
      },
      {
        type: "table",
        defaultTextColor: true,
        columns: ["Meeting", "Date", "Status"],
        rows: [
          [
            ["Full Board Meeting — Q2 2026"],
            ["15 July 2026"],
            ["Board pack distributed.", " ", { cite: 1 }],
          ],
          [
            ["Audit Committee — June 2026"],
            ["18 July 2026"],
            ["Agenda and Audit Committee report included in pack.", " ", { cite: 2 }],
          ],
        ],
      },
      {
        type: "p",
        spans: [
          "The Q2 2026 Board Package is your most recent book. Click a citation to open it directly.",
        ],
      },
    ],
  },

  // ── Variant 1 — cross-book governance summary ────────────────────────────
  {
    userQuestion: "Can you give me a quick governance summary across my recent board books?",
    threadTitle: "Governance summary across recent books",
    sources: [
      { index: 1, title: "Minutes, Board meeting Q4 2025",              book: "Board Book Q4 2025",    page: "4", documentId: "minutes-q4-2025",          targetPage: 4 },
      { index: 2, title: "CFO Commentary — Q2 2026",                    book: "Q2 2026 Board Package", page: "2", documentId: "cfo-commentary-q2-2026",    targetPage: 2 },
      { index: 3, title: "Q2 2026 Board Pack — Risk & Compliance Update", book: "Q2 2026 Board Package", page: "2", documentId: "risk-compliance-q2-2026", targetPage: 2 },
    ],
    richContent: [
      {
        type: "p",
        spans: [
          "Here's a high-level governance summary drawn from your last two board books:",
        ],
      },
      {
        type: "list",
        items: [
          ["In Q4 2025 the Board approved the FY2026 budget, adopted the Incident Response Framework, and committed management to three follow-up actions for Q1 2026.", " ", { cite: 1 }],
          ["The Q2 2026 pack shows all three December follow-ups have been addressed: Q1 variance reporting delivered, the IR tabletop confirmed, and the two OCC MRAs closed with accepted plans.", " ", { cite: 2 }],
          ["Current open items include approval of a $150M Q3 2026 share buyback and a risk update on CRE office exposure now at 3.4% of the loan book.", " ", { cite: 3 }],
        ],
      },
      {
        type: "p",
        spans: [
          "Open the Q2 2026 Board Package to read the full detail on any of these items.",
        ],
      },
    ],
  },
];

// ─── Director conversation variants ───────────────────────────────────────────
// Director-side cycle (4 variants) covering an Audit Committee prep flow:
//   Variant 0 → outstanding follow-ups from last meeting
//   Variant 1 → CFO Q1 variance recap
//   Variant 2 → revenue variance comparison across last 3 meetings
//   Variant 3 → one-paragraph briefing note synthesis

export const DIRECTOR_CONVERSATION_VARIANTS: ConversationVariant[] = [
  // ── Variant 0 — follow-up status: mix of same-book (Q2 pack) + cross-book ─
  // Deliberately contains both kinds of citation so the in-book-scroll and the
  // cross-book-overlay behaviours can be validated from a single response.
  //   [1] Minutes Q4 2025 p.4      → cross-book  (bb-q4-2025)  → opens overlay
  //   [2] CFO Commentary Q2 2026   → same-book   (bookId "1")  → scrolls in book
  //   [3] IR Resolution Q4 2025    → cross-book  (bb-q4-2025)  → opens overlay
  //   [4] Cyber Quarterly Q2 2026  → same-book   (bookId "1")  → scrolls in book
  //   [5] Audit Committee Jun 2026 → same-book   (bookId "1")  → scrolls in book
  {
    userQuestion: "Which follow-up items from the December board meeting have been addressed in this pack, and what is still open?",
    threadTitle: "December follow-up items status",
    sources: [
      { index: 1, title: "Minutes, Board meeting Q4 2025",          book: "Board Book Q4 2025",    page: "4", documentId: "minutes-q4-2025",       targetPage: 4 },
      { index: 2, title: "CFO Commentary — Q2 2026",                book: "Q2 2026 Board Package", page: "2", documentId: "cfo-commentary-q2-2026", targetPage: 2 },
      { index: 3, title: "Resolution – Approval of Incident Response Framework", book: "Board Book Q4 2025", page: "4", documentId: "ir-resolution", targetPage: 4 },
      { index: 4, title: "Cybersecurity Quarterly Update — Q2 2026", book: "Q2 2026 Board Package", page: "2", documentId: "cyber-quarterly-q2-2026", targetPage: 2 },
      { index: 5, title: "Audit Committee Report — June 2026",       book: "Q2 2026 Board Package", page: "2", documentId: "audit-committee-jun-2026", targetPage: 2 },
    ],
    richContent: [
      {
        type: "p",
        spans: [
          "Three follow-up items were committed at the December 10, 2025 board meeting.", " ", { cite: 1 }, " Here is their current status in the Q2 2026 pack:",
        ],
      },
      {
        type: "table",
        defaultTextColor: true,
        columns: ["Follow-up item", "Committed by", "Status in Q2 pack"],
        rows: [
          [
            ["Provide quarterly variance reporting against the approved FY2026 budget from Q1 2026", " ", { cite: 1 }],
            ["CFO"],
            ["Delivered — Q2 variance and NIM walk covered in CFO Commentary.", " ", { cite: 2 }],
          ],
          [
            ["Schedule tabletop incident response exercise in early 2026", " ", { cite: 3 }],
            ["CISO"],
            ["Update provided — tabletop date confirmed and third-party threat surface reviewed.", " ", { cite: 4 }],
          ],
          [
            ["Close OCC third-party review MRAs with accepted remediation plans", " ", { cite: 5 }],
            ["Management / Audit Committee"],
            ["Complete — two MRAs closed with accepted plans, noted in Audit Committee report.", " ", { cite: 5 }],
          ],
        ],
      },
    ],
  },

  // ── Variant 1 — CFO report on Q1 variance ────────────────────────────────
  {
    userQuestion: "What does the CFO report say about Q1 performance versus budget?",
    threadTitle: "CFO report Q1 vs budget",
    sources: [
      { index: 1, title: "CFO Q1 Variance Report",          book: "Board Book Q1 2026", page: "2", documentId: "cfo-q1-variance-report", targetPage: 2 },
      { index: 2, title: "FY2026 Operating Plan & Budget",  book: "Board Book Q4 2025", page: "4", documentId: "fy2026-plan",            targetPage: 4 },
      { index: 3, title: "CFO Q1 Variance Report",          book: "Board Book Q1 2026", page: "2", documentId: "cfo-q1-variance-report", targetPage: 2 },
    ],
    richContent: [
      {
        type: "p",
        spans: [
          "The CFO report covers the first quarterly variance update against the approved FY2026 budget:",
        ],
      },
      {
        type: "list",
        items: [
          ["Revenue is tracking 3% below plan for Q1, attributed to delayed enterprise contract renewals in North America. Management notes recovery is expected in Q2.", " ", { cite: 1 }],
          ["Operating expenses are within budget, with headcount growth slightly behind plan in product and engineering.", " ", { cite: 2 }],
          ["International expansion costs are running approximately 8% ahead of budget, driven by earlier-than-planned EMEA market entry.", " ", { cite: 3 }],
        ],
      },
      {
        type: "p",
        spans: [
          "Management characterises the overall position as within acceptable variance thresholds, with no reforecast recommended at this stage.",
        ],
      },
    ],
  },

  // ── Variant 2 — revenue variance compared across last 3 meetings ─────────
  {
    userQuestion: "How has revenue performance been tracking across the last three board meetings?",
    threadTitle: "Revenue tracking across board meetings",
    sources: [
      { index: 1, title: "CFO Q1 Variance Report",          book: "Board Book Q1 2026", page: "2", documentId: "cfo-q1-variance-report", targetPage: 2 },
      { index: 2, title: "FY2026 Operating Plan & Budget",  book: "Board Book Q4 2025", page: "2", documentId: "fy2026-plan",            targetPage: 2 },
      { index: 3, title: "CFO Q1 Variance Report",          book: "Board Book Q1 2026", page: "2", documentId: "cfo-q1-variance-report", targetPage: 2 },
    ],
    richContent: [
      {
        type: "p",
        spans: [
          "Searching across the last three Audit Committee board packs, the revenue picture appears in each:",
        ],
      },
      {
        type: "table",
        defaultTextColor: true,
        columns: ["Meeting", "What was said", "Status"],
        rows: [
          [
            ["Sep 2025"],
            ["Softness in enterprise renewals flagged as an emerging risk. Elongated sales cycles in North America noted. No formal variance reportable — FY2026 budget not yet approved.", " ", { cite: 1 }],
            ["Risk flagged"],
          ],
          [
            ["Dec 2025"],
            ["Renewal pipeline risk acknowledged. A 2% H1 2026 revenue contingency built in, assuming delayed closures shift to Q2. Board approved the budget with this assumption in the resolution.", " ", { cite: 2 }],
            ["2% contingency accepted"],
          ],
          [
            ["Mar 2026"],
            ["Revenue tracking 3% below plan — above the 2% contingency modelled in December. Management's narrative does not explicitly reference the December contingency assumption.", " ", { cite: 3 }],
            ["−3% actual vs −2% contingency"],
          ],
        ],
      },
      {
        type: "p",
        spans: [
          "The CFO report and CISO update in your current pack are the most relevant starting points for each item.",
        ],
      },
    ],
  },

  // ── Variant 3 — one-paragraph briefing note ──────────────────────────────
  {
    userQuestion: "Can you draft a briefing note summarising the key items for the upcoming March 2026 Audit Committee meeting?",
    threadTitle: "Audit Committee briefing note draft",
    sources: [
      { index: 1, title: "CFO Q1 Variance Report",         book: "Board Book Q1 2026", page: "2", documentId: "cfo-q1-variance-report", targetPage: 2 },
      { index: 2, title: "FY2026 Operating Plan & Budget", book: "Board Book Q4 2025", page: "3", documentId: "fy2026-plan",            targetPage: 3 },
      { index: 3, title: "CFO Q1 Variance Report",         book: "Board Book Q1 2026", page: "2", documentId: "cfo-q1-variance-report", targetPage: 2 },
    ],
    richContent: [
      {
        type: "p",
        spans: [
          "Here's a draft briefing note — edit before sharing:",
        ],
      },
      {
        type: "p",
        spans: [
          "The March 2026 Audit Committee meeting is expected to address three outstanding items from the September and December 2025 meetings. On financials, the CFO will present the first Q1 FY2026 variance update: revenue is tracking 3% below plan due to delayed enterprise renewals in North America, above the 2% H1 contingency accepted when the Board approved the budget in December. Operating expenses are within plan and international expansion is running ahead of budget on earlier EMEA entry. On cybersecurity, management is expected to confirm publication of the Incident Response Framework and provide a date for the tabletop exercise committed to in December.",
        ],
      },
    ],
  },

  // ── Variant 4 — Q2 2026 Board Package deep-dive (same-book citations) ────
  // All sources belong to bookId "1" (Q2 2026 Board Package). When the
  // director is reading that book in panel mode, clicking any of these chips
  // scrolls the assembled book in place rather than opening the overlay.
  {
    userQuestion: "What are the key financial and risk highlights from this board pack?",
    threadTitle: "Q2 financial and risk highlights",
    sources: [
      { index: 1, title: "CFO Commentary — Q2 2026",                      book: "Q2 2026 Board Package", page: "2", documentId: "cfo-commentary-q2-2026",  targetPage: 2 },
      { index: 2, title: "Q2 2026 Consolidated Financial Statements",      book: "Q2 2026 Board Package", page: "2", documentId: "fin-statements-q2-2026",  targetPage: 2 },
      { index: 3, title: "Q2 2026 Board Pack — Risk & Compliance Update",  book: "Q2 2026 Board Package", page: "2", documentId: "risk-compliance-q2-2026", targetPage: 2 },
      { index: 4, title: "Capital Plan and Buyback Proposal — Q3 2026",    book: "Q2 2026 Board Package", page: "2", documentId: "capital-plan-q3-2026",    targetPage: 2 },
      { index: 5, title: "Cybersecurity Quarterly Update — Q2 2026",       book: "Q2 2026 Board Package", page: "2", documentId: "cyber-quarterly-q2-2026", targetPage: 2 },
    ],
    richContent: [
      {
        type: "p",
        spans: [
          "Here are the key financial and risk highlights from your Q2 2026 Board Package:",
        ],
      },
      {
        type: "list",
        items: [
          ["Revenue grew 8.3% year-on-year to $1.24B, with net interest margin compressing 18 bp to 2.61% as deposit repricing lagged asset yields.", " ", { cite: 1 }, " ", { cite: 2 }],
          ["CRE office exposure is down to 3.4% of total loans ($1.42B) following $260M in run-off; two single-name relationships migrated to watchlist with $11M of specific reserves established.", " ", { cite: 3 }],
          ["The Board is asked to approve a $150M share buyback for Q3 2026, representing approximately 2.1% of current market capitalisation, subject to CET1 remaining above 12.5%.", " ", { cite: 4 }],
          ["An incremental $3.2M cyber spend has been approved following the FS-ISAC advisory; the OCC third-party review closed with two MRAs, both with accepted remediation plans.", " ", { cite: 5 }],
        ],
      },
      {
        type: "p",
        spans: [
          "Click any citation to jump directly to the relevant page in this book.",
        ],
      },
    ],
  },
];

// ─── Thread conversations (for sidenav history) ───────────────────────────────

export interface ChatThread {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  sourceContext?: string;
  previewDocumentId?: string;
  /** True when this thread represents a project folder (not a regular chat) */
  isProject?: boolean;
  /** ID of the parent project thread, if this thread belongs to a project */
  projectId?: string;
}

// ── Thread 1: Q1 2026 director compensation summary ──────────────────────────
const COMPENSATION_MESSAGES: ChatMessage[] = [
  {
    id: "c-1", role: "user",
    content: "Summarize the proposed director compensation changes for Q1 2026.",
    timestamp: "09:14 AM",
  },
  {
    id: "c-2", role: "ai",
    content: "The Compensation Committee proposed a 6% increase to the annual cash retainer (from $95,000 to $100,700) [1] and a $25,000 increase to the equity grant for non-employee directors [1]. Committee chair premiums remain unchanged except for the Audit Committee chair, which increases from $25,000 to $30,000 [2]. The changes are benchmarked against the 50th percentile of the peer group defined in the 2025 compensation study [3].",
    sources: [
      { index: 1, title: "Compensation Committee Report — Q1 2026", book: "Board Book Q1 2026", page: "12" },
      { index: 2, title: "Director Compensation Schedule 2026", book: "Board Book Q1 2026", page: "15" },
      { index: 3, title: "2025 Director Compensation Peer Benchmarking Study", book: "Board Book Q1 2026", page: "3" },
    ],
    timestamp: "09:14 AM",
  },
  {
    id: "c-3", role: "user",
    content: "When does this take effect?",
    timestamp: "09:21 AM",
  },
  {
    id: "c-4", role: "ai",
    content: "Pending board approval at the Q1 2026 meeting, the new structure would apply to the service year beginning at the 2026 Annual Meeting [1]. Equity grants would be issued on the first trading day following the meeting [2].",
    sources: [
      { index: 1, title: "Compensation Committee Report — Q1 2026", book: "Board Book Q1 2026", page: "13" },
      { index: 2, title: "Director Compensation Schedule 2026", book: "Board Book Q1 2026", page: "16" },
    ],
    timestamp: "09:21 AM",
  },
];

// ── Thread 2: Audit committee minutes — Q4 2025 risks ────────────────────────
const AUDIT_RISKS_MESSAGES: ChatMessage[] = [
  {
    id: "a-1", role: "user",
    content: "What were the top risks discussed in the Q4 2025 Audit Committee meeting?",
    timestamp: "02:05 PM",
  },
  {
    id: "a-2", role: "ai",
    content: "The Q4 2025 Audit Committee identified four priority risks [1]: (1) third-party vendor cybersecurity exposure following the November SaaS incident, (2) revenue recognition complexity tied to the new multi-year service contracts [2], (3) FX volatility impact on EMEA reporting [1], and (4) internal control gaps flagged in the SOX walkthrough for the new Warsaw entity [3].",
    sources: [
      { index: 1, title: "Audit Committee Minutes — Q4 2025", book: "Board Book Q4 2025", page: "2" },
      { index: 2, title: "Revenue Recognition Policy Update", book: "Board Book Q4 2025", page: "8" },
      { index: 3, title: "SOX Walkthrough — Warsaw Entity", book: "Board Book Q4 2025", page: "4" },
    ],
    timestamp: "02:05 PM",
  },
  {
    id: "a-3", role: "user",
    content: "Any management response on the SOX gaps?",
    timestamp: "02:12 PM",
  },
  {
    id: "a-4", role: "ai",
    content: "Management committed to remediation by end of Q2 2026, including hiring a dedicated controls analyst in Warsaw and quarterly walkthrough reviews led by Internal Audit [1]. The committee requested a status update at each meeting until closure [2].",
    sources: [
      { index: 1, title: "Management Response — SOX Remediation Plan", book: "Board Book Q4 2025", page: "6" },
      { index: 2, title: "Audit Committee Minutes — Q4 2025", book: "Board Book Q4 2025", page: "3" },
    ],
    timestamp: "02:12 PM",
  },
];

// ── Thread 3: ESG disclosure trends across last 4 meetings ───────────────────
const ESG_MESSAGES: ChatMessage[] = [
  {
    id: "e-1", role: "user",
    content: "How has ESG disclosure evolved over our last four board meetings?",
    timestamp: "10:45 AM",
  },
  {
    id: "e-2", role: "ai",
    content: "ESG disclosure scope has expanded meeting-over-meeting [1]. Q1 2025 focused on Scope 1 and 2 emissions baselining [2]; Q2 2025 added Scope 3 supplier data and the first TCFD-aligned climate risk narrative [1]; Q3 2025 introduced board-level oversight language and a refreshed materiality assessment [3]; Q4 2025 expanded human capital metrics and previewed CSRD readiness for EU operations [4].",
    sources: [
      { index: 1, title: "ESG & Sustainability Update — Q4 2025", book: "Board Book Q4 2025", page: "22" },
      { index: 2, title: "ESG Baseline Report — Q1 2025", book: "Board Book Q1 2025", page: "18" },
      { index: 3, title: "Materiality Assessment — Q3 2025", book: "Board Book Q3 2025", page: "11" },
      { index: 4, title: "CSRD Readiness Overview — Q4 2025", book: "Board Book Q4 2025", page: "25" },
    ],
    timestamp: "10:45 AM",
  },
  {
    id: "e-3", role: "user",
    content: "What's outstanding for 2026?",
    timestamp: "10:52 AM",
  },
  {
    id: "e-4", role: "ai",
    content: "Two items remain open [1]: finalizing CSRD double-materiality assessment by Q2 2026 and aligning the sustainability report assurance scope with the auditor's limited-assurance engagement letter [2].",
    sources: [
      { index: 1, title: "ESG Action Log — Q4 2025", book: "Board Book Q4 2025", page: "27" },
      { index: 2, title: "Auditor Engagement Letter — 2026", book: "Board Book Q4 2025", page: "31" },
    ],
    timestamp: "10:52 AM",
  },
];

// ── Thread 4: Cybersecurity resolution status ─────────────────────────────────
const CYBER_MESSAGES: ChatMessage[] = [
  {
    id: "cy-1", role: "user",
    content: "What's the status of the cybersecurity oversight resolution passed in Q3?",
    timestamp: "03:30 PM",
  },
  {
    id: "cy-2", role: "ai",
    content: "The Q3 2025 resolution established quarterly CISO reporting to the Risk Committee and required a third-party penetration test annually [1]. As of the Q4 update, the CISO reporting cadence is in place and the first pen test (conducted by Mandiant in October) is complete with findings tracked in the management response register [2]. Two high-severity findings remain open with target closure in Q1 2026 [3].",
    sources: [
      { index: 1, title: "Cybersecurity Oversight Resolution — Q3 2025", book: "Board Book Q3 2025", page: "1" },
      { index: 2, title: "CISO Quarterly Report — Q4 2025", book: "Board Book Q4 2025", page: "9" },
      { index: 3, title: "Penetration Test Findings — October 2025", book: "Board Book Q4 2025", page: "11" },
    ],
    timestamp: "03:30 PM",
  },
];

// ── Thread 5: CEO succession discussion history ───────────────────────────────
const SUCCESSION_MESSAGES: ChatMessage[] = [
  {
    id: "s-1", role: "user",
    content: "Walk me through how CEO succession planning has been discussed this year.",
    timestamp: "11:00 AM",
  },
  {
    id: "s-2", role: "ai",
    content: "The Nominating & Governance Committee reviewed succession at three meetings in 2025 [1]. In Q1, the committee refreshed the emergency succession protocol and named two interim candidates [2]. In Q2, long-term internal candidates were assessed against the updated CEO competency model [1]. In Q4, the committee reviewed external benchmarking and approved a development plan for the two leading internal candidates, including expanded board exposure in 2026 [3].",
    sources: [
      { index: 1, title: "N&G Committee Minutes — 2025 Summary", book: "Board Book Q4 2025", page: "33" },
      { index: 2, title: "Emergency Succession Protocol — Updated Q1 2025", book: "Board Book Q1 2025", page: "7" },
      { index: 3, title: "CEO Succession Benchmarking Report — Q4 2025", book: "Board Book Q4 2025", page: "36" },
    ],
    timestamp: "11:00 AM",
  },
  {
    id: "s-3", role: "user",
    content: "Is the emergency protocol documented?",
    timestamp: "11:08 AM",
  },
  {
    id: "s-4", role: "ai",
    content: "Yes — the emergency succession protocol is maintained in the Resource Center under Governance Policies, last updated September 2025 [1]. It names the interim CEO designee, decision authority during transition, and the 72-hour board notification requirement [2].",
    sources: [
      { index: 1, title: "Emergency Succession Protocol — Updated Q1 2025", book: "Board Book Q1 2025", page: "7" },
      { index: 2, title: "Board Notification Policy", book: "Resource Center", page: "2" },
    ],
    timestamp: "11:08 AM",
  },
];

// ── Thread 6: Bylaws amendment redline questions ──────────────────────────────
const BYLAWS_MESSAGES: ChatMessage[] = [
  {
    id: "b-1", role: "user",
    content: "What's changing in the proposed bylaws amendment?",
    timestamp: "09:50 AM",
  },
  {
    id: "b-2", role: "ai",
    content: "The redline includes three substantive changes [1]: (1) lowering the special meeting shareholder threshold from 25% to 15%, (2) adding a universal proxy provision aligned with the SEC's 2022 rule [2], and (3) clarifying virtual-only meeting authority subject to state law [1]. Non-substantive cleanup includes gendered-language updates and section renumbering [3].",
    sources: [
      { index: 1, title: "Bylaws Amendment Redline — April 2026", book: "Board Book Q1 2026", page: "41" },
      { index: 2, title: "Universal Proxy Analysis — Outside Counsel Memo", book: "Board Book Q1 2026", page: "45" },
      { index: 3, title: "Bylaws Amendment Redline — April 2026", book: "Board Book Q1 2026", page: "42" },
    ],
    timestamp: "09:50 AM",
  },
  {
    id: "b-3", role: "user",
    content: "Does counsel flag any concerns?",
    timestamp: "09:57 AM",
  },
  {
    id: "b-4", role: "ai",
    content: "Outside counsel flagged one item for board discussion [1]: the 15% special meeting threshold is below the peer median (20%) and may attract activist attention. Counsel recommends pairing it with an advance notice bylaw refresh, which is included in the same amendment package [2].",
    sources: [
      { index: 1, title: "Universal Proxy Analysis — Outside Counsel Memo", book: "Board Book Q1 2026", page: "46" },
      { index: 2, title: "Advance Notice Bylaw Refresh — Redline", book: "Board Book Q1 2026", page: "49" },
    ],
    timestamp: "09:57 AM",
  },
];

// ── Thread 7: Related-party transaction approvals 2025 ────────────────────────
const RELATED_PARTY_MESSAGES: ChatMessage[] = [
  {
    id: "rp-1", role: "user",
    content: "List the related-party transactions approved in 2025.",
    timestamp: "02:30 PM",
  },
  {
    id: "rp-2", role: "ai",
    content: "Four related-party transactions were approved in 2025 [1]: (1) a $2.4M consulting agreement with a firm affiliated with Director Patel, reviewed and approved by independent directors in March [2]; (2) renewal of the office lease with an entity partially owned by the founder's family trust [1]; (3) a commercial supply agreement with a portfolio company of Director Chen's prior employer, approved with Director Chen recused [3]; and (4) a charitable contribution to a foundation chaired by the CEO's spouse, approved under the standing policy [4].",
    sources: [
      { index: 1, title: "Related-Party Transaction Register — 2025", book: "Board Book Q4 2025", page: "52" },
      { index: 2, title: "Board Minutes — March 2025", book: "Board Book Q1 2025", page: "3" },
      { index: 3, title: "Supply Agreement Approval — Q2 2025", book: "Board Book Q2 2025", page: "6" },
      { index: 4, title: "Charitable Contribution Policy", book: "Resource Center", page: "1" },
    ],
    timestamp: "02:30 PM",
  },
];

// ── Thread 8: Board evaluation survey themes ──────────────────────────────────
const BOARD_EVAL_MESSAGES: ChatMessage[] = [
  {
    id: "be-1", role: "user",
    content: "What were the main themes from the 2025 board evaluation?",
    timestamp: "10:10 AM",
  },
  {
    id: "be-2", role: "ai",
    content: "Three themes emerged from the 2025 evaluation [1]: (1) directors want deeper engagement on technology and AI strategy, with a request for an annual deep-dive session [2]; (2) committee workloads are uneven, with the Audit Committee viewed as overloaded relative to peers [1]; and (3) directors rated meeting materials highly but flagged that pre-reads arrive too close to meeting dates [3].",
    sources: [
      { index: 1, title: "2025 Board Evaluation Report", book: "Board Book Q4 2025", page: "58" },
      { index: 2, title: "AI Strategy Deep-Dive Request — Summary", book: "Board Book Q4 2025", page: "60" },
      { index: 3, title: "2025 Board Evaluation Report", book: "Board Book Q4 2025", page: "62" },
    ],
    timestamp: "10:10 AM",
  },
  {
    id: "be-3", role: "user",
    content: "Any actions committed?",
    timestamp: "10:17 AM",
  },
  {
    id: "be-4", role: "ai",
    content: "The Nominating & Governance Committee committed to three actions for 2026 [1]: scheduling an AI strategy deep-dive in Q2, reviewing committee composition and charter scope in Q1, and moving the pre-read distribution target from 5 to 8 business days before each meeting [2].",
    sources: [
      { index: 1, title: "N&G Committee Action Log — Q4 2025", book: "Board Book Q4 2025", page: "64" },
      { index: 2, title: "2025 Board Evaluation Report", book: "Board Book Q4 2025", page: "63" },
    ],
    timestamp: "10:17 AM",
  },
];

export const STATIC_CHAT_THREADS: ChatThread[] = [
  { id: "th-1", title: "Cybersecurity",                               createdAt: "2026-05-03T09:14:00+0200", updatedAt: "2026-05-03T09:21:00+0200", messages: COMPENSATION_MESSAGES, isProject: true },
  { id: "th-2", title: "Management of Third-Party Risk Discussions",  createdAt: "2026-05-02T14:05:00+0200", updatedAt: "2026-05-02T14:12:00+0200", messages: AUDIT_RISKS_MESSAGES },
  { id: "th-3", title: "Feedback from Recent Training Sessions",      createdAt: "2026-04-27T10:45:00+0200", updatedAt: "2026-04-27T10:52:00+0200", messages: ESG_MESSAGES },
  { id: "th-4", title: "Concerns Regarding Data Privacy Issues",      createdAt: "2026-04-26T15:30:00+0200", updatedAt: "2026-04-26T15:30:00+0200", messages: CYBER_MESSAGES },
  { id: "th-5", title: "Overview of Recent Regulatory Changes",       createdAt: "2026-04-20T11:00:00+0200", updatedAt: "2026-04-20T11:08:00+0200", messages: SUCCESSION_MESSAGES },
  { id: "th-6", title: "Bylaws amendment redline questions",          createdAt: "2026-04-13T09:50:00+0200", updatedAt: "2026-04-13T09:57:00+0200", messages: BYLAWS_MESSAGES },
  { id: "th-7", title: "Related-party transaction approvals 2025",   createdAt: "2026-04-04T14:30:00+0200", updatedAt: "2026-04-04T14:30:00+0200", messages: RELATED_PARTY_MESSAGES },
  { id: "th-8", title: "Board evaluation survey themes",             createdAt: "2026-04-03T10:10:00+0200", updatedAt: "2026-04-03T10:17:00+0200", messages: BOARD_EVAL_MESSAGES },
  // Cybersecurity project child threads (projectId: "th-1")
  { id: "th-cyber-1", title: "Incident Response Framework adoption status", createdAt: "2026-09-15T10:00:00+0200", updatedAt: "2026-09-15T10:00:00+0200", messages: [], projectId: "th-1" },
  { id: "th-cyber-2", title: "Q3 2026 cybersecurity metrics review",        createdAt: "2026-08-20T14:30:00+0200", updatedAt: "2026-08-20T14:30:00+0200", messages: [], projectId: "th-1" },
  { id: "th-cyber-3", title: "Third-party vendor security audits",           createdAt: "2026-07-08T09:15:00+0200", updatedAt: "2026-07-08T09:15:00+0200", messages: [], projectId: "th-1" },
  { id: "th-cyber-4", title: "Ransomware threat landscape briefing",         createdAt: "2026-06-14T11:45:00+0200", updatedAt: "2026-06-14T11:45:00+0200", messages: [], projectId: "th-1" },
  { id: "th-cyber-5", title: "Board cyber risk tolerance framework",         createdAt: "2026-05-22T16:00:00+0200", updatedAt: "2026-05-22T16:00:00+0200", messages: [], projectId: "th-1" },
  { id: "th-cyber-6", title: "Annual penetration test findings",             createdAt: "2026-04-10T09:30:00+0200", updatedAt: "2026-04-10T09:30:00+0200", messages: [], projectId: "th-1" },
  // Data privacy project child threads (projectId: "th-4")
  { id: "th-priv-1", title: "GDPR data breach notification timelines",      createdAt: "2026-09-10T09:00:00+0200", updatedAt: "2026-09-10T09:00:00+0200", messages: [], projectId: "th-4" },
  { id: "th-priv-2", title: "Data retention policy review",                 createdAt: "2026-08-18T14:00:00+0200", updatedAt: "2026-08-18T14:00:00+0200", messages: [], projectId: "th-4" },
  { id: "th-priv-3", title: "Privacy impact assessment — Q2 results",       createdAt: "2026-07-22T10:30:00+0200", updatedAt: "2026-07-22T10:30:00+0200", messages: [], projectId: "th-4" },
  { id: "th-priv-4", title: "Third-party data sharing agreements audit",    createdAt: "2026-06-05T11:00:00+0200", updatedAt: "2026-06-05T11:00:00+0200", messages: [], projectId: "th-4" },
  // Regulatory changes project child threads (projectId: "th-5")
  { id: "th-reg-1", title: "SEC climate disclosure rule analysis",           createdAt: "2026-09-08T09:30:00+0200", updatedAt: "2026-09-08T09:30:00+0200", messages: [], projectId: "th-5" },
  { id: "th-reg-2", title: "New ESG reporting standards — Q3 update",       createdAt: "2026-08-12T14:15:00+0200", updatedAt: "2026-08-12T14:15:00+0200", messages: [], projectId: "th-5" },
  { id: "th-reg-3", title: "Regulatory compliance calendar 2026–2027",      createdAt: "2026-07-01T10:00:00+0200", updatedAt: "2026-07-01T10:00:00+0200", messages: [], projectId: "th-5" },
  // Bylaws project child threads (projectId: "th-6")
  { id: "th-byl-1", title: "Shareholder voting procedure changes",           createdAt: "2026-09-02T10:00:00+0200", updatedAt: "2026-09-02T10:00:00+0200", messages: [], projectId: "th-6" },
  { id: "th-byl-2", title: "Amendment to executive compensation clause",    createdAt: "2026-08-05T14:30:00+0200", updatedAt: "2026-08-05T14:30:00+0200", messages: [], projectId: "th-6" },
  { id: "th-byl-3", title: "Director qualification requirements update",    createdAt: "2026-07-14T09:00:00+0200", updatedAt: "2026-07-14T09:00:00+0200", messages: [], projectId: "th-6" },
  // Related-party transactions project child threads (projectId: "th-7")
  { id: "th-rpt-1", title: "Q4 2025 related-party transaction log review",  createdAt: "2026-09-20T10:00:00+0200", updatedAt: "2026-09-20T10:00:00+0200", messages: [], projectId: "th-7" },
  { id: "th-rpt-2", title: "Independent director approval workflow",        createdAt: "2026-08-25T14:00:00+0200", updatedAt: "2026-08-25T14:00:00+0200", messages: [], projectId: "th-7" },
  { id: "th-rpt-3", title: "Conflict of interest disclosure checklist",     createdAt: "2026-07-30T11:15:00+0200", updatedAt: "2026-07-30T11:15:00+0200", messages: [], projectId: "th-7" },
];

// ─── Onboarding ───────────────────────────────────────────────────────────────

export const ONBOARDING_PROMPT = "What can you help me with?";

export const ONBOARDING_RICH_BLOCKS: RichBlock[] = [
  {
    type: "p",
    spans: ["I search across your organization's board materials in Boards Cloud — current books, archived books, and resource centre documents — and give you answers with citations back to the source."],
  },
  { type: "h", text: "Examples for what you can ask me to do:" },
  {
    type: "list",
    items: [
      "Find past decisions, resolutions, and policy approvals across meetings",
      "Trace how a topic has been discussed over time",
      "Compare information across documents or time periods",
      "Help prepare for upcoming meetings based on prior follow-ups and open items",
      "Search for specific terms, names, or references across your materials",
    ],
  },
  { type: "h", text: "How answers work:" },
  {
    type: "list",
    items: [
      "I answer based on the content of your documents — I read and search text, but I don't have access to Boards features like voting, approvals, or annotations.",
      "Every response includes inline citations, click to open the original document and page",
      "I maintain conversation context, so you can ask follow-ups without re-explaining",
      "If I can't find relevant information, I'll say so rather than guess",
    ],
  },
  { type: "h", text: "What I don't do:" },
  {
    type: "list",
    items: [
      "Access the internet or external systems",
      "Generate opinions, predictions, or speculative analysis",
      "Execute tasks or generate reports",
    ],
  },
  {
    type: "p",
    spans: ["Your queries are private — they're not shared with other users or used to train AI models, and I only search documents within your existing permissions."],
  },
];


export const ONBOARDING_RESPONSE_CONTENT = `I search across your organization's board materials in Boards Cloud — **current books, archived books, and resource centre documents** — and give you answers with citations back to the source.

**Examples for what you can ask me to do:**
- Find past decisions, resolutions, and policy approvals across meetings
- Trace how a topic has been discussed over time
- Compare information across documents or time periods
- Help prepare for upcoming meetings based on prior follow-ups and open items
- Search for specific terms, names, or references across your materials

**How answers work:**
- I answer based on the content of your documents — I read and search text, but I don't have access to Boards features like voting, approvals, or annotations.
- Every response includes inline citations, click to open the original document and page
- I maintain conversation context, so you can ask follow-ups without re-explaining
- If I can't find relevant information, I'll say so rather than guess

**What I don't do:**
- Access the internet or external systems
- Generate opinions, predictions, or speculative analysis
- Execute tasks or generate reports

Your queries are private — they're not shared with other users or used to train AI models, and I only search documents within your existing permissions.`;

// ─── Context chips ────────────────────────────────────────────────────────────

export const CONTEXT_CHIPS = ["Board meeting Q4 2025", "Minutes"];

// ─── Grounded-state trigger responses (Board Book Q4 2025 demo) ───────────────

export interface TriggerResponse {
  threadTitle: string;
  sources: ChatMessage["sources"];
  richContent: RichBlock[];
}

function normaliseQuery(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/\s+/g, " ")
    .replace(/[?.]+$/, "");
}

const TRIGGER_MAP: Record<string, TriggerResponse> = {
  "summarize the board's cybersecurity discussions from 2022 to 2025": {
    threadTitle: "Cybersecurity discussions 2022–2025",
    sources: [
      { index: 1, title: "Risk Committee Report — Q2 2023",    book: "Board Book Q4 2025", page: "4" },
      { index: 2, title: "Board Minutes — November 2024",       book: "Board Book Q4 2025", page: "5" },
      { index: 3, title: "Audit Committee Minutes — Q1 2025",  book: "Board Book Q4 2025", page: "3" },
    ],
    richContent: [
      {
        type: "p",
        spans: [
          "I found cybersecurity discussions from Q2 2023 onward, but nothing from 2022 in your board materials. The summary below covers 2023 to 2025.",
        ],
      },
      {
        type: "p",
        spans: [
          "The board first recorded cybersecurity as a standing risk item in the Q2 2023 Risk Committee report, after a third-party penetration test. ",
          { cite: 1 },
          " Through 2024, discussion focused on vendor access controls and the rollout of multi-factor authentication across board systems. ",
          { cite: 2 },
          " The most recent update, in the Q1 2025 Audit Committee minutes, noted that all high-severity findings from the 2024 review were remediated. ",
          { cite: 3 },
        ],
      },
      { type: "p", spans: ["AI-generated content may have inaccuracies."] },
    ],
  },

  "what is the board's policy on cryptocurrency investments": {
    threadTitle: "Cryptocurrency investment policy",
    sources: [],
    richContent: [
      {
        type: "p",
        spans: [
          "I couldn't find information about cryptocurrency investments in your board materials. To refine your search, narrow it to a specific book or time period, or rephrase your question.",
        ],
      },
    ],
  },

  "what is the board's regulatory filing deadline for the annual report": {
    threadTitle: "Annual report filing deadline",
    sources: [
      { index: 1, title: "Board Minutes — March 2025",           book: "Board Book Q4 2025", page: "2" },
      { index: 2, title: "Governance Committee Pack — Q2 2025", book: "Board Book Q4 2025", page: "7" },
    ],
    richContent: [
      {
        type: "p",
        spans: [
          "Your materials give two different dates for the annual report filing deadline, and I can't determine which is current:",
        ],
      },
      {
        type: "list",
        items: [
          [
            "The March 2025 board minutes record the deadline as 30 April 2025. ",
            { cite: 1 } as Cite,
          ],
          [
            "The Q2 2025 Governance Committee pack lists it as 15 May 2025. ",
            { cite: 2 } as Cite,
          ],
        ],
      },
      {
        type: "p",
        spans: ["This touches a statutory filing. To confirm the binding date, check with your board secretary."],
      },
      { type: "p", spans: ["AI-generated content may have inaccuracies."] },
    ],
  },

  "draft a marketing email announcing our new product launch": {
    threadTitle: "Out-of-scope request",
    sources: [],
    richContent: [
      {
        type: "p",
        spans: [
          "Ask GovernAI is built for governance work — your board materials, committee decisions, regulatory context, and meeting preparation. Drafting product marketing sits outside that. If you're preparing board communications about the launch, I can help you find what your materials say about it.",
        ],
      },
    ],
  },

  "what is ebitda": {
    threadTitle: "EBITDA definition",
    sources: [],
    richContent: [
      {
        type: "p",
        spans: [
          "EBITDA is earnings before interest, taxes, depreciation, and amortization — a measure of operating profitability before those items are deducted.",
        ],
      },
      {
        type: "p",
        spans: ["General knowledge — not from your board materials."],
      },
      {
        type: "p",
        spans: ["Want me to search your materials for how EBITDA appears in your board's financial reporting?"],
      },
    ],
  },
};

export function matchTriggerResponse(text: string): TriggerResponse | null {
  return TRIGGER_MAP[normaliseQuery(text)] ?? null;
}
