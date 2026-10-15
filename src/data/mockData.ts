export interface Book {
  id: string;
  title: string;
  company: string;
  date: string;
  committee: string;
  status: "Current" | "Archived";
  documentCount: number;
  pages: number;
}

export interface Source {
  index: number;
  title: string;
  book?: string;
  /** Display label for the page (e.g. "5", "iv"). Shown in tooltips. */
  page?: string;
  documentId?: import("./documents.js").DocumentId;
  /** Page number to open in the document viewer when this cite is clicked. 1 = cover. */
  targetPage?: number;
  /** Product module the source comes from. Set only by the AGAI integration use cases demo. */
  module?: "Books" | "Task Hub" | "Decision Hub" | "Data Room" | "Resource Center";
  /** AGAI integration use cases demo: the "/ Data" part of the module source chip. A document name
   *  (Data Room, Decision Hub), a book name (agenda and minutes), or a task name. */
  chipData?: string;
  /** AGAI integration use cases demo: page in the product where this information lives (task, approval,
   *  data room file). Opens in a new browser tab. Books sources use the book reader. */
  deepLink?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  richContent?: import("./hybrid-search.constants.js").RichBlock[];
  sources?: Source[];
  timestamp: string;
  /** AGAI integration use cases demo only: which scripted step (0-based) produced this answer. */
  demoStep?: number;
}

export interface InsightCard {
  id: "summary" | "prep" | "risk";
  label: string;
  description: string;
  icon: string;
}

// ─── Books ───────────────────────────────────────────────────────────────────

export const books: Book[] = [
  {
    id: "1",
    title: "Q2 2026 Board Package",
    company: "Meridian Capital Group",
    date: "Jun 12, 2026",
    committee: "Full Board",
    status: "Current",
    documentCount: 14,
    pages: 187,
  },
  {
    id: "2",
    title: "Audit Committee — June 2026",
    company: "Meridian Capital Group",
    date: "Jun 5, 2026",
    committee: "Audit Committee",
    status: "Current",
    documentCount: 8,
    pages: 94,
  },
  {
    id: "3",
    title: "Risk & Compliance Review",
    company: "Meridian Capital Group",
    date: "May 22, 2026",
    committee: "Risk Committee",
    status: "Current",
    documentCount: 6,
    pages: 62,
  },
  {
    id: "4",
    title: "Q1 2026 Board Package",
    company: "Meridian Capital Group",
    date: "Mar 14, 2026",
    committee: "Full Board",
    status: "Archived",
    documentCount: 12,
    pages: 164,
  },
];

// ─── Mock chat conversation ───────────────────────────────────────────────────
// Variant 0 of the hybrid-search conversation chain (admin side).
// Full variant set lives in hybrid-search.constants.ts.

export const mockChatMessages: ChatMessage[] = [
  {
    id: "1",
    role: "user",
    content: "When was [initiative / policy] formally approved?",
    timestamp: "10:24 AM",
  },
  {
    id: "2",
    role: "ai",
    content:
      "At the most recent board meeting on December 10, 2025, the Board formally approved the following items:\n\n## 1. Approval of prior board meeting minutes\n\nThe Board approved the minutes from the September 18, 2025 board meeting as presented, confirming the official record of discussions and decisions. [1, page 1]\n\n**Actions / follow-ups:**\nNo follow-up actions were recorded.\n\n## 2. FY2026 operating plan and budget\n\nThe Board approved management's proposed FY2026 operating plan and consolidated budget, including planned investments in product development, headcount growth, and international expansion. [1, page 2] [2, page 3]\n\n**Actions / follow-ups:**\nManagement to circulate the final approved budget deck and provide quarterly variance reporting beginning Q1 2026. [1, page 3]\n\n## 3. Cybersecurity: Incident Response Framework\n\nThe Board approved the updated Incident Response Framework, establishing formal escalation thresholds, board notification triggers, and defined roles and responsibilities for handling cybersecurity incidents between board meetings. [1, page 1] [3, page 1]\n\n**Actions / follow-ups:**\nManagement to finalize and publish the framework internally and schedule a tabletop incident response exercise in early 2026. [1, page 2]",
    sources: [
      { index: 1, title: "Minutes, Board meeting Q4 2025" },
      { index: 2, title: "Resolution – Approval of Incident Response Framework, Board meeting Q4 2025" },
      { index: 3, title: "Risk & Cybersecurity Update" },
    ],
    timestamp: "10:24 AM",
  },
];

// ─── Smart Summary content ────────────────────────────────────────────────────

export const smartSummaryText = `The Q2 2026 Board Package covers Meridian Capital Group's performance across the April–June quarter. Revenue grew 8.3% year-on-year to $1.24B, driven by strong performance in the Asset Management and Advisory divisions. Operating margin improved to 22.1% from 19.6% in Q2 2025.

Key strategic priorities for H2 include completion of the core banking platform migration (currently 67% complete), expansion into Southeast Asian markets through the proposed Singapore joint venture, and integration of the recently acquired ESG analytics firm, ClearPath Data.

The Risk Committee has flagged elevated cyber threat exposure following a sector-wide advisory, and is recommending an incremental $3.2M investment in endpoint security controls.`;

// ─── Smart Summary (structured) ───────────────────────────────────────────────

export interface SummaryParagraph {
  /** Optional inline label rendered bold above the paragraph (e.g. "Topic"). */
  label?: string;
  text: string;
}

export interface SummaryCard {
  /** Card title (e.g. "Financial reports"). */
  title: string;
  paragraphs: SummaryParagraph[];
}

export interface SummarySection {
  /** Section header (e.g. "Executive Summary"). */
  title: string;
  cards: SummaryCard[];
  /** If true, render a "Show more" toggle for this section. */
  collapsible?: boolean;
}

/**
 * Common section names — Executive Summary collapses them into a single card
 * with brief paragraphs, Detailed Summary expands each section into its own card.
 */
const SUMMARY_SECTIONS = [
  "Financial performance",
  "Strategic priorities",
  "Risk and compliance",
  "Outlook and five-year forecast",
] as const;

/** Sources cited by Smart Summary's Detailed Summary paragraphs. One entry per
 *  unique (document, page) — citations that resolved to the same page have been
 *  collapsed so a given page is never cited twice. */
