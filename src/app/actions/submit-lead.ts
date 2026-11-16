"use server";

import {
  CONTACT_METHODS,
  INTERESTS,
  PRICE_RANGES,
  labelFor,
  phoneDigits,
  validateLead,
  type LeadErrors,
  type LeadValues,
} from "@/lib/lead";

export type SubmitState =
  | { status: "idle" }
  | { status: "success"; firstName: string }
  | { status: "invalid"; errors: LeadErrors }
  | { status: "error"; code: "not_configured" | "delivery_failed"; message: string };

const text = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
};

/**
 * Validates the consultation request and forwards it to the CRM / webhook
 * configured in LEAD_WEBHOOK_URL (server-only). Success is reported to the
 * visitor only after the endpoint has accepted the lead.
 */
export async function submitLead(_prev: SubmitState, formData: FormData): Promise<SubmitState> {
  // Honeypot: real visitors never see or fill this field.
  if (text(formData, "company")) {
    return { status: "error", code: "delivery_failed", message: "Your request could not be sent. Please try again." };
  }

  const values = {
    fullName: text(formData, "fullName"),
    phone: text(formData, "phone"),
    email: text(formData, "email"),
    interest: text(formData, "interest"),
    priceRange: text(formData, "priceRange"),
    contactMethod: text(formData, "contactMethod"),
  } as LeadValues;

  const errors = validateLead(values);
  if (Object.keys(errors).length > 0) return { status: "invalid", errors };

  const endpoint = process.env.LEAD_WEBHOOK_URL;
  if (!endpoint) {
    console.error("[lead] LEAD_WEBHOOK_URL is not set — the consultation request was NOT delivered.");
    return {
      status: "error",
      code: "not_configured",
      message:
        process.env.NODE_ENV === "production"
          ? "Online requests are temporarily unavailable, so your message was not sent. Please try again later."
          : "Not sent: no lead endpoint is configured. Set LEAD_WEBHOOK_URL in .env.local (see .env.example).",
    };
  }

  const payload = {
    source: "website-hero-consultation",
    submittedAt: new Date().toISOString(),
    fullName: values.fullName,
    phone: values.phone ? `+1${phoneDigits(values.phone)}` : null,
    email: values.email || null,
    interest: labelFor(INTERESTS, values.interest),
    priceRange: labelFor(PRICE_RANGES, values.priceRange),
    // Honour this downstream: only call/text/email using the method the visitor chose.
    preferredContactMethod: labelFor(CONTACT_METHODS, values.contactMethod),
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.LEAD_WEBHOOK_SECRET
          ? { Authorization: `Bearer ${process.env.LEAD_WEBHOOK_SECRET}` }
          : {}),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`Lead endpoint responded with ${response.status}`);
  } catch (error) {
    console.error("[lead] delivery failed:", error);
    return {
      status: "error",
      code: "delivery_failed",
      message: "Something went wrong and your request was not sent. Please try again in a moment.",
    };
  }

  return { status: "success", firstName: values.fullName.split(/\s+/)[0] };
}
