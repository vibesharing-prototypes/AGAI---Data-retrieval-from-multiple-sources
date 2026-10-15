import { AppLayout } from "@diligentcorp/atlas-react-bundle";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router";
import { useEffect, useRef } from "react";
import { useTheme } from "@mui/material";
import "./styles.css";

import Navigation from "./Navigation.js";
import ViewSwitcherButton from "./components/ViewSwitcherButton.js";
import AskGovernAIButton from "./components/AskGovernAIButton.js";
import SettingsPage from "./pages/SettingsPage.js";
import OrganizationSettingsPage from "./pages/OrganizationSettingsPage.js";
import SimplePage from "./pages/SimplePage.js";
import AIAssistantPage from "./pages/AIAssistantPage.js";
import AdminBooksPage from "./pages/AdminBooksPage.js";
import BookEditorPage from "./pages/BookEditorPage.js";
import DirectorHomePage from "./pages/DirectorHomePage.js";
import DirectorBooksPage from "./pages/DirectorBooksPage.js";
import DirectorBookReaderPage from "./pages/DirectorBookReaderPage.js";
import DirectorResourceCenterPage from "./pages/DirectorResourceCenterPage.js";
import DirectorResourceDocumentPage from "./pages/DirectorResourceDocumentPage.js";
import ResourceCenterPage from "./pages/ResourceCenterPage.js";
import DemoIntroDialog from "./components/demo/DemoIntroDialog.js";
import DemoAgaiIntegrationUsecasesSummaryPage from "./pages/DemoAgaiIntegrationUsecasesSummaryPage.js";
import TasksPage from "./pages/TasksPage.js";
import DataRoomFolderPage from "./pages/DataRoomFolderPage.js";
import TaskDetailPage from "./pages/TaskDetailPage.js";
import ApprovalDetailPage from "./pages/ApprovalDetailPage.js";
import DemoSourceStubPage from "./pages/DemoSourceStubPage.js";
import { SmartAssistProvider, useSmartAssist } from "./context/SmartAssistContext.js";
import { CitationPreviewProvider } from "./context/CitationPreviewContext.js";

// ─── Force sidebar into persistent panel mode ─────────────────────────────────

function usePanelMode() {
  useEffect(() => {
    const trySet = () => {
      const mockNav = document.querySelector("mock-hb-global-navigator");
      const root = (mockNav as Element & { shadowRoot: ShadowRoot | null })?.shadowRoot;
      const globalNav = root?.querySelector("atlas-global-nav") as HTMLElement | null;
      if (globalNav) {
        globalNav.setAttribute("display-mode", "panel");
        return true;
      }
      return false;
    };
    if (trySet()) return;
    const id = setInterval(() => {
      if (trySet()) clearInterval(id);
    }, 100);
    return () => clearInterval(id);
  }, []);
}

// ─── Side nav extends full height (top:0) so it sits beside the header ───────
// The CSS variable --atlas-global-nav-content-left (set by Atlas on the body)
// drives margin-inline-start on both mock-hb-global-navigator (styles.css) and
// [data-atlas-gn-app] (Atlas CSS), so they stay in sync without JS measurement.
// We only need to fix atlas-global-nav's shadow DOM: .nav-container defaults to
// top:64px (below the header bar) — override to 0 so the panel spans full height.

function useNavContainerFullHeight() {
  useEffect(() => {
    const trySetup = () => {
      const mockNav = document.querySelector("mock-hb-global-navigator");
      const mockRoot = (mockNav as Element & { shadowRoot: ShadowRoot | null })?.shadowRoot;
      const globalNav = mockRoot?.querySelector("atlas-global-nav") as (Element & {
        shadowRoot: ShadowRoot | null;
      }) | null;
      if (!globalNav?.shadowRoot) return false;
      if (globalNav.shadowRoot.querySelector("#custom-nav-height-style")) return true;

      const style = document.createElement("style");
      style.id = "custom-nav-height-style";
      style.textContent = `
        .nav-container { top: 0 !important; }
        button.menu-button { display: none !important; }
        /* Remove the global-nav header's bottom stroke (header::after divider) */
        header::after { display: none !important; }
      `;
      globalNav.shadowRoot.appendChild(style);

      // atlas-gn-side-nav height is calc(100dvh - --atlas-global-header-height).
      // Setting the custom property to 0 makes it fill the full panel height.
      const sideNav = mockRoot?.querySelector("atlas-gn-side-nav") as HTMLElement | null;
      sideNav?.style.setProperty("--atlas-global-header-height", "0px");

      return true;
    };

    if (trySetup()) return;
    const id = setInterval(() => {
      if (trySetup()) clearInterval(id);
    }, 100);
    return () => clearInterval(id);
  }, []);
}

