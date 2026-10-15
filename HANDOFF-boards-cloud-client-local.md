# Handoff: Boards Cloud Client Local — AI Feature Integration

## What this is

Port the AI features from the `bcloud-aibm` prototype into a new sibling prototype that mirrors the actual Boards Cloud Client UI shell. The goal is a prototype that stakeholders can view as "boards-cloud-client with GovernAI AI fully wired in" — not the simpler admin+director home of bcloud-aibm, but the real Boards Cloud navigation and pages with the same AI panel, chatbox, expert skills, preferences, and tools layered on top.

---

## Source project

All features to port are implemented and working in:

```
/Users/ffuntek/vibesharing-prototypes/bcloud-aibm/
```

Reference these source files for every feature below. Do **not** re-invent anything — copy, adapt, and retarget.

---

## Target project

Create a new Vite + Atlas prototype at:

```
/Users/ffuntek/vibesharing-prototypes/boards-cloud-client-local/
```

### Bootstrap

Scaffold it the same way as `bcloud-aibm`:

```bash
npm create vite@latest boards-cloud-client-local -- --template react-ts
cd boards-cloud-client-local
```

Then copy `package.json` dependencies from the source prototype exactly (see `bcloud-aibm/package.json`). The key dependency is:

```json
"@diligentcorp/atlas-react-bundle": "https://atlas.diligent.com/react-bundle.tgz"
```

Copy these files verbatim from `bcloud-aibm/` into the new project (they are environment-generic and do not need changes):

- `src/assets/smart-assist-avatar.svg`
- `src/context/SmartAssistContext.tsx`
- `src/context/CitationPreviewContext.tsx`
- `src/data/hybrid-search.constants.ts`
- `src/components/AiDisclaimers.tsx`
- `src/components/AIMoreMenu.tsx`
- `src/components/ChatThreadItem.tsx`
- `src/components/CitationPreviewPanel.tsx`
- `src/components/DeleteAllChatsMenu.tsx`
- `src/components/InsightDetailViews.tsx`
- `src/components/InsightIcons.tsx`
- `src/components/InsightTOC.tsx`
- `src/components/RichAIMessageContent.tsx`
- `src/components/SourcesBlock.tsx`
- `src/components/SourcesFilterButton.tsx`
- `src/components/SuggestionChips.tsx`

These components from `bcloud-aibm/` are the two big AI surface components — copy them and adapt only the `title` prop default and the `org/user name` string:

- `src/components/SmartAssistOverlay.tsx` → the full-screen AI experience
- `src/components/SmartAssistSidenav.tsx` → the docked panel

---

## Rules (non-negotiable)

- All styles via `sx` prop only — no CSS files, no inline `style` objects
- All colors, spacing, radii, and font tokens from `useTheme()` → `tokens` unless the value is a hardcoded Figma design decision that has no Atlas token equivalent (the gradient strings like `AI_GRADIENT` are intentional exceptions)
- All imports from `@diligentcorp/atlas-react-bundle` — never from `@mui/material` when Atlas re-exports the same component
- All icons from `@diligentcorp/atlas-react-bundle/icons/[Name]`
- Global navigation: `@diligentcorp/atlas-react-bundle/global-nav`
- Do not remove `<AppLayout>` — it provides the theme, MUI-X Pro license, and `useTheme().tokens`/`useTheme().presets`
- Writing style: sentence-case everywhere (follow Diligent / Microsoft Writing Style Guide)
- The org name and logo set on `<AppLayout>` should be a plausible enterprise customer — e.g., "Meridian Corp"

---

## App shell

The boards-cloud-client UI shell has:

- **Global top nav** — Diligent global navigation bar (already in Atlas via the `global-nav` package). Set `orgName="Meridian Corp"` and `productName="Boards"`.
- **Left sidebar** — the standard Boards navigation: Dashboard, Books, Resource center, Action items. Use Atlas `SideNav` or manual `Box`/`Stack` styled to match the real app's look; keep it simple for the prototype.
- **Main content area** — fills the remaining space and hosts the per-page content.
- **AI panel slot** — the right-side docked `SmartAssistSidenav` (persistent variant, width 440px), toggled via a toolbar button in the top nav.

Place `SmartAssistContext` and `CitationPreviewContext` providers around the full app (same as `bcloud-aibm/src/App.tsx`).

---

## Feature 1 — New Atlas chatbox look and feel

**Source:** `SmartAssistOverlay.tsx` lines 1275–1325 (the `AIChatBox` usage inside `ProjectPage`) and the composer section in `SmartAssistSidenav.tsx` lines 989–1130.

The Atlas `AIChatBox` component (from `@diligentcorp/atlas-react-bundle`) is the new standard chatbox. Use it in the full-screen overlay (AI assistant page). Key styling decisions to preserve:

