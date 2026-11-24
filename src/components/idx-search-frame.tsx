"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "./icons";

type Props = {
  /** Frame source that the provider has authorized for this domain. */
  src: string;
  /** Accessible name of the frame, e.g. "SABOR MLS property search". */
  title: string;
  /** The same search on the provider's own site. Always offered; promoted if the frame stalls. */
  fallbackUrl: string;
  /** Base for the element ids used by the skip link. */
  id?: string;
  /** How long to wait for the frame before suggesting the fallback. */
  timeoutMs?: number;
};

type Status = "idle" | "loading" | "slow" | "loaded";

const fallbackLink =
  "inline-flex items-center gap-2 py-1 text-sm font-semibold text-ivory underline decoration-gold-light/60 underline-offset-[6px] transition-colors hover:text-gold-light";

/**
 * Frames a provider-hosted search that the provider has authorized for this
 * domain. The frame is created only as it nears the viewport, so visitors who
 * never scroll this far do not load the provider's app. A cross-origin frame
 * cannot report provider errors (a refused or error page still fires `load`),
 * so the link to the hosted search stays visible at all times and is promoted
 * if the frame has not loaded after `timeoutMs`. Without JavaScript, only the
 * link is shown.
 */
export function IdxSearchFrame({ src, title, fallbackUrl, id = "idx-search-frame", timeoutMs = 15000 }: Props) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        setStatus("loading");
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(area);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (status !== "loading") return;
    const timer = window.setTimeout(() => setStatus("slow"), timeoutMs);
    return () => window.clearTimeout(timer);
  }, [status, timeoutMs]);

  const openInNewTab = (
    <span className="sr-only"> (opens the {title} in a new tab)</span>
  );

  return (
    <div className="border border-gold-light/30 bg-navy-deep">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-gold-light/20 px-4 py-3 sm:px-6">
        <p className="label text-gold-light">{title}</p>
        {/* Referrer kept (origin only, the default policy) so the provider can see which site sent the visitor. */}
        <a href={fallbackUrl} target="_blank" rel="noopener" className={fallbackLink}>
          Open in a new tab <ArrowRight className="size-4 text-gold-light" />
          {openInNewTab}
        </a>
      </div>

      <a
        href={`#${id}-end`}
        className="sr-only focus:not-sr-only focus:block focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-ivory"
      >
        Skip past the property search
      </a>

      <div ref={areaRef} className="relative h-[min(82svh,52rem)] min-h-[22rem] bg-ivory">
        {status !== "idle" && (
          <iframe
            id={id}
            src={src}
            title={title}
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={() => setStatus("loaded")}
            className="absolute inset-0 size-full border-0"
          />
        )}
        {status !== "loaded" && (
          <div role="status" className="absolute inset-0 grid place-items-center bg-navy-deep px-6 text-center text-ivory">
            {status === "loading" ? (
              <p className="flex items-center gap-3 text-sm text-ivory/80">
                <span
                  aria-hidden="true"
                  className="size-4 animate-spin rounded-full border-2 border-gold-light/30 border-t-gold-light"
                />
                Loading the property search&hellip;
              </p>
            ) : (
              <div className="max-w-[28rem]">
                <p className="font-serif text-[1.5rem] font-medium leading-[1.25]">
                  {status === "slow"
                    ? "The property search is taking longer than usual to load."
                    : "The property search opens on the MLS website."}
                </p>
                <a href={fallbackUrl} target="_blank" rel="noopener" className="btn btn-gold-outline mt-6">
                  Open the Search <ArrowRight className="btn-arrow" />
                  {openInNewTab}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
      <span id={`${id}-end`} tabIndex={-1} className="block outline-none" />
    </div>
  );
}