// ─── Collapsed nav: 64px, 12px padding, icons centered ───────────────────────

function useCollapsedNavStyle() {
  useEffect(() => {
    const tryInject = () => {
      const mockNav = document.querySelector("mock-hb-global-navigator");
      const mockRoot = (mockNav as Element & { shadowRoot: ShadowRoot | null })?.shadowRoot;
      const sideNav = mockRoot?.querySelector("atlas-gn-side-nav") as (Element & {
        shadowRoot: ShadowRoot | null;
      }) | null;
      if (!sideNav?.shadowRoot) return false;
      if (sideNav.shadowRoot.querySelector("#custom-collapse-style")) return true;

      const style = document.createElement("style");
      style.id = "custom-collapse-style";
      style.textContent = `
        /* Collapsed nav items container: 12px padding, icons centered */
        :host([collapsed]) nav,
        :host([collapsed]) .nav,
        :host([collapsed]) .nav-items,
        :host([collapsed]) .items,
        :host([collapsed]) ul {
          padding-inline: 12px !important;
          align-items: center !important;
        }
        /* Each slotted nav link fills the container and centers its icon */
        :host([collapsed]) ::slotted(*) {
          width: 100% !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
        }
      `;
      sideNav.shadowRoot.appendChild(style);
      return true;
    };
    if (tryInject()) return;
    const id = setInterval(() => {
      if (tryInject()) clearInterval(id);
    }, 100);
    return () => clearInterval(id);
  }, []);
}

// ─── Hide platform-injected nav items (e.g. "Home (Platform)") ───────────────

function useHidePlatformNavItems() {
  useEffect(() => {
    const tryHide = () => {
      const mockNav = document.querySelector("mock-hb-global-navigator");
      const mockRoot = (mockNav as Element & { shadowRoot: ShadowRoot | null })?.shadowRoot;
      if (!mockRoot) return false;

      // Search in mock root and any nested shadow roots one level deep
      const roots: (ShadowRoot | Element)[] = [mockRoot];
      mockRoot.querySelectorAll("*").forEach((el) => {
        const sr = (el as Element & { shadowRoot?: ShadowRoot | null }).shadowRoot;
        if (sr) roots.push(sr);
      });

      let found = false;
      roots.forEach((root) => {
        root.querySelectorAll("*").forEach((el) => {
          const label = el.getAttribute("label") ?? "";
          if (label.includes("Platform") || label === "Home") {
            (el as HTMLElement).style.display = "none";
            found = true;
          }
        });
      });
      return found;
    };
    if (tryHide()) return;
    const id = setInterval(() => {
      if (tryHide()) clearInterval(id);
    }, 100);
    return () => clearInterval(id);
  }, []);
}

// ─── Hide atlas-gn-side-nav's built-in app-name header ────────────────────────
// Uses a <style> injection instead of an inline style because the <header> is
// inside a Lit when() conditional — it is removed/recreated on every
// collapse↔expand cycle, which would wipe any inline style set on the element.
// An appended <style> persists in the shadow root independently of Lit's render.

function useHideSideNavAppName() {
  useEffect(() => {
    const tryHide = () => {
      const mockNav = document.querySelector("mock-hb-global-navigator");
      const root = (mockNav as Element & { shadowRoot: ShadowRoot | null })?.shadowRoot;
      const sideNav = root?.querySelector("atlas-gn-side-nav") as (Element & {
        shadowRoot: ShadowRoot | null;
      }) | null;
      if (sideNav?.shadowRoot) {
        if (sideNav.shadowRoot.querySelector("#custom-hide-appname-style")) return true;
        const style = document.createElement("style");
        style.id = "custom-hide-appname-style";
        style.textContent = `header { display: none !important; }`;
        sideNav.shadowRoot.appendChild(style);
        return true;
      }
      return false;
    };
    if (tryHide()) return;
    const id = setInterval(() => {
      if (tryHide()) clearInterval(id);
    }, 100);
    return () => clearInterval(id);
  }, []);
}

