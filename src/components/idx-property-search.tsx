import type { ReactNode } from "react";
import { ArrowRight } from "./icons";
import { IdxSearchFrame } from "./idx-search-frame";
import { IntentLink } from "./intent-link";
import { idxSearch, type IdxSearch } from "@/lib/idx";
import { getIdxAvailability } from "@/lib/idx-availability";
import { site } from "@/lib/site";

const textLink =
  "inline-block py-1 font-semibold text-ivory underline decoration-gold-light/60 underline-offset-[6px] transition-colors hover:text-gold-light hover:decoration-gold-light";

const panel = "border border-gold-light/30 p-5 sm:p-8 lg:p-10";

const PREVIEW_STATUS_ID = "idx-preview-status";
const PREVIEW_NOTE_ID = "idx-preview-note";

function StatusLabel({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="label flex items-center gap-2.5 text-gold-light">
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-gold-light" />
      {children}
    </p>
  );
}

function ShortlistLink() {
  return (
    <p className="text-sm leading-relaxed text-ivory/75">
      Prefer a hand-picked shortlist?{" "}
      <IntentLink intent={{ interest: "buying" }} className={textLink}>
        Tell Ashley what you&rsquo;re looking for
      </IntentLink>
    </p>
  );
}

function Disclaimer({ text }: { text: string | null }) {
  return text ? <p className="mt-6 text-xs leading-relaxed text-ivory/70">{text}</p> : null;
}

const previewControl =
  "block h-12 w-full appearance-none rounded-[2px] border border-ivory/15 bg-navy-deep/60 px-3.5 text-base text-ivory/55 disabled:cursor-not-allowed";

function PreviewField({ id, label, className = "", children }: { id: string; label: string; className?: string; children: ReactNode }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <label htmlFor={id} className="label mb-2.5 block text-ivory/80">
        {label}
      </label>
      {children}
    </div>
  );
}

function PreviewSelect({ id, label, option }: { id: string; label: string; option: string }) {
  return (
    <PreviewField id={id} label={label}>
      <div className="relative">
        <select id={id} className={`${previewControl} pr-10`}>
          <option>{option}</option>
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 12 8"
          className="pointer-events-none absolute right-3.5 top-1/2 h-2 w-3 -translate-y-1/2 text-gold-light/50"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M1 1.5l5 5 5-5" />
        </svg>
      </div>
    </PreviewField>
  );
}

/**
 * Shown until SABOR activates the search. The controls preview the filters the
 * MLS search offers, but they are disabled: the hosted search accepts no
 * criteria from this page, so they could not search anything. They are removed
 * as soon as the search is activated.
 */
function SearchPreview() {
  return (
    <div className={panel}>
      <StatusLabel id={PREVIEW_STATUS_ID}>Search available after MLS activation</StatusLabel>

      <fieldset disabled aria-describedby={`${PREVIEW_STATUS_ID} ${PREVIEW_NOTE_ID}`} className="mt-6 min-w-0">
        <legend className="sr-only">Property search filters (preview, not yet active)</legend>
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4 xl:grid-cols-[minmax(0,1.8fr)_repeat(4,minmax(0,1fr))_auto] xl:items-end">
          <PreviewField id="idx-preview-location" label="Location" className="col-span-2 md:col-span-4 xl:col-span-1">
            <input
              id="idx-preview-location"
              type="text"
              placeholder="City, ZIP code or neighborhood"
              className={`${previewControl} placeholder:text-ivory/45`}
            />
          </PreviewField>
          <PreviewSelect id="idx-preview-min-price" label="Min price" option="No min" />
          <PreviewSelect id="idx-preview-max-price" label="Max price" option="No max" />
          <PreviewSelect id="idx-preview-beds" label="Bedrooms" option="Any" />
          <PreviewSelect id="idx-preview-baths" label="Bathrooms" option="Any" />
          <div className="col-span-2 md:col-span-4 xl:col-span-1">
            <button
              type="button"
              className="btn btn-gold-outline w-full disabled:cursor-not-allowed disabled:border-ivory/20 disabled:text-ivory/50 disabled:before:hidden"
            >
              Search Properties
            </button>
          </div>
        </div>
      </fieldset>

      <div className="mt-8 flex flex-col gap-6 border-t border-gold-light/20 pt-7 md:flex-row md:items-center md:justify-between md:gap-10">
        <p id={PREVIEW_NOTE_ID} className="max-w-[38rem] text-sm leading-relaxed text-ivory/75">
          These filters are a preview. The MLS-powered search will be available here once activation is
          complete. In the meantime, share what you&rsquo;re looking for and Ashley will be in touch.
        </p>
        <IntentLink intent={{ interest: "buying" }} className="btn btn-gold-outline w-full shrink-0 md:w-auto">
          Start Your Home Search <ArrowRight className="btn-arrow" />
        </IntentLink>
      </div>
    </div>
  );
}

