/**
 * Checks whether the provider-hosted IDX search page is live, the way a visitor's
 * browser would first see it. One plain GET of the page itself: no provider API,
 * no query parameters, and nothing beyond the status and the page shell is read
 * (the shell holds no listing data). Pure, so it can be tested without Next.js.
 */

export type IdxProbeResult =
  /** The connectMLS IDX search app is served at the configured address. */
  | { status: "active" }
  /** The provider's "This site has not been configured" response: SABOR approval is pending. */
  | { status: "pending"; detail: string }
  /** A definite answer that is not the live search (other errors, unknown pages, redirects elsewhere). */
  | { status: "unverified"; detail: string }
  /** No usable answer (network failure, timeout, provider outage, rate limiting): try again later. */
  | { status: "unreachable"; detail: string };

/** Body text of the provider's error page while the IDX configuration is not active. */
const NOT_CONFIGURED = /has not been configured/i;

/**
 * Markers of the connectMLS IDX search app, as served for an active configuration
 * (AngularJS shell that loads the listing criteria script). If the provider
 * changes its app, the check stops matching and the section stays inactive.
 */
const SEARCH_APP_MARKERS = ['ng-app="app"', "assets/js/listing/criteria.js"];

/** The search shell is about 6 KB; anything far larger is not it. */
const MAX_BODY_BYTES = 256 * 1024;

export type ProbeOptions = {
  fetch?: typeof fetch;
  timeoutMs?: number;
  /** This site's own origin, sent as the Referer a visitor's browser would send. */
  referer?: string | null;
};

/** Path without `;jsessionid=…`-style parameters, which servers may append on redirect. */
const basePath = (url: URL) => url.pathname.split(";")[0].replace(/\/$/, "");

/** Reads at most `limit` bytes; `null` when the body is larger. */
async function readText(response: Response, limit: number): Promise<string | null> {
  const reader = response.body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder("latin1");
  let text = "";
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return text + decoder.decode();
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      return null;
    }
    text += decoder.decode(value, { stream: true });
  }
}

const describe = (error: unknown) => (error instanceof Error ? `${error.name}: ${error.message}` : String(error));

export async function probeIdxSearch(url: string, options: ProbeOptions = {}): Promise<IdxProbeResult> {
  const { fetch: fetchImpl = fetch, timeoutMs = 8000, referer = null } = options;
  const expected = new URL(url);

  let response: Response;
  let body: string | null;
  try {
    response = await fetchImpl(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        accept: "text/html",
        "user-agent": "Mozilla/5.0 (compatible; IdxAvailabilityCheck/1.0)",
        ...(referer ? { referer } : {}),
      },
    });
    if (response.status >= 500 || response.status === 408 || response.status === 429) {
      await response.body?.cancel();
      return { status: "unreachable", detail: `HTTP ${response.status}` };
    }
    // The timeout signal also covers reading the body.
    body = await readText(response, MAX_BODY_BYTES);
  } catch (error) {
    return { status: "unreachable", detail: describe(error) };
  }

  const final = new URL(response.url || url);
  if (final.origin !== expected.origin || basePath(final) !== basePath(expected)) {
    return { status: "unverified", detail: `redirected to ${final.origin}${final.pathname}` };
  }
  if (body === null) return { status: "unverified", detail: "response larger than the search page" };
  if (NOT_CONFIGURED.test(body)) return { status: "pending", detail: `HTTP ${response.status}: site not configured` };
  if (response.status !== 200) return { status: "unverified", detail: `HTTP ${response.status}` };
  if (!/text\/html/i.test(response.headers.get("content-type") ?? "")) {
    return { status: "unverified", detail: `unexpected content type ${response.headers.get("content-type")}` };
  }
  if (!SEARCH_APP_MARKERS.every((marker) => body.includes(marker))) {
    return { status: "unverified", detail: "HTTP 200, but not the IDX search page" };
  }
  return { status: "active" };
}
