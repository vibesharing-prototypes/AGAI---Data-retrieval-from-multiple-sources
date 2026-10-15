// ─── AGAI integration use cases demo: product records behind deep links ─────────────────────────
// Source chips for Tasks and Decision hub open these pages in a new browser tab.
// Same mock world as demo-agai-integration-usecases.ts (Meridian Capital Group, Janice Whitfield).

import type { DocumentId } from "./documents.js";

export const TASK_PATH = "/tasks";
export const APPROVAL_PATH = "/decision-hub/approvals";

export const taskPath = (id: string) => `${TASK_PATH}/${id}`;
export const approvalPath = (id: string) => `${APPROVAL_PATH}/${id}`;
/** Deep link to an approval's Progress tab, where each participant's response shows. */
export const approvalProgressPath = (id: string) => `${approvalPath(id)}?tab=progress`;

export const DATA_ROOM_PATH = "/data-room";
/** Deep link to a Data room folder with one file highlighted. */
export const dataRoomFilePath = (folderId: string, fileId: string) => `${DATA_ROOM_PATH}/${folderId}?file=${fileId}`;

export interface DataRoomFile {
  id: string;
  name: string;
  sharedWith: string;
  lastModified: string;
  size: string;
}

export interface DataRoomFolder {
  id: string;
  title: string;
  /** Location above the title, e.g. "Risk Committee/Files". */
  path: string;
  files: DataRoomFile[];
  storageUsed: string;
}

/** Folders under Files in the Risk Committee data room, in navigation order. */
export const DATA_ROOM_NAV_FOLDERS = ["security-assurance", "board-risk-reports", "incident-reports", "policies-and-charters"];

export const DATA_ROOM_FOLDERS: Record<string, DataRoomFolder> = {
  "security-assurance": {
    id: "security-assurance",
    title: "Security assurance",
    path: "Risk Committee/Files",
    storageUsed: "31.21 MB",
    files: [
      { id: "ns-pentest-fy2026-signed", name: "Northgate Security Partners — Annual penetration test attestation FY2026 (signed).pdf", sharedWith: "–", lastModified: "10/09/2026", size: "224 KB" },
      { id: "ns-pentest-fy2026-draft", name: "Northgate Security Partners — Annual penetration test attestation FY2026 (draft).pdf", sharedWith: "–", lastModified: "09/28/2026", size: "205 KB" },
      { id: "sa-vendor-summary", name: "Vendor security questionnaire summary Q3 2026.pdf", sharedWith: "–", lastModified: "09/15/2026", size: "318 KB" },
      { id: "sa-soc2", name: "Meridian SOC 2 Type II report 2026.pdf", sharedWith: "3 people", lastModified: "08/30/2026", size: "2.41 MB" },
      { id: "sa-vuln-scan", name: "Quarterly vulnerability scan results Q3 2026.pdf", sharedWith: "–", lastModified: "08/12/2026", size: "476 KB" },
    ],
  },
  "board-risk-reports": {
    id: "board-risk-reports",
    title: "Board risk reports",
    path: "Risk Committee/Files",
    storageUsed: "31.21 MB",
    files: [
      { id: "br-register-q3", name: "Enterprise risk register Q3 2026.pdf", sharedWith: "5 people", lastModified: "10/02/2026", size: "1.12 MB" },
      { id: "br-heatmap-q3", name: "Risk heat map Q3 2026.pdf", sharedWith: "5 people", lastModified: "10/02/2026", size: "640 KB" },
      { id: "br-appetite", name: "Risk appetite statement FY2026.pdf", sharedWith: "–", lastModified: "07/21/2026", size: "286 KB" },
      { id: "br-emerging", name: "Emerging risks briefing June 2026.pdf", sharedWith: "2 people", lastModified: "06/18/2026", size: "512 KB" },
    ],
  },
  "incident-reports": {
    id: "incident-reports",
    title: "Incident reports",
    path: "Risk Committee/Files",
    storageUsed: "31.21 MB",
    files: [
      { id: "ir-vendor-outage", name: "Vendor outage post-incident review August 2026.pdf", sharedWith: "–", lastModified: "09/04/2026", size: "390 KB" },
      { id: "ir-phishing", name: "Phishing campaign summary July 2026.pdf", sharedWith: "–", lastModified: "07/29/2026", size: "244 KB" },
      { id: "ir-tabletop", name: "Incident response tabletop exercise report 2026.pdf", sharedWith: "3 people", lastModified: "05/14/2026", size: "702 KB" },
    ],
  },
  "policies-and-charters": {
    id: "policies-and-charters",
    title: "Policies and charters",
    path: "Risk Committee/Files",
    storageUsed: "31.21 MB",
    files: [
      { id: "pc-charter", name: "Risk Committee charter.pdf", sharedWith: "–", lastModified: "01/15/2026", size: "158 KB" },
      { id: "pc-vendor-policy", name: "Third-party risk management policy.pdf", sharedWith: "–", lastModified: "03/09/2026", size: "264 KB" },
      { id: "pc-ir-policy", name: "Cyber incident response policy.pdf", sharedWith: "–", lastModified: "03/09/2026", size: "301 KB" },
    ],
  },
};