/** The live search on the provider's own site, opened in a new tab. */
function HostedSearch({ provider, searchUrl, disclaimer }: Extract<IdxSearch, { mode: "hosted" }>) {
  return (
    <div className={panel}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16">
        <div>
          <StatusLabel>Official {provider} search</StatusLabel>
          <p className="mt-4 font-serif text-[1.625rem] font-medium leading-[1.2] text-ivory">
            Search homes for sale with the MLS&rsquo;s own filters.
          </p>
          <p className="mt-3 max-w-[38rem] text-sm leading-relaxed text-ivory/75">
            The search opens in a new tab on the official {provider} IDX property search. Listings and their
            details are provided by the MLS.
          </p>
        </div>
        {/* Referrer kept (origin only, the default policy) so the provider can see which site sent the visitor. */}
        <a href={searchUrl} target="_blank" rel="noopener" className="btn btn-gold-outline w-full lg:w-auto">
          Search Available Properties <ArrowRight className="btn-arrow" />
          <span className="sr-only"> (opens the {provider} property search in a new tab)</span>
        </a>
      </div>
      <Disclaimer text={disclaimer} />
      <div className="mt-7 border-t border-gold-light/20 pt-6">
        <ShortlistLink />
      </div>
    </div>
  );
}

/** The live search framed in the page, as authorized by the provider for this domain. */
function EmbeddedSearch({ provider, searchUrl, embedUrl, disclaimer }: Extract<IdxSearch, { mode: "embed" }>) {
  return (
    <>
      <IdxSearchFrame src={embedUrl} title={`${provider} property search`} fallbackUrl={searchUrl} />
      <Disclaimer text={disclaimer} />
      <div className="mt-6">
        <ShortlistLink />
      </div>
    </>
  );
}

/** `auto` becomes the hosted search once it is verifiably live, and stays inactive until then. Never embed. */
async function resolveAuto(search: IdxSearch): Promise<Exclude<IdxSearch, { mode: "auto" }>> {
  if (search.mode !== "auto") return search;
  const { provider, searchUrl, disclaimer } = search;
  const availability = await getIdxAvailability(searchUrl, site.url ? `${site.url}/` : null);
  return availability === "active" ? { mode: "hosted", provider, searchUrl, disclaimer } : { mode: "inactive", provider };
}

/**
 * "Find Your Next Home": entry point to the MLS's own IDX property search. What
 * it shows depends on `src/lib/idx.ts`. No listing data is fetched or displayed
 * by this site, so the provider's pages carry the MLS attribution and notices.
 */
export async function IdxPropertySearch({ search: configured = idxSearch }: { search?: IdxSearch }) {
  const search = await resolveAuto(configured);
  return (
    <section
      id="property-search"
      aria-labelledby="property-search-heading"
      className="relative isolate overflow-hidden bg-navy py-16 text-ivory sm:py-20 lg:py-24"
    >
      <span aria-hidden="true" className="absolute inset-y-0 left-3 -z-10 w-px bg-gold-light/25" />

      <div className="mx-auto w-full max-w-[86rem] px-5 sm:px-8 lg:px-10 xl:px-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-16">
          <div>
            <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.16em] text-gold-light">
              <span aria-hidden="true" className="h-px w-10 bg-gold-light" />
              MLS property search
            </p>
            <h2
              id="property-search-heading"
              className="mt-4 font-serif text-[clamp(2.5rem,4.5vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.02em]"
            >
              Find Your Next Home
            </h2>
          </div>
          <p className="max-w-[34rem] text-base leading-[1.85] text-ivory/80">
            Explore property listings available on the market, with details that come directly from the
            MLS. When a property catches your eye, Ashley can help you take the next step.
          </p>
        </div>

        <div className="mt-10 lg:mt-14">
          {search.mode === "embed" ? (
            <EmbeddedSearch {...search} />
          ) : search.mode === "hosted" ? (
            <HostedSearch {...search} />
          ) : (
            <SearchPreview />
          )}
        </div>
      </div>
    </section>
  );
}
