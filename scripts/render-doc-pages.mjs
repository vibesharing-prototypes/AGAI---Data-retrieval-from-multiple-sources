// Renders the agai-integration-usecases-demo document pages (public/doc-pages/<id>/page-N.png).
// Not part of the app bundle. Run: node scripts/render-doc-pages.mjs
// Uses the playwright package already in node_modules with the locally
// installed Google Chrome, so no browser download is needed.
// Render one document only: ONLY=<id> node scripts/render-doc-pages.mjs

import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "doc-pages");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 764px; height: 990px; background: #fff; }
  body { font-family: "Inter", -apple-system, "Helvetica Neue", Arial, sans-serif; color: #14161c; font-size: 12.5px; line-height: 1.5; position: relative; overflow: hidden; }
  .serif { font-family: "Source Serif 4", "Charter", "Iowan Old Style", Georgia, serif; }
  .mono { font-family: "SF Mono", Menlo, Consolas, monospace; }
  .run { position: absolute; top: 24px; left: 74px; right: 77px; height: 28px; display: flex; justify-content: space-between; border-bottom: 1px solid #e6e6e8; font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 600; }
  .run span:last-child { font-weight: 400; color: #77777c; }
  .foot { position: absolute; bottom: 24px; left: 74px; right: 77px; padding-top: 12px; border-top: 1px solid #e6e6e8; display: flex; justify-content: space-between; font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase; color: #77777c; }
  .body { position: absolute; top: 66px; left: 81px; right: 84px; bottom: 60px; }
  .eyebrow { font-size: 9.5px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 600; color: #b9482c; margin-bottom: 14px; }
  h1 { font-family: "Source Serif 4", "Charter", Georgia, serif; font-weight: 400; font-size: 30px; line-height: 1.15; letter-spacing: -0.01em; }
  .rule { width: 34px; border-top: 1px solid #14161c; margin: 14px 0 22px; }
  .lede { font-family: "Source Serif 4", "Charter", Georgia, serif; font-size: 17px; line-height: 1.55; color: #2a2c33; margin-bottom: 22px; }
  .callout { background: #f9f9f5; border: 1px solid #deded8; border-left: 3px solid #b9482c; padding: 16px 24px 18px; margin: 4px 0 22px; }
  .callout .eyebrow { margin-bottom: 8px; }
  .callout p { font-family: "Source Serif 4", "Charter", Georgia, serif; font-size: 13px; line-height: 1.6; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
  th { text-align: left; font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 600; padding: 10px 10px; border-top: 1px solid #14161c; border-bottom: 1px solid #14161c; }
  td { padding: 9px 10px; border-bottom: 1px solid #e9e9e6; vertical-align: top; font-size: 11.5px; }
  tr:nth-child(even) td { background: #f9f9f5; }
  td.num, th.num { text-align: right; }
  tr.hl td { background: #fdf0d3 !important; font-weight: 600; }
  h3 { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; font-weight: 600; margin: 14px 0 6px; }
  p.t { margin-bottom: 10px; font-size: 11.5px; }
  .hlbox { background: #fdf0d3; box-shadow: 0 0 0 4px #fdf0d3; border-radius: 2px; }
  .cover-head { position: absolute; top: 56px; left: 81px; display: flex; align-items: center; gap: 10px; font-size: 11px; font-weight: 500; }
  .logo { width: 24px; height: 24px; border-radius: 50%; background: #b9482c; color: #fff; display: grid; place-items: center; font-family: "Source Serif 4", Georgia, serif; font-size: 13px; }
  .cover-title { position: absolute; top: 118px; left: 81px; right: 100px; }
  .cover-title h1 { font-size: 42px; line-height: 1.1; margin-top: 4px; }
  .cover-title .sub { margin-top: 20px; font-family: "Source Serif 4", Georgia, serif; font-size: 16px; line-height: 1.5; color: #6a6a70; max-width: 460px; }
  .meta { position: absolute; top: 418px; left: 0; right: 0; height: 230px; background: #f9f9f5; border-top: 1px solid #e6e6e8; border-bottom: 1px solid #e6e6e8; padding: 48px 81px; display: grid; grid-template-columns: 1fr 1fr; gap: 28px 40px; align-content: start; }
  .meta .k { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; color: #77777c; margin-bottom: 6px; }
  .meta .v { font-family: "Source Serif 4", Georgia, serif; font-size: 13.5px; line-height: 1.4; }
  .toc { position: absolute; top: 676px; left: 81px; right: 82px; }
  .toc .eyebrow { margin-bottom: 8px; }
  .toc .row { display: flex; gap: 14px; padding: 9px 0; border-bottom: 1px solid #ececea; font-size: 11.5px; }
  .toc .row .n { color: #b9482c; width: 18px; }
  .toc .row .t { flex: 1; }
  .toc .row .p { color: #77777c; }
  .sig { display: grid; grid-template-columns: 1fr 1fr; gap: 20px 32px; margin-top: 26px; }
  .sig > div { border-top: 1px solid #14161c; padding-top: 4px; }
  .sig .hand { font-family: "Snell Roundhand", "Brush Script MT", cursive; font-size: 24px; line-height: 1.1; color: #1c2a5a; font-style: italic; }
  .sig .nm { font-weight: 600; font-size: 11px; margin-top: 4px; }
  .sig .rl { color: #77777c; font-size: 10.5px; }
  .letterhead { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #14161c; padding-bottom: 12px; margin-bottom: 26px; }
  .letterhead .nm { font-family: "Source Serif 4", Georgia, serif; font-size: 20px; letter-spacing: 0.01em; }
  .letterhead .ad { font-size: 9.5px; color: #77777c; text-align: right; line-height: 1.5; }
  .draftmark { position: absolute; top: 420px; left: 90px; transform: rotate(-24deg); font-size: 110px; letter-spacing: 0.1em; font-weight: 700; color: rgba(185,72,44,0.08); pointer-events: none; }
`;

const page = (inner, { draft = false } = {}) =>
  `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${inner}${draft ? '<div class="draftmark">DRAFT</div>' : ""}</body></html>`;

const run = (l, r) => `<div class="run"><span>${l}</span><span>${r}</span></div>`;
const foot = (l, n) => `<div class="foot"><span>${l}</span><span>Confidential — Page ${n}</span></div>`;

const cover = ({ org = "Meridian Capital Group", eyebrow, title, sub, meta, toc, ref }) => `
  <div class="cover-head"><div class="logo">M</div>${org}</div>
  <div class="cover-title"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><div class="sub">${sub}</div><div class="rule" style="margin-top:34px"></div></div>
  <div class="meta">${meta.map(([k, v]) => `<div><div class="k">${k}</div><div class="v">${v}</div></div>`).join("")}</div>
  <div class="toc"><div class="eyebrow">Contents</div>${toc.map(([t, p], i) => `<div class="row"><span class="n mono">${String(i + 1).padStart(2, "0")}</span><span class="t">${t}</span><span class="p mono">${String(p).padStart(2, "0")}</span></div>`).join("")}</div>
  ${foot(ref, 1).replace("Confidential — Page 1", "Page I")}
`;

const agendaPage = ({ ref, dateLabel, items, hl, lede }) => `
  ${run(`Meridian Capital Group · Risk Committee`, `Agenda — ${dateLabel}`)}
  <div class="body">
    <div class="eyebrow">Agenda · ${dateLabel}</div>
    <h1>Order of business</h1><div class="rule"></div>
    <p class="lede">${lede}</p>
    <table>
      <tr><th style="width:36px">No.</th><th>Item</th><th style="width:120px">Purpose</th><th style="width:90px">Lead</th></tr>
      ${items.map(([n, t, p, l]) => `<tr class="${n === hl ? "hl" : ""}"><td class="mono">${n}</td><td>${t}</td><td>${p}</td><td>${l}</td></tr>`).join("")}
    </table>
    <p class="t" style="color:#6a6a70">Papers are in the book for this meeting. Directors with a conflict of interest on any item should tell the Company Secretary before the meeting.</p>
  </div>
  ${foot(ref, 2)}
`;

const members = [["Janice Whitfield", "Chair"], ["David Lin", "Member"], ["Priya Raman", "Member"], ["Marcus Feld", "Member"], ["Elena Rossi", "Member"]];

const SEP_ITEMS = [
  [1, "Welcome and apologies", "For noting", "Chair"],
  [2, "Declarations of interest", "For noting", "Chair"],
  [3, "Minutes of the June 11, 2025 meeting", "For approval", "Chair"],
  [4, "Enterprise risk dashboard", "For discussion", "CRO"],
  [5, "Credit and market risk update", "For discussion", "CRO"],
  [6, "Cyber resilience: third-party vendor risk review", "For discussion", "CISO"],
  [7, "Regulatory examination update", "For discussion", "Chief Compliance Officer"],
  [8, "Operational resilience testing", "For noting", "COO"],
  [9, "Any other business", "—", "Chair"],
];
const DEC_ITEMS = [
  [1, "Welcome and apologies", "For noting", "Chair"],
  [2, "Declarations of interest", "For noting", "Chair"],
  [3, "Minutes of the September 17, 2025 meeting", "For approval", "Chair"],
  [4, "Enterprise risk dashboard", "For discussion", "CRO"],
  [5, "Cyber resilience programme for FY2026", "For decision", "CISO"],
  [6, "Regulatory examination update", "For discussion", "Chief Compliance Officer"],
  [7, "Operational resilience testing plan", "For approval", "COO"],
  [8, "Any other business", "—", "Chair"],
];

const PAGES = {
  "rk-agenda-sep-2025": {
    1: page(cover({
      eyebrow: "Risk Committee · September 2025", title: "Agenda — Risk Committee", sub: "Meeting of Wednesday, September 17, 2025, at the Meridian Capital Group head office and by secure video conference.",
      meta: [["Document number", "RK-AGN-2025-09"], ["Classification", "Confidential — Committee use only"], ["Prepared by", "Office of the Company Secretary"], ["Distribution", "Members of the Risk Committee"]],
      toc: [["Welcome, declarations and minutes", 2], ["Enterprise, credit and market risk", 2], ["Cyber resilience: third-party vendor risk review", 2], ["Regulatory, resilience and other business", 2]], ref: "RK-AGN-2025-09 / V.FINAL",
    })),
    2: page(agendaPage({ ref: "RK-AGN-2025-09", dateLabel: "September 17, 2025", items: SEP_ITEMS, hl: 6, lede: "The Committee will review the company's cyber exposure through its third-party vendors and agree the priorities for the coming year." })),
  },
  "rk-agenda-dec-2025": {
    1: page(cover({
      eyebrow: "Risk Committee · December 2025", title: "Agenda — Risk Committee", sub: "Meeting of Wednesday, December 3, 2025, at the Meridian Capital Group head office and by secure video conference.",
      meta: [["Document number", "RK-AGN-2025-12"], ["Classification", "Confidential — Committee use only"], ["Prepared by", "Office of the Company Secretary"], ["Distribution", "Members of the Risk Committee"]],
      toc: [["Welcome, declarations and minutes", 2], ["Enterprise risk dashboard", 2], ["Cyber resilience programme for FY2026", 2], ["Regulatory, resilience and other business", 2]], ref: "RK-AGN-2025-12 / V.FINAL",
    })),
    2: page(agendaPage({ ref: "RK-AGN-2025-12", dateLabel: "December 3, 2025", items: DEC_ITEMS, hl: 5, lede: "The Committee will decide whether to recommend the cyber resilience programme for FY2026." })),
  },
  "rk-minutes-dec-2025": {
    1: page(cover({
      eyebrow: "Risk Committee · December 2025", title: "Minutes of the Risk Committee", sub: "Held on Wednesday, December 3, 2025 at the Meridian Capital Group head office and by secure video conference.",
      meta: [["Document number", "RK-MIN-2025-12"], ["Classification", "Confidential — Committee use only"], ["Prepared by", "Office of the Company Secretary"], ["Status", "Approved March 2026"]],
      toc: [["Attendance and agenda", 2], ["Item 5: cyber resilience programme for FY2026", 3]], ref: "RK-MIN-2025-12 / V.FINAL",
    })),
    2: page(`
      ${run("Meridian Capital Group · Risk Committee", "Minutes — December 3, 2025")}
      <div class="body">
        <div class="eyebrow">Section 1</div><h1>Attendance and agenda</h1><div class="rule"></div>
        <p class="lede">The Chair opened the meeting at 9:30 a.m. A quorum was present throughout.</p>
        <table><tr><th>Member</th><th>Role</th><th>Attendance</th></tr>
          ${members.map(([n, r]) => `<tr><td>${n}</td><td>${r}</td><td>Present</td></tr>`).join("")}
        </table>
        <h3>In attendance</h3>
        <p class="t">The board admin (Company Secretary), the Chief Information Security Officer and the Chief Risk Officer.</p>
        <h3>Agenda</h3>
        <p class="t">The Committee noted the agenda as circulated, covering eight items. No declarations of interest were made. The minutes of the September 17, 2025 meeting were approved without amendment.</p>
        <p class="t">Item 5, the cyber resilience programme for FY2026, was taken as the main item of business and is recorded in section 2.</p>
      </div>
      ${foot("RK-MIN-2025-12", 1)}`),
    3: page(`
      ${run("Meridian Capital Group · Risk Committee", "Minutes — December 3, 2025")}
      <div class="body">
        <div class="eyebrow">Section 2 · Item 5</div><h1>Cyber resilience programme for FY2026</h1><div class="rule"></div>
        <p class="lede">The Committee considered the CISO's proposed programme, following the November SaaS incident at a third-party vendor.</p>
        <div class="callout"><div class="eyebrow">Decision 25.12.05</div>
          <p><b>Resolved,</b> that the Committee recommends the FY2026 cyber resilience programme, including an independent annual penetration test and incremental investment in endpoint detection and identity controls, subject to a final business case.</p></div>
        <h3>Condition</h3>
        <p class="t">The recommendation is conditional on the Company running an incident tabletop exercise with its critical vendors before the end of Q4 2026.</p>
        <h3>Deferred</h3>
        <p class="t">The review of the vulnerability and incident response policy was deferred to Q4 2026, so that it can be considered together with the independent penetration test attestation.</p>
        <h3>Next steps</h3>
        <p class="t">The Company Secretary will record the investment as an approval in Decision Hub once the business case is final, and circulate the signed resolution to Committee members.</p>
      </div>
      ${foot("RK-MIN-2025-12", 2)}`),
  },
  "dh-cyber-investment-fy2026": {
    1: page(cover({
      eyebrow: "Risk Committee · Resolution", title: "Incremental investment in endpoint detection and identity controls", sub: "Signed resolution attached to the approval in Decision Hub. Closed June 9, 2026.",
      meta: [["Document number", "RES-2026-06-03"], ["Classification", "Confidential — Committee use only"], ["Approval opened", "June 2, 2026"], ["Outcome", "Approved June 9, 2026"]],
      toc: [["Resolution text and budget", 2], ["Votes and signatures", 3]], ref: "RES-2026-06-03 / SIGNED",
    })),
    2: page(`
      ${run("Resolution 26.06.03 · Cyber investment", "Resolution text and budget")}
      <div class="body">
        <div class="eyebrow">Section 1</div><h1>Resolution text and budget</h1><div class="rule"></div>
        <p class="lede">Following the May 2026 FS-ISAC advisory, the Risk Committee considered incremental investment in endpoint detection and identity controls.</p>
        <div class="callout"><div class="eyebrow">Resolution 26.06.03</div>
          <p><b>Resolved,</b> that the Committee approves incremental investment in endpoint detection and identity controls at Meridian Capital Group, on the terms set out below.</p></div>
        <table><tr><th>Term</th><th class="num">Approved</th></tr>
          <tr><td>Incremental investment</td><td class="num"><b>$3.2M</b></td></tr>
          <tr><td>Scope</td><td class="num">Endpoint detection and identity controls</td></tr>
          <tr><td>Progress reporting</td><td class="num">Quarterly to the Committee</td></tr>
        </table>
        <p class="t">The phishing-simulation programme is expanded in support of this investment.</p>
      </div>
      ${foot("RES-2026-06-03", 1)}`),
    3: page(`
      ${run("Resolution 26.06.03 · Cyber investment", "Votes and signatures")}
      <div class="body">
        <div class="eyebrow">Section 2</div><h1>Votes and signatures</h1><div class="rule"></div>
        <table><tr><th>Vote</th><th>Members</th><th class="num">Count</th></tr>
          <tr><td>For</td><td>J. Whitfield, D. Lin, P. Raman, M. Feld</td><td class="num mono">4</td></tr>
          <tr><td>Against</td><td>—</td><td class="num mono">0</td></tr>
          <tr><td>Abstained</td><td>E. Rossi</td><td class="num mono">1</td></tr>
        </table>
        <p class="t">The resolution was approved. Signed on behalf of the Committee.</p>
        <div class="sig">
          <div><div class="hand">Janice Whitfield</div><div class="nm">Janice Whitfield</div><div class="rl">Chair, Risk Committee</div></div>
          <div><div class="hand">Board admin</div><div class="nm">Board admin</div><div class="rl">Company Secretary</div></div>
        </div>
      </div>
      ${foot("RES-2026-06-03", 2)}`),
  },
  "ns-pentest-fy2026-signed": {
    1: page(cover({
      org: "Northgate Security Partners", eyebrow: "Security assurance · FY2026", title: "Annual penetration test attestation FY2026", sub: "Addressed to Janice Whitfield, Chair of the Risk Committee, Meridian Capital Group.",
      meta: [["Document number", "NS-PEN-FY2026"], ["Status", "Signed October 9, 2026"], ["From", "Northgate Security Partners"], ["To", "Janice Whitfield, Risk Committee chair"]],
      toc: [["Scope and methodology", 2], ["Findings summary", 3]], ref: "NS-PEN-FY2026 / SIGNED",
    })),
    2: page(`
      ${run("Northgate Security Partners · Penetration test attestation", "Scope and methodology")}
      <div class="body">
        <div class="eyebrow">Section 1</div><h1>Scope and methodology</h1><div class="rule"></div>
        <p class="lede">We attest that we carried out an independent penetration test of Meridian Capital Group's external and vendor-facing systems for FY2026.</p>
        <p class="t">Testing covered the internet-facing applications, the identity and authentication services, and the vendor access gateway through which third parties connect to Meridian systems. It ran from August 17 to September 25, 2026.</p>
        <p class="t">We used a combination of automated scanning and manual testing, following recognised industry testing methodologies. Findings were rated critical, high, medium or low using the Common Vulnerability Scoring System.</p>
        <p class="t">Testing was performed without disrupting production services. No customer data was extracted or retained.</p>
        <p class="t">We will tell the Committee promptly if retesting changes any rating before the final report is issued.</p>
      </div>
      ${foot("NS-PEN-FY2026", 1)}`),
    3: page(`
      ${run("Northgate Security Partners · Penetration test attestation", "Findings summary")}
      <div class="body">
        <div class="eyebrow">Section 2</div><h1>Findings summary</h1><div class="rule"></div>
        <p class="lede">The table below summarises findings by severity at the date of this attestation.</p>
        <table><tr><th>Severity</th><th class="num">Findings</th></tr>
          <tr><td>Critical</td><td class="num">0</td></tr>
          <tr class="hl"><td>High</td><td class="num">2</td></tr>
          <tr><td>Medium</td><td class="num">7</td></tr>
          <tr><td>Low</td><td class="num">11</td></tr>
        </table>
        <p class="t"><span class="hlbox">Testing found no critical findings and 2 high-severity findings, both in the vendor access gateway. Both were reported to management on October 9, 2026 and are in remediation.</span></p>
        <p class="t">We will update this attestation after retesting of the remediated findings.</p>
        <div class="sig" style="margin-top:48px">
          <div><div class="hand">Mara Okonjo</div><div class="nm">Mara Okonjo</div><div class="rl">Engagement partner · Signed October 9, 2026</div></div>
        </div>
      </div>
      ${foot("NS-PEN-FY2026", 2)}`),
  },
  "ns-pentest-fy2026-draft": {
    1: page(cover({
      org: "Northgate Security Partners", eyebrow: "Security assurance · FY2026 · Draft", title: "Annual penetration test attestation FY2026", sub: "Draft for review. Addressed to Janice Whitfield, Chair of the Risk Committee.",
      meta: [["Document number", "NS-PEN-FY2026-D"], ["Status", "Draft, September 2026"], ["From", "Northgate Security Partners"], ["To", "Janice Whitfield, Risk Committee chair"]],
      toc: [["Scope and methodology", 2], ["Findings summary", 3]], ref: "NS-PEN-FY2026-D / DRAFT",
    }), { draft: true }),
    2: page(`
      ${run("Northgate Security Partners · Penetration test attestation (draft)", "Scope and methodology")}
      <div class="body">
        <div class="eyebrow">Section 1</div><h1>Scope and methodology</h1><div class="rule"></div>
        <p class="lede">We attest that we carried out an independent penetration test of Meridian Capital Group's external and vendor-facing systems for FY2026.</p>
        <p class="t">Testing covered the internet-facing applications, the identity and authentication services, and the vendor access gateway.</p>
        <p class="t" style="color:#6a6a70">Draft. Ratings subject to review by the quality reviewer.</p>
      </div>
      ${foot("NS-PEN-FY2026-D", 1)}`, { draft: true }),
    3: page(`
      ${run("Northgate Security Partners · Penetration test attestation (draft)", "Findings summary")}
      <div class="body">
        <div class="eyebrow">Section 2</div><h1>Findings summary</h1><div class="rule"></div>
        <p class="lede">The table below summarises findings by severity at the date of this draft.</p>
        <table><tr><th>Severity</th><th class="num">Findings</th></tr>
          <tr><td>Critical</td><td class="num">0</td></tr>
          <tr><td>High</td><td class="num">3</td></tr>
          <tr><td>Medium</td><td class="num">8</td></tr>
          <tr><td>Low</td><td class="num">11</td></tr>
        </table>
        <p class="t">Testing found no critical findings and 3 high-severity findings, two in the vendor access gateway and one in a legacy service account.</p>
        <p class="t" style="color:#6a6a70">Draft. Ratings subject to confirmation before signing.</p>
      </div>
      ${foot("NS-PEN-FY2026-D", 2)}`, { draft: true }),
  },
  "rc-vulnerability-incident-policy": {
    1: page(cover({
      eyebrow: "Resource Center · Policy", title: "Vulnerability and incident response policy", sub: "Rules for fixing security weaknesses and responding to cyber incidents, including those at third-party vendors.",
      meta: [["Document number", "POL-RC-012"], ["Status", "Published"], ["Owner", "Risk Committee"], ["Next review", "Q4 2026"]],
      toc: [["Purpose and scope", 2], ["Remediation windows and escalation", 2]], ref: "POL-RC-012 / PUBLISHED",
    })),
    2: page(`
      ${run("Meridian Capital Group · Risk Committee", "Vulnerability and incident response policy")}
      <div class="body">
        <div class="eyebrow">Section 2</div><h1>Remediation windows and escalation</h1><div class="rule"></div>
        <p class="lede">The Committee sets how quickly weaknesses must be fixed and how fast serious incidents must reach it.</p>
        <table><tr><th>Rule</th><th>Requirement</th></tr>
          <tr><td>Critical findings</td><td>Remediate within 30 days of being reported.</td></tr>
          <tr><td>High-severity findings</td><td><span class="hlbox">Remediate within 90 days of being reported.</span></td></tr>
          <tr><td>Medium findings</td><td>Remediate within 180 days of being reported.</td></tr>
          <tr><td>Material incidents</td><td>Escalate to the Committee chair within 24 hours of detection.</td></tr>
          <tr><td>Critical vendors</td><td>Vendors must notify Meridian of an incident within 48 hours.</td></tr>
        </table>
        <p class="t">The CISO reports progress against these windows to the Committee each quarter.</p>
      </div>
      ${foot("POL-RC-012", 1)}`),
  },
};

const ONLY = process.env.ONLY;
const browser = await chromium.launch({ executablePath: CHROME });
const ctx = await browser.newContext({ viewport: { width: 764, height: 990 }, deviceScaleFactor: 1 });
for (const [id, pages] of Object.entries(PAGES)) {
  if (ONLY && id !== ONLY) continue;
  await mkdir(path.join(OUT, id), { recursive: true });
  for (const [n, html] of Object.entries(pages)) {
    const p = await ctx.newPage();
    await p.setContent(html, { waitUntil: "load" });
    await p.screenshot({ path: path.join(OUT, id, `page-${n}.png`) });
    await p.close();
    console.log(`${id}/page-${n}.png`);
  }
}
await browser.close();