// ─── Hide atlas-gn-side-nav footer logo ───────────────────────────────────────

function useHideSideNavFooter() {
  useEffect(() => {
    const tryHide = () => {
      const mockNav = document.querySelector("mock-hb-global-navigator");
      const root = (mockNav as Element & { shadowRoot: ShadowRoot | null })?.shadowRoot;
      const sideNav = root?.querySelector("atlas-gn-side-nav") as (Element & {
        shadowRoot: ShadowRoot | null;
      }) | null;
      if (sideNav?.shadowRoot) {
        const footer = sideNav.shadowRoot.querySelector("footer") as HTMLElement | null;
        if (footer) {
          footer.style.display = "none";
          return true;
        }
      }
      return false;
    };
    if (tryHide()) return;
    const id = setInterval(() => {
      if (tryHide()) clearInterval(id);
    }, 100);
    return () => clearInterval(id);
  }, []);
}

// ─── Disable header icon-button clicks (help / settings / profile) ──────────
// Intercept clicks at document capture so the buttons stay visible and keep
// their CSS hover states, but never trigger their menus.

function useDisableHeaderMenuClicks() {
  useEffect(() => {
    const TAGS = ["atlas-gn-help-menu", "atlas-gn-user-menu", "atlas-gn-org-settings-menu"];

    const swallow = (e: Event) => {
      const path = e.composedPath();
      const inMenu = path.some(
        (n) => n instanceof Element && TAGS.includes(n.tagName.toLowerCase()),
      );
      if (!inMenu) return;
      e.stopImmediatePropagation();
      e.preventDefault();
    };

    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") swallow(e);
    };

    document.addEventListener("click", swallow, true);
    document.addEventListener("mousedown", swallow, true);
    document.addEventListener("keydown", keyHandler, true);
    return () => {
      document.removeEventListener("click", swallow, true);
      document.removeEventListener("mousedown", swallow, true);
      document.removeEventListener("keydown", keyHandler, true);
    };
  }, []);
}

// ─── Override org-switcher name + logo ────────────────────────────────────────
// AppLayout's `orgName` prop is clobbered by mock-hb-global-navigator's
// connectedCallback (it reads getAttribute("orgName"), which is null because
// React 19 sets it as a JS property, then falls back to the "Test company"
// default). We override the org-switcher's `organizations` reactive property
// directly so Lit re-renders the button with the correct name.

function useOverrideOrgSwitcher(orgName: string) {
  useEffect(() => {
    const trySet = () => {
      const mockNav = document.querySelector("mock-hb-global-navigator");
      const root = (mockNav as Element & { shadowRoot: ShadowRoot | null })?.shadowRoot;
      const orgSwitcher = root?.querySelector("atlas-gn-org-switcher") as
        | (HTMLElement & {
            organizations?: Array<Record<string, unknown>>;
          })
        | null;
      if (!orgSwitcher) return false;
      const existing = orgSwitcher.organizations?.[0];
      orgSwitcher.organizations = [
        {
          id: 0,
          logo: (existing?.logo as string) ?? "",
          customerName: orgName,
          name: orgName,
          launchpad: "#",
          subdomain: "",
          regionCode: "en",
          subscriptionStatusMessage: "",
        },
      ];
      return true;
    };
    if (trySet()) return;
    const id = setInterval(() => {
      if (trySet()) clearInterval(id);
    }, 100);
    return () => clearInterval(id);
  }, [orgName]);
}

