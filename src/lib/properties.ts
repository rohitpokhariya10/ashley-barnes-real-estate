export type FeaturedProperty = {
  id: string;
  address: string;
  postalCode: string;
  neighborhood: string;
  price: number;
  beds: number;
  /** Total bathrooms, including half baths, as displayed by Zillow. */
  baths: number;
  squareFeet: number;
  image: string;
  imageAlt: string;
  zillowUrl: string;
};

/**
 * Editorial selection supplied by the team, in the requested order.
 * Details and photos sourced from the linked Zillow pages on 2026-11-19.
 * This is a static snapshot, not a live listing feed. Recheck the source URLs
 * when updating prices or availability. Photo sources are in docs/properties.md.
 */
export const featuredProperties = [
  {
    id: "8726-mountain-top",
    address: "8726 Mountain Top",
    postalCode: "78255",
    neighborhood: "Scenic Oaks",
    price: 1_300_000,
    beds: 4,
    baths: 5,
    squareFeet: 4_619,
    image: "/properties/8726-mountain-top.jpg",
    imageAlt: "Timber ceilings and stonework around the indoor pool at 8726 Mountain Top",
    zillowUrl: "https://www.zillow.com/homedetails/8726-Mountain-Top-San-Antonio-TX-78255/26165251_zpid/",
  },
  {
    id: "8-kings-mnr",
    address: "8 Kings Mnr",
    postalCode: "78257",
    neighborhood: "The Dominion",
    price: 2_850_000,
    beds: 5,
    baths: 6,
    squareFeet: 5_799,
    image: "/properties/8-kings-mnr.jpg",
    imageAlt: "Aerial view of the contemporary home and landscaped grounds at 8 Kings Mnr",
    zillowUrl: "https://www.zillow.com/homedetails/8-Kings-Mnr-San-Antonio-TX-78257/69646049_zpid/",
  },
  {
    id: "10015-ivory-canyon",
    address: "10015 Ivory Canyon",
    postalCode: "78255",
    neighborhood: "The Canyons at Scenic Loop",
    price: 1_995_000,
    beds: 4,
    baths: 4,
    squareFeet: 5_230,
    image: "/properties/10015-ivory-canyon.jpg",
    imageAlt: "Light-filled living room with floor-to-ceiling Hill Country views at 10015 Ivory Canyon",
    zillowUrl: "https://www.zillow.com/homedetails/10015-Ivory-Cyn-San-Antonio-TX-78255/169467976_zpid/",
  },
  {
    id: "59-via-aragon",
    address: "59 Via Aragon",
    postalCode: "78257",
    neighborhood: "The Dominion",
    price: 3_495_000,
    beds: 5,
    baths: 8,
    squareFeet: 7_000,
    image: "/properties/59-via-aragon.jpg",
    imageAlt: "Illuminated contemporary facade of 59 Via Aragon at sunset",
    zillowUrl: "https://www.zillow.com/homedetails/59-Via-Aragon-San-Antonio-TX-78257/2058431957_zpid/",
  },
  {
    id: "5934-camino-alturas",
    address: "5934 Camino Alturas",
    postalCode: "78257",
    neighborhood: "The Dominion",
    price: 4_850_000,
    beds: 5,
    baths: 6,
    squareFeet: 6_171,
    image: "/properties/5934-camino-alturas.jpg",
    imageAlt: "Aerial view of the home, pool, and surrounding hills at 5934 Camino Alturas",
    zillowUrl: "https://www.zillow.com/homedetails/5934-Camino-Alturas-San-Antonio-TX-78257/125319551_zpid/",
  },
] as const satisfies readonly FeaturedProperty[];
