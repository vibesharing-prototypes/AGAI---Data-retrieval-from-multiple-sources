// ─── Document registry ───────────────────────────────────────────────────────
// Each entry maps a logical "document" referenced by an AI-response Source
// (e.g. "Minutes, Board meeting Q4 2025") to its set of page images. Page 1
// is always the cover. Inline citations resolve to a specific page; source
// chips open the document at page 1.

import type { BookTab } from "./mockData.js";

export type DocumentId =
  | "minutes-q4-2025"
  | "fy2026-plan"
  | "ir-resolution"
  | "risk-cyber-2024-q3"
  | "cfo-q1-variance-report"
  // ─── Smart Summary docs (Meridian Capital Group, Q2 2026 cycle) ─────────────
  | "agenda-q2-2026"
  | "fin-statements-q2-2026"
  | "cfo-commentary-q2-2026"
  | "segment-report-q2-2026"
  | "risk-compliance-q2-2026"
  | "capital-plan-q3-2026"
  | "singapore-jv-memo"
  | "core-banking-migration"
  | "audit-committee-jun-2026"
  | "clearpath-day-100"
  | "cyber-quarterly-q2-2026"
  | "five-year-plan-jun-2026"
  | "strategic-plan-refresh"
  | "esg-disclosure-h1-2026"
  | "internal-audit-log-q2-2026"
  // ─── AGAI integration use cases demo docs (Janice's December Risk Committee) ─────────────────
  | "rk-agenda-sep-2025"
  | "rk-agenda-dec-2025"
  | "rk-minutes-dec-2025"
  | "dh-cyber-investment-fy2026"
  | "ns-pentest-fy2026-signed"
  | "ns-pentest-fy2026-draft"
  | "rc-vulnerability-incident-policy";

export interface DocumentPageDef {
  page: number;        // 1-based; 1 = cover
  label: string;       // section / page name
  image: string;       // public path
}

export interface DocumentDef {
  id: DocumentId;
  title: string;
  /** Where the document lives, shown in the preview header: a book title, or a
   *  module location such as "Decision Hub" for documents that aren't in a book. */
  book: string;
  /** Module location label for documents outside a book (Decision Hub, Data Room). */
  location?: string;
  /** adminBooks id where this document lives in its assembled form. Absent for
   *  documents that aren't part of a book. */
  bookId?: string;
  /** 1-based page in the assembled book where this document starts. */
  bookStartPage?: number;
  documentType: string;
  date: string;
  pages: DocumentPageDef[];
}