export const smartSummarySources: Source[] = [
  { index: 1,  title: "Q2 2026 Consolidated Financial Statements", page: "2",        documentId: "fin-statements-q2-2026", targetPage: 2 },
  { index: 2,  title: "CFO Commentary — Q2 2026", page: "2",                         documentId: "cfo-commentary-q2-2026", targetPage: 2 },
  { index: 3,  title: "Segment Reporting Appendix — Q2 2026", page: "2",             documentId: "segment-report-q2-2026", targetPage: 2 },
  { index: 4,  title: "Q2 2026 Board Pack — Risk & Compliance Update", page: "2",    documentId: "risk-compliance-q2-2026", targetPage: 2 },
  { index: 5,  title: "Capital Plan and Buyback Proposal — Q3 2026", page: "1",      documentId: "capital-plan-q3-2026", targetPage: 1 },
  { index: 6,  title: "Capital Plan and Buyback Proposal — Q3 2026", page: "2",      documentId: "capital-plan-q3-2026", targetPage: 2 },
  { index: 7,  title: "Singapore JV — Term Sheet Memo", page: "2",                   documentId: "singapore-jv-memo", targetPage: 2 },
  { index: 8,  title: "Core Banking Migration — Steering Committee Update", page: "2", documentId: "core-banking-migration", targetPage: 2 },
  { index: 9,  title: "Audit Committee Report — June 2026", page: "2",               documentId: "audit-committee-jun-2026", targetPage: 2 },
  { index: 10, title: "ClearPath Integration — Day-100 Review", page: "2",           documentId: "clearpath-day-100", targetPage: 2 },
  { index: 11, title: "Cybersecurity Quarterly Update — Q2 2026", page: "2",         documentId: "cyber-quarterly-q2-2026", targetPage: 2 },
  { index: 12, title: "Five-Year Plan Refresh — June 2026", page: "2",               documentId: "five-year-plan-jun-2026", targetPage: 2 },
];

export const smartSummarySections: SummarySection[] = [
  {
    title: "Executive Summary",
    collapsible: true,
    cards: [
      {
        title: "Q2 2026 at a glance",
        paragraphs: [
          {
            label: SUMMARY_SECTIONS[0],
            text: "Revenue grew 8.3% YoY to $1.24B (plan: $1.18–$1.22B). Operating margin improved 250 bps to 22.1%; adjusted EPS of $1.84 beat consensus by $0.13. CET1 held at 13.2% and the Board is asked to approve a Q3 buyback tranche of up to $200M.",
          },
          {
            label: SUMMARY_SECTIONS[1],
            text: "Singapore JV with Orion Partners on track for early-August signing ($180M committed, 60/40). Core banking migration is 67% complete with cut-over scheduled for October 17. ClearPath integration cost synergies tracking ahead of plan.",
          },
          {
            label: SUMMARY_SECTIONS[2],
            text: "Incremental $3.2M cyber spend approved post FS-ISAC advisory. Office CRE concentration down to 3.4% of loans with two single-name watchlist migrations and $11M of specific reserves. The OCC third-party review closed with two MRAs, both with accepted remediation plans.",
          },
          {
            label: SUMMARY_SECTIONS[3],
            text: "FY26 guidance raised: revenue $4.85–$4.95B, adjusted EPS $7.20–$7.35. Five-year plan targets 7.5–8.5% revenue CAGR, 15–17% ROTE, and CET1 sustained in the 12.5–13.5% range, with approximately $4.2B of capital returned to shareholders over the period.",
          },
        ],
      },
    ],
  },
  {
    title: "Detailed Summary",
    cards: [
      {
        title: SUMMARY_SECTIONS[0],
        paragraphs: [
          {
            label: "Revenue and earnings",
            text: "Group revenue of $1.24B (+8.3% YoY) outpaced guidance of $1.18–$1.22B. [1] Net interest income rose 4.1% on higher average earning assets, partially offset by a 6-bp compression in net interest margin to 2.74%. [2] Non-interest income grew 12.6%, driven by 18.4% growth in Asset Management fees and 9.2% in Advisory. [3] Adjusted EPS of $1.84 beat consensus of $1.71.",
          },
          {
            label: "Expense and credit",
            text: "Operating expenses increased 3.2% YoY to $766M, well below revenue growth. [1] The efficiency ratio improved to 61.6% from 64.6%. [2] The provision for credit losses was $54M, up modestly from $48M in Q1 reflecting a small build in CRE reserves; net charge-offs remained benign at 18 bps annualized. [4]",
          },
          {
            label: "Segment view",
            text: "Asset Management revenue of $342M (+11.8%) on $42B in net new assets. [3] Advisory revenue of $198M (+14.2%) led by record M&A advisory fees in EMEA. Markets revenue of $264M (–4.1%) on softer FX and rates volumes, while Wealth Management revenue of $268M (+9.7%) reflected continued client inflows.",
          },
          {
            label: "Capital and liquidity",
            text: "CET1 ratio held steady at 13.2%, well above the 11.0% regulatory floor. [5] Liquidity coverage ratio improved to 142% on the back of $1.8B in new term deposits from the wealth segment. [2] The Board is asked to approve the Q3 share repurchase tranche of up to $200M. [6]",
          },
        ],
      },
      {
        title: SUMMARY_SECTIONS[1],
        paragraphs: [
          {
            label: "Singapore JV with Orion Partners",
            text: "Definitive agreements are tracking for signing in early August. [7] Initial committed capital is $180M (60/40 Meridian/Orion), and the operating model leverages Orion's MAS licence on day one while consolidating into Meridian's reporting stack. First client mandates are projected to close in Q1 2027 with a target run-rate AUM of $4B by year-end 2027.",
          },
          {
            label: "Core banking migration",
            text: "Migration is 67% complete and on plan to finish by Q4 2026. [8] Cut-over for retail deposits is scheduled for the weekend of October 17, with contingency budget held at $4.8M and no material reforecast expected. Independent assurance for the cut-over has been engaged for a pre-event readiness review in late August. [9]",
          },
          {
            label: "ClearPath integration",
            text: "Day-100 milestones were met and cost synergies of $6M are tracking ahead of plan. [10] Cross-sell into existing institutional accounts has produced 14 signed mandates representing $310M in expected new AUM. Talent retention through Q2 stands at 94%, above the 90% deal-model assumption.",
          },
        ],
      },
      {
        title: SUMMARY_SECTIONS[2],
        paragraphs: [
          {
            label: "Cyber and operational risk",
            text: "Following the sector-wide FS-ISAC advisory in May, the Risk Committee endorsed an incremental $3.2M investment in endpoint detection and identity controls. [11] Phishing simulation click-through dropped to 4.1% from 6.8% the prior quarter, and no material operational losses were reported in the quarter.",
          },
          {
            label: "Credit portfolio",
            text: "The CRE office portfolio (3.4% of total loans) is being actively re-underwritten; weighted-average LTV stands at 58% with an interest coverage ratio of 1.84x. [4] Two single-name relationships moved to watchlist this quarter, with specific reserves of $11M established. Run-off of $260M YoY was achieved primarily through scheduled maturities and selected secondary sales. [3]",
          },
          {
            label: "Regulatory engagement",
            text: "The OCC horizontal review on third-party risk management closed with two matters requiring attention, both with remediation plans accepted by the regulator. [9] Independent validation by Internal Audit is scheduled for Q3 2026, with a follow-up walkthrough with the OCC team in Q4. No new enforcement actions were recorded in the quarter. [4]",
          },
        ],
      },
      {
        title: SUMMARY_SECTIONS[3],
        paragraphs: [
          {
            label: "FY26 reforecast",
            text: "Management is raising full-year revenue guidance to $4.85–$4.95B (from $4.75–$4.85B) and adjusted EPS to $7.20–$7.35 (from $6.95–$7.10). [2] Expense growth guidance is held at 3.0–4.0%, preserving incremental investment capacity in technology and Asia.",
          },
          {
            label: "Five-year plan",
            text: "Management's updated five-year plan targets a revenue CAGR of 7.5–8.5%, adjusted ROTE of 15–17%, and a CET1 ratio sustained in the 12.5–13.5% range. [12] Total capital returned to shareholders over the period is modeled at $4.2B through a combination of dividends and buybacks, subject to stress-test results.",
          },
          {
            label: "Sensitivities",
            text: "Each 25 bps parallel decline in rates is estimated to reduce NII by approximately $38M annualized. [2] A 100-bp widening in IG credit spreads reduces non-interest income by an estimated $14M, and the plan assumes US real GDP growth of 1.5–2.0% across the planning horizon. [12]",
          },
        ],
      },
    ],
  },
];

