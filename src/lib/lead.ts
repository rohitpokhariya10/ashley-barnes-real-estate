export const INTERESTS = [
  { value: "buying", label: "Buying a Home" },
  { value: "selling", label: "Selling a Home" },
  { value: "investing", label: "Real Estate Investment" },
  { value: "exploring", label: "Exploring My Options" },
] as const;

export const PRICE_RANGES = [
  { value: "under-250k", label: "Under $250,000" },
  { value: "250k-400k", label: "$250,000 – $400,000" },
  { value: "400k-600k", label: "$400,000 – $600,000" },
  { value: "600k-800k", label: "$600,000 – $800,000" },
  { value: "800k-plus", label: "$800,000+" },
] as const;

export const CONTACT_METHODS = [
  { value: "phone", label: "Phone Call" },
  { value: "text", label: "Text Message" },
  { value: "email", label: "Email" },
] as const;

export type InterestValue = (typeof INTERESTS)[number]["value"];
export type PriceRangeValue = (typeof PRICE_RANGES)[number]["value"];
export type ContactMethodValue = (typeof CONTACT_METHODS)[number]["value"];

export type LeadValues = {
  fullName: string;
  phone: string;
  email: string;
  interest: InterestValue | "";
  priceRange: PriceRangeValue | "";
  contactMethod: ContactMethodValue | "";
};

export type LeadField = keyof LeadValues;
export type LeadErrors = Partial<Record<LeadField, string>>;

export const EMPTY_LEAD: LeadValues = {
  fullName: "",
  phone: "",
  email: "",
  interest: "",
  priceRange: "",
  contactMethod: "",
};

/** Order used to move focus to the first invalid field. */
export const FIELD_ORDER: LeadField[] = [
  "fullName",
  "phone",
  "email",
  "interest",
  "priceRange",
  "contactMethod",
];

/** National 10-digit number, dropping a leading US country code. */
export function phoneDigits(input: string): string {
  const digits = input.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
}

/** Progressive "(210) 555-0123" formatting while typing. */
export function formatUSPhone(input: string): string {
  const d = phoneDigits(input).slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/** NANP: 10 digits, area code and exchange cannot start with 0 or 1. */
export function isValidUSPhone(input: string): boolean {
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(phoneDigits(input));
}

export function isValidEmail(input: string): boolean {
  return input.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input);
}

const isOneOf = <T extends string>(
  options: readonly { value: T }[],
  value: string,
): value is T => options.some((o) => o.value === value);

/** Shared by the browser (instant feedback) and the server action (source of truth). */
export function validateLead(v: LeadValues): LeadErrors {
  const errors: LeadErrors = {};
  const name = v.fullName.trim();
  const phone = v.phone.trim();
  const email = v.email.trim();

  if (name.length < 2) errors.fullName = "Please enter your full name.";
  else if (name.length > 120) errors.fullName = "Please shorten your name to 120 characters or fewer.";

  if (phone && !isValidUSPhone(phone)) {
    errors.phone = "Enter a valid 10-digit US phone number.";
  }
  if (email && !isValidEmail(email)) {
    errors.email = "Enter a valid email address, like name@example.com.";
  }

  if (!phone && !email) {
    const message = "Add a phone number or an email address so Ashley can reach you.";
    errors.phone = message;
    errors.email = message;
  } else if (v.contactMethod === "email" && !email) {
    errors.email = "Add an email address so Ashley can reply by email.";
  } else if (v.contactMethod === "phone" && !phone) {
    errors.phone = "Add a phone number so Ashley can call you.";
  } else if (v.contactMethod === "text" && !phone) {
    errors.phone = "Add a mobile number so Ashley can text you.";
  }

  if (v.interest && !isOneOf(INTERESTS, v.interest)) errors.interest = "Choose one of the listed options.";
  if (v.priceRange && !isOneOf(PRICE_RANGES, v.priceRange)) errors.priceRange = "Choose one of the listed price ranges.";
  if (v.contactMethod && !isOneOf(CONTACT_METHODS, v.contactMethod)) {
    errors.contactMethod = "Choose how you would like to connect.";
  }

  return errors;
}

export const labelFor = <T extends string>(
  options: readonly { value: T; label: string }[],
  value: T | "",
): string | null => options.find((o) => o.value === value)?.label ?? null;