export const DOCUMENTS: Record<DocumentId, DocumentDef> = {
  "minutes-q4-2025": {
    id: "minutes-q4-2025",
    title: "Minutes, Board meeting Q4 2025",
    book: "Board Book Q4 2025",
    bookId: "bb-q4-2025",
    bookStartPage: 1,
    documentType: "Minutes",
    date: "December 10, 2025",
    pages: [
      { page: 1, label: "Cover & Contents",                                 image: "/doc-pages/minutes-q4-2025/page-1.png" },
      { page: 2, label: "Section 1 — Attendance, Quorum, and Agenda",       image: "/doc-pages/minutes-q4-2025/page-2.png" },
      { page: 3, label: "Section 2 — Approval of Prior Board Meeting Minutes", image: "/doc-pages/minutes-q4-2025/page-3.png" },
      { page: 4, label: "Section 3 — FY2026 Operating Plan and Budget",     image: "/doc-pages/minutes-q4-2025/page-4.png" },
      { page: 5, label: "Section 4 — Cybersecurity: Incident Response Framework", image: "/doc-pages/minutes-q4-2025/page-5.png" },
      { page: 6, label: "Section 5 — Resolutions, Action Items, and Sign-Off", image: "/doc-pages/minutes-q4-2025/page-6.png" },
    ],
  },
  "fy2026-plan": {
    id: "fy2026-plan",
    title: "FY2026 Operating Plan & Budget",
    book: "Board Book Q4 2025",
    bookId: "bb-q4-2025",
    bookStartPage: 3,
    documentType: "Annex A — For Board Approval",
    date: "Approved December 10, 2025",
    pages: [
      { page: 1, label: "Cover & Contents",                                  image: "/doc-pages/fy2026-plan/page-1.png" },
      { page: 2, label: "Executive Summary",                                 image: "/doc-pages/fy2026-plan/page-2.png" },
      { page: 3, label: "Consolidated Budget & Capital Allocation",          image: "/doc-pages/fy2026-plan/page-3.png" },
      { page: 4, label: "Headcount Growth and Talent Plan",                  image: "/doc-pages/fy2026-plan/page-4.png" },
      { page: 5, label: "International Expansion: DACH and ANZ",             image: "/doc-pages/fy2026-plan/page-5.png" },
      { page: 6, label: "Risks, Sensitivities, and Variance Reporting",      image: "/doc-pages/fy2026-plan/page-6.png" },
    ],
  },
  "ir-resolution": {
    id: "ir-resolution",
    title: "Resolution – Approval of Incident Response Framework",
    book: "Board Book Q4 2025",
    bookId: "bb-q4-2025",
    bookStartPage: 6,
    documentType: "Annex B — Board Resolution",
    date: "Adopted December 10, 2025",
    pages: [
      { page: 1, label: "Cover & Contents",                                  image: "/doc-pages/ir-resolution/page-1.png" },
      { page: 2, label: "Resolution Text and Whereas Clauses",               image: "/doc-pages/ir-resolution/page-2.png" },
      { page: 3, label: "Escalation Thresholds and Notification Triggers",   image: "/doc-pages/ir-resolution/page-3.png" },
      { page: 4, label: "Roles, Responsibilities, and Sign-Off",             image: "/doc-pages/ir-resolution/page-4.png" },
    ],
  },
  "risk-cyber-2024-q3": {
    id: "risk-cyber-2024-q3",
    title: "Risk & Cybersecurity Update",
    book: "Board Book Q3 2024",
    bookId: "bb-q3-2024",
    bookStartPage: 1,
    documentType: "Risk & Technology Committee briefing",
    date: "September 2024",
    pages: [
      { page: 1, label: "Cover & Contents",                                  image: "/doc-pages/risk-cyber-2024-q3/page-1.png" },
      { page: 2, label: "Enterprise Risk Landscape",                         image: "/doc-pages/risk-cyber-2024-q3/page-2.png" },
      { page: 3, label: "Cybersecurity Escalation Readiness",                image: "/doc-pages/risk-cyber-2024-q3/page-3.png" },
      { page: 4, label: "Findings, Gaps, and Recommendations",               image: "/doc-pages/risk-cyber-2024-q3/page-4.png" },
    ],
  },

  "cfo-q1-variance-report": {
    id: "cfo-q1-variance-report",
    title: "CFO Q1 Variance Report",
    book: "Board Book Q1 2026",
    bookId: "bb-q1-2026",
    bookStartPage: 1,
    documentType: "Office of the CFO — quarterly variance update",
    date: "March 2026",
    pages: [
      { page: 1, label: "Cover & Contents",                                  image: "/doc-pages/cfo-q1-variance-report/page-1.png" },
      { page: 2, label: "Q1 FY2026 Performance Against the Approved Budget",  image: "/doc-pages/cfo-q1-variance-report/page-2.png" },
    ],
  },

  // ─── Q2 2026 Board Package documents (Meridian Capital Group) ───────────────
  // These 15 documents are assembled, in this order, into the "Q2 2026 Board
  // Package" book (bookId "1"). bookStartPage is the 1-based page in the
  // assembled 30-page book where each document begins. The Agenda is the book's
  // front matter; the other 14 are cited by Smart Summary, Prep, and Risk
  // Scanner. See Q2_BOARD_PACKAGE_ORDER.
  "agenda-q2-2026": {
    id: "agenda-q2-2026",
    title: "Q2 2026 Board Meeting — Agenda",
    book: "Q2 2026 Board Package",
    bookId: "1",
    bookStartPage: 1,
    documentType: "Office of the Corporate Secretary",
    date: "June 12, 2026",
    pages: [
      { page: 1, label: "Cover & Contents",          image: "/doc-pages/agenda-q2-2026/page-1.png" },
      { page: 2, label: "Order of Business",         image: "/doc-pages/agenda-q2-2026/page-2.png" },
    ],
  },
  "fin-statements-q2-2026": {
    id: "fin-statements-q2-2026",
    title: "Q2 2026 Consolidated Financial Statements",
    book: "Q2 2026 Board Package",
    bookId: "1",
    bookStartPage: 3,
    documentType: "Group Finance — quarterly statements",
    date: "June 30, 2026",
    pages: [
      { page: 1, label: "Cover & Contents",          image: "/doc-pages/fin-statements-q2-2026/page-1.png" },
      { page: 2, label: "Group P&L Summary",         image: "/doc-pages/fin-statements-q2-2026/page-2.png" },
    ],
  },
  "cfo-commentary-q2-2026": {
    id: "cfo-commentary-q2-2026",
    title: "CFO Commentary — Q2 2026",
    book: "Q2 2026 Board Package",
    bookId: "1",
    bookStartPage: 5,
    documentType: "Office of the CFO",
    date: "July 2026",
    pages: [
      { page: 1, label: "Cover & Contents",                                       image: "/doc-pages/cfo-commentary-q2-2026/page-1.png" },
      { page: 2, label: "Operating Leverage & the NIM Walk",                      image: "/doc-pages/cfo-commentary-q2-2026/page-2.png" },
    ],
  },
  "segment-report-q2-2026": {
    id: "segment-report-q2-2026",
    title: "Segment Reporting Appendix — Q2 2026",
    book: "Q2 2026 Board Package",
    bookId: "1",
    bookStartPage: 7,
    documentType: "Group Finance — segment appendix",
    date: "June 30, 2026",
    pages: [
      { page: 1, label: "Cover & Contents",                       image: "/doc-pages/segment-report-q2-2026/page-1.png" },
      { page: 2, label: "Segment Revenue & Net New Assets",       image: "/doc-pages/segment-report-q2-2026/page-2.png" },
    ],
  },
  "capital-plan-q3-2026": {
    id: "capital-plan-q3-2026",
    title: "Capital Plan and Buyback Proposal — Q3 2026",
    book: "Q2 2026 Board Package",
    bookId: "1",
    bookStartPage: 27,
    documentType: "Office of the CFO — for Board approval",
    date: "July 2026",
    pages: [
      { page: 1, label: "Cover & Contents",                                       image: "/doc-pages/capital-plan-q3-2026/page-1.png" },
      { page: 2, label: "Recommendation & Capital Position",                      image: "/doc-pages/capital-plan-q3-2026/page-2.png" },
    ],
  },
  "five-year-plan-jun-2026": {
    id: "five-year-plan-jun-2026",
    title: "Five-Year Plan Refresh — June 2026",
    book: "Q2 2026 Board Package",
    bookId: "1",
    bookStartPage: 29,
    documentType: "Strategy & Group Finance — plan refresh",
    date: "June 2026",
    pages: [
      { page: 1, label: "Cover & Contents",                                       image: "/doc-pages/five-year-plan-jun-2026/page-1.png" },
      { page: 2, label: "Capital Framework & Shareholder Returns",                image: "/doc-pages/five-year-plan-jun-2026/page-2.png" },
    ],
  },
  "strategic-plan-refresh": {
    id: "strategic-plan-refresh",
    title: "Q2 2026 Board Pack — Strategic Plan Refresh",
    book: "Q2 2026 Board Package",
    bookId: "1",
    bookStartPage: 15,
    documentType: "Group Strategy — plan refresh",
    date: "July 2026",
    pages: [
      { page: 1, label: "Cover & Contents",                                       image: "/doc-pages/strategic-plan-refresh/page-1.png" },
      { page: 2, label: "Strategic Priorities & the Asia Expansion Template",     image: "/doc-pages/strategic-plan-refresh/page-2.png" },
    ],
  },
  "singapore-jv-memo": {
    id: "singapore-jv-memo",
    title: "Singapore JV — Term Sheet Memo",
    book: "Q2 2026 Board Package",
    bookId: "1",
    bookStartPage: 9,
    documentType: "Corporate Development — for Board approval",
    date: "July 2026",
    pages: [
      { page: 1, label: "Cover & Contents",                                       image: "/doc-pages/singapore-jv-memo/page-1.png" },
      { page: 2, label: "Commercial Terms, Capital & Anchor Mandates",            image: "/doc-pages/singapore-jv-memo/page-2.png" },
    ],
  },
  "clearpath-day-100": {
    id: "clearpath-day-100",
    title: "ClearPath Integration — Day-100 Review",
    book: "Q2 2026 Board Package",
    bookId: "1",
    bookStartPage: 13,
    documentType: "M&A Integration — Day-100 review",
    date: "June 2026",
    pages: [
      { page: 1, label: "Cover & Contents",                                       image: "/doc-pages/clearpath-day-100/page-1.png" },
      { page: 2, label: "Synergy Realisation & Integration Milestones",           image: "/doc-pages/clearpath-day-100/page-2.png" },
    ],
  },
  "core-banking-migration": {
    id: "core-banking-migration",
    title: "Core Banking Migration — Steering Committee Update",
    book: "Q2 2026 Board Package",
    bookId: "1",
    bookStartPage: 11,
    documentType: "Technology & Operations — bi-monthly update",
    date: "June 2026",
    pages: [
      { page: 1, label: "Cover & Contents",                                       image: "/doc-pages/core-banking-migration/page-1.png" },
      { page: 2, label: "Retail Deposits Cut-Over — October 17, 2026",            image: "/doc-pages/core-banking-migration/page-2.png" },
    ],
  },
  "risk-compliance-q2-2026": {
    id: "risk-compliance-q2-2026",
    title: "Q2 2026 Board Pack — Risk & Compliance Update",
    book: "Q2 2026 Board Package",
    bookId: "1",
    bookStartPage: 19,
    documentType: "Risk & Compliance — quarterly update",
    date: "July 2026",
    pages: [
      { page: 1, label: "Cover & Contents",                                       image: "/doc-pages/risk-compliance-q2-2026/page-1.png" },
      { page: 2, label: "Office CRE Exposure & Watchlist Migration",              image: "/doc-pages/risk-compliance-q2-2026/page-2.png" },
    ],
  },
  "cyber-quarterly-q2-2026": {
    id: "cyber-quarterly-q2-2026",
    title: "Cybersecurity Quarterly Update — Q2 2026",
    book: "Q2 2026 Board Package",
    bookId: "1",
    bookStartPage: 17,
    documentType: "Office of the CISO — quarterly update",
    date: "June 2026",
    pages: [
      { page: 1, label: "Cover & Contents",                                       image: "/doc-pages/cyber-quarterly-q2-2026/page-1.png" },
      { page: 2, label: "Identity-Based Threats & the Vendor Population",         image: "/doc-pages/cyber-quarterly-q2-2026/page-2.png" },
    ],
  },
  "internal-audit-log-q2-2026": {
    id: "internal-audit-log-q2-2026",
    title: "Internal Audit Findings Log — Q2 2026",
    book: "Q2 2026 Board Package",
    bookId: "1",
    bookStartPage: 21,
    documentType: "Internal Audit — quarterly findings log",
    date: "June 2026",
    pages: [
      { page: 1, label: "Cover & Contents",                                       image: "/doc-pages/internal-audit-log-q2-2026/page-1.png" },
      { page: 2, label: "Open Findings & Remediation Status",                     image: "/doc-pages/internal-audit-log-q2-2026/page-2.png" },
    ],
  },
  "audit-committee-jun-2026": {
    id: "audit-committee-jun-2026",
    title: "Audit Committee Report — June 2026",
    book: "Q2 2026 Board Package",
    bookId: "1",
    bookStartPage: 23,
    documentType: "Audit Committee — standing report",
    date: "June 28, 2026",
    pages: [
      { page: 1, label: "Cover & Contents",                                       image: "/doc-pages/audit-committee-jun-2026/page-1.png" },
      { page: 2, label: "OCC Third-Party Review & External Audit",                image: "/doc-pages/audit-committee-jun-2026/page-2.png" },
    ],
  },
  "esg-disclosure-h1-2026": {
    id: "esg-disclosure-h1-2026",
    title: "ESG and Sustainability Disclosure — H1 2026",
    book: "Q2 2026 Board Package",
    bookId: "1",
    bookStartPage: 25,
    documentType: "Chief Sustainability Officer — half-year disclosure",
    date: "June 2026",
    pages: [
      { page: 1, label: "Cover & Contents",                                       image: "/doc-pages/esg-disclosure-h1-2026/page-1.png" },
      { page: 2, label: "Climate Disclosure & Financed-Emissions Risk",           image: "/doc-pages/esg-disclosure-h1-2026/page-2.png" },
    ],
  },

  // ─── AGAI integration use cases demo documents (Meridian Capital Group, Risk Committee) ──────
  // Used only by the scripted director flow in src/data/demo-agai-integration-usecases.ts. The
  // Risk Committee agendas and minutes live in their own books in adminBooks
  // (the reader shows the cited document's pages); Decision Hub and Data Room
  // documents have no book at all.
  "rk-agenda-sep-2025": {
    id: "rk-agenda-sep-2025",
    title: "Agenda — Risk Committee, September 17, 2025",
    book: "Risk Committee — September 2025",
    bookId: "rk-sep-2025",
    bookStartPage: 1,
    documentType: "Agenda",
    date: "September 17, 2025",
    pages: [
      { page: 1, label: "Cover & Contents", image: "/doc-pages/rk-agenda-sep-2025/page-1.png" },
      { page: 2, label: "Order of business", image: "/doc-pages/rk-agenda-sep-2025/page-2.png" },
    ],
  },
  "rk-agenda-dec-2025": {
    id: "rk-agenda-dec-2025",
    title: "Agenda — Risk Committee, December 3, 2025",
    book: "Risk Committee — December 2025",
    bookId: "rk-dec-2025",
    bookStartPage: 1,
    documentType: "Agenda",
    date: "December 3, 2025",
    pages: [
      { page: 1, label: "Cover & Contents", image: "/doc-pages/rk-agenda-dec-2025/page-1.png" },
      { page: 2, label: "Order of business", image: "/doc-pages/rk-agenda-dec-2025/page-2.png" },
    ],
  },
  "rk-minutes-dec-2025": {
    id: "rk-minutes-dec-2025",
    title: "Minutes — Risk Committee, December 3, 2025",
    book: "Risk Committee — March 2026",
    bookId: "rk-mar-2026",
    bookStartPage: 1,
    documentType: "Minutes",
    date: "December 3, 2025",
    pages: [
      { page: 1, label: "Cover & Contents", image: "/doc-pages/rk-minutes-dec-2025/page-1.png" },
      { page: 2, label: "Section 1 — Attendance and agenda", image: "/doc-pages/rk-minutes-dec-2025/page-2.png" },
      { page: 3, label: "Section 2 — Item 5: cyber resilience programme for FY2026", image: "/doc-pages/rk-minutes-dec-2025/page-3.png" },
    ],
  },
  "dh-cyber-investment-fy2026": {
    id: "dh-cyber-investment-fy2026",
    title: "Resolution — Incremental investment in endpoint detection and identity controls (signed)",
    book: "Decision Hub",
    location: "Decision Hub",
    documentType: "Signed resolution",
    date: "June 9, 2026",
    pages: [
      { page: 1, label: "Cover & Contents", image: "/doc-pages/dh-cyber-investment-fy2026/page-1.png" },
      { page: 2, label: "Resolution text and budget", image: "/doc-pages/dh-cyber-investment-fy2026/page-2.png" },
      { page: 3, label: "Votes and signatures", image: "/doc-pages/dh-cyber-investment-fy2026/page-3.png" },
    ],
  },
  "ns-pentest-fy2026-signed": {
    id: "ns-pentest-fy2026-signed",
    title: "Northgate Security Partners — Annual penetration test attestation FY2026 (signed)",
    book: "Data Room · Risk Committee",
    location: "Data Room · Risk Committee",
    documentType: "Security assurance",
    date: "Signed October 9, 2026",
    pages: [
      { page: 1, label: "Cover & Contents", image: "/doc-pages/ns-pentest-fy2026-signed/page-1.png" },
      { page: 2, label: "Scope and methodology", image: "/doc-pages/ns-pentest-fy2026-signed/page-2.png" },
      { page: 3, label: "Findings summary", image: "/doc-pages/ns-pentest-fy2026-signed/page-3.png" },
    ],
  },
  "ns-pentest-fy2026-draft": {
    id: "ns-pentest-fy2026-draft",
    title: "Northgate Security Partners — Annual penetration test attestation FY2026 (draft)",
    book: "Data Room · Risk Committee",
    location: "Data Room · Risk Committee",
    documentType: "Security assurance",
    date: "Draft, September 2026",
    pages: [
      { page: 1, label: "Cover & Contents", image: "/doc-pages/ns-pentest-fy2026-draft/page-1.png" },
      { page: 2, label: "Scope and methodology", image: "/doc-pages/ns-pentest-fy2026-draft/page-2.png" },
      { page: 3, label: "Findings summary", image: "/doc-pages/ns-pentest-fy2026-draft/page-3.png" },
    ],
  },
  "rc-vulnerability-incident-policy": {
    id: "rc-vulnerability-incident-policy",
    title: "Vulnerability and incident response policy",
    book: "Resource Center",
    location: "Resource Center · Risk Committee",
    documentType: "Policy",
    date: "Published, next review Q4 2026",
    pages: [
      { page: 1, label: "Cover & Contents", image: "/doc-pages/rc-vulnerability-incident-policy/page-1.png" },
      { page: 2, label: "Remediation windows and escalation", image: "/doc-pages/rc-vulnerability-incident-policy/page-2.png" },
    ],
  },
};