// ─── Org-switcher dropdown affordances ────────────────────────────────────────
// The org-switcher (logo + branch label) opens a branch dropdown, so signal that
// it's interactive: a trailing down-chevron and a hover background. Both target
// the Lit-rendered <button> inside the org-switcher's shadow DOM, which re-renders
// when the branch label changes (useOverrideOrgSwitcher) — so a MutationObserver
// re-applies them whenever they go missing. The hover fill uses the Atlas
// tertiary/secondary hover token (gray-100), the cursor is forced to pointer
// (the button carries a `disabled` attribute), and both must be injected into the
// switcher's own shadow root since `background-color` doesn't inherit across it.

function useOrgSwitcherAffordances() {
  // Atlas tertiary-hover fill (gray-100). Read from the JS theme — the installed
  // bundle doesn't expose the Atlas tokens as global CSS variables, so we inject
  // the resolved value into the shadow-root style rather than a var().
  const hoverFill = useTheme().tokens.semantic.color.surface.variant.value;

  useEffect(() => {
    const CHEVRON_ID = "branch-switcher-chevron";
    const STYLE_ID = "branch-switcher-style";
    const CHEVRON_SVG = `<svg id="${CHEVRON_ID}" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" style="flex:0 0 auto;margin-left:2px;opacity:0.7;vertical-align:middle;"><path d="M9.99935 12.9743L5.01935 7.99425L5.96202 7.05225L9.99935 11.0903L14.0367 7.05225L14.9793 7.99425L9.99935 12.9743Z"/></svg>`;
    const STYLE_CSS = `
      button { cursor: pointer !important; transition: background-color 120ms ease; }
      button:hover { background-color: ${hoverFill} !important; }
    `;

    let observer: MutationObserver | null = null;

    const ensure = (root: ShadowRoot) => {
      if (!root.getElementById(STYLE_ID)) {
        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = STYLE_CSS;
        root.appendChild(style);
      }
      const btn = root.querySelector("button");
      if (btn && !btn.querySelector(`#${CHEVRON_ID}`)) {
        btn.insertAdjacentHTML("beforeend", CHEVRON_SVG);
      }
    };

    const trySet = () => {
      const mockNav = document.querySelector("mock-hb-global-navigator");
      const navRoot = (mockNav as Element & { shadowRoot: ShadowRoot | null })?.shadowRoot;
      const org = navRoot?.querySelector("atlas-gn-org-switcher") as
        | (Element & { shadowRoot: ShadowRoot | null })
        | null;
      const root = org?.shadowRoot;
      if (!root) return false;
      ensure(root);
      observer = new MutationObserver(() => ensure(root));
      observer.observe(root, { childList: true, subtree: true });
      return true;
    };

    if (trySet()) return () => observer?.disconnect();
    const id = setInterval(() => {
      if (trySet()) clearInterval(id);
    }, 100);
    return () => {
      clearInterval(id);
      observer?.disconnect();
    };
  }, [hoverFill]);
}

// ─── Hide app switcher from the global nav header ─────────────────────────────

function useHideAppSwitcher() {
  useEffect(() => {
    const tryHide = () => {
      const mockNav = document.querySelector("mock-hb-global-navigator");
      const root = (mockNav as Element & { shadowRoot: ShadowRoot | null })?.shadowRoot;
      const el = root?.querySelector("atlas-gn-app-switcher") as HTMLElement | null;
      if (el) {
        el.style.display = "none";
        return true;
      }
      return false;
    };
    if (tryHide()) return;
    const id = setInterval(() => {
      if (tryHide()) clearInterval(id);
    }, 100);
    return () => clearInterval(id);
  }, []);
}

// ─── App ──────────────────────────────────────────────────────────────────────

// ─── Force Inter font-family inside the nav shadow root ──────────────────────
// The Atlas MUI theme bakes the literal string "Plus Jakarta Sans Variable" into
// typography.fontFamily (Atlas Light's latest tokens use Inter, but the locally
// installed bundle is older). MUI/Lit components rendered inside
// mock-hb-global-navigator's shadow root therefore receive the baked-in family
// and ignore our --lens-semantic-font-family-body override. Injecting a <style>
// inside that shadow root forces Inter on everything in the nav.