// ─── Smart Prep (structured) ──────────────────────────────────────────────────

export interface PrepInsight {
  /** Auto-numbered position (1-based) used for the card heading. */
  number: number;
  title: string;
  rationale: string;
  inference: string;
  discussionTopics: string[];
  suggestedQuestions: string[];
}

/** Sources cited by Smart Prep rationale paragraphs. */
export const smartPrepSources: Source[] = [
  { index: 1, title: "CFO Commentary — Q2 2026", page: "2",                       documentId: "cfo-commentary-q2-2026", targetPage: 2 },
  { index: 2, title: "Q2 2026 Board Pack — Strategic Plan Refresh", page: "2",     documentId: "strategic-plan-refresh", targetPage: 2 },
  { index: 3, title: "Q2 2026 Board Pack — Risk & Compliance Update", page: "2",   documentId: "risk-compliance-q2-2026", targetPage: 2 },
  { index: 4, title: "Cybersecurity Quarterly Update — Q2 2026", page: "2",        documentId: "cyber-quarterly-q2-2026", targetPage: 2 },
  { index: 5, title: "Singapore JV — Term Sheet Memo", page: "2",                  documentId: "singapore-jv-memo", targetPage: 2 },
  { index: 6, title: "Capital Plan and Buyback Proposal — Q3 2026", page: "1",     documentId: "capital-plan-q3-2026", targetPage: 1 },
];

export const smartPrepInsights: PrepInsight[] = [
  {
    number: 1,
    title: "Net Interest Margin Compression Amid Rising Funding Costs",
    rationale:
      "NIM compressed 6 bps quarter-over-quarter to 2.74% as competitive deposit pricing in the wealth segment outpaced the benefit of higher reinvestment yields on the securities portfolio. [1] Term deposit balances grew 14% sequentially, and the weighted-average rate paid on new wealth-segment deposits stepped up from 4.32% to 4.58%. [1] Management notes that even a modest delay in the expected late-2026 Fed easing path would extend the pressure on NIM into early 2027. [2]",
    inference:
      "If funding-cost pressure persists, the FY26 NII guide of $2.55–$2.65B is achievable only by holding loan growth to the higher end of the 4–6% range and rotating ~$1.2B of cash into 2–3 year duration securities at current spreads. Failure to act would push reported NIM toward the 2.65% floor, putting roughly $45–60M of NII at risk and creating downside pressure on FY27 plan targets.",
    discussionTopics: [
      "Pace and size of the proposed $1.2B securities portfolio rotation, and the appetite for taking on incremental duration in a still-volatile rates environment",
      "Whether deposit pricing discipline can be tightened in the wealth segment without elevating attrition above the 4.5% annualized threshold",
      "Sensitivity of the FY27 plan to alternative rate paths, including a no-cut scenario through mid-2027",
      "Adequacy of current hedging programs and whether expanded use of pay-fixed swaps is warranted",
    ],
    suggestedQuestions: [
      "How confident is management in the assumed second-half deposit beta of 38%, and what evidence supports it?",
      "What is the marginal cost of new wealth deposits today versus the marginal reinvestment yield, and how does that gap close under the base case?",
      "Have we stress-tested NIM and earnings under a no-cut and a one-cut rate path through 2027?",
      "What is the trigger that would cause management to revisit guidance on NII or full-year operating leverage?",
    ],
  },
  {
    number: 2,
    title: "Singapore JV With Orion Partners — Execution and Governance",
    rationale:
      "The proposed JV with Orion Partners targets a $4B AUM run-rate by year-end 2027, with $180M of initial committed capital split 60/40 between Meridian and Orion. [5] Day-one mandates from three anchor clients are documented in the deal memo, and the operating model leverages Orion's MAS licence while consolidating into Meridian's reporting stack. [5] The transaction is the first material non-US footprint expansion since 2019 and sets a template for subsequent Asia builds. [2]",
    inference:
      "If execution lands at plan, the JV adds approximately 60 bps to group ROTE by 2028 and diversifies revenue away from the US dollar. However, governance risk is elevated: Orion brings a different control culture, and the JV will operate under MAS oversight, which has been increasingly active on outsourcing and operational resilience. A weak start would damage relationships with anchor clients and complicate broader Asia plans.",
    discussionTopics: [
      "Board representation, reserved-matter rights, and the exit / buy-out mechanics in the shareholders' agreement",
      "How the JV's risk and compliance functions will be staffed and supervised, given the dual reporting into Orion and Meridian",
      "Capital deployment cadence and the threshold conditions for any additional commitment beyond the initial $180M",
      "Reputational protection if anchor clients underperform commercial expectations in the first 18 months",
    ],
    suggestedQuestions: [
      "Who owns the relationship with MAS on day one, and how is that handover staged?",
      "What is our walk-away point in the negotiation, and which terms are non-negotiable?",
      "How is the JV's risk appetite reconciled with the group's, particularly on counterparty concentration?",
      "What does success look like at the 12-month review, and what conditions would trigger an early reassessment?",
    ],
  },
  {
    number: 3,
    title: "CRE Office Exposure and Watchlist Migration",
    rationale:
      "Office CRE represents 3.4% of total loans ($1.42B), down from 4.1% a year ago following $260M in active reductions. [3] Weighted-average LTV is 58% and interest coverage is 1.84x, but two single-name relationships were migrated to watchlist this quarter, with specific reserves of $11M established. [3] National sublease availability in target markets is at multi-year highs, and the proposed FY27 plan assumes a further 50 bp deterioration in office NOI. [2]",
    inference:
      "Reserves remain prudent against the modeled base case, but the tail risk in 2027 deserves scrutiny. A 100-bp NOI deterioration combined with a 50-bp cap-rate widening would push 9% of the office book into LTV >75%, implying potential additional reserves of $35–50M. The Board should validate that the planned pace of run-off ($150–200M annually) is fast enough.",
    discussionTopics: [
      "Concentration thresholds: whether the existing single-name and metro-level limits remain calibrated to current market conditions",
      "Whether to accelerate run-off via secondary sales, accepting a small mark-to-market loss in exchange for capital relief",
      "Adequacy of independent collateral reappraisal frequency for office assets over $25M",
      "Disclosure posture in the Q3 earnings release given investor scrutiny of regional and super-regional CRE books",
    ],
    suggestedQuestions: [
      "What is the loss-given-default assumption in our reserves model, and how does it compare to recent comparable transactions?",
      "Are there any concentration positions where we are now the sole or anchor lender, and how does that change recovery dynamics?",
      "How would a forced 12-month run-off impact capital ratios and earnings?",
      "Is there a credible path to exiting the bottom-quartile of the office book by end of 2027?",
    ],
  },
  {
    number: 4,
    title: "Cyber Resilience and the Third-Party Threat Surface",
    rationale:
      "The May FS-ISAC advisory flagged a sustained increase in identity-based attacks targeting financial services vendors. [4] Meridian's third-party population includes 312 active suppliers, of which 28 are classed as critical. [4] The Risk Committee endorsed $3.2M of incremental investment in endpoint detection and identity controls, and phishing-simulation click-through dropped from 6.8% to 4.1%. [4] The OCC horizontal review on third-party risk management closed with two MRAs accepted. [3]",
    inference:
      "Meridian's first-party posture is materially improved, but the third-party surface remains the most likely vector for a reportable incident. A single critical-vendor compromise could trigger multi-day operational impact, regulatory notification timelines as short as 36 hours, and material reputational damage even where direct financial loss is contained.",
    discussionTopics: [
      "Frequency and rigor of tabletop exercises that explicitly model a critical-vendor compromise scenario",
      "Whether to enforce phishing-resistant MFA (e.g. FIDO2 / passkeys) for all privileged access by Q4 2026",
      "Concentration risk in vendors that are themselves used by peer institutions, creating systemic exposure",
      "Adequacy of cyber insurance limits given the increased frequency and severity of identity-based attacks",
    ],
    suggestedQuestions: [
      "What is our mean-time-to-detect (MTTD) and mean-time-to-contain (MTTC) for identity-based incidents, and how do those compare against peers?",
      "For our 28 critical vendors, do we have alternate-provider plans tested within the last 12 months?",
      "How does the Board want to be notified of a material cyber event between meetings, and within what time?",
      "Are there areas where additional spend would materially shift the risk profile, and what is the marginal return?",
    ],
  },
  {
    number: 5,
    title: "Capital Return and the Q3 Repurchase Authorization",
    rationale:
      "Management is requesting authorization for a Q3 share repurchase tranche of up to $200M. [6] CET1 stands at 13.2%, comfortably above the 11.0% regulatory floor and the 11.5–12.0% internal operating range. [1] The most recent CCAR-equivalent internal stress test produced a minimum CET1 of 10.4%, and the SLR remains at 5.7%. [6] Year-to-date payout (dividends plus buybacks) is at 56% of net income. [1]",
    inference:
      "The proposed authorization is consistent with the medium-term payout target of 60–70% and preserves comfortable headroom against the internal operating range. The principal trade-off is preserving optionality for opportunistic M&A in Asia and selected wealth tuck-ins, where pipeline visibility has improved since the last review.",
    discussionTopics: [
      "Sizing of the Q3 tranche relative to embedded M&A optionality, particularly any Asia opportunities flagged by the corporate development team",
      "Pace and execution mechanism (10b5-1 vs. ASR vs. discretionary) given current trading-volume profile",
      "Sensitivity of buyback capacity to a downside stress that lifts the provision for credit losses by 30%",
      "Investor communication strategy to reinforce that capital return remains a structural element of the plan, not a residual",
    ],
    suggestedQuestions: [
      "What would cause management to pause the program mid-tranche, and how would that be communicated?",
      "Have we modelled the CET1 trajectory under a combined scenario of a 50-bp credit shock and the JV capital draw?",
      "Is the current dividend pay-out level the right anchor through the cycle, or should it be re-baselined?",
      "How does the proposed program affect EPS accretion under base and downside cases?",
    ],
  },
];

