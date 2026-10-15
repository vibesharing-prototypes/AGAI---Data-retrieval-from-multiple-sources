# Handoff: AGAI integration use cases — director flow ("Janice's December Audit Committee")

## What this is

Add a scripted, presentation-style demo to this prototype. It shows stakeholders what Ask GovernAI (AGAI) can do for a director once Task Hub, Decision Hub and Data Room are indexed, on top of today's book indexing.

The demo has three parts, played in one flow from one link:

1. Two intro screens: who Janice is, and how she does this task today.
2. The existing director AGAI chat, running a six-step scripted conversation with a callout rail beside it.
3. A closing screen: what each step needed, and the ask.

Audience: leadership and product/engineering stakeholders. Length: 5–7 minutes, presenter-driven.

Product context:

- "Smart Assist" is now called Ask GovernAI (AGAI). The UI already uses "Ask GovernAI". Keep it.
- Today only board books are indexed. Finalised agendas and approved minutes are reachable only because they sit inside published books.
- Focus is retrieval. The one action (step 6) comes from the Data Room "share with pre-check" idea in the use cases doc. Every action needs explicit user confirmation.

Source docs (for wording questions, not for code):

- Use cases: https://diligentbrands.atlassian.net/wiki/spaces/~71202007b8e0be4c464eda9f35b9e7508bdfa1/pages/7498465309/Use+cases
- Tracker: https://diligentbrands.atlassian.net/wiki/spaces/~71202007b8e0be4c464eda9f35b9e7508bdfa1/pages/7465140538

---

## Before you start

- Read `AGENTS.md`. Use the Atlas MCP server for every component choice. Only `sx` with design tokens for styling.
- Do not change existing conversation variants, the MVP/explorations branch logic, or existing pages' behaviour. Everything new must be additive and only active in demo mode.
- Run `npm run dev` and check every step in the browser, at desktop width.

---

## Existing pieces to reuse

| Need | Reuse | Notes |
|---|---|---|
| Director chat panel | `src/components/SmartAssistOverlay.tsx`, `src/context/SmartAssistContext.tsx` | Director audience, opened from Director Home. |
| Scripted answers | `TRIGGER_MAP` + `matchTriggerResponse` in `src/data/hybrid-search.constants.ts` | Exact-match prompts return authored `richContent` + `sources`. Best fit for the six steps. |
| Rich answer blocks | `RichBlock` types (`p`, `h`, `list`, `table`) and `Cite` spans | Cite numbers are response-scoped. |
| Source cards | `src/components/SourcesBlock.tsx` | Needs a module badge (see below). |
| Document preview at cited page | `CitationPreviewPanel`, `CitationPreviewContext`, `src/data/documents.ts`, `public/doc-pages/*` | Add new `DocumentId`s and page images. |
| Thinking state | `AIChatThinkingIndicator` (label prop) in the overlay | Use per-step labels, see below. |
| Suggested prompts | `src/components/SuggestionChips.tsx` | Demo mode shows the next step's prompt as a single chip. |
| Mock customer | Meridian Capital Group (books in `mockData.ts`) | Keep using it. |

---

## Demo mode and routes (recommendation — adjust if the codebase suggests better)

- `/demo/AGAI-integration-usecases` → intro screen 1 → intro screen 2 (Next / Back buttons, presenter-friendly).
- "Start demo" navigates to `/director?demo=AGAI-integration-usecases`, auto-opens the AGAI panel, and starts a fresh chat.
- In demo mode:
  - The suggestion area shows only the next step's prompt as a chip. Clicking it sends the exact prompt. Typing the exact prompt works too.
  - The callout rail is visible to the right of the chat (toggle with a small "Hide notes" button so the presenter can clear it).
  - After step 6 the rail shows "Finish" → `/demo/AGAI-integration-usecases/summary`.
- A "Restart demo" link on intro screen 1 and the summary screen resets chat state.

---

## Mock world (keep every number consistent)

All names are fictional. Do not use real firm names.

