export type ListingPhoto = {
  /** Local path under /public — never a hotlinked third-party image. */
  src: string;
  alt: string;
  /** Photographer / rights holder, shown with the photo when supplied. */
  credit?: string;
};

export type ActiveListing = {
  id: string;
  street: string;
  /** Lot or unit designation that is part of the address, e.g. "Lot 44". */
  unit: string | null;
  city: string;
  state: string;
  postalCode: string;
  /** List price in USD. */
  price: number;
  /** Classification on the source listing. Drives which attributes are shown. */
  propertyType: "Land";
  lotSizeAcres: number;
  mlsNumber: string;
  listingUrl: string;
  /** Site the listing link and figures come from. */
  source: string;
  /**
   * A photo the business has written permission to publish. Leave `null` until
   * one is supplied; the section then shows a decorative brand panel instead.
   */
  photo: ListingPhoto | null;
  /**
   * Set to `true` only once the listing agreement confirms Ashley represents the
   * seller. Until then no "Listed by" credit is displayed.
   */
  listedByAgent: boolean;
};

/**
 * Values supplied by the team as observed on the Zillow listing. Not a live
 * feed. Zillow blocks automated access, so they could not be re-checked
 * independently: confirm them on `listingUrl` before publishing and whenever
 * the price changes. Only attributes stated on the listing are recorded here.
 * The README lists what is still awaiting confirmation.
 */
export const activeListing = {
  id: "601-lonesome-trl-lot-44",
  street: "601 Lonesome Trl",
  unit: "Lot 44",
  city: "Driftwood",
  state: "TX",
  postalCode: "78619",
  price: 380_000,
  propertyType: "Land",
  lotSizeAcres: 5.44,
  mlsNumber: "2008671",
  listingUrl: "https://www.zillow.com/homedetails/601-Lonesome-Trl-44-Driftwood-TX-78619/464570153_zpid/",
  source: "Zillow",
  photo: null,
  listedByAgent: false,
} as const satisfies ActiveListing;