// ─── Smart Risk Scanner (structured) ──────────────────────────────────────────

/**
 * The 10 risk categories the scanner sweeps across, in display order.
 * Categories without any hits collapse into the "No relevant content" card.
 */
export const SMART_RISK_CATEGORIES = [
  "Risk and impact analysis",
  "Financial and operational implications",
  "Security Vulnerabilities and Threats",
  "Compliance and Legal Obligations",
  "Incident and Crisis Response",
  "Governance and Policy Oversight",
  "Stakeholder Communication and Reporting",
  "Confidentiality and Data Integrity",
  "Strategic and Market Positioning",
  "Preventative and Mitigation Strategies",
] as const;

export type SmartRiskCategory = (typeof SMART_RISK_CATEGORIES)[number];

export interface RiskExcerpt {
  text: string;
  /** Numeric citation appended to the excerpt (e.g. [3]). */
  citationIndex: number;
}

export interface RiskFinding {
  category: SmartRiskCategory;
  /** Heading for the finding (e.g. "Emerging Regulatory Challenges"). */
  heading: string;
  riskImplications: string;
  excerpts: RiskExcerpt[];
}

/** Sources cited by the Smart Risk Scanner excerpts. */
export const smartRiskSources: Source[] = [
  { index: 1, title: "Q2 2026 Board Pack — Risk & Compliance Update", page: "2",   documentId: "risk-compliance-q2-2026", targetPage: 2 },
  { index: 2, title: "Q2 2026 Board Pack — Strategic Plan Refresh", page: "2",     documentId: "strategic-plan-refresh", targetPage: 2 },
  { index: 3, title: "Audit Committee Report — June 2026", page: "2",             documentId: "audit-committee-jun-2026", targetPage: 2 },
  { index: 4, title: "CFO Commentary — Q2 2026", page: "2",                       documentId: "cfo-commentary-q2-2026", targetPage: 2 },
  { index: 5, title: "ESG and Sustainability Disclosure — H1 2026", page: "2",    documentId: "esg-disclosure-h1-2026", targetPage: 2 },
  { index: 6, title: "Cybersecurity Quarterly Update — Q2 2026", page: "2",        documentId: "cyber-quarterly-q2-2026", targetPage: 2 },
  { index: 7, title: "Internal Audit Findings Log — Q2 2026", page: "2",           documentId: "internal-audit-log-q2-2026", targetPage: 2 },
  { index: 8, title: "Singapore JV — Term Sheet Memo", page: "2",                  documentId: "singapore-jv-memo", targetPage: 2 },
];

