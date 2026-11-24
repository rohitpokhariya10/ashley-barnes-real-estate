export type ListingPhoto = {
  /** Local path under /public — never a hotlinked third-party image. */
  src: string;
  alt: string;
  /** Photographer / rights holder, shown with the photo when supplied. */
  credit?: string;
  /** Short note shown on the photo, e.g. that drawn lot lines are approximate. */
  caption?: string;
  /** CSS `object-position` that keeps the subject in frame as the card's shape changes. */
  position?: string;
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
   * Local listing photo under /public, published only with its rights holder's
   * permission. `null` shows a decorative brand panel instead.
   */
  photo: ListingPhoto | null;
  /**
   * Set to `true` only once the listing agreement confirms Ashley represents the
   * seller. Until then no "Listed by" credit is displayed.
   */
  listedByAgent: boolean;
};

/**
 * Source of truth: the Zillow listing at `listingUrl`. Not a live feed, and
 * Zillow blocks automated access, so recheck it there whenever it changes.
 * Price, address, acreage and type match the team's Zillow screenshot of
 * 2026-11-25 (price cut to $355,000 on 10/18). The MLS number was supplied
 * earlier and is not visible in that screenshot. Only attributes stated on the
 * listing are recorded. See "My Active Listing" in the README.
 */
export const activeListing = {
  id: "601-lonesome-trl-lot-44",
  street: "601 Lonesome Trl",
  unit: "Lot 44",
  city: "Driftwood",
  state: "TX",
  postalCode: "78619",
  price: 355_000,
  propertyType: "Land",
  lotSizeAcres: 5.44,
  mlsNumber: "2008671",
  listingUrl: "https://www.zillow.com/homedetails/601-Lonesome-Trl-44-Driftwood-TX-78619/464570153_zpid/",
  source: "Zillow",
  /** The listing's main aerial photo, published with the rights holder's permission (confirmed 2026-11-25). */
  photo: {
    src: "/properties/601-lonesome-trl-lot-44.jpg",
    alt: "Aerial view of 601 Lonesome Trl, Lot 44, in Driftwood, Texas: the 5.44-acre lot, outlined in white, with mature trees, a cleared meadow and existing buildings, surrounded by wooded Hill Country.",
    caption: "All property lines are rough estimates and not survey accurate.",
    position: "63% 85%",
  },
  listedByAgent: false,
} as const satisfies ActiveListing;
