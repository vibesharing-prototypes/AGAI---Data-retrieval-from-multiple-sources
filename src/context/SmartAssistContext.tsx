import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import {
  AIChatContextProvider,
  useAIChatContext,
} from "@diligentcorp/atlas-react-bundle";

import { adminBooks, type ChatMessage } from "../data/mockData.js";
import {
  mvpSourcesForScope,
  sourceScopeForPath,
  isBookReaderPath,
  type Source,
} from "../components/SourcesFilterButton.js";
import {
  type ChatThread,
  STATIC_CHAT_THREADS,
  CONVERSATION_VARIANTS,
  DIRECTOR_CONVERSATION_VARIANTS,
  DIRECTOR_HOME_CONVERSATION_VARIANTS,
  ONBOARDING_PROMPT,
  ONBOARDING_RICH_BLOCKS,
  matchTriggerResponse,
} from "../data/hybrid-search.constants.js";
import {
  isDemoPath,
  DEMO_STEPS,
  DEMO_THINKING_LABEL_MS,
  matchDemoStep,
} from "../data/demo-agai-integration-usecases.js";

export type SmartAssistAudience = "admin" | "director";

const COMPOSER_PLACEHOLDER = "Ask anything about your board materials";

// ─── Context shape ────────────────────────────────────────────────────────────

interface SmartAssistContextValue {
  messages: ChatMessage[];
  sources: Source[];
  isGenerating: boolean;
  prompt: string;
  setPrompt: (value: string) => void;
  // Cross-surface "focus the composer" signal. Selecting a prompt template
  // bumps the nonce via requestComposerFocus(); whichever composer is mounted
  // consumes it once (consumeComposerFocus) and focuses its input. The
  // consume-once design covers the case where selecting a template also opens
  // a surface (e.g. the admin home rail opening the panel), so the focus lands
  // after the input mounts rather than being lost.
  composerFocusNonce: number;
  requestComposerFocus: () => void;
  consumeComposerFocus: () => boolean;
  // Opening personalization from the docked panel promotes Smart Assist to the
  // full-screen overlay (via the panel's own onExpand) and shows the
  // personalization page there. This is the signal half: same consume-once
  // nonce design as the composer focus signal — the overlay consumes the
  // request once it's the visible surface.
  requestPersonalization: () => void;
  consumePersonalizationRequest: () => boolean;
  panelOpen: boolean;
  overlayOpen: boolean;
  openPanel: () => void;
  openSmartAssist: () => void;
  openInBook: () => void;
  closePanel: () => void;
  closeOverlay: () => void;
  expandToOverlay: () => void;
  collapseToPanel: () => void;
  // Session-only memory of the director closing GovernAI inside a book. Once
  // true, re-entering a book keeps the panel closed until the page is
  // refreshed (in-memory state resets on full reload).
  bookPanelDismissed: boolean;
  setBookPanelDismissed: (v: boolean) => void;
  handleSend: (text: string, opts?: { newSession?: boolean }) => void;
  handleToggleSource: (id: string) => void;
  // ─── MVP conversation scope (book vs. global) ──────────────────────────────
  // The source selector shows only inside a book; outside it, a book-scoped
  // chat surfaces as a removable context chip (see SourcesFilterButton).
  inBook: boolean;                  // current route is a book reader
  currentBookTitle: string | null;  // title of the book currently open (route)
  bookScopeTitle: string | null;    // book the chat is scoped to (chip); null = global
  isBookScope: boolean;             // whether the chat is scoped to a book
  setBookScope: () => void;
  setGlobalScope: () => void;
  composerPlaceholder: string;      // scope-aware composer placeholder (MVP)
  resetChat: () => void;
  deleteAllThreads: () => void;
  loadThread: (messages: ChatMessage[], threadId?: string) => void;
  threads: ChatThread[];
  // ID of the thread currently awaiting an AI-generated title. The thread is
  // excluded from `threads` until the title resolves; once it arrives it becomes
  // visible in the list with its real name.
  generatingTitleForThreadId: string | null;
  chatTimestamp: string | null;
  threadSplitIndex: number | null;
  currentThreadId: string | null;
  overlayLeftPanelOpen: boolean;
  setOverlayLeftPanelOpen: (open: boolean) => void;
  activeTab: number;
  setActiveTab: (v: number) => void;
  selectedInsight: "summary" | "prep" | "risk" | "audit" | null;
  setSelectedInsight: (v: "summary" | "prep" | "risk" | "audit" | null) => void;
  audience: SmartAssistAudience;
  setAudience: (v: SmartAssistAudience) => void;
  // ─── AGAI integration use cases demo (the director view) ───────────────────────────────
  // Everything below is inert outside demo mode.
  demoMode: boolean;
  /** Scripted answers delivered so far (= index of the next step to prompt). */
  demoStepsDone: number;
  /** While a scripted answer is pending: which step is generating and which of
   *  its reasoning steps is active. Null otherwise. */
  demoPending: { step: number; active: number } | null;
  /** Outcome of the step 6 share confirmation. */
  demoShare: "pending" | "shared" | "cancelled";
  resolveDemoShare: (v: "shared" | "cancelled") => void;
  /** Presenter notes panel (header notes button toggles it). Persists for the session. */
  demoNotesOpen: boolean;
  setDemoNotesOpen: (open: boolean) => void;
  /** Start over: fresh chat, share card back to pending. */
  restartDemo: () => void;
}

