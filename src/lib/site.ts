import type { ContactMethodValue, InterestValue } from "./lead";

/**
 * Single source of truth for verified business facts and destinations.
 * Anything set to `null` has NOT been supplied yet — the UI falls back to the
 * consultation form instead of inventing a value.
 */
export const site = {
  agentName: "Ashley Barnes",
  designation: "REALTOR®",
  brokerage: "JPAR Real Estate",
  /** Verified business phone in E.164 format, e.g. "+12105550123". */
  phone: null as string | null,
  /** Canonical production origin, e.g. "https://www.example.com". */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || null,
  serviceAreas: ["San Antonio", "Schertz", "Cibolo", "New Braunfels"],
  routes: {
    /** Featured homes section; may be replaced with a full property search page later. */
    propertySearch: "/#properties" as string | null,
  },
} as const;

export type LeadIntent = {
  interest?: InterestValue;
  contactMethod?: ContactMethodValue;
};

export type NavItem = {
  label: string;
  /** Real destination. When omitted, the link opens the consultation form with `intent` applied. */
  href?: string;
  intent?: LeadIntent;
};

export const FORM_ANCHOR = "consultation";

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Buy", intent: { interest: "buying" } },
  { label: "Sell", intent: { interest: "selling" } },
  { label: "Invest", intent: { interest: "investing" } },
  { label: "About Ashley", href: "/#about" },
  { label: "Contact", intent: {} },
];