export const smartRiskFindings: RiskFinding[] = [
  {
    category: "Risk and impact analysis",
    heading: "Concentration risk in regional CRE office exposure",
    riskImplications:
      "Office CRE concentration has been reduced to 3.4% of total loans but remains the most likely source of an outsized credit loss over the planning horizon. The portfolio's weighted-average LTV of 58% and ICR of 1.84x are protective in the base case, but a combined NOI deterioration and cap-rate widening would push roughly 9% of the book above LTV 75%. The Board should treat the proposed run-off pace as the principal lever for managing this exposure.",
    excerpts: [
      {
        text: "The office CRE book stood at $1.42B at quarter-end, with two single-name relationships migrated to watchlist and $11M of specific reserves established. Run-off of $260M year-on-year was achieved primarily through scheduled maturities and selected secondary sales.",
        citationIndex: 1,
      },
      {
        text: "Stress testing assumes a 100-bp NOI deterioration combined with a 50-bp cap-rate widening as the primary office downside scenario. Under this scenario, the modeled increase in specific reserves is in the range of $35–50M, absorbable within existing capital headroom but materially earnings-dilutive.",
        citationIndex: 2,
      },
    ],
  },
  {
    category: "Financial and operational implications",
    heading: "Net interest margin pressure into FY27",
    riskImplications:
      "Sustained funding-cost pressure in the wealth segment is the principal driver of the 6-bp sequential NIM compression. Management's FY26 NII guidance is achievable in the base case, but the trajectory into FY27 depends on the assumed rate path. A delayed-easing scenario would push reported NIM toward the 2.65% floor and place an estimated $45–60M of NII at risk versus plan.",
    excerpts: [
      {
        text: "Term deposit balances grew 14% sequentially, and the weighted-average rate paid on new wealth-segment deposits stepped up from 4.32% to 4.58%, more than offsetting the benefit of higher reinvestment yields on the securities portfolio.",
        citationIndex: 4,
      },
      {
        text: "Management proposes rotating approximately $1.2B of cash into 2–3 year duration securities at current spreads to defend the FY26 NII guide and reduce sensitivity to the assumed late-2026 easing path.",
        citationIndex: 4,
      },
      {
        text: "Each 25 bps parallel decline in rates is estimated to reduce NII by approximately $38M annualized; a delayed-easing scenario inverts this benefit and increases reliance on loan-growth discipline.",
        citationIndex: 2,
      },
    ],
  },
  {
    category: "Security Vulnerabilities and Threats",
    heading: "Identity-based attacks on critical third parties",
    riskImplications:
      "First-party cyber posture has improved measurably this quarter, but the third-party attack surface remains the most likely vector for a reportable incident. A single critical-vendor compromise could trigger multi-day operational impact and a regulatory notification within as little as 36 hours, with material reputational consequences even where direct financial loss is contained.",
    excerpts: [
      {
        text: "Phishing-simulation click-through declined from 6.8% to 4.1% following the rollout of just-in-time training and stricter web-filtering, and no material operational losses were reported in the quarter.",
        citationIndex: 6,
      },
      {
        text: "The supplier population includes 312 active vendors of which 28 are classed as critical. Tabletop exercises in the period covered two ransomware scenarios and one identity-compromise scenario; alternate-provider arrangements have been tested for 21 of the 28 critical vendors.",
        citationIndex: 6,
      },
    ],
  },
  {
    category: "Compliance and Legal Obligations",
    heading: "OCC third-party risk horizontal review closure",
    riskImplications:
      "The OCC horizontal review on third-party risk management closed with two matters requiring attention. Remediation plans were accepted by the regulator and both items are tracked to closure by the end of Q4 2026. Failure to close on plan would elevate the risk of follow-on supervisory action, including potential limits on new-vendor onboarding.",
    excerpts: [
      {
        text: "Both MRAs relate to documentation completeness for critical-vendor inherent-risk assessments and the cadence of board-level reporting on residual risk; neither indicates a financial misstatement or a control failure resulting in customer harm.",
        citationIndex: 3,
      },
      {
        text: "Independent validation of the remediation has been scheduled by Internal Audit for Q3 2026, with a follow-up walkthrough planned with the OCC examination team in Q4.",
        citationIndex: 7,
      },
    ],
  },
  {
    category: "Strategic and Market Positioning",
    heading: "Execution risk in the Singapore JV launch",
    riskImplications:
      "The proposed JV with Orion Partners is the first material non-US footprint expansion since 2019 and sets a template for subsequent Asia builds. Underperformance in the first 18 months would damage the relationships with three anchor clients documented in the deal memo and complicate the broader Asia plan, in addition to absorbing senior-management attention that has been earmarked for the core banking migration.",
    excerpts: [
      {
        text: "Initial committed capital is $180M, split 60/40 between Meridian and Orion. The operating model leverages Orion's MAS licence on day one while consolidating into Meridian's reporting stack; reserved matters and the buy-out mechanic are documented in section 7 of the shareholders' agreement.",
        citationIndex: 8,
      },
      {
        text: "If execution lands at plan, the JV is modelled to add approximately 60 bps to group ROTE by 2028 and to diversify revenue away from the US dollar by approximately 4 percentage points of group revenue.",
        citationIndex: 2,
      },
    ],
  },
  {
    category: "Governance and Policy Oversight",
    heading: "Board reporting cadence on emerging risks",
    riskImplications:
      "Several of the risks discussed in this pack (CRE office, cyber, JV execution) have movement velocity that exceeds the current quarterly reporting cadence. The Board should consider whether an interim risk dashboard between meetings would improve decision quality without adding undue management overhead.",
    excerpts: [
      {
        text: "The Risk Committee endorsed a recommendation to introduce a between-meeting risk dashboard covering the top five enterprise risks, refreshed monthly and delivered to Board members under information-only protocols.",
        citationIndex: 1,
      },
    ],
  },
];

/** Categories with no hits — derived from the findings list. */
export const smartRiskEmptyCategories: SmartRiskCategory[] = SMART_RISK_CATEGORIES.filter(
  (c) => !smartRiskFindings.some((f) => f.category === c),
);

export const SMART_RISK_DISCLAIMER =
  "The Smart Risk Scanner is not intended to act as or replace legal advice and does not create an attorney-client relationship. Please engage qualified counsel to obtain appropriate legal advice.";

// ─── Audit Smart Prep ────────────────────────────────────────────────────────

export interface AuditFigure {
  value: string;
  description: string;
  citation: string;
  citationIndex?: number;
}

export interface AuditTriageMatter {
  number: number;
  title: string;
  triageLine: string;
  framingSentence: string;
  suggestedQuestions: string[];
  figures: AuditFigure[];
  toResolve: string[];
}

export interface AuditBrief {
  title: string;
  openingRead: string;
  severityCounts: {
    critical: number;
    high: number;
    moderate: number;
  };
  triageMatters: AuditTriageMatter[];
  lowerPriority: string[];
}