const SmartAssistContext = createContext<SmartAssistContextValue | null>(null);

const formatChatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

// Resolve the active book's title from a reader path (.../books/:id) for the
// scope-switch notice. directorBooks is a subset of adminBooks, so adminBooks
// covers both readers. Returns undefined for non-reader paths.
const bookTitleForPath = (pathname: string): string | undefined => {
  const id = pathname.match(/\/books\/([^/]+)/)?.[1];
  return id ? adminBooks.find((b) => b.id === id)?.title : undefined;
};

export function useSmartAssist() {
  const ctx = useContext(SmartAssistContext);
  if (!ctx) throw new Error("useSmartAssist must be inside SmartAssistProvider");
  return ctx;
}

// ─── Inner provider (needs to be inside AIChatContextProvider) ────────────────

function SmartAssistProviderInner({ children }: { children: React.ReactNode }) {
  const { setIsGenerating, isGenerating, setPrompt, prompt } = useAIChatContext();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const location = useLocation();
  // The director view IS the demo: no URL flag, so it survives any navigation.
  const demoMode = isDemoPath(location.pathname);
  const [demoPending, setDemoPending] = useState<{ step: number; active: number } | null>(null);
  const [demoNotesOpen, setDemoNotesOpenState] = useState(
    () => sessionStorage.getItem("agai-integration-usecases-demo-notes-open") !== "0",
  );
  const setDemoNotesOpen = (open: boolean) => {
    setDemoNotesOpenState(open);
    sessionStorage.setItem("agai-integration-usecases-demo-notes-open", open ? "1" : "0");
  };
  const [demoShare, setDemoShare] = useState<"pending" | "shared" | "cancelled">("pending");
  const demoTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearDemoTimers = () => {
    demoTimersRef.current.forEach(clearTimeout);
    demoTimersRef.current = [];
    setDemoPending(null);
  };
  const inBook = isBookReaderPath(location.pathname);
  const currentBookTitle = inBook ? (bookTitleForPath(location.pathname) ?? "This book") : null;
  const [sources, setSources] = useState<Source[]>(() =>
    mvpSourcesForScope(sourceScopeForPath(location.pathname), bookTitleForPath(location.pathname)),
  );
  // ─── Conversation-pinned scope (MVP) ────────────────────────────────────────
  // Scope belongs to the conversation, not the page. While a chat is new/empty
  // the default selection follows the current location; the first message PINS
  // it, after which navigation never changes scope silently. A pinned book-scoped
  // chat carried outside its book surfaces as a removable context chip (see
  // SourcesFilterButton); the selector itself is only shown inside a book.
  const scopePinnedRef = useRef(false); // false while chat is new/empty

  // While the chat is empty and unpinned, the default selection follows the
  // current location. Once pinned (first send) or non-empty, this bails so the
  // conversation's scope is held.
  useEffect(() => {
    if (scopePinnedRef.current || messages.length > 0) return;
    setSources(mvpSourcesForScope(sourceScopeForPath(location.pathname), bookTitleForPath(location.pathname)));
  }, [location.pathname, messages.length]);

  // Re-seed the (unpinned) scope when a fresh conversation begins, from the
  // current location.
  const reseedScopeForFreshChat = () => {
    scopePinnedRef.current = false;
    setSources(mvpSourcesForScope(sourceScopeForPath(location.pathname), bookTitleForPath(location.pathname)));
  };

  // MVP scope readouts + setters, derived from the two-source selection.
  const bookSource = sources.find((s) => s.id === "this-book");
  const isBookScope = bookSource?.enabled === true;
  const bookScopeTitle = isBookScope ? (bookSource?.label ?? null) : null;
  const setBookScope = () => setSources(mvpSourcesForScope("book", currentBookTitle ?? "This book"));
  const setGlobalScope = () => setSources(mvpSourcesForScope("home"));
  const composerPlaceholder = COMPOSER_PLACEHOLDER;
  const [variantIndex, setVariantIndex] = useState(0);
  const [audience, setAudienceState] = useState<SmartAssistAudience>("admin");
  const audienceRef = useRef<SmartAssistAudience>("admin");
  audienceRef.current = audience;
  // Switching persona (director ↔ admin) is a fresh start: wipe all Smart
  // Assist UI + conversation state so e.g. an Insights tab or GovernAI view
  // opened as a director doesn't carry over into the admin experience.
  const setAudience = (v: SmartAssistAudience) => {
    if (audienceRef.current === v) return;
    audienceRef.current = v;
    setAudienceState(v);
    setVariantIndex(0);
    setActiveTab(0);
    setSelectedInsight(null);
    setPanelOpen(false);
    setOverlayOpen(false);
    setPreferredMode(null);
    setBookPanelDismissed(false);
    setMessages([]);
    setChatTimestamp(null);
    setCurrentThreadId(null);
    setThreadSplitIndex(null);
    hasInteractedWithThread.current = false;
    reseedScopeForFreshChat();
  };
  const [panelOpen, setPanelOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  // Session-only preference for how Smart Assist opens. `null` means the user
  // hasn't picked a mode yet, so each surface falls back to its own default
  // (overlay outside a book, panel inside a book). Once the user expands or
  // collapses, the explicit choice is remembered everywhere — including the
  // book — until the page is refreshed.
  const [preferredMode, setPreferredMode] = useState<"overlay" | "panel" | null>(null);
  const [userThreads, setUserThreads] = useState<ChatThread[]>([]);
  const [staticThreadsCleared, setStaticThreadsCleared] = useState(false);
  const [generatingTitleForThreadId, setGeneratingTitleForThreadId] = useState<string | null>(null);
  const [chatTimestamp, setChatTimestamp] = useState<string | null>(null);
  const [threadSplitIndex, setThreadSplitIndex] = useState<number | null>(null);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [overlayLeftPanelOpen, setOverlayLeftPanelOpen] = useState(true);
  const [bookPanelDismissed, setBookPanelDismissed] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedInsight, setSelectedInsight] = useState<"summary" | "prep" | "risk" | null>(null);
  // Composer focus signal (see context type for rationale). The consumed ref
  // lives at provider level so it survives a composer mounting/unmounting.
  const [composerFocusNonce, setComposerFocusNonce] = useState(0);
  const composerFocusConsumed = useRef(0);
  const requestComposerFocus = useCallback(() => setComposerFocusNonce((n) => n + 1), []);
  // Identity changes only when the nonce does, so a consumer's focus effect
  // re-runs on a new request but not on every unrelated provider render.
  const consumeComposerFocus = useCallback(() => {
    if (composerFocusNonce > composerFocusConsumed.current) {
      composerFocusConsumed.current = composerFocusNonce;
      return true;
    }
    return false;
  }, [composerFocusNonce]);
  // Personalization-fullscreen signal (see context type for rationale).
  const [personalizationNonce, setPersonalizationNonce] = useState(0);
  const personalizationConsumed = useRef(0);
  const consumePersonalizationRequest = useCallback(() => {
    if (personalizationNonce > personalizationConsumed.current) {
      personalizationConsumed.current = personalizationNonce;
      return true;
    }
    return false;
  }, [personalizationNonce]);
  // Tracks last activity time for each thread (overrides updatedAt for sort order)
  const [threadLastActivity, setThreadLastActivity] = useState<Record<string, string>>({});
  // True only after the user sends a message in the current thread; reset on thread load/new chat
  const hasInteractedWithThread = useRef(false);
  // Dedup guard: tracks the timestamp of the last handleSend call to prevent
  // accidental double-fires (e.g. Enter + button click, or StrictMode double-invoke).
  const lastSendAtRef = useRef(0);

  // If the user closes Smart Assist and then navigates to a different page,
  // the next time they open it should be a brand-new session — fresh chat,
  // Insights back at the hub. Leaving it open across nav, or closing and
  // reopening on the same page, both preserve the existing session.
  const lastPathRef = useRef(location.pathname);
  const [pendingFreshOpen, setPendingFreshOpen] = useState(false);
  useEffect(() => {
    if (lastPathRef.current !== location.pathname) {
      if (!panelOpen && !overlayOpen) setPendingFreshOpen(true);
      lastPathRef.current = location.pathname;
    }
  }, [location.pathname, panelOpen, overlayOpen]);
  const consumeFreshOpen = () => {
    if (!pendingFreshOpen) return;
    setMessages([]);
    setChatTimestamp(null);
    setCurrentThreadId(null);
    setThreadSplitIndex(null);
    hasInteractedWithThread.current = false;
    setActiveTab(0);
    setSelectedInsight(null);
    setPendingFreshOpen(false);
    reseedScopeForFreshChat();
  };

  const threads = [...userThreads, ...(staticThreadsCleared ? [] : STATIC_CHAT_THREADS)]
    .filter((t) => t.id !== generatingTitleForThreadId && !t.projectId)
    .sort((a, b) => {
      const aDate = threadLastActivity[a.id] ?? a.updatedAt;
      const bDate = threadLastActivity[b.id] ?? b.updatedAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

  const handleToggleSource = (id: string) =>
    setSources((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));

  // Sync user thread messages and last-activity whenever AI finishes responding,
  // but only if the user actually sent a message (not just selected the thread).
  useEffect(() => {
    if (currentThreadId && messages.length > 0 && !isGenerating && hasInteractedWithThread.current) {
      const now = new Date().toISOString();
      setUserThreads((prev) => prev.map((t) =>
        t.id === currentThreadId
          ? { ...t, messages: [...messages], updatedAt: now }
          : t
      ));
      setThreadLastActivity((prev) => ({ ...prev, [currentThreadId]: now }));
    }
  }, [messages.length, isGenerating, currentThreadId]);

  const handleSend = (text: string, opts?: { newSession?: boolean }) => {
    const now = Date.now();
    if (now - lastSendAtRef.current < 500) return;
    lastSendAtRef.current = now;
    hasInteractedWithThread.current = true;
    // Sending a message is always a chat action — make sure Smart Assist is on
    // the chat tab so the response is visible, not stuck on the Insights tab
    // (e.g. after opening a Smart Summary earlier this session).
    setActiveTab(0);
    setSelectedInsight(null);

    const isOnboarding = text.trim() === ONBOARDING_PROMPT;
    // AGAI integration use cases demo: an exact scripted prompt returns its authored answer.
    const demoIdx = demoMode ? matchDemoStep(text) : -1;
    const demoStep = demoIdx >= 0 ? DEMO_STEPS[demoIdx] : null;
    const triggerMatch = demoStep
      ? { threadTitle: demoStep.threadTitle, sources: demoStep.sources, richContent: demoStep.richContent }
      : !isOnboarding ? matchTriggerResponse(text) : null;
    const variantPool = audienceRef.current === "director"
      ? (inBook ? DIRECTOR_CONVERSATION_VARIANTS : DIRECTOR_HOME_CONVERSATION_VARIANTS)
      : CONVERSATION_VARIANTS;
    const responseVariant = variantPool[variantIndex % variantPool.length];

    // Build the user bubble — for trigger matches use the verbatim typed text.
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: isOnboarding ? text : (triggerMatch ? text : responseVariant.userQuestion),
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };

    // `newSession` forces a fresh thread even if a previous conversation is
    // still in state — used by the home-page widget, which is always a new
    // chat entry point regardless of what was open before.
    const startNew = opts?.newSession || messages.length === 0;
    if (startNew) {
      // First message pins the conversation's scope to whatever is selected
      // (auto-default or a manual override) at the location it began.
      scopePinnedRef.current = true;
      // New chat: auto-create thread, date shown at top
      const now = new Date().toISOString();
      // The demo story happens on Thursday, November 12, 2026.
      setChatTimestamp(formatChatDate(demoMode ? "2026-11-12T12:00:00" : now));
      setThreadSplitIndex(null);
      const id = `u-${Date.now()}`;
      // Create thread with an empty title so the list hides it until the title
      // arrives. Title is generated asynchronously (simulated AI call).
      setUserThreads((prev) => [{ id, title: "", createdAt: now, updatedAt: now, messages: [userMsg] }, ...prev]);
      setCurrentThreadId(id);
      setThreadLastActivity((prev) => ({ ...prev, [id]: now }));
      setGeneratingTitleForThreadId(id);
      // Simulate async AI title generation using the variant's pre-authored
      // ≤5-word title, then reveal the thread in the list.
      setTimeout(() => {
        const title = isOnboarding
          ? "Welcome"
          : (triggerMatch ? triggerMatch.threadTitle : responseVariant.threadTitle);
        setUserThreads((prev) =>
          prev.map((t) => (t.id === id ? { ...t, title } : t)),
        );
        setGeneratingTitleForThreadId(null);
      }, 800);
    } else {
      // Continuing a loaded thread: show date before first new message, unless already used today
      if (!chatTimestamp && threadSplitIndex !== -1) setChatTimestamp(formatChatDate(new Date().toISOString()));
      if (currentThreadId) {
        setThreadLastActivity((prev) => ({ ...prev, [currentThreadId]: new Date().toISOString() }));
      }
    }
    setMessages((prev) => (startNew ? [userMsg] : [...prev, userMsg]));
    setPrompt("");
    setIsGenerating(true);

    // Scripted demo answers show each thinking label in turn before the answer.
    const answerDelay = demoStep ? demoStep.reasoning.length * DEMO_THINKING_LABEL_MS : 1800;
    if (demoStep) {
      clearDemoTimers();
      if (demoStep.action === "share") setDemoShare("pending");
      setDemoPending({ step: demoIdx, active: 0 });
      demoStep.reasoning.forEach((_, i) => {
        if (i === 0) return;
        demoTimersRef.current.push(
          setTimeout(() => setDemoPending({ step: demoIdx, active: i }), i * DEMO_THINKING_LABEL_MS),
        );
      });
    }

    const answerTimer = setTimeout(() => {
      if (demoStep) setDemoPending(null);
      const richContent = isOnboarding
        ? ONBOARDING_RICH_BLOCKS
        : (triggerMatch ? triggerMatch.richContent : responseVariant.richContent);
      const sources = isOnboarding
        ? []
        : (triggerMatch ? triggerMatch.sources : responseVariant.sources);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai" as const,
          content: "",
          richContent,
          sources,
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          ...(demoStep ? { demoStep: demoIdx } : {}),
        },
      ]);
      if (!isOnboarding && !triggerMatch) setVariantIndex((i) => (i + 1) % variantPool.length);
      setIsGenerating(false);
    }, answerDelay);
    if (demoStep) demoTimersRef.current.push(answerTimer);
  };

  const demoStepsDone = demoMode ? messages.filter((m) => m.demoStep !== undefined).length : 0;

  const resetDemoState = () => {
    clearDemoTimers();
    setDemoShare("pending");
    setIsGenerating(false);
  };

  return (
    <SmartAssistContext.Provider
      value={{
        messages,
        sources,
        isGenerating,
        prompt,
        setPrompt,
        composerFocusNonce,
        requestComposerFocus,
        consumeComposerFocus,
        requestPersonalization: () => setPersonalizationNonce((n) => n + 1),
        consumePersonalizationRequest,
        panelOpen,
        overlayOpen,
        openPanel: () => { consumeFreshOpen(); setPanelOpen(true); },
        openSmartAssist: () => {
          consumeFreshOpen();
          // Outside a book: default to overlay unless the user chose panel.
          if (preferredMode === "panel") setPanelOpen(true);
          else setOverlayOpen(true);
        },
        openInBook: () => {
          consumeFreshOpen();
          // Inside a book: default to the docked panel unless the user chose overlay.
          if (preferredMode === "overlay") setOverlayOpen(true);
          else setPanelOpen(true);
        },
        closePanel: () => setPanelOpen(false),
        closeOverlay: () => setOverlayOpen(false),
        expandToOverlay: () => { setPanelOpen(false); setOverlayOpen(true); setPreferredMode("overlay"); },
        collapseToPanel: () => { setOverlayOpen(false); setPanelOpen(true); setPreferredMode("panel"); },
        bookPanelDismissed,
        setBookPanelDismissed,
        handleSend,
        handleToggleSource,
        inBook,
        currentBookTitle,
        bookScopeTitle,
        isBookScope,
        setBookScope,
        setGlobalScope,
        composerPlaceholder,
        resetChat: () => {
          resetDemoState();
          setMessages([]);
          setChatTimestamp(null);
          setCurrentThreadId(null);
          setThreadSplitIndex(null);
          hasInteractedWithThread.current = false;
          reseedScopeForFreshChat();
        },
        deleteAllThreads: () => {
          setUserThreads([]);
          setStaticThreadsCleared(true);
          setMessages([]);
          setChatTimestamp(null);
          setCurrentThreadId(null);
          setThreadSplitIndex(null);
          hasInteractedWithThread.current = false;
          reseedScopeForFreshChat();
        },
        loadThread: (msgs: ChatMessage[], threadId?: string) => {
          hasInteractedWithThread.current = false;
          setMessages(msgs);
          setChatTimestamp(null);
          setCurrentThreadId(threadId ?? null);
          const usedToday = threadId && threadLastActivity[threadId]
            ? new Date(threadLastActivity[threadId]).toDateString() === new Date().toDateString()
            : false;
          // -1 = already used today, skip separator; ≥0 = separator before first new message
          setThreadSplitIndex(usedToday ? -1 : msgs.length);
          // A loaded thread is an existing conversation: pin so navigation
          // holds its scope. (Per-thread scope isn't persisted in this MVP, so
          // the chip/dropdown reflects the current selection.)
          scopePinnedRef.current = true;
        },
        threads,
        generatingTitleForThreadId,
        chatTimestamp,
        threadSplitIndex,
        currentThreadId,
        overlayLeftPanelOpen,
        setOverlayLeftPanelOpen,
        activeTab,
        setActiveTab,
        selectedInsight,
        setSelectedInsight,
        audience,
        setAudience,
        demoMode,
        demoStepsDone,
        demoPending,
        demoNotesOpen,
        setDemoNotesOpen,
        demoShare,
        resolveDemoShare: setDemoShare,
        restartDemo: () => {
          resetDemoState();
          setMessages([]);
          setChatTimestamp(null);
          setCurrentThreadId(null);
          setThreadSplitIndex(null);
          hasInteractedWithThread.current = false;
          setPrompt("");
          reseedScopeForFreshChat();
        },
      }}
    >
      {children}
    </SmartAssistContext.Provider>
  );
}

// ─── Exported provider ────────────────────────────────────────────────────────

export function SmartAssistProvider({ children }: { children: React.ReactNode }) {
  return (
    <AIChatContextProvider>
      <SmartAssistProviderInner>{children}</SmartAssistProviderInner>
    </AIChatContextProvider>
  );
}
