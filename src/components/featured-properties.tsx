import Image from "next/image";
import { Bath, Bed, SquareFeet } from "./icons";
import { IntentLink } from "./intent-link";
import { featuredProperties, type FeaturedProperty } from "@/lib/properties";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const numberFormatter = new Intl.NumberFormat("en-US");

function PropertyCard({ property }: { property: FeaturedProperty }) {
  return (
    <article
      aria-labelledby={`${property.id}-heading`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-gold/20 bg-ivory-soft transition-[box-shadow,border-color] duration-500 hover:border-gold/45 hover:shadow-[0_16px_40px_-20px_rgb(20_43_70/0.25)] focus-within:border-gold/60"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ivory-deep">
        <Image
          src={property.image}
          alt={property.imageAlt}
          fill
          sizes="(min-width: 1376px) 410px, (min-width: 1024px) calc((100vw - 144px) / 3), (min-width: 640px) calc((100vw - 88px) / 2), calc(100vw - 40px)"
          className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.035]"
        />
        <span className="absolute left-4 top-4 max-w-[calc(100%-2rem)] rounded-full border border-white/50 bg-ivory-soft/95 px-4 py-2 text-sm font-semibold leading-snug text-navy shadow-sm backdrop-blur-sm">
          {property.neighborhood}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-2 pt-6 sm:px-6">
        <h3
          id={`${property.id}-heading`}
          className="font-serif text-[1.875rem] font-semibold leading-[1.15] tracking-[-0.02em] text-navy"
        >
          {property.address}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-navy/70">
          San Antonio, TX {property.postalCode}
        </p>
        <p className="mt-5 text-[1.5rem] font-semibold leading-tight tracking-[-0.04em] text-gold-deep">
          {priceFormatter.format(property.price)}
        </p>

        <dl className="mt-5 flex flex-wrap items-center justify-between gap-x-3 gap-y-3 border-y border-gold/25 py-4 text-sm leading-normal text-navy/85">
          <div className="flex items-center gap-2">
            <dt><Bed className="size-[1.125rem] shrink-0 text-gold-deep" /><span className="sr-only">Bedrooms</span></dt>
            <dd>{property.beds} <span aria-hidden="true">Beds</span></dd>
          </div>
          <div className="flex items-center gap-2">
            <dt><Bath className="size-[1.125rem] shrink-0 text-gold-deep" /><span className="sr-only">Bathrooms, including half baths</span></dt>
            <dd>{property.baths} <span aria-hidden="true">Baths</span></dd>
          </div>
          <div className="flex items-center gap-2">
            <dt><SquareFeet className="size-[1.125rem] shrink-0 text-gold-deep" /><span className="sr-only">Interior area in square feet</span></dt>
            <dd>{numberFormatter.format(property.squareFeet)} <span aria-hidden="true">sq ft</span></dd>
          </div>
        </dl>

        <a
          href={property.zillowUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex min-h-16 items-center justify-between gap-3 rounded-sm py-4 text-sm font-semibold text-navy underline decoration-gold/45 underline-offset-[5px] transition-colors hover:text-gold-deep hover:decoration-gold focus-visible:text-gold-deep"
        >
          View on Zillow
          <span className="text-xs font-normal text-navy/60" aria-hidden="true">Full listing</span>
          <span className="sr-only">: {property.address} (opens in a new tab)</span>
        </a>
      </div>
    </article>
  );
}

export function FeaturedProperties() {
  return (
    <section
      id="properties"
      aria-labelledby="properties-heading"
      className="border-y border-gold/20 bg-ivory-deep/35 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[86rem] px-5 sm:px-8 lg:px-10 xl:px-12">
        <header className="mb-10 grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-12 lg:mb-12">
          <div>
            <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.16em] text-gold-deep">
              <span aria-hidden="true" className="h-px w-10 bg-gold" />
              Featured properties
            </p>
            <h2
              id="properties-heading"
              className="mt-4 max-w-[36rem] font-serif text-[clamp(2.5rem,4.5vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.02em] text-navy"
            >
              Exceptional homes.<br />
              <em className="font-medium text-gold-deep">Extraordinary possibilities.</em>
            </h2>
          </div>
          <p className="max-w-[27rem] text-base leading-[1.85] text-navy/75 md:justify-self-end md:pb-1">
            Discover a selection of distinctive homes in San Antonio, from Hill Country retreats
            to contemporary estates. Find a place that feels like your next chapter.
          </p>
        </header>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6 lg:gap-8">
          {featuredProperties.map((property, index) => (
            <li
              key={property.id}
              className={`min-w-0 lg:col-span-2 ${index === 3 ? "lg:col-start-2" : ""}`}
            >
              <PropertyCard property={property} />
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-gold/25 pt-7 sm:flex-row sm:items-center lg:mt-12">
          <p className="max-w-[38rem] text-sm leading-relaxed text-navy/65">
            Property details from Zillow. Prices and availability may change;
            visit the full listing for the latest information.
          </p>
          <IntentLink
            intent={{ interest: "buying" }}
            className="shrink-0 py-3 text-sm font-semibold text-navy underline decoration-gold/60 underline-offset-[6px] transition-colors hover:text-gold-deep"
          >
            Find your home with Ashley
          </IntentLink>
        </div>
      </div>
    </section>
  );
}