// ─── Tasks ────────────────────────────────────────────────────────────────────

export type TaskStatus = "Open" | "In progress" | "Completed" | "Blocked";
export type TaskPriority = "High" | "Medium" | "Low";

export const TASK_STATUSES: TaskStatus[] = ["Open", "In progress", "Completed", "Blocked"];

export interface TaskRecord {
  id: string;
  title: string;
  details: string;
  status: TaskStatus;
  priority: TaskPriority;
  /** MM/DD/YYYY, as the product shows it. */
  dueDate: string;
  createdBy: string;
  createdOn: string;
}

export const TASK_LIST = ["chair-report-cyber-resilience", "pentest-attestation"];

export const TASKS: Record<string, TaskRecord> = {
  "chair-report-cyber-resilience": {
    id: "chair-report-cyber-resilience",
    title: "Risk Committee chair's report: cyber resilience and vendor incident readiness",
    details:
      "Write the chair's report on cyber resilience and incident readiness, including third-party vendors, for the December 4 Risk Committee book.",
    status: "Open",
    priority: "High",
    dueDate: "11/27/2026",
    createdBy: "Board admin",
    createdOn: "11/05/2026",
  },
  "pentest-attestation": {
    id: "pentest-attestation",
    title: "Penetration test attestation (signed copy)",
    details:
      "Upload the signed annual penetration test attestation from Northgate Security Partners for the December 4 Risk Committee book.",
    status: "Open",
    priority: "High",
    dueDate: "12/05/2026",
    createdBy: "Board admin",
    createdOn: "11/05/2026",
  },
};

// ─── Approvals (Decision hub) ─────────────────────────────────────────────────

export type ApprovalResponse = "Approved" | "Rejected" | "Abstained" | "Awaiting response";

export interface ApprovalParticipant {
  name: string;
  initials: string;
  committees: string[];
  response: ApprovalResponse;
  timestamp: string;
}

export interface ApprovalRecord {
  id: string;
  title: string;
  status: "Closed" | "In progress";
  published: string;
  closed: string;
  /** Document shown on the Resolution document tab (page images). */
  resolutionDocumentId: DocumentId;
  /** Shown on the document card header. */
  resolutionLabel: string;
  supportingMaterials: { title: string; note: string }[];
  participants: ApprovalParticipant[];
}

export const APPROVALS: Record<string, ApprovalRecord> = {
  "cyber-investment-2026": {
    id: "cyber-investment-2026",
    title: "Approve $3.2M incremental investment in endpoint detection and identity controls",
    status: "Closed",
    published: "June 2, 2026",
    closed: "June 9, 2026",
    resolutionDocumentId: "dh-cyber-investment-fy2026",
    resolutionLabel: "Document to be signed",
    supportingMaterials: [],
    participants: [
      { name: "Janice Whitfield", initials: "JW", committees: ["Risk Committee"], response: "Approved", timestamp: "June 5, 2026, 9:14 AM" },
      { name: "David Lin", initials: "DL", committees: ["Risk Committee"], response: "Approved", timestamp: "June 3, 2026, 4:02 PM" },
      { name: "Priya Raman", initials: "PR", committees: ["Risk Committee"], response: "Approved", timestamp: "June 3, 2026, 11:40 AM" },
      { name: "Marcus Feld", initials: "MF", committees: ["Risk Committee"], response: "Approved", timestamp: "June 8, 2026, 8:55 AM" },
      { name: "Elena Rossi", initials: "ER", committees: ["Risk Committee"], response: "Abstained", timestamp: "June 9, 2026, 10:21 AM" },
    ],
  },
};
