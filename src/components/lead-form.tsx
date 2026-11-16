"use client";

import { useActionState, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { submitLead, type SubmitState } from "@/app/actions/submit-lead";
import { INTENT_EVENT } from "./intent-link";
import { ArrowRight, Check } from "./icons";
import {
  CONTACT_METHODS,
  EMPTY_LEAD,
  FIELD_ORDER,
  INTERESTS,
  PRICE_RANGES,
  formatUSPhone,
  validateLead,
  type LeadErrors,
  type LeadField,
  type LeadValues,
} from "@/lib/lead";
import { FORM_ANCHOR, type LeadIntent } from "@/lib/site";

const INITIAL_STATE: SubmitState = { status: "idle" };
const fieldId = (field: LeadField) => `lead-${field}`;
const errorId = (field: LeadField) => `lead-${field}-error`;

function Field({
  field,
  label,
  error,
  children,
  className = "",
}: {
  field: LeadField;
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={fieldId(field)} className="label mb-2 block text-navy">
        {label}
      </label>
      {children}
      <FieldError field={field} error={error} />
    </div>
  );
}

function FieldError({ field, error }: { field: LeadField; error?: string }) {
  return (
    <p
      id={errorId(field)}
      className={`grid text-[0.8125rem] font-medium leading-snug text-error transition-[grid-template-rows,opacity,margin] duration-300 ease-luxe ${
        error ? "mt-1.5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <span className="overflow-hidden">{error}</span>
    </p>
  );
}

export function LeadForm() {
  const [state, formAction, pending] = useActionState(submitLead, INITIAL_STATE);
  const [values, setValues] = useState<LeadValues>(EMPTY_LEAD);
  const [touched, setTouched] = useState<ReadonlySet<LeadField>>(new Set());
  const [attempted, setAttempted] = useState(false);
  const [editedSinceSubmit, setEditedSinceSubmit] = useState<ReadonlySet<LeadField>>(new Set());
  const successRef = useRef<HTMLHeadingElement>(null);
  const succeeded = state.status === "success";

  // Errors are derived, never stored: client rules first, then anything the server rejected.
  const clientErrors = validateLead(values);
  const serverErrors: LeadErrors = state.status === "invalid" ? state.errors : {};
  const errorFor = (field: LeadField): string | undefined => {
    const showClient = attempted || (touched.has(field) && values[field] !== "");
    if (showClient && clientErrors[field]) return clientErrors[field];
    if (!editedSinceSubmit.has(field)) return serverErrors[field];
    return undefined;
  };

  const set = <K extends LeadField>(field: K, value: LeadValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setEditedSinceSubmit((current) => new Set(current).add(field));
  };
  const touch = (field: LeadField) => setTouched((current) => new Set(current).add(field));

  // Nav links / CTAs elsewhere on the page can pre-fill intent and hand focus to the form.
  useEffect(() => {
    const onIntent = (event: Event) => {
      const intent = (event as CustomEvent<LeadIntent>).detail ?? {};
      setValues((current) => ({
        ...current,
        interest: intent.interest ?? current.interest,
        contactMethod: intent.contactMethod ?? current.contactMethod,
      }));
      window.setTimeout(() => {
        const target = document.getElementById(fieldId("fullName")) ?? successRef.current;
        target?.focus({ preventScroll: true });
      }, 0);
    };
    window.addEventListener(INTENT_EVENT, onIntent);
    return () => window.removeEventListener(INTENT_EVENT, onIntent);
  }, []);

  useEffect(() => {
    if (succeeded) successRef.current?.focus();
  }, [succeeded]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (pending) {
      event.preventDefault(); // guard against duplicate submissions
      return;
    }
    setAttempted(true);
    const firstInvalid = FIELD_ORDER.find((field) => clientErrors[field]);
    if (firstInvalid) {
      event.preventDefault();
      const id = firstInvalid === "contactMethod" ? `${fieldId(firstInvalid)}-${CONTACT_METHODS[0].value}` : fieldId(firstInvalid);
      document.getElementById(id)?.focus();
      return;
    }
    setEditedSinceSubmit(new Set());
  };

  const describe = (field: LeadField) => (errorFor(field) ? errorId(field) : undefined);

  return (
    <section
      id={FORM_ANCHOR}
      aria-labelledby="consultation-heading"
      className="@container relative bg-white shadow-card ring-1 ring-navy/[0.07]"
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-gold" />
      <div className="px-6 pb-8 pt-9 sm:px-9 sm:pb-9 sm:pt-11">
        <p className="label text-gold-deep">Let&rsquo;s Start a Conversation</p>
        <h2
          id="consultation-heading"
          className="mt-3 font-serif text-[2rem] font-medium leading-[1.08] tracking-[-0.005em] text-navy sm:text-[2.25rem]"
        >
          What Are Your Real Estate Goals?
        </h2>

        {succeeded ? (
          <div role="status" className="reveal mt-8 border-t border-navy/10 pt-8">
            <span className="flex size-12 items-center justify-center rounded-full border border-gold text-gold">
              <Check width={20} height={20} />
            </span>
            <h3
              ref={successRef}
              tabIndex={-1}
              className="mt-5 font-serif text-[1.75rem] font-medium leading-tight text-navy outline-none"
            >
              Thank you, {state.firstName}.
            </h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-navy/80">
              Your request has been sent. I&rsquo;ll personally connect with you to discuss your needs and help you
              determine the best next steps.
            </p>
          </div>
        ) : (
          <>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-navy/80">
              Share a few details below, and I&rsquo;ll personally connect with you to discuss your needs and help you
              determine the best next steps.
            </p>

            <form action={formAction} onSubmit={onSubmit} noValidate className="mt-7 grid gap-x-5 gap-y-5 @xl:grid-cols-2">
              <Field field="fullName" label="Full Name" error={errorFor("fullName")} className="@xl:col-span-2">
                <input
                  id={fieldId("fullName")}
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  autoCapitalize="words"
                  placeholder="Enter your full name"
                  required
                  maxLength={120}
                  value={values.fullName}
                  onChange={(event) => set("fullName", event.target.value)}
                  onBlur={() => touch("fullName")}
                  aria-invalid={Boolean(errorFor("fullName"))}
                  aria-describedby={describe("fullName")}
                  className="field-control"
                />
              </Field>

              <Field field="phone" label="Phone Number" error={errorFor("phone")}>
                <input
                  id={fieldId("phone")}
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder="Your best contact number"
                  maxLength={16}
                  value={values.phone}
                  onChange={(event) => set("phone", formatUSPhone(event.target.value))}
                  onBlur={() => touch("phone")}
                  aria-invalid={Boolean(errorFor("phone"))}
                  aria-describedby={describe("phone")}
                  className="field-control"
                />
              </Field>

              <Field field="email" label="Email Address" error={errorFor("email")}>
                <input
                  id={fieldId("email")}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="Your email address"
                  maxLength={254}
                  value={values.email}
                  onChange={(event) => set("email", event.target.value)}
                  onBlur={() => touch("email")}
                  aria-invalid={Boolean(errorFor("email"))}
                  aria-describedby={describe("email")}
                  className="field-control"
                />
              </Field>

              <Field field="interest" label="I'm Interested In" error={errorFor("interest")}>
                <select
                  id={fieldId("interest")}
                  name="interest"
                  value={values.interest}
                  data-empty={values.interest === ""}
                  onChange={(event) => set("interest", event.target.value as LeadValues["interest"])}
                  aria-invalid={Boolean(errorFor("interest"))}
                  aria-describedby={describe("interest")}
                  className="field-control"
                >
                  <option value="">Select an option</option>
                  {INTERESTS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field field="priceRange" label="Preferred Price Range" error={errorFor("priceRange")}>
                <select
                  id={fieldId("priceRange")}
                  name="priceRange"
                  value={values.priceRange}
                  data-empty={values.priceRange === ""}
                  onChange={(event) => set("priceRange", event.target.value as LeadValues["priceRange"])}
                  aria-invalid={Boolean(errorFor("priceRange"))}
                  aria-describedby={describe("priceRange")}
                  className="field-control"
                >
                  <option value="">Select a range</option>
                  {PRICE_RANGES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>

              <fieldset className="min-w-0 @xl:col-span-2" aria-describedby={describe("contactMethod")}>
                <legend className="label mb-2 block text-navy">How Would You Like to Connect?</legend>
                <div className="grid grid-cols-3">
                  {CONTACT_METHODS.map((option) => (
                    <label key={option.value} className="relative -ml-px first:ml-0">
                      <input
                        id={`${fieldId("contactMethod")}-${option.value}`}
                        type="radio"
                        name="contactMethod"
                        value={option.value}
                        checked={values.contactMethod === option.value}
                        onChange={() => set("contactMethod", option.value)}
                        className="peer sr-only"
                      />
                      <span className="flex h-12 cursor-pointer items-center justify-center border border-navy/18 bg-ivory-soft px-1 text-center text-[0.8125rem] font-semibold leading-tight text-navy/85 transition-colors duration-300 ease-luxe hover:border-navy/40 peer-checked:relative peer-checked:z-10 peer-checked:border-navy peer-checked:bg-navy peer-checked:text-ivory peer-focus-visible:z-20 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
                <FieldError field="contactMethod" error={errorFor("contactMethod")} />
              </fieldset>

              {/* Honeypot — hidden from people and assistive technology */}
              <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                <label>
                  Company
                  <input type="text" name="company" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <div className="@xl:col-span-2">
                {state.status === "error" && (
                  <p
                    role="alert"
                    className="reveal mb-4 border-l-2 border-error bg-error/[0.06] px-4 py-3 text-[0.875rem] font-medium leading-snug text-error"
                  >
                    {state.message}
                  </p>
                )}
                <button type="submit" disabled={pending} aria-disabled={pending} className="btn btn-navy mt-1 w-full">
                  {pending ? (
                    <>
                      <span
                        aria-hidden
                        className="size-4 animate-[spin_0.8s_linear_infinite] rounded-full border border-ivory/40 border-t-ivory"
                      />
                      Sending&hellip;
                    </>
                  ) : (
                    <>
                      Let&rsquo;s Talk About Your Goals <ArrowRight className="btn-arrow text-gold-light" />
                    </>
                  )}
                </button>
                <p className="mt-4 text-center text-[0.8125rem] leading-relaxed text-navy/70">
                  Your information is kept private and will only be used to respond to your real estate inquiry.
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