function useNavFontFamilyInter() {
  useEffect(() => {
    const FONT_STACK = '"Inter Variable", "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
    const STYLE_ID = "prototype-nav-inter-font";
    const tryInject = () => {
      const mockNav = document.querySelector("mock-hb-global-navigator");
      const root = (mockNav as Element & { shadowRoot: ShadowRoot | null })?.shadowRoot;
      if (!root) return false;
      if (root.getElementById(STYLE_ID)) return true;
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = `
        :host, * { font-family: ${FONT_STACK} !important; }
      `;
      root.appendChild(style);
      return true;
    };
    if (tryInject()) return;
    const id = setInterval(() => {
      if (tryInject()) clearInterval(id);
    }, 100);
    return () => clearInterval(id);
  }, []);
}

// ─── Top-bar trailing slot customization (persona-agnostic) ───────────────────
// - Hide the gear (org-settings) menu
// - Remove the gray vertical divider rendered as atlas-gn-user-menu::before
// - Inject a keyboard icon button before atlas-gn-help-menu
//   Final order: [view-switcher][keyboard][help][avatar]

function useTopBarTrailingCustomization() {
  useEffect(() => {
    const STYLE_ID = "topbar-trailing-style";
    const KEYBOARD_HOST_ID = "topbar-keyboard-host";
    const KEYBOARD_SVG = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M2.5 18.5V5.5H21.5V18.5H2.5ZM3.99998 17H20V6.99998H3.99998V17ZM8.11538 15.8846H15.8846V14.1154H8.11538V15.8846ZM5.11538 12.8846H6.88458V11.1154H5.11538V12.8846ZM8.11538 12.8846H9.88457V11.1154H8.11538V12.8846ZM11.1154 12.8846H12.8846V11.1154H11.1154V12.8846ZM14.1154 12.8846H15.8846V11.1154H14.1154V12.8846ZM17.1154 12.8846H18.8846V11.1154H17.1154V12.8846ZM5.11538 9.88458H6.88458V8.11538H5.11538V9.88458ZM8.11538 9.88458H9.88457V8.11538H8.11538V9.88458ZM11.1154 9.88458H12.8846V8.11538H11.1154V9.88458ZM14.1154 9.88458H15.8846V8.11538H14.1154V9.88458ZM17.1154 9.88458H18.8846V8.11538H17.1154V9.88458Z" fill="currentColor"/>
</svg>`;

    let host: HTMLButtonElement | null = null;

    const tryInject = () => {
      const mockNav = document.querySelector("mock-hb-global-navigator");
      const mockRoot = (mockNav as Element & { shadowRoot: ShadowRoot | null })?.shadowRoot;
      if (!mockRoot) return false;
      const helpMenu = mockRoot.querySelector("atlas-gn-help-menu") as HTMLElement | null;
      if (!helpMenu?.parentNode) return false;

      // Inject persistent style
      if (!mockRoot.querySelector(`#${STYLE_ID}`)) {
        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
          atlas-gn-org-settings-menu { display: none !important; }
          atlas-gn-user-menu::before { display: none !important; }
          atlas-gn-user-menu { padding-inline-start: 0 !important; }
          #${KEYBOARD_HOST_ID} {
            all: unset;
            box-sizing: border-box;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 12px;
            color: var(--lens-semantic-color-action-secondary-on-secondary);
            background: transparent;
            cursor: pointer;
          }
          #${KEYBOARD_HOST_ID}:hover { background: var(--lens-semantic-color-action-secondary-hover-fill); }
          #${KEYBOARD_HOST_ID}:active { background: var(--lens-semantic-color-action-secondary-active-fill); }
        `;
        mockRoot.appendChild(style);
      }

      // Create / reuse keyboard host
      host = mockRoot.querySelector(`#${KEYBOARD_HOST_ID}`) as HTMLButtonElement | null;
      if (!host) {
        host = document.createElement("button");
        host.id = KEYBOARD_HOST_ID;
        host.type = "button";
        host.setAttribute("slot", "trailing");
        host.setAttribute("aria-label", "Keyboard shortcuts");
        host.title = "Keyboard shortcuts";
        host.innerHTML = KEYBOARD_SVG;
        helpMenu.parentNode.insertBefore(host, helpMenu);
      }
      return true;
    };

    if (tryInject()) {
      return () => {
        host?.remove();
      };
    }
    const id = setInterval(() => {
      if (tryInject()) clearInterval(id);
    }, 100);
    return () => {
      clearInterval(id);
      host?.remove();
    };
  }, []);
}