export const auditBrief: AuditBrief = {
  title: "NVIDIA Corporation — FY2025 · audit committee preparation",
  openingRead:
    "The pack is comprehensive and the underlying performance exceptional, but three matters stand out ahead of the auditor ratification and charter amendment votes: a $3.7 billion inventory provision with $30.8 billion in non-cancellable purchase commitments that were not pre-reviewed by the committee despite representing 24% of year-end revenue; a critical audit matter flagged by PwC on inventory valuation judgment that deserves committee walk-through given the magnitude and the transition risk embedded in simultaneous Blackwell ramp and Hopper wind-down; and fee increases to PwC of 11% year-over-year without documented committee discussion of scope changes or engagement efficiency. Three lower-priority items relate to director independence, equity dilution, and tax reserve disclosures. (0 critical · 3 high · 3 moderate)",
  severityCounts: {
    critical: 0,
    high: 3,
    moderate: 3,
  },
  triageMatters: [
    {
      number: 1,
      title: "Inventory provisions and purchase commitments",
      triageLine:
        "Inventory provisions of $3.7 billion and outstanding purchase obligations of $30.8 billion — both record levels — were not presented to the committee for review during the year despite representing material commitments and judgment-heavy exposures.",
      framingSentence:
        "Net inventory provisions of $3.0 billion ($3.7 billion gross, less $0.7 billion releases from prior reserves) and $30.8 billion in non-cancellable purchase obligations — predominantly for Blackwell architecture — represent material exposures that do not appear to have been reviewed by the Audit Committee during the year.",
      suggestedQuestions: [
        "What portions of the $30.8 billion in purchase commitments were committed during FY2025, and at what points in the year did management brief the committee on the quantum and the demand assumptions underpinning them?",
        "The $3.7 billion provision includes a second-quarter charge for low-yielding Blackwell material; what was the magnitude of that charge, and what analysis supported the conclusion that the remainder of Blackwell inventory and commitments required no further provision at year-end?",
        "Walk us through the inventory transition plan: we are ramping Blackwell while still shipping Hopper simultaneously, with lead times exceeding twelve months — how are demand forecasts calibrated to avoid the mismatch risk management flags as having \"significantly harmed financial results\" in the past?",
      ],
      figures: [
        {
          value: "$30.8 billion",
          description:
            "outstanding inventory purchase and long-term supply obligations, increase led by Blackwell commitments",
          citation: "(Financial Statement Notes Summary, Part 4d)",
          citationIndex: 1,
        },
        {
          value: "$3.7 billion",
          description: "total inventory provisions and excess purchase obligations recorded in FY2025",
          citation: "(Fiscal Year 2025 Performance, Part 4c)",
          citationIndex: 2,
        },
        {
          value: "$689 million",
          description: "provision releases from sales of previously reserved inventory",
          citation: "(Fiscal Year 2025 Performance, Part 4c)",
          citationIndex: 2,
        },
        {
          value: "$10.1 billion",
          description: "consolidated inventories at January 26, 2025",
          citation: "(Audit Report Overview, Part 4d)",
          citationIndex: 3,
        },
        {
          value: "$1.6 billion",
          description: "inventory provision recorded in cost of revenue for FY2025",
          citation: "(Financial Statement Notes Summary, Part 4d)",
          citationIndex: 1,
        },
        {
          value: "12+ months",
          description: "manufacturing lead times",
          citation: "(Corporate Overview and Strategy, Part 4c)",
          citationIndex: 4,
        },
      ],
      toResolve: [
        "Request the committee papers from FY2025 meetings showing when and how the $30.8 billion commitment level was authorized, and the demand sensitivities presented at the time.",
        "Get the detailed roll-forward of inventory provisions by product line, including the Q2 Blackwell charge, the reserve releases by quarter, and the year-end coverage analysis by architecture and segment.",
        "Pull management's year-end demand forecast for Blackwell and Hopper by quarter through FY2026, and reconcile it to the committed supply to show the committee where the exposure sits if demand softens.",
      ],
    },
    {
      number: 2,
      title: "Critical audit matter on inventory valuation",
      triageLine:
        "PwC identified inventory valuation as the sole critical audit matter, citing significant judgment in demand forecasting and product transitions; the committee has not yet received PwC's testing results or the assumptions they validated.",
      framingSentence:
        "PwC identified inventory valuation as the sole critical audit matter in its FY2025 report, citing the significant judgment required in forecasting demand and market conditions given $10.1 billion in inventory and $30.8 billion in outstanding obligations.",
      suggestedQuestions: [
        "What specific assumptions did PwC test in its inventory valuation procedures, and did the firm flag any assumptions as aggressive or outside the range it considered supportable?",
        "The audit report states testing focused on management's assumptions regarding future demand and market conditions; what documentation did management provide, and how did PwC assess it against historical product life cycles and external market data?",
        "Given that inventory was the only critical audit matter this year, should the committee expect a deeper interim review of inventory and commitments during FY2026, and if so at what cadence?",
      ],
      figures: [
        {
          value: "$10.1 billion",
          description: "consolidated inventories as of January 26, 2025",
          citation: "(Audit Report Overview, Part 4d)",
          citationIndex: 3,
        },
        {
          value: "$30.8 billion",
          description: "outstanding inventory purchase and long-term supply obligations",
          citation: "(Audit Report Overview, Part 4d)",
          citationIndex: 3,
        },
        {
          value: "1",
          description: "number of critical audit matters identified by PwC",
          citation: "(Audit Report Overview, Part 4d)",
          citationIndex: 3,
        },
        {
          value: "$3.7 billion",
          description: "inventory provisions and excess obligations recorded",
          citation: "(Fiscal Year 2025 Performance, Part 4c)",
          citationIndex: 2,
        },
      ],
      toResolve: [
        "Request PwC's report to the Audit Committee on the critical audit matter, including the testing procedures performed, the assumptions evaluated, and any differences between management's initial position and the conclusion PwC accepted.",
        "Get management's written demand forecast and market-condition analysis that supported the year-end inventory valuation, and confirm it matches what PwC tested.",
        "Ask PwC whether the firm recommends more frequent committee review given the faster product cadence.",
      ],
    },
    {
      number: 3,
      title: "Auditor fees and scope",
      triageLine:
        "Audit fees rose 21% to $8.1 million while total fees increased 11% to $10.0 million, with no documented committee discussion of scope changes, engagement hours, or fee benchmarking against the peer group.",
      framingSentence:
        "Total fees paid to PwC increased 11% year-over-year to $10.0 million, with audit fees rising 21% to $8.1 million, yet the proxy materials contain no committee discussion of scope changes, engagement efficiency, or fee benchmarking.",
      suggestedQuestions: [
        "What drove the 21% increase in audit fees from $6.7 million to $8.1 million — additional hours, rate increases, expanded scope, or a combination, and how does the per-hour rate compare to the prior year?",
        "The committee pre-approved non-audit services totaling $1.9 million as compatible with independence; what is the nature of those services, and has the committee reviewed the total fee relationship against SEC and PCAOB independence guidance?",
        "PwC has served as auditor since 2004; what is the committee's process for evaluating auditor performance and considering a tender, and when was the last formal evaluation?",
      ],
      figures: [
        {
          value: "$10,002,351",
          description: "total fees paid to PwC for FY2025",
          citation: "(Auditor Ratification Proposal, Part 4b)",
          citationIndex: 5,
        },
        {
          value: "$9,007,069",
          description: "total fees paid to PwC for FY2024",
          citation: "(Auditor Ratification Proposal, Part 4b)",
          citationIndex: 5,
        },
        {
          value: "$8,067,106",
          description: "audit fees for FY2025",
          citation: "(Auditor Ratification Proposal, Part 4b)",
          citationIndex: 5,
        },
        {
          value: "$6,686,412",
          description: "audit fees for FY2024",
          citation: "(Auditor Ratification Proposal, Part 4b)",
          citationIndex: 5,
        },
        {
          value: "$1,935,245",
          description: "non-audit services for FY2025",
          citation: "(Auditor Ratification Proposal, Part 4b)",
          citationIndex: 5,
        },
        {
          value: "2004",
          description: "year PwC engagement commenced",
          citation: "(Auditor Ratification Proposal, Part 4b)",
          citationIndex: 5,
        },
      ],
      toResolve: [
        "Request the fee proposal or engagement letter from PwC for FY2025 showing scope, estimated hours, and hourly rates, and reconcile actual fees to the estimate.",
        "Get the committee's independence analysis for FY2025, including the breakdown of non-audit services by category and the assessment against the fee-cap ratios under SEC rules.",
        "Ask management whether the committee has benchmarked PwC's fees against peer-company audit fees adjusted for revenue and complexity, and if not, request that analysis for the next meeting.",
      ],
    },
  ],
  lowerPriority: [
    "Stephen C. Neal serves as Lead Director and as Chairman Emeritus of Cooley LLP, NVIDIA's general legal counsel; the pack does not describe how the board concluded this relationship does not impair independence under Nasdaq standards (Director Election Proposal Overview, Part 4b).",
    "Outstanding equity awards of 274 million RSUs and PSUs, plus 3.6 billion shares available for future grants, represent 15% of shares outstanding; the committee has not reviewed dilution trends or burn rate against the peer group (Equity Compensation Overview, Part 4b).",
    "Unrecognized tax benefits increased 71% to $2.9 billion, yet the pack states only that timing remains uncertain due to \"underlying tax position complexities\" without describing the positions or jurisdictions at risk (Financial Statement Notes Summary, Part 4d; Financial Risk and Controls, Part 4c).",
  ],
};

