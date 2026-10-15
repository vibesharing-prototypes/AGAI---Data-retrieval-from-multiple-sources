import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

// Which prototype branch the user picked on the landing gate (BranchSelectPage).
// Persisted to localStorage["prototypeBranch"]. Used to scope MVP-only UI changes
// so the Explorations branch keeps the original behavior.
//
// Default is "explorations" — the established baseline — so direct navigation
// that skips the landing gate doesn't accidentally show the trimmed MVP UI.

export type PrototypeBranch = "mvp" | "explorations";

const STORAGE_KEY = "prototypeBranch";

// Query-param key that mirrors the branch in the URL (e.g. ?branch=mvp), so the
// active branch is visible/shareable, not just hidden in localStorage.
export const BRANCH_PARAM = "branch";

// Human-readable label shown in the org switcher / next to the logo.
export const BRANCH_LABEL: Record<PrototypeBranch, string> = {
  mvp: "MVP",
  explorations: "Meridian Capital Group",
};

function isBranch(v: string | null): v is PrototypeBranch {
  return v === "mvp" || v === "explorations";
}

export function getPrototypeBranch(): PrototypeBranch {
  try {
    return localStorage.getItem(STORAGE_KEY) === "mvp" ? "mvp" : "explorations";
  } catch {
    return "explorations";
  }
}

function setStoredBranch(branch: PrototypeBranch) {
  try {
    localStorage.setItem(STORAGE_KEY, branch);
  } catch {
    /* localStorage unavailable — branch choice just isn't persisted */
  }
}

// Keeps the URL's ?branch= param and the stored branch in sync, and returns the
// effective branch. The URL is authoritative when it carries a valid value
// (so a shared link wins); otherwise the stored branch is appended to the URL.
export function useSyncBranchParam(): PrototypeBranch {
  const navigate = useNavigate();
  const { pathname, search, hash } = useLocation();

  const params = new URLSearchParams(search);
  const urlValue = params.get(BRANCH_PARAM);
  const branch: PrototypeBranch = isBranch(urlValue) ? urlValue : getPrototypeBranch();

  useEffect(() => {
    if (isBranch(urlValue)) {
      // URL drives the branch — mirror it into storage for non-URL consumers.
      setStoredBranch(urlValue);
      return;
    }
    // No/invalid param — append the stored branch without adding history.
    const next = new URLSearchParams(search);
    next.set(BRANCH_PARAM, branch);
    navigate({ pathname, search: `?${next.toString()}`, hash }, { replace: true });
  }, [urlValue, branch, pathname, search, hash, navigate]);

  return branch;
}

// Reactive read of the active branch. Derives from the URL's ?branch= param
// (kept populated by useSyncBranchParam) so switching the branch from the header
// org-switcher re-renders every consumer immediately, on any page. Falls back to
// the stored branch on the first render before the param is appended.
export function usePrototypeBranch(): PrototypeBranch {
  const { search } = useLocation();
  const urlValue = new URLSearchParams(search).get(BRANCH_PARAM);
  return isBranch(urlValue) ? urlValue : getPrototypeBranch();
}