function ViewSwitcherForRoute() {
  const { pathname } = useLocation();

  // Director book reader hides the global nav entirely — no host for the button.
  // The admin book reader keeps the nav, so the button stays.
  const isDirectorBookReader = /^\/director\/books\/[^/]+/.test(pathname);
  if (isDirectorBookReader) return null;

  if (pathname === "/books" || pathname.startsWith("/admin")) {
    return <ViewSwitcherButton label="Open director view" href="/director" />;
  }
  // The director view is the demo — no hop to the administrator view from it.
  return null;
}

// Leaving a book reader keeps the docked Smart Assist panel open — it carries
// over to the next page (books list, resource center, …) rather than being
// force-closed. Only the full-screen overlay is dismissed on exit, since a
// full-screen takeover lingering over a different page would be jarring.
const isBookReaderRoute = (path: string) =>
  /^\/(?:director\/|admin\/)?books\/[^/]+/.test(path);

function SmartAssistRouteSync() {
  const { pathname } = useLocation();
  const { closeOverlay } = useSmartAssist();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    const left = isBookReaderRoute(prevPathRef.current) && !isBookReaderRoute(pathname);
    prevPathRef.current = pathname;
    if (left) closeOverlay();
  }, [pathname, closeOverlay]);

  return null;
}

function AppShell() {
  const orgLabel = "Meridian Capital Group";
  usePanelMode();
  useNavContainerFullHeight();
  useDisableHeaderMenuClicks();
  useHideAppSwitcher();
  useHideSideNavAppName();
  useHideSideNavFooter();
  useHidePlatformNavItems();
  useCollapsedNavStyle();
  useNavFontFamilyInter();
  useOverrideOrgSwitcher(orgLabel);
  useOrgSwitcherAffordances();
  useTopBarTrailingCustomization();
  return (
    <AppLayout navigation={<Navigation />} orgName={orgLabel}>
      <CitationPreviewProvider>
        <SmartAssistProvider>
          <SmartAssistRouteSync />
          <AskGovernAIButton />
          <DemoIntroDialog />
          <ViewSwitcherForRoute />
          <Outlet />
        </SmartAssistProvider>
      </CitationPreviewProvider>
    </AppLayout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/director" replace />} />
      {/* Everything below renders inside the app shell (header + side nav) */}
      <Route element={<AppShell />}>
        <Route path="director" element={<DirectorHomePage />} />
        <Route path="director/books" element={<DirectorBooksPage />} />
        <Route path="director/books/:id" element={<DirectorBookReaderPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="admin/settings" element={<OrganizationSettingsPage />} />
        <Route path="simple" element={<SimplePage />} />
        <Route path="ai-assistant" element={<AIAssistantPage />} />
        <Route path="resource-center" element={<ResourceCenterPage />} />
        <Route path="admin/resource-center" element={<ResourceCenterPage />} />
        <Route path="director/resource-center" element={<DirectorResourceCenterPage />} />
        <Route path="director/resource-center/doc/:documentId" element={<DirectorResourceDocumentPage />} />
        <Route path="books" element={<AdminBooksPage />} />
        <Route path="books/:id" element={<BookEditorPage />} />
        <Route path="admin/books" element={<AdminBooksPage />} />
        <Route path="admin/books/:id" element={<BookEditorPage />} />
        <Route path="smart-assist" element={<AIAssistantPage />} />
        {/* AGAI integration use cases demo (scripted, presenter-driven) */}
        <Route path="tasks" element={<TasksPage />} />
        <Route path="data-room/:folderId" element={<DataRoomFolderPage />} />
        <Route path="tasks/:taskId" element={<TaskDetailPage />} />
        <Route path="decision-hub/approvals/:approvalId" element={<ApprovalDetailPage />} />
        <Route path="demo/AGAI-integration-usecases/summary" element={<DemoAgaiIntegrationUsecasesSummaryPage />} />
        <Route path="demo/AGAI-integration-usecases/open" element={<DemoSourceStubPage />} />
      </Route>
    </Routes>
  );
}
