import { useEffect } from "react";
import { useSmartAssist } from "../context/SmartAssistContext.js";

const STYLE_ID = "ask-governai-style";
const HOST_ID = "ask-governai-host";

// Replicates Atlas Button variant="outlined" color="ai" size="small" (32px)
// using CSS custom properties that cascade into the shadow DOM.
const BUTTON_STYLES = `
  .ask-governai-btn {
    all: unset;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 32px;
    padding: 0 12px;
    border-radius: var(--lens-semantic-radius-md, 8px);
    font-family: var(--lens-semantic-font-family-body);
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    color: var(--lens-semantic-color-action-secondary-on-secondary);
    background: var(--lens-semantic-color-surface-default);
    cursor: pointer;
    white-space: nowrap;
  }
  /* Gradient border ring — painted above the background, below the text content.
     Matches Atlas createAiGradientBorder exactly. */
  .ask-governai-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    padding: 1px;
    border-radius: var(--lens-semantic-radius-md, 8px);
    background: var(--lens-semantic-gradients-ai-default);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    z-index: -1;
    pointer-events: none;
  }
  .ask-governai-btn:hover {
    background: var(--lens-semantic-color-action-secondary-hover-fill);
  }
  .ask-governai-btn:active {
    background: var(--lens-semantic-color-action-secondary-active-fill);
  }
  .ask-governai-btn:focus-visible {
    outline: 2px solid var(--lens-semantic-color-action-primary-default, currentColor);
    outline-offset: 2px;
  }
`;

// Atlas AiSparkle icon (lg, 24px viewBox) at 16px with AI gradient fill.
const SPARKLE_SVG = `
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="ag-sparkle-grad" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
        <stop offset="0%" stop-color="var(--lens-semantic-color-ai-default-gradient-start)"/>
        <stop offset="50%" stop-color="var(--lens-semantic-color-ai-default-gradient-middle)"/>
        <stop offset="100%" stop-color="var(--lens-semantic-color-ai-default-gradient-end)"/>
      </linearGradient>
    </defs>
    <path d="M17.115 9.2998L18.24 7.0498L20.49 5.9248L18.24 4.7998L17.115 2.5498L15.99 4.7998L13.74 5.9248L15.99 7.0498L17.115 9.2998Z" fill="url(#ag-sparkle-grad)"/>
    <path d="M11.565 9.67478L9.24001 5.02478L6.91001 9.67478L2.26501 11.9998L6.91001 14.3248L9.24001 18.9748L11.565 14.3248L16.215 11.9998L11.565 9.67478Z" fill="url(#ag-sparkle-grad)"/>
    <path d="M15.99 16.9497L17.115 14.6997L18.24 16.9497L20.49 18.0747L18.24 19.1997L17.115 21.4497L15.99 19.1997L13.74 18.0747L15.99 16.9497Z" fill="url(#ag-sparkle-grad)"/>
  </svg>
`;

export default function AskGovernAIButton() {
  const { openSmartAssist } = useSmartAssist();

  useEffect(() => {
    let host: HTMLButtonElement | null = null;

    const tryInsert = () => {
      const mockNav = document.querySelector("mock-hb-global-navigator");
      const mockRoot = (mockNav as Element & { shadowRoot: ShadowRoot | null })?.shadowRoot;
      if (!mockRoot) return false;
      const helpMenu = mockRoot.querySelector("atlas-gn-help-menu") as HTMLElement | null;
      if (!helpMenu?.parentNode) return false;

      // Insert before ViewSwitcherButton when present, else before keyboard icon, else before help menu.
      // Resulting order: [ask-governai][view-switcher][keyboard][help][user]
      const viewSwitcher = mockRoot.querySelector("#view-switcher-host") as HTMLElement | null;
      const keyboardHost = mockRoot.querySelector("#topbar-keyboard-host") as HTMLElement | null;
      const anchor = viewSwitcher ?? keyboardHost ?? helpMenu;

      if (!mockRoot.querySelector(`#${STYLE_ID}`)) {
        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = BUTTON_STYLES;
        mockRoot.appendChild(style);
      }

      host = mockRoot.querySelector(`#${HOST_ID}`) as HTMLButtonElement | null;
      if (!host) {
        host = document.createElement("button");
        host.id = HOST_ID;
        host.type = "button";
        host.className = "ask-governai-btn";
        host.setAttribute("slot", "trailing");
        anchor.parentNode!.insertBefore(host, anchor);
      }
      host.innerHTML = `${SPARKLE_SVG}<span>Ask GovernAI</span>`;
      host.onclick = (e) => {
        e.preventDefault();
        openSmartAssist();
      };
      return true;
    };

    if (tryInsert()) {
      return () => { host?.remove(); };
    }
    const id = setInterval(() => {
      if (tryInsert()) clearInterval(id);
    }, 100);
    return () => {
      clearInterval(id);
      host?.remove();
    };
  }, [openSmartAssist]);

  return null;
}
