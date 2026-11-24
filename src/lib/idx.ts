/**
 * SABOR MLS IDX property search — every setting lives in this file.
 *
 * The client-supplied URL is a search page hosted by the MLS's IDX provider
 * (connectMLS), not an API. The site links to it or, once SABOR authorizes
 * framing for this domain, frames it. The site never fetches, stores or shows
 * MLS data itself, and never sends search criteria to the provider: the hosted
 * search has its own filters and accepts none from another page.
 *
 * Activation steps: "IDX property search" in the README.
 */

/**
 * - `inactive`: SABOR has not activated the search. The section shows a disabled
 *   preview of the filters and offers the consultation form instead.
 * - `hosted`: the search is live; a button opens it on the provider's site.
 * - `embed`: SABOR has also authorized framing for this domain; the search is
 *   framed in the page, with the hosted search kept as the fallback.
 */
export type IdxMode = "inactive" | "hosted" | "embed";

export type IdxConfig = {
  mode: IdxMode;
  /** MLS named in the section copy and the frame title. */
  provider: string;
  /** Official hosted search: the button in `hosted` mode, the fallback link in `embed` mode. */
  searchUrl: string;
  /** Frame `src` that SABOR authorizes for this domain (taken from the embed code they issue). */
  embedUrl: string | null;
  /** Attribution or disclaimer SABOR requires beside the search, copied verbatim. */
  disclaimer: string | null;
};

export const idxConfig: IdxConfig = {
  /** Checked 2026-11-25: `searchUrl` returns HTTP 403 "This site has not been configured". */
  mode: "inactive",
  provider: "SABOR MLS",
  searchUrl: "https://sabor-idx.connectmls.com/idx/spr/60F98AE5A0D0D516E063AA01110ABFC1/search",
  embedUrl: null,
  disclaimer: null,
};

/** What the section renders. Only valid, fully configured states reach the page. */
export type IdxSearch =
  | { mode: "inactive"; provider: string }
  | { mode: "hosted"; provider: string; searchUrl: string; disclaimer: string | null }
  | { mode: "embed"; provider: string; searchUrl: string; embedUrl: string; disclaimer: string | null };

type Env = Record<string, string | undefined>;

/**
 * Optional per-deployment overrides, read at build time: `IDX_MODE`,
 * `IDX_SEARCH_URL` and `IDX_EMBED_URL`. Useful for trying `embed` on a preview
 * deployment before changing `idxConfig` for production.
 */
export function applyIdxEnv(config: IdxConfig, env: Env): IdxConfig {
  const mode = env.IDX_MODE?.trim();
  if (mode && mode !== "inactive" && mode !== "hosted" && mode !== "embed") {
    console.warn(`[idx] Ignoring IDX_MODE="${mode}" (expected inactive, hosted or embed).`);
  }
  return {
    ...config,
    mode: mode === "inactive" || mode === "hosted" || mode === "embed" ? mode : config.mode,
    searchUrl: env.IDX_SEARCH_URL?.trim() || config.searchUrl,
    embedUrl: env.IDX_EMBED_URL?.trim() || config.embedUrl,
  };
}

function isHttpsUrl(value: string | null): value is string {
  if (!value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

/** Never resolves to a broken state: an incomplete setup falls back to the next safest mode. */
export function resolveIdxSearch(config: IdxConfig): IdxSearch {
  const { mode, provider, searchUrl, embedUrl, disclaimer } = config;
  if (mode === "inactive") return { mode, provider };
  if (!isHttpsUrl(searchUrl)) {
    console.warn("[idx] searchUrl must be an https URL; showing the inactive state.");
    return { mode: "inactive", provider };
  }
  if (mode === "embed") {
    if (isHttpsUrl(embedUrl)) return { mode, provider, searchUrl, embedUrl, disclaimer };
    console.warn("[idx] embed mode needs an https embedUrl; showing the hosted search link instead.");
  }
  return { mode: "hosted", provider, searchUrl, disclaimer };
}

export const idxSearch = resolveIdxSearch(applyIdxEnv(idxConfig, process.env));