| Item | Value |
|---|---|
| Organisation | Meridian Capital Group |
| Director | Janice Whitfield — independent director, Audit Committee chair |
| Company secretary | Sarah Okafor |
| Audit Committee members | Janice Whitfield (chair), David Lin, Priya Raman, Marcus Feld, Elena Rossi |
| External auditor | Halden & Brooke LLP |
| Demo "today" | Thursday, November 12, 2026 |
| Next Audit Committee meeting | Friday, December 4, 2026 |
| Past agenda appearances | Sep 17, 2025 — item 7 "External auditor: performance review and reappointment approach" (for discussion). Dec 3, 2025 — item 6 "Reappointment of external auditor for FY2026" (for decision). |
| Dec 3, 2025 minutes | Approved; published in book "Audit Committee — March 2026". Decision: recommend reappointment of Halden & Brooke LLP for FY2026. Condition: run a competitive audit tender before the FY2028 audit. Deferred: review of the non-audit services policy, to Q4 2026. |
| Decision Hub approval | "Recommend reappointment of Halden & Brooke LLP as external auditor for FY2026". Audit Committee. Opened Nov 26, 2025, closed Dec 3, 2025. Outcome: approved. Votes: 4 for, 1 abstained (Elena Rossi). Janice: for. Approved FY2026 audit fee: $4.2M. Signed resolution PDF attached. |
| Task Hub project | "Audit Committee — December 2026 book", owner Sarah Okafor, status in progress |
| Request 1 to Janice | "Audit Committee chair's report: auditor reappointment" — due Nov 27, 2026 — not started |
| Request 2 to Janice | "Auditor independence confirmation (signed copy)" — due Dec 5, 2026 — not started — ⚠ due after the Dec 4 meeting |
| Data Room location | Janice's private workspace → Audit Committee → Auditor correspondence |
| Signed letter | "Halden & Brooke LLP — Annual independence confirmation FY2026 (signed)", signed Oct 9, 2026. Page 3: non-audit fees for FY2026 to date $0.76M, 18% of the audit fee; all services pre-approved under the non-audit services policy. |
| Draft letter | Same title, "(draft)", Sep 2026, same folder. Page 3 shows $0.88M, 21%. Used only to show signed-over-draft ranking. |

---

## New documents and page images

Add these to `DocumentId`, `DOCUMENTS` and `public/doc-pages/<id>/page-N.png`. Match the existing page images (764 × 990 px, same typographic style). Look at `public/doc-pages/minutes-q4-2025` first.

Suggested way to make the images: author each page as a small HTML file in the existing style and render to PNG with a headless browser script. Keep the script outside `src/` (e.g. `scripts/`), and don't add it to the app bundle.

| DocumentId | Title | Book / location | Pages |
|---|---|---|---|
| `ac-agenda-sep-2025` | Agenda — Audit Committee, September 17, 2025 | Book "Audit Committee — September 2025" | 1 cover, 2 agenda (item 7 visible) |
| `ac-agenda-dec-2025` | Agenda — Audit Committee, December 3, 2025 | Book "Audit Committee — December 2025" | 1 cover, 2 agenda (item 6 visible) |
| `ac-minutes-dec-2025` | Minutes — Audit Committee, December 3, 2025 | Book "Audit Committee — March 2026" | 1 cover, 2 attendance and agenda, 3 item 6: external auditor reappointment (decision, condition, deferred item) |
| `dh-auditor-reappointment-fy2026` | Resolution — Reappointment of external auditor for FY2026 (signed) | Decision Hub | 1 cover, 2 resolution text and fee, 3 signatures |
| `hb-independence-fy2026-signed` | Halden & Brooke LLP — Annual independence confirmation FY2026 (signed) | Data Room · My workspace | 1 cover, 2 independence statement, 3 non-audit fees (highlight the 18% paragraph) |
| `hb-independence-fy2026-draft` | Halden & Brooke LLP — Annual independence confirmation FY2026 (draft) | Data Room · My workspace | 1 cover, 3 non-audit fees (21%) — page 2 can be omitted |

`DocumentDef.book` / `bookId` assume a book. For Decision Hub and Data Room documents, extend the type minimally (for example an optional `location` label) rather than inventing fake books. The preview should still open at the cited page.

---

## Source module badges

Add an optional field to `Source` in `mockData.ts`:

```ts
module?: "Books" | "Task Hub" | "Decision Hub" | "Data Room";
```

- `SourcesBlock` shows the module as a small Atlas chip/badge on each source card.
- Under each demo answer, show a one-line row of the modules used, e.g. "Searched: Task Hub · Books". Only in demo mode.
- Task Hub sources have no document. Their card opens nothing (or a simple "Open in Task Hub" link that does nothing). Check how `SourcesBlock` handles a source without `documentId`.

---

## The six steps

Thinking label: show the listed label in `AIChatThinkingIndicator` for about 1.2 s per label, in sequence, before the answer appears.

Copy rules: sentence case, short, no claims beyond the sources, cite every factual sentence. `[n]` below = a `Cite` span with that source index.

### Step 1 — what do I owe

**Prompt:** `What do I owe for the December Audit Committee book, and is anything due after the meeting?`

**Thinking labels:** "Searching Task Hub…" → "Checking meeting dates…"

**Sources:**
1. Task Hub — "Audit Committee — December 2026 book" · Request: chair's report (module Task Hub)
2. Task Hub — "Audit Committee — December 2026 book" · Request: independence confirmation (module Task Hub)

**Answer:**