```tsx
<AIChatBox
  onSubmit={onSubmit}
  onStop={() => {}}
  isUploadAvailable={false}
  leadingActions={leadingActions}   // attach file, tools slider, sources filter
  trailingActions={trailingActions} // extended thinking, voice, arrow-up send
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
```

The AI gradient top-border and disclaimer are rendered manually below the box (see the section right above it in `SmartAssistSidenav.tsx`). The gradient constant:

```ts
const AI_GRADIENT = "linear-gradient(90deg, #be0c1e 0%, #ab48da 50%, #4069fe 100%)";
```

For the **docked sidenav** composer, the source uses `InputBase` + manual toolbar (not `AIChatBox`) because the Drawer's 440px width is narrower than the chatbox minimum. Keep this as-is in the sidenav.

---

## Feature 2 — Pin chat & Projects in the thread list

**Source:** `SmartAssistSidenav.tsx` lines 233–248 (pin state) and lines 710–834 (Pinned / Projects / Chat history sections), and `SmartAssistOverlay.tsx` lines 411–850 (the `LeftPanel` component director variant, which has the richer version with hover-reveal chevrons, vertical dot menus, "View all" links, and add-to-project buttons).

### What to implement

**Thread list view** (shown when user clicks the back-arrow from a chat, or from the left panel in the full-screen overlay):

| Section | Behavior |
|---|---|
| **Pinned** | Collapsible. Shows threads the user has pinned. Pin state is in-memory `Set<string>`. Default-pin the first 2–3 threads for director audience. Section header has a hover-reveal chevron and vertical-dots menu. |
| **Projects** | Collapsible. Each project is a `ChatThread` with `isProject: true`. Children are threads with matching `projectId`. Project items expand to show child threads indented under a vertical connector line. Section header hover-reveals "new chat in project" and "new project folder" icon buttons. |
| **Chat history** | Collapsible. All un-pinned, non-project threads. Hover on section header reveals "Delete all" action. |

Thread rows: use `OverlayThreadRow` from `SmartAssistOverlay.tsx` (lines 184–367). It has a hover-reveal vertical-dots `Menu` with Pin/Rename/Delete items.

The `STATIC_CHAT_THREADS` data in `src/data/hybrid-search.constants.ts` already has project threads (`isProject: true`) and child threads (`projectId`).

---

## Feature 3 — Expert skills

**Source:** `src/components/ExpertSkillsPage.tsx` (full file) and `src/pages/ExpertSkillsPage.tsx`.

This is an in-panel full-content page that replaces the chat area when "Expert skills" is selected from the left panel footer. Copy the component as-is. The integration point:

In `SmartAssistOverlay.tsx` the `LeftPanel` component has an "Expert skills" button in its bottom footer (lines 786–818). Clicking it sets `expertSkillsActive = true` which hides the chat area and renders `<ExpertSkillsPage open={expertSkillsActive} onClose={() => setExpertSkillsActive(false)} />` in the right content area.

Skills data to preserve:
- `SKILLS` array with `id`, `label`, `desc`, `slash`, `category`, `on` fields
- `FILTER_CHIPS`: All / Finance / Legal / Technology / Risk / HR / Industry / Communications
- Tabs: Discover / Yours / Shared by your organization
- 2-column `SkillCard` grid with `Switch` + kebab menu (Remix / Chat with it)
- Search bar using Atlas `TextField` with `SearchIcon` start adornment
- Filter chips using hand-rolled `Box` buttons (no Atlas `Chip` needed — matches the exact Figma spec)

---

## Feature 4 — Preferences

**Source:** `src/components/PersonalizationPage.tsx` and `src/components/PersonalizationDialog.tsx`.