export const auditBriefSources: Source[] = [
  { index: 1, title: "Financial Statement Notes Summary", page: "Part 4d" },
  { index: 2, title: "Fiscal Year 2025 Performance", page: "Part 4c" },
  { index: 3, title: "Audit Report Overview", page: "Part 4d" },
  { index: 4, title: "Corporate Overview and Strategy", page: "Part 4c" },
  { index: 5, title: "Auditor Ratification Proposal", page: "Part 4b" },
];

// ─── Admin book structure (Build book tab) ───────────────────────────────────

export type ApprovalStatus = "approved" | "not_approved" | "none";

export interface BookDocument {
  id: string;
  name: string;
  size?: string;
  status: ApprovalStatus;
  type: "document";
}

export interface BookTab {
  id: string;
  name: string;
  type: "tab";
  children: (BookTab | BookDocument)[];
  expanded?: boolean;
}

export const bookStructure: BookTab[] = [
  {
    id: "t1",
    name: "Tab 1: License Agreement Review",
    type: "tab",
    expanded: true,
    children: [
      { id: "d3", name: "Lease_Agreement_Aug2024", size: "21 mb", status: "none", type: "document" },
      {
        id: "t1-1",
        name: "Tab 1.1: Vendor contracts signed",
        type: "tab",
        expanded: true,
        children: [
          { id: "d4", name: "Consulting_Agreement_Template", size: "21 mb", status: "none", type: "document" },
          {
            id: "t1-1-2",
            name: "Tab 1.1.2: Vendor contracts signed 3",
            type: "tab",
            expanded: true,
            children: [
              { id: "d5", name: "Consulting_Agreement_Template", size: "21 mb", status: "none", type: "document" },
              { id: "d6", name: "Approval_Meeting_Minutes", size: "21 mb", status: "none", type: "document" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "t2",
    name: "Tab 2: Financial Reports",
    type: "tab",
    expanded: false,
    children: [
      { id: "d7", name: "Q2_2026_Financial_Summary", size: "8 mb", status: "approved", type: "document" },
      { id: "d8", name: "CFO_Presentation_Jun2026", size: "14 mb", status: "approved", type: "document" },
    ],
  },
  {
    id: "t3",
    name: "Tab 3: Risk & Compliance",
    type: "tab",
    expanded: false,
    children: [
      { id: "d9", name: "Risk_Register_Q2_2026", size: "6 mb", status: "not_approved", type: "document" },
    ],
  },
];

// ─── Admin book list ──────────────────────────────────────────────────────────

export type AdminBookStatus = "Published" | "Unpublished" | "Archived";

export interface AdminBook {
  id: string;
  title: string;
  dateRange: string;
  meetingDate: string;
  labels: string[];
  committees: string[];
  extraCommittees: number;
  isLocked: boolean;
  hasCustomAccess: boolean;
  documentName: string;
  documentStatus: "Draft" | "Published";
  status: AdminBookStatus;
  lastUpdated: string;
  /**
   * Pending approvals for this book. Director-only concept — the admin book
   * list doesn't surface it, but the director Home/Books rows show a badge.
   */
  approvals?: number;
}

export const adminBooks: AdminBook[] = [
  {
    id: "1",
    title: "Q2 2026 Board Package",
    dateRange: "Jun 12–15, 2026",
    meetingDate: "06/12/2026",
    labels: ["Quarterly", "Full Board"],
    committees: ["Main committee", "Audit committee"],
    extraCommittees: 1,
    isLocked: false,
    hasCustomAccess: true,
    documentName: "Q2_2026_Board_Package",
    documentStatus: "Draft",
    status: "Published",
    lastUpdated: "06/10/2026",
    approvals: 3,
  },
  {
    id: "2",
    title: "Annual Financial Performance Report – 2023",
    dateRange: "Sept 12–15, 2023",
    meetingDate: "09/12/2023",
    labels: ["Label", "Label"],
    committees: ["Main committee", "Nomination committee", "Audit committee"],
    extraCommittees: 2,
    isLocked: true,
    hasCustomAccess: true,
    documentName: "Annual_Financial_Performance_Report_2023",
    documentStatus: "Draft",
    status: "Unpublished",
    lastUpdated: "09/09/2024",
  },
  {
    id: "3",
    title: "Risk & Compliance Review — May 2026",
    dateRange: "May 20–22, 2026",
    meetingDate: "05/20/2026",
    labels: ["Risk", "Compliance"],
    committees: ["Risk committee", "Audit committee"],
    extraCommittees: 0,
    isLocked: false,
    hasCustomAccess: false,
    documentName: "Risk_Compliance_Review_May2026",
    documentStatus: "Draft",
    status: "Archived",
    lastUpdated: "05/18/2026",
  },
  {
    id: "4",
    title: "ESG & Sustainability Report — Q3 2026",
    dateRange: "Jul 8–10, 2026",
    meetingDate: "07/08/2026",
    labels: ["ESG", "Sustainability"],
    committees: ["ESG committee", "Audit committee"],
    extraCommittees: 1,
    isLocked: false,
    hasCustomAccess: false,
    documentName: "ESG_Sustainability_Q3_2026",
    documentStatus: "Draft",
    status: "Published",
    lastUpdated: "07/01/2026",
    approvals: 2,
  },
  {
    id: "5",
    title: "Cybersecurity & IT Governance Review",
    dateRange: "Apr 14–15, 2026",
    meetingDate: "04/14/2026",
    labels: ["Security", "Risk"],
    committees: ["Risk committee"],
    extraCommittees: 0,
    isLocked: false,
    hasCustomAccess: false,
    documentName: "Cybersecurity_Governance_Apr2026",
    documentStatus: "Draft",
    status: "Unpublished",
    lastUpdated: "04/09/2026",
  },
  {
    id: "6",
    title: "Compensation & Talent Review — Q1 2026",
    dateRange: "Mar 22–23, 2026",
    meetingDate: "03/22/2026",
    labels: ["Talent", "Compensation"],
    committees: ["Compensation committee", "Nomination committee"],
    extraCommittees: 0,
    isLocked: false,
    hasCustomAccess: true,
    documentName: "Compensation_Talent_Mar2026",
    documentStatus: "Draft",
    status: "Published",
    lastUpdated: "03/18/2026",
  },
  {
    id: "bb-q4-2025",
    title: "Board Book Q4 2025",
    dateRange: "Dec 10–11, 2025",
    meetingDate: "12/10/2025",
    labels: ["Quarterly", "Full Board"],
    committees: ["Main committee"],
    extraCommittees: 0,
    isLocked: false,
    hasCustomAccess: false,
    documentName: "Board_Book_Q4_2025",
    documentStatus: "Published",
    status: "Published",
    lastUpdated: "12/10/2025",
  },
  {
    id: "bb-q3-2024",
    title: "Board Book Q3 2024",
    dateRange: "Sept 18–19, 2024",
    meetingDate: "09/18/2024",
    labels: ["Quarterly", "Risk"],
    committees: ["Risk committee"],
    extraCommittees: 0,
    isLocked: false,
    hasCustomAccess: false,
    documentName: "Board_Book_Q3_2024",
    documentStatus: "Published",
    status: "Archived",
    lastUpdated: "09/20/2024",
  },
  {
    id: "bb-q1-2026",
    title: "Board Book Q1 2026",
    dateRange: "Mar 18–19, 2026",
    meetingDate: "03/18/2026",
    labels: ["Quarterly", "Audit committee"],
    committees: ["Audit committee", "Main committee"],
    extraCommittees: 0,
    isLocked: false,
    hasCustomAccess: false,
    documentName: "Board_Book_Q1_2026",
    documentStatus: "Published",
    status: "Published",
    lastUpdated: "03/16/2026",
  },
  {
    id: "rk-sep-2025",
    title: "Risk Committee — September 2025",
    dateRange: "Sep 17, 2025",
    meetingDate: "09/17/2025",
    labels: ["Quarterly", "Risk committee"],
    committees: ["Risk committee"],
    extraCommittees: 0,
    isLocked: false,
    hasCustomAccess: false,
    documentName: "Risk_Committee_September_2025",
    documentStatus: "Published",
    status: "Published",
    lastUpdated: "09/15/2025",
  },
  {
    id: "rk-dec-2025",
    title: "Risk Committee — December 2025",
    dateRange: "Dec 3, 2025",
    meetingDate: "12/03/2025",
    labels: ["Quarterly", "Risk committee"],
    committees: ["Risk committee"],
    extraCommittees: 0,
    isLocked: false,
    hasCustomAccess: false,
    documentName: "Risk_Committee_December_2025",
    documentStatus: "Published",
    status: "Published",
    lastUpdated: "12/01/2025",
  },
  {
    id: "rk-mar-2026",
    title: "Risk Committee — March 2026",
    dateRange: "Mar 4, 2026",
    meetingDate: "03/04/2026",
    labels: ["Quarterly", "Risk committee"],
    committees: ["Risk committee"],
    extraCommittees: 0,
    isLocked: false,
    hasCustomAccess: false,
    documentName: "Risk_Committee_March_2026",
    documentStatus: "Published",
    status: "Published",
    lastUpdated: "03/02/2026",
  },
];

// ─── Director-facing book views ───────────────────────────────────────────────
// Directors and admins share the same book list, but directors never see
// unpublished books. The Books page shows everything else (published +
// archived); the Home page shows published books only.

/** Books visible to directors on the Books page — published + archived. */
export const directorBooks: AdminBook[] = adminBooks.filter(
  (b) => b.status !== "Unpublished",
);

/** Books visible to directors on the Home page — published only. */
export const directorHomeBooks: AdminBook[] = adminBooks.filter(
  (b) => b.status === "Published",
);

// ─── Review book navigation structure ────────────────────────────────────────

export interface NavItem {
  id: string;
  label: string;
  level: number;
  children?: NavItem[];
  expanded?: boolean;
  restricted?: boolean;
}

export const reviewNavStructure: NavItem[] = [
  { id: "agenda", label: "Agenda", level: 0 },
  {
    id: "s1", label: "1. Review of Key Financial Metrics", level: 0, expanded: true,
    children: [
      { id: "s1-d1", label: "Summary of the financial and auditdirector", level: 1, restricted: true },
      { id: "s1-d2", label: "Proposals introduced in the very beginning and refined several time…", level: 1, restricted: true },
    ],
  },
  { id: "s1-1", label: "1.1. Revenue", level: 0 },
  {
    id: "s1-2", label: "1.2. Expenses", level: 0, expanded: true,
    children: [
      { id: "s1-2-d1", label: "Secret ingredients", level: 1, restricted: true },
      {
        id: "s1-2-1", label: "1.2.1. What does the future holds?", level: 1, expanded: true,
        children: [
          {
            id: "s1-2-1-1", label: "1.2.1.1. The unforeseen expenses of the next century", level: 2, expanded: true,
            children: [
              { id: "s1-2-1-1-d1", label: "Globaltech governance q3 2024", level: 3 },
              { id: "s1-2-1-1-d2", label: "Table of contents", level: 3 },
              { id: "s1-2-1-1-d3", label: "Profit Margin Details And Other Interesting things", level: 3 },
            ],
          },
        ],
      },
      { id: "s1-2-2", label: "1.2.2. Next steps", level: 1 },
      { id: "s1-2-3", label: "1.2.3. Conclusions about the above mentioned topic", level: 1 },
    ],
  },
  {
    id: "s1-3", label: "1.3. Profit Margins", level: 0, expanded: true,
    children: [
      { id: "s1-3-d1", label: "Non_Disclosure_Agreement_NDA", level: 1 },
      { id: "s1-3-d2", label: "Lease_Agreement_Aug2024", level: 1 },
    ],
  },
];

// ─── Chat history (left panel of overlay) ────────────────────────────────────

export const chatHistoryItems = [
  { id: "h0", title: "All chats" },
  { id: "h1", title: "Audit committee follow-ups" },
  { id: "h2", title: "Insights from prior governance discussions" },
  { id: "h3", title: "Notes from the latest governance committee" },
  { id: "h4", title: "Action items from recent governance sessions" },
  { id: "h5", title: "Key decisions made by the governance committee" },
  { id: "h6", title: "Summaries of governance reviews conducted" },
  { id: "h7", title: "Logs of feedback from governance discussions" },
  { id: "h8", title: "List of recommendations from the governance team" },
  { id: "h9", title: "Agenda items for the upcoming governance meeting" },
  { id: "h10", title: "Conclusions and next steps from the governance review" },
  { id: "h11", title: "Follow-up actions determined by the governance board" },
];