> Sarah Okafor has sent you 2 requests for the December 4 Audit Committee book.
>
> | Request | Due | Status |
> |---|---|---|
> | Audit Committee chair's report: auditor reappointment [1] | Nov 27 | Not started |
> | Auditor independence confirmation (signed copy) [2] | Dec 5 ⚠ | Not started |
>
> The independence confirmation is due the day after the meeting, so it won't make it into the book unless it arrives earlier. [2]
>
> I'm only showing requests sent to you.

**Visual (stretch):** under the table, a small date strip for Nov 12 → Dec 5 with markers: today, Nov 27, Dec 4 meeting, Dec 5 (warning colour). Use Atlas components/tokens; skip if it costs more than an hour.

**Callout rail:**
- Source: Task Hub
- Today: AGAI can't answer this. Task Hub isn't indexed.
- Unlocked by: indexing Task Hub & Document Collection
- Use case: Task Hub UC1 (deadline crossing), UC3

### Step 2 — agenda history

**Prompt:** `When did auditor reappointment last come up on our agenda?`

**Thinking labels:** "Searching board books…"

**Sources:**
1. Agenda — Audit Committee, September 17, 2025 · p.2 (Books)
2. Agenda — Audit Committee, December 3, 2025 · p.2 (Books)

**Answer:**

> It came up twice in the last 14 months:
>
> - September 17, 2025, item 7: external auditor performance review and reappointment approach, for discussion. [1]
> - December 3, 2025, item 6: reappointment of the external auditor for FY2026, for decision. [2]
>
> It's not on an agenda since then. The December 2026 agenda isn't published yet.

**Split view (stretch):** a right-side panel showing the two agenda items on a simple timeline, items clickable to the cited page. If time is short, the inline list is enough.

**Callout rail:**
- Source: Books (finalised agendas)
- Today: Already possible. Agendas are inside published books.
- Unlocked by: nothing new
- Use case: Agendas UC3

### Step 3 — what did we decide

**Prompt:** `What did we decide in December 2025?`

**Thinking labels:** "Searching board books…"

**Sources:**
1. Minutes — Audit Committee, December 3, 2025 · p.3 (Books, in "Audit Committee — March 2026")

**Answer:**

> The committee agreed to recommend reappointing Halden & Brooke LLP as external auditor for FY2026. [1]
>
> - Condition: run a competitive audit tender before the FY2028 audit. [1]
> - Deferred: the review of the non-audit services policy, moved to Q4 2026. [1]
>
> The deferred review falls in this quarter, so it may come up on December 4.

**Callout rail:**
- Source: Books (approved minutes)
- Today: Already possible. Approved minutes are inside published books.
- Unlocked by: nothing new
- Use case: Minutes UC1

### Step 4 — how did we vote

**Prompt:** `How did the committee vote, and how did I vote? What fee was approved?`

**Thinking labels:** "Searching Decision Hub…"

**Sources:**
1. Decision Hub — "Recommend reappointment of Halden & Brooke LLP as external auditor for FY2026" (Decision Hub)
2. Resolution — Reappointment of external auditor for FY2026 (signed) · p.2 (Decision Hub)
3. Resolution — Reappointment of external auditor for FY2026 (signed) · p.3 (Decision Hub)

**Answer:**

> The approval closed on December 3, 2025 and was approved. [1]
>
> | Vote | Count |
> |---|---|
> | For | 4 [1] |
> | Abstained | 1 [1] |
> | Against | 0 [1] |
>
> You voted for. [1] The approved FY2026 audit fee is $4.2M. [2] The signed resolution is attached to the approval. [3]

**Visual:** keep the table. Optional stretch: a small horizontal bar for 4 / 1 / 0 using tokens.

**Callout rail:**
- Source: Decision Hub
- Today: AGAI can't answer this. Votes and approval details aren't in books.
- Unlocked by: indexing Decision Hub
- Use case: Approvals UC2 (director history), UC3 (approval properties); Decision Hub UC1

### Step 5 — find the letter, get the passage

**Prompt:** `Find the independence letter the auditor sent me this year. What does it say about non-audit fees?`

**Thinking labels:** "Searching Data Room…" → "Checking versions…"

**Sources:**
1. Halden & Brooke LLP — Annual independence confirmation FY2026 (signed) · p.3 (Data Room · My workspace)
2. Halden & Brooke LLP — Annual independence confirmation FY2026 (draft) · p.3 (Data Room · My workspace)

**Answer:**

> Non-audit fees for FY2026 so far are $0.76M, 18% of the audit fee, and all were pre-approved under the non-audit services policy. [1]
>
> The letter is in your workspace: Audit Committee → Auditor correspondence. It was signed on October 9, 2026. [1]
>
> There's also a September draft in the same folder with a different figure (21%). I used the signed version. [2]

