import Image from "next/image";
import type { SVGProps } from "react";
import { ArrowRight } from "./icons";
import { activeListing, type ActiveListing } from "@/lib/active-listing";
import { site } from "@/lib/site";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const acresFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

/** One irregular loop centred on the origin; scaled copies form the contour map. */
const CONTOUR = "M0-100C60-104 112-58 104-2C97 50 52 92-4 96C-58 100-106 58-102 4C-99-52-60-96 0-100Z";

/** Decorative topographic linework in the brand gold. Not a survey or plat of the property. */
function Contours(props: SVGProps<SVGSVGElement>) {
  const ring = (transform: string) => (
    <path key={transform} d={CONTOUR} transform={transform} vectorEffect="non-scaling-stroke" />
  );
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {[0.3, 0.55, 0.85, 1.2, 1.6, 2.05, 2.55, 3.1, 3.7].map((s, i) =>
        ring(`translate(565 205) rotate(${i * 9}) scale(${s} ${s * 0.82})`),
      )}
      {[0.35, 0.7, 1.05, 1.45].map((s, i) =>
        ring(`translate(120 540) rotate(${i * 11 - 20}) scale(${s * 1.1} ${s * 0.8})`),
      )}
    </svg>
  );
}

const visualFrame =
  "relative isolate aspect-[4/3] overflow-hidden bg-navy md:aspect-[16/9] lg:aspect-auto lg:min-h-[34rem]";

function ListingVisual({ listing, acres }: { listing: ActiveListing; acres: string }) {
  const { photo } = listing;

  if (photo) {
    return (
      <figure className={visualFrame}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(min-width: 1376px) 700px, (min-width: 1024px) 52vw, calc(100vw - 52px)"
          className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.03]"
        />
        {photo.credit && (
          <figcaption className="absolute bottom-3 right-3 max-w-[calc(100%-1.5rem)] bg-navy/75 px-2.5 py-1 text-xs text-ivory/90">
            Photo: {photo.credit}
          </figcaption>
        )}
      </figure>
    );
  }

  // No photo with confirmed publishing rights yet: a brand panel instead of a borrowed image.
  // Its text repeats facts listed beside it, so it is hidden from assistive technology.
  return (
    <div aria-hidden="true" className={`${visualFrame} text-ivory`}>
      <Contours className="absolute inset-0 -z-10 size-full text-gold-light/30 transition-transform duration-[1600ms] ease-luxe group-hover:scale-[1.04]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-navy via-navy/70 to-transparent" />
      <span className="absolute inset-y-0 left-3 w-px bg-gold-light/30" />
      <div className="absolute inset-0 flex flex-col justify-between p-7 sm:p-10 lg:p-12">
        <p className="label text-gold-light">
          {listing.city}, {listing.state}
        </p>
        <div>
          <p className="font-serif text-[clamp(4.5rem,14vw,8.5rem)] font-medium leading-[0.85] tracking-[-0.03em] md:text-[clamp(5rem,11vw,8.5rem)] lg:text-[clamp(5.5rem,8vw,8.5rem)]">
            {acres}
          </p>
          <p className="label mt-4 text-gold-light">
            Acres <span className="mx-1.5 text-ivory/40">|</span> {listing.propertyType}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Showcase for a single listing. Only attributes that apply to the listing's
 * property type are shown — land has no bedrooms, bathrooms or floor area.
 */
export function ActiveListingSection({ listing = activeListing }: { listing?: ActiveListing }) {
  const headingId = `${listing.id}-heading`;
  const address = listing.unit ? `${listing.street}, ${listing.unit}` : listing.street;
  const acres = acresFormatter.format(listing.lotSizeAcres);

  const facts = [
    { label: "Property type", value: listing.propertyType },
    { label: "Lot size", value: `${acres} acres` },
    { label: "MLS #", value: listing.mlsNumber },
  ];

  return (
    <section id="active-listing" aria-labelledby="active-listing-heading" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[86rem] px-5 sm:px-8 lg:px-10 xl:px-12">
        <header className="mb-10 grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-12 lg:mb-12">
          <div>
            <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.16em] text-gold-deep">
              <span aria-hidden="true" className="h-px w-10 bg-gold" />
              {listing.propertyType} <span aria-hidden="true">·</span> {listing.city}, {listing.state}
            </p>
            <h2
              id="active-listing-heading"
              className="mt-4 font-serif text-[clamp(2.5rem,4.5vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.02em] text-navy"
            >
              My Active Listing
            </h2>
          </div>
          <p className="max-w-[27rem] text-base leading-[1.85] text-navy/75 md:justify-self-end md:pb-1">
            {acres} acres of land in {listing.city}, {listing.state}. View the full listing for complete
            property details and current availability.
          </p>
        </header>

        {/* Offset gold frame, as on Ashley's portrait card */}
        <div className="relative pb-3 pl-3">
          <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 right-3 top-3 border border-gold/55" />
          <article
            aria-labelledby={headingId}
            className="group relative grid overflow-hidden bg-ivory-soft shadow-card lg:grid-cols-[minmax(0,7fr)_minmax(0,6fr)]"
          >
            <ListingVisual listing={listing} acres={acres} />

            <div className="flex flex-col px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12 xl:px-14">
              <h3
                id={headingId}
                className="font-serif text-[clamp(2rem,3.2vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-navy"
              >
                {address}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-navy/70">
                {listing.city}, {listing.state} {listing.postalCode}
              </p>

              <p className="mt-7">
                <span className="label block text-navy/70">List price</span>
                <span className="mt-1.5 block text-[2rem] font-semibold leading-tight tracking-[-0.04em] text-gold-deep">
                  {priceFormatter.format(listing.price)}
                </span>
              </p>

              <dl className="mt-7 border-t border-gold/25">
                {facts.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-gold/25 py-3.5"
                  >
                    <dt className="label text-navy/70">{label}</dt>
                    <dd className="font-serif text-[1.375rem] font-semibold leading-tight text-navy">{value}</dd>
                  </div>
                ))}
              </dl>

              {listing.listedByAgent && (
                <p className="mt-5 text-sm font-medium text-navy/80">
                  Listed by {site.agentName}, {site.designation} <span aria-hidden="true">·</span> {site.brokerage}
                </p>
              )}

              <div className="mt-9 lg:mt-auto lg:pt-10">
                <a
                  href={listing.listingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-navy w-full sm:w-auto"
                >
                  View Full Listing <ArrowRight className="btn-arrow text-gold-light" />
                  <span className="sr-only">
                    : {address} on {listing.source} (opens in a new tab)
                  </span>
                </a>
                <p className="mt-5 text-sm leading-relaxed text-navy/70">
                  Property details from {listing.source}. Price and availability may change; visit the full
                  listing for the latest information.
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
