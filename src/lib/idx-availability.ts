import { cacheLife } from "next/cache";
import { probeIdxSearch } from "./idx-probe";

/** Seconds between checks: `IDX_CHECK_INTERVAL_SECONDS`, default 300 (five minutes), 30–3600. */
function checkInterval(): number {
  const seconds = Number(process.env.IDX_CHECK_INTERVAL_SECONDS);
  return Number.isFinite(seconds) && seconds > 0 ? Math.min(Math.max(Math.round(seconds), 30), 3600) : 300;
}

/**
 * Whether the hosted IDX search at `url` is live, for `mode: "auto"`.
 *
 * Cached with Next.js `use cache`: the page is prerendered with the result and
 * regenerated in the background once the interval has passed, so the provider
 * sees at most about one request per interval, and activation shows up on the
 * deployed site without a new build.
 *
 * - Live search page → "active". Pending, unknown pages and redirects → "inactive".
 * - Provider unreachable (network error, timeout, 5xx, 429) at runtime → throws.
 *   Next.js then keeps serving the last successfully generated page, so a brief
 *   outage changes nothing, and it retries on a later request. During a build
 *   there is no earlier page to keep, so the build falls back to "inactive".
 */
export async function getIdxAvailability(url: string, referer: string | null): Promise<"active" | "inactive"> {
  "use cache";
  const interval = checkInterval();
  // No `expire`: an earlier result always stays available while a new check runs.
  cacheLife({ stale: interval, revalidate: interval });

  const result = await probeIdxSearch(url, { referer });
  const detail = "detail" in result ? ` (${result.detail})` : "";
  if (result.status === "unreachable" && process.env.NEXT_PHASE !== "phase-production-build") {
    throw new Error(`[idx] Availability check could not reach ${url}${detail}; keeping the last known state.`);
  }
  console.info(`[idx] Availability check: ${result.status}${detail}.`);
  return result.status === "active" ? "active" : "inactive";
}