Clicking [1] opens the preview at page 3 with the passage visible.

**Callout rail:**
- Source: Data Room
- Today: AGAI can't answer this. Data Room isn't indexed.
- Unlocked by: indexing Data Room
- Use case: Data Room UC1 (locate by description), UC2 (find the passage; signed outranks draft)

### Step 6 — share with pre-check (action)

**Prompt:** `Share it with Sarah for the December book.`

**Thinking labels:** "Checking Sarah's access…"

**Sources:**
1. Halden & Brooke LLP — Annual independence confirmation FY2026 (signed) (Data Room · My workspace)

**Answer:** a confirmation card inside the AI message (use an Atlas card/alert pattern from the MCP):

> **Share this file with Sarah Okafor?**
> Halden & Brooke LLP — Annual independence confirmation FY2026 (signed) [1]
> Sarah will get view access to this file only. Nothing else in your workspace is shared.
> [Share] [Cancel]

- **Share** → card collapses to: "Shared with Sarah Okafor. She'll get the usual Data Room share notification." Then a follow-up line: "Your independence confirmation request is now covered before the meeting."
- **Cancel** → "Okay, nothing was shared."
- Nothing happens until the user clicks Share.

**Callout rail:**
- Source: Data Room (+ Task Hub context from step 1)
- Today: Not possible from AGAI.
- Unlocked by: indexing Data Room + share with pre-check
- Use case: Data Room future-forward: "Share with pre-check"

---

## Callout rail (component spec)

- Sits to the right of the chat, outside the answer, so it never covers citations or source cards.
- Content per step: "Step n of 6", the four lines above (Source, Today, Unlocked by, Use case).
- "Today" line uses a muted/negative token when AGAI can't answer, and a positive token when "Already possible".
- A running tally at the bottom: "Possible today: 2 of 6".
- "Hide notes" toggle. Hidden state persists only for the session.

---

## Intro screen 1 — "Meet Janice"

- Title: "Janice Whitfield, Audit Committee chair"
- Body:
  - Independent director at Meridian Capital Group.
  - The Audit Committee meets on December 4. The main item is reappointing the external auditor for FY2027.
  - Sarah, the company secretary, has asked her for a chair's report and the auditor's signed independence confirmation.
  - Before she writes, she needs the history: what was discussed, what was decided, how the committee voted, and what the auditor told her this year.

## Intro screen 2 — "How Janice does this today"

Headline: "4 places to look. 2 dates to remember. Nothing connects them."

A horizontal step strip (Atlas stepper or cards):

1. Reads the Document Collection email with Sarah's 2 requests.
2. Opens the September and December 2025 Audit Committee books to find the agenda items.
3. Opens the March 2026 book to read the December minutes.
4. Opens Decision Hub to find the approval and the votes.
5. Searches her Data Room workspace for the signed independence letter.
6. Shares the file with Sarah from the Data Room.

Footer line: "Today AGAI can help with steps 2 and 3 only. Let's see what changes when it can search everything she can access."

Do not add time estimates.

## Summary screen — "What indexing unlocks"

Table:

| Step | Question | Source | Today |
|---|---|---|---|
| 1 | What do I owe? | Task Hub | Not possible |
| 2 | Agenda history | Books | Possible |
| 3 | December decision | Books | Possible |
| 4 | Votes and fee | Decision Hub | Not possible |
| 5 | The letter and the passage | Data Room | Not possible |
| 6 | Share with Sarah | Data Room | Not possible |

Below it:

- "One question, one answer, with sources, without opening four modules."
- "Every answer is limited to what Janice can access."
- Ask (placeholder text, Fruzsina will edit): "Index Task Hub, Decision Hub and Data Room for AGAI."

---

## Out of scope

- Questionnaires, Resource Center, Messenger, Smart Builder.
- Minutes agent capabilities and any separate Minutes or Agendas index.
- Creating tasks from minutes (admins do this).
- Any change to non-demo behaviour.

## Done when

- [ ] `/demo/AGAI-integration-usecases` → intro 1 → intro 2 → chat → six steps → summary works end to end without typing.
- [ ] Every cite opens the right document at the right page; Task Hub sources don't break.
- [ ] Module badges and "Searched:" rows show on every demo answer.
- [ ] Step 6 does nothing until Share is clicked; Cancel works.
- [ ] Callout rail never overlaps the answer; "Hide notes" works.
- [ ] Restart resets the flow.
- [ ] Non-demo director and admin chats behave exactly as before.
- [ ] `npm run build` passes.

## Open questions to flag back (don't block on them)

- Whether directors see Task Hub requests addressed to them is inferred from Task Hub UC3, not confirmed with the Task Hub team (Mesi).
- Whether a Data Room share sends a notification in-product is assumed.