`PersonalizationPage` is the inline-panel version (used in the full-screen overlay); `PersonalizationDialog` is the modal version (used from the docked sidenav's "Preferences" footer button). Both share the same state/logic — `PersonalizationDialog.tsx` exports the helpers (`loadState`, `saveState`, `ChipSuggestions`, `LimitedTextField`, etc.) that `PersonalizationPage` imports.

Copy both files verbatim. The integration point in `SmartAssistOverlay.tsx`:

- Left panel footer has a "Preferences" button (lines 821–852)
- Clicking it sets `settingsActive = true` and renders `<PersonalizationPage open={settingsActive} onClose={() => setSettingsActive(false)} />`
- The `AIMoreMenu` also has a "Preferences" entry that opens the `PersonalizationDialog` (the modal variant)

Preferences fields to preserve:
- User role (free-text + dropdown of roles: General Counsel, Chief Risk Officer, etc.)
- "Tell Ask GovernAI about yourself" (character-limited textarea + chip suggestions)
- "How would you like Ask GovernAI to respond?" (character-limited textarea + chip suggestions)
- Apply toggle (enable/disable personalization without clearing it)
- Save / Cancel with dirty-state guard
- Toast confirmation on save

---

## Feature 5 — Tools (agent reporting + deep research)

**Source:** `SmartAssistOverlay.tsx` lines 128–163 (the `EXPERT_SKILLS` and `AGENT_REPORTING` data arrays) and the `ToolsMenu` component (search for `toolsMenuAnchor` and the Popper/Paper that renders it — approximately lines 1330–1600 in the overlay).

### What to implement

A **Tools** `Popper` menu that appears above the composer when the toolbar's slider-icon button is clicked. It has two sections:

**Expert skills in the tools menu** (these are the same skills as Feature 3 but condensed to 4 items for quick access):
```ts
const EXPERT_SKILLS = [
  { id: "audit",    label: "Audit & financial", desc: "Financial reporting, controls, the auditor",     slash: "/audit",    Icon: AuditAnalyticsIcon },
  { id: "risk",     label: "Enterprise risk",   desc: "Strategic & operational risk, concentrations",   slash: "/risk",     Icon: RiskEssentialsIcon },
  { id: "cyber",    label: "Cyber & privacy",   desc: "Security, data protection, third parties",       slash: "/cyber",    Icon: LockedIcon },
  { id: "strategy", label: "Strategy",          desc: "Board-level strategy & execution",               slash: "/strategy", Icon: StrategyIcon },
];
```

**Agent reporting** (agentic tools that @-mention into the composer):
```ts
const AGENT_REPORTING = [
  { id: "brief",         label: "Summarize & brief",  tag: "@briefcase",      desc: "Quick research synthesized into a board-ready brief.",           Icon: BriefcaseIcon },
  { id: "diligence",     label: "Investigate deeply", tag: "@diligence",      desc: "Multi-area research with risk assessment and executive summary.", Icon: ReportsIcon },
  { id: "followthrough", label: "Track commitments",  tag: "@follow-through", desc: "Tracks who owns what and what's overdue.",                       Icon: TargetIcon },
];
```

Clicking an expert skill inserts its `/slash` into the composer. Clicking an agent tool inserts its `@tag` into the composer.

The menu also has a "Deep research" section with a descriptive header and a toggle for internet access. Source the full Popper implementation from `SmartAssistOverlay.tsx` — it is built with the Atlas `Paper`/`Box`/`Stack`/`Typography` primitives, no third-party menu library.

---

## Routing / pages

Minimum pages for the prototype:

| Route | What it shows |
|---|---|
| `/` | Boards home / dashboard with the docked AI sidenav panel |
| `/books` | Books list page (can be a simple placeholder grid of book cards) with the AI panel available |
| `/ai` | Full-screen AI assistant (the `SmartAssistOverlay` — same as the AIBM prototype's `AIAssistantPage`) |

The router is `react-router` v7 (already in the bcloud-aibm package.json). Route setup follows the same pattern as `bcloud-aibm/src/App.tsx`.

---

## SmartAssistContext wiring

Copy `src/context/SmartAssistContext.tsx` verbatim. It manages:
- Chat messages and generation state
- Thread list and current thread
- Prompt / composer state
- Scope (book-scoped vs. global vs. resource center)
- Tab (chat vs. insights)
- Audience (admin vs. director)

Wrap the root app in `<SmartAssistProvider>` and `<CitationPreviewProvider>` (see `bcloud-aibm/src/App.tsx`).

---

## Things NOT to port

- The `DirectorHomePage`, `DirectorBooksPage`, `DirectorBookReaderPage`, `AdminBooksPage`, `ResourceCenterPage`, `BookEditorPage` — these are Boards-specific pages that should be rebuilt from scratch to match the actual boards-cloud-client UI patterns, or replaced with simple placeholders
- The `PasswordGate` component — remove entirely; the boards-cloud-client-local prototype is open-access
- The `BranchSelectPage` — not needed

---

## Acceptance check

Before calling it done, verify:

1. `npm run dev` starts without TypeScript errors
2. The docked sidenav opens/closes, thread list shows Pinned / Projects / Chat history sections, threads can be pinned/unpinned
3. Expert skills page renders with filter chips, search, and toggle switches
4. Preferences page renders and saves to localStorage
5. Tools Popper opens above the composer with both EXPERT_SKILLS and AGENT_REPORTING sections
6. Full-screen AI overlay opens at `/ai` with the left panel and `AIChatBox`
7. Zero hardcoded color hex values except for the intentional design constants (`AI_GRADIENT`, `AI_PURPLE`, `CHAT_BG`, `PANEL_DIVIDER`, `TEXT_DEFAULT`) that have no Atlas token equivalent
