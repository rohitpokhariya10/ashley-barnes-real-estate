import { ArrowRight } from "./icons";
import { IntentLink } from "./intent-link";
import { site } from "@/lib/site";

const textLink =
  "inline-block py-1 font-semibold text-ivory underline decoration-gold-light/60 underline-offset-[6px] transition-colors hover:text-gold-light hover:decoration-gold-light";

/** Opens the MLS's own IDX search in a new tab. Rendered only once the destination is verified. */
function SearchLink({ url, provider }: { url: string; provider: string }) {
  return (
    <>
      {/* Referrer kept (origin only, per the default policy) so the provider can see which site sent the visitor. */}
      <a href={url} target="_blank" rel="noopener" className="btn btn-gold-outline w-full">
        Search Available Properties <ArrowRight className="btn-arrow" />
        <span className="sr-only"> (opens the {provider} property search in a new tab)</span>
      </a>
      <p className="mt-5 text-sm leading-relaxed text-ivory/75">
        The search opens in a new tab on the official {provider} IDX property search. Listings and their
        details are provided by the MLS.
      </p>
      <p className="mt-7 border-t border-gold-light/20 pt-6 text-sm leading-relaxed text-ivory/75">
        Prefer a hand-picked shortlist?{" "}
        <IntentLink intent={{ interest: "buying" }} className={textLink}>
          Tell Ashley what you&rsquo;re looking for
        </IntentLink>
      </p>
    </>
  );
}

/** Shown while the provider has not activated the search: no link to a page that would fail. */
function SearchComingSoon() {
  return (
    <>
      <p className="label flex items-center gap-2.5 text-gold-light">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-gold-light" />
        Coming soon
      </p>
      <p className="mt-4 font-serif text-[1.625rem] font-medium leading-[1.2] text-ivory">
        Online property search is being set up.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-ivory/75">
        The MLS-powered search will be available here shortly. In the meantime, share what you&rsquo;re
        looking for and Ashley will be in touch.
      </p>
      <IntentLink intent={{ interest: "buying" }} className="btn btn-gold-outline mt-7 w-full">
        Start Your Home Search <ArrowRight className="btn-arrow" />
      </IntentLink>
    </>
  );
}

/**
 * Entry point to the MLS's own IDX property search. The search is linked rather
 * than framed: framing could not be verified because the provider had not yet
 * activated this IDX configuration (see README). No listing data is fetched or
 * displayed here, so the provider's pages carry the MLS attribution and notices.
 */
export function IdxPropertySearch() {
  const { url, provider, verified } = site.idxSearch;

  return (
    <section
      id="property-search"
      aria-labelledby="property-search-heading"
      className="relative isolate overflow-hidden bg-navy py-16 text-ivory sm:py-20 lg:py-24"
    >
      <span aria-hidden="true" className="absolute inset-y-0 left-3 -z-10 w-px bg-gold-light/25" />

      <div className="mx-auto grid w-full max-w-[86rem] gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-16 lg:px-10 xl:px-12">
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
          <p className="mt-6 max-w-[34rem] text-base leading-[1.85] text-ivory/80">
            Explore property listings available on the market, with details that come directly from the
            MLS. When a property catches your eye, Ashley can help you take the next step.
          </p>
        </div>

        <div className="border border-gold-light/30 p-6 sm:p-9 lg:p-10">
          {verified ? <SearchLink url={url} provider={provider} /> : <SearchComingSoon />}
        </div>
      </div>
    </section>
  );
}