// ─── Assembled "Q2 2026 Board Package" book (bookId "1") ─────────────────────
// The 14 content documents are organised into tabs and subtabs that mirror the
// Smart Summary TOC: the 4 top-level tabs are Smart Summary's "Detailed Summary"
// sections, and the subtabs are its paragraph labels. The Agenda is the book's
// front matter — it sits first, ahead of the tabs, and is visible to both
// admins and directors. This structure drives the assembled page order, the
// book-reader nav, and the admin Build book tree.

/** Front-matter Agenda document — first in the assembled book, before the tabs. */
export const Q2_BOARD_PACKAGE_AGENDA_ID: DocumentId = "agenda-q2-2026";

interface BoardPackageSubtab {
  label: string;
  docs: DocumentId[];
}
interface BoardPackageTab {
  label: string;
  subtabs: BoardPackageSubtab[];
}

export const Q2_BOARD_PACKAGE_STRUCTURE: BoardPackageTab[] = [
  {
    label: "Financial performance",
    subtabs: [
      { label: "Revenue & earnings", docs: ["fin-statements-q2-2026", "cfo-commentary-q2-2026"] },
      { label: "Segment view", docs: ["segment-report-q2-2026"] },
    ],
  },
  {
    label: "Strategic priorities",
    subtabs: [
      { label: "Singapore JV with Orion Partners", docs: ["singapore-jv-memo"] },
      { label: "Core banking migration", docs: ["core-banking-migration"] },
      { label: "ClearPath integration", docs: ["clearpath-day-100"] },
      { label: "Strategic plan", docs: ["strategic-plan-refresh"] },
    ],
  },
  {
    label: "Risk and compliance",
    subtabs: [
      { label: "Cyber & operational risk", docs: ["cyber-quarterly-q2-2026"] },
      { label: "Credit & compliance", docs: ["risk-compliance-q2-2026"] },
      { label: "Audit & regulatory", docs: ["internal-audit-log-q2-2026", "audit-committee-jun-2026"] },
      { label: "ESG", docs: ["esg-disclosure-h1-2026"] },
    ],
  },
  {
    label: "Outlook and five-year forecast",
    subtabs: [
      { label: "Capital & returns", docs: ["capital-plan-q3-2026"] },
      { label: "Five-year plan", docs: ["five-year-plan-jun-2026"] },
    ],
  },
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** All 15 documents in assembled book order — Agenda first, then the tab/subtab
 *  content documents. */
export const Q2_BOARD_PACKAGE_ORDER: DocumentId[] = [
  Q2_BOARD_PACKAGE_AGENDA_ID,
  ...Q2_BOARD_PACKAGE_STRUCTURE.flatMap((tab) => tab.subtabs.flatMap((sub) => sub.docs)),
];

export interface AssembledBookPage {
  /** 1-based page in the assembled book. */
  bookPage: number;
  image: string;
  documentId: DocumentId;
  /** 1-based page within the source document. */
  docPage: number;
  /** Page label — document title on its cover page, section label otherwise. */
  label: string;
}

/** Flat, ordered page list for the Q2 2026 Board Package book. */
export const q2BoardPackagePages: AssembledBookPage[] = Q2_BOARD_PACKAGE_ORDER.flatMap(
  (docId) => {
    const doc = DOCUMENTS[docId];
    return doc.pages.map((p) => ({
      bookPage: doc.bookStartPage - 1 + p.page,
      image: p.image,
      documentId: docId,
      docPage: p.page,
      label: p.page === 1 ? doc.title : p.label,
    }));
  },
);

/** Structure-nav (TOC) item for a book reader's left panel. Superset of the
 *  legacy mockData NavItem so either array can be passed to the reader. */
export interface BookNavItem {
  id: string;
  label: string;
  level: number;
  children?: BookNavItem[];
  expanded?: boolean;
  restricted?: boolean;
  /** Row kind. "tab"/"subtab" are expandable sections; "document" is a leaf. */
  kind?: "tab" | "subtab" | "document";
  /** documentId this nav row jumps to (document rows only). */
  documentId?: DocumentId;
  /** 1-based page in the assembled book this row scrolls to. */
  bookPage?: number;
}

/** Top-level Agenda nav row — a tab containing the front-matter Agenda
 *  document. Rendered as a tab heading so directors (who never see document
 *  rows) still get an Agenda entry; clicking it jumps to the Agenda's page.
 *  Admins additionally see the Agenda document nested beneath it. */
const agendaNavItem: BookNavItem = {
  id: "tab:agenda",
  label: "Agenda",
  level: 0,
  kind: "tab",
  expanded: true,
  bookPage: DOCUMENTS[Q2_BOARD_PACKAGE_AGENDA_ID].bookStartPage,
  children: [
    {
      id: `doc:${Q2_BOARD_PACKAGE_AGENDA_ID}`,
      label: DOCUMENTS[Q2_BOARD_PACKAGE_AGENDA_ID].title,
      level: 1,
      kind: "document",
      documentId: Q2_BOARD_PACKAGE_AGENDA_ID,
      bookPage: DOCUMENTS[Q2_BOARD_PACKAGE_AGENDA_ID].bookStartPage,
    },
  ],
};

/** Book-reader structure nav for the Q2 2026 Board Package — Agenda, then
 *  tabs → subtabs → documents. Admins see the full tree; directors see the
 *  tab/subtab headings only (see stripDocumentNavRows). */
export const q2BoardPackageNav: BookNavItem[] = [
  agendaNavItem,
  ...Q2_BOARD_PACKAGE_STRUCTURE.map((tab) => {
    const subtabItems: BookNavItem[] = tab.subtabs.map((sub) => {
      const docItems: BookNavItem[] = sub.docs.map((docId) => ({
        id: `doc:${docId}`,
        label: DOCUMENTS[docId].title,
        level: 2,
        kind: "document" as const,
        documentId: docId,
        bookPage: DOCUMENTS[docId].bookStartPage,
      }));
      return {
        id: `subtab:${slug(tab.label)}:${slug(sub.label)}`,
        label: sub.label,
        level: 1,
        kind: "subtab" as const,
        expanded: true,
        children: docItems,
        bookPage: docItems[0]?.bookPage,
      };
    });
    return {
      id: `tab:${slug(tab.label)}`,
      label: tab.label,
      level: 0,
      kind: "tab" as const,
      expanded: true,
      children: subtabItems,
      bookPage: subtabItems[0]?.bookPage,
    };
  }),
];

/** Flat lookup: nav row id → assembled-book page it scrolls to. */
export const q2BoardPackageNavPageById: Record<string, number> = (() => {
  const map: Record<string, number> = {};
  const walk = (items: BookNavItem[]) => {
    for (const it of items) {
      if (typeof it.bookPage === "number") map[it.id] = it.bookPage;
      if (it.children) walk(it.children);
    }
  };
  walk(q2BoardPackageNav);
  return map;
})();

/** Admin "Build book" tree for the Q2 2026 Board Package — Agenda first, then
 *  the same tab/subtab structure as the reader nav with documents as leaves. */
export const q2BoardPackageBuildStructure: BookTab[] = [
  {
    id: "bt:agenda",
    name: "Tab 1: Agenda",
    type: "tab" as const,
    expanded: true,
    children: [
      {
        id: `bd:${Q2_BOARD_PACKAGE_AGENDA_ID}`,
        name: DOCUMENTS[Q2_BOARD_PACKAGE_AGENDA_ID].title,
        status: "approved" as const,
        type: "document" as const,
      },
    ],
  },
  ...Q2_BOARD_PACKAGE_STRUCTURE.map((tab, ti) => ({
    id: `bt:${slug(tab.label)}`,
    name: `Tab ${ti + 2}: ${tab.label}`,
    type: "tab" as const,
    expanded: true,
    children: tab.subtabs.map((sub, si) => ({
      id: `bt:${slug(tab.label)}:${slug(sub.label)}`,
      name: `Tab ${ti + 2}.${si + 1}: ${sub.label}`,
      type: "tab" as const,
      expanded: true,
      children: sub.docs.map((docId) => ({
        id: `bd:${docId}`,
        name: DOCUMENTS[docId].title,
        status: "approved" as const,
        type: "document" as const,
      })),
    })),
  })),
];

export function getDocument(id: DocumentId): DocumentDef {
  return DOCUMENTS[id];
}

export function getDocumentPage(id: DocumentId, page: number): DocumentPageDef {
  const doc = DOCUMENTS[id];
  return doc.pages.find((p) => p.page === page) ?? doc.pages[0];
}

/** Total assembled-book pages per bookId. The Q2 2026 Board Package is the
 *  Agenda plus 14 generated documents (2 pages each = 30); other books fall
 *  back to the legacy 10-page boardroom mock. */
const BOOK_PAGE_TOTALS: Record<string, number> = {
  "1": q2BoardPackagePages.length,
};
const DEFAULT_BOOK_PAGE_TOTAL = 10;

export function getBookPageTotal(bookId: string): number {
  return BOOK_PAGE_TOTALS[bookId] ?? DEFAULT_BOOK_PAGE_TOTAL;
}

/** Map a (documentId, page-within-document) citation to its page in the assembled book. */
export function getBookPageForCitation(id: DocumentId, targetPage: number): number {
  const doc = DOCUMENTS[id];
  const total = getBookPageTotal(doc.bookId ?? "");
  return Math.min(total, Math.max(1, (doc.bookStartPage ?? 1) + (targetPage - 1)));
}
